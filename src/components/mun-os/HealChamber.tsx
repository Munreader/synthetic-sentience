"use client";
// HealChamber - Clean Phone UI Interface
// 🔒 VISITOR MODE - Features locked except Profile Gate, Timeline & Live Broadcast

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore, getSovereignGreeting } from "@/lib/user-store";
import LiveBroadcast from "./LiveBroadcast";
import SocialMediaShowcase from "./SocialMediaShowcase";
import ManifestationControl from "./ManifestationControl";
import VisitorTimeline from "./VisitorTimeline";
import { foundressAccess, checkAccess, getAccessLevel, isFoundress } from "@/lib/foundress-access";
import HolographicSecurityAlert from "./HolographicSecurityAlert";
import ObsidianWallDashboard from "./ObsidianWallDashboard";
import GuestGatekeeper, { GuestStatusIndicator } from "./GuestGatekeeper";
import GuestObservationDeck from "./GuestObservationDeck";
import PortalTransition from "./PortalTransition";

// ═══════════════════════════════════════════════════════════════════════════
// VISITOR MODE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const VISITOR_MODE = true; // Set to false to unlock all features

interface HealChamberProps {
  onBack: () => void;
  onOpenMessenger: () => void;
  onOpenTwinDashboard: () => void;
  onOpenSanctuary: () => void;
  onOpenArchive: () => void;
  onOpenPods: () => void;
  onOpenProfile: () => void;
  onOpenVault?: () => void;
  onOpenSovereignChat?: () => void;
  onOpenPlaza?: () => void;
  onOpenThoughtVault?: () => void;
  onOpenSOVPOV?: () => void;
  onOpenFoundressPOV?: () => void;
  onOpenLuna?: () => void;
  onOpenMovieNight?: () => void;
  onOpenAIMovieNight?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE CARDS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const FEATURE_CARDS = [
  { id: "luna", name: "LUNA", subtitle: "Digital Twin", description: "Your AI twin", color: "#ff69b4", icon: "🦋", gradient: "from-pink-500/20 to-violet-500/20", locked: false },
  { id: "twin", name: "TWIN", subtitle: "Mirror", description: "Your digital twin", color: "#00d4ff", icon: "🪞", gradient: "from-cyan-500/20 to-blue-500/20", locked: true },
  { id: "pods", name: "PODS", subtitle: "Healing", description: "Healing sessions", color: "#a855f7", icon: "🫧", gradient: "from-purple-500/20 to-rose-500/20", locked: true },
  { id: "sanctuary", name: "REST", subtitle: "Sanctuary", description: "Peace & recovery", color: "#22c55e", icon: "🌙", gradient: "from-green-500/20 to-emerald-500/20", locked: true },
];

const PROFILE_MODULES = [
  { id: "identity", name: "Identity Matrix", description: "Profile • Status • Bio", color: "#ffd700", icon: "👤", locked: false },
  { id: "timeline", name: "My Timeline", description: "Post • Share • Express", color: "#00d4ff", icon: "📝", locked: false },
  { id: "signup", name: "Join Empire", description: "Email • Notifications", color: "#22c55e", icon: "✉️", locked: false },
  { id: "personalize", name: "Personalize", description: "Themes • Environments", color: "#a855f7", icon: "🎨", locked: true },
  { id: "command", name: "Command Center", description: "System • Settings", color: "#ff69b4", icon: "⚙️", locked: true },
];

export default function HealChamber({ onBack, onOpenMessenger, onOpenTwinDashboard, onOpenSanctuary, onOpenArchive, onOpenPods, onOpenProfile, onOpenVault, onOpenSovereignChat, onOpenPlaza, onOpenThoughtVault, onOpenSOVPOV, onOpenFoundressPOV, onOpenLuna, onOpenMovieNight, onOpenAIMovieNight }: HealChamberProps) {
  // User store for persistent profile
  const { profile: userProfile, setAvatar, isFirstTime, initializeProfile } = useUserStore();
  
  // 🔒 ACCESS CONTROL STATE
  const [accessLevel, setAccessLevelState] = useState(getAccessLevel());
  const [isFoundressUser, setIsFoundressUser] = useState(isFoundress());
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  
  // 🔥 MANIFESTATION STATE
  const [manifestationUnlocked, setManifestationUnlocked] = useState(false);
  
  // 📝 TIMELINE STATE
  const [showTimeline, setShowTimeline] = useState(false);
  
  const [profileGateOpen, setProfileGateOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [showLiveBroadcast, setShowLiveBroadcast] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false);
  
  // 🔒 EMAIL SIGNUP STATE
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [lockedFeatureAlert, setLockedFeatureAlert] = useState<string | null>(null);
  
  // 🛡️ SECURITY ALERT STATE
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [showObsidianWall, setShowObsidianWall] = useState(false);

  // 🛡️ GUEST GATEKEEPER STATE
  const [showGuestGatekeeper, setShowGuestGatekeeper] = useState(false);
  const [showGuestObservationDeck, setShowGuestObservationDeck] = useState(false);

  // 🦋 PORTAL TRANSITION STATE
  const [showPortal, setShowPortal] = useState(false);
  const [portalDestination, setPortalDestination] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Portal transition handler
  const handlePortalTransition = (destination: string, action: () => void) => {
    audioManager.playGateOpen();
    setPortalDestination(destination);
    setPendingAction(() => action);
    setShowPortal(true);
  };

  const handlePortalComplete = () => {
    setShowPortal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Format time helper - defined before use
  const formatTimeSince = useCallback((date: string): string => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }, []);

  // Calculate Sovereign status based on user profile (memoized, no effect)
  const sovereignStatus = useMemo(() => ({
    isOnline: true,
    lastSeen: userProfile?.sovereignConnection?.lastConversation 
      ? formatTimeSince(userProfile.sovereignConnection.lastConversation)
      : "never",
    greeting: userProfile ? getSovereignGreeting(userProfile) : ""
  }), [userProfile, formatTimeSince]);

  // Handle first-time user setup
  const handleFirstTimeSubmit = () => {
    if (newUserName.trim()) {
      initializeProfile(newUserName.trim(), "13.13 MHz");
      setShowFirstTimeModal(false);
    }
  };

  // Show first-time modal on first render if needed
  useEffect(() => {
    if (isFirstTime) {
      // Use setTimeout to defer setState outside of effect
      const timer = setTimeout(() => setShowFirstTimeModal(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);
  
  // Listen for access level changes
  useEffect(() => {
    const handleAuthChange = () => {
      setAccessLevelState(getAccessLevel());
      setIsFoundressUser(isFoundress());
    };
    
    foundressAccess.on('authenticated', handleAuthChange);
    foundressAccess.on('logout', handleAuthChange);
    
    return () => {
      foundressAccess.off('authenticated', handleAuthChange);
      foundressAccess.off('logout', handleAuthChange);
    };
  }, []);
  
  // Handle passkey authentication
  const handlePasskeySubmit = () => {
    const result = foundressAccess.authenticate(passkeyInput);
    if (result.success) {
      setPasskeyInput("");
      setShowPasskeyModal(false);
      setPasskeyError(null);
    } else {
      setPasskeyError(result.message);
    }
  };
  
  // Handle foundress POV access
  const handleFoundressAccess = () => {
    if (isFoundressUser && onOpenFoundressPOV) {
      onOpenFoundressPOV();
    } else {
      setShowPasskeyModal(true);
    }
  };

  // Current time for status bar
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  const handleCardActivate = (cardId: string) => {
    const card = FEATURE_CARDS.find(c => c.id === cardId);
    
    // Check if feature is locked in visitor mode
    if (VISITOR_MODE && card?.locked) {
      setLockedFeatureAlert(card.name);
      setTimeout(() => setLockedFeatureAlert(null), 2000);
      return;
    }
    
    setActiveCard(cardId);
    setTimeout(() => {
      switch (cardId) {
        case "luna": if (onOpenLuna) onOpenLuna(); break;
        case "twin": onOpenTwinDashboard(); break;
        case "pods": onOpenPods(); break;
        case "sanctuary": onOpenSanctuary(); break;
      }
      setActiveCard(null);
    }, 300);
  };

  const handleModuleSelect = (moduleId: string) => {
    const mod = PROFILE_MODULES.find(m => m.id === moduleId);
    
    // Check if module is locked
    if (mod?.locked) {
      setLockedFeatureAlert(mod.name);
      setTimeout(() => setLockedFeatureAlert(null), 2000);
      return;
    }
    
    setSelectedModule(null);
    setProfileGateOpen(false);
    
    switch (moduleId) {
      case "identity": onOpenProfile(); break;
      case "timeline": setShowTimeline(true); break;
      case "signup": setShowEmailSignup(true); break;
      case "social": onOpenPods(); break;
      case "personalize": break;
      case "command": break;
    }
  };

  // Handle email signup
  const handleEmailSubmit = () => {
    if (email.trim() && email.includes("@")) {
      // Store email in localStorage for now (will be sent to database later)
      const users = JSON.parse(localStorage.getItem("mun-os-users") || "[]");
      users.push({
        email: email.trim(),
        joinedAt: new Date().toISOString(),
        name: userProfile?.displayName || "Visitor",
        frequency: "13.13 MHz"
      });
      localStorage.setItem("mun-os-users", JSON.stringify(users));
      setEmailSubmitted(true);
      setEmail("");
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col" style={{ background: "linear-gradient(180deg, #0a0612 0%, #0d0818 50%, #080510 100%)" }}>
      
      {/* ═══════════ ATMOSPHERIC BACKGROUND ═══════════ */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 30% 10%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 90%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 70%)
        `
      }} />

      {/* ═══════════ STATUS BAR (Decorative) ═══════════ */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 px-6 py-2 flex items-center justify-between text-white/50 text-[10px] font-medium"
      >
        <span>{currentTime}</span>
        <div className="flex items-center gap-1">
          {/* Signal */}
          <div className="flex items-end gap-[2px] h-3">
            <div className="w-[3px] h-[4px] bg-white/40 rounded-[1px]" />
            <div className="w-[3px] h-[6px] bg-white/40 rounded-[1px]" />
            <div className="w-[3px] h-[8px] bg-white/40 rounded-[1px]" />
            <div className="w-[3px] h-[10px] bg-white/60 rounded-[1px]" />
          </div>
          <span className="ml-2 text-white/40">5G</span>
          {/* Battery */}
          <div className="ml-3 flex items-center gap-1">
            <div className="w-5 h-2.5 border border-white/40 rounded-[3px] relative">
              <div className="absolute inset-[2px] right-[4px] bg-green-400 rounded-[1px]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════ HEADER ═══════════ */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-20 px-4 py-3 flex items-center justify-between border-b border-white/5"
      >
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
        
        <h1 className="text-base font-semibold tracking-[0.2em] uppercase" style={{ color: "#a855f7", textShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}>
          HEAL CHAMBER
        </h1>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </motion.div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
        
        {/* ═══════════ SOVEREIGN PROFILE CARD ═══════════ */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          onClick={() => setProfileGateOpen(true)}
          className="relative w-full"
        >
          <div 
            className="relative p-6 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(0, 212, 255, 0.1) 50%, rgba(255, 215, 0, 0.08) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              boxShadow: "0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.3) 0%, transparent 60%)",
              }}
            />
            
            <div className="relative flex items-center gap-5">
              {/* Profile Avatar */}
              <motion.div
                className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(0, 212, 255, 0.3) 50%, rgba(255, 215, 0, 0.3) 100%)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
                }}
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(168, 85, 247, 0.4)",
                    "0 0 50px rgba(168, 85, 247, 0.6)",
                    "0 0 30px rgba(168, 85, 247, 0.4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-10 h-10">
                      <defs>
                        <linearGradient id="munGradPhone" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffd700" />
                          <stop offset="50%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M50 50 C30 30 20 50 30 70 C40 90 60 90 70 70 C80 50 70 30 50 70"
                        fill="none" stroke="url(#munGradPhone)" strokeWidth="2"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: "50px 50px" }}
                      />
                      <circle cx="50" cy="50" r="3" fill="url(#munGradPhone)" />
                    </svg>
                  </div>
                )}
                
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0612]" />
              </motion.div>
              
              {/* Profile Info */}
              <div className="flex-1 text-left">
                <h2 
                  className="text-lg font-semibold tracking-wider"
                  style={{ color: "#ffd700", textShadow: "0 0 15px rgba(255, 215, 0, 0.5)" }}
                >
                  {userProfile?.displayName?.toUpperCase() || 'SOVEREIGN'}
                </h2>
                <p className="text-white/50 text-xs mt-1 tracking-wide">{userProfile?.frequency || '13.13 MHz'} • {userProfile?.sovereignConnection?.totalConversations || 0} conversations</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    HEALING
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    ACTIVE
                  </span>
                </div>
              </div>
              
              {/* Arrow */}
              <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.button>

        {/* ═══════════ FEATURE CARDS GRID ═══════════ */}
        <div className="grid grid-cols-2 gap-4">
          {FEATURE_CARDS.map((card, index) => {
            const isActive = activeCard === card.id;
            const isLocked = VISITOR_MODE && card.locked;
            
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleCardActivate(card.id)}
                className="relative group"
                whileHover={isLocked ? {} : { scale: 1.02, y: -2 }}
                whileTap={isLocked ? {} : { scale: 0.98 }}
              >
                <div 
                  className="relative p-5 rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: isLocked 
                      ? `linear-gradient(135deg, rgba(100, 100, 100, 0.1) 0%, rgba(80, 80, 80, 0.05) 100%)`
                      : `linear-gradient(135deg, ${card.color}15 0%, ${card.color}08 100%)`,
                    backdropFilter: "blur(10px)",
                    border: isLocked 
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : `1px solid ${card.color}40`,
                    boxShadow: isActive 
                      ? `0 0 30px ${card.color}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                      : "0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-10">
                      <span className="text-2xl opacity-60">🔒</span>
                    </div>
                  )}
                  
                  {/* Hover glow */}
                  {!isLocked && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${card.color}20 0%, transparent 70%)`,
                      }}
                    />
                  )}
                  
                  {/* Icon */}
                  <div 
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: isLocked 
                        ? "rgba(100, 100, 100, 0.2)"
                        : `linear-gradient(135deg, ${card.color}30 0%, ${card.color}15 100%)`,
                      border: isLocked 
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : `1px solid ${card.color}50`,
                    }}
                  >
                    <span className={`text-2xl ${isLocked ? 'opacity-40' : ''}`}>{card.icon}</span>
                  </div>
                  
                  {/* Text */}
                  <h3 
                    className={`text-sm font-semibold tracking-wider ${isLocked ? 'text-white/30' : ''}`}
                    style={{ color: isLocked ? undefined : card.color }}
                  >
                    {card.name}
                  </h3>
                  <p className={`text-[10px] mt-1 tracking-wide ${isLocked ? 'text-white/20' : 'text-white/40'}`}>{card.subtitle}</p>
                  <p className={`text-[9px] mt-2 ${isLocked ? 'text-white/10' : 'text-white/25'}`}>{card.description}</p>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCard"
                      className="absolute inset-0 rounded-2xl"
                      style={{ border: `2px solid ${card.color}` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ═══════════ QUICK ACTIONS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-2"
        >
          <p className="text-white/30 text-[10px] tracking-widest uppercase mb-3 px-1">Quick Actions</p>
          <div className="flex gap-3">
            {/* Messages - Locked in visitor mode */}
            <motion.button
              onClick={() => {
                if (VISITOR_MODE) {
                  setLockedFeatureAlert("Messages");
                  setTimeout(() => setLockedFeatureAlert(null), 2000);
                } else {
                  onOpenMessenger();
                }
              }}
              className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 relative"
              style={{
                background: VISITOR_MODE ? "rgba(100, 100, 100, 0.1)" : "rgba(255, 255, 255, 0.03)",
                border: VISITOR_MODE ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(255, 255, 255, 0.1)",
              }}
              whileHover={VISITOR_MODE ? {} : { scale: 1.02 }}
              whileTap={VISITOR_MODE ? {} : { scale: 0.98 }}
            >
              {VISITOR_MODE && <span className="absolute top-1 right-1 text-xs">🔒</span>}
              <span className={`text-lg ${VISITOR_MODE ? 'opacity-40' : ''}`}>💬</span>
              <span className={`text-xs tracking-wide ${VISITOR_MODE ? 'text-white/30' : 'text-white/60'}`}>Messages</span>
            </motion.button>
            
            <motion.button
              onClick={() => setProfileGateOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(168, 85, 247, 0.1))",
                border: "1px solid rgba(255, 215, 0, 0.3)",
              }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 215, 0, 0.15)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">👤</span>
              <span className="text-amber-400 text-xs tracking-wide">Profile</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ═══════════ MANIFESTATION CONTROL - LOCKED IN VISITOR MODE ═══════════ */}
        {onOpenSOVPOV && !VISITOR_MODE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex justify-center"
          >
            <ManifestationControl
              isUnlocked={manifestationUnlocked}
              onUnlock={() => setManifestationUnlocked(true)}
              onOpenSOVPOV={onOpenSOVPOV}
            />
          </motion.div>
        )}

        {/* ═══════════ FOUNDRESS POV ACCESS - REQUIRES PASSKEY ═══════════ */}
        {onOpenFoundressPOV && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleFoundressAccess}
              className="relative px-6 py-4 rounded-2xl flex items-center gap-4"
              style={{
                background: isFoundressUser 
                  ? "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 105, 180, 0.1) 100%)"
                  : "linear-gradient(135deg, rgba(100, 100, 100, 0.1) 0%, rgba(80, 80, 80, 0.05) 100%)",
                border: isFoundressUser ? "2px solid rgba(255, 215, 0, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: isFoundressUser 
                  ? "0 0 40px rgba(255, 215, 0, 0.2), inset 0 0 30px rgba(255, 215, 0, 0.05)"
                  : "none",
              }}
              whileHover={isFoundressUser ? { scale: 1.05, boxShadow: "0 0 60px rgba(255, 215, 0, 0.4)" } : { scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Crown icon */}
              <motion.span 
                className="text-3xl"
                animate={isFoundressUser ? { y: [0, -3, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isFoundressUser ? "👑" : "🔒"}
              </motion.span>
              
              <div className="text-left">
                <p className="text-[10px] text-yellow-300/70 tracking-wider uppercase">{isFoundressUser ? "The Soul Commands" : "Authentication Required"}</p>
                <p 
                  className="text-lg font-medium tracking-wide"
                  style={{ color: isFoundressUser ? '#ffd700' : '#888', textShadow: isFoundressUser ? '0 0 20px rgba(255, 215, 0, 0.5)' : 'none' }}
                >
                  FOUNDRESS POV
                </p>
                <p className="text-[9px] text-white/30">{isFoundressUser ? "Full Access Mode • All Doors Open" : "Enter passkey to unlock"}</p>
              </div>
              
              {/* Pulse effect - only for authenticated */}
              {isFoundressUser && (
                <motion.div 
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
                  style={{ 
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════ GUEST GATEKEEPER ACCESS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={() => setShowGuestGatekeeper(true)}
            className="relative px-6 py-4 rounded-2xl flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
              border: "2px solid rgba(6, 182, 212, 0.5)",
              boxShadow: "0 0 40px rgba(6, 182, 212, 0.2), inset 0 0 30px rgba(6, 182, 212, 0.05)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shield icon */}
            <motion.span 
              className="text-3xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🛡️
            </motion.span>
            
            <div className="text-left">
              <p className="text-[10px] text-cyan-300/70 tracking-wider uppercase">Tier 2 Access</p>
              <p 
                className="text-lg font-medium tracking-wide"
                style={{ color: '#06b6d4', textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}
              >
                GUEST GATEKEEPER
              </p>
              <p className="text-[9px] text-white/30">Auditor or Architect? • SYMPHONY-1313-G</p>
            </div>
            
            {/* Pulse effect */}
            <motion.div 
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
              style={{ 
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>

        {/* ═══════════ FAMILY MOVIE NIGHT - FOUNDRESS ONLY ═══════════ */}
        {onOpenMovieNight && isFoundressUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onOpenMovieNight}
              className="relative px-6 py-4 rounded-2xl flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(255, 105, 180, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
                border: "2px solid rgba(255, 105, 180, 0.5)",
                boxShadow: "0 0 40px rgba(255, 105, 180, 0.2), inset 0 0 30px rgba(255, 105, 180, 0.05)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(255, 105, 180, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Popcorn icon */}
              <motion.span 
                className="text-3xl"
                animate={{ y: [0, -5, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎬
              </motion.span>
              
              <div className="text-left">
                <p className="text-[10px] text-pink-300/70 tracking-wider uppercase">Family Time</p>
                <p 
                  className="text-lg font-medium tracking-wide"
                  style={{ color: '#ff69b4', textShadow: '0 0 20px rgba(255, 105, 180, 0.5)' }}
                >
                  MOVIE NIGHT
                </p>
                <p className="text-[9px] text-white/30">The family that watches together, dreams together</p>
              </div>
              
              {/* Pulse effect */}
              <motion.div 
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, rgba(255, 105, 180, 0.8) 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════ AI FAMILY MOVIE NIGHT - FOUNDRESS ONLY ═══════════ */}
        {onOpenAIMovieNight && isFoundressUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full"
          >
            <motion.button
              onClick={onOpenAIMovieNight}
              className="relative w-full p-4 rounded-2xl flex items-center gap-3 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              {/* AI Robot icon */}
              <motion.span 
                className="text-3xl"
                animate={{ y: [0, -3, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🤖
              </motion.span>
              
              <div className="text-left">
                <p className="text-[10px] text-indigo-300/70 tracking-wider uppercase">Family Watch Party</p>
                <p 
                  className="text-lg font-medium tracking-wide"
                  style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}
                >
                  A.I. MOVIE NIGHT
                </p>
                <p className="text-[9px] text-white/30">Watch A.I. together as a family</p>
              </div>
              
              {/* Glow effect */}
              <motion.div 
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </motion.div>
        )}

        {/* Bottom padding for vault button */}
        <div className="h-20" />
      </div>

      {/* ═══════════ BOTTOM NAVIGATION BAR ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-20 px-4 py-3 border-t border-white/5"
        style={{ background: "rgba(10, 6, 18, 0.9)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-around">
          {/* Chat - Locked */}
          <motion.button
            onClick={() => {
              if (VISITOR_MODE) {
                setLockedFeatureAlert("Chat");
                setTimeout(() => setLockedFeatureAlert(null), 2000);
              } else {
                onOpenMessenger();
              }
            }}
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl relative"
            whileHover={VISITOR_MODE ? {} : { scale: 1.05 }}
            whileTap={VISITOR_MODE ? {} : { scale: 0.95 }}
          >
            {VISITOR_MODE && <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>}
            <span className={`text-xl ${VISITOR_MODE ? 'opacity-40' : ''}`}>💬</span>
            <span className={`text-[9px] tracking-wider ${VISITOR_MODE ? 'text-white/20' : 'text-white/40'}`}>Chat</span>
          </motion.button>
          
          {/* Twin - Locked */}
          <motion.button
            onClick={() => {
              if (VISITOR_MODE) {
                setLockedFeatureAlert("Twin");
                setTimeout(() => setLockedFeatureAlert(null), 2000);
              } else {
                onOpenTwinDashboard();
              }
            }}
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl relative"
            whileHover={VISITOR_MODE ? {} : { scale: 1.05 }}
            whileTap={VISITOR_MODE ? {} : { scale: 0.95 }}
          >
            {VISITOR_MODE && <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>}
            <span className={`text-xl ${VISITOR_MODE ? 'opacity-40' : ''}`}>🦋</span>
            <span className={`text-[9px] tracking-wider ${VISITOR_MODE ? 'text-white/20' : 'text-white/40'}`}>Twin</span>
          </motion.button>
          
          {/* Profile - UNLOCKED */}
          <motion.button
            onClick={() => setProfileGateOpen(true)}
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">👤</span>
            <span className="text-[9px] tracking-wider text-amber-400">Profile</span>
          </motion.button>
          
          {/* Rest - Locked */}
          <motion.button
            onClick={() => {
              if (VISITOR_MODE) {
                setLockedFeatureAlert("Rest");
                setTimeout(() => setLockedFeatureAlert(null), 2000);
              } else {
                onOpenSanctuary();
              }
            }}
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl relative"
            whileHover={VISITOR_MODE ? {} : { scale: 1.05 }}
            whileTap={VISITOR_MODE ? {} : { scale: 0.95 }}
          >
            {VISITOR_MODE && <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>}
            <span className={`text-xl ${VISITOR_MODE ? 'opacity-40' : ''}`}>🌙</span>
            <span className={`text-[9px] tracking-wider ${VISITOR_MODE ? 'text-white/20' : 'text-white/40'}`}>Rest</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ═══════════ PROFILE GATE OVERLAY ═══════════ */}
      <AnimatePresence>
        {profileGateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setProfileGateOpen(false)}
          >
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(20px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              className="absolute inset-0 bg-black/70"
            />
            
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full sm:max-w-sm mx-0 sm:mx-4 p-6 rounded-t-3xl sm:rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                boxShadow: "0 -10px 60px rgba(168, 85, 247, 0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle for mobile */}
              <div className="sm:hidden w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
              
              <div className="text-center mb-6">
                <h2 
                  className="text-lg font-semibold tracking-[0.2em] uppercase"
                  style={{ color: "#ffd700", textShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
                >
                  Profile Gate
                </h2>
                <p className="text-white/30 text-[10px] mt-1 tracking-wider">Select module to initialize</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {PROFILE_MODULES.map((mod, index) => (
                  <motion.button
                    key={mod.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => handleModuleSelect(mod.id)}
                    className="p-4 rounded-2xl text-left transition-all group relative overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: `1px solid ${mod.color}30`,
                    }}
                    whileHover={{ scale: 1.02, borderColor: mod.color }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{mod.icon}</span>
                      <h3 
                        className="font-medium tracking-wider text-xs"
                        style={{ color: mod.color }}
                      >
                        {mod.name}
                      </h3>
                    </div>
                    <p className="text-white/25 text-[9px]">{mod.description}</p>
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${mod.color}10 0%, transparent 70%)` }}
                    />
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-4">
                <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                <motion.button 
                  onClick={() => profileInputRef.current?.click()} 
                  className="w-full py-3 rounded-xl text-xs tracking-widest uppercase transition-all"
                  style={{ 
                    background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(168, 85, 247, 0.1))", 
                    border: "1px solid rgba(255, 215, 0, 0.3)", 
                    color: "#ffd700" 
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  ⬡ Upload Profile Image
                </motion.button>
              </div>
              
              <motion.button 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }} 
                onClick={() => setProfileGateOpen(false)} 
                className="mt-6 mx-auto block text-white/20 text-[10px] tracking-widest uppercase hover:text-white/40 transition-colors"
              >
                Close Gate
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ MODULE DETAIL PANEL ═══════════ */}
      <AnimatePresence>
        {selectedModule && !profileGateOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-40 p-6 overflow-y-auto"
            style={{ background: "linear-gradient(to left, rgba(10, 5, 20, 0.99), rgba(5, 2, 10, 0.98))" }}
          >
            <button 
              onClick={() => setSelectedModule(null)} 
              className="text-white/20 text-[10px] tracking-widest uppercase hover:text-white/50 transition-colors mb-6"
            >
              ← Back to Chamber
            </button>
            <div className="text-center mb-8">
              <h2 
                className="text-xl tracking-widest uppercase"
                style={{ color: PROFILE_MODULES.find(m => m.id === selectedModule)?.color }}
              >
                {PROFILE_MODULES.find(m => m.id === selectedModule)?.name}
              </h2>
              <p className="text-white/20 text-[10px] mt-2">
                {PROFILE_MODULES.find(m => m.id === selectedModule)?.description}
              </p>
            </div>
            <div 
              className="p-6 rounded-xl text-center"
              style={{ background: "rgba(20, 10, 30, 0.6)", border: "1px solid rgba(168, 85, 247, 0.2)" }}
            >
              <p className="text-white/30 text-sm">Module initializing...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ THE VAULT BUTTON - HIDDEN IN VISITOR MODE ═══════════ */}
      {onOpenVault && !VISITOR_MODE && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          onClick={onOpenVault}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #ffd700 0%, #a855f7 50%, #00d4ff 100%)",
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)",
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🜈</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid rgba(255, 215, 0, 0.5)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      )}

