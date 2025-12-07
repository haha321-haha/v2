import { getAllArticles } from "@/lib/articles";

/**
 * Generate Chinese RSS Feed
 * This feed contains Chinese articles only
 */
export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const locale = "zh";

  try {
    // 获取所有文章列表
    const allArticlesData = getAllArticles();

    // 按日期排序，只选择有中文标题的文章
    const allArticles = allArticlesData
      .filter(
        (article) =>
          (article.titleZh || article.title_zh) &&
          (article.titleZh || article.title_zh || "").trim() !== "",
      ) // 确保有中文标题
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 20); // 限制为最新20篇文章

    // 生成文章条目（中文版本）
    const entries = allArticles
      .map((article) => {
        const title = article.titleZh || article.title_zh || "";
        const summary =
          article.summary_zh ||
          article.descriptionZh ||
          article.description ||
          "";
        const articleUrl = `${baseUrl}/${locale}/articles/${article.slug}`;

        // 获取标签（使用原始标签）
        const tags = article.tags || [];

        return `
  <entry>
    <title><![CDATA[${title}]]></title>
    <link href="${articleUrl}"/>
    <id>${articleUrl}</id>
    <updated>${new Date(article.publishedAt).toISOString()}</updated>
    <summary><![CDATA[${summary}]]></summary>
    <author>
      <name>PeriodHub 健康团队</name>
    </author>
    ${
      tags.length > 0
        ? tags.map((tag) => `<category term="${tag}"/>`).join("")
        : ""
    }
  </entry>`;
      })
      .join("");

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <title>PeriodHub - 经期健康指南</title>
  <subtitle>专业的女性经期健康信息和工具 - 最新文章更新</subtitle>
  <link href="${baseUrl}/feed-zh.xml" rel="self"/>
  <link href="${baseUrl}"/>
  <id>${baseUrl}/feed-zh.xml</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>PeriodHub 健康团队</name>
  </author>
  <rights>Copyright © ${new Date().getFullYear()} PeriodHub. All rights reserved.</rights>
  <generator>PeriodHub Feed Generator v1.0</generator>
  <link href="${baseUrl}/feed.xml" rel="alternate" type="application/atom+xml" hreflang="en-US" title="PeriodHub - Menstrual Health Guide"/>

  ${entries}
</feed>`;

    return new Response(feed, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // 缓存1小时
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating Chinese Atom feed:", error);

    // 返回错误状态下的基本 Feed
    const fallbackFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>PeriodHub - 经期健康指南</title>
  <subtitle>专业的女性经期健康信息和工具</subtitle>
  <link href="${baseUrl}/feed-zh.xml" rel="self"/>
  <link href="${baseUrl}"/>
  <id>${baseUrl}/feed-zh.xml</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>PeriodHub 健康团队</name>
  </author>

  <entry>
    <title>欢迎访问 PeriodHub</title>
    <link href="${baseUrl}"/>
    <id>${baseUrl}/</id>
    <updated>${new Date().toISOString()}</updated>
    <summary>专业的女性经期健康信息和工具平台</summary>
  </entry>
</feed>`;

    return new Response(fallbackFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
      },
    });
  }
}
