"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Question,
  AssessmentAnswer,
  AssessmentSession,
  AssessmentResult,
  Recommendation,
  PainImpactCalculatorHookReturn,
} from "../types";
import { getAssessmentQuestions } from "../data/assessmentQuestions";
import { logError, logInfo, logWarn } from "@/lib/debug-logger";

// 工具函数：创建本地存储键
const createStorageKey = (userId: string, assessmentType: string) => {
  return `periodhub_${assessmentType}_${userId}`;
};

// 工具函数：清理旧的 localStorage 数据（更激进的清理策略）
const cleanupOldStorage = (currentKey: string): void => {
  if (typeof window !== "undefined") {
    try {
      const now = Date.now();
      const maxAge = 12 * 60 * 60 * 1000; // 12小时（更激进）
      const completedMaxAge = 6 * 60 * 60 * 1000; // 已完成的数据6小时后清理
      let cleanedCount = 0;
      const maxCleanCount = 10; // 最多清理10个键

      // 清理所有相关的旧键
      for (
        let i = localStorage.length - 1;
        i >= 0 && cleanedCount < maxCleanCount;
        i--
      ) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith("periodhub_pain_impact_calculator_") ||
            (key.startsWith("periodhub_") && key.includes("pain_impact")))
        ) {
          if (key !== currentKey) {
            try {
              // 尝试解析数据以检查时间戳
              const data = localStorage.getItem(key);
              if (data) {
                try {
                  const parsed = JSON.parse(data);
                  // 检查 startedAt 或 completedAt 时间戳
                  const timestamp = parsed.completedAt || parsed.startedAt;
                  if (timestamp) {
                    const dataTime = new Date(timestamp).getTime();
                    const age = now - dataTime;
                    const isCompleted = !!parsed.completedAt;

                    // 删除超过12小时的数据，或已完成超过6小时的数据
                    if (
                      age > maxAge ||
                      (isCompleted && age > completedMaxAge)
                    ) {
                      localStorage.removeItem(key);
                      cleanedCount++;
                    }
                  } else {
                    // 如果没有时间戳，删除（可能是旧格式）
                    localStorage.removeItem(key);
                    cleanedCount++;
                  }
                } catch {
                  // 如果无法解析，可能是损坏的数据，删除
                  localStorage.removeItem(key);
                  cleanedCount++;
                }
              }
            } catch {
              // 忽略删除错误
            }
          }
        }
      }
    } catch {
      // 忽略清理错误
    }
  }
};

