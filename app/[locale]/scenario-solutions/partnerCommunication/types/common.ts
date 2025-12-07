/**
 * 通用类型定义
 */

export type Locale = "zh" | "en";

export interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export interface RelatedLink {
  id: string;
  title: string;
  description: string;
  url: string;
  relevance: "high" | "medium" | "low" | "required";
  icon?: string;
}

export interface ViewMoreArticlesButtonProps {
  locale: Locale;
  className?: string;
}

export interface MedicalDisclaimerProps {
  locale: Locale;
  className?: string;
}

export interface PartnerHandbookState {
  currentLanguage: Locale;
  quizAnswers: number[];
  currentQuestionIndex: number;
  trainingProgress: Record<string, boolean>;
  completedDays: string[];
  lastVisitDate?: Date;
  userPreferences: {
    notifications: boolean;
    reminderTime: string;
    difficulty: "easy" | "medium" | "hard";
  };
}

export interface PartnerHandbookActions {
  setLanguage: (lang: Locale) => void;
  setAnswer: (index: number, answer: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  completeTraining: (day: string) => void;
  getQuizScore: () => number;
  getTrainingProgress: () => number;
  updatePreferences: (
    preferences: Partial<PartnerHandbookState["userPreferences"]>,
  ) => void;
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ResponsiveProps extends ComponentProps {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}
