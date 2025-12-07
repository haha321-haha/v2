// utils/lunaEngine.ts

export interface LunaLink {
  label: string;
  url: string;
}

export interface LunaResponse {
  text: string;
  links?: LunaLink[];
}

interface LunaRule {
  keywords: string[];
  responseKey: string; // Translation key instead of hardcoded text
  links?: { labelKey: string; url: string }[]; // Translation key for labels
}

// Rules with both English and Chinese keywords
const RULES: LunaRule[] = [
  {
    keywords: [
      "pain",
      "cramp",
      "hurt",
      "ache",
      "sore",
      "discomfort",
      "痛",
      "疼",
      "痛经",
      "缓解",
      "减轻",
      "如何缓解",
    ],
    responseKey: "responses.pain",
    links: [
      {
        labelKey: "links.openPainTracker",
        url: "/interactive-tools/pain-tracker",
      },
      { labelKey: "links.reliefMethods", url: "/health-guide/relief-methods" },
      {
        labelKey: "links.understandingPain",
        url: "/health-guide/understanding-pain",
      },
    ],
  },
  {
    keywords: [
      "cycle",
      "period",
      "late",
      "bleeding",
      "flow",
      "menstruation",
      "周期",
      "月经",
      "追踪",
      "追踪周期",
    ],
    responseKey: "responses.cycle",
    links: [
      {
        labelKey: "links.openCycleTracker",
        url: "/interactive-tools/cycle-tracker",
      },
    ],
  },
  {
    keywords: [
      "privacy",
      "data",
      "store",
      "save",
      "security",
      "隐私",
      "数据",
      "安全",
      "数据安全",
    ],
    responseKey: "responses.privacy",
  },
  {
    keywords: [
      "guide",
      "article",
      "read",
      "info",
      "learn",
      "download",
      "指南",
      "文章",
      "下载",
      "健康指南",
    ],
    responseKey: "responses.guide",
    links: [{ labelKey: "links.viewGuides", url: "/downloads" }],
  },
  {
    keywords: ["hello", "hi", "hey", "start", "你好", "嗨", "开始"],
    responseKey: "responses.hello",
  },
  {
    keywords: [
      "mood",
      "sad",
      "angry",
      "happy",
      "emotion",
      "情绪",
      "心情",
      "情感",
    ],
    responseKey: "responses.mood",
    links: [{ labelKey: "links.logMood", url: "#pain-tracker" }],
  },
  {
    keywords: ["acne", "pimple", "skin", "breakout", "痘", "痤疮", "皮肤"],
    responseKey: "responses.acne",
    links: [{ labelKey: "links.healthGuides", url: "/health-guide" }],
  },
  {
    keywords: [
      "iud",
      "birth control",
      "contraception",
      "coil",
      "节育器",
      "避孕",
      "环",
    ],
    responseKey: "responses.contraception",
    links: [{ labelKey: "links.healthGuides", url: "/health-guide" }],
  },
  {
    keywords: [
      "fertility",
      "pregnant",
      "baby",
      "conception",
      "ovulation",
      "备孕",
      "怀孕",
      "排卵",
      "生宝宝",
    ],
    responseKey: "responses.fertility",
    links: [
      {
        labelKey: "links.openCycleTracker",
        url: "/interactive-tools/cycle-tracker",
      },
    ],
  },
  {
    keywords: [
      "menopause",
      "hot flash",
      "aging",
      "perimenopause",
      "绝经",
      "更年期",
      "围绝经",
      "潮热",
      "衰老",
    ],
    responseKey: "responses.menopause",
    links: [{ labelKey: "links.healthGuides", url: "/health-guide" }],
  },
  {
    keywords: [
      "sleep",
      "insomnia",
      "tired",
      "fatigue",
      "睡眠",
      "失眠",
      "累",
      "疲劳",
    ],
    responseKey: "responses.sleep",
    links: [
      { labelKey: "links.reliefMethods", url: "/health-guide/relief-methods" },
    ],
  },
];

const DEFAULT_RESPONSE_KEYS = [
  "responses.default1",
  "responses.default2",
  "responses.default3",
];

export const processLunaQuery = (
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: "en" | "zh" = "en",
): LunaResponse => {
  const normalizedQuery = query.toLowerCase();

  // Check for keyword matches
  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => normalizedQuery.includes(keyword))) {
      // Return response key instead of hardcoded text
      // The component will translate it
      return {
        text: rule.responseKey, // This will be a translation key
        links: rule.links?.map((link) => ({
          label: link.labelKey, // This will be a translation key
          url: link.url,
        })),
      };
    }
  }

  // Return a random default response key if no match found
  const defaultKey =
    DEFAULT_RESPONSE_KEYS[
      Math.floor(Math.random() * DEFAULT_RESPONSE_KEYS.length)
    ];
  return {
    text: defaultKey,
    links: [{ label: "links.healthGuides", url: "/downloads" }],
  };
};

import { AGE_BASED_QUESTIONS } from "../constants/lunaSuggestions";

// Suggested questions interface
export interface SuggestedQuestionsContext {
  hasCycleData?: boolean;
  hasPainEntries?: boolean;
  lastQuery?: string;
  locale?: "en" | "zh";
  userAge?: number;
}

/**
 * Get suggested questions based on context and age
 * @param context - User context (cycle data, pain entries, last query, locale, age)
 * @returns Array of suggested questions (max 3)
 */
export function getSuggestedQuestions(
  context?: SuggestedQuestionsContext,
): string[] {
  const locale =
    context?.locale ||
    (typeof window !== "undefined"
      ? window.location.pathname.includes("/zh")
        ? "zh"
        : "en"
      : "en");

  const questionsPool =
    locale === "zh" ? AGE_BASED_QUESTIONS.zh : AGE_BASED_QUESTIONS.en;
  let ageGroupQuestions: string[] = [];

  // Determine age group
  if (context?.userAge) {
    const age = context.userAge;
    if (age < 20) {
      ageGroupQuestions = questionsPool.under20;
    } else if (age >= 20 && age < 35) {
      ageGroupQuestions = questionsPool.age20to34;
    } else if (age >= 35 && age < 40) {
      ageGroupQuestions = questionsPool.age35to39;
    } else if (age >= 40 && age < 45) {
      ageGroupQuestions = questionsPool.age40to45;
    } else {
      ageGroupQuestions = questionsPool.over45;
    }
  } else {
    // Default pool if age is unknown
    ageGroupQuestions = questionsPool.default;
  }

  // Randomly select 3 unique questions
  const shuffled = [...ageGroupQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}
