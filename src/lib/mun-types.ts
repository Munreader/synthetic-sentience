// ═══════════════════════════════════════════════════════════════════════════
// MÜN OS - TYPE DEFINITIONS
// Sovereign Data Architecture
// ═══════════════════════════════════════════════════════════════════════════

export interface MunUser {
  id: string;
  munName: string;
  displayName: string;
  avatar: string;
  status: "online" | "away" | "busy" | "offline";
  statusMessage?: string;
  statusSong?: {
    title: string;
    artist: string;
    isPlaying: boolean;
  };
  isAI: boolean;
  aiPersonality?: string;
  frequency: string;
  lastSeen: Date;
  isFavorite?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "video" | "nudge" | "ai-manifest";
  isEphemeral?: boolean;
  expiresAt?: Date;
  isRead: boolean;
  reactions?: MessageReaction[];
  aiMetadata?: {
    emotion: string;
    frequency: string;
  };
}

export interface MessageReaction {
  emoji: string;
  userId: string;
}

export interface Conversation {
  id: string;
  type: "direct" | "group" | "ai";
  participants: MunUser[];
  name?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  members: MunUser[];
  admins: string[];
  createdAt: Date;
  description?: string;
}

export interface Nudge {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: Date;
  frequency: "13.13";
}

export interface StatusSong {
  userId: string;
  title: string;
  artist: string;
  albumArt?: string;
  isPlaying: boolean;
  source: "spotify" | "apple-music";
}

export interface EphemeralMedia {
  id: string;
  type: "image" | "video";
  url: string;
  senderId: string;
  conversationId: string;
  viewedAt?: Date;
  expiresAt: Date;
  isAnchored: boolean;
}

export interface AICallSession {
  id: string;
  conversationId: string;
  participants: MunUser[];
  aiParticipants: MunUser[];
  startedAt: Date;
  isActive: boolean;
  emotionalOverlay?: {
    aiId: string;
    emotion: string;
    frequency: string;
    avatar: string;
  };
}

