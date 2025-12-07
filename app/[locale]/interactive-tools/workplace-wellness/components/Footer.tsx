/**
 * HVsLYEp职场健康助手 - 页脚组件
 * 基于HVsLYEp的Footer函数设计
 */

"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("workplaceWellness");

  return (
    <footer className="bg-white border-t border-neutral-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-2 text-neutral-600">
          <Heart className="text-primary-500" size={16} />
          <span className="text-sm">
            {t("header.title")} - {t("header.subtitle")}
          </span>
        </div>
        <div className="text-center text-xs text-neutral-500 mt-2">
          © 2025 Period Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
