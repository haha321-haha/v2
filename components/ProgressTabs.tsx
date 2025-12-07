"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  getAllEntries,
  getTodayEntries,
  getWeekEntries,
  getMonthEntries,
  calculateStats,
  formatDate,
  formatTime,
  getTechniqueLabel,
  getStressColor,
  getMoodColor,
  getStorageInfo,
  deleteOldestEntries,
  deleteEntry,
  type ProgressEntry,
} from "@/lib/progressStorage";

interface ProgressTabsProps {
  locale: string;
}

type TabType = "all" | "today" | "week" | "month";

export default function ProgressTabs({ locale }: ProgressTabsProps) {
  const t = useTranslations("interactiveTools.stressManagement.progress");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageInfo, setStorageInfo] =
    useState<ReturnType<typeof getStorageInfo>>(null);
  const [showManageModal, setShowManageModal] = useState(false);

  const loadEntries = useCallback(() => {
    setIsLoading(true);
    let loadedEntries: ProgressEntry[] = [];

    switch (activeTab) {
      case "today":
        loadedEntries = getTodayEntries();
        break;
      case "week":
        loadedEntries = getWeekEntries();
        break;
      case "month":
        loadedEntries = getMonthEntries();
        break;
      default:
        loadedEntries = getAllEntries();
    }

    setEntries(loadedEntries);
    setStorageInfo(getStorageInfo());
    setIsLoading(false);
  }, [activeTab]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleDeleteOldEntries = (count: number) => {
    if (confirm(`确定要删除最旧的 ${count} 条记录吗？此操作无法撤销。`)) {
      const deleted = deleteOldestEntries(count);
      alert(`已删除 ${deleted} 条记录`);
      loadEntries();
      setShowManageModal(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("确定要删除这条记录吗？此操作无法撤销。")) {
      deleteEntry(id);
      loadEntries();
    }
  };

  const stats = calculateStats(entries);
  const recentEntries = [...entries]
    .reverse()
    .slice(0, activeTab === "all" ? 5 : entries.length);

  const tabs = [
    { id: "all" as TabType, label: t("tabs.all"), icon: "📊" },
    { id: "today" as TabType, label: t("tabs.today"), icon: "📅" },
    { id: "week" as TabType, label: t("tabs.week"), icon: "📈" },
    { id: "month" as TabType, label: t("tabs.month"), icon: "📆" },
  ];

  return (
    <div>
      {/* Storage Warning */}
      {storageInfo && (storageInfo.isFull || storageInfo.isNearFull) && (
        <div
          className={`rounded-lg p-4 mb-6 ${
            storageInfo.isFull
              ? "bg-red-50 border-2 border-red-300"
              : "bg-yellow-50 border-2 border-yellow-300"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{storageInfo.isFull ? "⚠️" : "⚡"}</div>
            <div className="flex-1">
              <h3
                className={`font-bold mb-1 ${
                  storageInfo.isFull ? "text-red-700" : "text-yellow-700"
                }`}
              >
                {storageInfo.isFull ? "存储空间已满" : "存储空间即将满"}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                {storageInfo.isFull
                  ? `当前使用 ${storageInfo.sizeInMB}MB / ${storageInfo.maxSizeInMB}MB (${storageInfo.usagePercent}%)。无法添加新记录，请删除一些旧记录。`
                  : `当前使用 ${storageInfo.sizeInMB}MB / ${storageInfo.maxSizeInMB}MB (${storageInfo.usagePercent}%)。建议删除一些旧记录以避免存储问题。`}
              </p>
              <button
                onClick={() => setShowManageModal(true)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  storageInfo.isFull
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white"
                }`}
              >
                管理数据
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Management Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">数据管理</h2>

            {storageInfo && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>存储使用情况</span>
                  <span className="font-bold">{storageInfo.usagePercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      storageInfo.isFull
                        ? "bg-red-600"
                        : storageInfo.isNearFull
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(storageInfo.usagePercent, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {storageInfo.sizeInMB} MB / {storageInfo.maxSizeInMB} MB
                </p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600">
                当前共有{" "}
                <span className="font-bold text-purple-600">
                  {getAllEntries().length}
                </span>{" "}
                条记录
              </p>

              <button
                onClick={() => handleDeleteOldEntries(10)}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-left"
              >
                <div className="font-semibold">删除最旧的 10 条记录</div>
                <div className="text-xs opacity-90">推荐：清理少量旧数据</div>
              </button>

              <button
                onClick={() => handleDeleteOldEntries(50)}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-left"
              >
                <div className="font-semibold">删除最旧的 50 条记录</div>
                <div className="text-xs opacity-90">适合：数据较多时</div>
              </button>

              <button
                onClick={() => handleDeleteOldEntries(100)}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-left"
              >
                <div className="font-semibold">删除最旧的 100 条记录</div>
                <div className="text-xs opacity-90">大量清理</div>
              </button>
            </div>

            <button
              onClick={() => setShowManageModal(false)}
              className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        <button
          onClick={loadEntries}
          className="ml-auto px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          title={t("tabs.refresh")}
        >
          🔄 {t("tabs.refresh")}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Statistics */}
          {entries.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                {activeTab === "all" && t("statistics.overall")}
                {activeTab === "today" && t("statistics.todaySummary")}
                {activeTab === "week" && t("statistics.weekSummary")}
                {activeTab === "month" && t("statistics.monthSummary")}
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {stats.totalEntries}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("statistics.totalEntries")}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-1 ${getStressColor(
                        stats.averageStress,
                      )}`}
                    >
                      {stats.averageStress}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("statistics.avgStress")}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {stats.techniquesUsedRate}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("statistics.techniquesUsed")}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-1 ${getMoodColor(
                        stats.averageMood,
                      )}`}
                    >
                      {stats.averageMood}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("statistics.avgMood")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Entries List */}
          {entries.length > 0 ? (
            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">
                  {activeTab === "all" &&
                    `${t("entries.recent")} (${recentEntries.length})`}
                  {activeTab === "today" &&
                    `${t("entries.todayEntries")} (${entries.length})`}
                  {activeTab === "week" &&
                    `${t("entries.weekEntries")} (${entries.length})`}
                  {activeTab === "month" &&
                    `${t("entries.monthEntries")} (${entries.length})`}
                </h3>
                {activeTab === "all" && entries.length > 5 && (
                  <span className="text-sm text-gray-500">
                    {t("entries.showing")} 5 {t("entries.of")} {entries.length}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border-l-4 border-purple-500 bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors relative group"
                  >
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
                      title={t("entries.delete")}
                    >
                      🗑️ {t("entries.delete")}
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-20">
                      <div className="text-sm text-gray-600">
                        {activeTab === "today"
                          ? formatTime(entry.date)
                          : formatDate(entry.date)}
                      </div>
                      <div className="flex gap-4">
                        <span
                          className={`font-semibold ${getStressColor(
                            entry.stressLevel,
                          )}`}
                        >
                          {t("entries.stress")}: {entry.stressLevel}/10
                        </span>
                        <span
                          className={`font-semibold ${getMoodColor(
                            entry.moodRating,
                          )}`}
                        >
                          {t("entries.mood")}: {entry.moodRating}/10
                        </span>
                      </div>
                    </div>
                    {entry.techniques.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {entry.techniques.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {getTechniqueLabel(tech)}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-gray-700 italic mt-2">
                        &quot;{entry.notes}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {activeTab === "all" && t("emptyState.all")}
                {activeTab === "today" && t("emptyState.today")}
                {activeTab === "week" && t("emptyState.week")}
                {activeTab === "month" && t("emptyState.month")}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "all"
                  ? t("emptyState.description")
                  : t("emptyState.descriptionShort")}
              </p>
              <Link
                href={`/${locale}/interactive-tools/stress-management/progress/add`}
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {t("emptyState.addEntry")}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
