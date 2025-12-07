/**
 * AEO 监控系统 - Rich Results 验证趋势分析
 *
 * 功能：
 * 1. 解析 schema-validation.log 生成趋势数据
 * 2. 生成 HTML 报告片段
 * 3. 提供趋势分析和改进建议
 */

import fs from "fs";
import path from "path";
import { logInfo, logError } from "@/lib/debug-logger";

export interface ValidationResult {
  date: string;
  page: string;
  schema: string;
  tool: string;
  result: string;
  issues: string;
  priority: string;
  notes: string;
  score?: number;
}

export interface TrendData {
  totalPages: number;
  passedPages: number;
  warningPages: number;
  failedPages: number;
  averageScore: number;
  commonIssues: Array<{
    issue: string;
    count: number;
    affectedPages: string[];
  }>;
  dailyTrends: Array<{
    date: string;
    passed: number;
    warnings: number;
    failed: number;
    averageScore: number;
  }>;
}

export interface ReportData {
  validationTrend: TrendData;
  recentValidations: ValidationResult[];
  lastUpdated: string;
}

/**
 * 解析日志文件生成趋势数据
 */
export function parseValidationLog(
  logPath: string = "logs/schema-validation.log",
): TrendData {
  if (!fs.existsSync(logPath)) {
    return createEmptyTrendData();
  }

  const content = fs.readFileSync(logPath, "utf8");
  const lines = content
    .trim()
    .split("\n")
    .filter((line) => line.trim());

  const validations: ValidationResult[] = [];
  const dailyScores = new Map<string, number[]>();
  const issuesMap = new Map<string, { count: number; pages: Set<string> }>();

  lines.forEach((line) => {
    // 解析日志行: [2025-11-21T10:30:00.000Z] page=/path | schema=Type | tool=Tool | result=Result | issues=Issues | priority=Priority | notes=Notes
    const match = line.match(
      /^\[([^\]]+)\] page=([^|]+) \| schema=([^|]+) \| tool=([^|]+) \| result=([^|]+) \| issues=([^|]+) \| priority=([^|]+) \| notes=(.+)$/,
    );

    if (match) {
      const [, date, page, schema, tool, result, issues, priority, notes] =
        match;
      const day = date.split("T")[0];

      // 计算分数
      let score = 0;
      if (result.includes("✅") || result.includes("通过")) {
        score = 100;
      } else if (result.includes("⚠️") || result.includes("警告")) {
        score = 80;
      } else if (result.includes("❌") || result.includes("失败")) {
        score = 60;
      }

      // 从备注中提取分数（如果有）
      const scoreMatch = notes.match(/分数[：:]\s*(\d+)/);
      if (scoreMatch) {
        score = parseInt(scoreMatch[1]);
      }

      const validation: ValidationResult = {
        date,
        page: page.trim(),
        schema,
        tool,
        result,
        issues: issues.trim(),
        priority,
        notes: notes.trim(),
        score,
      };

      validations.push(validation);

      // 统计每日分数
      if (!dailyScores.has(day)) {
        dailyScores.set(day, []);
      }
      dailyScores.get(day)!.push(score);

      // 统计常见问题
      if (issues && issues !== "-" && issues.trim()) {
        if (!issuesMap.has(issues)) {
          issuesMap.set(issues, { count: 0, pages: new Set() });
        }
        const issueData = issuesMap.get(issues)!;
        issueData.count++;
        issueData.pages.add(page.trim());
      }
    }
  });

  if (validations.length === 0) {
    return createEmptyTrendData();
  }

  // 计算每日趋势
  const dailyTrends: TrendData["dailyTrends"] = [];
  dailyScores.forEach((scores, date) => {
    const dayValidations = validations.filter((v) => v.date.startsWith(date));
    const passed = dayValidations.filter(
      (v) => v.result.includes("✅") || v.result.includes("通过"),
    ).length;
    const warnings = dayValidations.filter(
      (v) => v.result.includes("⚠️") || v.result.includes("警告"),
    ).length;
    const failed = dayValidations.filter(
      (v) => v.result.includes("❌") || v.result.includes("失败"),
    ).length;
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    dailyTrends.push({
      date,
      passed,
      warnings,
      failed,
      averageScore,
    });
  });

  // 按日期排序
  dailyTrends.sort((a, b) => a.date.localeCompare(b.date));

  // 只保留最近7天的趋势
  const last7Days = dailyTrends.slice(-7);

  // 统计常见问题
  const commonIssues = Array.from(issuesMap.entries())
    .map(([issue, data]) => ({
      issue,
      count: data.count,
      affectedPages: Array.from(data.pages),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 计算总体数据
  const totalPages = validations.length;
  const passedPages = validations.filter(
    (v) => v.result.includes("✅") || v.result.includes("通过"),
  ).length;
  const warningPages = validations.filter(
    (v) => v.result.includes("⚠️") || v.result.includes("警告"),
  ).length;
  const failedPages = validations.filter(
    (v) => v.result.includes("❌") || v.result.includes("失败"),
  ).length;
  const averageScore =
    validations.reduce((sum, v) => sum + (v.score || 0), 0) / totalPages;

  return {
    totalPages,
    passedPages,
    warningPages,
    failedPages,
    averageScore,
    commonIssues,
    dailyTrends: last7Days,
  };
}

/**
 * 创建空的趋势数据
 */
function createEmptyTrendData(): TrendData {
  return {
    totalPages: 0,
    passedPages: 0,
    warningPages: 0,
    failedPages: 0,
    averageScore: 0,
    commonIssues: [],
    dailyTrends: [],
  };
}

/**
 * 生成 Rich Results 验证趋势的 HTML 报告片段
 */
export function generateRichResultsReport(trendData: TrendData): string {
  const passRate =
    trendData.totalPages > 0
      ? ((trendData.passedPages / trendData.totalPages) * 100).toFixed(1)
      : "0";
  const statusColor =
    trendData.averageScore >= 95
      ? "green"
      : trendData.averageScore >= 80
        ? "orange"
        : "red";

  return `
    <!-- RICH_RESULTS_TREND_REPORT_START -->
    <section id="rich-results-trend" class="report-section">
      <h2>🔍 Rich Results 验证趋势分析</h2>

      <div class="trend-summary">
        <div class="summary-cards">
          <div class="summary-card ${statusColor}">
            <h3>整体评分</h3>
            <div class="score">${trendData.averageScore.toFixed(1)}</div>
            <div class="pass-rate">通过率: ${passRate}%</div>
          </div>

          <div class="summary-card">
            <h3>页面统计</h3>
            <div class="stats">
              <div>总页面: <strong>${trendData.totalPages}</strong></div>
              <div class="passed">✅ 通过: ${trendData.passedPages}</div>
              <div class="warning">⚠️ 警告: ${trendData.warningPages}</div>
              <div class="failed">❌ 失败: ${trendData.failedPages}</div>
            </div>
          </div>

          <div class="summary-card">
            <h3>质量趋势</h3>
            <div class="trend-indicator ${getTrendIndicator(
              trendData.dailyTrends,
            )}">
              ${getTrendIcon(trendData.dailyTrends)}
              <span>${getTrendDescription(trendData.dailyTrends)}</span>
            </div>
          </div>
        </div>
      </div>

      ${generateTrendChart(trendData.dailyTrends)}
      ${generateCommonIssuesTable(trendData.commonIssues)}
      ${generateImprovementSuggestions(trendData)}

      <div class="last-updated">
        <small>最后更新: ${new Date().toLocaleString("zh-CN")}</small>
      </div>
    </section>

    <style>
      .report-section {
        margin: 30px 0;
        padding: 20px;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        background-color: #f8f9fa;
      }

      .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .summary-card {
        padding: 20px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .summary-card.green {
        border-left: 4px solid #28a745;
      }

      .summary-card.orange {
        border-left: 4px solid #fd7e14;
      }

      .summary-card.red {
        border-left: 4px solid #dc3545;
      }

      .score {
        font-size: 2em;
        font-weight: bold;
        color: #333;
      }

      .pass-rate {
        color: #666;
        font-size: 0.9em;
      }

      .stats {
        line-height: 1.6;
      }

      .passed { color: #28a745; }
      .warning { color: #fd7e14; }
      .failed { color: #dc3545; }

      .trend-indicator {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.1em;
      }

      .trend-up { color: #28a745; }
      .trend-stable { color: #6c757d; }
      .trend-down { color: #dc3545; }

      .chart-container {
        margin: 20px 0;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
      }

      .issues-table {
        width: 100%;
        margin: 20px 0;
        border-collapse: collapse;
        background-color: white;
      }

      .issues-table th,
      .issues-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e1e5e9;
      }

      .issues-table th {
        background-color: #f8f9fa;
        font-weight: 600;
      }

      .suggestions {
        margin: 20px 0;
        padding: 20px;
        background-color: #e8f4fd;
        border-left: 4px solid #0d6efd;
        border-radius: 4px;
      }

      .last-updated {
        margin-top: 20px;
        text-align: right;
        color: #6c757d;
      }
    </style>
    <!-- RICH_RESULTS_TREND_REPORT_END -->
  `;
}

/**
 * 生成趋势图表
 */
function generateTrendChart(dailyTrends: TrendData["dailyTrends"]): string {
  if (dailyTrends.length === 0) {
    return '<div class="chart-container"><p>暂无趋势数据</p></div>';
  }

  const maxScore = 100;
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;

  // 生成 SVG 路径
  const scorePath = dailyTrends
    .map((trend, index) => {
      const x =
        padding +
        (index * (chartWidth - 2 * padding)) / (dailyTrends.length - 1);
      const y =
        padding +
        (chartHeight - 2 * padding) * (1 - trend.averageScore / maxScore);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return `
    <div class="chart-container">
      <h3>📈 过去7天验证分数趋势</h3>
      <svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}">
        <!-- 网格线 -->
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${
          chartHeight - padding
        }" stroke="#e1e5e9" stroke-width="1"/>
        <line x1="${padding}" y1="${chartHeight - padding}" x2="${
          chartWidth - padding
        }" y2="${chartHeight - padding}" stroke="#e1e5e9" stroke-width="1"/>

        <!-- 分数线 -->
        <path d="${scorePath}" fill="none" stroke="#0d6efd" stroke-width="2"/>

        <!-- 数据点 -->
        ${dailyTrends
          .map((trend, index) => {
            const x =
              padding +
              (index * (chartWidth - 2 * padding)) / (dailyTrends.length - 1);
            const y =
              padding +
              (chartHeight - 2 * padding) * (1 - trend.averageScore / maxScore);
            return `
            <circle cx="${x}" cy="${y}" r="4" fill="#0d6efd">
              <title>${trend.date}: ${trend.averageScore.toFixed(1)}分</title>
            </circle>
          `;
          })
          .join("")}

        <!-- 标签 -->
        ${dailyTrends
          .map((trend, index) => {
            const x =
              padding +
              (index * (chartWidth - 2 * padding)) / (dailyTrends.length - 1);
            return `
            <text x="${x}" y="${
              chartHeight - 10
            }" text-anchor="middle" font-size="12" fill="#666">
              ${trend.date.slice(5)}
            </text>
          `;
          })
          .join("")}
      </svg>

      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-color passed"></div>
          <span>✅ 通过</span>
        </div>
        <div class="legend-item">
          <div class="legend-color warning"></div>
          <span>⚠️ 警告</span>
        </div>
        <div class="legend-item">
          <div class="legend-color failed"></div>
          <span>❌ 失败</span>
        </div>
      </div>
    </div>

    <style>
      .chart-container {
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        margin: 20px 0;
      }

      .chart-legend {
        display: flex;
        gap: 20px;
        margin-top: 15px;
        justify-content: center;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 3px;
      }

      .legend-color.passed { background-color: #28a745; }
      .legend-color.warning { background-color: #fd7e14; }
      .legend-color.failed { background-color: #dc3545; }
    </style>
  `;
}

/**
 * 生成常见问题表格
 */
function generateCommonIssuesTable(
  commonIssues: TrendData["commonIssues"],
): string {
  if (commonIssues.length === 0) {
    return '<div class="chart-container"><p>🎉 太棒了！暂未发现重复性问题</p></div>';
  }

  const rows = commonIssues
    .map(
      (issue) => `
    <tr>
      <td>${issue.issue}</td>
      <td>${issue.count}</td>
      <td>${issue.affectedPages.length}</td>
      <td>${issue.affectedPages.slice(0, 3).join(", ")}${
        issue.affectedPages.length > 3 ? "..." : ""
      }</td>
    </tr>
  `,
    )
    .join("");

  return `
    <div class="chart-container">
      <h3>🔧 常见问题分析</h3>
      <table class="issues-table">
        <thead>
          <tr>
            <th>问题描述</th>
            <th>出现次数</th>
            <th>影响页面</th>
            <th>相关页面</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * 生成改进建议
 */
function generateImprovementSuggestions(trendData: TrendData): string {
  const suggestions = [];

  if (trendData.averageScore < 80) {
    suggestions.push("整体验证分数偏低，建议优先修复高频率问题以提升整体质量");
  }

  if (trendData.commonIssues.length > 0) {
    suggestions.push(
      `关注重复出现的问题："${trendData.commonIssues[0].issue}"，可能需要系统性修复`,
    );
  }

  if (trendData.dailyTrends.length > 1) {
    const lastTwoDays = trendData.dailyTrends.slice(-2);
    if (lastTwoDays[1].averageScore < lastTwoDays[0].averageScore) {
      suggestions.push(
        "近期验证分数呈下降趋势，建议检查最近的代码变更是否引入了新问题",
      );
    } else {
      suggestions.push("验证分数呈上升趋势，继续保持当前的开发流程");
    }
  }

  if (suggestions.length === 0) {
    suggestions.push("整体状况良好，建议继续监控并优化验证覆盖率");
  }

  const suggestionItems = suggestions.map((s) => `<li>${s}</li>`).join("");

  return `
    <div class="suggestions">
      <h3>💡 改进建议</h3>
      <ul>${suggestionItems}</ul>
    </div>
  `;
}

/**
 * 获取趋势指示器
 */
function getTrendIndicator(dailyTrends: TrendData["dailyTrends"]): string {
  if (dailyTrends.length < 2) return "trend-stable";

  const recent = dailyTrends.slice(-3);
  const averageScore =
    recent.reduce((sum, d) => sum + d.averageScore, 0) / recent.length;
  const older = dailyTrends.slice(0, -3);

  if (older.length === 0) return "trend-stable";

  const olderScore =
    older.reduce((sum, d) => sum + d.averageScore, 0) / older.length;

  if (averageScore > olderScore + 2) return "trend-up";
  if (averageScore < olderScore - 2) return "trend-down";

  return "trend-stable";
}

/**
 * 获取趋势图标
 */
function getTrendIcon(dailyTrends: TrendData["dailyTrends"]): string {
  const indicator = getTrendIndicator(dailyTrends);

  switch (indicator) {
    case "trend-up":
      return "📈";
    case "trend-down":
      return "📉";
    default:
      return "➡️";
  }
}

/**
 * 获取趋势描述
 */
function getTrendDescription(dailyTrends: TrendData["dailyTrends"]): string {
  const indicator = getTrendIndicator(dailyTrends);

  switch (indicator) {
    case "trend-up":
      return "质量持续提升";
    case "trend-down":
      return "质量有所下降";
    default:
      return "质量保持稳定";
  }
}

/**
 * 更新监控报告
 */
export function updateMonitoringReport(
  reportPath: string = "reports/AEO-Monitoring-Report.html",
): boolean {
  try {
    // 解析趋势数据
    const trendData = parseValidationLog();

    // 生成 Rich Results 报告
    const richResultsReport = generateRichResultsReport(trendData);

    // 读取现有报告
    if (fs.existsSync(reportPath)) {
      const content = fs.readFileSync(reportPath, "utf8");

      // 查找插入位置
      const startMarker = "<!-- RICH_RESULTS_TREND_REPORT_START -->";
      const endMarker = "<!-- RICH_RESULTS_TREND_REPORT_END -->";

      const startIndex = content.indexOf(startMarker);
      const endIndex = content.indexOf(endMarker);

      if (startIndex !== -1 && endIndex !== -1) {
        // 更新现有报告
        const before = content.substring(0, startIndex);
        const after = content.substring(endIndex + endMarker.length);
        const newContent = before + richResultsReport + after;

        fs.writeFileSync(reportPath, newContent);
        logInfo(
          "✅ AEO 监控报告已更新",
          undefined,
          "aeo-monitoring-system/updateMonitoringReport",
        );
      } else {
        // 添加新的报告段
        const bodyEndIndex = content.lastIndexOf("</body>");
        if (bodyEndIndex !== -1) {
          const before = content.substring(0, bodyEndIndex);
          const after = content.substring(bodyEndIndex);
          const newContent = before + richResultsReport + after;

          fs.writeFileSync(reportPath, newContent);
          logInfo(
            "✅ Rich Results 趋势分析已添加到 AEO 监控报告",
            undefined,
            "aeo-monitoring-system/updateMonitoringReport",
          );
        }
      }
    } else {
      // 创建新报告
      const fullReport = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AEO 监控报告</title>
        </head>
        <body>
          <h1>AEO 监控报告</h1>
          ${richResultsReport}
        </body>
        </html>
      `;

      // 确保目录存在
      const dir = path.dirname(reportPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(reportPath, fullReport);
      logInfo(
        "✅ AEO 监控报告已创建",
        undefined,
        "aeo-monitoring-system/updateMonitoringReport",
      );
    }

    return true;
  } catch (error) {
    logError(
      "❌ 更新监控报告失败:",
      error,
      "aeo-monitoring-system/updateMonitoringReport",
    );
    return false;
  }
}

// 默认导出
const aeoMonitoringSystem = {
  parseValidationLog,
  generateRichResultsReport,
  updateMonitoringReport,
};

export default aeoMonitoringSystem;
