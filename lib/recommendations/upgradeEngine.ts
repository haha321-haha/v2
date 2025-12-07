// import type { AbstractIntlMessages } from 'next-intl'; // 未使用，已注释

/**
 * 翻译函数类型
 * 兼容 next-intl 的 useTranslations 返回类型
 */
type TranslationFunction = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export interface AssessmentData {
  score: number;
  painPoint: "work" | "pain" | "emotion";
}

export interface Recommendation {
  urgency: "high" | "medium" | "low";
  headline: string;
  subheadline: string;
  discount?: string;
  socialProof: string;
  features: string[];
}

export function getUpgradeRecommendation(
  data: AssessmentData,
  t: TranslationFunction,
): Recommendation {
  const { score, painPoint } = data;

  if (score >= 7) {
    return {
      urgency: "high",
      headline: t(`Recommendations.high.${painPoint}`),
      subheadline: t(`Recommendations.subheadlines.high.${painPoint}`),
      discount: "$4.99 first month",
      socialProof: "92% of similar users found relief",
      features: [
        "Detailed 13-question assessment",
        "4-week personalized plan",
        "Cycle predictions",
        "Work optimization tools",
      ],
    };
  } else if (score >= 4) {
    return {
      urgency: "medium",
      headline: t(`Recommendations.medium.${painPoint}`),
      subheadline: t(`Recommendations.subheadlines.medium.${painPoint}`),
      socialProof: "127 women upgraded this week",
      features: ["Personalized insights", "Trend tracking", "Cycle sync tips"],
    };
  } else {
    return {
      urgency: "low",
      headline: t("Recommendations.low.generic"),
      subheadline: t("Recommendations.subheadlines.low.generic"),
      socialProof: "Join 600+ women optimizing their cycles",
      features: ["Advanced predictions", "Data export", "Priority support"],
    };
  }
}
