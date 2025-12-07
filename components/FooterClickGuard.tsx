"use client";

import { useEffect } from "react";

export default function FooterClickGuard() {
  useEffect(() => {
    console.log("🛡️ FooterClickGuard 已启动");

    // 最高优先级的事件拦截器
    const ultimateClickInterceptor = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 检查是否点击的是 Footer 内的链接
      const footerLink = target.closest("footer a");

      if (footerLink) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // 设置所有可能的属性来阻止事件（兼容旧浏览器）
        if ("cancelBubble" in event) {
          (event as Event & { cancelBubble?: boolean }).cancelBubble = true;
        }
        if ("returnValue" in event) {
          (event as Event & { returnValue?: boolean }).returnValue = false;
        }

        const href = footerLink.getAttribute("href");
        if (href) {
          console.log("🚀 FooterClickGuard 拦截到点击:", href);

          // 强制导航
          window.location.replace(href);
        }

        return false;
      }
    };

    // 在多个阶段添加监听器
    const events = ["click", "mousedown", "mouseup"];

    events.forEach((eventType) => {
      // 捕获阶段 - 最高优先级
      document.addEventListener(eventType, ultimateClickInterceptor, true);
      // 冒泡阶段 - 备用
      document.addEventListener(eventType, ultimateClickInterceptor, false);
    });

    // 定期检查并重新绑定
    const interval = setInterval(() => {
      const footer = document.querySelector("footer");
      if (footer) {
        const links = footer.querySelectorAll("a");
        links.forEach((link) => {
          (link as HTMLElement).onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const href = (link as HTMLAnchorElement).getAttribute("href");
            if (href) {
              console.log("🔗 Footer 直接点击处理:", href);
              window.location.replace(href);
            }
            return false;
          };
        });
      }
    }, 2000);

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, ultimateClickInterceptor, true);
        document.removeEventListener(
          eventType,
          ultimateClickInterceptor,
          false,
        );
      });
      clearInterval(interval);
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}
