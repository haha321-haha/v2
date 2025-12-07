"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

interface BreathingExerciseToolProps {
  locale?: string;
}

export default function BreathingExerciseTool({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: _locale = "zh",
}: BreathingExerciseToolProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">(
    "inhale",
  );
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);

  const phases = useMemo(
    () => ({
      inhale: { duration: 4, next: "hold" as const },
      hold: { duration: 7, next: "exhale" as const },
      exhale: { duration: 8, next: "pause" as const },
      pause: { duration: 2, next: "inhale" as const },
    }),
    [],
  );

  // ✅ 使用翻译系统替代硬编码
  const t = useTranslations("breathingExercise");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const currentPhase = phases[phase];
            const nextPhase = currentPhase.next;
            setPhase(nextPhase);

            if (nextPhase === "inhale") {
              setCycle((c) => c + 1);
            }

            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, phases]);

  const startExercise = () => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(4);
    setCycle(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(4);
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6 text-center">
      <div className="mb-6">
        <div
          className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
            isActive
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300 bg-gray-100"
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{timeLeft}</div>
            <div className="text-sm text-blue-600">{t(`phases.${phase}`)}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-700">
          {t("buttons.oneCycleCompleted")}: {cycle}
        </div>
      </div>

      <button
        onClick={isActive ? stopExercise : startExercise}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          isActive
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isActive ? t("buttons.stopPractice") : t("buttons.startPractice")}
      </button>
    </div>
  );
}
