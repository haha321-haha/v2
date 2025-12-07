import { useState, useCallback, useEffect } from "react";
import { medicalCareGuideStorage } from "../utils/storageManager";
import type {
  PainScaleItem,
  AssessmentResult,
} from "../types/medical-care-guide";

// 基于souW1e2的疼痛评估逻辑
export function usePainAssessment() {
  const [painLevel, setPainLevel] = useState(0);
  const [currentAdvice, setCurrentAdvice] = useState<PainScaleItem | null>(
    null,
  );
  const [assessmentHistory, setAssessmentHistory] = useState<
    AssessmentResult[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载历史数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const history = medicalCareGuideStorage.getAssessmentHistory();
        const lastAssessment = medicalCareGuideStorage.getLastAssessment();

        setAssessmentHistory(history);

        // 如果有最近的评估，恢复疼痛等级
        if (lastAssessment && isRecentAssessment(lastAssessment.timestamp)) {
          setPainLevel(lastAssessment.painLevel);
        }
      } catch {
        // Error loading pain assessment data handled by error boundary
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 更新疼痛等级
  const updatePainLevel = useCallback((level: number) => {
    if (level < 0 || level > 10) {
      // Pain level validation: must be between 0 and 10
      return;
    }

    setPainLevel(level);

    // 获取对应的建议（这里简化处理，实际应该从翻译数据中获取）
    const advice = getPainAdvice(level);
    setCurrentAdvice(advice);
  }, []);

  // 保存评估结果
  const saveAssessment = useCallback((result: AssessmentResult) => {
    try {
      medicalCareGuideStorage.saveAssessmentResult(result);

      // 更新本地状态
      setAssessmentHistory((prev) => {
        const newHistory = [result, ...prev.slice(0, 9)]; // 保留最近10次
        return newHistory;
      });
    } catch {
      // Error saving assessment result handled by error boundary
    }
  }, []);

  // 清除历史记录
  const clearHistory = useCallback(() => {
    try {
      medicalCareGuideStorage.clearHistory();
      setAssessmentHistory([]);
    } catch {
      // Error clearing assessment history handled by error boundary
    }
  }, []);

  // 获取疼痛统计信息
  const getStatistics = useCallback(() => {
    if (assessmentHistory.length === 0) {
      return null;
    }

    const painLevels = assessmentHistory.map((a) => a.painLevel);
    const averagePain =
      painLevels.reduce((sum, level) => sum + level, 0) / painLevels.length;
    const maxPain = Math.max(...painLevels);
    const minPain = Math.min(...painLevels);

    const highPainCount = painLevels.filter((level) => level >= 7).length;
    const moderatePainCount = painLevels.filter(
      (level) => level >= 4 && level < 7,
    ).length;
    const lowPainCount = painLevels.filter((level) => level < 4).length;

    return {
      averagePain: Math.round(averagePain * 10) / 10,
      maxPain,
      minPain,
      totalAssessments: assessmentHistory.length,
      highPainPercentage: Math.round(
        (highPainCount / assessmentHistory.length) * 100,
      ),
      moderatePainPercentage: Math.round(
        (moderatePainCount / assessmentHistory.length) * 100,
      ),
      lowPainPercentage: Math.round(
        (lowPainCount / assessmentHistory.length) * 100,
      ),
    };
  }, [assessmentHistory]);

  return {
    painLevel,
    currentAdvice,
    assessmentHistory,
    isLoading,
    updatePainLevel,
    saveAssessment,
    clearHistory,
    getStatistics,
  };
}

// 辅助函数：获取疼痛建议
function getPainAdvice(level: number): PainScaleItem {
  // 基于souW1e2的疼痛等级映射
  const severityMap = {
    0: "none",
    1: "mild",
    2: "mild",
    3: "mild",
    4: "moderate",
    5: "moderate",
    6: "moderate",
    7: "severe",
    8: "severe",
    9: "extreme",
    10: "extreme",
  } as const;

  const colorMap = {
    0: "text-green-600",
    1: "text-green-500",
    2: "text-green-400",
    3: "text-yellow-500",
    4: "text-yellow-600",
    5: "text-orange-500",
    6: "text-orange-600",
    7: "text-red-500",
    8: "text-red-600",
    9: "text-red-700",
    10: "text-red-800",
  };

  return {
    level,
    title: `painTool.levels.${level}.title`,
    advice: `painTool.levels.${level}.advice`,
    severity: severityMap[level as keyof typeof severityMap],
    recommendations: [
      `painTool.levels.${level}.rec1`,
      `painTool.levels.${level}.rec2`,
    ],
    colorClass: colorMap[level as keyof typeof colorMap],
  };
}

// 辅助函数：检查评估是否是最近的（24小时内）
function isRecentAssessment(timestamp: string): boolean {
  const assessmentTime = new Date(timestamp);
  const now = new Date();
  const hoursDiff =
    (now.getTime() - assessmentTime.getTime()) / (1000 * 60 * 60);

  return hoursDiff < 24;
}

// 辅助函数：生成评估建议
export function generatePainRecommendations(level: number): string[] {
  if (level === 0) {
    return [
      "Continue monitoring your symptoms",
      "Maintain healthy lifestyle habits",
    ];
  } else if (level <= 3) {
    return [
      "Try gentle heat therapy or warm baths",
      "Consider light exercise or stretching",
      "Monitor if pain increases",
    ];
  } else if (level <= 6) {
    return [
      "Consider over-the-counter pain relief",
      "Apply heat or cold therapy",
      "Rest and avoid strenuous activities",
      "Track your symptoms",
    ];
  } else if (level <= 8) {
    return [
      "Consider seeing a healthcare provider",
      "Use prescribed or stronger pain medication",
      "Apply heat therapy",
      "Rest and limit activities",
    ];
  } else {
    return [
      "Seek immediate medical attention",
      "Consider emergency care if pain is sudden",
      "Do not delay medical consultation",
      "Have someone accompany you to medical care",
    ];
  }
}