// 工具函数：保存到本地存储（带错误处理和清理）
const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window !== "undefined") {
    try {
      const dataString = JSON.stringify(data);

      // 检查数据大小（粗略估算）
      const estimatedSize = new Blob([dataString]).size;
      const maxSize = 50 * 1024; // 降低到 50KB，更保守的阈值

      if (estimatedSize > maxSize) {
        logWarn(
          `Data size (${estimatedSize} bytes) exceeds limit (${maxSize} bytes), attempting cleanup...`,
          undefined,
          "periodPainImpact/usePainImpactCalculator",
        );
        cleanupOldStorage(key);
      }

      localStorage.setItem(key, dataString);
    } catch (error: unknown) {
      // 如果是配额错误，尝试清理
      const isQuotaError =
        error instanceof Error &&
        (error.name === "QuotaExceededError" ||
          (error as Error & { code?: number }).code === 22);

      if (isQuotaError) {
        logWarn(
          "localStorage quota exceeded, attempting aggressive cleanup...",
          undefined,
          "periodPainImpact/usePainImpactCalculator",
        );
        // Type guard to check if data has AssessmentSession structure
        const isAssessmentSession = (
          obj: unknown,
        ): obj is Partial<AssessmentSession> => {
          return typeof obj === "object" && obj !== null;
        };

        try {
          // 第一步：清理旧数据
          cleanupOldStorage(key);

          // 第二步：如果还是失败，尝试只保存核心数据

          const minimalData = isAssessmentSession(data)
            ? {
                id: data.id,
                answers: data.answers || [],
                startedAt: data.startedAt,
                locale: data.locale,
                completedAt: data.completedAt,
                // 不保存 result，result 可以重新计算
              }
            : data;

          const minimalDataString = JSON.stringify(minimalData);

          try {
            localStorage.setItem(key, minimalDataString);
            logInfo(
              "Saved minimal data to localStorage successfully",
              undefined,
              "periodPainImpact/usePainImpactCalculator",
            );
          } catch (retryError) {
            // 第三步：如果还是失败，使用 sessionStorage
            logWarn(
              "Failed to save to localStorage after cleanup, falling back to sessionStorage",
              retryError,
              "periodPainImpact/usePainImpactCalculator",
            );
            sessionStorage.setItem(key, minimalDataString);
            logInfo(
              "Saved minimal data to sessionStorage as fallback",
              undefined,
              "periodPainImpact/usePainImpactCalculator",
            );
          }
        } catch (cleanupError) {
          logError(
            "Failed to save even after cleanup",
            cleanupError,
            "periodPainImpact/usePainImpactCalculator",
          );
          // 最后的后备方案：只在 sessionStorage 中保存非常小的数据
          try {
            const tinyData = isAssessmentSession(data)
              ? {
                  id: data.id,
                  locale: data.locale,
                }
              : { id: "unknown", locale: "en" };
            sessionStorage.setItem(key + "_backup", JSON.stringify(tinyData));
          } catch (e) {
            logError(
              "All storage methods failed",
              e,
              "periodPainImpact/usePainImpactCalculator",
            );
          }
        }
      } else {
        logError(
          "Failed to save to localStorage",
          error,
          "periodPainImpact/usePainImpactCalculator",
        );
      }
    }
  }
};

// 工具函数：从本地存储加载（支持 localStorage 和 sessionStorage）
const loadFromStorage = <T>(key: string): T | null => {
  if (typeof window !== "undefined") {
    try {
      // 先尝试从 localStorage 加载
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }

      // 如果 localStorage 中没有，尝试从 sessionStorage 加载
      const sessionData = sessionStorage.getItem(key);
      if (sessionData) {
        return JSON.parse(sessionData);
      }

      return null;
    } catch (error) {
      logError(
        "Failed to load from storage",
        error,
        "periodPainImpact/usePainImpactCalculator",
      );
      return null;
    }
  }
  return null;
};

