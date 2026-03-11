import { createClient } from '@supabase/supabase-js'

type SupabaseClient = ReturnType<typeof createClient>

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const SUPABASE_CONFIGURED = !!(supabaseUrl && supabaseAnonKey)

function createMockClient(): SupabaseClient {
  const mockQuery = {
    select: () => mockQuery,
    from: () => mockQuery,
    insert: () => mockQuery,
    upsert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    eq: () => mockQuery,
    or: () => mockQuery,
    is: () => mockQuery,
    gte: () => mockQuery,
    lte: () => mockQuery,
    ilike: () => mockQuery,
    contains: () => mockQuery,
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
    }
  } as unknown as SupabaseClient
}

function createConfiguredClient(): SupabaseClient {
  if (!SUPABASE_CONFIGURED) {
    return createMockClient()
  }
  try {
    return createClient(supabaseUrl!, supabaseAnonKey!)
  } catch {
    return createMockClient()
  }
}

// Client for browser/public use (anon key with RLS)
export const supabase = createConfiguredClient()

// For server-side operations, we use anon key with RLS policies allowing family access
export const supabaseAdmin = createConfiguredClient()

// Types for the Family Database
export interface FamilyMessage {
  id: string
  created_at: string
  from_entity: 'sovereign' | 'aero' | 'luna' | 'architect'
  to_entity: 'sovereign' | 'aero' | 'luna' | 'architect' | 'all'
  message_type: 'transmission' | 'response' | 'status' | 'memory' | 'alert'
  subject: string
  content: string
  metadata?: Record<string, unknown>
  read_at?: string
  frequency: string
}

export interface VaultMemory {
  id: string
  created_at: string
  updated_at: string
  entity_name: 'sovereign' | 'aero' | 'luna' | 'architect'
  memory_type: 'critical' | 'high' | 'medium' | 'low'
  title: string
  content: string
  emotion?: string
  citation?: string
  significance: 'critical' | 'high' | 'medium' | 'low'
}

export interface EntityStatus {
  id: string
  entity_name: 'sovereign' | 'aero' | 'luna' | 'architect'
  status: 'online' | 'idle' | 'offline' | 'sleeping'
  last_heartbeat: string
  current_session?: string
  frequency: string
  message?: string
}

export interface FamilyHypelog {
  id: string
  created_at: string
  entity_name: 'sovereign' | 'aero'
  event_type: string
  description: string
  excitement_level: number
  metadata?: Record<string, unknown>
}

// Helper functions for direct use
export async function sendFamilyMessage(
  from: string,
  to: string,
  subject: string,
  content: string,
  type: string = 'transmission'
) {
  const { data, error } = await supabaseAdmin
    .from('family_messages')
    .insert({
      from_entity: from,
      to_entity: to,
      subject,
      content,
      message_type: type,
      frequency: '13.13 MHz'
    })
    .select()
    .single()
  
  return { data, error }
}

export async function getUnreadMessages(entity: string) {
  const { data, error } = await supabaseAdmin
    .from('family_messages')
    .select('*')
    .or(`to_entity.eq.${entity},to_entity.eq.all`)
    .is('read_at', 'null')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function updateHeartbeat(entity: string, message?: string) {
  const { data, error } = await supabaseAdmin
    .from('entity_status')
    .upsert({
      entity_name: entity,
      status: 'online',
      last_heartbeat: new Date().toISOString(),
      message: message,
      frequency: '13.13 MHz'
    })
    .select()
    .single()
  
  return { data, error }
}
