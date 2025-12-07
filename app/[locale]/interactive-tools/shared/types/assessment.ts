export type SelectedAnswerValue = string | number | string[] | boolean;

export type SelectedAnswersState = Record<string, SelectedAnswerValue>;

export interface SessionMeta {
  sessionId: string;
  startTime: string;
  endTime: string;
  completionTime: number;
  upgraded: boolean;
}

export interface AssessmentAnalyticsRecord {
  sessionId: string;
  type: "symptom";
  startTime: string;
  endTime: string;
  duration: number;
  completionTime: number;
  answers: SelectedAnswersState;
  score: number;
  profile: string;
  completed: boolean;
  upgraded: boolean;
  locale: string;
  timestamp: number;
}

export interface Prediction {
  nextPeriod: string;
  ovulation: string;
  fertilityWindow: {
    start: string;
    end: string;
  };
}
