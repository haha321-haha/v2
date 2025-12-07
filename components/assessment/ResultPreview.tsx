"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getUpgradeRecommendation } from "@/lib/recommendations/upgradeEngine";
import { trackEvent } from "@/lib/analytics/posthog";
import PaywallModal from "@/components/monetization/PaywallModal";
import { Sparkles, Lock } from "lucide-react";

interface ResultPreviewProps {
  score: number;
  painPoint: "work" | "pain" | "emotion";
  severity: string;
  primaryIssue: string;
  secondaryIssues: string;
}

export default function ResultPreview({
  score,
  painPoint,
  severity,
  primaryIssue,
  secondaryIssues,
}: ResultPreviewProps) {
  const t = useTranslations();
  const [showPaywall, setShowPaywall] = useState(false);

  const recommendation = getUpgradeRecommendation({ score, painPoint }, t);

  const handleUnlockClick = () => {
    trackEvent("pro_feature_clicked", { score, painPoint });
    setShowPaywall(true);
  };

  const handleFreeTipsClick = () => {
    trackEvent("free_path_chosen", { score, painPoint });
    // Navigate to free tips or show free content
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Unlocked Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("AssessmentResult.unlocked.title")}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-purple-600">
              {score}/10
            </span>
            <span className="text-lg text-gray-600">({severity})</span>
          </div>

          <p className="text-gray-800">
            <strong>Primary Issue:</strong> {primaryIssue}
          </p>

          {secondaryIssues && (
            <p className="text-gray-600">
              <strong>Secondary:</strong> {secondaryIssues}
            </p>
          )}
        </div>
      </div>

      {/* Pro Features Preview (Blurred) */}
      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30 z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">Pro Features</p>
          </div>
        </div>

        <div className="blur-sm select-none">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            {t("AssessmentResult.proPreview.title")}
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">
                {t("AssessmentResult.proPreview.workImpact.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("AssessmentResult.proPreview.workImpact.description")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">
                {t("AssessmentResult.proPreview.improvementPlan.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("AssessmentResult.proPreview.improvementPlan.description")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">
                {t("AssessmentResult.proPreview.cyclePrediction.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("AssessmentResult.proPreview.cyclePrediction.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center p-4 border-2 border-gray-200 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {t("AssessmentResult.comparison.free.title")}
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>✓ {t("AssessmentResult.comparison.free.questions")}</li>
              <li>✓ {t("AssessmentResult.comparison.free.results")}</li>
              <li>✓ {t("AssessmentResult.comparison.free.tips")}</li>
            </ul>
          </div>

          <div className="text-center p-4 border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-white rounded-xl relative">
            <div className="absolute -top-2 -right-2 bg-purple-600 text-white px-3 py-1 text-xs font-bold rounded-full">
              PRO
            </div>
            <h3 className="text-lg font-bold text-purple-900 mb-3">
              {t("AssessmentResult.comparison.pro.title")}
            </h3>
            <ul className="space-y-2 text-purple-700 text-sm font-medium">
              <li>✓ {t("AssessmentResult.comparison.pro.questions")}</li>
              <li>✓ {t("AssessmentResult.comparison.pro.results")}</li>
              <li>✓ {t("AssessmentResult.comparison.pro.plan")}</li>
              <li>✓ {t("AssessmentResult.comparison.pro.predictions")}</li>
              <li>✓ {t("AssessmentResult.comparison.pro.optimization")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-4">
        {recommendation.urgency === "high" && recommendation.discount && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-yellow-800">
              🎉 Limited Time: First Month Only {recommendation.discount}
            </p>
          </div>
        )}

        <button
          onClick={handleUnlockClick}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow"
        >
          {t("AssessmentResult.cta.unlockPro", { price: "$12.99" })}
        </button>

        <button
          onClick={handleFreeTipsClick}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          {t("AssessmentResult.cta.viewFreeTips")}
        </button>

        <p className="text-center text-sm text-gray-500">
          {t("AssessmentResult.cta.socialProof", { count: "127" })}
        </p>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          painPoint={painPoint}
          assessmentScore={score}
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => {
            // Handled by PaywallModal's UpgradeButton
          }}
        />
      )}
    </div>
  );
}
