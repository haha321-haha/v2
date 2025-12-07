/**
 * 数据保留期限提醒组件
 * 在数据即将过期时显示提醒
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Download, X } from "lucide-react";
import { useCalendar } from "../hooks/useWorkplaceWellnessStore";
import { useTranslations } from "next-intl";
import { CalendarState } from "../types";

export default function DataRetentionWarning() {
  const calendar = useCalendar() as CalendarState;
  const t = useTranslations("workplaceWellness");
  const [dismissed, setDismissed] = useState(false);

  const RETENTION_PERIOD_MONTHS = 6; // 6个月保留期限
  const WARNING_DAYS = 30; // 提前30天提醒

  // 计算即将过期的数据
  const expiringData = useMemo(() => {
    if (dismissed) return null;

    const periodData = calendar.periodData || [];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - RETENTION_PERIOD_MONTHS);
    const warningDate = new Date();
    warningDate.setMonth(
      warningDate.getMonth() -
        (RETENTION_PERIOD_MONTHS * 30 - WARNING_DAYS) / 30,
    );

    const expiringRecords = periodData.filter((r) => {
      try {
        const recordDate = new Date(r.date);
        return recordDate < warningDate && recordDate >= sixMonthsAgo;
      } catch {
        return false;
      }
    });

    if (expiringRecords.length === 0) return null;

    return {
      count: expiringRecords.length,
      oldestDate: expiringRecords.reduce((oldest, current) => {
        const currentDate = new Date(current.date);
        const oldestDate = new Date(oldest.date);
        return currentDate < oldestDate ? current : oldest;
      }),
    };
  }, [calendar.periodData, dismissed]);

  // 从 sessionStorage 读取已关闭状态
  useEffect(() => {
    try {
      const dismissedKey = sessionStorage.getItem(
        "data-retention-warning-dismissed",
      );
      if (dismissedKey === "true") {
        setDismissed(true);
      }
    } catch {
      // 忽略错误
    }
  }, []);

  // 关闭提醒
  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("data-retention-warning-dismissed", "true");
    } catch {
      // 忽略错误
    }
  };

  // 跳转到导出页面
  const handleExport = () => {
    // 触发设置页面的导出标签页
    const event = new CustomEvent("navigate-to-export");
    window.dispatchEvent(event);
    // 也可以直接跳转到设置页面的导出标签
    const settingsButton = document.querySelector(
      "[data-settings-button]",
    ) as HTMLElement;
    if (settingsButton) {
      settingsButton.click();
      setTimeout(() => {
        const exportTab = document.querySelector(
          '[data-tab="export"]',
        ) as HTMLElement;
        if (exportTab) {
          exportTab.click();
        }
      }, 100);
    }
  };

  if (!expiringData || dismissed) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-yellow-700 font-medium mb-1">
                {t("userPreferences.expiringDataWarning") || "数据即将过期提醒"}
              </p>
              <p className="text-sm text-yellow-600 mb-3">
                {(
                  t("userPreferences.expiringDataDescription") ||
                  `您有 {count} 条记录将在 30 天后自动清理。建议导出备份以保留完整历史记录。`
                ).replace("{count}", expiringData.count.toString())}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Download size={16} />
                  {t("userPreferences.exportNow") || "立即导出备份"}
                </button>
                <button
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-2 px-3 py-2 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  {t("common.cancel") || "稍后提醒"}
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 text-yellow-400 hover:text-yellow-600 transition-colors"
              aria-label="关闭"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
