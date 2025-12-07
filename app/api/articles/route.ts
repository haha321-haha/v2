import { NextRequest, NextResponse } from "next/server";
import { getArticlesList } from "@/lib/articles";

// ✅ 保留 force-dynamic（避免配置冲突）
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // locale 参数保留用于未来扩展，但目前未使用
    // const locale = searchParams.get("locale") || "en";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // ✅ Day 2: 使用新的分页函数（基于预生成索引）
    const allArticles = getArticlesList();
    // 简单的分页实现
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = allArticles.slice(startIndex, endIndex);
    const result = {
      articles: paginatedArticles,
      total: allArticles.length,
      page,
      limit,
      totalPages: Math.ceil(allArticles.length / limit),
    };

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch {
    // Error fetching articles
    return NextResponse.json(
      {
        success: false,
        articles: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        error: "Failed to fetch articles",
      },
      { status: 500 },
    );
  }
}