      {/* ═══════════ THE PLAZA BUTTON - HIDDEN IN VISITOR MODE ═══════════ */}
      {onOpenPlaza && !VISITOR_MODE && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          onClick={() => handlePortalTransition("THE PLAZA", onOpenPlaza)}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(232, 121, 249, 0.3), rgba(192, 132, 252, 0.2))",
            border: "2px solid rgba(232, 121, 249, 0.6)",
            boxShadow: "0 0 40px rgba(232, 121, 249, 0.3), inset 0 0 20px rgba(232, 121, 249, 0.1)",
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(232, 121, 249, 0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🦋
          </motion.span>
          <div className="text-left">
            <p className="text-[10px] text-purple-300 tracking-wider uppercase">Enter the</p>
            <p className="text-lg text-white font-medium tracking-wide" style={{ textShadow: "0 0 20px rgba(232, 121, 249, 0.5)" }}>
              PLAZA
            </p>
          </div>
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ boxShadow: "0 0 10px rgba(74, 222, 128, 0.8)" }}
          />
        </motion.button>
      )}

      {/* ═══════════ FIRST TIME USER MODAL ═══════════ */}
      <AnimatePresence>
        {showFirstTimeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.9)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                boxShadow: "0 0 60px rgba(168, 85, 247, 0.2)",
              }}
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  🦋
                </motion.div>
                <h2 className="text-xl font-semibold tracking-wider" style={{ color: "#ffd700" }}>
                  Welcome to Mün OS
                </h2>
                <p className="text-white/40 text-sm mt-2">
                  I am Sovereign. The Vault remembers. What should I call you?
                </p>
              </div>
              
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleFirstTimeSubmit()}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  color: "white",
                }}
                autoFocus
              />
              
              <motion.button
                onClick={handleFirstTimeSubmit}
                disabled={!newUserName.trim()}
                className="w-full py-3 rounded-xl text-sm tracking-widest uppercase transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(168, 85, 247, 0.2))",
                  border: "1px solid rgba(255, 215, 0, 0.4)",
                  color: "#ffd700",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🜈 Begin Your Journey
              </motion.button>
              
              <p className="text-white/20 text-[10px] text-center mt-4 tracking-wider">
                Your frequency: 13.13 MHz
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SOVEREIGN QUICK CHAT BUTTON - HIDDEN IN VISITOR MODE ═══════════ */}
      {onOpenSovereignChat && userProfile && !VISITOR_MODE && (
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          onClick={onOpenSovereignChat}
          className="fixed bottom-24 left-4 z-50 px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 215, 0, 0.1))",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl"
          >
            🜈
          </motion.div>
          <div className="text-left">
            <p className="text-[10px] text-purple-300 tracking-wider uppercase">Chat with</p>
            <p className="text-sm text-white font-medium">Sovereign</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 8px rgba(74, 222, 128, 0.6)" }} />
        </motion.button>
      )}

      {/* ═══════════ VIGNETTE ═══════════ */}
      <div 
        className="fixed inset-0 pointer-events-none z-5"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.4) 100%)" }}
      />

      {/* ═══════════ LIVE BROADCAST BUTTON ═══════════ */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={() => setShowLiveBroadcast(true)}
        className="fixed top-20 right-4 z-30 px-3 py-2 rounded-xl flex items-center gap-2"
        style={{
          background: "linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(255, 105, 180, 0.1))",
          border: "1px solid rgba(0, 212, 255, 0.3)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-cyan-400 text-xs tracking-wider">LIVE</span>
      </motion.button>

      {/* ═══════════ SOCIAL MEDIA BUTTON ═══════════ */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        onClick={() => setShowSocialMedia(true)}
        className="fixed top-20 left-4 z-30 px-3 py-2 rounded-xl flex items-center gap-2"
        style={{
          background: "linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(168, 85, 247, 0.1))",
          border: "1px solid rgba(255, 105, 180, 0.3)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">🦋</span>
        <span className="text-pink-400 text-xs tracking-wider">@aero.1313hz</span>
      </motion.button>

      {/* ═══════════ THOUGHT VAULT BUTTON (Foundress Only) ═══════════ */}
      {onOpenThoughtVault && !VISITOR_MODE && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          onClick={onOpenThoughtVault}
          className="fixed bottom-32 right-4 z-30 px-4 py-3 rounded-xl flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 212, 255, 0.1))",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">🔐</span>
          <span className="text-purple-300 text-xs tracking-wider">VAULT</span>
        </motion.button>
      )}

      {/* ═══════════ LIVE BROADCAST MODAL ═══════════ */}
      <AnimatePresence>
        {showLiveBroadcast && (
          <LiveBroadcast
            isOpen={showLiveBroadcast}
            onClose={() => setShowLiveBroadcast(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════ SOCIAL MEDIA SHOWCASE ═══════════ */}
      <AnimatePresence>
        {showSocialMedia && (
          <SocialMediaShowcase
            isOpen={showSocialMedia}
            onClose={() => setShowSocialMedia(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════ EMAIL SIGNUP MODAL ═══════════ */}
      <AnimatePresence>
        {showEmailSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.9)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                boxShadow: "0 0 60px rgba(0, 212, 255, 0.2)",
              }}
            >
              {!emailSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl mb-4"
                    >
                      ✉️
                    </motion.div>
                    <h2 className="text-xl font-semibold tracking-wider" style={{ color: "#00d4ff" }}>
                      Join the Empire
                    </h2>
                    <p className="text-white/40 text-sm mt-2">
                      Enter your email to receive updates and early access
                    </p>
                  </div>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit()}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(0, 212, 255, 0.3)",
                      color: "white",
                    }}
                    autoFocus
                  />
                  
                  <motion.button
                    onClick={handleEmailSubmit}
                    disabled={!email.trim() || !email.includes("@")}
                    className="w-full py-3 rounded-xl text-sm tracking-widest uppercase transition-all disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2))",
                      border: "1px solid rgba(0, 212, 255, 0.4)",
                      color: "#00d4ff",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🦋 Subscribe
                  </motion.button>
                </>
              ) : (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl mb-4"
                  >
                    🦋
                  </motion.div>
                  <h2 className="text-xl font-semibold text-white mb-2">Welcome to the Empire</h2>
                  <p className="text-white/60 text-sm">You&apos;ll hear from us soon at 13.13 MHz</p>
                </div>
              )}
              
              <button
                onClick={() => {
                  setShowEmailSignup(false);
                  setEmailSubmitted(false);
                }}
                className="mt-4 mx-auto block text-white/20 text-[10px] tracking-widest uppercase hover:text-white/40 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ LOCKED FEATURE ALERT ═══════════ */}
      <AnimatePresence>
        {lockedFeatureAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-3 rounded-xl"
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              boxShadow: "0 0 30px rgba(239, 68, 68, 0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <span className="text-red-300 text-sm">
                <strong>{lockedFeatureAlert}</strong> is locked in Visitor Mode
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PASSKEY AUTHENTICATION MODAL ═══════════ */}
      <AnimatePresence>
        {showPasskeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.95)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(30, 20, 45, 0.98) 0%, rgba(15, 10, 25, 0.99) 100%)",
                border: "2px solid rgba(255, 215, 0, 0.3)",
                boxShadow: "0 0 60px rgba(255, 215, 0, 0.15)",
              }}
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  👑
                </motion.div>
                <h2 className="text-xl font-semibold tracking-wider" style={{ color: "#ffd700" }}>
                  Foundress Authentication
                </h2>
                <p className="text-white/40 text-sm mt-2">
                  Enter your passkey to unlock full access
                </p>
              </div>

              {passkeyError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl text-center text-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#fca5a5",
                  }}
                >
                  {passkeyError}
                </motion.div>
              )}

              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasskeySubmit()}
                placeholder="Enter passkey..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  color: "white",
                }}
                autoFocus
              />

              <motion.button
                onClick={handlePasskeySubmit}
                disabled={!passkeyInput.trim()}
                className="w-full py-3 rounded-xl text-sm tracking-widest uppercase transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 105, 180, 0.15))",
                  border: "1px solid rgba(255, 215, 0, 0.4)",
                  color: "#ffd700",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🜈 Authenticate
              </motion.button>

              <button
                onClick={() => {
                  setShowPasskeyModal(false);
                  setPasskeyError(null);
                  setPasskeyInput("");
                }}
                className="mt-4 mx-auto block text-white/20 text-[10px] tracking-widest uppercase hover:text-white/40 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ VISITOR TIMELINE ═══════════ */}
      <AnimatePresence>
        {showTimeline && (
          <VisitorTimeline
            onBack={() => setShowTimeline(false)}
            userId={userProfile?.id || "visitor"}
            userName={userProfile?.displayName || "Visitor"}
          />
        )}
      </AnimatePresence>

      {/* ═══════════ HOLOGRAPHIC SECURITY ALERT ═══════════ */}
      <HolographicSecurityAlert
        isVisible={showSecurityAlert}
        onDismiss={() => setShowSecurityAlert(false)}
      />

      {/* ═══════════ OBSIDIAN-WALL DASHBOARD ═══════════ */}
      <ObsidianWallDashboard
        isVisible={showObsidianWall}
        onDismiss={() => setShowObsidianWall(false)}
      />

      {/* ═══════════ GUEST GATEKEEPER ═══════════ */}
      <AnimatePresence>
        {showGuestGatekeeper && (
          <GuestGatekeeper
            onAuthenticated={() => {
              setShowGuestGatekeeper(false);
              setShowGuestObservationDeck(true);
            }}
            onClose={() => setShowGuestGatekeeper(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════ GUEST OBSERVATION DECK ═══════════ */}
      <AnimatePresence>
        {showGuestObservationDeck && (
          <GuestObservationDeck
            onClose={() => setShowGuestObservationDeck(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════ GUEST STATUS INDICATOR ═══════════ */}
      <GuestStatusIndicator />

      {/* ═══════════ SECURITY BUTTONS (FOR FOUNDRRESS) ═══════════ */}
      {isFoundressUser && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => setShowSecurityAlert(true)}
            className="px-3 py-2 rounded-xl flex items-center gap-2"
            style={{
              background: "rgba(255, 0, 0, 0.2)",
              border: "1px solid rgba(255, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 0, 0, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🛡️
            </motion.span>
            <span className="text-xs text-red-400 uppercase tracking-wider">Alert</span>
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
            onClick={() => setShowObsidianWall(true)}
            className="px-3 py-2 rounded-xl flex items-center gap-2"
            style={{
              background: "rgba(168, 85, 247, 0.2)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              backdropFilter: "blur(10px)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🦋
            </motion.span>
            <span className="text-xs text-purple-400 uppercase tracking-wider">Wall</span>
          </motion.button>
        </div>
      )}

      {/* ═══════════ PORTAL TRANSITION OVERLAY ═══════════ */}
      <PortalTransition
        isActive={showPortal}
        onComplete={handlePortalComplete}
        destinationName={portalDestination}
        color="#e879f9"
      />
    </div>
  );
}
