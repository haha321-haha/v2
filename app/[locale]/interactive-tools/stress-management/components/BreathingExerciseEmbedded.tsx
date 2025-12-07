"use client";

import Link from "next/link";
import BreathingExercise from "@/components/BreathingExercise";

interface BreathingExerciseEmbeddedProps {
  locale: string;
}

export default function BreathingExerciseEmbedded({
  locale,
}: BreathingExerciseEmbeddedProps) {
  const isZh = locale === "zh";

  return (
    <div className="relative">
      {/* 嵌入式呼吸练习器 */}
      <BreathingExercise locale={locale} />

      {/* 全屏模式按钮 */}
      <div className="mt-4 text-center">
        <Link
          href={`/${locale}/interactive-tools/stress-management/breathing-exercise`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <span>{isZh ? "全屏模式" : "Fullscreen Mode"}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
