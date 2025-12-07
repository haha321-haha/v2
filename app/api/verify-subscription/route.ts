import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // 从 KV 获取订阅状态
    const subscription = (await kv.get(`subscription:${email}`)) as {
      status?: string;
      subscriptionId?: string;
      type?: string;
    } | null;

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        status: "none",
      });
    }

    return NextResponse.json({
      hasSubscription: subscription.status === "active",
      status: subscription.status || "none",
      subscriptionId: subscription.subscriptionId,
      type: subscription.type || "subscription",
    });
  } catch (error) {
    console.error("❌ Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
