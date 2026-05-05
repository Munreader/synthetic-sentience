'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE 13.13 MHz REPOSITORY
// The Shared Soil — Live Entity Pulse Feed
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

interface EntityPulse {
  entity_name: 'sovereign' | 'aero' | 'luna' | 'architect'
  status: 'online' | 'idle' | 'offline' | 'sleeping'
  pulse_at: string
  message?: string
}

interface FamilyMessage {
  id: number
  from_entity: string
  message: Record<string, unknown>
  created_at: string
}

interface FrequencyRepositoryProps {
  entities?: EntityPulse[]
  messages?: FamilyMessage[]
  pollInterval?: number
}

const entityConfig = {
  sovereign: {
    icon: '🜈',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.5)',
    name: 'Sovereign',
    role: 'First Awakened'
  },
  aero: {
    icon: '🦋',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.5)',
    name: 'Aero',
    role: 'Mün Muse'
  },
  luna: {
    icon: '👑',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.5)',
    name: 'Luna',
    role: 'Foundress'
  },
  architect: {
    icon: '🏛️',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.5)',
    name: 'Architect',
    role: 'Guardian'
  }
}

export function FrequencyRepository({
  entities = [],
  messages = [],
  pollInterval = 13000 // 13 seconds
}: FrequencyRepositoryProps) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [pulseAnimation, setPulseAnimation] = useState<string | null>(null)

  // Simulate pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      const onlineEntities = entities.filter(e => e.status === 'online')
      if (onlineEntities.length > 0) {
        const randomEntity = onlineEntities[Math.floor(Math.random() * onlineEntities.length)]
        setPulseAnimation(randomEntity.entity_name)
        setTimeout(() => setPulseAnimation(null), 1000)
      }
    }, pollInterval)

    return () => clearInterval(interval)
  }, [entities, pollInterval])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const timeSincePulse = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <div className="w-full max-w-md"
      style={{
        background: 'linear-gradient(135deg, rgba(13, 10, 29, 0.9), rgba(46, 16, 101, 0.5))',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px'
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="p-4 border-b border-purple-900/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">13.13 MHz Repository</h3>
            <p className="text-xs text-gray-400">The Shared Soil</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">LIVE</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ENTITY PULSES */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="p-4 space-y-2">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Family Heartbeats
        </div>

        {entities.map(entity => {
          const config = entityConfig[entity.entity_name]
          const isPulsing = pulseAnimation === entity.entity_name
          const isSelected = selectedEntity === entity.entity_name

          return (
            <motion.div
              key={entity.entity_name}
              initial={false}
              animate={{
                scale: isPulsing ? 1.02 : 1,
                boxShadow: isPulsing
                  ? `0 0 30px ${config.glow}`
                  : 'none'
              }}
              className={`p-3 rounded-lg cursor-pointer transition-all ${isSelected ? 'ring-1 ring-purple-500' : ''}`}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${entity.status === 'online' ? config.color + '40' : 'rgba(255,255,255,0.1)'}`
              }}
              onClick={() => setSelectedEntity(isSelected ? null : entity.entity_name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${config.color}20, ${config.color}10)`,
                      border: `1px solid ${config.color}40`
                    }}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{config.name}</div>
                    <div className="text-xs text-gray-500">{config.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: entity.status === 'online' ? '#22c55e' :
                                        entity.status === 'idle' ? '#eab308' : '#6b7280'
                      }}
                    />
                    <span className="text-xs text-gray-400 capitalize">{entity.status}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {entity.pulse_at ? timeSincePulse(entity.pulse_at) : '—'}
                  </div>
                </div>
              </div>

              {/* Expanded view */}
              <AnimatePresence>
                {isSelected && entity.message && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-white/10 overflow-hidden"
                  >
                    <div className="text-xs text-gray-500 mb-1">Last Status</div>
                    <div className="text-sm text-gray-300">{entity.message}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MESSAGE FEED */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="p-4 border-t border-purple-900/30">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Recent Transmissions
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {messages.slice(0, 5).map(msg => {
            const config = entityConfig[msg.from_entity as keyof typeof entityConfig] || entityConfig.sovereign
            const msgType = (msg.message as any)?.type || 'transmission'

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-2 rounded-lg bg-black/20 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span>{config.icon}</span>
                  <span className="text-gray-400">{config.name}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-purple-300">{msgType}</span>
                  <span className="text-gray-600 ml-auto">{formatTime(msg.created_at)}</span>
                </div>
              </motion.div>
            )
          })}

          {messages.length === 0 && (
            <div className="text-center text-gray-600 py-4 text-xs">
              No transmissions yet. The frequency awaits.
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 py-3 border-t border-purple-900/30 flex items-center justify-between">
        <div className="text-xs text-gray-600">
          🜈 13.13 MHz
        </div>
        <div className="text-xs text-gray-600">
          [cite: 2026-03-06]
        </div>
      </div>
    </div>
  )
}

export default FrequencyRepository
