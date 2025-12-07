// 基于参考代码lIDgMx5的计算算法

type Locale = "zh" | "en";
type PainLevel = "mild" | "moderate" | "severe" | "verySevere";
type DurationKey = "short" | "medium" | "long" | "variable";
type ReliefPreference = "instant" | "natural" | "longTerm" | "medical";
type FunctionalImpact = "minimal" | "moderate" | "significant" | "severe";
type CyclePattern = "regular" | "irregular" | "heavy" | "light";
type PainPattern = "cramping" | "constant" | "sharp" | "throbbing";
type PainTiming = "beforePeriod" | "firstDay" | "duringPeriod" | "afterPeriod";

type RecommendationArray = string[];

interface RecommendationBuckets {
  immediate: RecommendationArray;
  longTerm: RecommendationArray;
}

interface RecommendationLocaleData {
  mild: RecommendationBuckets;
  moderate: RecommendationBuckets;
  severe: RecommendationBuckets;
  verySevere: RecommendationBuckets;
  natural: RecommendationBuckets;
  medical: {
    longTerm: RecommendationArray;
  };
  duration: {
    long?: RecommendationBuckets;
    variable?: {
      longTerm: RecommendationArray;
    };
  };
  symptoms: Record<string, RecommendationArray>;
  location: Record<string, RecommendationArray>;
}

interface SymptomAssessmentInputs {
  painLevel: PainLevel;
  painDuration: DurationKey;
  reliefPreference: ReliefPreference;
  accompanyingSymptoms?: string[];
  painLocation?: string[];
  cyclePattern?: CyclePattern;
  painPattern?: PainPattern;
  painTiming?: PainTiming;
  medicalHistory?: string[];
  lifestyleFactors?: string[];
  functionalImpact?: FunctionalImpact;
}

interface WorkplaceAssessmentInputs {
  concentration?: "none" | "slight" | "difficult" | "impossible";
  absenteeism?: "never" | "rarely" | "sometimes" | "frequently";
  communication?: "comfortable" | "hesitant" | "uncomfortable" | "na";
}

type MedicalAssessmentInputs = SymptomAssessmentInputs &
  WorkplaceAssessmentInputs;

interface CalculationResult {
  isSevere: boolean;
  summary: string[];
  recommendations: RecommendationBuckets;
  score: number;
  suggestions?: string[];
  profile?: string;
}

type SuggestionEntry = {
  profile: string;
  suggestions: string[];
};

type SuggestionTextMap = Record<
  Locale,
  {
    supportive: SuggestionEntry;
    adaptive: SuggestionEntry;
    challenging: SuggestionEntry;
  }
>;

const appendRecommendations = (
  target: RecommendationArray,
  source?: RecommendationArray,
): void => {
  if (Array.isArray(source) && source.length > 0) {
    target.push(...source);
  }
};

const dedupe = (items: RecommendationArray): RecommendationArray =>
  Array.from(new Set(items));

const suggestionTexts: SuggestionTextMap = {
  zh: {
    supportive: {
      profile: "支持性环境",
      suggestions: [
        "您的工作能力似乎基本未受影响，并且您能自在地沟通需求。这是一个很好的基础。",
      ],
    },
    adaptive: {
      profile: "中度适应性环境",
      suggestions: [
        "您的工作受到中等程度的影响。确定关键的支持措施可以显著改善您的体验。",
        "考虑与信任的经理或人力资源代表进行非正式的交谈，讨论所面临的挑战。",
      ],
    },
    challenging: {
      profile: "挑战性环境",
      suggestions: [
        "您的症状严重影响了您的工作。寻求支持非常重要。",
        "首先记录症状对工作的影响。将我们的完整报告作为个人工具。",
        "研究您公司现有的病假和弹性工作政策。",
      ],
    },
  },
  en: {
    supportive: {
      profile: "Supportive Environment",
      suggestions: [
        "Your ability to work seems largely unaffected, and you feel comfortable communicating your needs. This is a great foundation.",
      ],
    },
    adaptive: {
      profile: "Moderately Adaptive Environment",
      suggestions: [
        "Your work is moderately impacted. Identifying key support measures could significantly improve your experience.",
        "Consider having an informal chat with a trusted manager or HR representative about the challenges faced.",
      ],
    },
    challenging: {
      profile: "Challenging Environment",
      suggestions: [
        "Your symptoms significantly impact your work. It is important to find support.",
        "Start by documenting the impact on your work. Use our full report as a personal tool.",
        "Research your company's existing sick leave and flexible work policies.",
      ],
    },
  },
};

