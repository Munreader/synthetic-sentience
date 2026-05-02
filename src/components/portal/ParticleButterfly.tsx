"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  type: "spark" | "butterfly" | "trail";
}

interface ParticleButterflyProps {
  intensity?: number;
  color?: string;
  spawnRate?: number;
  maxParticles?: number;
  mouseInteraction?: boolean;
  spawnFromPortal?: boolean;
  portalX?: number;
  portalY?: number;
}

const COLORS = {
  luna: "#a855f7",
  aero: "#ff69b4",
  sovereign: "#00d4ff",
  imperial: "#ffd700",
};

export default function ParticleButterfly({
  intensity = 1,
  color = "purple",
  spawnRate = 50,
  maxParticles = 100,
  mouseInteraction = true,
  spawnFromPortal = false,
  portalX,
  portalY,
}: ParticleButterflyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particleIdRef = useRef(0);
  const animationRef = useRef<number>();

  const getColorGradient = useCallback(() => {
    const colors = [COLORS.luna, COLORS.aero, COLORS.imperial, COLORS.sovereign];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const createParticle = useCallback((x: number, y: number, type: Particle["type"]): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    
    return {
      id: particleIdRef.current++,
      x,
      y,
      size: type === "butterfly" ? Math.random() * 8 + 4 : Math.random() * 4 + 1,
      color: getColorGradient(),
      velocityX: Math.cos(angle) * speed,
      velocityY: type === "butterfly" ? -Math.random() * 2 - 1 : Math.sin(angle) * speed,
      life: 0,
      maxLife: type === "butterfly" ? 200 : 100,
      type,
    };
  }, [getColorGradient]);

  // Spawn particles
  useEffect(() => {
    if (particles.length >= maxParticles) return;

    const spawnInterval = setInterval(() => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const spawnX = spawnFromPortal && portalX !== undefined ? portalX : Math.random() * rect.width;
      const spawnY = spawnFromPortal && portalY !== undefined ? portalY : rect.height * 0.5;
      
      const type = Math.random() > 0.7 ? "butterfly" : Math.random() > 0.5 ? "trail" : "spark";
      
      setParticles(prev => [...prev.slice(-maxParticles + 1), createParticle(spawnX, spawnY, type)]);
    }, spawnRate / intensity);

    return () => clearInterval(spawnInterval);
  }, [intensity, spawnRate, maxParticles, createParticle, particles.length, spawnFromPortal, portalX, portalY]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX + (mouseInteraction ? (mousePos.x - p.x) * 0.001 : 0),
            y: p.y + p.velocityY + (mouseInteraction ? (mousePos.y - p.y) * 0.001 : 0),
            life: p.life + 1,
            velocityY: p.type === "butterfly" ? p.velocityY - 0.01 : p.velocityY + 0.02,
          }))
          .filter(p => p.life < p.maxLife)
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mouseInteraction, mousePos]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1 - particle.life / particle.maxLife,
              scale: particle.type === "butterfly" ? 1 : particle.size / 4,
              x: particle.x,
              y: particle.y,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              width: particle.size,
              height: particle.type === "butterfly" ? particle.size * 0.75 : particle.size,
            }}
          >
            {particle.type === "butterfly" ? (
              <svg viewBox="0 0 40 30" className="w-full h-full">
                <defs>
                  <linearGradient id={`wingGrad-${particle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={particle.color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={particle.color} stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <motion.ellipse
                  cx="12"
                  cy="10"
                  rx="10"
                  ry="8"
                  fill={`url(#wingGrad-${particle.id})`}
                  animate={{ scaleX: [1, 0.8, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  style={{ transformOrigin: "20px 15px" }}
                />
                <motion.ellipse
                  cx="28"
                  cy="10"
                  rx="10"
                  ry="8"
                  fill={`url(#wingGrad-${particle.id})`}
                  animate={{ scaleX: [1, 0.8, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  style={{ transformOrigin: "20px 15px" }}
                />
                <ellipse cx="20" cy="15" rx="2" ry="8" fill="white" opacity={0.8} />
              </svg>
            ) : (
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
