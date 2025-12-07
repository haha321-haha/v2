// 评估逻辑工具 - 基于souW1e2的医学算法
// 提供疼痛评估、症状分析、决策支持的核心逻辑

import type {
  AssessmentResult,
  PainScaleItem,
  SymptomItem,
  DecisionTreeNode,
} from "../types/medical-care-guide";

// 疼痛等级评估逻辑
export class PainAssessmentLogic {
  // 根据疼痛等级获取严重程度
  static getSeverityLevel(painLevel: number): PainScaleItem["severity"] {
    if (painLevel === 0) return "none";
    if (painLevel <= 3) return "mild";
    if (painLevel <= 6) return "moderate";
    if (painLevel <= 8) return "severe";
    return "extreme";
  }

  // 根据疼痛等级获取颜色类
  static getColorClass(painLevel: number): string {
    const colorMap: Record<number, string> = {
      0: "text-green-600",
      1: "text-green-500",
      2: "text-green-400",
      3: "text-yellow-500",
      4: "text-yellow-600",
      5: "text-orange-500",
      6: "text-orange-600",
      7: "text-red-500",
      8: "text-red-600",
      9: "text-red-700",
      10: "text-red-800",
    };
    return colorMap[painLevel] || "text-gray-500";
  }

  // 根据疼痛等级生成建议
  static generateRecommendations(painLevel: number): string[] {
    if (painLevel === 0) {
      return [
        "Continue monitoring your symptoms",
        "Maintain healthy lifestyle habits",
      ];
    } else if (painLevel <= 3) {
      return [
        "Try gentle heat therapy or warm baths",
        "Consider light exercise or stretching",
        "Monitor if pain increases",
      ];
    } else if (painLevel <= 6) {
      return [
        "Consider over-the-counter pain relief",
        "Apply heat or cold therapy",
        "Rest and avoid strenuous activities",
        "Track your symptoms",
      ];
    } else if (painLevel <= 8) {
      return [
        "Consider seeing a healthcare provider",
        "Use prescribed or stronger pain medication",
        "Apply heat therapy",
        "Rest and limit activities",
      ];
    } else {
      return [
        "Seek immediate medical attention",
        "Consider emergency care if pain is sudden",
        "Do not delay medical consultation",
        "Have someone accompany you to medical care",
      ];
    }
  }

  // 判断是否需要就医
  static shouldSeeDoctor(painLevel: number): boolean {
    return painLevel >= 7;
  }

  // 获取就医紧急程度
  static getUrgencyLevel(painLevel: number): AssessmentResult["urgency"] {
    if (painLevel >= 9) return "immediate";
    if (painLevel >= 7) return "within_week";
    if (painLevel >= 4) return "routine";
    return "monitor";
  }
}

// 症状分析逻辑
export class SymptomAnalysisLogic {
  // 按风险等级分组症状
  static groupSymptomsByRisk(
    symptoms: SymptomItem[],
  ): Record<string, SymptomItem[]> {
    return symptoms.reduce(
      (acc, symptom) => {
        if (!acc[symptom.risk]) {
          acc[symptom.risk] = [];
        }
        acc[symptom.risk].push(symptom);
        return acc;
      },
      {} as Record<string, SymptomItem[]>,
    );
  }

  // 计算风险评分
  static calculateRiskScore(
    selectedSymptomIds: string[],
    allSymptoms: SymptomItem[],
  ): number {
    const selectedSymptoms = allSymptoms.filter((s) =>
      selectedSymptomIds.includes(s.id),
    );

    let score = 0;
    selectedSymptoms.forEach((symptom) => {
      switch (symptom.risk) {
        case "emergency":
          score += 10;
          break;
        case "high":
          score += 5;
          break;
        case "medium":
          score += 2;
          break;
        default:
          score += 1;
      }
    });

    return score;
  }

  // 根据风险评分确定风险等级
  static determineRiskLevel(riskScore: number): AssessmentResult["riskLevel"] {
    if (riskScore >= 10) return "emergency";
    if (riskScore >= 8) return "high";
    if (riskScore >= 4) return "medium";
    return "low";
  }