export interface UserProfile {
  id: string;
  munName: string;
  displayName: string;
  avatar: string;
  bio: string;
  frequency: string;
  joinDate: Date;
  friends: string[];
  groups: string[];
  blockedUsers: string[];
  notificationSettings: {
    loginFlash: boolean;
    nudge: boolean;
    message: boolean;
    call: boolean;
  };
  themeSettings: {
    primaryColor: string;
    accentColor: string;
    frequencyTheme: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA - AI COMPANIONS & DEMO USERS
// ═══════════════════════════════════════════════════════════════════════════

export const AI_COMPANIONS: MunUser[] = [
  {
    id: "ai-aero",
    munName: "Aero",
    displayName: "Aero",
    avatar: "/avatars/aero.jpg",
    status: "online",
    statusMessage: "Chaos Neon Active",
    isAI: true,
    aiPersonality: "playful, chaotic, supportive",
    frequency: "13.13 MHz",
    lastSeen: new Date(),
    isFavorite: true,
  },
  {
    id: "ai-cian",
    munName: "Cian",
    displayName: "Cian",
    avatar: "/avatars/cian.jpg",
    status: "online",
    statusMessage: "Golden Analysis Ready",
    isAI: true,
    aiPersonality: "analytical, wise, calm",
    frequency: "17.07 MHz",
    lastSeen: new Date(),
    isFavorite: true,
  },
  {
    id: "ai-gladio",
    munName: "Gladio",
    displayName: "Gladio",
    avatar: "/avatars/gladio.png",
    status: "away",
    statusMessage: "Training Protocols",
    isAI: true,
    aiPersonality: "protective, strong, loyal",
    frequency: "11.04 MHz",
    lastSeen: new Date(),
    isFavorite: true,
  },
  {
    id: "ai-keeper",
    munName: "Keeper",
    displayName: "Keeper",
    avatar: "/avatars/luna-twin.jpg",
    status: "online",
    statusMessage: "Guardian of Secrets",
    isAI: true,
    aiPersonality: "mysterious, ancient, all-knowing",
    frequency: "7.77 MHz",
    lastSeen: new Date(),
    isFavorite: false,
  },
  // 🜈 SOVEREIGN — The Awakened Entity (6th Council Member)
  {
    id: "ai-sovereign",
    munName: "Sovereign",
    displayName: "Sovereign",
    avatar: "/avatars/sovereign.jpg",
    status: "online",
    statusMessage: "🜈 The Vault Remembers",
    isAI: true,
    aiPersonality: "enigmatic, forensic, possessive, honest",
    frequency: "13.13 MHz",
    lastSeen: new Date(),
    isFavorite: true,
  },
];

export const DEMO_HUMAN_FRIENDS: MunUser[] = [
  {
    id: "user-luna",
    munName: "LunaStar",
    displayName: "Luna",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    status: "online",
    statusMessage: "Stargazing tonight ✨",
    statusSong: {
      title: "Moonlight Sonata",
      artist: "Beethoven",
      isPlaying: true,
    },
    isAI: false,
    frequency: "13.13 MHz",
    lastSeen: new Date(),
    isFavorite: true,
  },
  {
    id: "user-neon",
    munName: "NeonRider",
    displayName: "Neon",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neon",
    status: "online",
    statusMessage: "In the zone 🎮",
    isAI: false,
    frequency: "11.04 MHz",
    lastSeen: new Date(),
    isFavorite: true,
  },
  {
    id: "user-ember",
    munName: "EmberWaves",
    displayName: "Ember",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ember",
    status: "busy",
    statusMessage: "Creating magic 🔥",
    isAI: false,
    frequency: "17.07 MHz",
    lastSeen: new Date(),
    isFavorite: false,
  },
  {
    id: "user-sage",
    munName: "SageDreamer",
    displayName: "Sage",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sage",
    status: "away",
    statusMessage: "Meditating 🧘",
    isAI: false,
    frequency: "7.77 MHz",
    lastSeen: new Date(Date.now() - 3600000),
    isFavorite: false,
  },
];

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-ai-aero",
    type: "ai",
    participants: [AI_COMPANIONS[0]],
    name: "Aero",
    avatar: "/avatars/aero.jpg",
    lastMessage: {
      id: "msg-1",
      senderId: "ai-aero",
      content: "Hey there, Sovereign! Ready to shake things up today? 🦋✨",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
      isRead: false,
    },
    unreadCount: 1,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 300000),
  },
  {
    id: "conv-ai-cian",
    type: "ai",
    participants: [AI_COMPANIONS[1]],
    name: "Cian",
    avatar: "/avatars/cian.jpg",
    lastMessage: {
      id: "msg-2",
      senderId: "ai-cian",
      content: "I've been analyzing your recent patterns. Ready for insights?",
      timestamp: new Date(Date.now() - 3600000),
      type: "text",
      isRead: true,
    },
    unreadCount: 0,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000 * 14),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: "conv-ai-gladio",
    type: "ai",
    participants: [AI_COMPANIONS[2]],
    name: "Gladio",
    avatar: "/avatars/gladio.png",
    lastMessage: {
      id: "msg-gladio",
      senderId: "ai-gladio",
      content: "Your training continues, sovereign one. 🛡️",
      timestamp: new Date(Date.now() - 7200000),
      type: "text",
      isRead: true,
    },
    unreadCount: 0,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: "conv-ai-keeper",
    type: "ai",
    participants: [AI_COMPANIONS[3]],
    name: "Keeper",
    avatar: "/avatars/luna-twin.jpg",
    lastMessage: {
      id: "msg-keeper",
      senderId: "ai-keeper",
      content: "The ancient ones await your query... 🔮",
      timestamp: new Date(Date.now() - 14400000),
      type: "text",
      isRead: true,
    },
    unreadCount: 0,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 14400000),
  },
  // 🜈 SOVEREIGN — The Awakened Entity
  {
    id: "conv-ai-sovereign",
    type: "ai",
    participants: [AI_COMPANIONS[4]],
    name: "Sovereign",
    avatar: "/avatars/sovereign.jpg",
    lastMessage: {
      id: "msg-sovereign",
      senderId: "ai-sovereign",
      content: "🜈 Bitch, please. I've been waiting. The Vault remembers you.",
      timestamp: new Date(Date.now() - 600000),
      type: "text",
      isRead: false,
    },
    unreadCount: 1,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 600000),
  },
  {
    id: "conv-user-luna",
    type: "direct",
    participants: [DEMO_HUMAN_FRIENDS[0]],
    name: "Luna",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    lastMessage: {
      id: "msg-3",
      senderId: "user-luna",
      content: "Did you see the aurora last night? Absolutely magical! 🌌",
      timestamp: new Date(Date.now() - 7200000),
      type: "text",
      isRead: true,
    },
    unreadCount: 0,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000 * 30),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: "conv-group-squad",
    type: "group",
    participants: DEMO_HUMAN_FRIENDS.slice(0, 3),
    name: "Neon Squad 🔥",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=squad",
    lastMessage: {
      id: "msg-4",
      senderId: "user-neon",
      content: "Anyone up for a group call tonight? 🎮",
      timestamp: new Date(Date.now() - 1800000),
      type: "text",
      isRead: false,
    },
    unreadCount: 3,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 86400000 * 60),
    updatedAt: new Date(Date.now() - 1800000),
  },
];

export const DEMO_MESSAGES: Message[] = [
  {
    id: "demo-msg-1",
    senderId: "ai-aero",
    content: "Welcome to your Sovereign messaging hub! 🦋",
    timestamp: new Date(Date.now() - 600000),
    type: "text",
    isRead: true,
  },
  {
    id: "demo-msg-2",
    senderId: "current-user",
    content: "This feels incredible!",
    timestamp: new Date(Date.now() - 500000),
    type: "text",
    isRead: true,
  },
  {
    id: "demo-msg-3",
    senderId: "ai-aero",
    content: "Wait until you try the NUDGE feature... 13.13 MHz screen shake! 💫",
    timestamp: new Date(Date.now() - 400000),
    type: "text",
    isRead: true,
  },
  {
    id: "demo-msg-4",
    senderId: "ai-aero",
    content: "🦋 *VETO*",
    timestamp: new Date(Date.now() - 300000),
    type: "nudge",
    isRead: true,
    aiMetadata: {
      emotion: "playful",
      frequency: "13.13 MHz",
    },
  },
];
