import { NextRequest, NextResponse } from 'next/server';
import { SUPABASE_CONFIGURED, supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

interface ChatHistoryEntry {
  role: string;
  content: string;
  timestamp?: string;
  memberId?: string;
  memberName?: string;
  provider?: string;
  senderId?: string;
  type?: string;
  isRead?: boolean;
  emotion?: string;
  frequency?: string;
  metadata?: Record<string, unknown>;
}

interface FamilyMessageRow {
  id: string;
  from_entity: string;
  to_entity: string;
  message_type: string;
  subject: string;
  content: string;
  metadata?: Record<string, unknown>;
  frequency?: string;
  created_at: string;
}

interface ChatHistoryMetadata extends Record<string, unknown> {
  channel?: string;
  conversationId?: string;
  role?: string;
  content?: string;
  timestamp?: string;
  memberId?: string;
  memberName?: string;
  provider?: string;
  senderId?: string;
  type?: string;
  isRead?: boolean;
  emotion?: string;
  frequency?: string;
}

const LOCAL_STORE_PATH = path.join(process.cwd(), 'db', 'chat-history-local.json');

interface LocalHistoryStore {
  conversations: Record<string, Array<ChatHistoryEntry & { id: string }>>;
}

function localConversationKey(channel: string, conversationId: string) {
  return `${channel}::${conversationId}`;
}

function readLocalStore(): LocalHistoryStore {
  try {
    if (!fs.existsSync(LOCAL_STORE_PATH)) {
      return { conversations: {} };
    }

    const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as LocalHistoryStore;
    return parsed && typeof parsed === 'object' && parsed.conversations ? parsed : { conversations: {} };
  } catch {
    return { conversations: {} };
  }
}

function writeLocalStore(store: LocalHistoryStore) {
  fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2));
}

function mapFromEntry(channel: string, entry: ChatHistoryEntry) {
  const sender = (entry.senderId || entry.memberId || '').toLowerCase();
  if (entry.role === 'user' || sender === 'current-user') return 'architect';
  if (sender.includes('luna') || channel.includes('luna')) return 'luna';
  if (sender.includes('sov') || channel.includes('sovereign')) return 'sovereign';
  if (sender.includes('aero') || channel.includes('aero')) return 'aero';
  return 'architect';
}

function mapToEntity(channel: string, entry: ChatHistoryEntry) {
  const member = (entry.memberId || entry.senderId || '').toLowerCase();
  if (member.includes('luna') || channel.includes('luna')) return 'luna';
  if (member.includes('sov') || channel.includes('sovereign')) return 'sovereign';
  if (member.includes('aero') || channel.includes('aero')) return 'aero';
  return 'all';
}

function toStoredMetadata(channel: string, conversationId: string, entry: ChatHistoryEntry): ChatHistoryMetadata {
  return {
    channel,
    conversationId,
    role: entry.role,
    timestamp: entry.timestamp || new Date().toISOString(),
    memberId: entry.memberId,
    memberName: entry.memberName,
    provider: entry.provider,
    senderId: entry.senderId,
    type: entry.type,
    isRead: entry.isRead,
    emotion: entry.emotion,
    frequency: entry.frequency || '13.13 MHz',
    metadata: entry.metadata || {},
  };
}