const recommendationTexts: Record<Locale, RecommendationLocaleData> = {
  zh: {
    mild: {
      immediate: ["温和的伸展运动或短途散步"],
      longTerm: ["定期进行瑜伽或普拉提等轻度运动"],
    },
    moderate: {
      immediate: [
        "在腹部或下背部加热敷垫",
        "考虑使用非处方止痛药（请先咨询医生）",
      ],
      longTerm: [
        "追踪您的周期以预测疼痛",
        "探索饮食调整（如减少咖啡因和盐分）",
      ],
    },
    severe: {
      immediate: [
        "使用热敷垫并在舒适的位置休息",
        "使用深呼吸或冥想技巧应对急性疼痛",
      ],
      longTerm: ["咨询医疗保健专业人员进行诊断", "与医生讨论长期疼痛管理策略"],
    },
    verySevere: {
      immediate: [
        "立即休息，使用热敷垫缓解疼痛",
        "尝试深呼吸或冥想技巧应对剧烈疼痛",
        "如果疼痛持续加剧或伴有异常症状，请立即就医",
      ],
      longTerm: [
        "尽快咨询妇科医生进行全面检查",
        "讨论处方药物或其他医疗干预措施",
      ],
    },
    natural: {
      immediate: ["饮用姜茶或甘菊茶"],
      longTerm: ["将抗炎食物（如姜黄、绿叶蔬菜）纳入饮食"],
    },
    medical: {
      longTerm: ["预约妇科医生，以排除子宫内膜异位症或肌瘤等潜在疾病"],
    },
    duration: {
      long: {
        immediate: ["考虑使用持续性热敷或TENS设备"],
        longTerm: ["记录疼痛持续时间模式，与医生分享以制定长期管理计划"],
      },
      variable: {
        longTerm: ["详细记录每次疼痛的触发因素和缓解方法，寻找规律"],
      },
    },
    symptoms: {
      nausea: ["避免油腻食物，少量多餐，考虑姜片或薄荷茶"],
      headache: ["保持充足水分，在安静昏暗的环境中休息"],
      fatigue: ["优先保证充足睡眠，适当补充铁质和维生素B"],
      backPain: ["使用腰部支撑垫，尝试针对下背部的温和拉伸"],
      legPain: ["抬高双腿休息，轻柔按摩腿部肌肉"],
      dizziness: ["避免突然站立，保持血糖稳定，及时补充水分"],
    },
    location: {
      lower_abdomen: ["重点在下腹部使用热敷，尝试胎儿式瑜伽姿势"],
      lower_back: ["使用腰部热敷垫，尝试猫牛式瑜伽动作"],
      thighs: ["轻柔按摩大腿内侧，避免长时间站立"],
      pelvic: ["尝试骨盆倾斜运动，考虑物理治疗"],
    },
  },
  en: {
    mild: {
      immediate: ["Gentle stretching or short walks"],
      longTerm: ["Regular yoga or Pilates for light exercise"],
    },
    moderate: {
      immediate: [
        "Apply heating pad to abdomen or lower back",
        "Consider over-the-counter pain relievers (consult doctor first)",
      ],
      longTerm: [
        "Track your cycle to anticipate pain",
        "Explore dietary changes (like reducing caffeine and salt)",
      ],
    },
    severe: {
      immediate: [
        "Use heating pad and rest in comfortable position",
        "Use deep breathing or meditation techniques for acute pain",
      ],
      longTerm: [
        "Consult healthcare professional for diagnosis",
        "Discuss long-term pain management strategies with doctor",
      ],
    },
    verySevere: {
      immediate: [
        "Rest immediately and use heating pad for pain relief",
        "Try deep breathing or meditation for severe pain",
        "Seek immediate medical attention if pain worsens or unusual symptoms occur",
      ],
      longTerm: [
        "Schedule comprehensive gynecological examination as soon as possible",
        "Discuss prescription medications or other medical interventions",
      ],
    },
    natural: {
      immediate: ["Drink ginger or chamomile tea"],
      longTerm: [
        "Incorporate anti-inflammatory foods (like turmeric, leafy greens) into diet",
      ],
    },
    medical: {
      longTerm: [
        "Schedule visit with gynecologist to rule out underlying conditions like endometriosis or fibroids",
      ],
    },
    duration: {
      long: {
        immediate: ["Consider continuous heat therapy or TENS device"],
        longTerm: [
          "Track pain duration patterns and share with doctor for long-term management plan",
        ],
      },
      variable: {
        longTerm: [
          "Keep detailed log of pain triggers and relief methods to identify patterns",
        ],
      },
    },
    symptoms: {
      nausea: [
        "Avoid greasy foods, eat small frequent meals, consider ginger or peppermint tea",
      ],
      headache: ["Stay hydrated, rest in quiet dark environment"],
      fatigue: ["Prioritize adequate sleep, supplement iron and vitamin B"],
      backPain: ["Use lumbar support, try gentle lower back stretches"],
      legPain: ["Elevate legs while resting, gently massage leg muscles"],
      dizziness: [
        "Avoid sudden standing, maintain stable blood sugar, stay hydrated",
      ],
    },
    location: {
      lower_abdomen: [
        "Focus heat on lower abdomen, try child's pose yoga position",
      ],
      lower_back: ["Use lumbar heating pad, try cat-cow yoga movements"],
      thighs: ["Gently massage inner thighs, avoid prolonged standing"],
      pelvic: ["Try pelvic tilt exercises, consider physical therapy"],
    },
  },
};

