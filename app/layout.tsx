import "./globals.css";
import { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
// import { URL_CONFIG } from "@/lib/url-config";
// import MobileOptimization from "@/components/MobileOptimization";
import OptimizedScripts, {
  OptimizedChartJS,
  OptimizedLucide,
} from "@/components/optimized/OptimizedScripts";
import PerformanceTracker from "@/components/performance/PerformanceTracker";
// import ClientSafe from '@/components/ClientSafe';

// 使用本地Noto Sans SC字体
const notoSansSC = localFont({
  src: [
    {
      path: "./fonts/Noto_Sans_SC/static/NotoSansSC-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Noto_Sans_SC/static/NotoSansSC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Noto_Sans_SC/static/NotoSansSC-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Noto_Sans_SC/static/NotoSansSC-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Noto_Sans_SC/static/NotoSansSC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Noto_Sans_SC/static/NotoSansSC-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-noto-sans-sc",
});
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import HydrationFix from "@/components/HydrationFix";
import EnhancedHydrationFix from "@/components/EnhancedHydrationFix";
import HydrationErrorBoundary from "@/components/HydrationErrorBoundary";

// 🚀 Core Web Vitals 优化的根布局
export const metadata: Metadata = {
  metadataBase: new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}`,
  ),
  title: {
    default: "PeriodHub - 专业痛经缓解方法和月经健康管理平台",
    template: "%s | PeriodHub",
  },
  description:
    "提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。基于医学研究的个性化建议，中西医结合的健康方案。",
  keywords: [
    // 高搜索量核心词
    "痛经怎么缓解最快方法",
    "痛经吃什么药最有效",
    "月经推迟几天算正常",
    "月经量少是什么原因",
    // 品牌核心词
    "痛经缓解",
    "月经疼痛",
    "经期健康",
    "女性健康",
    "月经健康管理",
    "经期疼痛怎么办",
    "整体健康调理",
    // 新增关键词
    "疼痛管理",
    "PDF下载",
    "医学指南下载",
    "专业文章下载",
    "痛经管理",
    // 英文关键词
    "menstrual cramps relief",
    "period pain remedies",
    "how to stop period pain",
    "natural period pain relief",
    "pain management",
    "PDF downloads",
    "medical guides download",
    "period pain management",
  ],
  authors: [{ name: "PeriodHub Team" }],
  creator: "PeriodHub",
  publisher: "PeriodHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
    }`,
    siteName: "PeriodHub",
    title: "PeriodHub - 专业痛经缓解和疼痛管理平台 | 42篇医学指南+PDF下载",
    description:
      "专业的痛经缓解和疼痛管理平台，提供科学的缓解方法和个性化健康建议，42篇医学指南、8个实用工具和PDF下载。",
  },
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "PeriodHub - 专业痛经缓解和疼痛管理平台 | 42篇医学指南+PDF下载",
    description:
      "专业的痛经缓解和疼痛管理平台，提供科学的缓解方法，42篇医学指南、8个实用工具和PDF下载。",
  },
  // 移动端优化 - 已移至单独的 viewport 导出
  // 性能优化
  other: {
    "theme-color": "#9333ea",
    "color-scheme": "light",
  },
};

// 🚀 移动端优化 - Next.js 推荐的 viewport 配置
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// 根级别layout - 必须包含html和body标签
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 从请求头中获取locale
  // 使用 try-catch 确保即使 headers() 失败也能正常工作
  let locale = "zh"; // 默认语言
  try {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    locale = pathname.startsWith("/en") ? "en" : "zh";
  } catch {
    // 如果获取 headers 失败，使用默认语言
    locale = "zh";
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* 🚀 性能优化 - DNS 预解析 */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//www.clarity.ms" />

        {/* 🚀 性能优化 - 预连接关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* 📱 移动端优化 - 防止缩放闪烁 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* 🔍 搜索引擎优化 */}
        <meta
          name="google-site-verification"
          content="1cZ9WUBHeRB2lMoPes66cXWCTkycozosPw4_PnNMoGk"
        />
        <meta name="msvalidate.01" content="12D5EA89A249696AACD3F155B64C5E56" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        {/* 🎨 主题和图标 */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* 🚀 优化的第三方脚本 - 智能延迟加载 */}
        <OptimizedScripts />

        {/* 📊 按需脚本优化 */}
        <OptimizedChartJS />
        <OptimizedLucide />

        {/* 📊 性能监控 */}
        <PerformanceTracker />
      </head>
      <body className={notoSansSC.className} suppressHydrationWarning>
        {/* 🔧 Hydration修复 - 解决浏览器扩展导致的hydration不匹配 */}
        <HydrationFix />
        <EnhancedHydrationFix />

        <HydrationErrorBoundary>{children}</HydrationErrorBoundary>

        {/* 🚀 SEO优化 - Core Web Vitals监控 */}
        <WebVitalsReporter />

        {/* 🚀 SEO优化 - 性能监控 */}
        <PerformanceMonitor />
      </body>
    </html>
  );
}
