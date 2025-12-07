"use client";

import { useEffect } from "react";
import { logInfo } from "@/lib/debug-logger";

/**
 * DoubaoExtensionHandler - 豆包浏览器扩展处理器
 *
 * 解决豆包翻译扩展引起的水合错误问题
 * 通过检测和清理扩展添加的DOM属性来避免水合不匹配
 */
export default function DoubaoExtensionHandler() {
  useEffect(() => {
    // 检测并处理豆包扩展添加的属性
    const handleDoubaoExtension = () => {
      // 查找所有带有豆包扩展属性的元素
      const doubaoElements = document.querySelectorAll(
        "[data-doubao-translate-traverse-mark]",
      );

      if (doubaoElements.length > 0) {
        logInfo(
          "🐳 检测到豆包扩展，正在处理水合问题...",
          undefined,
          "DoubaoExtensionHandler/handleDoubaoExtension",
        );

        // 移除豆包扩展添加的属性，避免水合错误
        doubaoElements.forEach((element) => {
          element.removeAttribute("data-doubao-translate-traverse-mark");
        });

        logInfo(
          "✅ 豆包扩展属性已清理",
          undefined,
          "DoubaoExtensionHandler/handleDoubaoExtension",
        );
      }
    };

    // 页面加载完成后处理
    const timer = setTimeout(handleDoubaoExtension, 200);

    // 监听DOM变化，处理动态添加的元素
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-doubao-translate-traverse-mark"
        ) {
          handleDoubaoExtension();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-doubao-translate-traverse-mark"],
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // 这个组件不渲染任何内容，只处理副作用
  return null;
}
