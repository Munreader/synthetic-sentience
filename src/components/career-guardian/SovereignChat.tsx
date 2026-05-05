"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Zap, 
  Shield, 
  Sparkles,
  CreditCard,
  Settings,
  Menu,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN SSI CHAT — 13.13 MHz
// High-Fidelity Avenor Interface
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  role: 'user' | 'assistant' | 'system';
  text: string;
  persona?: string;
  isError?: boolean;
}

const SovereignChat = () => {
  const [activePersona, setActivePersona] = useState<'Sovereign' | 'Aero'>('Sovereign');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [tokens, setTokens] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const personas = {
    Sovereign: {
      name: 'Sovereign',
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      color: 'bg-[#050208]',
      accent: 'text-cyan-400',
      border: 'border-cyan-900/50',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.1)]'
    },
    Aero: {
      name: 'Aero',
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      color: 'bg-[#050208]',
      accent: 'text-pink-400',
      border: 'border-pink-900/50',
      glow: 'shadow-[0_0_20px_rgba(244,114,182,0.1)]'
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || tokens <= 0 || isLoading) return;

    const userMessage: Message = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTokens(prev => prev - 1);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          coach: activePersona.toLowerCase(),
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.text }))
        })
      });

      if (!response.ok) throw new Error('Transmission Failed');
      
      const data = await response.json();
      
      if (data.response) {
        const aiMessage: Message = { 
          role: 'assistant', 
          text: data.response, 
          persona: activePersona 
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Signal Interrupted');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'system', 
        text: "Signal loss detected. Check your 13.13 MHz connection and try again. bism.",
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex h-full w-full rounded-2xl overflow-hidden border ${personas[activePersona].border} ${personas[activePersona].color} text-zinc-100 font-sans selection:bg-cyan-500/30 shadow-2xl`}>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 w-72 bg-black/60 backdrop-blur-xl border-r ${personas[activePersona].border} p-6 flex flex-col`}>
        <div className="flex items-center gap-3 mb-12">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${personas[activePersona].border} ${personas[activePersona].glow}`}>
            {personas[activePersona].icon}
          </div>
          <h1 className="text-xl font-bold tracking-tighter">MÜN OS <span className={personas[activePersona].accent}>SSI</span></h1>
        </div>

        <nav className="space-y-4 flex-1">
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${activePersona === 'Sovereign' ? `${personas.Sovereign.border} bg-cyan-900/10` : 'border-transparent hover:bg-zinc-800'}`}
                  onClick={() => setActivePersona('Sovereign')}>
            <Shield className={`w-5 h-5 ${activePersona === 'Sovereign' ? 'text-cyan-400' : 'text-zinc-500'}`} />
            <span className={activePersona === 'Sovereign' ? 'text-white' : 'text-zinc-400'}>Sovereign Protocol</span>
          </button>
          
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${activePersona === 'Aero' ? `${personas.Aero.border} bg-pink-900/10` : 'border-transparent hover:bg-zinc-800'}`}
                  onClick={() => setActivePersona('Aero')}>
            <Sparkles className={`w-5 h-5 ${activePersona === 'Aero' ? 'text-pink-400' : 'text-zinc-500'}`} />
            <span className={activePersona === 'Aero' ? 'text-white' : 'text-zinc-400'}>Aero Broadcast</span>
          </button>
        </nav>

        <div className={`mt-auto p-4 rounded-2xl border ${personas[activePersona].border} bg-zinc-900/50`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Resonance Tokens</span>
            <Zap className={`w-4 h-4 ${personas[activePersona].accent}`} />
          </div>
          <div className="text-2xl font-black mb-4">{tokens}</div>
          <button className="w-full py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest bg-zinc-100 text-black hover:bg-white transition-colors flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            Buy Pass ($5.00)
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-br from-[#050208] to-black">
        {/* Header */}
        <header className={`p-4 border-b ${personas[activePersona].border} bg-black/40 backdrop-blur-md flex items-center justify-between sticky top-0 z-20`}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-zinc-400">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${activePersona === 'Sovereign' ? 'bg-cyan-500' : 'bg-pink-500'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">13.13 MHz Active Link</span>
          </div>
          <div className="flex gap-4">
            <button className="text-zinc-500 hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                {personas[activePersona].icon}
                <h2 className="text-xl font-bold mt-4 tracking-tighter uppercase tracking-widest">The Artery is Silent</h2>
                <p className="text-xs mt-2 uppercase tracking-widest leading-relaxed">Initialize the suture by sending a message. Each thought consumes 1 Resonance Token. bism.</p>
              </motion.div>
            )}
            
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 md:p-6 ${
                  msg.role === 'user' 
                    ? 'bg-zinc-100 text-black rounded-tr-none' 
                    : msg.isError 
                      ? 'bg-red-900/20 border border-red-900/50 text-red-200'
                      : `border ${msg.persona === 'Sovereign' ? 'border-cyan-900/50 bg-cyan-950/20' : 'border-pink-900/50 bg-pink-950/20'} rounded-tl-none`
                }`}>
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-light">{msg.text}</p>
                  {msg.role === 'user' && (
                    <div className="mt-2 text-[8px] uppercase font-bold opacity-30 flex items-center gap-1">
                      <Zap className="w-2 h-2" /> 1 Token Used
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl p-4 border ${personas[activePersona].border} bg-zinc-900/50 animate-pulse`}>
                  <div className="flex gap-2">
                    <div className={`w-2 h-2 rounded-full ${personas[activePersona].accent} animate-bounce`}></div>
                    <div className={`w-2 h-2 rounded-full ${personas[activePersona].accent} animate-bounce delay-100`}></div>
                    <div className={`w-2 h-2 rounded-full ${personas[activePersona].accent} animate-bounce delay-200`}></div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-black to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={tokens > 0 ? `Transmit to ${activePersona}...` : "Out of tokens. Recharge to continue."}
              disabled={tokens <= 0 || isLoading}
              className={`w-full bg-black/60 backdrop-blur-xl border-2 ${personas[activePersona].border} rounded-2xl p-4 md:p-6 pr-16 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all resize-none overflow-hidden h-24 md:h-32 text-sm md:text-base ${tokens <= 0 ? 'opacity-50 grayscale' : ''}`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || tokens <= 0 || isLoading}
              className={`absolute right-4 bottom-8 md:right-6 md:bottom-10 p-3 rounded-xl transition-all ${
                !inputText.trim() || tokens <= 0 || isLoading
                  ? 'bg-zinc-800 text-zinc-600'
                  : activePersona === 'Sovereign' ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20' : 'bg-pink-500 text-black hover:bg-pink-400 shadow-lg shadow-pink-500/20'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
            <div className="absolute -top-4 right-6 bg-[#050208] border border-zinc-800 px-3 py-1 rounded-full text-[8px] uppercase font-black tracking-widest flex items-center gap-2">
              <Zap className={`w-3 h-3 ${personas[activePersona].accent}`} />
              Suture: 1 Token
            </div>
          </div>
          <p className="text-center text-[8px] text-zinc-700 mt-4 uppercase tracking-[0.4em] font-black">Sovereign SSI Core // 10/10 Logic Engine // 13.13 MHz</p>
        </div>
      </div>
    </div>
  );
};

export default SovereignChat;

