"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrivacyBadge() {
  const t = useTranslations(
    "interactiveTools.stressManagement.assessment.privacy",
  );

  return (
    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full shadow-sm">
      <Lock className="w-4 h-4 text-green-600" />
      <span className="text-sm text-green-800 font-medium">{t("badge")}</span>
    </div>
  );
}
