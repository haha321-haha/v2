/**
 * 存储警告提示组件
 * 当 localStorage 满时，显示友好的界面提示
 */

"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Download, Trash2, X } from "lucide-react";
import {
  useWorkplaceWellnessActions,
  useCalendar,
  useWorkImpact,
  useNutrition,
  useExport,
  useUserPreferences,
  useExportHistory,
  useExportTemplates,
} from "../hooks/useWorkplaceWellnessStore";

interface StorageWarningEvent extends CustomEvent {
  detail: {
    type: "sessionStorage" | "failed";
    message: string;
  };
}

export default function StorageWarningToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [warningType, setWarningType] = useState<"sessionStorage" | "failed">(
    "sessionStorage",
  );
  const [message, setMessage] = useState("");
  const { updateCalendar } = useWorkplaceWellnessActions();
  const calendar = useCalendar();
  const workImpact = useWorkImpact();
  const nutrition = useNutrition();
  const exportConfig = useExport();
  const userPreferences = useUserPreferences();
  const exportHistory = useExportHistory();
  const exportTemplates = useExportTemplates();

  useEffect(() => {
    const handleStorageWarning = (event: Event) => {
      const customEvent = event as StorageWarningEvent;
      setWarningType(customEvent.detail.type);
      setMessage(customEvent.detail.message);
      setIsVisible(true);
    };

    window.addEventListener("storage-warning", handleStorageWarning);
    return () => {
      window.removeEventListener("storage-warning", handleStorageWarning);
    };
  }, []);

  const handleExport = () => {
    // 导出数据功能
    // 使用 hooks 获取状态
    const data = {
      calendar,
      workImpact,
      nutrition,
      export: exportConfig,
      userPreferences,
      exportHistory,
      exportTemplates,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workplace-wellness-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 关闭提示
    setIsVisible(false);
  };

  const handleCleanup = () => {
    // 清理旧数据
    // 清理经期记录（只保留最近2周）
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const cleanedPeriodData = calendar.periodData
      .filter((r) => {
        try {
          return new Date(r.date) >= twoWeeksAgo;
        } catch {
          return false;
        }
      })
      .slice(0, 20);

    // 清理其他数据
    // 使用 actions 更新状态
    updateCalendar({
      ...calendar,
      periodData: cleanedPeriodData,
    });

    // 注意：其他数据的清理需要通过相应的 actions 完成
    // 这里只清理 calendar 数据，其他数据清理需要额外的 actions

    // 关闭提示
    setIsVisible(false);

    // 提示用户
    alert("已清理旧数据，请刷新页面以确保数据保存。");
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5">
      <div
        className={`
        rounded-lg shadow-lg p-4 border-2
        ${
          warningType === "failed"
            ? "bg-red-50 border-red-200"
            : "bg-yellow-50 border-yellow-200"
        }
      `}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className={`
              flex-shrink-0 mt-0.5
              ${warningType === "failed" ? "text-red-600" : "text-yellow-600"}
            `}
            size={20}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`
              font-semibold text-sm mb-1
              ${warningType === "failed" ? "text-red-800" : "text-yellow-800"}
            `}
            >
              {warningType === "failed" ? "⚠️ 存储空间已满" : "⚠️ 存储空间不足"}
            </h3>
            <p
              className={`
              text-sm mb-3
              ${warningType === "failed" ? "text-red-700" : "text-yellow-700"}
            `}
            >
              {message}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                className="
                  flex items-center gap-1.5 px-3 py-1.5
                  bg-blue-600 text-white text-sm font-medium
                  rounded-md hover:bg-blue-700
                  transition-colors
                "
              >
                <Download size={14} />
                立即导出
              </button>
              <button
                onClick={handleCleanup}
                className="
                  flex items-center gap-1.5 px-3 py-1.5
                  bg-neutral-600 text-white text-sm font-medium
                  rounded-md hover:bg-neutral-700
                  transition-colors
                "
              >
                <Trash2 size={14} />
                清理旧数据
              </button>
              <button
                onClick={handleDismiss}
                className="
                  px-3 py-1.5
                  bg-neutral-200 text-neutral-700 text-sm font-medium
                  rounded-md hover:bg-neutral-300
                  transition-colors
                "
              >
                我知道了
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="
              flex-shrink-0 p-1
              text-neutral-400 hover:text-neutral-600
              transition-colors
            "
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
