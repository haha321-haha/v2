"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePartnerHandbookStore } from "../stores/partnerHandbookStore";
import { Locale } from "../types/common";

interface LanguageSwitcherProps {
  className?: string;
  showLabels?: boolean;
  variant?: "compact" | "full";
}

export default function LanguageSwitcher({
  className = "",
  showLabels = true,
  variant = "compact",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentLanguage, setLanguage } = usePartnerHandbookStore();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: "zh" as Locale,
      name: "中文",
      flag: "🇨🇳",
      nativeName: "简体中文",
    },
    {
      code: "en" as Locale,
      name: "English",
      flag: "🇺🇸",
      nativeName: "English",
    },
  ];

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (newLocale: Locale) => {
    // 更新store中的语言设置
    setLanguage(newLocale);

    // 更新URL路径
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPath);

    // 关闭下拉菜单
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (variant === "compact") {
    return (
      <div className={`language-switcher ${className}`}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg">{currentLang.flag}</span>
          {showLabels && <span>{currentLang.name}</span>}
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
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

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`language-option w-full text-left px-3 py-2 text-sm ${
                    currentLanguage === lang.code ? "active" : "inactive"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.name}</div>
                      {showLabels && (
                        <div className="text-xs text-gray-500">
                          {lang.nativeName}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`language-switcher ${className}`}>
      <div className="flex items-center space-x-4">
        {showLabels && (
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage === "zh" ? "语言" : "Language"}:
          </span>
        )}

        <div className="flex space-x-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`language-option flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentLanguage === lang.code ? "active" : "inactive"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 简化的语言切换按钮组件
export function SimpleLanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentLanguage, setLanguage } = usePartnerHandbookStore();

  const toggleLanguage = () => {
    const newLocale: Locale = currentLanguage === "zh" ? "en" : "zh";
    setLanguage(newLocale);

    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
    >
      <span className="text-lg" suppressHydrationWarning={true}>
        {currentLanguage === "zh" ? "🇺🇸" : "🇨🇳"}
      </span>
      <span>{currentLanguage === "zh" ? "EN" : "中文"}</span>
    </button>
  );
}

// 语言指示器组件（只显示当前语言）
export function LanguageIndicator({ className = "" }: { className?: string }) {
  const { currentLanguage } = usePartnerHandbookStore();

  const languages = {
    zh: { flag: "🇨🇳", name: "中文" },
    en: { flag: "🇺🇸", name: "English" },
  };

  const currentLang = languages[currentLanguage];

  return (
    <div
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
    >
      <span className="text-lg">{currentLang.flag}</span>
      <span>{currentLang.name}</span>
    </div>
  );
}
