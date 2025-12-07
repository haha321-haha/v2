"use client";

import React, { useEffect, useRef } from "react";
import { Clock, TrendingUp, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

export interface SearchSuggestion {
  term: string;
  type: "history" | "popular" | "suggestion";
  resultCount?: number;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  searchHistory: string[];
  onSelectSuggestion: (term: string) => void;
  onRemoveHistory: (term: string) => void;
  onClearHistory: () => void;
  show: boolean;
  highlightedIndex: number;
  onHighlightChange: (index: number) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  searchHistory,
  onSelectSuggestion,
  onRemoveHistory,
  onClearHistory,
  show,
  highlightedIndex,
  onHighlightChange,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = useTranslations("simplePdfCenter");
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 滚动到高亮项
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionRefs.current[highlightedIndex]) {
      suggestionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  if (!show) return null;

  const hasHistory = searchHistory.length > 0;
  const hasSuggestions = suggestions.length > 0;

  if (!hasHistory && !hasSuggestions) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
      {/* 搜索历史 */}
      {hasHistory && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4" />
              <span>最近搜索</span>
            </div>
            <button
              onClick={onClearHistory}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              清空
            </button>
          </div>
          <div className="space-y-1">
            {searchHistory.slice(0, 5).map((term, index) => (
              <div
                key={`history-${term}`}
                ref={(el) => {
                  suggestionRefs.current[index] = el;
                }}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  highlightedIndex === index
                    ? "bg-purple-50 text-purple-700"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectSuggestion(term)}
                onMouseEnter={() => onHighlightChange(index)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm">{term}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHistory(term);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 搜索建议 */}
      {hasSuggestions && (
        <div className="p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>推荐搜索</span>
          </div>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => {
              const actualIndex = hasHistory
                ? searchHistory.slice(0, 5).length + index
                : index;
              return (
                <div
                  key={`suggestion-${suggestion.term}`}
                  ref={(el) => {
                    suggestionRefs.current[actualIndex] = el;
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    highlightedIndex === actualIndex
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onSelectSuggestion(suggestion.term)}
                  onMouseEnter={() => onHighlightChange(actualIndex)}
                >
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm">{suggestion.term}</span>
                  {suggestion.resultCount !== undefined && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {suggestion.resultCount} 结果
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
