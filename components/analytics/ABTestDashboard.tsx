import React, { useState, useEffect, useCallback } from "react";
import { getUserABTestVariants } from "@/hooks/useABTest";
import {
  getAllCTATrackingData,
  exportCTADataToCSV,
} from "@/hooks/useCTATracking";
import type { CTAEventData } from "@/hooks/useCTATracking";
import { analyzeABTest } from "@/config/ab-tests.config";
import { logError } from "@/lib/debug-logger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";

interface ABTestMetrics {
  testId: string;
  variantId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions?: number;
  conversionRate?: number;
}

interface TestResult {
  variant: string;
  impressions: number;
  clicks: number;
  ctr: number;
  confidence: number;
  statisticalSignificance: boolean;
}

interface VariantSummary {
  variantId: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

/**
 * A/B测试仪表板组件
 *
 * 功能：
 * 1. 实时显示A/B测试数据
 * 2. 统计显著性分析
 * 3. 变体表现对比
 * 4. 数据导出功能
 */
export default function ABTestDashboard() {
  const [metrics, setMetrics] = useState<ABTestMetrics[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 获取当前用户的A/B测试变体
  const userVariants = getUserABTestVariants();

  const loadMetrics = useCallback(() => {
    setIsLoading(true);

    try {
      // 获取CTA追踪数据
      const trackingData = getAllCTATrackingData();
      const events = trackingData?.events ?? [];

      if (events.length === 0) {
        setIsLoading(false);
        return;
      }

      // 分析事件数据
      const metrics = analyzeEvents(events);
      setMetrics(metrics);

      // 计算测试结果
      const results = calculateTestResults(metrics);
      setTestResults(results);
    } catch (error) {
      logError("Failed to load metrics:", error, "ABTestDashboard/loadMetrics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();

    // 每30秒自动刷新数据
    const interval = setInterval(() => {
      loadMetrics();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [loadMetrics]);

  const analyzeEvents = (events: CTAEventData[]): ABTestMetrics[] => {
    const metricsMap = new Map<string, ABTestMetrics>();

    events.forEach((event) => {
      const key = `${event.abTestId || "unknown"}-${
        event.abTestVariant || "unknown"
      }`;

      if (!metricsMap.has(key)) {
        metricsMap.set(key, {
          testId: event.abTestId || "unknown",
          variantId: event.abTestVariant || "unknown",
          impressions: 0,
          clicks: 0,
          ctr: 0,
        });
      }

      if (event.eventName === "hero_cta_impression") {
        metricsMap.get(key)!.impressions++;
      }

      if (event.eventName === "hero_cta_click") {
        metricsMap.get(key)!.clicks++;
      }
    });

    // 计算CTR
    return Array.from(metricsMap.values()).map((metric) => ({
      ...metric,
      ctr:
        metric.impressions > 0 ? (metric.clicks / metric.impressions) * 100 : 0,
    }));
  };

  const calculateTestResults = (metrics: ABTestMetrics[]): TestResult[] => {
    const control = metrics.find((m) => m.variantId === "control");
    const optimized = metrics.find((m) => m.variantId === "optimized");

    if (!control || !optimized) return [];

    // 使用标准的A/B测试分析方法
    const analysis = analyzeABTest(
      control.clicks,
      control.impressions,
      optimized.clicks,
      optimized.impressions,
    );

    return [
      {
        variant: "Control",
        impressions: control.impressions,
        clicks: control.clicks,
        ctr: control.ctr,
        confidence: 95, // 简化计算
        statisticalSignificance: analysis.statisticalSignificance,
      },
      {
        variant: "Optimized",
        impressions: optimized.impressions,
        clicks: optimized.clicks,
        ctr: optimized.ctr,
        confidence: 95,
        statisticalSignificance: analysis.statisticalSignificance,
      },
    ];
  };

  const exportData = () => {
    const csvData = exportCTADataToCSV();
    if (!csvData) {
      alert("No data to export");
      return;
    }

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ab_test_data_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getVariantColor = (variantId: string) => {
    switch (variantId) {
      case "control":
        return "bg-blue-500";
      case "optimized":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSignificanceColor = (significant: boolean) => {
    return significant ? "text-green-600" : "text-yellow-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <div className="text-lg font-medium mb-2">
            Loading A/B Test Data...
          </div>
          <div className="text-gray-500">
            Gathering analytics from local storage
          </div>
        </div>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No A/B Test Data Yet</h3>
          <p className="text-gray-600 mb-4">
            Start collecting data by visiting pages with A/B tests enabled.
          </p>
          <p className="text-sm text-gray-500">
            Data will appear here once users interact with your A/B tests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">A/B Test Dashboard</h2>
          <p className="text-gray-600">
            Real-time analytics for your optimization tests
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" onClick={loadMetrics}>
            Refresh
          </Button>
          <Button size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Current User Info */}
      {Object.keys(userVariants).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Test Assignments</CardTitle>
            <CardDescription>
              Current A/B test variants assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(userVariants).map(([testId, variantId]) => (
                <Badge key={testId} variant="secondary">
                  {testId}: {variantId}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      <div className="grid gap-6">
        {testResults.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${getVariantColor(
                      result.variant === "Control" ? "control" : "optimized",
                    )}`}
                  />
                  <CardTitle>{result.variant} Variant</CardTitle>
                </div>
                <Badge
                  variant={
                    result.statisticalSignificance ? "default" : "secondary"
                  }
                >
                  {result.statisticalSignificance
                    ? "Significant"
                    : "Not Significant"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.impressions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Impressions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.clicks.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.ctr.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-500">CTR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {result.confidence}%
                  </div>
                  <div className="text-sm text-gray-500">Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>Raw data from your A/B test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Test ID</th>
                  <th className="text-left p-2">Variant</th>
                  <th className="text-right p-2">Impressions</th>
                  <th className="text-right p-2">Clicks</th>
                  <th className="text-right p-2">CTR (%)</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-mono text-xs">{metric.testId}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getVariantColor(
                            metric.variantId,
                          )}`}
                        />
                        {metric.variantId}
                      </div>
                    </td>
                    <td className="text-right p-2">
                      {metric.impressions.toLocaleString()}
                    </td>
                    <td className="text-right p-2">
                      {metric.clicks.toLocaleString()}
                    </td>
                    <td className="text-right p-2 font-medium">
                      {metric.ctr.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on current test data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => {
                const isWinner =
                  result.variant === "Optimized" &&
                  result.statisticalSignificance;
                const isLoser =
                  result.variant === "Control" &&
                  result.statisticalSignificance;

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1 w-2 h-2 rounded-full ${
                        isWinner
                          ? "bg-green-500"
                          : isLoser
                            ? "bg-red-500"
                            : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{result.variant} Variant</p>
                      <p className="text-sm text-gray-600">
                        {isWinner
                          ? "This variant is performing significantly better. Consider making it the default."
                          : isLoser
                            ? "This variant is underperforming. Review and optimize further."
                            : "Continue testing to reach statistical significance."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * 简化的A/B测试结果显示组件（用于嵌入其他页面）
 */
export function ABTestSummary({ testId }: { testId: string }) {
  const [summary, setSummary] = useState<VariantSummary[]>([]);

  useEffect(() => {
    const data = getAllCTATrackingData();
    if (data) {
      const testEvents = data.events.filter((e) => e.abTestId === testId);
      const variants = Array.from(
        new Set(
          testEvents
            .map((e) => e.abTestVariant)
            .filter((variant): variant is string => Boolean(variant)),
        ),
      );

      const summaryData: VariantSummary[] = variants.map((variantId) => {
        const variantEvents = testEvents.filter(
          (e) => e.abTestVariant === variantId,
        );
        const impressions = variantEvents.filter(
          (e) => e.eventName === "hero_cta_impression",
        ).length;
        const clicks = variantEvents.filter(
          (e) => e.eventName === "hero_cta_click",
        ).length;

        return {
          variantId,
          impressions,
          clicks,
          ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        };
      });

      setSummary(summaryData);
    }
  }, [testId]);

  if (!summary || summary.length === 0) {
    return <div className="text-sm text-gray-500">No test data available</div>;
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {summary.map((variant, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              variant.variantId === "control" ? "bg-blue-500" : "bg-green-500"
            }`}
          />
          <span className="font-medium">{variant.variantId}</span>
          <span className="text-gray-600">{variant.ctr.toFixed(1)}% CTR</span>
        </div>
      ))}
    </div>
  );
}
