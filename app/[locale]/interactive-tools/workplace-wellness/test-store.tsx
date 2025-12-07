"use client";

import { useState, useEffect } from "react";
import {
  useWorkplaceWellnessStore,
  useWorkplaceWellnessActions,
} from "./hooks/useWorkplaceWellnessStore";
import type { CalendarState, WorkImpactData, NutritionData } from "./types";
import type { WorkplaceWellnessStore } from "./hooks/useWorkplaceWellnessStore";
import { logWarn } from "@/lib/debug-logger";

export default function TestStore() {
  // 获取本地日期的 YYYY-MM-DD 格式字符串
  const getLocalTodayString = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const { setActiveTab, updateWorkImpact, addPeriodRecord } =
    useWorkplaceWellnessActions();
  const [testMessage, setTestMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  // 使用完整的 activeTab 类型，包括 'energy'
  const activeTab = useWorkplaceWellnessStore(
    (state) => state.activeTab,
  ) as string;
  const calendar = useWorkplaceWellnessStore(
    (state) => state.calendar,
  ) as CalendarState;
  const workImpact = useWorkplaceWellnessStore(
    (state) => state.workImpact,
  ) as WorkImpactData;
  const nutrition = useWorkplaceWellnessStore(
    (state) => state.nutrition,
  ) as NutritionData;

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    try {
      const store = useWorkplaceWellnessStore as unknown as {
        persist?: { rehydrate?: () => void | Promise<void> };
      };
      store.persist?.rehydrate?.();
    } catch (error) {
      logWarn("无法重新hydration", error, "test-store");
    }
  }, []);

  const testAddRecord = () => {
    try {
      const record = {
        date: getLocalTodayString(),
        type: "period" as const,
        painLevel: 5 as const,
        flow: null,
      };

      addPeriodRecord(record);
      setTestMessage("记录已添加: " + JSON.stringify(record));
    } catch (error) {
      setTestMessage("添加记录失败: " + String(error));
    }
  };

  const testUpdateWorkImpact = () => {
    try {
      updateWorkImpact({ painLevel: 7, efficiency: 60 });
      setTestMessage("工作影响已更新: painLevel=7, efficiency=60");
    } catch (error) {
      setTestMessage("更新工作影响失败: " + String(error));
    }
  };

  const testLocalStorage = () => {
    try {
      const storageData = localStorage.getItem("workplace-wellness-storage");
      if (storageData) {
        const parsed = JSON.parse(storageData);
        setTestMessage(
          "存储数据存在: " + JSON.stringify(parsed.state, null, 2),
        );
      } else {
        setTestMessage("存储数据不存在");
      }
    } catch (error) {
      setTestMessage("读取存储失败: " + String(error));
    }
  };

  const testPersist = () => {
    try {
      // Zustand persist 中间件会自动持久化，这里只是检查当前状态
      const store = useWorkplaceWellnessStore as unknown as {
        getState: () => WorkplaceWellnessStore;
      };
      const currentState = store.getState();
      // 通过更新 activeTab 来触发状态更新，从而触发自动持久化
      // 使用类型断言绕过 SSR 空函数的类型推断问题
      setActiveTab(
        currentState.activeTab as
          | "calendar"
          | "nutrition"
          | "export"
          | "settings"
          | "work-impact"
          | "analysis"
          | "assessment"
          | "recommendations"
          | "tracking"
          | "analytics",
      );
      setTestMessage(
        "状态已更新，持久化将自动完成。当前状态: " +
          JSON.stringify({
            activeTab: currentState.activeTab,
            calendarRecords: currentState.calendar.periodData.length,
          }),
      );
    } catch (error) {
      setTestMessage("持久化测试失败: " + String(error));
    }
  };

  const testForceHydration = () => {
    try {
      // 使用正确的 API 访问 persist
      const store = useWorkplaceWellnessStore as unknown as {
        persist?: { rehydrate?: () => void | Promise<void> };
      };
      const rehydrate = store.persist?.rehydrate;
      if (rehydrate) {
        rehydrate();
        setTestMessage("强制hydration完成");
      } else {
        setTestMessage("无法获取rehydrate方法");
      }
    } catch (error) {
      setTestMessage("强制hydration失败: " + String(error));
    }
  };

  const testDirectLocalStorage = () => {
    try {
      // 直接测试localStorage
      const testData = {
        testValue: "This is a test",
        timestamp: new Date().toISOString(),
        testNumber: Math.floor(Math.random() * 100),
      };

      localStorage.setItem("test-storage-key", JSON.stringify(testData));

      // 立即读取
      const retrieved = JSON.parse(
        localStorage.getItem("test-storage-key") || "{}",
      );

      setTestMessage(
        "直接localStorage测试成功: " + JSON.stringify(retrieved, null, 2),
      );
    } catch (error) {
      setTestMessage("直接localStorage测试失败: " + String(error));
    }
  };

  const testStoreDirectWrite = () => {
    try {
      // 直接写入localStorage测试数据
      const store = useWorkplaceWellnessStore as unknown as {
        getState: () => WorkplaceWellnessStore;
      };
      const state = store.getState();
      const testState = {
        ...state,
        calendar: {
          ...state.calendar,
          periodData: [
            {
              date: getLocalTodayString(),
              type: "period",
              painLevel: 8,
              flow: null,
            },
          ],
        },
      };

      localStorage.setItem(
        "workplace-wellness-storage",
        JSON.stringify({
          state: testState,
          version: 0,
        }),
      );

      setTestMessage("直接写入store数据到localStorage成功");
    } catch (error) {
      setTestMessage("直接写入store数据失败: " + String(error));
    }
  };

  const testDirectStoreRead = () => {
    try {
      // 直接从localStorage读取
      const raw = localStorage.getItem("workplace-wellness-storage");
      if (!raw) {
        setTestMessage("localStorage中没有找到workplace-wellness-storage数据");
        return;
      }

      const parsed = JSON.parse(raw);
      setTestMessage(
        "直接从localStorage读取数据成功: " +
          JSON.stringify(parsed.state.calendar.periodData, null, 2),
      );
    } catch (error) {
      setTestMessage("直接从localStorage读取失败: " + String(error));
    }
  };

  if (!isClient) {
    return <div className="p-8 bg-white rounded-lg shadow-md">加载中...</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Store 测试页面</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">当前状态</h2>
          <p>当前标签: {activeTab}</p>
          <p>经期记录数量: {calendar.periodData.length}</p>
          <p>疼痛等级: {workImpact.painLevel}</p>
          <p>工作效率: {workImpact.efficiency}%</p>
          <p>选定阶段: {nutrition.selectedPhase}</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={testAddRecord}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            测试添加记录
          </button>

          <button
            onClick={testUpdateWorkImpact}
            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
          >
            测试更新工作影响
          </button>

          <button
            onClick={testLocalStorage}
            className="px-4 py-2 bg-purple-500 text-white rounded mr-2"
          >
            检查本地存储
          </button>

          <button
            onClick={() => setActiveTab("nutrition")}
            className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
          >
            切换到营养标签
          </button>

          <button
            onClick={testPersist}
            className="px-4 py-2 bg-indigo-500 text-white rounded mr-2"
          >
            测试持久化
          </button>

          <button
            onClick={testForceHydration}
            className="px-4 py-2 bg-pink-500 text-white rounded mr-2 mb-2"
          >
            强制Hydration
          </button>

          <button
            onClick={testDirectLocalStorage}
            className="px-4 py-2 bg-orange-500 text-white rounded mr-2 mb-2"
          >
            测试直接localStorage
          </button>

          <button
            onClick={testStoreDirectWrite}
            className="px-4 py-2 bg-teal-500 text-white rounded mr-2 mb-2"
          >
            直接写入store数据
          </button>

          <button
            onClick={testDirectStoreRead}
            className="px-4 py-2 bg-cyan-500 text-white rounded mb-2"
          >
            直接读取store数据
          </button>
        </div>

        {testMessage && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <pre className="whitespace-pre-wrap">{testMessage}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
