"use client";

import { useState, useEffect, useCallback } from "react";
import { logError } from "@/lib/debug-logger";
import { AssessmentResult } from "../types";

export interface AssessmentHistoryEntry {
  id: string;
  sessionId: string;
  type:
    | "symptom"
    | "workplace"
    | "normal"
    | "mild"
    | "moderate"
    | "severe"
    | "emergency";
  mode: "simplified" | "detailed" | "medical";
  locale: string;
  score: number;
  maxScore: number;
  percentage: number;
  severity: "mild" | "moderate" | "severe" | "emergency";
  completedAt: string;
  summary: string;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    category: string;
  }>;
}

export interface AssessmentTrends {
  totalAssessments: number;
  averageScore: number;
  scoreTrend: "improving" | "stable" | "declining";
  mostCommonSeverity: "mild" | "moderate" | "severe" | "emergency";
  lastAssessmentDate: string;
  assessmentFrequency: "daily" | "weekly" | "monthly" | "irregular";
}

export const useAssessmentHistory = () => {
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);
  const [trends, setTrends] = useState<AssessmentTrends | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate trends from history - defined before useEffect to avoid dependency issues
  const calculateTrends = useCallback(
    (historyData: AssessmentHistoryEntry[]) => {
      if (historyData.length === 0) {
        setTrends(null);
        return;
      }

      const totalAssessments = historyData.length;
      const averageScore =
        historyData.reduce((sum, entry) => sum + entry.percentage, 0) /
        totalAssessments;

      // Calculate score trend (last 5 vs previous 5)
      const recentScores = historyData.slice(-5);
      const previousScores = historyData.slice(-10, -5);

      let scoreTrend: "improving" | "declining" | "stable" = "stable";
      if (previousScores.length > 0) {
        const recentAvg =
          recentScores.reduce((sum, entry) => sum + entry.percentage, 0) /
          recentScores.length;
        const previousAvg =
          previousScores.reduce((sum, entry) => sum + entry.percentage, 0) /
          previousScores.length;

        if (recentAvg > previousAvg + 5) scoreTrend = "improving";
        else if (recentAvg < previousAvg - 5) scoreTrend = "declining";
      }

      // Calculate assessment frequency
      let assessmentFrequency: "daily" | "weekly" | "monthly" | "irregular" =
        "irregular";
      if (historyData.length >= 2) {
        const dates = historyData.map((entry) => new Date(entry.completedAt));
        const intervals = [];
        for (let i = 1; i < dates.length; i++) {
          intervals.push(dates[i].getTime() - dates[i - 1].getTime());
        }
        const avgInterval =
          intervals.reduce((sum, interval) => sum + interval, 0) /
          intervals.length;
        const avgDays = avgInterval / (1000 * 60 * 60 * 24);

        if (avgDays <= 2) assessmentFrequency = "daily";
        else if (avgDays <= 10) assessmentFrequency = "weekly";
        else if (avgDays <= 35) assessmentFrequency = "monthly";
      }

      // Calculate most common severity
      const severityCounts = historyData.reduce(
        (acc, entry) => {
          acc[entry.severity] = (acc[entry.severity] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const mostCommonSeverity = Object.entries(severityCounts).reduce(
        (a, b) => (severityCounts[a[0]] > severityCounts[b[0]] ? a : b),
        ["mild", 0] as [string, number],
      )[0] as "mild" | "moderate" | "severe" | "emergency";

      // Get last assessment date
      const lastAssessmentDate =
        historyData.length > 0
          ? historyData[historyData.length - 1].completedAt
          : new Date().toISOString();

      setTrends({
        totalAssessments,
        averageScore,
        scoreTrend,
        mostCommonSeverity,
        lastAssessmentDate,
        assessmentFrequency,
      });
    },
    [],
  );

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("assessmentHistory");
      if (saved) {
        const parsedHistory = JSON.parse(saved);
        setHistory(parsedHistory);
        calculateTrends(parsedHistory);
      }
    } catch (error) {
      logError(
        "Error loading assessment history",
        error,
        "useAssessmentHistory",
      );
    } finally {
      setIsLoading(false);
    }
  }, [calculateTrends]);

  // Save assessment result to history
  const saveAssessmentResult = useCallback((result: AssessmentResult) => {
    const historyEntry: AssessmentHistoryEntry = {
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: result.sessionId,
      type: result.type,
      mode: (result.mode || "simplified") as
        | "simplified"
        | "detailed"
        | "medical",
      locale: result.locale,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      severity: result.severity,
      completedAt: result.completedAt,
      summary: result.summary,
      recommendations: result.recommendations.map((rec) => ({
        id: rec.id,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        category: rec.category,
      })),
    };

    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, historyEntry];

      // Calculate trends with new history
      if (newHistory.length === 0) {
        setTrends(null);
      } else {
        const totalAssessments = newHistory.length;
        const averageScore =
          newHistory.reduce((sum, entry) => sum + entry.percentage, 0) /
          totalAssessments;

        // Calculate score trend (comparing last 3 vs previous 3)
        let scoreTrend: "improving" | "stable" | "declining" = "stable";
        if (totalAssessments >= 6) {
          const recent =
            newHistory
              .slice(-3)
              .reduce((sum, entry) => sum + entry.percentage, 0) / 3;
          const previous =
            newHistory
              .slice(-6, -3)
              .reduce((sum, entry) => sum + entry.percentage, 0) / 3;
          const difference = recent - previous;

          if (difference > 5) scoreTrend = "improving";
          else if (difference < -5) scoreTrend = "declining";
        }

        // Find most common severity
        const severityCounts = newHistory.reduce(
          (counts, entry) => {
            counts[entry.severity] = (counts[entry.severity] || 0) + 1;
            return counts;
          },
          {} as Record<string, number>,
        );

        const mostCommonSeverity =
          (Object.entries(severityCounts).sort(
            ([, a], [, b]) => b - a,
          )[0]?.[0] as "mild" | "moderate" | "severe" | "emergency") || "mild";

        // Calculate assessment frequency
        const lastAssessmentDate =
          newHistory[newHistory.length - 1]?.completedAt || "";
        const now = new Date();
        const lastDate = new Date(lastAssessmentDate);
        const daysSinceLast = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        let assessmentFrequency: "daily" | "weekly" | "monthly" | "irregular" =
          "irregular";
        if (daysSinceLast <= 1) assessmentFrequency = "daily";
        else if (daysSinceLast <= 7) assessmentFrequency = "weekly";
        else if (daysSinceLast <= 30) assessmentFrequency = "monthly";

        setTrends({
          totalAssessments,
          averageScore: Math.round(averageScore),
          scoreTrend,
          mostCommonSeverity,
          lastAssessmentDate,
          assessmentFrequency,
        });
      }

      // Save to localStorage
      try {
        localStorage.setItem("assessmentHistory", JSON.stringify(newHistory));
      } catch (error) {
        logError(
          "Error saving assessment history",
          error,
          "useAssessmentHistory",
        );
      }

      return newHistory;
    });
  }, []);

  // Get recent assessments
  const getRecentAssessments = useCallback(
    (limit: number = 5) => {
      return history.slice(-limit).reverse();
    },
    [history],
  );

  // Get assessments by mode
  const getAssessmentsByMode = useCallback(
    (mode: "simplified" | "detailed" | "medical") => {
      return history.filter((entry) => entry.mode === mode);
    },
    [history],
  );

  // Get assessments by severity
  const getAssessmentsBySeverity = useCallback(
    (severity: "mild" | "moderate" | "severe" | "emergency") => {
      return history.filter((entry) => entry.severity === severity);
    },
    [history],
  );

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setTrends(null);
    try {
      localStorage.removeItem("assessmentHistory");
    } catch (error) {
      logError(
        "Error clearing assessment history",
        error,
        "useAssessmentHistory",
      );
    }
  }, []);

  // Export history
  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `assessment-history-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [history]);

  return {
    history,
    trends,
    isLoading,
    saveAssessmentResult,
    getRecentAssessments,
    getAssessmentsByMode,
    getAssessmentsBySeverity,
    clearHistory,
    exportHistory,
  };
};
