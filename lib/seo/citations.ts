/**
 * Citations Database
 * 引用数据库
 *
 * 包含权威医学来源的引用信息
 * 用于建立医学内容的权威性和可信度
 */

export interface Citation {
  id: string;
  title: string;
  url: string;
  year: number;
  credibility: "high" | "medium" | "low";
  organization: string;
  authors?: string[];
  journal?: string;
  doi?: string;
  type: "guideline" | "research" | "review" | "practice_bulletin";
}

export const CITATIONS: Record<string, Citation> = {
  ACOG_DYSMENORRHEA: {
    id: "ACOG_DYSMENORRHEA",
    title:
      "ACOG Practice Bulletin: Dysmenorrhea and Endometriosis in the Adolescent",
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/07/dysmenorrhea-and-endometriosis-in-the-adolescent",
    year: 2018,
    credibility: "high",
    organization: "American College of Obstetricians and Gynecologists",
    type: "practice_bulletin",
  },
  ACOG_PMS: {
    id: "ACOG_PMS",
    title: "ACOG Practice Bulletin: Premenstrual Syndrome",
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2015/05/premenstrual-syndrome",
    year: 2015,
    credibility: "high",
    organization: "American College of Obstetricians and Gynecologists",
    type: "practice_bulletin",
  },
  WHO_REPRODUCTIVE_HEALTH: {
    id: "WHO_REPRODUCTIVE_HEALTH",
    title: "WHO Guidelines on Reproductive Health",
    url: "https://www.who.int/publications/i/item/9789241550508",
    year: 2023,
    credibility: "high",
    organization: "World Health Organization",
    type: "guideline",
  },
  NIH_DYSMENORRHEA: {
    id: "NIH_DYSMENORRHEA",
    title: "Dysmenorrhea: Causes and Management",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK560834/",
    year: 2023,
    credibility: "high",
    organization: "National Institutes of Health",
    type: "review",
  },
  UPTODATE_DYSMENORRHEA: {
    id: "UPTODATE_DYSMENORRHEA",
    title: "Dysmenorrhea in adult females: Treatment",
    url: "https://www.uptodate.com/contents/dysmenorrhea-in-adult-females-treatment",
    year: 2024,
    credibility: "high",
    organization: "UpToDate",
    type: "review",
  },
  COCHRANE_NSAIDS: {
    id: "COCHRANE_NSAIDS",
    title: "Nonsteroidal anti-inflammatory drugs for dysmenorrhoea",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001751.pub4/full",
    year: 2015,
    credibility: "high",
    organization: "Cochrane",
    type: "research",
    journal: "Cochrane Database of Systematic Reviews",
  },
  AAFP_DYSMENORRHEA: {
    id: "AAFP_DYSMENORRHEA",
    title: "Dysmenorrhea: Evaluation and Treatment",
    url: "https://www.aafp.org/pubs/afp/issues/2005/0115/p285.html",
    year: 2005,
    credibility: "high",
    organization: "American Academy of Family Physicians",
    type: "review",
  },
};

/**
 * 获取引用的 Schema.org CreativeWork 对象
 */
export function getCitationSchema(citationKey: keyof typeof CITATIONS) {
  const citation = CITATIONS[citationKey];
  if (!citation) {
    throw new Error(`Citation not found: ${citationKey}`);
  }

  return {
    "@type": "CreativeWork",
    name: citation.title,
    url: citation.url,
    datePublished: citation.year.toString(),
    publisher: {
      "@type": "Organization",
      name: citation.organization,
    },
    ...(citation.authors && { author: citation.authors }),
    ...(citation.journal && { publication: citation.journal }),
    ...(citation.doi && { identifier: citation.doi }),
  };
}

/**
 * 获取多个引用的 Schema.org 数组
 */
export function getCitationsSchema(
  citationKeys: Array<keyof typeof CITATIONS>,
) {
  return citationKeys.map((key) => getCitationSchema(key));
}






