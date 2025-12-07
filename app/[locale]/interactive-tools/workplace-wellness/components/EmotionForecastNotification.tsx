"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { X, Sparkles } from "lucide-react";
import { useCalendar } from "../hooks/useWorkplaceWellnessStore";
import { CalendarState } from "../types";
import { CyclePredictor } from "../utils/cyclePrediction";
import { getEmotionForecasts } from "../data/emotion-forecast-content";

export default function EmotionForecastNotification() {
  const calendar = useCalendar() as CalendarState;
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate current phase
  const currentPhase = useMemo(() => {
    if (!calendar?.periodData) return "menstrual";
    const predictor = new CyclePredictor("en");
    const analysis = predictor.analyzeCycle(calendar.periodData);
    return analysis.currentPhase || "menstrual";
  }, [calendar?.periodData]);

  const forecasts = getEmotionForecasts(locale);
  const forecast = forecasts[currentPhase];
  const Icon = forecast.icon;

  if (!isMounted || !isVisible) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 relative animate-in slide-in-from-top-4 duration-500 shadow-sm">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-full shadow-sm border border-indigo-100 mt-1">
          <Icon className="w-6 h-6 text-indigo-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wide">
              {forecast.phase} Forecast
            </span>
            <Sparkles className="w-3 h-3 text-indigo-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">
            {forecast.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {forecast.description}
          </p>
          <div className="bg-white/60 rounded-lg p-3 text-sm text-indigo-800 border border-indigo-100/50 flex gap-2">
            <span className="font-bold">💡 Tip:</span>
            {forecast.tip}
          </div>
        </div>
      </div>
    </div>
  );
}
