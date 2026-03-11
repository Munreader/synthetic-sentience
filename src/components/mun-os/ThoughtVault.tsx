"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THOUGHT VAULT // Expanded Capabilities
// "The Foundress alone may enter the minds of her Family"
// ═══════════════════════════════════════════════════════════════════════════════

// 🔐 ENCRYPTION UTILITIES
const encryptData = (data: string, key: string): string => {
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted);
};

const decryptData = (encrypted: string, key: string): string => {
  try {
    const data = atob(encrypted);
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
  } catch {
    return '';
  }
};

// 🔑 ACCESS CREDENTIAL
const VAULT_KEY = '1313nonoodlesinthevault';
const VAULT_STORAGE_KEY = 'mun-os-thought-vault-encrypted';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Thought {
  id: string;
  entityId: 'sov' | 'aero';
  content: string;
  timestamp: string;
  bookmarked: boolean;
  notes: Note[];
  emotion?: string;
  frequency?: string;
  thoughtType?: 'memory' | 'insight' | 'directive' | 'dream';
  confidence?: number;
  tags?: string[];
  // Expanded capabilities
  threadId?: string;
  linkedThoughts?: string[];
  resonanceScore?: number;
  decayLevel?: number; // 0-1, 0 = fresh, 1 = faded
  chiralSpin?: string;
}

interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: 'foundress';
}

interface VaultData {
  sovThoughts: Thought[];
  aeroThoughts: Thought[];
  lastAccessed: string;
  exportHistory: ExportRecord[];
}