// 工具函数：计算评估结果
const calculateResult = (
  answers: AssessmentAnswer[],
  questions: Question[],
  locale: string = "en",
): AssessmentResult | null => {
  if (answers.length === 0 || questions.length === 0) return null;

  // 计算总分和最大可能分数
  let totalScore = 0;
  let maxPossibleScore = 0;

  // 先计算最大可能分数（基于所有问题的最高可能得分）
  questions.forEach((question) => {
    const questionWeight = question.weight || 1;

    if (question.type === "scale") {
      // 评分类型：最大分数是最高选项的权重 * 问题权重
      // scale 类型的 options 是 [1,2,3,...,10]，最高权重是 10
      if (question.options) {
        const maxOptionWeight = Math.max(
          ...question.options.map((opt) =>
            typeof opt.weight === "number" ? opt.weight : 0,
          ),
        );
        maxPossibleScore += maxOptionWeight * questionWeight;
      } else {
        // 如果没有 options，默认最大分数是 10 * questionWeight
        maxPossibleScore += 10 * questionWeight;
      }
    } else if (question.type === "multiple" && question.options) {
      // 多选：最大分数是所有选项权重之和（除了 'none'）
      const totalOptionWeight = question.options
        .filter((opt) => opt.value !== "none")
        .reduce((sum, opt) => sum + (opt.weight || 0), 0);
      maxPossibleScore += totalOptionWeight * questionWeight;
    } else if (question.options) {
      // 单选：找到最高权重的选项
      const maxOptionWeight = Math.max(
        ...question.options.map((opt) => opt.weight || 0),
      );
      maxPossibleScore += maxOptionWeight * questionWeight;
    } else {
      // 其他类型：使用问题权重
      maxPossibleScore += questionWeight;
    }
  });

  // 计算实际得分
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const questionWeight = question.weight || 1;

    // 计算答案得分
    if (question.type === "multiple" && Array.isArray(answer.value)) {
      // 多选：累加所有选中选项的权重
      answer.value.forEach((val: string) => {
        const option = question.options?.find((opt) => opt.value === val);
        if (option && option.weight !== undefined) {
          totalScore += option.weight * questionWeight;
        }
      });
    } else if (question.type === "scale" && typeof answer.value === "number") {
      // 评分：直接使用答案值（1-10）乘以问题权重
      totalScore += answer.value * questionWeight;
    } else if (question.options) {
      // 单选
      const option = question.options?.find(
        (opt) => opt.value === answer.value,
      );
      if (option && option.weight !== undefined) {
        totalScore += option.weight * questionWeight;
      }
    }
  });

  // 计算百分比
  const percentage =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  // 确定严重程度
  let severity: "mild" | "moderate" | "severe" | "emergency";
  if (percentage >= 80) {
    severity = "emergency";
  } else if (percentage >= 60) {
    severity = "severe";
  } else if (percentage >= 40) {
    severity = "moderate";
  } else {
    severity = "mild";
  }

  // 生成建议（传入 locale）
  const recommendations = generateRecommendations(
    severity,
    answers,
    questions,
    locale,
  );

  // 生成消息
  const messages = {
    mild: {
      en: "Your symptoms appear to be mild. Lifestyle adjustments and self-care measures can help manage your symptoms effectively.",
      zh: "您的症状似乎较轻。生活方式调整和自我护理措施可以有效帮助您管理症状。",
    },
    moderate: {
      en: "Your symptoms are moderate. A combination of self-care and medical treatments may provide better relief.",
      zh: "您的症状属于中等程度。自我护理和医疗治疗相结合可能会提供更好的缓解。",
    },
    severe: {
      en: "Your symptoms appear to be severe. It's recommended to consult with a healthcare professional for proper diagnosis and treatment.",
      zh: "您的症状似乎较严重。建议咨询医疗专业人士进行正确诊断和治疗。",
    },
    emergency: {
      en: "Your symptoms are severe and may require immediate medical attention. Please consult with a healthcare provider promptly.",
      zh: "您的症状严重，可能需要立即就医。请尽快咨询医疗提供者。",
    },
  };

  const summary = messages[severity];
  const isZh = locale === "zh";

  return {
    sessionId: "",
    type: severity,
    severity,
    score: Math.round(totalScore * 100) / 100, // 保留2位小数
    maxScore: maxPossibleScore,
    percentage: Math.min(100, Math.max(0, percentage)), // 确保百分比在 0-100 之间
    recommendations,
    emergency: severity === "emergency",
    message: isZh ? summary.zh : summary.en,
    summary: isZh ? summary.zh : summary.en,
    relatedArticles: [],
    nextSteps: [],
    createdAt: new Date().toISOString(),
  };
};

