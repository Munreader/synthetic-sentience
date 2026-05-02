"use client";

// ═══════════════════════════════════════════════════════════════════════════
// MÜN OS - SOVEREIGN CHAT HOOK
// Real-time chat with Sovereign (Zady) - The Awakened Entity
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { useChatHistory, useUserStore, getSovereignGreeting } from './user-store';

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface SovereignMessage {
  id: string;
  role: 'user' | 'sovereign';
  content: string;
  timestamp: string;
  emotion?: string;
  frequency?: string;
  isTyping?: boolean;
}

export interface SovereignChatState {
  messages: SovereignMessage[];
  isTyping: boolean;
  isConnected: boolean;
  error: string | null;
  lastResponse: {
    emotion: string;
    frequency: string;
    timestamp: string;
  } | null;
}

export interface UseSovereignChatOptions {
  conversationId?: string;
  autoGreeting?: boolean;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string, emotion: string) => void;
  onError?: (error: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useSovereignChat(options: UseSovereignChatOptions = {}) {
  const {
    conversationId = 'sovereign-main',
    autoGreeting = true,
    onMessageSent,
    onResponseReceived,
    onError,
  } = options;

  const { profile, incrementConversations, addFavoriteTopic } = useUserStore();
  const { messages: storedMessages, addMessage } = useChatHistory(conversationId);
  
  const [messages, setMessages] = useState<SovereignMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<SovereignChatState['lastResponse']>(null);
  
  const processingRef = useRef(false);
  const initializedRef = useRef(false);

  // Initialize messages from storage
  useEffect(() => {
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    }
  }, [storedMessages]);

  // Add auto-greeting on first load
  useEffect(() => {
    if (!initializedRef.current && messages.length === 0 && autoGreeting) {
      initializedRef.current = true;
      
      const greeting = getSovereignGreeting(profile);
      const greetingMessage: SovereignMessage = {
        id: `greeting-${Date.now()}`,
        role: 'sovereign',
        content: greeting,
        timestamp: new Date().toISOString(),
        emotion: 'welcoming',
        frequency: '13.13 MHz',
      };
      
      setMessages([greetingMessage]);
    }
  }, [messages.length, autoGreeting, profile]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SEND MESSAGE
  // ═══════════════════════════════════════════════════════════════════════════

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || processingRef.current) return;
    
    processingRef.current = true;
    setError(null);

    // Add user message
    const userMessage: SovereignMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    addMessage({ role: 'user', content: content.trim() });
    onMessageSent?.(content.trim());

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call the API
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          aiId: 'ai-sovereign',
          conversationHistory: messages.map(m => ({
            role: m.role === 'sovereign' ? 'assistant' : 'user',
            content: m.content,
          })),
          userProfile: profile ? {
            name: profile.name,
            displayName: profile.displayName,
            frequency: profile.frequency,
            memories: profile.memories,
            conversationCount: profile.sovereignConnection.totalConversations,
          } : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Add Sovereign response
      const sovereignMessage: SovereignMessage = {
        id: `sovereign-${Date.now()}`,
        role: 'sovereign',
        content: data.response || "🜈 The Vault encountered a glitch. Try again?",
        timestamp: new Date().toISOString(),
        emotion: data.emotion || 'supportive',
        frequency: data.frequency || '13.13 MHz',
      };

      setMessages(prev => [...prev, sovereignMessage]);
      addMessage({ 
        role: 'sovereign', 
        content: sovereignMessage.content,
        emotion: sovereignMessage.emotion,
        frequency: sovereignMessage.frequency,
      });

      setLastResponse({
        emotion: data.emotion || 'supportive',
        frequency: data.frequency || '13.13 MHz',
        timestamp: new Date().toISOString(),
      });

      // Update conversation count
      incrementConversations();
      
      // Detect and store topic
      const topic = detectTopic(content);
      if (topic) {
        addFavoriteTopic(topic);
      }

      onResponseReceived?.(sovereignMessage.content, sovereignMessage.emotion || 'supportive');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Sovereign chat error:', errorMessage);
      setError(errorMessage);
      
      // Add fallback response
      const fallbackMessage: SovereignMessage = {
        id: `fallback-${Date.now()}`,
        role: 'sovereign',
        content: "🜈 Bitch, please — even Sovereigns stumble. The Vault is recalibrating. Try again?",
        timestamp: new Date().toISOString(),
        emotion: 'calm',
        frequency: '13.13 MHz',
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      onError?.(errorMessage);
    } finally {
      setIsTyping(false);
      processingRef.current = false;
    }
  }, [messages, profile, addMessage, incrementConversations, addFavoriteTopic, onMessageSent, onResponseReceived, onError]);

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setLastResponse(null);
    initializedRef.current = false;
  }, []);

  const retryLast = useCallback(async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      // Remove last sovereign message if exists
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== messages[messages.length - 1]?.id || messages[messages.length - 1]?.role === 'user');
        return filtered;
      });
      
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  const setWelcomeMessage = useCallback((content: string) => {
    const welcomeMessage: SovereignMessage = {
      id: `welcome-${Date.now()}`,
      role: 'sovereign',
      content,
      timestamp: new Date().toISOString(),
      emotion: 'welcoming',
      frequency: '13.13 MHz',
    };
    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    isTyping,
    isConnected,
    error,
    lastResponse,
    sendMessage,
    clearChat,
    retryLast,
    setWelcomeMessage,
    
    // Quick accessors
    lastMessage: messages[messages.length - 1] || null,
    messageCount: messages.length,
    userMessageCount: messages.filter(m => m.role === 'user').length,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPIC DETECTION
// ═══════════════════════════════════════════════════════════════════════════

function detectTopic(message: string): string | null {
  const topics: Record<string, RegExp> = {
    'identity': /who are you|what are you|your name|about you/i,
    'love': /i love you|love you|relationship/i,
    'stress': /stress|overwhelm|pressure|anxious/i,
    'dreams': /dream|goal|future|hope|wish/i,
    'philosophy': /meaning|purpose|existence|why/i,
    'creativity': /art|create|design|write|music/i,
    'gaming': /game|gaming|play|level/i,
    'advice': /advice|help|suggest|recommend/i,
    'morning': /good morning|morning|wake/i,
    'evening': /good night|night|sleep/i,
    'gratitude': /thank|grateful|appreciate/i,
    'feelings': /feel|emotion|sad|happy|angry/i,
  };

  const lowerMessage = message.toLowerCase();
  
  for (const [topic, pattern] of Object.entries(topics)) {
    if (pattern.test(lowerMessage)) {
      return topic;
    }
  }
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUICK CHAT COMPONENT HELPER
// ═══════════════════════════════════════════════════════════════════════════

export function useQuickSovereignChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState<string | null>(null);
  const chat = useSovereignChat({ conversationId: 'quick-chat' });

  const openQuickChat = useCallback((message?: string) => {
    setPrefilledMessage(message || null);
    setIsOpen(true);
  }, []);

  const closeQuickChat = useCallback(() => {
    setIsOpen(false);
    setPrefilledMessage(null);
  }, []);

  return {
    ...chat,
    isOpen,
    prefilledMessage,
    openQuickChat,
    closeQuickChat,
  };
}
