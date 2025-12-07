"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PerformanceManager } from "../../../../../lib/pain-tracker/performance";
import {
  PainRecord,
  PaginationOptions,
  LazyLoadResult,
} from "../../../../../types/pain-tracker";

type Locale = "en" | "zh";

interface HistoryTabProps {
  locale: Locale;
}

export default function HistoryTab({ locale }: HistoryTabProps) {
  const t = useTranslations("interactiveTools.history");
  const [filterDateRange, setFilterDateRange] = useState<
    "all" | "week" | "month" | "quarter"
  >("all");
  const [filterPainLevel, setFilterPainLevel] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  // Performance optimization states
  const [records, setRecords] = useState<PainRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Performance manager instance
  const performanceManager = useMemo(() => new PerformanceManager(), []);

  // Mock data fallback for demo
  const getMockRecords = (): PainRecord[] => [
    {
      id: "1",
      date: "2024-01-15",
      time: "14:30",
      painLevel: 7,
      painTypes: ["cramping"],
      locations: ["lower_abdomen"],
      symptoms: ["nausea"],
      menstrualStatus: "day_1",
      medications: [{ name: "Ibuprofen", timing: "during pain" }],
      effectiveness: 6,
      lifestyleFactors: [],
      notes:
        locale === "zh"
          ? "经期第一天，疼痛较重"
          : "First day of period, severe pain",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      date: "2024-01-14",
      time: "16:00",
      painLevel: 5,
      painTypes: ["aching"],
      locations: ["lower_back"],
      symptoms: ["fatigue"],
      menstrualStatus: "before_period",
      medications: [{ name: "Heat pad", timing: "during pain" }],
      effectiveness: 7,
      lifestyleFactors: [],
      notes: locale === "zh" ? "经期前症状" : "Pre-menstrual symptoms",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      date: "2024-01-13",
      time: "10:15",
      painLevel: 3,
      painTypes: ["aching"],
      locations: ["upper_thighs"],
      symptoms: [],
      menstrualStatus: "before_period",
      medications: [],
      effectiveness: 0,
      lifestyleFactors: [],
      notes: undefined,
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-13"),
    },
  ];

  // Load records with lazy loading and performance optimization
  const loadRecords = useCallback(
    async (page: number = 1, resetData: boolean = false) => {
      setLoading(true);

      try {
        // Build filters based on current filter state
        const filters: Record<string, string | number | Date> = {};

        // Date range filter
        if (filterDateRange !== "all") {
          const now = new Date();
          const startDate = new Date(now);

          switch (filterDateRange) {
            case "week":
              startDate.setDate(now.getDate() - 7);
              break;
            case "month":
              startDate.setDate(now.getDate() - 30);
              break;
            case "quarter":
              startDate.setDate(now.getDate() - 90);
              break;
          }

          filters.startDate = startDate.toISOString();
          filters.endDate = now.toISOString();
        }

        // Pain level filter
        if (filterPainLevel !== "all") {
          switch (filterPainLevel) {
            case "low":
              filters.minPainLevel = 0;
              filters.maxPainLevel = 3;
              break;
            case "medium":
              filters.minPainLevel = 4;
              filters.maxPainLevel = 6;
              break;
            case "high":
              filters.minPainLevel = 7;
              filters.maxPainLevel = 10;
              break;
          }
        }

        const paginationOptions: PaginationOptions = {
          page,
          pageSize: pagination.pageSize,
          sortBy: "date",
          sortOrder: "desc",
          filters,
          preload: true,
        };

        const result: LazyLoadResult<PainRecord> =
          await performanceManager.loadRecordsPaginated(paginationOptions);

        if (resetData || page === 1) {
          setRecords(result.data);
        } else {
          // Append for infinite scroll
          setRecords((prev) => [...prev, ...result.data]);
        }

        setPagination(result.pagination);
      } catch {
        // Failed to load records - handled silently, fallback to mock data
        setRecords(getMockRecords());
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterDateRange, filterPainLevel, pagination.pageSize, performanceManager],
  );

  // Load initial data
  useEffect(() => {
    loadRecords(1, true);
  }, [filterDateRange, filterPainLevel, loadRecords]);

  // Handle load more for pagination
  const handleLoadMore = useCallback(() => {
    if (pagination.hasNextPage && !loading) {
      loadRecords(pagination.currentPage + 1, false);
    }
  }, [pagination.hasNextPage, pagination.currentPage, loading, loadRecords]);

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return "text-green-600 bg-green-100";
    if (level <= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getPainLevelLabel = (level: number) => {
    if (level <= 3) return t("painLevels.mild");
    if (level <= 6) return t("painLevels.moderate");
    return t("painLevels.severe");
  };

  const getLocationName = (location: string) => {
    const key = `locations.${location}`;
    return t(key as never, { default: location });
  };

  const getPainTypeName = (type: string) => {
    const key = `painTypes.${type}`;
    return t(key as never, { default: type });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </header>

      {/* Filters */}
      <section
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
        aria-labelledby="filters-heading"
      >
        <h2
          id="filters-heading"
          className="text-base sm:text-lg font-medium text-gray-900 mb-4"
        >
          {t("filters.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Date Range Filter */}
          <div>
            <label
              htmlFor="date-range-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("filters.dateRange.label")}
            </label>
            <select
              id="date-range-filter"
              value={filterDateRange}
              onChange={(e) =>
                setFilterDateRange(
                  e.target.value as "all" | "week" | "month" | "quarter",
                )
              }
              className="w-full px-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              aria-describedby="date-range-help"
            >
              <option value="all">{t("filters.dateRange.all")}</option>
              <option value="week">{t("filters.dateRange.week")}</option>
              <option value="month">{t("filters.dateRange.month")}</option>
              <option value="quarter">{t("filters.dateRange.quarter")}</option>
            </select>
            <p id="date-range-help" className="text-xs text-gray-500 mt-1">
              {locale === "zh"
                ? "选择要查看的时间范围"
                : "Select the time range to view"}
            </p>
          </div>

          {/* Pain Level Filter */}
          <div>
            <label
              htmlFor="pain-level-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("filters.painLevel.label")}
            </label>
            <select
              id="pain-level-filter"
              value={filterPainLevel}
              onChange={(e) =>
                setFilterPainLevel(
                  e.target.value as "all" | "low" | "medium" | "high",
                )
              }
              className="w-full px-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              aria-describedby="pain-level-help"
            >
              <option value="all">{t("filters.dateRange.all")}</option>
              <option value="low">{t("filters.painLevel.low")}</option>
              <option value="medium">{t("filters.painLevel.medium")}</option>
              <option value="high">{t("filters.painLevel.high")}</option>
            </select>
            <p id="pain-level-help" className="text-xs text-gray-500 mt-1">
              {locale === "zh"
                ? "按疼痛程度筛选记录"
                : "Filter records by pain intensity"}
            </p>
          </div>
        </div>
      </section>

      {/* Records List */}
      <section
        className="bg-white rounded-lg shadow-sm"
        aria-labelledby="records-heading"
        aria-live="polite"
        aria-atomic="false"
      >
        <h2 id="records-heading" className="sr-only">
          {t("list.title")}
        </h2>

        {records.length === 0 && !loading ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              {t("emptyState.titleShort")}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              {locale === "zh"
                ? "没有找到符合筛选条件的疼痛记录。请尝试调整筛选条件或添加新的记录。"
                : "No pain records found matching your filters. Try adjusting your filters or add new records."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="sr-only" aria-live="polite">
              {locale === "zh"
                ? `找到 ${pagination.totalItems} 条记录`
                : `Found ${pagination.totalItems} records`}
            </div>
            {records.map((record) => (
              <article
                key={record.id}
                className="p-4 sm:p-6 hover:bg-gray-50 focus-within:bg-gray-50 transition-colors"
                aria-labelledby={`record-${record.id}-title`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                      <h3
                        id={`record-${record.id}-title`}
                        className="text-sm sm:text-base font-medium text-gray-900"
                      >
                        {new Date(record.date).toLocaleDateString(
                          locale === "zh" ? "zh-CN" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </h3>
                      <div
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPainLevelColor(
                          record.painLevel,
                        )}`}
                      >
                        <span className="sr-only">
                          {t("recordCard.painLevelLabel")}
                        </span>
                        {getPainLevelLabel(record.painLevel)} (
                        {record.painLevel}/10)
                      </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-gray-600">
                      <div>
                        <dt className="font-medium inline">
                          {t("recordCard.locationLabel")}
                        </dt>
                        <dd className="inline">
                          {record.locations
                            .map((loc) => getLocationName(loc))
                            .join(", ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium inline">
                          {t("recordCard.typeLabel")}
                        </dt>
                        <dd className="inline">
                          {record.painTypes
                            .map((type) => getPainTypeName(type))
                            .join(", ")}
                        </dd>
                      </div>
                    </dl>

                    {record.notes && (
                      <div className="mt-3 text-sm text-gray-600">
                        <dt className="font-medium inline">
                          {t("recordCard.notesLabel")}
                        </dt>
                        <dd className="inline">{record.notes}</dd>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0">
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 focus:text-gray-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      aria-label={`${t("recordCard.editRecord")} ${new Date(
                        record.date,
                      ).toLocaleDateString()}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 focus:text-red-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label={`${t("recordCard.deleteRecord")} ${new Date(
                        record.date,
                      ).toLocaleDateString()}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="p-6 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                  <span className="text-sm text-gray-600">
                    {t("pagination.loading")}
                  </span>
                </div>
              </div>
            )}

            {/* Load more button */}
            {pagination.hasNextPage && !loading && (
              <div className="p-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                >
                  {t("pagination.loadMore")}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Summary Stats */}
      {records.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("stats.title")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {pagination.totalItems}
              </div>
              <div className="text-sm text-gray-600">
                {t("stats.totalRecords")}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {records.length > 0
                  ? (
                      records.reduce(
                        (sum, record) => sum + record.painLevel,
                        0,
                      ) / records.length
                    ).toFixed(1)
                  : "0"}
              </div>
              <div className="text-sm text-gray-600">
                {t("stats.averagePainLevel")}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {records.length > 0
                  ? Math.max(...records.map((r) => r.painLevel))
                  : "0"}
              </div>
              <div className="text-sm text-gray-600">
                {t("stats.highestPainLevel")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
