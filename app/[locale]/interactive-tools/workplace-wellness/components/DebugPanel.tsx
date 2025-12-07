"use client";

import {
  useCalendar,
  useWorkplaceWellnessActions,
} from "../hooks/useWorkplaceWellnessStore";
import { useState } from "react";

export default function DebugPanel() {
  const calendar = useCalendar();
  const { addPeriodRecord } = useWorkplaceWellnessActions();
  const [isVisible, setIsVisible] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const logMessage = (message: string) => {
    setDebugLogs((prev) => [message, ...prev].slice(0, 6));
  };

  const checkData = () => {
    const storeData = localStorage.getItem("workplace-wellness-storage");
    logMessage(`Raw snapshot length: ${storeData?.length ?? 0}`);

    if (storeData) {
      try {
        const parsed = JSON.parse(storeData);
        logMessage(
          `Parsed records: ${JSON.stringify(
            parsed?.state?.calendar?.periodData ?? [],
          )}`,
        );
      } catch (error) {
        logMessage(
          `Parse error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }
  };

  const addTestRecord = () => {
    const today = new Date().toISOString().split("T")[0];
    addPeriodRecord({
      date: today,
      type: "period",
      painLevel: 5,
      flow: "medium",
    });
  };

  // 只在开发环境显示
  if (typeof process !== "undefined" && process.env?.NODE_ENV !== "development")
    return null;

  // 额外检查：确保不会在生产环境意外显示
  if (
    typeof window !== "undefined" &&
    window.location?.hostname !== "localhost"
  )
    return null;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          zIndex: 9999,
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        Debug
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        width: "300px",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        zIndex: 9999,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <strong>当前记录数:</strong> {calendar.periodData?.length || 0}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={checkData}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          检查数据
        </button>

        <button
          onClick={addTestRecord}
          style={{
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          添加测试记录
        </button>

        <button
          onClick={() => {
            const event = new CustomEvent("store-rehydrate-complete", {
              detail: {
                recordCount: calendar.periodData?.length || 0,
                hasValidData: (calendar.periodData?.length || 0) > 0,
              },
            });
            window.dispatchEvent(event);
          }}
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          触发恢复事件
        </button>
      </div>

      <div style={{ marginTop: "12px", fontSize: "12px", color: "#6b7280" }}>
        只在开发环境显示
      </div>
      {debugLogs.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#374151",
          }}
        >
          <strong>Debug Logs</strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: "16px" }}>
            {debugLogs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
