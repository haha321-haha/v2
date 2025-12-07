"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { generateMailtoLink, displayEmail } from "@/lib/email-protection";

export default function Footer() {
  const t = useTranslations("footer");
  const rawLocale = useLocale();
  const [currentYear, setCurrentYear] = useState(2024);
  const [isClient, setIsClient] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // 规范化 zh/zh-CN/en/en-US 为 zh/en，避免路径不匹配
  const locale = rawLocale?.startsWith("zh")
    ? "zh"
    : rawLocale?.startsWith("en")
      ? "en"
      : "zh";

  // 为避免服务端与客户端在翻译加载时出现细微差异导致的 hydration mismatch，
  // 邮件 subject/body 不再依赖翻译文案，而是使用基于 locale 的稳定常量。
  const emailSubject = locale === "zh" ? "网站咨询" : "Website Inquiry";
  const emailBody =
    locale === "zh"
      ? "您好，我想咨询关于 PeriodHub 网站上的经期健康工具和服务。"
      : "Hello, I would like to inquire about menstrual health tools and services on the PeriodHub website.";

  useEffect(() => {
    setIsClient(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  // 强制覆盖所有可能的点击拦截
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // 移除所有可能的事件监听器
    const removeAllListeners = () => {
      const clone = footer.cloneNode(true);
      footer.parentNode?.replaceChild(clone, footer);
    };

    // 延迟执行，确保所有组件都已挂载
    const timer = setTimeout(() => {
      removeAllListeners();

      // 重新添加我们自己的点击处理
      const allLinks = footer.querySelectorAll("a");
      allLinks.forEach((link) => {
        const a = link as HTMLAnchorElement;
        const href = a.getAttribute("href");

        if (href) {
          // 移除所有现有事件
          a.replaceWith(a.cloneNode(true));

          // 重新获取元素并添加事件
          const newLink = footer.querySelector(
            `a[href="${href}"]`,
          ) as HTMLAnchorElement;
          if (newLink) {
            newLink.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              console.log("Footer 强制点击:", href);

              // 强制跳转
              window.location.href = href.startsWith("/")
                ? `/${locale}${href}`
                : href;
              return false;
            };

            // 强制样式
            newLink.style.pointerEvents = "auto";
            newLink.style.cursor = "pointer";
            newLink.style.zIndex = "999999";
            newLink.style.position = "relative";
          }
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [locale]);

  // 原生点击处理函数
  const handleNativeClick = (e: React.MouseEvent, href: string) => {
    // 最高优先级的事件阻止
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // 设置事件对象的 cancelled 属性（兼容旧浏览器）
    if ("cancelBubble" in e) {
      (e as Event & { cancelBubble?: boolean }).cancelBubble = true;
    }

    console.log("Footer 原生点击处理:", href);

    // 直接修改 location，不使用任何可能被拦截的方法
    const finalHref = href.startsWith("/") ? `/${locale}${href}` : href;
    window.location.replace(finalHref);
  };

  return (
    <footer
      ref={footerRef}
      className="bg-neutral-100 dark:bg-slate-800 border-t border-neutral-200 dark:border-slate-700"
      style={{
        pointerEvents: "auto !important",
        zIndex: "999999 !important",
        position: "relative",
        isolation: "isolate",
        userSelect: "auto",
      }}
      suppressHydrationWarning={true}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Footer 容器点击被拦截");
      }}
    >
      <div
        className="container-custom py-12"
        style={{
          pointerEvents: "auto !important",
          position: "relative",
          isolation: "isolate",
        }}
      >
        {/* Main Footer Content - 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌸</span>
              <a
                href={`/${locale}`}
                className="font-bold text-xl text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onClick={(e) => handleNativeClick(e, `/${locale}`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/${locale}`);
                }}
              >
                PeriodHub
              </a>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t("tagline")}
            </p>
          </div>

          {/* Column 2: Tools */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {t("columns.tools")}
            </h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="/interactive-tools"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/interactive-tools`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/interactive-tools`);
                }}
              >
                {t("links.tools.symptom_checker")}
              </a>
              <a
                href="/interactive-tools"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/interactive-tools`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/interactive-tools`);
                }}
              >
                {t("links.tools.cycle_tracker")}
              </a>
              <a
                href="/interactive-tools"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/interactive-tools`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/interactive-tools`);
                }}
              >
                {t("links.tools.pain_diary")}
              </a>
              <a
                href="/interactive-tools"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/interactive-tools`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/interactive-tools`);
                }}
              >
                {t("links.tools.doctor_reports")}
              </a>
            </nav>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {t("columns.resources")}
            </h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="/downloads"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/downloads`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/downloads`);
                }}
              >
                {t("links.resources.medical_guides")}
              </a>
              <a
                href="/natural-therapies"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/natural-therapies`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/natural-therapies`);
                }}
              >
                {t("links.resources.natural_remedies")}
              </a>
              <a
                href="/interactive-tools"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/interactive-tools`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/interactive-tools`);
                }}
              >
                {t("links.resources.emergency_guide")}
              </a>
              <a
                href="/downloads"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/downloads`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/downloads`);
                }}
              >
                {t("links.resources.research_papers")}
              </a>
            </nav>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {t("columns.legal")}
            </h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="/privacy-policy"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/privacy-policy`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/privacy-policy`);
                }}
              >
                {t("links.legal.privacy_policy")}
              </a>
              <a
                href="/privacy-policy"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/privacy-policy`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/privacy-policy`);
                }}
              >
                {t("links.legal.hipaa_compliance")}
              </a>
              <a
                href="/settings/data-management"
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) =>
                  handleNativeClick(e, `/settings/data-management`)
                }
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/settings/data-management`);
                }}
              >
                🚨{" "}
                {t("links.legal.clear_all_data", { default: "Clear All Data" })}
              </a>
              <a
                href="/terms-of-service"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/terms-of-service`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/terms-of-service`);
                }}
              >
                {t("links.legal.terms_of_service")}
              </a>
              <a
                href="/medical-disclaimer"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => handleNativeClick(e, `/medical-disclaimer`)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNativeClick(e, `/medical-disclaimer`);
                }}
              >
                {t("links.legal.medical_disclaimer")}
              </a>
            </nav>
          </div>
        </div>

        {/* Contact Information and Social Media */}
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                {t("contactTitle")}
              </h3>
              <a
                href="mailto:tiyibaofu@outlook.com"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = generateMailtoLink(
                    emailSubject,
                    emailBody,
                  );
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {displayEmail()}
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://discord.gg/EN5Zvz3Q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                style={{
                  pointerEvents: "auto !important",
                  cursor: "pointer !important",
                  zIndex: "999999 !important",
                  position: "relative",
                }}
                title={t("socialDiscord")}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Discord</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.052a.074.074 0 0 1 .077.04a9.658 9.658 0 0 0 5.592 1.937a9.675 9.675 0 0 0 5.593-1.937a.074.074 0 0 1 .078-.04c.13.02.26.042.372.053a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Medical Disclaimer */}
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-slate-700 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {isClient
              ? t("copyright", { currentYear })
              : t("copyright", { currentYear: 2024 })}
          </p>
          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            {t("medicalDisclaimerFull")}
          </p>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            {t("dataPrivacyFull")}
          </p>
        </div>
      </div>
    </footer>
  );
}
