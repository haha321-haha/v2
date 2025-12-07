"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface PeriodPainAssessmentToolProps {
  locale: string;
}

interface PeriodPainResult {
  severity: "low" | "medium" | "high";
  advice: string;
  needConsult: boolean;
}

export default function PeriodPainAssessmentTool({
  locale,
}: PeriodPainAssessmentToolProps) {
  const [intensity, setIntensity] = useState("");
  const [onset, setOnset] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<PeriodPainResult | null>(null);

  const t = useTranslations("periodPainAssessmentPage.tool");

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSymptoms([...symptoms, symptom]);
    } else {
      setSymptoms(symptoms.filter((s) => s !== symptom));
    }
  };

  const evaluateAssessment = () => {
    let severity: "low" | "medium" | "high" = "low";
    let advice = "";
    let needConsult = false;

    // 评估逻辑
    if (symptoms.length > 0) {
      severity = "high";
      needConsult = true;
      advice = t("advice.severeSymptoms");
    } else if (intensity === "severe") {
      severity = "high";
      needConsult = true;
      advice = t("advice.severeIntensity");
    } else if (intensity === "moderate") {
      severity = "medium";
      advice = t("advice.moderateIntensity");
    } else {
      severity = "low";
      advice = t("advice.mildIntensity");
    }

    setResult({ severity, advice, needConsult });
  };

  const resetAssessment = () => {
    setIntensity("");
    setOnset("");
    setSymptoms([]);
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{t("title")}</h1>
        <p className="text-lg text-gray-600">{t("subtitle")}</p>
      </div>

      {!result ? (
        <div className="space-y-8">
          {/* 痛经强度 */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {t("intensityTitle")}
            </h3>
            <div className="space-y-3">
              {Object.entries(t.raw("intensityOptions")).map(
                ([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="intensity"
                      value={value}
                      checked={intensity === value}
                      onChange={(e) => setIntensity(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-gray-700 text-left">
                      {label as string}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>

          {/* 痛经开始时间 */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {t("onsetTitle")}
            </h3>
            <div className="space-y-3">
              {Object.entries(t.raw("onsetOptions")).map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="onset"
                    value={value}
                    checked={onset === value}
                    onChange={(e) => setOnset(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700 text-left">
                    {label as string}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 严重症状 */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {t("symptomsTitle")}
            </h3>
            <div className="space-y-3">
              {Object.entries(t.raw("symptomsOptions")).map(
                ([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={value}
                      checked={symptoms.includes(value)}
                      onChange={(e) =>
                        handleSymptomChange(value, e.target.checked)
                      }
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-gray-700 text-left">
                      {label as string}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={evaluateAssessment}
              disabled={!intensity || !onset}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t("assessButton")}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-lg border-l-4 ${
              result.severity === "high"
                ? "border-red-500 bg-red-50"
                : result.severity === "medium"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-green-500 bg-green-50"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-3 ${
                result.severity === "high"
                  ? "text-red-700"
                  : result.severity === "medium"
                    ? "text-yellow-700"
                    : "text-green-700"
              }`}
            >
              {t("resultTitle")}
            </h3>
            <p className="text-gray-700 leading-relaxed">{result.advice}</p>
          </div>

          {result.needConsult && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-700 font-medium">{t("consultAdvice")}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetAssessment}
              className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              {t("resetButton")}
            </button>
            <a
              href={`/${locale}/teen-health`}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:from-pink-600 hover:to-pink-700 transition-all"
            >
              {t("moreInfoButton")}
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>{t("disclaimer")}</p>
      </div>
    </div>
  );
}