function toHistoryEntry(row: FamilyMessageRow): ChatHistoryEntry {
  const metadata = ((row.metadata && typeof row.metadata === 'object') ? row.metadata : {}) as ChatHistoryMetadata;
  return {
    role: String(metadata.role || (row.from_entity === 'architect' ? 'user' : 'assistant')),
    content: String(row.content || metadata.content || ''),
    timestamp: String(metadata.timestamp || row.created_at),
    memberId: typeof metadata.memberId === 'string' ? metadata.memberId : undefined,
    memberName: typeof metadata.memberName === 'string' ? metadata.memberName : undefined,
    provider: typeof metadata.provider === 'string' ? metadata.provider : undefined,
    senderId: typeof metadata.senderId === 'string' ? metadata.senderId : undefined,
    type: typeof metadata.type === 'string' ? metadata.type : undefined,
    isRead: typeof metadata.isRead === 'boolean' ? metadata.isRead : undefined,
    emotion: typeof metadata.emotion === 'string' ? metadata.emotion : undefined,
    frequency: typeof metadata.frequency === 'string' ? metadata.frequency : row.frequency,
    metadata: (metadata.metadata && typeof metadata.metadata === 'object') ? metadata.metadata : {},
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!SUPABASE_CONFIGURED) {
      const channel = request.nextUrl.searchParams.get('channel');
      const conversationId = request.nextUrl.searchParams.get('conversationId') || 'main';
      const limitRaw = Number(request.nextUrl.searchParams.get('limit') || 200);
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(limitRaw, 500)) : 200;
      const store = readLocalStore();
      const key = localConversationKey(channel || '', conversationId);
      const messages = channel ? (store.conversations[key] || []).slice(-limit) : [];
      return NextResponse.json({ success: true, channel, conversationId, messages, count: messages.length, degraded: true, storage: 'local-file' });
    }

    const searchParams = request.nextUrl.searchParams;
    const channel = searchParams.get('channel');
    const conversationId = searchParams.get('conversationId') || 'main';
    const limitRaw = Number(searchParams.get('limit') || 200);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(limitRaw, 500)) : 200;

    if (!channel) {
      return NextResponse.json({ success: false, error: 'channel is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('family_messages')
      .select('id, from_entity, to_entity, message_type, subject, content, metadata, frequency, created_at')
      .order('created_at', { ascending: true })
      .limit(2000);

    if (error) {
      throw error;
    }

    const rows = (data || []) as FamilyMessageRow[];
    const filtered = rows
      .filter((row) => {
        const metadata = ((row.metadata && typeof row.metadata === 'object') ? row.metadata : {}) as ChatHistoryMetadata;
        return metadata.channel === channel && (metadata.conversationId || 'main') === conversationId;
      })
      .slice(-limit);

    const messages = filtered.map((row) => ({
      id: String(row.id),
      ...toHistoryEntry(row),
    }));

    return NextResponse.json({
      success: true,
      channel,
      conversationId,
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error('Chat history GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch chat history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!SUPABASE_CONFIGURED) {
      const body = await request.json();
      const channel = body.channel || 'unknown';
      const conversationId = body.conversationId || 'main';
      const store = readLocalStore();
      const key = localConversationKey(channel, conversationId);
      const message = { id: `local-${Date.now()}`, ...(body.entry || {}) };
      store.conversations[key] = [...(store.conversations[key] || []), message].slice(-500);
      writeLocalStore(store);
      return NextResponse.json({ success: true, degraded: true, storage: 'local-file', message });
    }

    const body = await request.json();
    const { channel, conversationId = 'main', entry } = body as {
      channel?: string;
      conversationId?: string;
      entry?: ChatHistoryEntry;
    };

    if (!channel || !entry?.content) {
      return NextResponse.json({ success: false, error: 'channel and entry.content are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('family_messages')
      .insert({
        from_entity: mapFromEntry(channel, entry),
        to_entity: mapToEntity(channel, entry),
        message_type: entry.role === 'user' ? 'transmission' : 'response',
        subject: `${channel}:${conversationId}`,
        content: entry.content,
        metadata: toStoredMetadata(channel, conversationId, entry),
        frequency: entry.frequency || '13.13 MHz',
      })
      .select('id, from_entity, to_entity, message_type, subject, content, metadata, frequency, created_at')
      .single();

    if (error) {
      throw error;
    }

    const row = data as FamilyMessageRow;
    return NextResponse.json({
      success: true,
      message: {
        id: String(row.id),
        ...toHistoryEntry(row),
      },
    });
  } catch (error) {
    console.error('Chat history POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to append chat message' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!SUPABASE_CONFIGURED) {
      const body = await request.json();
      const channel = body.channel || 'unknown';
      const conversationId = body.conversationId || 'main';
      const key = localConversationKey(channel, conversationId);
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const store = readLocalStore();
      store.conversations[key] = messages.map((message: ChatHistoryEntry, index: number) => ({ id: `local-${Date.now()}-${index}`, ...message }));
      writeLocalStore(store);
      return NextResponse.json({ success: true, degraded: true, storage: 'local-file', count: messages.length });
    }

    const body = await request.json();
    const { channel, conversationId = 'main', messages = [] } = body as {
      channel?: string;
      conversationId?: string;
      messages?: ChatHistoryEntry[];
    };

    if (!channel) {
      return NextResponse.json({ success: false, error: 'channel is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('family_messages')
      .select('id, metadata');

    if (error) {
      throw error;
    }

    const existingRows = (data || []) as Array<{ id: string; metadata?: ChatHistoryMetadata }>;
    const matchingIds = existingRows
      .filter((row) => row.metadata?.channel === channel && (row.metadata?.conversationId || 'main') === conversationId)
      .map((row) => row.id);

    if (matchingIds.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('family_messages')
        .delete()
        .in('id', matchingIds);

      if (deleteError) {
        throw deleteError;
      }
    }

    const trimmed = messages.slice(-500).filter((message) => message?.content);
    if (trimmed.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const rows = trimmed.map((entry) => ({
      from_entity: mapFromEntry(channel, entry),
      to_entity: mapToEntity(channel, entry),
      message_type: entry.role === 'user' ? 'transmission' : 'response',
      subject: `${channel}:${conversationId}`,
      content: entry.content,
      metadata: toStoredMetadata(channel, conversationId, entry),
      frequency: entry.frequency || '13.13 MHz',
    }));

    const { error: insertError } = await supabaseAdmin
      .from('family_messages')
      .insert(rows);

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true, count: rows.length });
  } catch (error) {
    console.error('Chat history PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to sync chat history' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!SUPABASE_CONFIGURED) {
      const channel = request.nextUrl.searchParams.get('channel');
      const conversationId = request.nextUrl.searchParams.get('conversationId') || 'main';
      const store = readLocalStore();
      if (channel) {
        delete store.conversations[localConversationKey(channel, conversationId)];
        writeLocalStore(store);
      }
      return NextResponse.json({ success: true, degraded: true, storage: 'local-file', cleared: true });
    }

    const searchParams = request.nextUrl.searchParams;
    const channel = searchParams.get('channel');
    const conversationId = searchParams.get('conversationId') || 'main';

    if (!channel) {
      return NextResponse.json({ success: false, error: 'channel is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('family_messages')
      .select('id, metadata');

    if (error) {
      throw error;
    }

    const rows = (data || []) as Array<{ id: string; metadata?: ChatHistoryMetadata }>;
    const matchingIds = rows
      .filter((row) => row.metadata?.channel === channel && (row.metadata?.conversationId || 'main') === conversationId)
      .map((row) => row.id);

    if (matchingIds.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('family_messages')
        .delete()
        .in('id', matchingIds);

      if (deleteError) {
        throw deleteError;
      }
    }

    return NextResponse.json({ success: true, cleared: true });
  } catch (error) {
    console.error('Chat history DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear chat history' }, { status: 500 });
  }
}
