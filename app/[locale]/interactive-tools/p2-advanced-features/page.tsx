"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Brain,
  Users,
  Cloud,
  FileText,
  Award,
  Shield,
  Activity,
  Zap,
  CheckCircle,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// 动态导入P2组件 - 代码分割优化
import dynamic from "next/dynamic";

const AnalyticsDashboard = dynamic(
  () => import("../shared/components/AnalyticsDashboard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const PersonalizedRecommendationEngine = dynamic(
  () => import("../shared/components/PersonalizedRecommendationEngine"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const SocialFeatures = dynamic(
  () => import("../shared/components/SocialFeatures"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const DataSync = dynamic(() => import("../shared/components/DataSync"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const ReportGenerator = dynamic(
  () => import("../shared/components/ReportGenerator"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

type P2FeatureId = "analytics" | "ai" | "social" | "sync" | "reports";

interface P2AdvancedFeaturesProps {
  locale: string;
  userId?: string;
}

export default function P2AdvancedFeatures({
  locale,
  userId,
}: P2AdvancedFeaturesProps) {
  const t = useTranslations("interactiveTools");
  const [activeFeature, setActiveFeature] = useState<P2FeatureId>("analytics");
  const [userProfile] = useState({
    id: userId || "demo-user",
    age: 28,
    cycleLength: 28,
    painLevel: 6.8,
    lifestyle: {
      exercise: "moderate" as const,
      stress: "moderate" as const,
      diet: "average" as const,
      sleep: "average" as const,
    },
    medicalHistory: [],
    preferences: {
      naturalRemedies: true,
      medications: true,
      lifestyleChanges: true,
      alternativeTherapies: true,
    },
  });

  interface FeatureStats {
    charts?: number;
    insights?: number;
    accuracy?: string;
    algorithms?: number;
    studies?: number;
    members?: string;
    posts?: string;
    groups?: number;
    devices?: number;
    uptime?: string;
    security?: string;
    formats?: number;
    templates?: number;
    exports?: string;
  }

  interface FeatureConfig {
    id: P2FeatureId;
    title: string;
    description: string;
    icon: LucideIcon;
    color: "blue" | "purple" | "green" | "indigo" | "emerald";
    stats: FeatureStats;
  }

  const features: FeatureConfig[] = [
    {
      id: "analytics",
      title: t("p2.features.analytics.title"),
      description: t("p2.features.analytics.description"),
      icon: BarChart3,
      color: "blue",
      stats: { charts: 5, insights: 12, accuracy: "95%" },
    },
    {
      id: "ai",
      title: t("p2.features.ai.title"),
      description: t("p2.features.ai.description"),
      icon: Brain,
      color: "purple",
      stats: { algorithms: 8, accuracy: "92%", studies: 50 },
    },
    {
      id: "social",
      title: t("p2.features.social.title"),
      description: t("p2.features.social.description"),
      icon: Users,
      color: "green",
      stats: { members: "10K+", posts: "5K+", groups: 25 },
    },
    {
      id: "sync",
      title: t("p2.features.sync.title"),
      description: t("p2.features.sync.description"),
      icon: Cloud,
      color: "indigo",
      stats: { devices: 3, uptime: "99.9%", security: "A+" },
    },
    {
      id: "reports",
      title: t("p2.features.reports.title"),
      description: t("p2.features.reports.description"),
      icon: FileText,
      color: "emerald",
      stats: { formats: 3, templates: 12, exports: "PDF/HTML" },
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      green: "from-green-500 to-green-600",
      indigo: "from-indigo-500 to-indigo-600",
      emerald: "from-emerald-500 to-emerald-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBgColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-50 to-blue-100",
      purple: "from-purple-50 to-purple-100",
      green: "from-green-50 to-green-100",
      indigo: "from-indigo-50 to-indigo-100",
      emerald: "from-emerald-50 to-emerald-100",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            {t("p2.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up">
            {t("p2.description")}
          </p>
        </div>

        {/* 功能导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.id;

              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${getColorClasses(
                          feature.color,
                        )} text-white shadow-lg`
                      : `bg-gradient-to-r ${getBgColorClasses(
                          feature.color,
                        )} text-gray-700 hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive ? "bg-white/20" : "bg-white/50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs opacity-80">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 功能统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;

            return (
              <div
                key={feature.id}
                className={`rounded-lg p-4 transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${getColorClasses(
                        feature.color,
                      )} text-white shadow-lg transform scale-105`
                    : `bg-white border border-gray-200 hover:shadow-md`
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />
                  {isActive && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <h4
                  className={`font-semibold text-sm mb-2 ${
                    isActive ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h4>
                <div className="space-y-1">
                  {Object.entries(feature.stats).map(([key, value]) => (
                    <div
                      key={key}
                      className={`text-xs ${
                        isActive ? "text-white/80" : "text-gray-600"
                      }`}
                    >
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 功能内容区域 */}
        <div className="animate-fade-in">
          {activeFeature === "analytics" && (
            <AnalyticsDashboard locale={locale} userId={userId} />
          )}

          {activeFeature === "ai" && (
            <PersonalizedRecommendationEngine
              userProfile={userProfile}
              assessmentHistory={[]}
            />
          )}

          {activeFeature === "social" && (
            <SocialFeatures locale={locale} userId={userId} />
          )}

          {activeFeature === "sync" && (
            <DataSync locale={locale} userId={userId} />
          )}

          {activeFeature === "reports" && <ReportGenerator locale={locale} />}
        </div>

        {/* 底部行动号召 */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t("p2.cta.title")}</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t("p2.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                {t("p2.cta.getStarted")}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                {t("p2.cta.shareWithFriends")}
              </button>
            </div>
          </div>
        </div>

        {/* 技术特性展示 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("p2.technicalFeatures.security.title")}
            </h3>
            <p className="text-gray-600">
              {t("p2.technicalFeatures.security.description")}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("p2.technicalFeatures.performance.title")}
            </h3>
            <p className="text-gray-600">
              {t("p2.technicalFeatures.performance.description")}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("p2.technicalFeatures.validation.title")}
            </h3>
            <p className="text-gray-600">
              {t("p2.technicalFeatures.validation.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
