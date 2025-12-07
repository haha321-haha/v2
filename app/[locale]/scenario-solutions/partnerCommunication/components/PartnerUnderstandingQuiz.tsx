"use client";

import React, { useState } from "react";
import { QuizAnswer, QuizResult, QuizProgress, QuizStage } from "../types/quiz";
import { Locale } from "../types/common";
import {
  getStage1Questions,
  getStage2Questions,
} from "../config/questionsConfigI18n";
import { getStageConfig } from "../config/quizConfigI18n";
import { calculateLevel } from "../config/resultsConfig";
import { useStageState, useStageActions } from "../stores/partnerHandbookStore";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { logDebug, logError } from "@/lib/debug-logger";

interface PartnerUnderstandingQuizProps {
  locale: Locale;
  stage: QuizStage;
  onQuizComplete: (result: QuizResult) => void;
  className?: string;
}

// Fallback recommendations function - 支持国际化
export default function PartnerUnderstandingQuiz({
  locale,
  stage,
  onQuizComplete,
  className = "",
}: PartnerUnderstandingQuizProps) {
  const { t } = useSafeTranslations("partnerHandbook.quiz");

  // 使用新的状态管理
  const stageState = useStageState(stage);
  const stageActions = useStageActions();

  // 从配置中获取题目和配置
  const questions =
    stage === "stage1"
      ? getStage1Questions(locale)
      : getStage2Questions(locale);
  const stageConfig = getStageConfig(stage, locale);

  // 获取结果翻译的hook
  const resultsNamespace =
    stage === "stage1"
      ? "partnerHandbook.stage1Results"
      : "partnerHandbook.stage2Results";
  const { t: tResults, tRaw: tResultsRaw } =
    useSafeTranslations(resultsNamespace);

  // 填充结果的翻译内容
  const fillResultTranslations = (result: QuizResult): QuizResult => {
    if (!result.level) return result;

    return {
      ...result,
      title: tResults(`${result.level}.title`),
      feedback: tResults(`${result.level}.description`),
      recommendations:
        (Object.values(
          tResultsRaw(`${result.level}.recommendations`),
        ) as string[]) || [],
    };
  };

  const [selectedOption, setSelectedOption] = useState<
    number | number[] | null
  >(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // 使用状态管理中的当前题目索引
  const currentQuestionIndex = stageState.currentQuestionIndex;
  const answers = stageState.answers;
  const isCompleted = stageState.status === "completed";

  // 安全检查：确保questions存在且不为空
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("noQuestionsAvailable")}
          </h2>
          <p className="text-gray-600">{t("noQuestionsDescription")}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress: QuizProgress = {
    current: currentQuestionIndex + 1,
    total: questions.length,
    percentage: Math.round(
      ((currentQuestionIndex + 1) / questions.length) * 100,
    ),
    stage,
  };

  const handleOptionSelect = (optionId: number) => {
    if (currentQuestion?.isMultipleChoice) {
      // 多选题逻辑
      const currentSelected = Array.isArray(selectedOption)
        ? selectedOption
        : [];
      let newSelected: number[];

      if (currentSelected.includes(optionId)) {
        // 取消选择
        newSelected = currentSelected.filter((id) => id !== optionId);
        logDebug(
          `🔍 Debug - 取消选择选项 ${optionId}, 当前选择:`,
          { newSelected },
          "PartnerUnderstandingQuiz",
        );
      } else {
        // 添加选择
        newSelected = [...currentSelected, optionId];
        logDebug(
          `🔍 Debug - 选择选项 ${optionId}, 当前选择:`,
          { newSelected },
          "PartnerUnderstandingQuiz",
        );
      }

      setSelectedOption(newSelected);

      // 检查是否选择了所有正确选项
      const correctAnswers = Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer
        : [currentQuestion.correctAnswer];
      const hasAllCorrect = correctAnswers.every((correctId) =>
        newSelected.includes(correctId),
      );
      const hasNoIncorrect = newSelected.every((selectedId) =>
        correctAnswers.includes(selectedId),
      );

      logDebug(`🔍 Debug - 第${currentQuestionIndex + 1}题选择状态:`, {
        questionId: currentQuestion.id,
        selected: newSelected,
        correct: correctAnswers,
        hasAllCorrect,
        hasNoIncorrect,
      });

      // 如果选择了所有正确选项且没有选择错误选项，显示解释
      if (hasAllCorrect && hasNoIncorrect && newSelected.length > 0) {
        setShowExplanation(true);
      }
    } else {
      // 单选题逻辑
      setSelectedOption(optionId);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (selectedOption !== null && currentQuestion) {
      let isCorrect: boolean;
      let score: number;

      if (currentQuestion.isMultipleChoice) {
        // 多选题逻辑
        const selectedArray = Array.isArray(selectedOption)
          ? selectedOption
          : [selectedOption];
        const correctArray = Array.isArray(currentQuestion.correctAnswer)
          ? currentQuestion.correctAnswer
          : [currentQuestion.correctAnswer];

        // 检查是否选择了所有正确答案
        isCorrect =
          correctArray.every((correctId) =>
            selectedArray.includes(correctId),
          ) &&
          selectedArray.every((selectedId) =>
            correctArray.includes(selectedId),
          );

        // 简单计分：答对得1分，答错得0分
        score = isCorrect ? 1 : 0;

        logDebug(`🔍 Debug - 第${currentQuestionIndex + 1}题评分:`, {
          questionId: currentQuestion.id,
          selected: selectedArray,
          correct: correctArray,
          isCorrect,
          score,
          isMultipleChoice: true,
        });
      } else {
        // 单选题逻辑
        isCorrect = selectedOption === currentQuestion.correctAnswer;
        score = isCorrect ? 1 : 0;

        logDebug(`🔍 Debug - 第${currentQuestionIndex + 1}题评分:`, {
          questionId: currentQuestion.id,
          selected: selectedOption,
          correct: currentQuestion.correctAnswer,
          isCorrect,
          score,
          isMultipleChoice: false,
        });
      }

      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedOption,
        isCorrect,
        score,
        answeredAt: new Date(),
      };

      // 调试信息：打印当前答案
      logDebug("🔍 Debug - Saving answer:", {
        questionIndex: currentQuestionIndex,
        questionId: currentQuestion.id,
        selectedOption,
        score: answer.score,
        isLastQuestion: currentQuestionIndex === questions.length - 1,
      });

      // 使用状态管理保存答案
      stageActions.setStageAnswer(stage, currentQuestionIndex, answer);

      if (currentQuestionIndex < questions.length - 1) {
        // 下一题
        logDebug(
          "🔍 Debug - Moving to next question:",
          currentQuestionIndex + 1,
          "PartnerUnderstandingQuiz",
        );
        stageActions.nextStageQuestion(stage);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        // 测试完成 - 确保最后一题的答案被保存后再计算结果
        logDebug(
          "🔍 Debug - Test completed, calculating result...",
          null,
          "PartnerUnderstandingQuiz",
        );

        // 创建一个包含当前答案的临时answers数组用于计算
        const tempAnswers = [...answers];
        while (tempAnswers.length <= currentQuestionIndex) {
          tempAnswers.push(null);
        }
        tempAnswers[currentQuestionIndex] = answer;

        // 使用临时数组计算结果
        const result = calculateResultWithAnswers(tempAnswers);
        // 填充翻译内容
        const translatedResult = fillResultTranslations(result);
        stageActions.completeStage(stage, translatedResult);
        onQuizComplete(translatedResult);
      }
    }
  };

  const calculateResultWithAnswers = (
    answersToUse: (QuizAnswer | null)[],
  ): QuizResult => {
    // 安全检查：确保answers存在
    if (!answersToUse || !Array.isArray(answersToUse)) {
      logError(
        "🔍 Debug - answersToUse is not an array:",
        { answersToUse },
        "PartnerUnderstandingQuiz",
      );
      return {
        totalScore: 0,
        maxScore: stage === "stage1" ? 5 : 10,
        percentage: 0,
        level: "beginner",
        title: "",
        feedback: "测试数据异常",
        recommendations: ["请重新开始测试"],
        completedAt: new Date(),
        timeSpent: 0,
      };
    }

    // 过滤掉null值，只计算有效的答案
    const validAnswers = answersToUse.filter(
      (answer) => answer !== null && answer !== undefined,
    );

    // 调试信息：打印answers数组
    logDebug("🔍 Debug - answersToUse array:", {
      answersToUse,
    });
    logDebug("🔍 Debug - valid answers:", {
      validAnswers,
    });
    logDebug(
      "🔍 Debug - answers scores:",
      validAnswers.map((a) => ({ questionId: a.questionId, score: a.score })),
      "PartnerUnderstandingQuiz",
    );

    // 简单计分：答对得1分，答错得0分
    const totalScore = validAnswers.reduce((sum, answer) => {
      return sum + (answer.isCorrect ? 1 : 0);
    }, 0);

    // 动态计算最大分数
    const maxScore = stage === "stage1" ? 5 : 10;

    // 调试信息：打印分数计算
    logDebug("🔍 Debug - totalScore (correct answers):", {
      totalScore,
    });
    logDebug("🔍 Debug - maxScore:", {
      maxScore,
    });
    logDebug("🔍 Debug - questions count:", {
      questions: questions.length,
    });
    logDebug("🔍 Debug - validAnswers count:", {
      validAnswers: validAnswers.length,
    });

    const percentage = Math.round((totalScore / maxScore) * 100);

    // 使用配置化系统计算等级
    const level = calculateLevel(percentage);

    // 返回基础结果，翻译将在组件渲染时处理
    return {
      totalScore,
      maxScore,
      percentage,
      level,
      title: "", // 将在组件中通过翻译函数填充
      feedback: "", // 将在组件中通过翻译函数填充
      recommendations: [], // 将在组件中通过翻译函数填充
      completedAt: new Date(),
      timeSpent: 0, // TODO: 计算实际用时
      stage, // 添加stage信息
    };
  };

  if (isCompleted) {
    return (
      <div className={`quiz-container ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-600 mb-4">
            {t("title")} - {t("results.beginner.title")}
          </h2>
          <p className="text-gray-600">{t("results.beginner.description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* 测试标题和说明 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary-600 mb-4">
          {stageConfig.title}
        </h2>
        <p className="text-gray-600 mb-6">{stageConfig.description}</p>
        <p className="text-sm text-gray-500 mb-4">{stageConfig.instructions}</p>
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("questionProgress", {
              current: progress.current,
              total: progress.total,
            })}
          </span>
          <span className="text-sm text-gray-500">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* 当前题目 */}
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion?.question}
        </h3>

        {/* 选项 */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                (
                  Array.isArray(selectedOption)
                    ? selectedOption.includes(option.id)
                    : selectedOption === option.id
                )
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              } ${
                showExplanation &&
                (Array.isArray(currentQuestion.correctAnswer)
                  ? currentQuestion.correctAnswer.includes(option.id)
                  : option.id === currentQuestion.correctAnswer)
                  ? "border-green-500 bg-green-50"
                  : ""
              } ${
                showExplanation &&
                (Array.isArray(selectedOption)
                  ? selectedOption.includes(option.id)
                  : selectedOption === option.id) &&
                !(Array.isArray(currentQuestion.correctAnswer)
                  ? currentQuestion.correctAnswer.includes(option.id)
                  : option.id === currentQuestion.correctAnswer)
                  ? "border-red-500 bg-red-50"
                  : ""
              }`}
              disabled={showExplanation}
            >
              <span className="font-medium">{option.id}.</span> {option.text}
            </button>
          ))}
        </div>

        {/* 解释 */}
        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">
              {currentQuestion?.explanation}
            </p>
          </div>
        )}
      </div>

      {/* 下一题按钮 */}
      <div className="text-center">
        <button
          onClick={handleNext}
          disabled={
            selectedOption === null ||
            (Array.isArray(selectedOption) && selectedOption.length === 0)
          }
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex < questions.length - 1
            ? t("nextQuestion")
            : t("completeTest")}
        </button>
      </div>
    </div>
  );
}
