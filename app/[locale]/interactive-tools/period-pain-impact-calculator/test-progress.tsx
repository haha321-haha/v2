"use client";

import { useState } from "react";

export default function TestProgressPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // 模拟15个问题
  const totalQuestions = 15;

  // 进度计算：当前题目索引+1（因为索引从0开始），除以总题目数
  const progress =
    totalQuestions > 0
      ? Math.min(((currentQuestionIndex + 1) / totalQuestions) * 100, 100)
      : 0;

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const resetProgress = () => {
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">进度测试页面</h1>

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium text-gray-900">进度测试</h2>
          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          进度: {progress.toFixed(1)}%
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300 ${
            currentQuestionIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          上一题
        </button>

        <button
          onClick={nextQuestion}
          disabled={currentQuestionIndex >= totalQuestions - 1}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300 ${
            currentQuestionIndex >= totalQuestions - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-purple-900 text-white hover:bg-purple-800"
          }`}
        >
          下一题
        </button>

        <button
          onClick={resetProgress}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
        >
          重置
        </button>
      </div>

      {/* 当前状态显示 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">当前状态</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">当前问题索引：</span>
            <span className="ml-2">{currentQuestionIndex}</span>
          </div>
          <div>
            <span className="font-medium">当前问题编号：</span>
            <span className="ml-2">{currentQuestionIndex + 1}</span>
          </div>
          <div>
            <span className="font-medium">总问题数：</span>
            <span className="ml-2">{totalQuestions}</span>
          </div>
          <div>
            <span className="font-medium">进度百分比：</span>
            <span className="ml-2">{progress.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 测试说明 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">测试说明</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>点击“下一题”按钮，观察进度是否正确增加</li>
          <li>当到达最后一题时，进度应该是100%</li>
          <li>点击“重置”按钮，进度应该重置为0%</li>
          <li>这个测试页面的逻辑与实际计算器的进度逻辑相同</li>
        </ol>
      </div>
    </div>
  );
}
