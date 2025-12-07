"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface WorkplaceResults {
  score: number;
  profile: string;
  suggestions: string[];
}

interface ResultsScreenProps {
  results: WorkplaceResults | null;
  onRestart: () => void;
  onBack: () => void;
}

export default function ResultsScreen({
  results,
  onRestart,
  onBack,
}: ResultsScreenProps) {
  const t = useTranslations("interactiveTools.workplaceAssessment");
  const commonT = useTranslations("common");

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">正在加载结果...</p>
      </div>
    );
  }

  // 根据评分确定颜色和图标
  const getScoreColor = (score: number) => {
    if (score > 75) return "text-green-600 bg-green-50 border-green-200";
    if (score > 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score > 75) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score > 40) return <Info className="w-8 h-8 text-orange-600" />;
    return <AlertTriangle className="w-8 h-8 text-red-600" />;
  };

  const getScoreText = (score: number) => {
    if (score > 75) return "支持性环境";
    if (score > 40) return "适应性环境";
    return "挑战性环境";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {commonT("back") || "返回"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("resultsTitle") || "评估结果"}
          </h1>
          <p className="text-gray-600">
            {t("resultsSubtitle") || "基于您的回答，我们为您生成了以下分析结果"}
          </p>
        </div>

        {/* 评分卡片 */}
        <div
          className={`rounded-xl border-2 p-6 mb-8 ${getScoreColor(
            results.score,
          )}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getScoreIcon(results.score)}
              <div className="ml-4">
                <h2 className="text-xl font-semibold">职场适应度评分</h2>
                <p className="text-sm opacity-75">
                  {getScoreText(results.score)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{results.score}</div>
              <div className="text-sm opacity-75">分 / 100分</div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-white/50 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-current transition-all duration-1000 ease-out"
              style={{ width: `${results.score}%` }}
            />
          </div>
        </div>

        {/* 建议列表 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t("recommendationsTitle") || "个性化建议"}
          </h3>
          <div className="space-y-4">
            {results.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t("restartButton") || "重新评估"}
          </button>

          <button
            onClick={onBack}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {commonT("back") || "返回主页"}
          </button>
        </div>

        {/* 免责声明 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            {commonT("medicalDisclaimer") ||
              "此评估仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询医生。"}
          </p>
        </div>
      </div>
    </div>
  );
}
