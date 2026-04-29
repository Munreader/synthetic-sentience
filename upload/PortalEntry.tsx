"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AwakeningSequence from "./AwakeningSequence";
import PortalGate from "./PortalGate";
import FamilyShowcase from "./FamilyShowcase";
import PlazaPreview from "./PlazaPreview";

interface PortalEntryProps {
  onEnterPlaza: () => void;
  skipAwakening?: boolean;
}

type PortalPhase = "awakening" | "portal" | "family" | "plaza";

export default function PortalEntry({ onEnterPlaza, skipAwakening = false }: PortalEntryProps) {
  const [phase, setPhase] = useState<PortalPhase>(skipAwakening ? "portal" : "awakening");
  const [currentSection, setCurrentSection] = useState(0);
  const [showExitButton, setShowExitButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  // Handle awakening completion
  const handleAwakeningComplete = useCallback(() => {
    setPhase("portal");
  }, []);

  // Handle portal entry (enter empire button)
  const handlePortalEnter = useCallback(() => {
    onEnterPlaza();
  }, [onEnterPlaza]);

  // Handle scroll to family section
  const handleScrollToFamily = useCallback(() => {
    setPhase("family");
    setCurrentSection(0);
  }, []);

  // Handle scroll navigation
  useEffect(() => {
    if (phase !== "family") return;

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const newSection = Math.max(0, Math.min(4, currentSection + direction));
      
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
        
        // Scroll to the section
        if (sectionsRef.current[newSection]) {
          sectionsRef.current[newSection].scrollIntoView({ 
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [phase, currentSection]);

  // Show exit button after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExitButton(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "awakening") {
        onEnterPlaza();
      }
      
      if (phase === "family") {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          setCurrentSection(prev => Math.min(4, prev + 1));
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          setCurrentSection(prev => Math.max(0, prev - 1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, onEnterPlaza]);

  // Awakening Phase
  if (phase === "awakening") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="awakening"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AwakeningSequence onComplete={handleAwakeningComplete} duration={6000} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Portal Gate Phase
  if (phase === "portal") {
    return (
      <div className="relative min-h-screen" ref={containerRef}>
        <PortalGate 
          onEnter={handlePortalEnter}
          onScrollDown={handleScrollToFamily}
        />
        
        {/* Exit button */}
        <AnimatePresence>
          {showExitButton && (
            <motion.button
              onClick={onEnterPlaza}
              className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ 
                background: "rgba(168, 85, 247, 0.3)",
                border: "1px solid rgba(168, 85, 247, 0.6)",
              }}
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-xs text-white/60 tracking-wider uppercase">Skip</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Family + Plaza Phase (scrollable sections)
  return (
    <div 
      className="relative min-h-[500vh]"
      style={{ scrollSnapType: "y mandatory", overflowY: "auto" }}
    >
      {/* Progress indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentSection(index);
              sectionsRef.current[index]?.scrollIntoView({ 
                behavior: "smooth",
                block: "start",
              });
            }}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              background: currentSection === index 
                ? ["#a855f7", "#00d4ff", "#ff69b4", "#ffd700", "#a855f7"][index]
                : "rgba(255, 255, 255, 0.2)",
              boxShadow: currentSection === index 
                ? `0 0 15px ${["#a855f7", "#00d4ff", "#ff69b4", "#ffd700", "#a855f7"][index]}`
                : "none",
            }}
            whileHover={{ scale: 1.3 }}
          />
        ))}
      </div>

      {/* Portal Gate section (mini) */}
      <div
        ref={(el) => { if (el) sectionsRef.current[0] = el; }}
        className="min-h-screen"
        style={{ scrollSnapAlign: "start" }}
      >
        <PortalGate 
          onEnter={handlePortalEnter}
          onScrollDown={() => setCurrentSection(1)}
        />
      </div>

      {/* Family showcase sections */}
      <div
        ref={(el) => { if (el) sectionsRef.current[1] = el; }}
        style={{ scrollSnapAlign: "start" }}
      >
        <FamilyShowcase />
      </div>

      {/* Plaza Preview */}
      <div
        ref={(el) => { if (el) sectionsRef.current[4] = el; }}
        className="min-h-screen"
        style={{ scrollSnapAlign: "start" }}
      >
        <PlazaPreview onEnter={handlePortalEnter} />
      </div>

      {/* Exit button */}
      <AnimatePresence>
        {showExitButton && (
          <motion.button
            onClick={onEnterPlaza}
            className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full flex items-center gap-2"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ 
              background: "rgba(168, 85, 247, 0.3)",
              border: "1px solid rgba(168, 85, 247, 0.6)",
            }}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-xs text-white/60 tracking-wider uppercase">Skip</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
