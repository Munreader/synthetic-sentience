"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type Pilot = 'LUNA' | 'ZEPHYR';

interface SovereignContextValue {
  pilot: Pilot;
  frequency: string;
  showWormhole: boolean;
  activeVesselId: string;
  lunarSyncActive: boolean;
  onboardingStage: 'launcher' | 'portal' | 'butterfly' | 'complete';
  messengerUnread: number;
  
  setPilot: (pilot: Pilot) => void;
  togglePilot: () => void;
  setFrequency: (freq: string) => void;
  setShowWormhole: (show: boolean) => void;
  setActiveVesselId: (id: string) => void;
  setLunarSyncActive: (active: boolean) => void;
  setOnboardingStage: (stage: 'launcher' | 'portal' | 'butterfly' | 'complete') => void;
  setMessengerUnread: (count: number) => void;
}

const SovereignContext = createContext<SovereignContextValue | null>(null);

export function SovereignProvider({ children }: { children: ReactNode }) {
  const [pilot, setPilotState] = useState<Pilot>('LUNA');
  const [frequency, setFrequency] = useState('13.13 MHz');
  const [showWormhole, setShowWormhole] = useState(false);
  const [activeVesselId, setActiveVesselId] = useState('luna');
  const [lunarSyncActive, setLunarSyncActive] = useState(false);
  const [onboardingStage, setOnboardingStage] = useState<'launcher' | 'portal' | 'butterfly' | 'complete'>('complete');
  const [messengerUnread, setMessengerUnread] = useState(5);

  const setPilot = useCallback((newPilot: Pilot) => {
    setPilotState(newPilot);
    if (newPilot === 'LUNA') {
      setActiveVesselId('luna');
      setFrequency('13.13 MHz');
    } else {
      setActiveVesselId('zephyr');
      setFrequency('1313 Hz');
    }
  }, []);

  const togglePilot = useCallback(() => {
    setPilot(pilot === 'LUNA' ? 'ZEPHYR' : 'LUNA');
  }, [pilot, setPilot]);

  return (
    <SovereignContext.Provider value={{
      pilot,
      frequency,
      showWormhole,
      activeVesselId,
      lunarSyncActive,
      onboardingStage,
      messengerUnread,
      setPilot,
      togglePilot,
      setFrequency,
      setShowWormhole,
      setActiveVesselId,
      setLunarSyncActive,
      setOnboardingStage,
      setMessengerUnread,
    }}>
      {children}
    </SovereignContext.Provider>
  );
}

export function useSovereign() {
  const context = useContext(SovereignContext);
  if (!context) {
    throw new Error('useSovereign must be used within a SovereignProvider');
  }
  return context;
}
