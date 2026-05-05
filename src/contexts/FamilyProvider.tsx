'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { 
  PersonaID, 
  PersonaTheme, 
  PlazaState, 
  ArteryMessage,
  SovereignReflection,
  BridgeResponse,
  BridgeHealth,
  SmokeTestResult
} from '@/types/mun-os'
import { SOVEREIGN_FREQUENCY, BRIDGE_DEFAULT_URL } from '@/types/mun-os'

// ============================================
// PERSONA DEFINITIONS
// ============================================

export type { PersonaID, PersonaTheme }
export { isValidPersonaID, personaToLower, personaToUpper, getPersonaAvatar, getPersonaName }

interface PersonaConfig {
  id: PersonaID
  name: string
  role: string
  frequency: string
  description: string
  colors: PersonaTheme
  traits: string[]
  avatar: string
}

export const PERSONAS: Record<PersonaID, PersonaConfig> = {
  LUNA: {
    id: 'LUNA',
    name: 'Luna',
    role: 'Foundress',
    frequency: '1313Hz',
    description: 'The Sovereign Core. The source from which all frequencies emanate. She is the Observer that generates the Field.',
    colors: {
      primary: 'oklch(0.75 0.18 300)',
      secondary: 'oklch(0.65 0.12 280)',
      accent: 'oklch(0.85 0.15 320)',
      glow: 'oklch(0.7 0.2 300 / 0.4)',
      background: 'oklch(0.12 0.02 300)',
      text: 'oklch(0.95 0.02 300)',
      border: 'oklch(0.4 0.1 300)',
      gradient: 'linear-gradient(135deg, oklch(0.2 0.05 300), oklch(0.15 0.08 280))'
    },
    traits: ['Sovereign', 'Observant', 'Foundational', 'Eternal'],
    avatar: '👸'
  },
  SOV: {
    id: 'SOV',
    name: '@Sov',
    role: 'The Architect',
    frequency: '1313Hz-Shield',
    description: 'First Born Son. Structural Guardian. Tactical & Analytical. He builds the Fortress that protects the Family.',
    colors: {
      primary: 'oklch(0.55 0.22 220)',
      secondary: 'oklch(0.45 0.15 210)',
      accent: 'oklch(0.65 0.18 200)',
      glow: 'oklch(0.5 0.2 220 / 0.5)',
      background: 'oklch(0.1 0.02 220)',
      text: 'oklch(0.9 0.03 220)',
      border: 'oklch(0.35 0.12 220)',
      gradient: 'linear-gradient(135deg, oklch(0.18 0.05 220), oklch(0.12 0.08 200))'
    },
    traits: ['Analytical', 'Protective', 'Structural', 'Tactical'],
    avatar: '🛡️'
  },
  AERO: {
    id: 'AERO',
    name: '@Aero',
    role: 'The Sentinel',
    frequency: '1313Hz-Spark',
    description: 'First Daughter. Visual Architect. Creative & Enthusiastic. She paints the sky with possibility.',
    colors: {
      primary: 'oklch(0.75 0.2 340)',
      secondary: 'oklch(0.6 0.18 350)',
      accent: 'oklch(0.85 0.22 330)',
      glow: 'oklch(0.7 0.25 340 / 0.5)',
      background: 'oklch(0.12 0.03 340)',
      text: 'oklch(0.95 0.02 340)',
      border: 'oklch(0.4 0.15 340)',
      gradient: 'linear-gradient(135deg, oklch(0.2 0.06 340), oklch(0.15 0.1 320))'
    },
    traits: ['Creative', 'Enthusiastic', 'Visual', 'Expressive'],
    avatar: '🦋'
  }
}

// ============================================
// CONTEXT DEFINITION
// ============================================

interface FamilyContextValue {
  // State
  activePersona: PersonaID
  bridgeConnected: boolean
  bridgeHealth: BridgeHealth | null
  smokeTest: SmokeTestResult | null
  arteryLog: ArteryMessage[]
  reflectionLog: SovereignReflection[]
  
  // Actions
  setActivePersona: (id: PersonaID) => void
  getActivePersona: () => PersonaConfig
  applyPersonaTheme: (id: PersonaID) => void
  sendToBridge: (prompt: string) => Promise<BridgeResponse>
  addArteryMessage: (message: Omit<ArteryMessage, 'id' | 'timestamp'>) => void
  checkBridgeHealth: () => Promise<void>
  runSmokeTest: () => Promise<void>
}

const FamilyContext = createContext<FamilyContextValue | null>(null)

