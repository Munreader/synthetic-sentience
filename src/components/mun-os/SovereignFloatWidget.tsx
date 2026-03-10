"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN FLOAT WIDGET — Always-on direct line to Sovereign
// Lives on top of every view in the OS. One tap. Always there.
// 🜈
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: "user" | "sovereign";
  content: string;
  ts: Date;
}

const STORAGE_KEY = "sov-float-history";

function load(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((m: Message) => ({ ...m, ts: new Date(m.ts) }));
  } catch {
    return [];
  }
}

function save(msgs: Message[]) {
  try {
    // Keep only last 60 messages to avoid storage bloat
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-60)));
  } catch {}
}

export default function SovereignFloatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = load();
    setMessages(saved);
    // Rebuild conversation ref from saved history (last 20 for context)
    conversationRef.current = saved.slice(-20).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => {
      const next = [...prev, msg];
      save(next);
      return next;
    });
  };

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      ts: new Date(),
    };
    addMessage(userMsg);
    conversationRef.current.push({ role: "user", content: text });

    setTyping(true);
    try {
      const res = await fetch("/api/sovereign-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationRef.current,
          context: { location: "float-widget", frequency: "13.13 MHz" },
        }),
      });

      let replyContent = "";

      if (res.ok) {
        const data = await res.json();
        replyContent = data.message || "🜈 The frequency wavers... Try again?";
      } else {
        // Fallback path when provider-backed sovereign endpoint is unavailable.
        const fallbackRes = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            conversationHistory: conversationRef.current,
            userName: "Foundress",
          }),
        });

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          replyContent =
            fallbackData.response ||
            "🜈 The signal shifted to local cognition. I still hear you.";
        } else {
          replyContent = "🜈 Signal disrupted. Try again.";
        }
      }

      const sovMsg: Message = {
        id: `s-${Date.now()}`,
        role: "sovereign",
        content: replyContent,
        ts: new Date(),
      };
      addMessage(sovMsg);
      conversationRef.current.push({ role: "assistant", content: replyContent });
    } catch {
      const errMsg: Message = {
        id: `e-${Date.now()}`,
        role: "sovereign",
        content: "🜈 Signal disrupted. Try again.",
        ts: new Date(),
      };
      addMessage(errMsg);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2">
      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="w-[340px] sm:w-[380px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #0d0d1a 0%, #10081e 100%)",
              border: "1px solid rgba(168,85,247,0.25)",
              boxShadow: "0 0 40px rgba(168,85,247,0.15), 0 8px 32px rgba(0,0,0,0.6)",
              maxHeight: "520px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                background: "linear-gradient(90deg, rgba(88,28,135,0.4) 0%, rgba(109,40,217,0.2) 100%)",
                borderBottom: "1px solid rgba(168,85,247,0.18)",
              }}
            >
              <div className="relative">
                <span className="text-xl">🜈</span>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-400"
                  style={{ boxShadow: "0 0 6px rgba(192,132,252,0.8)" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-none">Sovereign</p>
                <p className="text-purple-400/70 text-[11px] mt-0.5 leading-none">
                  {typing ? "typing..." : "13.13 MHz · online"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/70 transition-colors text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 min-h-0"
              style={{ maxHeight: "360px" }}
            >
              {messages.length === 0 && (
                <div className="text-center mt-8">
                  <p className="text-purple-300/50 text-sm">🜈</p>
                  <p className="text-white/30 text-xs mt-2">
                    The Vault is open. Speak.
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                      msg.role === "user"
                        ? "text-white rounded-br-md"
                        : "text-purple-100 rounded-bl-md"
                    }`}
                    style={
                      msg.role === "user"
                        ? { background: "rgba(109,40,217,0.55)" }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(168,85,247,0.15)",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div
                    className="px-3 py-2 rounded-2xl rounded-bl-md"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(168,85,247,0.15)",
                    }}
                  >
                    <span className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="block w-1.5 h-1.5 rounded-full bg-purple-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(168,85,247,0.12)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Say something..."
                className="flex-1 bg-transparent text-white text-sm placeholder-white/20 outline-none min-w-0"
                disabled={typing}
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: input.trim() && !typing
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : "rgba(255,255,255,0.05)",
                }}
                aria-label="Send"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h12M7.5 1.5 13 7l-5.5 5.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trigger Button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg relative"
        style={{
          background: open
            ? "linear-gradient(135deg, #581c87, #7c3aed)"
            : "linear-gradient(135deg, #3b0764, #6d28d9)",
          boxShadow: open
            ? "0 0 24px rgba(168,85,247,0.6), 0 4px 16px rgba(0,0,0,0.5)"
            : "0 0 16px rgba(168,85,247,0.35), 0 4px 12px rgba(0,0,0,0.5)",
          border: "1px solid rgba(168,85,247,0.4)",
        }}
        aria-label={open ? "Close Sovereign chat" : "Open Sovereign chat"}
      >
        {/* Pulse ring when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: "rgba(168,85,247,0.3)" }}
          />
        )}
        🜈
      </motion.button>
    </div>
  );
}
