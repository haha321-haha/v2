/**
 * Debug Logger Utility
 * 调试日志工具 - 在生产环境中自动禁用
 */

/* eslint-disable no-console */
// 此文件是日志工具，console 语句是其核心功能，需要保留

const isDevelopment = process.env.NODE_ENV === "development";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
  source: string;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private maxLogEntries = 1000;

  private shouldLog(level: LogLevel): boolean {
    if (!isDevelopment) return false;

    // 可以根据环境变量进一步控制日志级别
    const logLevels: Record<LogLevel, number> = {
      info: 1,
      warn: 2,
      error: 3,
      debug: 4,
    };

    const currentLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || "info";
    const minLevel = logLevels[currentLevel as LogLevel] || logLevels.info;

    return logLevels[level] >= minLevel;
  }

  private addLog(
    level: LogLevel,
    message: string,
    data?: unknown,
    source = "Unknown",
  ): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      source,
    };

    this.logs.push(entry);

    // 限制日志条目数量，避免内存泄漏
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries);
    }

    if (this.shouldLog(level)) {
      const timestamp = entry.timestamp.toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${source}] ${message}`;

      switch (level) {
        case "error":
          if (data) {
            console.error(logMessage, data);
          } else {
            console.error(logMessage);
          }
          break;
        case "warn":
          if (data) {
            console.warn(logMessage, data);
          } else {
            console.warn(logMessage);
          }
          break;
        case "debug":
          if (data) {
            console.debug(logMessage, data);
          } else {
            console.debug(logMessage);
          }
          break;
        default: // info
          if (data) {
            console.log(logMessage, data);
          } else {
            console.log(logMessage);
          }
      }
    }
  }

  info(message: string, data?: unknown, source = "App"): void {
    this.addLog("info", message, data, source);
  }

  warn(message: string, data?: unknown, source = "App"): void {
    this.addLog("warn", message, data, source);
  }

  error(message: string, data?: unknown, source = "App"): void {
    this.addLog("error", message, data, source);
  }

  debug(message: string, data?: unknown, source = "App"): void {
    this.addLog("debug", message, data, source);
  }

  // 获取所有日志（用于调试）
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // 清除日志
  clearLogs(): void {
    this.logs = [];
  }

  // 导出日志（用于错误报告）
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// 导出单例实例
export const logger = new DebugLogger();

// 导出便捷方法
export const logInfo = (message: string, data?: unknown, source?: string) =>
  logger.info(message, data, source);

export const logWarn = (message: string, data?: unknown, source?: string) =>
  logger.warn(message, data, source);

export const logError = (message: string, data?: unknown, source?: string) =>
  logger.error(message, data, source);

export const logDebug = (message: string, data?: unknown, source?: string) =>
  logger.debug(message, data, source);

// 兼容性别名，便于快速替换现有代码
export const debugLog = logDebug;
export const infoLog = logInfo;
