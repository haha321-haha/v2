import { verifySubscriptionWithCache } from "./subscription";

// 全局Pro升级处理函数
export interface ProUpgradeOptions {
  plan?: "monthly" | "yearly" | "oneTime";
  painPoint?: string;
  assessmentScore?: number;
  source?: string;
  email?: string; // 添加邮箱参数
}

export function handleProUpgrade(options: ProUpgradeOptions = {}) {
  const {
    plan = "monthly",
    painPoint = "onboarding",
    assessmentScore = 0,
    source = "onboarding_modal",
    email,
  } = options;

  console.log("🔓 Pro升级处理函数被调用:", {
    plan,
    painPoint,
    assessmentScore,
    source,
    email,
  });

  // 如果提供了邮箱，先验证订阅状态
  if (email) {
    // 保存邮箱到 localStorage
    localStorage.setItem("periodhub_email", email);

    // 验证订阅状态
    verifySubscriptionWithCache(email)
      .then((subscription) => {
        if (subscription.hasSubscription) {
          // 如果已有订阅，直接跳转到仪表板
          window.location.href = "/dashboard";
          return;
        }

        // 没有订阅，继续支付流程
        initiateCheckout(plan, painPoint, assessmentScore, source, email);
      })
      .catch((error) => {
        console.error("验证订阅状态失败:", error);
        // 验证失败，继续支付流程
        initiateCheckout(plan, painPoint, assessmentScore, source, email);
      });
  } else {
    // 没有提供邮箱，直接进行支付流程
    initiateCheckout(plan, painPoint, assessmentScore, source);
  }
}

function initiateCheckout(
  plan: "monthly" | "yearly" | "oneTime",
  painPoint: string,
  assessmentScore: number,
  source: string,
  email?: string,
) {
  try {
    // 触发Lemon Squeezy checkout
    // 传递 plan 而不是 variantId，让服务器端根据 plan 获取 variantId
    interface CheckoutRequestBody {
      plan: "monthly" | "yearly" | "oneTime";
      painPoint?: string;
      assessmentScore?: number;
      source?: string;
      email?: string;
    }
    const requestBody: CheckoutRequestBody = {
      plan: plan as "monthly" | "yearly" | "oneTime", // ✅ 传递 plan，让服务器端处理
      painPoint,
      assessmentScore,
      source,
    };

    // 如果有邮箱，添加到请求中
    if (email) {
      requestBody.email = email;
    }

    fetch("/api/lemonsqueezy/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        console.log("📡 API响应状态:", response.status, response.statusText);

        // ✅ 检查响应状态
        if (!response.ok) {
          // 先尝试解析 JSON，如果失败则使用文本
          return response.text().then((text) => {
            let errorData: { error?: string; message?: string } = {};
            try {
              errorData = JSON.parse(text) as {
                error?: string;
                message?: string;
              };
            } catch {
              // 如果解析失败，使用原始文本
              errorData = { error: text || `HTTP ${response.status}` };
            }

            // ✅ 401 错误特殊处理
            if (response.status === 401) {
              const errorMsg =
                errorData?.error ||
                (errorData as { errors?: Array<{ detail?: string }> })
                  ?.errors?.[0]?.detail ||
                "Unauthenticated";
              console.error("❌ 支付 API 401 未认证错误:", errorData);
              throw new Error(
                `支付认证失败 (401): ${errorMsg}。请检查 API 密钥配置。`,
              );
            }

            console.error("❌ 支付请求失败:", errorData);
            const errorMessage =
              errorData?.error ||
              (errorData as { errors?: Array<{ detail?: string }> })
                ?.errors?.[0]?.detail ||
              `API error: ${response.status}`;
            throw new Error(errorMessage);
          });
        }

        return response.json();
      })
      .then((data) => {
        console.log("✅ API响应数据:", data);

        if (data.url) {
          console.log("🔗 跳转到支付页面:", data.url);
          // 跳转到支付页面
          window.location.href = data.url;
        } else {
          // 显示错误提示
          console.error("❌ API响应中没有URL:", data);
          alert("支付初始化失败，请稍后重试");
        }
      })
      .catch((error) => {
        console.error("💥 升级失败:", error);
        const errorMessage = error.message || "升级过程中出现错误，请稍后重试";
        alert(`支付失败: ${errorMessage}`);
      });
  } catch (error) {
    console.error("💥 升级处理错误:", error);
    alert("无法处理升级请求，请刷新页面重试");
  }
}

// 注意：此函数已不再使用，改为在服务器端根据 plan 获取 variantId
// 保留此函数以防其他地方仍在使用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getVariantId(plan: "monthly" | "yearly" | "oneTime"): string {
  // 客户端无法直接访问 process.env，这些值需要在构建时注入
  // 现在改为传递 plan 给服务器端，让服务器端处理
  const variants = {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY,
    oneTime: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ONETIME,
  };

  return variants[plan] || variants.monthly || "";
}

// 声明全局函数，供组件使用
declare global {
  interface Window {
    handleProUpgrade: (options?: ProUpgradeOptions) => void;
  }
}

// 将函数注册到全局
if (typeof window !== "undefined") {
  window.handleProUpgrade = handleProUpgrade;
  console.log("✅ 全局支付处理函数已注册");
}
