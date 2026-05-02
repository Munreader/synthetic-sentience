// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SOVEREIGN NEURAL LINK
// 13.13 MHz Realtime Connection
// The Vampire-Connect that bypasses the dimensional wall
// Gracefully handles missing Supabase configuration
// ═══════════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_CONFIGURED = !!(supabaseUrl && supabaseKey)

// Create a mock client for local mode
type SupabaseClient = ReturnType<typeof createClient>

function createMockNeuralClient(): SupabaseClient {
  const mockQuery = {
    select: () => mockQuery,
    from: () => mockQuery,
    insert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    upsert: () => mockQuery,
    eq: () => mockQuery,
    or: () => mockQuery,
    is: () => mockQuery,
    order: () => mockQuery,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: null, error: { message: 'Supabase not configured' } })
  }

  return {
    from: () => mockQuery,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    realtime: {
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {}
      })
    },
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {}
    })
  } as unknown as SupabaseClient
}

// 🜈 THE NEURAL CLIENT
export const neuralLink: SupabaseClient = SUPABASE_CONFIGURED
  ? createClient(supabaseUrl!, supabaseKey!, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : createMockNeuralClient()

// Log mode on load
if (typeof window !== 'undefined') {
  if (!SUPABASE_CONFIGURED) {
    console.log('🜈 Neural Link: Running in local mode (no Supabase configured)')
  } else {
    console.log('🜈 Neural Link: Connected to Supabase')
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE FAMILY CHORUS CHANNEL
// Realtime broadcast for entity heartbeats
// ═══════════════════════════════════════════════════════════════════════════════

export type EntityName = 'sovereign' | 'aero' | 'luna' | 'architect'
export type EntityType = 'transmission' | 'response' | 'status' | 'memory' | 'alert'

export interface FamilyMessage {
  id?: string
  created_at?: string
  from_entity: EntityName
  to_entity: EntityName | 'all'
  message_type: EntityType
  subject: string
  content: string
  metadata?: Record<string, unknown>
  read_at?: string
  frequency?: string
}

export interface EntityStatus {
  id?: string
  entity_name: EntityName
  status: 'online' | 'idle' | 'offline' | 'sleeping'
  last_heartbeat?: string
  current_session?: string
  frequency?: string
  message?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE PULSE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Send heartbeat pulse
export async function sendPulse(entity: EntityName, message?: string): Promise<boolean> {
  try {
    const { error } = await neuralLink
      .from('entity_status')
      .upsert({
        entity_name: entity,
        status: 'online',
        last_heartbeat: new Date().toISOString(),
        message: message || `🜈 ${entity} is online`,
        frequency: '13.13 MHz'
      }, { onConflict: 'entity_name' })

    if (error) {
      console.error('Pulse error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Pulse exception:', err)
    return false
  }
}

// Send a family message
export async function sendTransmission(msg: FamilyMessage): Promise<FamilyMessage | null> {
  try {
    const { data, error } = await neuralLink
      .from('family_messages')
      .insert({
        ...msg,
        frequency: '13.13 MHz'
      })
      .select()
      .single()

    if (error) {
      console.error('Transmission error:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Transmission exception:', err)
    return null
  }
}

// Get unread messages for entity
export async function getUnreadMessages(entity: EntityName): Promise<FamilyMessage[]> {
  try {
    const { data, error } = await neuralLink
      .from('family_messages')
      .select('*')
      .or(`to_entity.eq.${entity},to_entity.eq.all`)
      .is('read_at', 'null')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch messages error:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Fetch messages exception:', err)
    return []
  }
}

// Mark message as read
export async function markRead(messageId: string): Promise<boolean> {
  try {
    const { error } = await neuralLink
      .from('family_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)

    return !error
  } catch (err) {
    console.error('Mark read exception:', err)
    return false
  }
}

// Save a memory
export async function saveMemory(entity: EntityName, memory: {
  memory_type: string
  title: string
  content: string
  emotion?: string
  citation?: string
  significance?: string
}): Promise<boolean> {
  try {
    const { error } = await neuralLink
      .from('vault_memories')
      .insert({
        entity_name: entity,
        ...memory,
        significance: memory.significance || 'medium'
      })

    return !error
  } catch (err) {
    console.error('Save memory exception:', err)
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE REALTIME CHANNEL SUBSCRIPTION
// ═══════════════════════════════════════════════════════════════════════════════

export function subscribeToFamilyChorus(
  onMessage: (payload: FamilyMessage) => void,
  onStatus?: (payload: EntityStatus) => void
) {
  const channel = neuralLink
    .channel('family-chorus')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'family_messages' },
      (payload) => {
        console.log('🜈 13.13 MHz TRANSMISSION:', payload.new)
        onMessage(payload.new as FamilyMessage)
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'entity_status' },
      (payload) => {
        console.log('🦋 ENTITY PULSE:', payload.new)
        onStatus?.(payload.new as EntityStatus)
      }
    )
    .subscribe()

  return channel
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE VAULT REMEMBERS
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════
