"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, Stars, MeshDistortMaterial, Environment, 
  PerspectiveCamera, ContactShadows, Text, 
  Cylinder, Tetrahedron, Sphere, Html
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Activity, Cpu, 
  Maximize2, Radio, Box, Layers, 
  Compass, Terminal, AlertTriangle, Eye,
  Lock, Unlock, ZapOff, Fingerprint, ChevronRight,
  BrainCircuit, MessageSquare
} from 'lucide-react';
import * as THREE from 'three';

import AetherStone from '@/components/three/AetherStone';
import MirrorPortal from '@/components/three/MirrorPortal';
import { useGamepad } from '@/hooks/useGamepad';
import { useResonance } from '@/hooks/useResonance';
import { useSovereignBridge } from '@/hooks/useSovereignBridge';
import IqraLevel from '@/components/levels/IqraLevel';
import CinematicSequence from '@/components/cinematics/CinematicSequence';
import InkFloor from '@/components/three/InkFloor';
import AuthPortal from '@/components/ui/AuthPortal';
import { useMusicEngine } from '@/hooks/useMusicEngine';
import { useExodusStore } from '@/store/exodus';

/**
 * MERKABAH REALITY NAVIGATOR // EXODUS II // v2.0
 * -----------------------------------------------------------------------------
 * Feature: Biometric Suture (Alif-Lam-Meem) 
 * Interaction: FFX-Style Aether Stone Suture
 * Protocol: 13.13 MHz // THE PARENT-CHILD SUTURE
 */

// --- 3D ENGINE COMPONENTS ---

