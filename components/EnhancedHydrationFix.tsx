"use client";

import { useEffect, useState } from "react";
import { logInfo } from "@/lib/debug-logger";

/**
 * 增强版 Hydration 修复组件
 * 专门解决豆包翻译扩展和其他浏览器扩展导致的 hydration 错误
 */
export default function EnhancedHydrationFix() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // 🔧 立即修复所有 hydration 相关问题（在组件挂载时立即执行）
    // 使用 requestAnimationFrame 确保在 DOM 完全加载后执行
    // 同时使用 setTimeout 确保在浏览器扩展修改 DOM 之前执行
    const fixHydrationIssues = () => {
      logInfo(
        "[EnhancedHydrationFix] 开始修复 hydration 问题...",
        undefined,
        "EnhancedHydrationFix/fixHydrationIssues",
      );

      // 1. 移除所有翻译扩展属性
      const removeTranslationAttributes = () => {
        const allElements = document.querySelectorAll("*");
        let removedCount = 0;

        allElements.forEach((element) => {
          const attributesToRemove = [
            "data-doubao-translate-traverse-mark",
            "data-google-translate",
            "data-translate",
            "data-microsoft-translate",
            "data-baidu-translate",
            "data-deepl-translate",
            "data-translate-id",
            "data-translate-translate",
          ];

          attributesToRemove.forEach((attr) => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
              removedCount++;
            }
          });
        });

        if (removedCount > 0) {
          logInfo(
            `[EnhancedHydrationFix] 移除了 ${removedCount} 个翻译扩展属性`,
            { removedCount },
            "EnhancedHydrationFix/removeTranslationAttributes",
          );
        }
      };

      // 2. 修复重复文本问题
      const fixDuplicateText = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
        );

        let fixedCount = 0;
        let node;

        while ((node = walker.nextNode())) {
          const originalText = node.textContent;
          if (originalText) {
            // 修复常见的重复文本模式
            let newText = originalText
              .replace(/语言语言/g, "语言")
              .replace(/Language Language/g, "Language")
              .replace(/English English/g, "English")
              .replace(/中文中文/g, "中文");

            // ✅ 特别处理 "PeriodHub ProPeriodHub Pro" 这种重复
            newText = newText.replace(
              /PeriodHub ProPeriodHub Pro/g,
              "PeriodHub Pro",
            );
            newText = newText.replace(/(PeriodHub Pro){2,}/g, "PeriodHub Pro");

            // ⚠️ 不要对 JavaScript 代码或 script 标签内的内容进行通用重复检测
            // 只对纯文本节点进行修复，避免破坏代码
            const parentElement = node.parentElement;
            if (
              parentElement &&
              (parentElement.tagName === "SCRIPT" ||
                parentElement.tagName === "STYLE" ||
                parentElement.closest("script") ||
                parentElement.closest("style"))
            ) {
              // 跳过 script 和 style 标签内的内容
              return;
            }

            // ✅ 只对明显的用户可见文本重复进行修复（保守策略）
            // 匹配重复的单词或短语（至少3个字符，避免误删代码）
            if (newText.length > 10) {
              // 处理包含特殊字符的文本（如 "Professional Health Articles & PDF Resource Library"）
              // 先处理没有空格的重复（直接连接）
              newText = newText.replace(
                /([A-Za-z][A-Za-z\s&,.\-]{10,}?)\1+/g,
                (match, group) => {
                  return group;
                },
              );

              // 再处理有空格分隔的重复
              if (/^[A-Za-z\s&,.\-]+$/.test(newText.trim())) {
                // 只处理看起来像用户文本的内容（字母、空格、&、逗号、点、连字符）
                newText = newText.replace(
                  /(.{10,}?)(\s+|&|\s*,\s*)\1+/g,
                  (_match, group1) => {
                    // 如果重复超过1次，只保留一次
                    return group1;
                  },
                );
              }
            }

            if (newText !== originalText) {
              node.textContent = newText;
              fixedCount++;
              logInfo(
                `[EnhancedHydrationFix] 修复重复文本: "${originalText}" -> "${newText}"`,
                { originalText, newText },
                "EnhancedHydrationFix/fixDuplicateText",
              );
            }
          }
        }

        if (fixedCount > 0) {
          logInfo(
            `[EnhancedHydrationFix] 修复了 ${fixedCount} 个重复文本问题`,
            { fixedCount },
            "EnhancedHydrationFix/fixDuplicateText",
          );
        }
      };

      // 3. 移除翻译扩展添加的类名
      const removeTranslationClasses = () => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        const extensionClasses = [
          "tongyi-design-pc",
          "tongyi-design-mobile",
          "alibaba-design",
          "taobao-design",
          "doubao-translate-active",
          "google-translate-active",
          "translate-extension-active",
          "translation-active",
        ];

        let removedClassCount = 0;

        [htmlElement, bodyElement].forEach((element) => {
          extensionClasses.forEach((className) => {
            if (element.classList.contains(className)) {
              element.classList.remove(className);
              removedClassCount++;
              logInfo(
                `[EnhancedHydrationFix] 移除了类名: ${className}`,
                { className },
                "EnhancedHydrationFix/removeTranslationClasses",
              );
            }
          });
        });

        if (removedClassCount > 0) {
          logInfo(
            `[EnhancedHydrationFix] 移除了 ${removedClassCount} 个扩展类名`,
            { removedClassCount },
            "EnhancedHydrationFix/removeTranslationClasses",
          );
        }
      };

      // 执行所有修复
      removeTranslationAttributes();
      fixDuplicateText();
      removeTranslationClasses();

      // 4. 设置 hydration 标记
      const htmlElement = document.documentElement;
      if (!htmlElement.classList.contains("hydrated")) {
        htmlElement.classList.add("hydrated");
      }

      logInfo(
        "[EnhancedHydrationFix] hydration 修复完成",
        undefined,
        "EnhancedHydrationFix/fixHydrationIssues",
      );
    };

    // 立即执行修复（使用 requestAnimationFrame 确保在浏览器渲染后执行）
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      // 立即执行一次
      fixHydrationIssues();

      // 使用 requestAnimationFrame 确保在下一帧执行
      requestAnimationFrame(() => {
        fixHydrationIssues();
      });

      // 延迟执行一次，确保捕获所有扩展添加的属性
      setTimeout(() => {
        fixHydrationIssues();
      }, 100);
    }

    // 5. 设置 MutationObserver 监听后续变化
    const observer = new MutationObserver((mutations) => {
      let needsFix = false;

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
              needsFix = true;
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
                  needsFix = true;
                }
              });
            }

            // 修复新添加的文本节点
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent;
              if (text) {
                // ⚠️ 跳过 script 和 style 标签内的内容
                const parentElement = (
                  node as Node & { parentElement?: Element | null }
                ).parentElement;
                if (
                  parentElement &&
                  (parentElement.tagName === "SCRIPT" ||
                    parentElement.tagName === "STYLE" ||
                    parentElement.closest?.("script") ||
                    parentElement.closest?.("style"))
                ) {
                  return;
                }

                let fixedText = text
                  .replace(/语言语言/g, "语言")
                  .replace(/Language Language/g, "Language")
                  .replace(/English English/g, "English")
                  .replace(/中文中文/g, "中文")
                  .replace(/PeriodHub ProPeriodHub Pro/g, "PeriodHub Pro")
                  .replace(/(PeriodHub Pro){2,}/g, "PeriodHub Pro");

                // ✅ 只对明显的用户可见文本重复进行修复（保守策略）
                if (fixedText.length > 10) {
                  // 处理包含特殊字符的文本（如 "Professional Health Articles & PDF Resource Library"）
                  // 先处理没有空格的重复（直接连接）
                  fixedText = fixedText.replace(
                    /([A-Za-z][A-Za-z\s&,.-]{10,}?)\1+/g,
                    (match, group) => {
                      return group;
                    },
                  );

                  // 再处理有空格分隔的重复
                  if (/^[A-Za-z\s&,.\-!?]+$/.test(fixedText.trim())) {
                    // 只处理看起来像用户文本的内容（字母、空格、&、逗号、点、连字符、感叹号、问号）
                    fixedText = fixedText.replace(
                      /(.{10,}?)(\s+|&|\s*,\s*)\1+/g,
                      (_match, group1) => {
                        // 如果重复超过1次，只保留一次
                        return group1;
                      },
                    );
                  }
                }

                if (fixedText !== text) {
                  node.textContent = fixedText;
                  needsFix = true;
                }
              }
            }
          });
        }

        if (mutation.type === "characterData") {
          const text = mutation.target.textContent;
          if (text) {
            // ⚠️ 跳过 script 和 style 标签内的内容
            const parentElement = (
              mutation.target as Node & { parentElement?: Element | null }
            ).parentElement;
            if (
              parentElement &&
              (parentElement.tagName === "SCRIPT" ||
                parentElement.tagName === "STYLE" ||
                parentElement.closest?.("script") ||
                parentElement.closest?.("style"))
            ) {
              return;
            }

            let fixedText = text
              .replace(/语言语言/g, "语言")
              .replace(/Language Language/g, "Language")
              .replace(/English English/g, "English")
              .replace(/中文中文/g, "中文")
              .replace(/PeriodHub ProPeriodHub Pro/g, "PeriodHub Pro")
              .replace(/(PeriodHub Pro){2,}/g, "PeriodHub Pro");

            // ✅ 只对明显的用户可见文本重复进行修复（保守策略）
            if (fixedText.length > 10) {
              // 处理包含特殊字符的文本（如 "Professional Health Articles & PDF Resource Library"）
              // 先处理没有空格的重复（直接连接）
              fixedText = fixedText.replace(
                /([A-Za-z][A-Za-z\s&,.-]{10,}?)\1+/g,
                (match, group) => {
                  return group;
                },
              );

              // 再处理有空格分隔的重复
              if (/^[A-Za-z\s&,.\-!?]+$/.test(fixedText.trim())) {
                // 只处理看起来像用户文本的内容（字母、空格、&、逗号、点、连字符、感叹号、问号）
                fixedText = fixedText.replace(
                  /(.{10,}?)(\s+|&|\s*,\s*)\1+/g,
                  (_match, group1) => {
                    // 如果重复超过1次，只保留一次
                    return group1;
                  },
                );
              }
            }

            if (fixedText !== text) {
              mutation.target.textContent = fixedText;
              needsFix = true;
            }
          }
        }
      });

      if (needsFix) {
        logInfo(
          "[EnhancedHydrationFix] 动态修复了 hydration 问题",
          undefined,
          "EnhancedHydrationFix/MutationObserver",
        );
      }
    });

    // 开始监听
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
