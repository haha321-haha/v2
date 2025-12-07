import { MetadataRoute } from "next";

// 🚀 移动端优化已启用：Service Worker、触摸优化、性能监控
// 🔧 修复版本：解决 manifest.json 和 constitution-test 被误屏蔽的问题
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/manifest.json",
          "/manifest-*.webmanifest",
          "/manifest-*.json",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          // 🔧 修复：移除 "*.json" 通配符，改为精确控制
          // 只禁止 API 和内部 JSON 文件，允许 manifest.json
          "/api/*.json",
          "/_next/*.json",
          "/search?*",
          // 禁止索引图标文件
          "/icon/",
          "/icon?*",
          "/favicon*",
          "/apple-touch-icon*",
          // 🔧 修复：精确化测试页面规则，避免屏蔽 constitution-test
          // 只禁止真正的测试页面，不屏蔽包含 "test" 的功能页面
          "/test/",
          "/testing/",
          "/test-page",
          "/test-*",
          "/dev*",
          "/staging*",
          // 禁止索引备份文件
          "*.backup*",
          "*.tmp*",
          "*.log*",
          // 精确禁止Next.js内部资源，但允许必要的静态文件
          "/_next/static/chunks/",
          "/_next/static/webpack/",
          "/_next/static/css/",
          // 禁止字体文件（woff2等）被索引
          "/_next/static/media/",
          // 🎯 禁止索引PDF文件（正确的SEO策略）
          "/pdf-files/",
          "/downloads/*.pdf",
          "*.pdf",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/manifest.json",
          "/manifest-*.webmanifest",
          "/manifest-*.json",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          // 🔧 修复：精确化测试页面规则
          "/test/",
          "/testing/",
          "/test-page",
          "/test-*",
          "/dev*",
          "/staging*",
          "/icon/",
          "/icon?*",
          "/favicon*",
          "/apple-touch-icon*",
          "*.backup*",
          "*.tmp*",
          "*.log*",
          // 精确禁止Next.js内部资源
          "/_next/static/chunks/",
          "/_next/static/webpack/",
          "/_next/static/css/",
          "/_next/static/media/",
          // 🎯 禁止索引PDF文件
          "/pdf-files/",
          "/downloads/*.pdf",
          "*.pdf",
          "/search?*",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/manifest.json",
          "/manifest-*.webmanifest",
          "/manifest-*.json",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          // 🔧 修复：精确化测试页面规则
          "/test/",
          "/testing/",
          "/test-page",
          "/test-*",
          "/dev*",
          "/staging*",
          "/icon/",
          "/icon?*",
          "/favicon*",
          "/apple-touch-icon*",
          "*.backup*",
          "*.tmp*",
          "*.log*",
          // 精确禁止Next.js内部资源
          "/_next/static/chunks/",
          "/_next/static/webpack/",
          "/_next/static/css/",
          "/_next/static/media/",
          // 🎯 禁止索引PDF文件
          "/pdf-files/",
          "/downloads/*.pdf",
          "*.pdf",
          "/search?*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
