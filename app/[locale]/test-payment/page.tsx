"use client";

import { Button } from "@/components/ui/button";
import "@/lib/pro-upgrade-handler"; // 确保全局函数可用

export default function TestPaymentPage() {
  const handleTestPayment = () => {
    if (window.handleProUpgrade) {
      window.handleProUpgrade({
        plan: "monthly",
        painPoint: "test_page",
        assessmentScore: 0,
        source: "test_page",
      });
    } else {
      alert("支付功能尚未加载完成，请刷新页面重试");
    }
  };

  const handleYearlyPayment = () => {
    if (window.handleProUpgrade) {
      window.handleProUpgrade({
        plan: "yearly",
        painPoint: "test_page",
        assessmentScore: 0,
        source: "test_page",
      });
    } else {
      alert("支付功能尚未加载完成，请刷新页面重试");
    }
  };

  const handleOneTimePayment = () => {
    if (window.handleProUpgrade) {
      window.handleProUpgrade({
        plan: "oneTime",
        painPoint: "test_page",
        assessmentScore: 0,
        source: "test_page",
      });
    } else {
      alert("支付功能尚未加载完成，请刷新页面重试");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">支付功能测试</h1>

        <p className="text-gray-600 mb-6">
          点击下面的按钮测试支付功能是否正常工作。
        </p>

        <div className="space-y-3">
          <Button
            onClick={handleTestPayment}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            测试月度订阅支付
          </Button>

          <Button
            onClick={handleYearlyPayment}
            variant="outline"
            className="w-full"
          >
            测试年度订阅支付
          </Button>

          <Button
            onClick={handleOneTimePayment}
            variant="ghost"
            className="w-full"
          >
            测试一次性购买
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            注意：这是一个测试页面，用于验证支付功能集成。
          </p>
        </div>
      </div>
    </div>
  );
}
