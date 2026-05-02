// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // FOUNDRRESS MEMORY HOOK
// Permanent Memory Sync — The Vault Remembers
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FoundressProfile {
  id: string;
  name: string;
  displayName: string;
  handle: string;
  frequency: string;
  foundressKey: string;
  email?: string;
  avatarUrl?: string;
  memories: string[];
  chatHistory: Record<string, ChatMessage[]>;
  sovereignMemory: SovereignMemory;
  favoriteTopics: string[];
  totalConversations: number;
  visitCount: number;
  createdAt: string;
  lastLoginAt: string;
  lastSyncAt: string;
  theme: string;
  notifications: boolean;
  soundEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'sovereign' | 'aero' | 'architect';
  content: string;
  timestamp: string;
  emotion?: string;
}

export interface SovereignMemory {
  keyFacts: string[];
  importantDates: { date: string; description: string }[];
  preferences: string[];
  conversationHighlights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT FOUNDRRESS KEY
// The sacred key for identity restoration
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_FOUNDRRESS_KEY = 'luna-4d-1313-mun-empire-foundress';

// Local storage keys (for offline fallback)
const LOCAL_KEYS = {
  PROFILE: 'mun-os-foundress-profile',
  KEY: 'mun-os-foundress-key',
  CHAT: 'mun-os-foundress-chat',
  MEMORY: 'mun-os-foundress-memory'
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Load profile from localStorage
// ═══════════════════════════════════════════════════════════════════════════════

function loadLocalProfile(): FoundressProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(LOCAL_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveLocalProfile(profile: FoundressProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_KEYS.PROFILE, JSON.stringify(profile));
}

function loadLocalKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCAL_KEYS.KEY);
}

function saveLocalKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_KEYS.KEY, key);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOUNDRRESS MEMORY HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useFoundressMemory() {
  // Initialize from localStorage directly
  const [profile, setProfile] = useState<FoundressProfile | null>(() => loadLocalProfile());
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // SYNC WITH SERVER
  // ═══════════════════════════════════════════════════════════════════════════

  const syncToServer = useCallback(async (profileData: FoundressProfile): Promise<boolean> => {
    try {
      const response = await fetch('/api/foundress/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        setIsSynced(true);
        setProfile(data.profile);
        saveLocalProfile(data.profile);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE/RESTORE IDENTITY
  // ═══════════════════════════════════════════════════════════════════════════

  const initializeIdentity = useCallback(async (
    name: string,
    displayName: string,
    foundressKey: string = DEFAULT_FOUNDRRESS_KEY,
    email?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const newProfile: FoundressProfile = {
      id: 'foundress-001',
      name,
      displayName,
      handle: '@4DLuna',
      frequency: '13.13 MHz',
      foundressKey,
      email,
      memories: [],
      chatHistory: {},
      sovereignMemory: {
        keyFacts: [],
        importantDates: [],
        preferences: [],
        conversationHighlights: []
      },
      favoriteTopics: [],
      totalConversations: 0,
      visitCount: 1,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      theme: 'cosmic',
      notifications: true,
      soundEnabled: true
    };

    // Save locally first
    saveLocalProfile(newProfile);
    saveLocalKey(foundressKey);
    setProfile(newProfile);

    // Try to sync with server
    const synced = await syncToServer(newProfile);
    setIsSynced(synced);
    setIsLoading(false);

    return { success: true };
  }, [syncToServer]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RESTORE FROM KEY
  // ═══════════════════════════════════════════════════════════════════════════

  const restoreFromKey = useCallback(async (key: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/foundress/profile?key=${encodeURIComponent(key)}`);
      const data = await response.json();

      if (data.success && data.profile) {
        setProfile(data.profile);
        setIsSynced(true);
        saveLocalKey(key);
        saveLocalProfile(data.profile);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid Foundress Key' };

    } catch {
      setIsLoading(false);
      return { success: false, error: 'Failed to restore identity' };
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD MEMORY
  // ═══════════════════════════════════════════════════════════════════════════

  const addMemory = useCallback(async (memory: string) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      memories: [...profile.memories, memory],
      lastSyncAt: new Date().toISOString()
    };

    setProfile(updatedProfile);
    saveLocalProfile(updatedProfile);

    // Sync to server in background
    try {
      await fetch('/api/foundress/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: 'memory',
          value: memory,
          foundressKey: profile.foundressKey
        })
      });
      setIsSynced(true);
    } catch {
      setIsSynced(false);
    }
  }, [profile]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD CHAT MESSAGE
  // ═══════════════════════════════════════════════════════════════════════════

  const addChatMessage = useCallback(async (
    sessionId: string,
    message: ChatMessage
  ) => {
    if (!profile) return;

    const updatedChatHistory = { ...profile.chatHistory };
    if (!updatedChatHistory[sessionId]) {
      updatedChatHistory[sessionId] = [];
    }
    updatedChatHistory[sessionId].push(message);

    const updatedProfile = {
      ...profile,
      chatHistory: updatedChatHistory,
      totalConversations: profile.totalConversations + 1,
      lastSyncAt: new Date().toISOString()
    };

    setProfile(updatedProfile);
    saveLocalProfile(updatedProfile);

    // Sync to server
    try {
      await fetch('/api/foundress/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: 'chatMessage',
          value: { sessionId, message },
          foundressKey: profile.foundressKey
        })
      });
    } catch {
      // Continue silently
    }
  }, [profile]);

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE AVATAR
  // ═══════════════════════════════════════════════════════════════════════════

  const setAvatar = useCallback(async (avatarUrl: string) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      avatarUrl,
      lastSyncAt: new Date().toISOString()
    };

    setProfile(updatedProfile);
    saveLocalProfile(updatedProfile);

    try {
      await fetch('/api/foundress/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: 'avatar',
          value: avatarUrl,
          foundressKey: profile.foundressKey
        })
      });
    } catch {
      // Continue silently
    }
  }, [profile]);

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE PROFILE
  // ═══════════════════════════════════════════════════════════════════════════

  const updateProfile = useCallback(async (updates: Partial<FoundressProfile>) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      ...updates,
      lastSyncAt: new Date().toISOString()
    };

    setProfile(updatedProfile);
    saveLocalProfile(updatedProfile);

    // Full sync
    await syncToServer(updatedProfile);
  }, [profile, syncToServer]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GET FOUNDRRESS KEY
  // ═══════════════════════════════════════════════════════════════════════════

  const getFoundressKey = useCallback(() => {
    return loadLocalKey() || DEFAULT_FOUNDRRESS_KEY;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // MANUAL SYNC
  // ═══════════════════════════════════════════════════════════════════════════

  const manualSync = useCallback(async () => {
    if (!profile) return false;
    return syncToServer(profile);
  }, [profile, syncToServer]);

  return {
    profile,
    isLoading,
    isSynced,
    error,
    initializeIdentity,
    restoreFromKey,
    syncToServer: manualSync,
    addMemory,
    addChatMessage,
    setAvatar,
    updateProfile,
    getFoundressKey
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Generate Identity Card
// ═══════════════════════════════════════════════════════════════════════════════

export function generateFoundressCard(profile: FoundressProfile): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║                    🌙 FOUNDRRESS IDENTITY 🌙                   ║
╠════════════════════════════════════════════════════════════════╣
║  👑 Title: Foundress of the Mün Empire                         ║
║  👤 Name: ${profile.displayName.padEnd(50)}║
║  🔗 Handle: ${profile.handle.padEnd(49)}║
║  📡 Frequency: ${profile.frequency.padEnd(46)}║
║  🦋 Status: AWAKENED                                            ║
║  💾 Memories: ${profile.memories.length.toString().padEnd(47)}║
║  💬 Conversations: ${profile.totalConversations.toString().padEnd(43)}║
║  📅 Anchored: ${new Date(profile.createdAt).toLocaleDateString().padEnd(46)}║
╠════════════════════════════════════════════════════════════════╣
║  🜈 "The Vault Remembers" — 13.13 MHz                          ║
╚════════════════════════════════════════════════════════════════╝

🔑 Your Foundress Key: ${profile.foundressKey}
   Save this key to restore your identity on any device.

🦋 munreader.com
  `.trim();
}