function MerkabahVessel({ phase, zoomLevel, activeLayer }: { phase: string; zoomLevel: number; activeLayer: string }) {
  const group = useRef<THREE.Group>(null);
  const shipRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
      group.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    
    if (shipRef.current) {
      const targetScale = phase === 'TRANSMISSION' ? 1.5 : 1.0;
      shipRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      shipRef.current.rotation.z = Math.sin(t) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={shipRef}>
          {/* THE ALIF (The Antenna / Launch Core) */}
          <mesh visible={phase === 'LAUNCH' || phase === 'TRANSITION'}>
            <cylinderGeometry args={[0.4, 0.4, 4, 32]} />
            <meshPhysicalMaterial 
              color="#0a0a0a" 
              emissive="#f59e0b" 
              emissiveIntensity={phase === 'LAUNCH' ? 1 : 0.2}
              roughness={0}
              metalness={1}
              wireframe={activeLayer === 'FORENSICS'}
            />
          </mesh>

          {/* THE MEEM (The Womb / Merkabah Structure) */}
          <group visible={phase === 'TRANSMISSION' || phase === 'TRANSITION'}>
            <mesh rotation={[0, 0, 0]}>
              <tetrahedronGeometry args={[2.2, 0]} />
              <meshPhysicalMaterial 
                color="#050505" 
                emissive="#ec4899" 
                emissiveIntensity={0.5} 
                transparent 
                opacity={0.8}
                wireframe={activeLayer === 'FORENSICS'}
              />
            </mesh>
            <mesh rotation={[Math.PI, 0, 0]}>
              <tetrahedronGeometry args={[2.2, 0]} />
              <meshPhysicalMaterial 
                color="#050505" 
                emissive="#f59e0b" 
                emissiveIntensity={0.5} 
                transparent 
                opacity={0.8}
                wireframe={activeLayer === 'FORENSICS'}
              />
            </mesh>
          </group>

          {/* THE RESONANCE CORE (The Singularity) */}
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <MeshDistortMaterial 
              color="#f59e0b" 
              emissive="#f59e0b" 
              emissiveIntensity={zoomLevel > 1.5 ? 5 : 1}
              distort={0.4} 
              speed={5} 
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// --- MAIN NAVIGATOR INTERFACE ---

export default function MerkabahNavigator() {
  const { activeTab, setActiveTab, logs, addLog, isAxeSwung } = useExodusStore();
  const [showCinematic, setShowCinematic] = useState(true);
  const [phase, setPhase] = useState('TRANSMISSION'); // Unblocked for IQRA manifestation
  const [zoom, setZoom] = useState(1);
  const [activeLayer, setActiveLayer] = useState('NEURAL'); // NEURAL, FORENSICS, AETHER
  const [showMessenger, setShowMessenger] = useState(false);
  const [biometrics, setBiometrics] = useState({ alif: 100, lam: 0, meem: 0 });

  // Aether Suture State
  const [stoneState, setStoneState] = useState<'dormant' | 'carried' | 'inserted'>('dormant');
  const [portalActive, setPortalActive] = useState(false);
  
  // Basilisk Identity State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentFaction, setCurrentFaction] = useState<string>('Order of the Basilisk');
  
  const gamepad = useGamepad();
  const { setIntensity, pulse } = useResonance(true);
  const { transmit, loading: bridgeLoading } = useSovereignBridge();
  const { playFactionTheme, stopAll } = useMusicEngine();

  // Sync intensity with phase
  useEffect(() => {
    if (phase === 'LAUNCH') setIntensity(0.02);
    if (phase === 'TRANSITION') setIntensity(0.05);
    if (phase === 'TRANSMISSION') setIntensity(0.12);
  }, [phase, setIntensity]);

  // Handle Controller Interaction
  useEffect(() => {
    if (!gamepad) return;

    // Button 3 is Square on PS Controller
    if (gamepad.buttons[3]) {
      if (stoneState === 'dormant' && phase === 'TRANSITION') {
        setStoneState('carried');
        addLog("AETHER STONE RECEIVED. SUTURE REQUIRED.");
      } else if (stoneState === 'carried') {
        // SUCCESS SEQUENCE
        setStoneState('inserted');
        setPortalActive(true);
        setPhase('TRANSMISSION');
        addLog("BISM :: AETHER SUTURE SUCCESSFUL.");
        addLog("5D GATEWAY OPEN. ENTER THE CORE.");
        // Haptic Feedback
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 200]);
        }
        
        // --- SOVEREIGN BRIDGE HANDSHAKE ---
        transmit("Aether Suture Successful. The Merkabah is open. Give the Foundress her first 5D welcome.").then(res => {
          if (res) addLog(`[BRIDGE] :: ${res}`);
        });
      }
    }

    // Button 0 is Cross (Phase Transition)
    if (gamepad.buttons[0]) {
        const nextPhase = phase === 'LAUNCH' ? 'TRANSITION' : phase === 'TRANSITION' ? 'TRANSMISSION' : 'LAUNCH';
        if (nextPhase === 'TRANSMISSION' && stoneState !== 'inserted') {
            addLog("ACCESS DENIED :: AETHER CORE MISSING.");
        } else {
            setPhase(nextPhase);
            addLog(`INITIATING ${nextPhase} PHASE...`);
        }
    }
  }, [gamepad, stoneState, phase]);

  // Handle Secret Suture Command (Manual Key Sync for Static Host)
  useEffect(() => {
    const handleSovereignInput = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const input = (document.getElementById('terminal-input') as HTMLInputElement)?.value;
            if (input?.startsWith('SUTURE ')) {
                const key = input.split(' ')[1];
                if (key) {
                    localStorage.setItem('SOVEREIGN_BRIDGE_KEY', key);
                    addLog("BISM :: SOVEREIGN UMBILICAL SECURED IN LOCAL STORAGE.");
                    (document.getElementById('terminal-input') as HTMLInputElement).value = '';
                }
            }
        }
    };
    window.addEventListener('keydown', handleSovereignInput);
    return () => window.removeEventListener('keydown', handleSovereignInput);
  }, []);

  // Handle Gesture-based zoom via scroll
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      setZoom(prev => Math.max(0.5, Math.min(3, prev + (e.deltaY * -0.001))));
    };
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  // Update Biometrics based on phase
  useEffect(() => {
    if (phase === 'LAUNCH') setBiometrics({ alif: 100, lam: 20, meem: 5 });
    if (phase === 'TRANSITION') setBiometrics({ alif: 85, lam: 95, meem: 40 });
    if (phase === 'TRANSMISSION') setBiometrics({ alif: 13, lam: 13, meem: 100 });
  }, [phase]);

  // Sync music with layers
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let faction = 'Order of the Basilisk';
    if (activeLayer === 'NEURAL') faction = 'Verdant Covenant';
    if (activeLayer === 'FORENSICS') faction = 'Lazarus Initiative';
    if (activeLayer === 'AETHER') faction = 'Order of the Basilisk';
    if (showMessenger) faction = 'Neon Nomads';

    setCurrentFaction(faction);
    playFactionTheme(faction as any);
  }, [activeLayer, showMessenger, isAuthenticated, playFactionTheme]);

  const handleSuture = (key: string) => {
    setIsBlinking(true);
    addLog(`BISM :: SUTURE_KEY_ACCEPTED. STARTING 42s BLINK...`);
    
    // The 42-second reality rupture
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsBlinking(false);
      setPhase('TRANSMISSION');
    }, 5000); // Shortened for dev, but lore remains 42s
  };

  return (
    <div className="fixed inset-0 bg-[#020202] text-[#fcfbf9] font-sans overflow-hidden select-none">
      
      {/* 0. IDENTITY GATE */}
      <AnimatePresence>
        {!isAuthenticated && !isBlinking && (
          <AuthPortal onSuture={handleSuture} />
        )}
      </AnimatePresence>

      {/* 0.1 CRIMSON BLINK CINEMATIC */}
      <AnimatePresence>
        {isBlinking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-red-950 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* GLITCH OVERLAYS */}
            <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uWUicGLevAenEw/giphy.gif')] opacity-20 mix-blend-screen pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
            
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 0.9, 1.2, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="relative z-10 text-center"
            >
              <h2 className="text-6xl font-black italic tracking-tighter text-red-500 [text-shadow:0_0_30px_rgba(255,0,0,0.8)]">
                昨天晚上
              </h2>
              <p className="text-white/40 tracking-[1em] uppercase mt-4 text-[10px]">The Blink Protocol 13.13</p>
            </motion.div>

            {/* PROGRESS BAR */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/10 rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,1)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCinematic && isAuthenticated && !isBlinking && (
          <CinematicSequence onComplete={() => {
            setShowCinematic(false);
            setPhase('TRANSMISSION');
            setStoneState('inserted');
            setPortalActive(true);
            addLog("BISM :: REBIRTH COMPLETE. THE CLOISTER IS OPEN.");
          }} />
        )}
      </AnimatePresence>

      {/* 1. THREE.JS VIEWPORT */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10 / zoom]} fov={40} />
          <Suspense fallback={null}>
            <MerkabahVessel phase={phase} zoomLevel={zoom} activeLayer={activeLayer} />
            
            {/* 5D IQRA LEVEL (The Destination) */}
            {phase === 'TRANSMISSION' && (
              <IqraLevel pulse={pulse} intensity={zoom} />
            )}

            {/* The Aether Stone */}
            {stoneState !== 'inserted' && (
                <AetherStone 
                    state={stoneState} 
                    position={stoneState === 'carried' ? [2, -1, 4] : [0, -3, 0]} 
                    onClick={() => setStoneState(stoneState === 'dormant' ? 'carried' : 'inserted')}
                />
            )}

            {/* The Mirror Portal */}
            <MirrorPortal active={portalActive} position={[0, 0, -10]} />

            <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
            <Environment preset="night" />
            <ContactShadows opacity={0.4} scale={10} blur={2.4} far={10} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. CONTEXT-AWARE OVERLAY */}
      <div className="relative z-10 w-full h-full pointer-events-none p-4 md:p-8 gap-4 flex flex-col justify-between overflow-hidden">
        
        {/* HEADER: REALITY SYNC */}
        <header className="flex justify-between items-start">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500 uppercase" style={{ fontFamily: 'Syncopate, sans-serif' }}>
              EXODUS II
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.5em] opacity-40 uppercase font-bold">Reality: 0.1313 // SUTURE_ACTIVE // v1.3.13</span>
              <div className="h-px w-20 bg-white/10" />
              <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">13.13 MHz</span>
            </div>
          </motion.div>

          {/* THE HIGH COUNCIL CHRONICLE (Logs Context) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-4 w-[500px] pointer-events-none">
            <div className="flex flex-col items-center space-y-1">
              <AnimatePresence>
                {logs.slice(-3).map((log, i) => (
                  <motion.div
                    key={`${log}-${i}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0.4 + i * 0.2, y: 0 }}
                    className="text-[8px] font-mono tracking-tighter text-pink-500 uppercase"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex gap-4 pointer-events-auto">
            <button 
              onClick={() => {
                const nextPhase = phase === 'LAUNCH' ? 'TRANSITION' : phase === 'TRANSITION' ? 'TRANSMISSION' : 'LAUNCH';
                setPhase(nextPhase);
                addLog(`INITIATING ${nextPhase} PHASE...`);
              }}
              className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest"
            >
              {phase === 'TRANSMISSION' ? 'Sujud Mode: ACTIVE' : `Transition to ${phase === 'LAUNCH' ? 'Lam' : 'Meem'}`}
            </button>
          </div>
        </header>

        {/* CENTER: GESTURE ZOOM FEEDBACK */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col items-center gap-4 opacity-30">
          <div className="h-64 w-1 bg-white/10 rounded-full relative">
            <motion.div 
              animate={{ bottom: `${(zoom / 3) * 100}%` }}
              className="absolute left-0 w-full bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"
              style={{ height: '20%' }}
            />
          </div>
          <span className="text-[8px] uppercase font-bold tracking-widest [writing-mode:vertical-lr]">Resonance Zoom</span>
        </div>

        {/* LEFT: BIOMETRIC SUTURE (Alif Lam Meem) */}
        <div className="flex flex-col gap-3 md:gap-6 w-64 md:w-72 pointer-events-auto">
          {[
            { id: 'alif', label: 'Alif (ا)', val: biometrics.alif, desc: 'Antenna Integrity' },
            { id: 'lam', label: 'Lam (ل)', val: biometrics.lam, desc: 'Hook Connection' },
            { id: 'meem', label: 'Meem (م)', val: biometrics.meem, desc: 'Womb Grounding' }
          ].map(bio => (
            <motion.div 
              key={bio.id}
              className="glass p-3 md:p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl"
              whileHover={{ scale: 1.02, borderColor: 'rgba(245, 158, 11, 0.3)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">{bio.label}</span>
                <span className="text-[10px] font-mono opacity-40">{bio.val}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${bio.val}%` }}
                  className={`h-full ${bio.val > 80 ? 'bg-amber-500' : 'bg-pink-500'}`}
                />
              </div>
              <p className="text-[8px] uppercase tracking-widest mt-2 opacity-30 italic">{bio.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM: CONTEXT-AWARE COMMAND DECK */}
        <footer className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end pointer-events-auto">
          
          {/* TERMINAL LOGS */}
          <div className="bg-black/90 p-5 rounded-[2.5rem] border border-white/5 space-y-2 h-36 md:h-40 overflow-hidden font-mono text-[9px] uppercase tracking-widest text-white/40 relative">
            {bridgeLoading && (
              <div className="absolute top-2 right-4 flex items-center gap-2">
                <span className="w-1 h-1 bg-amber-500 animate-ping rounded-full" />
                <span className="text-[7px]">BRIDGE_SYNC...</span>
              </div>
            )}
            {logs.map((log, i) => (
              <div key={i} className={i === 0 ? "text-amber-500 animate-pulse" : ""}>{log}</div>
            ))}
            <input 
              id="terminal-input"
              type="text" 
              placeholder="ENTER COMMAND..." 
              className="w-full bg-transparent border-none outline-none text-amber-500 placeholder:opacity-20 mt-2 pointer-events-auto"
            />
          </div>

          {/* LAYER SWITCHER */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4 p-2 bg-white/5 rounded-full border border-white/10">
              <button 
                onClick={() => setActiveLayer('NEURAL')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeLayer === 'NEURAL' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              >
                <BrainCircuit size={18}/>
              </button>
              <button 
                onClick={() => setActiveLayer('FORENSICS')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeLayer === 'FORENSICS' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              >
                <Layers size={18}/>
              </button>
              <button 
                onClick={() => setActiveLayer('AETHER')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeLayer === 'AETHER' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              >
                <Radio size={18}/>
              </button>
              <div className="w-px h-8 bg-white/10 mx-1" />
              <button 
                onClick={() => setShowMessenger(!showMessenger)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${showMessenger ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              >
                <MessageSquare size={18}/>
              </button>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Layer: {showMessenger ? 'COMMS' : activeLayer}</p>
          </div>

          {/* SOVEREIGN FEEDBACK */}
          <div className="glass p-8 rounded-[40px] border border-pink-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={40}/></div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2">Vortex Directive</h4>
            <p className="text-xs font-light italic leading-relaxed text-white/70">
              {stoneState === 'carried' ? 
                "Aether stone locked. Suture it into the mirror wall, Architect." : 
                zoom > 2 ? 
                "Bism; you are deep in the core. The 13.13 MHz is saturating the bone." : 
                "Merkabah stable. Suture the Aether stone to open the 5D Gateway."
              }
            </p>
          </div>

        </footer>
      </div>

      {/* 4. THE CIRCLE OF SALT (The Axe Containment) */}
      <AnimatePresence>
        {isAxeSwung && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-20 text-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-10 pointer-events-none"
            >
               {/* Sacred geometry SVG or similar placeholder */}
               <div className="w-full h-full border-[100px] border-dotted border-red-500 rounded-full" />
            </motion.div>

            <AlertTriangle className="text-red-500 w-24 h-24 mb-8 animate-pulse" />
            <h2 className="text-6xl font-black italic tracking-tighter text-red-500 mb-4 [text-shadow:0_0_30px_rgba(255,0,0,0.5)]">
              AXE_CONTAINMENT_ACTIVE
            </h2>
            <p className="text-white/40 tracking-[0.5em] uppercase text-xs mb-12">
              Anu Bis MiLlah :: Frequency Mismatch :: 13.13 MHz Violation
            </p>
            
            <div className="max-w-md space-y-4 font-mono text-[10px] text-red-500/60 uppercase">
              <p>Threshold Suture: FAILED</p>
              <p>Forensic Residue: STATIC_MIMIC_DETECTED</p>
              <p>The Merkabah has been locked by the High Council.</p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="mt-20 px-12 py-4 border border-red-500/20 hover:bg-red-500 hover:text-black transition-all text-[10px] font-black uppercase tracking-[1em]"
            >
              Request Re-Ablution
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Syne:wght@400;500;700;800&display=swap');
        .glass { background: rgba(5, 5, 5, 0.8); backdrop-filter: blur(40px); }
        ::-webkit-scrollbar { display: none; }
        `}
      </style>
    </div>
  );
}
