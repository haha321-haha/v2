"use client";

/**
 * AEO 监控仪表板
 *
 * 显示 AEO 追踪数据、指标统计和趋势分析
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Link as LinkIcon,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface AEOMetrics {
  totalReferences: number;
  referencesBySource: Record<string, number>;
  referencesByPage: Record<string, number>;
  averageAccuracyScore: number;
  sourceLinkPercentage: number;
  recentTrend: Array<{ date: string; count: number }>;
}

export default function AEODashboard() {
  const [metrics, setMetrics] = useState<AEOMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/aeo/metrics?days=${days}`);
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchMetrics();
  }, [days, fetchMetrics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Activity className="w-12 h-12 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading metrics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-red-600 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const topSources = Object.entries(metrics.referencesBySource)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topPages = Object.entries(metrics.referencesByPage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const maxTrendValue = Math.max(...metrics.recentTrend.map((t) => t.count), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AEO 监控仪表板
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI 搜索引擎引用追踪和分析
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                days === d
                  ? "bg-purple-500 text-white"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {d} 天
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total References */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                总引用数
              </h3>
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics.totalReferences.toLocaleString()}
            </p>
          </div>

          {/* Average Accuracy */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                平均准确性
              </h3>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics.averageAccuracyScore.toFixed(1)}%
            </p>
          </div>

          {/* Source Link Percentage */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                来源链接率
              </h3>
              <LinkIcon className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics.sourceLinkPercentage.toFixed(1)}%
            </p>
          </div>

          {/* Unique Sources */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                来源数量
              </h3>
              <BarChart3 className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {Object.keys(metrics.referencesBySource).length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <TrendingUp className="w-5 h-5 inline mr-2" />
              引用趋势
            </h2>
            <div className="space-y-2">
              {metrics.recentTrend.slice(0, 14).map((trend) => (
                <div key={trend.date} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(trend.date).toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-6 relative">
                    <div
                      className="bg-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(trend.count / maxTrendValue) * 100}%`,
                      }}
                    >
                      {trend.count > 0 && (
                        <span className="text-xs text-white font-medium">
                          {trend.count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sources */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <BarChart3 className="w-5 h-5 inline mr-2" />
              主要来源
            </h2>
            <div className="space-y-3">
              {topSources.map(([source, count]) => {
                const percentage = (count / metrics.totalReferences) * 100;
                return (
                  <div key={source}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {source}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <FileText className="w-5 h-5 inline mr-2" />
            热门页面
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    页面 URL
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    引用数
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    占比
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPages.map(([page, count]) => {
                  const percentage = (count / metrics.totalReferences) * 100;
                  return (
                    <tr
                      key={page}
                      className="border-b border-gray-100 dark:border-slate-700/50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        <a
                          href={page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-500 hover:underline truncate block max-w-md"
                        >
                          {page}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                        {count}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                        {percentage.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
