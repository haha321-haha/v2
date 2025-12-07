import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedToolCard from "@/app/[locale]/interactive-tools/components/RelatedToolCard";
import RelatedArticleCard from "@/app/[locale]/interactive-tools/components/RelatedArticleCard";
import ScenarioSolutionCard from "@/app/[locale]/interactive-tools/components/ScenarioSolutionCard";
import {
  Briefcase,
  Clock,
  Coffee,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Utensils,
  Dumbbell,
  MessageCircle,
  Hand,
  Copy,
} from "lucide-react";
import { safeStringify } from "@/lib/utils/json-serialization";

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

  const isZh = locale === "zh";
  const ogImage = isZh
    ? "/images/workplace-wellness-og-zh.jpg"
    : "/images/workplace-wellness-og-en.jpg";

  return {
    title: `${t("scenarios.office.title")} - ${t("title")}`,
    description: t("scenarios.office.description"),
    other: {
      "fb:app_id":
        process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1234567890123456",
    },
    openGraph: {
      title: `${t("scenarios.office.title")} - ${t("title")}`,
      description: t("scenarios.office.description"),
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/scenario-solutions/office`,
      siteName: "PeriodHub",
      locale: isZh ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: t("scenarios.office.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("scenarios.office.title")} - ${t("title")}`,
      description: t("scenarios.office.description"),
      images: [ogImage],
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/scenario-solutions/office`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/scenario-solutions/office`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/scenario-solutions/office`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/scenario-solutions/office`,
      },
    },
  };
}

