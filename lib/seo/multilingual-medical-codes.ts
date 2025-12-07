/**
 * Multilingual Medical Codes System
 * 多语言医学编码系统
 *
 * 扩展医学实体数据库，支持多语言编码映射
 * 确保不同语言环境下的编码一致性
 */

import { MEDICAL_ENTITIES, MedicalEntity } from "./medical-entities";

/**
 * 多语言编码映射接口
 */
export interface MultilingualCode {
  /** 编码系统 */
  codingSystem: string;
  /** 编码值 */
  code: string;
  /** 语言环境 */
  locale: "en" | "zh" | "all";
  /** 编码描述（英文） */
  descriptionEn?: string;
  /** 编码描述（中文） */
  descriptionZh?: string;
}

/**
 * 多语言医学编码映射表
 */
export const MULTILINGUAL_MEDICAL_CODES: Record<
  keyof typeof MEDICAL_ENTITIES,
  MultilingualCode[]
> = {
  DYSMENORRHEA: [
    {
      codingSystem: "ICD-10",
      code: "N94.6",
      locale: "all",
      descriptionEn: "Dysmenorrhea, unspecified",
      descriptionZh: "痛经，未特指",
    },
    {
      codingSystem: "ICD-10-CM",
      code: "N94.6",
      locale: "all",
      descriptionEn: "Dysmenorrhea, unspecified",
      descriptionZh: "痛经，未特指",
    },
    {
      codingSystem: "SNOMED CT",
      code: "266599006",
      locale: "all",
      descriptionEn: "Dysmenorrhea (disorder)",
      descriptionZh: "痛经（疾病）",
    },
    {
      codingSystem: "MeSH",
      code: "D004412",
      locale: "all",
      descriptionEn: "Dysmenorrhea",
      descriptionZh: "痛经",
    },
    {
      codingSystem: "ICD-11",
      code: "GA34.4",
      locale: "all",
      descriptionEn: "Dysmenorrhea",
      descriptionZh: "痛经",
    },
  ],
  ENDOMETRIOSIS: [
    {
      codingSystem: "ICD-10",
      code: "N80.9",
      locale: "all",
      descriptionEn: "Endometriosis, unspecified",
      descriptionZh: "子宫内膜异位症，未特指",
    },
    {
      codingSystem: "SNOMED CT",
      code: "129127001",
      locale: "all",
      descriptionEn: "Endometriosis (disorder)",
      descriptionZh: "子宫内膜异位症（疾病）",
    },
    {
      codingSystem: "MeSH",
      code: "D004715",
      locale: "all",
      descriptionEn: "Endometriosis",
      descriptionZh: "子宫内膜异位症",
    },
  ],
  PMS: [
    {
      codingSystem: "ICD-10",
      code: "N94.3",
      locale: "all",
      descriptionEn: "Premenstrual tension syndrome",
      descriptionZh: "经前期紧张综合征",
    },
    {
      codingSystem: "SNOMED CT",
      code: "192080009",
      locale: "all",
      descriptionEn: "Premenstrual syndrome (disorder)",
      descriptionZh: "经前期综合征（疾病）",
    },
    {
      codingSystem: "MeSH",
      code: "D011293",
      locale: "all",
      descriptionEn: "Premenstrual Syndrome",
      descriptionZh: "经前期综合征",
    },
  ],
  PREMENSTRUAL_DYSPHORIC_DISORDER: [
    {
      codingSystem: "ICD-10",
      code: "F32.81",
      locale: "all",
      descriptionEn: "Premenstrual dysphoric disorder",
      descriptionZh: "经前焦虑障碍",
    },
    {
      codingSystem: "SNOMED CT",
      code: "192080009",
      locale: "all",
      descriptionEn: "Premenstrual dysphoric disorder (disorder)",
      descriptionZh: "经前焦虑障碍（疾病）",
    },
  ],
  NSAID_DRUGS: [
    {
      codingSystem: "RxNorm",
      code: "5640",
      locale: "all",
      descriptionEn: "Ibuprofen",
      descriptionZh: "布洛芬",
    },
    {
      codingSystem: "RxNorm",
      code: "4337",
      locale: "all",
      descriptionEn: "Naproxen",
      descriptionZh: "萘普生",
    },
  ],
  HORMONAL_CONTRACEPTION: [],
  HEAT_THERAPY: [],
  LIFESTYLE_MODIFICATIONS: [],
  SSRI_ANTIDEPRESSANTS: [],
  SURGERY: [],
};

