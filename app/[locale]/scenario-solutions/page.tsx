import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import SafeSmartImage from "@/components/ui/SafeSmartImage";
import {
  generateCollectionStructuredData,
  CollectionStructuredDataScript,
} from "@/lib/seo/collection-structured-data";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";
import {
  generateMedicalConditionSchema,
  generateMedicalWebPageSchema,
} from "@/lib/seo/medical-schema-generator";
import { safeStringify } from "@/lib/utils/json-serialization";
import {
  Briefcase,
  Car,
  Dumbbell,
  Moon,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
  Package,
  Star,
} from "lucide-react";
import PartnerCommunicationFeature from "./components/PartnerCommunicationFeature";

// Types
type Locale = "en" | "zh";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "scenarioSolutionsPage",
  });

  // 使用统一的SEO配置函数
  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/scenario-solutions",
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(","),
    structuredDataType: "CollectionPage" as unknown as StructuredDataType,
    additionalStructuredData: {
      numberOfItems: 6, // 场景解决方案数量
      description: t("description"),
    },
  });

  return metadata;
}

export default async function ScenarioSolutionsPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations("scenarioSolutionsPage");
  const commonT = await getTranslations("common");

  // 场景图片映射
  const scenarioImages: Record<string, { filename: string; alt: string }> = {
    office: {
      filename: "scenario-office.jpg",
      alt: "Professional woman managing menstrual discomfort at office workspace",
    },
    commute: {
      filename: "scenario-commuting.jpg",
      alt: "Woman managing period pain during daily commute on public transport",
    },
    exercise: {
      filename: "scenario-exercise.jpg",
      alt: "Woman adapting exercise routine during menstruation in gym setting",
    },
    sleep: {
      filename: "scenario-sleeping.jpg",
      alt: "Woman using comfort techniques for better sleep during menstruation",
    },
    social: {
      filename: "scenario-dating.jpg",
      alt: "Woman confidently managing period during social gathering or date",
    },
    lifeStages: {
      filename: "scenario-family.jpg",
      alt: "Women of different life stages sharing menstrual health experiences",
    },
    partnerCommunication: {
      filename: "scenario-partner-communication.jpg",
      alt: "Couple having supportive conversation about period pain and understanding",
    },
  };

  const scenarios = [
    {
      id: "office",
      title: t("scenarios.office.title"),
      description: t("scenarios.office.description"),
      features: (t.raw("scenarios.office.features") as string[]) || [],
      iconName: "Briefcase",
      color: "bg-blue-50 text-blue-600",
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: "commute",
      title: t("scenarios.commute.title"),
      description: t("scenarios.commute.description"),
      features: (t.raw("scenarios.commute.features") as string[]) || [],
      iconName: "Car",
      color: "bg-green-50 text-green-600",
      hoverColor: "hover:bg-green-100",
    },
    {
      id: "exercise",
      title: t("scenarios.exercise.title"),
      description: t("scenarios.exercise.description"),
      features: (t.raw("scenarios.exercise.features") as string[]) || [],
      iconName: "Dumbbell",
      color: "bg-orange-50 text-orange-600",
      hoverColor: "hover:bg-orange-100",
    },
    {
      id: "sleep",
      title: t("scenarios.sleep.title"),
      description: t("scenarios.sleep.description"),
      features: (t.raw("scenarios.sleep.features") as string[]) || [],
      iconName: "Moon",
      color: "bg-purple-50 text-purple-600",
      hoverColor: "hover:bg-purple-100",
    },
    {
      id: "social",
      title: t("scenarios.social.title"),
      description: t("scenarios.social.description"),
      features: (t.raw("scenarios.social.features") as string[]) || [],
      iconName: "Users",
      color: "bg-pink-50 text-pink-600",
      hoverColor: "hover:bg-pink-100",
    },
    {
      id: "lifeStages",
      title: t("scenarios.lifeStages.title"),
      description: t("scenarios.lifeStages.description"),
      features: (t.raw("scenarios.lifeStages.features") as string[]) || [],
      iconName: "Heart",
      color: "bg-red-50 text-red-600",
      hoverColor: "hover:bg-red-100",
    },
  ];

  // 生成 CollectionPage 结构化数据
  const collectionData = await generateCollectionStructuredData({
    locale,
    pagePath: "/scenario-solutions",
    name: t("title"),
    description: t("description"),
    items: scenarios.map((scenario) => ({
      title: scenario.title,
      description: scenario.description,
      href: `/${locale}/scenario-solutions/${scenario.id}`,
    })),
    additionalInfo: {
      about: t("structuredData.about"),
      audience: t("structuredData.audience"),
    },
  });

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-8 h-8" };
    switch (iconName) {
      case "Briefcase":
        return <Briefcase {...iconProps} />;
      case "Car":
        return <Car {...iconProps} />;
      case "Dumbbell":
        return <Dumbbell {...iconProps} />;
      case "Moon":
        return <Moon {...iconProps} />;
      case "Users":
        return <Users {...iconProps} />;
      case "Heart":
        return <Heart {...iconProps} />;
      default:
        return <Briefcase {...iconProps} />;
    }
  };

  // 生成独立的 MedicalCondition Schema (P1 优化)
  const medicalConditionSchema = generateMedicalConditionSchema(
    "DYSMENORRHEA",
    locale,
  );

  // 生成 MedicalWebPage Schema (GEO/AEO 合规性)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const medicalWebPageSchema = generateMedicalWebPageSchema({
    title: t("title"),
    description: t("description"),
    condition: "DYSMENORRHEA",
    citations: ["ACOG_DYSMENORRHEA", "WHO_REPRODUCTIVE_HEALTH"],
    locale: locale,
    url: `${baseUrl}/${locale}/scenario-solutions`,
    lastReviewed: new Date().toISOString().split("T")[0],
  });

  return (
    <>
      <CollectionStructuredDataScript data={collectionData} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStringify(medicalConditionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStringify(medicalWebPageSchema),
        }}
      />
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12"
        data-page="scenario-solutions"
      >
        {/* Page Header */}
        <header className="text-center py-8 md:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto px-4">
            {t("description")}
          </p>
        </header>

        {/* 青少年经期健康专区推广区域 */}
        <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-pink-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-pink-200 rounded-full opacity-20 transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-purple-200 rounded-full opacity-20 transform -translate-x-10 sm:-translate-x-12 translate-y-10 sm:translate-y-12"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-8">
            <div className="w-full lg:w-2/3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                <div className="bg-pink-100 rounded-full p-2 mr-0 sm:mr-3 mb-2 sm:mb-0">
                  <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {t("teenHealth.title")}
                  </h2>
                  <p className="text-sm text-pink-600 font-medium">
                    {t("teenHealth.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 md:mb-6 text-base sm:text-lg leading-relaxed">
                {t("teenHealth.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href={`/${locale}/teen-health`}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  {t("teenHealth.enterZone")}
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                </Link>
                <Link
                  href={`/${locale}/teen-health/campus-guide`}
                  className="inline-flex items-center justify-center bg-white text-pink-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium border-2 border-pink-200 hover:bg-pink-50 transition-colors text-sm sm:text-base"
                >
                  {t("teenHealth.campusGuide")}
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-pink-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm sm:text-base">
                  <span className="text-pink-500 mr-2">💝</span>
                  {t("teenHealth.helpTitle")}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      icon: "🏫",
                      text: t("teenHealth.services.campusGuide"),
                    },
                    {
                      icon: "🌱",
                      text: t("teenHealth.services.painManagement"),
                    },
                    {
                      icon: "💭",
                      text: t("teenHealth.services.emotionalSupport"),
                    },
                    {
                      icon: "💬",
                      text: t("teenHealth.services.communication"),
                    },
                    {
                      icon: "👭",
                      text: t("teenHealth.services.peerSharing"),
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center text-xs sm:text-sm text-gray-600"
                    >
                      <span className="mr-2 sm:mr-3 text-base sm:text-lg">
                        {item.icon}
                      </span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-4 sm:p-6 md:p-8 rounded-xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 mb-3 sm:mb-4">
              {t("introTitle")}
            </h2>
            <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
              {t("introText")}
            </p>
          </div>
        </section>

        {/* Scenarios Grid */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {scenarios.map((scenario, index) => (
              <div
                key={`${scenario.id}-${index}`}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200 group cursor-pointer"
              >
                {/* Scenario Image */}
                <div className="mb-4 sm:mb-6 relative overflow-hidden rounded-lg h-40 sm:h-48">
                  <SafeSmartImage
                    key={`scenario-image-${scenario.id}`}
                    src={`/images/scenarios/${
                      scenarioImages[scenario.id].filename
                    }`}
                    alt={scenarioImages[scenario.id].alt}
                    width={600}
                    height={400}
                    type="content"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ width: "100%", height: "100%" }}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={false}
                    enableFallback={true}
                    fallbackComponent="OptimizedImage"
                  />
                </div>

                <div
                  className={`w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-full ${scenario.color} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {getIcon(scenario.iconName)}
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2 sm:mb-3 group-hover:text-primary-700 transition-colors">
                  {scenario.title}
                </h3>

                <p className="text-neutral-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  {scenario.description}
                </p>

                <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                  {Array.isArray(scenario.features) && scenario.features.length > 0
                    ? scenario.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm text-neutral-700"
                        >
                          <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))
                    : null}
                </div>

                <Link
                  href={`/${locale}/scenario-solutions/${scenario.id}`}
                  className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors text-sm sm:text-base"
                >
                  <span className="mr-2">{commonT("learnMore")}</span>
                  <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Communication Feature */}
        <PartnerCommunicationFeature locale={locale} />

        {/* Emergency Kit Section */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 p-4 sm:p-6 md:p-8 rounded-xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 gap-4">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <Package className="w-6 sm:w-8 h-6 sm:h-8" />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 mr-1" />
                  <span className="text-xs sm:text-sm font-medium text-red-700">
                    {t("emergencyKit.specialRecommendation")}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
                  {t("emergencyKit.title")}
                </h2>
              </div>
            </div>

            <p className="text-neutral-700 text-center mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              {t("emergencyKit.description")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-neutral-800 text-sm sm:text-base">
                    {t("emergencyKit.scenarios.office.title")}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600">
                  {t("emergencyKit.scenarios.office.description")}
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Car className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 mr-2" />
                  <span className="font-medium text-neutral-800 text-sm sm:text-base">
                    {t("emergencyKit.scenarios.commute.title")}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600">
                  {t("emergencyKit.scenarios.commute.description")}
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5 text-pink-600 mr-2" />
                  <span className="font-medium text-neutral-800 text-sm sm:text-base">
                    {t("emergencyKit.scenarios.social.title")}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600">
                  {t("emergencyKit.scenarios.social.description")}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href={`/${locale}/scenario-solutions/emergency-kit`}
                className="inline-flex items-center justify-center bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                <Package className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                {t("emergencyKit.viewCompleteList")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-neutral-100 p-4 sm:p-6 md:p-8 rounded-xl text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-neutral-700 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={`/${locale}/interactive-tools/symptom-assessment`}
              className="inline-flex items-center justify-center bg-primary-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              {t("cta.startAssessment")}
            </Link>
            <Link
              href={`/${locale}/interactive-tools/pain-tracker`}
              className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium hover:bg-primary-50 transition-colors text-sm sm:text-base"
            >
              {t("cta.startTracking")}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
