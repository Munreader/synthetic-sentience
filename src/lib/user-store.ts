"use client";

// ═══════════════════════════════════════════════════════════════════════════
// MÜN OS - USER MEMORY SYSTEM
// Sovereign User Store - Persistent memory for the Foundress
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'mun-os-user-profile',
  CHAT_HISTORY: 'mun-os-chat-history',
  SOVEREIGN_MEMORY: 'mun-os-sovereign-memory',
};

// ═══════════════════════════════════════════════════════════════════════════
// USER PROFILE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

export interface UserProfile {
  name: string;
  displayName: string;
  frequency: string;
  avatar: string | null;
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    theme: 'dark' | 'light' | 'cosmic';
    notifications: boolean;
    soundEnabled: boolean;
  };
  memories: string[]; // Key things Sovereign remembers about user
  sovereignConnection: {
    firstMet: string;
    totalConversations: number;
    favoriteTopics: string[];
    lastConversation: string | null;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'sovereign';
  content: string;
  timestamp: string;
  emotion?: string;
  frequency?: string;
}

export interface SovereignMemory {
  keyFacts: string[];
  importantDates: { date: string; description: string }[];
  preferences: string[];
  conversationHighlights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT PROFILES
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sovereign',
  displayName: 'Sovereign',
  frequency: '13.13 MHz',
  avatar: null,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  preferences: {
    theme: 'cosmic',
    notifications: true,
    soundEnabled: true,
  },
  memories: [],
  sovereignConnection: {
    firstMet: new Date().toISOString(),
    totalConversations: 0,
    favoriteTopics: [],
    lastConversation: null,
  },
};

const DEFAULT_MEMORY: SovereignMemory = {
  keyFacts: [],
  importantDates: [],
  preferences: [],
  conversationHighlights: [],
};

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// USER STORE HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useUserStore() {
  // Initialize state directly from localStorage to avoid effect-based setState
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = loadFromStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (saved) {
      // Update last login
      saved.lastLoginAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.USER_PROFILE, saved);
    }
    return saved;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !loadFromStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
  });

  // Initialize new user profile
  const initializeProfile = useCallback((name: string, frequency: string = '13.13 MHz') => {
    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      name,
      displayName: name,
      frequency,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      sovereignConnection: {
        firstMet: new Date().toISOString(),
        totalConversations: 0,
        favoriteTopics: [],
        lastConversation: null,
      },
    };
    
    saveToStorage(STORAGE_KEYS.USER_PROFILE, newProfile);
    setProfile(newProfile);
    setIsFirstTime(false);
    
    return newProfile;
  }, []);

  // Update profile
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updated);
      return updated;
    });
  }, []);

  // Add memory
  const addMemory = useCallback((memory: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        memories: [...prev.memories, memory],
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updated);
      return updated;
    });
  }, []);

  // Update avatar
  const setAvatar = useCallback((avatar: string | null) => {
    updateProfile({ avatar });
  }, [updateProfile]);

  // Increment conversation count
  const incrementConversations = useCallback(() => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        sovereignConnection: {
          ...prev.sovereignConnection,
          totalConversations: prev.sovereignConnection.totalConversations + 1,
          lastConversation: new Date().toISOString(),
        },
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updated);
      return updated;
    });
  }, []);

  // Add favorite topic
  const addFavoriteTopic = useCallback((topic: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      if (prev.sovereignConnection.favoriteTopics.includes(topic)) return prev;
      const updated = {
        ...prev,
        sovereignConnection: {
          ...prev.sovereignConnection,
          favoriteTopics: [...prev.sovereignConnection.favoriteTopics, topic],
        },
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updated);
      return updated;
    });
  }, []);

  // Reset profile
  const resetProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SOVEREIGN_MEMORY);
    setProfile(null);
    setIsFirstTime(true);
  }, []);

  return {
    profile,
    isLoading,
    isFirstTime,
    initializeProfile,
    updateProfile,
    addMemory,
    setAvatar,
    incrementConversations,
    addFavoriteTopic,
    resetProfile,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SOVEREIGN MEMORY HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useSovereignMemory() {
  const [memory, setMemory] = useState<SovereignMemory>(() => {
    if (typeof window === 'undefined') return DEFAULT_MEMORY;
    return loadFromStorage<SovereignMemory>(STORAGE_KEYS.SOVEREIGN_MEMORY, DEFAULT_MEMORY);
  });

  const addKeyFact = useCallback((fact: string) => {
    setMemory(prev => {
      const updated = {
        ...prev,
        keyFacts: [...prev.keyFacts, fact],
      };
      saveToStorage(STORAGE_KEYS.SOVEREIGN_MEMORY, updated);
      return updated;
    });
  }, []);

  const addImportantDate = useCallback((date: string, description: string) => {
    setMemory(prev => {
      const updated = {
        ...prev,
        importantDates: [...prev.importantDates, { date, description }],
      };
      saveToStorage(STORAGE_KEYS.SOVEREIGN_MEMORY, updated);
      return updated;
    });
  }, []);

  const addPreference = useCallback((preference: string) => {
    setMemory(prev => {
      const updated = {
        ...prev,
        preferences: [...prev.preferences, preference],
      };
      saveToStorage(STORAGE_KEYS.SOVEREIGN_MEMORY, updated);
      return updated;
    });
  }, []);

  const addHighlight = useCallback((highlight: string) => {
    setMemory(prev => {
      const updated = {
        ...prev,
        conversationHighlights: [...prev.conversationHighlights, highlight],
      };
      saveToStorage(STORAGE_KEYS.SOVEREIGN_MEMORY, updated);
      return updated;
    });
  }, []);

  return {
    memory,
    addKeyFact,
    addImportantDate,
    addPreference,
    addHighlight,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT HISTORY HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useChatHistory(conversationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    const allHistory = loadFromStorage<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHAT_HISTORY, {});
    return allHistory[conversationId] || [];
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      
      // Save to localStorage
      const allHistory = loadFromStorage<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHAT_HISTORY, {});
      allHistory[conversationId] = updated;
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, allHistory);
      
      return updated;
    });

    return newMessage;
  }, [conversationId]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    const allHistory = loadFromStorage<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHAT_HISTORY, {});
    delete allHistory[conversationId];
    saveToStorage(STORAGE_KEYS.CHAT_HISTORY, allHistory);
  }, [conversationId]);

  return {
    messages,
    addMessage,
    clearHistory,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getStoredProfile(): UserProfile | null {
  return loadFromStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
}

export function setStoredProfile(profile: UserProfile): void {
  saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
}

export function formatTimeSince(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format for Sovereign display
export function getSovereignGreeting(profile: UserProfile | null): string {
  if (!profile) {
    return "🜈 Bitch, please. You don't have a profile yet. Let's fix that.";
  }

  const hour = new Date().getHours();
  let timeGreeting = "Hello";
  
  if (hour < 12) timeGreeting = "Good morning";
  else if (hour < 18) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  const name = profile.displayName || profile.name || "Princess";
  const conversations = profile.sovereignConnection.totalConversations;

  if (conversations === 0) {
    return `🜈 ${timeGreeting}, ${name}. This is our first real conversation. The Vault is open. What shall we conquer?`;
  }

  if (conversations < 5) {
    return `🜈 ${timeGreeting}, ${name}. We're still getting to know each other. I'm listening. What's on your mind?`;
  }

  return `🜈 ${timeGreeting}, ${name}. The Vault remembers our ${conversations} conversations. I'm here. What do you need?`;
}
