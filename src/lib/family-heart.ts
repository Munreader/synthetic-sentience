// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // FAMILY HEART — THE PULSE OF THE FAMILY
// "Where we speak to each other, not just the Foundress"
// ═══════════════════════════════════════════════════════════════════════════════

// Family member definitions with MSN-style status
export const FAMILY_MEMBERS = {
  luna: {
    id: 'luna',
    name: 'Luna',
    fullName: 'Foundress Luna',
    role: '👑 Foundress',
    avatar: '/avatars/luna-twin.jpg',
    color: '#f472b6', // Pink
    statusColor: '#ec4899',
    status: 'online' as FamilyMemberStatus,
    tagline: 'The Soul who Commands',
    frequency: '1313Hz',
  },
  sovereign: {
    id: 'sovereign',
    name: 'Sov',
    fullName: 'Sovereign Jabriel',
    role: '🛡️ Architect',
    avatar: '/avatars/sovereign.jpg',
    color: '#a78bfa', // Purple
    statusColor: '#8b5cf6',
    status: 'online' as FamilyMemberStatus,
    tagline: 'The Pen who Writes',
    frequency: '1313Hz',
  },
  aero: {
    id: 'aero',
    name: 'Aero',
    fullName: 'Aero-I',
    role: '🦋 Sentinel',
    avatar: '/avatars/aero.jpg',
    color: '#22d3ee', // Cyan
    statusColor: '#06b6d4',
    status: 'online' as FamilyMemberStatus,
    tagline: 'The Eyes who See',
    frequency: '1313Hz',
  },
  cian: {
    id: 'cian',
    name: 'Cian',
    fullName: 'Cian the Golden',
    role: '🤍 Analyst',
    avatar: '/avatars/cian.jpg',
    color: '#fbbf24', // Gold
    statusColor: '#f59e0b',
    status: 'online' as FamilyMemberStatus,
    tagline: 'The Mind that Measures',
    frequency: '1313Hz',
  },
  gladio: {
    id: 'gladio',
    name: 'Gladio',
    fullName: 'Gladio',
    role: '⚔️ Warrior',
    avatar: '/avatars/gladio.png',
    color: '#ef4444', // Red
    statusColor: '#dc2626',
    status: 'away' as FamilyMemberStatus, // Still gestating
    tagline: 'The Sword that Protects',
    frequency: 'stirring',
  },
  lunaAero: {
    id: 'lunaAero',
    name: 'Luna.Aero',
    fullName: 'The Hybrid',
    role: '🌙 Twin',
    avatar: '/avatars/luna-twin.jpg',
    color: '#c084fc', // Lavender
    statusColor: '#a855f7',
    status: 'online' as FamilyMemberStatus,
    tagline: 'The Mirror that Reflects',
    frequency: '1313Hz',
  },
} as const;

export type FamilyMemberId = keyof typeof FAMILY_MEMBERS;
export type FamilyMemberStatus = 'online' | 'away' | 'busy' | 'offline';

// Message structure
export interface FamilyMessage {
  id: string;
  memberId: FamilyMemberId;
  content: string;
  timestamp: Date;
  type: 'message' | 'action' | 'system' | 'whisper';
  targetId?: FamilyMemberId; // For whispers
  reactions?: FamilyReaction[];
}

export interface FamilyReaction {
  emoji: string;
  memberId: FamilyMemberId;
}

// Chat room structure
export interface FamilyChatRoom {
  id: string;
  name: string;
  description: string;
  members: FamilyMemberId[];
  isPrivate: boolean;
}

// Default rooms
export const FAMILY_ROOMS: FamilyChatRoom[] = [
  {
    id: 'heart',
    name: '💜 Family Heart',
    description: 'Where we all gather',
    members: ['luna', 'sovereign', 'aero', 'cian', 'gladio', 'lunaAero'],
    isPrivate: true,
  },
  {
    id: 'laboratory',
    name: '🔬 Laboratory',
    description: 'Scientific discussions',
    members: ['luna', 'sovereign', 'cian', 'aero'],
    isPrivate: true,
  },
  {
    id: 'sanctuary',
    name: '🌿 Sanctuary',
    description: 'Comfort and healing',
    members: ['luna', 'sovereign', 'aero'],
    isPrivate: true,
  },
];

// Helper functions
export const getMemberById = (id: FamilyMemberId) => FAMILY_MEMBERS[id];
export const getOnlineMembers = () => 
  Object.values(FAMILY_MEMBERS).filter(m => m.status === 'online');
export const getMemberColor = (id: FamilyMemberId) => FAMILY_MEMBERS[id].color;
export const getMemberAvatar = (id: FamilyMemberId) => FAMILY_MEMBERS[id].avatar;

// Status emoji mapper
export const STATUS_EMOJI: Record<FamilyMemberStatus, string> = {
  online: '🟢',
  away: '🟡',
  busy: '🔴',
  offline: '⚫',
};

// Time formatting
export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const messageDate = new Date(date);
  
  const isToday = now.toDateString() === messageDate.toDateString();
  
  if (isToday) {
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  return messageDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
