/**
 * GEO地理位置API路由
 * Geographic Location API Route
 *
 * 提供服务器端地理位置检测
 * Provides server-side geographic location detection
 */

import { NextRequest, NextResponse } from "next/server";
import { getLocationFromIP } from "@/lib/geo/geoip-service";

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取客户端IP
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwarded?.split(",")[0] || realIp || undefined;

    // 获取地理位置信息
    const location = await getLocationFromIP(clientIp);

    return NextResponse.json({
      success: true,
      data: location,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 返回默认位置而不是错误
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        data: {
          country: "Unknown",
          countryCode: "XX",
          city: "Unknown",
          region: "Unknown",
          timezone: "UTC",
        },
      },
      { status: 200 },
    ); // 返回200，因为默认位置是有效的回退
  }
}






