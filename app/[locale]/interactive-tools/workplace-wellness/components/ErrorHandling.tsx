/**
 * HVsLYEp职场健康助手 - 错误处理组件
 * Day 10: 用户体验优化 - 交互体验提升
 * 基于HVsLYEp的错误处理设计
 */

"use client";

import { ReactNode, Component, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { logError } from "@/lib/debug-logger";

// 错误边界组件
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

// 内部类组件（不导出）
class InternalErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    // 开发环境下打印错误信息
    if (process.env.NODE_ENV === "development") {
      logError("ErrorBoundary caught an error", error, "InternalErrorBoundary");
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// 错误回退组件
export function ErrorFallback({
  error,
  onRetry,
}: {
  error?: Error;
  onRetry?: () => void;
}) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">出现错误</h1>
          <p className="text-neutral-600 mb-6">
            抱歉，页面遇到了问题。请尝试刷新页面或联系技术支持。
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            重试
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <Home className="w-4 h-4 inline mr-2" />
            返回首页
          </button>
        </div>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
              ▶ 错误详情 (开发模式)
            </summary>
            <div className="mt-2 p-3 bg-neutral-100 rounded text-xs font-mono text-neutral-700 overflow-auto">
              <div className="mb-2">
                <strong>错误信息:</strong>
                <pre className="whitespace-pre-wrap">{error.message}</pre>
              </div>
              {error.stack && (
                <div>
                  <strong>堆栈跟踪:</strong>
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// 网络错误组件
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-center p-6">
      <div className="mb-4">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          网络连接问题
        </h3>
        <p className="text-neutral-600 mb-4">
          无法连接到服务器，请检查网络连接后重试。
        </p>
      </div>

      <button
        onClick={onRetry}
        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 inline mr-2" />
        重试
      </button>
    </div>
  );
}

// 数据加载错误组件
export function DataLoadError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-center p-6">
      <div className="mb-4">
        <Bug className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          数据加载失败
        </h3>
        <p className="text-neutral-600 mb-4">无法加载数据，请稍后重试。</p>
      </div>

      <button
        onClick={onRetry}
        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 inline mr-2" />
        重新加载
      </button>
    </div>
  );
}

// 空状态组件
export function EmptyState({
  title = "暂无数据",
  description = "当前没有可显示的内容",
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="text-center p-8">
      <div className="mb-4">
        {icon || (
          <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4" />
        )}
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h3>
        <p className="text-neutral-600 mb-6">{description}</p>
      </div>

      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

// 表单错误组件
export function FormError({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  );
}

// 成功消息组件
export function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <p className="text-green-700 text-sm">{message}</p>
    </div>
  );
}

// 警告消息组件
export function WarningMessage({ message }: { message: string }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
      <p className="text-yellow-700 text-sm">{message}</p>
    </div>
  );
}

// 导出的函数组件包装器
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <InternalErrorBoundary {...props} />;
}

// 信息消息组件
export function InfoMessage({ message }: { message: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <p className="text-blue-700 text-sm">{message}</p>
    </div>
  );
}
