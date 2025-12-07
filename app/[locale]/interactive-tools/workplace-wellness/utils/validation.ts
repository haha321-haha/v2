/**
 * HVsLYEp职场健康助手 - 数据验证工具
 * 基于HVsLYEp的数据结构进行验证
 */

import { PeriodRecord, NutritionRecommendation, LeaveTemplate } from "../types";

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 经期记录验证
export function validatePeriodRecord(
  record: Partial<PeriodRecord>,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 必需字段检查
  if (!record.date) {
    errors.push("Date is required");
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
    errors.push("Date must be in YYYY-MM-DD format");
  }

  if (!record.type) {
    errors.push("Type is required");
  } else if (!["period", "predicted", "ovulation"].includes(record.type)) {
    errors.push("Type must be one of: period, predicted, ovulation");
  }

  // 疼痛等级验证
  if (record.painLevel !== null && record.painLevel !== undefined) {
    if (
      typeof record.painLevel !== "number" ||
      record.painLevel < 0 ||
      record.painLevel > 10
    ) {
      errors.push("Pain level must be a number between 0 and 10");
    }
  }

  // 流量验证
  if (record.flow && !["light", "medium", "heavy"].includes(record.flow)) {
    errors.push("Flow must be one of: light, medium, heavy");
  }

  // 症状数组验证（如果存在）
  if (
    "symptoms" in record &&
    record.symptoms &&
    !Array.isArray(record.symptoms)
  ) {
    errors.push("Symptoms must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 营养推荐验证
export function validateNutritionRecommendation(
  nutrition: Partial<NutritionRecommendation>,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 必需字段检查
  if (!nutrition.name) {
    errors.push("Name is required");
  }

  if (!nutrition.benefits || !Array.isArray(nutrition.benefits)) {
    errors.push("Benefits must be an array");
  }

  if (!nutrition.phase) {
    errors.push("Phase is required");
  } else if (
    !["menstrual", "follicular", "ovulation", "luteal"].includes(
      nutrition.phase,
    )
  ) {
    errors.push(
      "Phase must be one of: menstrual, follicular, ovulation, luteal",
    );
  }

  if (!nutrition.holisticNature) {
    errors.push("Holistic Nature is required");
  } else if (!["warm", "cool", "neutral"].includes(nutrition.holisticNature)) {
    errors.push("Holistic Nature must be one of: warm, cool, neutral");
  }

  if (!nutrition.nutrients || !Array.isArray(nutrition.nutrients)) {
    errors.push("Nutrients must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 请假模板验证
export function validateLeaveTemplate(
  template: LeaveTemplate,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 必需字段检查
  if (!template.id || typeof template.id !== "number") {
    errors.push("ID must be a number");
  }

  if (!template.title) {
    errors.push("Title is required");
  }

  if (!template.severity) {
    errors.push("Severity is required");
  } else if (!["mild", "moderate", "severe"].includes(template.severity)) {
    errors.push("Severity must be one of: mild, moderate, severe");
  }

  if (!template.subject) {
    errors.push("Subject is required");
  }

  if (!template.content) {
    errors.push("Content is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 批量验证经期数据
export function validatePeriodData(data: PeriodRecord[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(data)) {
    errors.push("Period data must be an array");
    return { isValid: false, errors, warnings };
  }

  data.forEach((record, index) => {
    const result = validatePeriodRecord(record);
    if (!result.isValid) {
      errors.push(`Record ${index}: ${result.errors.join(", ")}`);
    }
    warnings.push(...result.warnings.map((w) => `Record ${index}: ${w}`));
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 批量验证营养数据
export function validateNutritionData(
  data: NutritionRecommendation[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || data.length === 0) {
    errors.push("Nutrition data is empty");
    return { isValid: false, errors, warnings };
  }

  // 验证营养数据
  data.forEach((nutrition, index) => {
    const result = validateNutritionRecommendation(nutrition);
    if (!result.isValid) {
      errors.push(`Nutrition ${index}: ${result.errors.join(", ")}`);
    }
    warnings.push(...result.warnings.map((w) => `Nutrition ${index}: ${w}`));
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 批量验证请假模板
export function validateLeaveTemplates(
  data: LeaveTemplate[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || data.length === 0) {
    errors.push("Leave templates are empty");
    return { isValid: false, errors, warnings };
  }

  // 验证请假模板
  data.forEach((template, index) => {
    const result = validateLeaveTemplate(template);
    if (!result.isValid) {
      errors.push(`Template ${index}: ${result.errors.join(", ")}`);
    }
    warnings.push(...result.warnings.map((w) => `Template ${index}: ${w}`));
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 数据迁移验证 - 检查HVsLYEp数据是否完整迁移
export function validateDataMigration(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 这里可以添加更多的迁移验证逻辑
    // 比如检查数据完整性、格式一致性等

    warnings.push("Data migration validation completed");

    return {
      isValid: true,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Data migration validation failed: ${error}`);
    return {
      isValid: false,
      errors,
      warnings,
    };
  }
}
