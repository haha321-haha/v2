"use client";

import React, { useState, useEffect } from "react";
import SafeSmartImage from "@/components/ui/SafeSmartImage";

// 设备断点配置
export const breakpoints = {
  mobile: "320px",
  mobileLarge: "480px",
  tablet: "768px",
  desktop: "1024px",
  desktopLarge: "1280px",
  desktopXL: "1536px",
};

// 响应式Hook
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({ width, height });

      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return { screenSize, dimensions };
};

// 触控检测Hook
type NavigatorWithMsTouch = Navigator & {
  msMaxTouchPoints?: number;
};

export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      const nav = navigator as NavigatorWithMsTouch;
      setIsTouchDevice(
        "ontouchstart" in window ||
          (nav.maxTouchPoints ?? 0) > 0 ||
          (nav.msMaxTouchPoints ?? 0) > 0,
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
};

// 响应式测试组件
export const ResponsiveTestPanel = () => {
  const { screenSize, dimensions } = useResponsive();
  const isTouchDevice = useTouchDevice();
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      {/* 切换按钮 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
      >
        {isVisible ? "隐藏" : "显示"} 响应式测试
      </button>

      {/* 测试面板 */}
      {isVisible && (
        <div className="fixed top-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[300px]">
          <h3 className="font-semibold text-gray-800 mb-3">响应式测试面板</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">屏幕尺寸:</span>
              <span className="font-medium">{screenSize}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">分辨率:</span>
              <span className="font-medium">
                {dimensions.width} × {dimensions.height}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">触控设备:</span>
              <span className="font-medium">{isTouchDevice ? "是" : "否"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">用户代理:</span>
              <span className="font-medium text-xs truncate max-w-[150px]">
                {navigator.userAgent.split(" ")[0]}
              </span>
            </div>
          </div>

          {/* 断点指示器 */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">当前断点:</h4>
            <div className="space-y-1">
              {Object.entries(breakpoints).map(([name, value]) => {
                const isActive = dimensions.width >= parseInt(value);
                return (
                  <div
                    key={name}
                    className={`text-xs ${
                      isActive ? "text-green-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    {name}: {value} {isActive && "✓"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 移动端优化检测
export const useMobileOptimization = () => {
  const { screenSize } = useResponsive();
  const isTouchDevice = useTouchDevice();

  const isMobile = screenSize === "mobile";
  const isTablet = screenSize === "tablet";
  const isDesktop = screenSize === "desktop";

  // 触控友好的最小尺寸
  const minTouchTarget = 44; // 44px 是苹果推荐的最小触控目标

  // 检查触控目标大小
  const checkTouchTargets = () => {
    const buttons = document.querySelectorAll('button, a, [role="button"]');
    const smallTargets: Element[] = [];

    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();
      if (rect.width < minTouchTarget || rect.height < minTouchTarget) {
        smallTargets.push(button);
      }
    });

    return smallTargets;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    minTouchTarget,
    checkTouchTargets,
  };
};

// 响应式图片组件
export const ResponsiveImage = ({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) => {
  return (
    <SafeSmartImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      className={`responsive-image ${className}`}
      sizes={sizes}
      priority={priority}
      type="content"
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
};

// 响应式网格组件
export const ResponsiveGrid = ({
  children,
  className = "",
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
}: {
  children: React.ReactNode;
  className?: string;
  mobileCols?: number;
  tabletCols?: number;
  desktopCols?: number;
}) => {
  const { screenSize } = useResponsive();

  const getGridCols = () => {
    switch (screenSize) {
      case "mobile":
        return mobileCols;
      case "tablet":
        return tabletCols;
      case "desktop":
        return desktopCols;
      default:
        return desktopCols;
    }
  };

  const gridCols = getGridCols();

  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: "1rem",
      }}
    >
      {children}
    </div>
  );
};

// 响应式文本组件
export const ResponsiveText = ({
  children,
  mobileSize = "text-sm",
  tabletSize = "text-base",
  desktopSize = "text-lg",
  className = "",
}: {
  children: React.ReactNode;
  mobileSize?: string;
  tabletSize?: string;
  desktopSize?: string;
  className?: string;
}) => {
  const { screenSize } = useResponsive();

  const getTextSize = () => {
    switch (screenSize) {
      case "mobile":
        return mobileSize;
      case "tablet":
        return tabletSize;
      case "desktop":
        return desktopSize;
      default:
        return desktopSize;
    }
  };

  return <div className={`${getTextSize()} ${className}`}>{children}</div>;
};

// 性能测试工具
type PerformanceWithMemory = Performance & {
  memory?: {
    usedJSHeapSize: number;
  };
};

export const PerformanceTest = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
  });

  useEffect(() => {
    const startTime = performance.now();

    // 测量渲染时间
    const measureRenderTime = () => {
      const endTime = performance.now();
      setMetrics((prev) => ({
        ...prev,
        renderTime: endTime - startTime,
      }));
    };

    // 测量内存使用
    const measureMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as PerformanceWithMemory).memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024,
        }));
      }
    };

    // 计算组件数量
    const countComponents = () => {
      const components = document.querySelectorAll("[data-component]");
      setMetrics((prev) => ({
        ...prev,
        componentCount: components.length,
      }));
    };

    const timer = setTimeout(measureRenderTime, 100);
    const memoryTimer = setInterval(measureMemory, 1000);
    const componentTimer = setTimeout(countComponents, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(memoryTimer);
      clearTimeout(componentTimer);
    };
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold text-gray-800 mb-2">性能指标</div>
      <div className="space-y-1">
        <div>渲染时间: {metrics.renderTime.toFixed(2)}ms</div>
        <div>内存使用: {metrics.memoryUsage.toFixed(2)}MB</div>
        <div>组件数量: {metrics.componentCount}</div>
      </div>
    </div>
  );
};
