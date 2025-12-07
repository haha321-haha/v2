import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { URL_CONFIG } from "@/lib/url-config";
import { generateMailtoLink } from "@/lib/email-protection";

// Types
type Locale = "en" | "zh";

// Generate metadata for the terms of service page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsOfService" });

  return {
    title: `${t("title")} | periodhub.health`,
    description: t("description"),
    alternates: {
      canonical: `${URL_CONFIG.baseUrl}/${locale}/terms-of-service`,
      languages: {
        "zh-CN": `${URL_CONFIG.baseUrl}/zh/terms-of-service`,
        "en-US": `${URL_CONFIG.baseUrl}/en/terms-of-service`,
        "x-default": `${URL_CONFIG.baseUrl}/en/terms-of-service`,
      },
    },
    openGraph: {
      title: `${t("title")} | periodhub.health`,
      description: t("openGraph.description"),
      type: "website",
      url: `${URL_CONFIG.baseUrl}/${locale}/terms-of-service`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "termsOfService" });

  // Table of contents data
  const tableOfContents = [
    {
      id: "service-description",
      title: t("sections.serviceDescription.title"),
    },
    { id: "user-eligibility", title: t("sections.userEligibility.title") },
    { id: "service-content", title: t("sections.serviceContent.title") },
    { id: "user-conduct", title: t("sections.userConduct.title") },
    { id: "privacy-protection", title: t("sections.privacyProtection.title") },
    { id: "medical-disclaimer", title: t("sections.medicalDisclaimer.title") },
    {
      id: "intellectual-property",
      title: t("sections.intellectualProperty.title"),
    },
    { id: "service-changes", title: t("sections.serviceChanges.title") },
    {
      id: "liability-limitation",
      title: t("sections.liabilityLimitation.title"),
    },
    { id: "dispute-resolution", title: t("sections.disputeResolution.title") },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
            {t("title")}
          </h1>
          <p className="text-neutral-600 mb-6">{t("lastUpdated")}</p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <p className="text-blue-800">{t("intro")}</p>
          </div>
        </div>
      </header>

      {/* Important Notice */}
      <section className="bg-red-50 py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-r-lg">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    {t("importantNotice")}
                  </h3>
                  <p className="text-red-700">{t("importantNoticeText")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {t("tableOfContents")}
              </h2>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {tableOfContents.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-12">
            {/* Section 1: Service Description */}
            <section
              id="service-description"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.serviceDescription.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <p className="mb-4">
                  {t("sections.serviceDescription.content")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>
                    <strong>
                      {t(
                        "sections.serviceDescription.items.educationalContent",
                      )}
                    </strong>
                  </li>
                  <li>
                    <strong>
                      {t("sections.serviceDescription.items.interactiveTools")}
                    </strong>
                  </li>
                  <li>
                    <strong>
                      {t("sections.serviceDescription.items.resourceLibrary")}
                    </strong>
                  </li>
                  <li>
                    <strong>
                      {t("sections.serviceDescription.items.communitySupport")}
                    </strong>
                  </li>
                </ul>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded-r-lg">
                  <p className="text-red-800 font-semibold">
                    {t("sections.serviceDescription.medicalNotice")}
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
                  <p className="text-blue-800">
                    {t("sections.serviceDescription.mvpNotice")}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: User Eligibility */}
            <section
              id="user-eligibility"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.userEligibility.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.userEligibility.ageRequirementTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.userEligibility.ageRequirement")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.userEligibility.accountAccuracyTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.userEligibility.accountAccuracy")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.userEligibility.accountSecurityTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.userEligibility.accountSecurity")}
                </p>
              </div>
            </section>

            {/* Section 3: Service Content */}
            <section
              id="service-content"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.serviceContent.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceContent.availabilityTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceContent.availability")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceContent.contentLicenseTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceContent.contentLicense")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceContent.assessmentToolsTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceContent.assessmentTools")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceContent.personalizedAdviceTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceContent.personalizedAdvice")}
                </p>
              </div>
            </section>

            {/* Section 4: User Conduct */}
            <section
              id="user-conduct"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.userConduct.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.userConduct.prohibitedBehaviorsTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.userConduct.prohibitedBehaviors")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.userConduct.prohibitedList")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.userConduct.contentAccuracyTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.userConduct.contentAccuracy")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.userConduct.respectOthersTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.userConduct.respectOthers")}
                </p>
              </div>
            </section>

            {/* Section 5: Privacy Protection */}
            <section
              id="privacy-protection"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.privacyProtection.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.privacyProtection.privacyPolicyRefTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.privacyProtection.privacyPolicyRef")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.privacyProtection.dataCollectionTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.privacyProtection.dataCollection")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  <li>
                    <strong>
                      {t("sections.privacyProtection.dataTypes.basicInfo")}
                    </strong>
                  </li>
                  <li>
                    <strong>
                      {t("sections.privacyProtection.dataTypes.healthInfo")}
                    </strong>
                  </li>
                  <li>
                    <strong>
                      {t("sections.privacyProtection.dataTypes.usageData")}
                    </strong>
                  </li>
                  <li>
                    <strong>
                      {t("sections.privacyProtection.dataTypes.deviceInfo")}
                    </strong>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.privacyProtection.dataUsageTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.privacyProtection.dataUsage")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.privacyProtection.usagePurposes")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.privacyProtection.dataSecurityTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.privacyProtection.dataSecurity.measures")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.privacyProtection.dataSecurity.securityList")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.privacyProtection.thirdPartySharingTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.privacyProtection.thirdPartySharing")}
                </p>
              </div>
            </section>

            {/* Section 6: Medical Disclaimer */}
            <section
              id="medical-disclaimer"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-red-600 pb-2">
                {t("sections.medicalDisclaimer.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start">
                    <svg
                      className="w-8 h-8 text-red-600 mr-4 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      ></path>
                    </svg>
                    <div>
                      <h3 className="text-lg font-bold text-red-800 mb-2">
                        {t(
                          "sections.medicalDisclaimer.importantMedicalDisclaimer",
                        )}
                      </h3>
                      <p className="text-red-700 font-semibold">
                        {t("sections.medicalDisclaimer.disclaimerText")}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.medicalDisclaimer.disclaimerTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.medicalDisclaimer.nonMedicalService")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.medicalDisclaimer.personalResponsibilityTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.medicalDisclaimer.personalResponsibility")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.medicalDisclaimer.medicalProfessionals")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.medicalDisclaimer.emergencyHandlingTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.medicalDisclaimer.emergencyHandling")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.medicalDisclaimer.emergencySymptoms")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.medicalDisclaimer.informationAccuracyTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.medicalDisclaimer.informationAccuracy")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.medicalDisclaimer.resultVariabilityTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.medicalDisclaimer.resultVariability")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.medicalDisclaimer.medicationWarningTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.medicalDisclaimer.medicationWarning")}
                </p>
              </div>
            </section>

            {/* Section 7: Intellectual Property */}
            <section
              id="intellectual-property"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.intellectualProperty.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.intellectualProperty.ownershipTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.intellectualProperty.contentOwnership")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.intellectualProperty.usageRestrictionsTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.intellectualProperty.usageRestrictions")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.intellectualProperty.restrictionsList")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.intellectualProperty.fairUseTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.intellectualProperty.fairUse")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.intellectualProperty.fairUseList")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.intellectualProperty.thirdPartyContentTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.intellectualProperty.thirdPartyContent")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.intellectualProperty.infringementNoticeTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.intellectualProperty.infringementNotice")}
                </p>
              </div>
            </section>

            {/* Section 8: Service Changes */}
            <section
              id="service-changes"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.serviceChanges.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceChanges.modificationRightsTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceChanges.modificationRights")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.serviceChanges.changesList")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceChanges.termsChangesTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceChanges.termsChanges")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceChanges.accountTerminationTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceChanges.accountTermination.ourRights")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw(
                      "sections.serviceChanges.accountTermination.terminationReasons",
                    )
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceChanges.userRightsTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceChanges.accountTermination.userRights")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.serviceChanges.consequencesTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.serviceChanges.accountTermination.consequences")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw(
                      "sections.serviceChanges.accountTermination.consequencesList",
                    )
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
            </section>

            {/* Section 9: Liability Limitation */}
            <section
              id="liability-limitation"
              className="border-b border-neutral-200 pb-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.liabilityLimitation.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.liabilityLimitation.serviceProvisionTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.liabilityLimitation.serviceProvision")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.liabilityLimitation.disclaimerScopeTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.liabilityLimitation.disclaimerScope")}
                </p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                  {t
                    .raw("sections.liabilityLimitation.disclaimerList")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.liabilityLimitation.liabilityLimitTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.liabilityLimitation.liabilityLimit")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.liabilityLimitation.forceMajeureTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.liabilityLimitation.forceMajeure")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.liabilityLimitation.userLiabilityTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.liabilityLimitation.userLiability")}
                </p>
              </div>
            </section>

            {/* Section 10: Dispute Resolution */}
            <section id="dispute-resolution" className="pb-8">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 border-b-2 border-blue-600 pb-2">
                {t("sections.disputeResolution.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none">
                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.disputeResolution.applicableLawTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.disputeResolution.applicableLaw")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t(
                    "sections.disputeResolution.disputeResolutionProcessTitle",
                  )}
                </h3>
                <p className="mb-4">
                  {t("sections.disputeResolution.disputeResolutionProcess")}
                </p>
                <ol className="list-decimal list-inside mb-6 space-y-2">
                  {t
                    .raw("sections.disputeResolution.resolutionSteps")
                    .map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ol>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.disputeResolution.jurisdictionTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.disputeResolution.jurisdiction")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.disputeResolution.severabilityTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.disputeResolution.severability")}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("sections.disputeResolution.entireAgreementTitle")}
                </h3>
                <p className="mb-4">
                  {t("sections.disputeResolution.entireAgreement")}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Contact Information */}
      <section className="bg-purple-50 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-purple-600 pb-2">
              {t("contact.title")}
            </h2>
            <div className="bg-purple-100 border border-purple-200 rounded-lg p-6">
              <p className="mb-4">{t("contact.description")}</p>
              <ul className="space-y-2">
                <li>
                  <strong>{t("contact.email")}</strong>
                </li>
                <li>
                  <strong>{t("contact.mailingAddress")}</strong>
                </li>
                <li>
                  <strong>{t("contact.onlineFeedback")}</strong>
                </li>
              </ul>
              <p className="mt-4 text-sm text-purple-700">
                {t("contact.responseTime")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-yellow-50 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                {t("importantReminder")}
              </h3>
              <p className="text-yellow-700">{t("importantReminderText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              {t("questionsTerms")}
            </h2>
            <p className="text-neutral-600 mb-6">
              {t("questionsDescriptionTerms")}
            </p>
            <a
              href={generateMailtoLink(
                "服务条款咨询",
                "您好，我想咨询关于服务条款的问题。",
              )}
              className="btn-primary"
            >
              {t("contactUsTerms")}
            </a>
          </div>
        </div>
      </section>

      {/* Final Notice */}
      <section className="bg-blue-50 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                {t("sections.finalNotice.title")}
              </h3>
              <p className="text-blue-700 text-sm">
                {t("sections.finalNotice.content")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
