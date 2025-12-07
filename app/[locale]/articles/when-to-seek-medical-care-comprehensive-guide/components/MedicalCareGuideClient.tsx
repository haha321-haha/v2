"use client";

import dynamic from "next/dynamic";
import LoadingSystem from "../../../interactive-tools/shared/components/LoadingSystem";

// 客户端动态导入组件 - 解决 Next.js 15 的 SSR 限制
export const PainAssessmentToolClient = dynamic(
  () => import("./PainAssessmentTool"),
  {
    loading: () => <LoadingSystem.LoadingSpinner size="lg" />,
    ssr: false,
  },
);

export const SymptomChecklistClient = dynamic(
  () => import("./SymptomChecklist"),
  {
    loading: () => <LoadingSystem.LoadingSpinner size="lg" />,
    ssr: false,
  },
);

export const DecisionTreeClient = dynamic(() => import("./DecisionTree"), {
  loading: () => <LoadingSystem.LoadingSpinner size="lg" />,
  ssr: false,
});

export const ComparisonTableClient = dynamic(
  () => import("./ComparisonTable"),
  {
    loading: () => <LoadingSystem.LoadingSpinner size="lg" />,
    ssr: false,
  },
);
