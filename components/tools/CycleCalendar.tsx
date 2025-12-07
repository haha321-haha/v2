import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Droplet, Zap, Moon, Sun, Edit2 } from "lucide-react";
import { format, differenceInDays, parseISO, isValid } from "date-fns";

type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
}

export const CycleCalendar = () => {
  const t = useTranslations("CycleCalendar");
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<CycleData>({
    lastPeriodDate: format(new Date(), "yyyy-MM-dd"),
    cycleLength: 28,
    periodLength: 5,
  });

  useEffect(() => {
    const saved = localStorage.getItem("periodhub_cycle_data");
    if (saved) {
      try {
        setCycleData(JSON.parse(saved));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse cycle data", e);
      }
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("periodhub_cycle_data", JSON.stringify(tempData));
    setCycleData(tempData);
    setIsEditing(false);
  };

  const calculatePhase = (
    data: CycleData,
  ): { phase: CyclePhase; dayInCycle: number; nextPeriodDays: number } => {
    const lastPeriod = parseISO(data.lastPeriodDate);
    if (!isValid(lastPeriod))
      return { phase: "luteal", dayInCycle: 1, nextPeriodDays: 0 };

    const today = new Date();
    const diff = differenceInDays(today, lastPeriod);
    const dayInCycle = (diff % data.cycleLength) + 1;
    const nextPeriodDays = data.cycleLength - dayInCycle + 1;

    let phase: CyclePhase = "luteal";
    if (dayInCycle <= data.periodLength) phase = "menstrual";
    else if (dayInCycle <= 13) phase = "follicular";
    else if (dayInCycle <= 16) phase = "ovulation";

    return { phase, dayInCycle, nextPeriodDays };
  };

  if (isEditing || !cycleData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          {t("setupTitle")}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("lastPeriodLabel")}
            </label>
            <input
              type="date"
              value={tempData.lastPeriodDate}
              onChange={(e) =>
                setTempData({ ...tempData, lastPeriodDate: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("cycleLengthLabel")}
              </label>
              <input
                type="number"
                value={tempData.cycleLength}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    cycleLength: parseInt(e.target.value) || 28,
                  })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("periodLengthLabel")}
              </label>
              <input
                type="number"
                value={tempData.periodLength}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    periodLength: parseInt(e.target.value) || 5,
                  })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            {t("saveButton")}
          </button>
        </div>
      </div>
    );
  }

  const { phase, dayInCycle, nextPeriodDays } = calculatePhase(cycleData);

  const phaseConfig = {
    menstrual: {
      color: "text-red-500",
      bg: "bg-red-50",
      icon: Droplet,
      label: t("phases.menstrual"),
      focus: t("focus.menstrual"),
    },
    follicular: {
      color: "text-pink-500",
      bg: "bg-pink-50",
      icon: Zap,
      label: t("phases.follicular"),
      focus: t("focus.follicular"),
    },
    ovulation: {
      color: "text-purple-500",
      bg: "bg-purple-50",
      icon: Sun,
      label: t("phases.ovulation"),
      focus: t("focus.ovulation"),
    },
    luteal: {
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      icon: Moon,
      label: t("phases.luteal"),
      focus: t("focus.luteal"),
    },
  };

  const currentConfig = phaseConfig[phase];
  const Icon = currentConfig.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Icon className={`w-6 h-6 ${currentConfig.color}`} />
            {currentConfig.label}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {t("dayCounter", { day: dayInCycle })}
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className={`rounded-xl p-4 mb-6 ${currentConfig.bg}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-white/50 ${currentConfig.color}`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-semibold ${currentConfig.color} mb-1`}>
              {t("todaysFocus")}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {currentConfig.focus}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
        <span>{t("nextPeriod")}</span>
        <span className="font-medium text-gray-900">
          {t("daysLeft", { count: nextPeriodDays })}
        </span>
      </div>
    </div>
  );
};
