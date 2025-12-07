import { Question } from "../types";

// 翻译函数类型
type TranslationFunction = (key: string) => string;

/**
 * 获取评估问题列表
 * @param t 翻译函数，从 useTranslations('periodPainImpactCalculator.questions') 获取
 * @returns Question[] 问题数组
 */
export function getAssessmentQuestions(t: TranslationFunction): Question[] {
  const questions: Question[] = [
    // 基础信息
    {
      id: "age_range",
      type: "single",
      category: "basic",
      weight: 1,
      title: t("age_range.title"),
      description: t("age_range.description"),
      validation: { required: true },
      options: [
        { value: "12-17", label: t("age_range.options.12-17"), weight: 1 },
        { value: "18-25", label: t("age_range.options.18-25"), weight: 1 },
        { value: "26-35", label: t("age_range.options.26-35"), weight: 1 },
        { value: "36-45", label: t("age_range.options.36-45"), weight: 1.2 },
        { value: "46+", label: t("age_range.options.46+"), weight: 1.5 },
      ],
    },
    {
      id: "cycle_regularity",
      type: "single",
      category: "basic",
      weight: 2,
      title: t("cycle_regularity.title"),
      description: t("cycle_regularity.description"),
      validation: { required: true },
      options: [
        {
          value: "very_regular",
          label: t("cycle_regularity.options.very_regular"),
          weight: 0,
        },
        {
          value: "mostly_regular",
          label: t("cycle_regularity.options.mostly_regular"),
          weight: 1,
        },
        {
          value: "irregular",
          label: t("cycle_regularity.options.irregular"),
          weight: 2,
        },
        {
          value: "very_irregular",
          label: t("cycle_regularity.options.very_irregular"),
          weight: 3,
        },
      ],
    },

    // Medical history
    {
      id: "medical_conditions",
      type: "multiple",
      category: "medical",
      weight: 3,
      title: t("medical_conditions.title"),
      description: t("medical_conditions.description"),
      options: [
        {
          value: "endometriosis",
          label: t("medical_conditions.options.endometriosis"),
          weight: 4,
        },
        {
          value: "fibroids",
          label: t("medical_conditions.options.fibroids"),
          weight: 3,
        },
        {
          value: "pcos",
          label: t("medical_conditions.options.pcos"),
          weight: 2,
        },
        {
          value: "thyroid",
          label: t("medical_conditions.options.thyroid"),
          weight: 2,
        },
        {
          value: "diabetes",
          label: t("medical_conditions.options.diabetes"),
          weight: 2,
        },
        {
          value: "heart_disease",
          label: t("medical_conditions.options.heart_disease"),
          weight: 3,
        },
        {
          value: "mental_health",
          label: t("medical_conditions.options.mental_health"),
          weight: 2,
        },
        {
          value: "none",
          label: t("medical_conditions.options.none"),
          weight: 0,
        },
      ],
    },

    // 疼痛相关
    {
      id: "pain_severity",
      type: "scale",
      category: "pain",
      weight: 3,
      title: t("pain_severity.title"),
      description: t("pain_severity.description"),
      validation: { required: true, min: 1, max: 10 },
      options: Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`, // Scale 类型的 label 是数字本身，不需要翻译
        weight: i + 1,
      })),
    },
    {
      id: "pain_duration",
      type: "single",
      category: "pain",
      weight: 2,
      title: t("pain_duration.title"),
      validation: { required: true },
      options: [
        {
          value: "few_hours",
          label: t("pain_duration.options.few_hours"),
          weight: 1,
        },
        {
          value: "half_day",
          label: t("pain_duration.options.half_day"),
          weight: 2,
        },
        {
          value: "one_day",
          label: t("pain_duration.options.one_day"),
          weight: 3,
        },
        {
          value: "two_days",
          label: t("pain_duration.options.two_days"),
          weight: 4,
        },
        {
          value: "three_plus_days",
          label: t("pain_duration.options.three_plus_days"),
          weight: 5,
        },
      ],
    },
    {
      id: "pain_location",
      type: "multiple",
      category: "pain",
      weight: 2,
      title: t("pain_location.title"),
      description: t("pain_location.description"),
      validation: { required: true },
      options: [
        {
          value: "lower_abdomen",
          label: t("pain_location.options.lower_abdomen"),
          icon: "🤰",
          weight: 2,
        },
        {
          value: "lower_back",
          label: t("pain_location.options.lower_back"),
          icon: "🔙",
          weight: 2,
        },
        {
          value: "upper_back",
          label: t("pain_location.options.upper_back"),
          icon: "⬆️",
          weight: 1,
        },
        {
          value: "thighs",
          label: t("pain_location.options.thighs"),
          icon: "🦵",
          weight: 1,
        },
        {
          value: "head",
          label: t("pain_location.options.head"),
          icon: "🧠",
          weight: 1,
        },
        {
          value: "chest",
          label: t("pain_location.options.chest"),
          icon: "💗",
          weight: 1,
        },
      ],
    },
    {
      id: "pain_impact",
      type: "single",
      category: "pain",
      weight: 3,
      title: t("pain_impact.title"),
      validation: { required: true },
      options: [
        {
          value: "no_impact",
          label: t("pain_impact.options.no_impact"),
          weight: 0,
        },
        {
          value: "mild_impact",
          label: t("pain_impact.options.mild_impact"),
          weight: 1,
        },
        {
          value: "moderate_impact",
          label: t("pain_impact.options.moderate_impact"),
          weight: 2,
        },
        {
          value: "severe_impact",
          label: t("pain_impact.options.severe_impact"),
          weight: 3,
        },
        {
          value: "unable_function",
          label: t("pain_impact.options.unable_function"),
          weight: 4,
        },
      ],
    },

    // 伴随症状
    {
      id: "accompanying_symptoms",
      type: "multiple",
      category: "symptoms",
      weight: 2,
      title: t("accompanying_symptoms.title"),
      description: t("accompanying_symptoms.description"),
      validation: { required: false },
      options: [
        {
          value: "nausea",
          label: t("accompanying_symptoms.options.nausea"),
          icon: "🤢",
          weight: 2,
        },
        {
          value: "headache",
          label: t("accompanying_symptoms.options.headache"),
          icon: "🤕",
          weight: 1,
        },
        {
          value: "diarrhea",
          label: t("accompanying_symptoms.options.diarrhea"),
          icon: "💩",
          weight: 1,
        },
        {
          value: "constipation",
          label: t("accompanying_symptoms.options.constipation"),
          icon: "🚫",
          weight: 1,
        },
        {
          value: "bloating",
          label: t("accompanying_symptoms.options.bloating"),
          icon: "🎈",
          weight: 1,
        },
        {
          value: "breast_tenderness",
          label: t("accompanying_symptoms.options.breast_tenderness"),
          icon: "💗",
          weight: 1,
        },
        {
          value: "mood_changes",
          label: t("accompanying_symptoms.options.mood_changes"),
          icon: "😤",
          weight: 1,
        },
        {
          value: "fatigue",
          label: t("accompanying_symptoms.options.fatigue"),
          icon: "😴",
          weight: 1,
        },
        {
          value: "dizziness",
          label: t("accompanying_symptoms.options.dizziness"),
          icon: "💫",
          weight: 1,
        },
        {
          value: "depression",
          label: t("accompanying_symptoms.options.depression"),
          icon: "😢",
          weight: 2,
        },
      ],
    },

    // 生活方式 - 重点放在工作与生活影响上
    {
      id: "activity_disruption",
      type: "single",
      category: "lifestyle",
      weight: 3,
      title: t("activity_disruption.title"),
      validation: { required: true },
      options: [
        {
          value: "never",
          label: t("activity_disruption.options.never"),
          weight: 0,
        },
        {
          value: "occasionally",
          label: t("activity_disruption.options.occasionally"),
          weight: 1,
        },
        {
          value: "often",
          label: t("activity_disruption.options.often"),
          weight: 2,
        },
        {
          value: "almost_every_cycle",
          label: t("activity_disruption.options.almost_every_cycle"),
          weight: 3,
        },
      ],
    },
    {
      id: "work_study_impact",
      type: "single",
      category: "lifestyle",
      weight: 3,
      title: t("work_study_impact.title"),
      validation: { required: true },
      options: [
        {
          value: "no_impact",
          label: t("work_study_impact.options.no_impact"),
          weight: 0,
        },
        {
          value: "mild_impact",
          label: t("work_study_impact.options.mild_impact"),
          weight: 1,
        },
        {
          value: "moderate_impact",
          label: t("work_study_impact.options.moderate_impact"),
          weight: 2,
        },
        {
          value: "severe_impact",
          label: t("work_study_impact.options.severe_impact"),
          weight: 3,
        },
        {
          value: "unable_to_work",
          label: t("work_study_impact.options.unable_to_work"),
          weight: 4,
        },
      ],
    },
    {
      id: "stress_level",
      type: "scale",
      category: "lifestyle",
      weight: 2,
      title: t("stress_level.title"),
      description: t("stress_level.description"),
      validation: { required: true, min: 1, max: 10 },
      options: Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`, // Scale 类型的 label 是数字本身，不需要翻译
        weight: Math.floor(i / 3),
      })),
    },
    {
      id: "sleep_quality",
      type: "single",
      category: "lifestyle",
      weight: 1,
      title: t("sleep_quality.title"),
      validation: { required: true },
      options: [
        {
          value: "excellent",
          label: t("sleep_quality.options.excellent"),
          weight: 0,
        },
        { value: "good", label: t("sleep_quality.options.good"), weight: 0 },
        { value: "fair", label: t("sleep_quality.options.fair"), weight: 1 },
        { value: "poor", label: t("sleep_quality.options.poor"), weight: 2 },
        {
          value: "very_poor",
          label: t("sleep_quality.options.very_poor"),
          weight: 3,
        },
      ],
    },
    {
      id: "diet_habits",
      type: "multiple",
      category: "lifestyle",
      weight: 1,
      title: t("diet_habits.title"),
      description: t("diet_habits.description"),
      validation: { required: true },
      options: [
        {
          value: "balanced",
          label: t("diet_habits.options.balanced"),
          weight: 0,
        },
        {
          value: "high_sugar",
          label: t("diet_habits.options.high_sugar"),
          weight: 2,
        },
        {
          value: "high_caffeine",
          label: t("diet_habits.options.high_caffeine"),
          weight: 1,
        },
        {
          value: "irregular_meals",
          label: t("diet_habits.options.irregular_meals"),
          weight: 2,
        },
        {
          value: "processed_foods",
          label: t("diet_habits.options.processed_foods"),
          weight: 2,
        },
        {
          value: "adequate_water",
          label: t("diet_habits.options.adequate_water"),
          weight: 0,
        },
      ],
    },
    {
      id: "menstrual_exercise",
      type: "single",
      category: "lifestyle",
      weight: 2,
      title: t("menstrual_exercise.title"),
      description: t("menstrual_exercise.description"),
      validation: { required: true },
      options: [
        {
          value: "complete_rest",
          label: t("menstrual_exercise.options.complete_rest"),
          weight: 1,
        },
        {
          value: "light_stretch",
          label: t("menstrual_exercise.options.light_stretch"),
          weight: 3,
        },
        {
          value: "moderate_reduced",
          label: t("menstrual_exercise.options.moderate_reduced"),
          weight: 3,
        },
        {
          value: "maintain_intensity",
          label: t("menstrual_exercise.options.maintain_intensity"),
          weight: 1,
        },
        {
          value: "increase_exercise",
          label: t("menstrual_exercise.options.increase_exercise"),
          weight: 0,
        },
      ],
    },

    // 医疗历史
    {
      id: "current_treatments",
      type: "multiple",
      category: "medical",
      weight: 1,
      title: t("current_treatments.title"),
      description: t("current_treatments.description"),
      validation: { required: false },
      options: [
        {
          value: "pain_medication",
          label: t("current_treatments.options.pain_medication"),
          weight: 0,
        },
        {
          value: "heat_therapy",
          label: t("current_treatments.options.heat_therapy"),
          weight: 0,
        },
        {
          value: "exercise",
          label: t("current_treatments.options.exercise"),
          weight: 0,
        },
        {
          value: "rest",
          label: t("current_treatments.options.rest"),
          weight: 1,
        },
        {
          value: "massage",
          label: t("current_treatments.options.massage"),
          weight: 0,
        },
        {
          value: "herbal_remedies",
          label: t("current_treatments.options.herbal_remedies"),
          weight: 0,
        },
        {
          value: "birth_control",
          label: t("current_treatments.options.birth_control"),
          weight: 0,
        },
        {
          value: "none",
          label: t("current_treatments.options.none"),
          weight: 2,
        },
      ],
    },
  ];

  return questions;
}

// 为了向后兼容，保留旧的导出方式（但标记为已废弃）
// 注意：这个对象现在只用于类型检查，实际使用应该使用 getAssessmentQuestions 函数
/** @deprecated 使用 getAssessmentQuestions 函数代替 */
export const assessmentQuestions: Record<string, Question[]> = {
  zh: [], // 空数组，实际不再使用
  en: [], // 空数组，实际不再使用
};
