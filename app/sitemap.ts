import { MetadataRoute } from "next";

// Sitemap generator for periodhub.health - Environment variable with fallback
export default function sitemap(): MetadataRoute.Sitemap {
  // Environment variable with production fallback - 更严格的错误处理
  const getBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const fallbackUrl = "https://www.periodhub.health";

    // 确保URL格式正确
    try {
      const url = envUrl || fallbackUrl;
      new URL(url); // 验证URL格式
      return url;
    } catch {
      // Invalid base URL, using fallback
      return fallbackUrl;
    }
  };

  const baseUrl = getBaseUrl();

  // Debug: Environment variables logged in build
  // 🚀 移动端优化状态记录
  // Mobile optimization: Service Worker, touch optimization, performance monitoring enabled

  const currentDate = new Date();

  // 主要页面
  const mainPages = [
    // 首页
    "/zh",
    "/en",
    // 核心功能页面
    "/zh/interactive-tools",
    "/en/interactive-tools",
    "/zh/immediate-relief",
    "/en/immediate-relief",
    "/zh/natural-therapies",
    "/en/natural-therapies",
    "/zh/downloads",
    "/en/downloads",
    "/zh/health-guide",
    "/en/health-guide",
    "/zh/teen-health",
    "/en/teen-health",
    "/zh/scenario-solutions",
    "/en/scenario-solutions",
    "/zh/cultural-charms",
    "/en/cultural-charms",
    "/zh/privacy-policy",
    "/en/privacy-policy",
    "/zh/terms-of-service",
    "/en/terms-of-service",
    "/zh/medical-disclaimer",
    "/en/medical-disclaimer",
  ];

  // 下载页面子页面
  const downloadsPages = [
    "/zh/downloads/medication-guide",
    "/en/downloads/medication-guide",
  ];

  // 互动工具子页面 - 只包含实际存在的页面
  // 🔧 修复：添加constitution-test到sitemap，确保该页面能被搜索引擎发现
  const interactiveTools = [
    "/zh/interactive-tools/symptom-assessment",
    "/en/interactive-tools/symptom-assessment",
    "/zh/interactive-tools/pain-tracker",
    "/en/interactive-tools/pain-tracker",
    "/zh/interactive-tools/constitution-test",
    "/en/interactive-tools/constitution-test",
    "/zh/interactive-tools/period-pain-impact-calculator",
    "/en/interactive-tools/period-pain-impact-calculator",
    "/zh/interactive-tools/nutrition-recommendation-generator",
    "/en/interactive-tools/nutrition-recommendation-generator",
    "/zh/interactive-tools/workplace-wellness",
    "/en/interactive-tools/workplace-wellness",
    "/zh/interactive-tools/stress-management",
    "/en/interactive-tools/stress-management",
  ];

  // 健康指南子页面
  const healthGuidePages = [
    "/zh/health-guide/global-perspectives",
    "/en/health-guide/global-perspectives",
    "/zh/health-guide/lifestyle",
    "/en/health-guide/lifestyle",
    "/zh/health-guide/medical-care",
    "/en/health-guide/medical-care",
    "/zh/health-guide/myths-facts",
    "/en/health-guide/myths-facts",
    "/zh/health-guide/relief-methods",
    "/en/health-guide/relief-methods",
    "/zh/health-guide/understanding-pain",
    "/en/health-guide/understanding-pain",
  ];

  // 青少年健康子页面
  const teenHealthPages = [
    "/zh/teen-health/campus-guide",
    "/en/teen-health/campus-guide",
    "/zh/teen-health/communication-guide",
    "/en/teen-health/communication-guide",
    "/zh/teen-health/development-pain",
    "/en/teen-health/development-pain",
    "/zh/teen-health/emotional-support",
    "/en/teen-health/emotional-support",
  ];

  // 场景解决方案子页面 - 只包含实际存在的页面
  const scenarioPages = [
    "/zh/scenario-solutions/office",
    "/en/scenario-solutions/office",
    "/zh/scenario-solutions/commute",
    "/en/scenario-solutions/commute",
    "/zh/scenario-solutions/exercise",
    "/en/scenario-solutions/exercise",
    "/zh/scenario-solutions/sleep",
    "/en/scenario-solutions/sleep",
    "/zh/scenario-solutions/social",
    "/en/scenario-solutions/social",
    "/zh/scenario-solutions/lifeStages",
    "/en/scenario-solutions/lifeStages",
    "/zh/scenario-solutions/emergency-kit",
    "/en/scenario-solutions/emergency-kit",
  ];

  // 所有静态页面
  const staticPages = [
    ...mainPages,
    ...downloadsPages,
    ...interactiveTools,
    ...healthGuidePages,
    ...teenHealthPages,
    ...scenarioPages,
  ];

  // 文章页面
  const articleSlugs = [
    "5-minute-period-pain-relief",
    "anti-inflammatory-diet-period-pain",
    "comprehensive-iud-guide",
    "comprehensive-medical-guide-to-dysmenorrhea",
    "essential-oils-aromatherapy-menstrual-pain-guide",
    "global-traditional-menstrual-pain-relief",
    "heat-therapy-complete-guide",
    "herbal-tea-menstrual-pain-relief",
    "effective-herbal-tea-menstrual-pain",
    "long-term-healthy-lifestyle-guide",
    "hidden-culprits-of-menstrual-pain",
    "home-natural-menstrual-pain-relief",
    "magnesium-gut-health-comprehensive-guide",
    "menstrual-back-pain-comprehensive-care-guide",
    "menstrual-nausea-relief-guide",
    "menstrual-pain-accompanying-symptoms-guide",
    "menstrual-pain-complications-management",
    "menstrual-pain-faq-expert-answers",
    "menstrual-pain-medical-guide",
    "menstrual-pain-vs-other-abdominal-pain-guide",
    "natural-physical-therapy-comprehensive-guide",
    "nsaid-menstrual-pain-professional-guide",
    "period-friendly-recipes",
    "personal-menstrual-health-profile",
    "recommended-reading-list",
    "specific-menstrual-pain-management-guide",
    "comprehensive-menstrual-sleep-quality-guide",
    "menstrual-pain-research-progress-2024",
    "menstrual-preventive-care-complete-plan",
    "menstrual-stress-management-complete-guide",
    "us-menstrual-pain-insurance-coverage-guide",
    "when-to-see-doctor-period-pain",
    "when-to-seek-medical-care-comprehensive-guide",
    "womens-lifecycle-menstrual-pain-analysis",
    "zhan-zhuang-baduanjin-for-menstrual-pain-relief",
    "ginger-menstrual-pain-relief-guide",
    "comprehensive-report-non-medical-factors-menstrual-pain",
    "period-pain-simulator-accuracy-analysis",
    "medication-vs-natural-remedies-menstrual-pain",
    "menstrual-pain-back-pain-connection",
    "menstrual-pain-emergency-medication-guide",
    "menstrual-sleep-quality-improvement-guide",
    "understanding-your-cycle",
  ];

  // 生成文章页面
  const articlePages = [];
  for (const slug of articleSlugs) {
    articlePages.push(`/zh/articles/${slug}`);
    articlePages.push(`/en/articles/${slug}`);
  }

  // 所有页面
  const allPages = [...staticPages, ...articlePages];

  // 生成静态页面的 sitemap 条目
  const staticEntries: MetadataRoute.Sitemap = allPages.map((page) => {
    let priority = 0.8;
    let changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never" = "weekly";

    // 设置优先级和更新频率
    if (page.includes("/en") && !page.includes("/articles/")) {
      priority = 1.0; // 英文首页和主要页面（主要市场 - 北美）
      changeFrequency = "weekly";
    } else if (page.includes("/zh") && !page.includes("/articles/")) {
      priority = 0.9; // 中文首页和主要页面（次要市场 - 中国大陆）
      changeFrequency = "weekly";
    } else if (page.includes("/interactive-tools")) {
      priority = 0.9; // 互动工具页面
      changeFrequency = "weekly";
    } else if (page.includes("/articles/")) {
      priority = 0.7; // 文章页面
      changeFrequency = "monthly";
    } else if (
      page.includes("/teen-health") ||
      page.includes("/health-guide")
    ) {
      priority = 0.8; // 健康相关页面
      changeFrequency = "weekly";
    }

    return {
      url: `${baseUrl}${page}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });

  // 🎯 PDF 资源文件 - 已从sitemap中移除，避免重复内容问题
  // PDF文件现在通过robots.txt禁止索引，不再包含在sitemap中
  // HTML文件是主要内容，PDF文件是备用/打印版本
  const pdfFiles: string[] = [];

  // HTML资源文件 - 优先级高于PDF，更好的SEO和用户体验
  const htmlFiles = [
    // 中文HTML文件
    "/downloads/pain-guide.html",
    "/downloads/parent-communication-guide.html",
    "/downloads/zhan-zhuang-baduanjin-illustrated-guide.html",
    "/downloads/teacher-collaboration-handbook.html",
    "/downloads/healthy-habits-checklist.html",
    "/downloads/specific-menstrual-pain-management-guide.html",
    "/downloads/natural-therapy-assessment.html",
    "/downloads/menstrual-cycle-nutrition-plan.html",
    "/downloads/campus-emergency-checklist.html",
    "/downloads/menstrual-pain-complications-management.html",
    "/downloads/magnesium-gut-health-menstrual-pain-guide.html",
    "/downloads/pain-tracking-form.html",
    "/downloads/teacher-health-manual.html",
    "/downloads/constitution-guide.html",
    // 英文HTML文件
    "/downloads/pain-guide-en.html",
    "/downloads/parent-communication-guide-en.html",
    "/downloads/zhan-zhuang-baduanjin-illustrated-guide-en.html",
    "/downloads/teacher-collaboration-handbook-en.html",
    "/downloads/healthy-habits-checklist-en.html",
    "/downloads/specific-menstrual-pain-management-guide-en.html",
    "/downloads/natural-therapy-assessment-en.html",
    "/downloads/menstrual-cycle-nutrition-plan-en.html",
    "/downloads/campus-emergency-checklist-en.html",
    "/downloads/menstrual-pain-complications-management-en.html",
    "/downloads/magnesium-gut-health-menstrual-pain-guide-en.html",
    "/downloads/pain-tracking-form-en.html",
    "/downloads/teacher-health-manual-en.html",
    "/downloads/constitution-guide-en.html",
  ];

  // 生成HTML文件的sitemap条目 - 高优先级
  const htmlEntries: MetadataRoute.Sitemap = htmlFiles.map((html) => ({
    url: `${baseUrl}${html}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8, // HTML版本高优先级 - 更好的SEO和用户体验
  }));

  // 生成PDF文件的sitemap条目 - 保持现有PDF条目
  const pdfEntries: MetadataRoute.Sitemap = pdfFiles.map((pdf) => ({
    url: `${baseUrl}${pdf}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.6, // PDF文件优先级较低
  }));

  // 合并所有条目 - HTML优先
  const allEntries = [...staticEntries, ...htmlEntries, ...pdfEntries];

  // 添加错误处理和验证
  if (allEntries.length === 0) {
    // Sitemap generation failed: No entries generated
    // 返回最基本的条目确保sitemap不为空
    return [
      {
        url: `${baseUrl}/zh`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/en`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 1.0,
      },
    ];
  }

  // Sitemap generated successfully with ${allEntries.length} entries
  return allEntries;
}
