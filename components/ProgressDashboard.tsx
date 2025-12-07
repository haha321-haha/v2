"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllEntries,
  calculateStats,
  formatDate,
  getTechniqueLabel,
  getStressColor,
  getMoodColor,
  type ProgressEntry,
} from "@/lib/progressStorage";

interface ProgressDashboardProps {
  locale: string;
}

export default function ProgressDashboard({ locale }: ProgressDashboardProps) {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 加载数据
    const loadedEntries = getAllEntries();
    setEntries(loadedEntries);
    setIsLoading(false);
  }, []);

  // 计算统计数据
  const stats = calculateStats(entries);

  // 获取最近的5条记录
  const recentEntries = [...entries].reverse().slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* 统计数据 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">
          {entries.length > 0 ? "Your Statistics" : "Sample Data Preview"}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-1 ${getStressColor(
                  stats.averageStress,
                )}`}
              >
                {stats.averageStress || "7.2"}
              </div>
              <div className="text-sm text-gray-600">Average Stress</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.techniquesUsedRate || 85}%
              </div>
              <div className="text-sm text-gray-600">Techniques Used</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-1 ${getMoodColor(
                  stats.averageMood,
                )}`}
              >
                {stats.averageMood || "6.8"}
              </div>
              <div className="text-sm text-gray-600">Average Mood</div>
            </div>
          </div>
        </div>
      </div>

      {/* 最近的记录 */}
      {entries.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Entries</h3>
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="border-l-4 border-purple-500 bg-gray-50 p-4 rounded-r-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-600">
                    {formatDate(entry.date)}
                  </div>
                  <div className="flex gap-4">
                    <span
                      className={`font-semibold ${getStressColor(
                        entry.stressLevel,
                      )}`}
                    >
                      Stress: {entry.stressLevel}/10
                    </span>
                    <span
                      className={`font-semibold ${getMoodColor(
                        entry.moodRating,
                      )}`}
                    >
                      Mood: {entry.moodRating}/10
                    </span>
                  </div>
                </div>
                {entry.techniques.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {entry.techniques.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {getTechniqueLabel(tech)}
                      </span>
                    ))}
                  </div>
                )}
                {entry.notes && (
                  <p className="text-sm text-gray-700 italic">
                    &quot;{entry.notes}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {entries.length === 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center mb-8">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Entries Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start tracking your stress management progress by adding your first
            entry.
          </p>
          <Link
            href={`/${locale}/interactive-tools/stress-management/progress/add`}
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Add Your First Entry
          </Link>
        </div>
      )}
    </>
  );
}
