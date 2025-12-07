"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumb";

// 动态导入组件 - 代码分割优化
const PainTrackerTool = dynamic(() => import("../components/PainTrackerTool"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

interface Props {
  params: { locale: string };
}

export default function PainTrackerClient({ params: { locale } }: Props) {
  const t = useTranslations("interactiveTools");
  const anchorT = useTranslations("anchorTexts");
  const breadcrumbT = useTranslations("interactiveTools.breadcrumb");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("painTracker.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("painTracker.description")}
            </p>
          </div>

          {/* 面包屑导航 */}
          <Breadcrumb
            items={[
              {
                label: breadcrumbT("interactiveTools"),
                href: `/${locale}/interactive-tools`,
              },
              { label: breadcrumbT("painTracker") },
            ]}
          />

          {/* 疼痛追踪工具 */}
          <PainTrackerTool locale={locale} />
        </div>
      </div>

      {/* 相关推荐区域 */}
      <div className="bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {/* 相关工具区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {locale === "zh" ? "相关工具" : "Related Tools"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 症状评估工具 */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {locale === "zh"
                          ? "症状评估工具"
                          : "Symptom Assessment Tool"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {locale === "zh"
                          ? "快速评估症状严重程度，配合疼痛追踪制定管理计划，获得个性化建议"
                          : "Quickly assess symptom severity, work with pain tracking to create management plans, get personalized recommendations"}
                      </p>
                      <a
                        href={`/${locale}/interactive-tools/symptom-assessment`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {anchorT("tools.assessment")} &gt;
                      </a>
                    </div>
                  </div>
                </div>

                {/* 智能周期追踪器 */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {locale === "zh"
                          ? "智能周期追踪器"
                          : "Smart Cycle Tracker"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {locale === "zh"
                          ? "追踪月经周期，分析疼痛与周期的关联性，预测疼痛发生时间"
                          : "Track menstrual cycles, analyze pain-cycle correlations, predict pain occurrence times"}
                      </p>
                      <a
                        href={`/${locale}/interactive-tools/cycle-tracker`}
                        className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        {anchorT("tools.tracker")} &gt;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 相关文章区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {locale === "zh"
                  ? "相关疼痛管理文章"
                  : "Related Pain Management Articles"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 5分钟快速缓解痛经方法 */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {locale === "zh"
                          ? "5分钟快速缓解痛经方法"
                          : "5-Minute Quick Period Pain Relief"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {locale === "zh"
                          ? "学习快速缓解痛经的实用技巧，配合疼痛追踪工具使用效果更佳"
                          : "Learn practical techniques for quick period pain relief, works better with pain tracking tools"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {locale === "zh" ? "6分钟阅读" : "6 min read"}
                        </span>
                        <a
                          href={`/${locale}/articles/5-minute-period-pain-relief`}
                          className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium text-sm"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {anchorT("articles.quick_relief")} &gt;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 热疗完全指南 */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {locale === "zh"
                          ? "热疗完全指南"
                          : "Heat Therapy Complete Guide"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {locale === "zh"
                          ? "深入了解热疗原理和正确使用方法，提升疼痛管理效果"
                          : "Deep understanding of heat therapy principles and correct usage methods to improve pain management"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {locale === "zh" ? "8分钟阅读" : "8 min read"}
                        </span>
                        <a
                          href={`/${locale}/articles/heat-therapy-complete-guide`}
                          className="inline-flex items-center text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                            />
                          </svg>
                          {anchorT("articles.heat_therapy")} &gt;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 痛经医疗指南 */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {locale === "zh"
                          ? "痛经医疗指南"
                          : "Medical Guide for Period Pain"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {locale === "zh"
                          ? "识别需要医疗干预的痛经症状，确保及时获得专业帮助"
                          : "Identify period pain symptoms that require medical intervention, ensure timely professional help"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {locale === "zh" ? "10分钟阅读" : "10 min read"}
                        </span>
                        <a
                          href={`/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`}
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                          {anchorT("articles.medical_guide")} &gt;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