  // 生成个性化建议
  static generatePersonalizedRecommendations(
    selectedSymptomIds: string[],
    allSymptoms: SymptomItem[],
  ): string[] {
    const selectedSymptoms = allSymptoms.filter((s) =>
      selectedSymptomIds.includes(s.id),
    );
    const recommendations = new Set<string>();

    // 基于症状类别的建议
    const categoryRecommendations = {
      pain: [
        "Track pain intensity and patterns",
        "Try heat therapy for pain relief",
        "Consider gentle exercise when possible",
      ],
      bleeding: [
        "Monitor bleeding patterns and flow",
        "Keep track of cycle changes",
        "Maintain iron-rich diet",
      ],
      systemic: [
        "Monitor overall health symptoms",
        "Ensure adequate rest and hydration",
        "Consider stress management techniques",
      ],
      pattern: [
        "Keep detailed menstrual cycle diary",
        "Track symptom patterns over time",
        "Note any triggers or patterns",
      ],
    };

    // 添加基于症状类别的建议
    selectedSymptoms.forEach((symptom) => {
      const categoryRecs = categoryRecommendations[symptom.category] || [];
      categoryRecs.forEach((rec) => recommendations.add(rec));
    });

    // 基于风险等级的通用建议
    const hasEmergencySymptoms = selectedSymptoms.some(
      (s) => s.risk === "emergency",
    );
    const hasHighRiskSymptoms = selectedSymptoms.some((s) => s.risk === "high");

    if (hasEmergencySymptoms) {
      recommendations.add("Seek immediate medical attention");
      recommendations.add("Do not delay emergency care");
    } else if (hasHighRiskSymptoms) {
      recommendations.add("Schedule urgent medical consultation");
      recommendations.add("Monitor symptoms closely");
    } else {
      recommendations.add("Continue regular health monitoring");
      recommendations.add("Maintain healthy lifestyle habits");
    }

    return Array.from(recommendations);
  }
}

// 决策树逻辑
export class DecisionTreeLogic {
  // 验证决策树结构
  static validateDecisionTree(tree: DecisionTreeNode): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    function validate(node: DecisionTreeNode, path: string = "") {
      const currentPath = path ? `${path} -> ${node.id}` : node.id;

      // 检查节点ID
      if (!node.id) {
        errors.push(`Node at ${currentPath} is missing ID`);
      }

      // 检查结果节点
      if (node.result) {
        if (!node.result.title || !node.result.urgency) {
          errors.push(
            `Result node at ${currentPath} is missing required fields`,
          );
        }
        return; // 结果节点不应该有子节点
      }

      // 检查问题节点
      if (!node.question) {
        errors.push(`Question node at ${currentPath} is missing question`);
      }

      if (!node.options || !node.options.yes || !node.options.no) {
        errors.push(`Question node at ${currentPath} is missing options`);
      }

      if (!node.children || !node.children.yes || !node.children.no) {
        errors.push(`Question node at ${currentPath} is missing children`);
      } else {
        validate(node.children.yes, currentPath);
        validate(node.children.no, currentPath);
      }
    }

    validate(tree);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 根据ID查找节点
  static findNodeById(
    tree: DecisionTreeNode,
    nodeId: string,
  ): DecisionTreeNode | null {
    if (tree.id === nodeId) {
      return tree;
    }

    if (tree.children) {
      const yesResult = tree.children.yes
        ? this.findNodeById(tree.children.yes, nodeId)
        : null;
      if (yesResult) return yesResult;

      const noResult = tree.children.no
        ? this.findNodeById(tree.children.no, nodeId)
        : null;
      if (noResult) return noResult;
    }

    return null;
  }

  // 获取所有可能的结果
  static getAllPossibleResults(
    tree: DecisionTreeNode,
  ): DecisionTreeNode["result"][] {
    const results: DecisionTreeNode["result"][] = [];

    function traverse(node: DecisionTreeNode) {
      if (node.result) {
        results.push(node.result);
      }

      if (node.children) {
        if (node.children.yes) traverse(node.children.yes);
        if (node.children.no) traverse(node.children.no);
      }
    }

    traverse(tree);
    return results;
  }

  // 计算决策树深度
  static calculateTreeDepth(tree: DecisionTreeNode): number {
    if (!tree.children) {
      return 0;
    }

    const yesDepth = tree.children.yes
      ? this.calculateTreeDepth(tree.children.yes)
      : 0;
    const noDepth = tree.children.no
      ? this.calculateTreeDepth(tree.children.no)
      : 0;

    return 1 + Math.max(yesDepth, noDepth);
  }
}

