"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Activity,
  Heart,
  Zap,
  Star,
  CheckCircle,
} from "lucide-react";

interface UserProfile {
  id: string;
  age: number;
  cycleLength: number;
  painLevel: number;
  lifestyle: {
    exercise: "low" | "moderate" | "high";
    stress: "low" | "moderate" | "high";
    diet: "poor" | "average" | "excellent";
    sleep: "poor" | "average" | "excellent";
  };
  medicalHistory: string[];
  preferences: {
    naturalRemedies: boolean;
    medications: boolean;
    lifestyleChanges: boolean;
    alternativeTherapies: boolean;
  };
}

interface Recommendation {
  id: string;
  type: "treatment" | "lifestyle" | "prevention" | "emergency";
  title: string;
  description: string;
  effectiveness: number;
  confidence: number;
  priority: "high" | "medium" | "low";
  timeframe: string;
  actionSteps: string[];
  contraindications?: string[];
  scientificEvidence: {
    studies: number;
    effectiveness: number;
    safety: number;
  };
}

interface RecommendationWithMatch extends Recommendation {
  matchScore: number;
}

interface AssessmentRecord {
  id: string;
  painLevel: number;
  timestamp?: string;
  notes?: string;
  symptoms?: string[];
}

interface PersonalizedRecommendationEngineProps {
  userProfile: UserProfile;
  assessmentHistory: AssessmentRecord[];
  onRecommendationUpdate?: (recommendations: RecommendationWithMatch[]) => void;
}

// AI推荐算法核心
class RecommendationEngine {
  private userProfile: UserProfile;
  private assessmentHistory: AssessmentRecord[];

  constructor(userProfile: UserProfile, assessmentHistory: AssessmentRecord[]) {
    this.userProfile = userProfile;
    this.assessmentHistory = assessmentHistory;
  }

  // 计算疼痛模式
  private calculatePainPattern(): {
    pattern: string;
    severity: number;
    triggers: string[];
  } {
    const recentAssessments = this.assessmentHistory.slice(-6); // 最近6次评估
    const avgPain =
      recentAssessments.reduce(
        (sum, assessment) => sum + assessment.painLevel,
        0,
      ) / Math.max(1, recentAssessments.length);

    let pattern = "moderate";
    if (avgPain >= 8) pattern = "severe";
    else if (avgPain <= 4) pattern = "mild";

    const triggers = [];
    if (this.userProfile.lifestyle.stress === "high") triggers.push("stress");
    if (this.userProfile.lifestyle.exercise === "low")
      triggers.push("sedentary");
    if (this.userProfile.lifestyle.diet === "poor") triggers.push("diet");

    return { pattern, severity: avgPain, triggers };
  }

