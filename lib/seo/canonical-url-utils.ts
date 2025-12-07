/**
 * Canonical URL Utilities
 * 规范化 URL 工具
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

/**
 * 生成规范化 URL
 */
export function generateCanonicalUrl(locale: string, path: string): string {
  // 移除开头的斜杠
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // 移除结尾的斜杠
  const finalPath = cleanPath.endsWith("/")
    ? cleanPath.slice(0, -1)
    : cleanPath;

  return `${BASE_URL}/${locale}/${finalPath}`;
}

/**
 * 生成多语言 URL
 */
export function generateAlternateUrls(path: string) {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const finalPath = cleanPath.endsWith("/")
    ? cleanPath.slice(0, -1)
    : cleanPath;

  return {
    "en-US": `${BASE_URL}/en/${finalPath}`,
    "zh-CN": `${BASE_URL}/zh/${finalPath}`,
    "x-default": `${BASE_URL}/en/${finalPath}`,
  };
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 规范化路径
 */
export function normalizePath(path: string): string {
  return path
    .replace(/\/+/g, "/") // 移除多余的斜杠
    .replace(/\/$/, "") // 移除结尾斜杠
    .replace(/^\//, ""); // 移除开头斜杠
}

/**
 * 生成多语言配置（别名函数）
 */
export function generateAlternatesConfig(path: string) {
  return generateAlternateUrls(path);
}
