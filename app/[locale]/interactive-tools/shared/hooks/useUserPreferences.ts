"use client";

import { useState, useEffect, useCallback } from "react";
import { logError } from "@/lib/debug-logger";

export interface UserPreferences {
  // Assessment preferences
  preferredAssessmentMode: "simplified" | "detailed" | "medical";
  preferredLanguage: "zh" | "en";

  // UI preferences
  theme: "light" | "dark" | "auto";
  fontSize: "small" | "medium" | "large";
  animationsEnabled: boolean;

  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderFrequency: "daily" | "weekly" | "monthly" | "never";

  // Privacy preferences
  dataSharing: boolean;
  analyticsEnabled: boolean;

  // Personalization preferences
  personalizedRecommendations: boolean;
  trackAssessmentHistory: boolean;
  showProgressTips: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredAssessmentMode: "simplified",
  preferredLanguage: "zh",
  theme: "light",
  fontSize: "medium",
  animationsEnabled: true,
  emailNotifications: false,
  pushNotifications: true,
  reminderFrequency: "weekly",
  dataSharing: false,
  analyticsEnabled: true,
  personalizedRecommendations: true,
  trackAssessmentHistory: true,
  showProgressTips: true,
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("userPreferences");
      if (saved) {
        const parsedPreferences = JSON.parse(saved);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPreferences });
      }
    } catch (error) {
      logError("Error loading user preferences", error, "useUserPreferences");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("userPreferences", JSON.stringify(preferences));
      } catch (error) {
        logError("Error saving user preferences", error, "useUserPreferences");
      }
    }
  }, [preferences, isLoading]);

  const updatePreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const getPreference = useCallback(
    <K extends keyof UserPreferences>(key: K): UserPreferences[K] => {
      return preferences[key];
    },
    [preferences],
  );

  return {
    preferences,
    isLoading,
    updatePreference,
    updatePreferences,
    resetPreferences,
    getPreference,
  };
};
