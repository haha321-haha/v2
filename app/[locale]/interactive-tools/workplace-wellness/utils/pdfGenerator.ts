/**
 * HVsLYEp职场健康助手 - PDF生成器
 * 基于HTML格式生成PDF报告
 */

import { PeriodRecord, NutritionRecommendation, ExportType } from "../types";
import { getTranslations } from "next-intl/server";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

export interface PDFReportData {
  exportDate: string;
  locale: string;
  exportType: ExportType;
  periodData?: PeriodRecord[];
  nutritionData?: NutritionRecommendation[];
  allData?: {
    period: PeriodRecord[];
    nutrition: NutritionRecommendation[];
  };
}

export class PDFGenerator {
  private locale: string;
  private t: TFunction;

  constructor(locale: string, t: TFunction) {
    this.locale = locale;
    this.t = t;
  }

  /**
   * 生成HTML格式的PDF报告
   */
  generateHTMLReport(data: PDFReportData): string {
    return `
<!DOCTYPE html>
<html lang="${this.locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.t("pdf.reportTitle")}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }

        .report-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }

        .report-info h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 20px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .info-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .info-value {
            color: #333;
            font-size: 16px;
        }

        .data-section {
            margin-bottom: 30px;
        }

        .data-section h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 18px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .data-table th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
        }

        .data-table tr:hover {
            background: #f8f9fa;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-period {
            background: #e3f2fd;
            color: #1976d2;
        }

        .badge-predicted {
            background: #fff3e0;
            color: #f57c00;
        }

        .badge-warm {
            background: #ffebee;
            color: #d32f2f;
        }

        .badge-cool {
            background: #e3f2fd;
            color: #1976d2;
        }

        .badge-neutral {
            background: #e8f5e8;
            color: #388e3c;
        }

        .footer {
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }

        .privacy-notice {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 6px;
            padding: 15px;
            margin-top: 20px;
        }

        .privacy-notice h4 {
            color: #1976d2;
            margin-bottom: 10px;
        }

        @media print {
            body {
                padding: 0;
            }

            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }

            .data-table th {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${this.t("pdf.reportTitle")}</h1>
        <div class="subtitle">${this.t("pdf.reportSubtitle")}</div>
    </div>

    <div class="report-info">
        <h2>${this.t("pdf.reportInfo")}</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">${this.t("pdf.exportTime")}</div>
                <div class="info-value">${new Date(
                  data.exportDate,
                ).toLocaleString(
                  this.locale === "zh" ? "zh-CN" : "en-US",
                )}</div>
            </div>
            <div class="info-item">
                <div class="info-label">${this.t("pdf.exportType")}</div>
                <div class="info-value">${this.getExportTypeLabel(
                  data.exportType,
                )}</div>
            </div>
            <div class="info-item">
                <div class="info-label">${this.t("pdf.language")}</div>
                <div class="info-value">${this.t("pdf.languageValue")}</div>
            </div>
            <div class="info-item">
                <div class="info-label">${this.t("pdf.dataRecords")}</div>
                <div class="info-value">${this.getDataCount(data)}</div>
            </div>
        </div>
    </div>

    ${this.generateDataSections(data)}

    <div class="footer">
        <div class="privacy-notice">
            <h4>${this.t("pdf.privacyNotice")}</h4>
            <p>${this.t("pdf.privacyText")}</p>
        </div>
        <p style="margin-top: 15px;">
            ${this.t("pdf.generatedAt")}${new Date().toLocaleString(
              this.locale === "zh" ? "zh-CN" : "en-US",
            )}
        </p>
    </div>
</body>
</html>`;
  }

  /**
   * 获取导出类型标签
   */
  private getExportTypeLabel(type: ExportType): string {
    return this.t(`pdf.exportTypes.${type}`);
  }

  /**
   * 获取数据条数
   */
  private getDataCount(data: PDFReportData): string {
    const recordsLabel = this.t("pdf.records");

    switch (data.exportType) {
      case "period":
        return `${data.periodData?.length || 0} ${recordsLabel}`;
      case "nutrition":
        return `${data.nutritionData?.length || 0} ${recordsLabel}`;
      case "all":
        const periodCount = data.allData?.period.length || 0;
        const nutritionCount = data.allData?.nutrition.length || 0;
        return `${periodCount + nutritionCount} ${recordsLabel}`;
      default:
        return "0";
    }
  }

