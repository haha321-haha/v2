/**
 * 搜索历史管理工具
 * 用于管理用户的搜索历史记录
 */

import { logError } from "@/lib/debug-logger";

export interface SearchHistoryItem {
  term: string;
  timestamp: number;
  resultCount: number;
}

const SEARCH_HISTORY_KEY = "periodhub_search_history";
const MAX_HISTORY_ITEMS = 10;

/**
 * 获取搜索历史
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored) as SearchHistoryItem[];
    // 验证数据格式
    if (!Array.isArray(history)) return [];

    return history.filter(
      (item) =>
        item &&
        typeof item.term === "string" &&
        typeof item.timestamp === "number" &&
        typeof item.resultCount === "number",
    );
  } catch (error) {
    logError(
      "Failed to get search history:",
      error,
      "searchHistory/getSearchHistory",
    );
    return [];
  }
}

/**
 * 添加搜索记录
 */
export function addSearchHistory(
  term: string,
  resultCount: number,
): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  if (!term || term.trim().length === 0) return getSearchHistory();

  try {
    const history = getSearchHistory();

    // 移除相同的搜索词（如果存在）
    const filteredHistory = history.filter(
      (item) => item.term.toLowerCase() !== term.toLowerCase(),
    );

    // 添加新记录到开头
    const newItem: SearchHistoryItem = {
      term: term.trim(),
      timestamp: Date.now(),
      resultCount,
    };

    const updatedHistory = [newItem, ...filteredHistory].slice(
      0,
      MAX_HISTORY_ITEMS,
    );

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    logError(
      "Failed to add search history:",
      error,
      "searchHistory/addSearchHistory",
    );
    return getSearchHistory();
  }
}

/**
 * 删除单条搜索记录
 */
export function removeSearchHistoryItem(term: string): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const history = getSearchHistory();
    const updatedHistory = history.filter(
      (item) => item.term.toLowerCase() !== term.toLowerCase(),
    );

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    logError(
      "Failed to remove search history item:",
      error,
      "searchHistory/removeSearchHistoryItem",
    );
    return getSearchHistory();
  }
}

/**
 * 清空所有搜索历史
 */
export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    logError(
      "Failed to clear search history:",
      error,
      "searchHistory/clearSearchHistory",
    );
  }
}

/**
 * 获取最近的搜索词（用于建议）
 */
export function getRecentSearchTerms(limit: number = 5): string[] {
  const history = getSearchHistory();
  return history.slice(0, limit).map((item) => item.term);
}

/**
 * 获取热门搜索词（按搜索频率）
 */
export function getPopularSearchTerms(limit: number = 5): string[] {
  const history = getSearchHistory();

  // 统计每个搜索词的出现次数
  const termCounts = new Map<string, number>();
  history.forEach((item) => {
    const term = item.term.toLowerCase();
    termCounts.set(term, (termCounts.get(term) || 0) + 1);
  });

  // 按频率排序
  const sortedTerms = Array.from(termCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term]) => term);

  return sortedTerms;
}

/**
 * 检查搜索历史是否为空
 */
export function isSearchHistoryEmpty(): boolean {
  return getSearchHistory().length === 0;
}

/**
 * 获取搜索历史统计信息
 */
export function getSearchHistoryStats() {
  const history = getSearchHistory();

  return {
    totalSearches: history.length,
    uniqueTerms: new Set(history.map((item) => item.term.toLowerCase())).size,
    averageResultCount:
      history.length > 0
        ? Math.round(
            history.reduce((sum, item) => sum + item.resultCount, 0) /
              history.length,
          )
        : 0,
    lastSearchTime: history.length > 0 ? history[0].timestamp : null,
  };
}
