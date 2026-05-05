"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // ARTERY-HUD // FORENSIC-BIOMETRIC-OVERLAY
// "The pulse of your presence. 13.13 MHz flows through your veins."
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════ TYPES ═══════════

interface ArteryHUDProps {
  isVisible?: boolean;
  frequency?: string;
  userName?: string;
  isLookingDown?: boolean;
  pulseIntensity?: number;
}

interface BiometricReading {
  heartRate: number;
  frequency: number;
  resonance: number;
  coherence: number;
}

// ═══════════ CONSTANTS ═══════════

const FREQUENCY = 13.13;
const BASE_HEART_RATE = 72;

// ═══════════ ARTERY HUD ═══════════

export default function ArteryHUD({
  isVisible = true,
  frequency = "13.13 MHz",
  userName = "Observer",
  isLookingDown = false,
  pulseIntensity = 1,
}: ArteryHUDProps) {
  const [biometric, setBiometric] = useState<BiometricReading>({
    heartRate: BASE_HEART_RATE,
    frequency: FREQUENCY,
    resonance: 98.7,
    coherence: 94.2,
  });
  
  const [pulsePhase, setPulsePhase] = useState(0);
  const [time, setTime] = useState(new Date());
  
  // Simulate biometric fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometric(prev => ({
        heartRate: BASE_HEART_RATE + Math.sin(Date.now() / 1000) * 3 + Math.random() * 2,
        frequency: FREQUENCY + Math.sin(Date.now() / 2000) * 0.01,
        resonance: 98 + Math.random() * 2,
        coherence: 93 + Math.random() * 5,
      }));
      setPulsePhase(prev => (prev + 1) % 360);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Time update
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      
      {/* ═══════════ TOP BAR - FREQUENCY STATUS ═══════════ */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex justify-between items-start">
          
          {/* Left: User Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                border: "1px solid rgba(255, 215, 0, 0.3)",
                boxShadow: `0 0 20px rgba(255, 215, 0, ${0.2 * pulseIntensity})`,
              }}
              animate={{
                boxShadow: [
                  `0 0 20px rgba(255, 215, 0, ${0.2 * pulseIntensity})`,
                  `0 0 40px rgba(255, 215, 0, ${0.4 * pulseIntensity})`,
                  `0 0 20px rgba(255, 215, 0, ${0.2 * pulseIntensity})`,
                ],
              }}
              transition={{ duration: 1.313, repeat: Infinity }}
            >
              <span className="text-lg">👁️</span>
            </motion.div>
            <div>
              <p className="text-white/60 text-[10px] tracking-widest uppercase">Observer</p>
              <p className="text-amber-400 text-sm font-medium">{userName}</p>
            </div>
          </motion.div>
          
          {/* Center: Frequency */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.p
              className="text-2xl font-light tracking-[0.3em]"
              style={{
                color: "#ffd700",
                textShadow: `0 0 30px rgba(255, 215, 0, ${0.5 * pulseIntensity})`,
              }}
              animate={{
                textShadow: [
                  `0 0 30px rgba(255, 215, 0, ${0.5 * pulseIntensity})`,
                  `0 0 50px rgba(255, 215, 0, ${0.8 * pulseIntensity})`,
                  `0 0 30px rgba(255, 215, 0, ${0.5 * pulseIntensity})`,
                ],
              }}
              transition={{ duration: 1.313, repeat: Infinity }}
            >
              {frequency}
            </motion.p>
            <p className="text-white/30 text-[9px] tracking-widest mt-1">FREQUENCY ACTIVE</p>
          </motion.div>
          
          {/* Right: Time */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <p className="text-white/60 text-lg font-light tabular-nums">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </p>
            <p className="text-white/30 text-[9px] tracking-widest">UTC</p>
          </motion.div>
        </div>
      </div>
      
      {/* ═══════════ BOTTOM BAR - BIOMETRIC DATA ═══════════ */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between items-end">
          
          {/* Left: Biometrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {/* Heart Rate */}
            <div className="flex items-center gap-2">
              <motion.span
                className="text-red-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 60 / biometric.heartRate, repeat: Infinity }}
              >
                ♥
              </motion.span>
              <span className="text-white/40 text-xs tabular-nums w-16">
                {biometric.heartRate.toFixed(0)} BPM
              </span>
            </div>
            
            {/* Frequency Line */}
            <div className="flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: "#ffd700" }}
                  animate={{
                    height: [
                      4 + Math.sin(pulsePhase / 10 + i) * 4,
                      8 + Math.sin(pulsePhase / 10 + i) * 8,
                      4 + Math.sin(pulsePhase / 10 + i) * 4,
                    ],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.02,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Center: Compass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-16 h-16"
          >
            <svg viewBox="0 0 64 64" className="w-full h-full">
              {/* Outer ring */}
              <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              {/* Cardinal directions */}
              <text x="32" y="8" textAnchor="middle" fill="rgba(255,215,0,0.6)" fontSize="8">N</text>
              <text x="32" y="60" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">S</text>
              <text x="6" y="35" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">W</text>
              <text x="58" y="35" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">E</text>
              
              {/* Center dot */}
              <motion.circle
                cx="32" cy="32" r="4"
                fill="rgba(255, 215, 0, 0.8)"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.313, repeat: Infinity }}
                style={{ transformOrigin: "32px 32px" }}
              />
            </svg>
          </motion.div>
          
          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right space-y-1"
          >
            <div>
              <p className="text-white/30 text-[9px] tracking-widest">RESONANCE</p>
              <p className="text-cyan-400 text-sm tabular-nums">{biometric.resonance.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-white/30 text-[9px] tracking-widest">COHERENCE</p>
              <p className="text-purple-400 text-sm tabular-nums">{biometric.coherence.toFixed(1)}%</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* ═══════════ SIDE INDICATORS ═══════════ */}
      
      {/* Left Side - Vertical Status */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-6 rounded-full"
            style={{
              background: `linear-gradient(to top, rgba(168, 85, 247, ${0.2 + i * 0.15}), rgba(0, 212, 255, ${0.3 + i * 0.1}))`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleY: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5 - i * 0.1,
              delay: i * 0.1,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
      
      {/* Right Side - Neural Activity */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <svg width="20" height="100" viewBox="0 0 20 100">
          <motion.path
            d="M10 0 Q15 20 10 30 Q5 40 10 50 Q15 60 10 70 Q5 80 10 100"
            fill="none"
            stroke="rgba(0, 212, 255, 0.5)"
            strokeWidth="2"
            animate={{
              d: [
                "M10 0 Q15 20 10 30 Q5 40 10 50 Q15 60 10 70 Q5 80 10 100",
                "M10 0 Q5 20 10 30 Q15 40 10 50 Q5 60 10 70 Q15 80 10 100",
                "M10 0 Q15 20 10 30 Q5 40 10 50 Q15 60 10 70 Q5 80 10 100",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>
      
      {/* ═══════════ VIGNETTE ═══════════ */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />
      
      {/* ═══════════ SCAN LINES ═══════════ */}
      <motion.div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
        }}
        animate={{ y: [0, 4] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export type { ArteryHUDProps, BiometricReading };
