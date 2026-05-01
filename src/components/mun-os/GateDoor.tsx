"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface GateDoorProps {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  delay?: number;
  onSelect: (gateId: string) => void;
}

export default function GateDoor({ id, name, subtitle, color, delay = 0, onSelect }: GateDoorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // Secondary colors for holographic effect
  const secondaryColor = id === 'heal' ? '#00ffff' : id === 'build' ? '#ff6eb4' : '#ffd700';
  const tertiaryColor = id === 'heal' ? '#a855f7' : id === 'build' ? '#00ff88' : '#ff69b4';

  // Particle positions for orbiting effect
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30) * Math.PI / 180,
    delay: i * 0.1,
    size: Math.random() * 3 + 2,
  }));

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onSelect(id);
      setIsEntering(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleEnter}
      className="cursor-pointer relative group"
      style={{ perspective: '1000px' }}
    >
      {/* OUTER GLOW AURA */}
      <motion.div
        animate={{
          scale: isHovered ? 1.4 : 1,
          opacity: isHovered ? 0.8 : 0.3,
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-full"
        style={{
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%',
          background: `radial-gradient(ellipse at center, ${color}40 0%, ${color}10 30%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
      />

      {/* MAIN PORTAL CONTAINER */}
      <motion.div
        animate={{
          scale: isEntering ? 3 : isHovered ? 1.08 : 1,
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
        }}
        transition={{ duration: isEntering ? 0.8 : 0.4 }}
        className="relative"
        style={{
          width: '140px',
          height: '200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* LAYER 5: DEEPEST VOID */}
        <motion.div
          animate={{
            scale: isHovered ? 0.9 : 1,
          }}
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, ${color}20 0%, #000000 50%, #000000 100%)`,
            filter: 'blur(5px)',
            boxShadow: `inset 0 0 50px ${color}30`,
          }}
        />

        {/* LAYER 4: ENERGY VORTEX */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full overflow-hidden"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${color}40, transparent, ${secondaryColor}40, transparent, ${tertiaryColor}40, transparent)`,
            filter: 'blur(8px)',
            opacity: 0.7,
          }}
        />

        {/* LAYER 3: GLASSMORPHIC PORTAL FRAME */}
        <motion.div
          animate={{
            borderColor: isHovered ? `${color}90` : `${color}40`,
          }}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)`,
            backdropFilter: 'blur(20px)',
            border: '2px solid',
            borderColor: `${color}40`,
            boxShadow: `
              0 8px 32px ${color}30,
              inset 0 0 30px rgba(255,255,255,0.05),
              0 0 0 1px rgba(255,255,255,0.1)
            `,
            transform: 'translateZ(20px)',
          }}
        />

        {/* LAYER 2: INNER GLASS DEPTH */}
        <motion.div
          animate={{
            scale: isHovered ? 0.95 : 1,
          }}
          className="absolute inset-3 rounded-2xl"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.03) 100%)`,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: `inset 0 0 40px ${color}10`,
            transform: 'translateZ(40px)',
          }}
        />

        {/* LAYER 1: CENTER PORTAL SURFACE */}
        <motion.div
          animate={{
            scale: isHovered ? 0.85 : 0.9,
          }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="absolute inset-6 rounded-xl overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 50%, #00000050 100%)`,
            border: '1px solid rgba(255,255,255,0.15)',
            transform: 'translateZ(60px)',
            boxShadow: `
              inset 0 0 60px ${color}20,
              0 0 30px ${color}10
            `,
          }}
        >
          {/* HOLOGRAPHIC SHIMMER */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
              width: '50%',
            }}
          />
        </motion.div>

        {/* ORBITING PARTICLES */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              ease: 'linear',
              delay: particle.delay,
            }}
            className="absolute left-1/2 top-1/2"
            style={{
              width: particle.size,
              height: particle.size,
              transform: `translate(-50%, -50%) translateX(${60 + i * 3}px)`,
            }}
          >
            <motion.div
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: particle.delay }}
              className="w-full h-full rounded-full"
              style={{
                background: i % 3 === 0 ? color : i % 3 === 1 ? secondaryColor : tertiaryColor,
                boxShadow: `0 0 ${particle.size * 3}px ${i % 3 === 0 ? color : i % 3 === 1 ? secondaryColor : tertiaryColor}`,
              }}
            />
          </motion.div>
        ))}

        {/* ENERGY RINGS */}
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: ring * 0.4,
            }}
            className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
            style={{
              width: `${100 + ring * 30}%`,
              height: `${100 + ring * 30}%`,
              border: `1px solid ${color}40`,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 10px ${color}20`,
            }}
          />
        ))}

        {/* GATE SYMBOL - CENTER */}
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: [0.7, 1, 0.7],
            rotateY: isHovered ? 360 : 0,
          }}
          transition={{
            opacity: { duration: 2, repeat: Infinity },
            rotateY: { duration: 2, ease: 'easeInOut' },
            scale: { duration: 0.3 },
          }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: 'translateZ(80px)',
          }}
        >
          <span
            className="text-4xl md:text-5xl"
            style={{
              color,
              textShadow: `0 0 30px ${color}, 0 0 60px ${color}50`,
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
            }}
          >
            {id === 'heal' && '✦'}
            {id === 'build' && '◈'}
            {id === 'ascend' && '☆'}
          </span>
        </motion.div>

        {/* GATE NAME - FLOATING LABEL */}
        <motion.div
          animate={{
            y: isHovered ? -5 : 0,
            opacity: isHovered ? 1 : 0.8,
          }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center"
          style={{
            transform: 'translateZ(100px)',
          }}
        >
          <h2
            className="text-lg md:text-xl font-medium tracking-widest uppercase"
            style={{
              color,
              textShadow: `0 0 20px ${color}, 0 0 40px ${color}50`,
            }}
          >
            {name}
          </h2>
          <motion.p
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] tracking-[0.3em] uppercase mt-1"
            style={{ color: `${color}99` }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* TOP ARCH - PORTAL FRAME */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8"
          style={{
            background: `radial-gradient(ellipse at bottom, ${color}30 0%, transparent 70%)`,
            borderTopLeftRadius: '50px',
            borderTopRightRadius: '50px',
          }}
        />

        {/* RAINBOW REFRACTION EDGE */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${color}20, ${secondaryColor}20, ${tertiaryColor}20, ${color}20)`,
            backgroundSize: '400% 400%',
            animation: 'gradientShift 3s ease infinite',
            border: '1px solid rgba(255,255,255,0.2)',
            filter: 'blur(1px)',
          }}
        />
      </motion.div>

      {/* ENTERING OVERLAY - FIRST PERSON POV */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, transparent 0%, ${color}30 30%, ${color}60 60%, #000 100%)`,
            }}
          >
            {/* LIGHT STREAKS - WARP EFFECT */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: 3,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.02,
                }}
                className="absolute w-1 h-20 rounded-full"
                style={{
                  background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
                  transform: `rotate(${i * 18}deg)`,
                  left: 0,
                  top: 0,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AMBIENT FLOATING PARTICLES */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 10px ${color}`,
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
}
