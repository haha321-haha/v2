/**
 * 客户端检测工具
 * 用于解决SSR/CSR水合不匹配问题
 */

export const isClient = typeof window !== "undefined";

export const isServer = typeof window === "undefined";

/**
 * 检测是否有翻译插件干扰
 */
export const hasTranslationInterference = () => {
  if (isServer) return false;

  // 检测常见翻译插件标记
  const translationMarkers = [
    "data-doubao-translate-traverse-mark",
    "data-google-translate-element",
    "data-translate",
    "translate",
  ];

  return translationMarkers.some(
    (marker) => document.querySelector(`[${marker}]`) !== null,
  );
};

/**
 * 安全的客户端渲染包装器
 */
export function withClientOnly<T>(
  clientComponent: T,
  serverFallback: T | null = null,
): T | null {
  return isClient ? clientComponent : serverFallback;
}