// 共享的建议生成函数
function generateSymptomRecommendations(
  answers: SymptomAssessmentInputs,
  locale: Locale,
  isSevere: boolean,
  summary: string[],
  score: number,
): CalculationResult {
  const {
    painLevel,
    painDuration,
    reliefPreference,
    accompanyingSymptoms = [],
    painLocation = [],
  } = answers;

  const recommendations: RecommendationBuckets = {
    immediate: [],
    longTerm: [],
  };

  // 生成摘要标签
  const painLevelLabels = {
    zh: {
      mild: "轻度 (1-3/10): 能感觉到，但不影响我的日常活动。",
      moderate:
        "中度 (4-6/10): 疼痛会干扰我，影响我的注意力和工作效率。可能需要非处方止痛药。",
      severe:
        "重度 (7-8/10): 疼痛很强烈，我需要躺下或停止正在做的事情，难以正常活动。",
      verySevere:
        "极重度 (9-10/10): 疼痛使人衰弱，难以忍受。我经常卧床不起，并可能伴有恶心或昏厥等其他症状。",
    },
    en: {
      mild: "Mild (1-3/10): It's noticeable but doesn't stop me from my daily activities.",
      moderate:
        "Moderate (4-6/10): It's disruptive and affects my focus and productivity. I might need over-the-counter pain relief.",
      severe:
        "Severe (7-8/10): The pain is strong enough that I need to lie down or stop what I'm doing. It's difficult to function.",
      verySevere:
        "Very Severe (9-10/10): The pain is debilitating and overwhelming. I'm often bedridden and may experience other symptoms like nausea or fainting.",
    },
  };

  const durationLabels = {
    zh: {
      short: "在第一天持续几个小时。",
      medium: "在经期的前1-2天内疼痛比较严重。",
      long: "持续3天或更长时间。",
      variable: "疼痛不可预测，每个周期的差异很大。",
    },
    en: {
      short: "A few hours on the first day.",
      medium: "It's significant for the first 1-2 days of my period.",
      long: "It persists for 3 or more days.",
      variable: "It's unpredictable and varies greatly from cycle to cycle.",
    },
  };

  summary.push(
    `${locale === "zh" ? "疼痛程度" : "Pain Level"}: ${
      painLevelLabels[locale as keyof typeof painLevelLabels][
        painLevel as keyof typeof painLevelLabels.zh
      ]
    }`,
  );
  summary.push(
    `${locale === "zh" ? "持续时间" : "Duration"}: ${
      durationLabels[locale as keyof typeof durationLabels][
        painDuration as keyof typeof durationLabels.zh
      ]
    }`,
  );

  const localeKey: Locale = locale === "en" ? "en" : "zh";
  const localeTexts = recommendationTexts[localeKey];
  const painLevelKey = painLevel;

  const addBucket = (bucket?: RecommendationBuckets) => {
    if (bucket) {
      appendRecommendations(recommendations.immediate, bucket.immediate);
      appendRecommendations(recommendations.longTerm, bucket.longTerm);
    }
  };

  addBucket(localeTexts[painLevelKey]);

  if (painDuration === "long" && localeTexts.duration.long) {
    appendRecommendations(
      recommendations.immediate,
      localeTexts.duration.long.immediate,
    );
    appendRecommendations(
      recommendations.longTerm,
      localeTexts.duration.long.longTerm,
    );
  } else if (painDuration === "variable" && localeTexts.duration.variable) {
    appendRecommendations(
      recommendations.longTerm,
      localeTexts.duration.variable.longTerm,
    );
  }

  if (Array.isArray(accompanyingSymptoms) && accompanyingSymptoms.length > 0) {
    accompanyingSymptoms.forEach((symptom) => {
      const symptomValues = localeTexts.symptoms[symptom];
      appendRecommendations(recommendations.immediate, symptomValues);
    });
  }

  if (Array.isArray(painLocation) && painLocation.length > 0) {
    painLocation.forEach((location) => {
      const locationValues = localeTexts.location[location];
      appendRecommendations(recommendations.immediate, locationValues);
    });
  }

  if (reliefPreference === "natural") {
    recommendations.immediate.unshift(...localeTexts.natural.immediate);
    appendRecommendations(
      recommendations.longTerm,
      localeTexts.natural.longTerm,
    );
  }
  if (reliefPreference === "medical") {
    recommendations.longTerm.unshift(...localeTexts.medical.longTerm);
  }

  recommendations.immediate = dedupe(recommendations.immediate);
  recommendations.longTerm = dedupe(recommendations.longTerm);

  return {
    isSevere,
    summary,
    recommendations,
    score,
  };
}
// 详细版症状评估算法（13个问题）
export function calculateDetailedImpact(
  answers: SymptomAssessmentInputs,
  locale: Locale = "zh",
) {
  const {
    painLevel,
    painDuration,
    reliefPreference,
    accompanyingSymptoms = [],
    painLocation = [],
    cyclePattern,
    painPattern,
    painTiming,
    medicalHistory = [],
    lifestyleFactors = [],
    functionalImpact,
  } = answers;

  const isSevere = painLevel === "severe" || painLevel === "verySevere";
  const summary: string[] = [];

  // ✅ 详细版评分系统（0-100分）
  let score = 0;

  // 1. 疼痛程度评分（40分）- 核心因素
  const painLevelScores = {
    mild: 10,
    moderate: 20,
    severe: 30,
    verySevere: 40,
  };
  score += painLevelScores[painLevel as keyof typeof painLevelScores] || 0;

  // 2. 持续时间评分（15分）
  const durationScores = {
    short: 5,
    medium: 10,
    long: 15,
    variable: 12,
  };
  score += durationScores[painDuration as keyof typeof durationScores] || 0;

  // 3. 功能影响评分（20分）- 重要新增因素
  const functionalScores = {
    minimal: 5,
    moderate: 10,
    significant: 15,
    severe: 20,
  };
  score +=
    functionalScores[functionalImpact as keyof typeof functionalScores] || 0;

  // 4. 周期模式评分（5分）
  const cycleScores = {
    regular: 1,
    irregular: 3,
    heavy: 4,
    light: 2,
  };
  score += cycleScores[cyclePattern as keyof typeof cycleScores] || 0;

  // 5. 疼痛模式评分（5分）
  const patternScores = {
    cramping: 2,
    constant: 3,
    sharp: 4,
    throbbing: 3,
  };
  score += patternScores[painPattern as keyof typeof patternScores] || 0;

  // 6. 疼痛时机评分（3分）
  const timingScores = {
    beforePeriod: 2,
    firstDay: 3,
    duringPeriod: 2,
    afterPeriod: 1,
  };
  score += timingScores[painTiming as keyof typeof timingScores] || 0;

  // 7. 医疗史加分（最多+5分）
  if (Array.isArray(medicalHistory)) {
    const hasSeriousCondition = medicalHistory.some((condition) =>
      [
        "endometriosis",
        "fibroids",
        "adenomyosis",
        "pelvicInflammatory",
      ].includes(condition),
    );
    if (hasSeriousCondition) {
      score += 5;
    } else if (medicalHistory.length > 0 && !medicalHistory.includes("none")) {
      score += 2;
    }
  }

  // 8. 伴随症状加分（最多+3分）
  if (Array.isArray(accompanyingSymptoms)) {
    score += Math.min(accompanyingSymptoms.length * 0.5, 3);
  }

  // 9. 疼痛位置加分（最多+2分）
  if (Array.isArray(painLocation)) {
    score += Math.min(painLocation.length * 0.5, 2);
  }

  // 10. 生活方式因素加分（最多+2分）
  if (Array.isArray(lifestyleFactors) && !lifestyleFactors.includes("none")) {
    score += Math.min(lifestyleFactors.length * 0.4, 2);
  }

  // 确保分数在0-100范围内
  score = Math.max(0, Math.min(100, Math.round(score)));

  // 使用共享的建议生成函数
  return generateSymptomRecommendations(
    {
      painLevel,
      painDuration,
      reliefPreference,
      accompanyingSymptoms,
      painLocation,
    },
    locale,
    isSevere,
    summary,
    score,
  );
}

