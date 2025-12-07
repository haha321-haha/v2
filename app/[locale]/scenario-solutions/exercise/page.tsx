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
  Dumbbell,
  Mountain,
  Waves,
  Heart,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Shield,
  Thermometer,
} from "lucide-react";

// Types
type Locale = "en" | "zh";

interface Props {
  params: Promise<{ locale: Locale }>;
}

// 推荐数据配置函数
function getExerciseRecommendations(locale: Locale) {
  const isZh = locale === "zh";

  return {
    relatedTools: [
      {
        id: "pain-tracker",
        title: isZh ? "痛经追踪器" : "Pain Tracker",
        description: isZh
          ? "记录运动前后的疼痛变化，分析不同运动方式对症状的影响"
          : "Track pain changes before/after exercise, analyze impact of different activities on symptoms",
        href: `/${locale}/interactive-tools/pain-tracker`,
        icon: "📊",
        priority: "high",
        anchorTextType: "pain_tracker",
      },
      {
        id: "symptom-assessment",
        title: isZh ? "症状评估工具" : "Symptom Assessment",
        description: isZh
          ? "评估运动适应性，获得个性化运动强度建议"
          : "Assess exercise suitability and get personalized intensity recommendations",
        href: `/${locale}/interactive-tools/symptom-assessment`,
        icon: "🔍",
        priority: "high",
        anchorTextType: "symptom_assessment",
      },
      {
        id: "period-pain-impact-calculator",
        title: isZh ? "痛经影响计算器" : "Pain Impact Calculator",
        description: isZh
          ? "评估痛经对运动能力的影响，制定科学运动计划"
          : "Assess period pain impact on exercise capacity, create scientific workout plans",
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
          ? "深入了解痛经成因与运动疗法的科学依据，安全运动管理"
          : "Understand dysmenorrhea causes and scientific basis of exercise therapy, safe exercise management",
        href: `/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`,
        readTime: isZh ? "18分钟阅读" : "18 min read",
        category: isZh ? "医疗指南" : "Medical Guide",
        icon: "📋",
        priority: "high",
        anchorTextType: "medical_guide",
      },
      {
        id: "when-to-seek-medical-care-comprehensive-guide",
        title: isZh ? "何时就医完整指南" : "When to Seek Medical Care",
        description: isZh
          ? "识别运动中需要就医的痛经警示信号，紧急应对策略"
          : "Identify warning signs during exercise requiring medical care, emergency strategies",
        href: `/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
        readTime: isZh ? "15分钟阅读" : "15 min read",
        category: isZh ? "医疗指导" : "Medical Care",
        icon: "🏥",
        priority: "high",
        anchorTextType: "medical",
      },
      {
        id: "medication-guide",
        title: isZh ? "痛经用药指南" : "Medication Guide for Period Pain",
        description: isZh
          ? "运动前后的安全用药指南，快速缓解运动中的痛经"
          : "Safe medication guide before/after exercise, fast pain relief during workouts",
        href: `/${locale}/downloads/medication-guide`,
        readTime: isZh ? "12分钟阅读" : "12 min read",
        category: isZh ? "用药指导" : "Medication",
        icon: "💊",
        priority: "medium",
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
          ? "运动后到达办公地点的经期健康管理策略"
          : "Menstrual health management strategies after exercise and arriving at office",
        href: `/${locale}/scenario-solutions/office`,
        icon: "💼",
        priority: "high",
        anchorTextType: "office",
      },
      {
        id: "commute",
        title: isZh ? "通勤场景管理" : "Commute Scenario Management",
        description: isZh
          ? "运动后通勤途中的经期健康管理和应急处理"
          : "Menstrual health management and emergency handling during commute after exercise",
        href: `/${locale}/scenario-solutions/commute`,
        icon: "🚗",
        priority: "high",
        anchorTextType: "commute",
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
  const alternatesData = generateAlternatesConfig(
    "scenario-solutions/exercise",
  );
  const alternates = {
    canonical: alternatesData[locale === "zh" ? "zh-CN" : "en-US"],
    languages: alternatesData,
  };

  return {
    title: `${t("scenarios.exercise.title")} - ${t("title")}`,
    description: t("scenarios.exercise.description"),
    alternates,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ExerciseScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations("scenarioSolutionsPage");

  // 预加载面包屑所需的翻译
  const breadcrumbTitle = t("title");
  const breadcrumbExerciseTitle = t("scenarios.exercise.title");

  // 获取推荐数据
  const recommendations = getExerciseRecommendations(locale);
  const isZh = locale === "zh";

  // 生成 HowTo 结构化数据
  const howToData = await generateHowToStructuredData({
    locale,
    scenarioSlug: "exercise",
    name: isZh
      ? "运动期间痛经管理指南"
      : "Exercise Period Pain Management Guide",
    description: isZh
      ? "科学的运动期间痛经管理方法，包含运动强度选择、应急准备和身体监测"
      : "Scientific period pain management during exercise, including intensity selection, emergency preparation and body monitoring",
    steps: [
      {
        name: isZh
          ? "选择合适的运动强度"
          : "Choose Appropriate Exercise Intensity",
        text: isZh
          ? "根据经期阶段和疼痛程度，选择低到中等强度的运动"
          : "Choose low to moderate intensity exercise based on menstrual phase and pain level",
      },
      {
        name: isZh ? "准备运动应急包" : "Prepare Exercise Emergency Kit",
        text: isZh
          ? "携带热敷贴、止痛药、水和能量补充品"
          : "Carry heat patches, pain medication, water and energy supplements",
      },
      {
        name: isZh ? "运动前充分热身" : "Warm Up Thoroughly Before Exercise",
        text: isZh
          ? "进行10-15分钟的轻度热身，促进血液循环"
          : "Do 10-15 minutes of light warm-up to promote blood circulation",
      },
      {
        name: isZh
          ? "运动中监测身体状况"
          : "Monitor Body Condition During Exercise",
        text: isZh
          ? "注意疼痛变化，及时调整强度或休息"
          : "Pay attention to pain changes, adjust intensity or rest promptly",
      },
      {
        name: isZh ? "运动后适当放松" : "Relax Properly After Exercise",
        text: isZh
          ? "进行拉伸和放松练习，帮助肌肉恢复"
          : "Do stretching and relaxation exercises to help muscle recovery",
      },
      {
        name: isZh ? "记录运动效果" : "Record Exercise Effects",
        text: isZh
          ? "记录运动类型、强度和疼痛变化，找到最适合的运动方式"
          : "Record exercise type, intensity and pain changes to find the most suitable exercise method",
      },
    ],
    tools: [
      { name: isZh ? "运动垫" : "Exercise Mat" },
      { name: isZh ? "热敷贴" : "Heat Patches" },
      { name: isZh ? "水瓶" : "Water Bottle" },
    ],
    supplies: [
      isZh ? "运动服" : "Exercise Clothes",
      isZh ? "毛巾" : "Towel",
      isZh ? "能量棒" : "Energy Bar",
    ],
    totalTime: "PT30M",
  });

  const hikingGuide = {
    preparation: [
      {
        category:
          locale === "zh" ? "三层防护体系" : "Three-Layer Protection System",
        items: [
          locale === "zh"
            ? "基础层：速干抗菌内裤（推荐Knix品牌）"
            : "Base layer: Quick-dry antibacterial underwear (Knix brand recommended)",
          locale === "zh"
            ? "保暖层：石墨烯发热护腰（持续6小时恒温）"
            : "Insulation layer: Graphene heating waist support (6-hour constant temperature)",
          locale === "zh"
            ? "外层：带暗袋的登山裤（内置卫生用品隔层）"
            : "Outer layer: Hiking pants with hidden pockets (built-in sanitary product compartment)",
        ],
      },
      {
        category: locale === "zh" ? "装备清单" : "Equipment List",
        items: [
          locale === "zh"
            ? "透气性好的速干内衣"
            : "Breathable quick-dry underwear",
          locale === "zh"
            ? "宽松舒适的徒步裤"
            : "Loose comfortable hiking pants",
          locale === "zh" ? "防滑性好的徒步鞋" : "Non-slip hiking shoes",
          locale === "zh"
            ? "登山杖减轻腹部压力"
            : "Hiking poles to reduce abdominal pressure",
        ],
      },
    ],
    duringHike: [
      locale === "zh"
        ? "选择中低强度路线，避免高海拔或极端天气"
        : "Choose low-medium intensity routes, avoid high altitude or extreme weather",
      locale === "zh"
        ? "每30分钟休息5分钟，补充温热饮品"
        : "Rest 5 minutes every 30 minutes, replenish with warm drinks",
      locale === "zh"
        ? "密切关注身体信号，出现不适立即停止"
        : "Monitor body signals closely, stop immediately if discomfort occurs",
      locale === "zh"
        ? "保持与队友适当距离，相互照应"
        : "Maintain appropriate distance with teammates, look out for each other",
    ],
  };

  const poolSafety = {
    requirements: [
      {
        indicator: locale === "zh" ? "水温检查" : "Water Temperature Check",
        standard:
          locale === "zh"
            ? "水温>28℃（低温易致痉挛）"
            : "Water temp >28℃ (low temp causes cramps)",
        icon: <Thermometer className="w-5 h-5" />,
      },
      {
        indicator: locale === "zh" ? "氯浓度" : "Chlorine Concentration",
        standard:
          locale === "zh"
            ? "0.5-1.0ppm（过高损伤黏膜）"
            : "0.5-1.0ppm (too high damages mucosa)",
        icon: <Waves className="w-5 h-5" />,
      },
      {
        indicator: locale === "zh" ? "卫生标准" : "Hygiene Standards",
        standard:
          locale === "zh"
            ? "选择正规泳池，避免人流量大的场所"
            : "Choose regulated pools, avoid crowded venues",
        icon: <Shield className="w-5 h-5" />,
      },
    ],
    products: [
      locale === "zh"
        ? "月经杯优于卫生棉条（防水性更好）"
        : "Menstrual cup preferred over tampons (better waterproof)",
      locale === "zh"
        ? "防水型卫生棉条（具有良好防水性能）"
        : "Waterproof tampons (with good waterproof performance)",
      locale === "zh"
        ? "蔓越莓浓缩胶囊（预防尿路感染）"
        : "Cranberry concentrate capsules (prevent UTI)",
    ],
    protocol: [
      locale === "zh"
        ? "游泳前彻底淋浴清洁身体"
        : "Thoroughly shower before swimming",
      locale === "zh"
        ? "选择经期中后期，流量较少时游泳"
        : "Swim during mid-late period when flow is lighter",
      locale === "zh"
        ? "游泳后立即冲洗并更换干净内衣"
        : "Rinse immediately after swimming and change to clean underwear",
      locale === "zh"
        ? "避免在公共按摩浴缸中浸泡"
        : "Avoid soaking in public hot tubs",
    ],
  };

  const yogaPoses = [
    {
      name: locale === "zh" ? "猫牛式" : "Cat-Cow Pose",
      sanskrit: "Marjaryasana-Bitilasana",
      duration: locale === "zh" ? "5-10次动态练习" : "5-10 dynamic repetitions",
      benefits:
        locale === "zh"
          ? "动态活化骨盆，缓解腰背压力"
          : "Dynamically activates pelvis, relieves back pressure",
      steps: [
        locale === "zh"
          ? "双手双膝着地，保持脊柱中立"
          : "Hands and knees on ground, maintain neutral spine",
        locale === "zh"
          ? "吸气时下沉腹部，抬头向上（牛式）"
          : "Inhale: sink belly, lift head up (Cow)",
        locale === "zh"
          ? "呼气时拱起脊背，低头看腹部（猫式）"
          : "Exhale: arch spine, look toward belly (Cat)",
      ],
    },
    {
      name: locale === "zh" ? "婴儿式" : "Child's Pose",
      sanskrit: "Balasana",
      duration: locale === "zh" ? "保持1-3分钟" : "Hold for 1-3 minutes",
      benefits:
        locale === "zh"
          ? "缓解腰背压力，放松身心"
          : "Relieves back pressure, relaxes body and mind",
      steps: [
        locale === "zh" ? "跪坐，臀部坐在脚跟上" : "Kneel, sit back on heels",
        locale === "zh"
          ? "上身前倾，额头贴地"
          : "Lean forward, forehead to ground",
        locale === "zh"
          ? "双手放在身体两侧或向前伸展"
          : "Arms at sides or extended forward",
      ],
    },
    {
      name: locale === "zh" ? "仰卧束角式" : "Reclined Bound Angle Pose",
      sanskrit: "Supta Baddha Konasana",
      duration: locale === "zh" ? "保持5-15分钟" : "Hold for 5-15 minutes",
      benefits:
        locale === "zh"
          ? "改善血液循环，缓解骨盆充血"
          : "Improves circulation, relieves pelvic congestion",
      steps: [
        locale === "zh"
          ? "仰卧，双脚脚掌相对"
          : "Lie down, soles of feet together",
        locale === "zh" ? "膝盖向两侧打开" : "Knees fall to sides",
        locale === "zh"
          ? "双手放在身体两侧，深呼吸"
          : "Arms at sides, breathe deeply",
      ],
    },
    {
      name: locale === "zh" ? "双腿靠墙式" : "Legs Up the Wall",
      sanskrit: "Viparita Karani",
      duration: locale === "zh" ? "保持5-15分钟" : "Hold for 5-15 minutes",
      benefits:
        locale === "zh"
          ? "促进血液回流，缓解腿部疲劳"
          : "Promotes blood return, relieves leg fatigue",
      steps: [
        locale === "zh"
          ? "坐在墙边，双腿伸直靠墙"
          : "Sit by wall, legs straight up wall",
        locale === "zh"
          ? "身体与墙呈90度角"
          : "Body at 90-degree angle to wall",
        locale === "zh"
          ? "双臂自然放松，闭眼休息"
          : "Arms relaxed, close eyes and rest",
      ],
    },
  ];

  const avoidPoses = [
    locale === "zh"
      ? "倒立类体式（头倒立、肩倒立）"
      : "Inversion poses (headstand, shoulderstand)",
    locale === "zh"
      ? "深度后弯体式（轮式、骆驼式）"
      : "Deep backbends (wheel pose, camel pose)",
    locale === "zh" ? "强烈扭转体式" : "Intense twisting poses",
    locale === "zh"
      ? "腹部强力收缩的体式"
      : "Poses with strong abdominal contractions",
  ];

  return (
    <>
      <HowToStructuredDataScript data={howToData} />
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12"
        data-page="scenario-exercise"
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: breadcrumbTitle, href: `/${locale}/scenario-solutions` },
            { label: breadcrumbExerciseTitle },
          ]}
        />

        {/* Page Header */}
        <header className="text-center">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            {t("scenarios.exercise.title")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            {t("scenarios.exercise.description")}
          </p>
        </header>

        {/* Hiking Guide Section */}
        <section className="bg-gradient-to-br from-orange-50 to-neutral-50 p-6 md:p-8 rounded-xl">
          <div className="flex items-center mb-6">
            <Mountain className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "经期徒步三层防护体系"
                : "Period Hiking Three-Layer Protection System"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {hikingGuide.preparation.map((prep, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  {prep.category}
                </h3>
                <ul className="space-y-3">
                  {prep.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-orange-100 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-3">
              {locale === "zh"
                ? "徒步过程中注意事项"
                : "Precautions During Hiking"}
            </h4>
            <ul className="space-y-2">
              {hikingGuide.duringHike.map((note, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-orange-700"
                >
                  <span className="w-5 h-5 bg-orange-200 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pool Safety Section */}
        <section>
          <div className="flex items-center mb-6">
            <Waves className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh"
                ? "泳池卫生风险防控"
                : "Pool Hygiene Risk Prevention"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {poolSafety.requirements.map((req, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {req.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  {req.indicator}
                </h3>
                <p className="text-sm text-neutral-600">{req.standard}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-4">
                {locale === "zh" ? "推荐产品" : "Recommended Products"}
              </h4>
              <ul className="space-y-3">
                {poolSafety.products.map((product, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    {product}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-4">
                {locale === "zh" ? "卫生协议" : "Hygiene Protocol"}
              </h4>
              <ul className="space-y-3">
                {poolSafety.protocol.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-green-700"
                  >
                    <span className="w-5 h-5 bg-green-200 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Yoga Poses Section */}
        <section>
          <div className="flex items-center mb-6">
            <Heart className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {locale === "zh" ? "经期瑜伽体式库" : "Period Yoga Pose Library"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {yogaPoses.map((pose, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {pose.name}
                  </h3>
                  <span className="text-xs text-neutral-500 italic">
                    {pose.sanskrit}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {pose.duration}
                  </span>
                </div>

                <p className="text-neutral-600 mb-4 text-sm">
                  <strong>{locale === "zh" ? "功效：" : "Benefits: "}</strong>
                  {pose.benefits}
                </p>

                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    {locale === "zh" ? "动作要点：" : "Key Points:"}
                  </h4>
                  <ol className="space-y-2">
                    {pose.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-start text-sm text-neutral-700"
                      >
                        <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {locale === "zh"
                ? "经期应避免的体式"
                : "Poses to Avoid During Period"}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {avoidPoses.map((pose, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-red-700"
                >
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  {pose}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Guidelines */}
        <section className="bg-yellow-50 p-6 md:p-8 rounded-xl">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            {locale === "zh" ? "运动安全指南" : "Exercise Safety Guidelines"}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-yellow-700">
            <div>
              <h4 className="font-medium mb-2">
                {locale === "zh"
                  ? "运动强度控制"
                  : "Exercise Intensity Control"}
              </h4>
              <ul className="space-y-1">
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "避免剧烈运动，选择中低强度活动"
                    : "Avoid intense exercise, choose low-medium intensity activities"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "根据身体状况随时调整运动计划"
                    : "Adjust exercise plan according to body condition"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "出现严重不适立即停止运动"
                    : "Stop immediately if severe discomfort occurs"}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">
                {locale === "zh" ? "补水与营养" : "Hydration & Nutrition"}
              </h4>
              <ul className="space-y-1">
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "运动前后充分补水，选择温热饮品"
                    : "Hydrate well before/after exercise, choose warm drinks"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "携带能量食物，如坚果、香蕉等"
                    : "Carry energy foods like nuts, bananas"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "避免空腹运动，防止低血糖"
                    : "Avoid exercising on empty stomach, prevent hypoglycemia"}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 相关推荐区域 */}
        <section className="bg-gradient-to-br from-orange-50 to-blue-50 mt-16">
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
            {t("scenarios.exercise.backToOverview")}
          </Link>
        </div>

        {/* Medical Disclaimer */}
        <section className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mt-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">
                {t("scenarios.exercise.disclaimer.title")}
              </h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                {t("scenarios.exercise.disclaimer.content")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
