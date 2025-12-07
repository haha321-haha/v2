// 统一标题管理器 - 避免多个脚本冲突
// 使用函数式方法避免Fast Refresh问题

let currentTitle: string = "";
let isProtecting: boolean = false;
let protectionInterval: NodeJS.Timeout | null = null;
let observer: MutationObserver | null = null;

// 强制设置标题
function forceSetTitle(title: string): void {
  try {
    // 方法1: 直接设置 document.title
    document.title = title;

    // 方法2: 操作 <title> 元素
    const titleElement = document.querySelector("head > title");
    if (titleElement) {
      titleElement.textContent = title;
      titleElement.innerHTML = title;
    }

    // 方法3: 设置所有相关的meta标签
    const metaTags = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'meta[name="title"]',
    ];

    metaTags.forEach((selector) => {
      const meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute("content", title);
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("❌ [UnifiedTitleManager] 设置标题失败:", error);
    }
  }
}

// 停止保护机制
function stopProtection(): void {
  isProtecting = false;

  if (protectionInterval) {
    clearInterval(protectionInterval);
    protectionInterval = null;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// 启动保护机制
function startProtection(title: string, locale: string): void {
  if (isProtecting) return;

  isProtecting = true;

  // 设置MutationObserver监听标题变化
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const target = mutation.target as Element;
        if (
          target.tagName === "TITLE" ||
          target.parentElement?.tagName === "TITLE"
        ) {
          const currentTitle = document.title;
          if (currentTitle !== title && !currentTitle.includes(title)) {
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console
              console.warn(
                `🛡️ [UnifiedTitleManager] 标题被修改: "${currentTitle}" -> "${title}"`,
              );
            }
            forceSetTitle(title);
          }
        }
      }
    });
  });

  // 监听head元素的变化
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // 定期检查（仅对中文页面）
  if (locale === "zh") {
    protectionInterval = setInterval(() => {
      const actualTitle = document.title;
      if (actualTitle !== title && !actualTitle.includes(title)) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn(
            `⏰ [UnifiedTitleManager] 定期检查发现标题偏移，正在恢复...`,
          );
        }
        forceSetTitle(title);
      }
    }, 2000);
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`🛡️ [UnifiedTitleManager] 标题保护已启动`);
  }
}

// 设置标题（统一入口）
export function setTitle(title: string, locale: string = "zh"): void {
  currentTitle = title;

  // 停止之前的保护
  stopProtection();

  // 立即设置标题
  forceSetTitle(title);

  // 启动保护机制
  startProtection(title, locale);

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`🎯 [UnifiedTitleManager] 标题已设置为: "${title}"`);
  }
}

// 获取当前标题
export function getCurrentTitle(): string {
  return currentTitle;
}

// 销毁实例
export function destroy(): void {
  stopProtection();
  currentTitle = "";
}

// 导出默认的标题管理器对象（兼容性）
export const titleManager = {
  setTitle,
  getCurrentTitle,
  destroy,
};
