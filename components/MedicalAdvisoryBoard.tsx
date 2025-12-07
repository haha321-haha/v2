/**
 * Medical Advisory Board Component
 * 医学顾问委员会组件
 *
 * 显示医学顾问信息，建立医学权威性
 */

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { GraduationCap, Award, Building2 } from "lucide-react";

interface MedicalAdvisor {
  name: string;
  title: string;
  credentials: string[];
  organization: string;
  specialty?: string;
}

export default function MedicalAdvisoryBoard() {
  const t = useTranslations("medicalAdvisoryBoard");

  // 医学顾问信息（可以从翻译文件或配置中获取）
  const advisors: MedicalAdvisor[] = [
    {
      name: t("advisors.advisor1.name"),
      title: t("advisors.advisor1.title"),
      credentials: ["MD", "OB-GYN"],
      organization: t("advisors.advisor1.organization"),
      specialty: t("advisors.advisor1.specialty"),
    },
    {
      name: t("advisors.advisor2.name"),
      title: t("advisors.advisor2.title"),
      credentials: ["MD", "PhD"],
      organization: t("advisors.advisor2.organization"),
      specialty: t("advisors.advisor2.specialty"),
    },
  ];

  return (
    <section
      className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900"
      data-ai-searchable="true"
      data-entity="MEDICAL_AUTHORITY"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {advisors.map((advisor, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {advisor.name}
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">
                    {advisor.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {advisor.credentials.map((cred, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/20 text-xs font-medium text-purple-700 dark:text-purple-300"
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>{advisor.organization}</span>
                  </div>
                  {advisor.specialty && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      {advisor.specialty}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}






