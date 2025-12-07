"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  FileText,
  Settings,
  Heart,
  Calendar,
  TrendingUp,
  Loader2,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  verifySubscriptionWithCache,
  type SubscriptionStatus,
} from "@/lib/subscription";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
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

        if (!status.hasSubscription) {
          // 如果没有订阅，重定向到定价页面
          router.push("/pricing");
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("验证订阅状态失败:", error);
        // 验证失败，重定向到定价页面
        router.push("/pricing");
      });
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在加载您的仪表板...</p>
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
              <h1 className="text-xl font-bold text-gray-900">PeriodHub Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  个人资料
                </Button>
              </Link>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 欢迎信息 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("welcome")}
          </h2>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {t("cards.assessment.title")}
              </CardTitle>
              <CardDescription>
                {t("cards.assessment.description")}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href="/interactive-tools/symptom-assessment"
                className="w-full"
              >
                <Button className="w-full">{t("cards.assessment.cta")}</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                {t("cards.tracker.title")}
              </CardTitle>
              <CardDescription>
                {t("cards.tracker.description")}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/interactive-tools/pain-tracker" className="w-full">
                <Button className="w-full">{t("cards.tracker.cta")}</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                {t("cards.reports.title")}
              </CardTitle>
              <CardDescription>
                {t("cards.reports.description")}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href="/interactive-tools/nutrition-recommendation-generator"
                className="w-full"
              >
                <Button className="w-full">{t("cards.reports.cta")}</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                {t("cards.settings.title")}
              </CardTitle>
              <CardDescription>
                {t("cards.settings.description")}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/profile" className="w-full">
                <Button className="w-full" variant="outline">
                  {t("cards.settings.cta")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* 统计信息 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              {t("stats.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-600">
                  {t("stats.assessments")}
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-blue-600">
                  {t("stats.trackedDays")}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-green-600">
                  {t("stats.reports")}
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-red-600">{t("stats.streak")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 订阅信息 */}
        {subscriptionStatus && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Calendar className="w-5 h-5" />
                订阅状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-800">
                    订阅类型:{" "}
                    {subscriptionStatus.type === "one_time"
                      ? "一次性购买"
                      : "订阅"}
                  </p>
                  <p className="text-sm text-green-600">
                    状态:{" "}
                    {subscriptionStatus.status === "active"
                      ? "激活"
                      : subscriptionStatus.status}
                  </p>
                </div>
                <div className="text-sm text-green-600">
                  订阅ID: {subscriptionStatus.subscriptionId}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
