/**
 * A/B测试配置
 *
 * 定义所有A/B测试的变体和参数
 */

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number;
  data: Record<string, unknown>;
}

export interface ABTestConfig {
  testId: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  expiryDays?: number;
  enabled: boolean;
}

/**
 * Hero区域CTA A/B测试配置
 *
 * 测试目标：优化Hero区域主CTA的点击率和转化率
 * 测试变量：CTA文案和微文案
 */
export const HERO_CTA_AB_TEST: ABTestConfig = {
  testId: "hero_cta_optimization_2025",
  name: "Hero CTA Optimization",
  description: "测试不同的Hero区域CTA文案对点击率和转化率的影响",
  enabled: true,
  expiryDays: 30, // 测试持续30天
  variants: [
    {
      id: "control",
      name: "Control (Original)",
      weight: 50, // 50%流量
      data: {
        ctaText: {
          en: "Immediate Relief",
          zh: "⚡ 即时缓解",
        },
        microcopy: {
          en: "Fast relief methods",
          zh: "快速缓解方法",
        },
      },
    },
    {
      id: "optimized",
      name: "Optimized (New)",
      weight: 50, // 50%流量
      data: {
        ctaText: {
          en: "Get My Relief Plan",
          zh: "获取缓解方案",
        },
        microcopy: {
          en: "Free • 3 minutes • Science-based",
          zh: "免费 • 3分钟 • 科学依据",
        },
      },
    },
  ],
};

/**
 * 所有启用的A/B测试配置
 */
export const ACTIVE_AB_TESTS: ABTestConfig[] = [HERO_CTA_AB_TEST];

/**
 * 获取特定的A/B测试配置
 */
export function getABTestConfig(testId: string): ABTestConfig | undefined {
  return ACTIVE_AB_TESTS.find((test) => test.testId === testId);
}

/**
 * 检查A/B测试是否启用
 */
export function isABTestEnabled(testId: string): boolean {
  const config = getABTestConfig(testId);
  return config?.enabled ?? false;
}

/**
 * 获取用户的A/B测试变体（用于服务端渲染）
 */
export function getABTestVariantForUser(
  testId: string,
  userId?: string,
): ABTestVariant | undefined {
  const config = getABTestConfig(testId);
  if (!config || !config.enabled) return undefined;

  // 如果没有userId，使用随机分配
  if (!userId) {
    return assignVariantByWeight(config.variants);
  }

  // 基于userId的一致性分配
  const hash = simpleHash(userId + testId);
  const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0);
  const random = ((hash % 1000) / 1000) * totalWeight;

  let cumulative = 0;
  for (const variant of config.variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant;
    }
  }

  return config.variants[0];
}

/**
 * 简单的哈希函数（用于一致性分配）
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

/**
 * 根据权重分配变体
 */
function assignVariantByWeight(variants: ABTestVariant[]): ABTestVariant {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant;
    }
  }

  return variants[0];
}

/**
 * A/B测试结果统计类型
 */
export interface ABTestMetrics {
  testId: string;
  variantId: string;
  eventName: string;
  count: number;
  timestamp: Date;
}

/**
 * 获取测试的推荐样本量
 */
export function getRecommendedSampleSize(
  baselineRate: number, // 基准转化率 (0-1)
  minimumDetectableEffect: number, // 最小可检测效果 (0-1)
  confidenceLevel: number = 0.95,
  power: number = 0.8,
): number {
  // 使用标准的A/B测试样本量计算公式
  const zAlpha = getZScore(1 - (1 - confidenceLevel) / 2);
  const zBeta = getZScore(power);

  const p1 = baselineRate;
  const p2 = baselineRate * (1 + minimumDetectableEffect);
  // const pPool = (p1 + p2) / 2; // Reserved for future use

  const numerator = Math.sqrt(p1 * (1 - p1)) + Math.sqrt(p2 * (1 - p2));
  const denominator = Math.abs(p1 - p2);

  const sampleSize = Math.pow(((zAlpha + zBeta) * numerator) / denominator, 2);

  return Math.ceil(sampleSize);
}

function getZScore(probability: number): number {
  // 简化的Z-score计算（实际项目中可以使用统计库）
  const zScores = [
    [0.9, 1.282],
    [0.95, 1.645],
    [0.975, 1.96],
    [0.99, 2.326],
    [0.995, 2.576],
  ];

  for (const [p, z] of zScores) {
    if (probability <= p) return z;
  }

  return 1.96; // 默认返回95%置信度的Z值
}

/**
 * 分析测试结果
 */
export function analyzeABTest(
  controlConversions: number,
  controlVisitors: number,
  variantConversions: number,
  variantVisitors: number,
  confidenceLevel: number = 0.95,
): {
  controlRate: number;
  variantRate: number;
  relativeImprovement: number;
  statisticalSignificance: boolean;
  confidenceInterval: [number, number];
} {
  const controlRate = controlConversions / controlVisitors;
  const variantRate = variantConversions / variantVisitors;
  const relativeImprovement = (variantRate - controlRate) / controlRate;

  // 简化的统计显著性计算
  const pooledRate =
    (controlConversions + variantConversions) /
    (controlVisitors + variantVisitors);
  const standardError = Math.sqrt(
    pooledRate * (1 - pooledRate) * (1 / controlVisitors + 1 / variantVisitors),
  );
  const zScore = (variantRate - controlRate) / standardError;

  const zCritical = getZScore(1 - (1 - confidenceLevel) / 2);
  const statisticalSignificance = Math.abs(zScore) > zCritical;

  const marginOfError = zCritical * standardError;
  const confidenceInterval: [number, number] = [
    relativeImprovement - marginOfError / controlRate,
    relativeImprovement + marginOfError / controlRate,
  ];

  return {
    controlRate,
    variantRate,
    relativeImprovement,
    statisticalSignificance,
    confidenceInterval,
  };
}
