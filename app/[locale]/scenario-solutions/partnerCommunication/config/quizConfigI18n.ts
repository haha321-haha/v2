import { QuizStage } from "../stores/partnerHandbookStore";

// 测试配置接口
export interface QuizStageConfig {
  id: QuizStage;
  title: string;
  description: string;
  instructions: string;
  totalQuestions: number;
  timeLimit?: number; // 可选的时间限制（分钟）
  difficulty: "easy" | "medium" | "hard";
  unlockCondition?: {
    requiresPreviousStage: boolean;
    minScore?: number;
  };
  scoring: {
    maxScorePerQuestion: number;
    levelThresholds: {
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
    };
  };
}

// 获取阶段配置的工具函数 - 支持国际化
export const getStageConfig = (
  stage: QuizStage,
  locale: "zh" | "en",
): QuizStageConfig => {
  const configs = {
    zh: {
      stage1: {
        id: "stage1" as QuizStage,
        title: "快速了解测试",
        description: "3分钟了解你的基础理解水平",
        instructions: "请男士独立完成以下5道题，诚实选择你认为最合适的答案。",
        totalQuestions: 5,
        timeLimit: 3,
        difficulty: "easy" as const,
        unlockCondition: {
          requiresPreviousStage: false,
        },
        scoring: {
          maxScorePerQuestion: 4,
          levelThresholds: {
            beginner: 0,
            intermediate: 40,
            advanced: 60,
            expert: 80,
          },
        },
      },
      stage2: {
        id: "stage2" as QuizStage,
        title: "专业深度测试",
        description: "10分钟深入了解，获得专业建议",
        instructions: "请男士独立完成以下10道题，诚实选择你认为最合适的答案。",
        totalQuestions: 10,
        timeLimit: 10,
        difficulty: "hard" as const,
        unlockCondition: {
          requiresPreviousStage: true,
          minScore: 0,
        },
        scoring: {
          maxScorePerQuestion: 4,
          levelThresholds: {
            beginner: 0,
            intermediate: 40,
            advanced: 60,
            expert: 80,
          },
        },
      },
      stage3: {
        id: "stage3" as QuizStage,
        title: "30天训练营",
        description: "每天5分钟，循序渐进成为暖心伴侣",
        instructions:
          "基于测试结果，开始30天的系统化训练，每天5分钟，循序渐进提升理解和支持能力。",
        totalQuestions: 0,
        timeLimit: 5,
        difficulty: "medium" as const,
        unlockCondition: {
          requiresPreviousStage: true,
          minScore: 0,
        },
        scoring: {
          maxScorePerQuestion: 0,
          levelThresholds: {
            beginner: 0,
            intermediate: 0,
            advanced: 0,
            expert: 0,
          },
        },
      },
      stage4: {
        id: "stage4" as QuizStage,
        title: "个性化指导",
        description: "基于测试结果，提供专属的改善建议",
        instructions: "根据你的测试结果和训练进度，获得个性化的持续优化建议。",
        totalQuestions: 0,
        timeLimit: undefined,
        difficulty: "easy" as const,
        unlockCondition: {
          requiresPreviousStage: true,
          minScore: 0,
        },
        scoring: {
          maxScorePerQuestion: 0,
          levelThresholds: {
            beginner: 0,
            intermediate: 0,
            advanced: 0,
            expert: 0,
          },
        },
      },
    },
    en: {
      stage1: {
        id: "stage1" as QuizStage,
        title: "Quick Understanding Test",
        description: "Understand your basic knowledge level in 3 minutes",
        instructions:
          "Please gentlemen complete the following 5 questions independently, honestly choose the answer you think is most appropriate.",
        totalQuestions: 5,
        timeLimit: 3,
        difficulty: "easy" as const,
        unlockCondition: {
          requiresPreviousStage: false,
        },
        scoring: {
          maxScorePerQuestion: 4,
          levelThresholds: {
            beginner: 0,
            intermediate: 40,
            advanced: 60,
            expert: 80,
          },
        },
      },
      stage2: {
        id: "stage2" as QuizStage,
        title: "Professional Depth Test",
        description:
          "Deepen your understanding through 10 professional questions and get expert advice",
        instructions:
          "Please gentlemen complete the following 10 questions independently, honestly choose the answer you think is most appropriate.",
        totalQuestions: 10,
        timeLimit: 10,
        difficulty: "hard" as const,
        unlockCondition: {
          requiresPreviousStage: true,
          minScore: 0,
        },
        scoring: {
          maxScorePerQuestion: 4,
          levelThresholds: {
            beginner: 0,
            intermediate: 40,
            advanced: 60,
            expert: 80,
          },
        },
      },
      stage3: {
        id: "stage3" as QuizStage,
        title: "30-Day Training Camp",
        description:
          "5 minutes a day, progressively become a warm-hearted partner",
        instructions:
          "Based on test results, start 30 days of systematic training, 5 minutes a day, progressively improve understanding and support abilities.",
        totalQuestions: 0,
        timeLimit: 5,
        difficulty: "medium" as const,
        unlockCondition: {
          requiresPreviousStage: true,
          minScore: 0,
        },
        scoring: {
          maxScorePerQuestion: 0,
          levelThresholds: {
            beginner: 0,
            intermediate: 0,
            advanced: 0,
            expert: 0,
          },
        },
      },
      stage4: {
        id: "stage4" as QuizStage,
        title: "Personalized Guidance",
        description:
          "Based on test results, provide exclusive improvement suggestions",
        instructions:
          "Based on your test results and training progress, get personalized continuous optimization suggestions.",
        totalQuestions: 0,
        timeLimit: undefined,
        difficulty: "easy" as const,
        unlockCondition: {
          requiresPreviousStage: true,
          minScore: 0,
        },
        scoring: {
          maxScorePerQuestion: 0,
          levelThresholds: {
            beginner: 0,
            intermediate: 0,
            advanced: 0,
            expert: 0,
          },
        },
      },
    },
  };

  return configs[locale][stage];
};

