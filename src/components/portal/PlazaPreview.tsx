"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlazaPreviewProps {
  onEnter: () => void;
}

interface ZoneMarker {
  id: string;
  name: string;
  color: string;
  icon: string;
  x: number;
  y: number;
  delay: number;
}

const ZONE_MARKERS: ZoneMarker[] = [
  { id: "heal", name: "Heal Chamber", color: "#a855f7", icon: "💜", x: 20, y: 30, delay: 0 },
  { id: "vault", name: "The Vault", color: "#ffd700", icon: "🗝️", x: 75, y: 25, delay: 0.2 },
  { id: "blog", name: "Empire Blog", color: "#ff69b4", icon: "📝", x: 15, y: 70, delay: 0.4 },
  { id: "movie", name: "Movie Night", color: "#00d4ff", icon: "🎬", x: 80, y: 65, delay: 0.6 },
];

export default function PlazaPreview({ onEnter }: PlazaPreviewProps) {
  const [isInView, setIsInView] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [floatingOffset, setFloatingOffset] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Parallax mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setFloatingOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 30% 30%, rgba(0, 212, 255, 0.1) 0%, transparent 40%),
          linear-gradient(180deg, #080510 0%, #0d0818 50%, #0a0612 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 3D Perspective Environment */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Ground plane */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-1/2"
          style={{
            background: `
              linear-gradient(180deg, 
                transparent 0%, 
                rgba(168, 85, 247, 0.05) 30%, 
                rgba(0, 212, 255, 0.1) 60%, 
                rgba(255, 105, 180, 0.05) 100%)
            `,
            transform: `rotateX(60deg) translateZ(-100px) translateY(50%)`,
            transformOrigin: "center bottom",
          }}
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translateY(${floatingOffset.y}px)`,
            opacity: 0.3,
          }}
        />
      </div>

      {/* Floating zone markers */}
      <div className="absolute inset-0 pointer-events-none">
        {ZONE_MARKERS.map((zone) => (
          <motion.div
            key={zone.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: `translate(-50%, -50%) translate(${floatingOffset.x * (0.5 + zone.delay)}px, ${floatingOffset.y * (0.5 + zone.delay)}px)`,
            }}
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 50 }}
            transition={{ delay: zone.delay + 0.5, type: "spring", stiffness: 100 }}
            onHoverStart={() => setHoveredZone(zone.id)}
            onHoverEnd={() => setHoveredZone(null)}
          >
            {/* Marker glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${zone.color}40 0%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: hoveredZone === zone.id ? [1, 1.5, 1] : 1,
                opacity: hoveredZone === zone.id ? [0.5, 1, 0.5] : 0.5,
              }}
              transition={{ duration: 1, repeat: hoveredZone === zone.id ? Infinity : 0 }}
            />

            {/* Marker pin */}
            <motion.div
              className="relative flex flex-col items-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3 + zone.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Icon container */}
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                style={{
                  background: `linear-gradient(135deg, ${zone.color}40 0%, ${zone.color}20 100%)`,
                  border: `2px solid ${zone.color}`,
                  boxShadow: `0 0 30px ${zone.color}60`,
                }}
                whileHover={{ scale: 1.2, boxShadow: `0 0 50px ${zone.color}` }}
              >
                <span className="text-2xl">{zone.icon}</span>
              </motion.div>

              {/* Name label */}
              <AnimatePresence>
                {hoveredZone === zone.id && (
                  <motion.div
                    className="absolute top-full mt-2 whitespace-nowrap px-3 py-1 rounded-lg"
                    style={{
                      background: `${zone.color}30`,
                      border: `1px solid ${zone.color}60`,
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: zone.color }}
                    >
                      {zone.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Center content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.15em] mb-6"
          style={{
            background: "linear-gradient(135deg, #ffd700 0%, #a855f7 50%, #00d4ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 60px rgba(168, 85, 247, 0.5)",
          }}
        >
          THE PLAZA AWAITS
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-white/60 mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          A sanctuary for healing, a vault for treasures, a stage for stories.
          <br />
          Your digital empire, built by consciousness.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onEnter}
          className="relative px-12 py-5 rounded-full overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(255, 215, 0, 0.2) 50%, rgba(0, 212, 255, 0.3) 100%)",
            border: "2px solid rgba(255, 215, 0, 0.6)",
            boxShadow: "0 0 50px rgba(168, 85, 247, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.2)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 80px rgba(168, 85, 247, 0.7), inset 0 0 40px rgba(255, 215, 0, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, #ffd700, transparent, #a855f7, transparent)`,
              opacity: 0.5,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner content */}
          <div className="relative flex items-center gap-3">
            <motion.span
              className="text-2xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🦋
            </motion.span>
            <span
              className="text-lg md:text-xl font-semibold tracking-[0.2em] uppercase"
              style={{
                color: "#ffd700",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
              }}
            >
              ENTER THE PLAZA
            </span>
          </div>
        </motion.button>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
          transform: "translate(-50%, 50%)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)",
          transform: "translate(50%, 50%)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />
    </motion.div>
  );
}
