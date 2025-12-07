import { getAllArticles } from "@/lib/articles";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  try {
    // 获取所有文章列表
    const allArticlesData = getAllArticles();

    // 按日期排序
    const allArticles = allArticlesData
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 20); // 限制为最新20篇文章

    // 生成文章条目
    const entries = allArticles
      .map((article) => {
        const locale = article.titleZh ? "zh" : "en";
        const title = locale === "zh" ? article.titleZh : article.title;
        const summary =
          locale === "zh" ? article.descriptionZh : article.description;
        const articleUrl = `${baseUrl}/${locale}/articles/${article.slug}`;

        return `
  <entry>
    <title><![CDATA[${title}]]></title>
    <link href="${articleUrl}"/>
    <id>${articleUrl}</id>
    <updated>${new Date(article.publishedAt).toISOString()}</updated>
    <summary><![CDATA[${summary}]]></summary>
    <author>
      <name>PeriodHub Health Team</name>
    </author>
    ${
      article.tags && article.tags.length > 0
        ? article.tags.map((tag) => `<category term="${tag}"/>`).join("")
        : ""
    }
  </entry>`;
      })
      .join("");

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <title>PeriodHub - 经期健康指南</title>
  <subtitle>专业的女性经期健康信息和工具 - 最新文章更新</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self"/>
  <link href="${baseUrl}"/>
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>PeriodHub Health Team</name>
  </author>
  <rights>Copyright © ${new Date().getFullYear()} PeriodHub. All rights reserved.</rights>
  <generator>PeriodHub Feed Generator v1.0</generator>

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
    console.error("Error generating Atom feed:", error);

    // 返回错误状态下的基本 Feed
    const fallbackFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>PeriodHub - 经期健康指南</title>
  <subtitle>专业的女性经期健康信息和工具</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self"/>
  <link href="${baseUrl}"/>
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>PeriodHub Health Team</name>
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
