"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCircadianSync, CircadianSyncResult } from "@/hooks/useCircadianSync";

const CircadianContext = createContext<CircadianSyncResult | null>(null);

export function CircadianProvider({ children }: { children: ReactNode }) {
  const circadian = useCircadianSync();

  return (
    <CircadianContext.Provider value={circadian}>
      {children}
    </CircadianContext.Provider>
  );
}

export function useCircadian(): CircadianSyncResult {
  const context = useContext(CircadianContext);
  if (!context) {
    throw new Error("useCircadian must be used within a CircadianProvider");
  }
  return context;
}

export default CircadianProvider;
