/**
 * Progress Storage - 压力管理进度数据存储
 * 管理用户的压力管理记录和进度数据
 */

// Using direct localStorage API instead of LocalStorageManager
import { logError } from "@/lib/debug-logger";

export interface ProgressEntry {
  id: string;
  date: string;
  stressLevel: number;
  techniques: string[];
  moodRating: number;
  notes?: string;
  timestamp: number;
}

export interface ProgressData {
  entries: ProgressEntry[];
  lastUpdated: number;
}

const STORAGE_KEY = "stress_management_progress";
const MAX_ENTRIES = 100; // 最多保存 100 条记录

/**
 * 获取所有进度记录
 */
export function getProgress(): ProgressData {
  if (typeof window === "undefined") {
    return { entries: [], lastUpdated: Date.now() };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  const data = stored ? (JSON.parse(stored) as ProgressData) : null;

  if (!data) {
    return {
      entries: [],
      lastUpdated: Date.now(),
    };
  }

  return data;
}

/**
 * 保存进度记录
 */
export function saveProgress(data: ProgressData): boolean {
  // 限制记录数量
  if (data.entries.length > MAX_ENTRIES) {
    data.entries = data.entries.slice(-MAX_ENTRIES);
  }

  data.lastUpdated = Date.now();
  try {
    if (typeof window === "undefined") return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    logError("Failed to save progress:", error, "progressStorage/saveProgress");
    return false;
  }
}

/**
 * 添加新记录
 */
export function saveEntry(
  entry: Omit<ProgressEntry, "id" | "timestamp">,
): boolean {
  const data = getProgress();

  const newEntry: ProgressEntry = {
    ...entry,
    id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };

  data.entries.push(newEntry);
  return saveProgress(data);
}

/**
 * 更新记录
 */
export function updateEntry(
  id: string,
  updates: Partial<ProgressEntry>,
): boolean {
  const data = getProgress();
  const index = data.entries.findIndex((e) => e.id === id);

  if (index === -1) return false;

  data.entries[index] = {
    ...data.entries[index],
    ...updates,
    timestamp: Date.now(),
  };

  return saveProgress(data);
}

/**
 * 删除记录
 */
export function deleteEntry(id: string): boolean {
  const data = getProgress();
  data.entries = data.entries.filter((e) => e.id !== id);
  return saveProgress(data);
}

/**
 * 获取最近的记录
 */
export function getRecentEntries(count: number = 10): ProgressEntry[] {
  const data = getProgress();
  return data.entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
}

/**
 * 获取日期范围内的记录
 */
export function getEntriesByDateRange(
  startDate: Date,
  endDate: Date,
): ProgressEntry[] {
  const data = getProgress();
  const start = startDate.getTime();
  const end = endDate.getTime();

  return data.entries.filter((entry) => {
    const entryTime = new Date(entry.date).getTime();
    return entryTime >= start && entryTime <= end;
  });
}

/**
 * 获取统计数据
 */
export function getStatistics() {
  const data = getProgress();

  if (data.entries.length === 0) {
    return {
      totalEntries: 0,
      averageStressLevel: 0,
      averageMoodRating: 0,
      averageStress: 0, // 别名
      averageMood: 0, // 别名
      techniquesUsedRate: 0,
      mostUsedTechniques: [],
      improvementTrend: 0,
    };
  }

  const totalStress = data.entries.reduce((sum, e) => sum + e.stressLevel, 0);
  const totalMood = data.entries.reduce((sum, e) => sum + e.moodRating, 0);

  // 统计技巧使用频率
  const techniqueCount: Record<string, number> = {};
  data.entries.forEach((entry) => {
    entry.techniques.forEach((tech) => {
      techniqueCount[tech] = (techniqueCount[tech] || 0) + 1;
    });
  });

  const mostUsedTechniques = Object.entries(techniqueCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tech, count]) => ({ technique: tech, count }));

  // 计算改善趋势（最近 7 天 vs 之前 7 天）
  const recent = data.entries.slice(-7);
  const previous = data.entries.slice(-14, -7);

  const recentAvg =
    recent.length > 0
      ? recent.reduce((sum, e) => sum + e.stressLevel, 0) / recent.length
      : 0;
  const previousAvg =
    previous.length > 0
      ? previous.reduce((sum, e) => sum + e.stressLevel, 0) / previous.length
      : 0;

  const improvementTrend =
    previousAvg > 0 ? ((previousAvg - recentAvg) / previousAvg) * 100 : 0;

  const avgStress = totalStress / data.entries.length;
  const avgMood = totalMood / data.entries.length;
  const techniquesUsedRate =
    data.entries.length > 0
      ? (data.entries.filter((e) => e.techniques.length > 0).length /
          data.entries.length) *
        100
      : 0;

  return {
    totalEntries: data.entries.length,
    averageStressLevel: avgStress,
    averageMoodRating: avgMood,
    averageStress: avgStress, // 别名
    averageMood: avgMood, // 别名
    techniquesUsedRate,
    mostUsedTechniques,
    improvementTrend,
  };
}

/**
 * 清空所有记录
 */
