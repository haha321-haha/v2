import PricingPageClient from "./PricingPageClient";

interface PricingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PricingPage({ params }: PricingPageProps) {
  // 服务器组件接收 params Promise，但不需要使用它
  // 客户端组件会通过 useLocale() 自动获取 locale
  await params; // 确保 params 被解析（避免警告）

  return <PricingPageClient />;
}
