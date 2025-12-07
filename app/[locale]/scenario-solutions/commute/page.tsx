import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { generateAlternatesConfig } from "@/lib/seo/canonical-url-utils";
import RelatedToolCard from "@/app/[locale]/interactive-tools/components/RelatedToolCard";
import RelatedArticleCard from "@/app/[locale]/interactive-tools/components/RelatedArticleCard";
import ScenarioSolutionCard from "@/app/[locale]/interactive-tools/components/ScenarioSolutionCard";
import {
  generateHowToStructuredData,
  HowToStructuredDataScript,
} from "@/lib/seo/howto-structured-data";
import {
  Car,
  Train,
  Bus,
  Bike,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Clock,
  MapPin,
  Shield,
  Hand,
  Wind,
  Quote,
} from "lucide-react";

// Types
type Locale = "en" | "zh";

interface Props {
  params: Promise<{ locale: Locale }>;
}

// 推荐数据配置函数
function getCommuteRecommendations(locale: Locale) {
  const isZh = locale === "zh";

  return {
    relatedTools: [
      {
        id: "pain-tracker",
        title: isZh ? "痛经追踪器" : "Pain Tracker",
        description: isZh
          ? "记录通勤疼痛模式，分析不同交通方式下的症状变化趋势"
          : "Track commute pain patterns and analyze symptom changes across different transport modes",
        href: `/${locale}/interactive-tools/pain-tracker`,
        icon: "📊",
        priority: "high",
        anchorTextType: "pain_tracker",
      },
      {
        id: "symptom-assessment",
        title: isZh ? "症状评估工具" : "Symptom Assessment",
        description: isZh
          ? "评估痛经严重程度，获得个性化通勤适应建议"
          : "Assess pain severity and get personalized commute adaptation advice",
        href: `/${locale}/interactive-tools/symptom-assessment`,
        icon: "🔍",
        priority: "high",
        anchorTextType: "symptom_assessment",
      },
      {
        id: "period-pain-impact-calculator",
        title: isZh ? "痛经影响计算器" : "Pain Impact Calculator",
        description: isZh
          ? "评估痛经对通勤和工作的影响程度，获得个性化改善方案"
          : "Assess period pain impact on commuting and work, get personalized solutions",
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
          ? "深入了解痛经成因、诊断和治疗方法，帮助通勤女性科学应对"
          : "Understand causes, diagnosis and treatment of dysmenorrhea for commuting women",
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
          ? "识别需要就医的痛经警示信号，通勤途中的紧急应对策略"
          : "Identify warning signs requiring medical care and emergency strategies during commute",
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
          ? "通勤途中安全用药指南，快速缓解痛经的药物选择"
          : "Safe medication guide during commute, fast pain relief options",
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
        id: "office",
        title: isZh
          ? "办公环境健康管理"
          : "Office Environment Health Management",
        description: isZh
          ? "到达办公地点后的经期健康管理策略"
          : "Menstrual health management strategies after arriving at the office",
        href: `/${locale}/scenario-solutions/office`,
        icon: "💼",
        priority: "high",
        anchorTextType: "office",
      },
      {
        id: "emergency-kit",
        title: isZh ? "痛经应急包指南" : "Period Pain Emergency Kit Guide",
        description: isZh
          ? "通勤途中突发疼痛的应急处理方案"
          : "Emergency response plan for sudden pain during commuting",
        href: `/${locale}/scenario-solutions/emergency-kit`,
        icon: "🚨",
        priority: "high",
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

  // 生成canonical和hreflang配置
  const alternatesData = generateAlternatesConfig("scenario-solutions/commute");
  const alternates = {
    canonical: alternatesData[locale === "zh" ? "zh-CN" : "en-US"],
    languages: alternatesData,
  };

  return {
    title: `${t("scenarios.commute.title")} - ${t("title")}`,
    description: t("scenarios.commute.description"),
    alternates,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CommuteScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations("scenarioSolutionsPage");

  // 预加载面包屑所需的翻译
  const breadcrumbTitle = t("title");
  const breadcrumbCommuteTitle = t("scenarios.commute.title");

  // 获取推荐数据
  const recommendations = getCommuteRecommendations(locale);
  const isZh = locale === "zh";

  // 生成 HowTo 结构化数据
  const howToData = await generateHowToStructuredData({
    locale,
    scenarioSlug: "commute",
    name: isZh
      ? "通勤途中痛经应急管理指南"
      : "Commute Period Pain Emergency Management Guide",
    description: isZh
      ? "通勤途中的痛经应急处理方法，包含便携应急包准备和应急路线规划"
      : "Period pain emergency management during commute, including portable emergency kit preparation and emergency route planning",
    steps: [
      {
        name: isZh ? "准备便携应急包" : "Prepare Portable Emergency Kit",
        text: isZh
          ? "准备小巧的应急包，包含止痛药、卫生用品和热敷贴"
          : "Prepare compact emergency kit with pain medication, hygiene products and heat patches",
      },
      {
        name: isZh ? "选择舒适的通勤方式" : "Choose Comfortable Commute Method",
        text: isZh
          ? "根据疼痛程度选择最舒适的交通方式"
          : "Choose the most comfortable transportation based on pain level",
      },
      {
        name: isZh ? "规划应急路线" : "Plan Emergency Routes",
        text: isZh
          ? "了解沿途的洗手间和休息点位置"
          : "Know the locations of restrooms and rest points along the way",
      },
      {
        name: isZh ? "携带必备物品" : "Carry Essential Items",
        text: isZh
          ? "确保随身携带手机、水和应急联系信息"
          : "Ensure you carry phone, water and emergency contact information",
      },
      {
        name: isZh ? "了解沿途设施" : "Know Facilities Along the Way",
        text: isZh
          ? "提前了解沿途的药店和医疗设施"
          : "Know pharmacies and medical facilities along the way in advance",
      },
      {
        name: isZh ? "掌握应急处理方法" : "Master Emergency Response Methods",
        text: isZh
          ? "学习简单的呼吸和放松技巧，缓解突发疼痛"
          : "Learn simple breathing and relaxation techniques to relieve sudden pain",
      },
    ],
    tools: [
      { name: isZh ? "便携应急包" : "Portable Emergency Kit" },
      { name: isZh ? "手机" : "Mobile Phone" },
    ],
    supplies: [
      isZh ? "止痛药" : "Pain Medication",
      isZh ? "卫生用品" : "Hygiene Products",
      isZh ? "热敷贴" : "Heat Patches",
    ],
    totalTime: "PT15M",
  });

  const emergencyKit = [
    {
      item: locale === "zh" ? "隐形热敷系统" : "Invisible Heat System",
      description:
        locale === "zh"
          ? "可粘贴暖宝宝（ThermaCare隐形贴片）"
          : "Adhesive heat patches (ThermaCare invisible patches)",
      usage:
        locale === "zh"
          ? "贴在腹部或腰部，持续发热6小时"
          : "Apply to abdomen or lower back, continuous heat for 6 hours",
    },
    {
      item: locale === "zh" ? "迷你电热护腰" : "Mini Electric Heating Pad",
      description:
        locale === "zh"
          ? "USB充电款，会议中可穿戴"
          : "USB rechargeable, wearable during meetings",
      usage:
        locale === "zh"
          ? "隐蔽穿戴，温度可调节"
          : "Discreet wear, adjustable temperature",
    },
    {
      item: locale === "zh" ? "姜茶冲剂条" : "Ginger Tea Sachets",
      description:
        locale === "zh"
          ? "无糖配方，30秒速溶"
          : "Sugar-free formula, dissolves in 30 seconds",
      usage:
        locale === "zh"
          ? "用温水冲泡，缓解痉挛"
          : "Mix with warm water, relieves cramps",
    },
    {
      item: locale === "zh" ? "穴位按摩工具" : "Acupressure Tools",
      description:
        locale === "zh"
          ? "内关穴按摩戒指（隐形设计）"
          : "Neiguan point massage ring (invisible design)",
      usage:
        locale === "zh"
          ? "单手操作，隐蔽按压"
          : "One-handed operation, discreet pressure",
    },
  ];

  const transportStrategies = [
    {
      type: locale === "zh" ? "地铁/公交" : "Subway/Bus",
      icon: <Train className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600",
      strategies: [
        locale === "zh"
          ? "选择中间车厢（减少加减速惯性冲击）"
          : "Choose middle cars (reduce acceleration/deceleration impact)",
        locale === "zh"
          ? "优先座智能申请（经期电子凭证）"
          : "Priority seat smart application (period electronic certificate)",
        locale === "zh"
          ? "靠墙骨盆支撑法：微屈膝顶住车厢壁"
          : "Wall pelvic support method: slightly bend knees against carriage wall",
        locale === "zh"
          ? "佩戴降噪耳机播放432Hz镇痛音频"
          : "Wear noise-canceling headphones with 432Hz pain relief audio",
      ],
    },
    {
      type: locale === "zh" ? "自驾出行" : "Self-Driving",
      icon: <Car className="w-6 h-6" />,
      color: "bg-green-50 text-green-600",
      strategies: [
        locale === "zh"
          ? "座椅加热+腰椎气垫（每30分钟自动充放气）"
          : "Seat heating + lumbar air cushion (auto inflate/deflate every 30 min)",
        locale === "zh"
          ? "方向盘生命体征监测"
          : "Steering wheel vital signs monitoring",
        locale === "zh"
          ? "车载迷你微波炉（加热暖宫贴）"
          : "Car mini microwave (heat warming patches)",
        locale === "zh"
          ? "避免疼痛时强行驾驶（反应速度下降30%）"
          : "Avoid forced driving during pain (reaction speed decreases 30%)",
      ],
    },
    {
      type: locale === "zh" ? "共享单车" : "Bike Sharing",
      icon: <Bike className="w-6 h-6" />,
      color: "bg-orange-50 text-orange-600",
      strategies: [
        locale === "zh"
          ? "硅胶坐垫套（减震+恒温）"
          : "Silicone seat cover (shock absorption + constant temperature)",
        locale === "zh"
          ? "束腹带稳定核心（防骑行晃动）"
          : "Abdominal belt for core stability (prevent riding sway)",
        locale === "zh"
          ? "单次不超过20分钟，中途休息"
          : "No more than 20 minutes per session, rest in between",
        locale === "zh"
          ? "调整座椅高度减少会阴压迫"
          : "Adjust seat height to reduce perineal pressure",
      ],
    },
    {
      type: locale === "zh" ? "网约车/出租车" : "Ride-hailing/Taxi",
      icon: <Bus className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-600",
      strategies: [
        locale === "zh"
          ? "座椅加热等级设定（通过APP提前发送指令）"
          : "Seat heating level setting (send instructions via app in advance)",
        locale === "zh"
          ? "空气净化模式（过滤PM2.5与挥发性物质）"
          : "Air purification mode (filter PM2.5 and volatile substances)",
        locale === "zh"
          ? '选择"舒适型"车型（空间宽敞）'
          : 'Choose "comfort" vehicle type (spacious)',
        locale === "zh"
          ? '使用"医疗紧急模式"（部分APP支持）'
          : 'Use "medical emergency mode" (supported by some apps)',
      ],
    },
  ];

  const timeManagement = [
    {
      phase: locale === "zh" ? "出发前20分钟" : "20 Minutes Before Departure",
      actions: [
        locale === "zh"
          ? "饮用300ml生姜肉桂饮"
          : "Drink 300ml ginger cinnamon beverage",
        locale === "zh"
          ? "贴敷远红外暖宫贴（持续发热6小时）"
          : "Apply far-infrared warming patches (6-hour continuous heat)",
        locale === "zh"
          ? "服用止痛药（提前服用更有效）"
          : "Take pain medication (more effective when taken in advance)",
      ],
    },
    {
      phase: locale === "zh" ? "通勤途中" : "During Commute",
      actions: [
        locale === "zh"
          ? "单脚踩台阶形成骨盆倾斜（缓解腰痛）"
          : "Step on platform with one foot to create pelvic tilt (relieves back pain)",
        locale === "zh"
          ? "手拉吊环时轻微拉伸侧腰肌群"
          : "Gently stretch side waist muscles when holding handrails",
        locale === "zh"
          ? "4-7-8呼吸法：吸气4秒→屏息7秒→呼气8秒"
          : "4-7-8 breathing: inhale 4 sec → hold 7 sec → exhale 8 sec",
      ],
    },
    {
      phase: locale === "zh" ? "到达后10分钟" : "10 Minutes After Arrival",
      actions: [
        locale === "zh"
          ? "进行3分钟骨盆复位操"
          : "Perform 3-minute pelvic reset exercises",
        locale === "zh"
          ? "靠墙深蹲（激活臀肌）"
          : "Wall squats (activate glutes)",
        locale === "zh"
          ? "脊柱逐节伸展（改善循环）"
          : "Spinal segmental stretching (improve circulation)",
      ],
    },
  ];

  const emergencyPlans = [
    {
      situation: locale === "zh" ? "突发疼痛升级" : "Sudden Pain Escalation",
      solutions: [
        locale === "zh"
          ? '地铁/公交：启动"假装低血糖"预案'
          : 'Subway/Bus: Activate "fake hypoglycemia" plan',
        locale === "zh"
          ? "含服葡萄糖片+请求让座"
          : "Take glucose tablets + request seat",
        locale === "zh"
          ? '网约车：使用"医疗紧急模式"'
          : 'Ride-hailing: Use "medical emergency mode"',
      ],
    },
    {
      situation: locale === "zh" ? "卫生用品短缺" : "Sanitary Product Shortage",
      solutions: [
        locale === "zh"
          ? '便利店速购：向店员出示"Code Red"手势'
          : 'Convenience store quick purchase: Show "Code Red" gesture to clerk',
        locale === "zh"
          ? "共享卫生巾机：地图导航至最近网点"
          : "Shared sanitary pad machine: Navigate to nearest location",
        locale === "zh"
          ? "参与商家提供免费应急包"
          : "Participating merchants provide free emergency kits",
      ],
    },
    {
      situation: locale === "zh" ? "衣物污染处理" : "Clothing Contamination",
      solutions: [
        locale === "zh"
          ? "喷洒含酶预处理剂（分解血渍蛋白）"
          : "Spray enzyme pre-treatment agent (breaks down blood protein)",
        locale === "zh"
          ? "用冷水轻拍（禁用热水！）"
          : "Gently pat with cold water (no hot water!)",
        locale === "zh"
          ? "外套反系腰间（时尚伪装法）"
          : "Tie jacket around waist backwards (fashionable camouflage)",
      ],
    },
  ];

  // 通勤穴位按压技巧
  const commuteAcupressure = [
    {
      name: locale === "zh" ? "合谷穴" : "Hegu Point",
      location:
        locale === "zh"
          ? "虎口处，拇指和食指之间"
          : "Tiger mouth area, between thumb and index finger",
      benefits:
        locale === "zh"
          ? "疏肝理气、活血化瘀，通用性强"
          : "Soothes liver qi, promotes blood circulation, highly versatile",
      technique:
        locale === "zh"
          ? "拇指或食指指腹点按、揉按，力度适中"
          : "Press and rub with thumb or index finger pad, moderate pressure",
      commuteUse:
        locale === "zh"
          ? "在包包下、衣物遮挡下隐蔽进行，利用扶手或靠背协助"
          : "Perform discreetly under bag or clothing, use handrails or backrests for assistance",
      userQuote:
        locale === "zh"
          ? '"挤地铁已经够累了，痛经一来真是雪上加霜，只想快点到家躺平。"'
          : '"The subway is already exhausting, and when period pain hits, it\'s just adding insult to injury. I just want to get home and lie down."',
    },
    {
      name: locale === "zh" ? "内关穴" : "Neiguan Point",
      location:
        locale === "zh"
          ? "手腕内侧，距离腕横纹约三指宽"
          : "Inner side of wrist, about three fingers width from wrist crease",
      benefits:
        locale === "zh"
          ? "缓解恶心、心烦等伴随症状，调节情绪"
          : "Relieves nausea, irritability and other accompanying symptoms, regulates emotions",
      technique:
        locale === "zh"
          ? "用拇指按压，可采用断续或持续按压"
          : "Press with thumb, can use intermittent or continuous pressure",
      commuteUse:
        locale === "zh"
          ? "可在握扶手时同时进行，非常隐蔽"
          : "Can be done while holding handrails, very discreet",
      userQuote:
        locale === "zh"
          ? '"开车时肚子痛，会影响注意力，感觉很危险。但又不能随便停下来。"'
          : '"Stomach pain while driving affects concentration and feels dangerous. But I can\'t just stop anywhere."',
    },
    {
      name: locale === "zh" ? "太冲穴" : "Taichong Point",
      location:
        locale === "zh"
          ? "足背，大脚趾和二脚趾之间向上约一指宽"
          : "Top of foot, about one finger width up between big toe and second toe",
      benefits:
        locale === "zh"
          ? "疏肝理气、行气止痛，专门针对情绪波动"
          : "Soothes liver qi, promotes qi circulation and pain relief, specifically for mood swings",
      technique:
        locale === "zh"
          ? "脱掉鞋子，用拇指按压，配合深呼吸"
          : "Remove shoes, press with thumb, coordinate with deep breathing",
      commuteUse:
        locale === "zh"
          ? "适合坐着时进行，可在座位上悄悄脱鞋按压"
          : "Suitable when sitting, can quietly remove shoes and press while seated",
      userQuote:
        locale === "zh"
          ? '"在地铁里按了太冲穴，感觉情绪平静了很多，疼痛也减轻了。"'
          : '"Pressing Taichong point on the subway made me feel much calmer emotionally, and the pain was also reduced."',
    },
  ];

  // 驾车呼吸放松方法
  const drivingBreathingTechniques = [
    {
      name: locale === "zh" ? "方框呼吸法" : "Box Breathing",
      description:
        locale === "zh"
          ? "4-4-4-4节奏，帮助调节自主神经系统"
          : "4-4-4-4 rhythm, helps regulate autonomic nervous system",
      steps: [
        locale === "zh"
          ? "吸气4秒（肚子鼓起）"
          : "Inhale 4 seconds (belly rises)",
        locale === "zh" ? "屏气4秒" : "Hold breath 4 seconds",
        locale === "zh"
          ? "呼气4秒（肚子收回）"
          : "Exhale 4 seconds (belly falls)",
        locale === "zh"
          ? "屏气4秒，重复循环"
          : "Hold breath 4 seconds, repeat cycle",
      ],
      benefits:
        locale === "zh"
          ? "降低心率和压力，缓解肌肉紧张"
          : "Reduces heart rate and stress, relieves muscle tension",
      safetyTip:
        locale === "zh"
          ? "只在等红灯或安全停车时进行完整练习"
          : "Only practice fully when stopped at red lights or safely parked",
    },
    {
      name: locale === "zh" ? "腹式呼吸" : "Diaphragmatic Breathing",
      description:
        locale === "zh"
          ? "专注于腹部起伏，促进血液循环"
          : "Focus on abdominal movement, promotes blood circulation",
      steps: [
        locale === "zh"
          ? "一手放胸部，一手放腹部"
          : "One hand on chest, one hand on abdomen",
        locale === "zh"
          ? "吸气时腹部手上升，胸部手保持不动"
          : "When inhaling, abdominal hand rises, chest hand stays still",
        locale === "zh"
          ? "呼气时腹部手下降"
          : "When exhaling, abdominal hand falls",
        locale === "zh"
          ? "保持缓慢深长的呼吸节奏"
          : "Maintain slow, deep breathing rhythm",
      ],
      benefits:
        locale === "zh"
          ? "增加氧气供应，缓解腹部痉挛"
          : "Increases oxygen supply, relieves abdominal cramps",
      safetyTip:
        locale === "zh"
          ? "可在驾驶中进行，但注意力仍需集中在路况"
          : "Can be done while driving, but attention must remain on road conditions",
    },
  ];

  return (
    <>
      <HowToStructuredDataScript data={howToData} />
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12"
        data-page="scenario-commute"
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: breadcrumbTitle, href: `/${locale}/scenario-solutions` },
            { label: breadcrumbCommuteTitle },
          ]}
        />

        {/* Page Header */}
        <header className="text-center">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            {t("scenarios.commute.title")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            {t("scenarios.commute.description")}
          </p>
        </header>

        {/* Emergency Kit Section */}
        <section className="bg-gradient-to-br from-green-50 to-neutral-50 p-6 md:p-8 rounded-xl">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh" ? "通勤应急工具包" : "Commute Emergency Kit"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {emergencyKit.map((kit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                  {kit.item}
                </h3>
                <p className="text-neutral-600 mb-3">{kit.description}</p>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-700">{kit.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transport Strategies Section */}
        <section>
          <div className="flex items-center mb-6">
            <MapPin className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "交通方式适配策略"
                : "Transport Mode Adaptation Strategies"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {transportStrategies.map((transport, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${transport.color} mr-4`}
                  >
                    {transport.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {transport.type}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {transport.strategies.map((strategy, strategyIndex) => (
                    <li key={strategyIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
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

        {/* Time Management Section */}
        <section>
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "通勤时段管理指南"
                : "Commute Time Management Guide"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {timeManagement.map((phase, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  {phase.phase}
                </h3>
                <ul className="space-y-3">
                  {phase.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                        {actionIndex + 1}
                      </span>
                      <span className="text-sm text-neutral-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Plans Section */}
        <section>
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "极端情况应急预案"
                : "Emergency Response Plans"}
            </h2>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            {emergencyPlans.map((plan, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-red-700 mb-4">
                  {plan.situation}
                </h3>
                <ul className="space-y-3">
                  {plan.solutions.map((solution, solutionIndex) => (
                    <li key={solutionIndex} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">
                        {solution}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Acupressure Points Section */}
        <section>
          <div className="flex items-center mb-6">
            <Hand className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "地铁/公交穴位按压技巧"
                : "Subway/Bus Acupressure Techniques"}
            </h2>
          </div>
          <p className="text-neutral-600 mb-8">
            {locale === "zh"
              ? "在拥挤的空间里，这些简单易学、随时随地可行的穴位按压技巧，能快速缓解通勤中的疼痛。"
              : "In crowded spaces, these simple and easy-to-learn acupressure techniques can quickly relieve pain during commuting."}
          </p>

          <div className="space-y-8">
            {commuteAcupressure.map((point, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-neutral-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                  {point.name}
                </h3>

                {/* User Quote */}
                <div className="bg-white p-4 rounded-lg mb-6 border-l-4 border-green-300">
                  <div className="flex items-start">
                    <Quote className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-neutral-700 italic text-sm leading-relaxed">
                      {point.userQuote}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {locale === "zh"
                      ? "—— 来自用户语录"
                      : "—— From user testimonials"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-neutral-700 mb-2">
                        {locale === "zh" ? "位置：" : "Location:"}
                      </h4>
                      <p className="text-neutral-600 text-sm">
                        {point.location}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-neutral-700 mb-2">
                        {locale === "zh" ? "功效：" : "Benefits:"}
                      </h4>
                      <p className="text-neutral-600 text-sm">
                        {point.benefits}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-neutral-700 mb-2">
                        {locale === "zh" ? "按压方法：" : "Technique:"}
                      </h4>
                      <p className="text-neutral-600 text-sm">
                        {point.technique}
                      </p>
                    </div>

                    <div className="bg-green-100 p-3 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-1 text-sm">
                        {locale === "zh"
                          ? "通勤应用："
                          : "Commute Application:"}
                      </h4>
                      <p className="text-green-700 text-sm">
                        {point.commuteUse}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Driving Breathing Techniques Section */}
        <section>
          <div className="flex items-center mb-6">
            <Wind className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "驾车场景呼吸放松方法"
                : "Driving Breathing Relaxation Methods"}
            </h2>
          </div>
          <p className="text-neutral-600 mb-8">
            {locale === "zh"
              ? "开车需要高度专注，经期疼痛可能让你分心。学会这些简单的呼吸技巧，帮助你在驾驶时缓解不适，保障安全。"
              : "Driving requires high concentration, and period pain can be distracting. Learn these simple breathing techniques to help relieve discomfort while driving and ensure safety."}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {drivingBreathingTechniques.map((technique, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                  {technique.name}
                </h3>

                <p className="text-neutral-600 mb-4 text-sm">
                  {technique.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-medium text-neutral-700 mb-2 text-sm">
                    {locale === "zh" ? "步骤：" : "Steps:"}
                  </h4>
                  <ol className="space-y-2">
                    {technique.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-start text-sm text-neutral-700"
                      >
                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-neutral-700 mb-2 text-sm">
                    {locale === "zh" ? "益处：" : "Benefits:"}
                  </h4>
                  <p className="text-neutral-600 text-sm">
                    {technique.benefits}
                  </p>
                </div>

                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1 text-sm">
                    {locale === "zh" ? "安全提示：" : "Safety Tip:"}
                  </h4>
                  <p className="text-red-700 text-sm">{technique.safetyTip}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {locale === "zh" ? "科学依据" : "Scientific Basis"}
            </h4>
            <p className="text-blue-700 text-sm">
              {locale === "zh"
                ? "深呼吸练习通过调节自主神经系统，降低心率和压力反应，缓解肌肉紧张。研究表明，规律的呼吸练习可以促进内啡肽释放，这是人体天然的止痛物质。"
                : "Deep breathing exercises regulate the autonomic nervous system, reducing heart rate and stress response, relieving muscle tension. Research shows that regular breathing exercises can promote endorphin release, the body's natural painkillers."}
            </p>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="bg-yellow-50 p-6 md:p-8 rounded-xl">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            {locale === "zh" ? "安全提示" : "Safety Tips"}
          </h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>
              •{" "}
              {locale === "zh"
                ? "药物携带：布洛芬需原包装携带，避免散装药品引发安检疑问"
                : "Medication carrying: Ibuprofen should be carried in original packaging to avoid security questions"}
            </li>
            <li>
              •{" "}
              {locale === "zh"
                ? "隐私保护：使用分装盒存放卫生用品，避免外露"
                : "Privacy protection: Use compartment boxes to store sanitary products, avoid exposure"}
            </li>
            <li>
              •{" "}
              {locale === "zh"
                ? '数据记录：通勤疼痛发作时，用APP记录"疼痛开始时间+交通方式"'
                : 'Data recording: When commute pain occurs, use app to record "pain start time + transport mode"'}
            </li>
            <li>
              •{" "}
              {locale === "zh"
                ? "严重疼痛时禁止驾驶：疼痛剧烈影响驾驶安全时，必须立即靠边停车休息或寻求帮助"
                : "No driving during severe pain: When severe pain affects driving safety, must immediately pull over to rest or seek help"}
            </li>
          </ul>
        </section>

        {/* 相关推荐区域 */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 mt-16">
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
            {t("scenarios.commute.backToOverview")}
          </Link>
        </div>

        {/* Medical Disclaimer */}
        <section className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mt-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">
                {t("scenarios.commute.disclaimer.title")}
              </h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                {t("scenarios.commute.disclaimer.content")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
