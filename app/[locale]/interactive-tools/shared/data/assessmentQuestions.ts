import { Question } from "../types";

// 扩展的症状评估问题（基于医学研究和最佳实践）
export const getExtendedSymptomQuestions = (locale: string): Question[] => {
  const questions: Question[] = [
    // 基础疼痛问题（来自参考代码）
    ...getSymptomQuestions(locale),

    // 新增专业问题
    {
      id: "cyclePattern",
      type: "single",
      category: "medical",
      weight: 2,
      title:
        locale === "zh"
          ? "您的月经周期模式如何？"
          : "What is your menstrual cycle pattern?",
      description:
        locale === "zh"
          ? "请选择最符合您月经周期情况的选项"
          : "Please select the option that best describes your menstrual cycle",
      validation: { required: true },
      options: [
        {
          value: "regular",
          label:
            locale === "zh"
              ? "规律（21-35天周期，变化不超过7天）"
              : "Regular (21-35 day cycles with variation ≤7 days)",
          weight: 3,
        },
        {
          value: "irregular",
          label:
            locale === "zh"
              ? "不规律（周期长度变化超过7天）"
              : "Irregular (cycle length varies >7 days)",
          weight: 1,
        },
        {
          value: "heavy",
          label:
            locale === "zh"
              ? "月经量多（需要频繁更换卫生用品）"
              : "Heavy flow (requires frequent pad/tampon changes)",
          weight: 1,
        },
        {
          value: "light",
          label:
            locale === "zh"
              ? "月经量少（很少需要更换卫生用品）"
              : "Light flow (rarely need to change pads/tampons)",
          weight: 2,
        },
      ],
    },
    {
      id: "painPattern",
      type: "single",
      category: "pain",
      weight: 2,
      title:
        locale === "zh"
          ? "疼痛的模式是什么？"
          : "What is the pattern of your pain?",
      description:
        locale === "zh"
          ? "请选择最符合您疼痛模式的选项"
          : "Please select the option that best describes your pain pattern",
      validation: { required: true },
      options: [
        {
          value: "cramping",
          label:
            locale === "zh"
              ? "痉挛性疼痛（阵发性收缩感）"
              : "Cramping pain (intermittent contractions)",
          weight: 2,
        },
        {
          value: "constant",
          label: locale === "zh" ? "持续性钝痛" : "Constant dull ache",
          weight: 2,
        },
        {
          value: "sharp",
          label: locale === "zh" ? "尖锐刺痛" : "Sharp, stabbing pain",
          weight: 1,
        },
        {
          value: "throbbing",
          label: locale === "zh" ? "搏动性疼痛" : "Throbbing pain",
          weight: 1,
        },
      ],
    },
    {
      id: "painTiming",
      type: "single",
      category: "pain",
      weight: 2,
      title:
        locale === "zh"
          ? "疼痛通常什么时候开始？"
          : "When does the pain typically start?",
      description:
        locale === "zh"
          ? "请选择疼痛开始的时间"
          : "Please select when the pain typically begins",
      validation: { required: true },
      options: [
        {
          value: "beforePeriod",
          label:
            locale === "zh"
              ? "月经开始前1-2天"
              : "1-2 days before period starts",
          weight: 2,
        },
        {
          value: "firstDay",
          label: locale === "zh" ? "月经第一天" : "On the first day of period",
          weight: 3,
        },
        {
          value: "duringPeriod",
          label: locale === "zh" ? "月经期间" : "During the period",
          weight: 2,
        },
        {
          value: "afterPeriod",
          label: locale === "zh" ? "月经结束后" : "After period ends",
          weight: 1,
        },
      ],
    },
    {
      id: "medicalHistory",
      type: "multi",
      category: "medical",
      weight: 2,
      title:
        locale === "zh"
          ? "您是否有以下任何医疗状况？（可多选）"
          : "Do you have any of the following medical conditions? (Select all that apply)",
      description:
        locale === "zh"
          ? "请选择所有适用的医疗状况"
          : "Please select all applicable medical conditions",
      validation: { required: false },
      options: [
        {
          value: "endometriosis",
          label: locale === "zh" ? "子宫内膜异位症" : "Endometriosis",
          weight: 1,
        },
        {
          value: "fibroids",
          label: locale === "zh" ? "子宫肌瘤" : "Uterine fibroids",
          weight: 1,
        },
        {
          value: "pcos",
          label:
            locale === "zh"
              ? "多囊卵巢综合征"
              : "Polycystic ovary syndrome (PCOS)",
          weight: 1,
        },
        {
          value: "adenomyosis",
          label: locale === "zh" ? "子宫腺肌症" : "Adenomyosis",
          weight: 1,
        },
        {
          value: "pelvicInflammatory",
          label: locale === "zh" ? "盆腔炎" : "Pelvic inflammatory disease",
          weight: 1,
        },
        {
          value: "irritableBowel",
          label: locale === "zh" ? "肠易激综合征" : "Irritable bowel syndrome",
          weight: 1,
        },
        {
          value: "none",
          label: locale === "zh" ? "以上都没有" : "None of the above",
          weight: 3,
        },
      ],
    },
    {
      id: "treatmentHistory",
      type: "multi",
      category: "medical",
      weight: 1,
      title:
        locale === "zh"
          ? "您曾经尝试过哪些治疗方法？（可多选）"
          : "What treatments have you tried before? (Select all that apply)",
      description:
        locale === "zh"
          ? "请选择所有您曾经尝试过的治疗方法"
          : "Please select all treatments you have tried",
      validation: { required: false },
      options: [
        {
          value: "ibuprofen",
          label:
            locale === "zh"
              ? "布洛芬或其他非甾体抗炎药"
              : "Ibuprofen or other NSAIDs",
          weight: 1,
        },
        {
          value: "acetaminophen",
          label: locale === "zh" ? "对乙酰氨基酚" : "Acetaminophen",
          weight: 1,
        },
        {
          value: "birthControl",
          label:
            locale === "zh"
              ? "避孕药或激素治疗"
              : "Birth control pills or hormonal therapy",
          weight: 1,
        },
        {
          value: "heatTherapy",
          label:
            locale === "zh"
              ? "热敷或热水袋"
              : "Heat therapy or hot water bottle",
          weight: 1,
        },
        {
          value: "exercise",
          label: locale === "zh" ? "运动或瑜伽" : "Exercise or yoga",
          weight: 1,
        },
        {
          value: "dietary",
          label:
            locale === "zh"
              ? "饮食调整或补充剂"
              : "Dietary changes or supplements",
          weight: 1,
        },
        {
          value: "acupuncture",
          label: locale === "zh" ? "针灸或按摩" : "Acupuncture or massage",
          weight: 1,
        },
        {
          value: "none",
          label:
            locale === "zh"
              ? "没有尝试过任何治疗"
              : "Haven't tried any treatments",
          weight: 1,
        },
      ],
    },
    {
      id: "lifestyleFactors",
      type: "multi",
      category: "lifestyle",
      weight: 1,
      title:
        locale === "zh"
          ? "以下哪些因素可能影响您的痛经？（可多选）"
          : "Which of the following factors might affect your period pain? (Select all that apply)",
      description:
        locale === "zh"
          ? "请选择所有可能影响您痛经的因素"
          : "Please select all factors that might affect your period pain",
      validation: { required: false },
      options: [
        {
          value: "stress",
          label: locale === "zh" ? "压力或焦虑" : "Stress or anxiety",
          weight: 1,
        },
        {
          value: "sleep",
          label: locale === "zh" ? "睡眠不足" : "Lack of sleep",
          weight: 1,
        },
        {
          value: "diet",
          label:
            locale === "zh"
              ? "饮食不规律或营养不良"
              : "Irregular eating or poor nutrition",
          weight: 1,
        },
        {
          value: "exercise",
          label: locale === "zh" ? "缺乏运动" : "Lack of exercise",
          weight: 1,
        },
        {
          value: "smoking",
          label: locale === "zh" ? "吸烟" : "Smoking",
          weight: 1,
        },
        {
          value: "alcohol",
          label: locale === "zh" ? "饮酒" : "Alcohol consumption",
          weight: 1,
        },
        {
          value: "caffeine",
          label:
            locale === "zh" ? "咖啡因摄入过多" : "Excessive caffeine intake",
          weight: 1,
        },
        {
          value: "none",
          label:
            locale === "zh"
              ? "以上因素都不适用"
              : "None of these factors apply",
          weight: 1,
        },
      ],
    },
    {
      id: "functionalImpact",
      type: "single",
      category: "symptoms",
      weight: 2,
      title:
        locale === "zh"
          ? "痛经对您的日常功能影响程度如何？"
          : "How much does your period pain affect your daily functioning?",
      description:
        locale === "zh"
          ? "请选择最符合您情况的选项"
          : "Please select the option that best describes your situation",
      validation: { required: true },
      options: [
        {
          value: "minimal",
          label:
            locale === "zh"
              ? "影响很小，可以正常进行所有活动"
              : "Minimal impact, can perform all activities normally",
          weight: 3,
        },
        {
          value: "moderate",
          label:
            locale === "zh"
              ? "中等影响，某些活动会受限"
              : "Moderate impact, some activities are limited",
          weight: 2,
        },
        {
          value: "significant",
          label:
            locale === "zh"
              ? "显著影响，大部分活动受限"
              : "Significant impact, most activities are limited",
          weight: 1,
        },
        {
          value: "severe",
          label:
            locale === "zh"
              ? "严重影响，无法进行日常活动"
              : "Severe impact, unable to perform daily activities",
          weight: 0,
        },
      ],
    },
    {
      id: "painRelief",
      type: "single",
      category: "preference",
      weight: 1,
      title:
        locale === "zh"
          ? "什么方法最能缓解您的疼痛？"
          : "What method provides the most pain relief?",
      description:
        locale === "zh"
          ? "请选择最有效的疼痛缓解方法"
          : "Please select the most effective pain relief method",
      validation: { required: true },
      options: [
        {
          value: "medication",
          label: locale === "zh" ? "止痛药" : "Pain medication",
          weight: 1,
        },
        {
          value: "heat",
          label: locale === "zh" ? "热敷" : "Heat therapy",
          weight: 1,
        },
        {
          value: "rest",
          label: locale === "zh" ? "休息" : "Rest",
          weight: 1,
        },
        {
          value: "exercise",
          label: locale === "zh" ? "轻度运动" : "Light exercise",
          weight: 1,
        },
        {
          value: "nothing",
          label:
            locale === "zh"
              ? "没有有效的方法"
              : "Nothing provides effective relief",
          weight: 0,
        },
      ],
    },
  ];

  return questions;
};

