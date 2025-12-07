"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  trackPaywallViewed,
  trackPaywallUpgradeClicked,
  trackPaywallClosed,
  trackPlanSelected,
  getPaywallVariant,
  trackABTestExposure,
  PAYWALL_VARIANTS,
} from "@/lib/analytics/posthog";
import { X, Check, Sparkles } from "lucide-react";
import WellnessPromiseCard from "./WellnessPromiseCard";

export interface PaywallModalProps {
  painPoint: "pain" | "work" | "emotion";
  assessmentScore: number;
  onClose: () => void;
  onUpgrade: (plan: "monthly" | "yearly" | "oneTime") => void;
}

export default function PaywallModal({
  painPoint,
  assessmentScore,
  onClose,
  onUpgrade,
}: PaywallModalProps) {
  const t = useTranslations();
  const [selectedPlan, setSelectedPlan] = useState<
    "monthly" | "yearly" | "oneTime"
  >("monthly");
  const [variant, setVariant] = useState("control");
  const [viewStartTime] = useState(Date.now());

  useEffect(() => {
    const currentVariant = getPaywallVariant();
    setVariant(currentVariant);

    // 记录A/B测试曝光
    trackABTestExposure("paywall-variant-test", currentVariant, {
      painPoint,
      assessmentScore,
    });

    trackPaywallViewed(currentVariant, painPoint, assessmentScore);
  }, [painPoint, assessmentScore]);

  // P1.2 A/B测试：3种变体策略
  const headlineKey =
    assessmentScore >= 7
      ? "highStressDominant"
      : variant === PAYWALL_VARIANTS.control
        ? `${painPoint}Dominant`
        : variant === PAYWALL_VARIANTS.variant1
          ? `${painPoint}Alternative1`
          : variant === PAYWALL_VARIANTS.variant2
            ? `${painPoint}Alternative2`
            : `${painPoint}Dominant`;

  const handleUpgrade = (plan: "monthly" | "yearly" | "oneTime") => {
    trackPaywallUpgradeClicked(variant, painPoint, plan);
    trackPlanSelected(variant, painPoint, plan);
    onUpgrade(plan);
  };

  const handleClose = () => {
    const timeSpent = Math.round((Date.now() - viewStartTime) / 1000);
    trackPaywallClosed(variant, painPoint, timeSpent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {t("Paywall.urgency.limitedOffer")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t(`Paywall.variants.${headlineKey}.headline`)}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(`Paywall.variants.${headlineKey}.subheadline`)}
            </p>
          </div>

          {/* Phase 3: Wellness Promise Card */}
          <WellnessPromiseCard painPoint={painPoint} />

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t("Paywall.comparison.free.title")}
              </h3>
              <ul className="space-y-3">
                {(t.raw("Paywall.comparison.free.features") as string[]).map(
                  (feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="border-2 border-purple-500 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                PRO
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t("Paywall.comparison.pro.title")}
              </h3>
              <ul className="space-y-3">
                {(t.raw("Paywall.comparison.pro.features") as string[]).map(
                  (feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-900"
                    >
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`p-4 rounded-xl border-2 transition-all relative ${
                selectedPlan === "monthly"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              {assessmentScore >= 7 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full animate-pulse">
                  {t("Paywall.urgency.reliefDiscount")}
                </div>
              )}
              <div className="text-sm text-gray-600 mb-1">
                {t("Pro.pricing.monthly.features")}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {t("Pro.pricing.monthly.price")}
              </div>
            </button>

            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`p-4 rounded-xl border-2 transition-all relative ${
                selectedPlan === "yearly"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                {t("Pro.pricing.yearly.save")}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {t("Pro.pricing.yearly.perMonth")}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {t("Pro.pricing.yearly.price")}
              </div>
            </button>

            <button
              onClick={() => setSelectedPlan("oneTime")}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedPlan === "oneTime"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="text-sm text-gray-600 mb-1">
                {t("Pro.pricing.oneTime.label")}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {t("Pro.pricing.oneTime.price")}
              </div>
            </button>
          </div>

          <button
            onClick={() => handleUpgrade(selectedPlan)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow"
          >
            {t(`Paywall.variants.${headlineKey}.cta`)}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t("Paywall.urgency.usersJoined", { count: "127" })}
          </p>
        </div>
      </div>
    </div>
  );
}
