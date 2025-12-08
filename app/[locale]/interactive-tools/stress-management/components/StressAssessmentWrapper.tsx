"use client";

import dynamic from "next/dynamic";

// 动态导入 StressAssessmentWidget，禁用 SSR，避免服务端创建 store
// 必须在客户端组件中使用 ssr: false（Next.js 15 要求）
const StressAssessmentWidget = dynamic(
  () => import("@/components/StressAssessmentWidget"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
);

export default function StressAssessmentWrapper() {
  return <StressAssessmentWidget />;
}


