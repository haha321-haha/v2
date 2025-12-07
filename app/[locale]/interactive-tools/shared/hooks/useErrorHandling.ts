"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  PainTrackerError,
  PainTrackerErrorCode,
} from "../../../../../types/pain-tracker";
import {
  useNotifications,
  useRecoveryNotifications,
} from "../components/NotificationSystem";
import { useOfflineDetection } from "./useOfflineDetection";
import DataIntegrityService from "../../../../../lib/pain-tracker/storage/DataIntegrityService";
import { logError, logWarn } from "@/lib/debug-logger";

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorCode: PainTrackerErrorCode | null;
  isRecovering: boolean;
  recoveryAttempts: number;
  lastErrorTime: Date | null;
}

interface ErrorHandlingOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableAutoRecovery?: boolean;
  enableOfflineMode?: boolean;
  onError?: (error: Error) => void;
  onRecovery?: (success: boolean) => void;
}

interface RecoveryAction {
  label: string;
  action: () => Promise<boolean>;
  riskLevel: "low" | "medium" | "high";
  description: string;
}

export function useErrorHandling(options: ErrorHandlingOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    enableAutoRecovery = true,
    enableOfflineMode = true,
    onError,
    onRecovery,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorCode: null,
    isRecovering: false,
    recoveryAttempts: 0,
    lastErrorTime: null,
  });

  const {
    addErrorNotification,
    addWarningNotification,
    addSuccessNotification,
  } = useNotifications();
  const { notifyDataCorruption, notifyStorageQuotaExceeded } =
    useRecoveryNotifications();

  const { isOffline } = useOfflineDetection();
  const dataIntegrityService = useMemo(() => new DataIntegrityService(), []);

  // Clear error state
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorCode: null,
      isRecovering: false,
      recoveryAttempts: 0,
      lastErrorTime: null,
    });
  }, []);

  // Retry last operation
  const retryLastOperation = useCallback(async () => {
    if (errorState.recoveryAttempts >= maxRetries) {
      addWarningNotification(
        "Max Retries Reached",
        "Unable to recover after multiple attempts. Please try a different approach.",
        [],
      );
      return false;
    }

    setErrorState((prev) => ({
      ...prev,
      isRecovering: true,
      recoveryAttempts: prev.recoveryAttempts + 1,
    }));

    try {
      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, retryDelay * errorState.recoveryAttempts),
      );

      // Clear error state
      clearError();

      // Trigger recovery success
      onRecovery?.(true);
      addSuccessNotification(
        "Recovery Successful",
        "Operation completed successfully after retry.",
      );

      return true;
    } catch (retryError) {
      logError("Retry failed", retryError, "useErrorHandling");
      onRecovery?.(false);
      return false;
    } finally {
      setErrorState((prev) => ({
        ...prev,
        isRecovering: false,
      }));
    }
  }, [
    errorState.recoveryAttempts,
    maxRetries,
    retryDelay,
    onRecovery,
    addWarningNotification,
    clearError,
    addSuccessNotification,
  ]);

  // Report error to local storage for debugging
  const reportError = useCallback(
    (error: Error, context?: string) => {
      try {
        const errorReport = {
          timestamp: new Date().toISOString(),
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context,
          userAgent: navigator.userAgent,
          url: window.location.href,
          localStorage: Object.keys(localStorage).filter((key) =>
            key.startsWith("enhanced_pain_tracker_"),
          ).length,
        };

        const existingReports = JSON.parse(
          localStorage.getItem("pain_tracker_error_reports") || "[]",
        );
        existingReports.push(errorReport);

        // Keep only last 10 reports
        if (existingReports.length > 10) {
          existingReports.splice(0, existingReports.length - 10);
        }

        localStorage.setItem(
          "pain_tracker_error_reports",
          JSON.stringify(existingReports),
        );

        addSuccessNotification(
          "Error Reported",
          "Error details have been saved for debugging.",
        );
      } catch (reportingError) {
        logError("Failed to report error", reportingError, "useErrorHandling");
      }
    },
    [addSuccessNotification],
  );

  // Download corrupted data for analysis
  const downloadCorruptedData = useCallback((data: string) => {
    try {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pain-tracker-corrupted-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      logError(
        "Failed to download corrupted data",
        downloadError,
        "useErrorHandling",
      );
    }
  }, []);

  // Get storage recovery actions
  const getStorageRecoveryActions = useCallback(async (): Promise<
    RecoveryAction[]
  > => {
    const actions: RecoveryAction[] = [];

    // Check if backup is available
    const backupAvailable = localStorage.getItem(
      "enhanced_pain_tracker_records_backup",
    );
    if (backupAvailable) {
      actions.push({
        label: "Restore Backup",
        action: async () => {
          try {
            const backup = JSON.parse(backupAvailable);
            localStorage.setItem(
              "enhanced_pain_tracker_records",
              JSON.stringify(backup.records),
            );
            return true;
          } catch {
            return false;
          }
        },
        riskLevel: "medium",
        description: "Restore from automatic backup",
      });
    }

    // Clear storage and start fresh
    actions.push({
      label: "Clear Storage",
      action: async () => {
        try {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("enhanced_pain_tracker_")) {
              localStorage.removeItem(key);
            }
          });
          return true;
        } catch {
          return false;
        }
      },
      riskLevel: "high",
      description: "Clear all data and start fresh",
    });

    return actions;
  }, []);

  // Handle storage errors
  const handleStorageError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_error?: PainTrackerError, _context?: string) => {
      if (enableOfflineMode && isOffline) {
        addWarningNotification(
          "Offline Storage Issue",
          "Unable to save to local storage. Data will be kept in memory until connection is restored.",
          [
            {
              label: "Retry",
              action: () => retryLastOperation(),
              style: "primary",
            },
          ],
        );
      } else {
        const recoveryActions = await getStorageRecoveryActions();
        addErrorNotification(
          "Storage Error",
          "Unable to save your pain tracking data. Your browser storage may be full or corrupted.",
          recoveryActions.slice(0, 2).map((action) => ({
            label: action.label,
            action: action.action,
            style: action.riskLevel === "low" ? "primary" : "secondary",
          })),
        );
      }
    },
    [
      isOffline,
      enableOfflineMode,
      addWarningNotification,
      addErrorNotification,
      retryLastOperation,
      getStorageRecoveryActions,
    ],
  );

  // Handle validation errors
  const handleValidationError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_error?: PainTrackerError, _context?: string) => {
      addErrorNotification(
        "Data Validation Error",
        "The pain tracking data contains invalid information. Please check your entries and try again.",
        [
          {
            label: "Review Data",
            action: () => {
              // This would trigger a review of the current form or data
              clearError();
            },
            style: "primary",
          },
        ],
      );
    },
    [addErrorNotification, clearError],
  );

  // Handle export errors
  const handleExportError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_error?: PainTrackerError, _context?: string) => {
      addErrorNotification(
        "Export Error",
        "Unable to export your pain tracking data. This may be due to browser limitations or data size.",
        [
          {
            label: "Try Different Format",
            action: () => {
              // This would suggest trying HTML instead of PDF, etc.
              clearError();
            },
            style: "primary",
          },
          {
            label: "Export Smaller Range",
            action: () => {
              // This would suggest exporting a smaller date range
              clearError();
            },
            style: "secondary",
          },
        ],
      );
    },
    [addErrorNotification, clearError],
  );

  // Handle chart errors
  const handleChartError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_error?: PainTrackerError, _context?: string) => {
      addWarningNotification(
        "Chart Display Error",
        "Unable to display charts. You can still view your data in table format.",
        [
          {
            label: "View Table",
            action: () => {
              // This would switch to table view
              clearError();
            },
            style: "primary",
          },
          {
            label: "Retry Charts",
            action: () => retryLastOperation(),
            style: "secondary",
          },
        ],
      );
    },
    [addWarningNotification, clearError, retryLastOperation],
  );

  // Handle data corruption
  const handleDataCorruption = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_error?: PainTrackerError, _context?: string) => {
      try {
        const integrityReport = await dataIntegrityService.checkDataIntegrity();

        if (integrityReport.recoveryOptions.length > 0) {
          notifyDataCorruption(
            integrityReport.corruptionLevel,
            integrityReport.recoveryOptions,
          );
        } else {
          addErrorNotification(
            "Data Corruption Detected",
            "Your pain tracking data appears to be corrupted and cannot be automatically recovered.",
            [
              {
                label: "Export Raw Data",
                action: async () => {
                  try {
                    const corruptedData =
                      await dataIntegrityService.exportCorruptedData();
                    downloadCorruptedData(corruptedData);
                  } catch (exportError) {
                    logError(
                      "Failed to export corrupted data",
                      exportError,
                      "useErrorHandling",
                    );
                  }
                },
                style: "secondary",
              },
              {
                label: "Start Fresh",
                action: () => {
                  if (
                    confirm("This will delete all current data. Are you sure?")
                  ) {
                    localStorage.clear();
                    window.location.reload();
                  }
                },
                style: "danger",
              },
            ],
          );
        }
      } catch (checkError) {
        logError(
          "Failed to check data integrity",
          checkError,
          "useErrorHandling",
        );
        addErrorNotification(
          "Critical Data Error",
          "Unable to assess data corruption. Manual intervention required.",
          [],
        );
      }
    },
    [
      dataIntegrityService,
      notifyDataCorruption,
      addErrorNotification,
      downloadCorruptedData,
    ],
  );

  // Handle quota exceeded
  const handleQuotaExceeded = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_error?: PainTrackerError, _context?: string) => {
      notifyStorageQuotaExceeded(
        () => {
          // Export data action
          window.dispatchEvent(new CustomEvent("pain-tracker-export-request"));
        },
        () => {
          // Cleanup action
          window.dispatchEvent(new CustomEvent("pain-tracker-cleanup-request"));
        },
      );
    },
    [notifyStorageQuotaExceeded],
  );

  // Handle migration errors
  const handleMigrationError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_error?: PainTrackerError, _context?: string) => {
      addErrorNotification(
        "Data Migration Error",
        "Unable to update your data to the latest format. Your data is safe but some features may not work.",
        [
          {
            label: "Retry Migration",
            action: () => retryLastOperation(),
            style: "primary",
          },
          {
            label: "Export Backup",
            action: () => {
              window.dispatchEvent(
                new CustomEvent("pain-tracker-backup-request"),
              );
            },
            style: "secondary",
          },
        ],
      );
    },
    [addErrorNotification, retryLastOperation],
  );

  // Handle generic errors
  const handleGenericError = useCallback(
    async (error: Error, context?: string) => {
      addErrorNotification(
        "Unexpected Error",
        `An unexpected error occurred${
          context ? ` while ${context}` : ""
        }. Please try again.`,
        [
          {
            label: "Retry",
            action: () => retryLastOperation(),
            style: "primary",
          },
          {
            label: "Report Issue",
            action: () => reportError(error, context),
            style: "secondary",
          },
        ],
      );
    },
    [addErrorNotification, retryLastOperation, reportError],
  );

  const handlePainTrackerError = useCallback(
    async (error: PainTrackerError, context?: string) => {
      switch (error.code) {
        case "STORAGE_ERROR":
          await handleStorageError(error, context);
          break;
        case "VALIDATION_ERROR":
          await handleValidationError(error, context);
          break;
        case "EXPORT_ERROR":
          await handleExportError(error, context);
          break;
        case "CHART_ERROR":
          await handleChartError(error, context);
          break;
        case "DATA_CORRUPTION":
          await handleDataCorruption(error, context);
          break;
        case "QUOTA_EXCEEDED":
          await handleQuotaExceeded(error, context);
          break;
        case "MIGRATION_ERROR":
          await handleMigrationError(error, context);
          break;
        default:
          await handleGenericError(error, context);
      }
    },
    [
      handleStorageError,
      handleValidationError,
      handleExportError,
      handleChartError,
      handleDataCorruption,
      handleQuotaExceeded,
      handleMigrationError,
      handleGenericError,
    ],
  );

  const handleError = useCallback(
    async (error: Error | PainTrackerError, context?: string) => {
      const now = new Date();

      setErrorState((prev) => ({
        ...prev,
        hasError: true,
        error,
        errorCode: error instanceof PainTrackerError ? error.code : null,
        lastErrorTime: now,
      }));

      onError?.(error);

      logError(
        `Pain Tracker Error${context ? ` (${context})` : ""}:`,
        error,
        "useErrorHandling",
      );

      if (error instanceof PainTrackerError) {
        await handlePainTrackerError(error, context);
      } else {
        await handleGenericError(error, context);
      }
    },
    [handlePainTrackerError, handleGenericError, onError],
  );

  // Auto-recovery for certain error types
  useEffect(() => {
    if (enableAutoRecovery && errorState.hasError && !errorState.isRecovering) {
      const autoRecoverableErrors: PainTrackerErrorCode[] = [
        "CHART_ERROR",
        "VALIDATION_ERROR",
      ];

      if (
        errorState.errorCode &&
        autoRecoverableErrors.includes(errorState.errorCode)
      ) {
        const timer = setTimeout(() => {
          retryLastOperation();
        }, retryDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [errorState, enableAutoRecovery, retryDelay, retryLastOperation]);

  // Periodic health check
  useEffect(() => {
    const healthCheckInterval = setInterval(
      async () => {
        try {
          const report = await dataIntegrityService.checkDataIntegrity();
          if (!report.isValid && report.corruptionLevel !== "none") {
            handleError(
              new PainTrackerError(
                "Data corruption detected during health check",
                "DATA_CORRUPTION",
              ),
              "health check",
            );
          }
        } catch (error) {
          // Silently fail health checks to avoid spam
          logWarn("Health check failed", error, "useErrorHandling");
        }
      },
      5 * 60 * 1000,
    ); // Every 5 minutes

    return () => clearInterval(healthCheckInterval);
  }, [dataIntegrityService, handleError]);

  return {
    errorState,
    handleError,
    clearError,
    retryLastOperation,
    reportError,
  };
}

export default useErrorHandling;
