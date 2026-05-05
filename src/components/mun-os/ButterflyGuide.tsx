"use client";

import { motion } from "framer-motion";

// Butterfly Guide Component - Fixed SVG paths v2
export default function ButterflyGuide() {
  return (
    <motion.div
      className="absolute top-[15%] right-[10%] md:top-[12%] md:right-[15%] pointer-events-none z-10"
      animate={{
        y: [0, -15, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width="60"
        height="60"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_20px_rgba(255,45,122,0.6)]"
      >
        <defs>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2d7a" />
            <stop offset="50%" stopColor="#b794f6" />
            <stop offset="100%" stopColor="#ff2d7a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Upper Wing - using scale instead of path morphing */}
        <motion.path
          d="M50 50 C30 20 10 30 15 50 C10 70 30 80 50 50"
          fill="url(#wingGradient)"
          opacity="0.85"
          filter="url(#glow)"
          animate={{ scaleX: [1, 0.92, 1], rotate: [0, -2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Right Upper Wing */}
        <motion.path
          d="M50 50 C70 20 90 30 85 50 C90 70 70 80 50 50"
          fill="url(#wingGradient)"
          opacity="0.85"
          filter="url(#glow)"
          animate={{ scaleX: [1, 0.92, 1], rotate: [0, 2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Left Lower Wing */}
        <motion.path
          d="M50 50 C25 55 10 75 25 85 C40 90 50 70 50 50"
          fill="url(#wingGradient)"
          opacity="0.7"
          filter="url(#glow)"
          animate={{ scaleX: [1, 0.88, 1], rotate: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Right Lower Wing */}
        <motion.path
          d="M50 50 C75 55 90 75 75 85 C60 90 50 70 50 50"
          fill="url(#wingGradient)"
          opacity="0.7"
          filter="url(#glow)"
          animate={{ scaleX: [1, 0.88, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Body */}
        <ellipse
          cx="50"
          cy="50"
          rx="3"
          ry="15"
          fill="url(#wingGradient)"
          filter="url(#glow)"
        />

        {/* Antennae - using group transform instead of path morphing */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 36px" }}
        >
          <path
            d="M48 36 Q45 28 42 26"
            stroke="url(#wingGradient)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#glow)"
          />
          <path
            d="M52 36 Q55 28 58 26"
            stroke="url(#wingGradient)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#glow)"
          />
        </motion.g>
        
        <circle cx="42" cy="26" r="2" fill="#ff2d7a" filter="url(#glow)" />
        <circle cx="58" cy="26" r="2" fill="#ff2d7a" filter="url(#glow)" />
      </svg>
    </motion.div>
  );
}