export function clearProgress(): boolean {
  try {
    if (typeof window === "undefined") return false;
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    logError(
      "Failed to clear progress:",
      error,
      "progressStorage/clearProgress",
    );
    return false;
  }
}

/**
 * 导出数据（用于备份）
 */
export function exportData(): string {
  const data = getProgress();
  return JSON.stringify(data, null, 2);
}

/**
 * 导入数据（从备份恢复）
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as ProgressData;

    // 验证数据格式
    if (!data.entries || !Array.isArray(data.entries)) {
      throw new Error("Invalid data format");
    }

    return saveProgress(data);
  } catch (error) {
    logError("Error importing data", error, "progressStorage/importData");
    return false;
  }
}

const getEntriesWithDate = (filter: (entryDate: number) => boolean) => {
  return getProgress().entries.filter((entry) => {
    const entryTime = new Date(entry.date).getTime();
    return filter(entryTime);
  });
};

export function getAllEntries(): ProgressEntry[] {
  return getProgress().entries;
}

export function getTodayEntries(): ProgressEntry[] {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);
  return getEntriesWithDate(
    (time) => time >= startOfDay.getTime() && time <= endOfDay.getTime(),
  );
}

export function getWeekEntries(): ProgressEntry[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return getEntriesWithDate((time) => time >= startOfWeek.getTime());
}

export function getMonthEntries(): ProgressEntry[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  return getEntriesWithDate((time) => time >= startOfMonth.getTime());
}

export function getStorageInfo() {
  const data = getProgress();
  const totalEntries = data.entries.length;
  const usagePercent = Math.round((totalEntries / MAX_ENTRIES) * 100);
  const isNearFull = usagePercent >= 80;
  const isFull = totalEntries >= MAX_ENTRIES;

  // Estimate storage size (rough calculation)
  const avgEntrySize = 200; // bytes per entry (rough estimate)
  const sizeInMB = (totalEntries * avgEntrySize) / (1024 * 1024);
  const maxSizeInMB = (MAX_ENTRIES * avgEntrySize) / (1024 * 1024);

  return {
    totalEntries,
    lastUpdated: data.lastUpdated,
    capacity: MAX_ENTRIES,
    usagePercent,
    isNearFull,
    isFull,
    sizeInMB: parseFloat(sizeInMB.toFixed(2)),
    maxSizeInMB: parseFloat(maxSizeInMB.toFixed(2)),
  };
}

export function deleteOldestEntries(count: number): boolean {
  const data = getProgress();
  data.entries = data.entries.slice(count);
  return saveProgress(data);
}

export function calculateStats(entries?: ProgressEntry[]) {
  if (entries && entries.length > 0) {
    // 如果提供了 entries，使用它们计算统计
    const totalStress = entries.reduce((sum, e) => sum + e.stressLevel, 0);
    const totalMood = entries.reduce((sum, e) => sum + e.moodRating, 0);

    // 统计技巧使用频率
    const techniqueCount: Record<string, number> = {};
    entries.forEach((entry) => {
      entry.techniques.forEach((tech) => {
        techniqueCount[tech] = (techniqueCount[tech] || 0) + 1;
      });
    });

    const mostUsedTechniques = Object.entries(techniqueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tech, count]) => ({ technique: tech, count }));

    // 计算改善趋势
    const recent = entries.slice(-7);
    const previous = entries.slice(-14, -7);

    const recentAvg =
      recent.length > 0
        ? recent.reduce((sum, e) => sum + e.stressLevel, 0) / recent.length
        : 0;
    const previousAvg =
      previous.length > 0
        ? previous.reduce((sum, e) => sum + e.stressLevel, 0) / previous.length
        : 0;

    const improvementTrend =
      previousAvg > 0 ? ((previousAvg - recentAvg) / previousAvg) * 100 : 0;

    const avgStress = totalStress / entries.length;
    const avgMood = totalMood / entries.length;
    const techniquesUsedRate =
      entries.length > 0
        ? (entries.filter((e) => e.techniques.length > 0).length /
            entries.length) *
          100
        : 0;

    return {
      totalEntries: entries.length,
      averageStressLevel: avgStress,
      averageMoodRating: avgMood,
      averageStress: avgStress, // 别名
      averageMood: avgMood, // 别名
      techniquesUsedRate,
      mostUsedTechniques,
      improvementTrend,
    };
  }
  // 否则使用默认的 getStatistics
  return getStatistics();
}

export function getStressColor(level: number) {
  if (level >= 8) return "#dc2626";
  if (level >= 5) return "#f97316";
  return "#059669";
}

export function getMoodColor(moodRating: number) {
  if (moodRating >= 8) return "#22c55e";
  if (moodRating >= 5) return "#facc15";
  return "#ef4444";
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const techniqueLabels: Record<string, string> = {
  breathing: "Breathing",
  meditation: "Meditation",
  exercise: "Exercise",
  yoga: "Yoga",
  music: "Music",
  nature: "Nature",
  journaling: "Journaling",
  social: "Social Support",
};

export function getTechniqueLabel(key: string) {
  return techniqueLabels[key] || key;
}
