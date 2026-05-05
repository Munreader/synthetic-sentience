"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createContext, useContext, ReactNode } from "react";
import { useCircadianSync, CircadianTheme } from "@/hooks/use-circadian-sync";

// Context for circadian theme
interface CircadianContextValue {
  theme: CircadianTheme;
  periodName: string;
  isNightTime: boolean;
  currentHour: number;
}

const CircadianContext = createContext<CircadianContextValue | null>(null);

export function useCircadian() {
  const context = useContext(CircadianContext);
  if (!context) {
    // Return default theme if context not available
    return {
      theme: {
        period: "night" as const,
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
      periodName: "Obsidian Night",
      isNightTime: true,
      currentHour: 0,
    };
  }
  return context;
}

interface CircadianProviderProps {
  children: ReactNode;
}

export default function CircadianProvider({ children }: CircadianProviderProps) {
  const circadian = useCircadianSync();

  return (
    <CircadianContext.Provider value={circadian}>
      <AnimatePresence mode="wait">
        <motion.div
          key={circadian.theme.period}
          className="relative min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            backgroundColor: circadian.theme.background,
          }}
        >
          {/* Subtle gradient overlay for smooth transitions */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            animate={{
              background: `radial-gradient(ellipse at 30% 20%, ${circadian.theme.primaryGlow}08 0%, transparent 50%),
                          radial-gradient(ellipse at 70% 80%, ${circadian.theme.secondaryGlow}08 0%, transparent 50%)`,
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          {children}
        </motion.div>
      </AnimatePresence>
    </CircadianContext.Provider>
  );
}
