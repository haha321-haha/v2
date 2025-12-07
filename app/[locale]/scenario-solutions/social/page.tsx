import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedToolCard from "@/app/[locale]/interactive-tools/components/RelatedToolCard";
import RelatedArticleCard from "@/app/[locale]/interactive-tools/components/RelatedArticleCard";
import ScenarioSolutionCard from "@/app/[locale]/interactive-tools/components/ScenarioSolutionCard";
import {
  generateHowToStructuredData,
  HowToStructuredDataScript,
} from "@/lib/seo/howto-structured-data";
import {
  Users,
  Heart,
  Wine,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Shield,
  MessageCircle,
  Copy,
  Quote,
} from "lucide-react";

// Types
type Locale = "en" | "zh";

interface Props {
  params: Promise<{ locale: Locale }>;
}

// 推荐数据配置函数
function getSocialRecommendations(locale: Locale) {
  const isZh = locale === "zh";

  return {
    relatedTools: [
      {
        id: "symptom-assessment",
        title: isZh ? "症状评估工具" : "Symptom Assessment",
        description: isZh
          ? "评估当前痛经状态，判断是否适合参加社交活动"
          : "Assess current period pain status and determine if suitable for social activities",
        href: `/${locale}/interactive-tools/symptom-assessment`,
        icon: "🔍",
        priority: "high",
        anchorTextType: "symptom_assessment",
      },
      {
        id: "pain-tracker",
        title: isZh ? "痛经追踪器" : "Pain Tracker",
        description: isZh
          ? "记录社交活动中的疼痛模式，优化未来社交安排"
          : "Track pain patterns during social activities, optimize future social schedules",
        href: `/${locale}/interactive-tools/pain-tracker`,
        icon: "📊",
        priority: "high",
        anchorTextType: "pain_tracker",
      },
      {
        id: "period-pain-impact-calculator",
        title: isZh ? "痛经影响计算器" : "Pain Impact Calculator",
        description: isZh
          ? "评估痛经对社交能力的影响，制定社交应对计划"
          : "Assess period pain impact on social capacity, create social response plans",
        href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
        icon: "🧮",
        priority: "high",
        anchorTextType: "calculator",
      },
    ],
    relatedArticles: [
      {
        id: "comprehensive-medical-guide-to-dysmenorrhea",
        title: isZh ? "痛经医疗综合指南" : "Medical Guide to Dysmenorrhea",
        description: isZh
          ? "深入了解痛经成因与社交场合的应对策略，科学管理"
          : "Understand dysmenorrhea causes and social coping strategies, scientific management",
        href: `/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`,
        readTime: isZh ? "18分钟阅读" : "18 min read",
        category: isZh ? "医疗指南" : "Medical Guide",
        priority: "high",
        icon: "📋",
        anchorTextType: "medical_guide",
      },
      {
        id: "when-to-seek-medical-care-comprehensive-guide",
        title: isZh ? "何时就医完整指南" : "When to Seek Medical Care",
        description: isZh
          ? "识别社交场合中需要就医的痛经警示信号，紧急应对"
          : "Identify warning signs in social settings requiring medical care, emergency response",
        href: `/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
        readTime: isZh ? "15分钟阅读" : "15 min read",
        category: isZh ? "医疗指导" : "Medical Care",
        priority: "high",
        icon: "🏥",
        anchorTextType: "medical",
      },
      {
        id: "medication-guide",
        title: isZh ? "痛经用药指南" : "Medication Guide for Period Pain",
        description: isZh
          ? "社交场合的安全用药指南，快速缓解不适保持社交状态"
          : "Safe medication guide in social settings, fast relief while maintaining social presence",
        href: `/${locale}/downloads/medication-guide`,
        readTime: isZh ? "12分钟阅读" : "12 min read",
        category: isZh ? "用药指导" : "Medication",
        priority: "medium",
        icon: "💊",
        anchorTextType: "medication",
      },
    ],
    scenarioSolutions: [
      {
        id: "partnerCommunication",
        title: isZh ? "伴侣沟通指南" : "Partner Communication Guide",
        description: isZh
          ? "帮助伴侣理解经期不适，建立有效沟通和支持体系"
          : "Help partners understand period discomfort, establish effective communication and support system",
        href: `/${locale}/scenario-solutions/partnerCommunication`,
        icon: "💕",
        priority: "high",
        anchorTextType: "partner_communication",
      },
      {
        id: "office",
        title: isZh
          ? "办公环境健康管理"
          : "Office Environment Health Management",
        description: isZh
          ? "社交活动后返回办公环境的经期健康管理策略"
          : "Menstrual health management strategies after social activities returning to office",
        href: `/${locale}/scenario-solutions/office`,
        icon: "💼",
        priority: "high",
        anchorTextType: "office",
      },
      {
        id: "emergency-kit",
        title: isZh ? "痛经应急包指南" : "Period Pain Emergency Kit Guide",
        description: isZh
          ? "社交场合突发疼痛的应急处理和装备准备"
          : "Emergency response and equipment preparation for sudden pain in social settings",
        href: `/${locale}/scenario-solutions/emergency-kit`,
        icon: "🚨",
        priority: "medium",
        anchorTextType: "emergency",
      },
    ],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "scenarioSolutionsPage",
  });

  return {
    title: `${t("scenarios.social.title")} - ${t("title")}`,
    description: t("scenarios.social.description"),
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/scenario-solutions/social`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/scenario-solutions/social`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/scenario-solutions/social`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/scenario-solutions/social`,
      },
    },
  };
}

export default async function SocialScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations("scenarioSolutionsPage");

  // 预加载面包屑所需的翻译
  const breadcrumbTitle = t("title");
  const breadcrumbSocialTitle = t("scenarios.social.title");

  // 获取推荐数据
  const recommendations = getSocialRecommendations(locale);
  const isZh = locale === "zh";

  // 生成 HowTo 结构化数据
  const howToData = await generateHowToStructuredData({
    locale,
    scenarioSlug: "social",
    name: isZh
      ? "社交场合痛经管理指南"
      : "Social Setting Period Pain Management Guide",
    description: isZh
      ? "社交场合的痛经管理方法，包含便携准备和应急应对"
      : "Period pain management in social settings, including portable preparation and emergency response",
    steps: [
      {
        name: isZh ? "准备便携应急包" : "Prepare Portable Emergency Kit",
        text: isZh
          ? "准备小巧精致的应急包，方便随身携带"
          : "Prepare compact elegant emergency kit for easy carrying",
      },
      {
        name: isZh ? "选择合适的着装" : "Choose Appropriate Attire",
        text: isZh
          ? "选择舒适且不紧身的服装"
          : "Choose comfortable and non-restrictive clothing",
      },
      {
        name: isZh ? "提前规划行程" : "Plan Schedule in Advance",
        text: isZh
          ? "了解活动时长和场地设施"
          : "Know activity duration and venue facilities",
      },
      {
        name: isZh ? "了解场地设施" : "Know Venue Facilities",
        text: isZh
          ? "提前了解洗手间和休息区位置"
          : "Know restroom and rest area locations in advance",
      },
      {
        name: isZh ? "准备应急说辞" : "Prepare Emergency Excuses",
        text: isZh
          ? "准备得体的理由，必要时可以提前离开"
          : "Prepare appropriate reasons to leave early if necessary",
      },
      {
        name: isZh ? "保持轻松心态" : "Maintain Relaxed Mindset",
        text: isZh
          ? "不要过度紧张，适当休息和调整"
          : "Don't be overly nervous, rest and adjust appropriately",
      },
    ],
    tools: [
      { name: isZh ? "便携包" : "Portable Bag" },
      { name: isZh ? "手机" : "Mobile Phone" },
    ],
    supplies: [
      isZh ? "卫生用品" : "Hygiene Products",
      isZh ? "止痛药" : "Pain Medication",
      isZh ? "湿巾" : "Wet Wipes",
    ],
    totalTime: "PT15M",
  });

  const dateStrategies = [
    {
      phase: locale === "zh" ? "约会前准备" : "Pre-Date Preparation",
      icon: <Clock className="w-5 h-5" />,
      strategies: [
        locale === "zh"
          ? "提前3天开始记录经期症状"
          : "Start tracking period symptoms 3 days in advance",
        locale === "zh"
          ? "准备小巧应急包：止痛药、卫生用品、湿巾"
          : "Prepare compact emergency kit: pain meds, sanitary products, wipes",
        locale === "zh"
          ? "选择深色服装，准备外套遮挡"
          : "Choose dark clothing, prepare jacket for coverage",
        locale === "zh"
          ? "提前查询约会地点附近的卫生间位置"
          : "Research restroom locations near date venue",
      ],
    },
    {
      phase: locale === "zh" ? "约会中应对" : "During Date Management",
      icon: <Heart className="w-5 h-5" />,
      strategies: [
        locale === "zh"
          ? '借口策略："需要补妆"、"接个重要电话"'
          : 'Excuse strategies: "Need to touch up makeup", "Important call"',
        locale === "zh"
          ? "选择座位时考虑快速离开的便利性"
          : "Choose seating considering quick exit convenience",
        locale === "zh"
          ? "控制饮水量，避免频繁如厕引起注意"
          : "Control water intake, avoid frequent bathroom trips",
        locale === "zh"
          ? "选择舒适的活动：看电影、吃饭、散步"
          : "Choose comfortable activities: movies, dining, walking",
      ],
    },
    {
      phase: locale === "zh" ? "突发状况处理" : "Emergency Situation Handling",
      icon: <AlertTriangle className="w-5 h-5" />,
      strategies: [
        locale === "zh"
          ? "轻度不适：深呼吸，适当表达需要短暂休息"
          : "Mild discomfort: deep breathing, express need for brief rest",
        locale === "zh"
          ? "剧烈痛经：诚实说明身体不适，提议改期"
          : "Severe cramps: honestly explain discomfort, suggest rescheduling",
        locale === "zh"
          ? "情绪波动：通过调整呼吸节奏缓解"
          : "Mood swings: relieve through breathing rhythm adjustment",
        locale === "zh"
          ? '应急离场：启动"过敏预案"或"突发工作"'
          : 'Emergency exit: activate "allergy plan" or "urgent work"',
      ],
    },
  ];

  const partyFoodGuide = {
    recommended: [
      {
        category: locale === "zh" ? "主食选择" : "Main Food Choices",
        items: [
          locale === "zh"
            ? "烤鸡胸肉（富含蛋白质和铁）"
            : "Grilled chicken breast (rich in protein and iron)",
          locale === "zh"
            ? "烤三文鱼（抗炎omega-3）"
            : "Grilled salmon (anti-inflammatory omega-3)",
          locale === "zh"
            ? "蔬菜沙拉（补充维生素）"
            : "Vegetable salad (vitamin supplement)",
          locale === "zh"
            ? "全麦面包（复合碳水化合物）"
            : "Whole grain bread (complex carbohydrates)",
        ],
      },
      {
        category: locale === "zh" ? "饮品选择" : "Beverage Choices",
        items: [
          locale === "zh"
            ? "热苹果醋苏打水（缓解胀气）"
            : "Hot apple cider vinegar soda (relieves bloating)",
          locale === "zh"
            ? "紫薯姜奶（暖宫饮品）"
            : "Purple sweet potato ginger milk (warming drink)",
          locale === "zh"
            ? "无糖茶类（抗氧化）"
            : "Sugar-free teas (antioxidant)",
          locale === "zh"
            ? "温开水（保持水分）"
            : "Warm water (maintain hydration)",
        ],
      },
    ],
    avoid: [
      {
        category: locale === "zh" ? "高风险食物" : "High-Risk Foods",
        items: [
          locale === "zh"
            ? "冰淇淋、冷饮（导致子宫收缩）"
            : "Ice cream, cold drinks (cause uterine contractions)",
          locale === "zh"
            ? "薯片、炸鸡（高盐高脂）"
            : "Chips, fried chicken (high salt, high fat)",
          locale === "zh"
            ? "奶油蛋糕（高糖导致血糖波动）"
            : "Cream cake (high sugar causes blood sugar fluctuations)",
          locale === "zh"
            ? "辛辣食物（刺激肠胃）"
            : "Spicy foods (irritate digestive system)",
        ],
      },
      {
        category: locale === "zh" ? "酒精管理" : "Alcohol Management",
        items: [
          locale === "zh"
            ? "烈酒（加重痛经症状）"
            : "Hard liquor (worsens menstrual symptoms)",
          locale === "zh"
            ? "大量酒精（影响经血流量）"
            : "Large amounts of alcohol (affects menstrual flow)",
          locale === "zh"
            ? "空腹饮酒（加重身体负担）"
            : "Drinking on empty stomach (increases body burden)",
          locale === "zh"
            ? "含咖啡因鸡尾酒（刺激神经）"
            : "Caffeinated cocktails (stimulate nerves)",
        ],
      },
    ],
  };

  const alcoholStrategies = [
    {
      strategy:
        locale === "zh" ? "医学级拒酒话术" : "Medical-Grade Alcohol Refusal",
      excuse:
        locale === "zh"
          ? '"正在服用抗生素，不能饮酒"'
          : '"Taking antibiotics, cannot drink alcohol"',
      effectiveness: "95%",
    },
    {
      strategy:
        locale === "zh"
          ? "无醇起泡酒伪装术"
          : "Non-Alcoholic Sparkling Wine Disguise",
      excuse:
        locale === "zh"
          ? "提前与服务员密约，用无醇饮品替代"
          : "Pre-arrange with server to substitute non-alcoholic drinks",
      effectiveness: "90%",
    },
    {
      strategy:
        locale === "zh" ? "驾驶责任借口" : "Driving Responsibility Excuse",
      excuse:
        locale === "zh"
          ? '"今晚我是指定司机"'
          : '"I\'m the designated driver tonight"',
      effectiveness: "85%",
    },
    {
      strategy: locale === "zh" ? "健康生活方式" : "Healthy Lifestyle",
      excuse:
        locale === "zh"
          ? '"最近在调理身体，暂时戒酒"'
          : '"Recently focusing on health, temporarily abstaining from alcohol"',
      effectiveness: "80%",
    },
  ];

  // 社交沟通模板
  const socialCommunicationTemplates = [
    {
      scenario: locale === "zh" ? "与伴侣沟通" : "Communicating with Partner",
      icon: "💕",
      userQuote:
        locale === "zh"
          ? '"本来约了喜欢的人吃饭，结果痛得完全没心情，只能推掉，感觉错失机会……"'
          : '"I had a dinner date with someone I like, but the pain made me completely lose interest, so I had to cancel. I feel like I missed an opportunity..."',
      templates: [
        {
          situation: locale === "zh" ? "约会改期" : "Rescheduling Date",
          tone: locale === "zh" ? "温柔" : "Gentle",
          template:
            locale === "zh"
              ? '"不好意思，我今天身体有些不舒服，可能没法保持最佳状态。我们能改到下次吗？我真的很期待和你见面。"'
              : "\"Sorry, I'm not feeling well today and might not be at my best. Can we reschedule? I'm really looking forward to seeing you.\"",
          copyText: locale === "zh" ? "复制文本" : "Copy Text",
        },
        {
          situation: locale === "zh" ? "寻求支持" : "Seeking Support",
          tone: locale === "zh" ? "亲密" : "Intimate",
          template:
            locale === "zh"
              ? '"我现在有些疼痛，可能情绪会有些波动。你能理解并给我一些温暖的陪伴吗？"'
              : '"I\'m experiencing some pain and my emotions might fluctuate. Can you understand and give me some warm companionship?"',
          copyText: locale === "zh" ? "复制文本" : "Copy Text",
        },
      ],
    },
    {
      scenario: locale === "zh" ? "与朋友沟通" : "Communicating with Friends",
      icon: "👭",
      userQuote:
        locale === "zh"
          ? '"参加朋友聚会担心突然肚子痛，又不能像在家一样随便躺，很纠结要不要去。"'
          : "\"I'm worried about sudden stomach pain at a friend's party, and I can't just lie down like at home. I'm torn about whether to go.\"",
      templates: [
        {
          situation: locale === "zh" ? "聚会参与" : "Party Participation",
          tone: locale === "zh" ? "随意" : "Casual",
          template:
            locale === "zh"
              ? '"我可能会来聚会，但可能需要早点离开或者中途休息一下。如果我看起来有点累，你们理解就好。"'
              : '"I might come to the party but may need to leave early or take breaks. If I look tired, please understand."',
          copyText: locale === "zh" ? "复制文本" : "Copy Text",
        },
        {
          situation: locale === "zh" ? "寻求支持" : "Seeking Support",
          tone: locale === "zh" ? "随意" : "Casual",
          template:
            locale === "zh"
              ? '"姐妹，我现在经期痛得厉害，你有什么好的缓解方法吗？或者就是陪我聊聊天也好。"'
              : '"Girl, I\'m having severe period pain right now. Do you have any good relief methods? Or just chat with me would be nice."',
          copyText: locale === "zh" ? "复制文本" : "Copy Text",
        },
      ],
    },
    {
      scenario: locale === "zh" ? "会议参与" : "Meeting Participation",
      icon: "🤝",
      userQuote:
        locale === "zh"
          ? '"我可能需要会议中途离开一下，但又不想让大家觉得我不专业……"'
          : "\"I might need to leave the meeting briefly, but I don't want everyone to think I'm unprofessional...\"",
      templates: [
        {
          situation: locale === "zh" ? "会议参与" : "Meeting Participation",
          tone: locale === "zh" ? "正式" : "Formal",
          template:
            locale === "zh"
              ? '"我可能需要会议中途离开一下处理紧急事务，如果有重要内容请帮我记录，谢谢大家的理解。"'
              : '"I might need to step out briefly to handle urgent matters. If there\'s important content, please help me take notes. Thank you for your understanding."',
          copyText: locale === "zh" ? "复制文本" : "Copy Text",
        },
        {
          situation: locale === "zh" ? "寻求支持" : "Seeking Support",
          tone: locale === "zh" ? "正式" : "Formal",
          template:
            locale === "zh"
              ? '"我今天身体有些不适，可能会影响我的参与度。如果有需要我重点关注的内容，请提醒我。"'
              : "\"I'm feeling unwell today and it might affect my participation. If there's content I need to focus on, please remind me.\"",
          copyText: locale === "zh" ? "复制文本" : "Copy Text",
        },
      ],
    },
  ];

  return (
    <>
      <HowToStructuredDataScript data={howToData} />
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12"
        data-page="scenario-social"
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: breadcrumbTitle, href: `/${locale}/scenario-solutions` },
            { label: breadcrumbSocialTitle },
          ]}
        />

        {/* Page Header */}
        <header className="text-center">
          <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            {t("scenarios.social.title")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            {t("scenarios.social.description")}
          </p>
        </header>

        {/* Date Strategies Section */}
        <section className="bg-gradient-to-br from-pink-50 to-neutral-50 p-6 md:p-8 rounded-xl">
          <div className="flex items-center mb-6">
            <Heart className="w-6 h-6 text-pink-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh" ? "约会应急策略" : "Date Emergency Strategies"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {dateStrategies.map((phase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mr-3">
                    {phase.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {phase.phase}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {phase.strategies.map((strategy, strategyIndex) => (
                    <li key={strategyIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">
                        {strategy}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Party Food Guide Section */}
        <section>
          <div className="flex items-center mb-6">
            <Wine className="w-6 h-6 text-pink-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "聚会饮食智能选择"
                : "Smart Party Food Choices"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                {locale === "zh" ? "推荐选择" : "Recommended Choices"}
              </h3>
              {partyFoodGuide.recommended.map((category, index) => (
                <div key={index} className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3">
                    {category.category}
                  </h4>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start text-sm text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                {locale === "zh" ? "避免选择" : "Avoid These Choices"}
              </h3>
              {partyFoodGuide.avoid.map((category, index) => (
                <div key={index} className="bg-red-50 p-6 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-3">
                    {category.category}
                  </h4>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start text-sm text-red-700"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alcohol Management Section */}
        <section>
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-pink-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh" ? "酒精应对手册" : "Alcohol Management Handbook"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {alcoholStrategies.map((strategy, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {strategy.strategy}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {locale === "zh" ? "成功率" : "Success Rate"}{" "}
                    {strategy.effectiveness}
                  </span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium mb-2">
                    {locale === "zh" ? "话术示例：" : "Script Example:"}
                  </p>
                  <p className="text-blue-700 italic">
                    &ldquo;{strategy.excuse}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Communication Templates Section */}
        <section>
          <div className="flex items-center mb-6">
            <MessageCircle className="w-6 h-6 text-pink-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "社交沟通助手"
                : "Social Communication Assistant"}
            </h2>
          </div>
          <p className="text-neutral-600 mb-8">
            {locale === "zh"
              ? "经期不适时，如何与不同的人进行有效沟通，获得理解和支持。"
              : "How to communicate effectively with different people during menstrual discomfort to gain understanding and support."}
          </p>

          <div className="space-y-8">
            {socialCommunicationTemplates.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-pink-50 to-neutral-50 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h3 className="text-xl font-semibold text-neutral-800">
                    {category.scenario}
                  </h3>
                </div>

                {/* User Quote */}
                <div className="bg-white p-4 rounded-lg mb-6 border-l-4 border-pink-300">
                  <div className="flex items-start">
                    <Quote className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-neutral-700 italic text-sm leading-relaxed">
                      {category.userQuote}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {locale === "zh"
                      ? "—— 来自用户语录"
                      : "—— From user testimonials"}
                  </p>
                </div>

                <div className="grid md:grid-cols-1 gap-4">
                  {category.templates.map((template, templateIndex) => (
                    <div
                      key={templateIndex}
                      className="bg-white p-6 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-neutral-800">
                          {template.situation}
                        </h4>
                        <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded-full">
                          {template.tone}
                        </span>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg mb-4">
                        <p className="text-pink-800 leading-relaxed">
                          {template.template}
                        </p>
                      </div>

                      <div className="inline-flex items-center text-pink-600 text-sm font-medium">
                        <Copy className="w-4 h-4 mr-1" />
                        <span className="text-xs text-neutral-500">
                          {locale === "zh" ? "可复制使用" : "Copy to use"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {locale === "zh" ? "使用提示" : "Usage Tips"}
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>
                •{" "}
                {locale === "zh"
                  ? "根据关系亲密度选择合适的沟通方式"
                  : "Choose appropriate communication style based on relationship intimacy"}
              </li>
              <li>
                •{" "}
                {locale === "zh"
                  ? "诚实表达需求，但无需过度解释"
                  : "Express needs honestly without over-explaining"}
              </li>
              <li>
                •{" "}
                {locale === "zh"
                  ? "提前准备话术，避免临时紧张"
                  : "Prepare scripts in advance to avoid last-minute nervousness"}
              </li>
            </ul>
          </div>
        </section>

        {/* 相关推荐区域 */}
        <section className="bg-gradient-to-br from-pink-50 to-blue-50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-12">
              {/* 相关工具区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {isZh ? "相关工具" : "Related Tools"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.relatedTools.map((tool) => (
                    <RelatedToolCard
                      key={tool.id}
                      tool={tool}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>

              {/* 相关文章区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {isZh ? "相关文章" : "Related Articles"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.relatedArticles.map((article) => (
                    <RelatedArticleCard
                      key={article.id}
                      article={article}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>

              {/* 场景解决方案区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {isZh ? "场景解决方案" : "Scenario Solutions"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.scenarioSolutions.map((solution) => (
                    <ScenarioSolutionCard
                      key={solution.id}
                      solution={solution}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* Back to Overview */}
        <div className="text-center">
          <Link
            href={`/${locale}/scenario-solutions`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("scenarios.social.backToOverview")}
          </Link>
        </div>

        {/* Medical Disclaimer */}
        <section className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mt-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">
                {t("scenarios.social.disclaimer.title")}
              </h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                {t("scenarios.social.disclaimer.content")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
