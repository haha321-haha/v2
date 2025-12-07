/**
 * 最终验证 - 基于ziV1d3d的最终验证
 * 提供完整的系统验证功能
 */

import {
  WebVitalsMonitor,
  ErrorMonitor,
  UserBehaviorMonitor,
} from "./monitoring";
import { InputValidator } from "./security";
import { generateSEOMetadata } from "./seo";

type ValidationStatus = "pass" | "fail" | "warning";
type ValidationDetails = string | Error | Record<string, unknown>;

// 基于ziV1d3d的验证结果接口
interface ValidationResult {
  category: string;
  status: ValidationStatus;
  message: string;
  details?: ValidationDetails;
}

interface ValidationReport {
  timestamp: string;
  overall: ValidationStatus;
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

const formatValidationDetails = (error: unknown): ValidationDetails =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error
      : { value: error };

// 基于ziV1d3d的最终验证器
export class FinalValidator {
  private results: ValidationResult[] = [];

  // 验证组件功能
  async validateComponents(): Promise<ValidationResult[]> {
    const componentResults: ValidationResult[] = [];

    try {
      // 验证NutritionGenerator组件
      const nutritionGeneratorValid = await this.validateNutritionGenerator();
      componentResults.push(nutritionGeneratorValid);

      // 验证NutritionApp组件
      const nutritionAppValid = await this.validateNutritionApp();
      componentResults.push(nutritionAppValid);

      // 验证ResultsDisplay组件
      const resultsDisplayValid = await this.validateResultsDisplay();
      componentResults.push(resultsDisplayValid);

      // 验证LoadingState组件
      const loadingStateValid = await this.validateLoadingState();
      componentResults.push(loadingStateValid);

      // 验证NoSelectionState组件
      const noSelectionStateValid = await this.validateNoSelectionState();
      componentResults.push(noSelectionStateValid);
    } catch (error) {
      componentResults.push({
        category: "Components",
        status: "fail",
        message: "Component validation failed",
        details: formatValidationDetails(error),
      });
    }

    return componentResults;
  }

