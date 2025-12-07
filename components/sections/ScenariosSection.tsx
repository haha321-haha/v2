"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { markMedicalTermsInText } from "@/lib/seo/medical-terminology";

interface ScenariosSectionProps {
  scenarios?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    badge?: string;
    href?: string;
  }>;
}

export default function ScenariosSection({
  scenarios: propsScenarios,
}: ScenariosSectionProps = {}) {
  const t = useTranslations("v2Home");
  const locale = useLocale();

  // Use props scenarios if provided, otherwise get from translations
  const allScenarios = propsScenarios || [];

  // Separate zones and cards based on id pattern
  const zones = allScenarios
    .filter((s) => s.id.includes("zone"))
    .map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon || (s.id === "teen-zone" ? "🌸" : "💕"),
      badge: s.badge || (s.id === "teen-zone" ? "NEW" : "HOT"),
      href:
        s.href ||
        `/${locale}/scenario-solutions${
          s.id === "teen-zone" ? "/lifeStages" : ""
        }`,
    }));

  const cards = allScenarios
    .filter((s) => !s.id.includes("zone"))
    .map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon || "🏢",
      href: s.href || `/${locale}/scenario-solutions`,
    }));

  // Fallback to translations if no props provided
  const defaultZones =
    zones.length === 0
      ? [
          {
            id: "teen-zone",
            title: t("scenarios.teen-zone.title"),
            description: t("scenarios.teen-zone.description"),
            icon: "🌸",
            badge: "NEW",
            href: `/${locale}/scenario-solutions/lifeStages`,
          },
          {
            id: "partner-zone",
            title: t("scenarios.partner-zone.title"),
            description: t("scenarios.partner-zone.description"),
            icon: "💕",
            badge: "HOT",
            href: `/${locale}/scenario-solutions`,
          },
        ]
      : zones;

  const defaultCards =
    cards.length === 0
      ? [
          {
            id: "office",
            title: t("scenarios.office.title"),
            description: t("scenarios.office.description"),
            icon: "🏢",
            href: `/${locale}/scenario-solutions`,
          },
          {
            id: "commute",
            title: t("scenarios.commute.title"),
            description: t("scenarios.commute.description"),
            icon: "🚇",
            href: `/${locale}/scenario-solutions`,
          },
          {
            id: "exercise",
            title: t("scenarios.exercise.title"),
            description: t("scenarios.exercise.description"),
            icon: "🏃‍♀️",
            href: `/${locale}/scenario-solutions`,
          },
          {
            id: "sleep",
            title: t("scenarios.sleep.title"),
            description: t("scenarios.sleep.description"),
            icon: "😴",
            href: `/${locale}/scenario-solutions`,
          },
        ]
      : cards;

  const localeTyped = locale as "en" | "zh";
  const scenariosDesc = t("sections.scenarios_desc");
  const markedDescription = markMedicalTermsInText(scenariosDesc, localeTyped);

  return (
    <section
      id="scenarios"
      className="py-20 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-800/50 dark:to-slate-900"
      data-ai-searchable="true"
      data-entity="DYSMENORRHEA"
      data-quotable="true"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            {t("sections.scenarios_title")}
          </h2>
          <p
            className="text-gray-600 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: markedDescription }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {defaultZones.map((zone) => (
            <Link
              key={zone.id}
              href={zone.href}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div
                className="text-5xl sm:text-6xl bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-4"
                aria-hidden="true"
              >
                <span role="img" aria-label={zone.title}>
                  {zone.icon}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold dark:text-white">
                    {zone.title}
                  </h3>
                  {zone.badge && (
                    <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {zone.badge}
                    </span>
                  )}
                </div>
                <p
                  className="text-gray-600 dark:text-gray-400 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: markMedicalTermsInText(
                      zone.description,
                      localeTyped,
                    ),
                  }}
                />
                <span className="text-pink-500 dark:text-pink-400 font-bold text-sm hover:underline">
                  {t("sections.enter_zone")} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {defaultCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className="text-3xl mb-3" aria-hidden="true">
                <span role="img" aria-label={card.title}>
                  {card.icon}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {card.title}
              </h4>
              <p
                className="text-xs text-gray-500 dark:text-gray-400"
                dangerouslySetInnerHTML={{
                  __html: markMedicalTermsInText(card.description, localeTyped),
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
