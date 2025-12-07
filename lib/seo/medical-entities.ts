/**
 * Medical Entities Database
 * 医学实体数据库
 *
 * 包含医学病症、药物、治疗方法的标准化编码
 * 支持 ICD-10, SNOMED CT, MeSH, RxNorm 等编码系统
 */

export interface MedicalEntity {
  name: string;
  alternateName: string[];
  icd10?: string;
  snomed?: string;
  mesh?: string;
  rxnorm?: string[];
  category?: string;
  relatedConditions?: string[];
  associatedAnatomy?: string[];
  possibleTreatment?: string[];
}

export const MEDICAL_ENTITIES: Record<string, MedicalEntity> = {
  DYSMENORRHEA: {
    name: "Dysmenorrhea",
    alternateName: ["Period Pain", "Menstrual Cramps", "痛经", "月经痛"],
    icd10: "N94.6",
    snomed: "266599006",
    mesh: "D004412",
    category: "Gynecological Condition",
    relatedConditions: [
      "ENDOMETRIOSIS",
      "PMS",
      "PREMENSTRUAL_DYSPHORIC_DISORDER",
    ],
    associatedAnatomy: ["Uterus", "Pelvis"],
    possibleTreatment: [
      "NSAID_DRUGS",
      "HORMONAL_CONTRACEPTION",
      "HEAT_THERAPY",
    ],
  },
  ENDOMETRIOSIS: {
    name: "Endometriosis",
    alternateName: ["子宫内膜异位症"],
    icd10: "N80.9",
    snomed: "129127001",
    mesh: "D004715",
    category: "Gynecological Condition",
    relatedConditions: ["DYSMENORRHEA", "INFERTILITY"],
    associatedAnatomy: ["Uterus", "Pelvis", "Ovaries"],
    possibleTreatment: ["HORMONAL_CONTRACEPTION", "SURGERY"],
  },
  PMS: {
    name: "Premenstrual Syndrome",
    alternateName: ["PMS", "经前期综合征"],
    icd10: "N94.3",
    snomed: "192080009",
    mesh: "D011293",
    category: "Gynecological Condition",
    relatedConditions: ["DYSMENORRHEA", "PREMENSTRUAL_DYSPHORIC_DISORDER"],
    associatedAnatomy: ["Reproductive System"],
    possibleTreatment: ["HORMONAL_CONTRACEPTION", "LIFESTYLE_MODIFICATIONS"],
  },
  PREMENSTRUAL_DYSPHORIC_DISORDER: {
    name: "Premenstrual Dysphoric Disorder",
    alternateName: ["PMDD", "经前焦虑障碍"],
    icd10: "F32.81",
    snomed: "192080009",
    mesh: "D011293",
    category: "Psychiatric Condition",
    relatedConditions: ["PMS", "DYSMENORRHEA"],
    associatedAnatomy: ["Reproductive System", "Brain"],
    possibleTreatment: ["SSRI_ANTIDEPRESSANTS", "HORMONAL_CONTRACEPTION"],
  },
  NSAID_DRUGS: {
    name: "Nonsteroidal Anti-inflammatory Drugs",
    alternateName: ["NSAIDs", "非甾体抗炎药"],
    rxnorm: ["5640", "4337", "197806"], // Ibuprofen, Naproxen, Aspirin
    category: "Anti-inflammatory",
    possibleTreatment: ["DYSMENORRHEA", "ENDOMETRIOSIS"],
  },
  HORMONAL_CONTRACEPTION: {
    name: "Hormonal Contraception",
    alternateName: ["Hormonal Birth Control", "激素避孕", "口服避孕药"],
    category: "Hormonal Treatment",
    possibleTreatment: ["DYSMENORRHEA", "ENDOMETRIOSIS", "PMS"],
  },
  HEAT_THERAPY: {
    name: "Heat Therapy",
    alternateName: ["Thermotherapy", "热敷疗法"],
    category: "Physical Therapy",
    possibleTreatment: ["DYSMENORRHEA"],
  },
  LIFESTYLE_MODIFICATIONS: {
    name: "Lifestyle Modifications",
    alternateName: ["生活方式调整"],
    category: "Non-pharmacological Treatment",
    possibleTreatment: ["PMS", "DYSMENORRHEA"],
  },
  SSRI_ANTIDEPRESSANTS: {
    name: "Selective Serotonin Reuptake Inhibitors",
    alternateName: ["SSRIs", "选择性血清素再摄取抑制剂"],
    category: "Psychiatric Medication",
    possibleTreatment: ["PREMENSTRUAL_DYSPHORIC_DISORDER"],
  },
  SURGERY: {
    name: "Surgical Treatment",
    alternateName: ["手术治疗"],
    category: "Surgical Intervention",
    possibleTreatment: ["ENDOMETRIOSIS"],
  },

  // 新增医学实体
  MENORRHAGIA: {
    name: "Menorrhagia",
    alternateName: ["Heavy Menstrual Bleeding", "月经过多", "经血过多"],
    icd10: "N92.0",
    snomed: "26743008",
    mesh: "D008595",
    category: "Gynecological Condition",
    relatedConditions: ["DYSMENORRHEA", "ENDOMETRIOSIS", "FIBROIDS"],
    associatedAnatomy: ["Uterus", "Endometrium"],
    possibleTreatment: ["HORMONAL_CONTRACEPTION", "TRANEXAMIC_ACID", "SURGERY"],
  },

  AMENORRHEA: {
    name: "Amenorrhea",
    alternateName: ["Absent Menstruation", "闭经", "无月经"],
    icd10: "N91.2",
    snomed: "19346006",
    mesh: "D000568",
    category: "Gynecological Condition",
    relatedConditions: ["POLYCYSTIC_OVARY_SYNDROME", "HYPOTHYROIDISM"],
    associatedAnatomy: ["Uterus", "Ovaries", "Pituitary Gland"],
    possibleTreatment: ["HORMONAL_THERAPY", "LIFESTYLE_MODIFICATIONS"],
  },

  POLYCYSTIC_OVARY_SYNDROME: {
    name: "Polycystic Ovary Syndrome",
    alternateName: ["PCOS", "多囊卵巢综合征", "多囊症"],
    icd10: "E28.2",
    snomed: "237055002",
    mesh: "D011085",
    category: "Endocrine Disorder",
    relatedConditions: ["AMENORRHEA", "INFERTILITY", "DIABETES"],
    associatedAnatomy: ["Ovaries", "Endocrine System"],
    possibleTreatment: [
      "METFORMIN",
      "HORMONAL_CONTRACEPTION",
      "LIFESTYLE_MODIFICATIONS",
    ],
  },

  FIBROIDS: {
    name: "Uterine Fibroids",
    alternateName: ["Leiomyoma", "子宫肌瘤", "肌瘤"],
    icd10: "D25.9",
    snomed: "126906006",
    mesh: "D007889",
    category: "Gynecological Condition",
    relatedConditions: ["MENORRHAGIA", "DYSMENORRHEA"],
    associatedAnatomy: ["Uterus"],
    possibleTreatment: [
      "SURGERY",
      "Uterine Artery Embolization",
      "HORMONAL_THERAPY",
    ],
  },

  INFERTILITY: {
    name: "Infertility",
    alternateName: ["不孕症", "不育症"],
    icd10: "N97.9",
    snomed: "386661006",
    mesh: "D007246",
    category: "Reproductive Health",
    relatedConditions: [
      "ENDOMETRIOSIS",
      "POLYCYSTIC_OVARY_SYNDROME",
      "AMENORRHEA",
    ],
    associatedAnatomy: ["Uterus", "Ovaries", "Fallopian Tubes"],
    possibleTreatment: ["FERTILITY_TREATMENT", "IVF", "SURGERY"],
  },
};

