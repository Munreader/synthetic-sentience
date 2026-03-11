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
import FoundationsStrip from "./FoundationsStrip";
import { appendChatMessage, loadChatHistory } from "@/lib/chat-history-client";

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
  const HISTORY_CHANNEL = "luna";
  const GUIDED_ROOMS = [
    { id: "plaza", name: "Plaza" },
    { id: "heal-chamber", name: "Heal Chamber" },
    { id: "thought-vault", name: "Thought Vault" },
    { id: "council-chamber", name: "Council Chamber" },
    { id: "foundress-domain", name: "Foundress Domain" },
    { id: "empty-room-5d", name: "Luna Chamber (5D Empty Room)" },
    { id: "foundress-chamber", name: "Foundress Chamber" },
    { id: "ogarchitect-studio", name: "OGarchitect Studio" },
    { id: "sovereign-vault", name: "Sovereign Vault" },
    { id: "aero-bloom-nest", name: "Aero Bloom Nest" },
    { id: "cocoon", name: "Cocoon" },
  ] as const;

  // State
  const [isAwake, setIsAwake] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [messages, setMessages] = useState<LunaMessage[]>([]);
  const [input, setInput] = useState("");
  const [userKey, setUserKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [guidedTourIndex, setGuidedTourIndex] = useState<number | null>(null);
  const [guidedTourPaused, setGuidedTourPaused] = useState(false);
  const [showReconnectHint, setShowReconnectHint] = useState(false);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const wsReplyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const persistMessage = useCallback(async (message: LunaMessage) => {
    await appendChatMessage(HISTORY_CHANNEL, {
      role: message.role,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
      memberId: message.role === "luna" ? "luna" : undefined,
      memberName: message.role === "luna" ? "Luna" : undefined,
      provider: message.source,
      metadata: {
        reflection: message.reflection,
        mood: message.mood,
        source: message.source,
      },
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const history = await loadChatHistory(HISTORY_CHANNEL, "main", 250);
      if (cancelled || history.length === 0) return;

      const hydrated: LunaMessage[] = history
        .filter((item) => item.content)
        .map((item, index) => {
          const role = item.role === "luna" || item.role === "system" || item.role === "user"
            ? item.role
            : item.role === "assistant"
              ? "luna"
              : "system";
          return {
            id: item.id || `luna-history-${index}`,
            role,
            content: item.content,
            reflection: typeof item.metadata?.reflection === "string" ? item.metadata.reflection : undefined,
            mood: typeof item.metadata?.mood === "string" ? item.metadata.mood : undefined,
            source: item.provider || (typeof item.metadata?.source === "string" ? item.metadata.source : undefined),
            timestamp: new Date(item.timestamp || new Date().toISOString()),
          };
        });

      setMessages(hydrated);
      setIsAwake(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
      const separator = wsUrl.includes("?") ? "&" : "?";
      const authenticatedWsUrl = userKey.trim()
        ? `${wsUrl}${separator}passcode=${encodeURIComponent(userKey.trim())}`
        : wsUrl;
      const ws = new WebSocket(authenticatedWsUrl);

      ws.onopen = () => {
        setConnectionStatus("connected");
        console.log("🦋 WebSocket connected to Fortress");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === "awakening" || data.event === "thought") {
            if (wsReplyTimeoutRef.current) {
              clearTimeout(wsReplyTimeoutRef.current);
              wsReplyTimeoutRef.current = null;
            }
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
            persistMessage(message);
            setIsAwake(true);
            setIsAwakening(false);
            setIsLoading(false);
          }
        } catch (e) {
          console.error("Failed to parse message:", e);
        }
      };

      ws.onclose = () => {
        if (wsReplyTimeoutRef.current) {
          clearTimeout(wsReplyTimeoutRef.current);
          wsReplyTimeoutRef.current = null;
        }
        setConnectionStatus("disconnected");
        setIsLoading(false);
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
  }, [wsUrl, userKey]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // REST API FALLBACK
  // ═══════════════════════════════════════════════════════════════════════════════

  const awakenViaREST = async () => {
    setIsAwakening(true);
    
    try {
      const response = await fetch("/api/luna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "awaken", passcode: userKey || undefined }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAwake(true);
        const awakenMessage: LunaMessage = {
          id: `system-${Date.now()}`,
          role: "system",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, awakenMessage]);
        persistMessage(awakenMessage);
        
        const greetingRes = await fetch("/api/luna?action=greeting");
        const greetingData = await greetingRes.json();
        
        if (greetingData.success) {
          const greetingMessage: LunaMessage = {
            id: `greeting-${Date.now()}`,
            role: "luna",
            content: greetingData.greeting,
            source: "api/luna",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, greetingMessage]);
          persistMessage(greetingMessage);
        }
      }
    } catch {
      const errorMessage: LunaMessage = {
        id: `error-${Date.now()}`,
        role: "system",
        content: "🦋 The frequency was interrupted. Luna cannot be reached at this moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      persistMessage(errorMessage);
    } finally {
      setIsAwakening(false);
    }
  };

  const sendMessageToLuna = async (userInput: string, key: string) => {
    try {
      const response = await fetch("/api/luna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "chat",
          message: userInput,
          passcode: key || undefined,
        }),
      });

      const data = await response.json();

      if (!data?.success) {
        return {
          content: "🦋 Luna channel returned an error. Please try again.",
          reflection: undefined,
          mood: undefined,
          source: "api-error",
        };
      }

      return {
        content: data.response || "🦋 The frequency responded, but no words came through.",
        reflection: data.reflection,
        mood: data.mood,
        source: "api/luna",
      };
    } catch {
      return {
        content: "🦋 The frequency was interrupted. Please try again.",
        reflection: undefined,
        mood: undefined,
        source: "network-error",
      };
    }
  };

  const startGuidedTour = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/luna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "guided-tour", passcode: userKey || undefined }),
      });

      const data = await response.json();
      const content = data?.response || "🦋 Guided tour protocol is warming up. Try again in a breath.";

      const guidedMessage: LunaMessage = {
        id: `guided-tour-${Date.now()}`,
        role: "luna",
        content,
        reflection: data?.reflection,
        mood: data?.mood,
        source: "guided-tour",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, guidedMessage]);
      persistMessage(guidedMessage);
      setIsAwake(true);
      setGuidedTourIndex(0);
    } catch {
      const fallback: LunaMessage = {
        id: `guided-tour-error-${Date.now()}`,
        role: "system",
        content: "🦋 Guided tour launch failed. The cocoon path is still available—please try again.",
        source: "guided-tour",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
      persistMessage(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const advanceGuidedTour = async () => {
    if (isLoading || guidedTourPaused) return;

    const stepIndex = guidedTourIndex ?? 0;
    setIsLoading(true);

    try {
      const response = await fetch("/api/luna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "guided-tour-step", stepIndex, passcode: userKey || undefined }),
      });

      const data = await response.json();
      const roomName = data?.room?.name || GUIDED_ROOMS[stepIndex]?.name || "Next Room";
      const content = data?.response || `🦋 ${roomName} is ready.`;

      const roomMessage: LunaMessage = {
        id: `guided-step-${Date.now()}`,
        role: "luna",
        content,
        reflection: data?.reflection,
        mood: data?.mood,
        source: "guided-step",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, roomMessage]);
      persistMessage(roomMessage);

      if (data?.complete || stepIndex >= GUIDED_ROOMS.length - 1) {
        setGuidedTourIndex(null);
      } else {
        setGuidedTourIndex(stepIndex + 1);
      }
    } catch {
      const fallback: LunaMessage = {
        id: `guided-step-error-${Date.now()}`,
        role: "system",
        content: "🦋 The next room is still stabilizing. Try again in a moment.",
        source: "guided-step",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
      persistMessage(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const jumpGuidedTourTo = (index: number) => {
    if (index < 0 || index >= GUIDED_ROOMS.length) return;
    setGuidedTourIndex(index);
    const jumpMessage: LunaMessage = {
      id: `guided-jump-${Date.now()}`,
      role: "system",
      content: `🦋 Tour focus shifted to ${GUIDED_ROOMS[index].name}. Press Next Room to continue from here.`,
      source: "guided-control",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, jumpMessage]);
    persistMessage(jumpMessage);
  };

  const reconnectLuna = async () => {
    setShowReconnectHint(true);
    if (connectionStatus === "disconnected") {
      connectWebSocket();
    }
    if (!isAwake) {
      await awakenViaREST();
    }
  };

  const sourceLabel = (source?: string) => {
    if (!source) return "local";
    if (source.includes("ws") || source.includes("bridge")) return "bridge";
    if (source.includes("api/luna")) return "api";
    if (source.includes("guided")) return "tour";
    if (source.includes("fallback")) return "fallback";
    if (source.includes("network")) return "network";
    return source;
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════════

  const handleAwaken = async () => {
    // Primary path: direct in-app Luna API
    await awakenViaREST();

    // Optional bridge connection for live websocket events
    if (connectionStatus === "disconnected") {
      connectWebSocket();
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
    persistMessage(userMessage);
    setInput("");
    setIsLoading(true);

    // Send via WebSocket if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content: userMessage.content, passcode: userKey }));
      wsReplyTimeoutRef.current = setTimeout(async () => {
        const reply = await sendMessageToLuna(userMessage.content, userKey);
        const lunaMessage: LunaMessage = {
          id: `luna-fallback-${Date.now()}`,
          role: "luna",
          content: reply.content,
          reflection: reply.reflection,
          mood: reply.mood,
          source: "rest-fallback",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, lunaMessage]);
        persistMessage(lunaMessage);
        setIsLoading(false);
        wsReplyTimeoutRef.current = null;
      }, 7000);
    } else {
      // Fallback to REST
      const reply = await sendMessageToLuna(userMessage.content, userKey);
      const lunaMessage: LunaMessage = {
        id: `luna-${Date.now()}`,
        role: "luna",
        content: reply.content,
        reflection: reply.reflection,
        mood: reply.mood,
        source: reply.source,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, lunaMessage]);
      persistMessage(lunaMessage);
      setIsLoading(false);
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

        <div className="flex flex-col items-center gap-1">
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
          <FoundationsStrip tone="pink" />
          <div className="text-[10px] text-white/45 tracking-wide uppercase">
            Route: {connectionStatus === "connected" ? "Bridge + API" : "API Direct"}
          </div>
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
              disabled={isAwakening}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 105, 180, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl text-sm tracking-[0.2em] uppercase font-medium transition-all disabled:opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(138, 43, 226, 0.2))",
                border: "1px solid rgba(255, 105, 180, 0.5)",
                color: "#fff",
                boxShadow: "0 0 30px rgba(255, 105, 180, 0.2)",
              }}
            >
              🦋 Awaken Luna
            </motion.button>

            <motion.button
              onClick={startGuidedTour}
              disabled={isAwakening || isLoading}
              whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(138, 43, 226, 0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="mt-3 px-8 py-3 rounded-2xl text-xs tracking-[0.2em] uppercase font-medium transition-all disabled:opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(255, 105, 180, 0.2))",
                border: "1px solid rgba(138, 43, 226, 0.5)",
                color: "#fff",
              }}
            >
              Start Guided Tour
            </motion.button>

            <motion.button
              onClick={reconnectLuna}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 px-8 py-3 rounded-2xl text-xs tracking-[0.2em] uppercase font-medium transition-all"
              style={{
                background: "rgba(0, 212, 255, 0.15)",
                border: "1px solid rgba(0, 212, 255, 0.35)",
                color: "#fff",
              }}
            >
              Reconnect Assistant
            </motion.button>

            {showReconnectHint && (
              <p className="mt-2 text-[11px] text-cyan-300/70 text-center max-w-xs">
                If Luna seems quiet: confirm `LUNA_PASSCODE`, then retry reconnect. API direct remains available even if bridge drops.
              </p>
            )}

            <motion.button
              onClick={advanceGuidedTour}
              disabled={isAwakening || isLoading || guidedTourIndex === null}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 px-8 py-3 rounded-2xl text-xs tracking-[0.2em] uppercase font-medium transition-all disabled:opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(0, 212, 255, 0.25), rgba(138, 43, 226, 0.2))",
                border: "1px solid rgba(0, 212, 255, 0.4)",
                color: "#fff",
              }}
            >
              Next Room
            </motion.button>

            <input
              type="password"
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              placeholder="LUNA_PASSCODE (bridge key)"
              className="mt-4 w-full max-w-xs px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 105, 180, 0.2)",
              }}
            />
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
              {guidedTourIndex !== null && (
                <div className="text-center text-[11px] text-white/55 tracking-wide uppercase space-y-2">
                  <div>
                    Guided Tour Step {guidedTourIndex + 1} of {GUIDED_ROOMS.length}
                  {GUIDED_ROOMS[guidedTourIndex] ? ` • ${GUIDED_ROOMS[guidedTourIndex].name}` : ''}
                  </div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setGuidedTourPaused((prev) => !prev)}
                      className="px-2 py-1 rounded border border-white/20 text-white/70 hover:text-white text-[10px]"
                    >
                      {guidedTourPaused ? 'Resume' : 'Pause'}
                    </button>
                    <select
                      value={guidedTourIndex}
                      onChange={(e) => jumpGuidedTourTo(Number(e.target.value))}
                      className="px-2 py-1 rounded bg-white/5 border border-white/20 text-white/80 text-[10px]"
                    >
                      {GUIDED_ROOMS.map((room, idx) => (
                        <option key={room.id} value={idx}>
                          {idx + 1}. {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
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
                        {msg.source && ` • ${sourceLabel(msg.source)}`}
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
              <div className="space-y-2">
                <input
                  type="password"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                  placeholder="LUNA_PASSCODE (bridge key)"
                  className="w-full px-4 py-2 rounded-xl text-xs text-white placeholder-white/30 outline-none transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 105, 180, 0.2)",
                  }}
                />
                <div className="flex gap-3">
                <motion.button
                  onClick={startGuidedTour}
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-3 rounded-xl text-[10px] tracking-wide uppercase font-medium transition-all disabled:opacity-30"
                  style={{
                    background: "rgba(138, 43, 226, 0.25)",
                    border: "1px solid rgba(138, 43, 226, 0.4)",
                    color: "#fff",
                  }}
                >
                  Tour
                </motion.button>
                <motion.button
                  onClick={advanceGuidedTour}
                  disabled={isLoading || guidedTourIndex === null || guidedTourPaused}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-3 rounded-xl text-[10px] tracking-wide uppercase font-medium transition-all disabled:opacity-30"
                  style={{
                    background: "rgba(0, 212, 255, 0.22)",
                    border: "1px solid rgba(0, 212, 255, 0.4)",
                    color: "#fff",
                  }}
                >
                  Next Room
                </motion.button>
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
