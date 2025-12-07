"use client";

import { useEffect, useState } from "react";
import { logInfo } from "@/lib/debug-logger";

/**
 * Hydration修复组件
 * 解决浏览器扩展导致的hydration不匹配问题
 */
export default function HydrationFix() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // 🔧 立即修复 hydration 不匹配问题
    const htmlElement = document.documentElement;

    // 1. 移除可能由浏览器扩展添加的类名
    const extensionClasses = [
      "tongyi-design-pc",
      "tongyi-design-mobile",
      "alibaba-design",
      "taobao-design",
      "doubao-translate-active",
      "google-translate-active",
    ];

    extensionClasses.forEach((className) => {
      if (htmlElement.classList.contains(className)) {
        htmlElement.classList.remove(className);
        logInfo(
          `[HydrationFix] 移除了浏览器扩展添加的类名: ${className}`,
          { className },
          "HydrationFix",
        );
      }
    });

    // 2. 立即移除所有翻译扩展属性，防止hydration错误
    const removeTranslationAttributes = () => {
      const allElements = document.querySelectorAll("*");
      allElements.forEach((element) => {
        const attributesToRemove = [
          "data-doubao-translate-traverse-mark",
          "data-google-translate",
          "data-translate",
          "data-microsoft-translate",
          "data-baidu-translate",
          "data-deepl-translate",
        ];
        attributesToRemove.forEach((attr) => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });
      });
    };

    // 立即执行一次清理
    removeTranslationAttributes();

    // 3. 修复翻译键重复显示问题
    const fixDuplicateText = () => {
      // 查找可能的重复文本节点
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
      );

      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        if (
          text &&
          (text.includes("语言语言") || text.includes("Language Language"))
        ) {
          // 修复重复的文本
          node.textContent = text
            .replace(/语言语言/g, "语言")
            .replace(/Language Language/g, "Language");
          logInfo(
            "[HydrationFix] 修复了重复文本:",
            { text },
            "HydrationFix/fixDuplicateText",
          );
        }
      }
    };

    // 执行文本修复
    fixDuplicateText();

    // 确保html元素有正确的类名
    if (!htmlElement.classList.contains("hydrated")) {
      htmlElement.classList.add("hydrated");
    }

    // 4. 监听DOM变化，持续清理扩展添加的属性
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as Element;
          const attributesToRemove = [
            "data-doubao-translate-traverse-mark",
            "data-google-translate",
            "data-translate",
            "data-microsoft-translate",
            "data-baidu-translate",
            "data-deepl-translate",
          ];
          attributesToRemove.forEach((attr) => {
            if (target.hasAttribute(attr)) {
              target.removeAttribute(attr);
              logInfo(
                `[HydrationFix] 动态移除了翻译扩展属性: ${attr}`,
                { attr },
                "HydrationFix/MutationObserver",
              );
            }
          });
        }
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const attributesToRemove = [
                "data-doubao-translate-traverse-mark",
                "data-google-translate",
                "data-translate",
                "data-microsoft-translate",
                "data-baidu-translate",
                "data-deepl-translate",
              ];
              attributesToRemove.forEach((attr) => {
                if (element.hasAttribute(attr)) {
                  element.removeAttribute(attr);
                  logInfo(
                    `[HydrationFix] 移除了新添加元素的翻译扩展属性: ${attr}`,
                    { attr },
                    "HydrationFix/MutationObserver",
                  );
                }
              });
            }
            // 修复新添加的文本节点中的重复文本
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent?.trim();
              if (
                text &&
                (text.includes("语言语言") ||
                  text.includes("Language Language"))
              ) {
                node.textContent = text
                  .replace(/语言语言/g, "语言")
                  .replace(/Language Language/g, "Language");
                logInfo(
                  "[HydrationFix] 修复了新添加节点的重复文本:",
                  { text },
                  "HydrationFix/MutationObserver",
                );
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: [
        "data-doubao-translate-traverse-mark",
        "data-google-translate",
        "data-translate",
        "data-microsoft-translate",
        "data-baidu-translate",
        "data-deepl-translate",
      ],
    });

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []);

  // 只在客户端渲染
  if (!isClient) {
    return null;
  }

  return null;
}
