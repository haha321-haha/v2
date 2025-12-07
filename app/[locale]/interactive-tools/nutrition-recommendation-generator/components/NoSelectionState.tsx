/**
 * 无选择状态组件 - 优化版本
 * 显示用户未选择任何选项时的友好提示
 */

"use client";

import { useState, useEffect } from "react";
import type { Language } from "../types";

interface NoSelectionStateProps {
  language: Language;
}

export default function NoSelectionState({ language }: NoSelectionStateProps) {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    // 添加进入动画 - 修复hydration错误
    setAnimationClass("animate-fade-in");
  }, []);

  const isZh = language === "zh";

  return (
    <div
      className={`text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm ${animationClass}`}
    >
      {/* 图标 */}
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-inner">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* 主标题 */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {isZh
          ? "准备生成您的专属建议"
          : "Ready to Generate Your Recommendations"}
      </h3>

      {/* 描述文字 */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {isZh
          ? '请先选择您的月经阶段、健康目标和整体健康体质，然后点击"生成我的建议"按钮'
          : 'Please select your menstrual phase, health goals, and Holistic Health constitution, then click "Generate My Recommendations"'}
      </p>

      {/* 底部装饰 */}
      <div className="mt-4 pt-3 border-t border-blue-100">
        <p className="text-xs text-gray-400">
          {isZh
            ? "✨ 基于科学研究和整体健康理论的个性化建议"
            : "✨ Personalized recommendations based on scientific research and Holistic Health theory"}
        </p>
      </div>
    </div>
  );
}
