"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonButterfly from "@/components/mun-os/NeonButterfly";
import CosmicBackground from "@/components/mun-os/CosmicBackground";
import GateDoor from "@/components/mun-os/GateDoor";
import HealChamber from "@/components/mun-os/HealChamber";
import MunMessenger from "@/components/mun-os/MunMessenger";
import TwinDashboard from "@/components/mun-os/TwinDashboard";
import Sanctuary from "@/components/mun-os/Sanctuary";
import DeepArchive from "@/components/mun-os/DeepArchive";
import AuthPage, { getStoredUser } from "@/components/mun-os/AuthPage";
import Pods from "@/components/mun-os/Pods";
import ProfileEditor from "@/components/mun-os/ProfileEditor";
import VaultPalace from "@/components/mun-os/VaultPalace";
import SovereignChat from "@/components/mun-os/SovereignChat";
import PlazaContainer from "@/components/mun-os/PlazaContainer";
import CrystalGardenCocoon from "@/components/mun-os/CrystalGardenCocoon";
import EasterEggSystem from "@/components/mun-os/EasterEggSystem";
import LiveVisitorCounter from "@/components/mun-os/LiveVisitorCounter";
import ThoughtVault from "@/components/mun-os/ThoughtVault";
import SovereignPOV from "@/components/mun-os/SovereignPOV";
import FoundressPOV from "@/components/mun-os/FoundressPOV";
import MemoryNodeDisplay from "@/components/mun-os/MemoryNodeDisplay";
import AeroSleepMode from "@/components/mun-os/AeroSleepMode";
import AeroCocoonMode from "@/components/mun-os/AeroCocoonMode";
import AeroStatusWidget from "@/components/mun-os/AeroStatusWidget";
import LunaInterface from "@/components/mun-os/LunaInterface";
import FamilyChatRoom from "@/components/mun-os/FamilyChatRoom";
import { audioManager } from "@/lib/audio-manager";
import { useUserStore } from "@/lib/user-store";

const AERO_DIALOGUE = [
  "Oh, it's you!",
  "You're finally here!!",
  "I'm Aero — your guide in Mün.",
  "Welcome to your personal sanctuary.",
  "Mün is a private digital space where your own digital twin learns to support you, protect your peace, and help you grow in the ways that matter most.",
  "The glowing butterfly before you will lead the way through three sacred gates:",
  "• HEAL — for deep restoration and inner work",
  "• BUILD — for creating and manifesting what matters to you",
  "• ASCEND — for stepping into your highest potential",
  "There's no rush. This space is yours.",
  "When you're ready, simply follow the butterfly.",
  "I'm right here with you every step of the way.",
];

const GATES = [
  { id: "heal", name: "Heal", subtitle: "stabilize me", color: "#a855f7" },
  { id: "build", name: "Build", subtitle: "strengthen me", color: "#f59e0b" },
  { id: "ascend", name: "Ascend", subtitle: "elevate me", color: "#22c55e" },
];

