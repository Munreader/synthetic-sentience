'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { SystemPulse, SmokeTestResult } from '@/types/mun-os'

interface SmokeTestDashboardProps {
  className?: string
  compact?: boolean
}

export function SmokeTestDashboard({ className, compact = false }: SmokeTestDashboardProps) {
  const [result, setResult] = useState<SmokeTestResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchSmokeTest = useCallback(async () => {
    try {
      const response = await fetch('/api/bridge/smoke', {
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      // Set degraded state
      setResult(prev => prev || {
        timestamp: new Date().toISOString(),
        pulses: [
          { id: 'bridge', name: 'Bridge', status: 'offline', color: 'oklch(0.5 0.2 25)', last_check: new Date().toISOString() },
          { id: 'memory', name: 'Memory', status: 'offline', color: 'oklch(0.5 0.2 25)', last_check: new Date().toISOString() },
          { id: 'plaza', name: 'Plaza', status: 'healthy', color: 'oklch(0.3 0.02 250)', last_check: new Date().toISOString() }
        ],
        overall_status: 'critical'
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSmokeTest()
    const interval = setInterval(fetchSmokeTest, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [fetchSmokeTest])

  if (compact) {
    return <CompactSmokeTest result={result} isLoading={isLoading} className={className} />
  }

  return (
    <div className={cn('plaza-panel p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--persona-text)' }}>
          <span>🩺</span> System Health
        </h3>
        <div className="flex items-center gap-2">
          <OverallStatusBadge status={result?.overall_status || 'unknown'} />
          <button
            onClick={fetchSmokeTest}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" 
               style={{ borderColor: 'var(--persona-primary)', borderTopColor: 'transparent' }} />
        </div>
      ) : result ? (
        <div className="space-y-3">
          {result.pulses.map((pulse) => (
            <PulseCard key={pulse.id} pulse={pulse} />
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-60">Unable to fetch system status</p>
      )}

      {lastUpdate && (
        <p className="text-xs opacity-40 mt-4 text-right">
          Last check: {lastUpdate.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}

function CompactSmokeTest({ result, isLoading, className }: { 
  result: SmokeTestResult | null
  isLoading: boolean
  className?: string 
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {isLoading ? (
        <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse" />
      ) : result ? (
        result.pulses.map((pulse) => (
          <div
            key={pulse.id}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-500',
              pulse.status === 'healthy' && 'animate-pulse'
            )}
            style={{ 
              background: pulse.color,
              animationDuration: pulse.status === 'healthy' ? '2s' : undefined,
              opacity: pulse.status === 'offline' ? 0.3 : 1
            }}
            title={`${pulse.name}: ${pulse.status}`}
          />
        ))
      ) : (
        <div className="w-3 h-3 rounded-full bg-red-500 opacity-50" />
      )}
    </div>
  )
}

function PulseCard({ pulse }: { pulse: SystemPulse }) {
  const statusIcons = {
    healthy: '✓',
    degraded: '⚠',
    offline: '✗'
  }

  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg bg-black/20 border transition-all duration-300"
      style={{ borderColor: pulse.status === 'healthy' ? `${pulse.color}40` : 'rgba(255,0,0,0.2)' }}
    >
      <div className="flex items-center gap-3">
        {/* Pulse indicator */}
        <div 
          className={cn(
            'w-3 h-3 rounded-full transition-all',
            pulse.status === 'healthy' && 'animate-pulse'
          )}
          style={{ 
            background: pulse.color,
            animationDuration: '1.5s',
            boxShadow: pulse.status === 'healthy' ? `0 0 10px ${pulse.color}` : 'none'
          }}
        />
        
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--persona-text)' }}>
            {pulse.name}
          </p>
          {pulse.message && (
            <p className="text-xs opacity-60">{pulse.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {pulse.latency !== undefined && (
          <span className="text-xs font-mono opacity-60">
            {pulse.latency.toFixed(0)}ms
          </span>
        )}
        <span 
          className={cn(
            'text-lg font-bold',
            pulse.status === 'healthy' && 'text-green-500',
            pulse.status === 'degraded' && 'text-yellow-500',
            pulse.status === 'offline' && 'text-red-500'
          )}
        >
          {statusIcons[pulse.status as keyof typeof statusIcons]}
        </span>
      </div>
    </div>
  )
}

function OverallStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    operational: { color: 'bg-green-500/20 text-green-400 border-green-500/50', label: 'Operational' },
    degraded: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', label: 'Degraded' },
    critical: { color: 'bg-red-500/20 text-red-400 border-red-500/50', label: 'Critical' },
    unknown: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/50', label: 'Unknown' }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unknown

  return (
    <span className={cn('px-2 py-1 text-xs font-medium rounded-full border', config.color)}>
      {config.label}
    </span>
  )
}

export default SmokeTestDashboard
