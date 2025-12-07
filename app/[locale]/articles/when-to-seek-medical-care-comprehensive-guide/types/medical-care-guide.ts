// 医疗护理指南类型定义
// 基于souW1e2的数据结构，适配TypeScript

export interface PainScaleItem {
  level: number;
  title: string;
  advice: string;
  severity: "none" | "mild" | "moderate" | "severe" | "extreme";
  recommendations: string[];
  colorClass: string;
}

export interface SymptomItem {
  id: string;
  text: string;
  risk: "emergency" | "high" | "medium";
  category: "pain" | "bleeding" | "systemic" | "pattern";
  description?: string;
  icon?: string;
}

export interface DecisionTreeNode {
  id: string;
  question?: string;
  options?: {
    yes: string;
    no: string;
  };
  result?: {
    title: string;
    icon: string;
    colorClass: string;
    text: string;
    urgency: "emergency" | "urgent" | "routine" | "observe";
    actions: string[];
  };
  children?: {
    yes?: DecisionTreeNode;
    no?: DecisionTreeNode;
  };
}

export interface ComparisonTableData {
  headers: string[];
  rows: Array<{
    condition: string;
    normalPain: string;
    concerningPain: string;
    action: string;
  }>;
}

export interface AssessmentResult {
  painLevel: number;
  symptoms: string[];
  riskLevel: "low" | "medium" | "high" | "emergency";
  recommendations: string[];
  shouldSeeDoctor: boolean;
  urgency: "immediate" | "within_week" | "routine" | "monitor";
  timestamp: string;
}

export interface MedicalCareGuideStorage {
  assessmentHistory: AssessmentResult[];
  lastAssessment?: AssessmentResult;
  userPreferences: {
    language: string;
    reminderEnabled: boolean;
    lastVisit: string;
  };
  version: number;
}

export interface PainAssessmentToolProps {
  onAssessmentComplete?: (result: AssessmentResult) => void;
  className?: string;
  initialLevel?: number;
}

export interface SymptomChecklistProps {
  onAnalysisComplete?: (result: AssessmentResult) => void;
  className?: string;
  preSelectedSymptoms?: string[];
}

export interface DecisionTreeProps {
  onDecisionComplete?: (result: AssessmentResult) => void;
  className?: string;
  startFromNode?: string;
}

export interface ComparisonTableProps {
  className?: string;
  highlightRow?: number;
}

// 翻译键类型定义
export interface MedicalCareGuideTranslations {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  painTool: {
    title: string;
    description: string;
    sliderLabel: string;
    sliderMin: string;
    sliderMax: string;
    currentLevel: string;
    advice: string;
    recommendations: string;
  };
  symptomChecker: {
    title: string;
    description: string;
    instructions: string;
    analyzeButton: string;
    resetButton: string;
    results: {
      title: string;
      riskLevel: string;
      recommendations: string;
      urgency: string;
    };
  };
  decisionTree: {
    title: string;
    description: string;
    startButton: string;
    yesButton: string;
    noButton: string;
    restartButton: string;
    results: {
      emergency: string;
      urgent: string;
      routine: string;
      observe: string;
    };
  };
  comparisonTable: {
    title: string;
    description: string;
    headers: {
      condition: string;
      normal: string;
      concerning: string;
      action: string;
    };
  };
}
