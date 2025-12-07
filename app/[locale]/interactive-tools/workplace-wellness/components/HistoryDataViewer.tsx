/**
 * HVsLYEp职场健康助手 - 历史数据查看组件
 * 基于HVsLYEp的数据结构创建历史记录查看功能
 */

"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import {
  useCalendar,
  useWorkplaceWellnessActions,
} from "../hooks/useWorkplaceWellnessStore";
import {
  PeriodRecord,
  FlowType,
  PainLevel,
  PeriodType,
  CalendarState,
} from "../types";

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  type: "all" | "period" | "predicted" | "ovulation";
  painLevel: "all" | "low" | "medium" | "high";
  flow: "all" | "light" | "medium" | "heavy";
}

export default function HistoryDataViewer() {
  // 获取本地日期的 YYYY-MM-DD 格式字符串
  const getLocalTodayString = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const locale = useLocale();
  const t = useTranslations("workplaceWellness");
  const calendar = useCalendar() as CalendarState;
  const { addPeriodRecord, updatePeriodRecord, deletePeriodRecord } =
    useWorkplaceWellnessActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PeriodRecord | null>(
    null,
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PeriodRecord | null>(null);
  const [formData, setFormData] = useState<{
    date: string;
    type: PeriodType;
    painLevel: number;
    flow: FlowType | null;
    notes?: string;
  }>({
    date: getLocalTodayString(),
    type: "period",
    painLevel: 0,
    flow: null,
    notes: "",
  });

  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: "",
      end: "",
    },
    type: "all",
    painLevel: "all",
    flow: "all",
  });

  // 从 store 读取 periodData
  const periodData = useMemo(
    () => calendar.periodData || [],
    [calendar.periodData],
  );

  // 过滤和搜索数据
  const filteredData = useMemo(() => {
    let filtered = [...periodData];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.date.includes(searchTerm) ||
          record.type.includes(searchTerm) ||
          (record.notes &&
            record.notes.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // 日期范围过滤
    if (filters.dateRange.start) {
      filtered = filtered.filter(
        (record) => record.date >= filters.dateRange.start,
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(
        (record) => record.date <= filters.dateRange.end,
      );
    }

    // 类型过滤
    if (filters.type !== "all") {
      filtered = filtered.filter((record) => record.type === filters.type);
    }

    // 疼痛等级过滤
    if (filters.painLevel !== "all") {
      filtered = filtered.filter((record) => {
        if (!record.painLevel) return false;

        switch (filters.painLevel) {
          case "low":
            return record.painLevel <= 3;
          case "medium":
            return record.painLevel >= 4 && record.painLevel <= 7;
          case "high":
            return record.painLevel >= 8;
          default:
            return true;
        }
      });
    }

    // 流量过滤
    if (filters.flow !== "all") {
      filtered = filtered.filter((record) => record.flow === filters.flow);
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [periodData, searchTerm, filters]);

  // 获取记录状态样式
  const getRecordStatusStyle = (record: PeriodRecord) => {
    const baseStyle = "px-3 py-2 rounded-lg text-sm font-medium";

    switch (record.type) {
      case "period":
        return `${baseStyle} bg-red-100 text-red-800 border border-red-200`;
      case "predicted":
        return `${baseStyle} bg-blue-100 text-blue-800 border border-blue-200`;
      case "ovulation":
        return `${baseStyle} bg-green-100 text-green-800 border border-green-200`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  // 获取疼痛等级样式
  const getPainLevelStyle = (painLevel: PainLevel | null) => {
    if (!painLevel) return "text-gray-400";

    if (painLevel <= 3) return "text-green-600";
    if (painLevel <= 7) return "text-yellow-600";
    return "text-red-600";
  };

  // 获取流量样式
  const getFlowStyle = (flow: FlowType | null) => {
    if (!flow) return "text-gray-400";

    switch (flow) {
      case "light":
        return "text-blue-600";
      case "medium":
        return "text-yellow-600";
      case "heavy":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  // 导出数据
  const exportData = () => {
    const dataToExport = filteredData.map((record) => ({
      date: record.date,
      type: t(`export.periodTypes.${record.type}`),
      painLevel: record.painLevel || "-",
      flow: record.flow ? t(`export.flowTypes.${record.flow}`) : "-",
      notes: record.notes || "-",
    }));

    const csvContent = [
      Object.keys(dataToExport[0] || {}).join(","),
      ...dataToExport.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `period_history_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 清除过滤器
  const clearFilters = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      type: "all",
      painLevel: "all",
      flow: "all",
    });
    setSearchTerm("");
  };

  // 处理编辑
  const handleEdit = (record: PeriodRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      type: record.type,
      painLevel: record.painLevel || 0,
      flow: record.flow || null,
      notes: record.notes || "",
    });
    setShowAddForm(true);
  };

  // 处理删除
  const handleDelete = (date: string) => {
    if (confirm(t("history.confirmDelete"))) {
      deletePeriodRecord(date);
    }
  };

  // 保存记录（添加或更新）
  const handleSave = () => {
    const record: PeriodRecord = {
      date: formData.date,
      type: formData.type,
      painLevel:
        formData.painLevel > 0 ? (formData.painLevel as PainLevel) : null,
      flow: formData.flow,
      notes: formData.notes || undefined,
    };

    if (editingRecord) {
      // 如果日期改变，需要先删除旧记录，再添加新记录
      if (editingRecord.date !== formData.date) {
        deletePeriodRecord(editingRecord.date);
        addPeriodRecord(record);
      } else {
        updatePeriodRecord(formData.date, record);
      }
    } else {
      addPeriodRecord(record);
    }

    // 重置表单
    setShowAddForm(false);
    setEditingRecord(null);
    setFormData({
      date: getLocalTodayString(),
      type: "period",
      painLevel: 0,
      flow: null,
      notes: "",
    });
  };

  // 取消编辑
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingRecord(null);
    setFormData({
      date: getLocalTodayString(),
      type: "period",
      painLevel: 0,
      flow: null,
      notes: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-neutral-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-500" />
          {t("history.title")}
        </h4>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setEditingRecord(null);
              setFormData({
                date: getLocalTodayString(),
                type: "period",
                painLevel: 0,
                flow: null,
                notes: "",
              });
              setShowAddForm(true);
            }}
            className="flex items-center px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("history.addRecord")}
          </button>

          <button
            onClick={exportData}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            {t("history.export")}
          </button>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("history.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4 mr-1" />
            {t("history.filters")}
          </button>
        </div>

        {/* 过滤器面板 */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.dateRange")}
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder={t("history.startDate")}
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder={t("history.endDate")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.type")}
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value as
                        | "all"
                        | "period"
                        | "predicted"
                        | "ovulation",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">{t("history.allTypes")}</option>
                  <option value="period">
                    {t("export.periodTypes.period")}
                  </option>
                  <option value="predicted">
                    {t("export.periodTypes.predicted")}
                  </option>
                  <option value="ovulation">
                    {t("export.periodTypes.ovulation")}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.painLevel")}
                </label>
                <select
                  value={filters.painLevel}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      painLevel: e.target.value as FilterOptions["painLevel"],
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">{t("history.allLevels")}</option>
                  <option value="low">{t("history.lowPain")}</option>
                  <option value="medium">{t("history.mediumPain")}</option>
                  <option value="high">{t("history.highPain")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.flow")}
                </label>
                <select
                  value={filters.flow}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      flow: e.target.value as FilterOptions["flow"],
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">{t("history.allFlows")}</option>
                  <option value="light">{t("export.flowTypes.light")}</option>
                  <option value="medium">{t("export.flowTypes.medium")}</option>
                  <option value="heavy">{t("export.flowTypes.heavy")}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {t("history.clearFilters")}
              </button>

              <div className="text-sm text-gray-600">
                {t("history.resultsCount").replace(
                  "{count}",
                  filteredData.length.toString(),
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 数据表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                {t("history.date")}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                {t("history.type")}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                {t("history.painLevel")}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                {t("history.flow")}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                {t("history.notes")}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                {t("history.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  {t("history.noData")}
                </td>
              </tr>
            ) : (
              filteredData.map((record, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {new Date(record.date).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : "en-US",
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={getRecordStatusStyle(record)}>
                      {t(`export.periodTypes.${record.type}`)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${getPainLevelStyle(
                        record.painLevel,
                      )}`}
                    >
                      {record.painLevel || "-"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${getFlowStyle(record.flow)}`}
                    >
                      {record.flow ? t(`export.flowTypes.${record.flow}`) : "-"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {record.notes || "-"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title={t("history.view")}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title={t("history.edit")}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.date)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title={t("history.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 记录详情模态框 */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {t("history.recordDetails")}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("history.date")}
                </label>
                <p className="text-gray-900">
                  {new Date(selectedRecord.date).toLocaleDateString(
                    locale === "zh" ? "zh-CN" : "en-US",
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("history.type")}
                </label>
                <p className="text-gray-900">
                  {t(`export.periodTypes.${selectedRecord.type}`)}
                </p>
              </div>

              {selectedRecord.painLevel && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("history.painLevel")}
                  </label>
                  <p
                    className={`font-medium ${getPainLevelStyle(
                      selectedRecord.painLevel,
                    )}`}
                  >
                    {selectedRecord.painLevel}
                  </p>
                </div>
              )}

              {selectedRecord.flow && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("history.flow")}
                  </label>
                  <p
                    className={`font-medium ${getFlowStyle(
                      selectedRecord.flow,
                    )}`}
                  >
                    {t(`export.flowTypes.${selectedRecord.flow}`)}
                  </p>
                </div>
              )}

              {selectedRecord.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("history.notes")}
                  </label>
                  <p className="text-gray-900">{selectedRecord.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t("history.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加/编辑记录表单 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingRecord ? t("history.editRecord") : t("history.addRecord")}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.date")}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.type")}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as PeriodType,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="period">
                    {t("export.periodTypes.period")}
                  </option>
                  <option value="predicted">
                    {t("export.periodTypes.predicted")}
                  </option>
                  <option value="ovulation">
                    {t("export.periodTypes.ovulation")}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.painLevel")} ({formData.painLevel})
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.painLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      painLevel: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.flow")}
                </label>
                <select
                  value={formData.flow || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      flow: e.target.value
                        ? (e.target.value as FlowType)
                        : null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">-</option>
                  <option value="light">{t("export.flowTypes.light")}</option>
                  <option value="medium">{t("export.flowTypes.medium")}</option>
                  <option value="heavy">{t("export.flowTypes.heavy")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("history.notes")}
                </label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
