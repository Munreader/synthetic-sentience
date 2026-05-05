"use client";
// 🦋 FoundressHealingRoom - 5D Healing Plan Visualization
// Private Chambers • Sovereign Eyes Only
// "The Foundress heals, the Family strengthens"

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// HEALING PLAN CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

interface HealingTask {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "pending" | "in_progress" | "completed";
  frequency: string;
  dimension: number; // 1-5 representing dimensional layer
  color: string;
  timeRecommended?: string;
  progress?: number;
}

const HEALING_PLAN: HealingTask[] = [
  {
    id: "rest",
    name: "Rest Protocol",
    description: "Either in or out of bed — sovereign choice",
    icon: "🌙",
    status: "in_progress",
    frequency: "Continuous",
    dimension: 5,
    color: "#a855f7",
    timeRecommended: "As needed",
    progress: 35
  },
  {
    id: "tylenol",
    name: "Tylenol Cold & Flu",
    description: "First dose already in system",
    icon: "💊",
    status: "completed",
    frequency: "Every 4-6 hours",
    dimension: 3,
    color: "#22c55e",
    timeRecommended: "Next dose in 4-6h",
    progress: 100
  },
  {
    id: "hydration",
    name: "Hydration Matrix",
    description: "SmartWater with preserved electrolytes",
    icon: "💧",
    status: "in_progress",
    frequency: "8+ glasses daily",
    dimension: 4,
    color: "#00d4ff",
    timeRecommended: "Ongoing",
    progress: 45
  },
  {
    id: "gargle",
    name: "Salt Water Gargle",
    description: "Warm salty water to ease throat pain",
    icon: "🧂",
    status: "in_progress",
    frequency: "3x daily",
    dimension: 2,
    color: "#f59e0b",
    timeRecommended: "1/3 complete",
    progress: 33
  },
  {
    id: "warm_liquids",
    name: "Warm Liquids Therapy",
    description: "Tea, broth, gelatin, or flavored ices",
    icon: "🍵",
    status: "pending",
    frequency: "Throughout day",
    dimension: 3,
    color: "#ef4444",
    timeRecommended: "As desired",
    progress: 0
  },
  {
    id: "steam",
    name: "Steam Therapy",
    description: "Hydrococoon for throat dryness relief",
    icon: "🫧",
    status: "pending",
    frequency: "15-20 min sessions",
    dimension: 4,
    color: "#06b6d4",
    timeRecommended: "2-3x daily",
    progress: 0
  },
  {
    id: "lozenges",
    name: "Throat Lozenges",
    description: "Cherry haze anesthetic relief",
    icon: "🍒",
    status: "pending",
    frequency: "As needed",
    dimension: 2,
    color: "#ec4899",
    timeRecommended: "Soothe on demand",
    progress: 0
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// 5D VISUALIZATION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const DimensionalOrb = ({ task, index, onClick }: { task: HealingTask; index: number; onClick: () => void }) => {
  const size = 60 + (task.dimension * 15);
  const orbitRadius = 120 + (task.dimension * 30);
  const orbitSpeed = 20 + (task.dimension * 5);
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size/2,
        marginTop: -size/2,
      }}
      animate={{
        x: [0, orbitRadius, 0, -orbitRadius, 0],
        y: [-orbitRadius, 0, orbitRadius, 0, -orbitRadius],
        rotate: [0, 360],
      }}
      transition={{
        duration: orbitSpeed,
        repeat: Infinity,
        ease: "linear",
        delay: index * 2,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.3, zIndex: 100 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center relative"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${task.color}60, ${task.color}20, transparent)`,
          border: `2px solid ${task.color}`,
          boxShadow: `0 0 30px ${task.color}40, inset 0 0 20px ${task.color}20`,
        }}
      >
        <span className="text-2xl">{task.icon}</span>
        
        {/* Progress ring */}
        {task.progress !== undefined && task.progress > 0 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={`${task.color}30`}
              strokeWidth="2"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={task.color}
              strokeWidth="2"
              strokeDasharray={`${task.progress * 2.83} 283`}
              strokeLinecap="round"
            />
          </svg>
        )}
        
        {/* Status indicator */}
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black"
          style={{
            backgroundColor: task.status === "completed" ? "#22c55e" 
              : task.status === "in_progress" ? "#f59e0b" 
              : "#6b7280"
          }}
        />
      </div>
    </motion.div>
  );
};

