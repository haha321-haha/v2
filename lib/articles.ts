/**
 * Articles Library - 文章管理工具
 * 管理文章数据和相关功能
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Article {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  content?: string; // 文章内容（可选）
  // 兼容性属性
  title_zh?: string;
  seo_title_zh?: string;
  summary?: string;
  summary_zh?: string;
}

// 文章目录路径
const articlesDirectory = path.join(process.cwd(), "content/articles");

/**
 * 从文件系统读取所有文章
 */
function loadArticlesFromFileSystem(): Article[] {
  const articles: Article[] = [];
  const locales = ["zh", "en"];

  for (const locale of locales) {
    const localeDir = path.join(articlesDirectory, locale);
    if (!fs.existsSync(localeDir)) continue;

    const files = fs.readdirSync(localeDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    for (const file of mdFiles) {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(localeDir, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      // 检查是否已经存在该slug的文章（避免重复）
      const existingIndex = articles.findIndex((a) => a.slug === slug);
      const article: Article =
        existingIndex >= 0
          ? articles[existingIndex]
          : {
              slug,
              title: data.title || "",
              titleZh: data.title || "",
              description: data.summary || data.description || "",
              descriptionZh: data.summary || data.description || "",
              category: data.category || "general",
              tags: Array.isArray(data.tags) ? data.tags : [],
              publishedAt:
                data.date ||
                data.publishedAt ||
                new Date().toISOString().split("T")[0],
              updatedAt:
                data.updatedAt ||
                data.date ||
                new Date().toISOString().split("T")[0],
              readingTime: parseInt(
                data.reading_time?.replace(/[^0-9]/g, "") || "10",
              ),
              featured: data.featured || false,
              content: content,
              // 兼容性属性
              title_zh: data.title,
              seo_title_zh: data.seo_title,
              summary: data.summary || data.description,
              summary_zh: data.summary || data.description,
            };

      // 根据locale更新对应的字段
      if (locale === "zh") {
        article.titleZh = data.title || article.titleZh;
        article.descriptionZh =
          data.summary || data.description || article.descriptionZh;
        article.title_zh = data.title || article.title_zh;
        article.summary_zh =
          data.summary || data.description || article.summary_zh;
      } else {
        article.title = data.title || article.title;
        article.description =
          data.summary || data.description || article.description;
        article.summary = data.summary || data.description || article.summary;
      }

      if (existingIndex >= 0) {
        articles[existingIndex] = article;
      } else {
        articles.push(article);
      }
    }
  }

  return articles;
}

// 缓存文章数据
let cachedArticles: Article[] | null = null;

/**
 * 获取所有文章（带缓存）
 */
function getAllArticlesCached(): Article[] {
  if (cachedArticles === null) {
    cachedArticles = loadArticlesFromFileSystem();
  }
  return cachedArticles;
}

/**
 * 获取所有文章
 */
export function getAllArticles(): Article[] {
  return getAllArticlesCached();
}

/**
 * 根据 slug 获取文章
 */
export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticlesCached();
  return articles.find((article) => article.slug === slug) || null;
}

/**
 * 获取相关文章（带缓存）
 */
export function getRelatedArticlesWithCache(
  currentSlug: string,
  locale: string,
  count: number = 3,
): Article[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const articles = getAllArticlesCached();
  // 简单的相关文章逻辑：同类别的其他文章
  return articles
    .filter(
      (article) =>
        article.slug !== currentSlug &&
        article.category === currentArticle.category,
    )
    .slice(0, count);
}

/**
 * 获取特色文章
 */
export function getFeaturedArticles(count: number = 5): Article[] {
  const articles = getAllArticlesCached();
  return articles.filter((article) => article.featured).slice(0, count);
}

/**
 * 按类别获取文章
 */
export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticlesCached();
  return articles.filter((article) => article.category === category);
}

/**
 * 搜索文章
 */
export function searchArticles(
  query: string,
  locale: string = "en",
): Article[] {
  const lowerQuery = query.toLowerCase();
  const articles = getAllArticlesCached();

  return articles.filter((article) => {
    const title = locale === "zh" ? article.titleZh : article.title;
    const description =
      locale === "zh" ? article.descriptionZh : article.description;

    return (
      title.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * 获取相关文章
 */
export function getRelatedArticles(
  currentSlug: string,
  locale: string,
  count: number = 3,
): Article[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const articles = getAllArticlesCached();
  // 简单的相关文章逻辑：同类别的其他文章
  return articles
    .filter(
      (article) =>
        article.slug !== currentSlug &&
        article.category === currentArticle.category,
    )
    .slice(0, count);
}

/**
 * 获取文章列表（别名，兼容性）
 */
export function getArticlesList(): Article[] {
  return getAllArticles();
}
