import { getTranslations } from "next-intl/server";

interface TrustSectionProps {
  locale: string;
}

export default async function TrustSection({ locale }: TrustSectionProps) {
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage",
  });
  const baseKey = "periodPainAssessment.trust";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 统计数据 */}
      <section className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-4">
          {t(`${baseKey}.statistics.title`)}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-purple-600">
              {t(`${baseKey}.statistics.usersHelped`)}
            </p>
            <p className="text-xs md:text-sm text-neutral-600 mt-1">
              {t(`${baseKey}.statistics.usersHelpedDesc`)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {t(`${baseKey}.statistics.toolsAvailable`)}
            </p>
            <p className="text-xs md:text-sm text-neutral-600 mt-1">
              {t(`${baseKey}.statistics.toolsAvailableDesc`)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-pink-600">
              {t(`${baseKey}.statistics.expertContent`)}
            </p>
            <p className="text-xs md:text-sm text-neutral-600 mt-1">
              {t(`${baseKey}.statistics.expertContentDesc`)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">
              {t(`${baseKey}.statistics.userRating`)}
            </p>
            <p className="text-xs md:text-sm text-neutral-600 mt-1">
              {t(`${baseKey}.statistics.userRatingDesc`)}
            </p>
          </div>
        </div>
      </section>

      {/* 专业背书与免责声明 */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-purple-900 rounded-3xl shadow-sm text-neutral-50 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          {t(`${baseKey}.professionalAssurance.title`)}
        </h2>
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
            <div>
              <p className="text-sm font-medium">
                {t(`${baseKey}.professionalAssurance.medicalDisclaimer`)}
              </p>
              <p className="text-xs md:text-sm text-neutral-300">
                {t(`${baseKey}.professionalAssurance.medicalDisclaimerDesc`)}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
            <div>
              <p className="text-sm font-medium">
                {t(`${baseKey}.professionalAssurance.expertReview`)}
              </p>
              <p className="text-xs md:text-sm text-neutral-300">
                {t(`${baseKey}.professionalAssurance.expertReviewDesc`)}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
            <div>
              <p className="text-sm font-medium">
                {t(`${baseKey}.professionalAssurance.regularlyUpdated`)}
              </p>
              <p className="text-xs md:text-sm text-neutral-300">
                {t(`${baseKey}.professionalAssurance.regularlyUpdatedDesc`)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs md:text-sm font-semibold mb-1">
            {t(`${baseKey}.disclaimer.title`)}
          </p>
          <p className="text-[11px] md:text-xs text-neutral-300 leading-relaxed">
            {t(`${baseKey}.disclaimer.content`)}
          </p>
        </div>
      </section>
    </div>
  );
}
