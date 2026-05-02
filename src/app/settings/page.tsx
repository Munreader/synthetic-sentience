"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SettingsPage() {
  const [testerId] = useState(Math.floor(Math.random() * 200) + 1);
  const [activeSection, setActiveSection] = useState("beta");

  const Toggle = ({ enabled, color = "#22c55e" }: { enabled: boolean; color?: string }) => (
    <div
      className="w-10 h-5 rounded-full relative transition-all"
      style={{
        background: enabled ? `${color}30` : "rgba(255,255,255,0.1)",
        border: enabled ? `1px solid ${color}50` : "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <motion.div
        className="w-4 h-4 rounded-full absolute top-0.5"
        style={{ background: enabled ? color : "rgba(255,255,255,0.3)" }}
        animate={{ x: enabled ? 20 : 2 }}
      />
    </div>
  );

  const sections = [
    { id: "beta", label: "Beta", icon: "🦋" },
    { id: "performance", label: "Performance", icon: "⚡" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0612]">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #0d0a1a 0%, #080510 50%, #030208 100%)"
        }}
      />

      {/* Header */}
      <header className="relative z-20 p-6 border-b border-white/5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            ← Back to MÜN OS
          </Link>
          <h1 className="text-sm tracking-[0.2em] uppercase" style={{ color: "#ffd700" }}>
            SUBSTRATE
          </h1>
        </div>
      </header>

      {/* Tester Badge */}
      <div className="relative z-10 flex justify-center pt-6">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(0, 212, 255, 0.1))",
            border: "1px solid rgba(168, 85, 247, 0.3)"
          }}
        >
          <span className="text-lg">🦋</span>
          <span className="text-xs text-white/60">Tester ID:</span>
          <span className="text-sm font-bold text-purple-400">#{testerId}</span>
          <span className="text-xs text-white/40">of 200</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="relative z-10 flex justify-center gap-2 p-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all"
            style={{
              background: activeSection === section.id ? "rgba(255, 215, 0, 0.1)" : "transparent",
              border: activeSection === section.id ? "1px solid rgba(255, 215, 0, 0.3)" : "1px solid transparent",
              color: activeSection === section.id ? "#ffd700" : "rgba(255, 255, 255, 0.4)"
            }}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 pb-12">
        {activeSection === "beta" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Beta Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-6 rounded-xl text-center"
                style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.2)" }}
              >
                <p className="text-3xl font-bold text-yellow-400">200</p>
                <p className="text-xs text-white/40">Total Beta Slots</p>
              </div>
              <div
                className="p-6 rounded-xl text-center"
                style={{ background: "rgba(0, 212, 255, 0.05)", border: "1px solid rgba(0, 212, 255, 0.2)" }}
              >
                <p className="text-3xl font-bold text-cyan-400">13.13</p>
                <p className="text-xs text-white/40">MHz Frequency</p>
              </div>
            </div>

            {/* Beta Benefits */}
            <div
              className="p-6 rounded-xl space-y-3"
              style={{ background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)" }}
            >
              <h3 className="text-sm font-semibold text-purple-400 mb-4">Beta Benefits</h3>
              {[
                { icon: "🔗", text: "Device Artery Sync enabled" },
                { icon: "🦋", text: "Exclusive butterfly badge" },
                { icon: "👑", text: "Founding member status" },
                { icon: "💬", text: "Priority feedback channel" }
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{benefit.icon}</span>
                  <span className="text-sm text-white/60">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Version Info */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" }}
            >
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Version</span>
                <span className="text-white/60">MÜN OS v0.13.13 Beta</span>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-white/40">Status</span>
                <span className="text-green-400">● Online</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "performance" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {[
              { label: "Dark Mode", desc: "Core substrate", enabled: true, locked: true, color: "#a855f7" },
              { label: "Particle Effects", desc: "Ambient particles", enabled: true, color: "#00d4ff" },
              { label: "Neon Glow", desc: "Interactive elements", enabled: true, color: "#ff69b4" },
              { label: "Animations", desc: "Smooth transitions", enabled: true, color: "#22c55e" },
              { label: "Sound Effects", desc: "UI audio feedback", enabled: false, color: "#f59e0b" }
            ].map((setting, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: setting.enabled ? `${setting.color}08` : "rgba(255,255,255,0.01)",
                  border: setting.enabled ? `1px solid ${setting.color}20` : "1px solid rgba(255,255,255,0.03)"
                }}
              >
                <div>
                  <p className="text-sm text-white/80">{setting.label}</p>
                  <p className="text-xs text-white/40">{setting.locked ? "🔒 Locked" : setting.desc}</p>
                </div>
                <Toggle enabled={setting.enabled} color={setting.color} />
              </div>
            ))}
          </motion.div>
        )}

        {activeSection === "privacy" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(34, 197, 94, 0.05)", border: "1px solid rgba(34, 197, 94, 0.2)" }}
            >
              <p className="text-xs text-green-400 mb-1">🔒 Encryption Vault</p>
              <p className="text-xs text-white/30">Your messages are protected with end-to-end encryption.</p>
            </div>
            {[
              { label: "Show Online Status", enabled: true, color: "#22c55e" },
              { label: "Allow Nudges", enabled: true, color: "#ff69b4" },
              { label: "Data Collection", enabled: false, color: "#a855f7" }
            ].map((setting, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: setting.enabled ? `${setting.color}08` : "rgba(255,255,255,0.01)",
                  border: `1px solid ${setting.color}15`
                }}
              >
                <p className="text-sm text-white/80">{setting.label}</p>
                <Toggle enabled={setting.enabled} color={setting.color} />
              </div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
