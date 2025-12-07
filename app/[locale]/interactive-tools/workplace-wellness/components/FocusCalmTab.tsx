"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useCalendar,
  useWorkplaceWellnessActions,
} from "../hooks/useWorkplaceWellnessStore";
import { CalendarState, MenstrualPhase } from "../types";
import { CyclePredictor } from "../utils/cyclePrediction";
import { CYCLE_SYNC_CONTENT } from "../data/cycle-sync-content";
import {
  Brain,
  Utensils,
  Dumbbell,
  Coffee,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function FocusCalmTab() {
  const t = useTranslations("workplaceWellness.focusCalm");
  const calendar = useCalendar() as CalendarState;
  const { setActiveTab } = useWorkplaceWellnessActions();

  // Calculate current phase
  const currentPhase = useMemo(() => {
    const predictor = new CyclePredictor("en"); // Locale doesn't affect calculation logic
    const analysis = predictor.analyzeCycle(calendar.periodData);
    return analysis.currentPhase || "menstrual"; // Default to menstrual if unknown
  }, [calendar.periodData]);

  const content = CYCLE_SYNC_CONTENT[currentPhase];
  
  // Get translated content
  const getTranslatedContent = (phase: MenstrualPhase) => {
    const phaseKey = `phases.${phase}`;
    return {
      title: t(`${phaseKey}.title`),
      description: t(`${phaseKey}.description`),
      energyLevel: content.energyLevel, // Keep numeric value
      recommendations: {
        work: {
          focus: t(`${phaseKey}.work.focus`),
          tips: [
            t(`${phaseKey}.work.tip1`),
            t(`${phaseKey}.work.tip2`),
            t(`${phaseKey}.work.tip3`),
            t(`${phaseKey}.work.tip4`),
          ],
        },
        nutrition: {
          focus: t(`${phaseKey}.nutrition.focus`),
          foods: [
            t(`${phaseKey}.nutrition.food1`),
            t(`${phaseKey}.nutrition.food2`),
            t(`${phaseKey}.nutrition.food3`),
            t(`${phaseKey}.nutrition.food4`),
          ],
        },
        exercise: {
          focus: t(`${phaseKey}.exercise.focus`),
          activities: [
            t(`${phaseKey}.exercise.activity1`),
            t(`${phaseKey}.exercise.activity2`),
            t(`${phaseKey}.exercise.activity3`),
            t(`${phaseKey}.exercise.activity4`),
          ],
        },
        selfCare: {
          focus: t(`${phaseKey}.selfCare.focus`),
          ritual: t(`${phaseKey}.selfCare.ritual`),
        },
      },
    };
  };
  
  const translatedContent = getTranslatedContent(currentPhase);

  const getPhaseColor = (phase: MenstrualPhase) => {
    switch (phase) {
      case "menstrual":
        return "text-red-500 bg-red-50 border-red-200";
      case "follicular":
        return "text-pink-500 bg-pink-50 border-pink-200";
      case "ovulation":
        return "text-purple-500 bg-purple-50 border-purple-200";
      case "luteal":
        return "text-orange-500 bg-orange-50 border-orange-200";
      default:
        return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  const getPhaseGradient = (phase: MenstrualPhase) => {
    switch (phase) {
      case "menstrual":
        return "from-red-500 to-pink-500";
      case "follicular":
        return "from-pink-500 to-purple-500";
      case "ovulation":
        return "from-purple-500 to-indigo-500";
      case "luteal":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${getPhaseGradient(
            currentPhase,
          )} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPhaseColor(
                currentPhase,
              )}`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {translatedContent.title}
            </div>
            <div className="text-sm text-gray-500">
              {t("energyLevel")}: {translatedContent.energyLevel}/10
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("todayFocus")}: {translatedContent.recommendations.work.focus}
          </h2>
          <p className="text-gray-600 max-w-2xl">{translatedContent.description}</p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t("workFocus")}</h3>
          </div>
          <ul className="space-y-3">
            {translatedContent.recommendations.work.tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start text-sm text-gray-600"
              >
                <span className="mr-2 text-blue-500">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Nutrition Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <Utensils className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t("nutrition")}</h3>
          </div>
          <ul className="space-y-3">
            {translatedContent.recommendations.nutrition.foods.map((food, index) => (
              <li
                key={index}
                className="flex items-start text-sm text-gray-600"
              >
                <span className="mr-2 text-green-500">•</span>
                {food}
              </li>
            ))}
          </ul>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-50 rounded-lg mr-3">
              <Dumbbell className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t("movement")}</h3>
          </div>
          <ul className="space-y-3">
            {translatedContent.recommendations.exercise.activities.map(
              (activity, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-600"
                >
                  <span className="mr-2 text-orange-500">•</span>
                  {activity}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Self Care Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-50 rounded-lg mr-3">
              <Coffee className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t("dailyRitual")}</h3>
          </div>
          <p className="text-sm text-gray-600 italic">
            &quot;{translatedContent.recommendations.selfCare.ritual}&quot;
          </p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setActiveTab("calendar")}
          className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {t("logSymptoms")}
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
