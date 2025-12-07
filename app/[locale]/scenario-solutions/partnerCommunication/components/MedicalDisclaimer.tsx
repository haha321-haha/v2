"use client";

import React from "react";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";

interface MedicalDisclaimerProps {
  className?: string;
  variant?: "default" | "compact" | "inline";
}

export default function MedicalDisclaimer({
  className = "",
  variant = "default",
}: MedicalDisclaimerProps) {
  const { t } = useSafeTranslations("common.medicalDisclaimer");

  if (variant === "compact") {
    return (
      <div className={`medical-disclaimer-compact ${className}`}>
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-xs text-red-700 leading-relaxed">{t("text")}</p>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`medical-disclaimer-inline ${className}`}>
        <span className="text-xs text-red-600 font-medium">
          ⚠️ {t("title")}:
        </span>
        <span className="text-xs text-red-700 ml-1">{t("text")}</span>
      </div>
    );
  }

  // Default variant
  return (
    <section className={`medical-disclaimer-section ${className}`}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="medical-disclaimer">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="medical-disclaimer-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="medical-disclaimer-title">{t("title")}</h4>
                <p className="medical-disclaimer-content">{t("text")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
