import { MenstrualPhase } from "../types";

export interface CyclePhaseContent {
  title: string;
  description: string;
  energyLevel: number; // 1-10
  recommendations: {
    work: {
      focus: string;
      tips: string[];
    };
    nutrition: {
      focus: string;
      foods: string[];
    };
    exercise: {
      focus: string;
      activities: string[];
    };
    selfCare: {
      focus: string;
      ritual: string;
    };
  };
}

export const CYCLE_SYNC_CONTENT: Record<MenstrualPhase, CyclePhaseContent> = {
  menstrual: {
    title: "Menstrual Phase",
    description:
      "A time for rest, reflection, and turning inward. Your energy is at its lowest.",
    energyLevel: 3,
    recommendations: {
      work: {
        focus: "Review & Reflect",
        tips: [
          "Focus on administrative tasks and organization",
          "Review monthly goals and progress",
          "Avoid scheduling back-to-back meetings",
          "Work from home if possible",
        ],
      },
      nutrition: {
        focus: "Replenish & Warm",
        foods: [
          "Iron-rich foods (spinach, lentils, red meat)",
          "Warm soups and stews",
          "Herbal teas (chamomile, ginger)",
          "Dark chocolate (magnesium)",
        ],
      },
      exercise: {
        focus: "Rest & Restore",
        activities: [
          "Gentle stretching or Yin Yoga",
          "Light walking",
          "Rest days",
          "Meditation",
        ],
      },
      selfCare: {
        focus: "Comfort",
        ritual:
          "Take a warm bath with epsom salts and prioritize early bedtime.",
      },
    },
  },
  follicular: {
    title: "Follicular Phase",
    description:
      "Energy is rising. A time for new beginnings, creativity, and planning.",
    energyLevel: 7,
    recommendations: {
      work: {
        focus: "Create & Plan",
        tips: [
          "Brainstorm new ideas and projects",
          "Start complex tasks",
          "Learn new skills or tools",
          "Strategic planning sessions",
        ],
      },
      nutrition: {
        focus: "Fresh & Light",
        foods: [
          "Fermented foods (kimchi, sauerkraut)",
          "Fresh salads and vegetables",
          "Lean proteins (chicken, tofu)",
          "Avocado and seeds",
        ],
      },
      exercise: {
        focus: "Cardio & Variety",
        activities: [
          "Running or jogging",
          "Dance classes",
          "Hiking",
          "Trying a new sport",
        ],
      },
      selfCare: {
        focus: "Explore",
        ritual: "Try a new hobby or visit a new place. Your curiosity is high.",
      },
    },
  },
  ovulation: {
    title: "Ovulation Phase",
    description:
      "Peak energy and confidence. A time for communication, collaboration, and visibility.",
    energyLevel: 10,
    recommendations: {
      work: {
        focus: "Connect & Communicate",
        tips: [
          "Schedule important presentations or pitches",
          "Network and socialize",
          "Collaborate with team members",
          "Ask for a raise or promotion",
        ],
      },
      nutrition: {
        focus: "Fiber & Antioxidants",
        foods: [
          "Cruciferous vegetables (broccoli, kale)",
          "Berries and antioxidant-rich fruits",
          "Quinoa and whole grains",
          "Plenty of water",
        ],
      },
      exercise: {
        focus: "High Intensity",
        activities: [
          "HIIT workouts",
          "Spin classes",
          "Heavy weightlifting",
          "Group sports",
        ],
      },
      selfCare: {
        focus: "Socialize",
        ritual:
          "Connect with friends or attend a social event. You are magnetic.",
      },
    },
  },
  luteal: {
    title: "Luteal Phase",
    description:
      "Energy begins to wind down. A time for finishing tasks, detail work, and nesting.",
    energyLevel: 6,
    recommendations: {
      work: {
        focus: "Focus & Finish",
        tips: [
          "Wrap up ongoing projects",
          "Deep work sessions",
          "Detail-oriented tasks (editing, coding)",
          "Organize your workspace",
        ],
      },
      nutrition: {
        focus: "Stabilize & Ground",
        foods: [
          "Complex carbohydrates (sweet potatoes, brown rice)",
          "Root vegetables",
          "Magnesium-rich foods (nuts, seeds)",
          "Vitamin B6 rich foods (bananas, salmon)",
        ],
      },
      exercise: {
        focus: "Strength & Endurance",
        activities: [
          "Pilates or Barre",
          "Moderate strength training",
          "Steady-state cardio",
          "Vinyasa Yoga",
        ],
      },
      selfCare: {
        focus: "Nest",
        ritual:
          "Declutter your home or workspace. Prepare for the upcoming cycle.",
      },
    },
  },
};
