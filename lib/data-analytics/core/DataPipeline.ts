import { EventCollector } from "./EventCollector";
import { MetricsEngine } from "./MetricsEngine";
import {
  EnhancedUserEvent,
  DataPipelineStatus,
  DashboardData,
  CoreMetrics,
  MetricsResult,
} from "../types/analytics.types";
import { logInfo, logError, logWarn } from "@/lib/debug-logger";

/**
 * 数据处理管道
 * 负责协调事件收集、数据处理和指标计算
 */
export class DataPipeline {
  private eventCollector: EventCollector;
  private metricsEngine: MetricsEngine;
  private pipelineStatus: DataPipelineStatus;
  private processingInterval: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;

  constructor() {
    this.eventCollector = new EventCollector();
    this.metricsEngine = new MetricsEngine();

    this.pipelineStatus = {
      name: "Period Hub Analytics Pipeline",
      status: "idle",
      lastRun: new Date(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时后
      processedRecords: 0,
      failedRecords: 0,
      processingDuration: 0,
      error: undefined,
    };
  }

  /**
   * 启动数据处理管道
   */
  async start(): Promise<void> {
    if (this.processingInterval) {
      throw new Error("数据处理管道已经在运行中");
    }

    logInfo("启动 Period Hub 数据分析管道", "DataPipeline/start");

    // 立即执行一次处理
    await this.processPipeline();

    // 设置定时处理（每24小时一次）
    this.processingInterval = setInterval(
      async () => {
        await this.processPipeline();
      },
      24 * 60 * 60 * 1000,
    );

    logInfo("数据处理管道启动成功", "DataPipeline/start");
  }

  /**
   * 停止数据处理管道
   */
  async stop(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    if (this.isProcessing) {
      logInfo("等待当前处理完成...", "DataPipeline/stop");
      // 等待当前处理完成
      while (this.isProcessing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    this.pipelineStatus.status = "idle";
    logInfo("数据处理管道已停止", "DataPipeline/stop");
  }

  /**
   * 手动触发数据处理
   */
  async processPipeline(): Promise<void> {
    if (this.isProcessing) {
      logWarn("管道正在处理中，跳过此次执行", "DataPipeline/processPipeline");
      return;
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      logInfo("开始数据处理...", "DataPipeline/processPipeline");
      this.pipelineStatus.status = "processing";
      this.pipelineStatus.lastRun = new Date();

      // 步骤1: 收集和处理事件数据
      await this.collectAndProcessEvents();

      // 步骤2: 计算核心指标
      await this.calculateMetrics();

      // 步骤3: 生成仪表板数据
      await this.generateDashboardData();

      // 步骤4: 数据质量检查
      await this.performDataQualityChecks();

      // 更新状态
      this.pipelineStatus.status = "completed";
      this.pipelineStatus.processingDuration = Date.now() - startTime;
      this.pipelineStatus.nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000);
      this.pipelineStatus.error = undefined;

      logInfo(
        `数据处理完成，耗时: ${this.pipelineStatus.processingDuration}ms`,
        "DataPipeline/processPipeline",
      );
    } catch (error) {
      this.pipelineStatus.status = "failed";
      this.pipelineStatus.error =
        error instanceof Error ? error.message : "未知错误";
      this.pipelineStatus.processingDuration = Date.now() - startTime;

      logError("数据处理失败:", error, "DataPipeline/processPipeline");
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 收集和处理事件数据
   */
  private async collectAndProcessEvents(): Promise<void> {
    try {
      logInfo("收集事件数据...", "DataPipeline/collectAndProcessEvents");

      // 获取待处理的事件
      const events = await this.eventCollector.getCollectedEvents();

      if (events.length === 0) {
        logInfo("没有新的事件需要处理", "DataPipeline/collectAndProcessEvents");
        return;
      }

      logInfo(
        `收集到 ${events.length} 个事件`,
        "DataPipeline/collectAndProcessEvents",
      );

      // 处理每个事件
      const processedEvents: EnhancedUserEvent[] = [];
      const failedEvents: Array<{ event: unknown; error: unknown }> = [];

      for (const event of events) {
        try {
          const enhancedEvent = await this.enhanceEvent(
            event as unknown as Partial<EnhancedUserEvent>,
          );
          processedEvents.push(enhancedEvent);

          // 添加到指标引擎
          this.metricsEngine.addEvent(enhancedEvent);
        } catch (error) {
          const eventId = (event as { id?: string }).id || "unknown_event";
          logError(
            `处理事件失败: ${eventId}`,
            error,
            "DataPipeline/collectAndProcessEvents",
          );
          failedEvents.push({ event, error });
        }
      }

      // 更新统计
      this.pipelineStatus.processedRecords += processedEvents.length;
      this.pipelineStatus.failedRecords += failedEvents.length;

      logInfo(
        `成功处理 ${processedEvents.length} 个事件，失败 ${failedEvents.length} 个`,
        "DataPipeline/collectAndProcessEvents",
      );
    } catch (error) {
      logError("事件收集失败:", error, "DataPipeline/collectAndProcessEvents");
      throw error;
    }
  }

  /**
   * 增强事件数据
   */
  private async enhanceEvent(
    event: Partial<EnhancedUserEvent>,
  ): Promise<EnhancedUserEvent> {
    // 基础事件转换
    const enhancedEvent: EnhancedUserEvent = {
      id: event.id || this.generateEventId(),
      type: event.type || "user_action",
      timestamp: event.timestamp || new Date(),
      data: event.data || {},
      severity: event.severity || "low",
      source: event.source || "web_app",
      correlationId: event.correlationId,
      userId: event.userId || "anonymous",
      sessionId: event.sessionId || this.generateSessionId(),
      userAgent: event.userAgent,
      referrer: event.referrer,
      location: event.location,
      device: event.device,
    };

    // 地理位置增强（基于IP地址）
    if (!enhancedEvent.location && (event as { ip?: string }).ip) {
      enhancedEvent.location = await this.getLocationFromIP();
    }

    // 设备信息增强
    if (!enhancedEvent.device && enhancedEvent.userAgent) {
      const deviceInfo = this.parseDeviceInfo(enhancedEvent.userAgent);
      enhancedEvent.device = {
        type: deviceInfo.type as "mobile" | "tablet" | "desktop",
        os: deviceInfo.os,
        browser: deviceInfo.browser,
      };
    }

    // 数据验证
    this.validateEvent(enhancedEvent);

    return enhancedEvent;
  }

  /**
   * 计算核心指标
   */
  private async calculateMetrics(): Promise<void> {
    try {
      logInfo("计算核心指标...", "DataPipeline/calculateMetrics");

      const metrics = await this.metricsEngine.calculateAllMetrics();

      logInfo(
        `核心指标计算完成: 日活跃用户数=${
          metrics.dailyActiveUsers
        }, 用户留存率=${metrics.userRetentionRate.toFixed(
          2,
        )}%, 平台使用深度=${metrics.platformEngagementDepth.toFixed(
          2,
        )}分钟, 新用户获取成本=¥${metrics.newUserAcquisitionCost.toFixed(
          2,
        )}, 用户生命周期价值=¥${metrics.userLifetimeValue.toFixed(2)}`,
        "DataPipeline/calculateMetrics",
      );
    } catch (error) {
      logError("指标计算失败:", error, "DataPipeline/calculateMetrics");
      throw error;
    }
  }

  /**
   * 生成仪表板数据
   */
  private async generateDashboardData(): Promise<void> {
    try {
      logInfo("生成仪表板数据...", "DataPipeline/generateDashboardData");

      const dashboardData = await this.metricsEngine.getDashboardData();

      // 在实际应用中，这里会将数据保存到数据库或缓存
      logInfo(
        `仪表板数据生成完成: 总用户数=${dashboardData.userActivity.totalUsers}, 活跃用户=${dashboardData.userActivity.activeUsers}, 总下载量=${dashboardData.resourceUsage.totalDownloads}, 总浏览量=${dashboardData.resourceUsage.totalViews}`,
        "DataPipeline/generateDashboardData",
      );
    } catch (error) {
      logError(
        "仪表板数据生成失败:",
        error,
        "DataPipeline/generateDashboardData",
      );
      throw error;
    }
  }

  /**
   * 数据质量检查
   */
  private async performDataQualityChecks(): Promise<void> {
    try {
      logInfo("执行数据质量检查...", "DataPipeline/performDataQualityChecks");

      const eventHistory = this.metricsEngine.getEventHistory();
      const checks = [];

      // 检查1: 数据完整性
      const incompleteEvents = eventHistory.filter(
        (event) => !event.userId || !event.timestamp || !event.type,
      );
      if (incompleteEvents.length > 0) {
        checks.push(`发现 ${incompleteEvents.length} 个不完整的事件`);
      }

      // 检查2: 数据时效性
      const outdatedEvents = eventHistory.filter((event) => {
        const daysDiff =
          (Date.now() - event.timestamp.getTime()) / (24 * 60 * 60 * 1000);
        return daysDiff > 90; // 超过90天的数据
      });
      if (outdatedEvents.length > 0) {
        checks.push(`发现 ${outdatedEvents.length} 个过期事件`);
      }

      // 检查3: 异常值检测
      const userEventCounts = new Map<string, number>();
      eventHistory.forEach((event) => {
        userEventCounts.set(
          event.userId,
          (userEventCounts.get(event.userId) || 0) + 1,
        );
      });

      const avgEventsPerUser =
        Array.from(userEventCounts.values()).reduce(
          (sum, count) => sum + count,
          0,
        ) / userEventCounts.size;

      const anomalousUsers = Array.from(userEventCounts.entries()).filter(
        ([, count]) => count > avgEventsPerUser * 10,
      );

      if (anomalousUsers.length > 0) {
        checks.push(`发现 ${anomalousUsers.length} 个异常活跃用户`);
      }

      if (checks.length === 0) {
        logInfo("数据质量检查通过", "DataPipeline/performDataQualityChecks");
      } else {
        logWarn(
          `数据质量检查发现问题: ${checks.join("; ")}`,
          "DataPipeline/performDataQualityChecks",
        );
      }
    } catch (error) {
      logError(
        "数据质量检查失败:",
        error,
        "DataPipeline/performDataQualityChecks",
      );
      // 质量检查失败不应该阻止管道继续运行
    }
  }

  /**
   * 获取管道状态
   */
  getStatus(): DataPipelineStatus {
    return { ...this.pipelineStatus };
  }

  /**
   * 获取实时指标
   */
  async getRealTimeMetrics(): Promise<CoreMetrics> {
    return await this.metricsEngine.calculateAllMetrics();
  }

  /**
   * 获取仪表板数据
   */
  async getDashboardData(): Promise<DashboardData> {
    return await this.metricsEngine.getDashboardData();
  }

  /**
   * 获取指标趋势
   */
  async getMetricsTrend(
    metricName: keyof CoreMetrics,
    days: number = 7,
  ): Promise<MetricsResult[]> {
    return await this.metricsEngine.getMetricsTrend(metricName, days);
  }

  /**
   * 手动添加事件
   */
  async addEvent(event: Partial<EnhancedUserEvent>): Promise<void> {
    try {
      const enhancedEvent = await this.enhanceEvent(event);
      this.metricsEngine.addEvent(enhancedEvent);
      logInfo(`事件添加成功: ${enhancedEvent.id}`, "DataPipeline/addEvent");
    } catch (error) {
      logError("事件添加失败:", error, "DataPipeline/addEvent");
      throw error;
    }
  }

  // 私有辅助方法
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getLocationFromIP(): Promise<{
    country: string;
    city: string;
    timezone: string;
  }> {
    try {
      // 使用真实的地理位置服务
      const { getLocationFromIP } = await import("@/lib/geo/geoip-service");
      const location = await getLocationFromIP();
      return {
        country: location.countryCode,
        city: location.city,
        timezone: location.timezone,
      };
    } catch (error) {
      // 如果服务失败，返回默认值
      // 使用logger而不是console.warn（开发环境自动启用，生产环境自动禁用）
      const { logWarn } = await import("@/lib/debug-logger");
      logWarn(
        "[DataPipeline] Failed to get location, using default",
        error,
        "DataPipeline",
      );
      return {
        country: "XX",
        city: "Unknown",
        timezone: "UTC",
      };
    }
  }

  private parseDeviceInfo(userAgent: string): {
    type: string;
    os: string;
    browser: string;
  } {
    // 简化的设备信息解析
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);

    return {
      type: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
      os: this.extractOS(userAgent),
      browser: this.extractBrowser(userAgent),
    };
  }

  private extractOS(userAgent: string): string {
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac OS/i.test(userAgent)) return "macOS";
    if (/Android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad/i.test(userAgent)) return "iOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    return "Unknown";
  }

  private extractBrowser(userAgent: string): string {
    if (/Chrome/i.test(userAgent)) return "Chrome";
    if (/Firefox/i.test(userAgent)) return "Firefox";
    if (/Safari/i.test(userAgent)) return "Safari";
    if (/Edge/i.test(userAgent)) return "Edge";
    return "Unknown";
  }

  private validateEvent(event: EnhancedUserEvent): void {
    if (!event.id) throw new Error("事件ID不能为空");
    if (!event.userId) throw new Error("用户ID不能为空");
    if (!event.timestamp) throw new Error("时间戳不能为空");
    if (!event.type) throw new Error("事件类型不能为空");
  }
}

// 导出单例实例
export const dataPipeline = new DataPipeline();