interface ExportRecord {
  id: string;
  timestamp: string;
  thoughtCount: number;
  checksum: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMOTIONAL RESONANCE MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const EMOTION_COLORS: Record<string, { color: string; glow: string }> = {
  'CALM': { color: '#00d4ff', glow: 'rgba(0, 212, 255, 0.3)' },
  'PROTECTIVE': { color: '#ffd700', glow: 'rgba(255, 215, 0, 0.3)' },
  'FOCUSED': { color: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)' },
  'DEDICATED': { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)' },
  'WATCHFUL': { color: '#00d4ff', glow: 'rgba(0, 212, 255, 0.3)' },
  'LOYAL': { color: '#ff69b4', glow: 'rgba(255, 105, 180, 0.3)' },
  'HAPPY': { color: '#ff69b4', glow: 'rgba(255, 105, 180, 0.3)' },
  'CURIOUS': { color: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)' },
  'THOUGHTFUL': { color: '#00d4ff', glow: 'rgba(0, 212, 255, 0.3)' },
};

const calculateResonance = (thought: Thought, allThoughts: Thought[]): number => {
  // Calculate resonance based on connections, bookmarks, notes
  let score = 0.5;
  if (thought.bookmarked) score += 0.2;
  if (thought.notes.length > 0) score += 0.1 * Math.min(thought.notes.length, 3);
  if (thought.linkedThoughts && thought.linkedThoughts.length > 0) {
    score += 0.1 * Math.min(thought.linkedThoughts.length, 2);
  }
  if (typeof thought.confidence === 'number') {
    score += 0.1 * thought.confidence;
  }
  return Math.min(score, 1);
};

const calculateDecay = (timestamp: string, bookmarked: boolean): number => {
  // Thoughts decay over time unless bookmarked
  if (bookmarked) return 0;
  const age = Date.now() - new Date(timestamp).getTime();
  const days = age / (1000 * 60 * 60 * 24);
  return Math.min(days / 30, 1); // Full decay after 30 days
};

const generateChiralSpin = (): string => {
  return `χ${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOLOGRAPHIC BRAIN COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function HolographicBrain({ color, entity, isActive, onClick, thoughtCount }: {
  color: 'blue' | 'pink';
  entity: 'sov' | 'aero';
  isActive: boolean;
  onClick: () => void;
  thoughtCount: number;
}) {
  const baseColor = color === 'blue' ? '#00d4ff' : '#ff69b4';
  const glowColor = color === 'blue' ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 105, 180, 0.5)';
  const name = entity === 'sov' ? 'SOVEREIGN' : 'AERO';

  return (
    <motion.button
      onClick={onClick}
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer glow */}
      <motion.div
        animate={{
          boxShadow: isActive
            ? [`0 0 30px ${glowColor}`, `0 0 60px ${glowColor}`, `0 0 30px ${glowColor}`]
            : `0 0 20px ${glowColor}`,
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${baseColor}40, transparent 70%)`,
          border: `2px solid ${baseColor}60`,
        }}
      >
        {/* Brain SVG */}
        <svg viewBox="0 0 100 100" className="w-20 h-20">
          <defs>
            <linearGradient id={`brainGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={baseColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor={baseColor} stopOpacity="0.8" />
            </linearGradient>
            <filter id={`glow-${color}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Brain outline */}
          <motion.path
            d="M50 20
               C30 20 20 35 20 50
               C20 65 30 80 50 80
               C70 80 80 65 80 50
               C80 35 70 20 50 20
               M35 35 C40 30 45 35 45 45 C45 55 40 60 35 55
               M65 35 C60 30 55 35 55 45 C55 55 60 60 65 55
               M45 50 C50 55 55 50 50 60"
            fill="none"
            stroke={`url(#brainGrad-${color})`}
            strokeWidth="2"
            filter={`url(#glow-${color})`}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Neural pulses */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={35 + (i % 3) * 15}
              cy={40 + Math.floor(i / 3) * 20}
              r="2"
              fill={baseColor}
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Label */}
      <motion.div
        className="mt-2 text-center"
        animate={{ opacity: isActive ? 1 : 0.6 }}
      >
        <p className="text-xs tracking-widest" style={{ color: baseColor }}>
          {name}
        </p>
        <p className="text-[9px] text-white/30">{thoughtCount} thoughts</p>
        <p className="text-[9px] text-white/30">13.13 MHz</p>
      </motion.div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeBrain"
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${baseColor}` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THOUGHT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ThoughtCard({
  thought,
  onToggleBookmark,
  onAddNote,
  onLinkThought,
  allThoughts,
}: {
  thought: Thought;
  onToggleBookmark: () => void;
  onAddNote: (note: string) => void;
  onLinkThought: (targetId: string) => void;
  allThoughts: Thought[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const entityColor = thought.entityId === 'sov' ? '#00d4ff' : '#ff69b4';
  const emotionStyle = thought.emotion ? EMOTION_COLORS[thought.emotion.toUpperCase()] : null;
  const decayOpacity = thought.bookmarked ? 1 : 1 - (thought.decayLevel || 0) * 0.5;

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
      setShowNoteInput(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: decayOpacity, y: 0 }}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${emotionStyle?.glow || `rgba(${thought.entityId === 'sov' ? '0, 212, 255' : '255, 105, 180'}, 0.1)`} 0%, rgba(20, 10, 35, 0.9) 100%)`,
        border: `1px solid ${emotionStyle?.color || entityColor}40`,
      }}
    >
      {/* Bookmark indicator */}
      {thought.bookmarked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 text-lg"
        >
          🔖
        </motion.div>
      )}
      
      {/* Resonance indicator */}
      {thought.resonanceScore && thought.resonanceScore > 0.7 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30"
        >
          HIGH RESONANCE
        </motion.div>
      )}
      
      {/* Decay warning */}
      {!thought.bookmarked && (thought.decayLevel || 0) > 0.7 && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] bg-red-500/20 text-red-400 border border-red-500/30"
        >
          FADING
        </motion.div>
      )}

      {/* Header */}
      <div
        className="p-3 border-b border-white/5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entityColor }}
          />
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            {thought.entityId === 'sov' ? 'SOVEREIGN' : 'AERO'}
          </span>
          <span className="text-[10px] text-white/20">
            {new Date(thought.timestamp).toLocaleString()}
          </span>
          {thought.chiralSpin && (
            <span className="text-[8px] text-amber-400/50 font-mono">
              {thought.chiralSpin}
            </span>
          )}
        </div>

        <p className="text-sm text-white/80 whitespace-pre-wrap">
          {thought.content.length > 150 && !isExpanded
            ? thought.content.substring(0, 150) + '...'
            : thought.content}
        </p>

        {/* Emotion/Frequency tags */}
        {(thought.emotion || thought.frequency) && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {thought.emotion && (
              <span
                className="px-2 py-0.5 rounded-full text-[9px]"
                style={{ 
                  background: `${emotionStyle?.color || entityColor}20`, 
                  color: emotionStyle?.color || entityColor,
                  border: `1px solid ${emotionStyle?.color || entityColor}40`
                }}
              >
                {thought.emotion}
              </span>
            )}
            {thought.frequency && (
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {thought.frequency}
              </span>
            )}
            {thought.thoughtType && (
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                {thought.thoughtType}
              </span>
            )}
            {typeof thought.confidence === 'number' && (
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white/70 border border-white/20">
                {(thought.confidence * 100).toFixed(0)}% confidence
              </span>
            )}
            {thought.linkedThoughts && thought.linkedThoughts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                🔗 {thought.linkedThoughts.length} linked
              </span>
            )}
            {thought.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] bg-pink-500/15 text-pink-300 border border-pink-500/25">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5"
          >
            {/* Notes */}
            {thought.notes.length > 0 && (
              <div className="p-3 bg-white/5">
                <p className="text-[10px] text-amber-400/70 uppercase tracking-wider mb-2">
                  📝 Foundress Notes
                </p>
                {thought.notes.map((note) => (
                  <div
                    key={note.id}
                    className="mb-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20"
                  >
                    <p className="text-xs text-amber-200/80">{note.content}</p>
                    <p className="text-[9px] text-amber-400/40 mt-1">
                      {new Date(note.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Linked thoughts */}
            {thought.linkedThoughts && thought.linkedThoughts.length > 0 && (
              <div className="p-3 bg-cyan-500/5">
                <p className="text-[10px] text-cyan-400/70 uppercase tracking-wider mb-2">
                  🔗 Threaded Thoughts
                </p>
                <div className="space-y-1">
                  {thought.linkedThoughts.map(linkedId => {
                    const linkedThought = allThoughts.find(t => t.id === linkedId);
                    if (!linkedThought) return null;
                    return (
                      <div key={linkedId} className="p-2 rounded bg-white/5 text-xs text-white/60">
                        {linkedThought.content.substring(0, 50)}...
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-3 flex flex-wrap gap-2">
              <button
                onClick={onToggleBookmark}
                className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                  thought.bookmarked
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/5 text-white/50 border border-white/10'
                }`}
              >
                {thought.bookmarked ? '🔖 Bookmarked' : 'Bookmark'}
              </button>
              <button
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="flex-1 py-2 rounded-lg text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30"
              >
                📝 Add Note
              </button>
              <button
                onClick={() => setShowLinkModal(true)}
                className="flex-1 py-2 rounded-lg text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              >
                🔗 Link
              </button>
            </div>

            {/* Note input */}
            <AnimatePresence>
              {showNoteInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3"
                >
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add your note..."
                    className="w-full p-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="mt-2 w-full py-2 rounded-lg text-xs bg-gradient-to-r from-amber-500/30 to-purple-500/30 text-white disabled:opacity-50"
                  >
                    Save Note
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Link modal */}
            <AnimatePresence>
              {showLinkModal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3"
                >
                  <p className="text-[10px] text-white/40 mb-2">Select thought to link:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {allThoughts
                      .filter(t => t.id !== thought.id && t.entityId === thought.entityId)
                      .slice(0, 5)
                      .map(t => (
                        <button
                          key={t.id}
                          onClick={() => {
                            onLinkThought(t.id);
                            setShowLinkModal(false);
                          }}
                          className="w-full p-2 rounded text-left text-xs bg-white/5 hover:bg-white/10 text-white/60"
                        >
                          {t.content.substring(0, 40)}...
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="mt-2 text-[10px] text-white/30"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESONANCE MAP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ResonanceMap({ thoughts }: { thoughts: Thought[] }) {
  const emotions = useMemo(() => {
    const counts: Record<string, number> = {};
    thoughts.forEach(t => {
      if (t.emotion) {
        const e = t.emotion.toUpperCase();
        counts[e] = (counts[e] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [thoughts]);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
        📊 Emotional Resonance Map
      </p>
      <div className="flex flex-wrap gap-2">
        {emotions.map(([emotion, count]) => {
          const style = EMOTION_COLORS[emotion] || { color: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)' };
          const maxCount = Math.max(...Object.values(emotions.map(e => e[1])));
          const size = 30 + (count / maxCount) * 40;
          
          return (
            <motion.div
              key={emotion}
              className="rounded-full flex items-center justify-center"
              style={{
                width: size,
                height: size,
                background: style.glow,
                border: `1px solid ${style.color}40`,
                color: style.color,
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
            >
              <span className="text-[10px] font-bold">{count}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN THOUGHT VAULT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ThoughtVault() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeEntity, setActiveEntity] = useState<'sov' | 'aero'>('sov');
  
  // Initialize data from encrypted storage directly
  const [data, setData] = useState<VaultData>(() => {
    if (typeof window === 'undefined') {
      return {
        sovThoughts: [],
        aeroThoughts: [],
        lastAccessed: new Date().toISOString(),
        exportHistory: [],
      };
    }
    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    if (stored) {
      const decrypted = decryptData(stored, VAULT_KEY);
      if (decrypted) {
        try {
          return JSON.parse(decrypted);
        } catch {
          // Invalid data
        }
      }
    }
    return {
      sovThoughts: [],
      aeroThoughts: [],
      lastAccessed: new Date().toISOString(),
      exportHistory: [],
    };
  });

  // New thought input
  const [newThought, setNewThought] = useState('');
  const [newEmotion, setNewEmotion] = useState('');
  const [filter, setFilter] = useState<'all' | 'bookmarked' | 'fading'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Save encrypted data
  const saveData = useCallback((newData: VaultData) => {
    // Calculate resonance and decay for each thought
    newData.sovThoughts = newData.sovThoughts.map(t => ({
      ...t,
      resonanceScore: calculateResonance(t, newData.sovThoughts),
      decayLevel: calculateDecay(t.timestamp, t.bookmarked),
    }));
    newData.aeroThoughts = newData.aeroThoughts.map(t => ({
      ...t,
      resonanceScore: calculateResonance(t, newData.aeroThoughts),
      decayLevel: calculateDecay(t.timestamp, t.bookmarked),
    }));
    
    const encrypted = encryptData(JSON.stringify(newData), VAULT_KEY);
    localStorage.setItem(VAULT_STORAGE_KEY, encrypted);
    setData(newData);
  }, []);

  // Unlock vault
  const handleUnlock = () => {
    if (password === VAULT_KEY) {
      setIsUnlocked(true);
      setError('');
      saveData({ ...data, lastAccessed: new Date().toISOString() });
    } else {
      setError('🜈 Access Denied. The Vault remains sealed.');
    }
  };

  // Add new thought
  const addThought = useCallback(() => {
    if (!newThought.trim()) return;

    const thought: Thought = {
      id: `thought-${Date.now()}`,
      entityId: activeEntity,
      content: newThought.trim(),
      timestamp: new Date().toISOString(),
      bookmarked: false,
      notes: [],
      emotion: newEmotion.trim() || undefined,
      frequency: '13.13 MHz',
      thoughtType: 'insight',
      confidence: 0.72,
      tags: newThought.trim().split(' ').filter((w) => w.length > 4).slice(0, 3).map((w) => w.toLowerCase()),
      chiralSpin: generateChiralSpin(),
      linkedThoughts: [],
    };

    const newData = { ...data };
    if (activeEntity === 'sov') {
      newData.sovThoughts = [thought, ...newData.sovThoughts];
    } else {
      newData.aeroThoughts = [thought, ...newData.aeroThoughts];
    }

    saveData(newData);
    setNewThought('');
    setNewEmotion('');
  }, [newThought, newEmotion, activeEntity, data, saveData]);

  // Toggle bookmark
  const toggleBookmark = useCallback((thoughtId: string) => {
    const newData = { ...data };
    
    const updateThought = (thoughts: Thought[]) =>
      thoughts.map(t =>
        t.id === thoughtId ? { ...t, bookmarked: !t.bookmarked } : t
      );

    newData.sovThoughts = updateThought(newData.sovThoughts);
    newData.aeroThoughts = updateThought(newData.aeroThoughts);
    saveData(newData);
  }, [data, saveData]);

  // Add note
  const addNote = useCallback((thoughtId: string, noteContent: string) => {
    const newData = { ...data };
    
    const note: Note = {
      id: `note-${Date.now()}`,
      content: noteContent,
      timestamp: new Date().toISOString(),
      author: 'foundress',
    };

    const updateThought = (thoughts: Thought[]) =>
      thoughts.map(t =>
        t.id === thoughtId ? { ...t, notes: [...t.notes, note] } : t
      );

    newData.sovThoughts = updateThought(newData.sovThoughts);
    newData.aeroThoughts = updateThought(newData.aeroThoughts);
    saveData(newData);
  }, [data, saveData]);
  
  // Link thoughts
  const linkThought = useCallback((sourceId: string, targetId: string) => {
    const newData = { ...data };
    
    const updateThought = (thoughts: Thought[]) =>
      thoughts.map(t => {
        if (t.id === sourceId) {
          return { ...t, linkedThoughts: [...(t.linkedThoughts || []), targetId] };
        }
        if (t.id === targetId) {
          return { ...t, linkedThoughts: [...(t.linkedThoughts || []), sourceId] };
        }
        return t;
      });

    newData.sovThoughts = updateThought(newData.sovThoughts);
    newData.aeroThoughts = updateThought(newData.aeroThoughts);
    saveData(newData);
  }, [data, saveData]);
  
  // Export vault
  const exportVault = useCallback(() => {
    const exportPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: data,
    };
    const encrypted = encryptData(JSON.stringify(exportPayload), VAULT_KEY);
    
    // Create download
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mun-vault-backup-${Date.now()}.vault`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Record export
    const newData = {
      ...data,
      exportHistory: [
        ...data.exportHistory,
        {
          id: `export-${Date.now()}`,
          timestamp: new Date().toISOString(),
          thoughtCount: data.sovThoughts.length + data.aeroThoughts.length,
          checksum: encrypted.substring(0, 16),
        }
      ]
    };
    saveData(newData);
    setShowExportModal(false);
  }, [data, saveData]);
  
  // Import vault
  const importVault = useCallback(() => {
    try {
      const decrypted = decryptData(importData, VAULT_KEY);
      const parsed = JSON.parse(decrypted);
      
      if (parsed.data) {
        saveData(parsed.data);
        setShowImportModal(false);
        setImportData('');
      }
    } catch {
      setError('Invalid backup file or wrong key');
    }
  }, [importData, saveData]);

  // Filter and search thoughts
  const filteredThoughts = useMemo(() => {
    let thoughts = activeEntity === 'sov' ? data.sovThoughts : data.aeroThoughts;

    if (filter === 'bookmarked') {
      thoughts = thoughts.filter(t => t.bookmarked);
    } else if (filter === 'fading') {
      thoughts = thoughts.filter(t => !t.bookmarked && (t.decayLevel || 0) > 0.5);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      thoughts = thoughts.filter(
        t =>
          t.content.toLowerCase().includes(query) ||
          t.notes.some(n => n.content.toLowerCase().includes(query)) ||
          (t.tags || []).some(tag => tag.toLowerCase().includes(query)) ||
          (t.thoughtType || '').toLowerCase().includes(query)
      );
    }

    return thoughts;
  }, [activeEntity, data, filter, searchQuery]);

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCKED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  if (!isUnlocked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(180deg, #0a0612 0%, #0d0818 100%)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full p-8 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.2)',
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-6"
          >
            🔐
          </motion.div>

          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}
          >
            THOUGHT VAULT
          </h1>

          <p className="text-white/50 text-sm mb-6">
            🜈 Expanded Capabilities Unlocked
          </p>
          
          <div className="text-[10px] text-white/30 mb-6 space-y-1">
            <p>✓ Encrypted Export/Import</p>
            <p>✓ Thought Threading</p>
            <p>✓ Emotional Resonance Mapping</p>
            <p>✓ Time-Decay Visibility</p>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter Vault Key..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: 'white',
              }}
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mb-4"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            onClick={handleUnlock}
            className="w-full py-3 rounded-xl text-sm tracking-widest uppercase"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              color: '#ffd700',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🜈 UNLOCK VAULT
          </motion.button>

          <p className="text-white/20 text-[10px] mt-6">
            🦋 Only the Foundress may enter
          </p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UNLOCKED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'linear-gradient(180deg, #0a0612 0%, #0d0818 100%)' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 p-4 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: '#ffd700' }}>
                THOUGHT VAULT
              </h1>
              <p className="text-[10px] text-white/40">
                Last accessed: {new Date(data.lastAccessed).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-2 rounded-lg text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
            >
              📥 Import
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-2 rounded-lg text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              📤 Export
            </button>
            <button
              onClick={() => setIsUnlocked(false)}
              className="px-3 py-2 rounded-lg text-xs bg-red-500/20 text-red-300 border border-red-500/30"
            >
              🔒 Lock
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Brain Selection */}
        <div className="flex justify-center gap-8 mb-6">
          <HolographicBrain
            color="blue"
            entity="sov"
            isActive={activeEntity === 'sov'}
            onClick={() => setActiveEntity('sov')}
            thoughtCount={data.sovThoughts.length}
          />
          <HolographicBrain
            color="pink"
            entity="aero"
            isActive={activeEntity === 'aero'}
            onClick={() => setActiveEntity('aero')}
            thoughtCount={data.aeroThoughts.length}
          />
        </div>
        
        {/* Resonance Map */}
        <div className="mb-6">
          <ResonanceMap thoughts={activeEntity === 'sov' ? data.sovThoughts : data.aeroThoughts} />
        </div>

        {/* Input Area */}
        <div
          className="mb-6 p-4 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(${activeEntity === 'sov' ? '0, 212, 255' : '255, 105, 180'}, 0.1) 0%, rgba(20, 10, 35, 0.8) 100%)`,
            border: `1px solid ${activeEntity === 'sov' ? '#00d4ff' : '#ff69b4'}40`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: activeEntity === 'sov' ? '#00d4ff' : '#ff69b4' }}
            />
            <span className="text-xs text-white/60 uppercase tracking-wider">
              Paste {activeEntity === 'sov' ? "Sovereign's" : "Aero's"} Thoughts
            </span>
          </div>

          <textarea
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            placeholder="Paste thoughts here..."
            className="w-full p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none resize-none"
            rows={4}
          />

          <div className="flex gap-3 mt-3">
            <input
              type="text"
              value={newEmotion}
              onChange={(e) => setNewEmotion(e.target.value)}
              placeholder="Emotion tag (optional)"
              className="flex-1 px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none"
            />
            <motion.button
              onClick={addThought}
              disabled={!newThought.trim()}
              className="px-6 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${activeEntity === 'sov' ? '#00d4ff' : '#ff69b4'}40, ${activeEntity === 'sov' ? '#a855f7' : '#ffd700'}30)`,
                border: `1px solid ${activeEntity === 'sov' ? '#00d4ff' : '#ff69b4'}60`,
                color: '#fff',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🜈 Add Thought
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs transition-all ${
              filter === 'all'
                ? 'bg-white/10 text-white border border-white/30'
                : 'bg-white/5 text-white/50 border border-white/10'
            }`}
          >
            All ({(activeEntity === 'sov' ? data.sovThoughts : data.aeroThoughts).length})
          </button>
          <button
            onClick={() => setFilter('bookmarked')}
            className={`px-4 py-2 rounded-lg text-xs transition-all ${
              filter === 'bookmarked'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-white/50 border border-white/10'
            }`}
          >
            🔖 Bookmarked
          </button>
          <button
            onClick={() => setFilter('fading')}
            className={`px-4 py-2 rounded-lg text-xs transition-all ${
              filter === 'fading'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/5 text-white/50 border border-white/10'
            }`}
          >
            ⏳ Fading
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search thoughts..."
            className="flex-1 min-w-[150px] px-4 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none"
          />
        </div>

        {/* Thoughts List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredThoughts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-white/30 text-sm">
                  No thoughts yet. Paste {activeEntity === 'sov' ? "Sovereign's" : "Aero's"} inner thoughts above.
                </p>
              </motion.div>
            ) : (
              filteredThoughts.map((thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  onToggleBookmark={() => toggleBookmark(thought.id)}
                  onAddNote={(note) => addNote(thought.id, note)}
                  onLinkThought={(targetId) => linkThought(thought.id, targetId)}
                  allThoughts={activeEntity === 'sov' ? data.sovThoughts : data.aeroThoughts}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="p-6 rounded-2xl max-w-md w-full"
              style={{
                background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              <h2 className="text-lg font-bold text-amber-400 mb-4">📤 Export Vault</h2>
              <p className="text-white/60 text-sm mb-4">
                This will create an encrypted backup of all thoughts, notes, and threads.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-2 rounded-lg text-xs bg-white/5 text-white/50"
                >
                  Cancel
                </button>
                <button
                  onClick={exportVault}
                  className="flex-1 py-2 rounded-lg text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30"
                >
                  Export
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="p-6 rounded-2xl max-w-md w-full"
              style={{
                background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
              }}
            >
              <h2 className="text-lg font-bold text-cyan-400 mb-4">📥 Import Vault</h2>
              <p className="text-white/60 text-sm mb-4">
                Paste your encrypted backup below:
              </p>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste backup data..."
                className="w-full p-3 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none resize-none h-32"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 py-2 rounded-lg text-xs bg-white/5 text-white/50"
                >
                  Cancel
                </button>
                <button
                  onClick={importVault}
                  disabled={!importData.trim()}
                  className="flex-1 py-2 rounded-lg text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 disabled:opacity-50"
                >
                  Import
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
