/**
 * 推荐区域组件
 * 按类型或分类分组显示推荐
 */

"use client";

import React, { memo } from "react";
import {
  RecommendationFeedbackAction,
  RecommendationItem,
} from "../types/recommendation";
import { RecommendationFeedbackHistory } from "../types";
import RecommendationCard from "./RecommendationCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RecommendationSectionProps {
  title: string;
  items: RecommendationItem[];
  feedbackHistory: RecommendationFeedbackHistory;
  locale: string;
  defaultExpanded?: boolean;
  maxItems?: number;
  onFeedback?: (itemId: string, action: RecommendationFeedbackAction) => void;
}

const RecommendationSection = memo(function RecommendationSection({
  title,
  items,
  feedbackHistory,
  locale,
  defaultExpanded = true,
  maxItems = 5,
  onFeedback,
}: RecommendationSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [showAll, setShowAll] = React.useState(false);

  if (items.length === 0) return null;

  const displayedItems = showAll ? items : items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <div className="mb-8">
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* 推荐列表 */}
      {isExpanded && (
        <div className="space-y-4">
          {displayedItems.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              feedbackHistory={feedbackHistory}
              locale={locale}
              onFeedback={onFeedback}
            />
          ))}

          {/* 显示更多按钮 */}
          {hasMore && !showAll && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAll(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                显示全部 {items.length} 个推荐
              </button>
            </div>
          )}

          {/* 收起按钮 */}
          {hasMore && showAll && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAll(false)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                收起
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default RecommendationSection;