// 基于参考代码lIDgMx5的症状评估问题（5个问题）
export const getSymptomQuestions = (locale: string): Question[] => {
  const questions: Question[] = [
    {
      id: "painLevel",
      type: "single",
      category: "pain",
      weight: 3,
      title:
        locale === "zh"
          ? "在典型的痛经日，您如何评价疼痛的强度？"
          : "On a typical day with period pain, how would you rate its intensity?",
      description:
        locale === "zh"
          ? "请根据您的实际感受选择最符合的疼痛程度"
          : "Please select the pain level that best matches your experience",
      validation: { required: true },
      options: [
        {
          value: "mild",
          label:
            locale === "zh"
              ? "轻度 (1-3/10): 能感觉到，但不影响我的日常活动。"
              : "Mild (1-3/10): It's noticeable but doesn't stop me from my daily activities.",
          weight: 1,
        },
        {
          value: "moderate",
          label:
            locale === "zh"
              ? "中度 (4-6/10): 疼痛会干扰我，影响我的注意力和工作效率。可能需要非处方止痛药。"
              : "Moderate (4-6/10): It's disruptive and affects my focus and productivity. I might need over-the-counter pain relief.",
          weight: 2,
        },
        {
          value: "severe",
          label:
            locale === "zh"
              ? "重度 (7-8/10): 疼痛很强烈，我需要躺下或停止正在做的事情，难以正常活动。"
              : "Severe (7-8/10): The pain is strong enough that I need to lie down or stop what I'm doing. It's difficult to function.",
          weight: 3,
        },
        {
          value: "verySevere",
          label:
            locale === "zh"
              ? "极重度 (9-10/10): 疼痛使人衰弱，难以忍受。我经常卧床不起，并可能伴有恶心或昏厥等其他症状。"
              : "Very Severe (9-10/10): The pain is debilitating and overwhelming. I'm often bedridden and may experience other symptoms like nausea or fainting.",
          weight: 4,
        },
      ],
    },
    {
      id: "painDuration",
      type: "single",
      category: "pain",
      weight: 2,
      title:
        locale === "zh"
          ? "最剧烈的疼痛通常会持续多久？"
          : "How long does the most intense pain typically last?",
      description:
        locale === "zh"
          ? "请选择最符合您疼痛持续时间的选项"
          : "Please select the option that best describes your pain duration",
      validation: { required: true },
      options: [
        {
          value: "short",
          label:
            locale === "zh"
              ? "在第一天持续几个小时。"
              : "A few hours on the first day.",
          weight: 1,
        },
        {
          value: "medium",
          label:
            locale === "zh"
              ? "在经期的前1-2天内疼痛比较严重。"
              : "It's significant for the first 1-2 days of my period.",
          weight: 2,
        },
        {
          value: "long",
          label:
            locale === "zh"
              ? "持续3天或更长时间。"
              : "It persists for 3 or more days.",
          weight: 3,
        },
        {
          value: "variable",
          label:
            locale === "zh"
              ? "疼痛不可预测，每个周期的差异很大。"
              : "It's unpredictable and varies greatly from cycle to cycle.",
          weight: 2,
        },
      ],
    },
    {
      id: "painLocation",
      type: "multi",
      category: "pain",
      weight: 1,
      title:
        locale === "zh"
          ? "您主要在哪个部位感到疼痛？（可多选）"
          : "Where do you primarily feel the pain? (Select all that apply)",
      description:
        locale === "zh"
          ? "可以选择多个部位"
          : "You can select multiple locations",
      validation: { required: true, minSelections: 1 },
      options: [
        {
          value: "lowerAbdomen",
          label:
            locale === "zh"
              ? "下腹部（肚脐以下）"
              : "Lower abdomen (below the navel)",
          weight: 1,
        },
        {
          value: "lowerBack",
          label: locale === "zh" ? "下背部（腰部）" : "Lower back",
          weight: 1,
        },
        {
          value: "upperThighs",
          label:
            locale === "zh" ? "放射到大腿上部" : "Radiating to upper thighs",
          weight: 1,
        },
        {
          value: "fullPelvis",
          label:
            locale === "zh"
              ? "整个盆腔区域普遍的钝痛"
              : "A general, dull ache across the entire pelvic region",
          weight: 1,
        },
        {
          value: "sideFlank",
          label:
            locale === "zh"
              ? "身体一侧（左侧或右侧）"
              : "On one side (left or right)",
          weight: 1,
        },
      ],
    },
    {
      id: "accompanyingSymptoms",
      type: "multi",
      category: "symptoms",
      weight: 1,
      title:
        locale === "zh"
          ? "除了疼痛，您还会经历哪些其他症状？（可多选）"
          : "Besides pain, what other symptoms do you experience? (Select all that apply)",
      description:
        locale === "zh"
          ? "可以选择多个症状"
          : "You can select multiple symptoms",
      validation: { required: false },
      options: [
        {
          value: "fatigue",
          label: locale === "zh" ? "疲劳或筋疲力尽" : "Fatigue or exhaustion",
          weight: 1,
        },
        {
          value: "headache",
          label: locale === "zh" ? "头痛或偏头痛" : "Headache or migraine",
          weight: 1,
        },
        {
          value: "nausea",
          label: locale === "zh" ? "恶心或呕吐" : "Nausea or vomiting",
          weight: 1,
        },
        {
          value: "digestive",
          label: locale === "zh" ? "腹泻或便秘" : "Diarrhea or constipation",
          weight: 1,
        },
        {
          value: "mood",
          label:
            locale === "zh" ? "易怒或情绪波动" : "Irritability or mood swings",
          weight: 1,
        },
        {
          value: "bloating",
          label: locale === "zh" ? "腹部胀气" : "Abdominal bloating",
          weight: 1,
        },
        {
          value: "breastTenderness",
          label: locale === "zh" ? "乳房胀痛" : "Breast tenderness",
          weight: 1,
        },
        {
          value: "dizziness",
          label:
            locale === "zh" ? "头晕或眩晕" : "Dizziness or lightheadedness",
          weight: 1,
        },
      ],
    },
    {
      id: "reliefPreference",
      type: "single",
      category: "preference",
      weight: 1,
      title:
        locale === "zh"
          ? "您目前的主要目标是什么？"
          : "What is your primary goal right now?",
      description:
        locale === "zh"
          ? "请选择最符合您需求的选项"
          : "Please select the option that best matches your needs",
      validation: { required: true },
      options: [
        {
          value: "instant",
          label:
            locale === "zh"
              ? "我需要针对当前疼痛的快速缓解方法。"
              : "I need fast-acting relief for my current pain.",
          weight: 1,
        },
        {
          value: "natural",
          label:
            locale === "zh"
              ? "我更喜欢自然的或非药物的疗法。"
              : "I prefer natural or non-medicinal remedies.",
          weight: 1,
        },
        {
          value: "longTerm",
          label:
            locale === "zh"
              ? "我想探索能够减少未来疼痛的长期管理策略。"
              : "I want to explore long-term management strategies to reduce future pain.",
          weight: 1,
        },
        {
          value: "medical",
          label:
            locale === "zh"
              ? "我愿意了解相关的医疗方案和专业建议。"
              : "I'm open to learning about medical treatments and professional advice.",
          weight: 1,
        },
      ],
    },
  ];

  return questions;
};

