import { NextRequest, NextResponse } from "next/server";

// 性能数据存储（生产环境建议使用数据库）
const performanceData: Array<{
  timestamp: string;
  url: string;
  metrics: Record<string, number>;
  id: string;
  userAgent?: string;
  ip?: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 验证数据格式
    if (!data.timestamp || !data.url || !data.metrics) {
      return NextResponse.json(
        { error: "Invalid performance data format" },
        { status: 400 },
      );
    }

    // 存储性能数据
    performanceData.push({
      ...data,
      id: Date.now().toString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    });

    // 只保留最近1000条记录
    if (performanceData.length > 1000) {
      performanceData.splice(0, performanceData.length - 1000);
    }

    // Performance data received and processed

    return NextResponse.json({ success: true });
  } catch {
    // Error processing performance data
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const url = searchParams.get("url");

    let filteredData = performanceData;

    // 按URL过滤
    if (url) {
      filteredData = performanceData.filter((item) => item.url.includes(url));
    }

    // 按时间排序（最新的在前）
    filteredData.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // 限制返回数量
    const limitedData = filteredData.slice(0, limit);

    // 计算平均性能指标
    const averages = calculateAverages(limitedData);

    return NextResponse.json({
      data: limitedData,
      averages,
      total: filteredData.length,
      summary: {
        totalRecords: performanceData.length,
        filteredRecords: filteredData.length,
        returnedRecords: limitedData.length,
      },
    });
  } catch {
    // Error fetching performance data
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function calculateAverages(
  data: Array<{
    timestamp: string;
    url: string;
    metrics: Record<string, number>;
  }>,
) {
  if (data.length === 0) return {};

  const metrics = ["LCP", "FID", "CLS", "FCP", "TTFB"];
  const averages: Record<
    string,
    {
      average: number;
      min: number;
      max: number;
      count: number;
    }
  > = {};

  metrics.forEach((metric) => {
    const values = data
      .map((item) => item.metrics[metric])
      .filter((value) => typeof value === "number" && !isNaN(value));

    if (values.length > 0) {
      averages[metric] = {
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    }
  });

  return averages;
}
