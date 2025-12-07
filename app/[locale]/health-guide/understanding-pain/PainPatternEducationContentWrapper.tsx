"use client";

import dynamic from "next/dynamic";

// 动态导入客户端组件
const PainPatternEducationContent = dynamic(
  () => import("@/components/PainPatternEducationContent"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

export default function PainPatternEducationContentWrapper() {
  return <PainPatternEducationContent />;
}
