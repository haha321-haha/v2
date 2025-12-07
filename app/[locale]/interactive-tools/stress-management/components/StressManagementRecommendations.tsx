import RelatedToolCard from "@/app/[locale]/interactive-tools/components/RelatedToolCard";
import RelatedArticleCard from "@/app/[locale]/interactive-tools/components/RelatedArticleCard";
import ScenarioSolutionCard from "@/app/[locale]/interactive-tools/components/ScenarioSolutionCard";

interface StressManagementRecommendationsProps {
  locale: string;
}

export default function StressManagementRecommendations({
  locale,
}: StressManagementRecommendationsProps) {
  const isZh = locale === "zh";

  const relatedTools = [
    {
      id: "symptom-assessment",
      title: isZh ? "症状评估工具" : "Symptom Assessment",
      description: isZh
        ? "全面评估经期症状，获得个性化健康建议"
        : "Comprehensive period symptom assessment with personalized health advice",
      href: `/${locale}/interactive-tools/symptom-assessment`,
      icon: "🔍",
      priority: "high",
      iconColor: "red" as const,
      anchorTextType: "symptom_assessment" as const,
    },
    {
      id: "period-pain-impact-calculator",
      title: isZh ? "痛经影响计算器" : "Pain Impact Calculator",
      description: isZh
        ? "评估痛经对生活质量的影响，制定改善计划"
        : "Assess period pain impact on quality of life, create improvement plans",
      href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
      icon: "📊",
      priority: "high",
      iconColor: "orange" as const,
      anchorTextType: "calculator" as const,
    },
    {
      id: "cycle-tracker",
      title: isZh ? "周期追踪器" : "Cycle Tracker",
      description: isZh
        ? "智能追踪月经周期，预测下次月经时间，记录症状变化"
        : "Smart menstrual cycle tracking, predict next period, record symptom changes",
      href: `/${locale}/interactive-tools/cycle-tracker`,
      icon: "📅",
      priority: "high",
      iconColor: "blue" as const,
      anchorTextType: "tracker" as const,
    },
  ];

  const relatedArticles = [
    {
      id: "menstrual-stress-management-complete-guide",
      title: isZh
        ? "经期压力管理完全指南"
        : "Complete Menstrual Stress Management Guide",
      description: isZh
        ? "基于心理学研究的科学压力管理策略和长期改善方法"
        : "Scientific stress management strategies and long-term improvement methods based on psychological research",
      href: `/${locale}/articles/menstrual-stress-management-complete-guide`,
      readTime: isZh ? "22分钟阅读" : "22 min read",
      category: isZh ? "心理健康" : "Mental Health",
      priority: "high",
      icon: "📋",
      anchorTextType: "stress_guide" as const,
    },
    {
      id: "menstrual-sleep-quality-improvement-guide",
      title: isZh
        ? "经期睡眠质量改善指南"
        : "Menstrual Sleep Quality Improvement Guide",
      description: isZh
        ? "科学的睡眠优化方法，改善经期睡眠质量和压力管理"
        : "Scientific sleep optimization methods to improve period sleep quality and stress management",
      href: `/${locale}/articles/menstrual-sleep-quality-improvement-guide`,
      readTime: isZh ? "20分钟阅读" : "20 min read",
      category: isZh ? "睡眠健康" : "Sleep Health",
      priority: "high",
      icon: "😴",
      anchorTextType: "sleep_guide" as const,
    },
    {
      id: "breathing-exercises-guide",
      title: isZh ? "呼吸练习完整指南" : "Complete Breathing Exercises Guide",
      description: isZh
        ? "详细的呼吸练习技巧和科学原理，快速缓解压力"
        : "Detailed breathing exercise techniques and scientific principles for quick stress relief",
      href: `/${locale}/articles/breathing-exercises-guide`,
      readTime: isZh ? "15分钟阅读" : "15 min read",
      category: isZh ? "减压技巧" : "Stress Relief",
      priority: "medium",
      icon: "💨",
      anchorTextType: "breathing_guide" as const,
    },
  ];

  const scenarioSolutions = [
    {
      id: "office",
      title: isZh ? "办公环境场景" : "Office Environment",
      description: isZh
        ? "职场压力管理策略，保持工作效率和心理健康"
        : "Workplace stress management strategies to maintain productivity and mental health",
      href: `/${locale}/scenario-solutions/office`,
      icon: "💼",
      priority: "high",
      anchorTextType: "office" as const,
    },
    {
      id: "sleep",
      title: isZh ? "睡眠场景" : "Sleep Scenario",
      description: isZh
        ? "改善经期睡眠质量，通过良好休息缓解压力"
        : "Improve period sleep quality, relieve stress through good rest",
      href: `/${locale}/scenario-solutions/sleep`,
      icon: "😴",
      priority: "high",
      anchorTextType: "sleep" as const,
    },
    {
      id: "social",
      title: isZh ? "社交场景" : "Social Scenario",
      description: isZh
        ? "在社交活动中管理经期压力和不适"
        : "Manage period stress and discomfort during social activities",
      href: `/${locale}/scenario-solutions/social`,
      icon: "👥",
      priority: "high",
      anchorTextType: "social" as const,
    },
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="space-y-8 sm:space-y-12">
        {/* 相关工具 */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
            <span className="mr-3">🔧</span>
            {isZh ? "相关工具" : "Related Tools"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedTools.map((tool) => (
              <RelatedToolCard key={tool.id} tool={tool} locale={locale} />
            ))}
          </div>
        </div>

        {/* 相关文章 */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
            <span className="mr-3">📚</span>
            {isZh ? "相关文章" : "Related Articles"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedArticles.map((article) => (
              <RelatedArticleCard
                key={article.id}
                article={article}
                locale={locale}
              />
            ))}
          </div>
        </div>

        {/* 场景解决方案 */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
            <span className="mr-3">🎯</span>
            {isZh ? "场景解决方案" : "Scenario Solutions"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {scenarioSolutions.map((solution) => (
              <ScenarioSolutionCard
                key={solution.id}
                solution={solution}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
