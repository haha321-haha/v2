"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface StressTypeComparisonProps {
  locale: string;
}

export default function StressTypeComparison({
  locale,
}: StressTypeComparisonProps) {
  const t = useTranslations("stressManagement");
  const [selectedType, setSelectedType] = useState<"acute" | "chronic" | null>(
    null,
  );

  const stressTypes = {
    acute: {
      icon: Clock,
      title: t("acute.title"),
      subtitle: t("acute.subtitle"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      duration: t("acute.duration"),
      examples: t("acute.examples"),
      effects: t("acute.impact"),
      management: t("acute.management"),
    },
    chronic: {
      icon: AlertTriangle,
      title: t("chronic.title"),
      subtitle: t("chronic.subtitle"),
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      duration: t("chronic.duration"),
      examples: t("chronic.examples"),
      effects: t("chronic.impact"),
      management: t("chronic.management"),
    },
  };

  const comparisonData = [
    {
      aspect: locale === "zh" ? "持续时间" : "Duration",
      acute: locale === "zh" ? "短暂（< 24小时）" : "Brief (< 24 hours)",
      chronic: locale === "zh" ? "长期（> 3个月）" : "Long-term (> 3 months)",
      icon: Clock,
    },
    {
      aspect: locale === "zh" ? "生理反应" : "Physiological Response",
      acute: locale === "zh" ? "战斗或逃跑反应" : "Fight or flight response",
      chronic:
        locale === "zh" ? "持续的皮质醇升高" : "Persistent cortisol elevation",
      icon: AlertTriangle,
    },
    {
      aspect: locale === "zh" ? "对月经的影响" : "Impact on Menstruation",
      acute: locale === "zh" ? "可能轻微延迟" : "May cause slight delay",
      chronic:
        locale === "zh" ? "可能完全停止" : "May cause complete cessation",
      icon: XCircle,
    },
    {
      aspect: locale === "zh" ? "恢复时间" : "Recovery Time",
      acute: locale === "zh" ? "数小时到数天" : "Hours to days",
      chronic: locale === "zh" ? "数周到数月" : "Weeks to months",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {t("stressTypes.comparison.title")}
        </h3>
        <p className="text-gray-600">{t("stressTypes.comparison.subtitle")}</p>
      </div>

      {/* Type Selection */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {Object.entries(stressTypes).map(([key, type]) => (
          <div
            key={key}
            className={`${type.bgColor} ${
              type.borderColor
            } border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedType === key ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() =>
              setSelectedType(
                selectedType === key ? null : (key as "acute" | "chronic"),
              )
            }
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center`}
              >
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className={`text-xl font-bold ${type.textColor}`}>
                  {type.title}
                </h4>
                <p className={`text-sm ${type.textColor} opacity-80`}>
                  {type.subtitle}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${type.textColor}`}>
                  {locale === "zh" ? "持续时间" : "Duration"}:
                </span>
                <span className={`text-sm ${type.textColor}`}>
                  {type.duration}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${type.textColor}`}>
                  {locale === "zh" ? "常见例子" : "Common Examples"}:
                </span>
                <span className={`text-sm ${type.textColor}`}>
                  {type.examples}
                </span>
              </div>
            </div>

            {selectedType === key && (
              <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                <div className="space-y-2">
                  <div>
                    <span className={`text-sm font-medium ${type.textColor}`}>
                      {locale === "zh" ? "影响" : "Effects"}:
                    </span>
                    <p className={`text-sm ${type.textColor}`}>
                      {type.effects}
                    </p>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${type.textColor}`}>
                      {locale === "zh" ? "管理策略" : "Management"}:
                    </span>
                    <p className={`text-sm ${type.textColor}`}>
                      {type.management}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                {locale === "zh" ? "对比方面" : "Comparison Aspect"}
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-blue-800 bg-blue-50">
                {locale === "zh" ? "急性压力" : "Acute Stress"}
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-red-800 bg-red-50">
                {locale === "zh" ? "慢性压力" : "Chronic Stress"}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <row.icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {row.aspect}
                    </span>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center text-blue-700">
                  {row.acute}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center text-red-700">
                  {row.chronic}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Takeaway */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-2">
          {t("stressTypes.comparison.keyTakeaway")}
        </h4>
        <p className="text-gray-700 text-sm">
          {t("stressTypes.comparison.keyTakeawayContent")}
        </p>
      </div>

      {/* Action Items */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2">
            {t("stressTypes.comparison.action1.title")}
          </h5>
          <p className="text-blue-700 text-sm">
            {t("stressTypes.comparison.action1.description")}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 mb-2">
            {t("stressTypes.comparison.action2.title")}
          </h5>
          <p className="text-red-700 text-sm">
            {t("stressTypes.comparison.action2.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
