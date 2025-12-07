"use client";

import React from "react";
import { useLocale } from "next-intl";
import { getWellnessPromises } from "@/app/[locale]/interactive-tools/workplace-wellness/data/wellness-promises";
import { ArrowRight } from "lucide-react";

interface WellnessPromiseCardProps {
  painPoint: string;
}

export default function WellnessPromiseCard({
  painPoint,
}: WellnessPromiseCardProps) {
  const locale = useLocale();

  // Get promise data based on pain point, fallback to default if not found
  const promises = getWellnessPromises(locale);
  const promise = promises[painPoint] || promises["default"];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-6 mb-8 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {promise.title}
        </h3>
        <p className="text-gray-600 text-sm max-w-lg mx-auto">
          {promise.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-purple-100 -z-10" />

        {promise.timeline.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center relative"
            >
              <div className="w-12 h-12 bg-white rounded-full border-2 border-purple-100 flex items-center justify-center mb-3 shadow-sm z-10">
                <Icon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">
                Week {step.week}
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed px-2">
                {step.description}
              </p>

              {/* Mobile Arrow */}
              {index < promise.timeline.length - 1 && (
                <div className="md:hidden my-2 text-purple-300">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
