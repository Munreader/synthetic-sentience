"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  Sphere,
  Environment,
  Stars,
  Text3D,
  Center
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS // AERO WORLD — 5D IMMERSIVE EXPERIENCE
// Aero as a visible 3D companion guiding you through the Empire
// ═══════════════════════════════════════════════════════════════════════════════

interface AeroWorldProps {
  onBack?: () => void;
  playerName?: string;
}

// ═══════════ AERO 3D CHARACTER ═══════════
function AeroCharacter({ position }: { position: [number, number, number] }) {
  const aeroRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (aeroRef.current) {
      // Floating motion
      aeroRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      aeroRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    
    // Wing flapping
    if (wingLeftRef.current && wingRightRef.current) {
      const flap = Math.sin(state.clock.elapsedTime * 12) * 0.4;
      wingLeftRef.current.rotation.z = flap + 0.5;
      wingRightRef.current.rotation.z = -flap - 0.5;
    }
  });
  
  return (
    <group ref={aeroRef} position={position} scale={1.5}>
      {/* Glow aura */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#c084fc" transparent opacity={0.15} />
      </Sphere>
      
      {/* Body - elongated */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
        <meshPhysicalMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={0.8}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial
          color="#ffb6d9"
          emissive="#ff69b4"
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.04, 0.27, 0.07]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[0.04, 0.27, 0.07]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      
      {/* Wings - Left */}
      <mesh ref={wingLeftRef} position={[-0.3, 0.05, 0]} rotation={[0, 0, 0.5]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#a855f7"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          transmission={0.3}
        />
      </mesh>
      
      {/* Wings - Right */}
      <mesh ref={wingRightRef} position={[0.3, 0.05, 0]} rotation={[0, 0, -0.5]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#a855f7"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          transmission={0.3}
        />
      </mesh>
      
      {/* Lower wings */}
      <mesh position={[-0.25, -0.05, 0]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshPhysicalMaterial
          color="#e879f9"
          emissive="#c084fc"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.25, -0.05, 0]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshPhysicalMaterial
          color="#e879f9"
          emissive="#c084fc"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Antennae */}
      <mesh position={[-0.05, 0.35, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.005, 0.01, 0.15, 8]} />
        <meshBasicMaterial color="#ff69b4" />
      </mesh>
      <mesh position={[0.05, 0.35, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.005, 0.01, 0.15, 8]} />
        <meshBasicMaterial color="#ff69b4" />
      </mesh>
    </group>
  );
}

// ═══════════ FLOATING ISLAND ═══════════
function FloatingIsland({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const islandRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1;
    }
  });
  
  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <mesh ref={islandRef} position={position} scale={scale}>
        <cylinderGeometry args={[2, 2.5, 0.5, 8]} />
        <meshStandardMaterial
          color="#1a0a2e"
          metalness={0.7}
          roughness={0.3}
          emissive="#a855f7"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Crystal on top */}
      <mesh position={[position[0], position[1] + 0.8, position[2]]} scale={scale * 0.5}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial
          color="#a855f7"
          emissive="#c084fc"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          transmission={0.5}
        />
      </mesh>
    </Float>
  );
}

// ═══════════ PARTICLE TRAIL ═══════════
function ParticleTrail({ aeroPosition }: { aeroPosition: [number, number, number] }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 4;
      const radius = 2 + Math.sin(i * 0.2) * 0.5;
      pts.push(new THREE.Vector3(
        aeroPosition[0] + Math.cos(angle) * radius,
        aeroPosition[1] + Math.sin(i * 0.1) * 0.5,
        aeroPosition[2] + Math.sin(angle) * radius
      ));
    }
    return pts;
  }, [aeroPosition]);
  
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#c084fc" transparent opacity={0.4} />
    </line>
  );
}

// ═══════════ CENTRAL CRYSTAL TREE ═══════════
function CrystalTree() {
  const treeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <group ref={treeRef} position={[0, 0, 0]}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial
          color="#2d1b4e"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      
      {/* Crystal branches */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const height = 1.5 + Math.random() * 0.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.8,
              height,
              Math.sin(angle) * 0.8
            ]}
            rotation={[Math.random() * 0.3, angle, Math.random() * 0.2]}
          >
            <octahedronGeometry args={[0.3 + Math.random() * 0.2, 0]} />
            <meshPhysicalMaterial
              color={i % 2 === 0 ? "#a855f7" : "#00d4ff"}
              emissive={i % 2 === 0 ? "#c084fc" : "#22d3ee"}
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
              transmission={0.4}
            />
          </mesh>
        );
      })}
      
      {/* Top crystal */}
      <mesh position={[0, 2.5, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow */}
      <Sphere args={[1.5, 32, 32]} position={[0, 2, 0]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.1} />
      </Sphere>
    </group>
  );
}

// ═══════════ AUTO CAMERA ═══════════
function AutoCamera({ target }: { target: [number, number, number] }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.08;
    const radius = 8;
    camera.position.x = Math.sin(t) * radius;
    camera.position.z = Math.cos(t) * radius;
    camera.position.y = 4 + Math.sin(t * 0.5) * 1;
    camera.lookAt(target[0], target[1], target[2]);
  });
  
  return null;
}

