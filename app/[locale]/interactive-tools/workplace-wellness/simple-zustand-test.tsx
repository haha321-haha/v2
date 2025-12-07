"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState, useEffect } from "react";
import { logInfo } from "@/lib/debug-logger";

// 创建一个简单的独立store
interface SimpleTestState {
  counter: number;
  text: string;
  increment: () => void;
  decrement: () => void;
  setText: (text: string) => void;
  reset: () => void;
}

const useSimpleTestStore = create<SimpleTestState>()(
  persist(
    (set) => ({
      counter: 0,
      text: "",
      increment: () => set((state) => ({ counter: state.counter + 1 })),
      decrement: () => set((state) => ({ counter: state.counter - 1 })),
      setText: (text) => set({ text }),
      reset: () => set({ counter: 0, text: "" }),
    }),
    {
      name: "simple-test-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        logInfo("SimpleTestStore rehydrated", state, "simple-zustand-test");
      },
    },
  ),
);

export default function SimpleZustandTest() {
  const [isClient, setIsClient] = useState(false);
  const [message, setMessage] = useState("");

  // 先获取store，但不在渲染时使用
  const store = useSimpleTestStore();
  const { counter, text, increment, decrement, setText, reset } = store;

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    useSimpleTestStore.persist?.rehydrate?.();
  }, []);

  if (!isClient) {
    return <div className="p-8 bg-white rounded-lg shadow-md">加载中...</div>;
  }

  const checkStorage = () => {
    try {
      const data = localStorage.getItem("simple-test-storage");
      if (data) {
        const parsed = JSON.parse(data);
        setMessage("存储数据: " + JSON.stringify(parsed.state, null, 2));
      } else {
        setMessage("没有存储数据");
      }
    } catch (error) {
      setMessage("检查存储失败: " + String(error));
    }
  };

  const forceRehydrate = () => {
    try {
      const rehydrate = useSimpleTestStore.persist?.rehydrate;
      if (rehydrate) {
        rehydrate();
        setMessage("强制重新水合完成");
      } else {
        setMessage("rehydrate 方法不可用");
      }
    } catch (error) {
      setMessage("强制重新水合失败: " + String(error));
    }
  };

  const persistNow = () => {
    try {
      // Zustand persist 中间件会自动持久化，这里只是触发一次状态更新来确保保存
      const currentState = useSimpleTestStore.getState();
      useSimpleTestStore.setState(currentState);
      setMessage("状态已更新，持久化将自动完成");
    } catch (error) {
      setMessage("更新状态失败: " + String(error));
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">简单 Zustand Store 测试</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 计数器测试 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">计数器测试</h2>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={decrement}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              -1
            </button>
            <div className="text-2xl font-bold w-16 text-center">{counter}</div>
            <button
              onClick={increment}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              +1
            </button>
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
          >
            重置计数器
          </button>
        </div>

        {/* 文本测试 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">文本测试</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            rows={4}
            placeholder="输入一些文本..."
          />
          <div className="text-sm text-gray-600">字符数: {text.length}</div>
        </div>
      </div>

      {/* 存储控制 */}
      <div className="mt-6 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">存储控制</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={checkStorage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            检查存储
          </button>
          <button
            onClick={forceRehydrate}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            强制水合
          </button>
          <button
            onClick={persistNow}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            立即持久化
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              setMessage("localStorage已清除");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            清除所有存储
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{message}</pre>
          </div>
        )}
      </div>

      {/* 状态显示 */}
      <div className="mt-6 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">当前状态</h2>
        <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-auto">
          {JSON.stringify({ counter, textLength: text.length }, null, 2)}
        </pre>
      </div>

      {/* 使用说明 */}
      <div className="mt-6 border rounded-lg p-4 bg-blue-50">
        <h2 className="text-lg font-semibold mb-4">使用说明</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>使用计数器按钮测试数值变化和持久化</li>
          <li>在文本框中输入内容测试文本持久化</li>
          <li>刷新页面后检查数据是否保存</li>
          <li>使用“检查存储”查看localStorage中的数据</li>
          <li>使用“强制水合”手动触发数据恢复</li>
          <li>使用“立即持久化”手动保存当前状态</li>
        </ol>
      </div>
    </div>
  );
}
