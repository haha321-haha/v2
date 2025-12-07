"use client";
import { useEffect } from "react";
import { logWarn, logInfo } from "@/lib/debug-logger";

interface TitleProtectorProps {
  title: string;
  locale: string;
}

export const TitleProtector: React.FC<TitleProtectorProps> = ({
  title,
  locale,
}) => {
  useEffect(() => {
    let isProtecting = true;
    let protectionCount = 0;

    const protectTitle = () => {
      if (!isProtecting) return;

      const currentTitle = document.title;

      // 检查标题是否被Next.js模板修改（添加了 | PeriodHub）
      const expectedWithTemplate = `${title} | PeriodHub`;
      const isTemplateModified = currentTitle === expectedWithTemplate;

      // 检查是否有数字被添加到标题前面
      const hasLeadingNumbers = /^\d+/.test(currentTitle);

      if (currentTitle !== title && !isTemplateModified) {
        protectionCount++;
        logWarn(
          `🛡️ Title changed from "${title}" to "${currentTitle}", restoring... (Protection #${protectionCount})`,
          { title, currentTitle, protectionCount },
          "TitleProtector/protectTitle",
        );

        // 强制设置标题
        document.title = title;

        // 更新页面中的title元素
        const titleElement = document.querySelector("head > title");
        if (titleElement && titleElement.textContent !== title) {
          titleElement.textContent = title;
        }

        // 如果检测到数字前缀，特别处理
        if (hasLeadingNumbers) {
          logWarn(
            `🚨 Detected leading numbers in title: "${currentTitle}", forcing correction`,
            { currentTitle, title },
            "TitleProtector/protectTitle",
          );
          // 多次强制设置，确保生效
          setTimeout(() => {
            document.title = title;
            if (titleElement) {
              titleElement.textContent = title;
            }
          }, 100);

          setTimeout(() => {
            document.title = title;
            if (titleElement) {
              titleElement.textContent = title;
            }
          }, 500);
        }
      } else if (isTemplateModified) {
        // 如果标题被Next.js模板修改了，我们需要保持原始标题
        logInfo(
          `📝 Title was modified by Next.js template, keeping original: "${title}"`,
          { title },
          "TitleProtector/protectTitle",
        );
        document.title = title;

        const titleElement = document.querySelector("head > title");
        if (titleElement) {
          titleElement.textContent = title;
        }
      }
    };

    // 立即保护
    protectTitle();

    // 定期检查（每500ms）
    const interval = setInterval(protectTitle, 500);

    // 特别针对中文版本的额外保护
    let chineseProtectionInterval: NodeJS.Timeout | undefined;
    if (locale === "zh") {
      logInfo(
        "🛡️ TitleProtector: Applying extra protection for Chinese version",
        undefined,
        "TitleProtector/useEffect",
      );
      chineseProtectionInterval = setInterval(() => {
        const currentTitle = document.title;
        const hasLeadingNumbers = /^\d+/.test(currentTitle);

        if (currentTitle !== title && !currentTitle.includes(title)) {
          logWarn(
            `🛡️ TitleProtector Chinese protection: "${currentTitle}" -> "${title}"`,
            { currentTitle, title },
            "TitleProtector/chineseProtection",
          );
          document.title = title;

          const titleElement = document.querySelector("head > title");
          if (titleElement && titleElement.textContent !== title) {
            titleElement.textContent = title;
          }
        }

        // 特别处理数字前缀
        if (hasLeadingNumbers) {
          logWarn(
            `🚨 TitleProtector: Detected leading numbers in Chinese title: "${currentTitle}"`,
            { currentTitle, title },
            "TitleProtector/chineseProtection",
          );
          document.title = title;
          const titleElement = document.querySelector("head > title");
          if (titleElement) {
            titleElement.textContent = title;
          }
        }
      }, 200); // 更频繁的检查
    }

    // 监听DOM变化
    const observer = new MutationObserver(() => {
      protectTitle();
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        protectTitle();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isProtecting = false;
      clearInterval(interval);
      if (chineseProtectionInterval) {
        clearInterval(chineseProtectionInterval);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [title, locale]);

  return null; // 这是一个无渲染组件
};
