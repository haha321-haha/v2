"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { logError, logWarn } from "@/lib/debug-logger";
import StorageWarningToast from "./components/StorageWarningToast";
import DebugPanel from "./components/DebugPanel";
import { SimpleToastProvider } from "./components/SimpleToast";
import type { WorkplaceWellnessState } from "./types";

// 动态导入组件以优化性能
const WorkplaceWellnessHeader = dynamic(() => import("./components/Header"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const Navigation = dynamic(() => import("./components/Navigation"), {
  ssr: false, // 禁用 SSR，避免 store 在服务器端执行
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />,
});

const CalendarComponent = dynamic(
  () => import("./components/CalendarComponent"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const NutritionComponent = dynamic(
  () => import("./components/NutritionComponent"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const WorkImpactComponent = dynamic(
  () => import("./components/WorkImpactComponent"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const FocusCalmTab = dynamic(
  () => import("./components/FocusCalmTab").then((mod) => mod.default),
  {
    loading: () => <div className="h-96 bg-gray-50 rounded-xl animate-pulse" />,
    ssr: false,
  },
);

const BodyBatterySection = dynamic(
  () => import("./components/BodyBatterySection"),
  {
    loading: () => <div className="h-96 bg-gray-50 rounded-xl animate-pulse" />,
    ssr: false,
  },
);

const DataVisualizationDashboard = dynamic(
  () => import("./components/DataVisualizationDashboard"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const AdvancedCycleAnalysis = dynamic(
  () => import("./components/AdvancedCycleAnalysis"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const CycleStatisticsChart = dynamic(
  () => import("./components/CycleStatisticsChart"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const HistoryDataViewer = dynamic(
  () => import("./components/HistoryDataViewer"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const DataExportComponent = dynamic(
  () => import("./components/DataExportComponent"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const UserPreferencesSettings = dynamic(
  () => import("./components/UserPreferencesSettings"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

// Footer is now provided by the global layout, no need for local Footer

const DataRetentionWarning = dynamic(
  () => import("./components/DataRetentionWarning"),
  {
    loading: () => null,
  },
);

const ResponsiveContainer = dynamic(
  () => import("./components/ResponsiveContainer"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-8 rounded" />,
});

// 个性化推荐组件 - 使用智能推荐系统
const PersonalizedRecommendations = dynamic(
  () => import("./components/PersonalizedRecommendations"),
  {
    ssr: false, // 禁用 SSR，避免 store 在服务器端执行
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

// 测试组件 - 用于调试存储问题
const TestStore = dynamic(() => import("./test-store"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

// 简单存储测试组件
const SimpleStorageTest = dynamic(() => import("./simple-storage-test"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

// 简单Zustand测试组件
const SimpleZustandTest = dynamic(() => import("./simple-zustand-test"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const EmotionForecastNotification = dynamic(
  () => import("./components/EmotionForecastNotification"),
  {
    loading: () => (
      <div className="animate-pulse bg-indigo-50 h-32 rounded-xl mb-6" />
    ),
    ssr: false,
  },
);

interface WorkplaceWellnessClientProps {
  locale?: string;
}

type WorkplaceStoreModule = typeof import("./hooks/useWorkplaceWellnessStore");
type WorkplaceStoreState = WorkplaceWellnessState;

export default function WorkplaceWellnessClient({
  locale: propLocale,
}: WorkplaceWellnessClientProps = {}) {
  const breadcrumbT = useTranslations("interactiveTools.breadcrumb");
  const hookLocale = useLocale();
  const locale = propLocale || hookLocale;

  return (
    <SimpleToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* 存储警告提示 */}
        <StorageWarningToast />

        {/* 调试面板 - 仅开发环境 */}
        <DebugPanel />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 面包屑导航 */}
          <Breadcrumb
            items={[
              {
                label: breadcrumbT("interactiveTools"),
                href: `/${locale}/interactive-tools`,
              },
              { label: breadcrumbT("workplaceWellness") },
            ]}
          />

          {/* 头部组件 */}
          <WorkplaceWellnessHeader />

          {/* 导航组件 - 使用 dynamic ssr: false 已足够，无需 NoSSR */}
          <Navigation />

          {/* 主要内容 - 使用 dynamic ssr: false 已足够，无需 NoSSR */}
          <WorkplaceWellnessContent />
        </div>
      </div>
    </SimpleToastProvider>
  );
}

/**
 * WorkplaceWellnessContent - 包含所有使用store的组件
 * 这个组件只在客户端渲染，避免了SSR和客户端状态不一致的问题
 */
function WorkplaceWellnessContent() {
  const [storeModule, setStoreModule] = useState<WorkplaceStoreModule | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [previousTab, setPreviousTab] = useState<string>("calendar");
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("calendar");

  useEffect(() => {
    let isActive = true;

    import("./hooks/useWorkplaceWellnessStore").then((module) => {
      if (!isActive) return;
      const { useWorkplaceWellnessStore } = module;
      setStoreModule(module);

      type ZustandStore = typeof useWorkplaceWellnessStore & {
        subscribe: (
          listener: (state: WorkplaceStoreState) => void,
        ) => () => void;
        getState: () => WorkplaceStoreState;
        persist?: { rehydrate?: () => void };
      };

      const store = useWorkplaceWellnessStore as unknown as ZustandStore;

      const waitForRehydrate = () =>
        new Promise<void>((resolve, reject) => {
          type RehydrateEvent = CustomEvent<{ message?: string }>;

          const handleComplete = () => {
            window.removeEventListener(
              "store-rehydrate-complete",
              handleComplete as EventListener,
            );
            window.removeEventListener(
              "store-rehydrate-error",
              handleError as EventListener,
            );
            resolve();
          };

          const handleError = (event: RehydrateEvent) => {
            window.removeEventListener(
              "store-rehydrate-complete",
              handleComplete as EventListener,
            );
            window.removeEventListener(
              "store-rehydrate-error",
              handleError as EventListener,
            );
            reject(event.detail);
          };

          window.addEventListener(
            "store-rehydrate-complete",
            handleComplete as EventListener,
          );
          window.addEventListener(
            "store-rehydrate-error",
            handleError as EventListener,
          );

          if (store.persist && store.persist.rehydrate) {
            store.persist.rehydrate();
          } else {
            resolve();
          }

          setTimeout(() => {
            window.removeEventListener(
              "store-rehydrate-complete",
              handleComplete as EventListener,
            );
            window.removeEventListener(
              "store-rehydrate-error",
              handleError as EventListener,
            );
            resolve();
            logWarn(
              "Rehydrate 等待超时，继续执行",
              undefined,
              "WorkplaceWellnessClient",
            );
          }, 2000);
        });

      const unsubscribe = store.subscribe((state: WorkplaceStoreState) => {
        setActiveTab(state.activeTab);
      });

      waitForRehydrate()
        .then(() => {
          const storeInstance = store.getState();
          setPreviousTab(storeInstance.activeTab);
          setActiveTab(storeInstance.activeTab);
          setIsHydrated(true);
        })
        .catch((error) => {
          logError(
            "Rehydrate 失败",
            (error as Error) ?? undefined,
            "WorkplaceWellnessClient",
          );
          const storeInstance = store.getState();
          setPreviousTab(storeInstance.activeTab);
          setActiveTab(storeInstance.activeTab);
          setIsHydrated(true);
        });

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => {
        unsubscribe();
        clearTimeout(timer);
      };
    });

    return () => {
      isActive = false;
    };
  }, []);

  // 标签页切换动画
  useEffect(() => {
    if (!isHydrated) return;

    if (previousTab !== activeTab) {
      const timer = setTimeout(() => {
        setPreviousTab(activeTab);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [activeTab, previousTab, isHydrated]);

  // 渲染标签页内容
  const renderTabContent = () => {
    if (!isHydrated) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (!storeModule) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "calendar":
        return (
          <div className="space-y-6">
            <CalendarComponent />
            <CycleStatisticsChart />
            <HistoryDataViewer />
          </div>
        );
      case "focus-calm":
        return <FocusCalmTab />;
      case "nutrition":
        return <NutritionComponent />;
      case "energy":
        return (
          <BodyBatterySection onClose={() => {}} currentPhase="menstrual" />
        );
      case "work-impact":
        return <WorkImpactComponent />;
      case "analysis":
        return (
          <div className="space-y-6">
            <DataVisualizationDashboard />
            <AdvancedCycleAnalysis />
          </div>
        );
      case "export":
        return <DataExportComponent />;
      case "settings":
        return <UserPreferencesSettings />;
      case "test-store":
        return <TestStore />;
      case "simple-storage-test":
        return <SimpleStorageTest />;
      case "simple-zustand-test":
        return <SimpleZustandTest />;
      default:
        return (
          <div className="space-y-6">
            <CalendarComponent />
            <CycleStatisticsChart />
          </div>
        );
    }
  };

  return (
    <ResponsiveContainer>
      {/* 数据保留提醒 */}
      <DataRetentionWarning />

      {/* Emotion Forecast Notification (Phase 4) */}
      {isHydrated && <EmotionForecastNotification />}

      {/* 标签页内容 */}
      <div className="relative min-h-[500px] mt-6">
        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* 淡入淡出动画 */}
        <div
          className={`transition-opacity duration-300 ${
            previousTab === activeTab ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: previousTab === activeTab ? "auto" : "none" }}
        >
          {renderTabContent()}
        </div>
      </div>

      {/* 个性化推荐 - 使用智能推荐系统 */}
      <div className="mt-12">
        <PersonalizedRecommendations />
      </div>
    </ResponsiveContainer>
  );
}
