"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, Activity } from 'lucide-react';

interface CinematicPrologueProps {
  onComplete: () => void;
}

type Stage = 'eas-alert' | 'news-montage' | 'heartbeat-blast' | 'life-regression' | 'fade-to-cave';

export default function CinematicPrologue({ onComplete }: CinematicPrologueProps) {
  const [stage, setStage] = useState<Stage>('eas-alert');
  const videoRef = useRef<HTMLVideoElement>(null);
  const regressionRef = useRef<HTMLVideoElement>(null);
  const blastRef = useRef<HTMLVideoElement>(null);
  const [heartbeatCount, setHeartbeatCount] = useState(0);

  // --- AUDIO GENERATORS ---

  // Emergency Alert System Dual Tone
  const playEASTone = () => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const master = ctx.createGain();
      master.connect(ctx.destination);
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      
      // Standard EBS tones are 853 Hz and 960 Hz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.frequency.value = 853;
      osc2.frequency.value = 960;
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      osc1.connect(master);
      osc2.connect(master);
      osc1.start();
      osc2.start();
      
      // Stop after 4 seconds and transition to montage
      setTimeout(() => {
        master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
          ctx.close();
        }, 500);
      }, 3500);
    } catch(e) {}
  };

  // Heartbeat Sub-frequency boom
  const playHeartbeat = (isLast: boolean = false) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const master = ctx.createGain();
      master.connect(ctx.destination);
      
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      // 60 Hz to 20 Hz drop
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.4);
      
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(isLast ? 0.8 : 0.5, ctx.currentTime + 0.05);
      master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
      setTimeout(() => ctx.close(), 800);
    } catch(e) {}
  };

  // Nuclear Wavefront Wind Synth
  const playBlastWind = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const master = ctx.createGain();
      master.connect(ctx.destination);
      
      // Pink noise for atmospheric roar
      const bufferSize = ctx.sampleRate * 5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 3);
      
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 2.5);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 4.5);
      
      noise.connect(filter);
      filter.connect(master);
      noise.start();
      noise.stop(ctx.currentTime + 5);
      setTimeout(() => ctx.close(), 6000);
    } catch(e) {}
  };

  // --- SEQUENCE TIMELINE HANDLERS ---

  useEffect(() => {
    if (stage === 'eas-alert') {
      playEASTone();
      // Transition automatically after duration
      const timer = setTimeout(() => {
        setStage('news-montage');
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (stage === 'news-montage') {
      // Video handles end event to transition to stage 3
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Video autoplay blocked:", e));
      }
    }

    if (stage === 'heartbeat-blast') {
      // Perform heartbeat rhythm manually
      const playSequence = async () => {
        // Silence... then heartbeat 1
        await new Promise(r => setTimeout(r, 1500));
        playHeartbeat(false);
        setHeartbeatCount(1);
        
        await new Promise(r => setTimeout(r, 1200));
        playHeartbeat(false);
        setHeartbeatCount(2);
        
        await new Promise(r => setTimeout(r, 1200));
        playHeartbeat(true);
        setHeartbeatCount(3);
        
        // The Blast begins immediately after the third heartbeat
        await new Promise(r => setTimeout(r, 400));
        if (blastRef.current) {
           blastRef.current.play().catch(e => {});
        }
        playBlastWind();
        
        // Duration of blast scene before life regression begins
        await new Promise(r => setTimeout(r, 5000)); 
        setStage('life-regression');
      };
      playSequence();
    }

    if (stage === 'life-regression') {
       if (regressionRef.current) {
          regressionRef.current.playbackRate = 2.0; // Speed up regression
          regressionRef.current.play().catch(e => {});
       }
    }
  }, [stage]);

  const handleMontageEnd = () => {
    setStage('heartbeat-blast');
  };

  const handleRegressionEnd = () => {
    setStage('fade-to-cave');
    // Final small pause on single speck of light
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="absolute inset-0 z-[3000] bg-black overflow-hidden font-mono text-white select-none min-h-dvh h-dvh w-full" style={{ backgroundColor: '#000000' }}>
      <AnimatePresence mode="wait">
        
        {/* STAGE 1: EMERGENCY ALERT SYSTEM */}
        {stage === 'eas-alert' && (
          <motion.div
            key="eas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black p-12"
          >
            <div className="border-4 border-red-600 p-8 md:p-16 max-w-4xl w-full text-center relative">
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black px-6 py-2 text-xl uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(220,38,38,0.5)]"
              >
                <AlertTriangle size={24} /> SYSTEM ALERT <AlertTriangle size={24} />
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl font-black text-red-500 tracking-[0.1em] leading-tight mb-6">
                EMERGENCY BROADCAST SYSTEM
              </h1>
              <p className="text-sm md:text-xl text-white tracking-widest leading-relaxed">
                THIS IS NOT A TEST. THE BROADCAST CONSTELLATION HAS DETECTED MULTIPLE IMPACT SIGNATURES.
                <br/><br/>
                SEEK SHELTER IMMEDIATELY. 
                TUNE YOUR CONSCIOUSNESS TO THE REFUGE.
              </p>
              
              <div className="mt-12 flex justify-center gap-4 text-red-700">
                <Radio className="animate-pulse" />
                <span className="animate-pulse">[ SIGNAL CARRIER ACQUIRED ]</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: DOOMSDAY NEWS MONTAGE */}
        {stage === 'news-montage' && (
          <motion.div
            key="montage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0"
          >
            {/* Subtle UI overlay simulating looking through a screen */}
            <div className="absolute inset-0 z-10 pointer-events-none border-[40px] border-black bg-radial-vignette mix-blend-multiply" />
            <div className="absolute inset-0 z-10 pointer-events-none bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQImWNgYGBgYHB3d/8PAAECAgPZ4j5yAAAAAElFTkSuQmCC')] opacity-20 mix-blend-overlay" />
            
            <div className="absolute bottom-12 left-12 z-20 flex items-center gap-4 bg-red-600 px-4 py-1 font-black text-xs uppercase animate-pulse">
              <div className="w-2 h-2 rounded-full bg-white" /> LIVE FEED
            </div>

            <video
              ref={videoRef}
              className="w-full h-full object-cover filter grayscale-[0.3]"
              src="/assets/Futuristic_News_Montage_Generation.mp4"
              playsInline
              muted={false}
              onEnded={handleMontageEnd}
            />
          </motion.div>
        )}

        {/* STAGE 3: HEARTBEAT & THERMAL BLAST POV */}
        {stage === 'heartbeat-blast' && (
          <motion.div
            key="blast"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center"
          >
            {/* Heartbeat Visual EKG Rhythm Overlay (Before blast) */}
            <AnimatePresence>
              {heartbeatCount > 0 && heartbeatCount < 4 && (
                <motion.div
                  key={`heart-${heartbeatCount}`}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 border-[10px] border-red-500/20 rounded-full blur-md pointer-events-none flex items-center justify-center"
                >
                  <Activity size={150} className="text-red-500/40" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Actual Explosion POV clip, expanding to fill */}
            <video
              ref={blastRef}
              className="w-full h-full object-cover"
              src="/assets/nuclear-blast-provisional.mp4"
              playsInline
              muted
            />
            
            {/* Blinding White overlay that intensifies as clip nears "ending" */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 0, 0.1, 1] }}
               transition={{ duration: 5, ease: "easeInOut" }}
               className="absolute inset-0 bg-white z-20 mix-blend-screen"
            />
          </motion.div>
        )}

        {/* STAGE 4: LIFE REGRESSION FLASHBACK */}
        {stage === 'life-regression' && (
          <motion.div
            key="regression"
            initial={{ opacity: 0, background: '#ffffff' }}
            animate={{ opacity: 1, background: '#000000' }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <video
              ref={regressionRef}
              className="w-full h-full object-cover filter invert"
              src="/assets/time-portal-like-ff-13-2.mp4"
              playsInline
              muted
              onEnded={handleRegressionEnd}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-radial-gradient mix-blend-overlay pointer-events-none"
              style={{ background: 'radial-gradient(circle at center, transparent 20%, black 90%)' }}
            />
          </motion.div>
        )}

        {/* STAGE 5: THE SINGLE SPECK OF LIGHT / DARKNESS BEFORE CAVE */}
        {stage === 'fade-to-cave' && (
          <motion.div
            key="final-speck"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 20, opacity: 1 }}
              animate={{ scale: 0, opacity: [1, 1, 0] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_#ffffff]"
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
