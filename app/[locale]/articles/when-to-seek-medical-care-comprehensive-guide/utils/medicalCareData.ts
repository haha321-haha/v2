// 医疗护理指南数据处理工具
// 基于souW1e2的数据结构，适配项目标准

import type {
  PainScaleItem,
  SymptomItem,
  DecisionTreeNode,
  ComparisonTableData,
  AssessmentResult,
} from "../types/medical-care-guide";

// 疼痛等级数据 - 基于souW1e2的完整数据结构
export const PAIN_SCALE_DATA: PainScaleItem[] = [
  {
    level: 0,
    title: "painTool.levels.0.title",
    advice: "painTool.levels.0.advice",
    severity: "none",
    recommendations: ["painTool.levels.0.rec1", "painTool.levels.0.rec2"],
    colorClass: "text-green-600",
  },
  {
    level: 1,
    title: "painTool.levels.1.title",
    advice: "painTool.levels.1.advice",
    severity: "mild",
    recommendations: ["painTool.levels.1.rec1", "painTool.levels.1.rec2"],
    colorClass: "text-green-500",
  },
  {
    level: 2,
    title: "painTool.levels.2.title",
    advice: "painTool.levels.2.advice",
    severity: "mild",
    recommendations: ["painTool.levels.2.rec1", "painTool.levels.2.rec2"],
    colorClass: "text-green-400",
  },
  {
    level: 3,
    title: "painTool.levels.3.title",
    advice: "painTool.levels.3.advice",
    severity: "mild",
    recommendations: ["painTool.levels.3.rec1", "painTool.levels.3.rec2"],
    colorClass: "text-yellow-500",
  },
  {
    level: 4,
    title: "painTool.levels.4.title",
    advice: "painTool.levels.4.advice",
    severity: "moderate",
    recommendations: ["painTool.levels.4.rec1", "painTool.levels.4.rec2"],
    colorClass: "text-yellow-600",
  },
  {
    level: 5,
    title: "painTool.levels.5.title",
    advice: "painTool.levels.5.advice",
    severity: "moderate",
    recommendations: ["painTool.levels.5.rec1", "painTool.levels.5.rec2"],
    colorClass: "text-orange-500",
  },
  {
    level: 6,
    title: "painTool.levels.6.title",
    advice: "painTool.levels.6.advice",
    severity: "moderate",
    recommendations: ["painTool.levels.6.rec1", "painTool.levels.6.rec2"],
    colorClass: "text-orange-600",
  },
  {
    level: 7,
    title: "painTool.levels.7.title",
    advice: "painTool.levels.7.advice",
    severity: "severe",
    recommendations: ["painTool.levels.7.rec1", "painTool.levels.7.rec2"],
    colorClass: "text-red-500",
  },
  {
    level: 8,
    title: "painTool.levels.8.title",
    advice: "painTool.levels.8.advice",
    severity: "severe",
    recommendations: ["painTool.levels.8.rec1", "painTool.levels.8.rec2"],
    colorClass: "text-red-600",
  },
  {
    level: 9,
    title: "painTool.levels.9.title",
    advice: "painTool.levels.9.advice",
    severity: "extreme",
    recommendations: ["painTool.levels.9.rec1", "painTool.levels.9.rec2"],
    colorClass: "text-red-700",
  },
  {
    level: 10,
    title: "painTool.levels.10.title",
    advice: "painTool.levels.10.advice",
    severity: "extreme",
    recommendations: ["painTool.levels.10.rec1", "painTool.levels.10.rec2"],
    colorClass: "text-red-800",
  },
];

// 症状数据 - 基于souW1e2的7个危险信号
export const SYMPTOM_DATA: SymptomItem[] = [
  {
    id: "s1",
    text: "symptomChecker.symptoms.s1.text",
    risk: "emergency",
    category: "pain",
    description: "symptomChecker.symptoms.s1.description",
    icon: "🚨",
  },
  {
    id: "s2",
    text: "symptomChecker.symptoms.s2.text",
    risk: "emergency",
    category: "bleeding",
    description: "symptomChecker.symptoms.s2.description",
    icon: "🩸",
  },
  {
    id: "s3",
    text: "symptomChecker.symptoms.s3.text",
    risk: "emergency",
    category: "systemic",
    description: "symptomChecker.symptoms.s3.description",
    icon: "🤒",
  },
  {
    id: "s4",
    text: "symptomChecker.symptoms.s4.text",
    risk: "high",
    category: "pain",
    description: "symptomChecker.symptoms.s4.description",
    icon: "⚡",
  },
  {
    id: "s5",
    text: "symptomChecker.symptoms.s5.text",
    risk: "high",
    category: "pattern",
    description: "symptomChecker.symptoms.s5.description",
    icon: "🔴",
  },
  {
    id: "s6",
    text: "symptomChecker.symptoms.s6.text",
    risk: "high",
    category: "pattern",
    description: "symptomChecker.symptoms.s6.description",
    icon: "📈",
  },
  {
    id: "s7",
    text: "symptomChecker.symptoms.s7.text",
    risk: "medium",
    category: "pain",
    description: "symptomChecker.symptoms.s7.description",
    icon: "💊",
  },
];

