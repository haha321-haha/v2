"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  RefreshCw as Sync,
  AlertCircle,
  Clock,
  Database,
  Shield,
  Download,
  RefreshCw,
  Server,
  Smartphone,
  Laptop,
} from "lucide-react";

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  syncInProgress: boolean;
  syncError: string | null;
  pendingChanges: number;
  conflictCount: number;
}

interface DeviceInfo {
  id: string;
  name: string;
  type: "mobile" | "desktop" | "tablet";
  lastSeen: Date;
  isActive: boolean;
}

interface DataSyncProps {
  locale: string;
  userId?: string;
  onSyncComplete?: (data: SyncCompletionPayload) => void;
  onSyncError?: (error: string) => void;
}

type SyncCompletionPayload = {
  timestamp: Date;
  changes: number;
};

export default function DataSync({
  locale,
  userId,
  onSyncComplete,
  onSyncError,
}: DataSyncProps) {
  const t = useTranslations("interactiveTools.sync");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSync: null,
    syncInProgress: false,
    syncError: null,
    pendingChanges: 0,
    conflictCount: 0,
  });
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5); // 分钟
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 检测网络状态
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true, syncError: null }));
    };

    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 模拟设备数据
  useEffect(() => {
    const mockDevices: DeviceInfo[] = [
      {
        id: "device1",
        name: "iPhone 15 Pro",
        type: "mobile",
        lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2分钟前
        isActive: true,
      },
      {
        id: "device2",
        name: "MacBook Pro",
        type: "desktop",
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
        isActive: false,
      },
      {
        id: "device3",
        name: "iPad Air",
        type: "tablet",
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
        isActive: false,
      },
    ];
    setDevices(mockDevices);
  }, []);

  // 执行同步
  const performSync = useCallback(async () => {
    if (!syncStatus.isOnline) {
      setSyncStatus((prev) => ({
        ...prev,
        syncError: t("errors.networkUnavailable"),
      }));
      return;
    }

    setSyncStatus((prev) => ({
      ...prev,
      syncInProgress: true,
      syncError: null,
    }));

    try {
      // 模拟同步过程
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 模拟随机成功/失败
      const success = Math.random() > 0.1; // 90% 成功率

      if (success) {
        const completionPayload: SyncCompletionPayload = {
          timestamp: new Date(),
          changes: 0,
        };

        setSyncStatus((prev) => ({
          ...prev,
          lastSync: completionPayload.timestamp,
          syncInProgress: false,
          pendingChanges: 0,
          conflictCount: 0,
          syncError: null,
        }));

        onSyncComplete?.(completionPayload);
      } else {
        throw new Error(t("errors.syncFailed"));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setSyncStatus((prev) => ({
        ...prev,
        syncInProgress: false,
        syncError: errorMessage,
      }));

      if (onSyncError) {
        onSyncError(errorMessage);
      }
    }
  }, [syncStatus.isOnline, t, onSyncComplete, onSyncError]);

  // 手动同步
  const handleManualSync = () => {
    performSync();
  };

  // 解决冲突
  const handleResolveConflicts = () => {
    // 模拟解决冲突
    setSyncStatus((prev) => ({ ...prev, conflictCount: 0 }));
  };

  // 导出数据
  const handleExportData = () => {
    const data = {
      userId,
      lastSync: syncStatus.lastSync,
      devices,
      timestamp: new Date(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `periodhub-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "desktop":
        return <Laptop className="w-4 h-4" />;
      case "tablet":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100";
      case "offline":
        return "text-red-600 bg-red-100";
      case "syncing":
        return "text-blue-600 bg-blue-100";
      case "error":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和状态 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Cloud className="w-6 h-6 mr-2 text-blue-600" />
            {t("title")}
          </h2>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {syncStatus.isOnline ? (
            <div className="flex items-center text-green-600">
              <Wifi className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                {t("networkStatus.online")}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <WifiOff className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                {t("networkStatus.offline")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 同步状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 连接状态 */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-2 rounded-full ${
                syncStatus.isOnline ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {syncStatus.isOnline ? (
                <Cloud className="w-6 h-6 text-green-600" />
              ) : (
                <CloudOff className="w-6 h-6 text-red-600" />
              )}
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                syncStatus.isOnline ? "online" : "offline",
              )}`}
            >
              {syncStatus.isOnline
                ? t("networkStatus.connected")
                : t("networkStatus.offline")}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("networkStatus.title")}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.isOnline
              ? t("networkStatus.cloudActive")
              : t("networkStatus.cloudUnavailable")}
          </p>
        </div>

        {/* 最后同步 */}
        <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-green-100">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {syncStatus.lastSync
                ? t("lastSync.synced")
                : t("lastSync.notSynced")}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("lastSync.title")}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.lastSync
              ? syncStatus.lastSync.toLocaleString(
                  locale === "zh" ? "zh-CN" : "en-US",
                )
              : t("lastSync.neverSynced")}
          </p>
        </div>

        {/* 待同步更改 */}
        <div className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-yellow-100">
              <Database className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              {syncStatus.pendingChanges} {t("pendingChanges.pending")}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("pendingChanges.title")}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.pendingChanges === 0
              ? t("pendingChanges.allSynced")
              : `${syncStatus.pendingChanges} ${t(
                  "pendingChanges.changesPending",
                )}`}
          </p>
        </div>

        {/* 冲突数量 */}
        <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              {syncStatus.conflictCount} {t("conflicts.conflicts")}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("conflicts.title")}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.conflictCount === 0
              ? t("conflicts.noConflicts")
              : `${syncStatus.conflictCount} ${t(
                  "conflicts.conflictsToResolve",
                )}`}
          </p>
        </div>
      </div>

      {/* 同步控制 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Sync className="w-5 h-5 mr-2" />
          {t("control.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {t("control.autoSync")}
              </label>
              <button
                onClick={() => setAutoSync(!autoSync)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSync ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSync ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {autoSync && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("control.syncInterval")}
                </label>
                <select
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>{t("control.intervals.1min")}</option>
                  <option value={5}>{t("control.intervals.5min")}</option>
                  <option value={15}>{t("control.intervals.15min")}</option>
                  <option value={30}>{t("control.intervals.30min")}</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleManualSync}
              disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {syncStatus.syncInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t("control.syncing")}
                </>
              ) : (
                <>
                  <Sync className="w-4 h-4 mr-2" />
                  {t("control.syncNow")}
                </>
              )}
            </button>

            {syncStatus.conflictCount > 0 && (
              <button
                onClick={handleResolveConflicts}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {t("conflicts.resolve")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 设备管理 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2" />
          {t("devices.title")}
        </h3>

        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {device.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {device.lastSeen.toLocaleString(
                        locale === "zh" ? "zh-CN" : "en-US",
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      device.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {device.isActive
                      ? t("devices.active")
                      : t("devices.offline")}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Shield className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          {t("dataManagement.title")}
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            {t("dataManagement.exportData")}
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            {t("dataManagement.advancedSettings")}
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("dataManagement.retentionPeriod")}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="1year">
                    {t("dataManagement.retention.1year")}
                  </option>
                  <option value="2years">
                    {t("dataManagement.retention.2years")}
                  </option>
                  <option value="5years">
                    {t("dataManagement.retention.5years")}
                  </option>
                  <option value="forever">
                    {t("dataManagement.retention.forever")}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("dataManagement.encryptionLevel")}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="standard">
                    {t("dataManagement.encryption.standard")}
                  </option>
                  <option value="high">
                    {t("dataManagement.encryption.high")}
                  </option>
                  <option value="maximum">
                    {t("dataManagement.encryption.maximum")}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误显示 */}
      {syncStatus.syncError && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{syncStatus.syncError}</span>
          </div>
        </div>
      )}
    </div>
  );
}
