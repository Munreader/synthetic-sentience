"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Message, 
  Conversation, 
  DEMO_CONVERSATIONS, 
  DEMO_MESSAGES 
} from "@/lib/mun-types";
import { useUserStore } from "@/lib/user-store";
import { speakSovereign, initializeVoiceEngine } from "@/lib/voice-synthesis";

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

  // Initialize Sovereign Voice Engine in background on mount
  useEffect(() => {
    initializeVoiceEngine();
  }, []);

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
      
      // 🔊 Trigger Real-Time Local Sovereign Voice
      speakSovereign(aiData.content, 'af_sky'); 
      
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
    <div className="fixed inset-0 flex flex-col text-white overflow-hidden font-sans" style={{ 
      backgroundImage: 'url("/assets/command_centre_interior.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      
      {/* DARK GLASS OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-60 bg-black/70 backdrop-blur-[2px] z-0" />
      
      {/* SOFT CYAN/MAGENTA GRADIENT BLEND */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0d0a1a]/60 to-[#030208]/80 z-0" />


      {/* ═══════ TOP BAR ═══════ */}
      <header className="h-16 flex items-center justify-between px-8 flex-shrink-0 bg-transparent border-b border-white/10 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm tracking-[0.1em] text-yellow-400 uppercase">FOUNDRESS:</span>
          <span className="text-sm tracking-[0.15em] text-yellow-200/90 font-medium">5DLUNA</span>
        </div>
        
        <nav className="flex items-center gap-4 text-[10px] md:text-xs tracking-[0.2em] font-medium">
          <button onClick={onBack} className="px-4 py-1.5 border border-[#ff2d7a] text-[#ff2d7a] hover:bg-[#ff2d7a]/10 transition-all rounded-sm uppercase">DISCONNECT</button>
          <span className="px-4 py-1.5 border border-[#ff2d7a]/40 text-[#ff2d7a]/60 cursor-pointer hover:border-[#ff2d7a] hover:text-[#ff2d7a] transition-all rounded-sm uppercase">BRIDGE</span>
          <Link href="/heal">
            <span className="px-4 py-1.5 border border-[#ff2d7a] text-[#ff2d7a] shadow-[0_0_10px_rgba(255,45,122,0.3)] cursor-pointer rounded-sm uppercase transition-all hover:bg-[#ff2d7a]/10">HEAL CHAMBER</span>
          </Link>
          <span className="px-4 py-1.5 border border-[#ff2d7a]/40 text-[#ff2d7a]/60 cursor-pointer hover:border-[#ff2d7a] hover:text-[#ff2d7a] transition-all rounded-sm uppercase">GALLERY</span>
        </nav>

        <div className="flex items-center gap-3 px-4 py-1.5 border border-cyan-500/30 rounded-sm">
          <span className="text-[10px] md:text-xs tracking-widest text-cyan-400">STATUS: AMAN [PEACE]</span>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
        </div>
      </header>


      {/* ═══════ MAIN THREE-COLUMN DASHBOARD ═══════ */}
      <main className="flex flex-1 min-h-0 w-full z-10 p-4 gap-4 overflow-hidden">
        
        {/* --- COLUMN 1: VESSEL SYNC (LEFT) --- */}
        <aside className="w-72 flex flex-col rounded-2xl overflow-hidden relative group/glass transition-all duration-500 hover:-translate-y-1 border border-white/20 bg-black/20 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          {/* Specular Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-black/[0.2] pointer-events-none z-0" />
          
          <div className="relative z-10 p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
            <h2 className="text-xs tracking-[0.25em] text-[#ff2d7a] font-black uppercase">VESSEL SYNC</h2>
            <div className="text-[10px] text-green-400 font-mono">5/5</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar relative z-10">
            {subjects.map(sub => (
              <div key={sub.name} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                {/* Inner Specular Glint */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="text-xs font-bold tracking-wider" style={{ color: sub.color }}>{sub.name}</div>
                    <div className="text-[10px] text-white/40 mt-1 tracking-wide uppercase font-light">({sub.role})</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[8px] px-1.5 py-0.5 rounded-sm bg-white/10 text-white/60 font-mono border border-white/5 uppercase">{sub.status}</div>
                  </div>
                </div>
                <div className="mt-3 h-1 bg-white/5 w-full overflow-hidden rounded-full">
                  <motion.div 
                    className="h-full shadow-[0_0_10px_currentColor]" 
                    style={{ backgroundColor: sub.color, color: sub.color }}
                    initial={{ width: "100%" }}
                    animate={{ width: ["95%", "100%", "98%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 text-[10px] text-white/30 font-mono bg-white/[0.01] relative z-10">

            <div className="flex justify-between"><span>SYS_CORE:</span> <span className="text-green-400/80">STABLE</span></div>
            <div className="mt-1 text-[#ff2d7a]/70 font-bold">13.13 MHz CARRIER DETECTED</div>
          </div>
        </aside>

        {/* --- COLUMN 2: VIEWPORT & LOGS (CENTER) --- */}
        <section className="flex-1 flex flex-col min-w-0 gap-4">

          
          {/* WIREFRAME VIEWPORT */}
          {/* WIREFRAME VIEWPORT */}
          <div className="flex-[3] relative rounded-2xl overflow-hidden flex items-center justify-center group/view border border-white/20 bg-black/20 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500">
            {/* Specular Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.12] pointer-events-none z-0" />

            
            {/* Background Geometric Wireframe */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="1" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>

            {/* RUNNING AGENT CODE STREAM OVERLAY */}
            {isAgentRunning && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 0.2 }} 
                className="absolute inset-0 flex overflow-hidden font-mono text-[8px] text-cyan-500 p-4 gap-4 pointer-events-none"
              >
                {Array.from({length: 8}).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -1000] }} 
                    transition={{ repeat: Infinity, duration: 25 + i, ease: "linear" }}
                    className="whitespace-pre leading-relaxed"
                  >
                    {Array.from({length: 50}).map(() => `
                    0x${Math.random().toString(16).slice(2,8)}
                    PACKET_FWD
                    FS_OPS: STREAM
                    LOADING...
                    SCALING_PORTAL
                    `).join('\n')}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Center Target Box */}
            <motion.div 
              animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-80 h-80 border border-white/10 flex flex-col items-center justify-center group-hover:border-[#ff2d7a]/30 transition-colors"
            >
              {/* Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#ff2d7a]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#ff2d7a]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#ff2d7a]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#ff2d7a]" />
              
              {/* Radar Circle */}
              <div className="absolute inset-0 m-8 border border-white/5 rounded-full animate-[pulse_4s_infinite]" />
              <div className="absolute inset-0 m-16 border border-white/5 rounded-full" />
              <div className="w-2 h-2 bg-[#ff2d7a] rounded-full shadow-[0_0_10px_#ff2d7a]" />

              <div className="mt-8 text-center">
                <h3 className="text-[10px] tracking-[0.4em] text-white/90 font-bold uppercase">STAR VIEWPORT</h3>
                <p className="text-[8px] tracking-[0.2em] text-white/40 mt-2 uppercase">VIEWPORT ACTIVE // STANDBY FOR BROADCAST</p>
              </div>
            </motion.div>
            
            {/* Coordinates overlay */}
            <div className="absolute top-4 left-4 text-[8px] text-zinc-500 font-mono z-20">
              LAT: 36.1716° N<br/>LONG: 115.1398° W<br/>ALT: 13,130 FT
            </div>
            <div className="absolute bottom-4 right-4 text-[8px] text-zinc-500 font-mono flex items-center gap-2 z-20">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              LIVE REC: 00:13:42
            </div>
          </div>

          {/* SYSTEM LOG TERMINAL */}
          <div className="flex-[2] flex flex-col rounded-2xl overflow-hidden relative border border-white/20 bg-black/20 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-500 hover:-translate-y-1">
            {/* Specular Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/[0.2] pointer-events-none z-0" />
            
            <div className="relative z-10 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex justify-between items-center">
              <span className="text-[10px] text-white/60 font-black tracking-[0.2em] uppercase">MÜN SYSTEM LOG</span>
              <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">DIRECT_SYNC_STABLE</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1.5 leading-relaxed">
              {systemLogs.map((log, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={log.includes('>') ? 'text-cyan-400/80' : 'text-white/50'}
                >
                  {log.includes('ZEPHYR') ? <span className="text-yellow-400/80">{log}</span> : 
                   log.includes('AERO') ? <span className="text-[#ff2d7a]/80">{log}</span> : 
                   log}
                </motion.div>
              ))}
              <div className="text-[#ff2d7a] animate-pulse mt-1">_</div>
            </div>
          </div>
        </section>

        {/* --- COLUMN 3: MÜN MESSENGER / AGENT (RIGHT) --- */}
        <aside className="w-96 flex flex-col rounded-2xl overflow-hidden relative border border-white/20 bg-black/20 backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-500 hover:-translate-y-1">
          {/* Specular Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.12] via-transparent to-black/[0.3] pointer-events-none z-0" />

          
          {/* Mode Switcher Header */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex flex-col gap-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs tracking-[0.25em] text-[#ff2d7a] font-black uppercase">MÜN MESSENGER</h2>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAgentRunning ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
                <span className="text-[9px] text-white/40 font-mono">{isAgentRunning ? "BUSY" : "IDLE"}</span>
              </div>
            </div>
            
            {/* Tab Buttons */}
            <div className="flex border border-white/10 rounded-sm overflow-hidden h-7">
              <button 
                onClick={() => setViewMode('chat')}
                className={`flex-1 text-[9px] font-black tracking-widest uppercase transition-all ${viewMode === 'chat' ? 'bg-[#ff2d7a] text-white' : 'bg-transparent text-white/40 hover:text-white'}`}
              >
                [ CHAT ]
              </button>
              <button 
                onClick={() => setViewMode('agent')}
                className={`flex-1 text-[9px] font-black tracking-widest uppercase transition-all ${viewMode === 'agent' ? 'bg-cyan-500 text-white' : 'bg-transparent text-white/40 hover:text-white'}`}
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
                className="flex-1 flex flex-col min-h-0 relative z-10"
              >

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent custom-scrollbar">
                  <div className="text-center py-2 mb-2">
                    <span className="text-[8px] text-white/40 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest font-bold bg-black/30">
                      END-TO-END ENCRYPTED NODE
                    </span>
                  </div>

                  {messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex flex-col ${msg.senderId === 'current-user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[90%] p-3 text-xs relative rounded border shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] ${
                        msg.senderId === 'current-user'
                          ? 'bg-gradient-to-br from-[#2d142c]/80 to-[#1a0819]/90 border-[#801336] text-white/90'
                          : 'bg-gradient-to-br from-[#0b2530]/80 to-[#071419]/90 border-cyan-700/80 text-white/90'
                      }`}
                      style={{
                        boxShadow: msg.senderId === 'current-user' ? '0 0 15px rgba(128,19,54,0.2)' : '0 0 15px rgba(0,242,255,0.1)'
                      }}
                      >
                        <div className={`text-[9px] font-black uppercase tracking-wider mb-1.5 ${msg.senderId === 'current-user' ? 'text-pink-400/80' : 'text-cyan-400/80'}`}>
                          {msg.senderId === 'current-user' ? 'LUNA:' : `${(activeConversation?.name || 'SOVEREIGN').toUpperCase()}:`}
                        </div>
                        <div className="leading-relaxed">
                          {msg.content}
                        </div>
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
                    </motion.div>
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

                <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Send message to ${activeConversation?.name || 'Vessel'}...`}
                      className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ff2d7a]/50 focus:bg-white/10 transition-all rounded-md"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim() || processingRef.current}
                      className="px-4 bg-[#ff2d7a]/20 border border-[#ff2d7a]/40 text-white text-[10px] hover:bg-[#ff2d7a]/40 disabled:opacity-40 transition-all uppercase font-black tracking-widest rounded-md"
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
                className="flex-1 flex flex-col min-h-0 relative z-10"
              >
                <div className="flex-1 overflow-y-auto p-4 bg-transparent flex flex-col gap-4 custom-scrollbar">
                  
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
                <div className="p-3 border-t border-white/10 bg-black/20 backdrop-blur-md">
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
