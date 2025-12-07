import { getTranslations } from "next-intl/server";

interface HeroSectionProps {
  locale: string;
}

export default async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage",
  });
  const heroBaseKey = "periodPainAssessment.hero";

  return (
    <section className="mb-8 md:mb-10">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-purple-100 px-6 py-8 md:px-10 md:py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-xs md:text-sm font-medium text-purple-700 mb-4">
            {t("periodPainAssessment.title")}
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 md:mb-4 leading-tight">
            {t(`${heroBaseKey}.title`)}
          </h1>
          <p className="text-base md:text-lg text-neutral-700 mb-4 md:mb-6">
            {t(`${heroBaseKey}.subtitle`)}
          </p>
          <p className="text-sm md:text-base text-neutral-600 mb-6 md:mb-8">
            {t(`${heroBaseKey}.description`)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-left">
              <p className="text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wide">
                {t(`${heroBaseKey}.intelligentMatching`)}
              </p>
              <p className="text-sm text-purple-800">
                {t(`${heroBaseKey}.intelligentMatchingDesc`)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-left">
              <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">
                {t(`${heroBaseKey}.professionalTools`)}
              </p>
              <p className="text-sm text-blue-800">
                {t(`${heroBaseKey}.professionalToolsDesc`)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 text-left">
              <p className="text-xs font-semibold text-pink-700 mb-1 uppercase tracking-wide">
                {t(`${heroBaseKey}.personalizedGuidance`)}
              </p>
              <p className="text-sm text-pink-800">
                {t(`${heroBaseKey}.personalizedGuidanceDesc`)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-neutral-800">
              {t(`${heroBaseKey}.readyToStart`)}
            </p>
            <p className="text-xs md:text-sm text-neutral-500">
              {t(`${heroBaseKey}.readyToStartDesc`)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
