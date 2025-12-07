import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

interface BodyBatteryInputs {
  energyLevel: number; // 0-100
  sleepQuality: number; // 1-10
  stressLevel: number; // 1-10
  currentPhase: CyclePhase;
}

interface BodyBatteryResult {
  batteryLevel: number;
  maxBattery: number;
  status: string;
  color: string;
  icon: string;
  phaseAdjustment: string;
  recommendations: string[];
}

export function useBodyBattery() {
  const t = useTranslations("homePage.tools.body_battery");

  const calculateBattery = (inputs: BodyBatteryInputs): BodyBatteryResult => {
    const { energyLevel, sleepQuality, stressLevel, currentPhase } = inputs;

    // 1. 基础计算
    // 睡眠权重: 10 (1-10 -> 10-100)
    // 压力权重: 10 (1-10 -> 10-100)
    // 能量权重: 1
    let rawBattery = energyLevel + sleepQuality * 5 - stressLevel * 5;

    // 2. 周期适应性调整 (Cycle Adaptability)
    let maxBattery = 100;
    let phaseMultiplier = 1.0;
    let phaseAdjustmentMsg = "";

    switch (currentPhase) {
      case "menstrual":
        maxBattery = 85; // 生理期能量上限降低
        phaseMultiplier = 0.9; // 恢复效率降低
        phaseAdjustmentMsg = t("adjustments.menstrual");
        break;
      case "follicular":
        maxBattery = 100;
        phaseMultiplier = 1.1; // 卵泡期能量恢复快
        phaseAdjustmentMsg = t("adjustments.follicular");
        break;
      case "ovulation":
        maxBattery = 100;
        phaseMultiplier = 1.05; // 排卵期精力充沛但消耗也大
        phaseAdjustmentMsg = t("adjustments.ovulation");
        break;
      case "luteal":
        maxBattery = 90; // 黄体期能量开始下降
        phaseMultiplier = 0.95;
        phaseAdjustmentMsg = t("adjustments.luteal");
        break;
    }

    // 应用周期系数
    let adjustedBattery = rawBattery * phaseMultiplier;

    // 3. 边界处理
    adjustedBattery = Math.min(maxBattery, Math.max(0, adjustedBattery));

    // 4. 状态判定
    let status = "";
    let color = "";
    let icon = "";

    if (adjustedBattery >= 80) {
      status = t("form.excellent");
      color = "text-green-500";
      icon = "🔋✨";
    } else if (adjustedBattery >= 60) {
      status = t("form.good");
      color = "text-blue-500";
      icon = "🔋";
    } else if (adjustedBattery >= 40) {
      status = t("form.moderate");
      color = "text-yellow-500";
      icon = "🔋⚠️";
    } else if (adjustedBattery >= 20) {
      status = t("form.low");
      color = "text-orange-500";
      icon = "🪫";
    } else {
      status = t("form.critical");
      color = "text-red-500";
      icon = "🪫⚠️";
    }

    // 5. 智能建议生成
    const recommendations: string[] = [];
    if (adjustedBattery < 40) recommendations.push(t("recommendations.rest"));
    if (stressLevel > 7) recommendations.push(t("recommendations.destress"));
    if (sleepQuality < 6) recommendations.push(t("recommendations.sleep"));
    if (currentPhase === "menstrual")
      recommendations.push(t("recommendations.warm"));

    return {
      batteryLevel: Math.round(adjustedBattery),
      maxBattery,
      status,
      color,
      icon,
      phaseAdjustment: phaseAdjustmentMsg,
      recommendations,
    };
  };

  return {
    calculateBattery,
  };
}
