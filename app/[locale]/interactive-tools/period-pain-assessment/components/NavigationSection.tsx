"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Calculator,
  Stethoscope,
  Heart,
  ArrowRight,
  Clock,
  Users,
  Award,
} from "lucide-react";

interface NavigationSectionProps {
  locale: string;
}

export default function NavigationSection({ locale }: NavigationSectionProps) {
  const t = useTranslations("periodPainAssessmentPage");

  const navigationCards = [
    {
      id: "work-impact-calculator",
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      title: t("navigation.calculator.title"),
      description: t("navigation.calculator.description"),
      features: t.raw("navigation.calculator.features") as string[],
      href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
      primaryCTA: t("navigation.calculator.primaryCTA"),
      secondaryCTA: t("navigation.calculator.secondaryCTA"),
    },
    {
      id: "symptom-assessment",
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      title: t("navigation.assessment.title"),
      description: t("navigation.assessment.description"),
      features: t.raw("navigation.assessment.features") as string[],
      href: `/${locale}/interactive-tools/symptom-assessment`,
      primaryCTA: t("navigation.assessment.primaryCTA"),
      secondaryCTA: t("navigation.assessment.secondaryCTA"),
    },
    {
      id: "relief-resources",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      title: t("navigation.relief.title"),
      description: t("navigation.relief.description"),
      features: t.raw("navigation.relief.features") as string[],
      href: `/${locale}/articles/immediate-relief-for-period-pain`,
      primaryCTA: t("navigation.relief.primaryCTA"),
      secondaryCTA: t("navigation.relief.secondaryCTA"),
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 区域标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("navigation.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("navigation.subtitle")}
          </p>
        </div>

        {/* 导航卡片网格 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {navigationCards.map((card) => (
            <div
              key={card.id}
              className={`relative bg-white rounded-xl shadow-lg border-2 ${card.borderColor} p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
            >
              {/* 卡片头部 */}
              <div
                className={`flex items-center justify-center w-16 h-16 ${card.bgColor} rounded-full mb-6 group-hover:scale-110 transition-transform`}
              >
                <card.icon className={`w-8 h-8 ${card.color}`} />
              </div>

              {/* 卡片内容 */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {card.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {card.description}
              </p>

              {/* 功能列表 */}
              <ul className="space-y-3 mb-8">
                {card.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div
                      className={`w-5 h-5 ${card.color} rounded-full flex-shrink-0 mr-3 mt-0.5`}
                    >
                      <div className="w-full h-full rounded-full bg-current opacity-20"></div>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA按钮 */}
              <div className="flex flex-col space-y-3">
                <Link
                  href={card.href}
                  className={`inline-flex items-center justify-center ${card.color.replace(
                    "text",
                    "bg",
                  )} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-opacity`}
                >
                  {card.primaryCTA}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href={card.href}
                  className={`inline-flex items-center justify-center ${card.color} font-medium py-2 px-4 rounded-lg border border-current hover:bg-current hover:bg-opacity-10 transition-all`}
                >
                  {card.secondaryCTA}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 信任元素 */}
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("trust.usersHelped")}
              </h3>
              <p className="text-gray-600">{t("trust.usersHelpedDesc")}</p>
            </div>

            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("trust.averageTime")}
              </h3>
              <p className="text-gray-600">{t("trust.averageTimeDesc")}</p>
            </div>

            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("trust.expertContent")}
              </h3>
              <p className="text-gray-600">{t("trust.expertContentDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
