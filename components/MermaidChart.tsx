"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { logError } from "@/lib/debug-logger";

interface MermaidChartProps {
  chart: string;
  title?: string;
  description?: string;
  className?: string;
  id?: string;
}

// 动态导入Mermaid库 - 只在需要时加载
const loadMermaid = async () => {
  const mermaid = await import("mermaid");
  return mermaid.default;
};

export default function MermaidChart({
  chart,
  title,
  description,
  className = "",
  id,
}: MermaidChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // 使用稳定的ID生成策略，避免水合错误
  const chartId = useMemo(() => {
    if (id) return id;
    // 基于内容生成稳定的ID，而不是随机ID
    const hash = chart.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `mermaid-${Math.abs(hash).toString(36)}`;
  }, [id, chart]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 只在客户端渲染图表
    if (!isClient) return;

    const renderChart = async () => {
      if (chartRef.current && chart) {
        try {
          setIsLoading(true);
          setError(null);

          // 验证图表内容
          if (!chart.trim()) {
            throw new Error("Empty chart definition");
          }

          // 动态加载Mermaid库
          const mermaid = await loadMermaid();

          // 只在第一次加载时初始化
          if (!mermaidLoaded) {
            mermaid.initialize({
              startOnLoad: false,
              theme: "default",
              themeVariables: {
                primaryColor: "#9333ea",
                primaryTextColor: "#ffffff",
                primaryBorderColor: "#7c3aed",
                lineColor: "#6b7280",
                sectionBkgColor: "#f3f4f6",
                altSectionBkgColor: "#e5e7eb",
                gridColor: "#d1d5db",
                secondaryColor: "#ec4899",
                tertiaryColor: "#f59e0b",
              },
              flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: "basis",
              },
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              securityLevel: "loose",
            });
            setMermaidLoaded(true);
          }

          // Clear previous content
          chartRef.current.innerHTML = "";

          // Render the chart
          const { svg } = await mermaid.render(chartId, chart);

          if (svg) {
            chartRef.current.innerHTML = svg;

            // Add accessibility attributes
            const svgElement = chartRef.current.querySelector("svg");
            if (svgElement) {
              svgElement.setAttribute("role", "img");
              svgElement.setAttribute("aria-labelledby", `${chartId}-title`);
              if (description) {
                svgElement.setAttribute("aria-describedby", `${chartId}-desc`);
              }

              // 确保SVG可见
              svgElement.style.maxWidth = "100%";
              svgElement.style.height = "auto";
            }
          } else {
            throw new Error("No SVG generated");
          }
        } catch (error) {
          logError(
            "Mermaid rendering error:",
            error,
            "MermaidChart/renderChart",
          );
          logError("Chart content:", chart, "MermaidChart/renderChart");
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          setError(errorMessage);
          chartRef.current.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-800 font-medium">图表渲染失败</p>
              <p class="text-red-600 text-sm mt-1">请检查图表语法或刷新页面重试</p>
              <details class="mt-2">
                <summary class="text-red-700 cursor-pointer">错误详情</summary>
                <pre class="text-xs text-red-600 mt-1 whitespace-pre-wrap">${errorMessage}</pre>
              </details>
            </div>
          `;
        } finally {
          setIsLoading(false);
        }
      }
    };

    // 延迟渲染以确保DOM已准备好
    const timer = setTimeout(renderChart, 100);
    return () => clearTimeout(timer);
  }, [isClient, chart, chartId, description, mermaidLoaded]);

  // 服务端渲染时显示占位符，客户端渲染时显示图表
  if (!isClient) {
    return (
      <div
        className={`mermaid-container ${className}`}
        suppressHydrationWarning
      >
        {title && (
          <h3
            id={`${chartId}-title`}
            className="text-lg font-semibold text-gray-800 mb-2 text-center"
          >
            {title}
          </h3>
        )}

        {description && (
          <p
            id={`${chartId}-desc`}
            className="text-sm text-gray-600 mb-4 text-center max-w-2xl mx-auto"
          >
            {description}
          </p>
        )}

        <div
          className="mermaid-chart overflow-x-auto"
          style={{
            minHeight: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">正在加载图表...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mermaid-container ${className}`}>
      {title && (
        <h3
          id={`${chartId}-title`}
          className="text-lg font-semibold text-gray-800 mb-2 text-center"
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          id={`${chartId}-desc`}
          className="text-sm text-gray-600 mb-4 text-center max-w-2xl mx-auto"
        >
          {description}
        </p>
      )}

      <div
        ref={chartRef}
        className="mermaid-chart overflow-x-auto"
        style={{
          minHeight: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />

      {/* 加载状态指示器 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">正在渲染图表...</p>
          </div>
        </div>
      )}

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .mermaid-container {
            page-break-inside: avoid;
            margin: 20pt 0;
            padding: 0;
            width: 100%;
            max-width: 210mm;
          }

          .mermaid-chart {
            width: 100%;
            max-width: 190mm;
            margin: 0 auto;
          }

          .mermaid-chart svg {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            font-size: 12pt !important;
            color: #000 !important;
            background: white !important;
          }

          .mermaid-chart svg text {
            font-size: 12pt !important;
            fill: #000 !important;
            font-family: "Times New Roman", serif !important;
          }

          .mermaid-chart svg rect,
          .mermaid-chart svg path,
          .mermaid-chart svg circle,
          .mermaid-chart svg polygon {
            stroke: #000 !important;
            stroke-width: 1.5px !important;
          }

          /* High contrast colors for print */
          .mermaid-chart svg [fill="#FF6B6B"],
          .mermaid-chart svg [fill="#FF8787"] {
            fill: #000 !important;
            stroke: #000 !important;
          }
          .mermaid-chart svg [fill="#4ECDC4"] {
            fill: #666 !important;
            stroke: #000 !important;
          }
          .mermaid-chart svg [fill="#51CF66"] {
            fill: #333 !important;
            stroke: #000 !important;
          }
          .mermaid-chart svg [fill="#FFD43B"] {
            fill: #ccc !important;
            stroke: #000 !important;
          }
          .mermaid-chart svg [fill="#DA77F2"],
          .mermaid-chart svg [fill="#74C0FC"],
          .mermaid-chart svg [fill="#FFB366"] {
            fill: #888 !important;
            stroke: #000 !important;
          }
          .mermaid-chart svg [fill="#69DB7C"],
          .mermaid-chart svg [fill="#D0EBFF"] {
            fill: #aaa !important;
            stroke: #000 !important;
          }
          .mermaid-chart svg [fill="#FFC9C9"],
          .mermaid-chart svg [fill="#FFF3BF"] {
            fill: #ddd !important;
            stroke: #000 !important;
          }

          /* Ensure title and description are print-friendly */
          h3,
          p {
            color: #000 !important;
            font-size: 14pt !important;
            margin: 10pt 0 !important;
          }
        }

        @media screen and (max-width: 768px) {
          .mermaid-container {
            margin: 16px 0;
            padding: 8px;
          }

          .mermaid-chart {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding: 8px;
            border-radius: 8px;
          }

          .mermaid-chart svg {
            min-width: 320px;
            max-width: none;
            font-size: 11px;
          }

          h3 {
            font-size: 16px !important;
            margin-bottom: 8px !important;
          }

          p {
            font-size: 14px !important;
            margin-bottom: 12px !important;
          }
        }

        @media screen and (max-width: 480px) {
          .mermaid-chart svg {
            min-width: 280px;
            font-size: 10px;
          }

          .mermaid-chart svg text {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
