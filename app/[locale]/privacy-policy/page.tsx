import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { generateMailtoLink } from "@/lib/email-protection";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";

// Types
type Locale = "en" | "zh";

// Generate metadata for the privacy policy page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  // 使用统一的SEO配置函数
  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/privacy-policy",
    title: `${t("title")} | periodhub.health`,
    description: t("description"),
    keywords: t("keywords")?.split(",") || [],
    structuredDataType: "WebPage" as unknown as StructuredDataType,
    additionalStructuredData: {
      "@type": "WebPage",
      mainEntity: {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: t("sections.informationCollection.title"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("sections.informationCollection.subtitle"),
            },
          },
        ],
      },
    },
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      title: `${t("title")} | periodhub.health`,
      description: t("openGraph.description") || t("description"),
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  const tableOfContents = [
    {
      id: "information-collection",
      title: t("sections.informationCollection.title"),
    },
    { id: "information-use", title: t("sections.informationUse.title") },
    {
      id: "information-sharing",
      title: t("sections.informationSharing.title"),
    },
    { id: "data-security", title: t("sections.dataSecurity.title") },
    { id: "cookie-usage", title: t("sections.cookieUsage.title") },
    { id: "user-rights", title: t("sections.userRights.title") },
    { id: "contact-us", title: t("sections.contactUs.title") },
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
      <section className="py-8 bg-red-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 p-6 rounded-r-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {t("importantNotice")}
            </h3>
            <p className="text-red-700">{t("importantNoticeText")}</p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-gray-100 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">
              {t("tableOfContents")}
            </h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-12">
            {/* Section 1: Information Collection */}
            <section
              id="information-collection"
              className="border-b-2 border-blue-600 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("sections.informationCollection.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <h3>{t("sections.informationCollection.subtitle")}</h3>

                <div className="space-y-6">
                  <div className="border-l-4 border-purple-400 pl-6">
                    <h4 className="text-lg font-semibold">
                      {t("sections.informationCollection.symptomData.title")}
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {t
                        .raw("sections.informationCollection.symptomData.items")
                        .map((item: string, i: number) => (
                          <li key={i}>• {item}</li>
                        ))}
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-400 pl-6">
                    <h4 className="text-lg font-semibold">
                      {t("sections.informationCollection.technicalInfo.title")}
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {t
                        .raw(
                          "sections.informationCollection.technicalInfo.items",
                        )
                        .map((item: string, i: number) => (
                          <li key={i}>• {item}</li>
                        ))}
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-6">
                    <h4 className="text-lg font-semibold">
                      {t("sections.informationCollection.userProvided.title")}
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {t
                        .raw(
                          "sections.informationCollection.userProvided.items",
                        )
                        .map((item: string, i: number) => (
                          <li key={i}>• {item}</li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {t("sections.informationCollection.importantNote.title")}
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    {t("sections.informationCollection.importantNote.text")}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Information Use */}
            <section
              id="information-use"
              className="border-b-2 border-blue-600 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("sections.informationUse.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-700 mb-3">
                      {t("sections.informationUse.mainPurposes.title")}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {t
                        .raw("sections.informationUse.mainPurposes.items")
                        .map((item: string, i: number) => (
                          <li key={i}>✓ {item}</li>
                        ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-red-700 mb-3">
                      {t("sections.informationUse.neverUsedFor.title")}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {t
                        .raw("sections.informationUse.neverUsedFor.items")
                        .map((item: string, i: number) => (
                          <li key={i}>✗ {item}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section
              id="information-sharing"
              className="border-b-2 border-blue-600 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("sections.informationSharing.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <p>{t("sections.informationSharing.content")}</p>
                <ul>
                  {t
                    .raw("sections.informationSharing.exceptions")
                    .map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section
              id="data-security"
              className="border-b-2 border-blue-600 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("sections.dataSecurity.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {t("sections.dataSecurity.encryption.title")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("sections.dataSecurity.encryption.description")}
                    </p>
                  </div>

                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {t("sections.dataSecurity.accessControl.title")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("sections.dataSecurity.accessControl.description")}
                    </p>
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {t("sections.dataSecurity.regularAudit.title")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("sections.dataSecurity.regularAudit.description")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-blue-800">
                    <strong>{t("sections.dataSecurity.disclaimer")}</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Cookie Usage */}
            <section
              id="cookie-usage"
              className="border-b-2 border-blue-600 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("sections.cookieUsage.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <h3>{t("sections.cookieUsage.cookieTypes.title")}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          {t("dataTable.type")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          {t("dataTable.purpose")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          {t("dataTable.duration")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          {t("dataTable.required")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">
                          {t("sections.cookieUsage.cookieTypes.necessary.type")}
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.necessary.purpose",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.necessary.duration",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b text-green-600">
                          {t(
                            "sections.cookieUsage.cookieTypes.necessary.required",
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.functional.type",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.functional.purpose",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.functional.duration",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b text-blue-600">
                          {t(
                            "sections.cookieUsage.cookieTypes.functional.required",
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.analytical.type",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.analytical.purpose",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          {t(
                            "sections.cookieUsage.cookieTypes.analytical.duration",
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm border-b text-blue-600">
                          {t(
                            "sections.cookieUsage.cookieTypes.analytical.required",
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    {t("sections.cookieUsage.management.title")}
                  </h4>
                  <p className="text-orange-700 text-sm">
                    {t("sections.cookieUsage.management.text")}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: User Rights */}
            <section
              id="user-rights"
              className="border-b-2 border-blue-600 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("sections.userRights.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8">
                  <h4 className="text-lg font-semibold mb-4">
                    {t("sections.userRights.subtitle")}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-3">
                      {t
                        .raw("sections.userRights.rights")
                        .slice(0, 4)
                        .map(
                          (
                            right: { name: string; description: string },
                            i: number,
                          ) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                              <span>
                                <strong>{right.name}：</strong>
                                {right.description}
                              </span>
                            </li>
                          ),
                        )}
                    </ul>
                    <ul className="space-y-3">
                      {t
                        .raw("sections.userRights.rights")
                        .slice(4)
                        .map(
                          (
                            right: { name: string; description: string },
                            i: number,
                          ) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              <span>
                                <strong>{right.name}：</strong>
                                {right.description}
                              </span>
                            </li>
                          ),
                        )}
                    </ul>
                  </div>

                  {/* How to Exercise Rights */}
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-700 mb-3 text-lg">
                      {t("sections.userRights.howToExercise.title")}
                    </h3>
                    <p className="text-sm text-green-600 mb-3">
                      {t("sections.userRights.howToExercise.description")}
                    </p>
                    <ul className="text-sm text-green-600 space-y-2">
                      {t
                        .raw("sections.userRights.howToExercise.methods")
                        .map((method: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>{method}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Contact Us */}
            <section
              id="contact-us"
              className="border-b-2 border-blue-600 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("sections.contactUs.title")}
              </h2>
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                <p>{t("sections.contactUs.description")}</p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">
                      {t("sections.contactUs.dataProtection.title")}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>
                          {t("sections.contactUs.dataProtection.email")}
                        </strong>
                      </li>
                      <li>
                        <strong>
                          {t("sections.contactUs.dataProtection.subject")}
                        </strong>
                      </li>
                      <li>
                        <strong>
                          {t("sections.contactUs.dataProtection.responseTime")}
                        </strong>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">
                      {t("sections.contactUs.dpo.title")}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>{t("sections.contactUs.dpo.email")}</strong>
                      </li>
                      <li>
                        <strong>
                          {t("sections.contactUs.dpo.responsibility")}
                        </strong>
                      </li>
                      <li>
                        <strong>{t("sections.contactUs.dpo.languages")}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Policy Updates */}
      <section className="py-12 bg-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-blue-100 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              {t("policyUpdates.title")}
            </h2>
            <p className="mb-4">{t("policyUpdates.content")}</p>
            <ul className="space-y-2 mb-4">
              {t
                .raw("policyUpdates.procedures")
                .map((item: string, i: number) => (
                  <li key={i}>• {item}</li>
                ))}
            </ul>
            <p className="text-sm text-blue-700">
              <strong>{t("policyUpdates.recommendation")}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* MVP Notice */}
      <section className="py-12 bg-yellow-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-yellow-100 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">
              {t("mvpNotice.title")}
            </h3>
            <p className="text-yellow-700 text-sm">{t("mvpNotice.text")}</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-purple-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              {t("questions")}
            </h2>
            <p className="text-purple-700 mb-6">{t("questionsDescription")}</p>
            <a
              href={generateMailtoLink(t("email.subject"), t("email.body"))}
              className="btn-primary"
            >
              {t("contactUs")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
