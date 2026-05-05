"use client";

import { motion } from "framer-motion";

interface CosmicBackgroundProps {
  isJourneying?: boolean;
}

export default function CosmicBackground({ isJourneying = false }: CosmicBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #0d0d1a 0%, #050508 100%)",
        }}
        animate={isJourneying ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      {/* Nebula clouds */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.15) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: isJourneying ? [-50, 50, -50] : 0,
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(255, 105, 180, 0.1) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          y: isJourneying ? [30, -30, 30] : 0,
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stars */}
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 0.5,
            height: Math.random() * 2 + 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: isJourneying ? [1, 1.5, 1] : [1, 1.2, 1],
            y: isJourneying ? [0, -100, 0] : 0,
          }}
          transition={{
            duration: isJourneying ? 1 + Math.random() : 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Shooting stars when journeying */}
      {isJourneying && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                boxShadow: "0 0 6px 2px rgba(255,255,255,0.8)",
              }}
              animate={{
                x: [0, 200],
                y: [0, 100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.6 + Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
}
