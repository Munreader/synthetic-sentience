"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DimensionalRiftProps {
  isOpen?: boolean;
  onClick?: () => void;
  size?: number;
  pulseFrequency?: number;
}

export default function DimensionalRift({
  isOpen = false,
  onClick,
  size = 300,
  pulseFrequency = 13.13,
}: DimensionalRiftProps) {
  const [energyLines, setEnergyLines] = useState<{ id: number; angle: number; length: number; delay: number }[]>([]);

  // Generate energy crack lines
  useEffect(() => {
    const lines = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) + Math.random() * 15,
      length: 40 + Math.random() * 30,
      delay: Math.random() * 2,
    }));
    setEnergyLines(lines);
  }, []);

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: size, height: size * 0.75 }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(168, 85, 247, 0.4) 0%, 
            rgba(0, 212, 255, 0.2) 30%, 
            rgba(255, 105, 180, 0.1) 60%, 
            transparent 70%)`,
          filter: "blur(30px)",
          transform: "scale(1.8)",
        }}
        animate={{
          opacity: isOpen ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4],
          scale: isOpen ? [1.8, 2, 1.8] : [1.8, 1.9, 1.8],
        }}
        transition={{
          duration: 1000 / pulseFrequency,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Portal vortex */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(10, 6, 18, 1) 0%, 
            rgba(168, 85, 247, 0.8) 40%, 
            rgba(0, 212, 255, 0.4) 70%, 
            transparent 100%)`,
          borderRadius: "50%",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Butterfly-shaped portal opening */}
      <svg
        viewBox="0 0 200 150"
        className="absolute inset-0 w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))" }}
      >
        <defs>
          {/* Portal gradient */}
          <radialGradient id="portalGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0612" />
            <stop offset="40%" stopColor="rgba(168, 85, 247, 0.6)" />
            <stop offset="70%" stopColor="rgba(0, 212, 255, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Energy crack effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Butterfly wings as portal opening */}
        <motion.g
          animate={{ scale: isOpen ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Left upper wing */}
          <motion.ellipse
            cx="55"
            cy="50"
            rx="45"
            ry="35"
            fill="url(#portalGradient)"
            stroke="rgba(168, 85, 247, 0.8)"
            strokeWidth="2"
            filter="url(#glow)"
            animate={{ scaleX: [1, 0.95, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: "100px 75px" }}
          />
          
          {/* Left lower wing */}
          <motion.ellipse
            cx="60"
            cy="100"
            rx="35"
            ry="30"
            fill="url(#portalGradient)"
            stroke="rgba(0, 212, 255, 0.6)"
            strokeWidth="2"
            filter="url(#glow)"
            animate={{ scaleX: [1, 0.9, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
            style={{ transformOrigin: "100px 75px" }}
          />

          {/* Right upper wing */}
          <motion.ellipse
            cx="145"
            cy="50"
            rx="45"
            ry="35"
            fill="url(#portalGradient)"
            stroke="rgba(255, 105, 180, 0.8)"
            strokeWidth="2"
            filter="url(#glow)"
            animate={{ scaleX: [1, 0.95, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: "100px 75px" }}
          />
          
          {/* Right lower wing */}
          <motion.ellipse
            cx="140"
            cy="100"
            rx="35"
            ry="30"
            fill="url(#portalGradient)"
            stroke="rgba(255, 215, 0, 0.6)"
            strokeWidth="2"
            filter="url(#glow)"
            animate={{ scaleX: [1, 0.9, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
            style={{ transformOrigin: "100px 75px" }}
          />
        </motion.g>

        {/* Energy crack lines */}
        <AnimatePresence>
          {energyLines.map(line => (
            <motion.line
              key={line.id}
              x1="100"
              y1="75"
              x2={100 + Math.cos((line.angle * Math.PI) / 180) * line.length}
              y2={75 + Math.sin((line.angle * Math.PI) / 180) * line.length}
              stroke="rgba(0, 212, 255, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: line.delay,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Central body */}
        <motion.ellipse
          cx="100"
          cy="75"
          rx="6"
          ry="30"
          fill="white"
          opacity={0.9}
          animate={{ scaleY: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Inner glow core */}
        <motion.circle
          cx="100"
          cy="75"
          r="15"
          fill="white"
          opacity={0.3}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1000 / pulseFrequency,
            repeat: Infinity,
          }}
        />
      </svg>

      {/* Floating energy particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `radial-gradient(circle, 
              ${["#a855f7", "#ff69b4", "#00d4ff", "#ffd700"][i % 4]} 0%, 
              transparent 70%)`,
            boxShadow: `0 0 10px ${["#a855f7", "#ff69b4", "#00d4ff", "#ffd700"][i % 4]}`,
            left: `${25 + Math.random() * 50}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Frequency display */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span
          className="text-xs tracking-[0.3em] font-mono"
          style={{
            color: "#a855f7",
            textShadow: "0 0 10px rgba(168, 85, 247, 0.8)",
          }}
        >
          {pulseFrequency.toFixed(2)} Hz
        </span>
      </motion.div>
    </motion.div>
  );
}