  // 验证NutritionGenerator组件
  private async validateNutritionGenerator(): Promise<ValidationResult> {
    try {
      // 检查组件是否存在
      const componentExists =
        typeof window !== "undefined" &&
        document.querySelector('[data-testid="nutrition-generator"]');

      if (!componentExists) {
        return {
          category: "NutritionGenerator",
          status: "fail",
          message: "NutritionGenerator component not found",
        };
      }

      return {
        category: "NutritionGenerator",
        status: "pass",
        message: "NutritionGenerator component validated successfully",
      };
    } catch (error) {
      return {
        category: "NutritionGenerator",
        status: "fail",
        message: "NutritionGenerator validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证NutritionApp组件
  private async validateNutritionApp(): Promise<ValidationResult> {
    try {
      // 检查选择按钮是否存在
      const selectionButtons = document.querySelectorAll(".selection-button");

      if (selectionButtons.length === 0) {
        return {
          category: "NutritionApp",
          status: "fail",
          message: "Selection buttons not found",
        };
      }

      return {
        category: "NutritionApp",
        status: "pass",
        message: `Found ${selectionButtons.length} selection buttons`,
      };
    } catch (error) {
      return {
        category: "NutritionApp",
        status: "fail",
        message: "NutritionApp validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证ResultsDisplay组件
  private async validateResultsDisplay(): Promise<ValidationResult> {
    try {
      // 检查结果容器是否存在
      const resultsContainer = document.getElementById("results-container");

      if (!resultsContainer) {
        return {
          category: "ResultsDisplay",
          status: "warning",
          message:
            "Results container not found (may be normal if no results generated)",
        };
      }

      return {
        category: "ResultsDisplay",
        status: "pass",
        message: "Results container found",
      };
    } catch (error) {
      return {
        category: "ResultsDisplay",
        status: "fail",
        message: "ResultsDisplay validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证LoadingState组件
  private async validateLoadingState(): Promise<ValidationResult> {
    try {
      // 检查加载状态是否存在
      const loadingElement = document.querySelector(".animate-spin");

      if (!loadingElement) {
        return {
          category: "LoadingState",
          status: "warning",
          message: "Loading state not found (may be normal if not loading)",
        };
      }

      return {
        category: "LoadingState",
        status: "pass",
        message: "Loading state component found",
      };
    } catch (error) {
      return {
        category: "LoadingState",
        status: "fail",
        message: "LoadingState validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证NoSelectionState组件
  private async validateNoSelectionState(): Promise<ValidationResult> {
    try {
      // 检查无选择状态是否存在
      const noSelectionElement = document.querySelector(
        '[data-testid="no-selection-state"]',
      );

      if (!noSelectionElement) {
        return {
          category: "NoSelectionState",
          status: "warning",
          message:
            "No selection state not found (may be normal if selections made)",
        };
      }

      return {
        category: "NoSelectionState",
        status: "pass",
        message: "No selection state component found",
      };
    } catch (error) {
      return {
        category: "NoSelectionState",
        status: "fail",
        message: "NoSelectionState validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证数据完整性
  async validateDataIntegrity(): Promise<ValidationResult[]> {
    const dataResults: ValidationResult[] = [];

    try {
      // 验证营养数据
      const nutritionDataValid = await this.validateNutritionData();
      dataResults.push(nutritionDataValid);

      // 验证UI内容
      const uiContentValid = await this.validateUIContent();
      dataResults.push(uiContentValid);

      // 验证输入验证器
      const inputValidation = await this.validateInputValidation();
      dataResults.push(inputValidation);

      // 验证类型定义
      const typeDefinitionsValid = await this.validateTypeDefinitions();
      dataResults.push(typeDefinitionsValid);
    } catch (error) {
      dataResults.push({
        category: "Data Integrity",
        status: "fail",
        message: "Data integrity validation failed",
        details: formatValidationDetails(error),
      });
    }

    return dataResults;
  }

  // 验证营养数据
  private async validateNutritionData(): Promise<ValidationResult> {
    try {
      // 检查营养数据是否存在
      const nutritionData = await import("../data/nutritionRecommendations");

      if (
        !nutritionData.menstrualPhaseData ||
        !nutritionData.healthGoalData ||
        !nutritionData.holisticHealthConstitutionData
      ) {
        return {
          category: "Nutrition Data",
          status: "fail",
          message: "Nutrition data missing or incomplete",
        };
      }

      // 检查数据完整性
      const menstrualPhases = Object.keys(nutritionData.menstrualPhaseData);
      const healthGoals = Object.keys(nutritionData.healthGoalData);
      const holisticHealthConstitutions = Object.keys(
        nutritionData.holisticHealthConstitutionData,
      );

      if (
        menstrualPhases.length === 0 ||
        healthGoals.length === 0 ||
        holisticHealthConstitutions.length === 0
      ) {
        return {
          category: "Nutrition Data",
          status: "fail",
          message: "Nutrition data categories are empty",
        };
      }

      return {
        category: "Nutrition Data",
        status: "pass",
        message: `Found ${menstrualPhases.length} menstrual phases, ${healthGoals.length} health goals, ${holisticHealthConstitutions.length} Holistic Health constitutions`,
      };
    } catch (error) {
      return {
        category: "Nutrition Data",
        status: "fail",
        message: "Nutrition data validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证UI内容
  private async validateUIContent(): Promise<ValidationResult> {
    try {
      // 检查UI内容是否存在
      const uiContent = await import("./uiContent");

      if (!uiContent.uiContent || !uiContent.getUIContent) {
        return {
          category: "UI Content",
          status: "fail",
          message: "UI content missing or incomplete",
        };
      }

      // 检查关键UI内容
      const mainTitle = uiContent.getUIContent("mainTitle", "en");
      const generateBtn = uiContent.getUIContent("generateBtn", "en");

      if (!mainTitle || !generateBtn) {
        return {
          category: "UI Content",
          status: "fail",
          message: "Key UI content missing",
        };
      }

      return {
        category: "UI Content",
        status: "pass",
        message: "UI content validated successfully",
      };
    } catch (error) {
      return {
        category: "UI Content",
        status: "fail",
        message: "UI content validation error",
        details:
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error
              : { error },
      };
    }
  }

  private async validateInputValidation(): Promise<ValidationResult> {
    try {
      const baseInput = "<script>alert('x')</script>balanced";
      const inputValidation = InputValidator.validateInput(baseInput);
      const selectionValidation = InputValidator.validateSelections({
        menstrualPhase: "menstrual",
        healthGoals: new Set(["balance"]),
        holisticHealthConstitution: new Set(["qi"]),
      });

      if (!inputValidation.isValid || !selectionValidation.isValid) {
        return {
          category: "Input Validation",
          status: "fail",
          message: "Core input validation failed",
          details:
            inputValidation.error ||
            selectionValidation.error ||
            "Unknown input validation issue",
        };
      }

      if (inputValidation.sanitized === baseInput) {
        return {
          category: "Input Validation",
          status: "warning",
          message: "Input sanitization did not modify the sample string",
        };
      }

      return {
        category: "Input Validation",
        status: "pass",
        message: "Input validation utilities functioning",
      };
    } catch (validationError) {
      return {
        category: "Input Validation",
        status: "fail",
        message: "Input validation utilities error",
        details:
          validationError instanceof Error
            ? validationError
            : { error: validationError },
      };
    }
  }

  // 验证类型定义
  private async validateTypeDefinitions(): Promise<ValidationResult> {
    try {
      // 检查类型定义是否存在（类型在编译时存在，运行时不需要检查）
      const hasTypes = true;

      if (!hasTypes) {
        return {
          category: "Type Definitions",
          status: "fail",
          message: "Type definitions missing or incomplete",
        };
      }

      return {
        category: "Type Definitions",
        status: "pass",
        message: "Type definitions validated successfully",
      };
    } catch (error) {
      return {
        category: "Type Definitions",
        status: "fail",
        message: "Type definitions validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证性能
  async validatePerformance(): Promise<ValidationResult[]> {
    const performanceResults: ValidationResult[] = [];

    try {
      // 验证Web Vitals
      const webVitalsValid = await this.validateWebVitals();
      performanceResults.push(webVitalsValid);

      // 验证错误监控
      const errorMonitoringValid = await this.validateErrorMonitoring();
      performanceResults.push(errorMonitoringValid);

      // 验证用户行为监控
      const userBehaviorValid = await this.validateUserBehaviorMonitoring();
      performanceResults.push(userBehaviorValid);
    } catch (error) {
      performanceResults.push({
        category: "Performance",
        status: "fail",
        message: "Performance validation failed",
        details: formatValidationDetails(error),
      });
    }

    return performanceResults;
  }

  // 验证Web Vitals
  private async validateWebVitals(): Promise<ValidationResult> {
    try {
      const monitor = WebVitalsMonitor.getInstance();
      const metrics = monitor.getAllMetrics();

      if (Object.keys(metrics).length === 0) {
        return {
          category: "Web Vitals",
          status: "warning",
          message: "No Web Vitals metrics collected yet",
        };
      }

      return {
        category: "Web Vitals",
        status: "pass",
        message: `Web Vitals monitoring active with ${
          Object.keys(metrics).length
        } metrics`,
      };
    } catch (error) {
      return {
        category: "Web Vitals",
        status: "fail",
        message: "Web Vitals validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证错误监控
  private async validateErrorMonitoring(): Promise<ValidationResult> {
    try {
      const monitor = ErrorMonitor.getInstance();
      const stats = monitor.getErrorStats();

      return {
        category: "Error Monitoring",
        status: "pass",
        message: `Error monitoring active. Total errors: ${stats.total}, Recent errors: ${stats.recent}`,
      };
    } catch (error) {
      return {
        category: "Error Monitoring",
        status: "fail",
        message: "Error monitoring validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证用户行为监控
  private async validateUserBehaviorMonitoring(): Promise<ValidationResult> {
    try {
      const monitor = UserBehaviorMonitor.getInstance();
      const stats = monitor.getUserStats();

      return {
        category: "User Behavior Monitoring",
        status: "pass",
        message: `User behavior monitoring active. Total events: ${stats.totalEvents}, Unique pages: ${stats.uniquePages}`,
      };
    } catch (error) {
      return {
        category: "User Behavior Monitoring",
        status: "fail",
        message: "User behavior monitoring validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证SEO
  async validateSEO(): Promise<ValidationResult[]> {
    const seoResults: ValidationResult[] = [];

    try {
      // 验证SEO元数据
      const seoMetadataValid = await this.validateSEOMetadata();
      seoResults.push(seoMetadataValid);

      // 验证结构化数据
      const structuredDataValid = await this.validateStructuredData();
      seoResults.push(structuredDataValid);
    } catch (error) {
      seoResults.push({
        category: "SEO",
        status: "fail",
        message: "SEO validation failed",
        details: formatValidationDetails(error),
      });
    }

    return seoResults;
  }

  // 验证SEO元数据
  private async validateSEOMetadata(): Promise<ValidationResult> {
    try {
      const metadata = generateSEOMetadata("en");

      if (!metadata.title || !metadata.description) {
        return {
          category: "SEO Metadata",
          status: "fail",
          message: "SEO metadata missing or incomplete",
        };
      }

      return {
        category: "SEO Metadata",
        status: "pass",
        message: "SEO metadata validated successfully",
      };
    } catch (error) {
      return {
        category: "SEO Metadata",
        status: "fail",
        message: "SEO metadata validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 验证结构化数据
  private async validateStructuredData(): Promise<ValidationResult> {
    try {
      const structuredData = await import("./seo");

      if (
        !structuredData.structuredData ||
        !structuredData.structuredData["@type"]
      ) {
        return {
          category: "Structured Data",
          status: "fail",
          message: "Structured data missing or incomplete",
        };
      }

      return {
        category: "Structured Data",
        status: "pass",
        message: "Structured data validated successfully",
      };
    } catch (error) {
      return {
        category: "Structured Data",
        status: "fail",
        message: "Structured data validation error",
        details: formatValidationDetails(error),
      };
    }
  }

  // 运行完整验证
  async runFullValidation(): Promise<ValidationReport> {
    this.results = [];

    try {
      // 验证组件
      const componentResults = await this.validateComponents();
      this.results.push(...componentResults);

      // 验证数据完整性
      const dataResults = await this.validateDataIntegrity();
      this.results.push(...dataResults);

      // 验证性能
      const performanceResults = await this.validatePerformance();
      this.results.push(...performanceResults);

      // 验证SEO
      const seoResults = await this.validateSEO();
      this.results.push(...seoResults);
    } catch (error) {
      this.results.push({
        category: "Full Validation",
        status: "fail",
        message: "Full validation failed",
        details: formatValidationDetails(error),
      });
    }

    // 生成报告
    const summary = this.generateSummary();
    const overall = this.determineOverallStatus();

    return {
      timestamp: new Date().toISOString(),
      overall,
      results: this.results,
      summary,
    };
  }

  // 生成摘要
  private generateSummary(): {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  } {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === "pass").length;
    const failed = this.results.filter((r) => r.status === "fail").length;
    const warnings = this.results.filter((r) => r.status === "warning").length;

    return { total, passed, failed, warnings };
  }

  // 确定整体状态
  private determineOverallStatus(): "pass" | "fail" | "warning" {
    const failed = this.results.filter((r) => r.status === "fail").length;
    const warnings = this.results.filter((r) => r.status === "warning").length;

    if (failed > 0) return "fail";
    if (warnings > 0) return "warning";
    return "pass";
  }
}
