/**
 * 加载状态组件 - 基于ziV1d3d的加载逻辑
 * 显示生成推荐时的加载状态
 */

"use client";

import type { Language } from "../types";

interface LoadingStateProps {
  language: Language;
}

export default function LoadingState({ language }: LoadingStateProps) {
  return (
    <div className="text-center p-8 bg-neutral-100 rounded-lg">
      <div className="flex items-center justify-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
      <p className="font-medium text-neutral-600">
        {language === "zh" ? "正在生成..." : "Generating..."}
      </p>
    </div>
  );
}
