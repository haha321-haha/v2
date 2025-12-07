import { useEffect } from "react";

/**
 * 智能预加载Hook
 * 根据环境和条件动态决定是否预加载webpack相关资源
 */
export const useSmartPreload = () => {
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === "undefined") return;

    // 检查是否需要预加载webpack.js
    const shouldPreloadWebpack = () => {
      // 开发环境总是预加载
      if (process.env.NODE_ENV === "development") {
        return true;
      }

      // 生产环境：检查特定条件
      const urlParams = new URLSearchParams(window.location.search);
      const hasDebugParam = urlParams.has("debug") || urlParams.has("webpack");
      const hasLocalStorageFlag =
        localStorage.getItem("enableWebpack") === "true";
      const hasSessionStorageFlag =
        sessionStorage.getItem("enableWebpack") === "true";

      return hasDebugParam || hasLocalStorageFlag || hasSessionStorageFlag;
    };

    // 预加载webpack.js
    const preloadWebpack = () => {
      const webpackUrl = "/_next/static/chunks/webpack.js";

      // 检查是否已经预加载
      const existing = document.querySelector(`link[href="${webpackUrl}"]`);
      if (existing) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("✅ webpack.js already preloaded");
        }
        return;
      }

      // 创建预加载链接
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = webpackUrl;
      link.as = "script";
      link.crossOrigin = "anonymous";

      // 添加成功回调
      link.onload = () => {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("✅ webpack.js preloaded successfully");
        }
      };

      // 添加错误回调
      link.onerror = () => {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("⚠️ Failed to preload webpack.js");
        }
      };

      document.head.appendChild(link);
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("🚀 Preloading webpack.js...");
      }
    };

    // 执行预加载检查
    if (shouldPreloadWebpack()) {
      preloadWebpack();
    } else {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("ℹ️ Skipping webpack.js preload in production");
      }
    }

    // 清理函数
    return () => {
      // 如果需要，可以在这里清理预加载的资源
    };
  }, []);

  // 返回预加载状态（可选）
  return {
    isWebpackPreloaded:
      typeof window !== "undefined" &&
      !!document.querySelector('link[href="/_next/static/chunks/webpack.js"]'),
  };
};

/**
 * 手动触发webpack.js预加载
 * 用于调试或特殊场景
 */
export const preloadWebpackManually = () => {
  if (typeof window === "undefined") return;

  const webpackUrl = "/_next/static/chunks/webpack.js";
  const existing = document.querySelector(`link[href="${webpackUrl}"]`);

  if (existing) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("✅ webpack.js already preloaded");
    }
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = webpackUrl;
  link.as = "script";
  link.crossOrigin = "anonymous";

  link.onload = () => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("✅ webpack.js manually preloaded");
    }
  };

  link.onerror = () => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("⚠️ Failed to manually preload webpack.js");
    }
  };

  document.head.appendChild(link);
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("🚀 Manually preloading webpack.js...");
  }
};

/**
 * 检查webpack.js是否被实际使用
 * 用于性能监控
 */
export const checkWebpackUsage = () => {
  if (typeof window === "undefined") return false;

  // 检查webpack是否在全局对象中
  interface WindowWithWebpack extends Window {
    webpackChunkName?: string;
    webpackJsonp?: unknown;
    __webpack_require__?: unknown;
  }
  const win = window as WindowWithWebpack;
  const hasWebpack =
    typeof win.webpackChunkName !== "undefined" ||
    typeof win.webpackJsonp !== "undefined" ||
    typeof win.__webpack_require__ !== "undefined";

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(
      "🔍 Webpack usage check:",
      hasWebpack ? "✅ Used" : "❌ Not used",
    );
  }
  return hasWebpack;
};