// 决策树数据 - 基于souW1e2的智能决策逻辑
export const DECISION_TREE_DATA: DecisionTreeNode = {
  id: "start",
  question: "decisionTree.questions.start",
  options: {
    yes: "decisionTree.options.yes",
    no: "decisionTree.options.no",
  },
  children: {
    yes: {
      id: "severe_pain",
      question: "decisionTree.questions.severePain",
      options: {
        yes: "decisionTree.options.yes",
        no: "decisionTree.options.no",
      },
      children: {
        yes: {
          id: "emergency_result",
          result: {
            title: "decisionTree.results.emergency.title",
            icon: "🚨",
            colorClass: "text-red-600 bg-red-50 border-red-200",
            text: "decisionTree.results.emergency.text",
            urgency: "emergency",
            actions: [
              "decisionTree.results.emergency.action1",
              "decisionTree.results.emergency.action2",
              "decisionTree.results.emergency.action3",
            ],
          },
        },
        no: {
          id: "duration_check",
          question: "decisionTree.questions.duration",
          options: {
            yes: "decisionTree.options.yes",
            no: "decisionTree.options.no",
          },
          children: {
            yes: {
              id: "urgent_result",
              result: {
                title: "decisionTree.results.urgent.title",
                icon: "⚠️",
                colorClass: "text-orange-600 bg-orange-50 border-orange-200",
                text: "decisionTree.results.urgent.text",
                urgency: "urgent",
                actions: [
                  "decisionTree.results.urgent.action1",
                  "decisionTree.results.urgent.action2",
                  "decisionTree.results.urgent.action3",
                ],
              },
            },
            no: {
              id: "routine_result",
              result: {
                title: "decisionTree.results.routine.title",
                icon: "📅",
                colorClass: "text-blue-600 bg-blue-50 border-blue-200",
                text: "decisionTree.results.routine.text",
                urgency: "routine",
                actions: [
                  "decisionTree.results.routine.action1",
                  "decisionTree.results.routine.action2",
                  "decisionTree.results.routine.action3",
                ],
              },
            },
          },
        },
      },
    },
    no: {
      id: "pattern_check",
      question: "decisionTree.questions.pattern",
      options: {
        yes: "decisionTree.options.yes",
        no: "decisionTree.options.no",
      },
      children: {
        yes: {
          id: "routine_result",
          result: {
            title: "decisionTree.results.routine.title",
            icon: "📅",
            colorClass: "text-blue-600 bg-blue-50 border-blue-200",
            text: "decisionTree.results.routine.text",
            urgency: "routine",
            actions: [
              "decisionTree.results.routine.action1",
              "decisionTree.results.routine.action2",
              "decisionTree.results.routine.action3",
            ],
          },
        },
        no: {
          id: "observe_result",
          result: {
            title: "decisionTree.results.observe.title",
            icon: "👁️",
            colorClass: "text-green-600 bg-green-50 border-green-200",
            text: "decisionTree.results.observe.text",
            urgency: "observe",
            actions: [
              "decisionTree.results.observe.action1",
              "decisionTree.results.observe.action2",
              "decisionTree.results.observe.action3",
            ],
          },
        },
      },
    },
  },
};

// 对比表格数据 - 基于souW1e2的正常vs异常对比
export const COMPARISON_TABLE_DATA: ComparisonTableData = {
  headers: [
    "comparisonTable.headers.condition",
    "comparisonTable.headers.normal",
    "comparisonTable.headers.concerning",
    "comparisonTable.headers.action",
  ],
  rows: [
    {
      condition: "comparisonTable.rows.painIntensity.condition",
      normalPain: "comparisonTable.rows.painIntensity.normal",
      concerningPain: "comparisonTable.rows.painIntensity.concerning",
      action: "comparisonTable.rows.painIntensity.action",
    },
    {
      condition: "comparisonTable.rows.painDuration.condition",
      normalPain: "comparisonTable.rows.painDuration.normal",
      concerningPain: "comparisonTable.rows.painDuration.concerning",
      action: "comparisonTable.rows.painDuration.action",
    },
    {
      condition: "comparisonTable.rows.painLocation.condition",
      normalPain: "comparisonTable.rows.painLocation.normal",
      concerningPain: "comparisonTable.rows.painLocation.concerning",
      action: "comparisonTable.rows.painLocation.action",
    },
    {
      condition: "comparisonTable.rows.associatedSymptoms.condition",
      normalPain: "comparisonTable.rows.associatedSymptoms.normal",
      concerningPain: "comparisonTable.rows.associatedSymptoms.concerning",
      action: "comparisonTable.rows.associatedSymptoms.action",
    },
    {
      condition: "comparisonTable.rows.medicationResponse.condition",
      normalPain: "comparisonTable.rows.medicationResponse.normal",
      concerningPain: "comparisonTable.rows.medicationResponse.concerning",
      action: "comparisonTable.rows.medicationResponse.action",
    },
    {
      condition: "comparisonTable.rows.dailyImpact.condition",
      normalPain: "comparisonTable.rows.dailyImpact.normal",
      concerningPain: "comparisonTable.rows.dailyImpact.concerning",
      action: "comparisonTable.rows.dailyImpact.action",
    },
    {
      condition: "comparisonTable.rows.cycleChanges.condition",
      normalPain: "comparisonTable.rows.cycleChanges.normal",
      concerningPain: "comparisonTable.rows.cycleChanges.concerning",
      action: "comparisonTable.rows.cycleChanges.action",
    },
  ],
};

