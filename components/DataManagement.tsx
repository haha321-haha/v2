"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Lock,
  Database,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface DataManagementProps {
  className?: string;
}

interface DataStatistics {
  cycleData: { exists: boolean; count: number };
  painRecords: { count: number };
  assessments: { exists: boolean; count: number };
  progressData: { exists: boolean; count: number };
  totalSize: number;
}

// All storage keys that should be cleared
const STORAGE_KEYS_TO_REMOVE = [
  // Cycle tracking
  "periodhub_cycle_data",
  "cycle-tracker-current",
  "cycle-tracker-history",

  // Stress assessments
  "stress_assessments",
  "stress_progress_entries",

  // Pain tracker
  "periodhub_pain_records",
  "enhanced_pain_tracker_records",
  "enhanced_pain_tracker_preferences",
  "enhanced_pain_tracker_schema_version",
  "enhanced_pain_tracker_metadata",

  // User preferences and onboarding
  "onboarding_completed",
  "signup_date",
  "email_subscribed",

  // Luna AI
  "luna_is_pro",
  "luna_daily_count",
  "luna_count_date",

  // Tracking
  "cta_tracking_session",
  "cta_tracking_events",

  // Zustand store
  "periodhub-health-data",
] as const;

// Storage key prefixes to match
const STORAGE_PREFIXES_TO_REMOVE = [
  "periodhub_",
  "enhanced_pain_tracker_",
  "pain_tracker_",
  "cycle-tracker-",
] as const;

