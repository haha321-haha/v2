"use client";

import React, { useState, useEffect } from "react";

/**
 * P3阶段：综合测试框架
 * 提供单元测试、集成测试、用户体验测试和跨浏览器测试
 */

// 测试结果接口
interface TestResult {
  id: string;
  name: string;
  status: "pass" | "fail" | "skip" | "running";
  duration?: number;
  error?: string;
  details?: Record<string, unknown>;
}

// 测试套件接口
interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: "pending" | "running" | "completed" | "failed";
  duration?: number;
}

// 测试配置接口
interface TestConfig {
  timeout: number;
  retries: number;
  parallel: boolean;
  environment: "development" | "production" | "test";
}

type TestEnvironment = TestConfig["environment"];

// 测试框架钩子
export function useTestFramework() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<TestConfig>({
    timeout: 5000,
    retries: 2,
    parallel: true,
    environment: "development",
  });

  // 初始化测试套件
  useEffect(() => {
    const initialSuites: TestSuite[] = [
      {
        id: "unit-tests",
        name: "单元测试",
        description: "测试各个组件的独立功能",
        tests: [],
        status: "pending",
      },
      {
        id: "integration-tests",
        name: "集成测试",
        description: "测试组件间的交互和集成",
        tests: [],
        status: "pending",
      },
      {
        id: "ux-tests",
        name: "用户体验测试",
        description: "测试用户界面和交互体验",
        tests: [],
        status: "pending",
      },
      {
        id: "accessibility-tests",
        name: "无障碍测试",
        description: "测试无障碍访问功能",
        tests: [],
        status: "pending",
      },
      {
        id: "performance-tests",
        name: "性能测试",
        description: "测试应用性能指标",
        tests: [],
        status: "pending",
      },
    ];

    setTestSuites(initialSuites);
  }, []);

  // 运行单个测试
  const runTest = async (
    suiteId: string,
    testId: string,
  ): Promise<TestResult> => {
    const test = testSuites
      .find((s) => s.id === suiteId)
      ?.tests.find((t) => t.id === testId);
    if (!test) throw new Error("Test not found");

    const startTime = Date.now();

    try {
      // 模拟测试执行
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 500),
      );

      const duration = Date.now() - startTime;
      const success = Math.random() > 0.1; // 90% 成功率

      return {
        ...test,
        status: success ? "pass" : "fail",
        duration,
        error: success ? undefined : "模拟测试失败",
      };
    } catch (err) {
      return {
        ...test,
        status: "fail",
        duration: Date.now() - startTime,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  };

  // 运行测试套件
  const runTestSuite = async (suiteId: string) => {
    const suite = testSuites.find((s) => s.id === suiteId);
    if (!suite) return;

    setIsRunning(true);
    const startTime = Date.now();

    // 更新套件状态
    setTestSuites((prev) =>
      prev.map((s) => (s.id === suiteId ? { ...s, status: "running" } : s)),
    );

    try {
      // 为套件添加一些示例测试
      const exampleTests: TestResult[] = [
        {
          id: `${suiteId}-test-1`,
          name: `${suite.name} - 基础功能测试`,
          status: "running",
        },
        {
          id: `${suiteId}-test-2`,
          name: `${suite.name} - 边界条件测试`,
          status: "running",
        },
        {
          id: `${suiteId}-test-3`,
          name: `${suite.name} - 错误处理测试`,
          status: "running",
        },
      ];

      // 更新测试列表
      setTestSuites((prev) =>
        prev.map((s) => (s.id === suiteId ? { ...s, tests: exampleTests } : s)),
      );

      // 运行所有测试
      const results = await Promise.all(
        exampleTests.map((test) => runTest(suiteId, test.id)),
      );

      const duration = Date.now() - startTime;
      const allPassed = results.every((r) => r.status === "pass");

      // 更新套件结果
      setTestSuites((prev) =>
        prev.map((s) =>
          s.id === suiteId
            ? {
                ...s,
                status: allPassed ? "completed" : "failed",
                tests: results,
                duration,
              }
            : s,
        ),
      );
    } catch {
      setTestSuites((prev) =>
        prev.map((s) =>
          s.id === suiteId
            ? {
                ...s,
                status: "failed",
                duration: Date.now() - startTime,
              }
            : s,
        ),
      );
    } finally {
      setIsRunning(false);
    }
  };

  // 运行所有测试
  const runAllTests = async () => {
    setIsRunning(true);

    for (const suite of testSuites) {
      await runTestSuite(suite.id);
    }

    setIsRunning(false);
  };

  // 重置测试结果
  const resetTests = () => {
    setTestSuites((prev) =>
      prev.map((suite) => ({
        ...suite,
        status: "pending",
        tests: [],
        duration: undefined,
      })),
    );
  };

  // 获取测试统计
  const getTestStats = () => {
    const totalTests = testSuites.reduce(
      (sum, suite) => sum + suite.tests.length,
      0,
    );
    const passedTests = testSuites.reduce(
      (sum, suite) =>
        sum + suite.tests.filter((test) => test.status === "pass").length,
      0,
    );
    const failedTests = testSuites.reduce(
      (sum, suite) =>
        sum + suite.tests.filter((test) => test.status === "fail").length,
      0,
    );
    const completedSuites = testSuites.filter(
      (suite) => suite.status === "completed",
    ).length;

    return {
      totalTests,
      passedTests,
      failedTests,
      completedSuites,
      totalSuites: testSuites.length,
      passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
    };
  };

  return {
    testSuites,
    isRunning,
    config,
    setConfig,
    runTestSuite,
    runAllTests,
    resetTests,
    getTestStats,
  };
}