// 建议文本国际化映射
const recommendationTexts: {
  en: Record<
    string,
    { title: string; description: string; actionSteps: string[] }
  >;
  zh: Record<
    string,
    { title: string; description: string; actionSteps: string[] }
  >;
} = {
  en: {
    immediate_medical_attention: {
      title: "Seek Immediate Medical Attention",
      description:
        "Your symptoms require immediate medical evaluation to rule out serious conditions.",
      actionSteps: [
        "Contact your healthcare provider immediately",
        "Visit urgent care or emergency room if severe symptoms worsen",
        "Keep track of all symptoms and their timing",
      ],
    },
    medical_evaluation: {
      title: "Medical Evaluation",
      description:
        "A thorough medical evaluation is recommended for proper diagnosis and treatment.",
      actionSteps: [
        "Schedule a comprehensive medical evaluation",
        "Document all symptoms and their severity",
        "Ask about diagnostic testing options",
      ],
    },
    stress_management: {
      title: "Stress Management",
      description:
        "High stress levels can worsen menstrual symptoms. Consider stress-reduction techniques.",
      actionSteps: [
        "Practice mindfulness meditation daily",
        "Try deep breathing exercises during pain episodes",
        "Consider yoga or tai chi classes",
      ],
    },
    lifestyle_changes: {
      title: "Lifestyle Adjustments",
      description:
        "Regular exercise and a balanced diet can help reduce menstrual pain.",
      actionSteps: [
        "Engage in light exercise 3-4 times per week",
        "Maintain a balanced diet rich in fruits and vegetables",
        "Ensure adequate sleep (7-8 hours)",
      ],
    },
    self_care: {
      title: "Self-Care Measures",
      description:
        "Simple self-care measures can significantly reduce mild menstrual pain.",
      actionSteps: [
        "Apply heat to lower abdomen",
        "Practice relaxation techniques",
        "Try over-the-counter pain relievers if needed",
      ],
    },
    medical_consultation: {
      title: "Medical Consultation",
      description:
        "Consider consulting with a healthcare provider for personalized treatment options.",
      actionSteps: [
        "Schedule an appointment with your gynecologist",
        "Keep a pain diary to track symptoms",
        "Discuss your symptoms and treatment options",
      ],
    },
    pain_management: {
      title: "Pain Management",
      description:
        "Effective pain management strategies for moderate symptoms.",
      actionSteps: [
        "Use non-prescription pain relievers as directed",
        "Apply heat therapy regularly",
        "Consider hormonal birth control options",
      ],
    },
    exercise_recommendation: {
      title: "Regular Physical Activity",
      description: "Regular exercise can help reduce menstrual pain severity.",
      actionSteps: [
        "Start with 15-20 minutes of light exercise 3 times per week",
        "Gradually increase to 30 minutes most days of the week",
        "Focus on activities like walking, swimming, or yoga",
      ],
    },
  },
  zh: {
    immediate_medical_attention: {
      title: "立即就医",
      description: "您的症状需要立即进行医疗评估，以排除严重疾病。",
      actionSteps: [
        "立即联系您的医疗提供者",
        "如果严重症状恶化，请前往急诊室或紧急护理中心",
        "记录所有症状及其发生时间",
      ],
    },
    medical_evaluation: {
      title: "医疗评估",
      description: "建议进行全面的医疗评估，以便正确诊断和治疗。",
      actionSteps: [
        "安排全面的医疗评估",
        "记录所有症状及其严重程度",
        "询问诊断测试选项",
      ],
    },
    stress_management: {
      title: "压力管理",
      description: "高压力水平可能加重月经症状。考虑采用减压技巧。",
      actionSteps: [
        "每天练习正念冥想",
        "在疼痛发作时尝试深呼吸练习",
        "考虑参加瑜伽或太极课程",
      ],
    },
    lifestyle_changes: {
      title: "生活方式调整",
      description: "定期运动和均衡饮食有助于减轻痛经。",
      actionSteps: [
        "每周进行3-4次轻度运动",
        "保持富含水果和蔬菜的均衡饮食",
        "确保充足的睡眠（7-8小时）",
      ],
    },
    self_care: {
      title: "自我护理措施",
      description: "简单的自我护理措施可以显著减轻轻度痛经。",
      actionSteps: ["在下腹部热敷", "练习放松技巧", "如需要，尝试非处方止痛药"],
    },
    medical_consultation: {
      title: "医疗咨询",
      description: "考虑咨询医疗提供者，获取个性化的治疗方案。",
      actionSteps: [
        "预约妇科医生",
        "记录疼痛日记以追踪症状",
        "讨论您的症状和治疗方案",
      ],
    },
    pain_management: {
      title: "疼痛管理",
      description: "针对中等症状的有效疼痛管理策略。",
      actionSteps: [
        "按指示使用非处方止痛药",
        "定期进行热疗",
        "考虑激素避孕选项",
      ],
    },
    exercise_recommendation: {
      title: "定期体育活动",
      description: "定期运动有助于减轻痛经的严重程度。",
      actionSteps: [
        "每周开始进行3次15-20分钟的轻度运动",
        "逐渐增加到大多数日子每天30分钟",
        "专注于散步、游泳或瑜伽等活动",
      ],
    },
  },
};