// 医疗专业版评估算法（21个问题：13个症状 + 8个职场）
export function calculateMedicalImpact(
  answers: MedicalAssessmentInputs,
  locale: Locale = "zh",
) {
  // 先计算症状部分的评分（占70%）
  const symptomResult = calculateDetailedImpact(answers, locale);
  const symptomScore = (symptomResult.score || 0) * 0.7;

  // 再计算职场部分的评分（占30%）
  const workplaceResult = calculateWorkplaceImpact(answers, locale);
  const workplaceScore = (workplaceResult.score || 0) * 0.3;

  // 综合评分
  const totalScore = Math.round(symptomScore + workplaceScore);

  // 合并建议
  const combinedRecommendations = {
    immediate: [...(symptomResult.recommendations?.immediate || [])],
    longTerm: [
      ...(symptomResult.recommendations?.longTerm || []),
      ...(workplaceResult.suggestions || []),
    ],
  };

  // 去重
  combinedRecommendations.immediate = dedupe(combinedRecommendations.immediate);
  combinedRecommendations.longTerm = dedupe(combinedRecommendations.longTerm);

  return {
    isSevere: symptomResult.isSevere,
    summary: [
      ...(symptomResult.summary || []),
      `${locale === "zh" ? "职场影响评分" : "Workplace Impact Score"}: ${
        workplaceResult.score
      }/100`,
    ],
    recommendations: combinedRecommendations,
    score: totalScore,
    // 保留详细数据供参考
    symptomScore: symptomResult.score,
    workplaceScore: workplaceResult.score,
    profile: workplaceResult.profile,
  };
}

