/**
 * 全局类型定义
 * Global type definitions
 */

// Window 对象扩展
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  /**
   * 支付处理标记
   * Payment processing flag
   */
  __paymentProcessing?: boolean;

  /**
   * Pro升级处理函数
   * Pro upgrade handler function
   */
  handleProUpgrade?: (options: {
    plan: "monthly" | "yearly" | "oneTime";
    painPoint?: string;
    assessmentScore?: number;
    source?: string;
    answers?: number[];
  }) => void;

  /**
   * Google Analytics gtag函数
   * Google Analytics gtag function
   */
  gtag?: (
    command: string,
    eventName: string,
    params?: Record<string, unknown>,
  ) => void;

  /**
   * Google Tag Manager dataLayer
   * Google Tag Manager dataLayer array
   */
  dataLayer?: Array<Record<string, unknown>>;
}

// 事件对象扩展（用于兼容旧浏览器）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Event {
  cancelBubble?: boolean;
  returnValue?: boolean;
}

// React合成事件扩展
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SyntheticEvent {
  cancelBubble?: boolean;
  returnValue?: boolean;
  stopImmediatePropagation?: () => void;
}

export {};
