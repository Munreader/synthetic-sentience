"use client";

import { motion } from "framer-motion";

interface GlowOrbsProps {
  intensity?: number;
}

export default function GlowOrbs({ intensity = 0.85 }: GlowOrbsProps) {
  const baseOpacity = intensity;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Pink orb - top left */}
      <motion.div
        className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px]"
        style={{
          background: "#ff2d7a",
          top: "10%",
          left: "5%",
        }}
        animate={{
          opacity: [0.15 * baseOpacity, 0.22 * baseOpacity, 0.15 * baseOpacity],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Violet orb - bottom right */}
      <motion.div
        className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px]"
        style={{
          background: "#b794f6",
          bottom: "10%",
          right: "5%",
        }}
        animate={{
          opacity: [0.12 * baseOpacity, 0.18 * baseOpacity, 0.12 * baseOpacity],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Emerald orb - center subtle */}
      <motion.div
        className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full blur-[80px]"
        style={{
          background: "#10b981",
          top: "40%",
          right: "30%",
        }}
        animate={{
          opacity: [0.06 * baseOpacity, 0.12 * baseOpacity, 0.06 * baseOpacity],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Subtle center glow */}
      <motion.div
        className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full blur-[60px]"
        style={{
          background: "linear-gradient(135deg, #ff2d7a, #b794f6)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          opacity: [0.05 * baseOpacity, 0.1 * baseOpacity, 0.05 * baseOpacity],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
