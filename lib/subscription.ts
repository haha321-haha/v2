import { kv } from "@vercel/kv";

// 订阅状态类型
export interface SubscriptionStatus {
  hasSubscription: boolean;
  status: "active" | "cancelled" | "past_due" | "none";
  subscriptionId?: string;
  type?: "subscription" | "one_time";
  email?: string;
  variantId?: string;
  plan?: "monthly" | "yearly" | "oneTime" | "unknown";
  renewsAt?: string;
  updatedAt?: string;
}

// 前端验证订阅状态
export async function verifySubscription(
  email: string,
): Promise<SubscriptionStatus> {
  try {
    const response = await fetch("/api/verify-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to verify subscription:", error);
    return {
      hasSubscription: false,
      status: "none",
    };
  }
}

// 后端直接验证订阅状态（服务端调用）
export async function getSubscriptionStatus(
  email: string,
): Promise<SubscriptionStatus> {
  try {
    interface Subscription {
      status: string;
      subscriptionId?: string;
      type?: string;
      email?: string;
      variantId?: string;
      plan?: string;
      renewsAt?: string;
      updatedAt?: string;
    }
    const subscription = await kv.get<Subscription>(`subscription:${email}`);

    if (!subscription) {
      return {
        hasSubscription: false,
        status: "none",
      };
    }

    return {
      hasSubscription: subscription.status === "active",
      status: subscription.status as
        | "active"
        | "cancelled"
        | "past_due"
        | "none",
      subscriptionId: subscription.subscriptionId,
      type: (subscription.type || "subscription") as
        | "subscription"
        | "one_time",
      email: subscription.email,
      variantId: subscription.variantId,
      plan: (subscription.plan || "unknown") as
        | "monthly"
        | "yearly"
        | "oneTime"
        | "unknown",
      renewsAt: subscription.renewsAt,
      updatedAt: subscription.updatedAt,
    };
  } catch (error) {
    console.error("Failed to get subscription status:", error);
    return {
      hasSubscription: false,
      status: "none",
    };
  }
}

// 本地缓存管理
export const subscriptionCache = {
  // 缓存订阅状态到 localStorage
  set(email: string, status: SubscriptionStatus, ttl: number = 300000) {
    // 默认5分钟
    try {
      const cacheData = {
        data: status,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(
        `subscription_cache_${email}`,
        JSON.stringify(cacheData),
      );
    } catch (error) {
      console.error("Failed to cache subscription status:", error);
    }
  },

  // 从 localStorage 获取缓存的订阅状态
  get(email: string): SubscriptionStatus | null {
    try {
      const cached = localStorage.getItem(`subscription_cache_${email}`);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > cacheData.ttl;

      if (isExpired) {
        localStorage.removeItem(`subscription_cache_${email}`);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error("Failed to get cached subscription status:", error);
      return null;
    }
  },

  // 清除缓存
  clear(email: string) {
    try {
      localStorage.removeItem(`subscription_cache_${email}`);
    } catch (error) {
      console.error("Failed to clear subscription cache:", error);
    }
  },
};

// 带缓存的订阅验证
export async function verifySubscriptionWithCache(
  email: string,
): Promise<SubscriptionStatus> {
  // 先检查本地缓存
  const cached = subscriptionCache.get(email);
  if (cached && cached.hasSubscription) {
    return cached; // 如果是订阅状态，直接返回缓存
  }

  // 没有缓存或不是订阅状态，重新验证
  const status = await verifySubscription(email);

  // 更新缓存
  subscriptionCache.set(email, status);

  return status;
}
