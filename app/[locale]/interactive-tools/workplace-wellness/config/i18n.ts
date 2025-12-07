import { logWarn } from "@/lib/debug-logger";

/**
 * HVsLYEp职场健康助手 - 国际化配置
 * 基于HVsLYEp的翻译结构设计
 * 已迁移到 next-intl 系统
 */

// 支持的语言配置
export const supportedLanguages = ["zh", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

// 语言显示名称
export const languageNames: Record<SupportedLanguage, string> = {
  zh: "中文",
  en: "English",
};

// 语言切换配置
export const languageConfig = {
  defaultLanguage: "zh" as SupportedLanguage,
  fallbackLanguage: "en" as SupportedLanguage,
  storageKey: "workplace-wellness-language",
};

// 翻译键路径配置
export const translationKeys = {
  // 头部相关
  header: {
    title: "header.title",
    subtitle: "header.subtitle",
    settings: "header.settings",
  },

  // 导航相关
  navigation: {
    calendar: "nav.calendar",
    nutrition: "nav.nutrition",
    export: "nav.export",
  },

  // 日历相关
  calendar: {
    title: "calendar.title",
    subtitle: "calendar.subtitle",
    days: "calendar.days",
    addRecord: "calendar.addRecord",
    recordButton: "calendar.recordButton",
  },

  // 工作影响相关
  workImpact: {
    title: "workImpact.title",
    painLevel: "workImpact.painLevel",
    efficiency: "workImpact.efficiency",
    adjustment: "workImpact.adjustment",
    adjustOptions: "workImpact.adjustOptions",
    saveButton: "workImpact.saveButton",
    templatesTitle: "workImpact.templatesTitle",
    severity: "workImpact.severity",
    preview: "workImpact.preview",
    subject: "workImpact.subject",
    content: "workImpact.content",
    copyButton: "workImpact.copyButton",
  },

  // 营养相关
  nutrition: {
    title: "nutrition.title",
    phaseLabel: "nutrition.phaseLabel",
    phases: "nutrition.phases",
    phaseIcons: "nutrition.phaseIcons",
    constitutionLabel: "nutrition.constitutionLabel",
    constitutions: "nutrition.constitutions",
    foodTitle: "nutrition.foodTitle",
    searchPlaceholder: "nutrition.searchPlaceholder",
    holisticNature: "nutrition.holisticNature",
    benefitsLabel: "nutrition.benefitsLabel",
    nutrientsLabel: "nutrition.nutrientsLabel",
    addButton: "nutrition.addButton",
    noResults: "nutrition.noResults",
    planTitle: "nutrition.planTitle",
    meals: "nutrition.meals",
    mealSuggestions: "nutrition.mealSuggestions",
    generateButton: "nutrition.generateButton",
  },

  // 导出相关
  export: {
    title: "export.title",
    subtitle: "export.subtitle",
    typeLabel: "export.typeLabel",
    types: "export.types",
    formatLabel: "export.formatLabel",
    formats: "export.formats",
    exportButton: "export.exportButton",
    downloadButton: "export.downloadButton",
    successMessage: "export.successMessage",
    errorMessage: "export.errorMessage",
  },

  // 通用
  common: {
    save: "common.save",
    cancel: "common.cancel",
    confirm: "common.confirm",
    delete: "common.delete",
    edit: "common.edit",
    add: "common.add",
    search: "common.search",
    loading: "common.loading",
    error: "common.error",
    success: "common.success",
    warning: "common.warning",
    info: "common.info",
  },
};

// 翻译函数工厂 - 基于HVsLYEp的t函数设计
export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export function createTranslationFunction(translations: TranslationDictionary) {
  return (key: string): string => {
    const keys = key.split(".");
    let result: unknown = translations;

    for (const k of keys) {
      if (typeof result !== "object" || result === null) {
        logWarn(`Translation not found for key: ${key}`);
        return key;
      }

      if (!(k in result)) {
        logWarn(`Translation not found for key: ${key}`);
        return key;
      }

      result = (result as TranslationDictionary)[k];
    }

    return typeof result === "string" ? result : key;
  };
}

// 语言切换工具函数
export function getLanguageFromLocale(locale: string): SupportedLanguage {
  return supportedLanguages.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : languageConfig.defaultLanguage;
}

// 获取语言显示名称
export function getLanguageDisplayName(lang: SupportedLanguage): string {
  return languageNames[lang] || lang;
}

// 检查语言是否支持
export function isLanguageSupported(lang: string): lang is SupportedLanguage {
  return supportedLanguages.includes(lang as SupportedLanguage);
}

// 获取浏览器语言偏好
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return languageConfig.defaultLanguage;
  }

  const browserLang = navigator.language.split("-")[0];
  return isLanguageSupported(browserLang)
    ? browserLang
    : languageConfig.defaultLanguage;
}

// 保存语言偏好到本地存储
export function saveLanguagePreference(lang: SupportedLanguage): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(languageConfig.storageKey, lang);
  }
}

// 从本地存储获取语言偏好
export function getLanguagePreference(): SupportedLanguage {
  if (typeof window === "undefined") {
    return languageConfig.defaultLanguage;
  }

  const saved = localStorage.getItem(languageConfig.storageKey);
  return isLanguageSupported(saved || "")
    ? (saved as SupportedLanguage)
    : languageConfig.defaultLanguage;
}

// 初始化语言设置
export function initializeLanguage(): SupportedLanguage {
  const saved = getLanguagePreference();
  const browser = getBrowserLanguage();

  // 优先使用保存的偏好，否则使用浏览器语言
  return saved || browser;
}
