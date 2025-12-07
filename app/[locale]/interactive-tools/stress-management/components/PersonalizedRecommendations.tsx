"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
// LocalStorageManager removed - using localStorage directly

interface PersonalizedRecommendationsProps {
  locale: string;
}

interface Recommendation {
  id: string;
  type: "article" | "tool" | "technique";
  title: string;
  description: string;
  href: string;
  priority: "urgent" | "high" | "medium" | "low";
  icon: string;
}

export default function PersonalizedRecommendations({
  locale,
}: PersonalizedRecommendationsProps) {
  const t = useTranslations(
    "stressManagement.assessment.personalizedRecommendations",
  );
  const tRec = useTranslations(
    "stressManagement.assessment.personalizedRecommendations.recommendations",
  );
  const tCommon = useTranslations("interactiveTools.stressManagement");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stressLevel, setStressLevel] = useState<string>("");
  const [stressScore, setStressScore] = useState<number>(0);
  const [hasAssessment, setHasAssessment] = useState(false);

  // 简化版推荐算法：基于分数的if/else
  // Move before useEffect to avoid dependency issues
  const generateSimpleRecommendations = useCallback(
    (score: number, level: string, locale: string): Recommendation[] => {
      const recs: Recommendation[] = [];

      // 根据文档：>=24高压力，>=16中度，<16低压力
      if (score >= 24 || level === "severe" || level === "high") {
        // 高压力：紧急干预
        recs.push({
          id: "breathing_exercise",
          type: "tool",
          title: tRec("breathingExercise.title"),
          description: tRec("breathingExercise.high"),
          href: `/${locale}/interactive-tools/stress-management/breathing-exercise`,
          priority: "urgent",
          icon: "💨",
        });

        recs.push({
          id: "stress_guide",
          type: "article",
          title: tRec("stressGuide.title"),
          description: tRec("stressGuide.high"),
          href: `/${locale}/articles/menstrual-stress-management-complete-guide`,
          priority: "high",
          icon: "📋",
        });

        recs.push({
          id: "sleep_guide",
          type: "article",
          title: tRec("sleepGuide.title"),
          description: tRec("sleepGuide.high"),
          href: `/${locale}/articles/menstrual-sleep-quality-improvement-guide`,
          priority: "high",
          icon: "😴",
        });

        recs.push({
          id: "office_scenario",
          type: "technique",
          title: tRec("officeScenario.title"),
          description: tRec("officeScenario.high"),
          href: `/${locale}/scenario-solutions/office`,
          priority: "high",
          icon: "💼",
        });
      } else if (score >= 16 || level === "moderate") {
        // 中度压力：积极管理
        recs.push({
          id: "breathing_exercise",
          type: "tool",
          title: tRec("breathingExercise.title"),
          description: tRec("breathingExercise.moderate"),
          href: `/${locale}/interactive-tools/stress-management/breathing-exercise`,
          priority: "high",
          icon: "💨",
        });

        recs.push({
          id: "stress_guide",
          type: "article",
          title: tRec("stressGuide.title"),
          description: tRec("stressGuide.moderate"),
          href: `/${locale}/articles/menstrual-stress-management-complete-guide`,
          priority: "high",
          icon: "📋",
        });

        recs.push({
          id: "breathing_guide",
          type: "article",
          title: tRec("breathingGuide.title"),
          description: tRec("breathingGuide.moderate"),
          href: `/${locale}/articles/breathing-exercises-guide`,
          priority: "medium",
          icon: "💨",
        });

        recs.push({
          id: "office_scenario",
          type: "technique",
          title: tRec("officeScenario.title"),
          description: tRec("officeScenario.moderate"),
          href: `/${locale}/scenario-solutions/office`,
          priority: "medium",
          icon: "💼",
        });
      } else {
        // 低压力：预防维护
        recs.push({
          id: "sleep_guide",
          type: "article",
          title: tRec("sleepGuide.title"),
          description: tRec("sleepGuide.low"),
          href: `/${locale}/articles/menstrual-sleep-quality-improvement-guide`,
          priority: "medium",
          icon: "😴",
        });

        recs.push({
          id: "breathing_exercise",
          type: "tool",
          title: tRec("breathingExercise.title"),
          description: tRec("breathingExercise.low"),
          href: `/${locale}/interactive-tools/stress-management/breathing-exercise`,
          priority: "low",
          icon: "💨",
        });

        recs.push({
          id: "exercise_scenario",
          type: "technique",
          title: tRec("exerciseScenario.title"),
          description: tRec("exerciseScenario.low"),
          href: `/${locale}/scenario-solutions/exercise`,
          priority: "low",
          icon: "🏃",
        });
      }

      return recs;
    },
    [tRec],
  );

  useEffect(() => {
    // 从localStorage获取最新的评估结果
    const existing = localStorage.getItem("stress_assessments");
    const assessments = existing ? JSON.parse(existing) : [];
    if (assessments.length > 0) {
      const latestAssessment = assessments[assessments.length - 1];
      setStressScore(latestAssessment.score);
      setStressLevel(latestAssessment.stressLevel);
      setHasAssessment(true);

      // 生成个性化推荐
      const recs = generateSimpleRecommendations(
        latestAssessment.score,
        latestAssessment.stressLevel,
        locale,
      );
      setRecommendations(recs);
    }
  }, [locale, generateSimpleRecommendations]);

  // 获取压力等级显示文本
  const getStressLevelText = (level: string, score: number) => {
    // 根据文档调整阈值
    if (score >= 24 || level === "severe" || level === "high") {
      return {
        text: tCommon(`stressLevels.high`),
        color: "text-red-600",
        bgColor: "bg-red-100",
        description: t("levelDescriptions.high"),
      };
    } else if (score >= 16 || level === "moderate") {
      return {
        text: tCommon(`stressLevels.moderate`),
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description: t("levelDescriptions.moderate"),
      };
    } else {
      return {
        text: tCommon(`stressLevels.low`),
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: t("levelDescriptions.low"),
      };
    }
  };

  // 如果没有评估结果，不显示
  if (!hasAssessment) {
    return null;
  }

  const levelInfo = getStressLevelText(stressLevel, stressScore);
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
  const sortedRecs = [...recommendations].sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority],
  );

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 sm:p-8 mb-8">
      <div className="max-w-4xl mx-auto">
        {/* 压力等级显示 */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`px-4 py-2 rounded-full ${levelInfo.bgColor} ${levelInfo.color} font-semibold`}
            >
              {levelInfo.text}
            </div>
            <div className="text-gray-600">
              {t("stressScore")}: {stressScore}/100
            </div>
          </div>
          <p className="text-gray-700">{levelInfo.description}</p>
        </div>

        {/* 即时行动建议 */}
        {sortedRecs.length > 0 && sortedRecs[0].priority === "urgent" && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <h3 className="font-bold text-red-800 mb-2">
              {t("immediateAction")}
            </h3>
            <p className="text-red-700 mb-3">{sortedRecs[0].description}</p>
            <Link
              href={sortedRecs[0].href}
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("startNow")} →
            </Link>
          </div>
        )}

        {/* 推荐列表 */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t("recommendedForYou")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedRecs.slice(0, 4).map((rec) => (
              <Link
                key={rec.id}
                href={rec.href}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-300"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {rec.title}
                      </h4>
                      {rec.priority === "urgent" && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          {t("urgent")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
