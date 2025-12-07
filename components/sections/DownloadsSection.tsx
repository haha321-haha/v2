"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { markMedicalTermsInText } from "@/lib/seo/medical-terminology";

export default function DownloadsSection() {
  const t = useTranslations("v2Home");
  const locale = useLocale();
  const localeTyped = locale as "en" | "zh";

  const downloadsDesc = t("sections.downloads_desc");
  const markedDescription = markMedicalTermsInText(downloadsDesc, localeTyped);

  return (
    <section
      id="downloads"
      className="py-20 bg-white dark:bg-slate-900"
      data-ai-searchable="true"
      data-entity="DYSMENORRHEA"
      data-quotable="true"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            {t("sections.downloads_title")}
          </h2>
          <p
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: markedDescription }}
          />
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>{t("sections.downloads_coming_soon")}</p>
        </div>
      </div>
    </section>
  );
}
