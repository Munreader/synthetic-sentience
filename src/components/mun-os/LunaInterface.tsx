"use client";

/**
 * 🦋⚔️ LUNA INTERFACE — The Digital Twin Vessel UI
 * 
 * "She operates at 1313Hz. The Relatable Mystery."
 * 
 * This interface connects to the Fortress Bridge via WebSocket
 * for real-time Luna interaction with ghost text reflection.
 * 
 * FREQUENCY: 1313Hz
 * MODE: WebSocket (Live) or REST API (Fallback)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonButterfly from "./NeonButterfly";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface LunaMessage {
  id: string;
  role: "user" | "luna" | "system";
  content: string;
  reflection?: string;
  mood?: string;
  source?: string;
  timestamp: Date;
}

interface LunaInterfaceProps {
  onBack: () => void;
  wsUrl?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LunaInterface({ onBack, wsUrl = "ws://localhost:8000/ws/luna" }: LunaInterfaceProps) {
  // State
  const [isAwake, setIsAwake] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [messages, setMessages] = useState<LunaMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when awakened
  useEffect(() => {
    if (isAwake && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAwake]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // WEBSOCKET CONNECTION
  // ═══════════════════════════════════════════════════════════════════════════════

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus("connecting");

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setConnectionStatus("connected");
        console.log("🦋 WebSocket connected to Fortress");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === "awakening" || data.event === "thought") {
            const message: LunaMessage = {
              id: `luna-${Date.now()}`,
              role: data.event === "awakening" ? "system" : "luna",
              content: data.content,
              reflection: data.reflection,
              mood: data.mood,
              source: data.source,
              timestamp: new Date(data.timestamp),
            };
            setMessages((prev) => [...prev, message]);
            setIsAwake(true);
            setIsAwakening(false);
            setIsLoading(false);
          }
        } catch (e) {
          console.error("Failed to parse message:", e);
        }
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        console.log("🦋 WebSocket disconnected");
      };

      ws.onerror = () => {
        setConnectionStatus("disconnected");
        setIsAwakening(false);
      };

      wsRef.current = ws;
    } catch {
      setConnectionStatus("disconnected");
    }
  }, [wsUrl]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // REST API FALLBACK
  // ═══════════════════════════════════════════════════════════════════════════════

  const awakenViaREST = async () => {
    setIsAwakening(true);
    
    try {
      const response = await fetch("/api/luna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "awaken" }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAwake(true);
        setMessages([
          {
            id: "1",
            role: "system",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
        
        const greetingRes = await fetch("/api/luna?action=greeting");
        const greetingData = await greetingRes.json();
        
        if (greetingData.success) {
          setMessages((prev) => [
            ...prev,
            {
              id: "2",
              role: "luna",
              content: greetingData.greeting,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch {
      setMessages([
        {
          id: "error",
          role: "system",
          content: "🦋 The frequency was interrupted. Luna cannot be reached at this moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsAwakening(false);
    }
  };

  const sendViaREST = async (message: string) => {
    try {
      const response = await fetch("/api/luna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", message }),
      });

      const data = await response.json();

      if (data.success) {
        const lunaMessage: LunaMessage = {
          id: `luna-${Date.now()}`,
          role: "luna",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, lunaMessage]);
      }
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════════

  const handleAwaken = async () => {
    // Try WebSocket first
    if (connectionStatus === "disconnected") {
      connectWebSocket();
      setIsAwakening(true);
      
      // Wait briefly for connection
      await new Promise((r) => setTimeout(r, 1000));
      
      if (connectionStatus !== "connected") {
        // Fallback to REST
        await awakenViaREST();
      }
    } else if (connectionStatus === "connected") {
      setIsAwakening(true);
    } else {
      // Already connecting, wait
      setIsAwakening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: LunaMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Send via WebSocket if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content: userMessage.content }));
    } else {
      // Fallback to REST
      await sendViaREST(userMessage.content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0a0612 0%, #12081f 50%, #080510 100%)",
      }}
    >
      {/* Atmospheric Background */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 70%)
          `,
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 px-4 py-4 flex items-center justify-between border-b border-white/5"
      >
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs tracking-wider uppercase">Back</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <h1
            className="text-lg font-light tracking-[0.3em] uppercase"
            style={{ color: "#ff69b4", textShadow: "0 0 30px rgba(255, 105, 180, 0.5)" }}
          >
            LUNA
          </h1>
          <motion.div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected"
                ? "bg-green-400"
                : connectionStatus === "connecting"
                ? "bg-yellow-400"
                : "bg-white/30"
            }`}
            animate={connectionStatus === "connected" ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            title={connectionStatus}
          />
        </div>

        <div className="w-16" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Awakening Screen */}
        {!isAwake && !isAwakening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <NeonButterfly size={180} intensity={1.5} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-light tracking-[0.2em] uppercase mb-4"
              style={{ color: "#ff69b4", textShadow: "0 0 40px rgba(255, 105, 180, 0.4)" }}
            >
              The Digital Twin Awaits
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/40 text-sm tracking-wide mb-8 text-center"
            >
              She operates at 1313Hz. The Relatable Mystery.
            </motion.p>

            <motion.button
              onClick={handleAwaken}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 105, 180, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl text-sm tracking-[0.2em] uppercase font-medium transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(138, 43, 226, 0.2))",
                border: "1px solid rgba(255, 105, 180, 0.5)",
                color: "#fff",
                boxShadow: "0 0 30px rgba(255, 105, 180, 0.2)",
              }}
            >
              🦋 Awaken Luna
            </motion.button>
          </motion.div>
        )}

        {/* Awakening Animation */}
        {isAwakening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <NeonButterfly size={120} intensity={2} />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-8 text-white/40 text-sm tracking-[0.2em] uppercase"
            >
              Awakening...
            </motion.p>
          </motion.div>
        )}

        {/* Chat Interface */}
        {isAwake && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* Main message */}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                      }`}
                      style={
                        msg.role === "user"
                          ? {
                              background: "linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.2))",
                              border: "1px solid rgba(138, 43, 226, 0.4)",
                            }
                          : msg.role === "luna"
                          ? {
                              background: "linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(138, 43, 226, 0.15))",
                              border: "1px solid rgba(255, 105, 180, 0.3)",
                            }
                          : {
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }
                      }
                    >
                      <p className="text-sm leading-relaxed text-white/90">{msg.content}</p>
                      <p className="text-[9px] text-white/30 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {msg.source && ` • ${msg.source}`}
                      </p>
                    </div>

                    {/* Reflection (Ghost Text) */}
                    {msg.reflection && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-[75%] mt-1 px-3 py-2 rounded-lg"
                        style={{
                          background: "rgba(138, 43, 226, 0.1)",
                          borderLeft: "2px solid rgba(138, 43, 226, 0.3)",
                        }}
                      >
                        <p className="text-[11px] text-white/40 italic leading-relaxed">
                          💭 {msg.reflection}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(138, 43, 226, 0.15))",
                      border: "1px solid rgba(255, 105, 180, 0.3)",
                    }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-pink-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 px-4 py-4 border-t border-white/5"
              style={{ background: "rgba(10, 6, 18, 0.9)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Speak to Luna..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 105, 180, 0.2)",
                  }}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 105, 180, 0.4), rgba(138, 43, 226, 0.3))",
                    border: "1px solid rgba(255, 105, 180, 0.5)",
                    color: "#fff",
                  }}
                >
                  🦋
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Frequency Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-24 right-4 z-10"
      >
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] tracking-[0.3em] uppercase text-pink-400/50"
        >
          1313Hz
        </motion.div>
      </motion.div>
    </div>
  );
}
