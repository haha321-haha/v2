"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { useSymptomChecker } from "../hooks/useSymptomChecker";
import { SYMPTOM_DATA } from "../utils/medicalCareData";
import { SymptomAnalysisLogic } from "../utils/assessmentLogic";
import styles from "../styles/SymptomChecklist.module.css";
import type { SymptomChecklistProps } from "../types/medical-care-guide";

// 风险等级图标映射
const RISK_ICONS = {
  emergency: AlertCircle,
  high: AlertTriangle,
  medium: Clock,
};

// 风险等级颜色映射
const RISK_COLORS = {
  emergency: "text-red-600 bg-red-50 border-red-200",
  high: "text-orange-600 bg-orange-50 border-orange-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  low: "text-green-600 bg-green-50 border-green-200",
};

export default function SymptomChecklist({
  onAnalysisComplete,
  className = "",
  preSelectedSymptoms = [],
}: SymptomChecklistProps) {
  const t = useTranslations("medicalCareGuide");
  const {
    checkedSymptoms,
    assessmentResult,
    toggleSymptom,
    analyzeSymptoms,
    resetAssessment,
  } = useSymptomChecker(SYMPTOM_DATA);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 初始化预选症状
  useState(() => {
    preSelectedSymptoms.forEach((symptomId) => {
      if (SYMPTOM_DATA.find((s) => s.id === symptomId)) {
        toggleSymptom(symptomId);
      }
    });
  });

  // 处理症状选择
  const handleSymptomToggle = useCallback(
    (symptomId: string) => {
      toggleSymptom(symptomId);
    },
    [toggleSymptom],
  );

  // 处理分析
  const handleAnalyze = useCallback(async () => {
    if (checkedSymptoms.length === 0) return;

    setIsAnalyzing(true);

    // 模拟分析延迟，增强用户体验
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = analyzeSymptoms();
    setIsAnalyzing(false);

    onAnalysisComplete?.(result);
  }, [checkedSymptoms, analyzeSymptoms, onAnalysisComplete]);

  // 处理重置
  const handleReset = useCallback(() => {
    resetAssessment();
    setIsAnalyzing(false);
  }, [resetAssessment]);

  // 按风险等级分组症状
  const symptomsByRisk = SymptomAnalysisLogic.groupSymptomsByRisk(SYMPTOM_DATA);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <CheckCircle className={styles.icon} size={24} />
          {t("symptomChecker.title")}
        </h3>
        <p className={styles.description}>{t("symptomChecker.description")}</p>
        <div className={styles.instructions}>
          <p>{t("symptomChecker.instructions")}</p>
        </div>
      </div>

      {/* 症状清单 */}
      <div className={styles.symptomGroups}>
        {(["emergency", "high", "medium"] as const).map((riskLevel) => {
          const symptoms = symptomsByRisk[riskLevel] || [];
          if (symptoms.length === 0) return null;

          const RiskIcon = RISK_ICONS[riskLevel];

          return (
            <div key={riskLevel} className={styles.symptomGroup}>
              <div className={styles.groupHeader}>
                <RiskIcon
                  size={20}
                  className={`${styles.groupIcon} ${
                    RISK_COLORS[riskLevel].split(" ")[0]
                  }`}
                />
                <h4 className={styles.groupTitle}>
                  {t(`symptomChecker.riskLevels.${riskLevel}.title`)}
                </h4>
                <span className={styles.groupBadge}>
                  {t(`symptomChecker.riskLevels.${riskLevel}.badge`)}
                </span>
              </div>

              <div className={styles.symptomList}>
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className={`${styles.symptomItem} ${
                      RISK_COLORS[symptom.risk]
                    } ${
                      checkedSymptoms.includes(symptom.id) ? styles.checked : ""
                    }`}
                  >
                    <label className={styles.symptomLabel}>
                      <input
                        type="checkbox"
                        checked={checkedSymptoms.includes(symptom.id)}
                        onChange={() => handleSymptomToggle(symptom.id)}
                        className={styles.checkbox}
                        aria-describedby={`${symptom.id}-description`}
                      />

                      <div className={styles.symptomContent}>
                        <div className={styles.symptomHeader}>
                          <span className={styles.symptomIcon}>
                            {symptom.icon}
                          </span>
                          <span className={styles.symptomText}>
                            {t(symptom.text)}
                          </span>
                        </div>

                        {symptom.description && (
                          <div
                            id={`${symptom.id}-description`}
                            className={styles.symptomDescription}
                          >
                            {t(symptom.description)}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 操作按钮 */}
      <div className={styles.actions}>
        <button
          onClick={handleAnalyze}
          disabled={checkedSymptoms.length === 0 || isAnalyzing}
          className={`${styles.analyzeButton} ${
            checkedSymptoms.length === 0 ? styles.disabled : ""
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className={styles.spinner} />
              {t("symptomChecker.analyzing")}
            </>
          ) : (
            t("symptomChecker.analyzeButton")
          )}
        </button>

        {(checkedSymptoms.length > 0 || assessmentResult) && (
          <button onClick={handleReset} className={styles.resetButton}>
            {t("symptomChecker.resetButton")}
          </button>
        )}
      </div>

      {/* 分析结果 */}
      {assessmentResult && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h4 className={styles.resultsTitle}>
              {t("symptomChecker.results.title")}
            </h4>
          </div>

          <div
            className={`${styles.resultCard} ${
              RISK_COLORS[assessmentResult.riskLevel]
            }`}
          >
            <div className={styles.resultHeader}>
              <div className={styles.resultIcon}>
                {assessmentResult.riskLevel === "emergency" && "🚨"}
                {assessmentResult.riskLevel === "high" && "⚠️"}
                {assessmentResult.riskLevel === "medium" && "⚡"}
                {assessmentResult.riskLevel === "low" && "✅"}
              </div>
              <div className={styles.resultInfo}>
                <h5 className={styles.resultRiskLevel}>
                  {t(
                    `symptomChecker.results.riskLevels.${assessmentResult.riskLevel}.title`,
                  )}
                </h5>
                <p className={styles.resultUrgency}>
                  {t(
                    `symptomChecker.results.urgency.${assessmentResult.urgency}`,
                  )}
                </p>
              </div>
            </div>

            <div className={styles.resultContent}>
              <p className={styles.resultDescription}>
                {t(
                  `symptomChecker.results.riskLevels.${assessmentResult.riskLevel}.description`,
                )}
              </p>

              {assessmentResult.recommendations.length > 0 && (
                <div className={styles.recommendations}>
                  <h6 className={styles.recommendationsTitle}>
                    {t("symptomChecker.results.recommendations")}
                  </h6>
                  <ul className={styles.recommendationsList}>
                    {assessmentResult.recommendations.map((rec, index) => (
                      <li key={index} className={styles.recommendationItem}>
                        {t(rec)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 紧急情况特殊提示 */}
            {assessmentResult.riskLevel === "emergency" && (
              <div className={styles.emergencyAlert}>
                <div className={styles.emergencyIcon}>🚨</div>
                <div className={styles.emergencyContent}>
                  <strong>{t("symptomChecker.emergency.title")}</strong>
                  <p>{t("symptomChecker.emergency.text")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 选中症状统计 */}
      {checkedSymptoms.length > 0 && (
        <div className={styles.summary}>
          <p className={styles.summaryText}>
            {t("symptomChecker.summary", {
              count: checkedSymptoms.length,
              total: SYMPTOM_DATA.length,
            })}
          </p>
        </div>
      )}
    </div>
  );
}
