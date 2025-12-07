import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface QuickNavigationSectionProps {
  locale: string;
}

export default async function QuickNavigationSection({
  locale,
}: QuickNavigationSectionProps) {
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage",
  });
  const baseKey = "periodPainAssessment.quickNavigation";

  return (
    <section className="mt-12 md:mt-16">
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-8 md:px-10 md:py-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-3">
            {t(`${baseKey}.title`)}
          </h2>
          <p className="text-sm md:text-base text-neutral-600">
            {t(`${baseKey}.description`)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Articles */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              {t(`${baseKey}.articles`)}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <Link
                  href={`/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.articlesList.guide`)}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/articles/immediate-relief-for-period-pain`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.articlesList.relief`)}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/articles/workplace-impact-assessment`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.articlesList.workplace`)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              {t(`${baseKey}.tools`)}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <Link
                  href={`/${locale}/interactive-tools/symptom-tracker`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.toolsList.tracker`)}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/interactive-tools/cycle-tracker`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.toolsList.cycle`)}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/interactive-tools/constitution-test`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.toolsList.constitution`)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Scenarios */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              {t(`${baseKey}.scenarios`)}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <Link
                  href={`/${locale}/scenario-solutions/workplace`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.scenariosList.workplace`)}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/scenario-solutions/social-situations`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.scenariosList.social`)}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/scenario-solutions/commuting`}
                  className="hover:text-purple-700 transition-colors"
                >
                  {t(`${baseKey}.scenariosList.commuting`)}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
