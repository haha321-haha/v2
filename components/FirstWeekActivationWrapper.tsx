"use client";

import { useState, useEffect } from "react";
import FirstWeekActivation from "./FirstWeekActivation";

export default function FirstWeekActivationWrapper() {
  const [userTier, setUserTier] = useState<"free" | "pro">("free");

  useEffect(() => {
    // 检查用户是否是Pro
    const isPro = localStorage.getItem("luna_is_pro") === "true";
    setUserTier(isPro ? "pro" : "free");

    // 监听用户状态变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "luna_is_pro") {
        setUserTier(e.newValue === "true" ? "pro" : "free");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return <FirstWeekActivation userTier={userTier} />;
}






