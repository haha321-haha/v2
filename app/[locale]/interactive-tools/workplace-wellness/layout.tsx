/**
 * HVsLYEp职场健康助手 - 布局组件
 * 处理Meta信息和结构化数据
 */

import type { Metadata } from "next";
import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  getWorkplaceWellnessSEOData,
  generateAllStructuredData,
} from "./utils/seoOptimization";
import { safeStringify } from "@/lib/utils/json-serialization";

// 生成静态参数
export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

// 生成Meta信息
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seoData = getWorkplaceWellnessSEOData();

  return generatePageMetadata(locale, seoData, {
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  });
}

export default async function WorkplaceWellnessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // 获取翻译函数
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage.workplaceWellness",
  });

  // 生成结构化数据
  const structuredData = generateAllStructuredData(locale, t);

  return (
    <>
      {/* 结构化数据 */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
        />
      ))}

      {/* 页面内容 */}
      {children}
    </>
  );
}
