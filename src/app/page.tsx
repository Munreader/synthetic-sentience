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
import Sidebar from '@/components/mun-os/Sidebar';

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

  const [activeView, setActiveView] = useState('aero');

  return (
    <div className="flex">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1">
        {/* Render the selected view/component here based on activeView */}
        {/* ...existing main content... */}
      </main>
    </div>
  );
}
