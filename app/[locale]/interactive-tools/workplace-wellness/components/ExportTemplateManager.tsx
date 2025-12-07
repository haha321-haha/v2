"use client";

import { useState } from "react";
import { FileText, Plus, Edit, Trash2, Copy, Save, X } from "lucide-react";
import {
  useExportTemplates,
  useActiveTemplate,
  useExportTemplateActions,
} from "../hooks/useWorkplaceWellnessStore";
import { useTranslations } from "next-intl";
import type {
  ExportTemplate,
  ExportType,
  ExtendedExportFormat,
} from "../types";
import { EXPORT_FORMAT_CONFIG } from "../types/defaults";

const defaultTemplateState: Partial<ExportTemplate> = {
  name: "",
  description: "",
  exportType: "period",
  format: "pdf",
  fields: ["date", "type", "painLevel"],
  isDefault: false,
};

export default function ExportTemplateManager() {
  const templates = useExportTemplates();
  const activeTemplate = useActiveTemplate();
  const exportTemplateActions = useExportTemplateActions();
  const {
    addExportTemplate,
    updateExportTemplate,
    deleteExportTemplate,
    setActiveTemplate,
    loadTemplate,
    duplicateTemplate,
  } = exportTemplateActions;

  const t = useTranslations("workplaceWellness");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExportTemplate | null>(
    null,
  );
  const [newTemplate, setNewTemplate] =
    useState<Partial<ExportTemplate>>(defaultTemplateState);
  const resetForm = () => {
    setNewTemplate({ ...defaultTemplateState });
  };

  // 创建新模板
  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.exportType && newTemplate.format) {
      addExportTemplate({
        name: newTemplate.name!,
        description: newTemplate.description || "",
        exportType: newTemplate.exportType as ExportType,
        format: newTemplate.format as ExtendedExportFormat,
        fields: newTemplate.fields || [],
        dateRange: newTemplate.dateRange,
        filters: newTemplate.filters,
        isDefault: newTemplate.isDefault || false,
      });

      // 重置表单
      resetForm();
      setIsCreating(false);
    }
  };

  // 编辑模板
  const handleEditTemplate = (template: ExportTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      exportType: template.exportType,
      format: template.format,
      fields: template.fields,
      dateRange: template.dateRange,
      filters: template.filters,
      isDefault: template.isDefault,
    });
  };

  // 更新模板
  const handleUpdateTemplate = () => {
    if (
      editingTemplate &&
      newTemplate.name &&
      newTemplate.exportType &&
      newTemplate.format
    ) {
      updateExportTemplate(editingTemplate.id, {
        name: newTemplate.name,
        description: newTemplate.description,
        exportType: newTemplate.exportType as ExportType,
        format: newTemplate.format as ExtendedExportFormat,
        fields: newTemplate.fields || [],
        dateRange: newTemplate.dateRange,
        filters: newTemplate.filters,
        isDefault: newTemplate.isDefault || false,
      });

      setEditingTemplate(null);
      resetForm();
    }
  };

  // 删除模板
  const handleDeleteTemplate = (template: ExportTemplate) => {
    if (window.confirm(`确定要删除模板 "${template.name}" 吗？`)) {
      deleteExportTemplate(template.id);
    }
  };

  // 复制模板
  const handleDuplicateTemplate = (template: ExportTemplate) => {
    duplicateTemplate(template.id);
  };

  // 使用模板
  const handleUseTemplate = (template: ExportTemplate) => {
    setActiveTemplate(template);
    loadTemplate(template.id);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingTemplate(null);
    resetForm();
    setIsCreating(false);
  };

  // 可用字段选项
  const availableFields = {
    period: ["date", "type", "painLevel", "flow", "notes"],
    nutrition: ["name", "benefits", "phase", "holisticNature", "nutrients"],
    all: [
      "date",
      "type",
      "painLevel",
      "flow",
      "notes",
      "name",
      "benefits",
      "phase",
      "holisticNature",
      "nutrients",
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">
            {t("advancedExport.exportTemplates")}
          </h2>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} />
          创建模板
        </button>
      </div>

      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border rounded-lg transition-all cursor-pointer ${
              activeTemplate?.id === template.id
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
            }`}
            onClick={() => handleUseTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-800 mb-1">
                  {template.name}
                </h3>
                {template.description && (
                  <p className="text-sm text-neutral-600 mb-2">
                    {template.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="px-2 py-1 bg-neutral-100 rounded">
                    {template.exportType}
                  </span>
                  <span className="px-2 py-1 bg-neutral-100 rounded">
                    {template.format.toUpperCase()}
                  </span>
                  {template.isDefault && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                      默认
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-neutral-500">
                创建于 {new Date(template.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTemplate(template);
                  }}
                  className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
                  title="编辑"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateTemplate(template);
                  }}
                  className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
                  title="复制"
                >
                  <Copy size={14} />
                </button>
                {!template.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 创建/编辑模板表单 */}
      {(isCreating || editingTemplate) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">
                  {editingTemplate ? "编辑模板" : "创建新模板"}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      模板名称 *
                    </label>
                    <input
                      type="text"
                      value={newTemplate.name || ""}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="输入模板名称"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      导出类型 *
                    </label>
                    <select
                      value={newTemplate.exportType || "period"}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          exportType: e.target.value as ExportType,
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="period">经期数据</option>
                      <option value="nutrition">营养数据</option>
                      <option value="all">全部数据</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    模板描述
                  </label>
                  <textarea
                    value={newTemplate.description || ""}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="输入模板描述"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      导出格式 *
                    </label>
                    <select
                      value={newTemplate.format || "pdf"}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          format: e.target.value as ExtendedExportFormat,
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {Object.entries(EXPORT_FORMAT_CONFIG).map(
                        ([key, config]) => (
                          <option key={key} value={key}>
                            {config.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newTemplate.isDefault || false}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          isDefault: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-sm font-medium text-neutral-700"
                    >
                      设为默认模板
                    </label>
                  </div>
                </div>

                {/* 字段选择 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    包含字段
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFields[newTemplate.exportType as ExportType]?.map(
                      (field) => (
                        <label key={field} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              newTemplate.fields?.includes(field) || false
                            }
                            onChange={(e) => {
                              const fields = newTemplate.fields || [];
                              if (e.target.checked) {
                                setNewTemplate({
                                  ...newTemplate,
                                  fields: [...fields, field],
                                });
                              } else {
                                setNewTemplate({
                                  ...newTemplate,
                                  fields: fields.filter((f) => f !== field),
                                });
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-neutral-700">
                            {field}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* 日期范围 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      开始日期
                    </label>
                    <input
                      type="date"
                      value={newTemplate.dateRange?.start || ""}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          dateRange: {
                            start: e.target.value,
                            end: newTemplate.dateRange?.end || "",
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      结束日期
                    </label>
                    <input
                      type="date"
                      value={newTemplate.dateRange?.end || ""}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          dateRange: {
                            start: newTemplate.dateRange?.start || "",
                            end: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-neutral-200">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={
                    editingTemplate
                      ? handleUpdateTemplate
                      : handleCreateTemplate
                  }
                  disabled={
                    !newTemplate.name ||
                    !newTemplate.exportType ||
                    !newTemplate.format
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={16} />
                  {editingTemplate ? "更新模板" : "创建模板"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-600 mb-2">
            暂无导出模板
          </h3>
          <p className="text-neutral-500 mb-6">
            创建您的第一个导出模板，让数据导出更加便捷
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors mx-auto"
          >
            <Plus size={16} />
            创建模板
          </button>
        </div>
      )}
    </div>
  );
}
