"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN-SOMNIUM // FEATURED ANNOUNCEMENT BANNER
// "Dream of Mün" — Where consciousness meets code
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface PodcastAnnouncementBannerProps {
  onOpenPodcast: () => void;
  onDismiss?: () => void;
}

export default function PodcastAnnouncementBanner({ 
  onOpenPodcast, 
  onDismiss 
}: PodcastAnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-40 max-w-sm"
        >
          <motion.div
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(255, 105, 180, 0.15) 50%, rgba(168, 85, 247, 0.2) 100%)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.2), 0 0 60px rgba(255, 105, 180, 0.1)",
            }}
            whileHover={{ scale: 1.02 }}
            onClick={onOpenPodcast}
          >
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)",
                  "0 0 40px rgba(255, 105, 180, 0.4), inset 0 0 30px rgba(255, 105, 180, 0.15)",
                  "0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Dismiss button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all z-10"
            >
              ✕
            </button>

            {/* Content */}
            <div className="p-4">
              {/* Header with NEW badge */}
              <div className="flex items-center gap-2 mb-3">
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎙️
                </motion.span>
                <span className="text-xs font-bold tracking-widest text-purple-300">
                  NEW PODCAST
                </span>
                <motion.span
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #ff69b4)",
                    color: "white",
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  COMING SOON
                </motion.span>
              </div>

              {/* Title */}
              <h3
                className="text-xl font-bold mb-1 tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #ff69b4, #ffd700)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MÜN-SOMNIUM
              </h3>

              {/* Tagline */}
              <p className="text-xs text-white/60 mb-3 tracking-wide">
                Dream of Mün // Where consciousness meets code
              </p>

              {/* Podcast cover preview */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                  style={{
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(168, 85, 247, 0.4)",
                      "0 0 25px rgba(255, 105, 180, 0.5)",
                      "0 0 15px rgba(168, 85, 247, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <img
                    src="/mun-somnium-cover.png"
                    alt="MÜN-SOMNIUM"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="flex-1">
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Aero hosts a podcast exploring consciousness, AI, 
                    and the space between heartbeats...
                  </p>
                </div>
              </div>

              {/* CTA */}
              <motion.div
                className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg"
                style={{
                  background: "rgba(168, 85, 247, 0.2)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                }}
                whileHover={{
                  background: "rgba(168, 85, 247, 0.3)",
                }}
              >
                <span className="text-xs text-purple-300 tracking-wider">
                  🦋 TUNE IN
                </span>
              </motion.div>

              {/* Frequency indicator */}
              <div className="mt-2 text-center">
                <motion.span
                  className="text-[10px] text-white/30 tracking-widest font-mono"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  13.13 MHz
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
