"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

export default function ToolsSection() {
  const t = useTranslations("toolsSection");
  const locale = useLocale();

  const tools = [
    {
      id: "pain-tracker",
      title: t("tools.painTracker.title"),
      description: t("tools.painTracker.description"),
      icon: "📊",
      badge: "PRO",
      href: `/${locale}/interactive-tools/symptom-assessment`,
    },
    {
      id: "cycle-tracker",
      title: t("tools.cycleTracker.title"),
      description: t("tools.cycleTracker.description"),
      icon: "📅",
      badge: "NEW",
      href: `/${locale}/interactive-tools/cycle-tracker`,
    },
    {
      id: "workplace",
      title: t("tools.workplace.title"),
      description: t("tools.workplace.description"),
      icon: "💼",
      badge: "HOT",
      href: `/${locale}/interactive-tools`,
    },
  ];

  return (
    <section
      id="tools"
      className="py-20 bg-transparent"
      data-ai-searchable="true"
      data-entity="INTERACTIVE_TOOLS"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            {t("title")}
          </h2>
          <p
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            data-quotable="true"
          >
            {t("description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-transparent hover:border-purple-100 dark:hover:border-purple-900 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

              <div className="flex justify-between items-start mb-6">
                <div
                  className="text-4xl bg-purple-50 dark:bg-slate-700 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:rotate-6 transition-transform"
                  aria-hidden="true"
                >
                  <span role="img" aria-label={tool.title + " icon"}>
                    {tool.icon}
                  </span>
                </div>
                {tool.badge && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
                      tool.badge === "PRO"
                        ? "bg-purple-600"
                        : tool.badge === "NEW"
                          ? "bg-green-500"
                          : "bg-pink-500"
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {tool.description}
              </p>

              <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                {t("startTool")}{" "}
                <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}/interactive-tools`}
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1"
          >
            {t("viewAll")}{" "}
            <ArrowRight size={16} className="ml-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
