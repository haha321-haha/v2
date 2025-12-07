import { KeywordTracker } from "./keyword-tracker";
import { PeriodHubSEOAnalyzer } from "./keyword-analyzer";
import { webVitalsTracker } from "@/lib/analytics/web-vitals";

interface WebVitalsData {
  summary?: {
    score?: number;
    averageMetrics?: {
      LCP?: number;
      CLS?: number;
      FID?: number;
    };
  };
}

interface KeywordRankings {
  topRanked: string[];
  opportunities: Array<{ keyword: string; currentPosition: number }>;
  averagePosition: number;
}

interface Competitor {
  name: string;
  domain: string;
  [key: string]: unknown;
}

export interface SEOReport {
  summary: {
    overallScore: number;
    grade: "A" | "B" | "C" | "D" | "F";
    lastUpdated: string;
    priorityIssues: string[];
    recommendations: string[];
  };
  technicalSEO: {
    score: number;
    issues: string[];
    optimizations: string[];
  };
  contentSEO: {
    score: number;
    keywordOptimization: string[];
    contentGaps: string[];
    opportunities: string[];
  };
  performance: {
    webVitals: WebVitalsData["summary"]["averageMetrics"];
    score: number;
    issues: string[];
    improvements: string[];
  };
  competitorAnalysis: {
    topCompetitors: Competitor[];
    keywordGaps: string[];
    opportunities: string[];
  };
}

export class SEOReportGenerator {
  private keywordTracker = new KeywordTracker();
  private analyzer = PeriodHubSEOAnalyzer;

  async generateReport(): Promise<SEOReport> {
    const [keywordRankings, webVitals, competitorData] = await Promise.all([
      this.keywordTracker.getKeywordPerformanceReport(),
      webVitalsTracker.generateReport(),
      this.analyzer.analyzeCompetitors(),
    ]);

    const report: SEOReport = {
      summary: await this.generateSummary(
        {
          topRanked: keywordRankings.topRanked.map((r) => r.keyword),
          opportunities: keywordRankings.opportunities.map((r) => ({
            keyword: r.keyword,
            currentPosition: r.currentPosition,
          })),
          averagePosition: keywordRankings.averagePosition,
        } as KeywordRankings,
        webVitals as WebVitalsData,
        competitorData as unknown as Competitor[],
      ),
      technicalSEO: await this.analyzeTechnicalSEO(),
      contentSEO: await this.analyzeContentSEO({
        topRanked: keywordRankings.topRanked.map((r) => r.keyword),
        opportunities: keywordRankings.opportunities.map((r) => ({
          keyword: r.keyword,
          currentPosition: r.currentPosition,
        })),
        averagePosition: keywordRankings.averagePosition,
      } as KeywordRankings),
      performance: this.analyzePerformance(webVitals as WebVitalsData),
      competitorAnalysis: await this.analyzeCompetitors(
        competitorData.map((c) => ({
          name: (c as { name?: string }).name || "",
          domain: (c as { domain?: string }).domain || "",
        })) as unknown as Competitor[],
      ),
    };

    return report;
  }

  private async generateSummary(
    keywordRankings: KeywordRankings,
    webVitals: WebVitalsData,
    competitorData: Competitor[],
  ): Promise<SEOReport["summary"]> {
    const scores = {
      keyword: this.calculateKeywordScore(keywordRankings),
      technical: 85, // 基于当前技术架构
      performance: Math.min(100, Math.round(webVitals.summary?.score || 80)),
      content: 90, // 基于内容质量
    };

    const overallScore = Math.round(
      (scores.keyword +
        scores.technical +
        scores.performance +
        scores.content) /
        4,
    );

    let grade: "A" | "B" | "C" | "D" | "F";
    if (overallScore >= 90) grade = "A";
    else if (overallScore >= 80) grade = "B";
    else if (overallScore >= 70) grade = "C";
    else if (overallScore >= 60) grade = "D";
    else grade = "F";

    const priorityIssues = this.identifyPriorityIssues(
      keywordRankings,
      webVitals,
    );
    const recommendations = this.generateRecommendations(
      keywordRankings,
      competitorData,
    );

    return {
      overallScore,
      grade,
      lastUpdated: new Date().toISOString(),
      priorityIssues,
      recommendations,
    };
  }

  private calculateKeywordScore(keywordRankings: KeywordRankings): number {
    const { topRanked, opportunities, averagePosition } = keywordRankings;

    let score = 70; // 基础分数

    // 首页排名加分
    score += topRanked.length * 5;

    // 平均排名优化
    if (averagePosition <= 10) score += 15;
    else if (averagePosition <= 20) score += 10;
    else if (averagePosition <= 30) score += 5;

    // 机会关键词加分
    score += Math.min(opportunities.length * 2, 10);

    return Math.min(100, score);
  }

