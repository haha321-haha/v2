import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X, Check, Lock } from "lucide-react";
import "@/lib/pro-upgrade-handler"; // 导入全局处理函数

interface WelcomeOnboardingProps {
  onClose: () => void;
  userTier?: "free" | "pro";
  forceShow?: boolean;
}

export default function WelcomeOnboarding({
  onClose,
  userTier = "free",
  forceShow = false,
}: WelcomeOnboardingProps) {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 直接事件监听器 - 绕过 React 合成事件系统和浏览器翻译干扰
  useEffect(() => {
    if (!isVisible) return;

    let cleanupFunctions: (() => void)[] = [];

    const attachDirectListeners = () => {
      // 清理旧的监听器
      cleanupFunctions.forEach(fn => fn());
      cleanupFunctions = [];

      // 关闭按钮
      const closeBtn = document.querySelector('[aria-label="Close"]') as HTMLElement;
      if (closeBtn) {
        // 强制设置 pointer-events
        closeBtn.style.pointerEvents = 'auto';
        closeBtn.style.cursor = 'pointer';

        const handleCloseClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('✅ [直接监听] 关闭按钮被点击');
          onClose();
        };

        // 添加多种事件类型
        closeBtn.addEventListener('click', handleCloseClick, { capture: true });
        closeBtn.addEventListener('mouseup', handleCloseClick, { capture: true });
        closeBtn.addEventListener('touchend', handleCloseClick, { capture: true });

        cleanupFunctions.push(() => {
          closeBtn.removeEventListener('click', handleCloseClick, { capture: true });
          closeBtn.removeEventListener('mouseup', handleCloseClick, { capture: true });
          closeBtn.removeEventListener('touchend', handleCloseClick, { capture: true });
        });
      }

      // 跳过按钮
      const skipBtn = document.querySelector('[data-action="skip"]') as HTMLElement;
      if (skipBtn) {
        skipBtn.style.pointerEvents = 'auto';
        skipBtn.style.cursor = 'pointer';

        const handleSkipClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('✅ [直接监听] 跳过按钮被点击');
          handleSkip();
        };

        skipBtn.addEventListener('click', handleSkipClick, { capture: true });
        skipBtn.addEventListener('mouseup', handleSkipClick, { capture: true });
        skipBtn.addEventListener('touchend', handleSkipClick, { capture: true });

        cleanupFunctions.push(() => {
          skipBtn.removeEventListener('click', handleSkipClick, { capture: true });
          skipBtn.removeEventListener('mouseup', handleSkipClick, { capture: true });
          skipBtn.removeEventListener('touchend', handleSkipClick, { capture: true });
        });
      }

      // 订阅按钮
      const subscribeBtn = document.querySelector('[data-action="subscribe"]') as HTMLElement;
      if (subscribeBtn && !isSubscribed) {
        subscribeBtn.style.pointerEvents = 'auto';
        subscribeBtn.style.cursor = 'pointer';

        const handleSubscribeClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('✅ [直接监听] 订阅按钮被点击');
          if (email) {
            handleEmailSubscribe();
          }
        };

        subscribeBtn.addEventListener('click', handleSubscribeClick, { capture: true });
        subscribeBtn.addEventListener('mouseup', handleSubscribeClick, { capture: true });

        cleanupFunctions.push(() => {
          subscribeBtn.removeEventListener('click', handleSubscribeClick, { capture: true });
          subscribeBtn.removeEventListener('mouseup', handleSubscribeClick, { capture: true });
        });
      }
    };

    // 初始附加
    const initialTimer = setTimeout(attachDirectListeners, 100);

    // 使用 MutationObserver 监听 DOM 变化（浏览器翻译可能修改 DOM）
    const observer = new MutationObserver(() => {
      console.log('🔄 检测到 DOM 变化，重新附加事件监听器');
      attachDirectListeners();
    });

    const modalElement = document.querySelector('[data-modal="onboarding"]');
    if (modalElement) {
      observer.observe(modalElement, {
        attributes: true,
        attributeFilter: ['data-doubao-translate-traverse-mark', 'style', 'class'],
        subtree: true,
      });
    }

    // 定期强制重新附加（防止被移除）
    const intervalId = setInterval(attachDirectListeners, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
      observer.disconnect();
      cleanupFunctions.forEach(fn => fn());
    };
  }, [isVisible, currentStep, email, isSubscribed]);

  useEffect(() => {
    // 如果强制显示，直接显示
    if (forceShow) {
      setIsVisible(true);
      setCurrentStep(0);
      return;
    }
    // 检查是否已经完成onboarding
    const isCompleted = localStorage.getItem("onboarding_completed");
    if (!isCompleted) {
      setIsVisible(true);
    }
  }, [forceShow]);

  const steps = [
    {
      id: "welcome",
      title: t("onboarding.welcome.title"),
      description: t("onboarding.welcome.description"),
      icon: "👋",
      action: "none",
    },
    {
      id: "email",
      title: t("onboarding.email.title"),
      description: t("onboarding.email.description"),
      icon: "📧",
      action: "email",
    },
    {
      id: "calendar",
      title: t("onboarding.calendar.title"),
      description: t("onboarding.calendar.description"),
      icon: "📅",
      action: "calendar",
    },
    {
      id: "starred",
      title: t("onboarding.starred.title"),
      description: t("onboarding.starred.description"),
      icon: "⭐",
      action: "starred",
    },
    {
      id: "explore",
      title: t("onboarding.explore.title"),
      description: t("onboarding.explore.description"),
      icon: "🚀",
      action: "explore",
    },
    {
      id: "complete",
      title: t("onboarding.complete.title"),
      description: t("onboarding.complete.description"),
      icon: "🎉",
      action: "complete",
    },
  ];

  const totalSteps = steps.length;

  const handleEmailSubscribe = () => {
    if (email) {
      // 模拟订阅API调用
      setTimeout(() => {
        setIsSubscribed(true);
        // 自动进入下一步
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1000);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    // 标记onboarding已完成
    localStorage.setItem("onboarding_completed", "true");
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  // 服务端渲染时返回 null
  if (typeof window === "undefined") {
    return null;
  }

  // 如果不可见，返回 null
  if (!isVisible) {
    return null;
  }

  const currentStepData = steps[currentStep];

  // 使用 React Portal 渲染到 document.body，避免父组件层叠上下文影响
  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      style={{ pointerEvents: "auto", zIndex: 2147483640 }}
      data-modal="onboarding"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative"
        style={{ pointerEvents: "auto", overflow: "visible", zIndex: 2147483641 }}
        onClick={(e) => {
          // 只阻止 click 事件冒泡，不影响 mousedown/mouseup
          e.stopPropagation();
        }}
      >
        {/* Close Button - 使用最高优先级和直接事件 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation?.();
            console.log("✅ [React] 关闭按钮被点击");
            handleClose();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation?.();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="Close"
          type="button"
          data-action="close"
          style={{
            pointerEvents: "auto" as const,
            cursor: "pointer",
            position: "absolute",
            top: "-0.5rem",
            right: "-0.5rem",
            zIndex: 2147483647,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(4px)",
            border: "2px solid rgba(0, 0, 0, 0.1)",
            touchAction: "manipulation",
          }}
        >
          <X
            className="w-5 h-5 text-gray-500"
            style={{ pointerEvents: "none" }}
          />
        </button>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-t-2xl">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-8" style={{ pointerEvents: "auto" }}>
          {/* Step Indicator */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full text-white mb-4">
              {currentStepData.icon}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {t("onboarding.stepIndicator", {
                current: currentStep + 1,
                total: totalSteps,
              })}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStepData.action === "email" && (
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("onboarding.email.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent?.stopImmediatePropagation?.();
                    console.log("✅ [React] 订阅按钮被点击", { email, isSubscribed });
                    if (!email || isSubscribed) return;
                    handleEmailSubscribe();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent?.stopImmediatePropagation?.();
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled={!email || isSubscribed}
                  data-action="subscribe"
                  className={`w-full py-3 rounded-lg font-medium transition-all ${isSubscribed
                      ? "bg-green-100 text-green-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg"
                    }`}
                  style={{
                    pointerEvents:
                      !email || isSubscribed
                        ? ("none" as const)
                        : ("auto" as const),
                    cursor: !email || isSubscribed ? "not-allowed" : "pointer",
                    position: "relative",
                    zIndex: 2147483645,
                    touchAction: "manipulation",
                  }}
                  type="button"
                >
                  {isSubscribed ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      {t("onboarding.email.subscribed")}
                    </div>
                  ) : (
                    t("onboarding.email.subscribe")
                  )}
                </button>
                {isSubscribed && (
                  <p className="text-sm text-green-600 text-center">
                    {t("onboarding.email.successMessage")}
                  </p>
                )}
              </div>
            )}

            {currentStepData.action === "calendar" && (
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-800 mb-4">
                  {t("onboarding.calendar.description")}
                </p>
                <button
                  onClick={() => {
                    // 尝试调用日历API或显示提示
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "PeriodHub 周期提醒",
                          text: "将周期提醒添加到您的日历",
                          url: window.location.href,
                        })
                        .catch(() => {
                          alert("日历功能即将推出，敬请期待！");
                        });
                    } else {
                      alert("日历功能即将推出，敬请期待！");
                    }
                  }}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  {t("onboarding.calendar.addToCalendar")}
                </button>
              </div>
            )}

            {currentStepData.action === "starred" && (
              <div className="space-y-3">
                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-800">
                    {t("onboarding.starred.feature1")}
                  </p>
                </div>
                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-800">
                    {t("onboarding.starred.feature2")}
                  </p>
                </div>
                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-800">
                    {t("onboarding.starred.feature3")}
                  </p>
                </div>
              </div>
            )}

            {currentStepData.action === "explore" && (
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Analytics</div>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm font-medium">Reports</div>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium">Goals</div>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-sm font-medium">Calendar</div>
                </button>
              </div>
            )}

            {currentStepData.action === "complete" && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {t("onboarding.complete.title")}
                  </h4>
                  <p className="text-gray-600">
                    {t("onboarding.complete.description")}
                  </p>
                </div>
                {userTier === "free" && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <p className="text-sm text-purple-800 font-medium mb-2">
                      {t("onboarding.complete.proTeaser")}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🔓 升级到Pro按钮被点击");
                        // 触发Pro升级流程
                        if (
                          typeof window !== "undefined" &&
                          window.handleProUpgrade
                        ) {
                          window.handleProUpgrade({
                            plan: "monthly",
                            painPoint: "onboarding",
                            assessmentScore: 0,
                            source: "onboarding_modal",
                          });
                        } else {
                          // 备用方案：直接跳转到定价页面
                          console.log("⚠️ 全局函数未找到，跳转到定价页面");
                          const locale = window.location.pathname.includes(
                            "/zh",
                          )
                            ? "zh"
                            : "en";
                          window.location.href = `/${locale}/pricing`;
                        }
                      }}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all relative z-[10002]"
                      style={{ pointerEvents: "auto", cursor: "pointer" }}
                      type="button"
                    >
                      {t("onboarding.complete.upgradeCta")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent?.stopImmediatePropagation?.();
                console.log("✅ [React] 跳过按钮被点击");
                handleSkip();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent?.stopImmediatePropagation?.();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors font-medium"
              data-action="skip"
              style={{
                pointerEvents: "auto" as const,
                cursor: "pointer",
                position: "relative",
                zIndex: 2147483646,
                touchAction: "manipulation",
              }}
              type="button"
            >
              {t("onboarding.skip")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent?.stopImmediatePropagation?.();
                console.log("✅ 完成/下一步按钮被点击");
                if (currentStepData.action === "email" && !isSubscribed) return;
                handleNext();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent?.stopImmediatePropagation?.();
              }}
              disabled={currentStepData.action === "email" && !isSubscribed}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${currentStepData.action === "email" && !isSubscribed
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg"
                }`}
              style={{
                pointerEvents:
                  currentStepData.action === "email" && !isSubscribed
                    ? ("none" as const)
                    : ("auto" as const),
                cursor:
                  currentStepData.action === "email" && !isSubscribed
                    ? "not-allowed"
                    : "pointer",
                position: "relative",
                zIndex: 2147483646,
              }}
              type="button"
            >
              {currentStep === totalSteps - 1
                ? t("onboarding.completeButton")
                : t("onboarding.next")}
            </button>
          </div>

          {/* Privacy Footer */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lock
                  size={16}
                  className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                    🔒{" "}
                    {t("onboarding.privacyTitle", {
                      default: "Your Health Data Stays on Your Device",
                    })}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {t("onboarding.privacyFooter")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 使用 React Portal 渲染到 document.body，确保在最上层
  return createPortal(modalContent, document.body);
}
