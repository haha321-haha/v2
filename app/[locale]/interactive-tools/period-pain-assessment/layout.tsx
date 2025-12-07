interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// 简单布局包装：主要用于与其他工具页面保持结构一致
export default async function PeriodPainAssessmentLayout({
  children,
}: LayoutProps) {
  return children;
}
