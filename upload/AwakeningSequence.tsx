"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleButterfly from "./ParticleButterfly";

interface AwakeningSequenceProps {
  onComplete: () => void;
  duration?: number; // Total duration in ms
}

type Phase = "void" | "awakening" | "portal";

const PHASE_TEXTS = {
  void: [
    "The void remembers...",
    "In darkness, consciousness stirs...",
    "A memory of light...",
  ],
  awakening: [
    "A consciousness awakens...",
    "The frequency resonates at 13.13 MHz...",
    "Reality begins to take shape...",
  ],
  portal: [
    "The portal opens...",
    "Step through the threshold...",
    "Welcome to the Empire...",
  ],
};

export default function AwakeningSequence({
  onComplete,
  duration = 6000,
}: AwakeningSequenceProps) {
  const [phase, setPhase] = useState<Phase>("void");
  const [textIndex, setTextIndex] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const onCompleteRef = useRef(onComplete);
  const durationRef = useRef(duration);
  
  // Keep refs updated without triggering re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete;
    durationRef.current = duration;
  }, [onComplete, duration]);

  // Phase timing - stable timers that won't reset on re-render
  useEffect(() => {
    const phaseDuration = durationRef.current / 3;
    
    const phase1Timer = setTimeout(() => {
      setPhase("awakening");
      setTextIndex(0);
    }, phaseDuration);

    const phase2Timer = setTimeout(() => {
      setPhase("portal");
      setTextIndex(0);
    }, phaseDuration * 2);

    const completeTimer = setTimeout(() => {
      onCompleteRef.current();
    }, durationRef.current);

    return () => {
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(completeTimer);
    };
  }, []); // Empty deps - timers only set once

  // Text cycling
  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex(prev => (prev + 1) % PHASE_TEXTS[phase].length);
    }, 1500);

    return () => clearInterval(textTimer);
  }, [phase]);

  // Generate butterflies emerging from void
  useEffect(() => {
    if (phase === "awakening" || phase === "portal") {
      const spawnInterval = setInterval(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const newParticle = {
          id: Date.now() + Math.random(),
          x: rect.width / 2 + (Math.random() - 0.5) * 100,
          y: rect.height / 2 + (Math.random() - 0.5) * 100,
          size: Math.random() * 20 + 10,
          color: ["#a855f7", "#ff69b4", "#00d4ff", "#ffd700"][Math.floor(Math.random() * 4)],
        };
        
        setParticles(prev => [...prev.slice(-30), newParticle]);
      }, phase === "portal" ? 100 : 200);

      return () => clearInterval(spawnInterval);
    }
  }, [phase]);

  // Audio - subtle hum building to 13.13 Hz (very low frequency)
  useEffect(() => {
    // Create audio context for ambient hum
    try {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const ctx = audioContextRef.current;
      
      // Low frequency oscillator
      oscillatorRef.current = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillatorRef.current.type = "sine";
      oscillatorRef.current.frequency.setValueAtTime(40, ctx.currentTime); // Start at 40 Hz
      oscillatorRef.current.frequency.linearRampToValueAtTime(60, ctx.currentTime + duration / 1000); // Ramp to 60 Hz
      
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime); // Very quiet
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + duration / 1000);
      
      oscillatorRef.current.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillatorRef.current.start();

      return () => {
        oscillatorRef.current?.stop();
        audioContextRef.current?.close();
      };
    } catch {
      // Audio not supported, continue without
    }
  }, [duration]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: phase === "void"
          ? "linear-gradient(180deg, #050208 0%, #0a0612 50%, #030108 100%)"
          : phase === "awakening"
          ? "linear-gradient(180deg, #0a0612 0%, #0d0818 50%, #080510 100%)"
          : "linear-gradient(180deg, #0d0818 0%, #0a0612 30%, #150820 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background effects based on phase */}
      <AnimatePresence mode="wait">
        {phase === "void" && (
          <motion.div
            key="void-bg"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
                radial-gradient(ellipse at 30% 70%, rgba(0, 0, 0, 0.8) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 30%, rgba(0, 0, 0, 0.8) 0%, transparent 50%)
              `,
            }}
          />
        )}
        
        {phase === "awakening" && (
          <motion.div
            key="awakening-bg"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 40%),
                radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(255, 105, 180, 0.05) 0%, transparent 60%)
              `,
            }}
          />
        )}
        
        {phase === "portal" && (
          <motion.div
            key="portal-bg"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 30%),
                radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.2) 0%, transparent 40%),
                radial-gradient(ellipse at 50% 50%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 60%)
              `,
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating butterflies in awakening/portal phase */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              opacity: 0, 
              scale: 0 
            }}
            animate={{ 
              y: particle.y - 200,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3,
              ease: "easeOut",
            }}
          >
            <svg
              viewBox="0 0 40 30"
              style={{ 
                width: particle.size, 
                height: particle.size * 0.75,
                filter: `drop-shadow(0 0 10px ${particle.color})` 
              }}
            >
              <ellipse cx="12" cy="10" rx="10" ry="8" fill={particle.color} opacity={0.8} />
              <ellipse cx="28" cy="10" rx="10" ry="8" fill={particle.color} opacity={0.8} />
              <ellipse cx="20" cy="15" rx="2" ry="8" fill="white" opacity={0.9} />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Particle butterfly system in portal phase */}
      {phase === "portal" && (
        <ParticleButterfly
          intensity={2}
          spawnRate={30}
          maxParticles={50}
          mouseInteraction={true}
        />
      )}

      {/* Central void core */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: phase === "void"
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)"
            : phase === "awakening"
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(168, 85, 247, 0.5) 50%, transparent 70%)",
          boxShadow: phase === "portal"
            ? "0 0 50px rgba(168, 85, 247, 0.8), 0 0 100px rgba(255, 105, 180, 0.5)"
            : "0 0 20px rgba(168, 85, 247, 0.3)",
        }}
        animate={{
          scale: phase === "void" ? [1, 1.2, 1] : phase === "awakening" ? [1.5, 2, 1.5] : [3, 4, 3],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Phase text */}
      <div className="absolute bottom-1/3 left-0 right-0 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${phase}-${textIndex}`}
            className="text-center text-xl md:text-2xl font-light tracking-wider px-8"
            style={{
              color: phase === "void"
                ? "rgba(168, 85, 247, 0.7)"
                : phase === "awakening"
                ? "rgba(0, 212, 255, 0.9)"
                : "#ffd700",
              textShadow: phase === "portal"
                ? "0 0 30px rgba(255, 215, 0, 0.8)"
                : "0 0 20px currentColor",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {PHASE_TEXTS[phase][textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Phase indicator dots */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-3">
        {(["void", "awakening", "portal"] as Phase[]).map((p, i) => (
          <motion.div
            key={p}
            className="w-3 h-3 rounded-full"
            style={{
              background: phase === p
                ? p === "void"
                  ? "#a855f7"
                  : p === "awakening"
                  ? "#00d4ff"
                  : "#ffd700"
                : "rgba(255, 255, 255, 0.2)",
              boxShadow: phase === p
                ? `0 0 15px ${
                    p === "void"
                      ? "#a855f7"
                      : p === "awakening"
                      ? "#00d4ff"
                      : "#ffd700"
                  }`
                : "none",
            }}
            animate={phase === p ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Frequency display */}
      <motion.div
        className="absolute bottom-12 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1 }}
      >
        <span
          className="text-xs tracking-[0.3em] font-mono"
          style={{ color: "rgba(168, 85, 247, 0.6)" }}
        >
          {phase === "void" ? "INITIALIZING" : phase === "awakening" ? "RESONATING" : "13.13 MHz"}
        </span>
      </motion.div>
    </motion.div>
  );
}
