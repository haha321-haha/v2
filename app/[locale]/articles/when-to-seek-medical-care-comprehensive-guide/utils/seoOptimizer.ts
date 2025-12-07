// SEO优化工具 - 基于技术日志的成功经验

import { Metadata } from "next";

// 生成结构化数据
export function generateStructuredData(
  locale: string,
  translations: {
    meta: {
      title: string;
      description: string;
    };
  },
) {
  const isZh = locale === "zh";

  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: translations.meta.title,
    description: translations.meta.description,
    url: `https://www.periodhub.health/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
    inLanguage: locale,
    isAccessibleForFree: true,
    datePublished: "2025-09-20T00:00:00Z",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "PeriodHub Health",
      url: "https://www.periodhub.health",
      logo: {
        "@type": "ImageObject",
        url: "https://www.periodhub.health/images/logo.png",
        width: 200,
        height: 60,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "PeriodHub Health",
      logo: {
        "@type": "ImageObject",
        url: "https://www.periodhub.health/images/logo.png",
        width: 200,
        height: 60,
      },
    },
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
      geographicArea: {
        "@type": "Country",
        name: isZh ? "中国" : "Global",
      },
    },
    about: {
      "@type": "MedicalCondition",
      name: "Dysmenorrhea",
      alternateName: isZh ? "痛经" : "Period Pain",
      code: {
        "@type": "MedicalCode",
        code: "N94.6",
        codingSystem: "ICD-10",
      },
      associatedAnatomy: {
        "@type": "AnatomicalStructure",
        name: isZh ? "子宫" : "Uterus",
      },
      possibleComplication: [
        {
          "@type": "MedicalCondition",
          name: isZh ? "子宫内膜异位症" : "Endometriosis",
        },
        {
          "@type": "MedicalCondition",
          name: isZh ? "子宫肌瘤" : "Uterine Fibroids",
        },
      ],
    },
  };
}

// 生成FAQ结构化数据
export function generateFAQStructuredData(locale: string) {
  const isZh = locale === "zh";

  const faqs = isZh
    ? [
        {
          question: "什么程度的痛经需要就医？",
          answer:
            "如果疼痛等级达到7分以上（满分10分），或者疼痛严重影响日常生活和工作，建议就医评估。特别是出现突发剧烈疼痛、异常出血、发热等症状时，应立即就医。",
        },
        {
          question: "痛经的危险信号有哪些？",
          answer:
            "7个主要危险信号包括：突发剧烈疼痛、异常大量出血、发热和全身症状、疼痛模式突然改变、非经期疼痛、疼痛进行性加重、止痛药无效。出现任何一个都应该重视。",
        },
      ]
    : [
        {
          question: "What level of period pain requires medical attention?",
          answer:
            "If pain reaches 7 or above on a 10-point scale, or severely affects daily life and work, medical evaluation is recommended. Especially when experiencing sudden severe pain, abnormal bleeding, or fever, seek immediate medical care.",
        },
        {
          question: "What are the warning signs of period pain?",
          answer:
            "7 main warning signs include: sudden severe pain, abnormally heavy bleeding, fever and systemic symptoms, sudden change in pain pattern, non-menstrual pain, progressively worsening pain, and medication ineffectiveness.",
        },
      ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// 生成HowTo结构化数据
export function generateHowToStructuredData(locale: string) {
  const isZh = locale === "zh";

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: isZh
      ? "如何评估痛经是否需要就医"
      : "How to Assess if Period Pain Requires Medical Care",
    description: isZh
      ? "通过3个步骤科学评估痛经症状，判断是否需要就医"
      : "Scientifically assess period pain symptoms in 3 steps to determine if medical care is needed",
    totalTime: "PT10M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
  };
}

// 生成完整的元数据
export function generateEnhancedMetadata(
  locale: string,
  translations: {
    meta: {
      title: string;
      description: string;
      keywords?: string | string[];
    };
    [key: string]: unknown;
  },
): Metadata {
  const baseUrl = "https://www.periodhub.health";
  const currentUrl = `${baseUrl}/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`;

  return {
    title: translations.meta.title,
    description: translations.meta.description,
    keywords: translations.meta.keywords,

    // Open Graph
    openGraph: {
      title: translations.meta.title,
      description: translations.meta.description,
      type: "article",
      url: currentUrl,
      locale: locale,
      alternateLocale: locale === "zh" ? "en" : "zh",
      siteName: "PeriodHub Health",
      images: [
        {
          url: `${baseUrl}/images/medical-care-guide-og.jpg`,
          width: 1200,
          height: 630,
          alt: translations.meta.title,
          type: "image/jpeg",
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: translations.meta.title,
      description: translations.meta.description,
      images: [`${baseUrl}/images/medical-care-guide-twitter.jpg`],
      creator: "@PeriodHubHealth",
      site: "@PeriodHubHealth",
    },

    // 规范链接和多语言
    alternates: {
      canonical: currentUrl,
      languages: {
        zh: `${baseUrl}/zh/articles/when-to-seek-medical-care-comprehensive-guide`,
        en: `${baseUrl}/en/articles/when-to-seek-medical-care-comprehensive-guide`,
      },
    },

    // 机器人指令
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
  };
}

// 生成面包屑导航
export function generateBreadcrumbs(locale: string) {
  const isZh = locale === "zh";
  const baseUrl = "https://www.periodhub.health";

  return [
    {
      name: isZh ? "首页" : "Home",
      url: `${baseUrl}/${locale}`,
    },
    {
      name: isZh ? "文章" : "Articles",
      url: `${baseUrl}/${locale}/articles`,
    },
    {
      name: isZh ? "何时就医指南" : "When to Seek Medical Care",
      url: `${baseUrl}/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
    },
  ];
}
