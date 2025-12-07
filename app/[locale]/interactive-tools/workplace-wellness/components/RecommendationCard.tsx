/**
 * 推荐卡片组件
 * 显示单个推荐项
 */

"use client";

import React, { useState, useCallback, memo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Wrench,
  MapPin,
  Lightbulb,
  CheckCircle,
  X,
  Star,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  AlertCircle,
  Zap,
  Heart,
  Activity,
  Stethoscope,
  Utensils,
  Moon,
  Sun,
  Coffee,
  Droplet,
  Flame,
} from "lucide-react";
import {
  RecommendationItem,
  RecommendationFeedbackAction,
} from "../types/recommendation";
import { RecommendationFeedbackHistory } from "../types";
import { useRecommendationFeedbackActions } from "../hooks/useWorkplaceWellnessStore";

type RatingValue = 1 | 2 | 3 | 4 | 5;

interface RecommendationCardProps {
  item: RecommendationItem;
  feedbackHistory: RecommendationFeedbackHistory;
  locale: string;
  onFeedback?: (itemId: string, action: RecommendationFeedbackAction) => void;
}

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Wrench,
  MapPin,
  Lightbulb,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Star,
  Bookmark,
  BookmarkCheck,
  // 添加更多常用图标
  Zap,
  Heart,
  Activity,
  Stethoscope,
  Utensils,
  Moon,
  Sun,
  Coffee,
  Droplet,
  Flame,
};

// 类型图标映射
const typeIconMap: Record<string, string> = {
  article: "BookOpen",
  tool: "Wrench",
  scenario: "MapPin",
  tip: "Lightbulb",
  action: "CheckCircle",
};

// 类型颜色映射
const typeColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  article: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  tool: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  scenario: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-200",
  },
  tip: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "border-yellow-200",
  },
  action: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
};

// 优先级颜色映射
const priorityColorMap: Record<string, { bg: string; text: string }> = {
  urgent: { bg: "bg-red-100", text: "text-red-700" },
  high: { bg: "bg-orange-100", text: "text-orange-700" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
  low: { bg: "bg-gray-100", text: "text-gray-700" },
};

const RecommendationCard = memo(function RecommendationCard({
  item,
  feedbackHistory,
  locale,
  onFeedback,
}: RecommendationCardProps) {
  const t = useTranslations("workplaceWellness.recommendations");
  const { addRecommendationFeedback } = useRecommendationFeedbackActions();
  const [isSaved, setIsSaved] = useState(
    feedbackHistory.savedItems.includes(item.id),
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [showRating, setShowRating] = useState(false);

  // 获取图标组件
  const IconComponent =
    iconMap[item.icon || ""] || iconMap[typeIconMap[item.type]] || BookOpen;

  // 获取类型颜色
  const typeColors = typeColorMap[item.type] || typeColorMap.article;

  // 获取优先级标签
  const getPriorityLabel = () => {
    if (item.priority >= 90) return "urgent";
    if (item.priority >= 70) return "high";
    if (item.priority >= 50) return "medium";
    return "low";
  };

  const priorityLabel = getPriorityLabel();
  const priorityColors = priorityColorMap[priorityLabel];

  // 处理点击 - 使用 useCallback 优化
  const handleClick = useCallback(() => {
    if (item.href) {
      addRecommendationFeedback({
        recommendationId: item.id,
        action: "clicked",
      });
      onFeedback?.(item.id, "clicked");
    }
  }, [item.href, item.id, addRecommendationFeedback, onFeedback]);

  // 处理收藏 - 使用 useCallback 优化
  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);

      addRecommendationFeedback({
        recommendationId: item.id,
        action: newSavedState ? "saved" : "dismissed",
      });
      onFeedback?.(item.id, newSavedState ? "saved" : "dismissed");
    },
    [item.id, isSaved, addRecommendationFeedback, onFeedback],
  );

  // 处理忽略 - 使用 useCallback 优化
  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDismissed(true);

      addRecommendationFeedback({
        recommendationId: item.id,
        action: "dismissed",
      });
      onFeedback?.(item.id, "dismissed");
    },
    [item.id, addRecommendationFeedback, onFeedback],
  );

  // 处理评分 - 使用 useCallback 优化
  const handleRating = useCallback(
    (rating: RatingValue) => {
      addRecommendationFeedback({
        recommendationId: item.id,
        action: "rated",
        rating,
      });
      setShowRating(false);
      onFeedback?.(item.id, "rated");
    },
    [item.id, addRecommendationFeedback, onFeedback],
  );

  if (isDismissed) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start space-x-4">
        {/* 图标 */}
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 ${typeColors.bg} ${typeColors.border} border rounded-lg flex items-center justify-center`}
          >
            <IconComponent className={`w-6 h-6 ${typeColors.text}`} />
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          {/* 头部：类型和优先级 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`${typeColors.bg} ${typeColors.text} text-xs font-medium px-2 py-1 rounded-full`}
              >
                {t(`types.${item.type}`)}
              </span>
              {item.priority >= 70 && (
                <span
                  className={`${priorityColors.bg} ${priorityColors.text} text-xs font-medium px-2 py-1 rounded-full`}
                >
                  {t(`priority.${priorityLabel}`)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* 收藏按钮 */}
              <button
                onClick={handleSave}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                title={isSaved ? t("actions.undoDismiss") : t("actions.save")}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-yellow-600" />
                ) : (
                  <Bookmark className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {/* 忽略按钮 */}
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                title={t("actions.dismiss")}
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t(item.title)}
          </h3>

          {/* 描述 */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {t(item.description)}
          </p>

          {/* 推荐理由 */}
          {item.reason && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-xs text-blue-700 flex items-start">
                <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{item.reason}</span>
              </p>
            </div>
          )}

          {/* 元数据 */}
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
            {item.metadata?.readTime && (
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {item.metadata.readTime}{" "}
                {t("dataQuality.suggestion").includes("分钟") ? "分钟" : "min"}
              </span>
            )}
            {item.metadata?.difficulty && (
              <span className="capitalize">
                {t(`difficulty.${item.metadata.difficulty}`) ||
                  item.metadata.difficulty}
              </span>
            )}
            {item.score > 0 && (
              <span className="flex items-center">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {item.score.toFixed(1)}
              </span>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            {item.href ? (
              <Link
                href={`/${locale}${item.href}`}
                onClick={handleClick}
                className={`inline-flex items-center ${
                  typeColors.text
                } hover:${typeColors.text.replace(
                  "600",
                  "800",
                )} font-medium text-sm transition-colors`}
                suppressHydrationWarning={true}
              >
                {t("actions.click")}
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            ) : (
              <span className="text-sm text-gray-400">
                {t("actions.click")}
              </span>
            )}

            {/* 评分按钮 */}
            <button
              onClick={() => setShowRating(!showRating)}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              title={t("actions.rate")}
            >
              <Star className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* 评分面板 */}
          {showRating && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 mb-2">
                {t("feedback.ratePrompt")}
              </p>
              <div className="flex items-center gap-1">
                {([1, 2, 3, 4, 5] as const).map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        rating <= (feedbackHistory.itemRatings[item.id] || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default RecommendationCard;
