"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PHQ9_QUESTIONS } from "@/data/phq9-questions";
import { PHQ9Utils, type PHQ9Answer, type PHQ9Result } from "@/lib/phq9-types";

interface PHQ9AssessmentProps {
  onComplete: (result: PHQ9Result) => void;
  onPrevious?: () => void;
  className?: string;
}

export function PHQ9Assessment({
  onComplete,
  onPrevious,
  className = "",
}: PHQ9AssessmentProps) {
  const t = useTranslations("phq9");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<PHQ9Answer[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleAnswer = (value: number) => {
    const question = PHQ9_QUESTIONS[currentQuestion];
    // 将 question.id (string) 转换为 number，使用 order 字段
    const questionId = question.order;
    const newAnswer: PHQ9Answer = {
      questionId,
      score: value, // 使用 score 而不是 value
    };

    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(
      (a) => a.questionId === questionId,
    );

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = newAnswer;
    } else {
      newAnswers.push(newAnswer);
    }

    setAnswers(newAnswers);

    // Move to next question or complete
    if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Complete assessment
      setIsCompleting(true);
      setTimeout(() => {
        const result = PHQ9Utils.generateResult(newAnswers);
        onComplete(result);
      }, 1000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (onPrevious) {
      onPrevious();
    }
  };

  const progress = ((currentQuestion + 1) / PHQ9_QUESTIONS.length) * 100;
  const currentQ = PHQ9_QUESTIONS[currentQuestion];
  const currentAnswer = answers.find((a) => a.questionId === currentQ.order);

  if (isCompleting) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("completing")}
          </h2>
          <p className="text-gray-600">{t("calculatingResults")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {t("question")} {currentQuestion + 1} / {PHQ9_QUESTIONS.length}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
          <span className="text-2xl font-bold text-white">
            {currentQuestion + 1}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
          {currentQ.text}
        </h2>

        <p className="text-gray-600 mb-6">{t("timeframe")}</p>

        {/* Medical Disclaimer for sensitive questions */}
        {currentQ.id === "phq9_9" && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <p className="text-red-800 text-sm">
              <strong>{t("disclaimer")}:</strong> {t("sensitiveQuestion")}
            </p>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.value)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:shadow-md ${
              currentAnswer?.score === option.value
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  currentAnswer?.score === option.value
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {currentAnswer?.score === option.value && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-gray-800 font-medium text-lg">
                    {option.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  {option.originalLabel}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          ← {t("previous")}
        </button>
        <div className="flex-1" />
        {onPrevious && currentQuestion === 0 && (
          <button
            onClick={onPrevious}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            {t("exit")}
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>{t("help")}:</strong> {t("helpText")}
        </p>
      </div>
    </div>
  );
}

// PHQ-9 Results Display Component
interface PHQ9ResultsProps {
  result: PHQ9Result;
  onRestart?: () => void;
  onContinue?: () => void;
  className?: string;
}

export function PHQ9Results({
  result,
  onRestart,
  onContinue,
  className = "",
}: PHQ9ResultsProps) {
  const t = useTranslations("phq9");

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "severe":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getLevelEmoji = (level: string) => {
    switch (level) {
      case "none":
        return "😊";
      case "mild":
        return "😐";
      case "moderate":
        return "😟";
      case "moderate-severe":
        return "😰";
      case "severe":
        return "😱";
      default:
        return "🤔";
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
          <span className="text-3xl">📊</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("resultsTitle")}
        </h1>
        <p className="text-gray-600">{t("resultsSubtitle")}</p>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {result.score ?? result.totalScore}
          </div>
          <div className="text-lg text-gray-700 mb-4">
            {t("totalScore")} (0-27)
          </div>
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getRiskColor(
              result.riskLevel ?? "low",
            )}`}
          >
            <span className="text-2xl">
              {getLevelEmoji(result.level ?? result.severity)}
            </span>
            <span className="font-semibold text-lg">
              {result.levelLabel ?? result.severityZh}
            </span>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {t("riskAssessment")}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              {t("riskLevel")}
            </h4>
            <p className="text-gray-600 capitalize">
              {result.riskLevel
                ? t(`risk.${result.riskLevel}`)
                : result.severityZh}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              {t("requiresHelp")}
            </h4>
            <p className="text-gray-600">
              {result.requiresProfessionalHelp ?? false ? t("yes") : t("no")}
            </p>
          </div>
        </div>
      </div>

      {/* Self-harm Warning */}
      {result.hasThoughtsOfSelfHarm === true && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800 mb-2">
                {t("attentionRequired")}
              </h3>
              <p className="text-red-700 text-sm mb-3">
                {t("selfHarmWarning")}
              </p>
              <div className="bg-red-100 p-3 rounded-lg">
                <p className="text-red-800 text-sm font-semibold">
                  {t("crisisResources")}
                </p>
                <p className="text-red-700 text-sm mt-1">
                  {t("crisisHotline")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {t("recommendations")}
        </h3>
        <div className="space-y-3">
          {result.recommendations && result.recommendations.length > 0 ? (
            result.recommendations.map((rec: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
              >
                <span className="text-blue-500 font-bold">•</span>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                {PHQ9Utils.getRecommendation(result.severity, "zh")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Professional Help Prompt */}
      {result.requiresProfessionalHelp === true && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏥</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                {t("seekProfessionalHelp")}
              </h3>
              <p className="text-orange-100 mb-3">
                {t("professionalHelpDesc")}
              </p>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                {t("findProfessional")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onRestart && (
          <button onClick={onRestart} className="flex-1 btn-secondary py-3">
            {t("retakeAssessment")}
          </button>
        )}
        {onContinue && (
          <button onClick={onContinue} className="flex-1 btn-primary py-3">
            {t("continue")}
          </button>
        )}
      </div>

      {/* Medical Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          <strong>{t("disclaimer")}:</strong> {t("medicalDisclaimer")}
        </p>
      </div>
    </div>
  );
}
