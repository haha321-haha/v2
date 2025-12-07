"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UserFeedback } from "@/components/UserFeedback";
import { X } from "lucide-react";
import { logInfo } from "@/lib/debug-logger";

interface FeedbackBannerProps {
  locale: string;
}

export default function FeedbackBanner({ locale }: FeedbackBannerProps) {
  const t = useTranslations("downloadsPage");
  const [showFeedback, setShowFeedback] = useState(false);

  // 生成用户ID（如果不存在）
  const getUserId = () => {
    if (typeof window === "undefined") return "anonymous";
    let userId = localStorage.getItem("user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("user_id", userId);
    }
    return userId;
  };

  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 使用logger而不是console.log（开发环境自动启用，生产环境自动禁用）
    logInfo("提交反馈按钮被点击", undefined, "FeedbackBanner");
    setShowFeedback(true);
  };

  if (showFeedback) {
    return (
      <div
        className="fixed bottom-4 right-4 z-[100] max-w-xs"
        style={{ pointerEvents: "auto", marginBottom: "80px" }}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowFeedback(false);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors z-[101]"
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            type="button"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <UserFeedback
            userId={getUserId()}
            feature="downloads-page-feedback"
            page={`/${locale}/downloads`}
            onSubmit={() => {
              setTimeout(() => {
                setShowFeedback(false);
              }, 2000);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] max-w-xs"
      style={{ pointerEvents: "auto", marginBottom: "80px" }}
    >
      <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg border border-blue-500 relative">
        <div className="text-sm font-bold mb-2" suppressHydrationWarning>
          {t("content.banner.title")}
        </div>
        <div className="text-xs mb-3 opacity-90" suppressHydrationWarning>
          {t("content.banner.description")}
        </div>
        <button
          onClick={handleFeedbackClick}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="bg-white text-blue-600 px-3 py-2 rounded-lg text-xs w-full font-medium hover:bg-gray-50 transition-colors relative z-[101]"
          style={{ pointerEvents: "auto", cursor: "pointer" }}
          type="button"
          suppressHydrationWarning
        >
          {t("content.banner.feedbackButton")}
        </button>
      </div>
    </div>
  );
}
