import { Metadata } from "next";
import { headers } from "next/headers";

interface RedirectPageProps {
  searchParams: Promise<{ target?: string }>;
}

export const metadata: Metadata = {
  title: "Redirecting...",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RedirectPage({
  searchParams,
}: RedirectPageProps) {
  const { target = "zh" } = await searchParams;
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  // 检测是否是预览请求
  const isPreviewRequest =
    userAgent.toLowerCase().includes("vercel") ||
    userAgent.toLowerCase().includes("screenshot") ||
    userAgent.toLowerCase().includes("headless") ||
    userAgent.toLowerCase().includes("puppeteer") ||
    userAgent.toLowerCase().includes("playwright");

  // 设置重定向延迟
  const redirectDelay = isPreviewRequest ? 5000 : 10; // 预览5秒，普通用户10ms

  const targetUrl = `/${target}`;

  return (
    <html lang={target}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redirecting...</title>

        {/* 使用多重重定向机制确保兼容性 */}
        <meta
          httpEquiv="refresh"
          content={`${redirectDelay / 1000};url=${targetUrl}`}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var redirectDelay = ${redirectDelay};
                var targetUrl = '${targetUrl}';

                // 延迟重定向
                setTimeout(function() {
                  try {
                    // 优先使用 replace，避免浏览器历史记录问题
                    if (window.location && window.location.replace) {
                      window.location.replace(targetUrl);
                    } else if (window.location && window.location.href) {
                      window.location.href = targetUrl;
                    } else {
                      // 最后的备用方案
                      window.location = targetUrl;
                    }
                  } catch (e) {
                    // 如果重定向失败，尝试使用默认语言
                    try {
                      if (window.location && window.location.replace) {
                        window.location.replace('/zh');
                      } else if (window.location && window.location.href) {
                        window.location.href = '/zh';
                      }
                    } catch (e2) {
                      // 完全失败的情况
                      console.error('Redirect failed:', e2);
                    }
                  }
                }, redirectDelay);
              })();
            `,
          }}
        />
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
        <div
          style={{ textAlign: "center", padding: "2rem", maxWidth: "600px" }}
        >
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            PeriodHub
          </h1>
          <h2
            style={{ fontSize: "1.5rem", marginBottom: "1rem", opacity: 0.9 }}
          >
            正在跳转到{target === "zh" ? "中文" : "英文"}版本...
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.8,
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康。
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
              如果页面没有自动跳转，请点击下面的链接：
            </p>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <a
                href="/zh"
                style={{
                  background:
                    target === "zh" ? "#ffffff" : "rgba(255,255,255,0.2)",
                  color: target === "zh" ? "#333333" : "#ffffff",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "inline-block",
                  cursor: "pointer",
                }}
              >
                中文版
              </a>
              <a
                href="/en"
                style={{
                  background:
                    target === "en" ? "#ffffff" : "rgba(255,255,255,0.2)",
                  color: target === "en" ? "#333333" : "#ffffff",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "inline-block",
                  cursor: "pointer",
                }}
              >
                English
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