export default async function OfficeScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations("scenarioSolutionsPage");

  // 推荐数据配置函数
  function getOfficeRecommendations(locale: Locale) {
    const isZh = locale === "zh";

    return {
      relatedTools: [
        {
          id: "pain-tracker",
          title: isZh ? "痛经追踪器" : "Pain Tracker",
          description: isZh
            ? "记录疼痛模式，分析职场环境下的症状变化趋势"
            : "Record pain patterns and analyze symptom trends in workplace",
          href: `/${locale}/interactive-tools/pain-tracker`,
          icon: "📊",
          priority: "high",
          anchorTextType: "tracker",
        },
        {
          id: "workplace-wellness",
          title: isZh ? "职场健康管理" : "Workplace Wellness",
          description: isZh
            ? "专业职场环境健康管理策略和压力缓解方案"
            : "Professional workplace health management strategies and stress relief solutions",
          href: `/${locale}/interactive-tools/workplace-wellness`,
          icon: "💼",
          priority: "high",
          anchorTextType: "workplace",
        },
        {
          id: "symptom-assessment",
          title: isZh ? "症状评估工具" : "Symptom Assessment",
          description: isZh
            ? "评估痛经严重程度，获得个性化职场适应建议"
            : "Assess period pain severity and get personalized workplace adaptation advice",
          href: `/${locale}/interactive-tools/symptom-assessment`,
          icon: "🔍",
          priority: "high",
          anchorTextType: "assessment",
        },
      ],
      relatedArticles: [
        {
          id: "menstrual-stress-management-complete-guide",
          title: isZh
            ? "经期压力管理完全指南"
            : "Complete Guide to Menstrual Stress Management",
          description: isZh
            ? "基于循证医学研究的经期压力管理指南，为职场女性提供科学的压力缓解策略"
            : "Evidence-based menstrual stress management guide providing scientific stress relief strategies for working women",
          href: `/${locale}/articles/menstrual-stress-management-complete-guide`,
          readTime: isZh ? "15分钟阅读" : "15 min read",
          category: isZh ? "压力管理" : "Stress Management",
          priority: "high",
          icon: "💼",
          anchorTextType: "workplace",
        },
        {
          id: "menstrual-sleep-quality-improvement-guide",
          title: isZh
            ? "经期睡眠质量改善指南"
            : "Menstrual Sleep Quality Improvement Guide",
          description: isZh
            ? "全面的经期睡眠质量改善指南，涵盖睡眠问题识别、环境优化和习惯建立"
            : "Comprehensive menstrual sleep quality improvement guide covering sleep problem identification, environment optimization and habit building",
          href: `/${locale}/articles/menstrual-sleep-quality-improvement-guide`,
          readTime: isZh ? "12分钟阅读" : "12 min read",
          category: isZh ? "睡眠管理" : "Sleep Management",
          priority: "high",
          icon: "🏥",
          anchorTextType: "pain_management",
        },
        {
          id: "anti-inflammatory-diet-period-pain",
          title: isZh
            ? "抗炎饮食缓解痛经指南"
            : "Anti-Inflammatory Diet for Period Pain Relief",
          description: isZh
            ? "通过抗炎饮食缓解经期疼痛，改善经期整体健康的科学指导"
            : "Scientific guidance on reducing period pain and improving overall menstrual health through anti-inflammatory diet",
          href: `/${locale}/articles/anti-inflammatory-diet-period-pain`,
          readTime: isZh ? "10分钟阅读" : "10 min read",
          category: isZh ? "营养调理" : "Nutrition",
          priority: "medium",
          icon: "🥗",
          anchorTextType: "nutrition",
        },
      ],
      scenarioSolutions: [
        {
          id: "emergency-kit",
          title: isZh ? "痛经应急包指南" : "Emergency Kit Guide",
          description: isZh
            ? "疼痛发作时的快速缓解方法和应急处理"
            : "Quick relief methods and emergency treatment when pain occurs",
          href: `/${locale}/scenario-solutions/emergency-kit`,
          icon: "🚨",
          priority: "high",
          anchorTextType: "emergency",
        },
        {
          id: "commute",
          title: isZh ? "通勤场景" : "Commute Scenario",
          description: isZh
            ? "通勤途中经期疼痛应急处理指南"
            : "Emergency period pain management guide for commuting",
          href: `/${locale}/scenario-solutions/commute`,
          icon: "🚗",
          priority: "medium",
          anchorTextType: "commute",
        },
      ],
    };
  }

  // 获取推荐数据
  const recommendations = getOfficeRecommendations(locale);
  const isZh = locale === "zh";

  const emergencyKitItems = [
    {
      category: t("scenarios.office.emergencyKit.categories.core"),
      items:
        locale === "zh"
          ? [
              "可粘贴暖宝宝（ThermaCare隐形贴片）",
              "迷你电热护腰（USB充电款）",
              "姜茶冲剂条（无糖配方）",
              "应急能量胶（含镁+维生素B6）",
            ]
          : [
              "Adhesive heat patches (ThermaCare invisible patches)",
              "Mini electric heating pad (USB rechargeable)",
              "Ginger tea sachets (sugar-free formula)",
              "Emergency energy gel (with magnesium + vitamin B6)",
            ],
    },
    {
      category: t("scenarios.office.emergencyKit.categories.painRelief"),
      items:
        locale === "zh"
          ? ["布洛芬/对乙酰氨基酚", "薄荷膏（太阳穴按摩用）", "简易按摩工具"]
          : [
              "Ibuprofen/Acetaminophen",
              "Peppermint balm (for temple massage)",
              "Simple massage tools",
            ],
    },
    {
      category: t("scenarios.office.emergencyKit.categories.imageManagement"),
      items:
        locale === "zh"
          ? ["镜子、唇膏、吸油纸", "干发喷雾、除臭剂", "应急化妆品"]
          : [
              "Mirror, lipstick, oil blotting paper",
              "Dry shampoo, deodorant",
              "Emergency makeup",
            ],
    },
  ];

  const stretchExercises =
    locale === "zh"
      ? [
          {
            name: "座椅骨盆时钟运动",
            description: "缓解骶髂关节压力，改善下背部血液循环",
            duration: "每次30秒，重复3-5次",
            steps: [
              "坐在椅子边缘，双脚平放地面",
              "想象骨盆是时钟，缓慢画圆",
              "顺时针和逆时针各做一组",
            ],
          },
          {
            name: "隐藏式足底按摩",
            description: "利用桌下筋膜球，促进下肢血液回流",
            duration: "随时进行，每次2-3分钟",
            steps: [
              "在桌下放置小型按摩球",
              "脱掉鞋子，用脚底滚动按摩球",
              "重点按压足弓和脚跟部位",
            ],
          },
          {
            name: "饮水机旁侧腰拉伸",
            description: "自然站立姿势，缓解腰部紧张",
            duration: "每侧保持15-30秒",
            steps: [
              "站在饮水机旁，双脚与肩同宽",
              "一手扶腰，另一手向上伸展",
              "身体向一侧弯曲，感受侧腰拉伸",
            ],
          },
        ]
      : [
          {
            name: "Chair Pelvic Clock Movement",
            description:
              "Relieves sacroiliac joint pressure, improves lower back circulation",
            duration: "30 seconds each, repeat 3-5 times",
            steps: [
              "Sit on edge of chair, feet flat on floor",
              "Imagine pelvis as clock, slowly draw circles",
              "Do one set clockwise and counterclockwise",
            ],
          },
          {
            name: "Hidden Foot Massage",
            description:
              "Use under-desk fascia ball to promote lower limb blood return",
            duration: "Anytime, 2-3 minutes each",
            steps: [
              "Place small massage ball under desk",
              "Remove shoes, roll ball with sole of foot",
              "Focus on arch and heel areas",
            ],
          },
          {
            name: "Side Waist Stretch by Water Cooler",
            description: "Natural standing position, relieves waist tension",
            duration: "Hold 15-30 seconds each side",
            steps: [
              "Stand by water cooler, feet shoulder-width apart",
              "One hand on waist, other arm stretch up",
              "Bend body to one side, feel side waist stretch",
            ],
          },
        ];

  const nutritionPlan =
    locale === "zh"
      ? [
          {
            time: "早餐 (7:00-8:00)",
            foods: "燕麦粥+坚果+香蕉",
            benefits: "提供持续能量，稳定血糖",
          },
          {
            time: "上午茶 (10:00)",
            foods: "黑巧克力或玫瑰花茶",
            benefits: "温暖子宫，缓解痉挛",
          },
          {
            time: "午餐 (12:00-13:00)",
            foods: "瘦肉+深绿色蔬菜+糙米",
            benefits: "补铁补纤维，预防贫血",
          },
          {
            time: "下午茶 (15:00)",
            foods: "黑巧克力+温牛奶",
            benefits: "缓解情绪波动，补充镁元素",
          },
        ]
      : [
          {
            time: "Breakfast (7:00-8:00)",
            foods: "Oatmeal + nuts + banana",
            benefits: "Provides sustained energy, stabilizes blood sugar",
          },
          {
            time: "Morning Tea (10:00)",
            foods: "Red date tea or rose tea",
            benefits: "Warms uterus, relieves cramps",
          },
          {
            time: "Lunch (12:00-13:00)",
            foods: "Lean meat + dark green vegetables + brown rice",
            benefits: "Iron and fiber supplement, prevents anemia",
          },
          {
            time: "Afternoon Tea (15:00)",
            foods: "Dark chocolate + warm milk",
            benefits: "Relieves mood swings, supplements magnesium",
          },
        ];

  // 沟通模板数据
  const communicationTemplates =
    locale === "zh"
      ? [
          {
            scenario: "与伴侣沟通",
            icon: "💕",
            templates: [
              {
                situation: "通知告知",
                tone: "亲密",
                template:
                  '"亲爱的，我今天身体不太舒服，可能需要多休息一下。如果我看起来有点不舒服，请不要担心。"',
                copyText: "复制文本",
              },
              {
                situation: "寻求理解",
                tone: "亲密",
                template:
                  '"我现在有些疼痛，可能情绪会有些波动。你能理解并给我一些时间和空间吗？我会尽快恢复的。"',
                copyText: "复制文本",
              },
            ],
          },
          {
            scenario: "与朋友沟通",
            icon: "👭",
            templates: [
              {
                situation: "约会改期",
                tone: "随意",
                template:
                  '"不好意思，我今天身体有点不太舒服，可能没法保持最佳状态。我们能改到下次吗？我会补偿你的！"',
                copyText: "复制文本",
              },
              {
                situation: "聚会参与",
                tone: "随意",
                template:
                  '"我可能会来聚会，但可能需要早点离开。如果我看起来有点累，你们理解就好。"',
                copyText: "复制文本",
              },
            ],
          },
          {
            scenario: "与同事沟通",
            icon: "👔",
            templates: [
              {
                situation: "请假申请",
                tone: "正式",
                template:
                  '"您好，我今天身体不太舒服，可能需要请半天假去处理身体问题。我会尽快处理完其他事务的。"',
                copyText: "复制文本",
              },
              {
                situation: "工作调整",
                tone: "正式",
                template:
                  '"不好意思，我今天身体有些不适，可能工作效率会有所影响。如果有急事请优先安排，其他事务我会尽快完成。"',
                copyText: "复制文本",
              },
            ],
          },
        ]
      : [
          {
            scenario: "Communicating with Partner",
            icon: "💕",
            templates: [
              {
                situation: "Notification",
                tone: "Intimate",
                template:
                  "\"Honey, I'm not feeling well today and might need more rest. If I seem uncomfortable, please don't worry.\"",
                copyText: "Copy Text",
              },
              {
                situation: "Seeking Understanding",
                tone: "Intimate",
                template:
                  "\"I'm experiencing some pain and my emotions might fluctuate. Can you understand and give me some time and space? I'll recover soon.\"",
                copyText: "Copy Text",
              },
            ],
          },
          {
            scenario: "Communicating with Friends",
            icon: "👭",
            templates: [
              {
                situation: "Rescheduling Date",
                tone: "Casual",
                template:
                  "\"Sorry, I'm not feeling well today and might not be at my best. Can we reschedule? I'll make it up to you!\"",
                copyText: "Copy Text",
              },
              {
                situation: "Party Participation",
                tone: "Casual",
                template:
                  '"I might come to the party but may need to leave early. If I look tired, please understand."',
                copyText: "Copy Text",
              },
            ],
          },
          {
            scenario: "Communicating with Colleagues",
            icon: "👔",
            templates: [
              {
                situation: "Leave Request",
                tone: "Formal",
                template:
                  "\"Hello, I'm not feeling well today and may need to take half a day off to address health issues. I'll handle other matters as soon as possible.\"",
                copyText: "Copy Text",
              },
              {
                situation: "Work Adjustment",
                tone: "Formal",
                template:
                  "\"Sorry, I'm feeling unwell today and my work efficiency might be affected. Please prioritize urgent matters, and I'll complete other tasks as soon as possible.\"",
                copyText: "Copy Text",
              },
            ],
          },
        ];

  // 穴位按压技巧
  const acupressurePoints =
    locale === "zh"
      ? [
          {
            name: "合谷穴",
            location: "虎口处，拇指和食指之间",
            benefits: "疏肝理气、活血化瘀，缓解全身疼痛",
            technique: "用拇指指腹按压，力度适中，每次30秒",
            officeUse: "可在开会时隐蔽进行，不引人注意",
          },
          {
            name: "三阴交穴",
            location: "小腿内侧，踝关节上三寸",
            benefits: "调理气血，专门缓解妇科疼痛",
            technique: "用拇指按压，配合深呼吸，每次1-2分钟",
            officeUse: "可在桌下进行，脱掉鞋子按压效果更好",
          },
        ]
      : [
          {
            name: "Hegu Point",
            location: "Tiger mouth area, between thumb and index finger",
            benefits:
              "Soothes liver qi, promotes blood circulation, relieves general pain",
            technique:
              "Press with thumb pad, moderate pressure, 30 seconds each time",
            officeUse:
              "Can be done discreetly during meetings without drawing attention",
          },
          {
            name: "Sanyinjiao Point",
            location: "Inner side of lower leg, three fingers above ankle",
            benefits:
              "Regulates qi and blood, specifically relieves gynecological pain",
            technique:
              "Press with thumb, coordinate with deep breathing, 1-2 minutes each time",
            officeUse:
              "Can be done under desk, better effect when shoes are removed",
          },
        ];

  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("scenarios.office.title"),
    description: t("scenarios.office.description"),
    url: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
    }/${locale}/scenario-solutions/office`,
    inLanguage: isZh ? "zh-CN" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "PeriodHub",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health",
    },
    about: {
      "@type": "MedicalCondition",
      name: isZh ? "痛经" : "Dysmenorrhea",
    },
    mainEntity: {
      "@type": "HowTo",
      name: isZh
        ? "办公环境下的经期健康管理"
        : "Menstrual Health Management in Office Environment",
      description: t("scenarios.office.description"),
      step: [
        {
          "@type": "HowToStep",
          name: isZh ? "准备应急包" : "Prepare Emergency Kit",
          text: isZh
            ? "准备包含暖宝宝、止痛药、应急能量补充等物品的办公室应急包"
            : "Prepare office emergency kit with heat patches, pain relievers, and energy supplements",
        },
        {
          "@type": "HowToStep",
          name: isZh ? "办公室拉伸运动" : "Office Stretching Exercises",
          text: isZh
            ? "进行座椅骨盆运动、足底按摩等隐蔽的缓解运动"
            : "Perform discreet relief exercises like chair pelvic movements and foot massage",
        },
        {
          "@type": "HowToStep",
          name: isZh ? "营养管理" : "Nutrition Management",
          text: isZh
            ? "遵循办公室友好的营养计划，避免冷饮和高盐食物"
            : "Follow office-friendly nutrition plan, avoid cold drinks and high-salt foods",
        },
        {
          "@type": "HowToStep",
          name: isZh ? "职场沟通" : "Workplace Communication",
          text: isZh
            ? "使用专业的沟通模板与同事和上级进行有效沟通"
            : "Use professional communication templates to effectively communicate with colleagues and supervisors",
        },
      ],
    },
    author: {
      "@type": "Organization",
      name: "PeriodHub Health",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health",
    },
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeStringify(structuredData) }}
      />
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12"
        data-page="scenario-office"
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: t("title"), href: `/${locale}/scenario-solutions` },
            { label: t("scenarios.office.title") },
          ]}
        />

        {/* Page Header */}
        <header className="text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            {t("scenarios.office.title")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            {t("scenarios.office.description")}
          </p>
        </header>

        {/* Emergency Kit Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 md:p-8 rounded-xl">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {t("scenarios.office.emergencyKit.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {emergencyKitItems.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {t("scenarios.office.emergencyKit.discreteUsageGuide")}
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                •{" "}
                {locale === "zh"
                  ? '热敷贴启动借口："正在用暖宝宝缓解肩颈酸痛"'
                  : 'Heat patch excuse: "Using heat pad for neck and shoulder pain"'}
              </li>
              <li>
                •{" "}
                {locale === "zh"
                  ? '突发疼痛离场话术："需要紧急处理客户邮件"'
                  : 'Emergency exit phrase: "Need to handle urgent client email"'}
              </li>
            </ul>
          </div>
        </section>

        {/* Stretching Exercises Section */}
        <section>
          <div className="flex items-center mb-6">
            <Dumbbell className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {t("scenarios.office.stretching.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {stretchExercises.map((exercise, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                  {exercise.name}
                </h3>
                <p className="text-neutral-600 mb-4">{exercise.description}</p>
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {exercise.duration}
                  </span>
                </div>
                <ol className="space-y-2">
                  {exercise.steps.map((step, stepIndex) => (
                    <li
                      key={stepIndex}
                      className="flex items-start text-sm text-neutral-700"
                    >
                      <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Nutrition Plan Section */}
        <section>
          <div className="flex items-center mb-6">
            <Utensils className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {t("scenarios.office.nutrition.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {nutritionPlan.map((meal, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-3">
                  <Coffee className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {meal.time}
                  </h3>
                </div>
                <p className="text-neutral-700 mb-2 font-medium">
                  {meal.foods}
                </p>
                <p className="text-sm text-neutral-600">{meal.benefits}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-6 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-3">
              {t("scenarios.office.nutrition.avoidFoods.title")}
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-red-700">
              <div>
                <strong>
                  {t(
                    "scenarios.office.nutrition.avoidFoods.coldDrinks.category",
                  )}
                </strong>
                <p>
                  {t("scenarios.office.nutrition.avoidFoods.coldDrinks.items")}
                </p>
              </div>
              <div>
                <strong>
                  {t(
                    "scenarios.office.nutrition.avoidFoods.highSaltSnacks.category",
                  )}
                </strong>
                <p>
                  {t(
                    "scenarios.office.nutrition.avoidFoods.highSaltSnacks.items",
                  )}
                </p>
              </div>
              <div>
                <strong>
                  {t(
                    "scenarios.office.nutrition.avoidFoods.excessiveCaffeine.category",
                  )}
                </strong>
                <p>
                  {t(
                    "scenarios.office.nutrition.avoidFoods.excessiveCaffeine.items",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Communication Templates Section */}
        <section>
          <div className="flex items-center mb-6">
            <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {t("scenarios.office.communication.title")}
            </h2>
          </div>
          <p className="text-neutral-600 mb-8">
            {t("scenarios.office.communication.description")}
          </p>

          <div className="space-y-8">
            {/* Menstrual Pain Leave Email Template - First Position */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">📧</span>
                <h3 className="text-xl font-semibold text-neutral-800">
                  {t("scenarios.office.communication.leaveRequest.title")}
                </h3>
                <span className="ml-3 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                  {t("scenarios.office.communication.leaveRequest.subtitle")}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Chinese Version */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-medium text-neutral-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                      中
                    </span>
                    中文版
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <strong className="text-sm text-neutral-700">
                        主题：
                      </strong>
                      <div className="bg-gray-50 p-3 rounded mt-1">
                        <p className="text-sm text-gray-800">
                          {t(
                            "scenarios.office.communication.leaveRequest.chinese.subject",
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm text-neutral-700">
                        邮件正文：
                      </strong>
                      <div className="bg-gray-50 p-3 rounded mt-1">
                        <p className="text-sm text-gray-800 whitespace-pre-line">
                          {t(
                            "scenarios.office.communication.leaveRequest.chinese.greeting",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.chinese.salutation",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.chinese.body",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.chinese.closing",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.chinese.signature",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center text-blue-600 text-sm font-medium">
                    <Copy className="w-4 h-4 mr-1" />
                    <span className="text-xs text-neutral-500">
                      {t("scenarios.office.communication.copyToUse")}
                    </span>
                  </div>
                </div>

                {/* English Version */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-medium text-neutral-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                      EN
                    </span>
                    English Version
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <strong className="text-sm text-neutral-700">
                        Subject:
                      </strong>
                      <div className="bg-gray-50 p-3 rounded mt-1">
                        <p className="text-sm text-gray-800">
                          {t(
                            "scenarios.office.communication.leaveRequest.english.subject",
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm text-neutral-700">
                        Email Body:
                      </strong>
                      <div className="bg-gray-50 p-3 rounded mt-1">
                        <p className="text-sm text-gray-800 whitespace-pre-line">
                          {t(
                            "scenarios.office.communication.leaveRequest.english.greeting",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.english.salutation",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.english.body",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.english.closing",
                          )}
                          <br />
                          <br />
                          {t(
                            "scenarios.office.communication.leaveRequest.english.signature",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center text-blue-600 text-sm font-medium">
                    <Copy className="w-4 h-4 mr-1" />
                    <span className="text-xs text-neutral-500">
                      {t("scenarios.office.communication.copyToUse")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Communication Templates */}
            {communicationTemplates.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 rounded-xl"
              >
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h3 className="text-xl font-semibold text-neutral-800">
                    {category.scenario}
                  </h3>
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
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {template.tone}
                        </span>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-blue-800 leading-relaxed">
                          {template.template}
                        </p>
                      </div>

                      <div className="inline-flex items-center text-blue-600 text-sm font-medium">
                        <Copy className="w-4 h-4 mr-1" />
                        <span className="text-xs text-neutral-500">
                          {t("scenarios.office.communication.copyToUse")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Acupressure Points Section */}
        <section>
          <div className="flex items-center mb-6">
            <Hand className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {t("scenarios.office.acupressure.title")}
            </h2>
          </div>
          <p className="text-neutral-600 mb-8">
            {t("scenarios.office.acupressure.description")}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {acupressurePoints.map((point, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                  {point.name}
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-neutral-700 mb-2">
                      {t("scenarios.office.acupressure.locationLabel")}
                    </h4>
                    <p className="text-neutral-600 text-sm">{point.location}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-700 mb-2">
                      {t("scenarios.office.acupressure.benefitsLabel")}
                    </h4>
                    <p className="text-neutral-600 text-sm">{point.benefits}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-700 mb-2">
                      {t("scenarios.office.acupressure.techniqueLabel")}
                    </h4>
                    <p className="text-neutral-600 text-sm">
                      {point.technique}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-1 text-sm">
                      {t("scenarios.office.acupressure.officeApplicationLabel")}
                    </h4>
                    <p className="text-blue-700 text-sm">{point.officeUse}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              {t("scenarios.office.acupressure.scientificBasis.title")}
            </h4>
            <p className="text-yellow-700 text-sm">
              {t("scenarios.office.acupressure.scientificBasis.description")}
            </p>
          </div>
        </section>

        {/* 相关推荐区域 */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 mt-16">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {t("scenarios.office.backToOverview")}
          </Link>
        </div>

        {/* Medical Disclaimer - 移动到返回按钮下方 */}
        <section className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mt-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">
                {t("scenarios.office.disclaimer.title")}
              </h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                {t("scenarios.office.disclaimer.content")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
