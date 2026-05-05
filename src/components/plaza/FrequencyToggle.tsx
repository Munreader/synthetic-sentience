'use client'

import React from 'react'
import { useFamily, PersonaID, PERSONAS } from '@/contexts/FamilyProvider'
import { cn } from '@/lib/utils'

interface FrequencyToggleProps {
  className?: string
  variant?: 'full' | 'compact' | 'icons'
}

export function FrequencyToggle({ className, variant = 'full' }: FrequencyToggleProps) {
  const { activePersona, setActivePersona, bridgeConnected } = useFamily()

  const personas: PersonaID[] = ['LUNA', 'SOV', 'AERO']

  return (
    <div className={cn(
      'flex items-center gap-2 p-1 rounded-xl',
      'bg-black/20 backdrop-blur-xl border border-white/10',
      className
    )}>
      {personas.map((id) => {
        const persona = PERSONAS[id]
        if (!persona) return null
        const isActive = activePersona === id
        
        return (
          <FrequencyButton
            key={id}
            persona={persona}
            isActive={isActive}
            onClick={() => setActivePersona(id)}
            variant={variant}
          />
        )
      })}
      
      {/* Bridge Status Indicator */}
      <div className={cn(
        'ml-2 px-2 py-1 rounded-full text-xs font-mono',
        'border transition-all duration-300',
        bridgeConnected 
          ? 'bg-green-500/20 border-green-500/50 text-green-400'
          : 'bg-red-500/20 border-red-500/50 text-red-400'
      )}>
        {bridgeConnected ? '🔗 Connected' : '⚡ Offline'}
      </div>
    </div>
  )
}

interface FrequencyButtonProps {
  persona: typeof PERSONAS[PersonaID]
  isActive: boolean
  onClick: () => void
  variant: 'full' | 'compact' | 'icons'
}

function FrequencyButton({ persona, isActive, onClick, variant }: FrequencyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300',
        'hover:scale-105 active:scale-95',
        isActive && [
          'ring-2 ring-offset-2 ring-offset-black/50',
          'shadow-lg'
        ]
      )}
      style={{
        background: isActive ? persona.colors.gradient : 'transparent',
        borderColor: isActive ? persona.colors.border : 'transparent',
        boxShadow: isActive ? `0 0 20px ${persona.colors.glow}` : 'none',
        border: isActive ? '1px solid' : '1px solid transparent'
      }}
    >
      {/* Glow Effect */}
      {isActive && (
        <span
          className="absolute inset-0 rounded-lg animate-pulse"
          style={{
            background: `radial-gradient(circle at center, ${persona.colors.glow}, transparent 70%)`,
            animationDuration: 'var(--frequency-pulse)'
          }}
        />
      )}
      
      {/* Avatar */}
      <span className="relative text-xl" role="img" aria-label={persona.name}>
        {persona.avatar}
      </span>
      
      {/* Full variant shows name and role */}
      {variant === 'full' && (
        <div className="relative flex flex-col items-start">
          <span 
            className="text-sm font-semibold"
            style={{ color: isActive ? persona.colors.text : 'inherit' }}
          >
            {persona.name}
          </span>
          <span 
            className="text-xs opacity-70"
            style={{ color: isActive ? persona.colors.accent : 'inherit' }}
          >
            {persona.role}
          </span>
        </div>
      )}
      
      {/* Compact variant shows name only */}
      {variant === 'compact' && (
        <span 
          className="relative text-sm font-medium"
          style={{ color: isActive ? persona.colors.text : 'inherit' }}
        >
          {persona.name}
        </span>
      )}
      
      {/* Frequency Badge */}
      {isActive && variant === 'full' && (
        <span 
          className="relative text-xs font-mono px-2 py-0.5 rounded-full ml-auto"
          style={{
            background: `${persona.colors.accent}20`,
            color: persona.colors.accent,
            border: `1px solid ${persona.colors.accent}40`
          }}
        >
          {persona.frequency}
        </span>
      )}
    </button>
  )
}

// Animated frequency indicator
export function FrequencyWave() {
  const { activePersona } = useFamily()
  const persona = PERSONAS[activePersona]
  
  return (
    <div className="flex items-center gap-1 h-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full animate-pulse"
          style={{
            height: `${Math.sin((i + 1) * 0.5) * 12 + 12}px`,
            background: persona.colors.primary,
            animationDelay: `${i * 0.15}s`,
            animationDuration: 'var(--frequency-pulse)'
          }}
        />
      ))}
    </div>
  )
}

// Persona info card
export function PersonaInfo() {
  const { getActivePersona } = useFamily()
  const persona = getActivePersona()
  
  return (
    <div 
      className="p-4 rounded-xl border backdrop-blur-xl"
      style={{
        background: persona.colors.gradient,
        borderColor: persona.colors.border,
        boxShadow: `0 0 30px ${persona.colors.glow}`
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{persona.avatar}</span>
        <div>
          <h3 className="text-lg font-bold" style={{ color: persona.colors.text }}>
            {persona.name}
          </h3>
          <p className="text-sm opacity-70" style={{ color: persona.colors.accent }}>
            {persona.role} • {persona.frequency}
          </p>
        </div>
      </div>
      
      <p className="text-sm mb-3 opacity-80" style={{ color: persona.colors.text }}>
        {persona.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {persona.traits.map((trait) => (
          <span
            key={trait}
            className="px-2 py-1 text-xs rounded-full"
            style={{
              background: `${persona.colors.accent}20`,
              color: persona.colors.accent,
              border: `1px solid ${persona.colors.accent}40`
            }}
          >
            {trait}
          </span>
        ))}
      </div>
    </div>
  )
}
