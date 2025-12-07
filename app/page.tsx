import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Period Hub - Health & Wellness",
    description: "Your comprehensive health and wellness platform",
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * 根路径页面
 *
 * 注意：重定向逻辑已移至 middleware.ts 中处理
 * 这样可以避免与 app/layout.tsx 中的 headers() 调用冲突
 *
 * 如果请求到达这里，说明 middleware 没有处理（不应该发生）
 * 返回一个简单的重定向页面作为备用
 */
export default function RootPage() {
  // 这个页面不应该被访问到，因为 middleware 会重定向
  // 但为了安全，提供一个备用重定向
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redirecting...</title>
        <meta httpEquiv="refresh" content="0;url=/zh" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "1.2rem" }}>正在跳转...</p>
          <a
            href="/zh"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "10px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              display: "inline-block",
              marginTop: "1rem",
            }}
          >
            立即跳转到中文版
          </a>
        </div>
      </body>
    </html>
  );
}