export function DataManagement({ className = "" }: DataManagementProps) {
  const t = useTranslations("dataManagement");
  const [dataStats, setDataStats] = useState<DataStatistics>({
    cycleData: { exists: false, count: 0 },
    painRecords: { count: 0 },
    assessments: { exists: false, count: 0 },
    progressData: { exists: false, count: 0 },
    totalSize: 0,
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [message, setMessage] = useState("");

  // Load data and statistics
  useEffect(() => {
    loadData();
    loadStatistics();
  }, []);

  const loadData = () => {
    // 数据加载逻辑已整合到 loadStatistics 中
    // 此函数保留用于未来扩展，但不再设置未使用的状态
  };

  const loadStatistics = () => {
    try {
      // Check cycle data
      const cycleData = localStorage.getItem("periodhub_cycle_data");
      const cycleExists = !!cycleData;

      // Count pain records (by prefix)
      const painKeys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith("periodhub_pain_records") ||
          key.startsWith("enhanced_pain_tracker_"),
      );
      const painCount = painKeys.length;

      // Check assessments
      const assessments = localStorage.getItem("stress_assessments");
      const assessmentsData = assessments ? JSON.parse(assessments) : [];
      const assessmentsExists = assessmentsData.length > 0;

      // Check progress data
      const progressKeys = Object.keys(localStorage).filter((key) =>
        key.includes("progress"),
      );
      const progressExists = progressKeys.length > 0;

      // Calculate total size
      let totalSize = 0;
      Object.keys(localStorage).forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      });

      setDataStats({
        cycleData: { exists: cycleExists, count: cycleExists ? 1 : 0 },
        painRecords: { count: painCount },
        assessments: {
          exists: assessmentsExists,
          count: assessmentsData.length,
        },
        progressData: { exists: progressExists, count: progressKeys.length },
        totalSize,
      });
    } catch (error) {
      // 错误处理中的 console.error 保留用于调试
      // eslint-disable-next-line no-console
      console.error("Failed to load statistics:", error);
    }
  };

  // Export all data
  const handleExport = () => {
    try {
      const allData: Record<string, unknown> = {};

      // Export all relevant localStorage items
      STORAGE_KEYS_TO_REMOVE.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            allData[key] = JSON.parse(value);
          } catch {
            allData[key] = value;
          }
        }
      });

      // Export prefixed keys
      Object.keys(localStorage).forEach((key) => {
        if (
          STORAGE_PREFIXES_TO_REMOVE.some((prefix) => key.startsWith(prefix))
        ) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              allData[key] = JSON.parse(value);
            } catch {
              allData[key] = value;
            }
          }
        }
      });

      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `periodhub-data-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage(
        t("exportSuccess", { default: "Data exported successfully!" }),
      );
    } catch {
      setMessage(
        t("exportFailed", { default: "Export failed, please try again" }),
      );
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      // 1. Clear specific keys
      STORAGE_KEYS_TO_REMOVE.forEach((key) => {
        localStorage.removeItem(key);
      });

      // 2. Clear keys with prefixes
      Object.keys(localStorage).forEach((key) => {
        if (
          STORAGE_PREFIXES_TO_REMOVE.some((prefix) => key.startsWith(prefix))
        ) {
          localStorage.removeItem(key);
        }
      });

      // 3. Clear IndexedDB
      if ("indexedDB" in window) {
        try {
          const databases = await indexedDB.databases();
          await Promise.all(
            databases.map((db) => {
              if (db.name) {
                return new Promise<void>((resolve) => {
                  const deleteReq = indexedDB.deleteDatabase(db.name!);
                  deleteReq.onsuccess = () => resolve();
                  deleteReq.onerror = () => resolve();
                  deleteReq.onblocked = () => resolve();
                });
              }
            }),
          );
        } catch (error) {
          console.error("Failed to clear IndexedDB:", error);
        }
      }

      // 4. Clear sessionStorage
      sessionStorage.clear();

      // Reload page after clearing
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      setMessage(
        t("clearSuccess", { default: "All data cleared successfully!" }),
      );
    } catch (error) {
      // 错误处理中的 console.error 保留用于调试
      // eslint-disable-next-line no-console
      console.error("Failed to clear data:", error);
      setMessage(
        t("clearFailed", { default: "Failed to clear data, please try again" }),
      );
    }
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
    setConfirmText("");
  };

  // Execute delete
  const handleDelete = () => {
    if (confirmText !== "DELETE" && confirmText !== "删除") {
      setMessage(
        t("confirmRequired", {
          default: "Please type 'DELETE' to confirm",
        }),
      );
      return;
    }

    setShowConfirmDelete(false);
    clearAllData();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const hasAnyData =
    dataStats.cycleData.exists ||
    dataStats.painRecords.count > 0 ||
    dataStats.assessments.exists ||
    dataStats.progressData.exists;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-600" />
          {t("title", { default: "Data Management" })}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("subtitle", {
            default: "Manage your locally stored health data",
          })}
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Lock
            size={16}
            className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
              {t("privacyNotice.title", {
                default: "🔒 Your Data Stays on Your Device",
              })}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              {t("privacyNotice.description", {
                default:
                  "All your health data is stored locally on your device. No cloud, no leaks. You have complete control.",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Data statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {dataStats.cycleData.count +
              dataStats.painRecords.count +
              dataStats.assessments.count +
              dataStats.progressData.count}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            {t("stats.totalRecords", { default: "Total Records" })}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatFileSize(dataStats.totalSize)}
          </div>
          <div className="text-sm text-green-800 dark:text-green-300">
            {t("stats.totalSize", { default: "Storage Used" })}
          </div>
        </div>
      </div>

      {/* Detailed statistics */}
      {(dataStats.cycleData.exists ||
        dataStats.painRecords.count > 0 ||
        dataStats.assessments.exists ||
        dataStats.progressData.exists) && (
        <div className="mb-6 space-y-2 text-sm">
          {dataStats.cycleData.exists && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {t("stats.cycleData", { default: "Cycle Data" })}
              </span>
              <span className="font-medium">✓</span>
            </div>
          )}
          {dataStats.painRecords.count > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {t("stats.painRecords", {
                  default: "Pain Records",
                })}
              </span>
              <span className="font-medium">{dataStats.painRecords.count}</span>
            </div>
          )}
          {dataStats.assessments.exists && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {t("stats.assessments", { default: "Assessments" })}
              </span>
              <span className="font-medium">{dataStats.assessments.count}</span>
            </div>
          )}
          {dataStats.progressData.exists && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {t("stats.progressData", { default: "Progress Data" })}
              </span>
              <span className="font-medium">✓</span>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasAnyData}
        >
          <Download className="w-4 h-4" />
          {t("exportButton", { default: "Export All Data" })}
        </button>

        <button
          onClick={handleConfirmDelete}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-4 px-4 rounded-xl font-bold text-lg border-2 border-red-800 shadow-lg shadow-red-500/30 hover:bg-red-700 hover:scale-105 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={!hasAnyData}
        >
          <Trash2 className="w-5 h-5" />
          {t("panicButton.title", { default: "🚨 Clear All Data" })}
        </button>
      </div>

      {/* Confirm delete dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-red-800 dark:text-red-400">
                {t("confirmDialog.title", {
                  default: "⚠️ Emergency: Clear All Data",
                })}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("confirmDialog.warning", {
                default:
                  "This will permanently delete ALL your data, including:",
              })}
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-2 pl-4">
              <li>
                •{" "}
                {t("confirmDialog.items.cycle", {
                  default: "Cycle tracking data",
                })}
              </li>
              <li>
                • {t("confirmDialog.items.pain", { default: "Pain records" })}
              </li>
              <li>
                •{" "}
                {t("confirmDialog.items.assessments", {
                  default: "Assessment results",
                })}
              </li>
              <li>
                •{" "}
                {t("confirmDialog.items.preferences", {
                  default: "All personal settings",
                })}
              </li>
            </ul>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-medium">
              {t("confirmDialog.cannotUndo", {
                default: "⚠️ This action CANNOT be undone!",
              })}
            </p>

            {/* Confirmation input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("confirmDialog.inputLabel", {
                  default: 'Type "DELETE" to confirm:',
                })}
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setConfirmText("");
                }}
                className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                {t("confirmDialog.cancel", { default: "Cancel" })}
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" && confirmText !== "删除"}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {t("confirmDialog.confirm", {
                  default: "Yes, Clear Everything",
                })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message display */}
      {message && (
        <div className="mt-4 p-3 rounded-lg flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
          <CheckCircle className="w-4 h-4" />
          {message}
        </div>
      )}

      {/* Info text */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1 border-t dark:border-slate-700 pt-4">
        <p>
          •{" "}
          {t("info.localStorage", {
            default: "Data is stored locally on your device only",
          })}
        </p>
        <p>
          •{" "}
          {t("info.exportFormat", {
            default:
              "Exported file is in JSON format, can be imported on other devices",
          })}
        </p>
        <p>
          •{" "}
          {t("info.cannotRecover", {
            default: "Data cannot be recovered after deletion",
          })}
        </p>
      </div>
    </div>
  );
}
