import { useEffect, useRef, useCallback } from "react";

interface UseSmartTitleOptions {
  title: string;
  locale: string;
  debug?: boolean;
}

export const useSmartTitle = ({
  title,
  locale,
  debug = false,
}: UseSmartTitleOptions) => {
  const titleRef = useRef<string>(title);
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isChineseRef = useRef(locale === "zh");

  const log = useCallback(
    (message: string, data?: unknown) => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log(`🔍 [SmartTitle-${locale}]`, message, data || "");
      }
    },
    [debug, locale],
  );

  const setTitleSafely = useCallback(
    (newTitle: string) => {
      try {
        // 方法1: 直接设置 document.title
        document.title = newTitle;

        // 方法2: 操作 <title> 元素 (对中文更可靠)
        const titleElement = document.querySelector("head > title");
        if (titleElement) {
          titleElement.textContent = newTitle;
        }

        // 方法3: 对于中文，额外设置 innerHTML 确保编码正确
        if (isChineseRef.current && titleElement) {
          titleElement.innerHTML = newTitle;
        }

        // 验证设置是否成功
        const currentTitle = document.title;
        if (currentTitle !== newTitle) {
          log(
            `⚠️ Title verification failed. Expected: "${newTitle}", Got: "${currentTitle}"`,
          );

          // 强制重试
          setTimeout(() => {
            document.title = newTitle;
            if (titleElement) {
              titleElement.textContent = newTitle;
            }
          }, 50);
        } else {
          log(`✅ Title set successfully: "${newTitle}"`);
        }
      } catch (error) {
        log(`❌ Error setting title:`, error);
      }
    },
    [isChineseRef, log],
  );

  const forceCleanCache = useCallback(() => {
    log("🧹 Cleaning browser cache...");

    // 清理 Service Worker 缓存
    if ("serviceWorker" in navigator && "caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes("title") || name.includes("meta")) {
            caches.delete(name);
            log(`🗑️ Deleted cache: ${name}`);
          }
        });
      });
    }

    // 清理相关的 localStorage
    try {
      ["page_title", "meta_cache", "title_cache"].forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          log(`🗑️ Cleared localStorage: ${key}`);
        }
      });
    } catch (error) {
      log("⚠️ Could not clear localStorage:", error);
    }
  }, [log]);

  const setupTitleProtection = useCallback(() => {
    const currentTitle = titleRef.current;

    // 清理之前的保护
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 立即设置标题
    setTitleSafely(currentTitle);

    // 设置 MutationObserver 监听标题变化
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          const target = mutation.target as Element;
          if (
            target.tagName === "TITLE" ||
            target.parentElement?.tagName === "TITLE"
          ) {
            const actualTitle = document.title;
            if (actualTitle !== currentTitle) {
              log(
                `🛡️ Title was changed to: "${actualTitle}", restoring to: "${currentTitle}"`,
              );
              setTitleSafely(currentTitle);
            }
          }
        }
      });
    });

    // 监听 head 元素的变化
    observerRef.current.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // 设置定时检查 (只对中文页面，频率较低)
    if (isChineseRef.current) {
      intervalRef.current = setInterval(() => {
        const actualTitle = document.title;
        if (actualTitle !== currentTitle) {
          log(`⏰ Periodic check: Title drift detected, restoring...`);
          setTitleSafely(currentTitle);
        }
      }, 2000); // 2秒检查一次，不会产生太多日志
    }

    log(`🛡️ Title protection activated for: "${currentTitle}"`);
  }, [setTitleSafely, log]);

  useEffect(() => {
    titleRef.current = title;
    isChineseRef.current = locale === "zh";

    // 强制清理缓存 (只在中文页面执行)
    if (isChineseRef.current) {
      forceCleanCache();
    }

    // 延迟执行，确保组件完全加载
    const timer = setTimeout(() => {
      setupTitleProtection();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [title, locale, setupTitleProtection, forceCleanCache]);

  return {
    forceRefresh: () => {
      log("🔄 Force refreshing title...");
      forceCleanCache();
      setTimeout(() => setupTitleProtection(), 100);
    },
  };
};
