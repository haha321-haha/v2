import React from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useABTest } from "@/hooks/useABTest";
import { useCTATracking } from "@/hooks/useCTATracking";
import { HERO_CTA_AB_TEST } from "@/config/ab-tests.config";
import { logInfo } from "@/lib/debug-logger";

/**
 * Hero区域CTA组件 - 集成A/B测试和事件追踪
 *
 * 功能：
 * 1. 50/50流量A/B测试
 * 2. GA4事件追踪
 * 3. 用户行为路径分析
 * 4. 变体一致性保持
 * 5. 实时数据收集
 */
export default function HeroABTest() {
  const locale = useLocale();

  // 获取A/B测试变体和追踪函数
  const { variant, trackEvent: trackABEvent } = useABTest(HERO_CTA_AB_TEST);

  // 获取CTA事件追踪函数
  const { trackCTAClick, trackPageView } = useCTATracking();

  // 根据变体获取对应的文案
  const getCTAText = () => {
    if (variant.id === "optimized") {
      return locale === "zh" ? "获取缓解方案" : "Get My Relief Plan";
    }
    // control组使用原始翻译
    return locale === "zh" ? "立即缓解" : "Immediate Relief";
  };

  const getMicrocopy = () => {
    if (variant.id === "optimized") {
      return locale === "zh"
        ? "免费 • 3分钟 • 科学依据"
        : "Free • 3 minutes • Science-based";
    }
    // control组使用简化版本
    return locale === "zh" ? "快速缓解方法" : "Fast relief methods";
  };

  // CTA点击事件处理
  const handleCTAClick = () => {
    const buttonText = getCTAText();

    // A/B测试事件追踪
    trackABEvent("hero_cta_click", {
      button_text: buttonText,
      locale: locale,
      destination: "/immediate-relief",
      timestamp: new Date().toISOString(),
    });

    // CTA专用事件追踪
    trackCTAClick({
      buttonText: buttonText,
      buttonLocation: "hero_main",
      destination: "/immediate-relief",
      locale: locale,
      abTestVariant: variant.id,
      abTestId: HERO_CTA_AB_TEST.testId,
    });
  };

  // 组件挂载时记录展示事件和页面浏览
  React.useEffect(() => {
    // 仅在客户端且组件完全加载后执行
    if (typeof window !== "undefined") {
      // 页面浏览事件
      trackPageView({
        pageTitle: "Hero Section",
        pageLocation: window.location.href,
      });

      // A/B测试展示事件
      trackABEvent("hero_cta_impression", {
        variant_id: variant.id,
        variant_name: variant.name,
        locale: locale,
        timestamp: new Date().toISOString(),
      });

      // 开发模式显示调试信息
      if (process.env.NODE_ENV === "development") {
        logInfo(
          `[AB Test] Hero CTA - Variant: ${variant.name} (${variant.id}), Locale: ${locale}`,
          { variant, locale },
          "HeroABTest/useEffect",
        );
      }
    }
  }, [variant, locale, trackABEvent, trackPageView]);

  // 获取会话统计（用于显示）
  const { getSessionStats } = useCTATracking();
  const sessionStats = getSessionStats();

  return (
    <div className="flex flex-col items-center lg:items-start gap-2">
      <Link href={`/${locale}/immediate-relief`} onClick={handleCTAClick}>
        <Button
          size="lg"
          className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 min-w-[200px] group"
        >
          {getCTAText()}
          <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
      <p className="text-xs text-white/80 mt-1 text-center lg:text-left">
        {getMicrocopy()}
      </p>

      {/* 开发模式显示变体标识和会话统计 */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-white/60 mt-1 space-y-1">
          <div>AB Test: {variant.name}</div>
          <div>Session: {sessionStats.sessionId.slice(0, 8)}...</div>
          <div>
            Page Views: {sessionStats.pageViews} | CTA Clicks:{" "}
            {sessionStats.ctaClicks}
          </div>
        </div>
      )}
    </div>
  );
}