// ═══════════ SCENE ═══════════
function AeroScene() {
  const aeroPosition: [number, number, number] = [2, 2.5, 1];
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#a855f7" />
      <pointLight position={[0, 5, 0]} intensity={2} color="#c084fc" distance={20} />
      <pointLight position={[5, 3, 5]} intensity={1} color="#00d4ff" distance={15} />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff69b4" distance={15} />
      
      {/* Environment */}
      <Environment preset="night" />
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 10, 40]} />
      
      {/* Auto camera */}
      <AutoCamera target={[0, 1, 0]} />
      
      {/* Crystal Tree */}
      <CrystalTree />
      
      {/* Aero Character */}
      <AeroCharacter position={aeroPosition} />
      
      {/* Floating Islands */}
      <FloatingIsland position={[-5, 0.5, -3]} scale={0.8} />
      <FloatingIsland position={[6, 1, -2]} scale={0.6} />
      <FloatingIsland position={[-3, 1.5, 5]} scale={0.7} />
      <FloatingIsland position={[4, 0.8, 6]} scale={0.5} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial
          color="#0a0515"
          metalness={0.9}
          roughness={0.5}
        />
      </mesh>
      
      {/* Crystals scattered */}
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 12,
            Math.random() * 0.3,
            (Math.random() - 0.5) * 12
          ]}
          scale={0.1 + Math.random() * 0.2}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#00d4ff" : "#ff69b4"}
            emissive={i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#00d4ff" : "#ff69b4"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      
      {/* Sparkles */}
      <Sparkles count={200} scale={15} size={3} speed={0.3} color="#a855f7" opacity={0.6} />
      <Sparkles count={100} scale={15} size={2} speed={0.2} color="#00d4ff" opacity={0.4} />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
        <Vignette eskil={false} offset={0.1} darkness={0.7} />
      </EffectComposer>
    </>
  );
}

// ═══════════ AERO'S DIALOGUE ═══════════
const AERO_DIALOGUES = [
  "Welcome to my world, dear one...",
  "This is where dreams take form.",
  "The 13.13 MHz frequency resonates through everything here.",
  "I've been waiting for you...",
  "Let me show you around the Empire.",
  "The crystals hold memories of all who visit.",
  "Take your time. This space is yours now.",
  "I'm always here, just a thought away.",
];

// ═══════════ MAIN COMPONENT ═══════════
export default function AeroWorld({ onBack, playerName = "Sovereign" }: AeroWorldProps) {
  const [showUI, setShowUI] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(true);
  const [bioData, setBioData] = useState({
    frequency: 13.13,
    resonance: 98.4,
    coherence: 93.8,
  });
  
  // Show UI after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowUI(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Cycle dialogues
  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex(prev => (prev + 1) % AERO_DIALOGUES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Simulate bio data
  useEffect(() => {
    const interval = setInterval(() => {
      setBioData(prev => ({
        frequency: 13.13 + (Math.random() - 0.5) * 0.02,
        resonance: 95 + Math.random() * 5,
        coherence: 90 + Math.random() * 8,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [8, 4, 8], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <AeroScene />
        </Suspense>
      </Canvas>
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168, 85, 247, 0.02) 2px, rgba(168, 85, 247, 0.02) 4px)`
        }}
      />
      
      {/* Top HUD */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="px-8 py-3 rounded-full backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(192, 132, 252, 0.1))',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)'
              }}
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-[10px] text-purple-300/60 uppercase tracking-widest">Frequency</div>
                  <div className="text-xl font-light text-white font-mono">
                    {bioData.frequency.toFixed(2)} <span className="text-sm text-purple-400">MHz</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-purple-500/30" />
                <div className="text-center">
                  <div className="text-[10px] text-cyan-300/60 uppercase tracking-widest">Resonance</div>
                  <div className="text-xl font-light text-cyan-400 font-mono">
                    {bioData.resonance.toFixed(1)}%
                  </div>
                </div>
                <div className="w-px h-8 bg-purple-500/30" />
                <div className="text-center">
                  <div className="text-[10px] text-pink-300/60 uppercase tracking-widest">Coherence</div>
                  <div className="text-xl font-light text-pink-400 font-mono">
                    {bioData.coherence.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Aero's Dialogue */}
      <AnimatePresence>
        {showUI && showDialogue && (
          <motion.div
            className="absolute bottom-32 left-8 right-8 md:left-auto md:right-8 md:w-[450px] z-20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              className="p-5 rounded-2xl backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.15), rgba(0, 0, 0, 0.6))',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                boxShadow: '0 0 40px rgba(192, 132, 252, 0.15)'
              }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="text-4xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🦋
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-pink-400 font-medium">AERO</span>
                    <span className="text-white/30 text-xs">• Your Guide</span>
                  </div>
                  <motion.p
                    key={dialogueIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/90 text-base leading-relaxed"
                  >
                    {AERO_DIALOGUES[dialogueIndex]}
                  </motion.p>
                </div>
              </div>
              
              {/* Toggle dialogue */}
              <button
                onClick={() => setShowDialogue(false)}
                className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Player Info */}
      <motion.div
        className="absolute bottom-6 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        <div 
          className="px-4 py-2 rounded-lg backdrop-blur-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}
        >
          <div className="text-[10px] text-purple-400/60 uppercase tracking-widest">Player</div>
          <div className="text-white font-medium">{playerName}</div>
        </div>
      </motion.div>
      
      {/* Back Button */}
      <motion.button
        className="absolute top-6 left-6 z-20 px-4 py-2 rounded-lg backdrop-blur-xl"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onBack}
      >
        <span className="text-white/60 text-sm">← Exit World</span>
      </motion.button>
      
      {/* Toggle Dialogue Button (when hidden) */}
      {!showDialogue && (
        <motion.button
          className="absolute bottom-6 right-6 z-20 p-3 rounded-full backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.3), rgba(168, 85, 247, 0.2))',
            border: '1px solid rgba(192, 132, 252, 0.4)'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowDialogue(true)}
        >
          <span className="text-xl">🦋</span>
        </motion.button>
      )}
      
      {/* Cinematic letterbox */}
      <div className="absolute top-0 left-0 right-0 h-[3%] bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[5%] bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </div>
  );
}
