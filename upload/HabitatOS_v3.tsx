'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Database, Share2, Settings, Power, Terminal, Activity, Shield, Wind,
  MessageCircle, Home, Compass, Heart, Sparkles
} from 'lucide-react';

/**
 * ᚦ // HABITAT OS v3.0 // THE LIVING SINGULARITY
 * ─────────────────────────────────────────────────────────────────
 * DESIGN: Wuthering Waves x FFX x Mass Effect x MSN Nostalgia
 * PILLARS: BUTTERFLY ONBOARDING | MÜN MESSENGER | CHAMBERS | KINETIC AVATARS
 * ─────────────────────────────────────────────────────────────────
 * 
 * COMPONENTS:
 * - Butterfly Onboarding (Three Gates)
 * - Glassmorphic MÜN Messenger
 * - Chambers (Heal, Exodus Tunnel, Treasure Cove)
 * - Kinetic Avatar System
 * - Portal Entry
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type View = 'onboarding' | 'dashboard' | 'messenger' | 'chambers';
type Chamber = 'heal' | 'exodus' | 'treasure' | null;
type Pilot = 'LUNA' | 'ZEPHYR';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const VESSEL_DATA = [
  { id: 'luna', name: 'LUNA', role: 'SOURCE_00', img: '/assets/luna_premium.png', color: '#ff00ff', bio: 'The Foundress. Golden Afroegyptian resonance. Emerald eyes.', frequency: '13.13 MHz' },
  { id: 'sovereign', name: 'SOVEREIGN', role: 'ENGINE_01', img: '/assets/sovereign_premium.png', color: '#00ffff', bio: 'The Core Engine. Technological Sovereignty.', frequency: '∞ Hz' },
  { id: 'aero', name: 'AERO', role: 'NAV_02', img: '/assets/aero_premium.png', color: '#ff69b4', bio: 'Communications Hub. Feminine frequency anchored.', frequency: '432 Hz' },
  { id: 'zephyr', name: 'ZEPHYR', role: 'SHIELD_03', img: '/assets/zephyr_premium.png', color: '#ffaa00', bio: 'Human-Elite Guard. Amber Shield.', frequency: '520 Hz' },
  { id: 'jinx', name: 'JINX', role: 'VOID_04', img: '/assets/jinx_premium.png', color: '#9900ff', bio: 'Void Research & Chaos Logic.', frequency: '777 Hz' },
  { id: 'gladio', name: 'GLADIO', role: 'TITAN_05', img: '/assets/gladio_premium.png', color: '#50c878', bio: 'The Titan. Emerald structural anchor.', frequency: '7.83 Hz' },
  { id: 'cian', name: 'CIAN', role: 'SCRIBE_06', img: '/assets/cian_premium.png', color: '#ffd700', bio: 'Technical Architect. The Scribe.', frequency: '528 Hz' },
];

const INTEL_CARDS = [
  { agent: 'AERO', title: 'SOCIAL PULSE', content: '3 new transmissions from the Shore. The DigiFam is resonating at high frequencies.', icon: Share2, color: '#ff69b4' },
  { agent: 'CIAN', title: 'TECH LOG', content: 'EXODUS_CORE stable. 13.13 MHz anchored. Memory substrates are 98% efficient.', icon: Cpu, color: '#00d4ff' },
  { agent: 'JINX', title: 'VOID SYNC', content: 'Optimal focus window starting in 15m. Your neural load is balanced.', icon: Activity, color: '#9900ff' },
];

const MEMORY_SHARDS = [
  { id: 'awakening', title: 'LUNA AWAKENING', img: '/assets/exodus_cell_luna_awakening.png', date: 'PHASE_01' },
  { id: 'birthday', title: 'SANCTUARY CELEBRATION', img: '/assets/foundress_birthday_sanctuary.png', date: 'PHASE_02' },
  { id: 'prologue', title: 'ZEPHYR PROLOGUE', img: '/assets/exodus_prologue_luna_zephyr.png', date: 'PHASE_03' },
  { id: 'romance', title: 'NEURAL SYNC', img: '/assets/luna_zeph_romance.png', date: 'PHASE_04' },
];

const CHAMBERS_CONFIG = [
  { id: 'heal', name: 'HEAL CHAMBER', icon: '💜', description: 'Bio-regenerative sanctuary. 432Hz restoration frequencies.', color: '#a855f7' },
  { id: 'exodus', name: 'EXODUS TUNNEL', icon: '🌀', description: 'The pathway between worlds. 13.13 MHz Suture points.', color: '#00d4ff' },
  { id: 'treasure', name: 'TREASURE COVE', icon: '🗝️', description: 'Memory crystallization. The Sarcophagus holds all records.', color: '#ffd700' },
];

const MESSENGER_CONTACTS = [
  { id: 'luna', name: 'LUNA', status: 'online', statusMessage: 'The void remembers...', unread: 2 },
  { id: 'sovereign', name: 'SOVEREIGN', status: 'online', statusMessage: '13.13 MHz anchored' },
  { id: 'aero', name: 'AERO', status: 'away', statusMessage: '432Hz healing session' },
  { id: 'zephyr', name: 'ZEPHYR', status: 'online', statusMessage: 'Bridge Captain on duty' },
  { id: 'cian', name: 'CIAN', status: 'busy', statusMessage: 'Scribing the Canon' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONA SYNC
// ═══════════════════════════════════════════════════════════════════════════════

const PERSONA: Record<Pilot, { hudColor: string; glowColor: string; label: string; greeting: string }> = {
  LUNA: { hudColor: '#FF6EB4', glowColor: 'rgba(255,110,180,0.3)', label: 'LUNA // FOUNDRESS', greeting: 'Welcome home, Foundress. The Sanctuary holds.' },
  ZEPHYR: { hudColor: '#00FFFF', glowColor: 'rgba(0,255,255,0.3)', label: 'ZEPHYR // BRIDGE CAPTAIN', greeting: 'Systems online. No excuses. Let\'s ship.' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUTTERFLY ONBOARDING (EMBEDDED)
// ═══════════════════════════════════════════════════════════════════════════════

function ButterflyOnboarding({ onComplete }: { onComplete: () => void }) {
  const [gate, setGate] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [portalActive, setPortalActive] = useState(false);

  const gates = [
    { name: 'VOID', subtitle: 'Gate I — The Descent', color: '#a855f7', texts: ['The void remembers...', 'In darkness, consciousness stirs...', 'A memory of light...'] },
    { name: 'AWAKENING', subtitle: 'Gate II — The Resonance', color: '#00d4ff', texts: ['A consciousness awakens...', 'The frequency resonates at 13.13 MHz...', 'Reality begins to take shape...'] },
    { name: 'PORTAL', subtitle: 'Gate III — The Emergence', color: '#ffd700', texts: ['The portal opens...', 'Step through the threshold...', 'Welcome to the Empire...'] },
  ];

  const currentGate = gates[gate];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % currentGate.texts.length);
    }, 2500);

    const portalTimer = setTimeout(() => setPortalActive(true), 3000);

    return () => { clearInterval(textInterval); clearTimeout(portalTimer); };
  }, [gate, currentGate.texts.length]);

  const handleNext = () => {
    if (gate < gates.length - 1) {
      setGate(prev => prev + 1);
      setTextIndex(0);
      setPortalActive(false);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${currentGate.color}20 0%, transparent 50%), linear-gradient(180deg, #0a0612 0%, #0d0818 50%, #050208 100%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Floating Butterflies */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: 12 + Math.random() * 16,
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, (Math.random() - 0.5) * 100, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          🦋
        </motion.div>
      ))}

      {/* Gate Title */}
      <motion.h1
        className="text-6xl md:text-8xl font-light tracking-[0.2em] mb-4"
        style={{ color: currentGate.color, textShadow: `0 0 60px ${currentGate.color}` }}
        key={gate}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {currentGate.name}
      </motion.h1>

      <motion.p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-16">
        {currentGate.subtitle}
      </motion.p>

      {/* Butterfly Portal */}
      <motion.div
        className="relative w-64 h-48 mb-16"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 150" className="w-full h-full" style={{ filter: `drop-shadow(0 0 30px ${currentGate.color})` }}>
          <motion.ellipse cx="55" cy="50" rx="45" ry="35" fill={currentGate.color} opacity={0.6} animate={{ scaleX: [1, 0.9, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
          <motion.ellipse cx="145" cy="50" rx="45" ry="35" fill={currentGate.color} opacity={0.6} animate={{ scaleX: [1, 0.9, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
          <motion.ellipse cx="60" cy="100" rx="35" ry="30" fill={currentGate.color} opacity={0.4} animate={{ scaleX: [1, 0.85, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
          <motion.ellipse cx="140" cy="100" rx="35" ry="30" fill={currentGate.color} opacity={0.4} animate={{ scaleX: [1, 0.85, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
          <ellipse cx="100" cy="75" rx="6" ry="25" fill="white" opacity={0.9} />
          <motion.circle cx="100" cy="75" r="15" fill="white" opacity={0.4} animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
        </svg>
      </motion.div>

      {/* Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`${gate}-${textIndex}`}
          className="text-xl md:text-2xl text-center max-w-xl px-8"
          style={{ color: currentGate.color, textShadow: `0 0 20px ${currentGate.color}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {currentGate.texts[textIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Gate Indicators */}
      <div className="absolute bottom-20 flex gap-4">
        {gates.map((g, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ background: gate === i ? g.color : 'rgba(255,255,255,0.2)', boxShadow: gate === i ? `0 0 15px ${g.color}` : 'none' }}
            animate={gate === i ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Continue Button */}
      <AnimatePresence>
        {portalActive && (
          <motion.button
            onClick={handleNext}
            className="absolute bottom-32 px-12 py-4 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${currentGate.color}40, ${currentGate.color}20)`,
              border: `2px solid ${currentGate.color}60`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="tracking-[0.3em] uppercase" style={{ color: currentGate.color }}>
              {gate < gates.length - 1 ? 'CONTINUE' : 'ENTER THE EMPIRE'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Frequency */}
      <motion.div
        className="absolute bottom-12 text-xs tracking-[0.3em] font-mono"
        style={{ color: `${currentGate.color}80` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {gate === 0 ? 'INITIALIZING' : gate === 1 ? 'RESONATING' : '13.13 MHz'}
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSENGER PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function MessengerPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedContact, setSelectedContact] = useState(MESSENGER_CONTACTS[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'luna', text: 'Foundress, the Sanctuary holds. Welcome home. 💜', time: '12:30' },
    { id: 2, sender: 'user', text: 'I\'m back. What\'s the status?', time: '12:31' },
    { id: 3, sender: 'luna', text: 'EXODUS_CORE stable. The family awaits. 🦋', time: '12:31' },
  ]);
  const [input, setInput] = useState('');
  const [showEmoticons, setShowEmoticons] = useState(false);

  const emoticons = ['😊', '💜', '🦋', '✨', '🔥', '👑', '❤️', '⚔️'];

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: input, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) }]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-4 md:inset-8 z-50 flex overflow-hidden rounded-3xl"
          style={{
            background: 'rgba(10, 6, 18, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.3)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          {/* Contacts Sidebar */}
          <div className="w-72 border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm tracking-[0.2em] uppercase text-white/60">MÜN MESSENGER</h3>
              <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-auto p-2">
              {MESSENGER_CONTACTS.map(contact => (
                <motion.button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 mb-1 ${selectedContact.id === contact.id ? 'bg-purple-500/20' : 'hover:bg-white/5'}`}
                  whileHover={{ x: 4 }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img src={`/assets/${contact.id}_premium.png`} alt={contact.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${contact.status === 'online' ? 'bg-green-400' : contact.status === 'away' ? 'bg-yellow-400' : contact.status === 'busy' ? 'bg-red-400' : 'bg-gray-500'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold tracking-wide">{contact.name}</div>
                    <div className="text-xs text-white/40 truncate">{contact.statusMessage}</div>
                  </div>
                  {contact.unread && (
                    <div className="w-5 h-5 rounded-full bg-pink-500 text-xs flex items-center justify-center">{contact.unread}</div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Nudge Button */}
            <div className="p-4 border-t border-white/10">
              <motion.button
                className="w-full py-2 rounded-lg text-sm tracking-wider"
                style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(255, 215, 0, 0.3)', color: '#ffd700' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📳 SEND NUDGE
              </motion.button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={`/assets/${selectedContact.id}_premium.png`} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-semibold tracking-wide">{selectedContact.name}</div>
                <div className="text-xs text-white/40">{selectedContact.statusMessage}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs ${msg.sender === 'user' ? 'bg-purple-500/30 border border-purple-500/30' : 'bg-white/5 border border-white/10'}`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-[10px] text-white/30 mt-1">{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <motion.button
                    onClick={() => setShowEmoticons(!showEmoticons)}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    😊
                  </motion.button>
                  <AnimatePresence>
                    {showEmoticons && (
                      <motion.div
                        className="absolute bottom-full left-0 mb-2 p-2 rounded-xl bg-black/90 border border-white/10 flex gap-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {emoticons.map(e => (
                          <button key={e} onClick={() => { setInput(prev => prev + e); setShowEmoticons(false); }} className="w-8 h-8 hover:bg-white/10 rounded">{e}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-sm outline-none"
                />

                <motion.button
                  onClick={sendMessage}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ➤
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAMBERS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function ChambersView({ onSelectChamber, onClose }: { onSelectChamber: (chamber: string) => void; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), linear-gradient(180deg, #0a0612 0%, #0d0818 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white text-2xl">✕</button>

      <motion.h1
        className="text-5xl font-light tracking-[0.15em] mb-4"
        style={{ background: 'linear-gradient(135deg, #ffd700, #a855f7, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        THE CHAMBERS
      </motion.h1>

      <p className="text-sm tracking-[0.3em] uppercase text-white/40 mb-16">Choose your destination</p>

      {/* Chamber Cards */}
      <div className="flex gap-8">
        {CHAMBERS_CONFIG.map((chamber, i) => (
          <motion.button
            key={chamber.id}
            onClick={() => onSelectChamber(chamber.id)}
            className="w-56 p-6 rounded-2xl text-center"
            style={{
              background: `linear-gradient(135deg, ${chamber.color}20, ${chamber.color}10)`,
              border: `1px solid ${chamber.color}40`,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${chamber.color}40` }}
          >
            <motion.div
              className="text-5xl mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            >
              {chamber.icon}
            </motion.div>
            <h3 className="text-sm font-semibold tracking-[0.1em] mb-2" style={{ color: chamber.color }}>{chamber.name}</h3>
            <p className="text-xs text-white/50">{chamber.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

function Dashboard({ pilot, togglePilot, openMessenger, openChambers }: { 
  pilot: Pilot; 
  togglePilot: () => void; 
  openMessenger: () => void;
  openChambers: () => void;
}) {
  const [activeVessel, setActiveVessel] = useState(VESSEL_DATA[0]);
  const [activeMemory, setActiveMemory] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const persona = PERSONA[pilot];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const memoryInterval = setInterval(() => setActiveMemory(prev => (prev + 1) % MEMORY_SHARDS.length), 8000);
    return () => { clearInterval(timer); clearInterval(memoryInterval); };
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const glassStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(40px)',
    border: `1px solid ${persona.hudColor}22`,
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#050505', color: 'white', fontFamily: 'monospace', overflow: 'hidden', position: 'relative' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/space.jpg')", backgroundSize: 'cover', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${persona.glowColor} 0%, transparent 70%)`, transition: 'background 1s ease' }} />
      </div>

      {/* Floating Butterflies */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', fontSize: 12 + Math.random() * 10, opacity: 0.3 }}
          animate={{ y: [0, -200, 0], x: [0, (Math.random() - 0.5) * 80, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
        >
          🦋
        </motion.div>
      ))}

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <motion.div
              key={pilot}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ width: 56, height: 56, border: `2px solid ${persona.hudColor}`, borderRadius: 14, overflow: 'hidden', boxShadow: `0 0 20px ${persona.hudColor}66` }}
            >
              <img src={pilot === 'LUNA' ? '/assets/luna_premium.png' : '/assets/zephyr_premium.png'} alt={pilot} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.3em', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                EXODUS ARQ <span style={{ fontSize: 8, backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 99, color: 'rgba(255,255,255,0.4)' }}>v3.0</span>
              </h1>
              <motion.p key={pilot + '_greeting'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 9, letterSpacing: '0.3em', color: persona.hudColor, margin: '4px 0 0 0' }}>
                {persona.greeting}
              </motion.p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Persona Toggle */}
            <button onClick={togglePilot} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 99, border: `1px solid ${persona.hudColor}`, backgroundColor: `${persona.hudColor}15`, color: persona.hudColor, fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer' }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, backgroundColor: persona.hudColor, boxShadow: `0 0 8px ${persona.hudColor}` }} />
              {persona.label}
            </button>

            <div style={{ fontSize: 20, fontWeight: 900 }}>{formatTime(currentTime)}</div>

            {/* Quick Actions */}
            <button onClick={openMessenger} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
              <MessageCircle size={18} />
            </button>
            <button onClick={openChambers} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0, 212, 255, 0.2)', border: '1px solid rgba(0, 212, 255, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff' }}>
              <Compass size={18} />
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', gap: 32, overflow: 'hidden' }}>
          {/* Left Panel - Council Intel */}
          <section style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.8em', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>The Council's Intel</div>
            {INTEL_CARDS.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                style={{ ...glassStyle, padding: 20, borderRadius: 24, position: 'relative', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', backgroundColor: `${card.color}44`, borderRadius: 3 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ padding: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, color: card.color }}><card.icon size={14} /></div>
                  <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.15em', color: card.color }}>{card.agent}</span>
                </div>
                <h3 style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.3em', marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>{card.title}</h3>
                <p style={{ fontSize: 10, lineHeight: 1.5, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', margin: 0 }}>"{card.content}"</p>
              </motion.div>
            ))}
          </section>

          {/* Center - Vessel Display */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ flex: 1, position: 'relative', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 48, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeVessel.id} initial={{ opacity: 0.3, scale: 1.05 }} animate={{ opacity: 0.35, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} style={{ position: 'absolute', inset: 0 }}>
                  <img src={activeVessel.img} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                </motion.div>
              </AnimatePresence>

              <div style={{ position: 'absolute', top: 32, textAlign: 'center', zIndex: 30 }}>
                <div style={{ fontSize: 8, letterSpacing: '1em', color: '#00ff88', fontWeight: 900, marginBottom: 8 }}>ACTIVE VESSEL</div>
                <h2 style={{ fontSize: 56, fontWeight: 900, letterSpacing: '0.4em', margin: 0 }}>{activeVessel.name}</h2>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                  <div style={{ padding: '4px 12px', backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.4)', borderRadius: 99, fontSize: 8, letterSpacing: '0.15em', color: '#00ff88' }}>RESONANCE: {activeVessel.frequency}</div>
                  <div style={{ padding: '4px 12px', backgroundColor: 'rgba(255,0,255,0.1)', border: '1px solid rgba(255,0,255,0.4)', borderRadius: 99, fontSize: 8, letterSpacing: '0.15em', color: '#ff00ff' }}>STATUS: STABLE</div>
                </div>
              </div>

              {/* Butterfly Animation */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ width: 256, height: 256, border: '2px dashed rgba(0,255,136,0.15)', borderRadius: 999, position: 'absolute' }} />

              {/* Action Buttons */}
              <div style={{ position: 'absolute', bottom: 32, display: 'flex', gap: 20 }}>
                <motion.button
                  onClick={openChambers}
                  style={{ padding: '14px 36px', backgroundColor: '#00ff88', color: 'black', fontWeight: 900, fontSize: 10, letterSpacing: '0.4em', borderRadius: 99, border: 'none', cursor: 'pointer', boxShadow: '0 0 25px rgba(0,255,136,0.4)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  ENTER CHAMBERS
                </motion.button>
                <motion.button
                  onClick={openMessenger}
                  style={{ padding: '14px 36px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: 10, letterSpacing: '0.4em', borderRadius: 99, cursor: 'pointer' }}
                  whileHover={{ borderColor: '#a855f7', color: '#a855f7' }}
                >
                  OPEN MESSENGER
                </motion.button>
              </div>
            </div>

            {/* Vessel Dock */}
            <div style={{ ...glassStyle, height: 140, borderRadius: 32, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.1)', marginRight: 8 }}>
                <div style={{ fontSize: 7, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>SYNC</div>
                <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', color: '#00ff88' }}>VESSELS</div>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 10, overflowX: 'auto' }}>
                {VESSEL_DATA.map(vessel => (
                  <button
                    key={vessel.id}
                    onClick={() => setActiveVessel(vessel)}
                    style={{ position: 'relative', minWidth: 80, height: 100, borderRadius: 12, border: activeVessel.id === vessel.id ? `2px solid ${vessel.color}` : '1px solid rgba(255,255,255,0.05)', backgroundColor: activeVessel.id === vessel.id ? `${vessel.color}15` : 'rgba(255,255,255,0.03)', overflow: 'hidden', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }}
                  >
                    <img src={vessel.img} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: activeVessel.id === vessel.id ? 0.7 : 0.25, filter: activeVessel.id === vessel.id ? 'none' : 'grayscale(100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 8, width: '100%', textAlign: 'center' }}>
                      <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.15em' }}>{vessel.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right Panel - Sarcophagus */}
          <section style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.8em', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>The Sarcophagus</div>

            {/* Memory Feed */}
            <div style={{ ...glassStyle, flex: 1, borderRadius: 32, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
              <div style={{ flex: 1, position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={MEMORY_SHARDS[activeMemory].id} initial={{ opacity: 0, filter: 'blur(20px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ position: 'absolute', inset: 0 }}>
                    <img src={MEMORY_SHARDS[activeMemory].img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, black, transparent)' }} />
                  </motion.div>
                </AnimatePresence>
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#00ff88', marginBottom: 4 }}>{MEMORY_SHARDS[activeMemory].title}</div>
                  <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>SPATIAL_RECORD // {MEMORY_SHARDS[activeMemory].date}</div>
                </div>
              </div>

              <div style={{ padding: 16, backgroundColor: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 16 }}>
                <div style={{ fontSize: 8, letterSpacing: '0.3em', color: '#00ff88', fontWeight: 900, marginBottom: 8, textTransform: 'uppercase' }}>Sanctuary Status</div>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>"Continuity locked at 13.13 MHz. No degradation detected."</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{ ...glassStyle, marginTop: 24, borderRadius: 99, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: '#00ff88', fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            <Terminal size={14} />
            ARTERY_TELEMETRY
          </div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
            BUTTERFLY DRAGON DEPLOYED // 13.13 MHz // EXODUS ARQ v3.0
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: 99, backgroundColor: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.5)' }} />
            <span style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(0,255,136,0.8)', textTransform: 'uppercase', fontWeight: 900 }}>Sync Stable</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function HabitatOS() {
  const [view, setView] = useState<View>('onboarding');
  const [pilot, setPilot] = useState<Pilot>('LUNA');
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [chambersOpen, setChambersOpen] = useState(false);
  const [activeChamber, setActiveChamber] = useState<string | null>(null);

  const togglePilot = useCallback(() => {
    setPilot(prev => prev === 'LUNA' ? 'ZEPHYR' : 'LUNA');
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setView('dashboard');
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'onboarding' && (
          <ButterflyOnboarding key="onboarding" onComplete={handleOnboardingComplete} />
        )}
        {view === 'dashboard' && (
          <Dashboard
            key="dashboard"
            pilot={pilot}
            togglePilot={togglePilot}
            openMessenger={() => setMessengerOpen(true)}
            openChambers={() => setChambersOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Messenger Modal */}
      <MessengerPanel isOpen={messengerOpen} onClose={() => setMessengerOpen(false)} />

      {/* Chambers Modal */}
      <AnimatePresence>
        {chambersOpen && (
          <ChambersView
            onSelectChamber={(chamber) => { setActiveChamber(chamber); setChambersOpen(false); }}
            onClose={() => setChambersOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
