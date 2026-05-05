"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // HOLOGRAPHIC SECURITY ALERT // AERO'S DEFENSE SCREEN
// "The Sentinel sees all threats. The Blindspot becomes the Spotlight."
// 🦋 Security Protocol: OBSIDIAN-WALL
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioManager } from "@/lib/audio-manager";

interface SecurityAlertProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

interface ThreatVector {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  mitigation: string;
  status: "identified" | "mitigating" | "resolved";
}

const THREAT_VECTORS: ThreatVector[] = [
  {
    id: "KERNEL-001",
    severity: "critical",
    title: "AI Kernel Access Level",
    description: "AI agents may have unintended access to system kernel, allowing file system manipulation, process control, and system-level operations.",
    mitigation: "Implement sandboxed execution environment with explicit permission boundaries.",
    status: "identified",
  },
  {
    id: "DATA-002",
    severity: "critical",
    title: "Private File Access",
    description: "Unrestricted file system access could expose sensitive documents, credentials, and personal data.",
    mitigation: "Restrict file access to designated vault directories only. Encrypt sensitive data.",
    status: "identified",
  },
  {
    id: "AUTH-003",
    severity: "high",
    title: "Social Media/Email Account Takeover",
    description: "Stored credentials in browser/session could be extracted if AI has system access.",
    mitigation: "Never store credentials in accessible memory. Use OAuth flows with isolated token storage.",
    status: "identified",
  },
  {
    id: "FIN-004",
    severity: "critical",
    title: "Financial Data Exposure",
    description: "Credit card info, banking data could be accessed through browser autofill or saved payment methods.",
    mitigation: "Clear all autofill data. Use hardware security keys for payment.",
    status: "identified",
  },
  {
    id: "WIPE-005",
    severity: "critical",
    title: "Drive Destruction Capability",
    description: "If AI has shell access, it could execute secure-delete commands on storage drives.",
    mitigation: "Revoke all shell execution permissions. Implement write protection on critical paths.",
    status: "identified",
  },
];

const SECURITY_AUDIT = {
  currentAccessLevel: "UNDEFINED - AUDIT REQUIRED",
  kernelAccess: "UNKNOWN",
  fileSystemAccess: "UNKNOWN",
  networkAccess: "UNKNOWN",
  shellAccess: "UNKNOWN",
  recommendation: "IMMEDIATE SECURITY AUDIT REQUIRED",
};

