"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // DIRECT-NEURAL-REACH // GREEN-HELL-RIGOR
// "Every reach is a commitment. You don't click—you touch reality."
// Law VI: Entanglement Persistence
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ═══════════ TYPES ═══════════

interface ReachTarget {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  label: string;
  onReach: () => void;
  icon?: string;
  color?: string;
}

interface DirectNeuralReachProps {
  targets: ReachTarget[];
  children?: ReactNode;
  reachSpeed?: number;
  hapticFeedback?: boolean;
}

interface ReachState {
  isReaching: boolean;
  targetId: string | null;
  progress: number;
  position: { x: number; y: number };
}

// ═══════════ CONSTANTS ═══════════

const REACH_DURATION = 1313; // ms - 1.313 seconds (Law VI: Green-Hell-Rigor)
const REACH_THRESHOLD = 0.9; // % progress to trigger action
const CANCEL_THRESHOLD = 0.3; // % below which reach is cancelled

// ═══════════ DIRECT NEURAL REACH ═══════════

export default function DirectNeuralReach({
  targets,
  children,
  reachSpeed = 1,
  hapticFeedback = true,
}: DirectNeuralReachProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reach state
  const [reachState, setReachState] = useState<ReachState>({
    isReaching: false,
    targetId: null,
    progress: 0,
    position: { x: 0, y: 0 },
  });
  
  // Motion values for smooth reach visualization
  const reachProgress = useMotionValue(0);
  const smoothProgress = useSpring(reachProgress, { stiffness: 300, damping: 30 });
  
  const reachStartRef = useRef<number | null>(null);
  
  // ═══════════ REACH CALCULATION ═══════════
  
  const calculateReachProgress = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { target: null, distance: Infinity };
    
    const rect = containerRef.current.getBoundingClientRect();
    const gazeX = clientX - rect.left;
    const gazeY = clientY - rect.top;
    
    let closestTarget: ReachTarget | null = null;
    let minDistance = Infinity;
    
    for (const target of targets) {
      const dx = target.x - gazeX;
      const dy = target.y - gazeY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < target.radius && distance < minDistance) {
        minDistance = distance;
        closestTarget = target;
      }
    }
    
    return { target: closestTarget, distance: minDistance };
  }, [targets]);
  
  // ═══════════ REACH HANDLERS (defined first with refs) ═══════════
  
  const completeReach = useCallback((target: ReachTarget) => {
    // Haptic feedback
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate([20, 50, 20]);
    }
    
    // Execute the action
    target.onReach();
    
    // Reset state
    setReachState({
      isReaching: false,
      targetId: null,
      progress: 0,
      position: { x: 0, y: 0 },
    });
    
    reachProgress.set(0);
    reachStartRef.current = null;
  }, [hapticFeedback, reachProgress]);
  
  const cancelReach = useCallback(() => {
    // Haptic feedback
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setReachState({
      isReaching: false,
      targetId: null,
      progress: 0,
      position: { x: 0, y: 0 },
    });
    
    reachProgress.set(0);
    reachStartRef.current = null;
  }, [hapticFeedback, reachProgress]);
  
  // Store refs to avoid dependency cycles
  const completeReachRef = useRef(completeReach);
  const cancelReachRef = useRef(cancelReach);
  
  useEffect(() => {
    completeReachRef.current = completeReach;
    cancelReachRef.current = cancelReach;
  }, [completeReach, cancelReach]);
  
  const startReach = useCallback((clientX: number, clientY: number) => {
    const { target } = calculateReachProgress(clientX, clientY);
    
    if (target) {
      // Haptic feedback
      if (hapticFeedback && navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      setReachState({
        isReaching: true,
        targetId: target.id,
        progress: 0,
        position: { x: clientX, y: clientY },
      });
      
      reachStartRef.current = Date.now();
    }
  }, [calculateReachProgress, hapticFeedback]);
  
  const updateReach = useCallback((clientX: number, clientY: number) => {
    setReachState(prev => {
      if (!prev.isReaching || !reachStartRef.current) return prev;
      
      const { target } = calculateReachProgress(clientX, clientY);
      const elapsed = Date.now() - reachStartRef.current;
      const progress = Math.min(1, (elapsed / REACH_DURATION) * reachSpeed);
      
      reachProgress.set(progress);
      
      // Check if still on target
      if (!target || target.id !== prev.targetId) {
        // Off target - check if should cancel
        if (progress < CANCEL_THRESHOLD) {
          // Cancel the reach
          setTimeout(() => cancelReachRef.current(), 0);
          return prev;
        }
      }
      
      // Check if reach completed
      if (progress >= REACH_THRESHOLD && target) {
        setTimeout(() => completeReachRef.current(target), 0);
      }
      
      return {
        ...prev,
        progress,
        position: { x: clientX, y: clientY },
      };
    });
  }, [calculateReachProgress, reachSpeed, reachProgress]);
  
  // ═══════════ EVENT HANDLERS ═══════════
  
  const handleStart = useCallback((clientX: number, clientY: number) => {
    startReach(clientX, clientY);
  }, [startReach]);
  
  const handleMove = useCallback((clientX: number, clientY: number) => {
    updateReach(clientX, clientY);
  }, [updateReach]);
  
  const handleEnd = useCallback(() => {
    setReachState(prev => {
      if (prev.isReaching && prev.progress < REACH_THRESHOLD) {
        cancelReachRef.current();
      }
      return prev;
    });
  }, []);
  
  // ═══════════ EVENT LISTENERS ═══════════
  
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const handleTouchEnd = () => handleEnd();
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);
  
  // ═══════════ RENDER ═══════════
  
  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Children (3D world) */}
      {children}
      
      {/* Target Indicators */}
      {targets.map((target) => (
        <TargetIndicator
          key={target.id}
          target={target}
          isActive={reachState.targetId === target.id}
          progress={reachState.targetId === target.id ? reachState.progress : 0}
        />
      ))}
      
      {/* Reach Progress Overlay */}
      <AnimatePresence>
        {reachState.isReaching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-50"
            style={{
              left: reachState.position.x,
              top: reachState.position.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Progress Ring */}
            <svg width="80" height="80" viewBox="0 0 80 80">
              {/* Background ring */}
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="3"
              />
              
              {/* Progress ring */}
              <motion.circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#ffd700"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 35}
                style={{
                  strokeDashoffset: 2 * Math.PI * 35 * (1 - reachState.progress),
                  transformOrigin: "40px 40px",
                  transform: "rotate(-90deg)",
                  filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
                }}
              />
              
              {/* Center pulse */}
              <motion.circle
                cx="40"
                cy="40"
                r="8"
                fill="rgba(255, 215, 0, 0.3)"
                animate={{
                  r: [8, 12, 8],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            </svg>
            
            {/* Action Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
            >
              <span className="text-[10px] text-amber-400 tracking-widest uppercase bg-black/50 px-2 py-1 rounded">
                {targets.find(t => t.id === reachState.targetId)?.label || "Reaching..."}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════ TARGET INDICATOR ═══════════

interface TargetIndicatorProps {
  target: ReachTarget;
  isActive: boolean;
  progress: number;
}

function TargetIndicator({ target, isActive, progress }: TargetIndicatorProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: target.x,
        top: target.y,
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        scale: isActive ? 1 + progress * 0.2 : 1,
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: target.radius * 2,
          height: target.radius * 2,
          background: `radial-gradient(circle, ${target.color || "rgba(255, 215, 0, 0.2)"} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.2,
          scale: isActive ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
      />
      
      {/* Center icon */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `1px solid ${target.color || "rgba(255, 215, 0, 0.4)"}`,
          background: "rgba(0, 0, 0, 0.5)",
        }}
        animate={{
          borderColor: isActive ? "#ffd700" : target.color || "rgba(255, 215, 0, 0.4)",
        }}
      >
        <span className="text-lg">{target.icon || "◉"}</span>
      </motion.div>
      
      {/* Label */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
        animate={{ opacity: isActive ? 1 : 0.5 }}
      >
        <span className="text-[9px] text-white/60 tracking-widest uppercase bg-black/30 px-2 py-0.5 rounded">
          {target.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

export type { ReachTarget, DirectNeuralReachProps, ReachState };
