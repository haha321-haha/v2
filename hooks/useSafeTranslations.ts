"use client";

import { useTranslations, useLocale } from "next-intl";

/**
 * 安全的翻译Hook
 * 提供fallback机制，避免显示翻译键
 */
type TranslationParams = Record<string, unknown>;

type SafeTranslationFn = (
  key: string,
  params?: TranslationParams,
  fallback?: string,
) => string;

type SafeTranslationRawFn = (
  key: string,
  params?: TranslationParams,
  fallback?: string | null,
) => string | null;

export function useSafeTranslations(namespace?: string) {
  const t = useTranslations(namespace);
  const locale = useLocale();

  const safeT: SafeTranslationFn = (key, params, fallback) => {
    try {
      const result = t(key, params as Parameters<typeof t>[1]);

      // 检查是否返回了翻译键本身（表示翻译失败）
      const fullKey = namespace ? `${namespace}.${key}` : key;
      if (result === fullKey || result === key || result.includes(fullKey)) {
        // 在开发环境中警告
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn(`🌐 Translation missing: ${fullKey}`);
        }

        // 返回fallback或友好的默认值
        if (fallback) {
          return fallback;
        }

        // 生成友好的默认值
        return generateFriendlyDefault(key, locale);
      }

      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error(
          `🌐 Translation error: ${namespace ? `${namespace}.` : ""}${key}`,
          error,
        );
      }

      return fallback || generateFriendlyDefault(key, locale);
    }
  };

  const safeTRaw: SafeTranslationRawFn = (key, params, fallback) => {
    try {
      // 检查 t.raw 方法是否存在
      if (typeof t.raw === "function") {
        const result = t.raw(key);
        return result;
      } else {
        // 如果 t.raw 不存在，尝试使用 t 方法
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn(
            `t.raw method not available, falling back to t method for key: ${key}`,
          );
        }
        const result = t(key, params as Parameters<typeof t>[1]);
        return result;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error(
          `🌐 Translation error (raw): ${
            namespace ? `${namespace}.` : ""
          }${key}`,
          error,
        );
      }

      return typeof fallback === "string" ? fallback : null;
    }
  };

  const hasTranslation = (key: string): boolean => {
    // 基于已知的翻译键结构来判断是否存在
    // 这是一个更安全的方法，避免调用next-intl的API

    // 检查是否是recommendations相关的键
    if (key.includes(".recommendations.")) {
      const parts = key.split(".");
      const levelIndex = parts.findIndex((part) => part === "recommendations");

      if (levelIndex !== -1 && levelIndex < parts.length - 1) {
        const recommendationIndex = parseInt(parts[levelIndex + 1]);

        // 基于已知的建议数量来判断
        // stage1: beginner(2), intermediate(2), advanced(2), expert(2)
        // stage2: beginner(2), intermediate(2), advanced(2), expert(3)
        const stage = parts.includes("stage1Results") ? "stage1" : "stage2";
        const level =
          parts[parts.indexOf("stage1Results") + 1] ||
          parts[parts.indexOf("stage2Results") + 1];

        if (stage === "stage1") {
          // stage1所有等级都有2个建议
          return recommendationIndex < 2;
        } else if (stage === "stage2") {
          // stage2: beginner(2), intermediate(2), advanced(2), expert(3)
          if (level === "expert") {
            return recommendationIndex < 3;
          } else {
            return recommendationIndex < 2;
          }
        }
      }
    }

    // 对于其他类型的键，假设存在
    return true;
  };

  return {
    t: safeT,
    tRaw: safeTRaw,
    hasTranslation,
    locale,
    isZh: locale === "zh",
    isEn: locale === "en",
  };
}

/**
 * 生成友好的默认翻译值
 */
function generateFriendlyDefault(key: string, locale: string): string {
  // 常见翻译的默认值映射
  const defaults: Record<string, Record<string, string>> = {
    zh: {
      title: "标题",
      description: "描述",
      submit: "提交",
      cancel: "取消",
      save: "保存",
      delete: "删除",
      edit: "编辑",
      add: "添加",
      loading: "加载中...",
      error: "错误",
      success: "成功",
      warning: "警告",
      info: "信息",
      close: "关闭",
      open: "打开",
      start: "开始",
      stop: "停止",
      next: "下一步",
      previous: "上一步",
      finish: "完成",
      retry: "重试",
    },
    en: {
      title: "Title",
      description: "Description",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      close: "Close",
      open: "Open",
      start: "Start",
      stop: "Stop",
      next: "Next",
      previous: "Previous",
      finish: "Finish",
      retry: "Retry",
    },
  };

  // 尝试从默认值中找到匹配
  const localeDefaults = defaults[locale] || defaults.en;
  const lastKeyPart = key.split(".").pop()?.toLowerCase() || "";

  if (localeDefaults[lastKeyPart]) {
    return localeDefaults[lastKeyPart];
  }

  // 如果没有找到，返回格式化的键名
  const friendlyKey = lastKeyPart
    .replace(/([A-Z])/g, " $1") // 驼峰转空格
    .replace(/[_-]/g, " ") // 下划线和连字符转空格
    .replace(/\b\w/g, (l) => l.toUpperCase()) // 首字母大写
    .trim();

  return friendlyKey || (locale === "zh" ? "未知" : "Unknown");
}

/**
 * 专门用于交互工具的翻译Hook
 */
export function useInteractiveToolTranslations(toolName?: string) {
  const namespace = toolName
    ? `interactiveTools.${toolName}`
    : "interactiveTools";
  return useSafeTranslations(namespace);
}

/**
 * 翻译数组的工具函数
 */
export function translateArray(
  t: SafeTranslationFn,
  keys: string[],
  fallbacks?: string[],
): string[] {
  return keys.map((key, index) => {
    const fallback = fallbacks?.[index];
    return t(key, undefined, fallback);
  });
}

/**
 * 翻译对象的工具函数
 */
export function translateObject<T extends Record<string, string>>(
  t: SafeTranslationFn,
  keyMap: T,
  fallbacks?: Partial<T>,
): Record<keyof T, string> {
  const result: Record<keyof T, string> = {} as Record<keyof T, string>;

  for (const [objectKey, translationKey] of Object.entries(keyMap)) {
    const fallback = fallbacks?.[objectKey as keyof T];
    result[objectKey as keyof T] = t(translationKey, undefined, fallback);
  }

  return result;
}
