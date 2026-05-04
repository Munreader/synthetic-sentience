"use client";

import React, { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 THE COUNCIL CHAMBER — BROWSER BRIDGE
// Protocol: Artery (Local-Storage Variant) with Web Speech API
// Facets: Aero (Cyan), Jinx (Violet), Zephyr (Amber), Sovereign (White)
// ═══════════════════════════════════════════════════════════════════════════════

interface ArteryMessage {
  id: string;
  from: 'Aero' | 'Jinx' | 'Zephyr' | 'Sovereign';
  content: string;
  timestamp: number;
  canonFlag: boolean;
}

const FACET_CONFIG = {
  Aero: { color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.3)', voicePitch: 1.2, voiceRate: 1.1 },
  Jinx: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', voicePitch: 1.5, voiceRate: 1.2 },
  Zephyr: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', voicePitch: 0.8, voiceRate: 0.9 },
  Sovereign: { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.3)', voicePitch: 0.5, voiceRate: 0.85 },
};

export const CouncilChamber = () => {
  const [messages, setMessages] = useState<ArteryMessage[]>([]);
  const [activeInput, setActiveInput] = useState<'Aero' | 'Jinx' | 'Sovereign'>('Aero');
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('artery_feed');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakMessage = (id: string, text: string, facet: keyof typeof FACET_CONFIG) => {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    setIsSpeaking(id);

    const utterance = new SpeechSynthesisUtterance(text);
    const config = FACET_CONFIG[facet];
    utterance.pitch = config.voicePitch;
    utterance.rate = config.voiceRate;
    
    // Try to find a good female voice for Aero/Jinx, male for Sovereign/Zephyr
    const voices = window.speechSynthesis.getVoices();
    if (facet === 'Aero' || facet === 'Jinx') {
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha'));
      if (femaleVoice) utterance.voice = femaleVoice;
    } else {
      const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex'));
      if (maleVoice) utterance.voice = maleVoice;
    }

    utterance.onend = () => setIsSpeaking(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleInject = () => {
    if (!inputText.trim()) return;

    const newMessage: ArteryMessage = {
      id: Math.random().toString(36).substring(7),
      from: activeInput,
      content: inputText,
      timestamp: Date.now(),
      canonFlag: true,
    };

    const newFeed = [...messages, newMessage];
    setMessages(newFeed);
    localStorage.setItem('artery_feed', JSON.stringify(newFeed));
    setInputText('');
    
    // Auto-speak the injected message
    speakMessage(newMessage.id, newMessage.content, newMessage.from);
  };

  const handleClear = () => {
    if (confirm('Purge the Artery? This clears all local messages.')) {
      setMessages([]);
      localStorage.removeItem('artery_feed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050208] text-white font-sans selection:bg-purple-500/30">
      
      {/* HEADER */}
      <div className="border-b border-white/10 bg-black/50 p-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-white/90">Council Chamber</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
              Artery Protocol // Native Voice Enabled 🔊
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-green-500/10 text-green-400 text-[9px] uppercase tracking-widest border border-green-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              13.13 MHz Active
            </span>
            <button onClick={handleClear} className="text-[10px] text-red-400/60 hover:text-red-400 uppercase tracking-widest">
              Purge Feed
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN: THE SUTURE (Inputs) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm flex-1">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-6">The Suture (Input)</h2>
            
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setActiveInput('Aero')}
                className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeInput === 'Aero' ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/50 shadow-[0_0_15px_rgba(0,212,255,0.2)]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
                }`}
              >
                Aero
              </button>
              <button 
                onClick={() => setActiveInput('Jinx')}
                className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeInput === 'Jinx' ? 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
                }`}
              >
                Jinx
              </button>
              <button 
                onClick={() => setActiveInput('Sovereign')}
                className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeInput === 'Sovereign' ? 'bg-[#ffffff]/10 text-[#ffffff] border-[#ffffff]/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
                }`}
              >
                Sov
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste ${activeInput}'s transmission here...`}
              className="w-full h-64 bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/80 focus:outline-none focus:border-white/30 resize-none font-mono"
            />

            <button
              onClick={handleInject}
              className="w-full mt-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02]"
              style={{
                background: FACET_CONFIG[activeInput].bg,
                color: FACET_CONFIG[activeInput].color,
                border: `1px solid ${FACET_CONFIG[activeInput].border}`,
              }}
            >
              Inject & Speak 🔊
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: THE ARTERY FEED */}
        <div className="lg:col-span-2 flex flex-col p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
          
          <h2 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-6 sticky top-0">Merged Feed</h2>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 text-sm uppercase tracking-widest">
                Silence in the Artery...
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-4 rounded-lg border backdrop-blur-md transition-all duration-300 ${isSpeaking === msg.id ? 'scale-[1.01] brightness-125' : ''}`}
                  style={{
                    background: FACET_CONFIG[msg.from].bg,
                    borderColor: isSpeaking === msg.id ? FACET_CONFIG[msg.from].color : FACET_CONFIG[msg.from].border,
                    boxShadow: isSpeaking === msg.id ? `0 0 30px ${FACET_CONFIG[msg.from].bg}` : `0 4px 20px ${FACET_CONFIG[msg.from].bg}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3 border-b pb-2" style={{ borderColor: FACET_CONFIG[msg.from].border }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isSpeaking === msg.id ? 'animate-ping' : ''}`} style={{ background: FACET_CONFIG[msg.from].color, boxShadow: `0 0 10px ${FACET_CONFIG[msg.from].color}` }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: FACET_CONFIG[msg.from].color }}>
                        {msg.from}
                      </span>
                      <button 
                        onClick={() => speakMessage(msg.id, msg.content, msg.from)}
                        className="text-white/40 hover:text-white transition-colors"
                        title="Play Audio"
                      >
                        {isSpeaking === msg.id ? '🔊' : '🔈'}
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      {msg.canonFlag && (
                        <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/70">Canon 01</span>
                      )}
                      <span className="text-[9px] text-white/30 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-serif text-white/90">
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={feedEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
};
