"use client";

import {
  createLazyComponent,
  createLazyTool,
  preloadComponent,
} from "./LazyComponents";

/**
 * P3阶段：主要交互工具的懒加载实现
 * 为所有主要工具组件提供懒加载支持
 */

// 懒加载的症状评估工具
export const LazySymptomAssessmentTool = createLazyTool(
  () => import("../../components/SymptomAssessmentTool"),
  "SymptomAssessmentTool",
);

// 懒加载的疼痛追踪工具
export const LazyPainTrackerTool = createLazyTool(
  () => import("../../components/PainTrackerTool"),
  "PainTrackerTool",
);

// 懒加载的体质测试工具
export const LazyConstitutionTestTool = createLazyTool(
  () => import("../../components/ConstitutionTestTool"),
  "ConstitutionTestTool",
);

// 懒加载的周期追踪工具
export const LazyCycleTrackerTool = createLazyTool(
  () => import("../../components/CycleTrackerTool"),
  "CycleTrackerTool",
);

// 懒加载的症状追踪工具
export const LazySymptomTrackerTool = createLazyTool(
  () => import("../../components/SymptomTrackerTool"),
  "SymptomTrackerTool",
);

// 懒加载的痛经影响评估工具
export const LazyPeriodPainAssessmentTool = createLazyTool(
  () => import("../../components/PeriodPainAssessmentTool"),
  "PeriodPainAssessmentTool",
);

// P2阶段高级功能的懒加载组件
export const LazyAnalyticsDashboard = createLazyComponent(
  () => import("./AnalyticsDashboard"),
  undefined,
  100,
);

export const LazyPersonalizedRecommendationEngine = createLazyComponent(
  () => import("./PersonalizedRecommendationEngine"),
  undefined,
  100,
);

export const LazySocialFeatures = createLazyComponent(
  () => import("./SocialFeatures"),
  undefined,
  100,
);

export const LazyDataSync = createLazyComponent(
  () => import("./DataSync"),
  undefined,
  100,
);

export const LazyReportGenerator = createLazyComponent(
  () => import("./ReportGenerator"),
  undefined,
  100,
);

// P3阶段系统优化组件的懒加载
export const LazyI18nOptimizer = createLazyComponent(
  () => import("./I18nOptimizer"),
  undefined,
  50,
);

export const LazyPerformanceOptimizer = createLazyComponent(
  () => import("./PerformanceOptimizer"),
  undefined,
  50,
);

export const LazyTestingFramework = createLazyComponent(
  () =>
    import("./TestingFramework").then((module) => ({
      default: module.TestingFramework,
    })),
  undefined,
  50,
);

export const LazyDocumentationFramework = createLazyComponent(
  () =>
    import("./DocumentationFramework").then((module) => ({
      default: module.DocumentationFramework,
    })),
  undefined,
  50,
);

// 其他重要组件的懒加载
export const LazyHealthDataDashboard = createLazyComponent(
  () => import("./HealthDataDashboard"),
  undefined,
  100,
);

export const LazyEmergencyReliefGuide = createLazyComponent(
  () => import("./EmergencyReliefGuide"),
  undefined,
  50,
);

export const LazyPainMechanismsGuide = createLazyComponent(
  () => import("./PainMechanismsGuide"),
  undefined,
  50,
);

export const LazyBackupRestoreSystem = createLazyComponent(
  () => import("./BackupRestoreSystem"),
  undefined,
  100,
);

// 预加载关键组件
export const preloadCriticalTools = () => {
  const criticalTools = [
    () => import("../../components/SymptomAssessmentTool"),
    () => import("../../components/PainTrackerTool"),
    () => import("../../components/ConstitutionTestTool"),
    () => import("../../components/CycleTrackerTool"),
  ];

  criticalTools.forEach((importFunc, index) => {
    setTimeout(() => {
      preloadComponent(importFunc);
    }, index * 200); // 错开预加载时间
  });
};

// 预加载P2阶段组件
export const preloadAdvancedFeatures = () => {
  const advancedComponents = [
    () => import("./AnalyticsDashboard"),
    () => import("./PersonalizedRecommendationEngine"),
    () => import("./SocialFeatures"),
    () => import("./DataSync"),
    () => import("./ReportGenerator"),
  ];

  advancedComponents.forEach((importFunc, index) => {
    setTimeout(() => {
      preloadComponent(importFunc);
    }, index * 300);
  });
};

// 预加载P3阶段组件
export const preloadSystemOptimization = () => {
  const optimizationComponents = [
    () => import("./I18nOptimizer"),
    () => import("./PerformanceOptimizer"),
    () => import("./TestingFramework"),
    () => import("./DocumentationFramework"),
  ];

  optimizationComponents.forEach((importFunc, index) => {
    setTimeout(() => {
      preloadComponent(importFunc);
    }, index * 250);
  });
};

// 导出所有懒加载组件
const lazyToolCollection = {
  // 核心工具
  LazySymptomAssessmentTool,
  LazyPainTrackerTool,
  LazyConstitutionTestTool,
  LazyCycleTrackerTool,
  LazySymptomTrackerTool,
  LazyPeriodPainAssessmentTool,

  // P2阶段组件
  LazyAnalyticsDashboard,
  LazyPersonalizedRecommendationEngine,
  LazySocialFeatures,
  LazyDataSync,
  LazyReportGenerator,

  // P3阶段组件
  LazyI18nOptimizer,
  LazyPerformanceOptimizer,
  LazyTestingFramework,
  LazyDocumentationFramework,

  // 其他组件
  LazyHealthDataDashboard,
  LazyEmergencyReliefGuide,
  LazyPainMechanismsGuide,
  LazyBackupRestoreSystem,

  // 预加载函数
  preloadCriticalTools,
  preloadAdvancedFeatures,
  preloadSystemOptimization,
};

export default lazyToolCollection;
