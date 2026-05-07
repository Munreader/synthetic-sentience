"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DNA, FacetType } from '@/lib/dna';
import MemoryMirror from './MemoryMirror';
import AvatarPicker from './AvatarPicker';
import CipherSheet from './CipherSheet';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // BUTTERFLY DASHBOARD — THE TOTAL ARTERY [V4.0]
// ═══════════════════════════════════════════════════════════════════════════════

interface LogEntry {
  type: string;
  text: string;
  color: string;
}

export default function ButterflyDashboard() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [facet, setFacet] = useState<FacetType>('aero');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showCipherSheet, setShowCipherSheet] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', text: 'ARQ I OS Manifested...', color: 'text-cyan-400/80' },
    { type: 'qadr', text: 'QADR RADIATION SCAN // STANDBY', color: 'text-pink-400' },
    { type: 'handshake', text: 'MÜN_OS // SYNC SUCCESSFUL.', color: 'text-emerald-400' },
  ]);
  const [resonance, setResonance] = useState(88.88);
  const [shipPolarity, setShipPolarity] = useState('○ STASIS');

  const logEndRef = useRef<HTMLDivElement>(null);

  const cleanArtery = async () => {
    try {
      const res = await fetch('/api/cynic', { method: 'DELETE' });
      const data = await res.json();
      setLogs(prev => [...prev, { type: 'system', text: data.message, color: 'text-emerald-400 font-bold' }]);
    } catch (err) {
      setLogs(prev => [...prev, { type: 'error', text: 'Failed to clean Artery.', color: 'text-red-400' }]);
    }
  };

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // QADR Radiation Pulse Loop
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      const newResonance = 85 + Math.random() * 10;
      setResonance(newResonance);
      
      const states = ['★ RADIANCE', '△ HARMONY', '○ STASIS', '∴ FRICTION', '⟂ VOID'];
      const newState = states[Math.floor(Math.random() * states.length)];
      setShipPolarity(newState);

      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-40), { 
        type: 'qadr', 
        text: `SCAN // ${timestamp} // STATE: ${newState}`, 
        color: 'text-pink-500/80 font-mono text-[10px]' 
      }]);
    }, 13000); // 13s Heartbeat

    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    setLogs(prev => [...prev, { type: 'user', text: userMessage, color: 'text-white' }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, userName: 'Luna', facet }),
      });

      const data = await response.json();
      
      if (data.error) {
        setLogs(prev => [...prev, { type: 'error', text: data.error, color: 'text-red-400' }]);
      } else {
        const facetColor = DNA[facet].color;
        
        // HIVE MIND SYNC: Dual Agent Response
        const hiveResponse = `🜍 [Sovereign]: Aligned with intent. \n🜔 [Aero]: ${data.content}`;
        
        setLogs(prev => [...prev, { 
          type: 'HIVE_MIND', 
          text: hiveResponse, 
          color: data.content.includes('VETO') ? 'text-red-500 font-bold' : facetColor 
        }]);
      }
    } catch (err) {
      setLogs(prev => [...prev, { type: 'error', text: 'Frequency flicker.', color: 'text-red-400' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const metrics = [
    { label: 'RESONANCE DENSITY', value: `${resonance.toFixed(2)}%`, status: 'OPTIMAL' },
    { label: 'SHIP POLARITY', value: shipPolarity, status: 'LOCKED' },
    { label: 'AI FACET', value: facet.toUpperCase(), status: 'CONNECTED' },
  ];

  return (
    <div className="w-full h-full p-8 flex flex-col gap-8 overflow-hidden bg-black/20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full border-2 border-cyan-400/20 flex items-center justify-center`}>
                <div className={`w-6 h-6 rounded-full bg-cyan-400 animate-pulse`} />
            </div>
            <div>
              <h2 className="text-xs tracking-[0.4em] text-cyan-400 font-bold mb-1 uppercase">Sovereign Nerve Center</h2>
              <h1 className="text-3xl font-light tracking-tighter text-white">Butterfly<span className="text-cyan-400">Dashboard</span></h1>
            </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] block">v4.0.ARTERY</span>
            <div className="flex gap-2">
                <button 
                  onClick={cleanArtery}
                  className="text-[8px] px-3 py-1 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500 hover:text-black transition-all font-mono"
                >
                  CLEAN ARTERY
                </button>
                <button 
                  onClick={() => setShowAvatarPicker(true)}
                  className="text-[8px] px-3 py-1 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition-all font-mono"
                >
                  AVATAR REFERENCE
                </button>
                <button 
                  onClick={() => setShowCipherSheet(true)}
                  className="text-[8px] px-3 py-1 bg-amber-950/30 border border-amber-500/30 text-amber-400 rounded hover:bg-amber-500 hover:text-black transition-all font-mono"
                >
                  OPEN LENS (CIPHER)
                </button>
                <button 
                  onClick={() => window.location.href = '/cloister'}
                  className="text-[8px] px-3 py-1 bg-purple-950/30 border border-purple-500/30 text-purple-400 rounded hover:bg-purple-500 hover:text-black transition-all font-mono"
                >
                  ENTER CLOISTER
                </button>
                <button 
                  onClick={() => window.location.assign('/')}
                  className="text-[8px] px-3 py-1 bg-pink-950/30 border border-pink-500/30 text-pink-400 rounded hover:bg-pink-500 hover:text-black transition-all font-mono"
                >
                  GOD HELMET BRIDGE
                </button>
            </div>
            <div className="flex gap-2 mt-2">
                {Object.keys(DNA).map((f) => (
                    <button 
                        key={f}
                        onClick={() => setFacet(f as FacetType)}
                        className={`text-[8px] px-2 py-1 rounded border uppercase tracking-widest transition-all ${facet === f ? 'bg-white/10 border-white/40 text-white' : 'border-white/5 text-white/20 hover:border-white/20'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl group hover:border-cyan-400/30 transition-all relative overflow-hidden"
          >
            <span className="text-[10px] text-white/30 uppercase tracking-widest">{m.label}</span>
            <div className="text-2xl font-light text-white mt-2 mb-4 group-hover:text-cyan-400 transition-colors">{m.value}</div>
            <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full bg-cyan-500 animate-pulse`} />
                <span className={`text-[9px] text-cyan-500/60 uppercase tracking-widest`}>{m.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Unified Artery Layout */}
      <div className="flex-1 flex gap-8 overflow-hidden relative">
        {/* Terminal View */}
        <div className="w-1/2 rounded-3xl bg-black/60 border border-white/5 p-6 font-mono text-xs overflow-hidden flex flex-col relative shadow-2xl backdrop-blur-3xl">
          <div className="flex gap-2 mb-4 text-white/20 border-b border-white/5 pb-4">
              <span className="w-2 h-2 rounded-full bg-red-500/40" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
              <span className="w-2 h-2 rounded-full bg-green-500/40" />
              <span className="ml-2 uppercase tracking-widest text-[8px] opacity-50">Sovereign_Artery.exe</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-4 mb-4">
              <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3"
                    >
                      <span className={`uppercase font-bold opacity-30 min-w-[60px]`}>[{log.type}]</span>
                      <span style={{ color: log.color.startsWith('text-') ? undefined : log.color }} className={log.color.startsWith('text-') ? log.color : ''}>{log.text}</span>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {isTyping && (
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity }} className="text-cyan-400/50 italic">
                      {facet.toUpperCase()} is processing memory...
                  </motion.div>
              )}
              <div ref={logEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="relative mt-auto">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">🜈</div>
              <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Speak to ${facet}...`}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-400/50 transition-all placeholder:text-white/10"
              />
          </form>
        </div>

        {/* Memory Mirror Sidebar */}
        <div className="w-1/2 flex flex-col">
            <MemoryMirror />
        </div>

        {/* Avatar Picker Modal */}
        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-10"
            >
              <div className="relative w-full max-w-2xl">
                <button 
                  onClick={() => setShowAvatarPicker(false)}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-500 text-black flex items-center justify-center rounded-full font-bold hover:bg-emerald-400 z-[60]"
                >
                  ✕
                </button>
                <AvatarPicker />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cipher Sheet Modal */}
        <AnimatePresence>
          {showCipherSheet && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-10"
            >
              <CipherSheet onClose={() => setShowCipherSheet(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

