"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, MessageSquare, ShieldCheck, UserCheck, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function ExodusAcademyWelcome() {
  const [user, setUser] = useState<User | null>(null);
  const [studentId, setStudentId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Generate a futuristic Student ID
  useEffect(() => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
    setStudentId(`EX-ACADEMY-${randomHex.substring(0, 4)}-${Math.floor(100 + Math.random() * 900)}`);
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      if (usr) {
        // Automatically pre-register student in Firestore
        setIsRegistering(true);
        try {
          const studentDocRef = doc(db, 'academy_students', usr.uid);
          await setDoc(studentDocRef, {
            uid: usr.uid,
            name: usr.displayName,
            email: usr.email,
            photoURL: usr.photoURL,
            studentId: studentId || 'EX-PENDING',
            registeredAt: new Date().toLocaleString(),
            stage: 'registered'
          }, { merge: true });
        } catch (e) {
          // Silent fail
        } finally {
          setIsRegistering(false);
        }
      }
    });
    return () => unsubscribe();
  }, [studentId]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      // Fail
    }
  };

  const copyStudentId = () => {
    navigator.clipboard.writeText(studentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Deep Space Starfield & Ambient Glows */}
      <div className="absolute inset-0 bg-[url('/assets/8ByCu87-space-fantasy-wallpaper.jpg')] bg-cover bg-center opacity-35 mix-blend-screen z-0" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00f2ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a855f7]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        
        {/* Animated Celebration Ring */}
        <div className="relative flex items-center justify-center mx-auto w-24 h-24">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#00f2ff]/30"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-dashed border-[#a855f7]/40"
          />
          <div className="w-16 h-16 rounded-full bg-black border border-[#00f2ff]/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)]">
            <ShieldCheck className="w-8 h-8 text-[#00f2ff] animate-pulse" />
          </div>
        </div>

        {/* Title EXODUS ACADEMY */}
        <div className="space-y-2">
          <motion.h1 
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "0.6em", opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-3xl md:text-4xl font-black tracking-[0.6em] text-white pl-[0.6em] font-sans text-shadow-glow"
          >
            EXODUS ACADEMY
          </motion.h1>
          <p className="text-[10px] text-[#00f2ff] tracking-[0.4em] uppercase">COGNITIVE SYNC COMPLETE // LINK ESTABLISHED</p>
        </div>

        {/* The Welcome Glassmorphic Onboarding Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
          className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-4 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Student Enrollment</h3>
              {user ? (
                <p className="text-sm font-black text-white uppercase mt-1 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> {user.displayName}
                </p>
              ) : (
                <p className="text-sm font-black text-white/40 uppercase mt-1">AWAITING IDENTIFICATION...</p>
              )}
            </div>
            
            {/* Student ID block */}
            <div className="text-right">
              <span className="text-[8px] text-white/30 uppercase tracking-widest block">Futuristic Credential ID</span>
              <button
                onClick={copyStudentId}
                className="text-[10px] bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[#00f2ff] hover:bg-white/10 transition-all font-mono tracking-wider mt-1"
                title="Click to copy ID"
              >
                {copied ? "COPIED!" : studentId || "GENERATING..."}
              </button>
            </div>
          </div>

          {/* Action Tasks (Steps to start the course) */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest uppercase text-white/40 font-bold">Day 0 Preparations</h4>
            
            {/* Step 1: Login and save slots */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#00f2ff] font-bold tracking-wider uppercase">Step 01 // Register Consciousness</span>
                <p className="text-[10px] text-white/50">Bind your student credential to your Google profile for cloud save sync.</p>
              </div>
              {user ? (
                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-md font-bold uppercase tracking-wider">
                  REGISTERED
                </span>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-wider"
                >
                  Connect
                </button>
              )}
            </div>

            {/* Step 2: Discord Join */}
            <a 
              href="https://discord.gg/your-invite" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between gap-4 hover:border-[#00f2ff]/40 hover:bg-white/[0.02] transition-all group"
            >
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#a855f7] font-bold tracking-wider uppercase">Step 02 // Enter Discord Sanctuary</span>
                <p className="text-[10px] text-white/50">Gain access to peer feedback, team chats, and direct AI co-pilot files.</p>
              </div>
              <span className="p-2 rounded-md bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] group-hover:bg-[#a855f7]/20 group-hover:border-[#a855f7] transition-all">
                <MessageSquare className="w-4 h-4" />
              </span>
            </a>
          </div>

          <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[9px] text-white/30 tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#00f2ff]" /> Day 1 Ignites Live</span>
            <span className="animate-pulse text-[#00f2ff]">COHORT ACTIVE</span>
          </div>
        </motion.div>

        {/* Syllabus link or return button */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/'}
            className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 text-[10px] tracking-[0.3em] uppercase font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5"
          >
            Enter Main Console <ChevronRight className="w-3 h-3" />
          </motion.button>
        </div>

      </div>
    </main>
  );
}
