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

// 第一阶段配置（5道简化题）
export const stage1Config: QuizStageConfig = {
  id: "stage1",
  title: "快速了解测试",
  description: "3分钟了解你的基础理解水平",
  instructions: "请男士独立完成以下5道题，诚实选择你认为最合适的答案。",
  totalQuestions: 5,
  timeLimit: 3,
  difficulty: "easy",
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
};

// 第二阶段配置（10道专业题）
export const stage2Config: QuizStageConfig = {
  id: "stage2",
  title: "专业深度测试",
  description: "10分钟深入了解，获得专业建议",
  instructions: "请男士独立完成以下10道题，诚实选择你认为最合适的答案。",
  totalQuestions: 10,
  timeLimit: 10,
  difficulty: "hard",
  unlockCondition: {
    requiresPreviousStage: true,
    minScore: 0, // 完成第一阶段即可解锁
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
};

// 第三阶段配置（30天训练营）
export const stage3Config: QuizStageConfig = {
  id: "stage3",
  title: "30天训练营",
  description: "每天5分钟，循序渐进成为暖心伴侣",
  instructions:
    "基于测试结果，开始30天的系统化训练，每天5分钟，循序渐进提升理解和支持能力。",
  totalQuestions: 0, // 训练营不是测试
  timeLimit: 5, // 每天5分钟
  difficulty: "medium",
  unlockCondition: {
    requiresPreviousStage: true,
    minScore: 0, // 完成第二阶段即可解锁
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
};

// 第四阶段配置（个性化指导）
export const stage4Config: QuizStageConfig = {
  id: "stage4",
  title: "个性化指导",
  description: "基于测试结果，提供专属的改善建议",
  instructions: "根据你的测试结果和训练进度，获得个性化的持续优化建议。",
  totalQuestions: 0, // 指导不是测试
  timeLimit: undefined, // 无时间限制
  difficulty: "easy",
  unlockCondition: {
    requiresPreviousStage: true,
    minScore: 0, // 完成第三阶段即可解锁
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
};

// 所有阶段配置
export const quizStagesConfig: Record<QuizStage, QuizStageConfig> = {
  stage1: stage1Config,
  stage2: stage2Config,
  stage3: stage3Config,
  stage4: stage4Config,
};

// 获取阶段配置的工具函数
export const getStageConfig = (stage: QuizStage): QuizStageConfig => {
  return quizStagesConfig[stage];
};

// 检查阶段是否解锁的工具函数
export const isStageUnlocked = (
  stage: QuizStage,
  stageProgress: Record<
    QuizStage,
    { status: string; result?: { percentage: number } }
  >,
): boolean => {
  const config = getStageConfig(stage);

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