// 综合评估逻辑
export class ComprehensiveAssessmentLogic {
  // 综合疼痛和症状评估
  static generateComprehensiveAssessment(
    painLevel: number,
    selectedSymptomIds: string[],
    allSymptoms: SymptomItem[],
  ): AssessmentResult {
    // 疼痛评估
    const painRecommendations =
      PainAssessmentLogic.generateRecommendations(painLevel);
    const painShouldSeeDoctor = PainAssessmentLogic.shouldSeeDoctor(painLevel);
    const painUrgency = PainAssessmentLogic.getUrgencyLevel(painLevel);

    // 症状评估
    const riskScore = SymptomAnalysisLogic.calculateRiskScore(
      selectedSymptomIds,
      allSymptoms,
    );
    const symptomRiskLevel = SymptomAnalysisLogic.determineRiskLevel(riskScore);
    const symptomRecommendations =
      SymptomAnalysisLogic.generatePersonalizedRecommendations(
        selectedSymptomIds,
        allSymptoms,
      );

    // 综合评估
    let finalRiskLevel: AssessmentResult["riskLevel"] = "low";
    let finalUrgency: AssessmentResult["urgency"] = "monitor";
    let finalShouldSeeDoctor = false;

    // 取最高风险等级
    const riskLevels = ["low", "medium", "high", "emergency"];
    const painRiskIndex =
      painLevel >= 8 ? 3 : painLevel >= 6 ? 2 : painLevel >= 4 ? 1 : 0;
    const symptomRiskIndex = riskLevels.indexOf(symptomRiskLevel);
    const maxRiskIndex = Math.max(painRiskIndex, symptomRiskIndex);

    finalRiskLevel = riskLevels[maxRiskIndex] as AssessmentResult["riskLevel"];

    // 确定紧急程度
    if (finalRiskLevel === "emergency") {
      finalUrgency = "immediate";
      finalShouldSeeDoctor = true;
    } else if (finalRiskLevel === "high") {
      finalUrgency = "within_week";
      finalShouldSeeDoctor = true;
    } else if (finalRiskLevel === "medium") {
      finalUrgency = "routine";
      finalShouldSeeDoctor = true;
    } else {
      finalUrgency = painUrgency;
      finalShouldSeeDoctor = painShouldSeeDoctor;
    }

    // 合并建议
    const allRecommendations = [
      ...new Set([...painRecommendations, ...symptomRecommendations]),
    ];

    return {
      painLevel,
      symptoms: selectedSymptomIds,
      riskLevel: finalRiskLevel,
      recommendations: allRecommendations,
      shouldSeeDoctor: finalShouldSeeDoctor,
      urgency: finalUrgency,
      timestamp: new Date().toISOString(),
    };
  }

  // 生成评估摘要
  static generateAssessmentSummary(result: AssessmentResult): {
    title: string;
    description: string;
    actionRequired: boolean;
    priority: "low" | "medium" | "high" | "critical";
  } {
    const { riskLevel, painLevel, symptoms } = result;

    let title = "";
    let description = "";
    let actionRequired = false;
    let priority: "low" | "medium" | "high" | "critical" = "low";

    switch (riskLevel) {
      case "emergency":
        title = "Emergency Situation - Seek Immediate Care";
        description = `High pain level (${painLevel}/10) with ${symptoms.length} concerning symptoms requires immediate medical attention.`;
        actionRequired = true;
        priority = "critical";
        break;

      case "high":
        title = "High Risk - Schedule Urgent Appointment";
        description = `Pain level ${painLevel}/10 with ${symptoms.length} symptoms suggests need for prompt medical evaluation.`;
        actionRequired = true;
        priority = "high";
        break;

      case "medium":
        title = "Moderate Concern - Consider Medical Consultation";
        description = `Pain level ${painLevel}/10 with ${symptoms.length} symptoms may benefit from medical evaluation.`;
        actionRequired = true;
        priority = "medium";
        break;

      default:
        title = "Low Risk - Continue Monitoring";
        description = `Pain level ${painLevel}/10 with ${symptoms.length} symptoms can be managed with self-care.`;
        actionRequired = false;
        priority = "low";
    }

    return {
      title,
      description,
      actionRequired,
      priority,
    };
  }
}
