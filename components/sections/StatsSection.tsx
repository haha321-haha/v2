"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface StatsSectionProps {
  stats?: Array<{ value: string; label: string }>;
}

export default function StatsSection({
  stats: propsStats,
}: StatsSectionProps = {}) {
  const t = useTranslations("v2Home");

  // 简化：只显示焦虑相关的消息
  const anxietyMessage = t("stats.anxiety_message");

  return (
    <section
      className="py-20 bg-white/50 dark:bg-slate-800/50 border-y border-purple-100 dark:border-slate-700"
      data-ai-searchable="true"
      data-entity="STATISTICS"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
            data-quotable="true"
          >
            {anxietyMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
