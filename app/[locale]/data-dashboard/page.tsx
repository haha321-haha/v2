import { getTranslations } from "next-intl/server";
import DataDashboardClient from "./data-dashboard-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataDashboard" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("keywords").split(","),

    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function DataDashboardPage() {
  return <DataDashboardClient />;
}
