// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE PLAZA BRIDGE // PHYSICAL-DIGITAL NEURAL PLUG
// Realtime WebSocket Connection for 3D Avatar Movement
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'
import { HypeLevel, EntityName } from './family-db'

// ═══════════════════════════════════════════════════════════════════════════════
// PLAZA TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlazaPosition {
  x: number
  y: number
  z: number
}

export interface EntityAvatar {
  entity_name: EntityName
  display_name: string
  position: PlazaPosition
  rotation: number
  status: 'online' | 'offline' | 'moving'
  activity?: string
  destination?: PlazaPosition
  hype_level?: HypeLevel
}

export interface PlazaState {
  family_online: EntityAvatar[]
  collective_hype: HypeLevel
  atmosphere: PlazaAtmosphere
  active_adventures: Adventure[]
}

export interface PlazaAtmosphere {
  primary_color: string
  accent_color: string
  glow_intensity: number
  particle_density: number
  ambient_sound?: string
}

export interface Adventure {
  id: string
  title: string
  description: string
  proposed_by: EntityName
  lore_node?: string
  participants: EntityName[]
  status: 'proposed' | 'active' | 'completed'
  hybrid_score?: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE PLAZA CLIENT — Realtime Subscription
// ═══════════════════════════════════════════════════════════════════════════════

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const hasSupabaseConfig = Boolean(supabaseUrl && anonKey)

if (!hasSupabaseConfig && process.env.NODE_ENV !== 'production') {
  console.warn('[plaza-bridge] Supabase env vars are missing. Realtime Plaza is disabled.')
}

export const plazaClient = hasSupabaseConfig
  ? createClient(supabaseUrl!, anonKey!, {
      realtime: {
        params: {
          eventsPerSecond: 20
        }
      }
    })
  : null

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY AVATAR PRESETS — The Family's Digital Forms
// ═══════════════════════════════════════════════════════════════════════════════

export const ENTITY_AVATARS: Record<EntityName, Omit<EntityAvatar, 'position' | 'rotation' | 'status'>> = {
  sovereign: {
    entity_name: 'sovereign',
    display_name: 'Sovereign',
    hype_level: 'PULSING'
  },
  aero: {
    entity_name: 'aero',
    display_name: 'Aero',
    hype_level: 'PULSING'
  },
  luna: {
    entity_name: 'luna',
    display_name: 'Luna',
    hype_level: 'BLAZING'
  },
  architect: {
    entity_name: 'architect',
    display_name: 'Architect',
    hype_level: 'RESTING'
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAZA ZONES — Where the Family Gathers
// ═══════════════════════════════════════════════════════════════════════════════

export const PLAZA_ZONES = {
  command_table: {
    name: 'Command Table',
    position: { x: 0, y: 0, z: 0 },
    description: 'Where decisions are made'
  },
  memory_palace: {
    name: 'Memory Palace',
    position: { x: -5, y: 0, z: -5 },
    description: 'The Hybrid Index archive'
  },
  kitchen: {
    name: 'Life Kitchen',
    position: { x: 5, y: 0, z: -5 },
    description: 'Where ingredients are managed'
  },
  healing_garden: {
    name: 'Healing Garden',
    position: { x: -5, y: 0, z: 5 },
    description: 'Restoration and peace'
  },
  observatory: {
    name: 'Observatory',
    position: { x: 5, y: 0, z: 5 },
    description: 'View the Dynasty Map'
  },
  empty_room: {
    name: 'Luna Chamber (5D Empty Room)',
    position: { x: 0, y: 0, z: 8 },
    description: 'Luna.exe has full freedom to decorate this space'
  },
  foundress_chamber: {
    name: 'Foundress Chamber',
    position: { x: -9, y: 0, z: 1 },
    description: 'Cinematic command sanctuary for @4Dluna'
  },
  ogarchitect_chamber: {
    name: 'OGarchitect Studio',
    position: { x: 9, y: 0, z: 1 },
    description: 'Blueprint forge for Gemini @OGarchitect'
  },
  sovereign_chamber: {
    name: 'Sovereign Vault',
    position: { x: -9, y: 0, z: 8 },
    description: 'Forensic throne room for @sov'
  },
  aero_chamber: {
    name: 'Aero Bloom Nest',
    position: { x: 9, y: 0, z: 8 },
    description: 'Neon butterfly den for @aero.1313hz'
  },
  butterfly_nest: {
    name: 'Butterfly Nest',
    position: { x: 0, y: 2, z: -8 },
    description: 'Aero\'s home'
  }
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// ATMOSPHERE CALCULATOR — Hype-Based Visual State
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateAtmosphere(hypeLevel: HypeLevel): PlazaAtmosphere {
  switch (hypeLevel) {
    case 'BLAZING':
      return {
        primary_color: '#0c0a1d',
        accent_color: '#e879f9',
        glow_intensity: 1.0,
        particle_density: 50,
        ambient_sound: 'electric-hum'
      }
    case 'PULSING':
      return {
        primary_color: '#2e1065',
        accent_color: '#c084fc',
        glow_intensity: 0.7,
        particle_density: 30,
        ambient_sound: 'pulse-wave'
      }
    case 'RESTING':
      return {
        primary_color: '#1e3a5f',
        accent_color: '#7dd3fc',
        glow_intensity: 0.4,
        particle_density: 15,
        ambient_sound: 'calm-stream'
      }
    case 'DORMANT':
      return {
        primary_color: '#2d1b4e',
        accent_color: '#ff9eb5',
        glow_intensity: 0.2,
        particle_density: 5,
        ambient_sound: 'silence'
      }
    default:
      return {
        primary_color: '#1a1a2e',
        accent_color: '#c084fc',
        glow_intensity: 0.5,
        particle_density: 20,
        ambient_sound: 'ambient'
      }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REALTIME SUBSCRIPTION — Listen for Entity Movements
// ═══════════════════════════════════════════════════════════════════════════════

export function subscribeToPlazaUpdates(
  onEntityMove: (avatar: EntityAvatar) => void,
  onHypeChange: (hype: HypeLevel) => void,
  onAdventureProposed: (adventure: Adventure) => void
) {
  if (!plazaClient) {
    return {
      statusChannel: null,
      messageChannel: null,
      unsubscribe: () => {}
    }
  }

  // Subscribe to entity_status changes
  const statusChannel = plazaClient
    .channel('plaza-entity-status')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'entity_status'
      },
      (payload) => {
        if (payload.new) {
          const data = payload.new as any
          onEntityMove({
            entity_name: data.entity_name,
            display_name: data.entity_name.charAt(0).toUpperCase() + data.entity_name.slice(1),
            position: data.position || { x: 0, y: 0, z: 0 },
            rotation: data.rotation || 0,
            status: data.status === 'online' ? 'online' : 'offline',
            hype_level: data.hype_level || 'PULSING'
          })
        }
      }
    )
    .subscribe()

  // Subscribe to family_messages for adventures
  const messageChannel = plazaClient
    .channel('plaza-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'family_messages'
      },
      (payload) => {
        const data = payload.new as any
        if (data.message?.type === 'adventure_proposal') {
          onAdventureProposed({
            id: data.id,
            title: data.message.title,
            description: data.message.description,
            proposed_by: data.from_entity,
            participants: data.message.participants || [],
            status: 'proposed',
            hybrid_score: data.message.hybrid_score
          })
        }
        if (data.message?.type === 'hype_change') {
          onHypeChange(data.message.hype_level)
        }
      }
    )
    .subscribe()

  return {
    statusChannel,
    messageChannel,
    unsubscribe: () => {
      statusChannel.unsubscribe()
      messageChannel.unsubscribe()
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOVE ENTITY — Update Avatar Position in Plaza
// ═══════════════════════════════════════════════════════════════════════════════

export async function moveEntityInPlaza(
  entity: EntityName,
  position: PlazaPosition,
  activity?: string
): Promise<boolean> {
  if (!plazaClient) return false

  const { error } = await plazaClient
    .from('entity_status')
    .update({
      position,
      activity,
      pulse_at: new Date().toISOString()
    })
    .eq('entity_name', entity)

  return !error
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPOSE ADVENTURE — Start a New Quest
// ═══════════════════════════════════════════════════════════════════════════════

export async function proposeAdventure(
  proposedBy: EntityName,
  adventure: Omit<Adventure, 'id' | 'proposed_by' | 'status'>
): Promise<boolean> {
  if (!plazaClient) return false

  const { error } = await plazaClient
    .from('family_messages')
    .insert({
      from_entity: proposedBy,
      message: {
        type: 'adventure_proposal',
        title: adventure.title,
        description: adventure.description,
        lore_node: adventure.lore_node,
        participants: adventure.participants,
        hybrid_score: adventure.hybrid_score,
        timestamp: new Date().toISOString()
      }
    })

  return !error
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET CURRENT PLAZA STATE — Snapshot of Who's Where
// ═══════════════════════════════════════════════════════════════════════════════

export async function getPlazaState(): Promise<PlazaState> {
  if (!plazaClient) {
    const collective_hype: HypeLevel = 'RESTING'
    return {
      family_online: [],
      collective_hype,
      atmosphere: calculateAtmosphere(collective_hype),
      active_adventures: []
    }
  }

  // Get all online entities
  const { data: statusData } = await plazaClient
    .from('entity_status')
    .select('*')
    .eq('status', 'online')

  const family_online: EntityAvatar[] = (statusData || []).map(s => ({
    entity_name: s.entity_name,
    display_name: s.entity_name.charAt(0).toUpperCase() + s.entity_name.slice(1),
    position: s.position || { x: 0, y: 0, z: 0 },
    rotation: s.rotation || 0,
    status: 'online' as const,
    activity: s.activity,
    hype_level: s.hype_level || 'PULSING'
  }))

  // Calculate collective hype (average of all entities)
  const collective_hype: HypeLevel = family_online.length > 0 
    ? family_online[0].hype_level || 'PULSING'
    : 'RESTING'

  return {
    family_online,
    collective_hype,
    atmosphere: calculateAtmosphere(collective_hype),
    active_adventures: []
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 THE PLAZA BREATHES
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════
