import { generateMedicalWebPageSchema } from "@/lib/seo/medical-schema-generator";

export const getHomeStructuredData = async (
    t: (key: string) => string,
    v2HomeT: (key: string) => string,
    locale: string
) => {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

    // 生成 Organization 结构化数据
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${baseUrl}/${locale}#organization`,
        name: "PeriodHub",
        url: baseUrl,
        logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
        },
        description:
            (t("organization.description") as string) ||
            v2HomeT("metadata.structuredData.description"),
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["zh-CN", "en-US"],
        },
        sameAs: [
            "https://twitter.com/periodhub",
            "https://facebook.com/periodhub",
        ],
    };

    // 生成 SoftwareApplication 结构化数据（用于应用功能）
    const softwareApplicationData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/${locale}#application`,
        name: "PeriodHub",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        inLanguage: locale === "zh" ? "zh-CN" : "en-US",
        description: v2HomeT("metadata.structuredData.description"),
        url: `${baseUrl}/${locale}`,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            v2HomeT("metadata.structuredData.featureList.painTracking"),
            v2HomeT("metadata.structuredData.featureList.cyclePrediction"),
            v2HomeT("metadata.structuredData.featureList.symptomAssessment"),
            v2HomeT("metadata.structuredData.featureList.doctorReports"),
            v2HomeT("metadata.structuredData.featureList.scenarioSolutions"),
        ],
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250",
            bestRating: "5",
        },
    };

    // 生成WebSite结构化数据
    const webSiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}/${locale}#website`,
        url: baseUrl,
        name: "PeriodHub",
        description: t("organization.description"),
        inLanguage: locale === "zh" ? "zh-CN" : "en-US",
        publisher: {
            "@type": "Organization",
            "@id": `${baseUrl}/${locale}#organization`,
            name: "PeriodHub",
            url: baseUrl,
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.png`,
                width: 512,
                height: 512,
            },
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    // 生成FAQPage结构化数据
    const faqItems = [
        {
            question: t("faq.q1.question"),
            answer: t("faq.q1.answer"),
        },
        {
            question: t("faq.q2.question"),
            answer: t("faq.q2.answer"),
        },
        {
            question: t("faq.q3.question"),
            answer: t("faq.q3.answer"),
        },
    ]
        .filter(
            (item) =>
                item.question &&
                item.answer &&
                item.question.trim() &&
                item.answer.trim(),
        ) // 过滤空值
        .map((item) => ({
            "@type": "Question",
            name: item.question.trim(),
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer.trim(),
            },
        }));

    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${baseUrl}/${locale}#faq`,
        ...(faqItems.length > 0 && { mainEntity: faqItems }),
    };

    // 生成 MedicalWebPage Schema (GEO/AEO 合规性)
    const medicalWebPageData = generateMedicalWebPageSchema({
        title: v2HomeT("metadata.title"),
        description: v2HomeT("metadata.description"),
        condition: "DYSMENORRHEA",
        citations: [
            "ACOG_DYSMENORRHEA",
            "WHO_REPRODUCTIVE_HEALTH",
            "NIH_DYSMENORRHEA",
        ],
        locale: locale as "en" | "zh",
        url: `${baseUrl}/${locale}`,
        lastReviewed: new Date().toISOString().split("T")[0],
    });

    // 返回复合结构化数据（包含 Organization, SoftwareApplication, WebSite, FAQPage, MedicalWebPage）
    return [
        organizationData,
        softwareApplicationData,
        webSiteData,
        faqData,
        medicalWebPageData,
    ];
};
