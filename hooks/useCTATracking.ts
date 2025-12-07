/**
 * CTA事件追踪Hook
 *
 * 功能：
 * 1. 追踪CTA点击事件
 * 2. 追踪用户行为路径
 * 3. 集成GA4事件
 * 4. 支持A/B测试
 */

import { useState, useEffect } from "react";

// Google Analytics gtag 类型定义
// Note: gtag type may already be defined by Next.js or other packages
type GtagFunction = (
  command: string,
  targetId: string,
  config?: Record<string, unknown>,
) => void;

export interface CTAEventData {
  eventName?: string; // 'hero_cta_impression' | 'hero_cta_click'
  buttonText: string;
  buttonLocation: string;
  destination: string;
  locale: string;
  abTestVariant?: string;
  abTestId?: string;
  userAgent?: string;
  timestamp: string;
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
}

interface UserSession {
  id: string;
  startTime: string;
  pageViews: number;
  ctaClicks: number;
  lastActivity: string;
}

/**
 * 生成会话ID
 * 注意：此函数仅应在客户端调用，且不应用于渲染期间
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取或创建用户会话
 */
function getUserSession(): UserSession {
  if (typeof window === "undefined") {
    return {
      id: "server-side",
      startTime: new Date().toISOString(),
      pageViews: 0,
      ctaClicks: 0,
      lastActivity: new Date().toISOString(),
    };
  }

  const session = localStorage.getItem("cta_tracking_session");

  if (session) {
    try {
      const parsed = JSON.parse(session) as UserSession;
      const now = new Date();
      const lastActivity = new Date(parsed.lastActivity);

      // 如果超过30分钟没有活动，创建新会话
      if (now.getTime() - lastActivity.getTime() > 30 * 60 * 1000) {
        const newSession: UserSession = {
          id: generateSessionId(),
          startTime: now.toISOString(),
          pageViews: 1,
          ctaClicks: 0,
          lastActivity: now.toISOString(),
        };
        localStorage.setItem(
          "cta_tracking_session",
          JSON.stringify(newSession),
        );
        return newSession;
      }

      // 更新最后活动时间
      parsed.lastActivity = now.toISOString();
      localStorage.setItem("cta_tracking_session", JSON.stringify(parsed));
      return parsed;
    } catch (parseError) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("Failed to parse session data:", parseError);
      }
    }
  }

  // 创建新会话
  const newSession: UserSession = {
    id: generateSessionId(),
    startTime: new Date().toISOString(),
    pageViews: 1,
    ctaClicks: 0,
    lastActivity: new Date().toISOString(),
  };

  localStorage.setItem("cta_tracking_session", JSON.stringify(newSession));
  return newSession;
}

/**
 * 更新会话活动
 */
function updateSessionActivity(eventType: "page_view" | "cta_click"): void {
  if (typeof window === "undefined") return;

  const session = getUserSession();

  if (eventType === "page_view") {
    session.pageViews += 1;
  } else if (eventType === "cta_click") {
    session.ctaClicks += 1;
  }

  session.lastActivity = new Date().toISOString();
  localStorage.setItem("cta_tracking_session", JSON.stringify(session));
}

/**
 * 获取用户设备信息
 */
function getDeviceInfo(): {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  deviceType: "desktop" | "tablet" | "mobile";
} {
  if (typeof window === "undefined") {
    return {
      userAgent: "server-side",
      screenWidth: 0,
      screenHeight: 0,
      deviceType: "desktop",
    };
  }

  const width = window.innerWidth;
  const deviceType =
    width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

  return {
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    deviceType,
  };
}

/**
 * CTA事件追踪Hook
 */