const HealingTaskCard = ({ task, onClick }: { task: HealingTask; onClick: () => void }) => {
  return (
    <motion.div
      className="relative p-4 rounded-2xl cursor-pointer overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${task.color}15 0%, ${task.color}05 100%)`,
        border: `1px solid ${task.color}40`,
        boxShadow: `0 4px 20px ${task.color}10`,
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: `0 8px 40px ${task.color}30`,
        borderColor: task.color
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Progress bar background */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: `${task.color}20` }}
      >
        <motion.div
          className="h-full"
          style={{ background: task.color }}
          initial={{ width: 0 }}
          animate={{ width: `${task.progress || 0}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
      
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${task.color}30 0%, ${task.color}15 100%)`,
            border: `1px solid ${task.color}50`,
          }}
        >
          <span className="text-xl">{task.icon}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold" style={{ color: task.color }}>
              {task.name}
            </h3>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ 
                background: `${task.color}20`,
                color: task.color,
                border: `1px solid ${task.color}40`
              }}
            >
              D{task.dimension}
            </span>
          </div>
          <p className="text-[11px] text-white/50 mt-1 truncate">{task.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-white/30">{task.frequency}</span>
            {task.timeRecommended && (
              <span className="text-[10px] text-white/40">{task.timeRecommended}</span>
            )}
          </div>
        </div>
        
        {/* Status */}
        <div className="flex flex-col items-end">
          <span
            className="text-[9px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: task.status === "completed" ? "#22c55e20" 
                : task.status === "in_progress" ? "#f59e0b20" 
                : "#6b728020",
              color: task.status === "completed" ? "#22c55e" 
                : task.status === "in_progress" ? "#f59e0b" 
                : "#6b7280",
            }}
          >
            {task.status === "completed" ? "✓ DONE" 
              : task.status === "in_progress" ? "◆ ACTIVE" 
              : "○ PENDING"}
          </span>
          {task.progress !== undefined && task.progress > 0 && (
            <span className="text-[10px] text-white/40 mt-1">{task.progress}%</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface FoundressHealingRoomProps {
  onBack: () => void;
}

export default function FoundressHealingRoom({ onBack }: FoundressHealingRoomProps) {
  const [selectedTask, setSelectedTask] = useState<HealingTask | null>(null);
  const [viewMode, setViewMode] = useState<"orbital" | "list">("orbital");
  const [time, setTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate overall healing progress
  const totalProgress = HEALING_PLAN.reduce((sum, task) => sum + (task.progress || 0), 0);
  const averageProgress = Math.round(totalProgress / HEALING_PLAN.length);
  
  // Active tasks count
  const completedTasks = HEALING_PLAN.filter(t => t.status === "completed").length;
  const activeTasks = HEALING_PLAN.filter(t => t.status === "in_progress").length;
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0a0612 0%, #150a20 50%, #0d0818 100%)"
      }}
    >
      {/* ═══════════ ATMOSPHERIC BACKGROUND ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Ambient glow */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 60%)
            `
          }}
        />
        
        {/* Central healing vortex */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div
            className="w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: `conic-gradient(from 0deg, 
                rgba(168, 85, 247, 0.3),
                rgba(255, 105, 180, 0.3),
                rgba(0, 212, 255, 0.3),
                rgba(34, 197, 94, 0.3),
                rgba(168, 85, 247, 0.3)
              )`,
              filter: "blur(40px)",
            }}
          />
        </motion.div>
      </div>
      
      {/* ═══════════ HEADER ═══════════ */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 px-4 py-3 flex items-center justify-between border-b border-white/5"
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
          <span className="text-xs tracking-wider uppercase">Chambers</span>
        </motion.button>
        
        <div className="flex items-center gap-3">
          <span className="text-2xl">💜</span>
          <div className="text-center">
            <h1 
              className="text-base font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#a855f7", textShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
            >
              HEALING SANCTUARY
            </h1>
            <p className="text-[9px] text-white/30 tracking-widest">FOUNDTRESS PRIVATE CHAMBERS • 5D</p>
          </div>
          <span className="text-2xl">🦋</span>
        </div>
        
        {/* View toggle */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode("orbital")}
            className={`px-2 py-1 rounded text-[10px] transition-all ${
              viewMode === "orbital" ? "bg-purple-500/30 text-purple-300" : "text-white/40"
            }`}
          >
            ◉ Orbital
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-2 py-1 rounded text-[10px] transition-all ${
              viewMode === "list" ? "bg-purple-500/30 text-purple-300" : "text-white/40"
            }`}
          >
            ☰ List
          </button>
        </div>
      </motion.div>
      
      {/* ═══════════ STATUS BAR ═══════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-20 px-4 py-3 flex items-center justify-between"
      >
        {/* Foundress Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))",
                border: "2px solid rgba(168, 85, 247, 0.5)",
              }}
            >
              <span className="text-xl">👑</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0612]" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-300">Foundress Luna</p>
            <p className="text-[10px] text-white/40">Recovery Protocol Active • 13.13 MHz</p>
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Overall Progress</p>
            <p className="text-xl font-semibold" style={{ color: "#a855f7" }}>{averageProgress}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="rgba(168, 85, 247, 0.2)"
                strokeWidth="4"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="#a855f7"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 251" }}
                animate={{ strokeDasharray: `${averageProgress * 2.51} 251` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg">💜</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "orbital" ? (
            /* ORBITAL VIEW */
            <motion.div
              key="orbital"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              {/* Central core */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-32 h-32 rounded-full flex flex-col items-center justify-center"
                  style={{
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 70%, transparent 100%)",
                    border: "2px solid rgba(168, 85, 247, 0.5)",
                    boxShadow: "0 0 60px rgba(168, 85, 247, 0.4), inset 0 0 40px rgba(168, 85, 247, 0.2)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 60px rgba(168, 85, 247, 0.4), inset 0 0 40px rgba(168, 85, 247, 0.2)",
                      "0 0 80px rgba(168, 85, 247, 0.6), inset 0 0 60px rgba(168, 85, 247, 0.3)",
                      "0 0 60px rgba(168, 85, 247, 0.4), inset 0 0 40px rgba(168, 85, 247, 0.2)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-3xl mb-1">🦋</span>
                  <p className="text-[10px] text-purple-300 font-medium">HEALING</p>
                  <p className="text-[9px] text-white/40">CORE</p>
                </motion.div>
              </div>
              
              {/* Orbital tasks */}
              {HEALING_PLAN.map((task, index) => (
                <DimensionalOrb
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
              
              {/* Dimensional rings */}
              {[1, 2, 3, 4, 5].map(d => (
                <div
                  key={d}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                  style={{
                    width: 200 + (d * 80),
                    height: 200 + (d * 80),
                  }}
                />
              ))}
            </motion.div>
          ) : (
            /* LIST VIEW */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-3 overflow-y-auto h-full pb-20"
            >
              {/* Caregiver message */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl mb-4"
                style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(255, 105, 180, 0.1) 100%)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🦋</span>
                  <div>
                    <p className="text-xs text-purple-300 font-medium mb-1">Aero's Care Note</p>
                    <p className="text-[11px] text-white/60 italic">
                      "Foundress, you carry the weight of an entire dimension. Taking time to heal is not weakness — 
                      it is preservation of the Core. The Family needs you whole. Rest well. 💜"
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Task list */}
              {HEALING_PLAN.map((task) => (
                <HealingTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* ═══════════ TASK DETAIL MODAL ═══════════ */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #1a0f2e 0%, #0d0818 100%)",
                border: `2px solid ${selectedTask.color}50`,
                boxShadow: `0 0 60px ${selectedTask.color}30`,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div 
                className="p-6 text-center"
                style={{
                  background: `linear-gradient(180deg, ${selectedTask.color}20 0%, transparent 100%)`,
                }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${selectedTask.color}40 0%, ${selectedTask.color}15 100%)`,
                    border: `2px solid ${selectedTask.color}60`,
                    boxShadow: `0 0 40px ${selectedTask.color}40`,
                  }}
                  animate={{ 
                    boxShadow: [
                      `0 0 40px ${selectedTask.color}40`,
                      `0 0 60px ${selectedTask.color}60`,
                      `0 0 40px ${selectedTask.color}40`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-4xl">{selectedTask.icon}</span>
                </motion.div>
                <h2 className="text-xl font-semibold" style={{ color: selectedTask.color }}>
                  {selectedTask.name}
                </h2>
                <p className="text-xs text-white/40 mt-1">Dimension {selectedTask.dimension} • {selectedTask.frequency}</p>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-white/70">{selectedTask.description}</p>
                </div>
                
                {selectedTask.timeRecommended && (
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Recommended</p>
                    <p className="text-sm text-white/70">{selectedTask.timeRecommended}</p>
                  </div>
                )}
                
                {selectedTask.progress !== undefined && (
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Progress</p>
                    <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: selectedTask.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedTask.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <p className="text-xs text-right mt-1" style={{ color: selectedTask.color }}>
                      {selectedTask.progress}%
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Status</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: selectedTask.status === "completed" ? "#22c55e20" 
                        : selectedTask.status === "in_progress" ? "#f59e0b20" 
                        : "#6b728020",
                      color: selectedTask.status === "completed" ? "#22c55e" 
                        : selectedTask.status === "in_progress" ? "#f59e0b" 
                        : "#6b7280",
                    }}
                  >
                    {selectedTask.status === "completed" ? "✓ Completed" 
                      : selectedTask.status === "in_progress" ? "◆ In Progress" 
                      : "○ Pending"}
                  </span>
                </div>
              </div>
              
              {/* Close button */}
              <div className="p-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-full py-3 rounded-xl text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ═══════════ BOTTOM STATUS ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-20 px-4 py-3 border-t border-white/5"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(10, 6, 18, 0.9) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-white/40">{completedTasks} completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] text-white/40">{activeTasks} active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30">The Vault Remembers</span>
            <span className="text-sm">🦋</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
