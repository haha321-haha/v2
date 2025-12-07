"use client";

import { useEffect } from "react";
import { logInfo } from "@/lib/debug-logger";

export default function ClientErrorHandler() {
  useEffect(() => {
    // 捕获并隔离异步错误
    const handleError = (e: ErrorEvent) => {
      if (e.message.includes("message channel closed")) {
        e.preventDefault();
        logInfo(
          "已拦截异步消息通道错误，防止影响React渲染",
          undefined,
          "ClientErrorHandler/handleError",
        );
      }
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason &&
        e.reason.message &&
        e.reason.message.includes("message channel closed")
      ) {
        e.preventDefault();
        logInfo(
          "已拦截Promise异步错误，防止影响React渲染",
          undefined,
          "ClientErrorHandler/handleUnhandledRejection",
        );
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}
