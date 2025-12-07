"use client";

import { Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaywallModal from "@/components/monetization/PaywallModal";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { logError } from "@/lib/debug-logger";
import "@/lib/pro-upgrade-handler"; // 确保全局函数可用

export default function PricingPageClient() {
  const [showPaywall, setShowPaywall] = useState(false);
  const t = useTranslations("Pro.pricing");
  const locale = useLocale();

  // 确保标题和副标题在服务器和客户端之间保持一致
  const heroTitle = t("hero.title");
  const heroSubtitle = t("hero.subtitle");

  const plans = [
    {
      id: "monthly",
      name: t("plans.monthly.name"),
      price: t("plans.monthly.price"),
      originalPrice: t("plans.monthly.originalPrice"),
      savings: t("plans.monthly.savings"),
      features: Array.isArray(t.raw("plans.monthly.features"))
        ? (t.raw("plans.monthly.features") as string[])
        : [],
      recommended: false,
    },
    {
      id: "yearly",
      name: t("plans.yearly.name"),
      price: t("plans.yearly.price"),
      originalPrice: t("plans.yearly.originalPrice"),
      savings: t("plans.yearly.savings"),
      features: Array.isArray(t.raw("plans.yearly.features"))
        ? (t.raw("plans.yearly.features") as string[])
        : [],
      recommended: true,
    },
    {
      id: "oneTime",
      name: t("plans.oneTime.name"),
      price: t("plans.oneTime.price"),
      originalPrice: null,
      savings: null,
      features: Array.isArray(t.raw("plans.oneTime.features"))
        ? (t.raw("plans.oneTime.features") as string[])
        : [],
      recommended: false,
    },
  ];

  const handleUpgrade = (planId: string) => {
    if (window.handleProUpgrade) {
      window.handleProUpgrade({
        plan: planId as "monthly" | "yearly" | "oneTime",
        painPoint: "pricing_page",
        assessmentScore: 0,
        source: "pricing_page",
      });
    } else {
      // 使用logger而不是console.error（开发环境自动启用，生产环境自动禁用）
      logError("全局升级函数未找到", undefined, "PricingPageClient");
      alert("升级功能暂时不可用，请稍后重试");
    }
  };

  const faqItems = t.raw("faq.items");
  const safeFaqItems = Array.isArray(faqItems)
    ? (faqItems as Array<{ question: string; answer: string }>)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Crown className="w-8 h-8" />
            <h1 className="text-4xl font-bold">
              {heroTitle
                .replace(/PeriodHub ProPeriodHub Pro/g, "PeriodHub Pro")
                .replace(/(PeriodHub Pro){2,}/g, "PeriodHub Pro")}
            </h1>
          </div>
          <p className="text-xl mb-8 text-purple-100">{heroSubtitle}</p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-purple-200">
                {t("hero.stats.assessments")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-purple-200">
                {t("hero.stats.satisfaction")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-purple-200">{t("hero.stats.support")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl shadow-lg p-8 transition-all ${
                plan.recommended
                  ? "border-2 border-purple-500 transform scale-105"
                  : "border border-gray-200 hover:shadow-xl"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {t("plans.yearly.badge")}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-purple-600">
                    {plan.price}
                  </div>
                  {plan.originalPrice && (
                    <div className="text-lg text-gray-400 line-through">
                      {plan.originalPrice}
                    </div>
                  )}
                  {plan.savings && (
                    <div className="text-sm text-green-600 font-semibold">
                      {locale === "zh"
                        ? `节省 ${plan.savings}`
                        : `Save ${plan.savings}`}
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-3 ${
                  plan.recommended
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {plan.id === "oneTime" ? t("cta.buyNow") : t("cta.subscribe")}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t("faq.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {safeFaqItems.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">{t("support.title")}</h3>
          <p className="text-gray-300 mb-6">{t("support.description")}</p>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900"
          >
            {t("support.cta")}
          </Button>
        </div>
      </div>

      {/* Paywall Modal (备用) */}
      {showPaywall && (
        <PaywallModal
          painPoint="work"
          assessmentScore={0}
          onClose={() => setShowPaywall(false)}
          onUpgrade={(plan) => handleUpgrade(plan)}
        />
      )}
    </div>
  );
}
