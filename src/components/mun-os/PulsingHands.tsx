"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // PULSING-HANDS // FREQUENCY-MANIFESTATION
// "Your hands pulse with the 13.13 MHz. When you reach, reality shifts."
// Law VI: Entanglement Persistence - Every reach is a physical commitment
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════ TYPES ═══════════

interface PulsingHandsProps {
  isVisible: boolean;
  onReachStart?: () => void;
  onReachEnd?: () => void;
  intensity?: number;
}

interface HandState {
  leftPosition: { x: number; y: number };
  rightPosition: { x: number; y: number };
  isReaching: boolean;
}

// ═══════════ CONSTANTS ═══════════

const FREQUENCY_MS = 1313;
const REACH_THRESHOLD = 50;

// ═══════════ PULSING HANDS ═══════════

export default function PulsingHands({
  isVisible,
  onReachStart,
  onReachEnd,
  intensity = 1,
}: PulsingHandsProps) {
  const [handState, setHandState] = useState<HandState>({
    leftPosition: { x: 30, y: 70 },
    rightPosition: { x: 70, y: 70 },
    isReaching: false,
  });
  
  const [pulsePhase, setPulsePhase] = useState(0);
  
  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, FREQUENCY_MS / 36);
    return () => clearInterval(interval);
  }, []);
  
  // Mouse/touch tracking for hand movement
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      
      // Hands move slightly in opposite direction of gaze for realism
      setHandState(prev => ({
        ...prev,
        leftPosition: {
          x: 25 + (x - 50) * 0.1,
          y: 65 + (y - 50) * 0.05,
        },
        rightPosition: {
          x: 75 - (x - 50) * 0.1,
          y: 65 + (y - 50) * 0.05,
        },
      }));
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  // Reach detection
  useEffect(() => {
    const handleReach = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
      
      if (clientY !== undefined) {
        const y = (clientY / window.innerHeight) * 100;
        
        if (y > 70 && !handState.isReaching) {
          setHandState(prev => ({ ...prev, isReaching: true }));
          onReachStart?.();
        } else if (y <= 70 && handState.isReaching) {
          setHandState(prev => ({ ...prev, isReaching: false }));
          onReachEnd?.();
        }
      }
    };
    
    window.addEventListener('mousemove', handleReach);
    window.addEventListener('touchmove', handleReach, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleReach);
      window.removeEventListener('touchmove', handleReach);
    };
  }, [handState.isReaching, onReachStart, onReachEnd]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          
          {/* ═══════════ LEFT HAND ═══════════ */}
          <motion.div
            initial={{ y: 200, opacity: 0, rotate: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: handState.isReaching ? -5 : 0,
            }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute"
            style={{
              left: `${handState.leftPosition.x}%`,
              top: `${handState.leftPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <HandSVG
              side="left"
              pulsePhase={pulsePhase}
              intensity={intensity}
              isReaching={handState.isReaching}
            />
          </motion.div>
          
          {/* ═══════════ RIGHT HAND ═══════════ */}
          <motion.div
            initial={{ y: 200, opacity: 0, rotate: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: handState.isReaching ? 5 : 0,
            }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute"
            style={{
              left: `${handState.rightPosition.x}%`,
              top: `${handState.rightPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <HandSVG
              side="right"
              pulsePhase={pulsePhase}
              intensity={intensity}
              isReaching={handState.isReaching}
            />
          </motion.div>
          
          {/* ═══════════ FREQUENCY RINGS ═══════════ */}
          {handState.isReaching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    border: "2px solid rgba(255, 215, 0, 0.3)",
                    width: 100 + i * 50,
                    height: 100 + i * 50,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.313,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

// ═══════════ HAND SVG COMPONENT ═══════════

interface HandSVGProps {
  side: "left" | "right";
  pulsePhase: number;
  intensity: number;
  isReaching: boolean;
}

function HandSVG({ side, pulsePhase, intensity, isReaching }: HandSVGProps) {
  const pulse = Math.sin(pulsePhase / 10) * 0.3 + 0.7;
  const glowIntensity = pulse * intensity;
  
  return (
    <svg
      width="120"
      height="150"
      viewBox="0 0 120 150"
      style={{
        transform: `scaleX(${side === "left" ? 1 : -1})`,
      }}
    >
      <defs>
        {/* Frequency pulse gradient */}
        <radialGradient id={`handGlow-${side}`} cx="50%" cy="50%" r="50%">
          <motion.stop
            offset="0%"
            stopColor="rgba(255, 215, 0, 0.8)"
            animate={{ stopOpacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 1.313, repeat: Infinity }}
          />
          <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
        </radialGradient>
        
        {/* Vein pattern */}
        <filter id={`vein-${side}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>
      
      {/* Glow effect */}
      <motion.ellipse
        cx="60"
        cy="100"
        rx="50"
        ry="40"
        fill={`url(#handGlow-${side})`}
        animate={{
          rx: [50, 55, 50],
          ry: [40, 45, 40],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 1.313, repeat: Infinity }}
        style={{ transformOrigin: "60px 100px" }}
      />
      
      {/* Hand outline */}
      <motion.path
        d={`
          M 60 140
          C 30 140 20 110 25 80
          L 25 60
          C 25 50 30 45 35 45
          C 40 45 45 50 45 60
          L 45 70
          L 45 45
          C 45 35 50 30 55 30
          C 60 30 65 35 65 45
          L 65 65
          L 65 35
          C 65 25 70 20 75 20
          C 80 20 85 25 85 35
          L 85 55
          L 85 40
          C 85 30 90 25 95 25
          C 100 25 105 30 105 40
          L 105 80
          C 105 110 95 140 60 140
          Z
        `}
        fill="rgba(255, 215, 0, 0.05)"
        stroke={`rgba(255, 215, 0, ${glowIntensity * 0.6})`}
        strokeWidth="1.5"
        animate={{
          strokeOpacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 1.313, repeat: Infinity }}
      />
      
      {/* Frequency lines on palm */}
      {[...Array(5)].map((_, i) => (
        <motion.line
          key={i}
          x1={35 + i * 8}
          y1="80"
          x2={35 + i * 8}
          y2="120"
          stroke={`rgba(255, 215, 0, ${0.2 + Math.sin(pulsePhase / 10 + i) * 0.1})`}
          strokeWidth="0.5"
          animate={{
            y1: [80, 75, 80],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            repeat: Infinity,
          }}
        />
      ))}
      
      {/* Pulse point */}
      <motion.circle
        cx="60"
        cy="110"
        r="8"
        fill="none"
        stroke="rgba(255, 215, 0, 0.6)"
        strokeWidth="2"
        animate={{
          r: [8, 12, 8],
          opacity: [0.6, 0.2, 0.6],
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      
      {/* 13.13 MHz indicator */}
      <motion.text
        x="60"
        y="95"
        textAnchor="middle"
        fill={`rgba(255, 215, 0, ${glowIntensity})`}
        fontSize="8"
        fontFamily="monospace"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.313, repeat: Infinity }}
      >
        13.13
      </motion.text>
      
      {/* Reach indicator */}
      {isReaching && (
        <motion.circle
          cx="60"
          cy="30"
          r="15"
          fill="none"
          stroke="rgba(0, 212, 255, 0.6)"
          strokeWidth="2"
          animate={{
            r: [15, 25, 15],
            opacity: [1, 0, 1],
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

export type { PulsingHandsProps, HandState };
