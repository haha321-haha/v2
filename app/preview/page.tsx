import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PeriodHub - 专业痛经缓解和月经健康管理平台",
  description:
    "提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。基于医学研究的个性化建议，中西医结合的健康方案。",
};

export default function PreviewPage() {
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PeriodHub - 专业痛经缓解和月经健康管理平台</title>
        <meta
          name="description"
          content="提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{ textAlign: "center", padding: "2rem", maxWidth: "600px" }}
        >
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            PeriodHub
          </h1>
          <h2
            style={{ fontSize: "1.5rem", marginBottom: "1rem", opacity: 0.9 }}
          >
            专业痛经缓解和月经健康管理平台
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.8,
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。
          </p>

          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "1rem", opacity: 0.7 }}>
              Vercel Preview Mode - 截图生成中...
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
