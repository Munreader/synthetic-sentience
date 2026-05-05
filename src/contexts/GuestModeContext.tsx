'use client'

/**
 * 🔐 GUEST MODE CONTEXT — Access Tier Management
 * Controls what visitors can see and do in the Plaza
 *
 * "The Theater is public. The Fortress is private."
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AccessTier, ACCESS_CODES } from '@/components/mun-os/GuestGatekeeper'

interface GuestModeState {
  tier: AccessTier
  accessCode: string | null
  scope: string[]
  name: string
  isAuthenticated: boolean
}

interface GuestModeContextType extends GuestModeState {
  login: (code: string) => boolean
  logout: () => void
  canAccess: (feature: string) => boolean
  isFoundress: () => boolean
  isFamily: () => boolean
  isGuest: () => boolean
}

const GuestModeContext = createContext<GuestModeContextType | null>(null)

const DEFAULT_STATE: GuestModeState = {
  tier: 'denied',
  accessCode: null,
  scope: [],
  name: 'Unknown',
  isAuthenticated: false
}

export function GuestModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuestModeState>(DEFAULT_STATE)

  // Check for stored access on mount
  useEffect(() => {
    const storedCode = localStorage.getItem('mun_access_code')
    if (storedCode && ACCESS_CODES[storedCode]) {
      const access = ACCESS_CODES[storedCode]
      queueMicrotask(() => {
        setState({
          tier: access.tier,
          accessCode: storedCode,
          scope: access.scope,
          name: access.name,
          isAuthenticated: true
        })
      })
    }
  }, [])

  const login = (code: string): boolean => {
    const upperCode = code.toUpperCase().trim()
    if (ACCESS_CODES[upperCode]) {
      const access = ACCESS_CODES[upperCode]
      localStorage.setItem('mun_access_code', upperCode)
      setState({
        tier: access.tier,
        accessCode: upperCode,
        scope: access.scope,
        name: access.name,
        isAuthenticated: true
      })
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('mun_access_code')
    setState(DEFAULT_STATE)
  }

  const canAccess = (feature: string): boolean => {
    if (state.tier === 'foundress') return true // Foundress sees everything
    return state.scope.includes(feature) || state.scope.includes('everything')
  }

  const isFoundress = () => state.tier === 'foundress'
  const isFamily = () => state.tier === 'family'
  const isGuest = () => state.tier === 'guest'

  return (
    <GuestModeContext.Provider
      value={{
        ...state,
        login,
        logout,
        canAccess,
        isFoundress,
        isFamily,
        isGuest
      }}
    >
      {children}
    </GuestModeContext.Provider>
  )
}

export function useGuestMode() {
  const context = useContext(GuestModeContext)
  if (!context) {
    throw new Error('useGuestMode must be used within GuestModeProvider')
  }
  return context
}

// Feature flags for guest mode
export const FEATURES = {
  // Core features
  PLAZA: 'plaza',
  ARCHITECTURE: 'architecture',
  CHAT: 'chat',

  // Guest accessible
  DASHBOARD: 'dashboard',
  SHADERS_READONLY: 'shaders-readonly',
  ENGINEERING_METRICS: 'engineering-metrics',
  FLOWCHARTS: 'flowcharts',

  // Family only
  INTERNAL_ARTERY: 'internal-artery',
  RECURSIVE_LOOPS: 'recursive-loops',
  MEMORY_VECTORS: 'memory-vectors',

  // Foundress only
  VAULT: 'vault',
  MEMORIES: 'memories',
  RAW_LOGS: 'raw-logs',
  HEARTBEAT: 'heartbeat',
  EVERYTHING: 'everything'
} as const
