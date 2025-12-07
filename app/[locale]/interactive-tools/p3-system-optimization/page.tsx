"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// 动态导入Lucide图标 - 按需加载
const Zap = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Zap })),
  { ssr: false },
);
const TestTube = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.TestTube })),
  { ssr: false },
);
const BookOpen = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.BookOpen })),
  { ssr: false },
);
const CheckCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.CheckCircle })),
  { ssr: false },
);
const Clock = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
  { ssr: false },
);
const Target = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Target })),
  { ssr: false },
);
const BarChart3 = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.BarChart3 })),
  { ssr: false },
);
const Globe = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Globe })),
  { ssr: false },
);

// 动态导入P3组件 - 代码分割优化
const I18nOptimizer = dynamic(
  () => import("../shared/components/I18nOptimizer"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const PerformanceOptimizer = dynamic(
  () => import("../shared/components/PerformanceOptimizer"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const TestingFramework = dynamic(
  () =>
    import("../shared/components/TestingFramework").then((mod) => ({
      default: mod.TestingFramework,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const DocumentationFramework = dynamic(
  () =>
    import("../shared/components/DocumentationFramework").then((mod) => ({
      default: mod.DocumentationFramework,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const PerformanceOptimizationPanel = dynamic(
  () =>
    import("../shared/components/PerformanceMonitor").then((mod) => ({
      default: mod.PerformanceOptimizationPanel,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

interface P3PhaseProps {
  locale: string;
}

export default function P3Phase({ locale }: P3PhaseProps) {
  const t = useTranslations("interactiveTools.p3");
  const [activeTab, setActiveTab] = useState<string>("i18n");
  const [completedTasks] = useState<Set<string>>(() => new Set(["i18n"])); // 国际化已完成

  // 组件初始化
  React.useEffect(() => {
    // 预加载逻辑已移至动态导入中
  }, []);

  // P3阶段任务定义
  const p3Tasks = [
    {
      id: "i18n",
      title:
        locale === "zh" ? "国际化完善" : "Internationalization Enhancement",
      description:
        locale === "zh"
          ? "完善翻译质量，优化多语言支持"
          : "Improve translation quality and optimize multilingual support",
      icon: Globe,
      color: "blue",
      status: "completed" as const,
      progress: 100,
    },
    {
      id: "performance",
      title: locale === "zh" ? "性能优化" : "Performance Optimization",
      description:
        locale === "zh"
          ? "提升应用性能，优化用户体验"
          : "Improve application performance and user experience",
      icon: Zap,
      color: "yellow",
      status: "completed" as const,
      progress: 100,
    },
    {
      id: "testing",
      title: locale === "zh" ? "测试完善" : "Testing Enhancement",
      description:
        locale === "zh"
          ? "全面的测试覆盖，确保代码质量"
          : "Comprehensive test coverage ensuring code quality",
      icon: TestTube,
      color: "purple",
      status: "completed" as const,
      progress: 100,
    },
    {
      id: "documentation",
      title: locale === "zh" ? "文档完善" : "Documentation Enhancement",
      description:
        locale === "zh"
          ? "完善的文档体系，提升开发效率"
          : "Comprehensive documentation system to improve development efficiency",
      icon: BookOpen,
      color: "indigo",
      status: "completed" as const,
      progress: 100,
    },
  ];

  // 获取任务状态
  const getTaskStatus = (taskId: string) => {
    if (completedTasks.has(taskId)) return "completed";
    if (activeTab === taskId) return "active";
    return "pending";
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "active":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <Target className="w-4 h-4 text-gray-400" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  // 渲染活动组件
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "i18n":
        return <I18nOptimizer locale={locale} />;
      case "performance":
        return (
          <div className="space-y-6">
            <PerformanceOptimizer locale={locale} />
            <PerformanceOptimizationPanel />
          </div>
        );
      case "testing":
        return <TestingFramework />;
      case "documentation":
        return <DocumentationFramework />;
      default:
        return <I18nOptimizer locale={locale} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* 任务概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {p3Tasks.map((task) => {
            const status = getTaskStatus(task.id);
            const Icon = task.icon;

            return (
              <div
                key={task.id}
                onClick={() => setActiveTab(task.id)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                  status === "active" ? "border-blue-500" : "border-transparent"
                } ${getStatusColor(status)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon
                    className={`w-8 h-8 ${
                      status === "completed"
                        ? "text-green-600"
                        : status === "active"
                          ? "text-blue-600"
                          : "text-gray-400"
                    }`}
                  />
                  {getStatusIcon(status)}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {task.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4">{task.description}</p>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      status === "completed"
                        ? "bg-green-500"
                        : status === "active"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {task.progress}% {t("statistics.complete")}
                </p>
              </div>
            );
          })}
        </div>

        {/* 阶段统计 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            {t("statistics.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-sm text-gray-600">
                {t("statistics.optimizationModules")}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {completedTasks.size}
              </div>
              <div className="text-sm text-gray-600">
                {t("statistics.completedTasks")}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {
                  p3Tasks.filter((task) => getTaskStatus(task.id) === "active")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">
                {t("statistics.activeTasks")}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round((completedTasks.size / p3Tasks.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                {t("statistics.overallProgress")}
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {p3Tasks.map((task) => {
                const status = getTaskStatus(task.id);
                const Icon = task.icon;

                return (
                  <button
                    key={task.id}
                    onClick={() => setActiveTab(task.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      status === "active"
                        ? "border-blue-500 text-blue-600"
                        : status === "completed"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{task.title}</span>
                    {status === "completed" && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 活动组件 */}
        <div className="animate-fade-in">{renderActiveComponent()}</div>

        {/* 完成按钮 */}
        <div className="text-center mt-12">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              {t("completion.title")}
            </h3>
            <p className="text-green-700 mb-6">{t("completion.description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
                {t("completion.deployToProduction")}
              </button>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                {t("completion.viewReport")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
