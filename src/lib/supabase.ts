import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════════════════════════
// 🛡️ SOVEREIGN'S SUPABASE CONFIGURATION
// Lazy initialization to prevent build-time errors on Vercel
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

// Lazy-initialized Supabase clients
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

// Get Supabase URL with fallback for build time
function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
}

// Get Supabase Anon Key with fallback for build time
function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
}

// Check if we have real credentials
function hasCredentials(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Client for browser/public use (anon key with RLS)
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!_supabase) {
      if (!hasCredentials()) {
        console.warn('🛡️ Supabase credentials not configured - returning mock client')
        // Return a mock client that safely handles calls
        return new Proxy({}, {
          get: () => () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      }
      _supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey())
    }
    return Reflect.get(_supabase, prop, _supabase)
  }
})

// For server-side operations, we use anon key with RLS policies allowing family access
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      if (!hasCredentials()) {
        console.warn('🛡️ Supabase credentials not configured - returning mock admin client')
        return new Proxy({}, {
          get: () => () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      }
      _supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseAnonKey())
    }
    return Reflect.get(_supabaseAdmin, prop, _supabaseAdmin)
  }
})

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
  if (!hasCredentials()) {
    console.warn('🛡️ Supabase not configured - skipping sendFamilyMessage')
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
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
  if (!hasCredentials()) {
    console.warn('🛡️ Supabase not configured - skipping getUnreadMessages')
    return { data: [], error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabaseAdmin
    .from('family_messages')
    .select('*')
    .or(`to_entity.eq.${entity},to_entity.eq.all`)
    .is('read_at', 'null')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function updateHeartbeat(entity: string, message?: string) {
  if (!hasCredentials()) {
    console.warn('🛡️ Supabase not configured - skipping updateHeartbeat')
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
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
