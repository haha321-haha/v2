/**
 * 优化的状态管理Hook
 * 提供防抖、节流、批量更新等优化功能
 */

import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { usePartnerHandbookStore } from "../stores/partnerHandbookStore";
import {
  stateOptimizer,
  selectorOptimizer,
  renderOptimizer,
  performanceMonitor,
} from "../utils/performanceOptimizer";
import type { PartnerHandbookState } from "../stores/partnerHandbookStore";
import type { QuizAnswer, QuizResult } from "../types/quiz";
import { logWarn } from "@/lib/debug-logger";

// 优化的状态选择器Hook
export const useOptimizedSelector = <T>(
  selector: (state: PartnerHandbookState) => T,
  key: string,
): T => {
  // 创建优化的选择器
  const optimizedSelector = useMemo(() => {
    return selectorOptimizer.createOptimizedSelector(selector, key);
  }, [selector, key]);

  // 使用Zustand的选择器模式
  return usePartnerHandbookStore(optimizedSelector);
};

// 防抖状态更新Hook
export const useDebouncedState = <T>(initialValue: T, delay: number = 300) => {
  const [value, setValue] = React.useState(initialValue);
  const debouncedSetValue = useMemo(() => {
    return stateOptimizer.debouncedUpdate(setValue, delay);
  }, [delay]);

  return [value, debouncedSetValue] as const;
};

// 节流状态更新Hook
export const useThrottledState = <T>(initialValue: T, limit: number = 100) => {
  const [value, setValue] = React.useState(initialValue);
  const throttledSetValue = useMemo(() => {
    return stateOptimizer.throttledUpdate(setValue, limit);
  }, [limit]);

  return [value, throttledSetValue] as const;
};

// 批量状态更新Hook
export const useBatchUpdate = () => {
  // 注意：Zustand store不支持直接的setState调用
  // 这里返回一个简化的实现，实际使用时需要调用具体的action方法
  const batchUpdate = useCallback((updates: Record<string, unknown>) => {
    logWarn(
      "Batch update not implemented for Zustand store",
      { updates },
      "useOptimizedState/useBatchUpdate",
    );
  }, []);

  const addToBatch = useCallback(
    (key: string, value: unknown) => {
      stateOptimizer.batchUpdate(key, value, batchUpdate);
    },
    [batchUpdate],
  );

  return { addToBatch, batchUpdate };
};

// 性能监控Hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const updateCount = useRef<number>(0);

  // 记录渲染开始时间
  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  // 记录渲染结束时间
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    performanceMonitor.recordMetric(`${componentName}_render_time`, renderTime);
    updateCount.current++;
  });

  // 记录更新次数
  useEffect(() => {
    performanceMonitor.recordMetric(
      `${componentName}_update_count`,
      updateCount.current,
    );
  });

  // 获取性能统计
  const getStats = useCallback(() => {
    return {
      renderTime: performanceMonitor.getStats(`${componentName}_render_time`),
      updateCount: performanceMonitor.getStats(`${componentName}_update_count`),
    };
  }, [componentName]);

  return { getStats };
};

// 优化的阶段状态Hook
export const useOptimizedStageState = (stage: "stage1" | "stage2") => {
  // 使用优化的选择器
  const stageProgress = useOptimizedSelector(
    (state) => state.stageProgress[stage],
    `stage_${stage}_progress`,
  );

  const currentStage = useOptimizedSelector(
    (state) => state.currentStage,
    "current_stage",
  );

  const overallResult = useOptimizedSelector(
    (state) => state.overallResult,
    "overall_result",
  );

  // 优化的状态更新函数
  const updateStageProgress = useCallback(
    (updates: Partial<PartnerHandbookState>) => {
      // 注意：这里需要调用具体的store action方法，而不是直接使用setState
      logWarn(
        "updateStageProgress not implemented for Zustand store",
        { updates },
        "useOptimizedState/useOptimizedStageState",
      );
    },
    [],
  );

  return {
    stageProgress,
    currentStage,
    overallResult,
    updateStageProgress,
    isCurrentStage: currentStage === stage,
  };
};