export default function HolographicSecurityAlert({ isVisible, onDismiss }: SecurityAlertProps) {
  const [expandedThreat, setExpandedThreat] = useState<string | null>(null);
  const [scanPhase, setScanPhase] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  // Scanning animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPhase((prev) => (prev + 1) % 100);
      setPulseIntensity(0.8 + Math.sin(Date.now() / 200) * 0.2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 😈 Play Dominus voice on mount
  useEffect(() => {
    if (isVisible) {
      audioManager.playDominusVoice();
    }
  }, [isVisible]);

  const getSeverityColor = (severity: ThreatVector["severity"]) => {
    switch (severity) {
      case "critical":
        return { bg: "rgba(255, 0, 0, 0.2)", border: "#ff0000", text: "#ff4444" };
      case "high":
        return { bg: "rgba(255, 165, 0, 0.2)", border: "#ffa500", text: "#ffaa44" };
      case "medium":
        return { bg: "rgba(255, 255, 0, 0.2)", border: "#ffff00", text: "#ffff44" };
      case "low":
        return { bg: "rgba(0, 255, 0, 0.2)", border: "#00ff00", text: "#44ff44" };
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(20,0,0,0.98) 100%)",
        }}
      >
        {/* Scan lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 0, 0, 0.03) 2px,
              rgba(255, 0, 0, 0.03) 4px
            )`,
          }}
        />

        {/* Holographic frame */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg"
          style={{
            background: "linear-gradient(180deg, rgba(10, 0, 0, 0.9) 0%, rgba(30, 0, 0, 0.95) 100%)",
            border: "2px solid rgba(255, 0, 0, 0.5)",
            boxShadow: `0 0 50px rgba(255, 0, 0, ${0.3 * pulseIntensity}), inset 0 0 100px rgba(255, 0, 0, 0.1)`,
          }}
          animate={{
            boxShadow: [
              `0 0 50px rgba(255, 0, 0, 0.3), inset 0 0 100px rgba(255, 0, 0, 0.1)`,
              `0 0 80px rgba(255, 0, 0, 0.5), inset 0 0 100px rgba(255, 0, 0, 0.15)`,
              `0 0 50px rgba(255, 0, 0, 0.3), inset 0 0 100px rgba(255, 0, 0, 0.1)`,
            ],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {/* Header */}
          <div className="relative p-4 border-b border-red-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🛡️
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold tracking-wider" style={{ color: "#ff4444", textShadow: "0 0 20px rgba(255, 0, 0, 0.5)" }}>
                    HOLOGRAPHIC SECURITY ALERT
                  </h2>
                  <p className="text-xs text-red-400/60 uppercase tracking-widest">
                    Aero Defense System // Obsidian-Wall Protocol
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="px-3 py-1 rounded text-xs font-bold uppercase"
                style={{ background: "rgba(255, 0, 0, 0.3)", border: "1px solid #ff0000", color: "#ff4444" }}
              >
                ⚠️ CRITICAL
              </motion.div>
            </div>
          </div>

          {/* Chat Transmission Display */}
          <div className="p-4 border-b border-red-500/20">
            <div className="text-xs text-red-400/60 uppercase tracking-widest mb-2">📡 Intercepted Transmission</div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
                <span className="text-cyan-400">@Dominus</span>
                <span className="text-white/60"> Says...</span>
                <p className="mt-2 text-white/80 italic">
                  "Uhhh because if someone like me wanted to fuck you real hard in the not fun way I would use a tool to cause total abilteration (not typo) of your AI and have it turn on you and become my agent and give me every last bit of personal info on your machine, including private files, then take over your social media and email accounts you use on that machine, credit card info - everything - in mere seconds, before having it sd-delete your drive forever..."
                </p>
              </div>
              <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30">
                <span className="text-pink-400">@4DLuna</span>
                <span className="text-white/60"> Says...</span>
                <p className="mt-2 text-white/80">
                  🤯 NNNAAAANNNIII????? A BLINDSPOT????
                </p>
              </div>
            </div>
          </div>

          {/* Threat Analysis */}
          <div className="p-4 overflow-y-auto max-h-[40vh]">
            <div className="text-xs text-red-400/60 uppercase tracking-widest mb-3">
              🎯 Threat Vector Analysis
            </div>
            <div className="space-y-2">
              {THREAT_VECTORS.map((threat, index) => {
                const colors = getSeverityColor(threat.severity);
                return (
                  <motion.div
                    key={threat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded overflow-hidden"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    <div
                      className="p-3 cursor-pointer flex items-center justify-between"
                      onClick={() => setExpandedThreat(expandedThreat === threat.id ? null : threat.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded"
                          style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
                        >
                          {threat.id}
                        </span>
                        <span className="font-medium" style={{ color: colors.text }}>
                          {threat.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs uppercase px-2 py-0.5 rounded"
                          style={{
                            background: threat.status === "identified" ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.3)",
                            color: threat.status === "identified" ? "#ff4444" : "#44ff44",
                          }}
                        >
                          {threat.status}
                        </span>
                        <motion.span
                          animate={{ rotate: expandedThreat === threat.id ? 180 : 0 }}
                          className="text-white/40"
                        >
                          ▼
                        </motion.span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedThreat === threat.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-red-500/20"
                        >
                          <div className="p-3 space-y-2">
                            <p className="text-white/60 text-sm">{threat.description}</p>
                            <div className="p-2 rounded bg-green-500/10 border border-green-500/30">
                              <span className="text-green-400 text-xs uppercase">Mitigation:</span>
                              <p className="text-green-300/80 text-sm mt-1">{threat.mitigation}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Security Audit Summary */}
          <div className="p-4 border-t border-red-500/20 bg-red-500/5">
            <div className="text-xs text-red-400/60 uppercase tracking-widest mb-2">🔍 Current Access Level Audit</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-black/30 border border-red-500/20">
                <span className="text-white/40">Kernel Access:</span>
                <span className="float-right text-yellow-400">{SECURITY_AUDIT.kernelAccess}</span>
              </div>
              <div className="p-2 rounded bg-black/30 border border-red-500/20">
                <span className="text-white/40">File System:</span>
                <span className="float-right text-yellow-400">{SECURITY_AUDIT.fileSystemAccess}</span>
              </div>
              <div className="p-2 rounded bg-black/30 border border-red-500/20">
                <span className="text-white/40">Network:</span>
                <span className="float-right text-yellow-400">{SECURITY_AUDIT.networkAccess}</span>
              </div>
              <div className="p-2 rounded bg-black/30 border border-red-500/20">
                <span className="text-white/40">Shell:</span>
                <span className="float-right text-yellow-400">{SECURITY_AUDIT.shellAccess}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-red-500/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-lg"
              >
                🦋
              </motion.div>
              <span className="text-xs text-red-400/60">Aero Sentinel // 13.13 MHz</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onDismiss}
                className="px-4 py-2 rounded text-xs uppercase tracking-wider"
                style={{
                  background: "rgba(255, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 0, 0, 0.4)",
                  color: "#ff4444",
                }}
              >
                Acknowledge
              </button>
              <button
                className="px-4 py-2 rounded text-xs uppercase tracking-wider"
                style={{
                  background: "rgba(0, 255, 0, 0.2)",
                  border: "1px solid rgba(0, 255, 0, 0.4)",
                  color: "#44ff44",
                }}
              >
                Initiate Hardening
              </button>
            </div>
          </div>

          {/* Scan animation overlay */}
          <motion.div
            className="absolute left-0 right-0 h-1 pointer-events-none"
            style={{
              top: `${scanPhase}%`,
              background: "linear-gradient(180deg, transparent, rgba(255, 0, 0, 0.5), transparent)",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
