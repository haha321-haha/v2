import { useState, useCallback } from "react";
import type {
  SymptomItem,
  AssessmentResult,
} from "../types/medical-care-guide";

// 基于souW1e2的症状检查逻辑
export function useSymptomChecker(symptoms: SymptomItem[]) {
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 切换症状选择状态
  const toggleSymptom = useCallback((symptomId: string) => {
    setCheckedSymptoms((prev) => {
      const isCurrentlyChecked = prev.includes(symptomId);

      if (isCurrentlyChecked) {
        return prev.filter((id) => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });

    // 清除之前的分析结果
    setAssessmentResult(null);
  }, []);

  // 分析症状
  const analyzeSymptoms = useCallback((): AssessmentResult => {
    if (checkedSymptoms.length === 0) {
      throw new Error("No symptoms selected for analysis");
    }

    setIsAnalyzing(true);

    try {
      const checkedSymptomItems = symptoms.filter((s) =>
        checkedSymptoms.includes(s.id),
      );

      // 基于souW1e2的风险评估算法
      const riskAnalysis = analyzeRiskLevel(checkedSymptomItems);

      const result: AssessmentResult = {
        painLevel: 0, // 将由疼痛评估工具提供
        symptoms: checkedSymptoms,
        riskLevel: riskAnalysis.riskLevel,
        recommendations: riskAnalysis.recommendations,
        shouldSeeDoctor: riskAnalysis.shouldSeeDoctor,
        urgency: riskAnalysis.urgency,
        timestamp: new Date().toISOString(),
      };

      setAssessmentResult(result);
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  }, [checkedSymptoms, symptoms]);

  // 重置评估
  const resetAssessment = useCallback(() => {
    setCheckedSymptoms([]);
    setAssessmentResult(null);
    setIsAnalyzing(false);
  }, []);

  // 获取症状统计信息
  const getSymptomStatistics = useCallback(() => {
    const checkedSymptomItems = symptoms.filter((s) =>
      checkedSymptoms.includes(s.id),
    );

    const emergencyCount = checkedSymptomItems.filter(
      (s) => s.risk === "emergency",
    ).length;
    const highRiskCount = checkedSymptomItems.filter(
      (s) => s.risk === "high",
    ).length;
    const mediumRiskCount = checkedSymptomItems.filter(
      (s) => s.risk === "medium",
    ).length;

    const categoryCount = checkedSymptomItems.reduce(
      (acc, symptom) => {
        acc[symptom.category] = (acc[symptom.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: checkedSymptoms.length,
      emergency: emergencyCount,
      high: highRiskCount,
      medium: mediumRiskCount,
      byCategory: categoryCount,
    };
  }, [checkedSymptoms, symptoms]);

  // 获取建议的下一步行动
  const getNextStepRecommendations = useCallback(() => {
    if (!assessmentResult) return [];

    const recommendations = [];

    switch (assessmentResult.riskLevel) {
      case "emergency":
        recommendations.push(
          "symptomChecker.results.actions.emergency.0",
          "symptomChecker.results.actions.emergency.2",
          "symptomChecker.results.actions.emergency.1",
          "symptomChecker.results.actions.emergency.3",
        );
        break;

      case "high":
        recommendations.push(
          "symptomChecker.results.actions.high.0",
          "symptomChecker.results.actions.high.1",
          "symptomChecker.results.actions.high.2",
          "symptomChecker.results.actions.high.3",
        );
        break;

      case "medium":
        recommendations.push(
          "symptomChecker.results.actions.medium.0",
          "symptomChecker.results.actions.medium.1",
          "symptomChecker.results.actions.medium.2",
          "symptomChecker.results.actions.medium.3",
        );
        break;

      case "low":
        recommendations.push(
          "symptomChecker.results.actions.low.0",
          "symptomChecker.results.actions.low.1",
          "symptomChecker.results.actions.low.2",
          "symptomChecker.results.actions.low.3",
        );
        break;
    }

    return recommendations;
  }, [assessmentResult]);

  return {
    checkedSymptoms,
    assessmentResult,
    isAnalyzing,
    toggleSymptom,
    analyzeSymptoms,
    resetAssessment,
    getSymptomStatistics,
    getNextStepRecommendations,
  };
}

// 风险评估算法 - 基于souW1e2的逻辑
function analyzeRiskLevel(symptoms: SymptomItem[]) {
  const emergencySymptoms = symptoms.filter((s) => s.risk === "emergency");
  const highRiskSymptoms = symptoms.filter((s) => s.risk === "high");
  const mediumRiskSymptoms = symptoms.filter((s) => s.risk === "medium");

  // 紧急情况：任何紧急症状
  if (emergencySymptoms.length > 0) {
    return {
      riskLevel: "emergency" as const,
      shouldSeeDoctor: true,
      urgency: "immediate" as const,
      recommendations: [
        "symptomChecker.results.actions.emergency.0",
        "symptomChecker.results.actions.emergency.1",
        "symptomChecker.results.actions.emergency.2",
        "symptomChecker.results.actions.emergency.3",
      ],
    };
  }

  // 高风险：2个或更多高风险症状，或高风险+中风险症状组合
  if (
    highRiskSymptoms.length >= 2 ||
    (highRiskSymptoms.length >= 1 && mediumRiskSymptoms.length >= 2)
  ) {
    return {
      riskLevel: "high" as const,
      shouldSeeDoctor: true,
      urgency: "within_week" as const,
      recommendations: [
        "symptomChecker.results.actions.high.0",
        "symptomChecker.results.actions.high.1",
        "symptomChecker.results.actions.high.2",
        "symptomChecker.results.actions.high.3",
      ],
    };
  }

  // 中等风险：1个高风险症状或多个中风险症状
  if (highRiskSymptoms.length === 1 || mediumRiskSymptoms.length >= 2) {
    return {
      riskLevel: "medium" as const,
      shouldSeeDoctor: true,
      urgency: "routine" as const,
      recommendations: [
        "symptomChecker.results.actions.medium.0",
        "symptomChecker.results.actions.medium.1",
        "symptomChecker.results.actions.medium.2",
        "symptomChecker.results.actions.medium.3",
      ],
    };
  }

  // 低风险：只有中风险症状或无症状
  return {
    riskLevel: "low" as const,
    shouldSeeDoctor: false,
    urgency: "monitor" as const,
    recommendations: [
      "symptomChecker.results.actions.low.0",
      "symptomChecker.results.actions.low.1",
      "symptomChecker.results.actions.low.2",
      "symptomChecker.results.actions.low.3",
    ],
  };
}

// 生成个性化建议
export function generatePersonalizedRecommendations(
  symptoms: SymptomItem[],
  checkedSymptomIds: string[],
): string[] {
  const checkedSymptoms = symptoms.filter((s) =>
    checkedSymptomIds.includes(s.id),
  );
  const recommendations = new Set<string>();

  // 基于症状类别的建议
  const categoryRecommendations = {
    pain: [
      "symptomChecker.personalizedRecommendations.pain.0",
      "symptomChecker.personalizedRecommendations.pain.1",
      "symptomChecker.personalizedRecommendations.pain.2",
    ],
    bleeding: [
      "symptomChecker.personalizedRecommendations.bleeding.0",
      "symptomChecker.personalizedRecommendations.bleeding.1",
      "symptomChecker.personalizedRecommendations.bleeding.2",
    ],
    systemic: [
      "symptomChecker.personalizedRecommendations.systemic.0",
      "symptomChecker.personalizedRecommendations.systemic.1",
      "symptomChecker.personalizedRecommendations.systemic.2",
    ],
    pattern: [
      "symptomChecker.personalizedRecommendations.pattern.0",
      "symptomChecker.personalizedRecommendations.pattern.1",
      "symptomChecker.personalizedRecommendations.pattern.2",
    ],
  };

  // 添加基于症状类别的建议
  checkedSymptoms.forEach((symptom) => {
    const categoryRecs = categoryRecommendations[symptom.category] || [];
    categoryRecs.forEach((rec) => recommendations.add(rec));
  });

  // 基于风险等级的通用建议
  const hasEmergencySymptoms = checkedSymptoms.some(
    (s) => s.risk === "emergency",
  );
  const hasHighRiskSymptoms = checkedSymptoms.some((s) => s.risk === "high");

  if (hasEmergencySymptoms) {
    recommendations.add("symptomChecker.results.actions.emergency.0");
    recommendations.add("symptomChecker.results.actions.emergency.1");
  } else if (hasHighRiskSymptoms) {
    recommendations.add("symptomChecker.results.actions.high.0");
    recommendations.add("symptomChecker.results.actions.high.2");
  } else {
    recommendations.add("symptomChecker.personalizedRecommendations.general.0");
    recommendations.add("symptomChecker.personalizedRecommendations.general.1");
  }

  return Array.from(recommendations);
}