/**
 * 获取实体的多语言编码
 *
 * @param entityKey 实体键
 * @param locale 语言环境
 * @param codingSystem 编码系统（可选）
 * @returns 编码数组
 */
export function getMultilingualCodes(
  entityKey: keyof typeof MEDICAL_ENTITIES,
  locale: "en" | "zh" = "en",
  codingSystem?: string,
): MultilingualCode[] {
  const codes = MULTILINGUAL_MEDICAL_CODES[entityKey] || [];

  // 过滤语言环境
  let filteredCodes = codes.filter(
    (code) => code.locale === "all" || code.locale === locale,
  );

  // 如果指定了编码系统，进一步过滤
  if (codingSystem) {
    filteredCodes = filteredCodes.filter(
      (code) => code.codingSystem === codingSystem,
    );
  }

  return filteredCodes;
}

/**
 * 获取编码的描述（根据语言环境）
 *
 * @param code 编码对象
 * @param locale 语言环境
 * @returns 描述文本
 */
export function getCodeDescription(
  code: MultilingualCode,
  locale: "en" | "zh" = "en",
): string {
  if (locale === "zh" && code.descriptionZh) {
    return code.descriptionZh;
  }
  return code.descriptionEn || code.code;
}

/**
 * 生成多语言编码的 Schema.org MedicalCode 数组
 *
 * @param entityKey 实体键
 * @param locale 语言环境
 * @returns MedicalCode 数组
 */
export function generateMultilingualMedicalCodes(
  entityKey: keyof typeof MEDICAL_ENTITIES,
  locale: "en" | "zh" = "en",
): Array<{
  "@type": "MedicalCode";
  code: string;
  codingSystem: string;
  description?: string;
}> {
  const codes = getMultilingualCodes(entityKey, locale);

  return codes.map((code) => ({
    "@type": "MedicalCode",
    code: code.code,
    codingSystem: code.codingSystem,
    description: getCodeDescription(code, locale),
  }));
}

/**
 * 合并基础编码和多语言编码
 *
 * @param entity 医学实体
 * @param entityKey 实体键
 * @param locale 语言环境
 * @returns 合并后的编码数组
 */
export function mergeMedicalCodes(
  entity: MedicalEntity,
  entityKey: keyof typeof MEDICAL_ENTITIES,
  locale: "en" | "zh" = "en",
): Array<{
  "@type": "MedicalCode";
  code: string;
  codingSystem: string;
  description?: string;
}> {
  const baseCodes: Array<{
    "@type": "MedicalCode";
    code: string;
    codingSystem: string;
  }> = [];

  // 添加基础编码
  if (entity.icd10) {
    baseCodes.push({
      "@type": "MedicalCode",
      code: entity.icd10,
      codingSystem: "ICD-10",
    });
  }

  if (entity.snomed) {
    baseCodes.push({
      "@type": "MedicalCode",
      code: entity.snomed,
      codingSystem: "SNOMED CT",
    });
  }

  if (entity.mesh) {
    baseCodes.push({
      "@type": "MedicalCode",
      code: entity.mesh,
      codingSystem: "MeSH",
    });
  }

  // 获取多语言编码
  const multilingualCodes = generateMultilingualMedicalCodes(entityKey, locale);

  // 合并并去重（基于 codingSystem 和 code）
  const merged = [...baseCodes];
  const existing = new Set(baseCodes.map((c) => `${c.codingSystem}:${c.code}`));

  for (const code of multilingualCodes) {
    const key = `${code.codingSystem}:${code.code}`;
    if (!existing.has(key)) {
      merged.push(code);
      existing.add(key);
    }
  }

  return merged;
}






