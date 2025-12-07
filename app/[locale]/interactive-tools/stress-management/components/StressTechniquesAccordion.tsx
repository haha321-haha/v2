"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface StressTechniquesAccordionProps {
  locale: string;
}

interface Technique {
  key: "breathing" | "meditation" | "exercise" | "music";
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradientColor: string;
}

export default function StressTechniquesAccordion({
  locale,
}: StressTechniquesAccordionProps) {
  const t = useTranslations("interactiveTools.stressManagement.techniques");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // 默认展开第一个

  const techniques: Technique[] = [
    {
      key: "breathing",
      icon: "💨",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      gradientColor: "from-blue-500 to-blue-600",
    },
    {
      key: "meditation",
      icon: "🧘",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      gradientColor: "from-purple-500 to-purple-600",
    },
    {
      key: "exercise",
      icon: "🏃",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      gradientColor: "from-green-500 to-green-600",
    },
    {
      key: "music",
      icon: "🎵",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      gradientColor: "from-pink-500 to-pink-600",
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getStartLink = (techniqueKey: string) => {
    const links: Record<string, string> = {
      breathing: `/${locale}/interactive-tools/stress-management/breathing-exercise`,
      meditation: `/${locale}/interactive-tools/stress-management/meditation-timer`,
      exercise: `/${locale}/articles/zhan-zhuang-baduanjin-for-menstrual-pain-relief`,
      music: `/${locale}/interactive-tools/stress-management/music-player`,
    };
    return (
      links[techniqueKey] || `/${locale}/interactive-tools/stress-management`
    );
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {techniques.map((technique, index) => {
            const isExpanded = expandedIndex === index;
            const title = t(`${technique.key}.title`);
            const description = t(`${technique.key}.description`);
            const instructionsTitle = t(`${technique.key}.instructions`);
            const instructionsDetail = t(`${technique.key}.instructionsDetail`);
            const startText = t(`${technique.key}.start`);
            const benefitsTitle = t("benefits.title");

            return (
              <div
                key={technique.key}
                className={`${technique.bgColor} ${
                  technique.borderColor
                } border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? "shadow-lg" : "shadow-sm"
                }`}
              >
                {/* 手风琴头部 - 可点击 */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
                  aria-expanded={isExpanded}
                  aria-controls={`technique-${technique.key}-content`}
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${technique.gradientColor} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <span
                        className="text-3xl"
                        role="img"
                        aria-label={
                          t(`${technique.key}.iconLabel`) || `${title} icon`
                        }
                      >
                        {technique.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 ${
                      technique.color
                    } transition-transform duration-300 flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* 手风琴内容 - 可折叠 */}
                <div
                  id={`technique-${technique.key}-content`}
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 space-y-6">
                    {/* 益处 */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {benefitsTitle}
                      </h4>
                      <ul className="space-y-2">
                        {[1, 2, 3].map((benefitIndex) => {
                          const benefitText = t(
                            `${technique.key}.benefits.benefit${benefitIndex}`,
                          );

                          return (
                            <li
                              key={benefitIndex}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <div
                                className={`w-2 h-2 ${technique.color} rounded-full mt-2 flex-shrink-0`}
                              ></div>
                              <span>{benefitText}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* 练习说明 */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {instructionsTitle}
                      </h4>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {instructionsDetail}
                        </p>
                      </div>
                    </div>

                    {/* 开始按钮 */}
                    <div className="pt-2">
                      <Link
                        href={getStartLink(technique.key)}
                        className={`bg-gradient-to-r ${technique.gradientColor} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2`}
                      >
                        <span>{startText}</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
