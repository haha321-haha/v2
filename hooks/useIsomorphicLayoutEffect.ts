import { useEffect, useLayoutEffect } from "react";

/**
 * 同构布局效果钩子
 * 在服务端使用useEffect，客户端使用useLayoutEffect
 * 避免SSR警告
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
