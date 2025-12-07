"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Activity } from "lucide-react";
import { usePainAssessment } from "../hooks/usePainAssessment";
import { getPainAdvice } from "../utils/medicalCareData";
import { PainAssessmentLogic } from "../utils/assessmentLogic";
import styles from "../styles/PainAssessmentTool.module.css";
import type {
  PainAssessmentToolProps,
  AssessmentResult,
} from "../types/medical-care-guide";

export default function PainAssessmentTool({
  onAssessmentComplete,
  className = "",
  initialLevel = 0,
}: PainAssessmentToolProps) {
  const t = useTranslations("medicalCareGuide");
  const { painLevel, assessmentHistory, updatePainLevel, saveAssessment } =
    usePainAssessment();

  const [isInteracted, setIsInteracted] = useState(false);

  // 初始化疼痛等级
  useEffect(() => {
    if (initialLevel > 0) {
      updatePainLevel(initialLevel);
    }
  }, [initialLevel, updatePainLevel]);

  // 处理滑块变化
  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const level = parseInt(event.target.value);
      updatePainLevel(level);
      setIsInteracted(true);

      // 自动保存评估结果
      if (level > 0) {
        const result: AssessmentResult = {
          painLevel: level,
          symptoms: [],
          riskLevel: level >= 7 ? "high" : level >= 4 ? "medium" : "low",
          recommendations: PainAssessmentLogic.generateRecommendations(level),
          shouldSeeDoctor: PainAssessmentLogic.shouldSeeDoctor(level),
          urgency: PainAssessmentLogic.getUrgencyLevel(level),
          timestamp: new Date().toISOString(),
        };

        saveAssessment(result);
        onAssessmentComplete?.(result);
      }
    },
    [updatePainLevel, saveAssessment, onAssessmentComplete],
  );

  // 获取当前疼痛信息
  const currentPainInfo = getPainAdvice(painLevel);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Activity className={styles.icon} size={24} />
          {t("painTool.title")}
        </h3>
        <p className={styles.description}>{t("painTool.description")}</p>
      </div>

      {/* 疼痛等级滑块 */}
      <div className={styles.sliderContainer}>
        <div className={styles.sliderLabels}>
          <span className={styles.sliderLabelMin}>
            {t("painTool.sliderMin")}
          </span>
          <span className={styles.sliderLabelMax}>
            {t("painTool.sliderMax")}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={handleSliderChange}
          className={styles.slider}
          aria-label={t("painTool.sliderLabel")}
          aria-describedby="pain-description"
          aria-valuetext={`${painLevel} ${t("painTool.outOf10")}`}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={painLevel}
        />

        <div className={styles.sliderTicks}>
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className={styles.tick}>
              <span className={styles.tickLabel}>{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 当前疼痛等级显示 */}
      <div className={styles.currentLevel}>
        <span
          className={`${styles.levelNumber} ${
            currentPainInfo?.colorClass || ""
          }`}
        >
          {painLevel}
        </span>
        <span className={styles.levelText}>{t("painTool.currentLevel")}</span>
      </div>

      {/* 疼痛建议和推荐 */}
      {isInteracted && currentPainInfo && (
        <div className={styles.adviceContainer}>
          <div className={styles.adviceHeader}>
            <h4
              className={`${styles.adviceTitle} ${currentPainInfo.colorClass}`}
            >
              {t(currentPainInfo.title)}
            </h4>
          </div>

          <div className={styles.adviceContent}>
            <p className={styles.adviceText}>{t(currentPainInfo.advice)}</p>

            {currentPainInfo.recommendations.length > 0 && (
              <div className={styles.recommendations}>
                <h5 className={styles.recommendationsTitle}>
                  {t("painTool.recommendations")}
                </h5>
                <ul className={styles.recommendationsList}>
                  {currentPainInfo.recommendations.map((rec, index) => (
                    <li key={index} className={styles.recommendationItem}>
                      {t(rec)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 紧急情况警告 */}
          {painLevel >= 8 && (
            <div className={styles.emergencyWarning}>
              <div className={styles.emergencyIcon}>⚠️</div>
              <div className={styles.emergencyText}>
                <strong>{t("painTool.emergency.title")}</strong>
                <p>{t("painTool.emergency.text")}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 历史记录提示 */}
      {assessmentHistory.length > 0 && (
        <div className={styles.historyHint}>
          <p className={styles.historyText}>
            {t("painTool.historyHint", { count: assessmentHistory.length })}
          </p>
        </div>
      )}

      {/* 隐藏的描述文本，用于屏幕阅读器 */}
      <div id="pain-description" className="sr-only">
        {t("painTool.sliderDescription")}
      </div>
    </div>
  );
}
