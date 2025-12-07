"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, BarChart3, Users, Clock, CheckCircle } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export default function WelcomeScreen({ onStart, onBack }: WelcomeScreenProps) {
  const t = useTranslations("interactiveTools.workplaceAssessment");
  const commonT = useTranslations("common");

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

      {/* 主内容 */}
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title") || "职场影响评估"}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle") ||
              "了解您的症状如何影响工作，有助于找到有效的支持措施。"}
          </p>
        </div>

        {/* 功能特点 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("features.assessment") || "专业评估"}
            </h3>
            <p className="text-sm text-gray-600">
              {t("features.assessmentDesc") || "4个专业问题，全面评估工作影响"}
            </p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("features.quick") || "快速便捷"}
            </h3>
            <p className="text-sm text-gray-600">
              {t("features.quickDesc") || "仅需3-5分钟，获得专业分析"}
            </p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("features.personalized") || "个性化建议"}
            </h3>
            <p className="text-sm text-gray-600">
              {t("features.personalizedDesc") || "基于评估结果提供针对性建议"}
            </p>
          </div>
        </div>

        {/* 开始按钮 */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {t("startButton") || "开始评估"}
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
