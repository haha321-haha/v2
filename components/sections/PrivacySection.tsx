"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function PrivacySection() {
  const t = useTranslations("privacySection");

  return (
    <section
      id="privacy"
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800/50"
      data-ai-searchable="true"
      data-entity="PRIVACY_POLICY"
      data-quotable="true"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong className="font-semibold text-gray-900 dark:text-white">
            {t("disclaimer.title")}:
          </strong>{" "}
          {t("disclaimer.paragraph1")} {t("disclaimer.paragraph2")}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
          {t("disclaimer.dataPrivacyTitle")}: {t("disclaimer.dataPrivacyText")}
        </p>
      </div>
    </section>
  );
}
