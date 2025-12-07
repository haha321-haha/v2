"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, Home, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  verifySubscriptionWithCache,
  subscriptionCache,
} from "@/lib/subscription";

export default function SuccessPage() {
  const t = useTranslations("payment.success");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isActivating, setIsActivating] = useState(true);
  const [orderId, setOrderId] = useState<string>("");
  const [activationComplete, setActivationComplete] = useState(false);

  useEffect(() => {
    const checkoutId = searchParams.get("checkout_id");
    const orderParam = searchParams.get("order_id");
    const userEmail = searchParams.get("user_email");

    // 设置订单信息
    if (checkoutId) setOrderId(checkoutId);
    if (orderParam) setOrderId(orderParam);

    // 从 URL 参数或 localStorage 获取邮箱
    const userEmailFromUrl = userEmail || searchParams.get("email");
    const storedEmail = localStorage.getItem("periodhub_email");
    const finalEmail = userEmailFromUrl || storedEmail || "";

    if (finalEmail) {
      // 保存邮箱到 localStorage
      localStorage.setItem("periodhub_email", finalEmail);

      // 清除缓存，确保获取最新状态
      subscriptionCache.clear(finalEmail);

      // 等待 Webhook 处理（通常 1-3 秒）
      setTimeout(async () => {
        try {
          const { hasSubscription } =
            await verifySubscriptionWithCache(finalEmail);
          if (hasSubscription) {
            setActivationComplete(true);
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000); // 显示成功信息 2 秒后跳转
          } else {
            // 如果订阅未激活，继续等待
            setTimeout(async () => {
              const retryResult = await verifySubscriptionWithCache(finalEmail);
              if (retryResult.hasSubscription) {
                setActivationComplete(true);
                setTimeout(() => {
                  router.push("/dashboard");
                }, 2000);
              } else {
                setIsActivating(false);
              }
            }, 3000); // 再等待 3 秒
          }
        } catch (error) {
          console.error("Failed to verify subscription:", error);
          setIsActivating(false);
        }
      }, 2000); // 初始等待 2 秒
    } else {
      setIsActivating(false);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 成功图标 */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            {isActivating ? (
              <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            ) : activationComplete ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <CheckCircle className="w-12 h-12 text-green-600" />
            )}
          </div>
        </div>

        {/* 标题和描述 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {activationComplete ? t("title") : t("description")}
        </h1>
        <p className="text-gray-600 mb-8">
          {isActivating
            ? "正在激活您的订阅，请稍候..."
            : activationComplete
              ? t("message")
              : "感谢您的购买！正在处理您的订阅..."}
        </p>

        {/* 订单信息 */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-2">{t("orderIdLabel")}</p>
            <p className="font-mono text-xs bg-white p-2 rounded border">
              {orderId}
            </p>
          </div>
        )}

        {/* 功能说明 */}
        {activationComplete && (
          <div className="bg-purple-50 rounded-lg p-4 mb-8 text-left">
            <h2 className="font-semibold text-purple-900 mb-3">
              您已获得以下功能：
            </h2>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>无限次健康评估</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>个性化营养计划</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>症状追踪与分析</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>健康报告导出</span>
              </li>
            </ul>
          </div>
        )}

        {/* 操作按钮 */}
        {!isActivating && (
          <div className="flex flex-col gap-3">
            {activationComplete && (
              <Link href="/dashboard" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <User className="w-4 h-4 mr-2" />
                  {t("goToDashboard")}
                </Button>
              </Link>
            )}

            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                {t("backToHome")}
              </Button>
            </Link>
          </div>
        )}

        {/* 支持信息 */}
        <div className="mt-8 text-xs text-gray-500">
          <p>如有问题，请联系客服</p>
          <p className="font-mono">support@periodhub.health</p>
        </div>
      </div>
    </div>
  );
}
