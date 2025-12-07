"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { logInfo, logError } from "@/lib/debug-logger";

/**
 * 优化的第三方脚本加载组件
 * 实现智能延迟加载和性能优化
 */
export default function OptimizedScripts() {
  const [shouldLoadScripts, setShouldLoadScripts] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // 检查环境 - 允许开发环境测试，但使用不同的GA ID
    setIsProduction(process.env.NODE_ENV === "production");

    // 智能延迟加载策略
    const loadScriptsAfterDelay = () => {
      // 延迟3秒后开始加载非关键脚本
      setTimeout(() => {
        setShouldLoadScripts(true);
      }, 3000);
    };

    // 在用户交互后立即加载
    const handleUserInteraction = () => {
      if (!shouldLoadScripts) {
        setShouldLoadScripts(true);
        // 移除事件监听器，避免重复触发
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("scroll", handleUserInteraction);
        document.removeEventListener("keydown", handleUserInteraction);
      }
    };

    // 添加用户交互监听
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("scroll", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    // 启动延迟加载
    loadScriptsAfterDelay();

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 只在生产环境且有有效GA ID时加载GA脚本
  const shouldLoadGA = isProduction && process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {/* Google Analytics 4 - 优化加载 */}
      {shouldLoadGA && (
        <>
          <Script
            id="gtag-config"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            onLoad={() =>
              logInfo("✅ GA4 script loaded", undefined, "OptimizedScripts/GA4")
            }
            onError={(e) =>
              logError("❌ GA4 script failed:", e, "OptimizedScripts/GA4")
            }
          />

          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              // 性能优化配置
              send_page_view: false, // 手动控制页面视图发送
              transport_type: 'beacon' // 使用beacon传输
            });
              `,
            }}
          />
        </>
      )}

      {/* 开发环境提示 */}
      {!isProduction && (
        <Script
          id="dev-analytics-mock"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // 开发环境模拟GA函数，避免错误
              window.gtag = function() {
                // eslint-disable-next-line no-console
                console.log('🔧 Dev Mode: GA call mocked:', arguments);
              };
              // eslint-disable-next-line no-console
              console.log('🔧 开发环境：GA脚本已模拟，不会发送真实数据');
            `,
          }}
        />
      )}

      {/* Microsoft Clarity - 智能延迟加载 */}
      {shouldLoadScripts && isProduction && (
        <Script
          id="clarity-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ssdsoc827u");
            `,
          }}
          onLoad={() =>
            logInfo(
              "✅ Clarity script loaded",
              undefined,
              "OptimizedScripts/Clarity",
            )
          }
          onError={(e) =>
            logError("❌ Clarity script failed:", e, "OptimizedScripts/Clarity")
          }
        />
      )}

      {/* Google AdSense - 智能延迟加载 */}
      {shouldLoadScripts && (
        <Script
          id="adsense-init"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5773162579508714"
          crossOrigin="anonymous"
          onLoad={() =>
            logInfo(
              "✅ AdSense script loaded",
              undefined,
              "OptimizedScripts/AdSense",
            )
          }
          onError={(e) =>
            logError("❌ AdSense script failed:", e, "OptimizedScripts/AdSense")
          }
        />
      )}
    </>
  );
}

/**
 * 优化的Chart.js加载组件
 */
export function OptimizedChartJS() {
  const [shouldLoadChart, setShouldLoadChart] = useState(false);

  useEffect(() => {
    // 检测是否需要Chart.js
    const checkChartNeeded = () => {
      // 检查是否有图表容器
      const chartContainers = document.querySelectorAll("[data-chart]");
      if (chartContainers.length > 0) {
        setShouldLoadChart(true);
      }
    };

    // 延迟检查，避免过早加载
    const timer = setTimeout(checkChartNeeded, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoadChart) {
    return null;
  }

  return (
    <Script
      id="chartjs"
      strategy="lazyOnload"
      src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
      onLoad={() =>
        logInfo("✅ Chart.js loaded", undefined, "OptimizedScripts/ChartJS")
      }
      onError={(e) =>
        logError("❌ Chart.js failed:", e, "OptimizedScripts/ChartJS")
      }
    />
  );
}

/**
 * 优化的Lucide图标加载组件
 */
export function OptimizedLucide() {
  const [shouldLoadLucide, setShouldLoadLucide] = useState(false);

  useEffect(() => {
    // 检查是否需要Lucide图标
    const checkLucideNeeded = () => {
      // 检查是否有lucide图标元素
      const lucideElements = document.querySelectorAll("[data-lucide]");
      if (lucideElements.length > 0) {
        setShouldLoadLucide(true);
      }
    };

    // 延迟检查
    const timer = setTimeout(checkLucideNeeded, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoadLucide) {
    return null;
  }

  return (
    <Script
      id="lucide"
      strategy="lazyOnload"
      src="https://unpkg.com/lucide@latest"
      onLoad={() =>
        logInfo("✅ Lucide icons loaded", undefined, "OptimizedScripts/Lucide")
      }
      onError={(e) =>
        logError("❌ Lucide icons failed:", e, "OptimizedScripts/Lucide")
      }
    />
  );
}

// 性能监控功能已移至独立的PerformanceTracker组件，避免重复
