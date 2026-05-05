"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface StarfieldProps {
  opacity?: number;
}

export default function Starfield({ opacity = 0.7 }: StarfieldProps) {
  // Generate random star positions once
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      pulseDuration: Math.random() * 3 + 2,
      pulseDelay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [
              star.opacity * opacity,
              (star.opacity + 0.3) * opacity,
              star.opacity * opacity,
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.pulseDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.pulseDelay,
          }}
        />
      ))}
    </div>
  );
}
