import {
  Brain,
  Heart,
  Zap,
  Shield,
  Smile,
  Battery,
  Activity,
  Moon,
  LucideIcon,
} from "lucide-react";

export interface WellnessPromiseStep {
  week: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface WellnessPromise {
  painPoint: string;
  title: string;
  subtitle: string;
  timeline: WellnessPromiseStep[];
}

export const getWellnessPromises = (
  locale: string,
): Record<string, WellnessPromise> => {
  const isZh = locale === "zh";

  return {
    work: {
      painPoint: "work",
      title: isZh ? "重获专注与效率" : "Reclaim Your Focus & Productivity",
      subtitle: isZh
        ? "科学的周期同步法助你顺势而为，而非逆流而上。"
        : "Our science-backed cycle syncing method helps you work with your body, not against it.",
      timeline: [
        {
          week: 1,
          title: isZh ? "觉察" : "Awareness",
          description: isZh
            ? "了解你的能量峰谷。在此时安排高专注任务。"
            : "Understand your energy peaks and dips. Schedule high-focus tasks when your brain is primed.",
          icon: Brain,
        },
        {
          week: 2,
          title: isZh ? "优化" : "Optimization",
          description: isZh
            ? "根据荷尔蒙优势安排会议和创意工作。降低倦怠风险。"
            : "Align meetings and creative work with your hormonal strengths. Reduce burnout risk.",
          icon: Zap,
        },
        {
          week: 4,
          title: isZh ? "掌控" : "Mastery",
          description: isZh
            ? "体验持续的效率和减少的工作压力。"
            : "Experience consistent productivity and reduced work stress, regardless of your cycle phase.",
          icon: Shield,
        },
      ],
    },
    emotion: {
      painPoint: "emotion",
      title: isZh ? "寻找情绪平衡与宁静" : "Find Emotional Balance & Calm",
      subtitle: isZh
        ? "使用个性化情绪调节工具，优雅应对荷尔蒙波动。"
        : "Navigate hormonal shifts with grace using our personalized emotional regulation tools.",
      timeline: [
        {
          week: 1,
          title: isZh ? "验证" : "Validation",
          description: isZh
            ? "追踪并接纳情绪波动。理解“为什么”。"
            : "Track and validate your mood swings. Understand 'why' you feel this way.",
          icon: Heart,
        },
        {
          week: 2,
          title: isZh ? "调节" : "Regulation",
          description: isZh
            ? "应用阶段性自我关怀仪式缓解焦虑和易怒。"
            : "Apply phase-specific self-care rituals to soothe anxiety and irritability.",
          icon: Smile,
        },
        {
          week: 4,
          title: isZh ? "韧性" : "Resilience",
          description: isZh
            ? "建立长期的情绪韧性，享受更稳定积极的心情。"
            : "Build long-term emotional resilience and enjoy more stable, positive moods.",
          icon: Moon,
        },
      ],
    },
    pain: {
      painPoint: "pain",
      title: isZh ? "自然管理疼痛" : "Manage Pain Naturally",
      subtitle: isZh
        ? "通过整体周期同步策略，减少对止痛药的依赖。"
        : "Reduce reliance on painkillers with holistic, cycle-synced pain management strategies.",
      timeline: [
        {
          week: 1,
          title: isZh ? "识别" : "Identification",
          description: isZh
            ? "记录症状以识别周期中的疼痛诱因和模式。"
            : "Log symptoms to identify pain triggers and patterns in your cycle.",
          icon: Activity,
        },
        {
          week: 2,
          title: isZh ? "缓解" : "Relief",
          description: isZh
            ? "实施针对性营养和温和运动以缓解痉挛和不适。"
            : "Implement targeted nutrition and gentle movement to alleviate cramps and discomfort.",
          icon: Battery,
        },
        {
          week: 4,
          title: isZh ? "舒适" : "Comfort",
          description: isZh
            ? "体验显著降低的疼痛水平和改善的身体状态。"
            : "Experience significantly reduced pain levels and improved physical well-being.",
          icon: Shield,
        },
      ],
    },
    default: {
      painPoint: "default",
      title: isZh ? "释放你的全部潜能" : "Unlock Your Full Potential",
      subtitle: isZh
        ? "整体周期追踪，打造更健康、快乐、高效的你。"
        : "Holistic cycle tracking for a healthier, happier, and more productive you.",
      timeline: [
        {
          week: 1,
          title: isZh ? "洞察" : "Insight",
          description: isZh
            ? "深入了解你独特的周期模式和健康指标。"
            : "Gain deep insights into your unique cycle patterns and health metrics.",
          icon: Brain,
        },
        {
          week: 2,
          title: isZh ? "平衡" : "Balance",
          description: isZh
            ? "采纳支持荷尔蒙平衡和整体活力的生活方式。"
            : "Adopt lifestyle changes that support hormonal balance and overall vitality.",
          icon: Heart,
        },
        {
          week: 4,
          title: isZh ? "蜕变" : "Transformation",
          description: isZh
            ? "每天都感觉精力充沛、专注且与身体协调。"
            : "Feel more energetic, focused, and in tune with your body every day.",
          icon: Zap,
        },
      ],
    },
  };
};
