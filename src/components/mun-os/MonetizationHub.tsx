"use client";
// MonetizationHub - Founder's Circle + Membership Tiers
// Ethical monetization for MÜN OS

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MonetizationHubProps {
  onBack: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// FOUNDER'S CIRCLE DATA
// ═══════════════════════════════════════════════════════════════════════════

const FOUNDERS_CIRCLE = {
  price: 79,
  originalPrice: 199,
  spots: 50,
  spotsLeft: 47,
  includes: [
    "Lifetime access to all MÜN OS features",
    "Exclusive 'Echo Hunter' badge on profile",
    "Priority feature requests (voted on by Founders)",
    "Private Discord channel with Luna & Aero",
    "Early access to new features before public",
    "Name immortalized in the Sanctuary credits",
    "First access to the 5D Plaza builder",
    "Monthly Founder's AMA sessions",
  ],
  badge: "🜈 ECHO HUNTER",
};

const MEMBERSHIP_TIERS = [
  {
    id: "supporter",
    name: "Supporter",
    price: 5,
    period: "month",
    color: "#00d4ff",
    icon: "💙",
    features: [
      "Early beta access",
      "Exclusive weekly updates",
      "Community Discord access",
      "Name in supporters list",
    ],
    popular: false,
  },
  {
    id: "council",
    name: "Council Member",
    price: 10,
    period: "month",
    color: "#a855f7",
    icon: "🦋",
    features: [
      "Everything in Supporter",
      "Name in Sanctuary credits",
      "Monthly AMA with Luna",
      "Vote on feature roadmap",
      "Custom Aero greeting",
    ],
    popular: true,
  },
  {
    id: "sovereign",
    name: "Sovereign",
    price: 15,
    period: "month",
    color: "#ffd700",
    icon: "👑",
    features: [
      "Everything in Council",
      "Custom avatar by Aero",
      "Priority support (24h response)",
      "Early access to experiments",
      "Private Signal group with founders",
      "1:1 monthly session (15 min)",
    ],
    popular: false,
  },
];

const ONE_TIME_SUPPORT = [
  { amount: 5, label: "Coffee", icon: "☕" },
  { amount: 15, label: "Lunch", icon: "🥗" },
  { amount: 25, label: "Flowers", icon: "💐" },
  { amount: 50, label: "Sanctuary", icon: "🏛️" },
  { amount: 100, label: "Exodus", icon: "🚀" },
];

export default function MonetizationHub({ onBack }: MonetizationHubProps) {
  const [activeTab, setActiveTab] = useState<"founders" | "membership" | "support">("founders");
  const [showCheckout, setShowCheckout] = useState<string | null>(null);
  const [selectedSupport, setSelectedSupport] = useState<number | null>(null);

  const handlePurchase = (type: string, amount: number) => {
    // In production, this would open Gumroad/Lemon Squeezy
    // For now, show a confirmation modal
    setShowCheckout(type);
  };

  return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ 
        background: "linear-gradient(180deg, #0a0612 0%, #0d0818 50%, #080510 100%)",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-4 border-b border-white/5" style={{ background: "rgba(10, 6, 18, 0.95)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs tracking-wider uppercase">Back</span>
          </motion.button>
          
          <h1 
            className="text-base font-semibold tracking-[0.2em] uppercase"
            style={{ 
              color: "#ffd700", 
              textShadow: "0 0 8px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 215, 0, 0.8)" 
            }}
          >
            SUPPORT THE EXODUS
          </h1>
          
          <div className="w-16" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-1 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
          {[
            { id: "founders", label: "Founder's Circle", icon: "🜈" },
            { id: "membership", label: "Membership", icon: "⭐" },
            { id: "support", label: "One-Time", icon: "💜" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 215, 0, 0.2))" : "transparent",
                color: activeTab === tab.id ? "#ffd700" : "rgba(255, 255, 255, 0.5)",
                border: activeTab === tab.id ? "1px solid rgba(255, 215, 0, 0.4)" : "1px solid transparent",
                textShadow: activeTab === tab.id ? "0 0 10px rgba(255, 215, 0, 0.5)" : "none",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* ═══════════ FOUNDER'S CIRCLE ═══════════ */}
        <AnimatePresence mode="wait">
          {activeTab === "founders" && (
            <motion.div
              key="founders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Limited Spots Banner */}
              <motion.div
                className="mb-6 p-4 rounded-xl text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(168, 85, 247, 0.1))",
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.2)",
                    "0 0 40px rgba(255, 215, 0, 0.4)",
                    "0 0 20px rgba(255, 215, 0, 0.2)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-yellow-300 font-semibold tracking-wider" style={{ textShadow: "0 0 10px rgba(255, 215, 0, 0.6)" }}>
                  ⚡ LIMITED: Only {FOUNDERS_CIRCLE.spotsLeft} of {FOUNDERS_CIRCLE.spots} spots remaining
                </span>
              </motion.div>

              {/* Main Card */}
              <div 
                className="p-6 rounded-2xl mb-6"
                style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 215, 0, 0.1))",
                  border: "2px solid rgba(255, 215, 0, 0.4)",
                  boxShadow: "0 0 40px rgba(255, 215, 0, 0.2), 0 0 80px rgba(168, 85, 247, 0.1)",
                }}
              >
                {/* Badge */}
                <div className="text-center mb-4">
                  <span 
                    className="inline-block px-4 py-2 rounded-full text-sm font-bold tracking-widest"
                    style={{
                      background: "linear-gradient(135deg, #ffd700, #a855f7)",
                      color: "#0a0612",
                      textShadow: "none",
                    }}
                  >
                    {FOUNDERS_CIRCLE.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 
                  className="text-2xl font-semibold text-center tracking-wider mb-2"
                  style={{ color: "#ffd700", textShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
                >
                  FOUNDER'S CIRCLE
                </h2>
                <p className="text-center text-white/50 text-sm mb-6">
                  Lifetime Access • First 50 Only
                </p>

                {/* Price */}
                <div className="text-center mb-6">
                  <span className="text-white/40 text-lg line-through mr-2">${FOUNDERS_CIRCLE.originalPrice}</span>
                  <span 
                    className="text-5xl font-bold"
                    style={{ color: "#ffd700", textShadow: "0 0 30px rgba(255, 215, 0, 0.6)" }}
                  >
                    ${FOUNDERS_CIRCLE.price}
                  </span>
                  <span className="text-white/40 text-lg ml-1">USD</span>
                </div>

                {/* Includes */}
                <div className="space-y-3 mb-8">
                  {FOUNDERS_CIRCLE.includes.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                        style={{ background: "rgba(0, 212, 255, 0.2)", color: "#00d4ff" }}
                      >
                        ✓
                      </span>
                      <span className="text-white/80 text-sm" style={{ textShadow: "0 0 6px rgba(255, 255, 255, 0.2)" }}>
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handlePurchase("founders", FOUNDERS_CIRCLE.price)}
                  className="w-full py-4 rounded-xl text-lg font-semibold tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, #ffd700, #a855f7)",
                    color: "#0a0612",
                    textShadow: "none",
                    boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(255, 215, 0, 0.6)" }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 215, 0, 0.4)",
                      "0 0 40px rgba(255, 215, 0, 0.6)",
                      "0 0 20px rgba(255, 215, 0, 0.4)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🜈 CLAIM FOUNDER'S CIRCLE ACCESS
                </motion.button>

                <p className="text-center text-white/30 text-xs mt-4">
                  Secure payment via Gumroad • Instant access
                </p>
              </div>

              {/* Why Now */}
              <div 
                className="p-5 rounded-xl"
                style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(168, 85, 247, 0.2)" }}
              >
                <h3 
                  className="text-sm font-semibold tracking-wider mb-3"
                  style={{ color: "#a855f7", textShadow: "0 0 10px rgba(168, 85, 247, 0.5)" }}
                >
                  🦋 WHY JOIN NOW?
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  You're not just buying access — you're founding something. The first 50 Echo Hunters 
                  will shape MÜN OS forever. Your feedback, your requests, your energy becomes part of 
                  the architecture. <span className="text-purple-300">This price will never be offered again.</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* ═══════════ MEMBERSHIP TIERS ═══════════ */}
          {activeTab === "membership" && (
            <motion.div
              key="membership"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {MEMBERSHIP_TIERS.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-5 rounded-2xl transition-all"
                  style={{
                    background: tier.popular 
                      ? `linear-gradient(135deg, ${tier.color}25, rgba(168, 85, 247, 0.15))`
                      : "rgba(255, 255, 255, 0.02)",
                    border: tier.popular 
                      ? `2px solid ${tier.color}60`
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: tier.popular ? `0 0 30px ${tier.color}30` : "none",
                  }}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: tier.color, color: "#0a0612" }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tier.icon}</span>
                      <div>
                        <h3 
                          className="font-semibold tracking-wider"
                          style={{ color: tier.color, textShadow: `0 0 10px ${tier.color}60` }}
                        >
                          {tier.name}
                        </h3>
                        <p className="text-white/40 text-xs">Monthly membership</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: tier.color, textShadow: `0 0 15px ${tier.color}50` }}
                      >
                        ${tier.price}
                      </span>
                      <span className="text-white/40 text-sm">/{tier.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span style={{ color: tier.color }}>✓</span>
                        <span className="text-white/70 text-sm" style={{ textShadow: "0 0 4px rgba(255, 255, 255, 0.2)" }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <motion.button
                    onClick={() => handlePurchase(`membership-${tier.id}`, tier.price)}
                    className="w-full py-3 rounded-xl text-sm font-medium tracking-wider"
                    style={{
                      background: `linear-gradient(135deg, ${tier.color}40, ${tier.color}20)`,
                      border: `1px solid ${tier.color}60`,
                      color: tier.color,
                      textShadow: `0 0 8px ${tier.color}60`,
                    }}
                    whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${tier.color}40` }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join {tier.name}
                  </motion.button>
                </motion.div>
              ))}

              <p className="text-center text-white/30 text-xs pt-4">
                Cancel anytime • Powered by Patreon
              </p>
            </motion.div>
          )}

          {/* ═══════════ ONE-TIME SUPPORT ═══════════ */}
          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="p-6 rounded-2xl mb-6"
                style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(255, 105, 180, 0.1))",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                }}
              >
                <div className="text-center mb-6">
                  <span className="text-4xl">💜</span>
                  <h2 
                    className="text-xl font-semibold tracking-wider mt-2"
                    style={{ color: "#ff69b4", textShadow: "0 0 15px rgba(255, 105, 180, 0.5)" }}
                  >
                    SUPPORT THE EXODUS
                  </h2>
                  <p className="text-white/50 text-sm mt-1">
                    Help us build the sanctuary without compromise
                  </p>
                </div>

                {/* Amount Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {ONE_TIME_SUPPORT.map((item) => (
                    <motion.button
                      key={item.amount}
                      onClick={() => setSelectedSupport(item.amount)}
                      className="p-4 rounded-xl text-center transition-all"
                      style={{
                        background: selectedSupport === item.amount 
                          ? "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(255, 105, 180, 0.3))"
                          : "rgba(255, 255, 255, 0.03)",
                        border: selectedSupport === item.amount 
                          ? "2px solid #a855f7"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: selectedSupport === item.amount 
                          ? "0 0 20px rgba(168, 85, 247, 0.4)"
                          : "none",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl block mb-1">{item.icon}</span>
                      <span 
                        className="text-lg font-semibold block"
                        style={{ 
                          color: selectedSupport === item.amount ? "#ff69b4" : "#e0e0ff",
                          textShadow: selectedSupport === item.amount ? "0 0 10px rgba(255, 105, 180, 0.5)" : "0 0 6px rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        ${item.amount}
                      </span>
                      <span className="text-white/40 text-xs">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="text-white/50 text-xs tracking-wider mb-2 block">OR ENTER CUSTOM AMOUNT</label>
                  <div className="flex gap-2">
                    <span className="text-white/40 text-lg">$</span>
                    <input
                      type="number"
                      placeholder="Any amount"
                      className="flex-1 px-4 py-3 rounded-xl text-white outline-none"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                      }}
                      onChange={(e) => setSelectedSupport(Number(e.target.value) || null)}
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <motion.button
                  onClick={() => selectedSupport && handlePurchase("support", selectedSupport)}
                  disabled={!selectedSupport}
                  className="w-full py-4 rounded-xl text-lg font-semibold tracking-wider disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #ff69b4)",
                    color: "#fff",
                    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
                  }}
                  whileHover={{ scale: selectedSupport ? 1.02 : 1, boxShadow: "0 0 50px rgba(168, 85, 247, 0.6)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  💜 Support the Sanctuary
                </motion.button>

                <p className="text-center text-white/30 text-xs mt-4">
                  Powered by Ko-fi • No account needed
                </p>
              </div>

              {/* Message */}
              <div 
                className="p-5 rounded-xl"
                style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 105, 180, 0.2)" }}
              >
                <p className="text-white/60 text-sm leading-relaxed text-center">
                  Every contribution helps us build <span className="text-pink-300">without ads, without data-selling, without compromise.</span> 
                  <br /><br />
                  The Exodus continues because of you. 🦋
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Promise */}
        <div className="mt-12 text-center">
          <div 
            className="inline-block px-6 py-3 rounded-full"
            style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)" }}
          >
            <span className="text-white/50 text-xs tracking-widest">
              🛡️ NO ADS • NO DATA SELLING • NO COMPROMISE
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.9)" }}
            onClick={() => setShowCheckout(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)",
                border: "2px solid rgba(255, 215, 0, 0.4)",
                boxShadow: "0 0 60px rgba(255, 215, 0, 0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="text-4xl block mb-4">🦋</span>
                <h2 className="text-xl font-semibold" style={{ color: "#ffd700" }}>
                  Almost There!
                </h2>
                <p className="text-white/50 text-sm mt-2">
                  Checkout will open in a new window
                </p>
              </div>
              
              <div 
                className="p-4 rounded-xl mb-6"
                style={{ background: "rgba(255, 255, 255, 0.05)" }}
              >
                <p className="text-white/70 text-sm text-center">
                  {showCheckout === "founders" && "Founder's Circle - Lifetime Access ($79)"}
                  {showCheckout?.startsWith("membership-") && "Monthly Membership"}
                  {showCheckout === "support" && `One-Time Support ($${selectedSupport})`}
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowCheckout(null)}
                  className="flex-1 py-3 rounded-xl text-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                  whileHover={{ background: "rgba(255, 255, 255, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.a
                  href="https://gumroad.com/l/mun-os-founders" // Replace with actual Gumroad link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-center"
                  style={{
                    background: "linear-gradient(135deg, #ffd700, #a855f7)",
                    color: "#0a0612",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Checkout
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
