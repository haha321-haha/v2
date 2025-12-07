import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics/posthog";

const API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;

export async function POST(req: NextRequest) {
  try {
    const { variantId, plan, painPoint, assessmentScore, email } =
      await req.json();

    // 动态获取 origin，适应任何部署环境
    const origin =
      req.headers.get("origin") ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}` ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3001";

    // ✅ 验证环境变量
    if (!API_KEY || !STORE_ID) {
      console.error("❌ 缺少 Lemon Squeezy 配置:", {
        hasApiKey: !!API_KEY,
        hasStoreId: !!STORE_ID,
        apiKeyPrefix: API_KEY?.substring(0, 10) + "...",
      });
      throw new Error(
        "Missing Lemon Squeezy configuration. Please check your environment variables.",
      );
    }

    // ✅ Lemon Squeezy API Key 是 JWT token 格式（以 'eyJ' 开头）
    // 验证 API Key 基本格式
    if (!API_KEY || API_KEY.length < 50) {
      throw new Error(
        "Invalid API Key: API Key is too short or empty. Please check your LEMONSQUEEZY_API_KEY in .env.local",
      );
    }

    // 记录 API Key 格式（用于调试，不暴露完整密钥）
    console.log("✅ API Key 格式验证通过:", {
      length: API_KEY.length,
      startsWith: API_KEY.substring(0, 10) + "...",
      format: API_KEY.startsWith("eyJ") ? "JWT" : "Unknown",
    });

    // 如果传递了 plan 而不是 variantId，根据 plan 获取 variantId
    let finalVariantId = variantId;
    if (!finalVariantId && plan) {
      const variants = {
        monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY,
        yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY,
        oneTime: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ONETIME,
      };
      finalVariantId =
        variants[plan as keyof typeof variants] || variants.monthly;
    }

    if (!finalVariantId) {
      throw new Error("Missing variant ID or plan");
    }

    // Lemon Squeezy API调用创建checkout
    const response = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            custom_price: null,
            product_options: {
              redirect_url: `${origin}/success?checkout_id={CHECKOUT_ID}${
                email ? "&user_email=" + encodeURIComponent(email) : ""
              }`,
              receipt_button_text: "Go to Dashboard",
              receipt_thank_you_note: "Thank you for your PeriodHub purchase!",
              receipt_link_url: `${origin}/dashboard`,
            },
            checkout_data: {
              // 如果提供了邮箱，预填充到结账页面
              ...(email && { email }),
              // Lemon Squeezy 要求如果包含这些字段，必须是有效值，不能为 null
              custom: {
                painPoint: painPoint || "unknown",
                assessmentScore: assessmentScore?.toString() || "0",
                source: "periodhub_web",
              },
            },
            preview: false,
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: finalVariantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      let errorData: { error?: string; message?: string } = {};
      const contentType = response.headers.get("content-type");

      // JSON:API 规范使用 application/vnd.api+json，这也是有效的 JSON
      if (
        contentType?.includes("application/json") ||
        contentType?.includes("application/vnd.api+json")
      ) {
        errorData = await response.json();
      } else {
        const textData = await response.text();
        // 如果返回的是 HTML，提取有用的错误信息
        if (textData.includes("<!DOCTYPE")) {
          errorData = {
            error: `Lemon Squeezy API returned HTML instead of JSON. Status: ${response.status}`,
          };
        } else {
          errorData = { error: textData };
        }
      }

      // ✅ 401 错误特殊处理
      if (response.status === 401) {
        // Lemon Squeezy API 错误响应可能包含 errors 数组或 error 字符串
        const errorMessage =
          errorData &&
          typeof errorData === "object" &&
          "errors" in errorData &&
          Array.isArray(errorData.errors) &&
          errorData.errors[0] &&
          typeof errorData.errors[0] === "object" &&
          "detail" in errorData.errors[0]
            ? String(errorData.errors[0].detail)
            : errorData?.error || "Unauthenticated";

        console.error("❌ Lemon Squeezy 401 未认证错误:", {
          status: response.status,
          error: errorMessage,
          apiKeyPrefix: API_KEY?.substring(0, 10) + "...",
          apiKeyLength: API_KEY?.length,
          hasApiKey: !!API_KEY,
        });

        let detailedError = `Lemon Squeezy API authentication failed (401): ${errorMessage}`;
        detailedError += "\n\n可能的原因：";
        detailedError += "\n- API Key 已过期（请检查过期时间）";
        detailedError += "\n- API Key 被删除或撤销";
        detailedError += "\n- API Key 权限不足";
        detailedError += "\n- API Key 配置错误";
        detailedError += "\n\n📝 解决方法：";
        detailedError += "\n1. 访问 https://app.lemonsqueezy.com/settings/api";
        detailedError += "\n2. 检查现有 API Key 的状态和过期时间";
        detailedError += "\n3. 如果已过期或被删除，创建新的 API Key";
        detailedError += "\n4. 复制新的 API Key 并更新 .env.local 文件";
        detailedError += "\n5. 重启开发服务器";

        throw new Error(detailedError);
      }

      // Lemon Squeezy API 错误响应可能包含 errors 数组或 error 字符串
      const errorMessage =
        errorData &&
        typeof errorData === "object" &&
        "errors" in errorData &&
        Array.isArray(errorData.errors) &&
        errorData.errors[0] &&
        typeof errorData.errors[0] === "object" &&
        "detail" in errorData.errors[0]
          ? String(errorData.errors[0].detail)
          : errorData?.error || JSON.stringify(errorData);
      throw new Error(
        `Lemon Squeezy API error: ${response.status} - ${errorMessage}`,
      );
    }

    // ✅ JSON:API 规范使用 application/vnd.api+json，这也是有效的 JSON
    const contentType = response.headers.get("content-type");
    if (
      !contentType?.includes("application/json") &&
      !contentType?.includes("application/vnd.api+json")
    ) {
      const textData = await response.text();
      throw new Error(
        `Expected JSON response but got ${contentType}. Response: ${textData.substring(
          0,
          200,
        )}`,
      );
    }

    const data = await response.json();

    // ✅ JSON:API 响应结构检查
    if (!data.data) {
      throw new Error(
        `Invalid response structure from Lemon Squeezy: ${JSON.stringify(
          data,
        )}`,
      );
    }

    // ✅ 尝试多种可能的 URL 字段位置
    // Lemon Squeezy checkout URL 可能在 data.attributes.url
    let checkoutUrl = data.data.attributes?.url;

    // 如果没有直接的 URL，可能需要调用 GET /checkouts/{id} 来获取完整的 checkout 信息
    if (!checkoutUrl && data.data.id) {
      const checkoutId = data.data.id;
      console.log(
        "⚠️ Checkout URL not in initial response, fetching checkout details...",
        checkoutId,
      );

      // 调用 GET endpoint 获取完整的 checkout 信息
      try {
        const checkoutResponse = await fetch(
          `https://api.lemonsqueezy.com/v1/checkouts/${checkoutId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.api+json",
              Authorization: `Bearer ${API_KEY}`,
            },
          },
        );

        if (checkoutResponse.ok) {
          const checkoutData = await checkoutResponse.json();
          checkoutUrl = checkoutData.data?.attributes?.url;

          if (!checkoutUrl) {
            throw new Error(
              `Checkout URL not found in checkout details. Response: ${JSON.stringify(
                checkoutData,
              )}`,
            );
          }
        } else {
          throw new Error(
            `Failed to fetch checkout details: ${checkoutResponse.status}`,
          );
        }
      } catch (fetchError) {
        console.error("❌ Failed to fetch checkout URL:", fetchError);
        throw new Error(
          `Checkout created (ID: ${checkoutId}) but failed to get checkout URL: ${
            fetchError instanceof Error
              ? fetchError.message
              : String(fetchError)
          }`,
        );
      }
    }

    if (!checkoutUrl) {
      throw new Error(
        `Invalid response structure from Lemon Squeezy: No checkout URL found. Response: ${JSON.stringify(
          data,
        )}`,
      );
    }

    trackEvent("checkout_initiated", {
      variantId: finalVariantId,
      plan: plan || "unknown",
      painPoint,
      score: assessmentScore,
      platform: "lemonsqueezy",
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));

    // 记录详细的错误信息用于调试
    // eslint-disable-next-line no-console
    console.error("Lemon Squeezy checkout error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    trackEvent("checkout_error", {
      error: error.message,
      platform: "lemonsqueezy",
    });

    // 确保返回 JSON 格式的错误响应
    return NextResponse.json(
      {
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
