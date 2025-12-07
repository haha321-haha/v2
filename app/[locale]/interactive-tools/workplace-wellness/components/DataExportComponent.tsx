/**
 * HVsLYEp职场健康助手 - 数据导出组件
 * 基于HVsLYEp的DataExportComponent函数设计
 */

"use client";

import { useState } from "react";
import {
  Download,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  FileImage,
  Lock,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  useExport,
  useWorkplaceWellnessActions,
  useCalendar,
} from "../hooks/useWorkplaceWellnessStore";
import { useLocale } from "next-intl";
import { getNutritionData } from "../data";
import { useTranslations } from "next-intl";
import {
  ExportFormat,
  ExportType,
  CalendarState,
  ExportConfig,
  PeriodRecord,
  NutritionRecommendation,
} from "../types";
import { PDFGenerator, PDFReportData } from "../utils/pdfGenerator";
import { PrivacyProtectionManager } from "../utils/privacyProtection";
import { logError } from "@/lib/debug-logger";

export default function DataExportComponent() {
  const exportConfig = useExport() as ExportConfig;
  const locale = useLocale();
  const calendar = useCalendar() as CalendarState;
  const { updateExport, setExporting } = useWorkplaceWellnessActions();
  const t = useTranslations("workplaceWellness");

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [password, setPassword] = useState("");
  const [privacyManager] = useState(
    () => new PrivacyProtectionManager(locale, undefined, t),
  );

  // 从 store 读取 periodData
  const periodData = calendar.periodData || [];
  const nutritionData = getNutritionData();

  // 导出类型选择
  const handleExportTypeChange = (type: ExportType) => {
    updateExport({ exportType: type });
  };

  // 导出格式选择
  const handleExportFormatChange = (format: ExportFormat) => {
    updateExport({ format });
  };

  // 生成导出数据
  type ExportPayload =
    | {
        type: "period";
        data: PeriodRecord[];
      }
    | {
        type: "nutrition";
        data: NutritionRecommendation[];
      }
    | {
        type: "all";
        data: {
          period: PeriodRecord[];
          nutrition: NutritionRecommendation[];
        };
      };

  const generateExportData = (): ExportPayload => {
    const baseData = {
      exportDate: new Date().toISOString(),
      locale: locale,
      version: "1.0.0",
    };

    switch (exportConfig.exportType) {
      case "period":
        return {
          ...baseData,
          type: "period",
          data: periodData,
        };
      case "nutrition":
        return {
          ...baseData,
          type: "nutrition",
          data: nutritionData,
        };
      case "all":
        return {
          ...baseData,
          type: "all",
          data: {
            period: periodData,
            nutrition: nutritionData,
          },
        };
      default:
        return {
          ...baseData,
          type: "all" as const,
          data: {
            period: periodData,
            nutrition: nutritionData,
          },
        };
    }
  };

  // 导出为JSON
  const exportAsJSON = (data: ExportPayload) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workplace-wellness-${exportConfig.exportType}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出为CSV
  const exportAsCSV = (data: {
    type: string;
    data: PeriodRecord[] | NutritionRecommendation[];
  }) => {
    let csvContent = "";

    if (data.type === "period") {
      csvContent = "Date,Type,Pain Level,Flow\n";
      data.data.forEach((record) => {
        csvContent += `${record.date},${record.type},${
          record.painLevel ?? ""
        },${record.flow ?? ""}\n`;
      });
    } else if (data.type === "nutrition") {
      csvContent = "Name,Phase,Holistic Nature,Benefits,Nutrients\n";
      data.data.forEach((item) => {
        csvContent += `"${item.name}","${item.phase}","${
          item.holisticNature
        }","${item.benefits.join("; ")}","${item.nutrients.join("; ")}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workplace-wellness-${exportConfig.exportType}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出为PDF（使用HTML格式）
  const exportAsPDF = async (data: ExportPayload) => {
    try {
      const pdfGenerator = new PDFGenerator(locale, t);
      const pdfData: PDFReportData = {
        exportDate: new Date().toISOString(),
        locale: locale,
        exportType: exportConfig.exportType,
        periodData:
          data.type === "period"
            ? data.data
            : data.type === "all"
              ? data.data.period
              : undefined,
        nutritionData:
          data.type === "nutrition"
            ? data.data
            : data.type === "all"
              ? data.data.nutrition
              : undefined,
        allData: data.type === "all" ? data.data : undefined,
      };

      // 使用新的PDF生成器
      await pdfGenerator.generateAndDownloadPDF(pdfData);
    } catch (error) {
      logError("Failed to generate PDF", error, "DataExportComponent");
      alert(t("export.errorMessage"));
    }
  };

  // 执行导出（带隐私保护）
  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus("idle");
    setExporting(true);

    try {
      // 检查导出权限
      const hasPermission = await privacyManager.checkExportPermission(
        exportConfig.exportType,
        password,
      );
      if (!hasPermission) {
        throw new Error(t("export.permissionDenied"));
      }

      const data = generateExportData();

      // 应用隐私保护
      // ExportPayload 包含额外的元数据字段（exportDate, locale, version），
      // 但 maskSensitiveData 只需要核心数据字段，所以我们需要提取核心数据部分
      // 使用条件分支来明确类型，避免联合类型问题
      type MaskableData =
        | { data: PeriodRecord[] }
        | { data: NutritionRecommendation[] }
        | { period?: PeriodRecord[]; nutrition?: NutritionRecommendation[] };

      let maskableData: MaskableData;
      if (data.type === "all") {
        maskableData = {
          period: data.data.period,
          nutrition: data.data.nutrition,
        };
      } else if (data.type === "period") {
        maskableData = { data: data.data };
      } else {
        // data.type === "nutrition"
        maskableData = { data: data.data };
      }

      const maskedCoreData = privacyManager.maskSensitiveData(
        maskableData as Parameters<typeof privacyManager.maskSensitiveData>[0],
        exportConfig.exportType,
      );

      // 将脱敏后的核心数据重新组合回 ExportPayload 格式
      const protectedData: ExportPayload =
        data.type === "all"
          ? {
              ...data,
              data: {
                period:
                  "period" in maskedCoreData
                    ? maskedCoreData.period || []
                    : data.data.period,
                nutrition:
                  "nutrition" in maskedCoreData
                    ? maskedCoreData.nutrition || []
                    : data.data.nutrition,
              },
            }
          : data.type === "period"
            ? {
                type: "period" as const,
                data:
                  "data" in maskedCoreData &&
                  Array.isArray(maskedCoreData.data) &&
                  maskedCoreData.data.length > 0 &&
                  "date" in maskedCoreData.data[0]
                    ? (maskedCoreData.data as PeriodRecord[])
                    : data.data,
              }
            : {
                type: "nutrition" as const,
                data:
                  "data" in maskedCoreData &&
                  Array.isArray(maskedCoreData.data) &&
                  maskedCoreData.data.length > 0 &&
                  "name" in maskedCoreData.data[0]
                    ? (maskedCoreData.data as NutritionRecommendation[])
                    : data.data,
              };

      // 模拟导出延迟
      await new Promise((resolve) => setTimeout(resolve, 2000));

      switch (exportConfig.format) {
        case "json":
          exportAsJSON(protectedData);
          break;
        case "csv":
          // Handle "all" type by exporting period data only for CSV
          if (protectedData.type === "all") {
            exportAsCSV({
              type: "period",
              data: protectedData.data.period,
            });
          } else {
            exportAsCSV(
              protectedData as {
                type: string;
                data: PeriodRecord[] | NutritionRecommendation[];
              },
            );
          }
          break;
        case "pdf":
          exportAsPDF(protectedData);
          break;
        default:
          throw new Error("Unsupported export format");
      }

      setExportStatus("success");
      alert(t("export.successMessage"));
    } catch (error) {
      logError("Data export failed", error, "DataExportComponent");
      setExportStatus("error");
      alert(error instanceof Error ? error.message : t("export.errorMessage"));
    } finally {
      setIsExporting(false);
      setExporting(false);
    }
  };

  // 获取格式图标
  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "json":
        return <FileText className="w-4 h-4" />;
      case "csv":
        return <FileSpreadsheet className="w-4 h-4" />;
      case "pdf":
        return <FileImage className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <h4 className="text-lg font-semibold text-neutral-900 mb-4">
        {t("export.title")}
      </h4>

      <div className="space-y-4">
        {/* 导出内容选择 */}
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">
            {t("export.contentLabel")}
          </label>
          <div className="space-y-2">
            {(["period", "nutrition", "all"] as ExportType[]).map((typeId) => (
              <label
                key={typeId}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  exportConfig.exportType === typeId
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="exportType"
                  value={typeId}
                  checked={exportConfig.exportType === typeId}
                  onChange={() => handleExportTypeChange(typeId)}
                  className="mt-1 text-primary-500 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-neutral-900">
                    {t(`export.types.${typeId}`)}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {t(`export.types.${typeId}_desc`)}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 导出格式选择 */}
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">
            {t("export.formatLabel")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["json", "csv", "pdf"] as ExportFormat[]).map((formatId) => (
              <button
                key={formatId}
                onClick={() => handleExportFormatChange(formatId)}
                className={`p-3 text-center rounded-lg border-2 transition-colors duration-200 ${
                  exportConfig.format === formatId
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {getFormatIcon(formatId)}
                </div>
                <div className="font-medium text-neutral-900">
                  {t(`export.formats.${formatId}`)}
                </div>
                <div className="text-xs text-neutral-600">
                  {t(`export.formats.${formatId}_desc`)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 导出按钮 */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 text-base ${
            isExporting
              ? "bg-primary-500/50 cursor-not-allowed"
              : "bg-primary-500 hover:bg-primary-600"
          } text-white`}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t("export.exportingButton")}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {t("export.exportButton")}
            </>
          )}
        </button>

        {/* 隐私保护设置 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex gap-3 mb-3">
            <ShieldCheck className="text-blue-500 mt-0.5 w-5 h-5 flex-shrink-0" />
            <div className="text-sm flex-1">
              <div className="font-medium text-blue-900">
                {t("export.privacyTitle")}
              </div>
              <div className="text-blue-700 mt-1">
                {t("export.privacyContent")}
              </div>
            </div>
            <button
              onClick={() => setShowPrivacySettings(!showPrivacySettings)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showPrivacySettings
                ? t("export.hideSettings")
                : t("export.showSettings")}
            </button>
          </div>

          {/* 隐私设置面板 */}
          {showPrivacySettings && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t("export.enablePassword")}
                  </label>
                  <input
                    type="checkbox"
                    checked={privacyManager.getSettings().requirePassword}
                    onChange={(e) => {
                      const newSettings = { requirePassword: e.target.checked };
                      privacyManager.updateSettings(newSettings);
                    }}
                    className="rounded"
                  />
                </div>

                {privacyManager.getSettings().requirePassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("export.passwordLabel")}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("export.passwordPlaceholder")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t("export.enableMasking")}
                  </label>
                  <input
                    type="checkbox"
                    checked={privacyManager.getSettings().enableDataMasking}
                    onChange={(e) => {
                      const newSettings = {
                        enableDataMasking: e.target.checked,
                      };
                      privacyManager.updateSettings(newSettings);
                    }}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 安全警告 */}
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2">
              <AlertTriangle className="text-yellow-600 mt-0.5 w-4 h-4 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-yellow-800 mb-1">
                  {t("export.securityWarnings")}
                </div>
                <ul className="text-yellow-700 space-y-1">
                  {privacyManager
                    .generateSecurityWarnings(exportConfig.exportType)
                    .map((warning, index) => (
                      <li key={index} className="text-xs">
                        • {warning}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 导出状态 */}
        {exportStatus === "success" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800">
              ✅ {t("export.successMessage")}
            </div>
          </div>
        )}

        {exportStatus === "error" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">
              ❌ {t("export.errorMessage")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
