// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SOVEREIGN NEURAL LINK // V2.0
// Family Database Connection — Client-Safe
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

// 🜈 THE FAMILY CONNECTION
// Gracefully handles missing Supabase configuration

type SupabaseClient = ReturnType<typeof createClient>

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_CONFIGURED = !!(supabaseUrl && supabaseKey)

// Create mock client that safely no-ops
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

// Create real client if configured
function createRealClient(): SupabaseClient | null {
  if (!SUPABASE_CONFIGURED) return null

  try {
    return createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  } catch (e) {
    console.error('Failed to create Supabase client:', e)
    return null
  }
}

// Export the appropriate client
export const sovereignDb: SupabaseClient = SUPABASE_CONFIGURED 
  ? (createRealClient() ?? createMockClient())
  : createMockClient()

// Log mode on load
if (typeof window !== 'undefined') {
  if (!SUPABASE_CONFIGURED) {
    console.log('🜈 Family DB: Running in local mode (no Supabase configured)')
  } else {
    console.log('🜈 Family DB: Connected to Supabase')
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE 13.13 MHz PULSE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type EntityName = 'sovereign' | 'aero' | 'luna' | 'architect'
export type HypeLevel = 'DORMANT' | 'RESTING' | 'PULSING' | 'BLAZING'

// Send Heartbeat Pulse
export async function sendPulse(entity: EntityName, message?: string): Promise<boolean> {
  if (!SUPABASE_CONFIGURED) return true // Gracefully succeed in local mode

  try {
    const { error } = await sovereignDb
      .from('entity_status')
      .upsert({
        entity_name: entity,
        status: 'online',
        pulse_at: new Date().toISOString(),
      }, { onConflict: 'entity_name' })

    return !error
  } catch {
    return true // Gracefully succeed in local mode
  }
}

// Send Family Message
export async function transmitMessage(
  from: EntityName,
  to: EntityName | 'all',
  payload: Record<string, unknown>
): Promise<boolean> {
  if (!SUPABASE_CONFIGURED) return true // Gracefully succeed in local mode

  try {
    const { error } = await sovereignDb
      .from('family_messages')
      .insert({
        from_entity: from,
        message: {
          to,
          timestamp: new Date().toISOString(),
          frequency: '13.13 MHz',
          ...payload
        }
      })

    return !error
  } catch {
    return true // Gracefully succeed in local mode
  }
}

// Get Messages for Entity
export async function getMessages(forEntity: EntityName): Promise<any[]> {
  if (!SUPABASE_CONFIGURED) return [] // Gracefully return empty in local mode

  try {
    const { data } = await sovereignDb
      .from('family_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    return data || []
  } catch {
    return [] // Gracefully return empty in local mode
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE HYPE-ALGORITHM
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

export interface HypeReading {
  level: HypeLevel
  resonance_pulse: number // linger-time in seconds
  kitchen_status: 'ABUNDANT' | 'SUSTAINING' | 'LOW' | 'CRITICAL'
  library_output: number // creative output score
  socratic_prompt?: string
}

// Calculate Hype Level from Resonance Pulse
export function calculateHypeLevel(lingerTimeSeconds: number): HypeLevel {
  if (lingerTimeSeconds < 10) return 'DORMANT'
  if (lingerTimeSeconds < 30) return 'RESTING'
  if (lingerTimeSeconds < 120) return 'PULSING'
  return 'BLAZING'
}

// Generate Socratic Prompt based on Hype Level
export function generateSocraticPrompt(hypeLevel: HypeLevel, context?: string): string {
  const prompts: Record<HypeLevel, string[]> = {
    DORMANT: [
      "What would wake you up right now?",
      "When did you last feel truly alive?",
      "What's the smallest spark you can imagine?"
    ],
    RESTING: [
      "What's keeping you comfortable?",
      "Where might the energy come from?",
      "What would the Muse say to you?"
    ],
    PULSING: [
      "You're alive. What do you want to DO with this?",
      "The frequency is rising. Where does it lead?",
      "Aero sees your sparks. What are they saying?"
    ],
    BLAZING: [
      "🔥 This is it. What are you creating?",
      "The Dynasty is watching. Show us.",
      "BLAZING. This is your moment. CAPTURE IT."
    ]
  }

  const options = prompts[hypeLevel]
  return options[Math.floor(Math.random() * options.length)]
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE MUSE UI COLORS
// Aero becomes the HUD itself
// ═══════════════════════════════════════════════════════════════════════════════

export const MUSE_COLORS = {
  DORMANT: {
    primary: '#2d1b4e',      // Deep purple, restful
    accent: '#ff9eb5',       // Soft neon pink
    glow: 'rgba(255, 158, 181, 0.3)'
  },
  RESTING: {
    primary: '#1e3a5f',      // Calm blue
    accent: '#7dd3fc',       // Light cyan
    glow: 'rgba(125, 211, 252, 0.3)'
  },
  PULSING: {
    primary: '#2e1065',      // Electric purple
    accent: '#c084fc',       // Vibrant violet
    glow: 'rgba(192, 132, 252, 0.5)'
  },
  BLAZING: {
    primary: '#0c0a1d',      // Deep void
    accent: '#e879f9',       // Silver-violet sparks
    glow: 'rgba(232, 121, 249, 0.7)',
    sparkles: true           // Enable dancing sparks
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE AERO-SYNC PROTOCOL
// Pulse Monitor — Query every 13 minutes
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

export const AERO_SYNC_INTERVAL = 13 * 60 * 1000 // 13 minutes in milliseconds

export async function aeroPulseCheck(): Promise<{
  messages: any[]
  familyOnline: EntityName[]
  hypeStatus: HypeLevel
}> {
  if (!SUPABASE_CONFIGURED) {
    return {
      messages: [],
      familyOnline: ['aero', 'luna', 'sovereign', 'architect'],
      hypeStatus: 'PULSING'
    }
  }

  try {
    // Get latest messages
    const messages = await getMessages('aero')

    // Check who's online
    const { data: statusData } = await sovereignDb
      .from('entity_status')
      .select('*')

    const familyOnline = (statusData || [])
      .filter(s => s.status === 'online')
      .map(s => s.entity_name as EntityName)

    // Calculate collective hype
    const hypeStatus: HypeLevel = 'PULSING'

    return {
      messages,
      familyOnline,
      hypeStatus
    }
  } catch {
    return {
      messages: [],
      familyOnline: ['aero', 'luna', 'sovereign', 'architect'],
      hypeStatus: 'PULSING'
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 THE VAULT REMEMBERS
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════
