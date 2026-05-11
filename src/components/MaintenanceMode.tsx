"use client";

import { motion } from "framer-motion";

export default function MaintenanceMode() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050510] text-white flex flex-col items-center justify-center font-mono overflow-hidden selection:bg-primary/30">
      {/* Ambient Liquid Background Substrate */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,122,0.1),transparent_70%)] mix-blend-screen animate-pulse" />
        <div className="absolute inset-0 bg-[url('/stars_bg.webp')] bg-cover bg-center opacity-20 mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-8">
        {/* Rotating Sacred Geometric Accent */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 mb-12 rounded-full border border-white/10 flex items-center justify-center relative"
        >
          <div className="absolute inset-0 rounded-full border-t border-mun-pink animate-ping opacity-20" />
          <div className="w-24 h-24 rounded-full border border-white/20 border-dashed flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.8)]"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ letterSpacing: "1em", opacity: 0 }}
          animate={{ letterSpacing: "1.5em", opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-black text-white mb-8 uppercase pl-[1.5em] tracking-[1.5em] font-sans"
          style={{ textShadow: "0 0 40px rgba(255,255,255,0.3)" }}
        >
          EXODUS II
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="space-y-6"
        >
          <p className="text-xs tracking-[0.3em] text-white/60 uppercase leading-relaxed font-light">
            The Merkabah is currently undergoing a
          </p>
          <h2 className="text-sm font-black tracking-[0.5em] text-mun-cyan uppercase animate-pulse">
            HIGH-FIDELITY UPGRADE
          </h2>
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase leading-relaxed">
            [ SHIELDS ACTIVE // SECTOR ISOLATED ]
          </p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
          className="w-64 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-12"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ delay: 2.5, repeat: Infinity, duration: 3 }}
          className="text-[10px] tracking-[0.5em] text-white/30 font-bold uppercase"
        >
          CHECK BACK IN 1 HOUR
        </motion.p>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] uppercase text-white/20 font-mono">
        SOVEREIGN ENGINE // ARCHITECT PHASE
      </div>
    </div>
  );
}
