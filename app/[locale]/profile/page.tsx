"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  ArrowLeft,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  verifySubscriptionWithCache,
  type SubscriptionStatus,
} from "@/lib/subscription";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    // 获取用户邮箱
    const email = localStorage.getItem("periodhub_email") || "";
    setUserEmail(email);

    if (!email) {
      // 如果没有邮箱，重定向到首页
      router.push("/");
      return;
    }

    // 验证订阅状态
    verifySubscriptionWithCache(email)
      .then((status) => {
        setSubscriptionStatus(status);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("验证订阅状态失败:", error);
        setIsLoading(false);
      });
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载个人资料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回仪表板
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  首页
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              {t("user.name")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">邮箱:</span>
                <span className="font-medium">{userEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {t("user.memberSince.label")}:
                </span>
                <span className="font-medium">
                  {t("user.memberSince.value")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {t("user.subscription.label")}:
                </span>
                <span className="font-medium">
                  {subscriptionStatus?.type === "one_time"
                    ? "一次性购买"
                    : "PeriodHub Pro"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 账户设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              {t("settings.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">{t("settings.managePlan")}</h3>
                    <p className="text-sm text-gray-500">
                      {subscriptionStatus?.status === "active"
                        ? "管理您的订阅"
                        : "升级到 Pro"}
                    </p>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button variant="outline">
                    {subscriptionStatus?.status === "active" ? "管理" : "升级"}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">
                      {t("settings.notifications")}
                    </h3>
                    <p className="text-sm text-gray-500">管理通知偏好</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  即将推出
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">{t("settings.privacy")}</h3>
                    <p className="text-sm text-gray-500">隐私和安全设置</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  即将推出
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button className="flex-1 w-full">
              {t("actions.backToDashboard")}
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="flex-1 w-full">
              {t("actions.backToHome")}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
