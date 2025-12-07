"use client";

import { useState } from "react";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrivacyNotice() {
  const [showDetails, setShowDetails] = useState(false);
  const t = useTranslations("v2Home");

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />

          <div className="flex-1">
            <p className="text-sm text-gray-800 font-medium">
              {t("privacy.title")}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {t("privacy.subtitle")}
            </p>
          </div>

          {showDetails ? (
            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}
        </div>
      </button>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            {t("privacy.features.local_storage.title")}
          </h4>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>{t("privacy.features.local_storage.description")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>{t("privacy.features.hipaa_compliant.description")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>{t("privacy.features.encryption.description")}</span>
            </li>
          </ul>
          <p className="text-xs text-gray-600 mt-3">
            {t("privacy.disclaimer.data_privacy_text")}
          </p>
          <a
            href="/privacy-policy"
            className="text-xs text-blue-600 hover:underline mt-3 inline-block"
          >
            {t("privacy.disclaimer.data_privacy_title")} →
          </a>
        </div>
      )}
    </div>
  );
}
