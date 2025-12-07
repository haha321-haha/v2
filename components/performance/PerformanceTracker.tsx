"use client";

import { useEffect } from "react";
import { logInfo, logWarn } from "@/lib/debug-logger";

/**
 * 性能追踪组件
 * 监控第三方脚本加载性能和用户体验指标
 */
export default function PerformanceTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 监控第三方脚本性能
    const trackScriptPerformance = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // 监控关键第三方脚本
          if (
            entry.name.includes("googletagmanager") ||
            entry.name.includes("clarity") ||
            entry.name.includes("adsbygoogle") ||
            entry.name.includes("lucide") ||
            entry.name.includes("chart")
          ) {
            const loadTime = Math.round(entry.duration);
            const transferSize =
              (entry as PerformanceNavigationTiming & { transferSize?: number })
                .transferSize || 0;

            logInfo(
              `📊 Script Performance: ${entry.name}`,
              { loadTime, transferSize },
              "PerformanceTracker/trackScriptPerformance",
            );
            logInfo(
              `   Load Time: ${loadTime}ms`,
              undefined,
              "PerformanceTracker/trackScriptPerformance",
            );
            logInfo(
              `   Transfer Size: ${(transferSize / 1024).toFixed(2)}KB`,
              undefined,
              "PerformanceTracker/trackScriptPerformance",
            );

            // 发送性能数据到GA4
            if (
              typeof window !== "undefined" &&
              "gtag" in window &&
              typeof (
                window as {
                  gtag?: (
                    command: string,
                    eventName: string,
                    params?: Record<string, unknown>,
                  ) => void;
                }
              ).gtag === "function"
            ) {
              (
                window as {
                  gtag: (
                    command: string,
                    eventName: string,
                    params?: Record<string, unknown>,
                  ) => void;
                }
              ).gtag("event", "script_performance", {
                script_name: entry.name,
                load_time: loadTime,
                transfer_size: transferSize,
                event_category: "performance",
                event_label: "third_party_script",
              });
            }

            // 性能警告
            if (loadTime > 1000) {
              logWarn(
                `⚠️ Slow script detected: ${entry.name} took ${loadTime}ms`,
                { entryName: entry.name, loadTime },
                "PerformanceTracker/trackScriptPerformance",
              );
            }
          }
        }
      });

      observer.observe({ entryTypes: ["resource"] });

      return () => observer.disconnect();
    };

    // 监控Core Web Vitals
    const trackWebVitals = () => {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (
          typeof window !== "undefined" &&
          "gtag" in window &&
          typeof (
            window as {
              gtag?: (
                command: string,
                eventName: string,
                params?: Record<string, unknown>,
              ) => void;
            }
          ).gtag === "function"
        ) {
          (
            window as {
              gtag: (
                command: string,
                eventName: string,
                params?: Record<string, unknown>,
              ) => void;
            }
          ).gtag("event", "web_vitals", {
            metric_name: "LCP",
            metric_value: Math.round(lastEntry.startTime),
            event_category: "performance",
          });
        }
      });

      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            typeof window !== "undefined" &&
            "gtag" in window &&
            typeof (
              window as {
                gtag?: (
                  command: string,
                  eventName: string,
                  params?: Record<string, unknown>,
                ) => void;
              }
            ).gtag === "function"
          ) {
            (
              window as {
                gtag: (
                  command: string,
                  eventName: string,
                  params?: Record<string, unknown>,
                ) => void;
              }
            ).gtag("event", "web_vitals", {
              metric_name: "FID",
              metric_value: Math.round(
                (entry as PerformanceEventTiming).processingStart -
                  entry.startTime,
              ),
              event_category: "performance",
            });
          }
        }
      });

      fidObserver.observe({ entryTypes: ["first-input"] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // 使用 PerformanceEntry 类型，然后检查属性
          const layoutShiftEntry = entry as {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value;
          }
        }

        if (
          typeof window !== "undefined" &&
          "gtag" in window &&
          typeof (
            window as {
              gtag?: (
                command: string,
                eventName: string,
                params?: Record<string, unknown>,
              ) => void;
            }
          ).gtag === "function"
        ) {
          (
            window as {
              gtag: (
                command: string,
                eventName: string,
                params?: Record<string, unknown>,
              ) => void;
            }
          ).gtag("event", "web_vitals", {
            metric_name: "CLS",
            metric_value: Math.round(clsValue * 1000),
            event_category: "performance",
          });
        }
      });

      clsObserver.observe({ entryTypes: ["layout-shift"] });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    };

    // 监控页面加载性能
    const trackPagePerformance = () => {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming;

          const metrics = {
            dom_content_loaded: Math.round(
              navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart,
            ),
            load_complete: Math.round(
              navigation.loadEventEnd - navigation.loadEventStart,
            ),
            first_byte: Math.round(
              navigation.responseStart - navigation.requestStart,
            ),
            dom_processing: Math.round(
              navigation.domComplete -
                (navigation.domContentLoadedEventStart || 0),
            ),
            total_load_time: Math.round(
              navigation.loadEventEnd - navigation.fetchStart,
            ),
          };

          logInfo(
            "📊 Page Performance Metrics:",
            metrics,
            "PerformanceTracker/trackPagePerformance",
          );

          if (
            typeof window !== "undefined" &&
            "gtag" in window &&
            typeof (
              window as {
                gtag?: (
                  command: string,
                  eventName: string,
                  params?: Record<string, unknown>,
                ) => void;
              }
            ).gtag === "function"
          ) {
            (
              window as {
                gtag: (
                  command: string,
                  eventName: string,
                  params?: Record<string, unknown>,
                ) => void;
              }
            ).gtag("event", "page_performance", {
              dom_content_loaded: metrics.dom_content_loaded,
              load_complete: metrics.load_complete,
              first_byte: metrics.first_byte,
              dom_processing: metrics.dom_processing,
              total_load_time: metrics.total_load_time,
              event_category: "performance",
            });
          }
        }, 1000);
      });
    };

    // 启动所有监控
    const cleanup1 = trackScriptPerformance();
    const cleanup2 = trackWebVitals();
    trackPagePerformance();

    return () => {
      cleanup1();
      cleanup2();
    };
  }, []);

  return null;
}

