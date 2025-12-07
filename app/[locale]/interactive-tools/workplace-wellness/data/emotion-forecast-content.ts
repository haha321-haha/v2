import { CloudRain, Sun, Zap, Wind } from "lucide-react";

export interface EmotionForecast {
  phase: "menstrual" | "follicular" | "ovulation" | "luteal";
  title: string;
  description: string;
  tip: string;
  icon: any;
}

export const getEmotionForecasts = (
  locale: string,
): Record<string, EmotionForecast> => {
  const isZh = locale === "zh";

  return {
    menstrual: {
      phase: "menstrual",
      title: isZh ? "内省与休息" : "Introspection & Rest",
      description: isZh
        ? "荷尔蒙水平较低。你可能会感到更敏感或需要独处。"
        : "Hormone levels are low. You may feel more sensitive or in need of solitude.",
      tip: isZh
        ? "允许自己慢下来。这是通过日记进行情感释放的最佳时机。"
        : "Allow yourself to slow down. This is a prime time for emotional release through journaling.",
      icon: CloudRain,
    },
    follicular: {
      phase: "follicular",
      title: isZh ? "乐观与开放" : "Optimism & Openness",
      description: isZh
        ? "雌激素上升带来情绪提升。你会感到更有韧性和社交欲望。"
        : "Rising estrogen boosts your mood. You'll feel more resilient and social.",
      tip: isZh
        ? "利用这种能量去尝试新事物或解决之前感觉困难的问题。"
        : "Use this energy to try new things or tackle problems that felt heavy before.",
      icon: Sun,
    },
    ovulation: {
      phase: "ovulation",
      title: isZh ? "自信与表达" : "Confidence & Expression",
      description: isZh
        ? "你的沟通能力和自信心达到顶峰。这是你最闪耀的时刻。"
        : "Your communication skills and confidence peak. This is your time to shine.",
      tip: isZh
        ? "安排重要的对话或演讲。你的情感表达清晰且有说服力。"
        : "Schedule important conversations or presentations. Your emotional expression is clear and persuasive.",
      icon: Zap,
    },
    luteal: {
      phase: "luteal",
      title: isZh ? "敏感与界限" : "Sensitivity & Boundaries",
      description: isZh
        ? "随着黄体酮上升，你可能会感到更加内向或容易受到刺激。"
        : "As progesterone rises, you may feel more inward-turning or easily irritated.",
      tip: isZh
        ? "设定明确的界限。优先考虑自我关怀，避免过多的社交承诺。"
        : "Set clear boundaries. Prioritize self-care and avoid over-committing socially.",
      icon: Wind,
    },
  };
};
