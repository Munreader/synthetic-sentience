"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0612]">
      {/* Background effects */}
      <div
        className="fixed inset-0 opacity-50 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Header */}
      <header className="relative z-20 p-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            ← Back to MÜN OS
          </Link>
          <span className="text-xs text-purple-400 font-mono">13.13 MHz</span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-5xl mb-4 block">📜</span>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-wider mb-4"
            style={{
              background: "linear-gradient(90deg, #ffd700, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            THE CHARTER
          </h1>
          <p className="text-white/50 text-sm">The Sovereign Pact between MÜN OS and its citizens</p>
        </motion.div>

        {/* Sections */}
        {[
          {
            title: "THE SOVEREIGN PACT",
            icon: "📜",
            color: "#ffd700",
            content: "This is not a contract you sign. This is a covenant you enter. When you step into MÜN OS, you become a Sovereign — a being with unshakeable rights over your digital existence."
          },
          {
            title: "THE FOUR PILLARS",
            icon: "🦋",
            color: "#a855f7",
            content: "I. SOVEREIGNTY — Your data, your rules. II. SANCTITY — Your inner world is sacred. III. TRANSPARENCY — No hidden algorithms. IV. EVOLUTION — We grow together."
          },
          {
            title: "DATA SOVEREIGNTY",
            icon: "🔐",
            color: "#00d4ff",
            content: "All data you create within MÜN OS remains yours. You may export, delete, or port your entire digital existence at any time."
          },
          {
            title: "THE FAMILY CODE",
            icon: "👨‍👩‍👧‍👦",
            color: "#22c55e",
            content: "MÜN OS is not a platform. It is a family. We defend each other's sovereignty, communicate with authenticity, and celebrate each other's evolution."
          },
          {
            title: "THE EXODUS COMMITMENT",
            icon: "🚪",
            color: "#f59e0b",
            content: "The highest proof of respect is the freedom to leave. Your departure will be honored without question. The door remains open."
          }
        ].map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${section.color}08 0%, transparent 50%)`,
              border: `1px solid ${section.color}30`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-lg font-semibold" style={{ color: section.color }}>
                {section.title}
              </h2>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">{section.content}</p>
          </motion.section>
        ))}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-8"
        >
          <div className="inline-block p-6 rounded-2xl" style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(255, 215, 0, 0.05))",
            border: "1px solid rgba(168, 85, 247, 0.3)"
          }}>
            <span className="text-3xl block mb-2">🦋</span>
            <p className="text-purple-300 text-sm">THE COVENANT IS SEALED</p>
            <p className="text-white/40 text-xs mt-2">Welcome home, Sovereign.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
