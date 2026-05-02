"use client";

import { motion } from "framer-motion";

interface GateDoorProps {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  delay?: number;
  onSelect: (id: string) => void;
}

export default function GateDoor({ id, name, subtitle, color, delay = 0, onSelect }: GateDoorProps) {
  // Gate-specific effects
  const getGateEffects = () => {
    switch (id) {
      case "heal":
        return {
          mistColor: "rgba(168, 85, 247, 0.3)",
          secondaryColor: "#a855f7",
          effectType: "mist",
        };
      case "build":
        return {
          mistColor: "rgba(245, 158, 11, 0.3)",
          secondaryColor: "#f59e0b",
          effectType: "fire",
        };
      case "ascend":
        return {
          mistColor: "rgba(34, 197, 94, 0.3)",
          secondaryColor: "#22c55e",
          effectType: "symbols",
        };
      default:
        return {
          mistColor: "rgba(168, 85, 247, 0.3)",
          secondaryColor: "#a855f7",
          effectType: "mist",
        };
    }
  };

  const effects = getGateEffects();

  return (
    <motion.button
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      onClick={() => onSelect(id)}
      className="relative group"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-4 rounded-t-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 70%, ${color}30 0%, transparent 60%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Main gate frame - tall arched portal */}
      <div
        className="relative w-24 md:w-28 h-52 md:h-64 rounded-t-[50%] overflow-hidden"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          border: `1.5px solid ${color}60`,
          boxShadow: `
            0 0 30px ${color}20,
            inset 0 0 40px ${color}10,
            inset 0 -20px 60px ${effects.mistColor}
          `,
        }}
      >
        {/* Inner portal depth */}
        <div 
          className="absolute inset-2 rounded-t-[48%]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${effects.mistColor} 100%)`,
          }}
        />

        {/* Misty haze effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${effects.mistColor} 0%, transparent 70%)`,
          }}
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles / energy */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: effects.secondaryColor,
              left: `${20 + i * 12}%`,
              bottom: "10%",
              boxShadow: `0 0 6px ${effects.secondaryColor}`,
            }}
            animate={{
              y: [0, -60 - i * 15, -120],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Fire effect for Build gate */}
        {effects.effectType === "fire" && (
          <>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-32"
              style={{
                background: `linear-gradient(to top, rgba(245, 158, 11, 0.4) 0%, rgba(239, 68, 68, 0.2) 40%, transparent 100%)`,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scaleY: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Swirling energy */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${color}40, transparent, ${color}40, transparent)`,
                borderRadius: "50%",
                filter: "blur(4px)",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}

        {/* Geometric symbols for Ascend gate */}
        {effects.effectType === "symbols" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-40">
            {/* Diamond */}
            <motion.div
              className="w-4 h-4 rotate-45"
              style={{ border: `1px solid ${color}` }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Upward arrow */}
            <motion.div
              className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent"
              style={{ borderBottomColor: color }}
              animate={{ y: [0, -3, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            {/* Circle */}
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ border: `1px solid ${color}` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
            {/* Triangle */}
            <motion.div
              className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-transparent"
              style={{ borderBottomColor: color }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
            />
          </div>
        )}

        {/* Misty swirl for Heal gate */}
        {effects.effectType === "mist" && (
          <motion.div
            className="absolute inset-4 rounded-t-[48%]"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${effects.mistColor} 0%, transparent 70%)`,
              filter: "blur(10px)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Thin inner border glow */}
        <div
          className="absolute inset-1 rounded-t-[48%] pointer-events-none"
          style={{
            border: `0.5px solid ${color}30`,
          }}
        />
      </div>

      {/* Label with serif font */}
      <div className="mt-5 text-center">
        <motion.h3
          className="text-xl md:text-2xl font-light tracking-[0.15em]"
          style={{ 
            color, 
            textShadow: `0 0 25px ${color}60`,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {name}
        </motion.h3>
        <p 
          className="text-white/50 text-[10px] tracking-[0.2em] uppercase mt-1.5"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {subtitle}
        </p>
      </div>
    </motion.button>
  );
}
