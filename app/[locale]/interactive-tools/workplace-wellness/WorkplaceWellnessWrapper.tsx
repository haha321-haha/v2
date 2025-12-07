"use client";

import dynamic from "next/dynamic";

// 客户端包装组件，用于禁用 SSR
const WorkplaceWellnessClient = dynamic(
  () => import("./WorkplaceWellnessClient"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ),
  },
);

interface WorkplaceWellnessWrapperProps {
  locale: string;
}

export default function WorkplaceWellnessWrapper({
  locale,
}: WorkplaceWellnessWrapperProps) {
  return <WorkplaceWellnessClient locale={locale} />;
}
