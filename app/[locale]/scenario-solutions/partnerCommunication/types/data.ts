/**
 * 数据管理和存储相关类型定义
 */

import { QuizStage, QuizResult, StageProgress } from "./quiz";
import { UserPreferences } from "./preferences";

// 测试统计类型
export interface QuizStatistics {
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  lastAttemptDate: Date | null;
  bestScore: number;
  improvementRate: number;
}

// 训练会话类型
export interface TrainingSession {
  id: string;
  date: Date;
  duration: number; // minutes
  completed: boolean;
  score?: number;
  notes?: string;
}

// 数据存储类型
export interface DataStorage {
  // 用户数据
  userData: {
    id: string;
    preferences: UserPreferences;
    createdAt: Date;
    lastUpdated: Date;
    version: string;
  };

  // 测试数据
  quizData: {
    stageProgress: Record<QuizStage, StageProgress>;
    overallResult: QuizResult | null;
    history: QuizResult[];
    statistics: QuizStatistics;
  };

  // 训练数据
  trainingData: {
    progress: Record<string, boolean>;
    completedDays: string[];
    currentDay: number;
    sessions: TrainingSession[];
  };

  // 元数据
  metadata: {
    appVersion: string;
    dataVersion: string;
    lastBackup: Date | null;
    syncStatus: "synced" | "pending" | "failed";
    deviceId: string;
  };
}

// 数据导出类型
export interface DataExport {
  data: DataStorage;
  exportInfo: {
    exportedAt: Date;
    format: "json" | "csv" | "xml";
    version: string;
    size: number;
    checksum: string;
  };
}

// 数据导入类型
export interface DataImport {
  data: Partial<DataStorage>;
  importInfo: {
    importedAt: Date;
    source: string;
    version: string;
    validation: DataValidation;
  };
}

// 数据验证类型
export interface DataValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number; // 0-100
}

// 数据同步类型
export interface DataSync {
  status: "syncing" | "success" | "failed" | "conflict";
  lastSync: Date;
  conflicts: DataConflict[];
  resolution: "automatic" | "manual" | "none";
}

// 数据冲突类型
export interface DataConflict {
  field: string;
  localValue: unknown;
  remoteValue: unknown;
  conflictType: "value" | "structure" | "version";
  resolution: "local" | "remote" | "merge" | "manual";
}

// 数据备份类型
export interface DataBackup {
  id: string;
  data: DataStorage;
  createdAt: Date;
  size: number;
  type: "manual" | "automatic" | "scheduled";
  location: "local" | "cloud" | "external";
  status: "success" | "failed" | "pending";
}

// 数据恢复类型
export interface DataRestore {
  backupId: string;
  restoredAt: Date;
  status: "success" | "failed" | "partial";
  restoredFields: string[];
  failedFields: string[];
  warnings: string[];
}

// 数据清理类型
export interface DataCleanup {
  cleanedAt: Date;
  removedData: {
    oldBackups: number;
    expiredSessions: number;
    unusedPreferences: number;
    duplicateEntries: number;
  };
  freedSpace: number; // bytes
  status: "success" | "failed" | "partial";
}

// 数据统计类型
export interface DataStats {
  totalSize: number; // bytes
  userCount: number;
  averageDataSize: number;
  growthRate: number; // bytes per day
  lastCleanup: Date | null;
  storageEfficiency: number; // 0-1
}

// 数据迁移类型
export interface DataMigration {
  fromVersion: string;
  toVersion: string;
  migratedAt: Date;
  status: "success" | "failed" | "partial";
  migratedFields: string[];
  failedFields: string[];
  warnings: string[];
}

// 数据压缩类型
export interface DataCompression {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // 0-1
  algorithm: string;
  compressedAt: Date;
}

// 数据加密类型
export interface DataEncryption {
  algorithm: string;
  keySize: number;
  encryptedAt: Date;
  isEncrypted: boolean;
  encryptionLevel: "low" | "medium" | "high";
}

// 数据完整性类型
export interface DataIntegrity {
  checksum: string;
  hash: string;
  verifiedAt: Date;
  isIntact: boolean;
  errors: string[];
}

// 数据访问控制类型
export interface DataAccessControl {
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    export: boolean;
    import: boolean;
  };
  restrictions: {
    maxSize: number;
    allowedFormats: string[];
    timeLimit: number; // minutes
  };
  audit: {
    lastAccess: Date;
    accessCount: number;
    accessHistory: DataAccessLog[];
  };
}

// 数据访问日志类型
export interface DataAccessLog {
  timestamp: Date;
  action: "read" | "write" | "delete" | "export" | "import";
  field: string;
  success: boolean;
  error?: string;
}

// 数据性能类型
export interface DataPerformance {
  loadTime: number; // milliseconds
  saveTime: number; // milliseconds
  queryTime: number; // milliseconds
  memoryUsage: number; // bytes
  cpuUsage: number; // percentage
  lastMeasured: Date;
}

// 数据错误类型
export interface DataError {
  code: string;
  message: string;
  field: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  context: Record<string, unknown>;
  stackTrace?: string;
}

// 数据恢复策略类型
export interface DataRecoveryStrategy {
  strategy: "backup" | "replication" | "versioning" | "manual";
  frequency: "real-time" | "hourly" | "daily" | "weekly";
  retention: number; // days
  location: "local" | "cloud" | "external";
  encryption: boolean;
  compression: boolean;
}
