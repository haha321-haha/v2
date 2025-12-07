import { NextRequest, NextResponse } from "next/server";

/**
 * 调试端点 - 用于检查运行时环境
 * 访问 /api/debug 可以查看环境信息和可能的错误
 */
export async function GET(request: NextRequest) {
  try {
    const headers = {
      "user-agent": request.headers.get("user-agent") || "",
      "accept-language": request.headers.get("accept-language") || "",
      "x-vercel-id": request.headers.get("x-vercel-id") || "",
      "x-vercel-deployment": request.headers.get("x-vercel-deployment") || "",
    };

    const env = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
    };

    // 尝试导入翻译文件
    let messagesStatus = "unknown";
    try {
      const zhMessages = await import("../../../messages/zh.json");
      messagesStatus = `zh.json loaded: ${
        Object.keys(zhMessages.default).length
      } keys`;
    } catch (error) {
      messagesStatus = `zh.json failed: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        headers,
        env,
        messagesStatus,
        message: "Debug endpoint is working",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
