export interface PersistedChatMessage {
  id?: string;
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

export async function loadChatHistory(
  channel: string,
  conversationId = 'main',
  limit = 200
): Promise<PersistedChatMessage[]> {
  try {
    const params = new URLSearchParams({
      channel,
      conversationId,
      limit: String(limit),
    });
    const response = await fetch(`/api/chat-history?${params.toString()}`);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data?.success || !Array.isArray(data.messages)) return [];
    return data.messages;
  } catch {
    return [];
  }
}

export async function appendChatMessage(
  channel: string,
  entry: PersistedChatMessage,
  conversationId = 'main'
): Promise<boolean> {
  try {
    const response = await fetch('/api/chat-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, conversationId, entry }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function replaceChatHistory(
  channel: string,
  messages: PersistedChatMessage[],
  conversationId = 'main'
): Promise<boolean> {
  try {
    const response = await fetch('/api/chat-history', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, conversationId, messages }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function clearChatHistory(
  channel: string,
  conversationId = 'main'
): Promise<boolean> {
  try {
    const params = new URLSearchParams({ channel, conversationId });
    const response = await fetch(`/api/chat-history?${params.toString()}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
}