/**
 * 获取医学实体的 Schema.org MedicalCode 数组
 *
 * @param entity 医学实体
 * @param entityKey 实体键（用于多语言编码）
 * @param locale 语言环境（用于多语言编码）
 */
export function getMedicalCodes(
  entity: MedicalEntity,
  entityKey?: keyof typeof MEDICAL_ENTITIES,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _locale: "en" | "zh" = "en",
): Array<{
  "@type": "MedicalCode";
  code: string;
  codingSystem: string;
  description?: string;
}> {
  // 如果提供了 entityKey，使用多语言编码系统
  // 注意：由于循环依赖问题，暂时禁用多语言编码系统
  // 如果需要启用，请先解决循环依赖问题
  // if (entityKey) {
  //   try {
  //     const { mergeMedicalCodes } = await import("./multilingual-medical-codes");
  //     return mergeMedicalCodes(entity, entityKey, locale);
  //   } catch {
  //     // 如果多语言编码系统不可用，回退到基础编码
  //   }
  // }

  // 基础编码（向后兼容）
  const codes: Array<{
    "@type": "MedicalCode";
    code: string;
    codingSystem: string;
  }> = [];

  if (entity.icd10) {
    codes.push({
      "@type": "MedicalCode",
      code: entity.icd10,
      codingSystem: "ICD-10",
    });
  }

  if (entity.snomed) {
    codes.push({
      "@type": "MedicalCode",
      code: entity.snomed,
      codingSystem: "SNOMED CT",
    });
  }

  if (entity.mesh) {
    codes.push({
      "@type": "MedicalCode",
      code: entity.mesh,
      codingSystem: "MeSH",
    });
  }

  return codes;
}

/**
 * 获取医学实体的 Schema.org MedicalCondition 对象
 */
export function getMedicalConditionSchema(
  entityKey: keyof typeof MEDICAL_ENTITIES,
  locale: "en" | "zh" = "en",
) {
  const entity = MEDICAL_ENTITIES[entityKey];
  if (!entity) {
    throw new Error(`Medical entity not found: ${entityKey}`);
  }

  const name =
    locale === "zh" && entity.alternateName[2]
      ? entity.alternateName[2]
      : entity.name;

  return {
    "@type": "MedicalCondition",
    name: name,
    alternateName: entity.alternateName,
    code: getMedicalCodes(entity, entityKey, locale),
    ...(entity.associatedAnatomy && {
      associatedAnatomy: entity.associatedAnatomy.map((anatomy) => ({
        "@type": "AnatomicalStructure",
        name: anatomy,
      })),
    }),
  };
}
