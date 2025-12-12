"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Mail, Check, Calendar, TrendingUp, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { validateEmail } from "@/lib/email/utils";

export default function ImprovedWelcomeOnboarding() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = useTranslations("onboarding");
    const locale = useLocale();

    useEffect(() => {
        // 检查是否已完成或跳过
        const isCompleted = localStorage.getItem("onboarding_completed");
        const isSkipped = localStorage.getItem("onboarding_skipped");

        if (!isCompleted && !isSkipped) {
            // 延迟 1.5 秒显示
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("onboarding_skipped", "true");
        setIsVisible(false);
    };

    const handleComplete = () => {
        localStorage.setItem("onboarding_completed", "true");
        setIsVisible(false);
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleSkip = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (value && !validateEmail(value)) {
            setEmailError(t("email.errorInvalid"));
        } else {
            setEmailError("");
        }
    };

    const handleSubscribe = async () => {
        if (!validateEmail(email)) {
            setEmailError(t("email.errorInvalid"));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/email-marketing/send-guide", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    locale,
                    source: "welcome_onboarding"
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsSubscribed(true);
                setEmailError("");
                // 延迟进入下一步，让用户看到成功状态
                setTimeout(() => {
                    setCurrentStep(3);
                }, 1000);
            } else {
                setEmailError(data.error || t("email.errorServer"));
            }
        } catch {
            setEmailError(t("email.errorNetwork"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed bottom-24 right-6 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[9999] animate-in slide-in-from-bottom duration-500"
            style={{ maxWidth: "420px" }}
        >
            {/* 关闭按钮 */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* 进度指示器 */}
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`flex-1 h-1.5 rounded-full transition-all ${step <= currentStep
                                ? "bg-gradient-to-r from-purple-600 to-pink-500"
                                : "bg-gray-200 dark:bg-gray-700"
                                }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {t("stepIndicator", { current: currentStep, total: 3 })}
                </p>
            </div>

            {/* 内容区域 */}
            <div className="px-6 pb-6">
                {/* 步骤 1: 欢迎 */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t("welcome.title")}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t("welcome.description")}
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleNext}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {t("next")}
                            </button>
                            <button
                                onClick={handleSkip}
                                className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                            >
                                {t("skip")}
                            </button>
                        </div>
                    </div>
                )}

                {/* 步骤 2: 邮箱收集 */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                            <Mail className="w-7 h-7 text-white" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t("email.title")}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t("email.description")}
                            </p>
                        </div>

                        {!isSubscribed ? (
                            <>
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder={t("email.placeholder")}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${emailError
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                            : email && validateEmail(email)
                                                ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                                                : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                                            } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                                        disabled={isSubmitting}
                                    />
                                    {emailError && (
                                        <p className="text-xs text-red-500 mt-1.5 ml-1">{emailError}</p>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                    <span>🔒</span>
                                    {t("email.privacy")}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSubscribe}
                                        disabled={!email || !!emailError || isSubmitting}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting ? t("email.subscribing") : t("email.subscribe")}
                                    </button>
                                    <button
                                        onClick={handleSkip}
                                        disabled={isSubmitting}
                                        className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                                    >
                                        {t("skip")}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-green-600 dark:text-green-400 font-medium">
                                    {t("email.successMessage")}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 步骤 3: 功能亮点 */}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t("features.title")}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t("features.description")}
                            </p>
                        </div>

                        <div className="space-y-3 py-2">
                            <div
                                onClick={() => {
                                    window.location.href = `/${locale}/interactive-tools/cycle-tracker`;
                                }}
                                className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("features.feature1")}
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    window.location.href = `/${locale}/interactive-tools/workplace-wellness`;
                                }}
                                className="flex items-start gap-3 p-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <TrendingUp className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("features.feature2")}
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    window.location.href = `/${locale}/interactive-tools/pain-tracker`;
                                }}
                                className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("features.feature3")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {t("completeButton")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
