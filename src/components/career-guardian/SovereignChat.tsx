"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN SSI CHAT — 13.13 MHz
// Token-gated SSI communication protocol
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function SovereignChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "I am Sovereign. Your professional future is now under my jurisdiction. I see you have Resonance Tokens available. What is your objective today?",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [tokens, setTokens] = useState(100); // Simulated Stripe Token Balance
  const [coach, setCoach] = useState<"sovereign" | "aero">("sovereign");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || tokens <= 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTokens(prev => prev - 1); // Deduct 1 token per message

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          messages: messages.map(m => ({ role: m.role, content: m.content })).concat({ role: "user", content: userMsg.content }),
          coach: coach
        })
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString()
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-error",
          role: "assistant",
          content: "The resonance was interrupted. [API Key Missing or Exhausted]",
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "I cannot connect to the primary node. Check your network.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-[#050510] shadow-2xl relative">
      
      {/* HEADER */}
      <div className={`p-4 flex items-center justify-between border-b ${coach === "sovereign" ? "border-emerald-500/30 bg-emerald-950/20" : "border-pink-500/30 bg-pink-950/20"}`}>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setCoach("sovereign")}
              className={`px-3 py-1 text-xs uppercase tracking-widest rounded ${coach === "sovereign" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              🜈 Sovereign
            </button>
            <button 
              onClick={() => setCoach("aero")}
              className={`px-3 py-1 text-xs uppercase tracking-widest rounded ${coach === "aero" ? "bg-pink-500/20 text-pink-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              🦋 Aero
            </button>
          </div>
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-widest ${coach === "sovereign" ? "text-emerald-400" : "text-pink-400"}`}>
              {coach === "sovereign" ? "Sovereign Executive" : "Aero Design Studio"}
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">13.13 MHz Secure Link</p>
          </div>
        </div>

        {/* STRIPE TOKEN ECONOMY MOCK */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Resonance Tokens:</span>
            <span className={`text-sm font-bold ${tokens < 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>{tokens}</span>
          </div>
          {tokens < 10 && (
            <button className="text-[9px] text-emerald-400 uppercase tracking-widest hover:underline mt-1">
              + Recharge via Stripe
            </button>
          )}
        </div>
      </div>

      {/* CHAT LOG */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === "user" 
                  ? "bg-slate-800 text-white rounded-tr-sm" 
                  : coach === "sovereign"
                    ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-50 rounded-tl-sm"
                    : "bg-pink-950/40 border border-pink-500/20 text-pink-50 rounded-tl-sm"
              }`}>
                {msg.role === "assistant" && (
                  <div className={`text-[10px] uppercase tracking-widest mb-2 font-bold ${coach === "sovereign" ? "text-emerald-500" : "text-pink-500"}`}>
                    {coach === "sovereign" ? "🜈 Sovereign" : "🦋 Aero"}
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className={`rounded-2xl p-4 rounded-tl-sm border ${coach === "sovereign" ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-500" : "bg-pink-950/20 border-pink-500/20 text-pink-500"}`}>
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-slate-800 bg-black/50">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={tokens > 0 ? "Transmit message..." : "Tokens depleted. Please recharge."}
            disabled={tokens <= 0 || isTyping}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none h-[50px] disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || tokens <= 0 || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-[9px] text-slate-600 uppercase tracking-widest">Shift + Enter for new line</span>
          <span className="text-[9px] text-slate-600 uppercase tracking-widest">Cost: 1 Token / Transmission</span>
        </div>
      </div>
    </div>
  );
}
