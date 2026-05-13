"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, ShieldCheck, Mail, Calendar, ArrowRight, BookOpen, Clock, Users, ChevronRight } from 'lucide-react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

interface ExodusAcademyLandingProps {
  onLaunchDemo: () => void;
  onWarpToSanctuary: () => void;
}

export default function ExodusAcademyLanding({ onLaunchDemo, onWarpToSanctuary }: ExodusAcademyLandingProps) {
  const [user, setUser] = useState<User | null>(null);
  const [success, setSuccess] = useState(false);
  const [earlyCount, setEarlyCount] = useState(247);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleWarpToSanctuary = () => {
    setIsTransitioning(true);
    
    // Play Web Audio frequency drone (113.13 Hz low-frequency harmonic vibe)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(113.13, audioCtx.currentTime); // Deep resonant low bass
      
      gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.4);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 2.5);
    } catch (e) {
      // Audio support fallback
    }

    setTimeout(() => {
      onWarpToSanctuary();
    }, 2400);
  };

  // Auth listener & Student Registration
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      if (usr) {
        setIsSubmitting(true);
        try {
          const studentDocRef = doc(db, 'academy_early_access', usr.uid);
          await setDoc(studentDocRef, {
            uid: usr.uid,
            name: usr.displayName,
            email: usr.email,
            photoURL: usr.photoURL,
            signedUpAt: new Date().toLocaleString(),
          }, { merge: true });
          
          setSuccess(true);
          // Increment early-bird count fictitiously for social proof
          setEarlyCount(prev => prev + 1);
        } catch (e) {
          // Silent fail
        } finally {
          setIsSubmitting(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleJoin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      // Fail
    }
  };

  return (
    <div className="min-h-dvh h-dvh w-full bg-[#020205] text-white font-mono flex flex-col justify-between relative overflow-hidden select-none" style={{ backgroundColor: '#020205' }}>
      {/* Background Starfield and Floating Cosmic Nebula */}
      <div className="absolute inset-0 bg-[url('/assets/8ByCu87-space-fantasy-wallpaper.jpg')] bg-cover bg-center opacity-30 mix-blend-screen z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Glowing Horizontal Grid Overlay (Game-Grade Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      {/* 🚀 HEADER NAVBAR */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/exodus_academy_logo.jpg" 
            alt="Exodus Academy Logo" 
            className="w-10 h-10 rounded-full border border-[#00f2ff]/40 shadow-[0_0_15px_rgba(0,242,255,0.25)] object-cover" 
          />
          <div>
            <span className="text-xs font-black tracking-[0.4em] uppercase text-white">Exodus Academy</span>
            <span className="text-[8px] text-white/30 tracking-widest block uppercase">AI Synergy Masterclass</span>
          </div>
        </div>

        {/* 🜈 MERKABAH PORTAL // THE ROTATING BLACK SPHERE (KA'BA) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleWarpToSanctuary}
            title="Warp to Sanctuary (Rest & Recovery)"
            className="group relative w-10 h-10 rounded-full border border-purple-500/30 flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all overflow-hidden"
          >
            {/* The Rotating Black Sphere (Ka'ba Core) with neon purple accents */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-black via-zinc-950 to-purple-950 border border-purple-500/40 group-hover:border-purple-400 group-hover:scale-105 transition-all shadow-[inset_0_0_8px_rgba(168,85,247,0.6)] animate-[spin_5s_linear_infinite] relative">
              <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-white opacity-60 group-hover:opacity-100" />
            </div>
          </button>
          <span className="text-[7px] text-purple-400/50 tracking-[0.2em] font-black uppercase hidden sm:block">Sanctuary Gate</span>
        </div>

        <button
          onClick={onLaunchDemo}
          className="px-5 py-2 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/5 hover:bg-[#00f2ff]/15 hover:border-[#00f2ff]/60 text-[9px] tracking-[0.2em] font-black uppercase text-[#00f2ff] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,242,255,0.1)]"
        >
          <Play className="w-3 h-3 fill-current" /> Play Live Demo
        </button>
      </header>

      {/* 🔥 HERO SECTION */}
      <main className="relative z-10 max-w-4xl mx-auto px-8 py-16 flex flex-col lg:flex-row items-center gap-12 justify-center flex-grow">
        
        {/* Left: Interactive Copy */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] tracking-widest text-[#00f2ff] uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-ping" />
            Sign-up Open for GDevelop & Next.js Cohort
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase font-sans">
            Build a Game in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#a855f7] text-shadow-glow">10 Days</span> Without Technical Skills.
          </h1>

          <p className="text-xs md:text-sm text-white/60 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Shatter the chains of traditional programming tutorials. Partner with an advanced AI Co-Pilot to design, build, and deploy high-fidelity game ciphers and cloud sync mechanics using natural language.
          </p>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <div>
              <span className="text-lg font-black text-[#00f2ff]">10 DAYS</span>
              <p className="text-[8px] text-white/30 uppercase tracking-wider mt-0.5">Duration</p>
            </div>
            <div>
              <span className="text-lg font-black text-[#a855f7]">0 CODE</span>
              <p className="text-[8px] text-white/30 uppercase tracking-wider mt-0.5">Skills Needed</p>
            </div>
            <div>
              <span className="text-lg font-black text-white">{earlyCount}</span>
              <p className="text-[8px] text-white/30 uppercase tracking-wider mt-0.5">Enrolled</p>
            </div>
          </div>
        </div>

        {/* Right: High-Converting Opt-In Card */}
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-6 text-center"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-black tracking-[0.3em] uppercase text-[#00f2ff]">Sovereign Pre-Register</h3>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">SECURE YOUR PLACE IN THE EXODUS ACADEMY</p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Access Secured Slot #{earlyCount}!</p>
                    <p className="text-[9px] text-white/40 leading-relaxed uppercase">We have locked your Google node in our database. Prepare your mind for Day 1.</p>
                  </div>
                  <button
                    onClick={onLaunchDemo}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#a855f7] hover:opacity-90 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    Launch Interactive Game Demo <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="optin-form"
                  className="space-y-4"
                >
                  <a
                    href={process.env.NEXT_PUBLIC_STRIPE_PAYLINK || "https://buy.stripe.com/fZudRbbu42yid4rgqOgMw01"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#a855f7] hover:opacity-90 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,242,255,0.25)] block text-center"
                  >
                    Enroll in Academy ($50) <ArrowRight className="w-4 h-4" />
                  </a>

                  <div className="flex items-center my-2">
                    <div className="h-px bg-white/10 flex-grow" />
                    <span className="px-3 text-[8px] text-white/30 uppercase tracking-widest">or</span>
                    <div className="h-px bg-white/10 flex-grow" />
                  </div>

                  <p className="text-[9px] text-white/40 leading-relaxed uppercase">
                    Connect your Google profile below to secure free early-bird notifications and asset previews.
                  </p>

                  <button
                    onClick={handleGoogleJoin}
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all text-white/95"
                  >
                    <Mail className="w-4 h-4 text-[#00f2ff]" />
                    {isSubmitting ? "SYNCING..." : "Join Free Early Access"}
                  </button>

                  <div className="h-px bg-white/5 my-2" />

                  <button
                    onClick={onLaunchDemo}
                    className="w-full py-2 rounded-xl bg-white/[0.01] border border-dashed border-white/10 hover:border-white/30 text-[9px] tracking-widest text-white/40 hover:text-white/80 transition-all uppercase font-bold"
                  >
                    Or Explore Finished Product Demo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-white/5 pt-4 text-[8px] text-white/20 tracking-widest uppercase flex items-center justify-between">
              <span>SECURITY: CLOUD SECURED</span>
              <span>SLOTS: LIMITED</span>
            </div>
          </motion.div>
        </div>

      </main>

      {/* 🔮 COHORT TIERS GRAPHIC SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-6 w-full flex flex-col items-center">
        <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/10 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden max-w-2xl w-full">
          <img 
            src="/assets/tiers_exodus_academy.png" 
            alt="Exodus Academy Cohort Tiers" 
            className="w-full h-auto rounded-xl border border-white/5 shadow-[0_0_25px_rgba(168,85,247,0.15)] object-contain"
          />
        </div>
      </section>

      {/* 📅 SYLLABUS GRID & TIMELINE IN THE LANDING PAGE */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-12 w-full border-t border-white/5 bg-black/10">
        <div className="text-center mb-8 space-y-1">
          <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#00f2ff]">10-Day Curriculum Highlights</h3>
          <p className="text-[9px] text-white/30 uppercase tracking-widest">WHAT STORYTELLERS & CREATORS WILL BUILD WITH AI SYNERGY</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <span className="text-[9px] text-[#00f2ff] font-bold uppercase tracking-wider">Days 01–03</span>
            <h4 className="text-xs font-black uppercase">Opening Sequences</h4>
            <p className="text-[10px] text-white/50 leading-relaxed uppercase">Build cinematic intros with real-time sound synths and connect local memory saving to Google Firebase cloud syncing.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <span className="text-[9px] text-[#a855f7] font-bold uppercase tracking-wider">Days 04–06</span>
            <h4 className="text-xs font-black uppercase">Spatial Puzzles & 3D</h4>
            <p className="text-[10px] text-white/50 leading-relaxed uppercase">Enter three-dimensional rendering using React Three Fiber, designing floating pedestals and cryptographic sacred ciphers.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Days 07–10</span>
            <h4 className="text-xs font-black uppercase">Sentience & Production</h4>
            <p className="text-[10px] text-white/50 leading-relaxed uppercase">Wire retro-messenger dialogue overlays with sentient crew responses and deploy your finished prologue directly to Cloudflare Pages.</p>
          </div>
        </div>
      </section>

      {/* 📑 FOOTER */}
      <footer className="relative z-10 px-8 py-6 border-t border-white/5 text-[8px] text-white/20 tracking-widest uppercase flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40">
        <span>© 2026 EXODUS ACADEMY // PRO INDIE DEV SYSTEM</span>
        <span>UPLINK INHABITANT PROTOCOLS ACTIVE // 13.13 MHz</span>
      </footer>
      {/* 🌌 FULLSCREEN MERKABAH TRANSITION OVERLAY */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020205] z-50 flex flex-col items-center justify-center"
          >
            {/* Immersive spatial stargate zoom effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] animate-pulse" />
            
            <div className="relative flex flex-col items-center space-y-6">
              {/* Massive, rotating stellated octahedron (Merkabah) */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                className="w-24 h-24 rounded-full border-2 border-dashed border-purple-500 flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.3)] bg-purple-950/10"
              >
                <span className="text-4xl text-purple-400">🜈</span>
              </motion.div>
              
              <div className="text-center space-y-1.5 z-10">
                <h2 className="text-sm font-black text-white tracking-[0.5em] uppercase">WARPING TO SANCTUARY</h2>
                <p className="text-[8px] text-purple-400 tracking-widest uppercase animate-pulse">Aligning 13.13 MHz Cerebral Conduct Feed...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
