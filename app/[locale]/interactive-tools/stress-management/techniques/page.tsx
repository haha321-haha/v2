import { redirect } from "next/navigation";
import { Locale, locales } from "@/i18n";

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 不生成 metadata，因为这是重定向页面
export const dynamic = "force-dynamic";

export default async function TechniquesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // 重定向到主页面（Techniques内容已整合到主页面）
  redirect(`/${locale}/interactive-tools/stress-management`);
}
