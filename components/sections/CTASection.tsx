"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function CTASection() {
  const t = useTranslations("ctaSection");
  const locale = useLocale();

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8"
      data-ai-searchable="true"
      data-entity="CALL_TO_ACTION"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            {t("title")}
          </h2>
          <p
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
            data-quotable="true"
          >
            {t("description")}
          </p>
          <Link
            href={`/${locale}/interactive-tools/symptom-assessment`}
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-5 rounded-full font-semibold text-xl hover:shadow-2xl transform hover:scale-105 transition"
          >
            {t("ctaPrimary")}
          </Link>
          <p className="mt-4 text-sm text-gray-500">{t("noCreditCard")}</p>
        </div>
      </div>
    </section>
  );
}
