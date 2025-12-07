// PHQ-9 临床量表题库
// 基于标准PHQ-9评估工具，用于抑郁症状评估

export interface PHQ9Question {
  id: string;
  order: number;
  text: string; // 问题内容
  originalText: string; // 英文原文
  source: string; // 来源标识
  category: "depression";
  options: PHQ9Option[];
}

export interface PHQ9Option {
  value: number; // 0-3分
  label: string; // 中文标签
  originalLabel: string; // 英文标签
  emoji?: string; // 表情符号
}

export const PHQ9_QUESTIONS: PHQ9Question[] = [
  {
    id: "phq9_1",
    order: 1,
    text: "做事时提不起劲或没有兴趣",
    originalText: "Little interest or pleasure in doing things",
    source: "PHQ-9 Q1",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_2",
    order: 2,
    text: "感到心情低落、沮丧或绝望",
    originalText: "Feeling down, depressed, or hopeless",
    source: "PHQ-9 Q2",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_3",
    order: 3,
    text: "入睡困难、睡不安稳或睡眠过多",
    originalText: "Trouble falling or staying asleep, or sleeping too much",
    source: "PHQ-9 Q3",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_4",
    order: 4,
    text: "感觉疲倦或没有活力",
    originalText: "Feeling tired or having little energy",
    source: "PHQ-9 Q4",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_5",
    order: 5,
    text: "食欲不振或吃太多",
    originalText: "Poor appetite or overeating",
    source: "PHQ-9 Q5",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_6",
    order: 6,
    text: "觉得自己很糟糕，或觉得自己很失败，或让自己或家人失望",
    originalText:
      "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    source: "PHQ-9 Q6",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_7",
    order: 7,
    text: "注意力难以集中，譬如阅读报纸或看电视时",
    originalText:
      "Trouble concentrating on things, such as reading the newspaper or watching television",
    source: "PHQ-9 Q7",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_8",
    order: 8,
    text: "动作或说话速度缓慢到别人已经察觉，或正好相反的烦躁或坐立不安",
    originalText:
      "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    source: "PHQ-9 Q8",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
  {
    id: "phq9_9",
    order: 9,
    text: "有不如死掉或伤害自己的念头",
    originalText:
      "Thoughts that you would be better off dead, or of hurting yourself in some way",
    source: "PHQ-9 Q9",
    category: "depression",
    options: [
      { value: 0, label: "完全没有", originalLabel: "Not at all", emoji: "😊" },
      { value: 1, label: "有几天", originalLabel: "Several days", emoji: "😐" },
      {
        value: 2,
        label: "超过一半的日子",
        originalLabel: "More than half the days",
        emoji: "😟",
      },
      {
        value: 3,
        label: "几乎每天",
        originalLabel: "Nearly every day",
        emoji: "😰",
      },
    ],
  },
];

// PHQ-9 评分分级
export const PHQ9_SCORE_RANGES = {
  NONE: { min: 0, max: 4, label: "无抑郁症状", level: "none" },
  MILD: { min: 5, max: 9, label: "轻度抑郁", level: "mild" },
  MODERATE: { min: 10, max: 14, label: "中度抑郁", level: "moderate" },
  MODERATELY_SEVERE: {
    min: 15,
    max: 19,
    label: "中重度抑郁",
    level: "moderate-severe",
  },
  SEVERE: { min: 20, max: 27, label: "重度抑郁", level: "severe" },
} as const;

export type PHQ9ScoreLevel =
  (typeof PHQ9_SCORE_RANGES)[keyof typeof PHQ9_SCORE_RANGES]["level"];

// 获取评分等级
export function getPHQ9ScoreLevel(
  score: number,
): (typeof PHQ9_SCORE_RANGES)[keyof typeof PHQ9_SCORE_RANGES] {
  for (const [, range] of Object.entries(PHQ9_SCORE_RANGES)) {
    if (score >= range.min && score <= range.max) {
      return range;
    }
  }
  return PHQ9_SCORE_RANGES.NONE;
}

// 计算PHQ-9评分
export function calculatePHQ9Score(
  answers: { questionId: string; value: number }[],
): {
  score: number;
  level: PHQ9ScoreLevel;
  range: (typeof PHQ9_SCORE_RANGES)[keyof typeof PHQ9_SCORE_RANGES];
} {
  const phq9Answers = answers.filter((a) => a.questionId.startsWith("phq9_"));
  const score = phq9Answers.reduce((sum, answer) => sum + answer.value, 0);
  const range = getPHQ9ScoreLevel(score);

  return {
    score,
    level: range.level,
    range,
  };
}