// 扩展的职场评估问题（基于职场健康研究）
export const getExtendedWorkplaceQuestions = (locale: string): Question[] => {
  const questions: Question[] = [
    // 基础职场问题（来自参考代码）
    ...getWorkplaceQuestions(locale),

    // 新增专业职场问题
    {
      id: "productivityImpact",
      type: "single",
      category: "workplace",
      weight: 2,
      title:
        locale === "zh"
          ? "痛经对您的工作效率影响如何？"
          : "How does your period pain affect your work productivity?",
      description:
        locale === "zh"
          ? "请选择最符合您情况的选项"
          : "Please select the option that best describes your situation",
      validation: { required: true },
      options: [
        {
          value: "noImpact",
          label:
            locale === "zh"
              ? "没有影响，工作效率正常"
              : "No impact, productivity remains normal",
          weight: 3,
        },
        {
          value: "slightReduction",
          label:
            locale === "zh"
              ? "轻微影响，效率略有下降"
              : "Slight impact, productivity slightly reduced",
          weight: 2,
        },
        {
          value: "moderateReduction",
          label:
            locale === "zh"
              ? "中等影响，效率明显下降"
              : "Moderate impact, productivity noticeably reduced",
          weight: 1,
        },
        {
          value: "significantReduction",
          label:
            locale === "zh"
              ? "严重影响，效率大幅下降"
              : "Significant impact, productivity greatly reduced",
          weight: 0,
        },
      ],
    },
    {
      id: "presenteeism",
      type: "single",
      category: "workplace",
      weight: 2,
      title:
        locale === "zh"
          ? "您是否曾经带病工作（即使感觉不适也坚持工作）？"
          : "Have you ever worked while feeling unwell due to period pain?",
      description:
        locale === "zh"
          ? "请选择最符合您情况的选项"
          : "Please select the option that best describes your situation",
      validation: { required: true },
      options: [
        {
          value: "never",
          label: locale === "zh" ? "从未带病工作" : "Never worked while unwell",
          weight: 3,
        },
        {
          value: "rarely",
          label:
            locale === "zh" ? "很少带病工作" : "Rarely worked while unwell",
          weight: 2,
        },
        {
          value: "sometimes",
          label:
            locale === "zh"
              ? "有时会带病工作"
              : "Sometimes worked while unwell",
          weight: 1,
        },
        {
          value: "often",
          label: locale === "zh" ? "经常带病工作" : "Often worked while unwell",
          weight: 0,
        },
      ],
    },
    {
      id: "careerImpact",
      type: "single",
      category: "workplace",
      weight: 2,
      title:
        locale === "zh"
          ? "痛经是否影响了您的职业发展？"
          : "Has your period pain affected your career development?",
      description:
        locale === "zh"
          ? "请选择最符合您情况的选项"
          : "Please select the option that best describes your situation",
      validation: { required: true },
      options: [
        {
          value: "noImpact",
          label:
            locale === "zh"
              ? "没有影响职业发展"
              : "No impact on career development",
          weight: 3,
        },
        {
          value: "missedOpportunities",
          label:
            locale === "zh"
              ? "错过了一些工作机会"
              : "Missed some work opportunities",
          weight: 1,
        },
        {
          value: "delayedPromotion",
          label:
            locale === "zh"
              ? "影响了晋升或加薪"
              : "Affected promotion or salary increase",
          weight: 0,
        },
        {
          value: "careerChange",
          label:
            locale === "zh"
              ? "考虑过换工作或职业"
              : "Considered changing jobs or career",
          weight: 0,
        },
      ],
    },
    {
      id: "workplaceSupport",
      type: "multi",
      category: "workplace",
      weight: 1,
      title:
        locale === "zh"
          ? "您的工作场所是否提供以下支持？（可多选）"
          : "Does your workplace provide the following support? (Select all that apply)",
      description:
        locale === "zh"
          ? "请选择所有适用的支持措施"
          : "Please select all applicable support measures",
      validation: { required: false },
      options: [
        {
          value: "flexibleHours",
          label: locale === "zh" ? "弹性工作时间" : "Flexible working hours",
          weight: 1,
        },
        {
          value: "remoteWork",
          label: locale === "zh" ? "远程工作选项" : "Remote work options",
          weight: 1,
        },
        {
          value: "healthInsurance",
          label: locale === "zh" ? "健康保险覆盖" : "Health insurance coverage",
          weight: 1,
        },
        {
          value: "mentalHealth",
          label: locale === "zh" ? "心理健康支持" : "Mental health support",
          weight: 1,
        },
        {
          value: "wellnessPrograms",
          label: locale === "zh" ? "健康促进项目" : "Wellness programs",
          weight: 1,
        },
        {
          value: "none",
          label: locale === "zh" ? "没有提供任何支持" : "No support provided",
          weight: 0,
        },
      ],
    },
  ];

  return questions;
};

