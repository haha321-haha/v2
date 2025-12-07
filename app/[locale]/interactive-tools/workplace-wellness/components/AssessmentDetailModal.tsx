"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { X, Calendar, Activity, AlertCircle } from "lucide-react";
import { AssessmentRecord } from "../types";

interface AssessmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentRecord | null;
}

export default function AssessmentDetailModal({
  isOpen,
  onClose,
  assessment,
}: AssessmentDetailModalProps) {
  const t = useTranslations("interactiveTools.stressManagement");
  const ui = useTranslations("ui");

  if (!isOpen || !assessment) return null;

  // Format date
  const date = new Date(assessment.timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score < 30) return "text-green-600 bg-green-50 border-green-200";
    if (score < 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const scoreColorClass = getScoreColor(assessment.stressScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("results.title") || "Assessment Results"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {date}
          </div>

          {/* Score Card */}
          <div
            className={`p-6 rounded-xl border ${scoreColorClass} text-center`}
          >
            <div className="text-sm font-medium uppercase tracking-wide mb-1 opacity-80">
              Stress Level
            </div>
            <div className="text-4xl font-bold mb-2">
              {assessment.stressScore}
            </div>
            <div className="text-lg font-medium">
              {assessment.stressLevel ||
                (assessment.stressScore < 30
                  ? "Low"
                  : assessment.stressScore < 60
                    ? "Moderate"
                    : "High")}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-500" />
              Assessment Type
            </h4>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
              Stress Assessment
            </div>
          </div>

          {/* Premium Status */}
          {assessment.isPremium && (
            <div className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              Premium Analysis Included
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            {ui("close") || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
