"use client";

import React, { useState, useEffect } from "react";
import {
  getTrainingCampConfig,
  calculateTrainingProgress,
  TrainingDay,
} from "../config/trainingCampConfigI18n";
import { Locale } from "../types/common";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { logError } from "@/lib/debug-logger";

interface TrainingCampDisplayProps {
  locale: Locale;
}

const TrainingCampDisplay: React.FC<TrainingCampDisplayProps> = ({
  locale,
}) => {
  const { t } = useSafeTranslations("partnerHandbook");
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  // 获取训练营配置
  const trainingCampConfig = getTrainingCampConfig(locale);

  // 加载进度（从localStorage）
  useEffect(() => {
    const savedProgress = localStorage.getItem("trainingCampProgress");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCompletedDays(new Set(progress));
      } catch (error) {
        logError(
          "Failed to load training progress",
          error,
          "TrainingCampDisplay",
        );
      }
    }
  }, []);

  // 切换周展开状态
  const toggleWeek = (weekNumber: number) => {
    const newExpandedWeeks = new Set(expandedWeeks);
    if (newExpandedWeeks.has(weekNumber)) {
      newExpandedWeeks.delete(weekNumber);
    } else {
      newExpandedWeeks.add(weekNumber);
    }
    setExpandedWeeks(newExpandedWeeks);
  };

  // 标记任务完成
  const handleDayToggle = (day: number) => {
    const newCompletedDays = new Set(completedDays);
    if (newCompletedDays.has(day)) {
      newCompletedDays.delete(day);
    } else {
      newCompletedDays.add(day);
    }
    setCompletedDays(newCompletedDays);

    // 保存到localStorage
    localStorage.setItem(
      "trainingCampProgress",
      JSON.stringify([...newCompletedDays]),
    );
  };

  // 获取总体进度
  const overallProgress = calculateTrainingProgress([...completedDays]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 总体进度条 */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("trainingProgress")}
          </h3>
          <span className="text-sm text-gray-600">
            {locale === "zh"
              ? `${overallProgress.completed}/${overallProgress.total} 天完成`
              : `${overallProgress.completed}/${overallProgress.total} days completed`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {overallProgress.percentage}% {t("complete")}
        </div>
      </div>

      {/* 训练营周列表 */}
      <div className="space-y-6">
        {trainingCampConfig.weeks.map((week) => {
          const isExpanded = expandedWeeks.has(week.week);
          const weekCompletedDays = week.days.filter((day) =>
            completedDays.has(day.day),
          ).length;
          const weekProgress = {
            completed: weekCompletedDays,
            total: week.days.length,
            percentage:
              week.days.length > 0
                ? Math.round((weekCompletedDays / week.days.length) * 100)
                : 0,
          };

          return (
            <div
              key={week.week}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* 周标题栏 */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleWeek(week.week)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {week.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{week.goal}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {t("progress")}:
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {weekProgress.completed}/{weekProgress.total}
                        </span>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${weekProgress.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        {weekProgress.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 展开的任务列表 */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="p-6 space-y-4">
                    {week.days.map((day) => (
                      <DayTask
                        key={day.day}
                        day={day}
                        isCompleted={completedDays.has(day.day)}
                        onToggle={() => handleDayToggle(day.day)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 每日任务组件
interface DayTaskProps {
  day: TrainingDay;
  isCompleted: boolean;
  onToggle: () => void;
}

const DayTask: React.FC<DayTaskProps> = ({ day, isCompleted, onToggle }) => {
  const { t } = useSafeTranslations("partnerHandbook");

  return (
    <div
      className={`border rounded-lg p-4 transition-all duration-200 ${
        isCompleted
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={onToggle}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          {isCompleted && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-500">
              {t("day")} {day.day} {t("daySuffix")}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isCompleted ? t("completed") : t("pending")}
            </span>
          </div>
          <h4 className="font-medium text-gray-800 mb-2">{day.name}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {day.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingCampDisplay;
