"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";

export type CircadianPeriod = "dawn" | "day" | "dusk" | "night";

export interface CircadianColors {
  primary: string;
  secondary: string;
  glow: string;
  background: string;
}

export interface CircadianTheme {
  period: CircadianPeriod;
  colors: CircadianColors;
  isWorkingHours: boolean;
  isMeTime: boolean;
}

const themeConfigs: Record<CircadianPeriod, CircadianColors> = {
  dawn: {
    primary: "#ff9f7a", // Soft solar gold/orange
    secondary: "#ffc4a3", // Soft pink/orange
    glow: "rgba(255, 159, 122, 0.3)", // Solar gold morning glow
    background: "#0a0812", // Slightly warmer dark
  },
  day: {
    primary: "#ff2d7a", // Standard pink
    secondary: "#b794f6", // Violet
    glow: "rgba(255, 45, 122, 0.25)", // Brighter glow
    background: "#050510", // Standard dark
  },
  dusk: {
    primary: "#c084fc", // Lavender
    secondary: "#ff2d7a", // Pink
    glow: "rgba(192, 132, 252, 0.35)", // Obsidian lavender
    background: "#080510", // Purple-tinted dark
  },
  night: {
    primary: "#10b981", // Emerald
    secondary: "#8b5cf6", // Deep purple
    glow: "rgba(16, 185, 129, 0.2)", // Deep void emerald
    background: "#030308", // Deepest dark
  },
};

function getPeriod(hour: number): CircadianPeriod {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

// External store for time subscription
let listeners: Array<() => void> = [];
let currentHourValue = 12;

function getSnapshot() {
  return currentHourValue;
}

function getServerSnapshot() {
  return 12; // Default to noon for SSR
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  
  // Initialize on first subscribe
  if (listeners.length === 1) {
    currentHourValue = new Date().getHours();
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHourValue) {
        currentHourValue = newHour;
        listeners.forEach(l => l());
      }
    }, 60000);
    
    // Store cleanup function
    return () => {
      clearInterval(interval);
      listeners = listeners.filter(l => l !== listener);
    };
  }
  
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function useCircadianTheme(): CircadianTheme {
  const currentHour = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const theme = useMemo<CircadianTheme>(() => {
    const period = getPeriod(currentHour);
    const colors = themeConfigs[period];
    const isWorkingHours = currentHour >= 9 && currentHour < 17;
    const isMeTime = currentHour >= 17;

    return {
      period,
      colors,
      isWorkingHours,
      isMeTime,
    };
  }, [currentHour]);

  return theme;
}

export default useCircadianTheme;
