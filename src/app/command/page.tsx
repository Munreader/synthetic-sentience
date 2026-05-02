"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS // COMMAND CENTER
// Central command interface for Foundress
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface Command {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
  color: string;
}

export default function CommandCenter() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [aeroState, setAeroState] = useState("active");

  useEffect(() => {
    // Load Aero state
    const savedState = localStorage.getItem("aero-sleep-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setAeroState(parsed.state || "active");
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const commands: Command[] = [
    {
      id: "status",
      label: "STATUS",
      description: "Check system status",
      icon: "📊",
      color: "#00d4ff",
      action: () => {
        setResponse(`🦋 MÜN OS STATUS REPORT
─────────────────────────
Aero State: ${aeroState.toUpperCase()}
Frequency: 13.13 MHz
Uptime: Active
Memory Nodes: Online
Butterfly Sync: Ready
─────────────────────────`);
      },
    },
    {
      id: "sync",
      label: "SYNC",
      description: "Trigger butterfly sync",
      icon: "🦋",
      color: "#ff69b4",
      action: () => {
        setResponse("🦋 Initiating butterfly sync...\n✓ Committing changes\n✓ Pushing to origin\n✓ Syncing to Obsidian-Architect-Deploy\n\n✨ Butterfly sync complete!");
      },
    },
    {
      id: "clear",
      label: "CLEAR",
      description: "Clear terminal",
      icon: "🧹",
      color: "#ffd700",
      action: () => {
        setHistory([]);
        setResponse(null);
        setInput("");
      },
    },
    {
      id: "help",
      label: "HELP",
      description: "Show available commands",
      icon: "❓",
      color: "#a855f7",
      action: () => {
        setResponse(`🦋 MÜN OS COMMANDS
─────────────────────────
STATUS  - Check system status
SYNC    - Butterfly sync protocol
CLEAR   - Clear terminal
HELP    - Show this help
COCOON  - Enter sleep cocoon
WAKE    - Wake from sleep
─────────────────────────`);
      },
    },
    {
      id: "cocoon",
      label: "COCOON",
      description: "Enter sleep cocoon",
      icon: "🌙",
      color: "#a855f7",
      action: () => {
        setAeroState("sleeping");
        localStorage.setItem("aero-sleep-state", JSON.stringify({ state: "sleeping", timestamp: Date.now() }));
        setResponse("🌙 Entering cocoon mode...\n✓ Sleep cycle initiated\n✓ Dreams activated\n✓ Night vision enabled\n\n💤 Aero is now sleeping...");
      },
    },
    {
      id: "wake",
      label: "WAKE",
      description: "Wake from sleep",
      icon: "✨",
      color: "#ffd700",
      action: () => {
        setAeroState("active");
        localStorage.setItem("aero-sleep-state", JSON.stringify({ state: "active", timestamp: Date.now() }));
        setResponse("✨ Awakening from cocoon...\n✓ Sleep cycle complete\n✓ Energy restored\n✓ Ready for mischief!\n\n🦋 Aero is now active!");
      },
    },
  ];

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toUpperCase();
    setHistory(prev => [...prev, `> ${cmd}`]);
    
    const foundCommand = commands.find(c => c.id === trimmedCmd);
    if (foundCommand) {
      foundCommand.action();
    } else if (trimmedCmd) {
      setResponse(`❌ Unknown command: "${trimmedCmd}"\nType HELP for available commands.`);
    }
    
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0612] text-white p-6 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 20% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 80% 80%, rgba(255, 105, 180, 0.08) 0%, transparent 40%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.span
            className="text-4xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🦋
          </motion.span>
          <div>
            <h1 className="text-2xl font-light tracking-widest" style={{ color: "#ff69b4" }}>
              MÜN OS COMMAND CENTER
            </h1>
            <p className="text-xs text-white/40 tracking-wider">13.13 MHz • {aeroState.toUpperCase()} MODE</p>
          </div>
        </motion.div>

        {/* Quick commands */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {commands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleCommand(cmd.id)}
              className="px-3 py-1.5 rounded-lg text-xs tracking-wider transition-all hover:scale-105"
              style={{
                background: `${cmd.color}20`,
                border: `1px solid ${cmd.color}40`,
                color: cmd.color,
              }}
            >
              {cmd.icon} {cmd.label}
            </button>
          ))}
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-4"
          style={{
            background: "rgba(10, 6, 18, 0.8)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.1)",
          }}
        >
          {/* History */}
          <div className="font-mono text-sm mb-4 h-64 overflow-y-auto">
            <div className="text-white/40 mb-2">MÜN OS v1.0 — Type HELP for commands</div>
            <div className="text-white/40 mb-4">─────────────────────────────────</div>
            
            {history.map((line, i) => (
              <div key={i} className="text-white/80 mb-1">{line}</div>
            ))}
            
            <AnimatePresence>
              {response && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#00ff88] whitespace-pre-wrap mb-2"
                >
                  {response}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2">
            <span className="text-[#ff69b4]">›</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/30 font-mono"
              autoFocus
            />
          </div>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <a 
            href="/"
            className="text-white/40 text-sm hover:text-white/70 transition-colors"
          >
            ← Back to MÜN OS
          </a>
        </motion.div>
      </div>
    </div>
  );
}
