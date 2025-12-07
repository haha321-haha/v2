import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resourcesPage" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t.raw("meta.keywords"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/resources`,
      siteName: "PeriodHub",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/resources`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/resources`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/resources`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/resources`, // ✅ 修复：默认英文版本（北美市场优先）
      },
    },
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {locale === "zh"
              ? "PDF资源下载中心"
              : "PDF Resource Download Center"}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === "zh"
              ? "下载专业制作的PDF指南、表格和工具，帮助您更好地管理经期健康。"
              : "Download professionally crafted PDF guides, forms, and tools to help you better manage your menstrual health."}
          </p>
          <div className="mt-8 p-8 bg-white rounded-lg shadow-lg">
            <p className="text-lg text-green-600 font-semibold">
              ✅ 页面加载成功！Page loaded successfully!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              路由: /resources | Route: /resources
            </p>
            <p className="text-sm text-blue-500 mt-2">
              语言: {locale} | Language: {locale}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