  /**
   * 生成数据部分
   */
  private generateDataSections(data: PDFReportData): string {
    let sections = "";

    if (data.exportType === "period" || data.exportType === "all") {
      sections += this.generatePeriodSection(
        data.periodData || data.allData?.period || [],
      );
    }

    if (data.exportType === "nutrition" || data.exportType === "all") {
      sections += this.generateNutritionSection(
        data.nutritionData || data.allData?.nutrition || [],
      );
    }

    return sections;
  }

  /**
   * 生成经期数据部分
   */
  private generatePeriodSection(periodData: PeriodRecord[]): string {
    if (periodData.length === 0) {
      return `
        <div class="data-section">
          <h3>${this.t("pdf.periodData")}</h3>
          <p style="color: #666; font-style: italic;">${this.t(
            "pdf.noPeriodData",
          )}</p>
        </div>
      `;
    }

    return `
      <div class="data-section">
        <h3>${this.t("pdf.periodData")}</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>${this.t("pdf.tableHeaders.date")}</th>
              <th>${this.t("pdf.tableHeaders.type")}</th>
              <th>${this.t("pdf.tableHeaders.painLevel")}</th>
              <th>${this.t("pdf.tableHeaders.flow")}</th>
              <th>${this.t("pdf.tableHeaders.notes")}</th>
            </tr>
          </thead>
          <tbody>
            ${periodData
              .map(
                (record) => `
              <tr>
                <td>${new Date(record.date).toLocaleDateString(
                  this.locale === "zh" ? "zh-CN" : "en-US",
                )}</td>
                <td>
                  <span class="badge ${
                    record.type === "period"
                      ? "badge-period"
                      : "badge-predicted"
                  }">
                    ${this.t(`pdf.recordTypes.${record.type}`)}
                  </span>
                </td>
                <td>${record.painLevel || "-"}</td>
                <td>${record.flow || "-"}</td>
                <td>${record.notes || "-"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * 生成营养数据部分
   */
  private generateNutritionSection(
    nutritionData: NutritionRecommendation[],
  ): string {
    if (nutritionData.length === 0) {
      return `
        <div class="data-section">
          <h3>${this.t("pdf.nutritionData")}</h3>
          <p style="color: #666; font-style: italic;">${this.t(
            "pdf.noNutritionData",
          )}</p>
        </div>
      `;
    }

    return `
      <div class="data-section">
        <h3>${this.t("pdf.nutritionData")}</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>${this.t("pdf.tableHeaders.foodName")}</th>
              <th>${this.t("pdf.tableHeaders.menstrualPhase")}</th>
              <th>${this.t("pdf.tableHeaders.holisticNature")}</th>
              <th>${this.t("pdf.tableHeaders.mainBenefits")}</th>
              <th>${this.t("pdf.tableHeaders.keyNutrients")}</th>
            </tr>
          </thead>
          <tbody>
            ${nutritionData
              .map(
                (item) => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${this.getPhaseLabel(item.phase)}</td>
                <td>
                  <span class="badge badge-${item.holisticNature}">
                    ${this.getHolisticNatureLabel(item.holisticNature)}
                  </span>
                </td>
                <td>${item.benefits.join(", ")}</td>
                <td>${item.nutrients.join(", ")}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * 获取经期阶段标签
   */
  private getPhaseLabel(phase: string): string {
    try {
      return this.t(`pdf.phases.${phase}`);
    } catch {
      return phase;
    }
  }

  /**
   * 获取整体健康性质标签
   */
  private getHolisticNatureLabel(nature: string): string {
    try {
      return this.t(`pdf.holisticNature.${nature}`);
    } catch {
      return nature;
    }
  }

  /**
   * 生成PDF并下载
   */
  async generateAndDownloadPDF(data: PDFReportData): Promise<void> {
    const htmlContent = this.generateHTMLReport(data);

    // 创建新窗口显示HTML内容
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();

      // 等待内容加载完成后打印
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
        }, 500);
      };
    }
  }

  /**
   * 生成PDF并跳转到下载中心
   */
  async generateAndRedirectToDownloads(data: PDFReportData): Promise<void> {
    const htmlContent = this.generateHTMLReport(data);

    // 创建blob URL
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // 跳转到下载中心并传递PDF数据
    const downloadUrl = `/${this.locale}/downloads?pdfData=${encodeURIComponent(
      JSON.stringify(data),
    )}`;
    window.open(downloadUrl, "_blank");

    // 清理blob URL
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
