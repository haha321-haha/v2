import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";
import Breadcrumb from "@/components/Breadcrumb";
import HeroSection from "./components/HeroSection";
import TrustSection from "./components/TrustSection";
import NavigationCard from "./components/NavigationCard";
import QuickNavigationSection from "./components/QuickNavigationSection";
import { generateAllStructuredData } from "./utils/seoOptimization";
import { Locale } from "@/i18n";
import { safeStringify } from "@/lib/utils/json-serialization";

interface PageParams {
  params: Promise<{ locale: string }>;
}

// SEO 元数据（包含 Canonical、结构化数据）
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage",
  });

  const title = t("periodPainAssessment.meta.title");
  const description = t("periodPainAssessment.meta.description");
  const keywords = t("periodPainAssessment.meta.keywords").split(",");

  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/interactive-tools/period-pain-assessment",
    title,
    description,
    keywords,
    structuredDataType: "CollectionPage" as unknown as StructuredDataType,
  });

  return metadata;
}

export default async function PeriodPainAssessmentPage({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage",
  });
  const breadcrumbT = await getTranslations({
    locale,
    namespace: "interactiveTools.breadcrumb",
  });

  const navigationBaseKey = "periodPainAssessment.navigation";

  // 三个导航卡片的内容
  const navigationCards = [
    {
      key: "calculator",
      href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
    },
    {
      key: "assessment",
      href: `/${locale}/interactive-tools/symptom-assessment`,
    },
    {
      key: "relief",
      href: `/${locale}/articles/home-natural-menstrual-pain-relief`,
    },
  ].map((item) => {
    const base = `${navigationBaseKey}.${item.key}`;
    const features: string[] = t
      .raw(`${base}.features`)
      // 确保一定是数组
      .map((v: string) => v);

    return {
      href: item.href,
      title: t(`${base}.title`),
      description: t(`${base}.description`),
      features,
      primaryCTA: t(`${base}.primaryCTA`),
      secondaryCTA: t(`${base}.secondaryCTA`),
    };
  });

  // 生成FAQ和CollectionPage结构化数据
  const structuredDataT = await getTranslations({
    locale,
    namespace: "interactiveToolsPage.periodPainAssessment",
  });
  const additionalStructuredData = generateAllStructuredData(
    locale as Locale,
    structuredDataT,
  );

  return (
    <>
      {/* FAQ和CollectionPage结构化数据 */}
      {additionalStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
        />
      ))}

      <main className="flex-grow bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* 面包屑导航 */}
            <Breadcrumb
              items={[
                {
                  label: breadcrumbT("interactiveTools"),
                  href: `/${locale}/interactive-tools`,
                },
                { label: t("periodPainAssessment.title") },
              ]}
            />

            {/* 顶部 Hero 区域 */}
            <HeroSection locale={locale} />

            {/* 导航卡片区域 */}
            <section
              aria-labelledby="period-pain-assessment-navigation"
              className="mt-10 md:mt-12"
            >
              <div className="text-center mb-6 md:mb-8">
                <h2
                  id="period-pain-assessment-navigation"
                  className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-3"
                >
                  {t(`${navigationBaseKey}.title`)}
                </h2>
                <p className="text-neutral-600 max-w-3xl mx-auto">
                  {t(`${navigationBaseKey}.subtitle`)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {navigationCards.map((card) => (
                  <NavigationCard key={card.href} {...card} />
                ))}
              </div>
            </section>

            {/* 快速导航区域 */}
            <QuickNavigationSection locale={locale} />

            {/* 信任与专业背书区域 */}
            <section className="mt-12 md:mt-16">
              <TrustSection locale={locale} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
