"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Download,
  Play,
  Pause,
  X,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import {
  useBatchExportQueue,
  useExportTemplates,
  useBatchExportActions,
  useExportHistoryActions,
} from "../hooks/useWorkplaceWellnessStore";
import {
  BatchExportItem,
  BatchExportQueue,
  ExportTemplate,
  ExportType,
  ExtendedExportFormat,
} from "../types";

export default function BatchExportManager() {
  const batchQueue = useBatchExportQueue();
  const templates = useExportTemplates() as ExportTemplate[];

  // 类型保护：确保 batchQueue 是正确的类型
  const isBatchQueue = (queue: unknown): queue is BatchExportQueue => {
    return (
      queue &&
      typeof queue === "object" &&
      "status" in queue &&
      "items" in queue
    );
  };

  const safeBatchQueue = isBatchQueue(batchQueue) ? batchQueue : null;
  const {
    createBatchExport,
    updateBatchItemStatus,
    cancelBatchExport,
    retryFailedItems,
    clearBatchExport,
  } = useBatchExportActions();

  // 类型断言：确保 updateBatchItemStatus 有正确的类型
  const updateStatus = updateBatchItemStatus as (
    itemId: string,
    status: string,
    progress?: number,
    error?: string,
  ) => void;
  const { addExportHistory } = useExportHistoryActions();

  // 类型断言：确保 addExportHistory 有正确的类型
  const addHistory = addExportHistory;

  const [isCreating, setIsCreating] = useState(false);
  const [selectedItems, setSelectedItems] = useState<BatchExportItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract complex expression to avoid dependency issues
  const batchQueueStatus = useMemo(() => {
    return batchQueue && "status" in batchQueue ? batchQueue.status : null;
  }, [batchQueue]);

  // Wrap processBatchExport in useCallback
  const processBatchExport = useCallback(async () => {
    if (!batchQueue || !("items" in batchQueue)) return;

    const pendingItems = batchQueue.items.filter(
      (item) => item.status === "pending",
    );

    for (const item of pendingItems) {
      // 更新状态为处理中
      updateStatus(item.id, "processing", 0);

      // 模拟处理时间
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        updateStatus(item.id, "processing", progress);
      }

      // 模拟成功/失败
      const success = Math.random() > 0.2; // 80% 成功率
      if (success) {
        updateStatus(item.id, "completed", 100);
        // 添加到导出历史
        addHistory({
          exportType: item.exportType,
          format: "pdf" as ExtendedExportFormat,
          templateId: item.templateId,
          fileName: `${item.exportType}_export_${Date.now()}.pdf`,
          fileSize: Math.floor(Math.random() * 1000000) + 50000,
          recordCount: Math.floor(Math.random() * 100) + 10,
          status: "success",
          downloadUrl: `#download-${item.id}`,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });
      } else {
        updateStatus(item.id, "failed", 0, "处理失败，请重试");
      }
    }

    setIsProcessing(false);
  }, [batchQueue, updateStatus, addHistory]);

  // 模拟批量导出处理
  useEffect(() => {
    if (
      batchQueue &&
      "status" in batchQueue &&
      batchQueue.status === "running" &&
      !isProcessing
    ) {
      setIsProcessing(true);
      processBatchExport();
    }
  }, [batchQueueStatus, isProcessing, batchQueue, processBatchExport]);

  // 创建批量导出
  const handleCreateBatchExport = () => {
    if (selectedItems.length === 0) return;

    const items: Omit<
      BatchExportItem,
      "id" | "createdAt" | "status" | "progress"
    >[] = selectedItems.map((item) => ({
      userId: item.userId,
      userName: item.userName,
      exportType: item.exportType,
      templateId: item.templateId,
    }));

    // TypeScript 类型推断有问题，使用类型断言
    const createBatchExportFn = createBatchExport as (
      items: Omit<
        BatchExportItem,
        "id" | "createdAt" | "status" | "progress"
      >[],
    ) => void;
    createBatchExportFn(items);
    setIsCreating(false);
    setSelectedItems([]);
  };

  // 开始批量导出
  const handleStartBatchExport = () => {
    if (safeBatchQueue && safeBatchQueue.status === "idle") {
      processBatchExport();
    }
  };

  // 取消批量导出
  const handleCancelBatchExport = () => {
    cancelBatchExport();
    setIsProcessing(false);
  };

  // 重试失败项目
  const handleRetryFailedItems = () => {
    retryFailedItems();
    setIsProcessing(false);
  };

  // 清除批量导出
  const handleClearBatchExport = () => {
    if (window.confirm("确定要清除批量导出队列吗？")) {
      clearBatchExport();
      setIsProcessing(false);
    }
  };

  // 添加导出项目
  const handleAddExportItem = () => {
    const newItem: BatchExportItem = {
      id: `temp_${Date.now()}`,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      userName: `用户${Math.floor(Math.random() * 1000)}`,
      exportType: "period" as ExportType,
      templateId: templates[0]?.id,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setSelectedItems([...selectedItems, newItem]);
  };

  // 移除导出项目
  const handleRemoveExportItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  // 更新导出项目
  const handleUpdateExportItem = (
    itemId: string,
    updates: Partial<BatchExportItem>,
  ) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
    );
  };

  // 获取状态图标
  const getStatusIcon = (status: BatchExportItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  // 获取状态文本
  const getStatusText = (status: BatchExportItem["status"]) => {
    switch (status) {
      case "pending":
        return "等待中";
      case "processing":
        return "处理中";
      case "completed":
        return "已完成";
      case "failed":
        return "失败";
      default:
        return "未知";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Download className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">批量导出管理</h2>
        </div>
        <div className="flex gap-2">
          {batchQueue && (
            <>
              {safeBatchQueue?.status === "idle" && (
                <button
                  onClick={handleStartBatchExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play size={16} />
                  开始导出
                </button>
              )}
              {safeBatchQueue?.status === "running" && (
                <button
                  onClick={handleCancelBatchExport}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Pause size={16} />
                  取消导出
                </button>
              )}
              {safeBatchQueue?.status === "failed" && (
                <button
                  onClick={handleRetryFailedItems}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw size={16} />
                  重试失败项
                </button>
              )}
              <button
                onClick={handleClearBatchExport}
                className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={16} />
                清除队列
              </button>
            </>
          )}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download size={16} />
            创建批量导出
          </button>
        </div>
      </div>

      {/* 批量导出队列状态 */}
      {batchQueue && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                {safeBatchQueue?.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  safeBatchQueue?.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : safeBatchQueue?.status === "running"
                      ? "bg-blue-100 text-blue-700"
                      : safeBatchQueue?.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {safeBatchQueue?.status === "idle"
                  ? "等待中"
                  : safeBatchQueue?.status === "running"
                    ? "运行中"
                    : safeBatchQueue?.status === "completed"
                      ? "已完成"
                      : safeBatchQueue?.status === "failed"
                        ? "失败"
                        : "已取消"}
              </span>
            </div>
            <div className="text-sm text-neutral-500">
              创建于{" "}
              {safeBatchQueue
                ? new Date(safeBatchQueue.createdAt).toLocaleString()
                : ""}
            </div>
          </div>

          {/* 进度统计 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-800">
                {safeBatchQueue?.totalItems || 0}
              </div>
              <div className="text-sm text-neutral-500">总项目</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {safeBatchQueue?.completedItems || 0}
              </div>
              <div className="text-sm text-neutral-500">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {safeBatchQueue?.failedItems || 0}
              </div>
              <div className="text-sm text-neutral-500">失败</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(safeBatchQueue?.totalItems || 0) -
                  (safeBatchQueue?.completedItems || 0) -
                  (safeBatchQueue?.failedItems || 0)}
              </div>
              <div className="text-sm text-neutral-500">进行中</div>
            </div>
          </div>

          {/* 总体进度条 */}
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  safeBatchQueue && safeBatchQueue.totalItems > 0
                    ? ((safeBatchQueue.completedItems || 0) /
                        safeBatchQueue.totalItems) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 导出项目列表 */}
      {batchQueue && (
        <div className="space-y-3">
          {safeBatchQueue?.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(item.status)}
                <div>
                  <div className="font-medium text-neutral-800">
                    {item.userName || `用户 ${item.userId}`}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {item.exportType} 导出
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-neutral-800">
                    {getStatusText(item.status)}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {item.status === "processing" ? `${item.progress}%` : ""}
                  </div>
                </div>

                {item.status === "processing" && (
                  <div className="w-20 bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {item.error && (
                  <div
                    className="text-xs text-red-600 max-w-xs truncate"
                    title={item.error}
                  >
                    {item.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 创建批量导出表单 */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">
                  创建批量导出
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* 导出项目列表 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-neutral-800">导出项目</h4>
                    <button
                      onClick={handleAddExportItem}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    >
                      <Plus size={14} />
                      添加项目
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 border border-neutral-200 rounded-lg"
                      >
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              用户名
                            </label>
                            <input
                              type="text"
                              value={item.userName || ""}
                              onChange={(e) =>
                                handleUpdateExportItem(item.id, {
                                  userName: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="输入用户名"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              导出类型
                            </label>
                            <select
                              value={item.exportType}
                              onChange={(e) =>
                                handleUpdateExportItem(item.id, {
                                  exportType: e.target.value as ExportType,
                                })
                              }
                              className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="period">经期数据</option>
                              <option value="nutrition">营养数据</option>
                              <option value="all">全部数据</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              模板
                            </label>
                            <select
                              value={item.templateId || ""}
                              onChange={(e) =>
                                handleUpdateExportItem(item.id, {
                                  templateId: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="">选择模板</option>
                              {templates.map((template) => (
                                <option key={template.id} value={template.id}>
                                  {template.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveExportItem(item.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedItems.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                      <p>暂无导出项目</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-neutral-200">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateBatchExport}
                  disabled={selectedItems.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download size={16} />
                  创建批量导出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!batchQueue && (
        <div className="text-center py-12">
          <Download className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-600 mb-2">
            暂无批量导出任务
          </h3>
          <p className="text-neutral-500 mb-6">
            创建批量导出任务，一次性处理多个数据导出需求
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors mx-auto"
          >
            <Download size={16} />
            创建批量导出
          </button>
        </div>
      )}
    </div>
  );
}
