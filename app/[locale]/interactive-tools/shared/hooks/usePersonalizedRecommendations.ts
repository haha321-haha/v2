"use client";

import { useState, useCallback } from "react";
import {
  AssessmentHistoryEntry,
  AssessmentTrends,
} from "./useAssessmentHistory";
import { UserPreferences } from "./useUserPreferences";
import { logError } from "@/lib/debug-logger";

export interface PersonalizedRecommendation {
  id: string;
  type:
    | "lifestyle"
    | "medical"
    | "workplace"
    | "dietary"
    | "exercise"
    | "selfcare";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  confidence: number; // 0-100, how confident we are this recommendation is relevant
  reason: string; // Why this recommendation was suggested
  actionSteps: string[];
  timeframe: string;
  category: string;
  personalized: boolean; // Whether this is a personalized recommendation
}

export interface RecommendationContext {
  currentAssessment: AssessmentHistoryEntry | null;
  history: AssessmentHistoryEntry[];
  trends: AssessmentTrends | null;
  preferences: UserPreferences;
  locale: string;
}

export const usePersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<
    PersonalizedRecommendation[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper functions (must be defined before generateRecommendations)
  // Generate base recommendations from current assessment
  const generateBaseRecommendations = useCallback(
    (
      assessment: AssessmentHistoryEntry,
      locale: string,
    ): PersonalizedRecommendation[] => {
      const recs: PersonalizedRecommendation[] = [];
      const isZh = locale === "zh";

      // Severity-based recommendations
      if (
        assessment.severity === "severe" ||
        assessment.severity === "emergency"
      ) {
        recs.push({
          id: "urgent_medical_consultation",
          type: "medical",
          title: isZh ? "紧急医疗咨询建议" : "Urgent Medical Consultation",
          description: isZh
            ? "您的症状严重程度较高，建议尽快咨询医疗专业人士进行详细评估。"
            : "Your symptoms are severe. We recommend consulting a healthcare professional for detailed evaluation.",
          priority: "high",
          confidence: 95,
          reason: isZh
            ? "基于当前评估的严重程度"
            : "Based on current assessment severity",
          actionSteps: [
            isZh
              ? "预约妇科医生或疼痛专科医生"
              : "Schedule appointment with gynecologist or pain specialist",
            isZh ? "准备详细的症状记录" : "Prepare detailed symptom records",
            isZh
              ? "考虑携带本次评估结果"
              : "Consider bringing this assessment result",
          ],
          timeframe: isZh ? "1-3天内" : "Within 1-3 days",
          category: "medical",
          personalized: true,
        });
      }

      // Score-based recommendations
      if (assessment.percentage < 30) {
        recs.push({
          id: "low_impact_management",
          type: "lifestyle",
          title: isZh ? "轻度症状管理" : "Mild Symptom Management",
          description: isZh
            ? "您的症状影响相对较小，可以通过生活方式调整来进一步改善。"
            : "Your symptoms have relatively low impact. Lifestyle adjustments can help improve further.",
          priority: "medium",
          confidence: 80,
          reason: isZh ? "基于评估分数较低" : "Based on low assessment score",
          actionSteps: [
            isZh ? "保持规律作息" : "Maintain regular sleep schedule",
            isZh ? "适度运动" : "Engage in moderate exercise",
            isZh ? "保持健康饮食" : "Maintain healthy diet",
          ],
          timeframe: isZh ? "持续进行" : "Ongoing",
          category: "lifestyle",
          personalized: true,
        });
      }

      return recs;
    },
    [],
  );

  // Generate trend-based recommendations
  const generateTrendBasedRecommendations = useCallback(
    (
      trends: AssessmentTrends,
      locale: string,
    ): PersonalizedRecommendation[] => {
      const recs: PersonalizedRecommendation[] = [];
      const isZh = locale === "zh";

      if (trends.scoreTrend === "declining") {
        recs.push({
          id: "declining_trend_intervention",
          type: "medical",
          title: isZh ? "症状恶化趋势干预" : "Declining Trend Intervention",
          description: isZh
            ? "您的症状有恶化趋势，建议及时寻求医疗帮助。"
            : "Your symptoms show a declining trend. Consider seeking medical help promptly.",
          priority: "high",
          confidence: 85,
          reason: isZh
            ? "基于历史评估趋势分析"
            : "Based on historical assessment trend analysis",
          actionSteps: [
            isZh ? "记录症状变化模式" : "Record symptom change patterns",
            isZh ? "咨询医疗专业人士" : "Consult healthcare professional",
            isZh ? "调整当前治疗方案" : "Adjust current treatment plan",
          ],
          timeframe: isZh ? "1周内" : "Within 1 week",
          category: "medical",
          personalized: true,
        });
      }

      if (trends.assessmentFrequency === "irregular") {
        recs.push({
          id: "regular_monitoring",
          type: "lifestyle",
          title: isZh ? "定期监测建议" : "Regular Monitoring Recommendation",
          description: isZh
            ? "建议定期进行症状评估以更好地跟踪健康状况。"
            : "Consider regular symptom assessments to better track your health status.",
          priority: "medium",
          confidence: 70,
          reason: isZh
            ? "基于评估频率分析"
            : "Based on assessment frequency analysis",
          actionSteps: [
            isZh ? "设定定期评估提醒" : "Set regular assessment reminders",
            isZh ? "记录症状变化" : "Record symptom changes",
            isZh ? "建立健康档案" : "Establish health records",
          ],
          timeframe: isZh ? "持续进行" : "Ongoing",
          category: "lifestyle",
          personalized: true,
        });
      }

      return recs;
    },
    [],
  );

  // Generate history-based recommendations
  const generateHistoryBasedRecommendations = useCallback(
    (
      history: AssessmentHistoryEntry[],
      locale: string,
    ): PersonalizedRecommendation[] => {
      const recs: PersonalizedRecommendation[] = [];
      const isZh = locale === "zh";

      // Analyze common patterns
      const severityPatterns = history.reduce(
        (patterns, entry) => {
          patterns[entry.severity] = (patterns[entry.severity] || 0) + 1;
          return patterns;
        },
        {} as Record<string, number>,
      );

      const mostCommonSeverity = Object.entries(severityPatterns).sort(
        ([, a], [, b]) => b - a,
      )[0]?.[0];

      if (mostCommonSeverity === "moderate" && history.length >= 3) {
        recs.push({
          id: "moderate_pattern_management",
          type: "lifestyle",
          title: isZh
            ? "中度症状模式管理"
            : "Moderate Symptom Pattern Management",
          description: isZh
            ? "您的症状通常处于中度水平，建议建立长期管理策略。"
            : "Your symptoms are typically moderate. Consider establishing long-term management strategies.",
          priority: "medium",
          confidence: 75,
          reason: isZh
            ? "基于历史评估模式分析"
            : "Based on historical assessment pattern analysis",
          actionSteps: [
            isZh ? "制定症状管理计划" : "Develop symptom management plan",
            isZh ? "学习疼痛管理技巧" : "Learn pain management techniques",
            isZh ? "建立支持网络" : "Build support network",
          ],
          timeframe: isZh ? "2-4周内" : "Within 2-4 weeks",
          category: "lifestyle",
          personalized: true,
        });
      }

      return recs;
    },
    [],
  );

  // Generate preference-based recommendations
  const generatePreferenceBasedRecommendations = useCallback(
    (
      preferences: UserPreferences,
      locale: string,
    ): PersonalizedRecommendation[] => {
      const recs: PersonalizedRecommendation[] = [];
      const isZh = locale === "zh";

      if (
        preferences.personalizedRecommendations &&
        !preferences.trackAssessmentHistory
      ) {
        recs.push({
          id: "enable_tracking",
          type: "lifestyle",
          title: isZh
            ? "启用评估历史跟踪"
            : "Enable Assessment History Tracking",
          description: isZh
            ? "启用评估历史跟踪可以获得更个性化的建议。"
            : "Enable assessment history tracking for more personalized recommendations.",
          priority: "low",
          confidence: 60,
          reason: isZh
            ? "基于用户偏好设置"
            : "Based on user preference settings",
          actionSteps: [
            isZh
              ? "在设置中启用历史跟踪"
              : "Enable history tracking in settings",
            isZh
              ? "了解隐私保护措施"
              : "Learn about privacy protection measures",
          ],
          timeframe: isZh ? "立即" : "Immediately",
          category: "lifestyle",
          personalized: true,
        });
      }

      if (preferences.reminderFrequency === "never") {
        recs.push({
          id: "enable_reminders",
          type: "lifestyle",
          title: isZh ? "启用定期提醒" : "Enable Regular Reminders",
          description: isZh
            ? "定期提醒可以帮助您更好地管理症状和健康。"
            : "Regular reminders can help you better manage symptoms and health.",
          priority: "low",
          confidence: 55,
          reason: isZh
            ? "基于提醒频率设置"
            : "Based on reminder frequency settings",
          actionSteps: [
            isZh ? "设置合适的提醒频率" : "Set appropriate reminder frequency",
            isZh ? "选择提醒方式" : "Choose reminder method",
          ],
          timeframe: isZh ? "立即" : "Immediately",
          category: "lifestyle",
          personalized: true,
        });
      }

      return recs;
    },
    [],
  );

  // Remove duplicate recommendations
  const removeDuplicateRecommendations = useCallback(
    (recs: PersonalizedRecommendation[]): PersonalizedRecommendation[] => {
      const seen = new Set<string>();
      return recs.filter((rec) => {
        const key = `${rec.type}-${rec.title}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    },
    [],
  );

  // Generate personalized recommendations based on context
  const generateRecommendations = useCallback(
    async (context: RecommendationContext) => {
      setIsGenerating(true);

      try {
        const personalizedRecs: PersonalizedRecommendation[] = [];

        // Base recommendations from assessment result
        if (context.currentAssessment) {
          const baseRecs = generateBaseRecommendations(
            context.currentAssessment,
            context.locale,
          );
          personalizedRecs.push(...baseRecs);
        }

        // Trend-based recommendations
        if (context.trends) {
          const trendRecs = generateTrendBasedRecommendations(
            context.trends,
            context.locale,
          );
          personalizedRecs.push(...trendRecs);
        }

        // History-based recommendations
        if (context.history.length > 0) {
          const historyRecs = generateHistoryBasedRecommendations(
            context.history,
            context.locale,
          );
          personalizedRecs.push(...historyRecs);
        }

        // Preference-based recommendations
        const preferenceRecs = generatePreferenceBasedRecommendations(
          context.preferences,
          context.locale,
        );
        personalizedRecs.push(...preferenceRecs);

        // Remove duplicates and sort by priority and confidence
        const uniqueRecs = removeDuplicateRecommendations(personalizedRecs);
        const sortedRecs = uniqueRecs.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];

          if (aPriority !== bPriority) {
            return bPriority - aPriority;
          }

          return b.confidence - a.confidence;
        });

        setRecommendations(sortedRecs.slice(0, 10)); // Limit to top 10 recommendations
      } catch (error) {
        logError(
          "Error generating personalized recommendations",
          error,
          "usePersonalizedRecommendations",
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [
      generateBaseRecommendations,
      generateHistoryBasedRecommendations,
      generatePreferenceBasedRecommendations,
      generateTrendBasedRecommendations,
      removeDuplicateRecommendations,
    ],
  );

  // Get recommendations by type
  const getRecommendationsByType = useCallback(
    (type: PersonalizedRecommendation["type"]) => {
      return recommendations.filter((rec) => rec.type === type);
    },
    [recommendations],
  );

  // Get high priority recommendations
  const getHighPriorityRecommendations = useCallback(() => {
    return recommendations.filter((rec) => rec.priority === "high");
  }, [recommendations]);

  // Clear recommendations
  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
  }, []);

  return {
    recommendations,
    isGenerating,
    generateRecommendations,
    getRecommendationsByType,
    getHighPriorityRecommendations,
    clearRecommendations,
  };
};
