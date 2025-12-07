import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/constants";

// 创建 next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

/**
 * 中间件 - 处理根路径重定向和 next-intl 路由
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 🔒 排除静态资源路径，避免被路由到动态页面
  // 检查是否是静态资源请求（图片、字体、PDF等）
  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/pdfs/") ||
    pathname.startsWith("/fonts/") ||
    pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|pdf|woff|woff2|ttf|eot)$/i)
  ) {
    // 直接返回，不进行任何处理，让 Next.js 处理静态文件
    return NextResponse.next();
  }

  // 处理根路径重定向
  if (pathname === "/") {
    // 检测用户语言偏好
    const acceptLanguage = request.headers.get("accept-language") || "";
    let preferredLocale = defaultLocale;

    // 解析 Accept-Language 头部
    if (acceptLanguage) {
      const languages = acceptLanguage
        .split(",")
        .map((lang) => {
          try {
            const [code] = lang.trim().split(";");
            return code.toLowerCase().split("-")[0];
          } catch {
            return null;
          }
        })
        .filter((code): code is string => !!code);

      // 查找支持的语言
      for (const code of languages) {
        if (locales.includes(code as (typeof locales)[number])) {
          preferredLocale = code as (typeof locales)[number];
          break;
        }
      }
    }

    // 重定向到对应的语言版本
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}`;
    return NextResponse.redirect(url, 307);
  }

  // 使用 next-intl middleware 处理其他路径
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，除了：
  // - API 路由
  // - _next 静态文件
  // - 静态文件（图片、字体等）
  matcher: ["/", "/(zh|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
