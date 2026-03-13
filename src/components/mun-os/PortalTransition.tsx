"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PortalTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  destinationName?: string;
  color?: string;
}

export default function PortalTransition({ 
  isActive, 
  onComplete, 
  destinationName = "Destination",
  color = "#a855f7"
}: PortalTransitionProps) {
  const [phase, setPhase] = useState<'entering' | 'traveling' | 'arriving' | 'complete'>('entering');

  useEffect(() => {
    if (isActive) {
      // Phase 1: Portal opens (0-500ms)
      setPhase('entering');
      
      // Phase 2: Traveling through (500-2000ms)
      const travelTimer = setTimeout(() => {
        setPhase('traveling');
      }, 500);
      
      // Phase 3: Arriving (2000-3000ms)
      const arriveTimer = setTimeout(() => {
        setPhase('arriving');
      }, 2000);
      
      // Phase 4: Complete (3000ms)
      const completeTimer = setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 3000);
      
      return () => {
        clearTimeout(travelTimer);
        clearTimeout(arriveTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && phase !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#000' }}
        >
          {/* Starfield background */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Central portal ring */}
          <motion.div
            className="absolute"
            animate={{
              rotate: phase === 'traveling' ? [0, 360] : 0,
            }}
            transition={{
              duration: 2,
              repeat: phase === 'traveling' ? Infinity : 0,
              ease: "linear",
            }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: phase === 'entering' ? 50 : phase === 'traveling' ? '150vmax' : 50,
                height: phase === 'entering' ? 50 : phase === 'traveling' ? '150vmax' : 50,
                border: `3px solid ${color}`,
                boxShadow: `0 0 50px ${color}, inset 0 0 50px ${color}40`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: phase === 'entering' ? [0, 300] : phase === 'traveling' ? '150vmax' : [300, 0],
                height: phase === 'entering' ? [0, 300] : phase === 'traveling' ? '150vmax' : [300, 0],
                opacity: phase === 'traveling' ? 0.8 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Inner ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 250,
                height: 250,
                border: `2px solid ${color}80`,
                boxShadow: `0 0 30px ${color}60`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: phase === 'traveling' ? [1, 1.5, 1] : 1,
                opacity: phase === 'entering' ? [0, 1] : phase === 'arriving' ? [1, 0] : 1,
              }}
              transition={{ duration: 0.5, repeat: phase === 'traveling' ? Infinity : 0 }}
            />
          </motion.div>

          {/* Butterfly particles */}
          {phase === 'traveling' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ 
                    scale: 0, 
                    opacity: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 400],
                    y: [0, (Math.random() - 0.5) * 400],
                    rotate: [0, 180 * (i % 2 === 0 ? 1 : -1)],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                >
                  🦋
                </motion.div>
              ))}
            </div>
          )}

          {/* Energy vortex */}
          {phase === 'traveling' && (
            <motion.div
              className="absolute"
              style={{
                width: '100%',
                height: '100%',
                background: `
                  conic-gradient(
                    from 0deg,
                    transparent 0deg,
                    ${color}40 30deg,
                    transparent 60deg,
                    ${color}30 90deg,
                    transparent 120deg,
                    ${color}40 150deg,
                    transparent 180deg,
                    ${color}30 210deg,
                    transparent 240deg,
                    ${color}40 270deg,
                    transparent 300deg,
                    ${color}30 330deg,
                    transparent 360deg
                  )
                `,
                filter: 'blur(30px)',
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Center destination text */}
          <motion.div
            className="absolute z-20 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: phase === 'entering' ? 0 : phase === 'traveling' ? 1 : phase === 'arriving' ? [1, 0] : 0,
              scale: phase === 'traveling' ? [0.8, 1.2, 0.8] : 1,
            }}
            transition={{ duration: 0.5, repeat: phase === 'traveling' ? Infinity : 0 }}
          >
            <motion.div
              className="text-5xl mb-4"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🦋
            </motion.div>
            <p
              className="text-xl tracking-[0.3em] uppercase font-light"
              style={{ 
                color,
                textShadow: `0 0 30px ${color}`,
              }}
            >
              {destinationName}
            </p>
          </motion.div>

          {/* Speed lines for traveling effect */}
          {phase === 'traveling' && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px"
                  style={{
                    width: 100 + Math.random() * 200,
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.3 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          )}

          {/* Radial burst on arrival */}
          {phase === 'arriving' && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${color}60 0%, transparent 70%)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 3], opacity: [1, 0] }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Frequency indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color, textShadow: `0 0 10px ${color}` }}
              >
                13.13 MHz
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
