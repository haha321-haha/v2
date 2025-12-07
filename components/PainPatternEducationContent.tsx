"use client";

import React from "react";
import PainPatternRecognition from "./PainPatternRecognition";
import InfluencingFactors from "./InfluencingFactors";
import OptimizationStrategies from "./OptimizationStrategies";

interface PainPatternEducationContentProps {
  className?: string;
  showInfluencingFactors?: boolean;
  showOptimizationStrategies?: boolean;
}

export default function PainPatternEducationContent({
  className = "",
  showInfluencingFactors = true,
  showOptimizationStrategies = true,
}: PainPatternEducationContentProps) {
  return (
    <div className={className}>
      {/* Main pain pattern recognition component */}
      <PainPatternRecognition />

      {/* Influencing factors component */}
      {showInfluencingFactors && <InfluencingFactors />}

      {/* Optimization strategies component */}
      {showOptimizationStrategies && <OptimizationStrategies />}
    </div>
  );
}

// Export individual components for flexible usage
export { PainPatternRecognition, InfluencingFactors, OptimizationStrategies };
