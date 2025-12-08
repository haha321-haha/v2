import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Locale, locales } from "@/i18n";
import MusicPlayer from "./components/MusicPlayer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveTools.stressManagement.musicPlayer",
  });

  return {
    title: t("pageTitle"),
    description: t("description"),
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function MusicPlayerPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "interactiveTools.stressManagement.musicPlayer",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按钮 */}
        <Link
          href={`/${locale}/interactive-tools/stress-management`}
          className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToStressManagement")}
        </Link>

        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </header>

        {/* 音乐播放器组件 */}
        <MusicPlayer />

        {/* 相关资源 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t("relatedResources")}
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/articles/menstrual-stress-management-complete-guide`}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              📖 {t("stressGuide")}
            </Link>
            <Link
              href={`/${locale}/interactive-tools/stress-management/breathing-exercise`}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              💨 {t("breathingExercise")}
            </Link>
            <Link
              href={`/${locale}/interactive-tools/stress-management/meditation-timer`}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              🧘 {t("meditationTimer")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