// 基于参考代码lIDgMx5的职场评估问题（4个问题）
export const getWorkplaceQuestions = (locale: string): Question[] => {
  const questions: Question[] = [
    {
      id: "concentration",
      type: "single",
      category: "workplace",
      weight: 3,
      title:
        locale === "zh"
          ? "您的痛经如何影响您在工作或学习时的注意力？"
          : "How does your period pain affect your ability to concentrate at work or school?",
      description:
        locale === "zh"
          ? "请选择最符合您情况的选项"
          : "Please select the option that best describes your situation",
      validation: { required: true },
      options: [
        {
          value: "none",
          label:
            locale === "zh"
              ? "对我的注意力没有影响。"
              : "No impact on my concentration.",
          weight: 3,
        },
        {
          value: "slight",
          label:
            locale === "zh"
              ? "会稍微分散注意力，但我能应付。"
              : "It's slightly distracting, but I can manage.",
          weight: 2,
        },
        {
          value: "difficult",
          label:
            locale === "zh"
              ? "让我很难专注于任务。"
              : "It makes it very difficult to focus on tasks.",
          weight: 1,
        },
        {
          value: "impossible",
          label:
            locale === "zh"
              ? "几乎无法集中注意力或保持工作效率。"
              : "It's nearly impossible to concentrate or be productive.",
          weight: 0,
        },
      ],
    },
    {
      id: "absenteeism",
      type: "single",
      category: "workplace",
      weight: 3,
      title:
        locale === "zh"
          ? "您是否曾因经期症状而不得不缺勤、缺课或错过重要活动？"
          : "Have you ever had to miss work, school, or important events because of your period symptoms?",
      description:
        locale === "zh"
          ? "请选择最符合您情况的选项"
          : "Please select the option that best describes your situation",
      validation: { required: true },
      options: [
        {
          value: "never",
          label: locale === "zh" ? "从未" : "Never",
          weight: 3,
        },
        {
          value: "rarely",
          label:
            locale === "zh"
              ? "很少（例如，每年一次或更少）"
              : "Rarely (e.g., once a year or less)",
          weight: 2,
        },
        {
          value: "sometimes",
          label:
            locale === "zh"
              ? "有时（每年几次）"
              : "Sometimes (a few times a year)",
          weight: 1,
        },
        {
          value: "frequently",
          label:
            locale === "zh"
              ? "经常（在大多数或所有周期中）"
              : "Frequently (in most or all cycles)",
          weight: 0,
        },
      ],
    },
    {
      id: "communication",
      type: "single",
      category: "workplace",
      weight: 3,
      title:
        locale === "zh"
          ? "如果因痛经需要向您的上司提出调整请求（例如，短暂休息、在家工作），您的自在程度如何？"
          : "How comfortable would you feel discussing the need for accommodations (e.g., a short break, working from home) with your manager due to period pain?",
      description:
        locale === "zh"
          ? "请选择最符合您情况的选项"
          : "Please select the option that best describes your comfort level",
      validation: { required: true },
      options: [
        {
          value: "comfortable",
          label:
            locale === "zh"
              ? "非常自在，我相信他们会支持。"
              : "Very comfortable, I believe they would be supportive.",
          weight: 3,
        },
        {
          value: "hesitant",
          label:
            locale === "zh"
              ? "有些犹豫，不确定他们会作何反应。"
              : "Hesitant, I'm not sure how they would react.",
          weight: 1,
        },
        {
          value: "uncomfortable",
          label:
            locale === "zh"
              ? "非常不自在，我会避免进行这种沟通。"
              : "Very uncomfortable, I would avoid the conversation.",
          weight: 0,
        },
        {
          value: "na",
          label:
            locale === "zh"
              ? "不适用 / 我没有上司"
              : "Not applicable / I don't have a manager",
          weight: 1,
        },
      ],
    },
    {
      id: "support",
      type: "multi",
      category: "workplace",
      weight: 1,
      title:
        locale === "zh"
          ? "您认为哪些支持措施对您最有帮助？（可多选）"
          : "Which support measures would be most helpful to you? (Select all that apply)",
      description:
        locale === "zh"
          ? "可以选择多个支持措施"
          : "You can select multiple support measures",
      validation: { required: false },
      options: [
        {
          value: "flexHours",
          label:
            locale === "zh" ? "弹性的上下班时间" : "Flexible working hours",
          weight: 1,
        },
        {
          value: "remoteWork",
          label:
            locale === "zh" ? "可选择在家工作" : "Option to work from home",
          weight: 1,
        },
        {
          value: "restArea",
          label:
            locale === "zh"
              ? "有安静的休息区可供使用"
              : "Access to a quiet rest area",
          weight: 1,
        },
        {
          value: "understanding",
          label:
            locale === "zh"
              ? "对月经健康有更开放和理解的文化氛围"
              : "More open and understanding culture around menstrual health",
          weight: 1,
        },
        {
          value: "leave",
          label:
            locale === "zh"
              ? "有明确的经期休假政策"
              : "Clear menstrual leave policy",
          weight: 1,
        },
        {
          value: "none",
          label:
            locale === "zh" ? "不需要特殊支持" : "No special support needed",
          weight: 1,
        },
      ],
    },
  ];

  return questions;
};

// 根据评估模式筛选题目
export const getQuestionsByMode = (
  locale: string,
  mode: string,
): Question[] => {
  const basicSymptomQuestions = getSymptomQuestions(locale);
  const extendedSymptomQuestions = getExtendedSymptomQuestions(locale);
  const extendedWorkplaceQuestions = getExtendedWorkplaceQuestions(locale);

  switch (mode) {
    case "simplified":
      // 简化版：只包含核心症状问题（3个问题）
      return basicSymptomQuestions.filter((q) =>
        ["painLevel", "painDuration", "reliefPreference"].includes(q.id),
      );

    case "detailed":
      // 详细版：包含扩展的症状问题（13个问题）
      return extendedSymptomQuestions;

    case "medical":
      // 医疗专业版：包含扩展的症状和职场问题（21个问题）
      return [...extendedSymptomQuestions, ...extendedWorkplaceQuestions];

    default:
      return basicSymptomQuestions.filter((q) =>
        ["painLevel", "painDuration"].includes(q.id),
      );
  }
};

// 保留旧的assessmentQuestions作为备用，但主要使用新的基于参考代码的函数
export const assessmentQuestions: Record<string, Question[]> = {
  zh: [],
  en: [],
};
