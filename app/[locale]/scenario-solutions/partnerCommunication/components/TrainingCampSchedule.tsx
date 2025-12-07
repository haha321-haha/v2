"use client";

import React, { useState } from "react";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { useTrainingState } from "../stores/partnerHandbookStore";
import { TrainingWeek, TrainingDay } from "../types/training";
import { Locale } from "../types/common";

interface TrainingCampScheduleProps {
  locale: Locale;
  onDayComplete: (dayId: string) => void;
  className?: string;
}

export default function TrainingCampSchedule({
  locale,
  onDayComplete,
  className = "",
}: TrainingCampScheduleProps) {
  const { t } = useSafeTranslations("partnerHandbook.trainingCamp");
  const { t: tCommon } = useSafeTranslations("partnerHandbook");
  const { completedDays } = useTrainingState();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  // 从翻译中获取训练计划数据
  const trainingWeeks: TrainingWeek[] = [
    {
      id: "week1",
      week: 1,
      title: t("weeks.0.title"),
      theme: t("weeks.0.theme"),
      description: t("weeks.0.description"),
      weeklyGoal: t("weeks.0.weeklyGoal"),
      days: [
        {
          id: "day1",
          day: 1,
          title: t("weeks.0.days.0.title"),
          description: t("weeks.0.days.0.description"),
          duration: 5,
          difficulty: "easy",
          category: "understanding",
          tasks: [
            {
              id: "task1",
              title: t("weeks.0.days.0.tasks.0.title"),
              description: t("weeks.0.days.0.tasks.0.description"),
              instructions: [
                t("weeks.0.days.0.tasks.0.instructions.0"),
                t("weeks.0.days.0.tasks.0.instructions.1"),
                t("weeks.0.days.0.tasks.0.instructions.2"),
              ],
              tips: [
                t("weeks.0.days.0.tasks.0.tips.0"),
                t("weeks.0.days.0.tasks.0.tips.1"),
                t("weeks.0.days.0.tasks.0.tips.2"),
              ],
              expectedOutcome: t("weeks.0.days.0.tasks.0.expectedOutcome"),
            },
          ],
        },
      ],
    },
  ];

  const currentWeek = trainingWeeks[selectedWeek];
  const totalDays = 30;
  const completionPercentage = Math.round(
    (completedDays.length / totalDays) * 100,
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "communication":
        return "💬";
      case "understanding":
        return "🧠";
      case "support":
        return "🤗";
      case "care":
        return "❤️";
      default:
        return "📝";
    }
  };

  const handleDayClick = (day: TrainingDay) => {
    setSelectedDay(day);
    setShowTaskDetail(true);
  };

  const handleTaskComplete = (dayId: string) => {
    onDayComplete(dayId);
    setShowTaskDetail(false);
    setSelectedDay(null);
  };

  return (
    <div className={`training-camp-container ${className}`}>
      {/* 训练营标题和介绍 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary-600 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 mb-6 max-w-3xl mx-auto">{t("intro")}</p>
      </div>

      {/* 整体进度 */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {tCommon("overallProgress")}
          </h3>
          <span className="text-lg font-bold text-primary-600">
            {completionPercentage}%
          </span>
        </div>
        <div className="quiz-progress mb-4">
          <div
            className="quiz-progress-bar"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {locale === "zh"
              ? `已完成 ${completedDays.length} 天`
              : `${completedDays.length} days completed`}
          </span>
          <span>
            {locale === "zh"
              ? `剩余 ${totalDays - completedDays.length} 天`
              : `${totalDays - completedDays.length} days remaining`}
          </span>
        </div>
      </div>

      {/* 周选择器 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {tCommon("selectTrainingWeek")}
        </h3>
        <div className="flex flex-wrap gap-4">
          {trainingWeeks.map((week, index) => (
            <button
              key={week.id}
              onClick={() => setSelectedWeek(index)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedWeek === index
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-primary-300"
              }`}
            >
              {week.title}
            </button>
          ))}
        </div>
      </div>

      {/* 当前周详情 */}
      {currentWeek && (
        <div className="training-week-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {currentWeek.title}
            </h3>
            <span className="text-sm text-gray-600">
              {locale === "zh"
                ? `第 ${currentWeek.week} 周`
                : `Week ${currentWeek.week}`}
            </span>
          </div>

          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
              {currentWeek.theme}
            </span>
            <p className="text-gray-700 mb-4">{currentWeek.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                {tCommon("weeklyGoal")}
              </h4>
              <p className="text-blue-700">{currentWeek.weeklyGoal}</p>
            </div>
          </div>

          {/* 训练天数网格 */}
          <div className="responsive-grid">
            {currentWeek.days.map((day) => (
              <div
                key={day.id}
                onClick={() => handleDayClick(day)}
                className={`training-day-card cursor-pointer ${
                  completedDays.includes(day.id) ? "completed" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">
                    {getCategoryIcon(day.category)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      day.difficulty,
                    )}`}
                  >
                    {day.difficulty}
                  </span>
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">
                  {locale === "zh" ? `第 ${day.day} 天` : `Day ${day.day}`}
                </h4>
                <h5 className="font-medium text-gray-700 mb-2">{day.title}</h5>
                <p className="text-sm text-gray-600 mb-3">{day.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {day.duration} {tCommon("minutes")}
                  </span>
                  {completedDays.includes(day.id) && (
                    <span className="text-green-600 font-medium">
                      ✓ {tCommon("completed")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 任务详情模态框 */}
      {showTaskDetail && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedDay.title}
              </h3>
              <button
                onClick={() => setShowTaskDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-4">{selectedDay.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  {selectedDay.duration} {tCommon("minutes")}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    selectedDay.difficulty,
                  )}`}
                >
                  {selectedDay.difficulty}
                </span>
                <span>
                  {getCategoryIcon(selectedDay.category)} {selectedDay.category}
                </span>
              </div>
            </div>

            {/* 任务列表 */}
            <div className="space-y-4">
              {selectedDay.tasks.map((task, index) => (
                <div key={task.id} className="training-task">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {index + 1}. {task.title}
                  </h4>
                  <p className="text-gray-700 mb-3">{task.description}</p>

                  <div className="mb-3">
                    <h5 className="font-medium text-gray-800 mb-2">
                      {tCommon("instructions")}
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {task.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <h5 className="font-medium text-gray-800 mb-2">
                      {tCommon("tips")}
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {task.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="font-medium text-green-800 mb-1">
                      {tCommon("expectedOutcome")}
                    </h5>
                    <p className="text-green-700 text-sm">
                      {task.expectedOutcome}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 完成按钮 */}
            <div className="mt-6 text-center">
              <button
                onClick={() => handleTaskComplete(selectedDay.id)}
                disabled={completedDays.includes(selectedDay.id)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {completedDays.includes(selectedDay.id)
                  ? tCommon("completed")
                  : tCommon("markAsComplete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
