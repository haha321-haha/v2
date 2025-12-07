"use client";

import DoubaoExtensionHandler from "@/components/DoubaoExtensionHandler";

interface InteractiveToolsClientProps {
  children: React.ReactNode;
}

/**
 * InteractiveToolsClient - 交互工具页面客户端包装组件
 *
 * 处理水合错误和浏览器扩展问题
 */
export default function InteractiveToolsClient({
  children,
}: InteractiveToolsClientProps) {
  return (
    <>
      <DoubaoExtensionHandler />
      {children}
    </>
  );
}
