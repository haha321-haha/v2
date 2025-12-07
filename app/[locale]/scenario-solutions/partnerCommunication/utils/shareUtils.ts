import { logError } from "@/lib/debug-logger";

// 分享工具函数
export interface ShareData {
  title: string;
  text: string;
  url: string;
}

// 检查是否支持原生分享API
export const isNativeShareSupported = (): boolean => {
  return typeof navigator !== "undefined" && "share" in navigator;
};

// 原生分享功能
export const nativeShare = async (data: ShareData): Promise<boolean> => {
  if (!isNativeShareSupported()) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    // 用户取消分享是正常行为，不应该记录为错误
    if (error instanceof Error && error.name === "AbortError") {
      // 用户取消了分享，这是正常行为
      return false;
    }
    // 其他错误才记录
    logError("Native share failed", error, "shareUtils/nativeShare");
    return false;
  }
};

// 复制到剪贴板
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    logError("Copy to clipboard failed", error, "shareUtils/copyToClipboard");
    return false;
  }
};

// 生成分享文本
export const generateShareText = (
  score: number,
  totalQuestions: number,
  level: string,
  locale: "zh" | "en",
): string => {
  const percentage = Math.round((score / totalQuestions) * 100);

  if (locale === "zh") {
    return `我在Period Hub完成了伴侣理解度测试！得分：${score}/${totalQuestions} (${percentage}%)，等级：${level}。快来测试你对痛经的理解程度吧！`;
  } else {
    return `I completed the Partner Understanding Test on Period Hub! Score: ${score}/${totalQuestions} (${percentage}%), Level: ${level}. Test your understanding of period pain now!`;
  }
};

// 生成分享URL
export const generateShareUrl = (locale: "zh" | "en"): string => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.periodhub.health";
  return `${baseUrl}/${locale}/scenario-solutions/partnerCommunication`;
};

// Twitter分享
export const shareToTwitter = (text: string, url: string): void => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text,
  )}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, "_blank", "width=600,height=400");
};

// WhatsApp分享
export const shareToWhatsApp = (text: string, url: string): void => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${text} ${url}`,
  )}`;
  window.open(whatsappUrl, "_blank", "width=600,height=400");
};

// Facebook分享
export const shareToFacebook = (url: string): void => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url,
  )}`;
  window.open(facebookUrl, "_blank", "width=600,height=400");
};

// 通用分享处理函数
export const handleShare = async (
  platform: "native" | "twitter" | "whatsapp" | "facebook" | "copy",
  shareData: ShareData,
  locale: "zh" | "en",
): Promise<{ success: boolean; message: string }> => {
  try {
    switch (platform) {
      case "native":
        const nativeSuccess = await nativeShare(shareData);
        return {
          success: nativeSuccess,
          message: nativeSuccess
            ? locale === "zh"
              ? "分享成功！"
              : "Shared successfully!"
            : "", // 用户取消分享时不显示消息
        };

      case "twitter":
        shareToTwitter(shareData.text, shareData.url);
        return {
          success: true,
          message:
            locale === "zh" ? "正在打开Twitter..." : "Opening Twitter...",
        };

      case "whatsapp":
        shareToWhatsApp(shareData.text, shareData.url);
        return {
          success: true,
          message:
            locale === "zh" ? "正在打开WhatsApp..." : "Opening WhatsApp...",
        };

      case "facebook":
        shareToFacebook(shareData.url);
        return {
          success: true,
          message:
            locale === "zh" ? "正在打开Facebook..." : "Opening Facebook...",
        };

      case "copy":
        const copySuccess = await copyToClipboard(
          `${shareData.text} ${shareData.url}`,
        );
        return {
          success: copySuccess,
          message: copySuccess
            ? locale === "zh"
              ? "已复制到剪贴板！"
              : "Copied to clipboard!"
            : locale === "zh"
              ? "复制失败"
              : "Copy failed",
        };

      default:
        return {
          success: false,
          message:
            locale === "zh" ? "不支持的分享方式" : "Unsupported share method",
        };
    }
  } catch (error) {
    logError("Share error", error, "shareUtils/handleShare");
    return {
      success: false,
      message:
        locale === "zh" ? "分享出错，请重试" : "Share error, please try again",
    };
  }
};
