"use client";

import { useState, useEffect } from "react";

export default function SimpleStorageTest() {
  const [testData, setTestData] = useState<string>("");
  const [savedData, setSavedData] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const saveData = () => {
    try {
      localStorage.setItem("simple-test-key", testData);
      setMessage("数据已保存到localStorage");
    } catch (error) {
      setMessage("保存失败: " + String(error));
    }
  };

  const loadData = () => {
    try {
      const data = localStorage.getItem("simple-test-key");
      if (data) {
        setSavedData(data);
        setMessage("数据已从localStorage读取");
      } else {
        setSavedData("");
        setMessage("localStorage中没有数据");
      }
    } catch (error) {
      setMessage("读取失败: " + String(error));
    }
  };

  const clearData = () => {
    try {
      localStorage.removeItem("simple-test-key");
      setSavedData("");
      setMessage("数据已清除");
    } catch (error) {
      setMessage("清除失败: " + String(error));
    }
  };

  if (!isClient) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
        加载中...
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">简单存储测试</h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            输入测试数据:
          </label>
          <textarea
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={4}
            placeholder="输入一些测试数据..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存数据
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            读取数据
          </button>
          <button
            onClick={clearData}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            清除数据
          </button>
        </div>

        {message && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            {message}
          </div>
        )}

        {savedData && (
          <div>
            <h3 className="text-lg font-medium mb-2">
              从localStorage读取的数据:
            </h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <pre className="whitespace-pre-wrap">{savedData}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">localStorage状态检查</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="text-sm">
            {typeof window !== "undefined"
              ? `localStorage可用\n` +
                `totalSpace: ${JSON.stringify(localStorage)}\n` +
                `localStorage中的键数量: ${localStorage.length}\n` +
                `所有键: ${Array.from({ length: localStorage.length }, (_, i) =>
                  localStorage.key(i),
                ).join(", ")}`
              : "localStorage不可用(可能是服务器端渲染)"}
          </pre>
        </div>
      </div>
    </div>
  );
}
