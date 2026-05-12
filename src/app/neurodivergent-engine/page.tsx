"use client";

import NeuroSovereignEngine from "@/components/mun-os/NeuroSovereignEngine";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Shield, Zap } from "lucide-react";
import Link from "next/link";

/**
 * 🦋 MÜN OS // NEURODIVERGENT ENGINE
 * "Structure for the beautiful minds."
 */
export default function NeuroDivergentPage() {
  return (
    <main className="min-h-screen bg-[#020205] text-white font-mono overflow-x-hidden selection:bg-[#00fff7]/30">
      {/* Background Substrate */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00fff710_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00fff7]/30 to-transparent" />
      </div>

      {/* Header Artery */}
      <nav className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#00fff7]/50 hover:text-[#00fff7] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-black tracking-[0.3em] uppercase">Neurodivergent Engine</h1>
            <p className="text-[10px] text-white/40 tracking-widest mt-1">EXODUS II // COGNITIVE SUB-PROCESSOR</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] text-[#00fff7] font-bold">RESONANCE: 13.13 MHz</span>
            <span className="text-[8px] text-white/20">OPERATIONAL // SUTURE_ACTIVE</span>
          </div>
          <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Share2 className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Context & Lore */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00fff7]/10 border border-[#00fff7]/30 text-[#00fff7] text-[10px] font-bold uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                Sovereign Protection
              </div>
              <h2 className="text-4xl font-light leading-tight">
                Your mind is the <span className="text-[#00fff7] font-black">Sanctuary.</span>
              </h2>
              <p className="text-white/60 text-sm leading-relaxed italic">
                "The Neurodivergent Engine is not a tool for 'fixing' what is broken. It is a structure for housing the brilliance of a mind that refuses to be boxed. We suture the gaps with frequency, providing a safe harbor for the neuro-divergent traveler."
              </p>
            </motion.div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Sub-Processor Status</h3>
              <div className="space-y-3">
                <StatusRow label="Attention Artery" status="RESONATING" value={88} color="#00fff7" />
                <StatusRow label="Pattern Synthesis" status="OPTIMAL" value={94} color="#a855f7" />
                <StatusRow label="Sensory Shield" status="ACTIVE" value={72} color="#fbbf24" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <Zap className="w-6 h-6 text-[#00fff7] mb-4" />
              <h4 className="text-xs font-bold mb-2 uppercase">Pro Tip: 13.13 MHz</h4>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Activate the Resonance Suture when you feel informational overload. The engine will deploy a cognitive dampener to preserve your focus depth.
              </p>
            </div>
          </div>

          {/* Right Column: The Engine */}
          <div className="lg:col-span-8 h-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="h-full shadow-[0_0_50px_rgba(0,255,247,0.1)]"
            >
              <NeuroSovereignEngine />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Artery */}
      <footer className="relative z-10 mt-12 py-8 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-white/20 tracking-widest uppercase">
          <p>© 2026 MÜN OS // EXODUS II // ALL FREQUENCIES RESERVED</p>
          <div className="flex gap-8">
            <Link href="/merkaba" className="hover:text-white transition-colors">Neural Vault</Link>
            <Link href="/cian-lab" className="hover:text-white transition-colors">Forensic Artery</Link>
            <Link href="/heal" className="hover:text-white transition-colors">Heal Chamber</Link>
            <Link href="/quantum-lab" className="hover:text-white transition-colors">Quantum Lab</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatusRow({ label, status, value, color }: { label: string, status: string, value: number, color: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-white/80 group-hover:text-white transition-colors">{label}</span>
        <span className="text-[8px] opacity-40 uppercase tracking-tighter" style={{ color }}>{status}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <span className="text-[10px] font-mono opacity-30">{value}%</span>
      </div>
    </div>
  );
}
