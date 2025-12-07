"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import WelcomeOnboarding from "./WelcomeOnboarding";
import { trackEvent } from "@/lib/analytics/posthog";

export interface FirstWeekActivationProps {
  userTier: "free" | "pro";
  isPostSignup?: boolean;
}

// 暂时禁用 WelcomeOnboarding 组件，因为存在浏览器兼容性问题
// TODO: 使用新的 SimpleWelcomeBanner 替代
const ENABLE_ONBOARDING = false;

export default function FirstWeekActivation({
  userTier,
  isPostSignup = false,
}: FirstWeekActivationProps) {
  // 暂时禁用 onboarding 功能
  if (!ENABLE_ONBOARDING) {
    return null;
  }

  const t = useTranslations("common.dev");
  const [daySinceSignup, setDaySinceSignup] = useState(0);
  const [emailsScheduledCount, setEmailsScheduledCount] = useState(0);
  const [forceShowOnboarding, setForceShowOnboarding] = useState(false);

  useEffect(() => {
    // 检查是否是新用户
    const signupDate = localStorage.getItem("signup_date");
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    const emailSubscribed = localStorage.getItem("email_subscribed");
    let daysDiff = 0;

    // 如果是注册后立即显示
    if (isPostSignup && !hasCompletedOnboarding) {
      // WelcomeOnboarding 组件内部管理可见性
      return;
    }

    // 如果没有注册日期，设置为今天
    if (!signupDate) {
      localStorage.setItem("signup_date", new Date().toISOString());
    }

    // 计算注册后的天数
    if (signupDate) {
      const signup = new Date(signupDate);
      const today = new Date();
      daysDiff = Math.floor(
        (today.getTime() - signup.getTime()) / (1000 * 60 * 60 * 24),
      );
      setDaySinceSignup(daysDiff);
    }

    // 首周激活策略
    const activateOnboarding = () => {
      // Day 0: 注册后立即显示
      if (isPostSignup) {
        // WelcomeOnboarding 组件内部管理可见性
        return;
      }

      // Day 1: 如果没有完成onboarding
      if (daysDiff === 1 && !hasCompletedOnboarding) {
        // WelcomeOnboarding 组件内部管理可见性
        trackEvent("day1_onboarding_trigger", {
          hasEmailSubscribed: !!emailSubscribed,
          userTier,
        });
        return;
      }

      // Day 3: 如果还没有订阅邮件
      if (daysDiff === 3 && !emailSubscribed) {
        // WelcomeOnboarding 组件内部管理可见性
        trackEvent("day3_email_reminder", {
          userTier,
          triggerReason: "not_subscribed",
        });
        return;
      }

      // Day 5: 免费用户的升级提醒
      if (daysDiff === 5 && userTier === "free") {
        // WelcomeOnboarding 组件内部管理可见性
        trackEvent("day5_upgrade_nudge", {
          userTier,
          triggerReason: "upgrade_nudge",
        });
        return;
      }

      // Day 7: Pro用户的深度功能引导
      if (daysDiff === 7 && userTier === "pro" && hasCompletedOnboarding) {
        // WelcomeOnboarding 组件内部管理可见性
        trackEvent("day7_pro_deep_dive", {
          userTier,
          triggerReason: "pro_feature_deep_dive",
        });
        return;
      }
    };

    // 根据不同条件激活
    activateOnboarding();
  }, [isPostSignup, userTier]);

  const handleCloseOnboarding = () => {
    // 追踪onboarding关闭
    trackEvent("onboarding_closed", {
      daySinceSignup,
      userTier,
      triggerType: isPostSignup ? "immediate" : "day_based",
    });
  };

  // 首周激活邮件序列模板
  const emailSequenceTemplates = useMemo(
    () => [
      {
        day: 0,
        subject: "Welcome to Period Hub! Your journey starts now 🌸",
        template: "welcome",
        trigger: "immediate",
      },
      {
        day: 1,
        subject: "Quick setup tip for better tracking",
        template: "day1_tip",
        trigger: "day_based",
      },
      {
        day: 3,
        subject: "Personalized insights waiting for you",
        template: "day3_insights",
        trigger: "day_based",
      },
      {
        day: 5,
        subject: "Unlock advanced features (free users)",
        template: "day5_upgrade",
        trigger: "day_based",
      },
      {
        day: 7,
        subject: "Your first week progress! 🎉",
        template: "day7_progress",
        trigger: "day_based",
      },
    ],
    [],
  );

  // 模拟发送邮件（实际应该在后端实现）
  const scheduleEmails = useCallback(() => {
    emailSequenceTemplates.forEach((email) => {
      // 检查是否已发送
      const emailKey = `email_sent_${email.day}`;
      const alreadySent = localStorage.getItem(emailKey);

      if (!alreadySent && daySinceSignup >= email.day) {
        // 在实际应用中，这里会调用后端API发送邮件
        // 使用 logger 而不是 console.log（开发环境自动启用，生产环境自动禁用）
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log(
            `Sending email template: ${email.template} on day ${email.day}`,
          );
        }

        // 标记为已发送
        localStorage.setItem(emailKey, "true");

        // 追踪邮件发送
        trackEvent("email_scheduled", {
          day: email.day,
          template: email.template,
          userTier,
        });
      }
    });
  }, [daySinceSignup, userTier, emailSequenceTemplates]);

  // 检查是否需要发送邮件
  useEffect(() => {
    scheduleEmails();
  }, [scheduleEmails]);

  // 计算已安排的邮件数量（仅在客户端）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const count = emailSequenceTemplates.filter((e) =>
        localStorage.getItem(`email_sent_${e.day}`),
      ).length;
      setEmailsScheduledCount(count);
    }
  }, [emailSequenceTemplates]);

  return (
    <>
      {/* Onboarding Modal */}
      <WelcomeOnboarding
        onClose={() => {
          handleCloseOnboarding();
          setForceShowOnboarding(false);
        }}
        userTier={userTier}
        forceShow={forceShowOnboarding}
      />

      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === "development" && (
        <div
          className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50"
          style={{ pointerEvents: "auto" }}
        >
          <div>
            {t("daySinceSignup")}: {daySinceSignup}
          </div>
          <div>
            {t("userTier")}: {t(`tier.${userTier}`)}
          </div>
          <div>
            {t("emailsScheduled")}: {emailsScheduledCount}/
            {emailSequenceTemplates.length}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // 清除onboarding完成标记并强制显示
              localStorage.removeItem("onboarding_completed");
              setForceShowOnboarding(true);
              trackEvent("dev_show_onboarding", { userTier });
            }}
            className="mt-2 px-2 py-1 bg-purple-600 rounded text-white cursor-pointer"
            style={{ pointerEvents: "auto" }}
            type="button"
          >
            {t("showOnboarding")}
          </button>
        </div>
      )}
    </>
  );
}
