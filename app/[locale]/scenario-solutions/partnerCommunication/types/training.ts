/**
 * 30天训练计划相关类型定义
 */

export interface TrainingDay {
  id: string;
  day: number;
  title: string;
  description: string;
  tasks: TrainingTask[];
  duration: number; // 分钟
  difficulty: "easy" | "medium" | "hard";
  category: "communication" | "understanding" | "support" | "care";
}

export interface TrainingTask {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  tips: string[];
  expectedOutcome: string;
}

export interface TrainingWeek {
  id: string;
  week: number;
  title: string;
  theme: string;
  description: string;
  days: TrainingDay[];
  weeklyGoal: string;
}

export interface TrainingProgress {
  completedDays: string[];
  currentDay: number;
  totalDays: number;
  completionPercentage: number;
  streak: number;
  lastCompletedDate?: Date;
}

export interface TrainingSession {
  dayId: string;
  startTime: Date;
  endTime?: Date;
  completedTasks: string[];
  notes?: string;
  rating?: number; // 1-5星评价
}

export interface TrainingStats {
  totalSessions: number;
  averageRating: number;
  longestStreak: number;
  currentStreak: number;
  favoriteCategory: string;
  improvementAreas: string[];
}
