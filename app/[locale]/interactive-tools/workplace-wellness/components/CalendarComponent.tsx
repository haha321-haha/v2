/**
 * HVsLYEp职场健康助手 - 日历组件
 * 基于HVsLYEp的PeriodCalendarComponent函数设计
 */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useCalendar,
  useWorkplaceWellnessActions,
  useWorkplaceWellnessStore,
} from "../hooks/useWorkplaceWellnessStore";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import {
  PeriodRecord,
  PeriodType,
  PainLevel,
  CalendarState,
  AssessmentRecord,
} from "../types";
import AssessmentDetailModal from "./AssessmentDetailModal";
import { logError, logInfo } from "@/lib/debug-logger";

export default function CalendarComponent() {
  // 获取本地日期的 YYYY-MM-DD 格式字符串
  const getLocalTodayString = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calendar = useCalendar() as CalendarState;
  const locale = useLocale();
  const { setCurrentDate, addPeriodRecord } = useWorkplaceWellnessActions();
  const { assessmentHistory } = useWorkplaceWellnessStore();
  const t = useTranslations("workplaceWellness");

  // 从 store 读取 periodData 和 assessmentHistory
  const periodData = calendar?.periodData || [];
  const assessmentRecords = assessmentHistory?.records || [];
  const [showAddForm, setShowAddForm] = useState(false);

  // 用于自动聚焦到日期输入框
  const dateInputRef = useRef<HTMLInputElement>(null);

  // 表单状态
  const [formData, setFormData] = useState<{
    date: string;
    type: PeriodType;
    painLevel: number;
  }>({
    date: getLocalTodayString(),
    type: "period",
    painLevel: 0,
  });

  // 选中的评估记录
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentRecord | null>(null);

  // 表单验证错误状态
  const [formErrors, setFormErrors] = useState<{
    date?: string;
    type?: string;
    painLevel?: string;
    submit?: string;
  }>({});

  // 基于HVsLYEp的日历逻辑
  const { currentDate } = calendar;

  // 确保 currentDate 是有效的 Date 对象
  const validCurrentDate =
    currentDate instanceof Date ? currentDate : new Date(currentDate);

  const year = validCurrentDate.getFullYear();
  const month = validCurrentDate.getMonth();
  const monthName = validCurrentDate.toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 生成日历天数数组 - 基于HVsLYEp的days生成逻辑
  const days = Array(startingDayOfWeek).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // 获取某天的经期状态 - 基于HVsLYEp的getDayStatus函数
  const getDayStatus = (day: number): PeriodRecord | null => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return periodData.find((d) => d.date === dateStr) || null;
  };

  // Phase 2: 获取某天的评估状态
  const getAssessmentStatus = (day: number) => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return assessmentRecords.find((record) => record.date === dateStr) || null;
  };

  // 获取日期样式 - 基于HVsLYEp的getDayStyles函数
  const getDayStyles = (day: number, status: PeriodRecord | null) => {
    if (!day) return "invisible";
    let styles =
      "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors duration-200 relative ";
    if (status) {
      if (status.type === "period")
        styles += "bg-secondary-500 text-white hover:bg-secondary-600";
      else if (status.type === "predicted")
        styles +=
          "bg-secondary-500/10 text-secondary-700 border-2 border-dashed border-secondary-300 hover:bg-secondary-500/20";
    } else {
      styles += "hover:bg-neutral-100 text-neutral-800";
    }
    return styles;
  };

  // 获取预测日期 - 基于HVsLYEp的逻辑
  const predictedDateEntry = periodData.find((d) => d.type === "predicted");
  const formattedPredictedDate = predictedDateEntry
    ? new Date(predictedDateEntry.date).toLocaleDateString(
        locale === "zh" ? "zh-CN" : "en-US",
        {
          month: "short",
          day: "numeric",
        },
      )
    : "";

  // 月份导航 - 基于HVsLYEp的导航逻辑
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(validCurrentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // 添加经期记录 - 切换表单显示/隐藏
  const handleAddRecord = () => {
    if (showAddForm) {
      // 如果表单已展开，则关闭并重置
      setShowAddForm(false);
      setFormData({
        date: getLocalTodayString(),
        type: "period",
        painLevel: 0,
      });
    } else {
      // 如果表单未展开，则打开并初始化
      setFormData({
        date: getLocalTodayString(),
        type: "period",
        painLevel: 0,
      });
      setShowAddForm(true);
    }
  };

  // 表单展开后自动聚焦到日期输入框
  useEffect(() => {
    if (showAddForm && dateInputRef.current) {
      // 使用 setTimeout 确保 DOM 已更新
      setTimeout(() => {
        dateInputRef.current?.focus();
      }, 100);
    }
  }, [showAddForm]);

  // 获取今天的日期字符串
  const getTodayDateString = (): string => {
    return getLocalTodayString();
  };

  // 表单验证函数
  const validateForm = () => {
    const errors: typeof formErrors = {};

    // 验证日期不能是未来日期
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 设置今天的时间为23:59:59，允许选择今天

    if (selectedDate > today) {
      errors.date =
        locale === "zh" ? "不能选择未来的日期" : "Cannot select future dates";
    }

    // 验证日期格式
    if (!formData.date || formData.date.trim() === "") {
      errors.date =
        errors.date ||
        (locale === "zh" ? "请选择日期" : "Please select a date");
    }

    // 验证类型
    if (!formData.type) {
      errors.type =
        locale === "zh" ? "请选择记录类型" : "Please select a record type";
    }

    // 验证疼痛等级（仅月经期）
    if (formData.type === "period" && formData.painLevel < 0) {
      errors.painLevel =
        locale === "zh" ? "请选择疼痛等级" : "Please select pain level";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 保存记录
  const handleSaveRecord = async (e: React.FormEvent) => {
    // 阻止默认行为和事件冒泡
    e.preventDefault();
    e.stopPropagation();

    // 验证表单
    if (!validateForm()) {
      return;
    }

    try {
      const record: PeriodRecord = {
        date: formData.date,
        type: formData.type,
        // 确保只有 period 类型才保存疼痛等级
        painLevel:
          formData.type === "period" && formData.painLevel > 0
            ? (formData.painLevel as PainLevel)
            : null,
        flow: null, // 可以根据需要添加流量选择
      };

      // 调用 store 的 addPeriodRecord 方法
      logInfo(
        "CalendarComponent - saving record:",
        record,
        "CalendarComponent",
      );
      addPeriodRecord(record);

      // 关闭表单并重置表单数据
      setShowAddForm(false);
      setFormData({
        date: getLocalTodayString(),
        type: "period",
        painLevel: 0,
      });

      // 清除错误状态
      setFormErrors({});

      // 显示成功提示（可以考虑使用toast或其他非阻塞提示）
    } catch (error) {
      // 错误处理
      logError("保存记录时出错", error, "CalendarComponent");
      setFormErrors({
        ...formErrors,
        submit:
          t("calendar.saveError") ||
          (locale === "zh"
            ? "保存记录时出错，请重试。"
            : "An error occurred while saving the record. Please try again."),
      });
      setTimeout(() => {
        setFormErrors((prev) => ({ ...prev, submit: undefined }));
      }, 3000);
    }
  };

  // 取消添加
  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // 阻止默认行为和事件冒泡
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowAddForm(false);
    // 重置表单数据
    setFormData({
      date: getLocalTodayString(),
      type: "period",
      painLevel: 0,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      {/* 头部 - 基于HVsLYEp的头部设计 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">
          {t("calendar.title")}
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          {t("calendar.subtitle")}
        </p>
      </div>

      {/* 月份导航 - 基于HVsLYEp的导航设计 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="hover:bg-neutral-100 text-neutral-800 rounded-lg p-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-lg font-medium text-neutral-900">{monthName}</h4>
        <button
          onClick={() => navigateMonth("next")}
          className="hover:bg-neutral-100 text-neutral-800 rounded-lg p-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 星期标题 - 基于HVsLYEp的星期显示 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(
          (dayKey: string, index: number) => (
            <div
              key={index}
              className="h-10 flex items-center justify-center text-sm font-medium text-neutral-600"
            >
              {t(`calendar.days.${dayKey}`)}
            </div>
          ),
        )}
      </div>

      {/* 日历网格 - 基于HVsLYEp的日历网格 */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((day, index) => {
          const periodStatus = getDayStatus(day);
          const assessmentStatus = getAssessmentStatus(day);
          return (
            <div key={index} className={getDayStyles(day, periodStatus)}>
              {day && (
                <>
                  {day}
                  {/* Phase 2: 评估指示器 */}
                  {assessmentStatus && (
                    <div
                      className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full border border-white cursor-pointer hover:scale-125 transition-transform"
                      title={`评估完成 - 压力分数: ${assessmentStatus.stressScore}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssessment(assessmentStatus);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 图例 - 基于HVsLYEp的图例设计 */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary-500"></div>
          <span className="text-neutral-600">{t("calendar.legendPeriod")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary-500/10 border-2 border-dashed border-secondary-300"></div>
          <span className="text-neutral-600">
            {t("calendar.legendPredicted")}
          </span>
        </div>
        {/* Phase 2: 评估指示器图例 */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-4 h-4 rounded border border-neutral-300"></div>
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-purple-500 rounded-full border border-white"></div>
          </div>
          <span className="text-neutral-600">
            {t("calendar.legendAssessment") || "评估完成"}
          </span>
        </div>
      </div>

      {/* 统计信息 - 基于HVsLYEp的统计显示 */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100">
        <div className="text-center">
          <div className="text-2xl font-semibold text-neutral-900">28</div>
          <div className="text-sm text-neutral-600">
            {t("calendar.statCycle")}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-neutral-900">5</div>
          <div className="text-sm text-neutral-600">
            {t("calendar.statLength")}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-secondary-500">
            {formattedPredictedDate}
          </div>
          <div className="text-sm text-neutral-600">
            {t("calendar.statNext")}
          </div>
        </div>
      </div>

      {/* 按钮区域 - 统计信息下方，居中显示 */}
      <div className="mt-6 pt-6 border-t border-neutral-100">
        <div className="flex justify-center">
          <button
            onClick={handleAddRecord}
            className="rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 text-base bg-primary-500 hover:bg-primary-600 text-white"
            aria-expanded={showAddForm}
          >
            <Plus className="w-4 h-4" />
            {t("calendar.recordButton")}
            {showAddForm ? (
              <ChevronUp className="w-4 h-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* 添加经期记录表单 - 按钮下方，带平滑展开动画 */}
      {showAddForm && (
        <form
          onSubmit={handleSaveRecord}
          className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 animate-slide-up"
        >
          <h4 className="text-lg font-medium text-neutral-900 mb-4">
            {t("calendar.addRecord")}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                {t("calendar.date")}
              </label>
              <input
                ref={dateInputRef}
                type="date"
                value={formData.date}
                max={getTodayDateString()}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-primary-500 ${
                  formErrors.date
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-300 focus:ring-primary-500"
                }`}
                required
              />
              {formErrors.date && (
                <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                {t("calendar.type")}
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as PeriodType,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-primary-500 ${
                  formErrors.type
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-300 focus:ring-primary-500"
                }`}
              >
                <option value="period">{t("calendar.typePeriod")}</option>
                <option value="predicted">{t("calendar.typePredicted")}</option>
                <option value="ovulation">{t("calendar.typeOvulation")}</option>
              </select>
              {formErrors.type && (
                <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>
              )}
            </div>
            {/* 只在 period 类型时显示疼痛等级 */}
            {formData.type === "period" && (
              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-2">
                  {t("calendar.painLevel")} ({formData.painLevel})
                </label>
                <div className="relative mb-2">
                  {/* 渐变背景轨道 */}
                  <div className="absolute inset-0 h-3 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-lg"></div>
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
                    className={`relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10 pain-slider ${
                      formErrors.painLevel ? "border-2 border-red-500" : ""
                    }`}
                  />
                </div>
                {formErrors.painLevel && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.painLevel}
                  </p>
                )}
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>{t("calendar.painLevelMin")}</span>
                  <span>{t("calendar.painLevelMax")}</span>
                </div>
                {/* 自定义滑块样式 */}
                <style jsx>{`
                  .pain-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #6b7280;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                  }

                  .pain-slider::-webkit-slider-thumb:hover {
                    border-color: #9333ea;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transform: scale(1.1);
                  }

                  .pain-slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #6b7280;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                    -moz-appearance: none;
                  }

                  .pain-slider::-moz-range-thumb:hover {
                    border-color: #9333ea;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transform: scale(1.1);
                  }

                  .pain-slider::-moz-range-track {
                    background: transparent;
                    height: 12px;
                  }
                `}</style>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                {t("common.save")}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors duration-200"
              >
                {t("common.cancel")}
              </button>
            </div>

            {/* 提交错误提示 */}
            {formErrors.submit && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">
                  {formErrors.submit}
                </p>
              </div>
            )}
          </div>
        </form>
      )}
      {/* 评估详情弹窗 */}
      <AssessmentDetailModal
        isOpen={!!selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        assessment={selectedAssessment}
      />
    </div>
  );
}
