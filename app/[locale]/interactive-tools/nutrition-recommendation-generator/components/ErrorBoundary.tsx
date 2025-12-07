// Fast Refresh兼容的错误边界包装器
// 将类组件包装在函数组件中，避免Fast Refresh问题

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "@/lib/debug-logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// 内部类组件（不导出）
class InternalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(
      "ErrorBoundary caught an error",
      { error, errorInfo },
      "ErrorBoundary",
    );

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              出现错误
            </h2>
            <p className="text-red-600 mb-2">
              抱歉，页面遇到了问题。请刷新页面重试。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              刷新页面
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// 导出的函数组件包装器
export default function ErrorBoundary(props: Props) {
  return <InternalErrorBoundary {...props} />;
}
