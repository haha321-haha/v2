"use client";

// User Feedback Collection System - Day 4 Implementation
// Collects user feedback for stress assessment, radar chart, PHQ-9 and other features

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { logError, logInfo } from "@/lib/debug-logger";

interface FeedbackData {
  id: string;
  userId: string;
  page: string;
  feature: string;
  rating: number; // 1-5 分
  comment: string;
  timestamp: Date;
  metadata: {
    userVariant?: "control" | "treatment";
    answers?: number[];
    stressScore?: number;
    phq9Score?: number;
    deviceInfo?: string;
  };
}

interface UserFeedbackProps {
  userId: string;
  feature: string;
  page: string;
  onSubmit?: (feedback: FeedbackData) => void;
}

export function UserFeedback({
  userId,
  feature,
  page,
  onSubmit,
}: UserFeedbackProps) {
  const t = useTranslations("feedback");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // 用于 hover 预览效果
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    const feedback: FeedbackData = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      page,
      feature,
      rating,
      comment: comment.trim(),
      timestamp: new Date(),
      metadata: {
        userVariant:
          (localStorage.getItem("ab_test_variant") as
            | "control"
            | "treatment") || undefined,
        deviceInfo: `${navigator.userAgent.substring(0, 100)}...`,
        // can add more related data
      },
    };

    try {
      // Save to local storage
      saveFeedbackToLocal(feedback);

      // Send to analytics service (simulated)
      await sendFeedbackToAnalytics(feedback);

      setIsSubmitted(true);
      onSubmit?.(feedback);

      // 3秒后重置
      setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
        setComment("");
      }, 3000);
    } catch (error) {
      logError(
        "Feedback submission failed:",
        error,
        "UserFeedback/handleSubmit",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    const ratingTexts = {
      1: t("ratingTexts.1"),
      2: t("ratingTexts.2"),
      3: t("ratingTexts.3"),
      4: t("ratingTexts.4"),
      5: t("ratingTexts.5"),
    };
    return ratingTexts[rating as keyof typeof ratingTexts] || "";
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-600 text-4xl mb-2">✅</div>
        <p className="text-green-800 font-semibold">{t("successTitle")}</p>
        <p className="text-green-600 text-sm">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💬</span>
        <h3 className="text-lg font-semibold text-gray-800">{t("title")}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 评分 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("ratingLabel", { feature })}
          </label>
          <div
            className="flex gap-1"
            onMouseLeave={() => setHoverRating(0)} // 鼠标离开时清除预览
          >
            {[1, 2, 3, 4, 5].map((star) => {
              // 确定当前应该显示的评分（优先显示 hover，否则显示实际评分）
              const displayRating = hoverRating || rating;
              const isActive = star <= displayRating;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    logInfo(
                      `评分设置为: ${star}`,
                      { rating: star },
                      "UserFeedback/onClick",
                    );
                  }}
                  onMouseEnter={() => setHoverRating(star)} // 鼠标悬停时设置预览
                  className="p-1 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-6 h-6 transition-all duration-200 ${
                      isActive
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 fill-gray-100"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {getRatingText(rating)}
            </p>
          )}
        </div>

        {/* 文字反馈 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("commentLabel")}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("commentPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {comment.length}/500
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            rating === 0 || isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? t("submitting") : t("submitButton")}
        </button>
      </form>
    </div>
  );
}

// 反馈数据管理
export class FeedbackManager {
  private static readonly STORAGE_KEY = "user_feedback_data";

  static saveFeedback(feedback: FeedbackData): void {
    const existing = this.getAllFeedback();
    existing.push(feedback);

    // 只保留最近100条反馈
    if (existing.length > 100) {
      existing.splice(0, existing.length - 100);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
  }

  static getAllFeedback(): FeedbackData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logError(
        "Failed to read feedback data:",
        error,
        "UserFeedback/loadFeedbackHistory",
      );
      return [];
    }
  }

  static getFeedbackByFeature(feature: string): FeedbackData[] {
    return this.getAllFeedback().filter((f) => f.feature === feature);
  }

  static getFeedbackByUser(userId: string): FeedbackData[] {
    return this.getAllFeedback().filter((f) => f.userId === userId);
  }

  static getAverageRating(feature?: string): number {
    const feedback = feature
      ? this.getFeedbackByFeature(feature)
      : this.getAllFeedback();

    if (feedback.length === 0) return 0;

    const sum = feedback.reduce((acc, f) => acc + f.rating, 0);
    return Math.round((sum / feedback.length) * 10) / 10;
  }

  static exportFeedback(): string {
    const feedback = this.getAllFeedback();
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalCount: feedback.length,
        feedback,
      },
      null,
      2,
    );
  }
}

// 保存反馈到本地
function saveFeedbackToLocal(feedback: FeedbackData): void {
  FeedbackManager.saveFeedback(feedback);
}

// 发送到分析服务 (模拟)
async function sendFeedbackToAnalytics(feedback: FeedbackData): Promise<void> {
  // 实际项目中这里应该发送到您的分析服务
  logInfo(
    "Sending feedback to analytics service:",
    feedback,
    "UserFeedback/sendFeedbackToAnalytics",
  );

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      logInfo(
        "Feedback sent to analytics service",
        undefined,
        "UserFeedback/sendFeedbackToAnalytics",
      );
      resolve();
    }, 1000);
  });
}

// 快速反馈按钮组件
interface QuickFeedbackProps {
  userId: string;
  feature: string;
  page: string;
  className?: string;
}

export function QuickFeedback({
  userId,
  feature,
  page,
  className = "",
}: QuickFeedbackProps) {
  const t = useTranslations("feedback");
  const [showFeedback, setShowFeedback] = useState(false);

  if (!showFeedback) {
    return (
      <button
        onClick={() => setShowFeedback(true)}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
      >
        <span>💬</span>
        {t("title")}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowFeedback(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600 z-10"
      >
        ×
      </button>
      <div className="w-80">
        <UserFeedback
          userId={userId}
          feature={feature}
          page={page}
          onSubmit={() => setShowFeedback(false)}
        />
      </div>
    </div>
  );
}

// 反馈统计组件
export function FeedbackStats({ feature }: { feature?: string }) {
  const t = useTranslations("feedback");
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    recent: [] as FeedbackData[],
  });

  // 实际项目中这里应该从API获取数据
  const refreshStats = () => {
    const feedback = feature
      ? FeedbackManager.getFeedbackByFeature(feature)
      : FeedbackManager.getAllFeedback();

    setStats({
      total: feedback.length,
      average: FeedbackManager.getAverageRating(feature),
      recent: feedback.slice(-5).reverse(),
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">
          {feature
            ? `${feature}${t("userFeedback.stats.titleWithFeature", {
                feature: feature,
              })}`
            : t("userFeedback.stats.title")}
        </h4>
        <button
          onClick={refreshStats}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t("common.refresh")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600">
            {t("userFeedback.stats.totalFeedback")}
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {stats.average}
          </div>
          <div className="text-gray-600">
            {t("userFeedback.stats.averageRating")}
          </div>
        </div>
      </div>

      {stats.recent.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">
            {t("userFeedback.stats.recentFeedback")}
          </div>
          <div className="space-y-1">
            {stats.recent.map((f) => (
              <div key={f.id} className="text-xs text-gray-600">
                ⭐{f.rating} - {f.comment.substring(0, 30)}...
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
