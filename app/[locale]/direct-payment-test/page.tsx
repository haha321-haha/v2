"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DirectPaymentTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const testDirectPayment = async (plan: "monthly" | "yearly" | "oneTime") => {
    setLoading(true);
    setResult("");

    try {
      console.log("🧪 开始测试直接支付 API，计划:", plan);

      const response = await fetch("/api/lemonsqueezy/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          painPoint: "direct_test",
          assessmentScore: 0,
          source: "direct_test_page",
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        console.log("✅ 支付 API 成功响应:", data);
        setResult(
          `✅ 成功创建结账会话！\n\n结账 URL: ${data.url}\n\n点击下面的链接前往支付页面：`,
        );

        // 直接重定向到支付页面
        window.location.href = data.url;
      } else {
        console.error("❌ 支付 API 错误:", data);
        setResult(
          `❌ 支付失败：${data.error || "未知错误"}\n\n状态码: ${
            response.status
          }`,
        );
      }
    } catch (error) {
      console.error("❌ 请求失败:", error);
      setResult(
        `❌ 请求失败: ${error instanceof Error ? error.message : "未知错误"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            直接支付测试 - 确保实际支付可用
          </h1>

          <p className="text-gray-600 mb-6">
            这个页面直接调用 Lemon Squeezy API，确保没有任何东西阻止实际支付。
            点击下面的按钮测试真实的支付流程。
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Button
              onClick={() => testDirectPayment("monthly")}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "处理中..." : "测试月度订阅 ($4.99)"}
            </Button>

            <Button
              onClick={() => testDirectPayment("yearly")}
              disabled={loading}
              variant="outline"
            >
              {loading ? "处理中..." : "测试年度订阅 ($47.88)"}
            </Button>

            <Button
              onClick={() => testDirectPayment("oneTime")}
              disabled={loading}
              variant="ghost"
            >
              {loading ? "处理中..." : "测试一次性购买 ($4.99)"}
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.includes("✅")
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">重要说明</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>
                这些是真实的支付按钮，会创建实际的 Lemon Squeezy 结账会话
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>点击后将跳转到安全的 Lemon Squeezy 支付页面</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>您可以使用测试信用卡信息完成测试支付</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>测试卡号: 4242 4242 4242 4242</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>任何过期日期和 CVC 代码都可用于测试</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