export function useCTATracking() {
  // 使用useState延迟初始化会话，防止服务器/客户端不一致
  const [session, setSession] = useState<UserSession>(() => ({
    id: "client-initializing",
    startTime: new Date().toISOString(),
    pageViews: 0,
    ctaClicks: 0,
    lastActivity: new Date().toISOString(),
  }));

  const [deviceInfo, setDeviceInfo] = useState<{
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    deviceType: "desktop" | "tablet" | "mobile";
  }>(() => ({
    userAgent: "client-initializing",
    screenWidth: 0,
    screenHeight: 0,
    deviceType: "desktop",
  }));

  // 仅在客户端初始化会话和设备信息
  useEffect(() => {
    setSession(getUserSession());
    setDeviceInfo(getDeviceInfo());
  }, []);

  /**
   * 追踪CTA点击事件
   */
  const trackCTAClick = (eventData: Partial<CTAEventData>) => {
    const fullEventData: CTAEventData = {
      buttonText: eventData.buttonText || "",
      buttonLocation: eventData.buttonLocation || "unknown",
      destination: eventData.destination || "",
      locale: eventData.locale || "en",
      abTestVariant: eventData.abTestVariant,
      abTestId: eventData.abTestId,
      userAgent: deviceInfo.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: session.id,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      referrer: typeof window !== "undefined" ? document.referrer : "",
      ...eventData,
    };

    // 更新会话数据
    updateSessionActivity("cta_click");

    // 发送到GA4
    if (
      typeof window !== "undefined" &&
      (window as { gtag?: GtagFunction }).gtag
    ) {
      (window as { gtag: GtagFunction }).gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: fullEventData.buttonText,
        custom_parameters: {
          button_location: fullEventData.buttonLocation,
          destination: fullEventData.destination,
          locale: fullEventData.locale,
          ab_test_variant: fullEventData.abTestVariant,
          ab_test_id: fullEventData.abTestId,
          session_id: fullEventData.sessionId,
          device_type: deviceInfo.deviceType,
          screen_width: deviceInfo.screenWidth,
          screen_height: deviceInfo.screenHeight,
          timestamp: fullEventData.timestamp,
        },
      });
    }

    // 开发模式控制台输出
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[CTA Tracking] Click event:", fullEventData);
    }

    // 保存到本地存储（用于离线分析和调试）
    saveEventToLocal(fullEventData);
  };

  /**
   * 追踪页面浏览
   */
  const trackPageView = (pageData?: {
    pageTitle?: string;
    pageLocation?: string;
  }) => {
    updateSessionActivity("page_view");

    if (
      typeof window !== "undefined" &&
      (window as { gtag?: GtagFunction }).gtag
    ) {
      (window as { gtag: GtagFunction }).gtag("event", "page_view", {
        page_title: pageData?.pageTitle || document.title,
        page_location: pageData?.pageLocation || window.location.href,
        session_id: session.id,
        device_type: deviceInfo.deviceType,
      });
    }
  };

  /**
   * 获取会话统计
   */
  const getSessionStats = () => {
    return {
      sessionId: session.id,
      duration: Math.floor(
        (new Date().getTime() - new Date(session.startTime).getTime()) / 1000,
      ),
      pageViews: session.pageViews,
      ctaClicks: session.ctaClicks,
      conversionRate:
        session.pageViews > 0
          ? (session.ctaClicks / session.pageViews) * 100
          : 0,
    };
  };

  /**
   * 保存事件到本地存储
   */
  const saveEventToLocal = (event: CTAEventData) => {
    if (typeof window === "undefined") return;

    const events = localStorage.getItem("cta_tracking_events");
    let eventList: CTAEventData[] = [];

    if (events) {
      try {
        eventList = JSON.parse(events);
      } catch (parseError) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("Failed to parse local events:", parseError);
        }
      }
    }

    eventList.push(event);

    // 限制本地存储的事件数量（避免存储过多）
    if (eventList.length > 1000) {
      eventList = eventList.slice(-1000);
    }

    localStorage.setItem("cta_tracking_events", JSON.stringify(eventList));
  };

  /**
   * 获取本地存储的事件（用于调试和分析）
   */
  const getLocalEvents = (): CTAEventData[] => {
    if (typeof window === "undefined") return [];

    const events = localStorage.getItem("cta_tracking_events");
    if (!events) return [];

    try {
      return JSON.parse(events);
    } catch (parseError) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("Failed to parse local events:", parseError);
      }
      return [];
    }
  };

  /**
   * 清理本地事件数据
   */
  const clearLocalEvents = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cta_tracking_events");
    }
  };

  return {
    trackCTAClick,
    trackPageView,
    getSessionStats,
    getLocalEvents,
    clearLocalEvents,
    sessionId: session.id,
  };
}

/**
 * 获取所有CTA追踪数据（用于报告和分析）
 */
export function getAllCTATrackingData() {
  if (typeof window === "undefined") return null;

  const session = getUserSession();
  const events = (() => {
    const stored = localStorage.getItem("cta_tracking_events");
    if (!stored) return [];
    try {
      return JSON.parse(stored) as CTAEventData[];
    } catch {
      return [];
    }
  })();

  return {
    session,
    events,
    summary: {
      totalEvents: events.length,
      uniqueButtons: [...new Set(events.map((e) => e.buttonText))],
      eventsByLocation: events.reduce(
        (acc, e) => {
          acc[e.buttonLocation] = (acc[e.buttonLocation] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      eventsByVariant: events.reduce(
        (acc, e) => {
          if (e.abTestVariant) {
            acc[e.abTestVariant] = (acc[e.abTestVariant] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      ),
    },
  };
}

/**
 * 导出数据为CSV格式（用于分析）
 */
export function exportCTADataToCSV(): string {
  const data = getAllCTATrackingData();
  if (!data || data.events.length === 0) return "";

  const headers = [
    "Timestamp",
    "Button Text",
    "Button Location",
    "Destination",
    "Locale",
    "AB Test Variant",
    "AB Test ID",
    "Session ID",
    "Device Type",
    "Page URL",
    "Referrer",
  ];

  const rows = data.events.map((event) => [
    event.timestamp,
    event.buttonText,
    event.buttonLocation,
    event.destination,
    event.locale,
    event.abTestVariant || "",
    event.abTestId || "",
    event.sessionId || "",
    "unknown", // 可以扩展获取设备类型
    event.pageUrl || "",
    event.referrer || "",
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}
