// utils/analytics.ts
// Simple analytics utility for tracking events

interface DataLayerEvent {
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>,
) => {
  // Log to console for development
  if (typeof window !== "undefined") {
    const isDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (isDev) {
      console.log(`[Analytics] Event: ${eventName}`, params);
    }

    // Google Tag Manager (GTM) dataLayer push
    // This is the standard way to send events to GTM, which can then route to GA4
    interface WindowWithDataLayer extends Window {
      dataLayer?: DataLayerEvent[];
    }
    const win = window as WindowWithDataLayer;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({
      event: eventName,
      ...params,
      timestamp: new Date().toISOString(),
    });

    // Direct GA4 fallback (if gtag is manually implemented without GTM)
    if (window.gtag) {
      window.gtag("event", eventName, params);
    }
  }
};