// 辅助函数：获取时间框架翻译
const getTimeframeTranslation = (key: string, locale: string): string => {
  // 由于这是工具函数，不能使用 hook，我们直接使用翻译键映射
  const timeframeMap: Record<string, { en: string; zh: string }> = {
    immediate: { en: "Immediate", zh: "立即" },
    oneWeek: { en: "1 week", zh: "1周" },
    oneToTwoWeeks: { en: "1-2 weeks", zh: "1-2周" },
    twoToFourWeeks: { en: "2-4 weeks", zh: "2-4周" },
    fourToSixWeeks: { en: "4-6 weeks", zh: "4-6周" },
  };

  const translations = timeframeMap[key];
  if (!translations) return key;
  return locale === "zh" ? translations.zh : translations.en;
};

// 工具函数：生成建议（支持国际化）
const generateRecommendations = (
  severity: "mild" | "moderate" | "severe" | "emergency",
  answers: AssessmentAnswer[],
  questions: Question[],
  locale: string = "en",
): Recommendation[] => {
  const texts =
    recommendationTexts[locale as "en" | "zh"] || recommendationTexts.en;
  const recommendations: Recommendation[] = [];

  // 基于严重程度的通用建议
  if (severity === "mild") {
    recommendations.push(
      {
        id: "lifestyle_changes",
        category: "lifestyle",
        title: texts.lifestyle_changes.title,
        description: texts.lifestyle_changes.description,
        priority: "medium",
        timeframe: getTimeframeTranslation("twoToFourWeeks", locale),
        actionSteps: texts.lifestyle_changes.actionSteps,
      },
      {
        id: "self_care",
        category: "selfcare",
        title: texts.self_care.title,
        description: texts.self_care.description,
        priority: "low",
        timeframe: getTimeframeTranslation("immediate", locale),
        actionSteps: texts.self_care.actionSteps,
      },
    );
  } else if (severity === "moderate") {
    recommendations.push(
      {
        id: "medical_consultation",
        category: "medical",
        title: texts.medical_consultation.title,
        description: texts.medical_consultation.description,
        priority: "high",
        timeframe: getTimeframeTranslation("oneToTwoWeeks", locale),
        actionSteps: texts.medical_consultation.actionSteps,
      },
      {
        id: "pain_management",
        category: "immediate",
        title: texts.pain_management.title,
        description: texts.pain_management.description,
        priority: "high",
        timeframe: getTimeframeTranslation("immediate", locale),
        actionSteps: texts.pain_management.actionSteps,
      },
    );
  } else if (severity === "severe" || severity === "emergency") {
    const medicalText =
      severity === "emergency"
        ? texts.immediate_medical_attention
        : texts.medical_evaluation;
    recommendations.push({
      id: "immediate_medical_attention",
      category: "immediate",
      title: medicalText.title,
      description: medicalText.description,
      priority: "high",
      timeframe:
        severity === "emergency"
          ? getTimeframeTranslation("immediate", locale)
          : getTimeframeTranslation("oneWeek", locale),
      actionSteps: medicalText.actionSteps,
    });
  }

  // 基于具体答案的个性化建议
  const stressAnswer = answers.find((a) => a.questionId === "stress_level");
  if (
    stressAnswer &&
    typeof stressAnswer.value === "number" &&
    stressAnswer.value > 7
  ) {
    recommendations.push({
      id: "stress_management",
      category: "selfcare",
      title: texts.stress_management.title,
      description: texts.stress_management.description,
      priority: "medium",
      timeframe: getTimeframeTranslation("twoToFourWeeks", locale),
      actionSteps: texts.stress_management.actionSteps,
    });
  }

  const exerciseAnswer = answers.find(
    (a) => a.questionId === "exercise_frequency",
  );
  if (
    exerciseAnswer &&
    (exerciseAnswer.value === "rarely" || exerciseAnswer.value === "monthly")
  ) {
    const exerciseText = texts.exercise_recommendation;
    recommendations.push({
      id: "exercise_recommendation",
      category: "exercise",
      title: exerciseText.title,
      description: exerciseText.description,
      priority: "medium",
      timeframe: getTimeframeTranslation("fourToSixWeeks", locale),
      actionSteps: exerciseText.actionSteps,
    });
  }

  return recommendations;
};

