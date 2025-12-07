import { useEffect, useState } from "react";

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100
}

export interface ABTestConfig {
  testId: string;
  variants: ABTestVariant[];
  expiryDays?: number;
}

// Google Analytics gtag 类型定义
// Note: gtag type may already be defined by Next.js or other packages
type GtagFunction = (
  command: string,
  targetId: string,
  config?: Record<string, unknown>,
) => void;

export interface ABTestResult {
  variant: ABTestVariant;
  trackEvent: (eventName: string, eventData?: Record<string, unknown>) => void;
}

/**
 * A/B测试Hook - 支持多变量测试
 *
 * @param testConfig 测试配置
 * @returns 当前变体和事件追踪函数
 */
export function useABTest(testConfig: ABTestConfig): ABTestResult {
  const { testId, variants, expiryDays = 30 } = testConfig;

  const [currentVariant, setCurrentVariant] = useState<ABTestVariant>(() => {
    // 服务器端直接返回第一个变体作为默认值，确保与客户端一致
    if (typeof window === "undefined") {
      return variants[0];
    }

    // 客户端首次渲染也返回第一个变体，确保与服务器端一致
    // 后续在useEffect中进行真正的变体分配
    return variants[0];
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  // 仅在客户端完全挂载后初始化变体选择
  useEffect(() => {
    if (hasInitialized) return;

    // 优先从localStorage获取已分配的变体（保持用户一致性）
    const stored = localStorage.getItem(`ab_test_${testId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const variant = variants.find((v) => v.id === parsed.variantId);
        if (variant && new Date(parsed.expiry) > new Date()) {
          setCurrentVariant(variant);
          setHasInitialized(true);
          return;
        }
      } catch (parseError) {
        // Silently handle parse errors - invalid stored data
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("Failed to parse stored AB test variant:", parseError);
        }
      }
    }

    // 根据权重分配变体
    const assignedVariant = assignVariant(variants);
    setCurrentVariant(assignedVariant);
    setHasInitialized(true);
  }, [testId, variants, hasInitialized]);

  useEffect(() => {
    // 仅在客户端且已经初始化后才保存变体分配
    if (typeof window !== "undefined" && hasInitialized) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      localStorage.setItem(
        `ab_test_${testId}`,
        JSON.stringify({
          variantId: currentVariant.id,
          expiry: expiryDate.toISOString(),
          assignedAt: new Date().toISOString(),
        }),
      );
    }
  }, [testId, currentVariant.id, expiryDays, hasInitialized]);

  useEffect(() => {
    // 发送变体分配事件到GA4
    if (
      typeof window !== "undefined" &&
      (window as { gtag?: GtagFunction }).gtag
    ) {
      (window as { gtag: GtagFunction }).gtag(
        "event",
        "ab_test_variant_assigned",
        {
          test_id: testId,
          variant_id: currentVariant.id,
          variant_name: currentVariant.name,
          timestamp: new Date().toISOString(),
        },
      );
    }
  }, [testId, currentVariant]);

  const trackEvent = (
    eventName: string,
    eventData?: Record<string, unknown>,
  ) => {
    if (
      typeof window !== "undefined" &&
      (window as { gtag?: GtagFunction }).gtag
    ) {
      (window as { gtag: GtagFunction }).gtag("event", eventName, {
        ...eventData,
        ab_test_id: testId,
        ab_variant_id: currentVariant.id,
        ab_variant_name: currentVariant.name,
        timestamp: new Date().toISOString(),
      });
    }

    // 同时发送到控制台（开发调试）
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`[AB Test] ${eventName}:`, {
        testId,
        variant: currentVariant.name,
        ...eventData,
      });
    }
  };

  return {
    variant: currentVariant,
    trackEvent,
  };
}

/**
 * 根据权重分配变体
 */
function assignVariant(variants: ABTestVariant[]): ABTestVariant {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant;
    }
  }

  // 兜底：返回第一个变体
  return variants[0];
}

/**
 * 获取用户的所有A/B测试变体（用于调试和分析）
 */
export function getUserABTestVariants(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const variants: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("ab_test_")) {
      try {
        const testId = key.replace("ab_test_", "");
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data.variantId) {
          variants[testId] = data.variantId;
        }
      } catch (parseError) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("Failed to parse AB test data:", parseError);
        }
      }
    }
  }

  return variants;
}

/**
 * 清理过期的A/B测试数据
 */
export function cleanupExpiredABTests(): void {
  if (typeof window === "undefined") return;

  const now = new Date();
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("ab_test_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data.expiry && new Date(data.expiry) < now) {
          keysToRemove.push(key);
        }
      } catch {
        // 如果解析失败，删除该键
        keysToRemove.push(key);
      }
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));

  if (keysToRemove.length > 0 && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`Cleaned up ${keysToRemove.length} expired AB test(s)`);
  }
}
