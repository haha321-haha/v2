import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ComparisonSection() {
  const t = useTranslations("comparison");
  const locale = useLocale();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h2>
        <p className="text-xl text-purple-600 font-medium">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* 对比图 - 移动端在上，桌面端在左 */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-2xl shadow-lg overflow-hidden">
            <Image
              src="/images/comparison-vs.png"
              alt={t("imageAlt")}
              width={1920}
              height={1080}
              className="w-full h-auto rounded-2xl"
              priority={false}
              loading="lazy"
            />
          </div>
        </div>

        {/* 数据结论 - 移动端在下，桌面端在右 */}
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {t("whyChooseNatural")}
          </h3>

          {/* 布洛芬数据条 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                {t("pills.title")}
              </p>
              <span className="text-sm text-gray-500">
                {t("pills.score")}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-gray-400 h-4 rounded-full transition-all duration-500"
                style={{ width: "62%" }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t("pills.cons")}
            </p>
          </div>

          {/* PeriodHub 自然方案数据条 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-700">
                {t("natural.title")}
              </p>
              <span className="text-sm text-purple-600 font-bold">
                {t("natural.score")}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-500 h-4 rounded-full transition-all duration-500"
                style={{ width: "89%" }}
              />
            </div>
            <p className="text-sm text-purple-600 font-bold mt-2">
              {t("natural.pros")}
            </p>
          </div>

          {/* CTA 按钮 */}
          <div className="mt-8">
            <Link
              href={`/${locale}/immediate-relief`}
              className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-600 transition-colors"
            >
              {t("subtitle")} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
