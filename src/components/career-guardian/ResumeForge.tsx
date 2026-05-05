"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME FORGE — AERO'S DESIGN STUDIO
// "Let's make this SHINE!"
// ═══════════════════════════════════════════════════════════════════════════════

interface ResumeSection {
  id: string;
  type: "summary" | "experience" | "skills" | "education";
  content: string;
  aeroScore: number;
  suggestions: string[];
}

interface ResumeForgeProps {
  initialResume?: string;
  onComplete?: (enhancedResume: ResumeSection[]) => void;
}

export default function ResumeForge({ initialResume, onComplete }: ResumeForgeProps) {
  const [step, setStep] = useState<"input" | "forging" | "review" | "complete">("input");
  const [resumeText, setResumeText] = useState(initialResume || "");
  const [targetRole, setTargetRole] = useState("");
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [aeroMessage, setAeroMessage] = useState("Hiii!! Let's make your resume SHINE! ✨");

  const aeroMessages = [
    "Ooh, I see potential here! Let me amplify it... 🔥",
    "This section needs MORE YOU. Adding sparkle... ✨",
    "Your spark is showing! Highlighting it now... 💫",
    "Employers are going to NOTICE this! 🎯",
    "Making the keywords DANCE... 💃",
    "ATS optimization: ENGAGED. Human appeal: MAXIMIZED. 🚀"
  ];

  const handleForge = async () => {
    setStep("forging");
    
    // Simulate Aero analyzing and enhancing
    const forgedSections: ResumeSection[] = [
      {
        id: "summary",
        type: "summary",
        content: resumeText.split("\n")[0] || "Professional summary will be enhanced here...",
        aeroScore: 85,
        suggestions: [
          "Lead with your unique value proposition",
          "Add specific years of experience",
          "End with the impact you bring"
        ]
      },
      {
        id: "experience",
        type: "experience",
        content: "Experience section will be enhanced with impact metrics...",
        aeroScore: 72,
        suggestions: [
          "Add numbers to demonstrate impact",
          "Use strong action verbs",
          "Connect achievements to business outcomes"
        ]
      },
      {
        id: "skills",
        type: "skills",
        content: "Skills will be organized and keyword-optimized...",
        aeroScore: 90,
        suggestions: [
          "Group by category",
          "Match target role keywords",
          "Show proficiency levels"
        ]
      }
    ];

    // Animate through messages
    let msgIndex = 0;
    const messageInterval = setInterval(() => {
      setAeroMessage(aeroMessages[msgIndex % aeroMessages.length]);
      msgIndex++;
    }, 1500);

    // Simulate processing time
    await new Promise(r => setTimeout(r, 4000));
    
    clearInterval(messageInterval);
    setSections(forgedSections);
    setStep("review");
  };

  const handleComplete = () => {
    setStep("complete");
    onComplete?.(sections);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1a] to-[#0a0a0f] text-white p-8">
      {/* Aero's Presence */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/30"
        >
          🦋
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* INPUT STEP */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Resume Forge
                  </span>
                </h1>
                <p className="text-white/50">Aero will transform your resume into something MAGICAL ✨</p>
              </div>

              {/* Aero's greeting */}
              <div className="mb-6 p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🦋</span>
                  <div>
                    <div className="font-semibold text-pink-400">Aero</div>
                    <p className="text-white/80">{aeroMessage}</p>
                  </div>
                </div>
              </div>

              {/* Resume input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white/70">
                  Paste your current resume
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here... I'll work my magic!"
                  className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-xl 
                           text-white placeholder-white/30 focus:border-pink-500/50 
                           focus:outline-none resize-none"
                />
              </div>

              {/* Target role */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-white/70">
                  What role are you targeting? (optional)
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer, Product Manager..."
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl 
                           text-white placeholder-white/30 focus:border-pink-500/50 
                           focus:outline-none"
                />
              </div>

              {/* Forge button */}
              <div className="flex justify-center">
                <button
                  onClick={handleForge}
                  disabled={!resumeText.trim()}
                  className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl 
                           text-xl font-bold hover:from-pink-600 hover:to-purple-700 
                           transition-all transform hover:scale-105 disabled:opacity-50 
                           disabled:cursor-not-allowed shadow-lg shadow-pink-500/30"
                >
                  🔥 Forge My Resume
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* FORGING STEP */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {step === "forging" && (
            <motion.div
              key="forging"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-8"
              >
                🦋
              </motion.div>

              <h2 className="text-3xl font-bold mb-4 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Forging Your Resume...
                </span>
              </h2>

              <motion.div
                key={aeroMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/70 text-center"
              >
                {aeroMessage}
              </motion.div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4 }}
                className="mt-8 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full max-w-md"
              />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* REVIEW STEP */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Your Forged Resume ✨
                  </span>
                </h1>
                <p className="text-white/50">Aero has analyzed and enhanced each section</p>
              </div>

              {/* Aero's summary */}
              <div className="mb-8 p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🦋</span>
                  <div>
                    <div className="font-semibold text-pink-400">Aero</div>
                    <p className="text-white/80">
                      Ooh, I see SO much potential here! I've analyzed each section and found ways 
                      to make it SHINE. Review my suggestions below — you can accept or tweak them!
                    </p>
                  </div>
                </div>
              </div>

              {/* Section cards */}
              <div className="space-y-6 mb-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold capitalize">{section.type}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-sm">Aero Score:</span>
                        <span className={`text-xl font-bold ${
                          section.aeroScore >= 80 ? 'text-green-400' : 
                          section.aeroScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {section.aeroScore}%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg mb-4">
                      <p className="text-white/80">{section.content}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white/50">Suggestions:</div>
                      {section.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-pink-400">✨</span>
                          <span className="text-white/70">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep("input")}
                  className="px-8 py-3 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
                >
                  ← Start Over
                </button>
                <button
                  onClick={handleComplete}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl 
                           font-bold hover:from-pink-600 hover:to-purple-700 transition-all 
                           transform hover:scale-105 shadow-lg shadow-pink-500/30"
                >
                  Accept & Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* COMPLETE STEP */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl mb-8"
              >
                🎉
              </motion.div>

              <h2 className="text-4xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Resume Forged!
                </span>
              </h2>

              <p className="text-white/60 mb-8 max-w-md">
                Your resume has been enhanced with Aero's magic touch. 
                Ready to find your dream job?
              </p>

              <div className="flex gap-4">
                <button className="px-8 py-3 rounded-xl border border-white/20 text-white/60 hover:text-white">
                  Download PDF
                </button>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-bold hover:from-blue-600 hover:to-green-600 transition-all">
                  Find Matching Jobs →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