// 检查阶段是否解锁的工具函数
export const isStageUnlocked = (
  stage: QuizStage,
  stageProgress: Record<
    QuizStage,
    { status: string; result?: { percentage: number } }
  >,
): boolean => {
  const config = getStageConfig(stage, "zh"); // 使用默认语言获取配置

  if (!config.unlockCondition?.requiresPreviousStage) {
    return true;
  }

  // 检查前一阶段是否完成
  const previousStage = stage === "stage2" ? "stage1" : null;
  if (!previousStage) return true;

  const previousStageProgress = stageProgress[previousStage];
  if (!previousStageProgress || previousStageProgress.status !== "completed") {
    return false;
  }

  // 检查最低分数要求
  if (config.unlockCondition.minScore !== undefined) {
    const previousScore = previousStageProgress.result?.percentage || 0;
    return previousScore >= config.unlockCondition.minScore;
  }

  return true;
};

// 计算综合等级的工具函数
export const calculateCombinedLevel = (
  stage1Score: number,
  stage2Score?: number,
): "beginner" | "intermediate" | "advanced" | "expert" => {
  let combinedScore: number;

  if (stage2Score !== undefined) {
    // 如果有第二阶段结果，使用加权平均（第一阶段30%，第二阶段70%）
    combinedScore = stage1Score * 0.3 + stage2Score * 0.7;
  } else {
    // 只有第一阶段结果
    combinedScore = stage1Score;
  }

  if (combinedScore < 40) return "beginner";
  if (combinedScore < 60) return "intermediate";
  if (combinedScore < 80) return "advanced";
  return "expert";
};

// 生成个性化建议的工具函数
export const generateRecommendations = (
  stage1Result: { recommendations: string[] } | null,
  stage2Result?: { recommendations: string[] } | null,
): string[] => {
  const recommendations: string[] = [];

  // 基于第一阶段结果生成建议
  if (stage1Result) {
    recommendations.push(...stage1Result.recommendations);
  }

  // 基于第二阶段结果生成建议
  if (stage2Result) {
    recommendations.push(...stage2Result.recommendations);
  }

  // 去重并返回
  return [...new Set(recommendations)];
};

// 获取下一可用阶段的工具函数
export const getNextAvailableStage = (
  stageProgress: Record<QuizStage, { status: string }>,
): QuizStage | null => {
  // 检查第一阶段
  if (
    stageProgress.stage1.status === "not_started" ||
    stageProgress.stage1.status === "in_progress"
  ) {
    return "stage1";
  }

  // 检查第二阶段
  if (
    isStageUnlocked("stage2", stageProgress) &&
    (stageProgress.stage2.status === "not_started" ||
      stageProgress.stage2.status === "in_progress")
  ) {
    return "stage2";
  }

  return null;
};