// 工具函数：根据疼痛等级获取建议
export function getPainAdvice(level: number): PainScaleItem | null {
  if (level < 0 || level > 10) {
    return null;
  }
  return PAIN_SCALE_DATA[level] || null;
}

// 工具函数：分析症状风险等级
export function analyzeSymptomRisk(selectedSymptomIds: string[]): {
  riskLevel: AssessmentResult["riskLevel"];
  shouldSeeDoctor: boolean;
  urgency: AssessmentResult["urgency"];
  recommendations: string[];
} {
  const selectedSymptoms = SYMPTOM_DATA.filter((s) =>
    selectedSymptomIds.includes(s.id),
  );

  const emergencyCount = selectedSymptoms.filter(
    (s) => s.risk === "emergency",
  ).length;
  const highRiskCount = selectedSymptoms.filter(
    (s) => s.risk === "high",
  ).length;
  const mediumRiskCount = selectedSymptoms.filter(
    (s) => s.risk === "medium",
  ).length;

  // 紧急情况：任何紧急症状
  if (emergencyCount > 0) {
    return {
      riskLevel: "emergency",
      shouldSeeDoctor: true,
      urgency: "immediate",
      recommendations: [
        "symptomChecker.results.actions.emergency.0",
        "symptomChecker.results.actions.emergency.1",
        "symptomChecker.results.actions.emergency.2",
        "symptomChecker.results.actions.emergency.3",
      ],
    };
  }

  // 高风险：2个或更多高风险症状
  if (highRiskCount >= 2 || (highRiskCount >= 1 && mediumRiskCount >= 2)) {
    return {
      riskLevel: "high",
      shouldSeeDoctor: true,
      urgency: "within_week",
      recommendations: [
        "symptomChecker.results.actions.high.0",
        "symptomChecker.results.actions.high.1",
        "symptomChecker.results.actions.high.2",
        "symptomChecker.results.actions.high.3",
      ],
    };
  }

  // 中等风险：1个高风险症状或多个中风险症状
  if (highRiskCount === 1 || mediumRiskCount >= 2) {
    return {
      riskLevel: "medium",
      shouldSeeDoctor: true,
      urgency: "routine",
      recommendations: [
        "symptomChecker.results.actions.medium.0",
        "symptomChecker.results.actions.medium.1",
        "symptomChecker.results.actions.medium.2",
        "symptomChecker.results.actions.medium.3",
      ],
    };
  }

  // 低风险
  return {
    riskLevel: "low",
    shouldSeeDoctor: false,
    urgency: "monitor",
    recommendations: [
      "symptomChecker.results.actions.low.0",
      "symptomChecker.results.actions.low.1",
      "symptomChecker.results.actions.low.2",
      "symptomChecker.results.actions.low.3",
    ],
  };
}

// 工具函数：生成评估结果
export function generateAssessmentResult(
  painLevel: number,
  selectedSymptomIds: string[],
): AssessmentResult {
  const symptomAnalysis = analyzeSymptomRisk(selectedSymptomIds);

  // 综合疼痛等级和症状分析
  let finalRiskLevel = symptomAnalysis.riskLevel;
  let finalUrgency = symptomAnalysis.urgency;
  let finalShouldSeeDoctor = symptomAnalysis.shouldSeeDoctor;

  // 如果疼痛等级很高，提升风险等级
  if (painLevel >= 8 && finalRiskLevel === "low") {
    finalRiskLevel = "high";
    finalUrgency = "within_week";
    finalShouldSeeDoctor = true;
  } else if (painLevel >= 7 && finalRiskLevel === "low") {
    finalRiskLevel = "medium";
    finalUrgency = "routine";
    finalShouldSeeDoctor = true;
  }

  return {
    painLevel,
    symptoms: selectedSymptomIds,
    riskLevel: finalRiskLevel,
    recommendations: symptomAnalysis.recommendations,
    shouldSeeDoctor: finalShouldSeeDoctor,
    urgency: finalUrgency,
    timestamp: new Date().toISOString(),
  };
}