/**
 * 第三方脚本性能优化建议
 */
export function ScriptOptimizationSuggestions() {
  useEffect(() => {
    // 分析当前脚本加载情况并提供建议
    const analyzeScripts = () => {
      const resources = performance.getEntriesByType("resource");
      const scripts = resources.filter(
        (entry) =>
          entry.name.includes(".js") &&
          !entry.name.includes(window.location.origin),
      );

      const slowScripts = scripts.filter((script) => script.duration > 500);
      const largeScripts = scripts.filter(
        (script) =>
          ((script as PerformanceResourceTiming & { transferSize?: number })
            .transferSize || 0) > 100000,
      );

      if (slowScripts.length > 0) {
        logInfo(
          "🐌 Slow scripts detected:",
          slowScripts.map((s) => ({
            name: s.name,
            duration: Math.round(s.duration) + "ms",
          })),
          "PerformanceTracker/analyzeScripts",
        );
      }

      if (largeScripts.length > 0) {
        logInfo(
          "📦 Large scripts detected:",
          largeScripts.map((s) => ({
            name: s.name,
            size:
              Math.round(
                ((s as PerformanceResourceTiming & { transferSize?: number })
                  .transferSize || 0) / 1024,
              ) + "KB",
          })),
          "PerformanceTracker/analyzeScripts",
        );
      }

      // 提供优化建议
      if (scripts.length > 5) {
        logInfo(
          "💡 Optimization suggestion: Consider reducing the number of third-party scripts",
          { scriptCount: scripts.length },
          "PerformanceTracker/analyzeScripts",
        );
      }

      if (scripts.some((s) => !s.name.includes("lazyOnload"))) {
        logInfo(
          "💡 Optimization suggestion: Consider using lazyOnload for non-critical scripts",
          undefined,
          "PerformanceTracker/analyzeScripts",
        );
      }
    };

    // 延迟分析，等待所有脚本加载完成
    setTimeout(analyzeScripts, 5000);
  }, []);

  return null;
}
