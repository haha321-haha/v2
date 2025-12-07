import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "payment.success" });

  return {
    title: t("title") + " | PeriodHub",
    description: t("message"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}






