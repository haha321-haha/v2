/**
 * Structured Data Validation Utilities
 * 结构化数据验证工具
 *
 * 用于验证 Schema.org 结构化数据的有效性，防止 Google Search Console 错误
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 验证结构化数据是否符合 Schema.org 规范
 *
 * @param data - 要验证的结构化数据对象
 * @returns 验证结果
 */
export function validateStructuredData(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Structured data must be an object");
    return { isValid: false, errors, warnings };
  }

  const dataObj = data as Record<string, unknown>;

  // 检查必需字段
  if (!dataObj["@context"]) {
    errors.push("Missing required field: @context");
  } else if (
    typeof dataObj["@context"] !== "string" ||
    dataObj["@context"] === ""
  ) {
    errors.push("Invalid @context field: must be a non-empty string");
  }

  if (!dataObj["@type"]) {
    errors.push("Missing required field: @type");
  } else if (typeof dataObj["@type"] !== "string" || dataObj["@type"] === "") {
    errors.push(
      "Invalid @type field: must be a non-empty string (this causes 'Invalid object type for field' error)",
    );
  }

  // 验证嵌套对象的 @type 字段
  validateNestedTypes(dataObj, errors, warnings, "");

  // 验证数组字段
  if (dataObj["mainEntity"] && Array.isArray(dataObj["mainEntity"])) {
    validateFAQArray(dataObj["mainEntity"], errors, warnings);
  }

  if (dataObj["step"] && Array.isArray(dataObj["step"])) {
    validateHowToSteps(dataObj["step"], errors, warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证嵌套对象中的 @type 字段
 */
function validateNestedTypes(
  obj: Record<string, unknown>,
  errors: string[],
  warnings: string[],
  path: string,
  seen: WeakSet<object> = new WeakSet(),
): void {
  // 防止循环引用
  if (seen.has(obj)) {
    return;
  }
  seen.add(obj);

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    // 如果值是对象
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nestedObj = value as Record<string, unknown>;

      // 检查嵌套对象的 @type 字段
      if ("@type" in nestedObj) {
        if (
          typeof nestedObj["@type"] !== "string" ||
          nestedObj["@type"] === ""
        ) {
          errors.push(
            `Invalid @type field in nested object at ${currentPath}: must be a non-empty string`,
          );
        }
      }

      // 递归验证嵌套对象
      validateNestedTypes(nestedObj, errors, warnings, currentPath, seen);
    }

    // 如果值是数组
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === "object") {
          const itemObj = item as Record<string, unknown>;
          if ("@type" in itemObj) {
            if (
              typeof itemObj["@type"] !== "string" ||
              itemObj["@type"] === ""
            ) {
              errors.push(
                `Invalid @type field in array item at ${currentPath}[${index}]: must be a non-empty string`,
              );
            }
          }
          validateNestedTypes(
            itemObj,
            errors,
            warnings,
            `${currentPath}[${index}]`,
            seen,
          );
        }
      });
    }

    // 检查空字符串字段（除了允许的字段）
    if (value === "" && !["@id"].includes(key)) {
      warnings.push(`Empty string field found at ${currentPath}: ${key}`);
    }
  }
}

/**
 * 验证 FAQ 数组
 */
function validateFAQArray(
  mainEntity: unknown[],
  errors: string[],
  warnings: string[],
): void {
  if (mainEntity.length === 0) {
    warnings.push("FAQPage mainEntity array is empty");
    return;
  }

  mainEntity.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      errors.push(`FAQ item ${index + 1} is not a valid object`);
      return;
    }

    const faqItem = item as Record<string, unknown>;

    if (faqItem["@type"] !== "Question") {
      errors.push(
        `FAQ item ${index + 1} has invalid @type: expected "Question"`,
      );
    }

    if (
      !faqItem["name"] ||
      typeof faqItem["name"] !== "string" ||
      faqItem["name"].trim() === ""
    ) {
      errors.push(`FAQ item ${index + 1} has empty or missing name field`);
    }

    if (
      !faqItem["acceptedAnswer"] ||
      typeof faqItem["acceptedAnswer"] !== "object"
    ) {
      errors.push(
        `FAQ item ${index + 1} has missing or invalid acceptedAnswer`,
      );
    } else {
      const answer = faqItem["acceptedAnswer"] as Record<string, unknown>;
      if (answer["@type"] !== "Answer") {
        errors.push(
          `FAQ item ${
            index + 1
          } acceptedAnswer has invalid @type: expected "Answer"`,
        );
      }
      if (
        !answer["text"] ||
        typeof answer["text"] !== "string" ||
        answer["text"].trim() === ""
      ) {
        errors.push(
          `FAQ item ${
            index + 1
          } acceptedAnswer has empty or missing text field`,
        );
      }
    }
  });
}

/**
 * 验证 HowTo 步骤数组
 */
function validateHowToSteps(
  steps: unknown[],
  errors: string[],
  warnings: string[],
): void {
  if (steps.length === 0) {
    warnings.push("HowTo step array is empty");
    return;
  }

  steps.forEach((step, index) => {
    if (!step || typeof step !== "object") {
      errors.push(`HowTo step ${index + 1} is not a valid object`);
      return;
    }

    const stepObj = step as Record<string, unknown>;

    if (stepObj["@type"] !== "HowToStep") {
      errors.push(
        `HowTo step ${index + 1} has invalid @type: expected "HowToStep"`,
      );
    }

    if (
      !stepObj["name"] ||
      typeof stepObj["name"] !== "string" ||
      stepObj["name"].trim() === ""
    ) {
      errors.push(`HowTo step ${index + 1} has empty or missing name field`);
    }

    if (
      !stepObj["text"] ||
      typeof stepObj["text"] !== "string" ||
      stepObj["text"].trim() === ""
    ) {
      errors.push(`HowTo step ${index + 1} has empty or missing text field`);
    }
  });
}

/**
 * 清理并验证结构化数据
 * 移除无效字段，确保数据符合 Schema.org 规范
 *
 * @param data - 要清理的结构化数据
 * @returns 清理后的数据，如果无效则返回 null
 */
export function cleanAndValidateStructuredData(
  data: unknown,
): Record<string, unknown> | null {
  const validation = validateStructuredData(data);

  if (!validation.isValid) {
    console.error("Structured data validation failed:", validation.errors);
    return null;
  }

  if (validation.warnings.length > 0) {
    console.warn("Structured data warnings:", validation.warnings);
  }

  return data as Record<string, unknown>;
}






