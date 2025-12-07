import { Metadata } from "next";
import { Locale } from "@/i18n";
import MedicalCareGuideContent from "./components/MedicalCareGuideContent";
import {
  generateArticleStructuredData,
  ArticleStructuredDataScript,
} from "@/lib/seo/article-structured-data";

// SEO元数据生成 - 基于技术日志的成功经验
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    title: isZh
      ? "痛经别再忍！医生详述7大妇科危险信号，教你何时就医 | PeriodHub"
      : "Period Pain or Health Alert? A Doctor's Guide to 7 Red Flags | PeriodHub",
    description: isZh
      ? "你的痛经正常吗？本文教你进行症状自查，识别7个必须就医的危险信号。包含互动疼痛评估工具、症状检查清单、智能决策树，科学管理你的健康。"
      : "Is your period pain normal? Learn to self-check symptoms, identify 7 critical red flags requiring medical attention. Interactive pain assessment, symptom checker, decision tree, and professional medical guidance.",
    keywords: isZh
      ? "痛经, 何时就医, 妇科疾病, 症状自查, 医疗指南, 月经疼痛, 健康评估, 疼痛等级, 危险信号"
      : "period pain, when to see doctor, gynecological conditions, symptom checker, medical guide, menstrual pain, health assessment, pain scale, warning signs",
    openGraph: {
      title: isZh
        ? "痛经就医指南 - 识别7个危险信号"
        : "Period Pain Medical Guide - 7 Warning Signs",
      description: isZh
        ? "专业的痛经评估和就医指导工具"
        : "Professional period pain assessment and medical guidance tools",
      type: "article",
      locale: locale,
      alternateLocale: locale === "zh" ? "en" : "zh",
      images: [
        {
          url: "/images/medical-care-guide-og.jpg",
          width: 1200,
          height: 630,
          alt: isZh ? "痛经就医指南" : "Period Pain Medical Guide",
        },
      ],
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
      languages: {
        en: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/articles/when-to-seek-medical-care-comprehensive-guide`,
        zh: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/articles/when-to-seek-medical-care-comprehensive-guide`,
      },
    },
  };
}

export default async function WhenToSeekMedicalCarePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  // 生成文章结构化数据
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const articleUrl = `${baseUrl}/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`;
  const articleTitle = isZh
    ? "痛经别再忍！医生详述7大妇科危险信号，教你何时就医"
    : "Period Pain or Health Alert? A Doctor's Guide to 7 Red Flags";
  const articleDescription = isZh
    ? "你的痛经正常吗？本文教你进行症状自查，识别7个必须就医的危险信号。包含互动疼痛评估工具、症状检查清单、智能决策树，科学管理你的健康。"
    : "Is your period pain normal? Learn to self-check symptoms, identify 7 critical red flags requiring medical attention. Interactive pain assessment, symptom checker, decision tree, and professional medical guidance.";
  const articleStructuredData = generateArticleStructuredData({
    url: articleUrl,
    title: articleTitle,
    headline: articleTitle,
    description: articleDescription,
    locale,
    publishedAt: "2025-09-20",
    updatedAt: "2025-09-20",
    imageUrl: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
    }/images/medical-care-guide-og.jpg`,
  });

  // 医疗专用结构化数据
  const medicalStructuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: isZh ? "痛经就医指南" : "Period Pain Medical Guide",
    description: isZh
      ? "专业的痛经就医指导，包含疼痛评估工具和决策支持"
      : "Professional period pain medical guidance with assessment tools and decision support",
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
    about: {
      "@type": "MedicalCondition",
      name: "Dysmenorrhea",
      alternateName: isZh ? "痛经" : "Period Pain",
      associatedAnatomy: {
        "@type": "AnatomicalStructure",
        name: isZh ? "子宫" : "Uterus",
      },
    },
    mainEntity: {
      "@type": "MedicalSignOrSymptom",
      name: isZh ? "痛经症状评估" : "Menstrual Pain Assessment",
      possibleTreatment: {
        "@type": "MedicalTherapy",
        name: isZh ? "痛经治疗指导" : "Dysmenorrhea Treatment Guidance",
      },
    },
    author: {
      "@type": "Organization",
      name: "PeriodHub Health",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }`,
    },
    datePublished: "2025-09-20",
    dateModified: "2025-09-20",
    inLanguage: locale,
    isAccessibleForFree: true,
    hasPart: [
      {
        "@type": "WebPageElement",
        name: isZh ? "疼痛评估工具" : "Pain Assessment Tool",
      },
      {
        "@type": "WebPageElement",
        name: isZh ? "症状检查清单" : "Symptom Checklist",
      },
      {
        "@type": "WebPageElement",
        name: isZh ? "就医决策树" : "Medical Decision Tree",
      },
    ],
  };

  return (
    <>
      {/* 文章结构化数据 */}
      <ArticleStructuredDataScript data={articleStructuredData} />

      {/* 医疗专用结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalStructuredData),
        }}
      />
      <MedicalCareGuideContent />
    </>
  );
}
