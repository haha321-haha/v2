import {
  getTranslations,
  unstable_setRequestLocale as setRequestLocale,
} from "next-intl/server";
import type { Metadata } from "next";
import { DataManagement } from "@/components/DataManagement";
import Breadcrumb from "@/components/Breadcrumb";
import { locales } from "@/i18n";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataManagement" });

  return {
    title: t("metadata.title", { default: "Data Management - Period Hub" }),
    description: t("metadata.description", {
      default:
        "Manage your locally stored health data. Export or clear all your data with complete privacy control.",
    }),
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/settings/data-management`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/settings/data-management`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/settings/data-management`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/settings/data-management`,
      },
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DataManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "dataManagement" });
  const commonT = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: t("breadcrumb.settings", { default: "Settings" }),
            href: `/${locale}/settings`,
          },
          {
            label: t("breadcrumb.dataManagement", {
              default: "Data Management",
            }),
            href: `/${locale}/settings/data-management`,
          },
        ]}
      />

      {/* Page Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          {t("pageTitle", { default: "Data Management" })}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t("pageDescription", {
            default:
              "Your health data is stored locally on your device. Export or clear your data at any time.",
          })}
        </p>
      </header>

      {/* Data Management Component */}
      <DataManagement />
    </div>
  );
}






