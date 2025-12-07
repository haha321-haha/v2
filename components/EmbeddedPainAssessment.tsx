"use client";

import React, { useState } from "react";
import Link from "next/link";

interface EmbeddedPainAssessmentProps {
  locale?: string;
  className?: string;
}

const EmbeddedPainAssessment: React.FC<EmbeddedPainAssessmentProps> = ({
  locale = "zh",
  className = "",
}) => {
  const [intensity, setIntensity] = useState<string>("");
  const [showQuickResult, setShowQuickResult] = useState(false);

  // 临时使用硬编码文本，避免翻译系统问题
  const isZh = locale === "zh";

  const t = {
    title: isZh ? "快速疼痛评估" : "Quick Pain Assessment",
    subtitle: isZh
      ? "选择疼痛程度，获得即时建议"
      : "Select pain level for instant advice",
    question: isZh
      ? "请选择您当前的疼痛程度："
      : "Please select your current pain level:",
    options: {
      mild: isZh ? "轻微疼痛" : "Mild Pain",
      moderate: isZh ? "中度疼痛" : "Moderate Pain",
      severe: isZh ? "严重疼痛" : "Severe Pain",
    },
    buttons: {
      getAdvice: isZh ? "获取建议" : "Get Advice",
      detailedAssessment: isZh ? "详细评估" : "Detailed Assessment",
      testAgain: isZh ? "重新测试" : "Test Again",
      fullAssessment: isZh ? "完整评估" : "Full Assessment",
    },
    resultTitle: isZh ? "评估结果" : "Assessment Result",
    results: {
      mild: isZh
        ? "您的疼痛程度较轻，建议使用热敷、轻度运动等自然疗法缓解。如疼痛持续或加重，请及时就医。"
        : "Your pain level is mild. We recommend using heat therapy, light exercise and other natural remedies. If pain persists or worsens, please seek medical attention.",
      moderate: isZh
        ? "您的疼痛程度中等，建议使用热敷、适当休息，必要时可考虑服用止痛药。如症状持续，建议咨询医生。"
        : "Your pain level is moderate. We recommend heat therapy, adequate rest, and pain medication if necessary. If symptoms persist, please consult a doctor.",
      severe: isZh
        ? "您的疼痛程度较重，建议立即就医检查。在等待就医期间，可使用热敷缓解症状，避免剧烈运动。"
        : "Your pain level is severe. We recommend immediate medical attention. While waiting, use heat therapy to relieve symptoms and avoid strenuous exercise.",
    },
    disclaimer: isZh
      ? "此评估仅供参考，不能替代专业医疗建议。如有严重症状，请及时就医。"
      : "This assessment is for reference only and cannot replace professional medical advice. Please seek medical attention for severe symptoms.",
    selectIntensityFirst: isZh
      ? "请先选择疼痛程度"
      : "Please select pain intensity first",
  };

  const getQuickAssessment = () => {
    if (!intensity) {
      // 可以考虑使用更优雅的提示方式，比如toast通知
      // 这里保持原有逻辑避免破坏功能
      alert(t.selectIntensityFirst);
      return;
    }

    setShowQuickResult(true);
  };

  const getResultMessage = () => {
    if (intensity === "mild") {
      return t.results.mild;
    } else if (intensity === "moderate") {
      return t.results.moderate;
    } else {
      return t.results.severe;
    }
  };

  const getResultColor = () => {
    if (intensity === "mild")
      return "border-green-500 bg-green-50 text-green-700";
    if (intensity === "moderate")
      return "border-yellow-500 bg-yellow-50 text-yellow-700";
    return "border-red-500 bg-red-50 text-red-700";
  };

  return (
    <div
      className={`bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary-700 mb-2">{t.title}</h3>
        <p className="text-gray-600 text-sm">{t.subtitle}</p>
      </div>

      {!showQuickResult ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3 text-gray-800">{t.question}</h4>
            <div className="space-y-2">
              {[
                {
                  value: "mild",
                  label: t.options.mild,
                  emoji: "😊",
                },
                {
                  value: "moderate",
                  label: t.options.moderate,
                  emoji: "😐",
                },
                {
                  value: "severe",
                  label: t.options.severe,
                  emoji: "😰",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="intensity"
                    value={option.value}
                    checked={intensity === option.value}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-sm text-gray-700 flex-1">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={getQuickAssessment}
              className="flex-1 btn-primary text-sm py-2 px-4 font-semibold"
            >
              {t.buttons.getAdvice}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-impact-calculator`}
              className="flex-1 btn-outline text-sm py-2 px-4 font-semibold text-center"
            >
              {t.buttons.detailedAssessment}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-l-4 ${getResultColor()}`}>
            <h4 className="font-medium mb-2">{t.resultTitle}</h4>
            <p className="text-sm leading-relaxed">{getResultMessage()}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setShowQuickResult(false);
                setIntensity("");
              }}
              className="flex-1 btn-outline text-sm py-2 px-4 font-semibold"
            >
              {t.buttons.testAgain}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-impact-calculator`}
              className="flex-1 btn-primary text-sm py-2 px-4 font-semibold text-center"
            >
              {t.buttons.fullAssessment}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">{t.disclaimer}</p>
      </div>
    </div>
  );
};

export default EmbeddedPainAssessment;
