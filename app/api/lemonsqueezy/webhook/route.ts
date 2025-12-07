import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { whatwgWebhooksHandler } from "lemonsqueezy-webhooks";

export async function POST(req: Request) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

    if (!secret) {
      console.error("❌ Missing LEMONSQUEEZY_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    // 使用官方库验证和处理 Webhook
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (whatwgWebhooksHandler as any)({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async onData(payload: any) {
        console.log("✅ Received webhook:", payload.meta.event_name);

        const eventName = payload.meta.event_name;
        // 使用类型断言和可选链，因为不同事件类型的 payload 结构可能不同
        const email =
          (payload.data.attributes as { user_email?: string }).user_email ||
          (payload.data.attributes as { customer_email?: string })
            .customer_email ||
          "";
        const subscriptionId = payload.data.id;
        const status = (payload.data.attributes as { status?: string }).status;
        const variantId = (
          payload.data.attributes as { variant_id?: string | number }
        ).variant_id;
        const renewsAt = (payload.data.attributes as { renews_at?: string })
          .renews_at;

        // 构建增强的订阅数据
        const subscriptionData = {
          subscriptionId,
          status: eventName === "order_created" ? "active" : status,
          email,
          updatedAt: new Date().toISOString(),
          variantId,
          plan: getPlanFromVariant(variantId),
          renewsAt,
          type: eventName === "order_created" ? "one_time" : "subscription",
        };

        // 根据事件类型更新订阅状态
        switch (eventName) {
          case "subscription_created":
          case "subscription_updated":
          case "subscription_resumed":
            // 激活订阅
            await kv.set(`subscription:${email}`, subscriptionData);
            console.log(`✅ Subscription activated: ${eventName} for ${email}`);
            break;

          case "subscription_cancelled":
          case "subscription_expired":
            // 取消订阅
            subscriptionData.status = "cancelled";
            await kv.set(`subscription:${email}`, subscriptionData);
            console.log(`⚠️ Subscription cancelled: ${eventName} for ${email}`);
            break;

          case "subscription_payment_failed":
            // 支付失败
            subscriptionData.status = "past_due";
            await kv.set(`subscription:${email}`, subscriptionData);
            console.log(`⚠️ Payment failed for ${email}`);
            break;

          case "order_created":
            // 处理一次性购买
            const orderId = payload.data.id;
            const customerEmail =
              (payload.data.attributes as { user_email?: string }).user_email ||
              (payload.data.attributes as { customer_email?: string })
                .customer_email ||
              "";
            const orderData = {
              subscriptionId: orderId,
              status: "active",
              email: customerEmail,
              updatedAt: new Date().toISOString(),
              variantId: (
                payload.data.attributes as { variant_id?: string | number }
              ).variant_id,
              plan: getPlanFromVariant(
                (payload.data.attributes as { variant_id?: string | number })
                  .variant_id || "",
              ),
              type: "one_time",
            };
            await kv.set(`subscription:${customerEmail}`, orderData);
            console.log(`✅ One-time purchase activated for ${customerEmail}`);
            break;
        }

        console.log(`✅ Webhook processed: ${eventName} for ${email}`);
      },
      secret,
    });
    return await handler(req);
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

// 根据 variant ID 获取计划类型
function getPlanFromVariant(variantId: string | number): string {
  const variants = {
    "1122129": "monthly",
    "1122135": "yearly",
    "1122138": "oneTime",
  };

  return variants[variantId as keyof typeof variants] || "unknown";
}
