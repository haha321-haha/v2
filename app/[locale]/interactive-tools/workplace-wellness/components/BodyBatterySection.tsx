"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBodyBattery, CyclePhase } from "../hooks/useBodyBattery";
import DownloadModal from "../../../../../components/DownloadModal"; // Adjust path as needed

interface BodyBatterySectionProps {
  onClose?: () => void;
  currentPhase?: CyclePhase; // Optional, can be passed from parent or defaulted
}

export default function BodyBatterySection({
  onClose,
  currentPhase = "menstrual",
}: BodyBatterySectionProps) {
  const t = useTranslations("homePage.tools.body_battery");
  const { calculateBattery } = useBodyBattery();

  const [energyLevel, setEnergyLevel] = useState(50);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // State for result display
  const [result, setResult] = useState<ReturnType<
    typeof calculateBattery
  > | null>(null);

  const handleSubmit = () => {
    const calculatedResult = calculateBattery({
      energyLevel,
      sleepQuality,
      stressLevel,
      currentPhase,
    });
    setResult(calculatedResult);
    setShowResults(true);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
          <span className="text-4xl animate-pulse">🔋</span>
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {t("title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t("desc")}</p>
      </div>

      {!showResults ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              {t("form.energy_level")}:{" "}
              <span className="text-purple-600 font-bold">{energyLevel}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{t("form.energy_level_hint")}</span>
              <span>{t("form.energy_level_hint_end")}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              {t("form.sleep_quality")}:{" "}
              <span className="text-blue-600 font-bold">{sleepQuality}/10</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setSleepQuality(num)}
                  className={`flex-1 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    sleepQuality === num
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md scale-105"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              {t("form.stress_level")}:{" "}
              <span className="text-red-500 font-bold">{stressLevel}/10</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setStressLevel(num)}
                  className={`flex-1 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    stressLevel === num
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md scale-105"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔄</span>
              <span className="font-medium text-purple-900 dark:text-purple-100">
                {t("form.period_status")}
              </span>
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              {t("adjustments.current_phase")}:{" "}
              <span className="font-bold capitalize">{currentPhase}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("form.calculate_button")}
          </button>
        </div>
      ) : (
        result && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 shadow-inner">
              <div className="text-6xl mb-4 animate-bounce">{result.icon}</div>
              <div
                className={`text-5xl font-black ${result.color} mb-2 tracking-tight`}
              >
                {result.batteryLevel}%
              </div>
              <div className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                {t("form.battery_status")}: {result.status}
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-xs font-semibold text-purple-600 uppercase">
                    {t("form.energy_capacity")}
                  </div>
                  <div className="text-xs font-semibold text-purple-600">
                    Max: {result.maxBattery}%
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner">
                  <div
                    style={{ width: `${result.batteryLevel}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out ${
                      result.batteryLevel >= 60
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : result.batteryLevel >= 40
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : "bg-gradient-to-r from-red-400 to-red-500"
                    }`}
                  />
                </div>
              </div>

              {result.phaseAdjustment && (
                <div className="mt-4 text-sm bg-white/60 dark:bg-black/20 p-2 rounded-lg text-gray-600 dark:text-gray-400 italic">
                  ℹ️ {result.phaseAdjustment}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <span>💡</span> {t("form.recommendations")}:
              </h3>

              {result.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-700 dark:text-gray-200">{rec}</p>
                </div>
              ))}
            </div>

            {/* PDF Download Section */}
            <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border border-pink-100 dark:border-pink-800/30">
              <h4 className="font-bold mb-3 flex items-center text-gray-900 dark:text-white">
                <span className="mr-2 text-2xl">📊</span>
                {t("form.pdf_report")}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t("form.pdf_description")}
              </p>
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>📥</span>
                {t("form.pdf_button")}
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {t("form.pdf_footer")}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResults(false)}
                className="flex-1 border-2 border-gray-200 dark:border-gray-600 px-4 py-3.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 transition-colors"
              >
                {t("form.retake")}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t("form.done")}
                </button>
              )}
            </div>
          </div>
        )
      )}

      {/* Email Collection Modal */}
      <DownloadModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        source="body_battery_complete"
        description={t("form.pdf_description")}
      />
    </div>
  );
}
