"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { GitBranch, ArrowRight, RotateCcw, CheckCircle } from "lucide-react";
import { useDecisionTree } from "../hooks/useDecisionTree";
import { DECISION_TREE_DATA } from "../utils/medicalCareData";
import styles from "../styles/DecisionTree.module.css";
import type {
  DecisionTreeProps,
  AssessmentResult,
} from "../types/medical-care-guide";

export default function DecisionTree({
  onDecisionComplete,
  className = "",
  startFromNode = "start",
}: DecisionTreeProps) {
  const t = useTranslations("medicalCareGuide");
  const { currentNode, decisionPath, finalResult, makeDecision, resetTree } =
    useDecisionTree(DECISION_TREE_DATA, startFromNode);

  const [isAnimating, setIsAnimating] = useState(false);

  // 处理决策选择
  const handleDecision = useCallback(
    async (choice: "yes" | "no") => {
      setIsAnimating(true);

      // 添加动画延迟
      await new Promise((resolve) => setTimeout(resolve, 300));

      const result = makeDecision(choice);
      setIsAnimating(false);

      // 如果到达最终结果，触发回调
      if (result) {
        const assessmentResult: AssessmentResult = {
          painLevel: 0, // 将由其他工具提供
          symptoms: [],
          riskLevel:
            result.urgency === "emergency"
              ? "emergency"
              : result.urgency === "urgent"
                ? "high"
                : result.urgency === "routine"
                  ? "medium"
                  : "low",
          recommendations: result.actions,
          shouldSeeDoctor: result.urgency !== "observe",
          urgency:
            result.urgency === "emergency"
              ? "immediate"
              : result.urgency === "urgent"
                ? "within_week"
                : "routine",
          timestamp: new Date().toISOString(),
        };

        onDecisionComplete?.(assessmentResult);
      }
    },
    [makeDecision, onDecisionComplete],
  );

  // 处理重新开始
  const handleRestart = useCallback(() => {
    resetTree();
    setIsAnimating(false);
  }, [resetTree]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <GitBranch className={styles.icon} size={24} />
          {t("decisionTree.title")}
        </h3>
        <p className={styles.description}>{t("decisionTree.description")}</p>
      </div>

      {/* 决策路径指示器 */}
      {decisionPath.length > 0 && (
        <div className={styles.pathIndicator}>
          <div className={styles.pathTitle}>{t("decisionTree.pathTitle")}</div>
          <div className={styles.pathSteps}>
            {decisionPath.map((step, index) => (
              <div key={index} className={styles.pathStep}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <span className={styles.stepText}>{t(step.question)}</span>
                <span className={styles.stepChoice}>
                  {step.choice === "yes" ? "✓" : "✗"}
                </span>
                {index < decisionPath.length - 1 && (
                  <ArrowRight size={16} className={styles.stepArrow} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 决策内容区域 */}
      <div
        className={`${styles.content} ${isAnimating ? styles.animating : ""}`}
      >
        {!finalResult ? (
          // 显示当前问题
          <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <h4 className={styles.questionTitle}>
                {t("decisionTree.questionTitle", {
                  step: decisionPath.length + 1,
                })}
              </h4>
            </div>

            <div className={styles.questionContent}>
              <p className={styles.questionText}>{t(currentNode.question!)}</p>

              <div className={styles.questionOptions}>
                <button
                  onClick={() => handleDecision("yes")}
                  disabled={isAnimating}
                  className={`${styles.optionButton} ${styles.yesButton}`}
                >
                  <CheckCircle size={20} className={styles.optionIcon} />
                  {t(currentNode.options!.yes)}
                </button>

                <button
                  onClick={() => handleDecision("no")}
                  disabled={isAnimating}
                  className={`${styles.optionButton} ${styles.noButton}`}
                >
                  <CheckCircle size={20} className={styles.optionIcon} />
                  {t(currentNode.options!.no)}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // 显示最终结果
          <div className={`${styles.resultCard} ${finalResult.colorClass}`}>
            <div className={styles.resultHeader}>
              <div className={styles.resultIcon}>{finalResult.icon}</div>
              <div className={styles.resultInfo}>
                <h4 className={styles.resultTitle}>{t(finalResult.title)}</h4>
                <p className={styles.resultUrgency}>
                  {t(`decisionTree.urgencyLevels.${finalResult.urgency}`)}
                </p>
              </div>
            </div>

            <div className={styles.resultContent}>
              <p className={styles.resultText}>{t(finalResult.text)}</p>

              <div className={styles.resultActions}>
                <h5 className={styles.actionsTitle}>
                  {t("decisionTree.recommendedActions")}
                </h5>
                <ul className={styles.actionsList}>
                  {finalResult.actions.map((action, index) => (
                    <li key={index} className={styles.actionItem}>
                      <span className={styles.actionNumber}>{index + 1}</span>
                      <span className={styles.actionText}>{t(action)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 紧急情况特殊提示 */}
            {finalResult.urgency === "emergency" && (
              <div className={styles.emergencyAlert}>
                <div className={styles.emergencyIcon}>🚨</div>
                <div className={styles.emergencyContent}>
                  <strong>{t("decisionTree.emergency.title")}</strong>
                  <p>{t("decisionTree.emergency.text")}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className={styles.controls}>
        {finalResult ? (
          <button onClick={handleRestart} className={styles.restartButton}>
            <RotateCcw size={20} className={styles.controlIcon} />
            {t("decisionTree.restartButton")}
          </button>
        ) : (
          decisionPath.length > 0 && (
            <button onClick={handleRestart} className={styles.resetButton}>
              <RotateCcw size={20} className={styles.controlIcon} />
              {t("decisionTree.resetButton")}
            </button>
          )
        )}
      </div>

      {/* 进度指示器 */}
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: finalResult
                ? "100%"
                : `${(decisionPath.length / 3) * 100}%`,
            }}
          />
        </div>
        <p className={styles.progressText}>
          {finalResult
            ? t("decisionTree.completed")
            : t("decisionTree.progress", {
                current: decisionPath.length,
                total: 3,
              })}
        </p>
      </div>
    </div>
  );
}
