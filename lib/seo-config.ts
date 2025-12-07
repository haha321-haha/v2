import { URL_CONFIG } from "@/lib/url-config";

const { baseUrl } = URL_CONFIG;

// Canonical URL 配置
export const getCanonicalUrl = (locale: string, path: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}/${locale}${cleanPath}`;
};

// Hreflang 配置
export const getHreflangUrls = (path: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return {
    "zh-CN": `${baseUrl}/zh${cleanPath}`,
    "en-US": `${baseUrl}/en${cleanPath}`,
    "x-default": `${baseUrl}/en${cleanPath}`, // ✅ 修复：默认英文版本（北美市场优先）
  };
};
