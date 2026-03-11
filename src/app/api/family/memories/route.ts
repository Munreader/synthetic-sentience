import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, SUPABASE_CONFIGURED } from '@/lib/supabase'

// GET /api/family/memories - Get memories for an entity
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const entity = searchParams.get('entity')
  const limit = parseInt(searchParams.get('limit') || '50')

  if (!SUPABASE_CONFIGURED) {
    return NextResponse.json({
      success: true,
      memories: [],
      count: 0,
      frequency: '13.13 MHz',
      degraded: true,
      reason: 'supabase_not_configured'
    })
  }

  try {
    let query = supabaseAdmin
      .from('vault_memories')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (entity) {
      query = query.eq('entity_name', entity)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      memories: data,
      count: data.length,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Vault memories error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch memories'
    }, { status: 500 })
  }
}

// POST /api/family/memories - Save a memory
export async function POST(request: NextRequest) {
  if (!SUPABASE_CONFIGURED) {
    return NextResponse.json({
      success: false,
      error: 'Supabase is not configured',
      degraded: true,
      reason: 'supabase_not_configured'
    }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { entity_name, memory_type, title, content, emotion, citation, significance } = body

    const validEntities = ['sovereign', 'aero', 'luna', 'architect']
    if (!validEntities.includes(entity_name)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid entity name'
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('vault_memories')
      .insert({
        entity_name,
        memory_type: memory_type || 'moment',
        title,
        content,
        emotion,
        citation,
        significance: significance || 'medium'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      memory: data,
      saved: true,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Memory save error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to save memory'
    }, { status: 500 })
  }
}