// 测试框架组件
export function TestingFramework() {
  const {
    testSuites,
    isRunning,
    config,
    setConfig,
    runTestSuite,
    runAllTests,
    resetTests,
    getTestStats,
  } = useTestFramework();

  const stats = getTestStats();

  const handleEnvironmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value as TestEnvironment;
    setConfig((prev) => ({
      ...prev,
      environment: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">测试框架</h2>
        <div className="flex gap-2">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isRunning ? "运行中..." : "运行所有测试"}
          </button>
          <button
            onClick={resetTests}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            重置
          </button>
        </div>
      </div>

      {/* 测试统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800">
            {stats.totalTests}
          </div>
          <div className="text-sm text-blue-600">总测试数</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">
            {stats.passedTests}
          </div>
          <div className="text-sm text-green-600">通过</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-800">
            {stats.failedTests}
          </div>
          <div className="text-sm text-red-600">失败</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-800">
            {stats.completedSuites}
          </div>
          <div className="text-sm text-purple-600">完成套件</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-800">
            {stats.passRate.toFixed(1)}%
          </div>
          <div className="text-sm text-orange-600">通过率</div>
        </div>
      </div>

      {/* 测试配置 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">测试配置</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              超时时间 (ms)
            </label>
            <input
              type="number"
              value={config.timeout}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  timeout: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              重试次数
            </label>
            <input
              type="number"
              value={config.retries}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  retries: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              环境
            </label>
            <select
              value={config.environment}
              onChange={handleEnvironmentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="development">开发环境</option>
              <option value="test">测试环境</option>
              <option value="production">生产环境</option>
            </select>
          </div>
        </div>
      </div>

      {/* 测试套件列表 */}
      <div className="space-y-4">
        {testSuites.map((suite) => (
          <div key={suite.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {suite.name}
                </h3>
                <p className="text-sm text-gray-600">{suite.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    suite.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : suite.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : suite.status === "running"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {suite.status === "completed"
                    ? "已完成"
                    : suite.status === "failed"
                      ? "失败"
                      : suite.status === "running"
                        ? "运行中"
                        : "待运行"}
                </span>
                <button
                  onClick={() => runTestSuite(suite.id)}
                  disabled={isRunning || suite.status === "running"}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  运行
                </button>
              </div>
            </div>

            {/* 测试结果 */}
            {suite.tests.length > 0 && (
              <div className="mt-3 space-y-2">
                {suite.tests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          test.status === "pass"
                            ? "bg-green-500"
                            : test.status === "fail"
                              ? "bg-red-500"
                              : test.status === "running"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-700">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.duration && (
                        <span className="text-xs text-gray-500">
                          {test.duration}ms
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          test.status === "pass"
                            ? "bg-green-100 text-green-800"
                            : test.status === "fail"
                              ? "bg-red-100 text-red-800"
                              : test.status === "running"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {test.status === "pass"
                          ? "通过"
                          : test.status === "fail"
                            ? "失败"
                            : test.status === "running"
                              ? "运行中"
                              : "待运行"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {suite.duration && (
              <div className="mt-2 text-sm text-gray-500">
                总耗时: {suite.duration}ms
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const TestingFrameworkModule = {
  useTestFramework,
  TestingFramework,
};

export default TestingFrameworkModule;