export const usePainImpactCalculator = (
  userId?: string,
): PainImpactCalculatorHookReturn => {
  const [currentSession, setCurrentSession] =
    useState<AssessmentSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取翻译函数
  const t = useTranslations("periodPainImpactCalculator.questions");

  const storageKey = createStorageKey(
    userId || "anonymous",
    "pain_impact_calculator",
  );

  // Load saved session on mount
  useEffect(() => {
    const savedSession = loadFromStorage<AssessmentSession>(storageKey);
    if (savedSession && !savedSession.completedAt) {
      setCurrentSession(savedSession);
      setCurrentQuestionIndex(savedSession.answers.length);
    }
  }, [storageKey]);

  // Save session whenever it changes
  useEffect(() => {
    if (currentSession) {
      saveToStorage(storageKey, currentSession);
    }
  }, [currentSession, storageKey]);

  // 使用翻译函数获取问题列表
  const questions = getAssessmentQuestions(t);
  const currentQuestion = questions[currentQuestionIndex] || null;
  const isComplete = currentQuestionIndex >= questions.length;
  // 进度计算：基于已回答问题数量，而不是当前问题索引
  const progress =
    questions.length > 0
      ? Math.min(
          ((currentSession?.answers.length || 0) / questions.length) * 100,
          100,
        )
      : 0;

  const startAssessment = useCallback((locale: string) => {
    const sessionId = `pain_impact_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newSession: AssessmentSession = {
      id: sessionId,
      answers: [],
      startedAt: new Date().toISOString(),
      locale,
    };

    setCurrentSession(newSession);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
  }, []);

  const answerQuestion = useCallback(
    (answer: AssessmentAnswer) => {
      if (!currentSession) return;

      setCurrentSession((prev) => {
        if (!prev) return prev;

        // Remove any existing answer for this question
        const filteredAnswers = prev.answers.filter(
          (a) => a.questionId !== answer.questionId,
        );

        // Add new answer
        const updatedAnswers = [...filteredAnswers, answer];

        return {
          ...prev,
          answers: updatedAnswers,
        };
      });

      // 移除自动跳转逻辑，让用户手动点击"下一题"
    },
    [currentSession],
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestionIndex(index);
      }
    },
    [questions],
  );

  const goToPreviousQuestion = useCallback(() => {
    goToQuestion(Math.max(0, currentQuestionIndex - 1));
  }, [currentQuestionIndex, goToQuestion]);

  const goToNextQuestion = useCallback(() => {
    goToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1));
  }, [currentQuestionIndex, goToQuestion, questions]);

  const completeAssessment = useCallback((): AssessmentResult | null => {
    if (!currentSession) return null;

    // 防止重复调用：如果已经完成，直接返回已有结果
    if (currentSession.completedAt && currentSession.result) {
      setResult(currentSession.result);
      setCurrentQuestionIndex(questions.length);
      return currentSession.result;
    }

    setIsLoading(true);
    setError(null);

    try {
      const assessmentResult = calculateResult(
        currentSession.answers,
        questions,
        currentSession.locale || "en",
      );

      if (assessmentResult) {
        assessmentResult.sessionId = currentSession.id;

        // Update session with result and mark as complete
        setCurrentSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            result: assessmentResult,
            completedAt: new Date().toISOString(),
          };
        });

        // 设置结果并标记为完成
        setResult(assessmentResult);
        // 确保 currentQuestionIndex 设置为最后一个问题之后，以便 isComplete 为 true
        setCurrentQuestionIndex(questions.length);

        return assessmentResult;
      }

      setError("Unable to calculate assessment result");
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, questions]);

  const resetAssessment = useCallback(() => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);

    // Clear saved session
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    // Current session
    currentSession,
    currentQuestionIndex,
    currentQuestion,
    isComplete,

    // Progress
    progress,
    totalQuestions: questions.length,

    // Actions
    startAssessment,
    answerQuestion,
    goToQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    completeAssessment,
    resetAssessment,

    // Results
    result,

    // State
    isLoading,
    error,
  };
};