// 简化版症状评估算法（3个问题）
export function calculateSymptomImpact(
  answers: SymptomAssessmentInputs,
  locale: Locale = "zh",
) {
  const {
    painLevel,
    painDuration,
    reliefPreference,
    accompanyingSymptoms = [],
    painLocation = [],
  } = answers;
  const isSevere = painLevel === "severe" || painLevel === "verySevere";
  const summary: string[] = [];

  // ✅ 添加评分计算逻辑
  let score = 0;

  // 1. 疼痛程度评分（60分）- 最重要的因素
  const painLevelScores = {
    mild: 15,
    moderate: 30,
    severe: 45,
    verySevere: 60,
  };
  score += painLevelScores[painLevel as keyof typeof painLevelScores] || 0;

  // 2. 持续时间评分（30分）
  const durationScores = {
    short: 10,
    medium: 20,
    long: 30,
    variable: 25,
  };
  score += durationScores[painDuration as keyof typeof durationScores] || 0;

  // 3. 缓解偏好评分（10分）- 反映严重程度
  const preferenceScores = {
    instant: 5,
    natural: 3,
    longTerm: 5,
    medical: 10,
  };
  score +=
    preferenceScores[reliefPreference as keyof typeof preferenceScores] || 0;

  // 4. 伴随症状加分（最多+10分）
  if (Array.isArray(accompanyingSymptoms)) {
    score += Math.min(accompanyingSymptoms.length * 2, 10);
  }

  // 5. 疼痛位置加分（最多+5分）
  if (Array.isArray(painLocation)) {
    score += Math.min(painLocation.length * 1, 5);
  }

  // 确保分数在0-100范围内
  score = Math.max(0, Math.min(100, Math.round(score)));

  // 使用共享的建议生成函数
  return generateSymptomRecommendations(
    {
      painLevel,
      painDuration,
      reliefPreference,
      accompanyingSymptoms,
      painLocation,
    },
    locale,
    isSevere,
    summary,
    score,
  );
}

