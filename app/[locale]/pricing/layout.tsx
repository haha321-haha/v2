import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const description =
    t("description") ||
    "Choose the right plan for your period health management needs";

  return {
    title: t("title") + " | PeriodHub",
    description: description,
    alternates: {
      canonical: `${baseUrl}/${locale}/pricing`,
      languages: {
        zh: `${baseUrl}/zh/pricing`,
        en: `${baseUrl}/en/pricing`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
