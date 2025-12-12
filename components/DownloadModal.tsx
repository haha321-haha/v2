"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Locale as LocaleType } from "@/lib/email/types";

interface DownloadModalProps {
  locale?: LocaleType;
  buttonText?: string;
  className?: string;
  source?: string; // 来源标识（如：'上班痛经', 'travel' 等）
  downloadUrl?: string; // 直接下载链接（成功后可提供）
  resourceTitle?: string; // PDF 资源标题（用于显示）
}

type Status = "idle" | "loading" | "success" | "error";

export default function DownloadModal({
  locale: propLocale,
  buttonText,
  className = "",
  source,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  downloadUrl: _downloadUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resourceTitle: _resourceTitle,
  isOpen: propIsOpen,
  onClose,
  title: propTitle,
  description: propDescription,
}: DownloadModalProps & {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorType, setErrorType] = useState<string | undefined>(undefined);

  const rawLocale = useLocale();
  const t = useTranslations("emailMarketing.downloadModal");

  // Determine if controlled or uncontrolled
  const isControlled = typeof propIsOpen !== "undefined";
  const isOpen = isControlled ? propIsOpen : internalIsOpen;

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  };

  // 确定使用的locale
  const locale: LocaleType =
    propLocale || (rawLocale?.startsWith("zh") ? "zh" : "en");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorType(undefined);

    try {
      const res = await fetch("/api/email-marketing/send-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorType(data.errorType || "server");
      }
    } catch {
      setStatus("error");
      setErrorType("network");
    }
  };

  // 默认按钮文字
  const triggerText = buttonText || t("triggerButtonText");

  // 未打开状态：显示触发按钮 (Only if uncontrolled)
  if (!isOpen && !isControlled) {
    return (
      <button
        onClick={handleOpen}
        className={`bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${className}`}
        type="button"
      >
        {triggerText}
      </button>
    );
  }

  // If controlled and closed, render nothing
  if (!isOpen && isControlled) {
    return null;
  }

  // 打开状态：显示Modal
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 点击背景关闭 */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
          type="button"
          aria-label="Close"
        >
          ✕
        </button>

        {status === "success" ? (
          // 成功状态 UI
          <div className="text-center py-6 animate-success-bounce">
            <div className="text-5xl mb-4" role="img" aria-label="Success">
              ✅
            </div>
            <h3
              id="modal-title"
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              {t("successTitle")}
            </h3>
            <p className="text-gray-600 mb-6">{t("successDescription")}</p>
            <button
              onClick={handleClose}
              className="text-pink-500 font-semibold hover:text-pink-600 hover:underline"
              type="button"
            >
              {t("closeButtonText")}
            </button>
          </div>
        ) : (
          // 表单状态 UI
          <form onSubmit={handleSubmit}>
            <h3
              id="modal-title"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {propTitle || t("title")}
            </h3>
            <p className="text-gray-500 mb-6">{propDescription || t("description")}</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="email-input" className="sr-only">
                  Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Email address"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {status === "loading" ? (
                  <>
                    <span
                      className="inline-block animate-spin mr-2"
                      aria-hidden="true"
                    >
                      ↻
                    </span>
                    <span>{t("loadingText")}</span>
                  </>
                ) : (
                  <span>{t("submitButtonText")}</span>
                )}
              </button>
            </div>

            {status === "error" && (
              <p
                className="text-red-500 text-sm mt-3 text-center bg-red-50 p-2 rounded"
                role="alert"
              >
                {errorType === "validation"
                  ? t("errorInvalidEmail")
                  : errorType === "network"
                    ? t("errorNetwork")
                    : errorType === "rate_limit"
                      ? t("errorRateLimit")
                      : t("errorServer")}
              </p>
            )}

            <p className="text-[10px] text-gray-400 mt-6 text-center leading-tight">
              {t("complianceText")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