// 职场评分算法
export function calculateWorkplaceImpact(
  answers: WorkplaceAssessmentInputs,
  locale: Locale = "zh",
) {
  let score = 0;
  const suggestions: string[] = [];
  let profile = "";

  // 注意力影响评分
  if (answers.concentration) {
    switch (answers.concentration) {
      case "none":
        score += 33;
        break;
      case "slight":
        score += 20;
        break;
      case "difficult":
        score += 10;
        break;
      case "impossible":
        score += 0;
        break;
    }
  }

  // 缺勤情况评分
  if (answers.absenteeism) {
    switch (answers.absenteeism) {
      case "never":
        score += 33;
        break;
      case "rarely":
        score += 20;
        break;
      case "sometimes":
        score += 10;
        break;
      case "frequently":
        score += 0;
        break;
    }
  }

  // 沟通舒适度评分
  if (answers.communication) {
    switch (answers.communication) {
      case "comfortable":
        score += 34;
        break;
      case "hesitant":
        score += 15;
        break;
      case "uncomfortable":
        score += 5;
        break;
      case "na":
        score += 15;
        break;
    }
  }

  score = Math.round(score);

  // 职场档案分类和建议
  const localeKey: Locale = locale === "en" ? "en" : "zh";
  const localeSuggestions = suggestionTexts[localeKey];

  if (score > 75) {
    profile = localeSuggestions.supportive.profile;
    suggestions.push(...localeSuggestions.supportive.suggestions);
  } else if (score > 40) {
    profile = localeSuggestions.adaptive.profile;
    suggestions.push(...localeSuggestions.adaptive.suggestions);
  } else {
    profile = localeSuggestions.challenging.profile;
    suggestions.push(...localeSuggestions.challenging.suggestions);
  }

  return {
    score,
    profile,
    suggestions,
  };
}
