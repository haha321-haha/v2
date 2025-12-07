"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Calendar, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SimpleWelcomeBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const t = useTranslations("welcomeBanner");

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem("welcome_banner_seen");
        console.log("useEffect: hasSeenWelcome =", hasSeenWelcome); // Debug log
        if (!hasSeenWelcome) {
            // 延迟显示，避免页面加载时的突兀感
            const timer = setTimeout(() => {
                setIsVisible(true);
                console.log("useEffect: Setting isVisible to true after 1s timeout."); // Debug log
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // If it has been seen, ensure it's not visible
            setIsVisible(false);
            console.log("useEffect: Banner has been seen, setting isVisible to false."); // Debug log
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("welcome_banner_seen", "true");
        setIsVisible(false);
        console.log("handleClose: Banner closed, isVisible set to false."); // Debug log
    };

    const handleGetStarted = () => {
        localStorage.setItem("welcome_banner_seen", "true");
        setIsVisible(false);
        console.log("handleGetStarted: Banner closed, isVisible set to false."); // Debug log
        // 可以添加跳转到引导页面的逻辑
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed top-4 right-4 max-w-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-2xl p-6 z-50 border border-purple-100 dark:border-purple-800 animate-in slide-in-from-right duration-500"
            style={{ maxWidth: "400px" }}
        >
            {/* 关闭按钮 */}
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 hover:bg-white/50 dark:hover:bg-black/20 rounded-full transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>

            {/* 内容 */}
            <div className="pr-8">
                {/* 图标 */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    👋 {t("title", { default: "欢迎使用周期管家！" })}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {t(
                        "description",
                        {
                            default:
                                "我们为您准备了强大的健康管理工具，帮助您更好地了解和管理自己的身体周期。",
                        },
                    )}
                </p>

                {/* 功能亮点 */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>
                            {t("feature1", { default: "智能周期预测与日历管理" })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span>
                            {t("feature2", { default: "个性化健康建议与分析" })}
                        </span>
                    </div>
                </div>

                {/* 按钮 */}
                <div className="flex gap-2">
                    <button
                        onClick={handleGetStarted}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {t("startButton", { default: "开始使用" })}
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg font-medium transition-colors"
                    >
                        {t("skipButton", { default: "稍后" })}
                    </button>
                </div>

                {/* 隐私提示 */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
                    <span>🔒</span>
                    {t(
                        "privacy",
                        { default: "您的数据安全存储在本地，我们重视您的隐私" },
                    )}
                </p>
            </div>
        </div>
    );
}