  // 生成个性化推荐
  generateRecommendations(): Recommendation[] {
    const painPattern = this.calculatePainPattern();
    const recommendations: Recommendation[] = [];

    // 基于疼痛严重程度的推荐
    if (painPattern.severity >= 7) {
      recommendations.push({
        id: "heat-therapy-advanced",
        type: "treatment",
        title: "高级热敷疗法",
        description: "结合电热毯和热敷贴的综合热疗方案，特别适合重度疼痛",
        effectiveness: 0.85,
        confidence: 0.92,
        priority: "high",
        timeframe: "立即开始",
        actionSteps: [
          "使用电热毯预热床铺15分钟",
          "在疼痛区域贴上ThermaCare热敷贴",
          "保持热敷30-45分钟",
          "每小时重复一次",
        ],
        scientificEvidence: {
          studies: 12,
          effectiveness: 0.87,
          safety: 0.95,
        },
      });
    }

    // 基于生活方式的推荐
    if (this.userProfile.lifestyle.exercise === "low") {
      recommendations.push({
        id: "exercise-program",
        type: "lifestyle",
        title: "个性化运动计划",
        description: "基于您的身体状况设计的低强度运动方案，逐步改善疼痛",
        effectiveness: 0.78,
        confidence: 0.88,
        priority: "medium",
        timeframe: "2-4周见效",
        actionSteps: [
          "每天进行10分钟温和拉伸",
          "每周3次20分钟低强度有氧运动",
          "学习盆底肌训练",
          "逐步增加运动强度",
        ],
        scientificEvidence: {
          studies: 8,
          effectiveness: 0.82,
          safety: 0.98,
        },
      });
    }

    // 基于压力的推荐
    if (this.userProfile.lifestyle.stress === "high") {
      recommendations.push({
        id: "stress-management",
        type: "lifestyle",
        title: "压力管理方案",
        description: "结合正念冥想和呼吸练习的综合压力缓解方案",
        effectiveness: 0.72,
        confidence: 0.85,
        priority: "high",
        timeframe: "1-2周见效",
        actionSteps: [
          "每天进行10分钟正念冥想",
          "学习4-7-8呼吸法",
          "建立规律的睡眠时间",
          "减少咖啡因摄入",
        ],
        scientificEvidence: {
          studies: 15,
          effectiveness: 0.79,
          safety: 0.99,
        },
      });
    }

    // 基于饮食的推荐
    if (this.userProfile.lifestyle.diet === "poor") {
      recommendations.push({
        id: "anti-inflammatory-diet",
        type: "lifestyle",
        title: "抗炎饮食计划",
        description: "富含Omega-3和抗炎成分的饮食方案，减少炎症反应",
        effectiveness: 0.68,
        confidence: 0.82,
        priority: "medium",
        timeframe: "3-4周见效",
        actionSteps: [
          "增加深海鱼类摄入",
          "多吃深色蔬菜和浆果",
          "减少精制糖和加工食品",
          "补充镁和维生素D",
        ],
        scientificEvidence: {
          studies: 6,
          effectiveness: 0.74,
          safety: 0.97,
        },
      });
    }

    // 预防性推荐
    recommendations.push({
      id: "preventive-care",
      type: "prevention",
      title: "预防性护理方案",
      description: "基于您的周期模式制定的预防性疼痛管理策略",
      effectiveness: 0.81,
      confidence: 0.89,
      priority: "high",
      timeframe: "持续进行",
      actionSteps: [
        "在预计疼痛前2天开始预防性热敷",
        "调整睡眠和饮食规律",
        "避免高强度活动",
        "保持情绪稳定",
      ],
      scientificEvidence: {
        studies: 10,
        effectiveness: 0.83,
        safety: 0.96,
      },
    });

    // 紧急缓解推荐
    recommendations.push({
      id: "emergency-relief",
      type: "emergency",
      title: "紧急疼痛缓解",
      description: "针对急性疼痛的快速缓解方案",
      effectiveness: 0.9,
      confidence: 0.94,
      priority: "high",
      timeframe: "15-30分钟见效",
      actionSteps: [
        "立即使用最强效热敷",
        "服用推荐剂量的止痛药",
        "进行深呼吸和放松练习",
        "寻求医疗帮助（如需要）",
      ],
      contraindications: ["对NSAIDs过敏", "胃溃疡病史"],
      scientificEvidence: {
        studies: 20,
        effectiveness: 0.91,
        safety: 0.88,
      },
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // 计算推荐匹配度
  calculateMatchScore(recommendation: Recommendation): number {
    let score = 0;

    // 基于用户偏好的匹配
    if (
      recommendation.type === "lifestyle" &&
      this.userProfile.preferences.lifestyleChanges
    )
      score += 0.3;
    if (
      recommendation.type === "treatment" &&
      this.userProfile.preferences.naturalRemedies
    )
      score += 0.2;

    // 基于疼痛模式的匹配
    const painPattern = this.calculatePainPattern();
    if (painPattern.severity >= 7 && recommendation.priority === "high")
      score += 0.3;
    if (
      painPattern.triggers.includes("stress") &&
      recommendation.id === "stress-management"
    )
      score += 0.2;

    return Math.min(score, 1.0);
  }
}

export default function PersonalizedRecommendationEngine({
  userProfile,
  assessmentHistory,
  onRecommendationUpdate,
}: PersonalizedRecommendationEngineProps) {
  const t = useTranslations("interactiveTools.recommendations");
  const [recommendations, setRecommendations] = useState<
    RecommendationWithMatch[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "treatment" | "lifestyle" | "prevention" | "emergency"
  >("all");

  useEffect(() => {
    const engine = new RecommendationEngine(userProfile, assessmentHistory);
    const generatedRecommendations = engine.generateRecommendations();

    // 计算匹配度
    const recommendationsWithMatch: RecommendationWithMatch[] =
      generatedRecommendations.map((rec) => ({
        ...rec,
        matchScore: engine.calculateMatchScore(rec),
      }));

    setRecommendations(recommendationsWithMatch);
    setLoading(false);

    if (onRecommendationUpdate) {
      onRecommendationUpdate(recommendationsWithMatch);
    }
  }, [userProfile, assessmentHistory, onRecommendationUpdate]);

  const filteredRecommendations = useMemo(() => {
    if (selectedCategory === "all") return recommendations;
    return recommendations.filter((rec) => rec.type === selectedCategory);
  }, [recommendations, selectedCategory]);

  const categoryStats = useMemo(() => {
    const stats = {
      all: recommendations.length,
      treatment: recommendations.filter((r) => r.type === "treatment").length,
      lifestyle: recommendations.filter((r) => r.type === "lifestyle").length,
      prevention: recommendations.filter((r) => r.type === "prevention").length,
      emergency: recommendations.filter((r) => r.type === "emergency").length,
    };
    return stats;
  }, [recommendations]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和统计 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            {t("title")}
          </h2>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-gray-500 mb-2">
            {t("totalRecommendations")}: {categoryStats.all}
          </div>
          <div className="flex space-x-2">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div
                key={category}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {category}: {count}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 分类筛选器 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(
          ["all", "treatment", "lifestyle", "prevention", "emergency"] as const
        ).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t(`categories.${category}`)}
          </button>
        ))}
      </div>

      {/* 推荐列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            {/* 推荐头部 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {recommendation.type === "treatment" && (
                  <Heart className="w-5 h-5 text-red-500" />
                )}
                {recommendation.type === "lifestyle" && (
                  <Activity className="w-5 h-5 text-green-500" />
                )}
                {recommendation.type === "prevention" && (
                  <Target className="w-5 h-5 text-blue-500" />
                )}
                {recommendation.type === "emergency" && (
                  <Zap className="w-5 h-5 text-orange-500" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {recommendation.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recommendation.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : recommendation.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {t(`priority.${recommendation.priority}`)}
                </span>
                <div className="flex items-center text-xs text-purple-600">
                  <Star className="w-3 h-3 mr-1" />
                  {Math.round(recommendation.matchScore * 100)}%
                </div>
              </div>
            </div>

            {/* 推荐描述 */}
            <p className="text-gray-700 mb-4">{recommendation.description}</p>

            {/* 效果指标 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(recommendation.effectiveness * 100)}%
                </div>
                <div className="text-xs text-gray-600">
                  {t("metrics.effectiveness")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Math.round(recommendation.confidence * 100)}%
                </div>
                <div className="text-xs text-gray-600">
                  {t("metrics.confidence")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {recommendation.scientificEvidence.studies}
                </div>
                <div className="text-xs text-gray-600">
                  {t("metrics.studies")}
                </div>
              </div>
            </div>

            {/* 行动步骤 */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                {t("actionSteps")}
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {recommendation.actionSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* 时间框架 */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {recommendation.timeframe}
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                {t("startImplementation")}
              </button>
            </div>

            {/* 禁忌症 */}
            {recommendation.contraindications && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-1">
                  {t("precautions")}
                </h5>
                <ul className="text-sm text-yellow-700">
                  {recommendation.contraindications.map(
                    (contraindication, index) => (
                      <li key={index}>• {contraindication}</li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 科学证据总结 */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          {t("scientificEvidence")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {recommendations.reduce(
                (sum, rec) => sum + rec.scientificEvidence.studies,
                0,
              )}
            </div>
            <div className="text-sm text-blue-700">{t("totalStudies")}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                (recommendations.reduce(
                  (sum, rec) => sum + rec.scientificEvidence.effectiveness,
                  0,
                ) /
                  recommendations.length) *
                  100,
              )}
              %
            </div>
            <div className="text-sm text-green-700">
              {t("averageEffectiveness")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                (recommendations.reduce(
                  (sum, rec) => sum + rec.scientificEvidence.safety,
                  0,
                ) /
                  recommendations.length) *
                  100,
              )}
              %
            </div>
            <div className="text-sm text-purple-700">{t("averageSafety")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
