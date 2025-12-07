import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Locale } from "./types/common";
import PartnerHandbookClient from "./components/PartnerHandbookClient";
import {
  generateHowToStructuredData,
  HowToStructuredDataScript,
} from "@/lib/seo/howto-structured-data";

interface PartnerHandbookPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PartnerHandbookPageProps): Promise<Metadata> {
  const { locale } = await params;

  const metadata = {
    zh: {
      title: "伴侣沟通场景 - 痛经理解度测试与30天训练营 | Period Hub",
      description:
        "专业的伴侣沟通场景解决方案，包含理解度测试、30天训练营和个性化指导。帮助伴侣更好地理解痛经，提供针对性的沟通策略和情感支持技巧。",
      keywords:
        "伴侣沟通,痛经理解,伴侣支持,情感沟通,关系改善,痛经教育,伴侣训练营,理解度测试",
    },
    en: {
      title:
        "Partner Communication Scenario - Understanding Test & Training | Period Hub",
      description:
        "Professional partner communication scenario solutions with understanding test, 30-day training camp and personalized guidance. Help partners better understand period pain.",
      keywords:
        "partner communication,period pain understanding,partner support,emotional communication,relationship improvement,period education,partner training camp,understanding test",
    },
  };

  const currentMetadata = metadata[locale];

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    other: {
      "http-equiv": "content-language",
      content: locale === "zh" ? "zh-CN" : "en-US",
    },
    openGraph: {
      title: currentMetadata.title,
      description: currentMetadata.description,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "Period Hub",
    },
    twitter: {
      card: "summary_large_image",
      title: currentMetadata.title,
      description: currentMetadata.description,
    },
    alternates: {
      canonical: `/${locale}/scenario-solutions/partnerCommunication`,
      languages: {
        zh: "/zh/scenario-solutions/partnerCommunication",
        en: "/en/scenario-solutions/partnerCommunication",
      },
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function PartnerHandbookPage({
  params,
}: PartnerHandbookPageProps) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const isZh = locale === "zh";

  // 生成 HowTo 结构化数据
  const howToData = await generateHowToStructuredData({
    locale,
    scenarioSlug: "partnerCommunication",
    name: isZh
      ? "伴侣沟通与痛经理解指南"
      : "Partner Communication and Period Pain Understanding Guide",
    description: isZh
      ? "帮助伴侣理解痛经，建立有效沟通，提供情感支持的完整指南"
      : "Complete guide to help partners understand period pain, establish effective communication, and provide emotional support",
    steps: [
      {
        name: isZh ? "了解痛经基础知识" : "Understand Period Pain Basics",
        text: isZh
          ? "学习痛经的生理机制、常见症状和影响，建立科学认知"
          : "Learn physiological mechanisms, common symptoms and impacts of period pain, establish scientific understanding",
      },
      {
        name: isZh ? "建立开放沟通渠道" : "Establish Open Communication",
        text: isZh
          ? "创造安全的对话环境，学习倾听技巧，理解伴侣的真实感受"
          : "Create safe conversation environment, learn listening skills, understand partner's true feelings",
      },
      {
        name: isZh ? "提供情感支持" : "Provide Emotional Support",
        text: isZh
          ? "表达关心和理解，避免轻视或误解，给予心理安慰"
          : "Express care and understanding, avoid dismissing or misunderstanding, provide psychological comfort",
      },
      {
        name: isZh ? "协助实际帮助" : "Offer Practical Help",
        text: isZh
          ? "准备热敷工具、药物，协助日常事务，减轻伴侣负担"
          : "Prepare heat therapy tools, medications, assist with daily tasks, reduce partner's burden",
      },
      {
        name: isZh ? "共同应对挑战" : "Face Challenges Together",
        text: isZh
          ? "陪同就医，参与治疗决策，共同制定管理计划"
          : "Accompany medical visits, participate in treatment decisions, jointly create management plans",
      },
      {
        name: isZh ? "建立长期支持系统" : "Build Long-term Support System",
        text: isZh
          ? "持续学习和改进，建立稳定的支持模式，增进关系质量"
          : "Continuous learning and improvement, establish stable support pattern, enhance relationship quality",
      },
    ],
    tools: [
      { name: isZh ? "理解度测试" : "Understanding Test" },
      { name: isZh ? "30天训练营" : "30-Day Training Camp" },
      { name: isZh ? "沟通技巧指南" : "Communication Skills Guide" },
    ],
    supplies: [
      isZh ? "痛经知识手册" : "Period Pain Knowledge Handbook",
      isZh ? "沟通话术卡片" : "Communication Script Cards",
      isZh ? "应急支持清单" : "Emergency Support Checklist",
    ],
    totalTime: "PT30M",
  });

  return (
    <>
      <HowToStructuredDataScript data={howToData} />
      <PartnerHandbookClient locale={locale} />
    </>
  );
}