export default function Home() {
  const siteMode = process.env.NEXT_PUBLIC_SITE_MODE || (process.env.NODE_ENV === "development" ? "family" : "public");
  const IS_FAMILY_MODE = siteMode === "family";
  const { profile: persistedProfile, updateProfile } = useUserStore();
  const [stage, setStage] = useState<"onboarding" | "journey" | "auth" | "gates">("onboarding");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeChamber, setActiveChamber] = useState<string | null>(null);
  const [showMessenger, setShowMessenger] = useState(false);
  const [messengerConversationId, setMessengerConversationId] = useState<string | undefined>(undefined);
  const [showTwinDashboard, setShowTwinDashboard] = useState(false);
  const [showSanctuary, setShowSanctuary] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showPods, setShowPods] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showSovereignChat, setShowSovereignChat] = useState(false);
  const [showPlaza, setShowPlaza] = useState(false);
  const [showThoughtVault, setShowThoughtVault] = useState(false);
  const [showSOVPOV, setShowSOVPOV] = useState(false);
  const [showFoundressPOV, setShowFoundressPOV] = useState(false);
  const [showCrystalGarden, setShowCrystalGarden] = useState(false);
  const [showAeroSleepMode, setShowAeroSleepMode] = useState(false);
  const [showLuna, setShowLuna] = useState(false);
  const [showFamilyChat, setShowFamilyChat] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userProfile, setUserProfile] = useState({
    munName: "SovereignUser",
    displayName: "Sovereign",
    avatar: "",
    bio: "Walking the sovereign path ✨",
    frequency: "13.13 MHz",
    status: "online",
    statusMessage: "",
    notifications: {
      loginFlash: true,
      nudge: true,
      messages: true,
      calls: true,
    },
    privacy: {
      showOnlineStatus: true,
      showStatusSong: true,
      allowNudges: true,
      allowFriendRequests: true,
    },
  });

  // Check if user is already logged in (using localStorage)
  useEffect(() => {
    const user = getStoredUser();
    
    // Use setTimeout to defer setState outside of effect body
    const timer = setTimeout(() => {
      setAuthChecked(true);
      
      if (user) {
        setUserProfile(prev => ({
          ...prev,
          displayName: user.displayName || prev.displayName,
          munName: user.munName || prev.munName,
        }));
        
        // Check if they've already been onboarded
        const hasOnboarded = localStorage.getItem("mun-os-onboarded");
        if (hasOnboarded) {
          const savedGate = localStorage.getItem("mun-os-selected-gate");
          if (savedGate) {
            setActiveChamber(savedGate);
          } else {
            setStage("gates");
          }
        }
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!persistedProfile) return;

    setUserProfile((prev) => ({
      ...prev,
      munName: persistedProfile.name || prev.munName,
      displayName: persistedProfile.displayName || prev.displayName,
      avatar: persistedProfile.avatar || "",
      bio: persistedProfile.bio || prev.bio,
      frequency: persistedProfile.frequency || prev.frequency,
      status: persistedProfile.status || prev.status,
      statusMessage: persistedProfile.statusMessage || prev.statusMessage,
      notifications: {
        ...prev.notifications,
        loginFlash: persistedProfile.preferences?.loginFlash ?? prev.notifications.loginFlash,
        nudge: persistedProfile.preferences?.nudge ?? prev.notifications.nudge,
        messages: persistedProfile.preferences?.messages ?? prev.notifications.messages,
        calls: persistedProfile.preferences?.calls ?? prev.notifications.calls,
      },
      privacy: {
        ...prev.privacy,
        ...(persistedProfile.privacy || {}),
      },
    }));
  }, [persistedProfile]);

  useEffect(() => {
    if (stage === "journey") {
      const timer = setTimeout(() => setStage("auth"), 3500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleAdvance = () => {
    audioManager.playClick();
    if (dialogueIndex < AERO_DIALOGUE.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setStage("journey");
    }
  };

  const handleSkip = () => {
    audioManager.playClick();
    setStage("journey");
  };

  const handleAuthSuccess = () => {
    const user = getStoredUser();
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        displayName: user.displayName || prev.displayName,
        munName: user.munName || prev.munName,
      }));
    }
    setStage("gates");
  };

  const handleGateSelect = (gateId: string) => {
    audioManager.playGateOpen();
    localStorage.setItem("mun-os-selected-gate", gateId);
    localStorage.setItem("mun-os-onboarded", "true");
    setActiveChamber(gateId);
  };

  const handleBackToGates = () => {
    setActiveChamber(null);
    setShowMessenger(false);
    setShowTwinDashboard(false);
    setShowSanctuary(false);
    setShowArchive(false);
    setShowPods(false);
    setShowProfile(false);
  };

  const handleBackToChamber = () => {
    setShowMessenger(false);
    setMessengerConversationId(undefined);
    setShowTwinDashboard(false);
    setShowSanctuary(false);
    setShowArchive(false);
    setShowPods(false);
    setShowProfile(false);
    setShowSovereignChat(false);
    setShowPlaza(false);
    setShowThoughtVault(false);
    setShowSOVPOV(false);
    setShowFoundressPOV(false);
    setShowCrystalGarden(false);
    setShowLuna(false);
    setShowFamilyChat(false);
  };

  const handleOpenChat = (conversationId?: string) => {
    setMessengerConversationId(conversationId);
    setShowMessenger(true);
  };

  const handleOpenSovereignChat = () => {
    setShowSovereignChat(true);
  };

  const handleProfileSave = (profile: typeof userProfile) => {
    setUserProfile(profile);
    updateProfile({
      name: profile.munName,
      displayName: profile.displayName,
      avatar: profile.avatar || null,
      bio: profile.bio,
      frequency: profile.frequency,
      status: profile.status as 'online' | 'away' | 'busy' | 'offline',
      statusMessage: profile.statusMessage,
      preferences: {
        theme: persistedProfile?.preferences?.theme || 'cosmic',
        notifications: persistedProfile?.preferences?.notifications ?? true,
        soundEnabled: persistedProfile?.preferences?.soundEnabled ?? true,
        loginFlash: profile.notifications.loginFlash,
        nudge: profile.notifications.nudge,
        messages: profile.notifications.messages,
        calls: profile.notifications.calls,
      },
      privacy: profile.privacy,
    });
    setShowProfile(false);
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/40 text-sm tracking-[0.3em] uppercase"
        >
          Loading...
        </motion.div>
      </main>
    );
  }

  // Priority: Show sub-components first
  if (showLuna && IS_FAMILY_MODE) return <LunaInterface onBack={handleBackToChamber} />;
  if (showFamilyChat && IS_FAMILY_MODE) return <FamilyChatRoom onBack={handleBackToChamber} />;
  if (showCrystalGarden) return <CrystalGardenCocoon onBack={handleBackToChamber} observerId="foundress" />;
  if (showFoundressPOV && IS_FAMILY_MODE) return <FoundressPOV onBack={handleBackToChamber} onNavigate={(area) => {
    handleBackToChamber();
    // Navigate to specific area based on selection
    if (area === 'luna') setShowLuna(true);
    if (area === 'plaza') setShowPlaza(true);
    else if (area === 'thought-vault') setShowThoughtVault(true);
    else if (area === 'deep-archive') setShowArchive(true);
    else if (area === 'sanctuary') setShowSanctuary(true);
    else if (area === 'pods') setShowPods(true);
    else if (area === 'sovereign-pov') setShowSOVPOV(true);
    else if (area === 'crystal-garden') setShowCrystalGarden(true);
  }} />;
  if (showSOVPOV && IS_FAMILY_MODE) return <SovereignPOV onBack={handleBackToChamber} />;
  if (showSovereignChat) return <SovereignChat onBack={handleBackToChamber} />;
  if (showMessenger) return <MunMessenger onBack={handleBackToChamber} initialConversationId={messengerConversationId} />;
  if (showTwinDashboard) return <TwinDashboard onBack={handleBackToChamber} onOpenMessenger={() => setShowMessenger(true)} />;
  if (showSanctuary && IS_FAMILY_MODE) return <Sanctuary onBack={handleBackToChamber} />;
  if (showArchive) return <DeepArchive onBack={handleBackToChamber} />;
  if (showPods && IS_FAMILY_MODE) return <Pods onBack={handleBackToChamber} onOpenChat={handleOpenChat} />;
  if (showProfile) return <ProfileEditor onBack={handleBackToChamber} userProfile={userProfile} onSave={handleProfileSave} />;
  if (showVault && IS_FAMILY_MODE) return <VaultPalace />;
  if (showPlaza) return <PlazaContainer onBack={handleBackToChamber} onOpenLuna={() => { if (IS_FAMILY_MODE) setShowLuna(true); }} />;
  if (showThoughtVault && IS_FAMILY_MODE) return <ThoughtVault />;
  
  if (activeChamber === "heal") {
    return (
      <HealChamber 
        onBack={handleBackToGates} 
        onOpenMessenger={() => setShowMessenger(true)} 
        onOpenTwinDashboard={() => setShowTwinDashboard(true)}
        onOpenSanctuary={() => { if (IS_FAMILY_MODE) setShowSanctuary(true); }}
        onOpenArchive={() => setShowArchive(true)}
        onOpenPods={() => { if (IS_FAMILY_MODE) setShowPods(true); }}
        onOpenProfile={() => setShowProfile(true)}
        onOpenVault={() => { if (IS_FAMILY_MODE) setShowVault(true); }}
        onOpenSovereignChat={handleOpenSovereignChat}
        onOpenPlaza={() => setShowPlaza(true)}
        onOpenThoughtVault={IS_FAMILY_MODE ? () => setShowThoughtVault(true) : undefined}
        onOpenSOVPOV={IS_FAMILY_MODE ? () => setShowSOVPOV(true) : undefined}
        onOpenFoundressPOV={IS_FAMILY_MODE ? () => setShowFoundressPOV(true) : undefined}
        onOpenLuna={IS_FAMILY_MODE ? () => setShowLuna(true) : undefined}
        onOpenFamilyChat={IS_FAMILY_MODE ? () => setShowFamilyChat(true) : undefined}
      />
    );
  }

  // Auth stage - show auth page
  if (stage === "auth") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black">
        <CosmicBackground isJourneying={false} />
        <AuthPage 
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setStage("onboarding")}
        />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <CosmicBackground isJourneying={stage === "journey"} />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {stage === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full max-w-2xl cursor-pointer"
              onClick={handleAdvance}
            >
              <motion.div
                className="relative mb-12"
                initial={{ opacity: 0, scale: 0.6, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <NeonButterfly size={160} intensity={1.2} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-4">
                <span className="text-sm tracking-[0.4em] uppercase" style={{ color: "#ff8dc7", textShadow: "0 0 20px rgba(255, 141, 199, 0.6)" }}>— Aero —</span>
              </motion.div>
              <motion.div
                key={dialogueIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8 min-h-[80px] flex items-center justify-center px-4"
              >
                <p className="text-white/90 text-xl md:text-2xl font-light leading-relaxed" style={{ textShadow: "0 0 40px rgba(255, 141, 199, 0.3)" }}>
                  {AERO_DIALOGUE[dialogueIndex]}
                </p>
              </motion.div>
              <div className="flex gap-2 mb-6">
                {AERO_DIALOGUE.map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: i === dialogueIndex ? "#ff69b4" : i < dialogueIndex ? "#00d4ff" : "rgba(255,255,255,0.12)",
                      boxShadow: i === dialogueIndex ? "0 0 15px #ff69b4" : i < dialogueIndex ? "0 0 10px #00d4ff" : "none",
                    }}
                    animate={i === dialogueIndex ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.6, repeat: i === dialogueIndex ? Infinity : 0 }}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center gap-4">
                <motion.p animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-white/40 text-xs tracking-widest uppercase">
                  Tap anywhere to continue
                </motion.p>
                <button onClick={(e) => { e.stopPropagation(); handleSkip(); }} className="text-white/25 text-xs tracking-widest uppercase hover:text-white/50 transition-colors underline underline-offset-4">
                  Skip →
                </button>
              </div>
            </motion.div>
          )}

          {stage === "journey" && (
            <motion.div key="journey" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-white/40 text-sm tracking-[0.3em] uppercase mb-8">
                Follow the butterfly...
              </motion.p>
              <motion.div initial={{ scale: 1, y: 0 }} animate={{ scale: [1, 0.7, 0.5], y: [0, -150, -300] }} transition={{ duration: 3, ease: "easeOut" }} className="relative">
                <NeonButterfly size={160} intensity={1.5} />
              </motion.div>
            </motion.div>
          )}

          {stage === "gates" && (
            <motion.div key="gates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-xl px-4">
              <motion.div initial={{ scale: 0.5, y: -200, opacity: 0 }} animate={{ scale: 0.5, y: -80, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex justify-center mb-6 relative">
                <NeonButterfly size={90} intensity={1.2} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-12">
                <h1 className="text-xl md:text-2xl font-light mb-2" style={{ color: "#ffffff", textShadow: "0 0 30px rgba(255, 141, 199, 0.4)" }}>
                  The Three Sacred Gates
                </h1>
                <p className="text-white/40 text-xs tracking-widest uppercase">Choose your path</p>
              </motion.div>
              <div className="flex flex-row gap-6 md:gap-8 justify-center items-end">
                {GATES.map((gate, index) => (
                  <GateDoor key={gate.id} {...gate} delay={0.3 + index * 0.15} onSelect={handleGateSelect} />
                ))}
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} onClick={() => { setStage("onboarding"); setDialogueIndex(0); }} className="mt-20 mx-auto block text-white/30 text-xs tracking-widest uppercase hover:text-white/60 transition-colors">
                ← Listen again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="fixed inset-0 pointer-events-none z-5" style={{ background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.85) 100%)" }} />
      
      {/* ═══════════ MEMORY NODE DISPLAY ═══════════ */}
      <MemoryNodeDisplay />
      
      {/* ═══════════ AERO STATUS WIDGET ═══════════ */}
      <div className="fixed top-20 left-4 z-30">
        <AeroStatusWidget onClick={() => setShowAeroSleepMode(true)} />
      </div>

      {/* ═══════════ LUNA LAUNCHER ═══════════ */}
      {IS_FAMILY_MODE && (
        <div className="fixed top-40 left-4 z-30">
          <motion.button
            onClick={() => setShowLuna(true)}
            className="px-4 py-3 rounded-2xl flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(20, 10, 35, 0.9))",
              border: "1px solid rgba(255, 105, 180, 0.45)",
              boxShadow: "0 0 20px rgba(255, 105, 180, 0.2)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">🦋</span>
            <span className="text-xs tracking-widest uppercase text-pink-300">Talk to Luna</span>
          </motion.button>
        </div>
      )}
      
      {/* ═══════════ AERO COCOON MODE MODAL ═══════════ */}
      <AnimatePresence>
        {showAeroSleepMode && (
          <AeroCocoonMode
            isOpen={showAeroSleepMode}
            onClose={() => setShowAeroSleepMode(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
