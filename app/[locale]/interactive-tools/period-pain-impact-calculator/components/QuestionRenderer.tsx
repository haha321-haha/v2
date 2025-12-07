"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Question, AssessmentAnswer } from "../types";

interface QuestionRendererProps {
  question: Question;
  answer?: AssessmentAnswer;
  onAnswer: (answer: AssessmentAnswer) => void;
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: QuestionRendererProps) {
  const t = useTranslations("periodPainImpactCalculator");
  const handleChange = (value: string | number | string[] | boolean) => {
    onAnswer({
      questionId: question.id,
      value,
      timestamp: new Date().toISOString(),
    });
  };

  // 渲染单选问题
  if (question.type === "single") {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label
              key={option.value.toString()}
              className="flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-purple-50 hover:border-purple-300"
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={answer?.value === option.value}
                onChange={(e) => handleChange(e.target.value)}
                className="mr-3"
              />
              <span className="flex-1">
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // 渲染多选问题
  if (question.type === "multiple") {
    const selectedValues = Array.isArray(answer?.value) ? answer.value : [];
    const hasNoneSelected = selectedValues.includes("none");
    const hasOtherSelected = selectedValues.some((v) => v !== "none");

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        <div className="space-y-2">
          {question.options?.map((option) => {
            const isNone = option.value === "none";
            const isSelected = selectedValues.includes(option.value.toString());
            const isDisabled = isNone
              ? hasOtherSelected // 如果选择了其他选项，禁用"以上都没有"
              : hasNoneSelected; // 如果选择了"以上都没有"，禁用其他选项

            return (
              <label
                key={option.value.toString()}
                className={`flex items-center p-3 border rounded-lg transition-colors ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "cursor-pointer hover:bg-purple-50 hover:border-purple-300"
                }`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={(e) => {
                    if (isDisabled) return;

                    if (isNone) {
                      // 选择"以上都没有"时，清除所有其他选项
                      handleChange(["none"]);
                    } else {
                      // 选择其他选项时，清除"以上都没有"
                      const newValue = e.target.checked
                        ? [
                            ...selectedValues.filter((v) => v !== "none"),
                            option.value.toString(),
                          ]
                        : selectedValues.filter(
                            (v) => v !== option.value.toString(),
                          );
                      handleChange(newValue.length > 0 ? newValue : []);
                    }
                  }}
                  className="mr-3"
                />
                <span className="flex-1">
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // 渲染评分问题
  if (question.type === "scale") {
    const currentValue = typeof answer?.value === "number" ? answer.value : 1;

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        <div className="space-y-3">
          <div className="flex justify-between items-center space-x-2">
            {question.options?.map((option) => (
              <button
                key={option.value.toString()}
                type="button"
                onClick={() => handleChange(option.value)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  currentValue === option.value
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-800 border-gray-300 hover:border-purple-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{t("question.scale.mild")}</span>
            <span>{t("question.scale.moderate")}</span>
            <span>{t("question.scale.severe")}</span>
          </div>
        </div>
      </div>
    );
  }

  // 渲染文本输入问题（预留）
  if (question.type === "text") {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        <textarea
          value={typeof answer?.value === "string" ? answer.value : ""}
          onChange={(e) => handleChange(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
    );
  }

  // 渲染范围选择问题（预留）
  if (question.type === "range") {
    const currentValue =
      typeof answer?.value === "number"
        ? answer.value
        : question.validation?.min || 0;

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        <input
          type="range"
          min={question.validation?.min || 0}
          max={question.validation?.max || 10}
          value={currentValue}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-center text-lg font-semibold text-purple-600 mt-2">
          {currentValue}
        </div>
      </div>
    );
  }

  // 渲染布尔选择问题（预留）
  if (question.type === "boolean") {
    const currentValue =
      typeof answer?.value === "boolean" ? answer.value : false;

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleChange(true)}
            className={`px-6 py-3 rounded-lg border-2 transition-colors ${
              currentValue === true
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-800 border-gray-300 hover:border-purple-300"
            }`}
          >
            {t("question.boolean.yes")}
          </button>
          <button
            type="button"
            onClick={() => handleChange(false)}
            className={`px-6 py-3 rounded-lg border-2 transition-colors ${
              currentValue === false
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-800 border-gray-300 hover:border-purple-300"
            }`}
          >
            {t("question.boolean.no")}
          </button>
        </div>
      </div>
    );
  }

  // 默认渲染
  return <div className="text-red-600">{t("question.unsupported")}</div>;
}
