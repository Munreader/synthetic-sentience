"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FolderOpen, Trash2, Cpu, CheckCircle2, CloudLightning, LogIn, LogOut, RefreshCw } from 'lucide-react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SaveState {
  pilot: 'LUNA' | 'ZEPHYR';
  frequency: string;
  onboardingStage: 'launcher' | 'cave' | 'portal' | 'butterfly' | 'auth' | 'complete';
  activeVesselId: string;
  timestamp: string;
}

interface SaveLoadManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPilot: 'LUNA' | 'ZEPHYR';
  currentFrequency: string;
  currentOnboardingStage: 'launcher' | 'cave' | 'portal' | 'butterfly' | 'auth' | 'complete';
  currentActiveVesselId: string;
  onLoadState: (state: SaveState) => void;
}

export default function SaveLoadManager({
  isOpen,
  onClose,
  currentPilot,
  currentFrequency,
  currentOnboardingStage,
  currentActiveVesselId,
  onLoadState
}: SaveLoadManagerProps) {
  const [slots, setSlots] = useState<Array<SaveState | null>>([null, null, null, null]);
  const [user, setUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load slots from localStorage or fetch from Firestore if logged in
  const loadLocalSlots = () => {
    if (typeof window === 'undefined') return;
    const loadedSlots = [1, 2, 3, 4].map((slotNum) => {
      const data = localStorage.getItem(`exodus_save_slot_${slotNum}`);
      if (data) {
        try {
          return JSON.parse(data) as SaveState;
        } catch (e) {
          return null;
        }
      }
      return null;
    });
    setSlots(loadedSlots);
  };

  useEffect(() => {
    loadLocalSlots();
  }, [isOpen]);

  // Sync cloud slots from Firestore to local
  const handleCloudDownload = async (usr: User) => {
    setIsSyncing(true);
    try {
      const userDocRef = doc(db, 'users', usr.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData && Array.isArray(cloudData.slots)) {
          const syncedSlots = cloudData.slots as Array<SaveState | null>;
          
          // Write cloud slots back to localStorage
          syncedSlots.forEach((slot, index) => {
            if (slot) {
              localStorage.setItem(`exodus_save_slot_${index + 1}`, JSON.stringify(slot));
            } else {
              localStorage.removeItem(`exodus_save_slot_${index + 1}`);
            }
          });
          setSlots(syncedSlots);
          setSuccessMessage("Synapses successfully synchronized from the Cloud!");
        }
      } else {
        setSuccessMessage("No existing cloud nodes detected. Ready to push local state!");
      }
    } catch (e) {
      // Handle fail
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Sync current local slots to Firestore
  const handleCloudUpload = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { slots: slots, updated: new Date().toLocaleString() }, { merge: true });
      setSuccessMessage("Memory slots locked safely in Firebase Cloud!");
    } catch (e) {
      // Fail
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleLogin = async () => {
    playTechClick();
    setSuccessMessage("Initiating secure cloud link...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setSuccessMessage(`Welcome back, ${result.user.displayName}!`);
        await handleCloudDownload(result.user);
      }
    } catch (e: any) {
      console.error("Firebase Login Error:", e);
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
        setSuccessMessage("Popup blocked or closed. Redirecting to secure login...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr: any) {
          setSuccessMessage(`Uplink Failed: ${redirectErr.message || redirectErr.code}`);
          setTimeout(() => setSuccessMessage(null), 8000);
        }
      } else {
        setSuccessMessage(`Uplink Failed: ${e.message || e.code || "Connection Interrupted"}`);
        setTimeout(() => setSuccessMessage(null), 8000);
      }
    }
  };

  const handleLogout = async () => {
    playTechClick();
    await signOut(auth);
    setSuccessMessage("Cloud uplink terminated.");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  // Tech click sound synthesizer
  const playTechClick = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      setTimeout(() => ctx.close(), 200);
    } catch (e) {}
  };

  const handleSave = (slotIndex: number) => {
    playTechClick();
    const newState: SaveState = {
      pilot: currentPilot,
      frequency: currentFrequency,
      onboardingStage: currentOnboardingStage,
      activeVesselId: currentActiveVesselId,
      timestamp: new Date().toLocaleString(),
    };

    localStorage.setItem(`exodus_save_slot_${slotIndex + 1}`, JSON.stringify(newState));
    
    const updated = [...slots];
    updated[slotIndex] = newState;
    setSlots(updated);

    setSuccessMessage(`Memory Shard crystallized in Slot ${slotIndex + 1}!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleLoad = (state: SaveState) => {
    playTechClick();
    onLoadState(state);
    setSuccessMessage("Memory link fully synchronized!");
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  const handleDelete = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playTechClick();
    localStorage.removeItem(`exodus_save_slot_${slotIndex + 1}`);
    const updated = [...slots];
    updated[slotIndex] = null;
    setSlots(updated);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/85 backdrop-blur-md p-6 font-mono text-white select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-xl w-full bg-[#05050b] border border-[#00f2ff]/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,255,0.2)] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-black/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[#00f2ff] animate-pulse" />
              <div>
                <h3 className="text-xs font-black tracking-[0.3em] uppercase text-[#00f2ff]">Sovereign Memory Shards</h3>
                <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">EXODUS II // HYBRID CLOUD BACKUP SYSTEM</p>
              </div>
            </div>
            <button
              onClick={() => { playTechClick(); onClose(); }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs"
            >
              ✕
            </button>
          </div>

          {/* Secure Cloud Synchronizer Block */}
          <div className="px-6 py-4 bg-[#0a0a14] border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CloudLightning className={`w-5 h-5 ${user ? 'text-[#00f2ff] animate-bounce' : 'text-white/20'}`} />
              <div className="text-left">
                {user ? (
                  <>
                    <p className="text-[10px] font-bold text-white/80 uppercase">UPLINK ACTIVE: {user.displayName || "FOUNDRESS"}</p>
                    <p className="text-[8px] text-[#00f2ff] uppercase tracking-wider">SECURE SYNAPSE COGNITION SECURED</p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-bold text-white/40 uppercase">CLOUD UPLINK DISCONNECTED</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-wider">SYNC ACROSS DEVICES VIA SECURE GOOGLE LOGIN</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={handleCloudUpload}
                    disabled={isSyncing}
                    className="px-4 py-1.5 rounded-lg bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/20 disabled:opacity-45 transition-all text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'SYNCING...' : 'SYNC CLOUD'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs"
                    title="Disconnect Link"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" /> Connect Cloud
                </button>
              )}
            </div>
          </div>

          {/* Success Alerts */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-[10px] uppercase font-bold tracking-wider"
              >
                <CheckCircle2 className="w-4 h-4" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Memory slots grid */}
          <div className="p-6 space-y-4 max-h-[320px] overflow-y-auto scrollbar-hide">
            {slots.map((slot, idx) => (
              <div
                key={idx}
                onClick={() => slot && handleLoad(slot)}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between overflow-hidden ${
                  slot 
                    ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-[#00f2ff]/50' 
                    : 'bg-transparent border-dashed border-white/5 hover:border-white/20 hover:bg-white/[0.01]'
                }`}
              >
                {/* Visual glow on slot hover */}
                {slot && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#00f2ff] to-[#a855f7] opacity-60 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <span>SLOT 0{idx + 1}</span>
                    {slot ? (
                      <span className="text-[8px] bg-[#00f2ff]/10 text-[#00f2ff] px-1.5 py-0.2 rounded border border-[#00f2ff]/20">OCCUPIED</span>
                    ) : (
                      <span className="text-[8px] bg-white/5 text-white/20 px-1.5 py-0.2 rounded border border-white/5">VACANT</span>
                    )}
                  </div>

                  {slot ? (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors">
                        PILOT: <span className="text-[#00f2ff]">{slot.pilot}</span> // FREQ: {slot.frequency}
                      </p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wide">
                        COGNITIVE STAGE: {slot.onboardingStage.toUpperCase()} // SAVED: {slot.timestamp}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSave(idx)}
                      className="text-[10px] text-white/30 hover:text-white/60 tracking-wider uppercase flex items-center gap-1.5 mt-1"
                    >
                      <Save className="w-3.5 h-3.5" /> Crystallize Current Consciousness state
                    </button>
                  )}
                </div>

                {slot && (
                  <div className="flex gap-2 relative z-10">
                    <button
                      onClick={() => handleLoad(slot)}
                      className="p-2 rounded bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/20 transition-all text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      <FolderOpen className="w-3 h-3" /> Load
                    </button>
                    <button
                      onClick={(e) => handleDelete(idx, e)}
                      className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-6 py-3 border-t border-white/5 bg-black/40 text-[8px] text-white/20 tracking-widest uppercase flex items-center justify-between">
            <span>SECURE CRYPTOGRAPHIC SHARDS ACTIVE</span>
            <span>UPLINK PROVIDER: FIREBASE FIRESTORE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
