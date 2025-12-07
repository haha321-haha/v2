/**
 * HVsLYEp职场健康助手 - 工作影响追踪组件
 * 基于HVsLYEp的WorkImpactTracker函数设计
 */

"use client";

import { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import {
  useWorkImpact,
  useWorkplaceWellnessActions,
} from "../hooks/useWorkplaceWellnessStore";
import { useLocale } from "next-intl";
import { getLeaveTemplates } from "../data";
import { useTranslations } from "next-intl";
import { LeaveTemplate, WorkImpactData } from "../types";
import { logError } from "@/lib/debug-logger";

export default function WorkImpactComponent() {
  const workImpact = useWorkImpact();
  const locale = useLocale();
  const { updateWorkImpact, selectTemplate } = useWorkplaceWellnessActions();
  const t = useTranslations("workplaceWellness");

  const templates = getLeaveTemplates(locale);
  const [selectedTemplate, setSelectedTemplate] =
    useState<LeaveTemplate | null>(null);

  // 基于HVsLYEp的getBadgeVariant函数
  const getBadgeVariant = (level: number, type: "pain" | "efficiency") => {
    if (type === "pain")
      return level > 7 ? "danger" : level > 4 ? "warning" : "success";
    if (type === "efficiency")
      return level > 80 ? "success" : level > 60 ? "warning" : "danger";
    return "default";
  };

  // 获取徽章样式类
  const getBadgeClasses = (level: number, type: "pain" | "efficiency") => {
    const variant = getBadgeVariant(level, type);
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (variant) {
      case "success":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "warning":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "danger":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // 更新疼痛等级
  const handlePainLevelChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const level = Number(event.target.value);
    if (Number.isNaN(level)) return;
    const safeLevel = Math.min(
      Math.max(level, 0),
      10,
    ) as WorkImpactData["painLevel"];
    updateWorkImpact({ painLevel: safeLevel });
  };

  // 更新工作效率
  const handleEfficiencyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const efficiency = parseInt(event.target.value);
    updateWorkImpact({ efficiency });
  };

  // 选择模板
  const handleTemplateSelect = (template: LeaveTemplate) => {
    setSelectedTemplate(template);
    selectTemplate(template.id);
  };

  // 复制模板内容
  const handleCopyTemplate = (template: LeaveTemplate) => {
    const content = `${template.subject}\n\n${template.content}`;
    navigator.clipboard.writeText(content).catch(() => {
      // Silently ignore clipboard errors
    });
  };

  // 保存工作影响记录
  const handleSaveRecord = async (e: React.FormEvent) => {
    // 阻止默认行为和事件冒泡
    e.preventDefault();
    e.stopPropagation();

    try {
      // 工作影响数据已经通过 updateWorkImpact 更新到 store 中
      // 这里我们只需要确认数据已更新

      // 验证数据有效性
      const painLevel = workImpact.painLevel ?? 0;
      if (painLevel < 0 || painLevel > 10) {
        alert(
          locale === "zh"
            ? "疼痛等级必须在0-10之间。"
            : "Pain level must be between 0 and 10.",
        );
        return;
      }

      if (
        (workImpact.efficiency ?? 100) < 0 ||
        (workImpact.efficiency ?? 100) > 100
      ) {
        alert(
          locale === "zh"
            ? "工作效率必须在0-100%之间。"
            : "Work efficiency must be between 0-100%.",
        );
        return;
      }

      // 显示成功提示
      alert(
        locale === "zh"
          ? "工作影响记录已保存。"
          : "Work impact record saved successfully.",
      );
    } catch (error) {
      // 错误处理
      logError("保存工作影响记录时出错", error, "WorkImpactComponent");
      alert(
        locale === "zh"
          ? "保存工作影响记录时出错，请重试。"
          : "An error occurred while saving the work impact record. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 工作影响追踪 - 基于HVsLYEp的WorkImpactTracker设计 */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h4 className="text-lg font-semibold text-neutral-900 mb-4">
          {t("workImpact.title")}
        </h4>
        <div className="space-y-4">
          {/* 疼痛等级 */}
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              {t("workImpact.painLevel")}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                {/* 渐变背景轨道 - 绿色到红色 */}
                <div className="absolute inset-0 h-3 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-lg top-1/2 transform -translate-y-1/2"></div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={workImpact.painLevel ?? 1}
                  onChange={handlePainLevelChange}
                  className="relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10 pain-slider"
                />
              </div>
              <div className="w-12 text-center">
                <span
                  className={getBadgeClasses(workImpact.painLevel ?? 0, "pain")}
                >
                  {workImpact.painLevel ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* 工作效率 */}
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              {t("workImpact.efficiency")}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                {/* 渐变背景轨道 - 红色到绿色 */}
                <div className="absolute inset-0 h-3 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 to-green-400 rounded-lg top-1/2 transform -translate-y-1/2"></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={workImpact.efficiency ?? 100}
                  onChange={handleEfficiencyChange}
                  className="relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10 efficiency-slider"
                />
              </div>
              <div className="w-16 text-center">
                <span
                  className={getBadgeClasses(
                    workImpact.efficiency ?? 100,
                    "efficiency",
                  )}
                >
                  {workImpact.efficiency ?? 100}%
                </span>
              </div>
            </div>
          </div>

          {/* 工作调整选项 */}
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              {t("workImpact.adjustment")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "takeLeave",
                "workFromHome",
                "postponeMeeting",
                "reduceTasks",
              ].map((optionKey: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  className="rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-3 py-1.5 text-sm border border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                >
                  {t(`workImpact.adjustOptions.${optionKey}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <button
          type="button"
          onClick={handleSaveRecord}
          className="w-full mt-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 text-base bg-primary-500 hover:bg-primary-600 text-white"
        >
          <CheckCircle className="w-4 h-4" />
          {t("workImpact.saveButton")}
        </button>
      </div>

      {/* 请假模板 - 基于HVsLYEp的模板设计 */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h4 className="text-lg font-semibold text-neutral-900 mb-4">
          {t("workImpact.templatesTitle")}
        </h4>
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                workImpact.selectedTemplateId === template.id
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-neutral-900">
                    {template.title}
                  </h5>
                  <p className="text-sm text-neutral-600 mt-1">
                    {t("workImpact.subject")} {template.subject}
                  </p>
                </div>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    template.severity === "mild"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {t(`workImpact.severity.${template.severity}`)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 模板预览 - 基于HVsLYEp的预览设计 */}
        {selectedTemplate && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <h6 className="font-medium text-neutral-900 mb-2">
              {t("workImpact.preview")}
            </h6>
            <div className="text-sm space-y-2">
              <div>
                <strong>{t("workImpact.subject")}</strong>{" "}
                {selectedTemplate.subject}
              </div>
              <div>
                <strong>{t("workImpact.content")}</strong>
              </div>
              <div className="text-neutral-800 leading-relaxed">
                {selectedTemplate.content}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyTemplate(selectedTemplate)}
              className="mt-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Copy className="w-4 h-4" />
              {t("workImpact.copyButton")}
            </button>
          </div>
        )}
      </div>

      {/* 自定义滑块样式 */}
      <style jsx>{`
        .pain-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #6b7280;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .pain-slider::-webkit-slider-thumb:hover {
          border-color: #9333ea;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transform: scale(1.1);
        }

        .pain-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #6b7280;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          -moz-appearance: none;
        }

        .pain-slider::-moz-range-thumb:hover {
          border-color: #9333ea;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transform: scale(1.1);
        }

        .pain-slider::-moz-range-track {
          background: transparent;
          height: 12px;
        }

        .efficiency-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #6b7280;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .efficiency-slider::-webkit-slider-thumb:hover {
          border-color: #9333ea;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transform: scale(1.1);
        }

        .efficiency-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #6b7280;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          -moz-appearance: none;
        }

        .efficiency-slider::-moz-range-thumb:hover {
          border-color: #9333ea;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transform: scale(1.1);
        }

        .efficiency-slider::-moz-range-track {
          background: transparent;
          height: 12px;
        }
      `}</style>
    </div>
  );
}
