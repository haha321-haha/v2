/**
 * 翻译工具函数
 * 提供安全的翻译功能和fallback机制
 */

import { useTranslations, useLocale } from "next-intl";

/**
 * 安全的翻译Hook，提供fallback机制
 */
export function useSafeTranslations(namespace?: string) {
  const t = useTranslations(namespace);
  const locale = useLocale();

  const safeT = (
    key: string,
    params?: Record<string, unknown>,
    fallback?: string,
  ): string => {
    try {
      const result = t(
        key,
        params as Record<string, string | number | boolean | null | undefined>,
      );

      if (result === key || result.includes(key)) {
        return fallback || key;
      }

      return result;
    } catch {
      return fallback || key;
    }
  };

  return {
    t: safeT,
    locale,
    isZh: locale === "zh",
    isEn: locale === "en",
  };
}

/**
 * 翻译键验证函数
 */
export function validateTranslationKey(
  key: string,
  namespace?: string,
): boolean {
  const fullKey = namespace ? `${namespace}.${key}` : key;
  return typeof fullKey === "string" && fullKey.length > 0;
}

/**
 * 获取翻译键的完整路径
 */
export function getFullTranslationKey(key: string, namespace?: string): string {
  return namespace ? `${namespace}.${key}` : key;
}

/**
 * 翻译数组处理函数
 */
export function translateArray(
  t: (key: string) => string,
  keys: string[],
  fallbacks?: string[],
): string[] {
  return keys.map((key, index) => {
    const result = t(key);

    // 如果翻译失败，使用fallback
    if (result === key && fallbacks && fallbacks[index]) {
      return fallbacks[index];
    }

    return result;
  });
}

/**
 * 条件翻译函数
 * 根据条件选择不同的翻译键
 */
export function conditionalTranslation(
  t: (key: string) => string,
  condition: boolean,
  trueKey: string,
  falseKey: string,
  fallback?: string,
): string {
  const key = condition ? trueKey : falseKey;
  const result = t(key);

  if (result === key && fallback) {
    return fallback;
  }

  return result;
}

/**
 * 翻译对象处理函数
 */
export function translateObject<T extends Record<string, string>>(
  t: (key: string) => string,
  keyMap: T,
  fallbacks?: Partial<T>,
): Record<keyof T, string> {
  const result: Record<keyof T, string> = {} as Record<keyof T, string>;

  for (const [objectKey, translationKey] of Object.entries(keyMap)) {
    const translated = t(translationKey);

    // 如果翻译失败，使用fallback
    if (
      translated === translationKey &&
      fallbacks &&
      fallbacks[objectKey as keyof T]
    ) {
      result[objectKey as keyof T] = fallbacks[objectKey as keyof T]!;
    } else {
      result[objectKey as keyof T] = translated;
    }
  }

  return result;
}

/**
 * 开发环境翻译调试函数
 */
/**
 * 翻译缓存管理
 */
class TranslationCache {
  private cache = new Map<string, string>();

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const translationCache = new TranslationCache();
