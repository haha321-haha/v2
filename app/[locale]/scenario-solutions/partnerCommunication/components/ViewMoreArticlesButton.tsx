"use client";

import React from "react";
import Link from "next/link";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { Locale } from "../types/common";

interface ViewMoreArticlesButtonProps {
  locale: Locale;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function ViewMoreArticlesButton({
  locale,
  className = "",
  variant = "primary",
  size = "md",
}: ViewMoreArticlesButtonProps) {
  const { t } = useSafeTranslations("partnerHandbook.viewMoreArticles");

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-600 text-white hover:bg-primary-700";
      case "secondary":
        return "bg-neutral-200 text-neutral-800 hover:bg-neutral-300";
      case "outline":
        return "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white";
      default:
        return "bg-primary-600 text-white hover:bg-primary-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <div className={`view-more-articles ${className}`}>
      <Link
        href={`/${locale}/scenario-solutions`}
        className={`view-more-button inline-flex items-center justify-center rounded-lg font-medium transition-colors ${getVariantClasses()} ${getSizeClasses()}`}
      >
        <span>{t("buttonText")}</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}
