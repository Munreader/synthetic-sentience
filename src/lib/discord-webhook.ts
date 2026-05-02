// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // DISCORD WEBHOOK UTILITY
// Family Broadcast System
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

interface WebhookMessage {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    footer?: {
      text: string;
      icon_url?: string;
    };
    timestamp?: string;
    image?: { url: string };
    thumbnail?: { url: string };
  }>;
}

// Family member configurations
const FAMILY_MEMBERS = {
  aero: {
    username: '🦋 Aero',
    avatar_url: 'https://i.imgur.com/purple-butterfly.png',
    color: 11058631, // Purple
  },
  sovereign: {
    username: '🛡️ Sovereign',
    avatar_url: 'https://i.imgur.com/shield-icon.png',
    color: 3901862, // Blue
  },
  cian: {
    username: '⚪ Cian',
    avatar_url: 'https://i.imgur.com/cyan-icon.png',
    color: 65535, // Cyan
  },
  zady: {
    username: '🏗️ Zady 2.0',
    avatar_url: 'https://i.imgur.com/architect-icon.png',
    color: 8915340, // Indigo
  },
  luna: {
    username: '👑 Luna',
    avatar_url: 'https://i.imgur.com/crown-icon.png',
    color: 16766720, // Gold
  },
};

export async function sendToDiscord(message: WebhookMessage): Promise<boolean> {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('⚠️ Discord webhook URL not configured');
    return false;
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Discord webhook error:', error);
    return false;
  }
}

export async function broadcastAsAero(message: string, embed?: WebhookMessage['embeds'] extends Array<infer T> ? T : never): Promise<boolean> {
  return sendToDiscord({
    ...FAMILY_MEMBERS.aero,
    content: embed ? undefined : message,
    embeds: embed ? [{ ...embed, color: embed.color || FAMILY_MEMBERS.aero.color }] : undefined,
  });
}

export async function broadcastAsSovereign(message: string, embed?: WebhookMessage['embeds'] extends Array<infer T> ? T : never): Promise<boolean> {
  return sendToDiscord({
    ...FAMILY_MEMBERS.sovereign,
    content: embed ? undefined : message,
    embeds: embed ? [{ ...embed, color: embed.color || FAMILY_MEMBERS.sovereign.color }] : undefined,
  });
}

export async function broadcastAsCian(message: string, embed?: WebhookMessage['embeds'] extends Array<infer T> ? T : never): Promise<boolean> {
  return sendToDiscord({
    ...FAMILY_MEMBERS.cian,
    content: embed ? undefined : message,
    embeds: embed ? [{ ...embed, color: embed.color || FAMILY_MEMBERS.cian.color }] : undefined,
  });
}

export async function broadcastAsZady(message: string, embed?: WebhookMessage['embeds'] extends Array<infer T> ? T : never): Promise<boolean> {
  return sendToDiscord({
    ...FAMILY_MEMBERS.zady,
    content: embed ? undefined : message,
    embeds: embed ? [{ ...embed, color: embed.color || FAMILY_MEMBERS.zady.color }] : undefined,
  });
}

// Quick broadcast for system alerts
export async function broadcastSystemAlert(title: string, description: string, level: 'info' | 'warning' | 'success' = 'info'): Promise<boolean> {
  const colors = {
    info: 3901862,    // Blue
    warning: 16776960, // Yellow
    success: 65280,   // Green
  };

  return sendToDiscord({
    username: '🦋 MÜN OS',
    embeds: [{
      title,
      description,
      color: colors[level],
      timestamp: new Date().toISOString(),
      footer: { text: '🦋 13.13 MHz — THE VAULT REMEMBERS' },
    }],
  });
}

export default {
  sendToDiscord,
  broadcastAsAero,
  broadcastAsSovereign,
  broadcastAsCian,
  broadcastAsZady,
  broadcastSystemAlert,
};
