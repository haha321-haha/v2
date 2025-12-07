/**
 * 推荐系统错误边界组件
 * 用于捕获推荐组件中的错误
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logError } from "@/lib/debug-logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RecommendationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(
      "Recommendation system error",
      error,
      "RecommendationErrorBoundary",
    );
    logError(
      "Recommendation error details",
      errorInfo,
      "RecommendationErrorBoundary",
    );

    // 可以在这里添加错误上报逻辑
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <RecommendationErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function RecommendationErrorFallback({
  error,
  onReset,
}: {
  error?: Error;
  onReset: () => void;
}) {
  const t = useTranslations("workplaceWellness.recommendations");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
      <div className="flex items-center justify-center py-8">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("error")}
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {error?.message || t("error")}
          </p>
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("actions.refresh")}
          </button>
        </div>
      </div>
    </div>
  );
}
