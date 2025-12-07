/**
 * Medical Terminology Standardization System
 * 医学术语标准化系统
 *
 * 提供医学术语的标准化、同义词映射、多语言支持
 * 确保整个应用中术语使用的一致性
 */

import { MEDICAL_ENTITIES } from "./medical-entities";

/**
 * 医学术语映射接口
 */
export interface MedicalTermMapping {
  /** 标准术语（英文） */
  standardTerm: string;
  /** 标准术语（中文） */
  standardTermZh: string;
  /** 同义词列表（英文） */
  synonyms: string[];
  /** 同义词列表（中文） */
  synonymsZh: string[];
  /** 相关术语 */
  relatedTerms: string[];
  /** 实体键（关联到 MEDICAL_ENTITIES） */
  entityKey?: keyof typeof MEDICAL_ENTITIES;
}

/**
 * 医学术语标准化映射表
 */
export const MEDICAL_TERMINOLOGY: Record<string, MedicalTermMapping> = {
  // 痛经相关术语
  dysmenorrhea: {
    standardTerm: "Dysmenorrhea",
    standardTermZh: "痛经",
    synonyms: [
      "Period Pain",
      "Menstrual Cramps",
      "Menstrual Pain",
      "Period Cramps",
      "Menstrual Discomfort",
    ],
    synonymsZh: ["月经痛", "经期疼痛", "月经痉挛", "经期不适", "痛经症"],
    relatedTerms: ["Endometriosis", "PMS", "Menstrual Cycle"],
    entityKey: "DYSMENORRHEA",
  },
  "period-pain": {
    standardTerm: "Dysmenorrhea",
    standardTermZh: "痛经",
    synonyms: ["Period Pain", "Menstrual Cramps"],
    synonymsZh: ["月经痛", "经期疼痛"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "DYSMENORRHEA",
  },
  "menstrual-cramps": {
    standardTerm: "Dysmenorrhea",
    standardTermZh: "痛经",
    synonyms: ["Menstrual Cramps", "Period Pain"],
    synonymsZh: ["月经痉挛", "月经痛"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "DYSMENORRHEA",
  },
  痛经: {
    standardTerm: "Dysmenorrhea",
    standardTermZh: "痛经",
    synonyms: ["Period Pain", "Menstrual Cramps"],
    synonymsZh: ["月经痛", "经期疼痛"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "DYSMENORRHEA",
  },
  月经痛: {
    standardTerm: "Dysmenorrhea",
    standardTermZh: "痛经",
    synonyms: ["Period Pain", "Menstrual Cramps"],
    synonymsZh: ["痛经", "经期疼痛"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "DYSMENORRHEA",
  },

  // 子宫内膜异位症
  endometriosis: {
    standardTerm: "Endometriosis",
    standardTermZh: "子宫内膜异位症",
    synonyms: ["Endometrial Disease", "Endometrial Disorder"],
    synonymsZh: ["内膜异位", "子宫内膜症"],
    relatedTerms: ["Dysmenorrhea", "Infertility"],
    entityKey: "ENDOMETRIOSIS",
  },
  子宫内膜异位症: {
    standardTerm: "Endometriosis",
    standardTermZh: "子宫内膜异位症",
    synonyms: ["Endometrial Disease"],
    synonymsZh: ["内膜异位"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "ENDOMETRIOSIS",
  },

  // 经前期综合征
  pms: {
    standardTerm: "Premenstrual Syndrome",
    standardTermZh: "经前期综合征",
    synonyms: ["PMS", "Premenstrual Tension"],
    synonymsZh: ["经前综合征", "经前紧张症"],
    relatedTerms: ["Dysmenorrhea", "PMDD"],
    entityKey: "PMS",
  },
  "premenstrual-syndrome": {
    standardTerm: "Premenstrual Syndrome",
    standardTermZh: "经前期综合征",
    synonyms: ["PMS"],
    synonymsZh: ["经前综合征"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "PMS",
  },
  经前期综合征: {
    standardTerm: "Premenstrual Syndrome",
    standardTermZh: "经前期综合征",
    synonyms: ["PMS"],
    synonymsZh: ["经前综合征"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "PMS",
  },

  // 非甾体抗炎药
  nsaid: {
    standardTerm: "Nonsteroidal Anti-inflammatory Drugs",
    standardTermZh: "非甾体抗炎药",
    synonyms: ["NSAIDs", "Anti-inflammatory Drugs"],
    synonymsZh: ["消炎药", "抗炎药"],
    relatedTerms: ["Ibuprofen", "Naproxen"],
    entityKey: "NSAID_DRUGS",
  },
  nsaids: {
    standardTerm: "Nonsteroidal Anti-inflammatory Drugs",
    standardTermZh: "非甾体抗炎药",
    synonyms: ["NSAID", "Anti-inflammatory Drugs"],
    synonymsZh: ["消炎药", "抗炎药"],
    relatedTerms: ["Ibuprofen", "Naproxen"],
    entityKey: "NSAID_DRUGS",
  },
  非甾体抗炎药: {
    standardTerm: "Nonsteroidal Anti-inflammatory Drugs",
    standardTermZh: "非甾体抗炎药",
    synonyms: ["NSAIDs"],
    synonymsZh: ["消炎药", "抗炎药"],
    relatedTerms: ["Ibuprofen"],
    entityKey: "NSAID_DRUGS",
  },

  // 新增术语映射
  pmdd: {
    standardTerm: "Premenstrual Dysphoric Disorder",
    standardTermZh: "经前焦虑障碍",
    synonyms: ["PMDD", "Premenstrual Dysphoric Disorder"],
    synonymsZh: ["经前不悦症", "经前焦虑症"],
    relatedTerms: ["PMS", "Dysmenorrhea"],
    entityKey: "PREMENSTRUAL_DYSPHORIC_DISORDER",
  },
  经前焦虑障碍: {
    standardTerm: "Premenstrual Dysphoric Disorder",
    standardTermZh: "经前焦虑障碍",
    synonyms: ["PMDD"],
    synonymsZh: ["经前不悦症"],
    relatedTerms: ["PMS"],
    entityKey: "PREMENSTRUAL_DYSPHORIC_DISORDER",
  },

  menorrhagia: {
    standardTerm: "Menorrhagia",
    standardTermZh: "月经过多",
    synonyms: ["Heavy Menstrual Bleeding", "Heavy Periods"],
    synonymsZh: ["经血过多", "月经量多"],
    relatedTerms: ["Dysmenorrhea", "Endometriosis"],
    entityKey: "MENORRHAGIA",
  },
  月经过多: {
    standardTerm: "Menorrhagia",
    standardTermZh: "月经过多",
    synonyms: ["Heavy Menstrual Bleeding"],
    synonymsZh: ["经血过多"],
    relatedTerms: ["Dysmenorrhea"],
    entityKey: "MENORRHAGIA",
  },

  amenorrhea: {
    standardTerm: "Amenorrhea",
    standardTermZh: "闭经",
    synonyms: ["Absent Menstruation", "Missing Periods"],
    synonymsZh: ["无月经", "停经"],
    relatedTerms: ["PCOS", "Infertility"],
    entityKey: "AMENORRHEA",
  },
  闭经: {
    standardTerm: "Amenorrhea",
    standardTermZh: "闭经",
    synonyms: ["Absent Menstruation"],
    synonymsZh: ["无月经"],
    relatedTerms: ["PCOS"],
    entityKey: "AMENORRHEA",
  },

  pcos: {
    standardTerm: "Polycystic Ovary Syndrome",
    standardTermZh: "多囊卵巢综合征",
    synonyms: ["PCOS", "Polycystic Ovarian Syndrome"],
    synonymsZh: ["多囊症", "多囊卵巢症"],
    relatedTerms: ["Amenorrhea", "Infertility"],
    entityKey: "POLYCYSTIC_OVARY_SYNDROME",
  },
  多囊卵巢综合征: {
    standardTerm: "Polycystic Ovary Syndrome",
    standardTermZh: "多囊卵巢综合征",
    synonyms: ["PCOS"],
    synonymsZh: ["多囊症"],
    relatedTerms: ["Amenorrhea"],
    entityKey: "POLYCYSTIC_OVARY_SYNDROME",
  },

  fibroids: {
    standardTerm: "Uterine Fibroids",
    standardTermZh: "子宫肌瘤",
    synonyms: ["Leiomyoma", "Uterine Myoma"],
    synonymsZh: ["肌瘤", "子宫平滑肌瘤"],
    relatedTerms: ["Menorrhagia", "Dysmenorrhea"],
    entityKey: "FIBROIDS",
  },
  子宫肌瘤: {
    standardTerm: "Uterine Fibroids",
    standardTermZh: "子宫肌瘤",
    synonyms: ["Leiomyoma"],
    synonymsZh: ["肌瘤"],
    relatedTerms: ["Menorrhagia"],
    entityKey: "FIBROIDS",
  },

  infertility: {
    standardTerm: "Infertility",
    standardTermZh: "不孕症",
    synonyms: ["Sterility", "Inability to Conceive"],
    synonymsZh: ["不育症", "不能生育"],
    relatedTerms: ["Endometriosis", "PCOS"],
    entityKey: "INFERTILITY",
  },
  不孕症: {
    standardTerm: "Infertility",
    standardTermZh: "不孕症",
    synonyms: ["Sterility"],
    synonymsZh: ["不育症"],
    relatedTerms: ["Endometriosis"],
    entityKey: "INFERTILITY",
  },
};

/**
 * 标准化医学术语
 *
 * @param term 输入的术语（可以是同义词或变体）
 * @param locale 语言环境
 * @returns 标准术语
 */
export function standardizeMedicalTerm(
  term: string,
  locale: "en" | "zh" = "en",
): string {
  // 规范化输入：转小写、去除空格和连字符
  const normalized = term
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // 查找映射
  const mapping = MEDICAL_TERMINOLOGY[normalized] || MEDICAL_TERMINOLOGY[term];

  if (mapping) {
    return locale === "zh" ? mapping.standardTermZh : mapping.standardTerm;
  }

  // 如果没有找到映射，尝试模糊匹配
  for (const [, value] of Object.entries(MEDICAL_TERMINOLOGY)) {
    const allTerms = [
      value.standardTerm.toLowerCase(),
      value.standardTermZh,
      ...value.synonyms.map((s) => s.toLowerCase()),
      ...value.synonymsZh,
    ];

    if (
      allTerms.some((t) => t.includes(normalized) || normalized.includes(t))
    ) {
      return locale === "zh" ? value.standardTermZh : value.standardTerm;
    }
  }

  // 如果都没找到，返回原术语
  return term;
}

/**
 * 获取术语的所有同义词
 *
 * @param term 术语
 * @param locale 语言环境
 * @returns 同义词数组（包含标准术语）
 */
export function getMedicalTermSynonyms(
  term: string,
  locale: "en" | "zh" = "en",
): string[] {
  const normalized = term
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const mapping = MEDICAL_TERMINOLOGY[normalized] || MEDICAL_TERMINOLOGY[term];

  if (mapping) {
    const standard =
      locale === "zh" ? mapping.standardTermZh : mapping.standardTerm;
    const synonyms = locale === "zh" ? mapping.synonymsZh : mapping.synonyms;
    return [standard, ...synonyms];
  }

  return [term];
}

/**
 * 检查两个术语是否指向同一个医学概念
 *
 * @param term1 术语1
 * @param term2 术语2
 * @returns 是否相同
 */
export function areTermsEquivalent(term1: string, term2: string): boolean {
  const standard1 = standardizeMedicalTerm(term1);
  const standard2 = standardizeMedicalTerm(term2);
  return standard1 === standard2;
}

/**
 * 获取术语的实体键（如果存在）
 *
 * @param term 术语
 * @returns 实体键或 undefined
 */
export function getTermEntityKey(
  term: string,
): keyof typeof MEDICAL_ENTITIES | undefined {
  const normalized = term
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const mapping = MEDICAL_TERMINOLOGY[normalized] || MEDICAL_TERMINOLOGY[term];
  return mapping?.entityKey;
}

/**
 * 术语映射缓存
 * 缓存已处理的正则表达式和标记结果
 */
interface TermCacheEntry {
  regex: RegExp;
  standardTerm: string;
  entityKey: string;
}

interface TextCacheEntry {
  markedText: string;
  timestamp: number;
}

// 缓存配置
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟
const MAX_CACHE_SIZE = 1000; // 最大缓存条目数

// 正则表达式缓存（按语言环境）
const regexCache: Record<string, TermCacheEntry[]> = {};

// 文本处理结果缓存
const textCache = new Map<string, TextCacheEntry>();

/**
 * 初始化正则表达式缓存
 */
function initializeRegexCache(locale: "en" | "zh"): TermCacheEntry[] {
  const cacheKey = locale;

  if (regexCache[cacheKey]) {
    return regexCache[cacheKey];
  }

  const entries: TermCacheEntry[] = [];

  for (const [, mapping] of Object.entries(MEDICAL_TERMINOLOGY)) {
    const standardTerm =
      locale === "zh" ? mapping.standardTermZh : mapping.standardTerm;
    const allTerms = [
      standardTerm,
      ...(locale === "zh" ? mapping.synonymsZh : mapping.synonyms),
    ];

    for (const term of allTerms) {
      // 转义特殊字符并创建正则表达式
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedTerm}\\b`, "gi");

      entries.push({
        regex,
        standardTerm,
        entityKey: mapping.entityKey || "",
      });
    }
  }

  // 按术语长度降序排序，优先匹配长术语
  entries.sort((a, b) => {
    const aLen = a.regex.source.length;
    const bLen = b.regex.source.length;
    return bLen - aLen;
  });

  regexCache[cacheKey] = entries;
  return entries;
}

/**
 * 清理过期的文本缓存
 */
function cleanTextCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of textCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => textCache.delete(key));

  // 如果缓存仍然太大，删除最旧的条目
  if (textCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = Array.from(textCache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp,
    );

    const toDelete = sortedEntries.slice(0, textCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => textCache.delete(key));
  }
}

/**
 * 在文本中标记医学术语（优化版本，带缓存）
 *
 * @param text 文本
 * @param locale 语言环境
 * @returns 标记后的文本（包含 data-medical-term 属性）
 */
export function markMedicalTermsInText(
  text: string,
  locale: "en" | "zh" = "en",
): string {
  // 空文本直接返回
  if (!text || text.trim().length === 0) {
    return text;
  }

  // 检查文本缓存
  const cacheKey = `${locale}:${text}`;
  const cached = textCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.markedText;
  }

  // 定期清理缓存
  if (textCache.size > MAX_CACHE_SIZE * 0.8) {
    cleanTextCache();
  }

  // 获取或初始化正则表达式缓存
  const regexEntries = initializeRegexCache(locale);

  let markedText = text;
  const processedRanges: Array<{ start: number; end: number }> = [];

  // 使用更高效的匹配策略
  for (const entry of regexEntries) {
    let match;
    const matches: Array<{
      index: number;
      length: number;
      replacement: string;
    }> = [];

    // 收集所有匹配项
    while ((match = entry.regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // 检查是否与已处理的区域重叠
      const overlaps = processedRanges.some(
        (range) => start < range.end && end > range.start,
      );

      if (!overlaps) {
        matches.push({
          index: start,
          length: match[0].length,
          replacement: `<span data-medical-term="${entry.standardTerm}" data-entity-key="${entry.entityKey}">${match[0]}</span>`,
        });
        processedRanges.push({ start, end });
      }
    }

    // 从后往前替换，避免索引偏移问题
    matches.reverse().forEach(({ index, length, replacement }) => {
      markedText =
        markedText.slice(0, index) +
        replacement +
        markedText.slice(index + length);
    });
  }

  // 缓存结果
  textCache.set(cacheKey, {
    markedText,
    timestamp: Date.now(),
  });

  return markedText;
}

/**
 * 清除所有缓存（用于测试或内存管理）
 */
export function clearTerminologyCache(): void {
  Object.keys(regexCache).forEach((key) => delete regexCache[key]);
  textCache.clear();
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): {
  regexCacheSize: number;
  textCacheSize: number;
  textCacheEntries: number;
} {
  return {
    regexCacheSize: Object.keys(regexCache).length,
    textCacheSize: textCache.size,
    textCacheEntries: textCache.size,
  };
}
