import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    // const metric = await request.json(); // Reserved for future use

    // 这里可以发送到你的分析服务
    // Web Vitals Metric processed
    // await saveMetricToDatabase(metric);

    // 可以存储到数据库或发送到第三方服务
    // await saveMetricToDatabase(metric);

    return NextResponse.json({ success: true });
  } catch {
    // Error processing web vitals
    return NextResponse.json(
      { error: "Failed to process metric" },
      { status: 500 },
    );
  }
}
