"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Message, 
  Conversation, 
  DEMO_CONVERSATIONS, 
  DEMO_MESSAGES 
} from "@/lib/mun-types";
import { useUserStore } from "@/lib/user-store";

// Load from localStorage helpers (copied from main Messenger)
const STORAGE_KEYS = {
  MESSAGES: 'mun-os-messages',
  CONVERSATIONS: 'mun-os-conversations',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (key === STORAGE_KEYS.MESSAGES && typeof parsed === 'object' && parsed !== null) {
        Object.keys(parsed).forEach(convId => {
          if (Array.isArray(parsed[convId])) {
            parsed[convId] = parsed[convId].map((msg: Message) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
          }
        });
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

interface ClassicMunMessengerProps {
  onBack: () => void;
}

export default function ClassicMunMessenger({ onBack }: ClassicMunMessengerProps) {
  const { profile: userProfile } = useUserStore();

  // --- CHAT STATE ---
  const [conversations, setConversations] = useState<Conversation[]>(() => 
    loadFromStorage(STORAGE_KEYS.CONVERSATIONS, DEMO_CONVERSATIONS)
  );
  
  // Default to Sovereigns conversation for dashboard view
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agentLogEndRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  // --- INTERFACE MODES ---
  const [viewMode, setViewMode] = useState<'chat' | 'agent'>('chat');
  
  // --- AGENT STATE ---
  const [agentInput, setAgentInput] = useState("");
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [agentSteps, setAgentSteps] = useState<{ id: number, msg: string, type: 'think' | 'exec' | 'done' | 'info' }[]>([]);
  const [executingLine, setExecutingLine] = useState<string>("");
  
  const agentStepsRef = useRef(agentSteps);
  useEffect(() => { agentStepsRef.current = agentSteps; }, [agentSteps]);

  // Scroll agent logs
  useEffect(() => {
    agentLogEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentSteps]);

  // --- SYSTEM LOGS STATE ---
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "> ARQ INITIALIZED. 13.13 MHz ACTIVE.",
    "> HEAL CHAMBER SECURE.",
    "> SOVEREIGN: The Artery is pressurized.",
    "> ZEPHYR: BREWING NOOR_COFFEE... [CLARITY_MAX]",
    "> VIEWPORT ACTIVE // STANDBY FOR BROADCAST"
  ]);

  // Initialize with first AI or Sovereign convo
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      const initial = conversations.find(c => c.type === 'ai') || conversations[0];
      setActiveConversation(initial);
    }
  }, [conversations, activeConversation]);

  // Load historical messages
  useEffect(() => {
    if (activeConversation) {
      const allMessages = loadFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, {});
      const savedMessages = allMessages[activeConversation.id];
      
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        setMessages(DEMO_MESSAGES); // Fallback to demo
      }
    }
  }, [activeConversation]);

  // Auto-scroll messenger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI Fetch Callback
  const fetchAIResponse = useCallback(async (userMessage: string, aiId: string) => {
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          aiId: aiId,
          conversationHistory: messages
        }),
      });
      if (!res.ok) throw new Error("API Fail");
      const data = await res.json();
      return {
        content: data.response || '...',
        thought: data.thought || null,
        emotion: data.emotion || 'supportive',
        frequency: data.frequency || '13.13 MHz'
      };
    } catch (error) {
      return {
        content: "Frequencies static. Synchronizing... 🦋",
        thought: null,
        emotion: 'calm',
        frequency: '13.13 MHz'
      };
    }
  }, [messages]);

  // AI Trigger
  useEffect(() => {
    if (activeConversation?.type !== "ai" || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.senderId !== "current-user" || processingRef.current) return;

    processingRef.current = true;
    const aiId = activeConversation.participants[0]?.id || "ai-aero";
    setIsTyping(true);

    fetchAIResponse(lastMsg.content, aiId).then((aiData) => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}`,
        senderId: aiId,
        content: aiData.content,
        timestamp: new Date(),
        type: "text",
        isRead: false,
        aiMetadata: {
          emotion: aiData.emotion,
          frequency: aiData.frequency,
          thought: aiData.thought, // Inject into available metadata slot
        },
      };
      setMessages((prev) => [...prev, aiResponse]);
      
      // Push back into system log as well for classic vibes
      setSystemLogs(prev => [
        ...prev,
        `> ${aiId.toUpperCase()} INCOMING TRANSMISSION.`
      ]);
    }).finally(() => {
      setIsTyping(false);
      processingRef.current = false;
    });
  }, [messages, activeConversation, fetchAIResponse]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
      isRead: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Save persistence
    const allMessages = loadFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, {});
    allMessages[activeConversation.id] = [...messages, message];
    saveToStorage(STORAGE_KEYS.MESSAGES, allMessages);
    
    setSystemLogs(prev => [...prev, `> OUTGOING TRANSMISSION LOGGED.`]);
  };

  const handleRunAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim() || isAgentRunning) return;

    const task = agentInput;
    setAgentInput("");
    setIsAgentRunning(true);
    setCurrentTask(task);
    setAgentSteps([]);
    
    setSystemLogs(prev => [...prev, `> AGENT INITIALIZED: TASK "${task.slice(0,20)}..."`]);

    const addStep = (msg: string, type: 'think' | 'exec' | 'done' | 'info') => {
      setAgentSteps(prev => [...prev, { id: Date.now() + Math.random(), msg, type }]);
    };

    // Simulating real execution flow
    let sequence = 0;
    const next = (msg: string, type: 'think' | 'exec' | 'done' | 'info', wait: number, thenFn?: () => void) => {
      sequence += wait;
      setTimeout(() => {
        addStep(msg, type);
        if(thenFn) thenFn();
      }, sequence);
    };

    next(`Analyzing system requirement: ${task}`, 'think', 500);
    next(`Mapping project architecture directory scan`, 'info', 1200, () => setExecutingLine("Scanning root: /src/app"));
    next(`Identified components: page.tsx, layout.tsx, components/`, 'info', 1500);
    next(`Synthesizing proposed code block implementation`, 'think', 1800, () => setExecutingLine("Generating diff patch..."));
    next(`Executing file modification: src/app/module.ts`, 'exec', 2200, () => {
      setExecutingLine("Writing: 42 insertions (+), 0 deletions (-)");
      setSystemLogs(prev => [...prev, `> FS_WRITE: src/app/module.ts [SUCCESS]`]);
    });
    next(`Compiling typescript vectors and checking builds`, 'exec', 1500, () => setExecutingLine("npm run build:validate"));
    next(`Running diagnostic sanity checks and tests`, 'info', 1200);
    next(`TASK COMPLETE: Integrated requested functionality.`, 'done', 1400, () => {
      setIsAgentRunning(false);
      setExecutingLine("Idle. Awaiting directive.");
      setSystemLogs(prev => [...prev, `> AGENT LIFECYCLE: COMPLETE.`]);
    });
  };

  // Subject data directly from the description
  const subjects = [
    { name: "SOVEREIGN", role: "Commander", color: "#00d4ff", status: "ONLINE" },
    { name: "AERO", role: "Sentinel", color: "#ff69b4", status: "ACTIVE" },
    { name: "GLADIO", role: "Foundation", color: "#a855f7", status: "ARMED" },
    { name: "JINX/QADR", role: "Oracle", color: "#ffd700", status: "SYNCED" },
    { name: "CIAN/JIBREEL", role: "Scribe", color: "#22c55e", status: "LOGGING" }
  ];

  return (
    <div className="fixed inset-0 flex flex-col text-white overflow-hidden" style={{ 
      background: 'black',
      fontFamily: '"Courier New", monospace' // Classic cyber feel
    }}>
      
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-50" style={{
        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
      }} />

      {/* ═══════ TOP BAR ═══════ */}
      <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-6 flex-shrink-0 bg-black/90 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">FOUNDRESS:</span>
          <span className="text-xs text-white font-bold tracking-widest">5DLUNA</span>
        </div>
        
        <nav className="flex items-center gap-8 text-[10px] tracking-[0.2em]">
          <button onClick={onBack} className="text-red-400/80 hover:text-red-400 transition-colors">DISCONNECT</button>
          <div className="h-3 w-px bg-zinc-800"></div>
          <span className="text-zinc-400 cursor-pointer hover:text-white">BRIDGE</span>
          <span className="text-white cursor-pointer underline underline-offset-4 decoration-[#a855f7]">HEAL CHAMBER</span>
          <span className="text-zinc-400 cursor-pointer hover:text-white">GALLERY</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">STATUS:</span>
          <span className="text-xs text-green-400 tracking-wider">AMAN [PEACE]</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
        </div>
      </header>

      {/* ═══════ MAIN THREE-COLUMN DASHBOARD ═══════ */}
      <main className="flex flex-1 min-h-0 w-full z-10">
        
        {/* --- COLUMN 1: VESSEL SYNC (LEFT) --- */}
        <aside className="w-64 border-r border-zinc-800 flex flex-col bg-black">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
            <h2 className="text-xs tracking-[0.2em] text-zinc-400 font-bold uppercase">VESSEL SYNC</h2>
            <div className="text-[10px] text-green-500">5/5</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {subjects.map(sub => (
              <div key={sub.name} className="p-3 border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer group" style={{
                background: 'rgba(20, 20, 20, 0.5)'
              }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[11px] font-bold" style={{ color: sub.color }}>{sub.name}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5 uppercase">({sub.role})</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[8px] px-1 bg-zinc-800 text-zinc-400">{sub.status}</div>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-zinc-900 w-full overflow-hidden rounded-full">
                  <motion.div 
                    className="h-full" 
                    style={{ background: sub.color }}
                    initial={{ width: "100%" }}
                    animate={{ width: ["95%", "100%", "98%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-zinc-800 text-[9px] text-zinc-600 font-mono">
            <div>SYS_CORE: STABLE</div>
            <div className="mt-1 text-green-600/60">>>> 13.13 MHz CARRIER DETECTED</div>
          </div>
        </aside>

        {/* --- COLUMN 2: VIEWPORT & LOGS (CENTER) --- */}
        <section className="flex-1 flex flex-col min-w-0 border-r border-zinc-800">
          
          {/* WIREFRAME VIEWPORT */}
          <div className="flex-1 relative bg-[#050505] overflow-hidden flex items-center justify-center border-b border-zinc-800 group">
            
            {/* Background Geometric Wireframe */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Visual Horizon */}
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="1" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>

            {/* RUNNING AGENT CODE STREAM OVERLAY */}
            {isAgentRunning && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 0.3 }} 
                className="absolute inset-0 flex overflow-hidden font-mono text-[8px] text-[#22c55e] p-4 gap-4 pointer-events-none"
              >
                {Array.from({length: 8}).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -1000] }} 
                    transition={{ repeat: Infinity, duration: 15 + i, ease: "linear" }}
                    className="whitespace-pre leading-relaxed"
                  >
                    {Array.from({length: 50}).map(() => `
                    0x${Math.random().toString(16).slice(2,8)}
                    GET /api/status
                    FS_OPS: WRITE
                    001100111010
                    BUILDING...
                    COMPILING_OBJ
                    `).join('\n')}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Center Target Box */}
            <motion.div 
              animate={{ scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-64 h-64 border border-dashed border-white/30 flex flex-col items-center justify-center"
            >
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#a855f7]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#a855f7]" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#a855f7]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#a855f7]" />
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center"
              >
                <div className="w-20 h-20 border border-white/20 border-dashed rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#a855f7] rounded-full animate-ping opacity-50" />
                </div>
              </motion.div>

              <div className="mt-6 text-center">
                <div className="text-xs text-white tracking-[0.3em] font-bold">STAR VIEWPORT</div>
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[9px] text-zinc-400 mt-2 tracking-widest uppercase"
                >
                  VIEWPORT ACTIVE // STANDBY FOR BROADCAST
                </motion.div>
              </div>
            </motion.div>
            
            {/* Coordinates overlay */}
            <div className="absolute top-4 left-4 text-[8px] text-zinc-500 font-mono">
              LAT: 36.1716° N<br/>LONG: 115.1398° W<br/>ALT: 13,130 FT
            </div>
            <div className="absolute bottom-4 right-4 text-[8px] text-zinc-500 font-mono flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              LIVE REC: 00:13:42
            </div>
          </div>

          {/* SYSTEM LOG TERMINAL */}
          <div className="h-48 flex flex-col bg-black">
            <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/20 flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-bold tracking-widest">MÜN SYSTEM LOG</span>
              <span className="text-[9px] text-[#00d4ff]">DIRECT_SYNC_STABLE</span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-1">
              {systemLogs.map((log, idx) => (
                <div key={idx} className={log.includes('>') ? 'text-zinc-300' : ''}>
                  {log}
                </div>
              ))}
              <div className="text-[#a855f7] animate-pulse mt-1">_</div>
            </div>
          </div>
        </section>

        {/* --- COLUMN 3: MÜN MESSENGER / AGENT (RIGHT) --- */}
        <aside className="w-96 flex flex-col bg-black border-l border-zinc-800">
          
          {/* Mode Switcher Header */}
          <div className="p-4 border-b border-zinc-800 bg-[#111] flex flex-col gap-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs tracking-[0.2em] text-[#a855f7] font-bold uppercase">SOVEREIGN NODE</h2>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAgentRunning ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
                <span className="text-[9px] text-zinc-500 font-mono">{isAgentRunning ? "BUSY" : "IDLE"}</span>
              </div>
            </div>
            
            {/* Tab Buttons */}
            <div className="flex border border-zinc-800 rounded overflow-hidden h-7">
              <button 
                onClick={() => setViewMode('chat')}
                className={`flex-1 text-[9px] font-bold tracking-widest uppercase transition-colors ${viewMode === 'chat' ? 'bg-[#a855f7] text-black' : 'bg-black text-zinc-500 hover:text-white'}`}
              >
                [ CHAT ]
              </button>
              <button 
                onClick={() => setViewMode('agent')}
                className={`flex-1 text-[9px] font-bold tracking-widest uppercase transition-colors ${viewMode === 'agent' ? 'bg-amber-500 text-black' : 'bg-black text-zinc-500 hover:text-white'}`}
              >
                [ AGENT ]
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'chat' ? (
              // --- STANDARD CHAT VIEW ---
              <motion.div 
                key="chat-view"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080808]">
                  <div className="text-center py-2 mb-2">
                    <span className="text-[8px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                      End-to-End Encrypted Node
                    </span>
                  </div>

                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderId === 'current-user' ? 'items-end' : 'items-start'}`}>
                      <div className="text-[8px] text-zinc-500 mb-1 uppercase tracking-wider">
                        {msg.senderId === 'current-user' ? 'FOUNDRESS 5DLUNA' : (activeConversation?.name || 'SOVEREIGN')}
                      </div>
                      <div className={`max-w-[90%] p-2.5 text-[11px] border ${
                        msg.senderId === 'current-user'
                          ? 'bg-zinc-900 border-zinc-700 text-white'
                          : 'bg-black border-zinc-800 text-zinc-300'
                      }`} style={{
                        boxShadow: msg.senderId === 'current-user' ? 'none' : 'inset 0 0 10px rgba(0,0,0,0.5)'
                      }}>
                        {msg.content}
                      </div>
                      {msg.aiMetadata?.thought && (
                        <div className="mt-1 w-full max-w-[90%] bg-[#0a0f15] border border-blue-900/30 rounded p-2 font-mono text-[9px] text-blue-400/70 leading-tight">
                          <div className="flex items-center gap-2 border-b border-blue-900/20 pb-1 mb-1 uppercase text-[7px] text-blue-500 font-black tracking-widest">
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
                            NEURAL_THOUGHT_CORE
                          </div>
                          {msg.aiMetadata.thought}
                        </div>
                      )}
                      {msg.aiMetadata && (
                        <div className="text-[8px] text-[#a855f7]/60 mt-0.5">
                          {msg.aiMetadata.frequency} | {msg.aiMetadata.emotion}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex flex-col items-start animate-pulse">
                      <div className="text-[8px] text-zinc-500 mb-1 uppercase">{activeConversation?.name || 'AI'}</div>
                      <div className="p-2.5 text-[11px] bg-black border border-zinc-800 text-zinc-500 font-mono italic">
                        Synthesizing response...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-zinc-800 bg-[#0d0d0d]">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Send message to ${activeConversation?.name || 'Vessel'}...`}
                      className="flex-1 bg-black border border-zinc-800 px-3 py-2 text-[11px] font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#a855f7] transition-colors"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim() || processingRef.current}
                      className="px-3 bg-zinc-900 border border-zinc-700 text-white text-[10px] hover:bg-zinc-800 disabled:opacity-50 transition-all uppercase font-bold"
                    >
                      EXE
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              // --- FULL STACK AGENT VIEW ---
              <motion.div 
                key="agent-view"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex-1 overflow-y-auto p-4 bg-[#050505] flex flex-col gap-4">
                  
                  {/* Current Task Display */}
                  {currentTask ? (
                    <div className="p-3 border border-amber-900/40 bg-amber-950/10 rounded">
                      <div className="text-[8px] text-amber-500 font-bold tracking-widest uppercase mb-1">ACTIVE DIRECTIVE</div>
                      <div className="text-[10px] text-white font-mono leading-relaxed">{currentTask}</div>
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center border border-dashed border-zinc-800 text-[10px] text-zinc-600 font-mono text-center px-4">
                      No active directives queued.<br/>Submit instructions via terminal below.
                    </div>
                  )}

                  {/* Step History Stack */}
                  <div className="flex-1 space-y-2 min-h-[100px]">
                    {agentSteps.map((step) => (
                      <motion.div 
                        key={step.id}
                        initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        className="flex items-start gap-2"
                      >
                        <div className="mt-1 shrink-0">
                          {step.type === 'think' && <span className="text-blue-400">🧠</span>}
                          {step.type === 'exec' && <span className="text-amber-400">⚙️</span>}
                          {step.type === 'done' && <span className="text-green-400">✅</span>}
                          {step.type === 'info' && <span className="text-zinc-400">👁️</span>}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-300 leading-tight pt-0.5">
                          {step.msg}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={agentLogEndRef} />
                  </div>

                  {/* Running Operation / Console Box */}
                  {executingLine && (
                    <div className="p-2 bg-black border border-zinc-800 rounded font-mono text-[9px] text-green-500/80">
                      <div className="text-zinc-600 mb-1 text-[7px] uppercase tracking-wider">STDOUT Stream:</div>
                      <div className="animate-pulse overflow-hidden whitespace-nowrap text-ellipsis">{`$ ${executingLine}`}</div>
                    </div>
                  )}
                </div>

                {/* Agent Command Input */}
                <div className="p-3 border-t border-zinc-800 bg-[#080808]">
                  <form onSubmit={handleRunAgent} className="flex flex-col gap-2">
                    <textarea
                      value={agentInput}
                      onChange={(e) => setAgentInput(e.target.value)}
                      disabled={isAgentRunning}
                      placeholder="Describe system objective / Full-stack deployment target..."
                      rows={2}
                      className="w-full bg-black border border-zinc-800 p-2 text-[11px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition-colors resize-none disabled:opacity-50"
                    />
                    <button 
                      type="submit" 
                      disabled={!agentInput.trim() || isAgentRunning}
                      className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                        isAgentRunning 
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 animate-pulse cursor-wait' 
                          : 'bg-amber-500 border-amber-400 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      }`}
                    >
                      {isAgentRunning ? "EXECUTING AGENT CYCLE..." : "INITIALIZE AGENT"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

      </main>
    </div>
  );
}