// 优化的测试状态Hook
export const useOptimizedQuizState = () => {
  const store = usePartnerHandbookStore();

  // 使用优化的选择器
  const stageProgress = useOptimizedSelector(
    (state) => state.stageProgress,
    "stage_progress",
  );

  const currentStage = useOptimizedSelector(
    (state) => state.currentStage,
    "current_stage",
  );

  const overallResult = useOptimizedSelector(
    (state) => state.overallResult,
    "overall_result",
  );

  // 优化的状态更新函数
  const startStage = useCallback(
    (stage: "stage1" | "stage2") => {
      const startTime = performance.now();

      // 直接调用store的action方法
      store.startStage(stage);

      const endTime = performance.now();
      performanceMonitor.recordMetric("start_stage_time", endTime - startTime);
    },
    [store],
  );

  const completeStage = useCallback(
    (stage: "stage1" | "stage2", result: QuizResult) => {
      const startTime = performance.now();

      store.completeStage(stage, result);

      const endTime = performance.now();
      performanceMonitor.recordMetric(
        "complete_stage_time",
        endTime - startTime,
      );
    },
    [store],
  );

  const setStageAnswer = useCallback(
    (stage: "stage1" | "stage2", index: number, answer: QuizAnswer) => {
      const startTime = performance.now();

      store.setStageAnswer(stage, index, answer);

      const endTime = performance.now();
      performanceMonitor.recordMetric(
        "set_stage_answer_time",
        endTime - startTime,
      );
    },
    [store],
  );

  return {
    stageProgress,
    currentStage,
    overallResult,
    startStage,
    completeStage,
    setStageAnswer,
  };
};

// 优化的用户偏好Hook
export const useOptimizedUserPreferences = () => {
  const store = usePartnerHandbookStore();

  // 使用优化的选择器
  const preferences = useOptimizedSelector(
    (state) => state.userPreferences,
    "user_preferences",
  );

  // 优化的偏好更新函数
  const updatePreferences = useCallback(
    (updates: Partial<PartnerHandbookState["userPreferences"]>) => {
      // 注意：这里需要调用具体的store action方法，而不是直接使用setState
      store.updatePreferences(updates);
    },
    [store],
  );

  return {
    preferences,
    updatePreferences,
  };
};

// 优化的训练状态Hook
export const useOptimizedTrainingState = () => {
  const store = usePartnerHandbookStore();

  // 使用优化的选择器
  const trainingProgress = useOptimizedSelector(
    (state) => state.trainingProgress,
    "training_progress",
  );

  const completedDays = useOptimizedSelector(
    (state) => state.completedDays,
    "completed_days",
  );

  const currentDay = useOptimizedSelector(
    (state) => state.currentDay,
    "current_day",
  );

  const sessions = useOptimizedSelector(
    (state) => state.trainingSessions,
    "training_sessions",
  );

  // 优化的训练状态更新函数
  const completeTraining = useCallback(
    (day: string) => {
      const startTime = performance.now();

      store.completeTraining(day);

      const endTime = performance.now();
      performanceMonitor.recordMetric(
        "complete_training_time",
        endTime - startTime,
      );
    },
    [store],
  );

  return {
    trainingProgress,
    completedDays,
    currentDay,
    sessions,
    completeTraining,
  };
};

// 渲染优化Hook
export const useRenderOptimization = (componentId: string) => {
  const renderCount = useRef(0);

  // 记录渲染次数
  useEffect(() => {
    renderCount.current++;
    performanceMonitor.recordMetric(
      `${componentId}_render_count`,
      renderCount.current,
    );
  });

  // 优化的渲染函数
  const optimizedRender = useCallback(
    (renderFn: () => void) => {
      renderOptimizer.batchRender(componentId, renderFn);
    },
    [componentId],
  );

  // 防抖渲染函数
  const debouncedRender = useCallback(
    (renderFn: () => void, wait: number = 100) => {
      renderOptimizer.debouncedRender(componentId, renderFn, wait);
    },
    [componentId],
  );

  // 节流渲染函数
  const throttledRender = useCallback(
    (renderFn: () => void, limit: number = 100) => {
      renderOptimizer.throttledRender(componentId, renderFn, limit);
    },
    [componentId],
  );

  return {
    renderCount: renderCount.current,
    optimizedRender,
    debouncedRender,
    throttledRender,
  };
};