  private identifyPriorityIssues(
    keywordRankings: KeywordRankings,
    webVitals: WebVitalsData,
  ): string[] {
    const issues: string[] = [];

    const { topRanked, opportunities } = keywordRankings;
    const avgMetrics = webVitals.summary?.averageMetrics || {};

    // 关键词排名问题
    if (topRanked.length < 3) {
      issues.push("首页关键词排名不足，需要加强内容优化");
    }

    if (opportunities.length > 5) {
      issues.push("存在多个排名机会，需要针对性优化");
    }

    // 性能问题
    if (avgMetrics.LCP && avgMetrics.LCP > 2500) {
      issues.push("页面加载速度较慢，影响用户体验");
    }

    if (avgMetrics.CLS && avgMetrics.CLS > 0.1) {
      issues.push("页面布局稳定性需要改善");
    }

    return issues;
  }

  private generateRecommendations(
    keywordRankings: KeywordRankings,
    competitorData: Competitor[],
  ): string[] {
    const recommendations: string[] = [];

    const { opportunities } = keywordRankings;

    // 关键词优化建议
    if (opportunities.length > 0) {
      recommendations.push(
        `优化 ${opportunities.length} 个机会关键词，提升排名到前10位`,
      );
    }

    // 内容优化建议
    recommendations.push("增加长尾关键词内容，覆盖更多搜索场景");

    // 技术优化建议
    recommendations.push("优化页面加载速度，特别是在移动端");

    // 竞争对手分析建议
    if (competitorData.length > 0) {
      recommendations.push("分析竞争对手的内容策略，找出内容空白点");
    }

    return recommendations;
  }

  private async analyzeTechnicalSEO(): Promise<SEOReport["technicalSEO"]> {
    const issues: string[] = [];
    const optimizations: string[] = [];

    // 检查静态文件
    issues.push("需要验证sitemap.xml和robots.txt是否正确配置");
    optimizations.push("确保所有页面都有正确的meta标签");
    optimizations.push("优化图片大小和格式");
    optimizations.push("实现更有效的缓存策略");

    return {
      score: 85, // 基于当前技术实现
      issues,
      optimizations,
    };
  }

  private async analyzeContentSEO(
    keywordRankings: KeywordRankings,
  ): Promise<SEOReport["contentSEO"]> {
    const keywordOpportunities = keywordRankings.opportunities;

    const keywordOptimization = [
      "痛经缓解",
      "经期健康管理",
      "痛经治疗",
      "自然疗法",
    ];

    const contentGaps = [
      "缺少关于痛经预防的详细指南",
      "需要更多青少年痛经相关内容",
      "缺少季节性痛经管理内容",
    ];

    const opportunitiesList = keywordOpportunities.map(
      (kw: { keyword: string; currentPosition: number }) =>
        `优化 "${kw.keyword}" 关键词，当前排名 ${kw.currentPosition}`,
    );

    return {
      score: 88,
      keywordOptimization,
      contentGaps,
      opportunities: opportunitiesList,
    };
  }

  private analyzePerformance(
    webVitals: WebVitalsData | string,
  ): SEOReport["performance"] {
    const webVitalsData =
      typeof webVitals === "string" ? { summary: {} } : webVitals;
    const avgMetrics = webVitalsData.summary?.averageMetrics || {};
    const issues: string[] = [];
    const improvements: string[] = [];

    // 性能问题识别
    if (avgMetrics.LCP && avgMetrics.LCP > 2500) {
      issues.push("页面加载时间超过2.5秒");
      improvements.push("优化图片压缩和懒加载");
    }

    if (avgMetrics.CLS && avgMetrics.CLS > 0.1) {
      issues.push("页面布局偏移较大");
      improvements.push("为图片和广告预留空间");
    }

    return {
      webVitals: avgMetrics as WebVitalsData["summary"]["averageMetrics"],
      score: Math.min(100, Math.round(webVitalsData.summary?.score || 80)),
      issues,
      improvements,
    };
  }

  private async analyzeCompetitors(
    competitorData: Competitor[],
  ): Promise<SEOReport["competitorAnalysis"]> {
    const topCompetitors = competitorData.slice(0, 3);

    const keywordGaps = [
      '竞争对手在"痛经缓解方法"排名更好',
      '缺少"经期健康食谱"相关内容',
      "竞争对手有更多用户案例内容",
    ];

    const opportunities = [
      "针对竞争对手的薄弱关键词创建内容",
      "开发独特的经期管理工具",
      "建立更权威的专家内容",
    ];

    return {
      topCompetitors,
      keywordGaps,
      opportunities,
    };
  }

  /**
   * 生成可下载的SEO报告
   */
  generateDownloadableReport(): string {
    return `
# PeriodHub SEO 优化报告

## 执行摘要
基于最新的SEO分析，PeriodHub网站整体表现良好，但仍有优化空间。

## 关键发现
- 技术SEO基础扎实
- 内容质量较高
- 性能优化需要持续关注

## 立即行动项目
1. 优化机会关键词排名
2. 改善页面加载速度
3. 加强竞争对手分析

## 长期优化策略
- 持续内容更新
- 用户体验优化
- 技术架构升级

报告生成时间: ${new Date().toLocaleString("zh-CN")}
    `.trim();
  }
}

export const seoReportGenerator = new SEOReportGenerator();
