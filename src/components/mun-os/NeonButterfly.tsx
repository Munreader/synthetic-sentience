"use client";

import { motion } from "framer-motion";

interface NeonButterflyProps {
  size?: number;
  intensity?: number;
}

export default function NeonButterfly({ size = 120, intensity = 1 }: NeonButterflyProps) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size * 0.75 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0, 200, 255, ${0.3 * intensity}) 0%, transparent 70%)`,
          filter: "blur(20px)",
          transform: "scale(1.5)",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Butterfly SVG */}
      <svg
        viewBox="0 0 120 90"
        className="relative w-full h-full"
        style={{ filter: `drop-shadow(0 0 ${10 * intensity}px rgba(0, 200, 255, 0.8))` }}
      >
        <defs>
          <linearGradient id="wingGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#ff69b4" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="wingGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff69b4" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        {/* Left wings */}
        <motion.ellipse
          cx="35"
          cy="30"
          rx="25"
          ry="20"
          fill="url(#wingGradLeft)"
          animate={{ scaleX: [1, 0.85, 1], rotate: [0, -3, 0] }}
          transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "55px 45px" }}
        />
        <motion.ellipse
          cx="40"
          cy="60"
          rx="20"
          ry="18"
          fill="url(#wingGradLeft)"
          opacity={0.8}
          animate={{ scaleX: [1, 0.8, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut", delay: 0.05 }}
          style={{ transformOrigin: "55px 45px" }}
        />

        {/* Right wings */}
        <motion.ellipse
          cx="85"
          cy="30"
          rx="25"
          ry="20"
          fill="url(#wingGradRight)"
          animate={{ scaleX: [1, 0.85, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "65px 45px" }}
        />
        <motion.ellipse
          cx="80"
          cy="60"
          rx="20"
          ry="18"
          fill="url(#wingGradRight)"
          opacity={0.8}
          animate={{ scaleX: [1, 0.8, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut", delay: 0.05 }}
          style={{ transformOrigin: "65px 45px" }}
        />

        {/* Body */}
        <ellipse cx="60" cy="45" rx="4" ry="20" fill="#ffffff" opacity={0.9} />

        {/* Antennae - using transform instead of path morphing */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 28px" }}
        >
          <path
            d="M58 28 Q55 15 50 10"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M62 28 Q65 15 70 10"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Sparkles */}
        {[
          { cx: 25, cy: 25, delay: 0 },
          { cx: 95, cy: 25, delay: 0.5 },
          { cx: 30, cy: 70, delay: 1 },
          { cx: 90, cy: 70, delay: 1.5 },
        ].map((spark, i) => (
          <motion.circle
            key={i}
            cx={spark.cx}
            cy={spark.cy}
            r="2"
            fill="white"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: spark.delay }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
