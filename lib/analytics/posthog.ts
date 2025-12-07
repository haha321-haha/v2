/**
 * PostHog Analytics Integration
 * 用于追踪用户行为和A/B测试
 */

import posthog from "posthog-js";

// 仅在客户端初始化
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        posthog.debug();
      }
    },
    capture_pageview: false, // 手动控制pageview追踪
    disable_session_recording: process.env.NODE_ENV === "development", // 开发环境禁用录屏
  });
}

/**
 * 追踪事件
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
}

/**
 * 识别用户（付费后调用）
 */
export function identify(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    posthog.identify(userId, traits);
  }
}

/**
 * 追踪页面浏览
 */
export function trackPageView(pageName?: string) {
  if (typeof window !== "undefined") {
    posthog.capture("$pageview", {
      page: pageName || window.location.pathname,
    });
  }
}

/**
 * 获取A/B测试变体
 */
export function getFeatureFlagVariant(flagKey: string): string | boolean {
  if (typeof window !== "undefined") {
    // 使用getFeatureFlag，这是posthog 10.x版本之后的API
    return posthog.getFeatureFlag(flagKey) || "control";
  }
  return "control";
}

/**
 * P1.2 A/B测试配置 - 付费墙变体测试
 */
export const PAYWALL_VARIANTS = {
  control: "control",
  variant1: "variant1",
  variant2: "variant2",
} as const;

export type PaywallVariant =
  (typeof PAYWALL_VARIANTS)[keyof typeof PAYWALL_VARIANTS];

/**
 * 获取付费墙变体（带回退）
 */
export function getPaywallVariant(): PaywallVariant {
  const variant = getFeatureFlagVariant("paywall-variant-test") as string;
  return Object.values(PAYWALL_VARIANTS).includes(variant as PaywallVariant)
    ? (variant as PaywallVariant)
    : PAYWALL_VARIANTS.control;
}

/**
 * 记录A/B测试曝光
 */
export function trackABTestExposure(
  testName: string,
  variant: string,
  properties?: Record<string, unknown>,
) {
  trackEvent("ab_test_exposed", {
    testName,
    variant,
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * 重置用户（登出时）
 */
export function reset() {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
}

export default posthog;

/**
 * 追踪错误（P0.4 错误监控）
 */
export function trackError(
  error: Error,
  context: {
    source: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  if (typeof window !== "undefined") {
    posthog.capture("error_occurred", {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      timestamp: new Date().toISOString(),
      ...context,
    });

    if (process.env.NODE_ENV === "development") {
      console.error(`[${context.source}]`, error);
    }
  }
}

/**
 * P0.5 补充数据埋点 - Assessment & Conversion Funnel
 */

// Assessment Flow Events
export function trackAssessmentStarted() {
  trackEvent("assessment_started");
}

export function trackAssessmentQuestionAnswered(
  questionIndex: number,
  answer: number | string | boolean,
) {
  trackEvent("assessment_question_answered", {
    questionIndex,
    answer,
  });
}

export function trackAssessmentAbandoned(questionIndex: number) {
  trackEvent("assessment_abandoned", {
    abandonedAt: questionIndex,
    completion: `${((questionIndex / 6) * 100).toFixed(0)}%`,
  });
}

export function trackAssessmentCompleted(score: number, painPoint: string) {
  trackEvent("assessment_completed", {
    score,
    painPoint,
  });
}

// Result Preview Events
export function trackResultPreviewViewed(score: number, painPoint: string) {
  trackEvent("result_preview_viewed", {
    score,
    painPoint,
  });
}

export function trackProFeatureClicked(feature: string) {
  trackEvent("pro_feature_clicked", {
    feature,
  });
}

export function trackFreePathChosen() {
  trackEvent("free_path_chosen");
}

// Checkout Events
export function trackCheckoutCancelled(reason?: string) {
  trackEvent("checkout_cancelled", {
    reason: reason || "user_action",
  });
}

export function trackPaymentInterrupted(step: string) {
  trackEvent("payment_interrupted", {
    step,
  });
}

// P1.2 付费墙A/B测试追踪
export function trackPaywallViewed(
  variant: string,
  painPoint: string,
  score: number,
) {
  trackEvent("paywall_viewed", {
    variant,
    painPoint,
    score,
  });
}

export function trackPaywallUpgradeClicked(
  variant: string,
  painPoint: string,
  plan: string,
) {
  trackEvent("paywall_upgrade_clicked", {
    variant,
    painPoint,
    plan,
  });
}

export function trackPaywallClosed(
  variant: string,
  painPoint: string,
  timeSpent: number,
) {
  trackEvent("paywall_closed", {
    variant,
    painPoint,
    timeSpent, // 付费墙停留时间（秒）
  });
}

export function trackPlanSelected(
  variant: string,
  painPoint: string,
  plan: string,
) {
  trackEvent("plan_selected", {
    variant,
    painPoint,
    plan,
  });
}
