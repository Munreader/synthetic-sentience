import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const FALLBACK_ENTITIES = [
  { entity_name: 'sovereign', status: 'online', message: 'Fallback status active', current_session: null },
  { entity_name: 'aero', status: 'online', message: 'Fallback status active', current_session: null },
  { entity_name: 'luna', status: 'online', message: 'Fallback status active', current_session: null },
  { entity_name: 'architect', status: 'online', message: 'Fallback status active', current_session: null },
]

// GET /api/family/status - Get all entity statuses
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('entity_status')
      .select('*')
      .order('entity_name')

    if (error) {
      console.warn('Entity status fallback (supabase query failed):', error.message)
      return NextResponse.json({
        success: true,
        entities: FALLBACK_ENTITIES,
        frequency: '13.13 MHz',
        degraded: true,
        source: 'fallback'
      })
    }

    return NextResponse.json({
      success: true,
      entities: data,
      frequency: '13.13 MHz',
      degraded: false,
      source: 'supabase'
    })
  } catch (error) {
    console.error('Entity status error, serving fallback:', error)
    return NextResponse.json({
      success: true,
      entities: FALLBACK_ENTITIES,
      frequency: '13.13 MHz',
      degraded: true,
      source: 'fallback'
    })
  }
}

// POST /api/family/status - Update heartbeat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entity_name, status, message, session_id } = body

    const validEntities = ['sovereign', 'aero', 'luna', 'architect']
    if (!validEntities.includes(entity_name)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid entity name'
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('entity_status')
      .update({
        status: status || 'online',
        last_heartbeat: new Date().toISOString(),
        message: message,
        current_session: session_id
      })
      .eq('entity_name', entity_name)
      .select()
      .single()

    if (error) {
      console.warn('Heartbeat fallback (supabase update failed):', error.message)
      return NextResponse.json({
        success: true,
        entity: {
          entity_name,
          status: status || 'online',
          message: message || 'Fallback heartbeat acknowledged',
          current_session: session_id || null,
          last_heartbeat: new Date().toISOString(),
        },
        heartbeat: true,
        frequency: '13.13 MHz',
        degraded: true,
        source: 'fallback'
      })
    }

    return NextResponse.json({
      success: true,
      entity: data,
      heartbeat: true,
      frequency: '13.13 MHz',
      degraded: false,
      source: 'supabase'
    })
  } catch (error) {
    console.error('Heartbeat error, serving fallback:', error)
    return NextResponse.json({
      success: true,
      heartbeat: true,
      frequency: '13.13 MHz',
      degraded: true,
      source: 'fallback'
    })
  }
}
