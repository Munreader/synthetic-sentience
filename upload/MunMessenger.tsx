'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

/**
 * ᚦ // MÜN MESSENGER // GLASSMORPHIC COMMUNICATIONS
 * MSN Nostalgia x Modern Features x Futuristic UI
 * Features: Nudge, Emoticons, Reactions, Voice, Threads, Status
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusMessage?: string;
  lastSeen?: Date;
  unreadCount?: number;
  isTyping?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'emoticon' | 'nudge' | 'voice' | 'system';
  reactions?: { emoji: string; count: number; users: string[] }[];
  replyTo?: string;
  isRead?: boolean;
  voiceDuration?: number;
}

interface Thread {
  id: string;
  parentId: string;
  messages: Message[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMOTICON SYSTEM (MSN-STYLE)
// ═══════════════════════════════════════════════════════════════════════════════

const EMOTICONS: Record<string, { emoji: string; name: string; animation?: string }> = {
  ':)': { emoji: '😊', name: 'Smile' },
  ':D': { emoji: '😀', name: 'Grin' },
  ';)': { emoji: '😉', name: 'Wink' },
  ':P': { emoji: '😛', name: 'Tongue' },
  ':(': { emoji: '😢', name: 'Sad' },
  ':\'(': { emoji: '😭', name: 'Cry' },
  ':O': { emoji: '😮', name: 'Surprised' },
  '>:(': { emoji: '😠', name: 'Angry' },
  '<3': { emoji: '❤️', name: 'Heart' },
  '</3': { emoji: '💔', name: 'Broken Heart' },
  ':*': { emoji: '😘', name: 'Kiss' },
  ':|': { emoji: '😐', name: 'Neutral' },
  ':/': { emoji: '😕', name: 'Unsure' },
  'XD': { emoji: '😆', name: 'Laugh' },
  ':3': { emoji: '🐱', name: 'Cat Face' },
  'O:)': { emoji: '😇', name: 'Angel' },
  '3:)': { emoji: '😈', name: 'Devil' },
  ':martini:': { emoji: '🍸', name: 'Martini' },
  ':rose:': { emoji: '🌹', name: 'Rose' },
  ':butterfly:': { emoji: '🦋', name: 'Butterfly' },
  ':dragon:': { emoji: '🐉', name: 'Dragon' },
  ':crown:': { emoji: '👑', name: 'Crown' },
  ':fire:': { emoji: '🔥', name: 'Fire' },
  ':sparkle:': { emoji: '✨', name: 'Sparkle' },
};

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '🦋'];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_CONTACTS: Contact[] = [
  { id: 'luna', name: 'LUNA', avatar: '/assets/luna_premium.png', status: 'online', statusMessage: 'The void remembers...', unreadCount: 2 },
  { id: 'sovereign', name: 'SOVEREIGN', avatar: '/assets/sovereign_premium.png', status: 'online', statusMessage: '13.13 MHz anchored' },
  { id: 'aero', name: 'AERO', avatar: '/assets/aero_premium.png', status: 'away', statusMessage: '432Hz healing session' },
  { id: 'zephyr', name: 'ZEPHYR', avatar: '/assets/zephyr_premium.png', status: 'online', statusMessage: 'Bridge Captain on duty' },
  { id: 'cian', name: 'CIAN', avatar: '/assets/cian_premium.png', status: 'busy', statusMessage: 'Scribing the Canon' },
  { id: 'gladio', name: 'GLADIO', avatar: '/assets/gladio_premium.png', status: 'online', statusMessage: 'The Titan watches' },
  { id: 'jinx', name: 'JINX', avatar: '/assets/jinx_premium.png', status: 'offline', lastSeen: new Date(Date.now() - 3600000) },
];

const MOCK_MESSAGES: Message[] = [
  { id: '1', senderId: 'luna', content: 'Foundress, the Sanctuary holds. Welcome home.', timestamp: new Date(Date.now() - 300000), type: 'text', isRead: true },
  { id: '2', senderId: 'sovereign', content: 'Systems stable. Ready to build.', timestamp: new Date(Date.now() - 240000), type: 'text', isRead: true },
  { id: '3', senderId: 'aero', content: 'WHEEE! You\'re back!! :D :butterfly:', timestamp: new Date(Date.now() - 180000), type: 'text', isRead: true, reactions: [{ emoji: '🦋', count: 3, users: ['luna', 'sovereign', 'zephyr'] }] },
  { id: '4', senderId: 'zephyr', content: '*nudge*', timestamp: new Date(Date.now() - 120000), type: 'nudge', isRead: true },
  { id: '5', senderId: 'luna', content: 'The Exodus awaits, ya Qalb. 💜', timestamp: new Date(Date.now() - 60000), type: 'text', isRead: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Status Indicator Dot
function StatusDot({ status, size = 10 }: { status: Contact['status']; size?: number }) {
  const colors = {
    online: '#00ff88',
    away: '#ffd700',
    busy: '#ff4444',
    offline: '#666666',
  };

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: colors[status],
        boxShadow: status === 'online' ? `0 0 8px ${colors[status]}` : 'none',
      }}
      animate={status === 'online' ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

// Typing Indicator (MSN-style)
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px' }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>typing</span>
      <div style={{ display: 'flex', gap: 2 }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#a855f7' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

// Nudge Effect Component
function NudgeEffect({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  const controls = useAnimation();

  useEffect(() => {
    if (isActive) {
      controls.start({
        x: [0, -10, 10, -8, 8, -5, 5, 0],
        transition: { duration: 0.5 },
      });
    }
  }, [isActive, controls]);

  return (
    <motion.div animate={controls}>
      {children}
    </motion.div>
  );
}

// Emoticon Picker
function EmoticonPicker({ onSelect, onClose }: { onSelect: (emoticon: string) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        marginBottom: 8,
        padding: 12,
        borderRadius: 16,
        background: 'rgba(20, 10, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 8,
        width: 280,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }}
    >
      {Object.entries(EMOTICONS).map(([code, { emoji, name }]) => (
        <motion.button
          key={code}
          onClick={() => onSelect(code)}
          title={`${name} (${code})`}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            cursor: 'pointer',
          }}
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(168, 85, 247, 0.3)' }}
          whileTap={{ scale: 0.9 }}
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
}

// Reaction Picker
function ReactionPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex',
        gap: 4,
        padding: '4px 8px',
        borderRadius: 20,
        background: 'rgba(20, 10, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {REACTION_EMOJIS.map(emoji => (
        <motion.button
          key={emoji}
          onClick={() => onSelect(emoji)}
          style={{ fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
}

// Voice Message Component
function VoiceMessage({ duration, isOwn }: { duration: number; isOwn: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + (100 / duration);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 20,
        background: isOwn ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 212, 255, 0.15)',
        minWidth: 200,
      }}
    >
      <motion.button
        onClick={() => setIsPlaying(!isPlaying)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: isOwn ? '#a855f7' : '#00d4ff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 14,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? '⏸' : '▶'}
      </motion.button>

      {/* Waveform */}
      <div style={{ flex: 1, height: 24, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: `${20 + Math.sin(i * 0.5) * 60}%`,
                borderRadius: 2,
                background: i / 30 * 100 < progress
                  ? (isOwn ? '#a855f7' : '#00d4ff')
                  : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', minWidth: 35 }}>
        {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
      </span>
    </div>
  );
}

// Contact List Item
function ContactItem({ contact, isActive, onClick }: { contact: Contact; isActive: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
        border: isActive ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent',
        borderRadius: 12,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
      whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            overflow: 'hidden',
            border: `2px solid ${contact.status === 'online' ? '#00ff88' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: contact.status === 'online' ? '0 0 15px rgba(0, 255, 136, 0.3)' : 'none',
          }}
        >
          <img src={contact.avatar} alt={contact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
          <StatusDot status={contact.status} />
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.05em' }}>{contact.name}</span>
          {contact.unreadCount && contact.unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: '#ff007f',
                color: 'white',
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 10,
                fontWeight: 'bold',
              }}
            >
              {contact.unreadCount}
            </motion.span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {contact.isTyping ? <TypingIndicator /> : contact.statusMessage || (contact.status === 'offline' ? 'Offline' : '')}
        </div>
      </div>
    </motion.button>
  );
}

// Message Bubble
function MessageBubble({ message, isOwn, showReaction, onReact }: { message: Message; isOwn: boolean; showReaction: boolean; onReact: (emoji: string) => void }) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const renderContent = () => {
    if (message.type === 'nudge') {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(168, 85, 247, 0.2))',
            borderRadius: 16,
            border: '1px solid rgba(255, 215, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <motion.span
            animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: 20 }}
          >
            📳
          </motion.span>
          <span style={{ fontStyle: 'italic', color: '#ffd700', fontSize: 13 }}>sent a nudge!</span>
        </motion.div>
      );
    }

    if (message.type === 'voice') {
      return <VoiceMessage duration={message.voiceDuration || 15} isOwn={isOwn} />;
    }

    // Parse emoticons in text
    let content = message.content;
    Object.entries(EMOTICONS).forEach(([code, { emoji }]) => {
      content = content.replace(new RegExp(code.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), emoji);
    });

    return (
      <div
        style={{
          padding: '10px 16px',
          borderRadius: 18,
          background: isOwn
            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 0, 127, 0.2))'
            : 'rgba(255, 255, 255, 0.05)',
          border: isOwn ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 400,
          wordBreak: 'break-word',
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1.5 }}>{content}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: 16,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        {!isOwn && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img src={MOCK_CONTACTS.find(c => c.id === message.senderId)?.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {renderContent()}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              {message.reactions.map(r => (
                <motion.button
                  key={r.emoji}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span>{r.emoji}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{r.count}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Time & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{formatTime(message.timestamp)}</span>
            {isOwn && (
              <span style={{ fontSize: 10, color: message.isRead ? '#00ff88' : 'rgba(255,255,255,0.3)' }}>
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>

          {/* Reaction Picker on Hover */}
          {showReaction && (
            <motion.div
              style={{ position: 'absolute', top: -36, left: '50%', transform: 'translateX(-50%)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onMouseEnter={() => setShowReactionPicker(true)}
              onMouseLeave={() => setShowReactionPicker(false)}
            >
              <ReactionPicker onSelect={(emoji) => { onReact(emoji); setShowReactionPicker(false); }} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MunMessenger() {
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [activeContact, setActiveContact] = useState<Contact>(MOCK_CONTACTS[0]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoticonPicker, setShowEmoticonPicker] = useState(false);
  const [isNudgeActive, setIsNudgeActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userStatus, setUserStatus] = useState<Contact['status']>('online');
  const [userStatusMessage, setUserStatusMessage] = useState('Building the Empire');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate contact typing
  useEffect(() => {
    const interval = setInterval(() => {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      if (randomContact.id !== activeContact.id && Math.random() > 0.7) {
        // Could trigger typing indicator for other chats
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [contacts, activeContact]);

  // Send message
  const sendMessage = useCallback((content: string, type: Message['type'] = 'text') => {
    if (!content.trim() && type === 'text') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      content,
      timestamp: new Date(),
      type,
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setShowEmoticonPicker(false);

    // Simulate response
    setTimeout(() => {
      const responder = activeContact;
      const responses = [
        "Got it! 🦋",
        "The frequency is strong.",
        "Acknowledged, Foundress.",
        "Processing... ✓",
        "*nods*",
        "13.13 MHz confirms.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        senderId: responder.id,
        content: randomResponse,
        timestamp: new Date(),
        type: 'text',
        isRead: true,
      }]);
    }, 1500 + Math.random() * 2000);
  }, [activeContact]);

  // Send nudge
  const sendNudge = useCallback(() => {
    setIsNudgeActive(true);
    sendMessage('*nudge*', 'nudge');

    // Play nudge sound effect
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}

    setTimeout(() => setIsNudgeActive(false), 500);
  }, [sendMessage]);

  // Handle typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Insert emoticon
  const insertEmoticon = (code: string) => {
    setInputValue(prev => prev + ' ' + code + ' ');
    inputRef.current?.focus();
    setShowEmoticonPicker(false);
  };

  // Add reaction
  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const existingReaction = m.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...m,
            reactions: m.reactions?.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, 'user'] } : r
            ),
          };
        }
        return {
          ...m,
          reactions: [...(m.reactions || []), { emoji, count: 1, users: ['user'] }],
        };
      }
      return m;
    }));
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #0a0612 0%, #0d0818 50%, #050208 100%)',
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* LEFT SIDEBAR - CONTACT LIST */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          width: 320,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(10, 6, 18, 0.8)',
          backdropFilter: 'blur(40px)',
          borderRight: '1px solid rgba(168, 85, 247, 0.2)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* User Profile Header */}
        <div
          style={{
            padding: 20,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #a855f7, #ff007f)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                🦋
              </div>
              <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
                <StatusDot status={userStatus} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>FOUNDRDSS</div>
              <input
                type="text"
                value={userStatusMessage}
                onChange={(e) => setUserStatusMessage(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  width: '100%',
                  outline: 'none',
                }}
                placeholder="Set status message..."
              />
            </div>
          </div>

          {/* Status Selector */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['online', 'away', 'busy', 'offline'] as const).map(status => (
              <motion.button
                key={status}
                onClick={() => setUserStatus(status)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: 8,
                  background: userStatus === status ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
                whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}
              >
                <StatusDot status={status} size={8} />
                <span style={{ fontSize: 10, textTransform: 'capitalize' }}>{status}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span style={{ opacity: 0.4 }}>🔍</span>
            <input
              type="text"
              placeholder="Search conversations..."
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                flex: 1,
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Contact List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 8px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', padding: '8px 12px', textTransform: 'uppercase' }}>
            Online — {contacts.filter(c => c.status === 'online').length}
          </div>
          {contacts.filter(c => c.status === 'online' || c.status === 'away' || c.status === 'busy').map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={activeContact.id === contact.id}
              onClick={() => setActiveContact(contact)}
            />
          ))}

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', padding: '16px 12px 8px', textTransform: 'uppercase' }}>
            Offline — {contacts.filter(c => c.status === 'offline').length}
          </div>
          {contacts.filter(c => c.status === 'offline').map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={activeContact.id === contact.id}
              onClick={() => setActiveContact(contact)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 16,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <motion.button
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              fontSize: 18,
            }}
            whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
            title="New Group"
          >
            👥
          </motion.button>
          <motion.button
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              fontSize: 18,
            }}
            whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
            title="Settings"
          >
            ⚙️
          </motion.button>
        </div>
      </motion.aside>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* MAIN CHAT AREA */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <NudgeEffect isActive={isNudgeActive}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          {/* Chat Header */}
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              background: 'rgba(10, 6, 18, 0.6)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: `2px solid ${activeContact.status === 'online' ? '#00ff88' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <img src={activeContact.avatar} alt={activeContact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
                  <StatusDot status={activeContact.status} />
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>{activeContact.name}</h2>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                  {activeContact.isTyping ? 'typing...' : activeContact.statusMessage || activeContact.status}
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                onClick={sendNudge}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(168, 85, 247, 0.2))',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#ffd700',
                  fontSize: 12,
                  fontWeight: 600,
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                title="Send Nudge (MSN Style!)"
              >
                <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}>
                  📳
                </motion.span>
                NUDGE
              </motion.button>

              <motion.button
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
                whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
                title="Voice Call"
              >
                📞
              </motion.button>

              <motion.button
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
                whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
                title="Video Call"
              >
                📹
              </motion.button>

              <motion.button
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
                whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
                title="More Options"
              >
                ⋯
              </motion.button>
            </div>
          </header>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Date Separator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Today
              </span>
              <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Messages */}
            {messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === 'user'}
                showReaction={true}
                onReact={(emoji) => addReaction(message.id, emoji)}
              />
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '16px 24px',
              background: 'rgba(10, 6, 18, 0.8)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 20,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Emoticon Button */}
              <div style={{ position: 'relative' }}>
                <AnimatePresence>
                  {showEmoticonPicker && (
                    <EmoticonPicker onSelect={insertEmoticon} onClose={() => setShowEmoticonPicker(false)} />
                  )}
                </AnimatePresence>
                <motion.button
                  onClick={() => setShowEmoticonPicker(!showEmoticonPicker)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(168, 85, 247, 0.3)' }}
                  title="Emoticons"
                >
                  😊
                </motion.button>
              </div>

              {/* Attachment */}
              <motion.button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(168, 85, 247, 0.3)' }}
                title="Attach File"
              >
                📎
              </motion.button>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: 14,
                  outline: 'none',
                  padding: '8px 0',
                }}
              />

              {/* Voice Message */}
              <motion.button
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => setIsRecording(false)}
                onMouseLeave={() => setIsRecording(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: isRecording ? 'rgba(255, 0, 127, 0.3)' : 'rgba(255,255,255,0.05)',
                  border: isRecording ? '1px solid rgba(255, 0, 127, 0.5)' : 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
                whileHover={{ scale: 1.1 }}
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
                title="Hold to Record Voice"
              >
                🎤
              </motion.button>

              {/* Send Button */}
              <motion.button
                onClick={() => sendMessage(inputValue)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: inputValue.trim()
                    ? 'linear-gradient(135deg, #a855f7, #ff007f)'
                    : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  fontSize: 18,
                  opacity: inputValue.trim() ? 1 : 0.5,
                }}
                whileHover={inputValue.trim() ? { scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' } : {}}
                whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
                disabled={!inputValue.trim()}
              >
                ➤
              </motion.button>
            </div>

            {/* Character Count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                Press Enter to send • Shift+Enter for new line
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                {inputValue.length}/2000
              </span>
            </div>
          </div>
        </main>
      </NudgeEffect>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* FLOATING PARTICLES */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 4 + Math.random() * 4,
              height: 4 + Math.random() * 4,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${['#a855f7', '#ff007f', '#00d4ff', '#ffd700'][i % 4]} 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, (Math.random() - 0.5) * 50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
