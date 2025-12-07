import PeriodPainCalculatorClient from "./period-pain-calculator-client";

// 注意：页面元数据由 layout.tsx 中的 generateMetadata 生成，使用翻译系统避免硬编码

export default async function PeriodPainImpactCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <PeriodPainCalculatorClient params={{ locale }} />;
}
