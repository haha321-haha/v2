import { Metadata } from "next";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";
import WorkplaceImpactClient from "./WorkplaceImpactClient";

// 生成页面元数据（包含Canonical配置）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const { metadata } = generatePageSEO({
    locale: locale as "zh" | "en",
    path: "/interactive-tools/workplace-impact-assessment",
    title:
      locale === "zh"
        ? "工作影响评估 - 经期工作能力分析"
        : "Workplace Impact Assessment - Menstrual Work Capacity Analysis",
    description:
      locale === "zh"
        ? "专业的工作影响评估工具，分析经期对工作能力的影响，提供个性化的工作调整建议。"
        : "Professional workplace impact assessment tool analyzing menstrual effects on work capacity.",
    keywords: [
      "workplace impact",
      "menstrual health",
      "work capacity",
      "assessment tool",
    ],
    structuredDataType: "SoftwareApplication" as unknown as StructuredDataType,
    additionalStructuredData: {
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      featureList: [
        locale === "zh" ? "专业工具" : "Professional Tool",
        locale === "zh" ? "个性化建议" : "Personalized Recommendations",
        locale === "zh" ? "科学指导" : "Scientific Guidance",
      ],
    },
  });

  return metadata;
}

// 服务器组件 - 只负责SEO和元数据
export default function WorkplaceImpactAssessmentPage() {
  return <WorkplaceImpactClient />;
}
