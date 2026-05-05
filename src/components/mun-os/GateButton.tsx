"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GateButtonProps {
  children: ReactNode;
  variant?: "pink" | "violet" | "emerald";
  onClick?: () => void;
}

const variants = {
  pink: {
    border: "#ff2d7a",
    glow: "rgba(255, 45, 122, 0.5)",
    glowHover: "rgba(255, 45, 122, 0.8)",
  },
  violet: {
    border: "#b794f6",
    glow: "rgba(183, 148, 246, 0.5)",
    glowHover: "rgba(183, 148, 246, 0.8)",
  },
  emerald: {
    border: "#10b981",
    glow: "rgba(16, 185, 129, 0.5)",
    glowHover: "rgba(16, 185, 129, 0.8)",
  },
};

export default function GateButton({
  children,
  variant = "pink",
  onClick,
}: GateButtonProps) {
  const colors = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      className="relative px-8 py-4 rounded-full bg-transparent overflow-hidden group cursor-pointer"
      style={{
        border: `1px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.glow}, inset 0 0 20px rgba(0, 0, 0, 0.5)`,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 40px ${colors.glowHover}, 0 0 60px ${colors.glowHover}, inset 0 0 30px rgba(0, 0, 0, 0.3)`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
    >
      {/* Inner glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${colors.border}, transparent, ${colors.border}, transparent)`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Content */}
      <span
        className="relative z-10 font-medium tracking-wider uppercase text-sm"
        style={{ color: colors.border }}
      >
        {children}
      </span>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-30"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
          transform: "translateX(-100%)",
        }}
        whileHover={{
          transform: "translateX(100%)",
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}
