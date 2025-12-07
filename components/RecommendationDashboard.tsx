"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { logError } from "@/lib/debug-logger";

interface RecommendationStats {
  totalDisplays: number;
  totalClicks: number;
  clickThroughRate: number;
  topRecommendedArticles: Array<{ slug: string; count: number }>;
  topClickedArticles: Array<{ slug: string; count: number }>;
}

interface CacheStats {
  size: number;
  maxSize: number;
  ttl: number;
}

// 国际化文本
const TEXTS = {
  zh: {
    title: "推荐系统仪表板",
    subtitle: "监控文章推荐效果和系统性能",
    timeRange: {
      "24h": "24小时",
      "7d": "7天",
      "30d": "30天",
      all: "全部",
    },
    metrics: {
      displays: "推荐展示次数",
      clicks: "推荐点击次数",
      ctr: "点击率 (CTR)",
    },
    cache: {
      title: "缓存统计",
      clearButton: "清空缓存",
      entries: "缓存条目",
      usage: "缓存使用率",
      ttl: "缓存TTL",
      minutes: "分钟",
    },
    topRecommended: "最常被推荐的文章",
    topClicked: "最常被点击的推荐文章",
    times: "次",
    alerts: {
      cacheCleared: "缓存已清空",
      cacheClearFailed: "清空缓存失败",
    },
  },
  en: {
    title: "Recommendation System Dashboard",
    subtitle: "Monitor article recommendation performance and system metrics",
    timeRange: {
      "24h": "24 Hours",
      "7d": "7 Days",
      "30d": "30 Days",
      all: "All Time",
    },
    metrics: {
      displays: "Recommendation Displays",
      clicks: "Recommendation Clicks",
      ctr: "Click-Through Rate (CTR)",
    },
    cache: {
      title: "Cache Statistics",
      clearButton: "Clear Cache",
      entries: "Cache Entries",
      usage: "Cache Usage",
      ttl: "Cache TTL",
      minutes: "minutes",
    },
    topRecommended: "Most Recommended Articles",
    topClicked: "Most Clicked Recommended Articles",
    times: "times",
    alerts: {
      cacheCleared: "Cache cleared successfully",
      cacheClearFailed: "Failed to clear cache",
    },
  },
};

/**
 * 推荐系统仪表板组件
 * 用于查看推荐效果和缓存统计
 */
export default function RecommendationDashboard() {
  const params = useParams();
  const locale = (params?.locale as string) || "zh";
  const t = TEXTS[locale as keyof typeof TEXTS] || TEXTS.zh;

  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">(
    "24h",
  );

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/recommendation-stats?range=${timeRange}`,
      );
      const data = await response.json();
      setStats(data.stats);
      setCacheStats(data.cacheStats);
    } catch (error) {
      logError(
        "Failed to fetch recommendation stats:",
        error,
        "RecommendationDashboard/fetchStats",
      );
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const clearCache = async () => {
    try {
      await fetch("/api/recommendation-cache", { method: "DELETE" });
      alert(t.alerts.cacheCleared);
      fetchStats();
    } catch (error) {
      logError(
        "Failed to clear cache:",
        error,
        "RecommendationDashboard/clearCache",
      );
      alert(t.alerts.cacheClearFailed);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* 时间范围选择 */}
      <div className="mb-6 flex gap-2">
        {(["24h", "7d", "30d", "all"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded ${
              timeRange === range
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.timeRange[range]}
          </button>
        ))}
      </div>

      {/* 核心指标 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              {t.metrics.displays}
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalDisplays.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              {t.metrics.clicks}
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalClicks.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              {t.metrics.ctr}
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.clickThroughRate.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* 缓存统计 */}
      {cacheStats && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t.cache.title}</h2>
            <button
              onClick={clearCache}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t.cache.clearButton}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-sm">{t.cache.entries}</p>
              <p className="text-2xl font-bold">
                {cacheStats.size} / {cacheStats.maxSize}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t.cache.usage}</p>
              <p className="text-2xl font-bold">
                {((cacheStats.size / cacheStats.maxSize) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t.cache.ttl}</p>
              <p className="text-2xl font-bold">
                {(cacheStats.ttl / 60000).toFixed(0)} {t.cache.minutes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 热门推荐文章 */}
      {stats && stats.topRecommendedArticles.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{t.topRecommended}</h2>
          <div className="space-y-2">
            {stats.topRecommendedArticles.map((article, index) => (
              <div
                key={article.slug}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium">{article.slug}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {article.count.toLocaleString()} {t.times}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 热门点击文章 */}
      {stats && stats.topClickedArticles.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{t.topClicked}</h2>
          <div className="space-y-2">
            {stats.topClickedArticles.map((article, index) => (
              <div
                key={article.slug}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium">{article.slug}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {article.count.toLocaleString()} {t.times}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
