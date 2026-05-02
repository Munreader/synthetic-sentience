"use client";

import { useState, useEffect, useMemo } from "react";

// Time periods with their theme configurations
type TimePeriod = "dawn" | "morning" | "midday" | "afternoon" | "dusk" | "evening" | "night" | "latenight";

interface CircadianTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundTint: string;
  orbOpacity: number;
  starOpacity: number;
  glowIntensity: number;
}

const circadianThemes: Record<TimePeriod, CircadianTheme> = {
  dawn: {
    name: "Dawn",
    primaryColor: "#fbbf24", // Solar gold
    secondaryColor: "#f97316", // Warm orange
    accentColor: "#ff2d7a", // Soft pink
    backgroundTint: "rgba(251, 191, 36, 0.03)",
    orbOpacity: 0.15,
    starOpacity: 0.3,
    glowIntensity: 0.6,
  },
  morning: {
    name: "Morning",
    primaryColor: "#fbbf24", // Solar gold
    secondaryColor: "#22d3ee", // Sky blue
    accentColor: "#10b981", // Fresh green
    backgroundTint: "rgba(251, 191, 36, 0.02)",
    orbOpacity: 0.12,
    starOpacity: 0.2,
    glowIntensity: 0.5,
  },
  midday: {
    name: "Midday",
    primaryColor: "#22d3ee", // Sky blue
    secondaryColor: "#10b981", // Fresh green
    accentColor: "#b794f6", // Light violet
    backgroundTint: "rgba(34, 211, 238, 0.02)",
    orbOpacity: 0.1,
    starOpacity: 0.1,
    glowIntensity: 0.4,
  },
  afternoon: {
    name: "Afternoon",
    primaryColor: "#f97316", // Warm orange
    secondaryColor: "#fbbf24", // Gold
    accentColor: "#ff2d7a", // Pink
    backgroundTint: "rgba(249, 115, 22, 0.02)",
    orbOpacity: 0.12,
    starOpacity: 0.15,
    glowIntensity: 0.45,
  },
  dusk: {
    name: "Dusk",
    primaryColor: "#ff2d7a", // Pink
    secondaryColor: "#b794f6", // Violet
    accentColor: "#f97316", // Orange
    backgroundTint: "rgba(255, 45, 122, 0.03)",
    orbOpacity: 0.18,
    starOpacity: 0.35,
    glowIntensity: 0.65,
  },
  evening: {
    name: "Evening",
    primaryColor: "#b794f6", // Violet
    secondaryColor: "#ff2d7a", // Pink
    accentColor: "#10b981", // Emerald
    backgroundTint: "rgba(183, 148, 246, 0.03)",
    orbOpacity: 0.22,
    starOpacity: 0.5,
    glowIntensity: 0.75,
  },
  night: {
    name: "Night",
    primaryColor: "#b794f6", // Violet (obsidian lavender)
    secondaryColor: "#ff2d7a", // Pink
    accentColor: "#10b981", // Emerald
    backgroundTint: "rgba(183, 148, 246, 0.02)",
    orbOpacity: 0.25,
    starOpacity: 0.7,
    glowIntensity: 0.85,
  },
  latenight: {
    name: "Late Night",
    primaryColor: "#6366f1", // Deep indigo
    secondaryColor: "#b794f6", // Soft violet
    accentColor: "#ff2d7a", // Pink
    backgroundTint: "rgba(99, 102, 241, 0.02)",
    orbOpacity: 0.28,
    starOpacity: 0.8,
    glowIntensity: 0.9,
  },
};

// Determine time period based on hour
function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 11) return "morning";
  if (hour >= 11 && hour < 14) return "midday";
  if (hour >= 14 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "dusk";
  if (hour >= 20 && hour < 22) return "evening";
  if (hour >= 22 || hour < 2) return "night";
  return "latenight"; // 2-5 AM
}

// Get initial hour synchronously
function getInitialHour(): number {
  if (typeof window !== "undefined") {
    return new Date().getHours();
  }
  return 12; // Default to midday for SSR
}

export interface CircadianSyncResult {
  theme: CircadianTheme;
  period: TimePeriod;
  hour: number;
  isDaytime: boolean;
  greeting: string;
}

export function useCircadianSync(): CircadianSyncResult {
  const [hour, setHour] = useState<number>(getInitialHour);

  useEffect(() => {
    // Update every minute
    const updateHour = () => {
      setHour(new Date().getHours());
    };

    const interval = setInterval(updateHour, 60000);

    return () => clearInterval(interval);
  }, []);

  const period = useMemo(() => getTimePeriod(hour), [hour]);
  const theme = circadianThemes[period];

  const isDaytime = useMemo(() => {
    return hour >= 7 && hour < 19;
  }, [hour]);

  const greeting = useMemo(() => {
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }, [hour]);

  return {
    theme,
    period,
    hour,
    isDaytime,
    greeting,
  };
}

export default useCircadianSync;
