"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset?: () => void; // 标记为可选参数
}) {
  // 在开发环境下记录错误详情
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && error) {
      // eslint-disable-next-line no-console
      console.error("Global Error:", {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
      });
    }
  }, [error]);

  return (
    <html lang="zh">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
            padding: "20px",
          }}
        >
          <h1
            style={{ fontSize: "28px", marginBottom: "12px", color: "#111827" }}
          >
            抱歉，发生了错误
          </h1>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            An unexpected error occurred.
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <details
              style={{
                marginBottom: "20px",
                padding: "12px",
                background: "#f3f4f6",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "100%",
              }}
            >
              <summary style={{ cursor: "pointer", marginBottom: "8px" }}>
                错误详情（仅开发环境）
              </summary>
              <pre
                style={{
                  fontSize: "12px",
                  overflow: "auto",
                  color: "#dc2626",
                }}
              >
                {error.message}
                {error.stack && `\n\n${error.stack}`}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => {
                // 简化的重试逻辑，直接刷新页面
                window.location.reload();
              }}
              style={{
                background: "#111827",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
              type="button"
            >
              重试
            </button>
            <a
              href="/zh"
              style={{
                background: "#7c3aed",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                display: "inline-block",
              }}
            >
              返回首页
            </a>
            <a
              href="/en"
              style={{
                background: "#6b7280",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                display: "inline-block",
              }}
            >
              Go to English
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
