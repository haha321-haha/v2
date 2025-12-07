/**
 * Real Data Collector - 真实数据收集器
 * 用于收集用户的真实使用数据（匿名化）
 */

// Using direct localStorage API instead of LocalStorageManager

export interface DataPoint {
  id: string;
  type: string;
  data: unknown;
  timestamp: number;
  sessionId: string;
}

// 反馈数据类型
export interface RealFeedbackData {
  id: string;
  userId: string;
  feature: string;
  page: string;
  rating: number;
  comment?: string;
  sentiment: "positive" | "neutral" | "negative";
  topics?: string[];
  userType?: string;
  device?: string;
  timeSpent?: number;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

// 用户会话数据类型
export interface RealUserSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  device?: {
    type: "desktop" | "mobile" | "tablet";
    browser: string;
    os: string;
    screenResolution: string;
  };
  navigation?: {
    entryPage: string;
    pagesVisited: string[];
    timeOnEachPage: Record<string, number>;
    scrollDepth: Record<string, number>;
  };
  interactions?: {
    clicks: number;
    hovers: number;
    formSubmissions: number;
    timeSpent: number;
  };
  conversion?: {
    assessmentStarted: boolean;
    assessmentCompleted: boolean;
    paywallReached: boolean;
    feedbackSubmitted: boolean;
    phq9Started: boolean;
    phq9Completed: boolean;
  };
}

const STORAGE_KEY = "real_data_collection";
const SESSION_KEY = "session_id";
const MAX_DATA_POINTS = 500;

/**
 * 获取或创建会话 ID
 */
function getSessionId(): string {
  if (typeof window === "undefined") {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * 收集数据点
 */
export function collectDataPoint(type: string, data: unknown): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  const dataPoints = stored ? (JSON.parse(stored) as DataPoint[]) : [];
  if (!dataPoints || !Array.isArray(dataPoints)) return false;

  const dataPoint: DataPoint = {
    id: `dp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  };

  dataPoints.push(dataPoint);

  // 限制数据点数量
  if (dataPoints.length > MAX_DATA_POINTS) {
    dataPoints.splice(0, dataPoints.length - MAX_DATA_POINTS);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataPoints));
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取所有数据点
 */
export function getAllDataPoints(): DataPoint[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as DataPoint[]) : [];
}

/**
 * 获取特定类型的数据点
 */
export function getDataPointsByType(type: string): DataPoint[] {
  const allPoints = getAllDataPoints();
  return allPoints.filter((point) => point.type === type);
}

/**
 * 清除数据
 */
export function clearCollectedData(): boolean {
  try {
    if (typeof window === "undefined") return false;
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * 导出数据（用于分析）
 */
export function exportCollectedData(): string {
  const dataPoints = getAllDataPoints();
  return JSON.stringify(
    {
      dataPoints,
      exportedAt: Date.now(),
      totalPoints: dataPoints.length,
    },
    null,
    2,
  );
}

/**
 * 导出 realDataCollector 对象（兼容性）
 */
export const realDataCollector = {
  collectDataPoint,
  getAllDataPoints,
  getDataPointsByType,
  clearCollectedData,
  exportCollectedData,
};
