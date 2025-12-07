/**
 * PHQ-9 Types and Utilities
 * PHQ-9 (Patient Health Questionnaire-9) 抑郁症筛查工具
 */

export interface PHQ9Question {
  id: number;
  text: string;
  textZh: string;
}

export interface PHQ9Answer {
  questionId: number;
  score: number; // 0-3
}

export interface PHQ9Result {
  totalScore: number;
  severity:
    | "none"
    | "minimal"
    | "mild"
    | "moderate"
    | "moderately-severe"
    | "severe";
  severityZh: string;
  answers: PHQ9Answer[];
  completedAt: number;
  // 扩展属性（用于显示）
  score?: number; // 别名，等同于 totalScore
  riskLevel?: "low" | "moderate" | "high" | "severe";
  level?: string; // 等同于 severity
  levelLabel?: string; // 等同于 severityZh
  requiresProfessionalHelp?: boolean;
  hasThoughtsOfSelfHarm?: boolean;
  recommendations?: string[];
}

export const PHQ9_QUESTIONS: PHQ9Question[] = [
  {
    id: 1,
    text: "Little interest or pleasure in doing things",
    textZh: "做事时提不起劲或没有兴趣",
  },
  {
    id: 2,
    text: "Feeling down, depressed, or hopeless",
    textZh: "感到心情低落、沮丧或绝望",
  },
  {
    id: 3,
    text: "Trouble falling or staying asleep, or sleeping too much",
    textZh: "入睡困难、睡不安稳或睡眠过多",
  },
  {
    id: 4,
    text: "Feeling tired or having little energy",
    textZh: "感觉疲倦或没有活力",
  },
  {
    id: 5,
    text: "Poor appetite or overeating",
    textZh: "食欲不振或吃太多",
  },
  {
    id: 6,
    text: "Feeling bad about yourself or that you are a failure",
    textZh: "觉得自己很糟或觉得自己很失败",
  },
  {
    id: 7,
    text: "Trouble concentrating on things",
    textZh: "对事物专注有困难",
  },
  {
    id: 8,
    text: "Moving or speaking slowly, or being fidgety or restless",
    textZh: "动作或说话速度缓慢，或坐立不安",
  },
  {
    id: 9,
    text: "Thoughts that you would be better off dead",
    textZh: "有不如死掉或伤害自己的念头",
  },
];

export class PHQ9Utils {
  /**
   * 计算总分
   */
  static calculateTotalScore(answers: PHQ9Answer[]): number {
    return answers.reduce((sum, answer) => sum + answer.score, 0);
  }

  /**
   * 判断严重程度
   */
  static getSeverity(totalScore: number): PHQ9Result["severity"] {
    if (totalScore <= 4) return "none";
    if (totalScore <= 9) return "minimal";
    if (totalScore <= 14) return "mild";
    if (totalScore <= 19) return "moderate";
    if (totalScore <= 24) return "moderately-severe";
    return "severe";
  }

  /**
   * 获取中文严重程度描述
   */
  static getSeverityZh(severity: PHQ9Result["severity"]): string {
    const map: Record<PHQ9Result["severity"], string> = {
      none: "无抑郁症状",
      minimal: "轻微抑郁症状",
      mild: "轻度抑郁",
      moderate: "中度抑郁",
      "moderately-severe": "中重度抑郁",
      severe: "重度抑郁",
    };
    return map[severity];
  }

  /**
   * 获取建议
   */
  static getRecommendation(
    severity: PHQ9Result["severity"],
    locale: "en" | "zh",
  ): string {
    const recommendations = {
      none: {
        en: "No depression symptoms detected. Continue maintaining good mental health habits.",
        zh: "未检测到抑郁症状。继续保持良好的心理健康习惯。",
      },
      minimal: {
        en: "Minimal depression symptoms. Consider stress management techniques and regular exercise.",
        zh: "轻微抑郁症状。建议采用压力管理技巧和定期运动。",
      },
      mild: {
        en: "Mild depression. Consider talking to a mental health professional for support.",
        zh: "轻度抑郁。建议咨询心理健康专业人士寻求支持。",
      },
      moderate: {
        en: "Moderate depression. We recommend consulting with a mental health professional.",
        zh: "中度抑郁。我们建议咨询心理健康专业人士。",
      },
      "moderately-severe": {
        en: "Moderately severe depression. Please seek professional help as soon as possible.",
        zh: "中重度抑郁。请尽快寻求专业帮助。",
      },
      severe: {
        en: "Severe depression. Please seek immediate professional help. If you have thoughts of self-harm, contact emergency services.",
        zh: "重度抑郁。请立即寻求专业帮助。如果有自我伤害的念头，请联系紧急服务。",
      },
    };

    return recommendations[severity][locale];
  }

  /**
   * 生成完整结果
   */
  static generateResult(answers: PHQ9Answer[]): PHQ9Result {
    const totalScore = this.calculateTotalScore(answers);
    const severity = this.getSeverity(totalScore);
    const severityZh = this.getSeverityZh(severity);

    // 检查是否有自我伤害的想法（第9题，questionId === 9）
    const question9Answer = answers.find((a) => a.questionId === 9);
    const hasThoughtsOfSelfHarm = question9Answer && question9Answer.score >= 2;

    // 判断是否需要专业帮助
    const requiresProfessionalHelp =
      severity === "moderate" ||
      severity === "moderately-severe" ||
      severity === "severe";

    // 确定风险等级
    const riskLevel: "low" | "moderate" | "high" | "severe" =
      severity === "none" || severity === "minimal"
        ? "low"
        : severity === "mild"
          ? "moderate"
          : severity === "moderate" || severity === "moderately-severe"
            ? "high"
            : "severe";

    // 生成建议
    const recommendations: string[] = [];
    if (severity !== "none") {
      recommendations.push(this.getRecommendation(severity, "zh"));
    }
    if (requiresProfessionalHelp) {
      recommendations.push("建议咨询心理健康专业人士");
    }
    if (hasThoughtsOfSelfHarm) {
      recommendations.push("如有自我伤害想法，请立即寻求专业帮助");
    }

    return {
      totalScore,
      score: totalScore, // 别名
      severity,
      severityZh,
      level: severity, // 别名
      levelLabel: severityZh, // 别名
      riskLevel,
      requiresProfessionalHelp,
      hasThoughtsOfSelfHarm,
      recommendations,
      answers,
      completedAt: Date.now(),
    };
  }

  /**
   * 验证答案完整性
   */
  static validateAnswers(answers: PHQ9Answer[]): boolean {
    if (answers.length !== 9) return false;

    const questionIds = answers.map((a) => a.questionId).sort();
    const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
      JSON.stringify(questionIds) === JSON.stringify(expectedIds) &&
      answers.every((a) => a.score >= 0 && a.score <= 3)
    );
  }
}
