/**
 * 营养推荐生成器 - TypeScript类型定义
 * 基于ziV1d3d项目的数据结构设计
 */

// 基础类型定义
export type Language = "zh" | "en";

// 月经阶段类型
export type MenstrualPhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

// 健康目标类型
export type HealthGoal = "anemiaPrevention" | "pmsRelief";

// 体质类型（基于整体健康理论）
export type HolisticHealthConstitution =
  | "qiDeficiency"
  | "yangDeficiency"
  | "yinDeficiency"
  | "phlegmDampness"
  | "dampHeat";

// 多语言文本接口
export interface LocalizedText {
  zh: string;
  en: string;
}

// 营养建议接口
export interface NutritionRecommendation {
  name: LocalizedText;
  description: LocalizedText;
  benefits: LocalizedText;
  preparation: LocalizedText;
  notes?: LocalizedText;
}

// 生活方式建议接口
export interface LifestyleTip {
  title: LocalizedText;
  description: LocalizedText;
  category: "diet" | "exercise" | "lifestyle" | "supplements";
}

// 月经阶段数据接口
export interface MenstrualPhaseData {
  phase: MenstrualPhase;
  name: LocalizedText;
  description: LocalizedText;
  recommendedFoods: NutritionRecommendation[];
  foodsToAvoid: NutritionRecommendation[];
  lifestyleTips: LifestyleTip[];
}

// 健康目标数据接口
export interface HealthGoalData {
  goal: HealthGoal;
  name: LocalizedText;
  description: LocalizedText;
  recommendedFoods: NutritionRecommendation[];
  foodsToAvoid: NutritionRecommendation[];
  lifestyleTips: LifestyleTip[];
}

// 体质数据接口（基于整体健康理论）
export interface HolisticHealthConstitutionData {
  constitution: HolisticHealthConstitution;
  name: LocalizedText;
  description: LocalizedText;
  characteristics: LocalizedText;
  recommendedFoods: NutritionRecommendation[];
  foodsToAvoid: NutritionRecommendation[];
  lifestyleTips: LifestyleTip[];
}

// 用户选择接口
export interface UserSelections {
  menstrualPhase: MenstrualPhase | null;
  healthGoals: Set<HealthGoal>;
  holisticHealthConstitution: Set<HolisticHealthConstitution>;
}

// 推荐结果接口
export interface RecommendationResult {
  menstrualPhase: MenstrualPhaseData | null;
  healthGoals: HealthGoalData[];
  holisticHealthConstitution: HolisticHealthConstitutionData[];
  combinedRecommendations: {
    recommendedFoods: NutritionRecommendation[];
    foodsToAvoid: NutritionRecommendation[];
    lifestyleTips: LifestyleTip[];
  };
}

// 应用状态接口
export interface NutritionAppState {
  language: Language;
  selections: UserSelections;
  results: RecommendationResult | null;
  isLoading: boolean;
  error: string | null;
}

// 组件Props接口
export interface NutritionGeneratorProps {
  initialLanguage?: Language;
  onResultsChange?: (results: RecommendationResult) => void;
}

// 选择器组件Props接口
export interface SelectorProps<T> {
  options: T[];
  selected: T | Set<T>;
  onSelectionChange: (selection: T | Set<T>) => void;
  multiple?: boolean;
  disabled?: boolean;
}

// 结果展示组件Props接口
export interface ResultsDisplayProps {
  results: RecommendationResult;
  language: Language;
}

// Hook返回类型
export interface UseNutritionStateReturn {
  state: NutritionAppState;
  updateLanguage: (language: Language) => void;
  updateSelections: (selections: Partial<UserSelections>) => void;
  generateRecommendations: () => Promise<void>;
  resetSelections: () => void;
}

// 数据加载Hook返回类型
export interface UseNutritionDataReturn {
  menstrualPhaseData: MenstrualPhaseData[];
  healthGoalData: HealthGoalData[];
  holisticHealthConstitutionData: HolisticHealthConstitutionData[];
  isLoading: boolean;
  error: string | null;
}

// 验证Hook返回类型
export interface UseNutritionValidationReturn {
  isValid: boolean;
  errors: string[];
  validateSelections: (selections: UserSelections) => boolean;
}

// 本地存储Hook返回类型
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

// 错误类型
export type NutritionError =
  | "NO_SELECTION"
  | "DATA_LOAD_ERROR"
  | "GENERATION_ERROR"
  | "VALIDATION_ERROR";

// 错误信息接口
export interface ErrorInfo {
  type: NutritionError;
  message: LocalizedText;
  details?: string;
}

// 配置接口
export interface NutritionConfig {
  defaultLanguage: Language;
  enableLocalStorage: boolean;
  enableAnalytics: boolean;
  maxSelections: {
    healthGoals: number;
    holisticHealthConstitution: number;
  };
}

// 所有类型已通过export type声明导出，无需重复导出
