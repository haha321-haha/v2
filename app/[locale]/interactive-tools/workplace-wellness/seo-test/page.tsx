/**
 * HVsLYEp职场健康助手 - SEO测试页面
 * 用于验证Meta信息和结构化数据
 */

import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";
import {
  generateSEOValidationReport,
  performSEOValidation,
} from "../utils/seoValidator";
import { generateAllStructuredData } from "../utils/seoOptimization";
import { generateAlternatesConfig } from "@/lib/seo/canonical-url-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // 生成canonical和hreflang配置
  const alternatesData = generateAlternatesConfig(
    "interactive-tools/workplace-wellness/seo-test",
  );
  const alternates = {
    canonical: alternatesData[locale === "zh" ? "zh-CN" : "en-US"],
    languages: alternatesData,
  };

  return {
    title:
      locale === "zh"
        ? "SEO测试页面 - 职场健康助手"
        : "SEO Test Page - Workplace Wellness Assistant",
    description:
      locale === "zh"
        ? "测试HVsLYEp职场健康助手的SEO优化功能，包括Meta信息和结构化数据验证。"
        : "Test SEO optimization features for HVsLYEp Workplace Wellness Assistant, including meta information and structured data validation.",
    alternates,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SEOTestPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // 获取翻译函数
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage.workplaceWellness",
  });

  // 执行SEO验证
  const validation = performSEOValidation(locale);
  const validationReport = generateSEOValidationReport(locale);
  const structuredData = generateAllStructuredData(locale, t);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {locale === "zh" ? "🔍 SEO测试页面" : "🔍 SEO Test Page"}
          </h1>

          {/* SEO验证结果 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "SEO验证结果" : "SEO Validation Results"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 验证状态 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {locale === "zh" ? "验证状态" : "Validation Status"}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        validation.isValid ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm">
                      {validation.isValid
                        ? locale === "zh"
                          ? "✅ 验证通过"
                          : "✅ Validation Passed"
                        : locale === "zh"
                          ? "❌ 验证失败"
                          : "❌ Validation Failed"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        validation.metaValid ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm">
                      {locale === "zh" ? "Meta信息" : "Meta Information"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        validation.structuredDataValid
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm">
                      {locale === "zh" ? "结构化数据" : "Structured Data"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO分数 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {locale === "zh" ? "SEO分数" : "SEO Score"}
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {validation.score}/100
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${validation.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 问题列表 */}
          {validation.issues.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {locale === "zh" ? "发现的问题" : "Issues Found"}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {validation.issues.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-red-700">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 改进建议 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "改进建议" : "Recommendations"}
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="space-y-2">
                {validation.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span className="text-blue-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 结构化数据预览 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "结构化数据预览" : "Structured Data Preview"}
            </h2>
            <div className="space-y-4">
              {structuredData.map((data, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {String(data["@type"] || "Unknown")}
                  </h3>
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* 完整报告 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "完整SEO报告" : "Complete SEO Report"}
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap">
                {validationReport}
              </pre>
            </div>
          </div>

          {/* 测试说明 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              {locale === "zh" ? "测试说明" : "Test Instructions"}
            </h3>
            <div className="text-yellow-700 space-y-2">
              <p>
                {locale === "zh"
                  ? "此页面用于测试HVsLYEp职场健康助手的SEO优化功能。"
                  : "This page is used to test SEO optimization features for HVsLYEp Workplace Wellness Assistant."}
              </p>
              <p>
                {locale === "zh"
                  ? "请检查页面源代码中的Meta标签和结构化数据是否正确生成。"
                  : "Please check if meta tags and structured data are correctly generated in the page source."}
              </p>
              <p>
                {locale === "zh"
                  ? "可以使用Google Rich Results Test等工具验证结构化数据。"
                  : "You can use tools like Google Rich Results Test to validate structured data."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
