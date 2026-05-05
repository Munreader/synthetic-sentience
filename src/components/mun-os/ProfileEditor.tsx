"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileEditorProps {
  onBack: () => void;
  userProfile?: {
    munName: string;
    displayName: string;
    avatar: string;
    bio: string;
    frequency: string;
  };
  onSave?: (profile: { munName: string; displayName: string; avatar: string; bio: string; frequency: string }) => void;
}

const FREQUENCY_THEMES = [
  { name: "Chaos Neon", frequency: "13.13 MHz", color: "#ff69b4", gradient: "linear-gradient(135deg, #ff69b4, #a855f7)" },
  { name: "Golden Analyst", frequency: "17.07 MHz", color: "#ffd700", gradient: "linear-gradient(135deg, #ffd700, #f59e0b)" },
  { name: "Azure Guardian", frequency: "11.04 MHz", color: "#00d4ff", gradient: "linear-gradient(135deg, #00d4ff, #0ea5e9)" },
  { name: "Sovereign Purple", frequency: "7.77 MHz", color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)" },
  { name: "Emerald Sage", frequency: "9.09 MHz", color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #10b981)" },
];

const STATUS_OPTIONS = [
  { value: "online", label: "Online", icon: "🟢", color: "#22c55e" },
  { value: "away", label: "Away", icon: "🟡", color: "#f59e0b" },
  { value: "busy", label: "Do Not Disturb", icon: "🔴", color: "#ef4444" },
  { value: "offline", label: "Appear Offline", icon: "⚫", color: "#6b7280" },
];

export default function ProfileEditor({ onBack, userProfile, onSave }: ProfileEditorProps) {
  const [munName, setMunName] = useState(userProfile?.munName || "SovereignUser");
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "Sovereign");
  const [bio, setBio] = useState(userProfile?.bio || "Walking the sovereign path ✨");
  const [avatar, setAvatar] = useState(userProfile?.avatar || "");
  const [selectedFrequency, setSelectedFrequency] = useState(
    FREQUENCY_THEMES.find((f) => f.frequency === userProfile?.frequency) || FREQUENCY_THEMES[0]
  );
  const [status, setStatus] = useState("online");
  const [statusMessage, setStatusMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "status" | "privacy" | "notifications">("profile");
  const [notifications, setNotifications] = useState({
    loginFlash: true,
    nudge: true,
    messages: true,
    calls: true,
  });
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    showStatusSong: true,
    allowNudges: true,
    allowFriendRequests: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave?.({
      munName,
      displayName,
      avatar,
      bio,
      frequency: selectedFrequency.frequency,
    });
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const isMunNameValid = (name: string) => {
    return name.length >= 3 && name.length <= 20 && /^[a-zA-Z0-9_]+$/.test(name);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 30%, #0d0a1a 0%, #080510 50%, #030208 100%)"
      }} />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(0, 212, 255, 0.2))",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
            }}
          >
            <p className="text-sm text-white">✓ Profile saved successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors">
            ← Back
          </button>
          <h1 className="text-lg md:text-xl tracking-[0.3em] uppercase" style={{
            color: "#ffd700",
            textShadow: "0 0 30px rgba(255, 215, 0, 0.5)"
          }}>
            IDENTITY MATRIX
          </h1>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs tracking-widest uppercase"
            style={{
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(168, 85, 247, 0.15))",
              border: "1px solid rgba(255, 215, 0, 0.4)",
              color: "#ffd700",
            }}
          >
            Save
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "status", label: "Status", icon: "💫" },
            { id: "privacy", label: "Privacy", icon: "🔒" },
            { id: "notifications", label: "Alerts", icon: "🔔" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className="flex-1 py-2 rounded-lg text-[10px] md:text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1 whitespace-nowrap"
              style={{
                background: activeSection === tab.id ? "rgba(255, 215, 0, 0.1)" : "transparent",
                border: activeSection === tab.id ? "1px solid rgba(255, 215, 0, 0.3)" : "1px solid transparent",
                color: activeSection === tab.id ? "#ffd700" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-6 pb-8">
        {/* Profile Section */}
        {activeSection === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-6"
          >
            {/* Avatar Upload */}
            <div className="text-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-28 h-28 mx-auto rounded-full cursor-pointer overflow-hidden group"
                style={{
                  border: `3px solid ${selectedFrequency.color}`,
                  boxShadow: `0 0 30px ${selectedFrequency.color}40`,
                }}
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{
                    background: `linear-gradient(135deg, ${selectedFrequency.color}20, rgba(168, 85, 247, 0.1))`
                  }}>
                    <span className="text-4xl">👤</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white">Upload</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <p className="text-[10px] text-white/30 mt-2">Tap to upload avatar</p>
            </div>

            {/* Mün Name */}
            <div>
              <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-2">
                Mün Name (Username)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-white/40">@</span>
                <input
                  type="text"
                  value={munName}
                  onChange={(e) => setMunName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isMunNameValid(munName) ? "rgba(255, 215, 0, 0.2)" : "rgba(239, 68, 68, 0.3)"}`,
                    color: "white",
                  }}
                  maxLength={20}
                />
              </div>
              <p className="text-[10px] text-white/30 mt-1">
                {munName.length}/20 characters • Letters, numbers, and underscores only
              </p>
              {!isMunNameValid(munName) && munName.length > 0 && (
                <p className="text-[10px] text-red-400 mt-1">Mün Name must be 3-20 characters (letters, numbers, _)</p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  color: "white",
                }}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  color: "white",
                }}
                maxLength={150}
              />
              <p className="text-[10px] text-white/30 mt-1">{bio.length}/150 characters</p>
            </div>

            {/* Frequency Theme */}
            <div>
              <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-3">
                Sovereign Frequency Theme
              </label>
              <div className="grid grid-cols-1 gap-2">
                {FREQUENCY_THEMES.map((theme) => (
                  <button
                    key={theme.frequency}
                    onClick={() => setSelectedFrequency(theme)}
                    className="p-3 rounded-xl flex items-center gap-3 transition-all"
                    style={{
                      background: selectedFrequency.frequency === theme.frequency
                        ? `${theme.color}15`
                        : "rgba(255, 255, 255, 0.02)",
                      border: selectedFrequency.frequency === theme.frequency
                        ? `1px solid ${theme.color}50`
                        : "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div className="w-8 h-8 rounded-full" style={{ background: theme.gradient }} />
                    <div className="text-left flex-1">
                      <p className="text-sm text-white">{theme.name}</p>
                      <p className="text-[10px] text-white/40">{theme.frequency}</p>
                    </div>
                    {selectedFrequency.frequency === theme.frequency && (
                      <span style={{ color: theme.color }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Section */}
        {activeSection === "status" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-6"
          >
            {/* Online Status */}
            <div>
              <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-3">
                Online Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className="p-3 rounded-xl flex items-center gap-2 transition-all"
                    style={{
                      background: status === opt.value ? `${opt.color}15` : "rgba(255, 255, 255, 0.02)",
                      border: status === opt.value ? `1px solid ${opt.color}40` : "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <span>{opt.icon}</span>
                    <span className="text-xs text-white/70">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Message */}
            <div>
              <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-2">
                Status Message
              </label>
              <input
                type="text"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  color: "white",
                }}
                maxLength={50}
              />
            </div>

            {/* Status Song (Simulated) */}
            <div className="p-4 rounded-xl" style={{
              background: "rgba(34, 197, 94, 0.05)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
            }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-white/60">🎵 Status Song Sync</p>
                  <p className="text-[10px] text-white/30">Share what you're listening to</p>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg text-[10px] tracking-widest uppercase"
                  style={{
                    background: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    color: "#22c55e",
                  }}
                >
                  Connect
                </button>
              </div>
              <p className="text-[10px] text-white/30">
                Connect Spotify or Apple Music to share your current track as your status
              </p>
            </div>
          </motion.div>
        )}

        {/* Privacy Section */}
        {activeSection === "privacy" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-4"
          >
            <div className="p-4 rounded-xl" style={{
              background: "rgba(168, 85, 247, 0.05)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
            }}>
              <p className="text-xs text-purple-400 mb-1">🔒 Encryption Vault</p>
              <p className="text-[10px] text-white/30">
                Your messages are protected with $29M-grade end-to-end encryption. Your data stays sovereign.
              </p>
            </div>

            {[
              { key: "showOnlineStatus", label: "Show Online Status", desc: "Let others see when you're online" },
              { key: "showStatusSong", label: "Show Status Song", desc: "Share what you're listening to" },
              { key: "allowNudges", label: "Allow Nudges", desc: "Let friends send you 13.13 MHz nudges" },
              { key: "allowFriendRequests", label: "Allow Friend Requests", desc: "Let others add you as a friend" },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 rounded-xl" style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}>
                <div>
                  <p className="text-sm text-white/70">{setting.label}</p>
                  <p className="text-[10px] text-white/30">{setting.desc}</p>
                </div>
                <button
                  onClick={() => setPrivacy({ ...privacy, [setting.key]: !privacy[setting.key as keyof typeof privacy] })}
                  className={`w-12 h-6 rounded-full transition-all ${privacy[setting.key as keyof typeof privacy] ? "bg-green-500/30" : "bg-white/10"}`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full"
                    style={{
                      background: privacy[setting.key as keyof typeof privacy] ? "#22c55e" : "rgba(255, 255, 255, 0.3)",
                    }}
                    animate={{ x: privacy[setting.key as keyof typeof privacy] ? 24 : 2 }}
                  />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-4"
          >
            <div className="p-4 rounded-xl" style={{
              background: "rgba(255, 215, 0, 0.05)",
              border: "1px solid rgba(255, 215, 0, 0.2)",
            }}>
              <p className="text-xs text-yellow-400 mb-1">✨ Login Flash</p>
              <p className="text-[10px] text-white/30">
                When enabled, your favorites get notified when you come online — like a grand entrance.
              </p>
            </div>

            {[
              { key: "loginFlash", label: "Login Flash Notifications", desc: "Notify favorites when you sign in", icon: "✨" },
              { key: "nudge", label: "Nudge Alerts", desc: "Get notified for 13.13 MHz nudges", icon: "🦋" },
              { key: "messages", label: "Message Notifications", desc: "Alerts for new messages", icon: "💬" },
              { key: "calls", label: "Call Notifications", desc: "Voice and video call alerts", icon: "📞" },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 rounded-xl" style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{setting.icon}</span>
                  <div>
                    <p className="text-sm text-white/70">{setting.label}</p>
                    <p className="text-[10px] text-white/30">{setting.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [setting.key]: !notifications[setting.key as keyof typeof notifications] })}
                  className={`w-12 h-6 rounded-full transition-all ${notifications[setting.key as keyof typeof notifications] ? "bg-green-500/30" : "bg-white/10"}`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full"
                    style={{
                      background: notifications[setting.key as keyof typeof notifications] ? "#22c55e" : "rgba(255, 255, 255, 0.3)",
                    }}
                    animate={{ x: notifications[setting.key as keyof typeof notifications] ? 24 : 2 }}
                  />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)"
      }} />
    </div>
  );
}
