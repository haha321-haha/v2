"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";

export default function MeditationTimer() {
  const t = useTranslations(
    "interactiveTools.stressManagement.meditationTimer",
  );

  const [duration, setDuration] = useState(5); // 分钟
  const [timeLeft, setTimeLeft] = useState(duration * 60); // 秒
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 更新倒计时
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            // 播放提示音
            if (audioRef.current) {
              audioRef.current
                .play()
                .catch((e) => console.log("Audio play failed:", e));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, timeLeft]);

  // 当选择新时长时，重置计时器
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration * 60);
      setIsCompleted(false);
    }
  }, [duration, isRunning]);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 计算进度百分比
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const handleStartPause = () => {
    if (isCompleted) {
      // 如果已完成，重新开始
      setTimeLeft(duration * 60);
      setIsCompleted(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const durations = [3, 5, 10, 15, 20];

  return (
    <div className="max-w-2xl mx-auto">
      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} preload="auto">
        <source src="/audio/meditation-bell.mp3" type="audio/mpeg" />
      </audio>

      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-2xl p-8 shadow-xl">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{t("subtitle")}</p>
        </div>

        {/* 时长选择 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
            {t("selectDuration")}
          </label>
          <div className="flex flex-wrap gap-2 justify-center">
            {durations.map((min) => (
              <button
                key={min}
                onClick={() => !isRunning && setDuration(min)}
                disabled={isRunning}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  duration === min
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } ${
                  isRunning
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                {min} {t("minutes")}
              </button>
            ))}
          </div>
        </div>

        {/* 进度环和倒计时显示 */}
        <div className="relative mb-8">
          {/* 进度环背景 */}
          <svg className="w-64 h-64 mx-auto transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* 倒计时文字 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatTime(timeLeft)}
            </div>
            {isCompleted && (
              <div className="mt-2 text-lg font-semibold text-green-600 dark:text-green-400 animate-pulse">
                {t("completed")} ✨
              </div>
            )}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartPause}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                {t("pause")}
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {isCompleted ? t("restart") : t("start")}
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            {t("reset")}
          </button>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            💡 {t("tip")}
          </p>
        </div>
      </div>
    </div>
  );
}