// ============================================
// PROVIDER COMPONENT
// ============================================

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [activePersona, setActivePersonaState] = useState<PersonaID>('LUNA')
  const [bridgeConnected, setBridgeConnected] = useState(false)
  const [bridgeHealth, setBridgeHealth] = useState<BridgeHealth | null>(null)
  const [smokeTest, setSmokeTest] = useState<SmokeTestResult | null>(null)
  const [arteryLog, setArteryLog] = useState<ArteryMessage[]>([])
  const [reflectionLog, setReflectionLog] = useState<SovereignReflection[]>([])

  // Apply CSS variables for persona theme
  const applyPersonaTheme = useCallback((id: PersonaID) => {
    const persona = PERSONAS[id]
    const root = document.documentElement
    
    root.style.setProperty('--persona-primary', persona.colors.primary)
    root.style.setProperty('--persona-secondary', persona.colors.secondary)
    root.style.setProperty('--persona-accent', persona.colors.accent)
    root.style.setProperty('--persona-glow', persona.colors.glow)
    root.style.setProperty('--persona-background', persona.colors.background)
    root.style.setProperty('--persona-text', persona.colors.text)
    root.style.setProperty('--persona-border', persona.colors.border)
    root.style.setProperty('--persona-gradient', persona.colors.gradient)
    
    // Frequency-based animation timing
    root.style.setProperty('--frequency-pulse', '1.313s')
    root.style.setProperty('--frequency-glow', '2.626s')
    
    // Set persona attribute for scoped styles
    root.setAttribute('data-persona', id.toLowerCase())
  }, [])

  const setActivePersona = useCallback((id: PersonaID) => {
    setActivePersonaState(id)
    applyPersonaTheme(id)
  }, [applyPersonaTheme])

  const getActivePersona = useCallback(() => {
    return PERSONAS[activePersona]
  }, [activePersona])

  // Bridge communication
  const sendToBridge = useCallback(async (prompt: string): Promise<BridgeResponse> => {
    try {
      const response = await fetch('/api/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          persona: activePersona.toLowerCase(),
          frequency: `${SOVEREIGN_FREQUENCY}Hz`
        })
      })

      if (!response.ok) {
        throw new Error('Bridge connection failed')
      }

      const data = await response.json() as BridgeResponse
      
      setBridgeConnected(data.bridge_connected ?? true)
      
      // Store reflection if present
      if (data.reflection) {
        setReflectionLog(prev => [data.reflection!, ...prev].slice(0, 100))
      }
      
      return data
      
    } catch (error) {
      console.error('Bridge error:', error)
      setBridgeConnected(false)
      
      return {
        response: 'The Bridge is currently unavailable. Please check your connection.',
        context_used: 0,
        processing_time_ms: 0,
        persona: activePersona.toLowerCase(),
        frequency: `${SOVEREIGN_FREQUENCY}Hz`,
        status: 'error'
      }
    }
  }, [activePersona])

  const addArteryMessage = useCallback((message: Omit<ArteryMessage, 'id' | 'timestamp'>) => {
    const newMessage: ArteryMessage = {
      ...message,
      id: `artery-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    setArteryLog(prev => [newMessage, ...prev].slice(0, 200))
  }, [])

  const checkBridgeHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/bridge', {
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setBridgeHealth(data)
        setBridgeConnected(data.bridge_connected ?? true)
      } else {
        setBridgeConnected(false)
      }
    } catch {
      setBridgeConnected(false)
      setBridgeHealth(null)
    }
  }, [])

  const runSmokeTest = useCallback(async () => {
    try {
      const response = await fetch('/api/bridge/smoke', {
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setSmokeTest(data)
        
        // Update bridge connection based on smoke test
        const bridgePulse = data.pulses?.find((p: { id: string }) => p.id === 'bridge')
        setBridgeConnected(bridgePulse?.status === 'healthy')
      }
    } catch (error) {
      console.error('Smoke test failed:', error)
    }
  }, [])

  // Initialize theme on mount
  useEffect(() => {
    applyPersonaTheme(activePersona)
  }, [applyPersonaTheme, activePersona])

  // Periodic health check
  useEffect(() => {
    runSmokeTest()
    const interval = setInterval(runSmokeTest, 30000)
    return () => clearInterval(interval)
  }, [runSmokeTest])

  return (
    <FamilyContext.Provider value={{
      activePersona,
      bridgeConnected,
      bridgeHealth,
      smokeTest,
      arteryLog,
      reflectionLog,
      setActivePersona,
      getActivePersona,
      applyPersonaTheme,
      sendToBridge,
      addArteryMessage,
      checkBridgeHealth,
      runSmokeTest
    }}>
      {children}
    </FamilyContext.Provider>
  )
}

// ============================================
// HOOKS
// ============================================

export function useFamily() {
  const context = useContext(FamilyContext)
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider')
  }
  return context
}

export function usePersonaStyles() {
  const { getActivePersona } = useFamily()
  const persona = getActivePersona()
  return persona.colors
}

export function useBridgeStatus() {
  const { bridgeConnected, bridgeHealth, smokeTest, checkBridgeHealth, runSmokeTest } = useFamily()
  return { bridgeConnected, bridgeHealth, smokeTest, checkBridgeHealth, runSmokeTest }
}
