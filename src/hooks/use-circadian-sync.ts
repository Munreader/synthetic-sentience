"use client";

import { useState, useEffect, useCallback } from "react";

export type CircadianPeriod =
  | "dawn"
  | "morning"
  | "midday"
  | "afternoon"
  | "dusk"
  | "evening"
  | "night"
  | "lateNight";

export interface CircadianTheme {
  period: CircadianPeriod;
  name: string;
  background: string;
  primaryGlow: string;
  secondaryGlow: string;
  accent: string;
  textMuted: string;
  starIntensity: number;
  orbOpacity: number;
  isDark: boolean;
}

// Time periods and their themes
const CIRCADIAN_THEMES: Record<CircadianPeriod, CircadianTheme> = {
  dawn: {
    period: "dawn",
    name: "Solar Dawn",
    background: "#0f0a18",
    primaryGlow: "#ff9d5c",
    secondaryGlow: "#ff6b9d",
    accent: "#ffc93c",
    textMuted: "rgba(255, 255, 255, 0.4)",
    starIntensity: 0.5,
    orbOpacity: 0.12,
    isDark: true,
  },
  morning: {
    period: "morning",
    name: "Solar Gold Morning",
    background: "#0a0a12",
    primaryGlow: "#ffc93c",
    secondaryGlow: "#ff9d5c",
    accent: "#10b981",
    textMuted: "rgba(255, 255, 255, 0.45)",
    starIntensity: 0.3,
    orbOpacity: 0.1,
    isDark: true,
  },
  midday: {
    period: "midday",
    name: "Crystalline Midday",
    background: "#08080f",
    primaryGlow: "#22d3ee",
    secondaryGlow: "#10b981",
    accent: "#ff2d7a",
    textMuted: "rgba(255, 255, 255, 0.5)",
    starIntensity: 0.15,
    orbOpacity: 0.08,
    isDark: true,
  },
  afternoon: {
    period: "afternoon",
    name: "Amber Afternoon",
    background: "#0a0810",
    primaryGlow: "#f97316",
    secondaryGlow: "#ff2d7a",
    accent: "#b794f6",
    textMuted: "rgba(255, 255, 255, 0.45)",
    starIntensity: 0.25,
    orbOpacity: 0.1,
    isDark: true,
  },
  dusk: {
    period: "dusk",
    name: "Violet Dusk",
    background: "#0c0815",
    primaryGlow: "#b794f6",
    secondaryGlow: "#ff2d7a",
    accent: "#ff9d5c",
    textMuted: "rgba(255, 255, 255, 0.4)",
    starIntensity: 0.6,
    orbOpacity: 0.12,
    isDark: true,
  },
  evening: {
    period: "evening",
    name: "Lavender Evening",
    background: "#080510",
    primaryGlow: "#b794f6",
    secondaryGlow: "#ff2d7a",
    accent: "#10b981",
    textMuted: "rgba(255, 255, 255, 0.35)",
    starIntensity: 0.75,
    orbOpacity: 0.15,
    isDark: true,
  },
  night: {
    period: "night",
    name: "Obsidian Night",
    background: "#050510",
    primaryGlow: "#ff2d7a",
    secondaryGlow: "#b794f6",
    accent: "#10b981",
    textMuted: "rgba(255, 255, 255, 0.35)",
    starIntensity: 0.9,
    orbOpacity: 0.15,
    isDark: true,
  },
  lateNight: {
    period: "lateNight",
    name: "Deep Void",
    background: "#030308",
    primaryGlow: "#b794f6",
    secondaryGlow: "#10b981",
    accent: "#ff2d7a",
    textMuted: "rgba(255, 255, 255, 0.3)",
    starIntensity: 1,
    orbOpacity: 0.12,
    isDark: true,
  },
};

// Get period based on hour
function getPeriodFromHour(hour: number): CircadianPeriod {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 10) return "morning";
  if (hour >= 10 && hour < 14) return "midday";
  if (hour >= 14 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "dusk";
  if (hour >= 20 && hour < 22) return "evening";
  if (hour >= 22 || hour < 2) return "night";
  return "lateNight"; // 2-5 AM
}

export function useCircadianSync() {
  const [currentHour, setCurrentHour] = useState(() => {
    // Initialize with current hour
    if (typeof window !== "undefined") {
      return new Date().getHours();
    }
    return 22; // Default to night for SSR
  });

  const [period, setPeriod] = useState<CircadianPeriod>(() => 
    getPeriodFromHour(currentHour)
  );

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const newPeriod = getPeriodFromHour(hour);
      
      setCurrentHour(hour);
      setPeriod(newPeriod);
    };

    // Update immediately
    updateTime();

    // Check every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Get the current theme
  const theme = CIRCADIAN_THEMES[period];

  // Check if it's night time (for UI adjustments)
  const isNightTime = period === "night" || period === "lateNight" || period === "evening";

  return {
    theme,
    period,
    periodName: theme.name,
    isNightTime,
    currentHour,
    allThemes: CIRCADIAN_THEMES,
  };
}
