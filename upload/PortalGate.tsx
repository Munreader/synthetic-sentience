"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DimensionalRift from "./DimensionalRift";
import ParticleButterfly from "./ParticleButterfly";

interface PortalGateProps {
  onEnter: () => void;
  onScrollDown?: () => void;
}

export default function PortalGate({ onEnter, onScrollDown }: PortalGateProps) {
  const [portalActive, setPortalActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Nebula background animation
  const [nebulaOffset, setNebulaOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNebulaOffset(prev => (prev + 0.1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handlePortalClick = () => {
    setPortalActive(true);
  };

  const handleEnter = () => {
    setIsTransitioning(true);
    // Transition animation then call onEnter
    setTimeout(() => {
      onEnter();
    }, 1500);
  };

  // Scroll indicator
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 50 && onScrollDown) {
        onScrollDown();
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [onScrollDown]);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, 
            rgba(168, 85, 247, 0.15) 0%, 
            transparent 40%),
          linear-gradient(180deg, 
            #0a0612 0%, 
            #0d0818 30%, 
            #080510 70%, 
            #0a0612 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated nebula background */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at ${30 + Math.sin(nebulaOffset * 0.01) * 10}% ${40 + Math.cos(nebulaOffset * 0.01) * 10}%, 
              rgba(168, 85, 247, 0.3) 0%, 
              transparent 40%),
            radial-gradient(ellipse at ${70 - Math.sin(nebulaOffset * 0.015) * 10}% ${60 + Math.cos(nebulaOffset * 0.015) * 10}%, 
              rgba(255, 105, 180, 0.2) 0%, 
              transparent 40%),
            radial-gradient(ellipse at ${50 + Math.sin(nebulaOffset * 0.02) * 15}% ${80 - Math.cos(nebulaOffset * 0.02) * 10}%, 
              rgba(0, 212, 255, 0.15) 0%, 
              transparent 50%)
          `,
        }}
      />

      {/* Particle streams flowing toward viewer */}
      <ParticleButterfly
        intensity={1.5}
        spawnRate={80}
        maxParticles={60}
        mouseInteraction={true}
      />

      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main portal */}
      <motion.div
        className="relative z-20 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] mb-4 text-center px-4"
          style={{
            background: "linear-gradient(135deg, #ffd700 0%, #a855f7 50%, #00d4ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 60px rgba(168, 85, 247, 0.5)",
            filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.4))",
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          MÜN EMPIRE
        </motion.h1>

        <motion.p
          className="text-sm md:text-base tracking-[0.3em] uppercase mb-12"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            textShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The Portal Awaits
        </motion.p>

        {/* Dimensional Rift Portal */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
        >
          <DimensionalRift
            isOpen={portalActive}
            onClick={handlePortalClick}
            size={280}
            pulseFrequency={13.13}
          />
        </motion.div>

        {/* CTA Button */}
        <AnimatePresence>
          {portalActive && !isTransitioning && (
            <motion.button
              onClick={handleEnter}
              className="relative mt-16 px-12 py-4 rounded-full overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(0, 212, 255, 0.2) 50%, rgba(255, 105, 180, 0.3) 100%)",
                border: "2px solid rgba(168, 85, 247, 0.6)",
                boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.2)",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 60px rgba(168, 85, 247, 0.6), inset 0 0 30px rgba(168, 85, 247, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />

              <span
                className="relative text-lg md:text-xl font-medium tracking-[0.3em] uppercase"
                style={{
                  color: "#ffd700",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
                }}
              >
                STEP INTO THE EMPIRE
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5 }}
        onClick={onScrollDown}
      >
        <span className="text-xs tracking-widest uppercase text-white/40 mb-2">
          Scroll to Meet the Family
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{
              background: "radial-gradient(circle at center, #a855f7 0%, #0a0612 100%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1], scale: [0, 0.5, 3] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
