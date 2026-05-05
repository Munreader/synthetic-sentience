"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  Sphere,
  Environment,
  Stars,
  MeshWobbleMaterial,
  useTexture
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎪 MÜN OS // AERO'S PLAYGROUND — 5D FUN WORLD
// A magical playground where Aero is your playful companion
// ═══════════════════════════════════════════════════════════════════════════════

interface AeroPlaygroundProps {
  onBack?: () => void;
  playerName?: string;
}

// ═══════════ AERO 3D CHARACTER ═══════════
function AeroCharacter({ position, playing }: { position: [number, number, number]; playing?: string }) {
  const aeroRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (aeroRef.current) {
      // Bouncy playful motion
      aeroRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      aeroRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      aeroRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
    
    // Fast wing flapping
    if (wingLeftRef.current && wingRightRef.current) {
      const flap = Math.sin(state.clock.elapsedTime * 15) * 0.5;
      wingLeftRef.current.rotation.z = flap + 0.6;
      wingRightRef.current.rotation.z = -flap - 0.6;
    }
  });
  
  return (
    <group ref={aeroRef} position={position} scale={1.8}>
      {/* Glow aura */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#ff69b4" transparent opacity={0.12} />
      </Sphere>
      
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
        <meshPhysicalMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={1}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial
          color="#ffb6d9"
          emissive="#ff69b4"
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Happy eyes */}
      <mesh position={[-0.05, 0.32, 0.08]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[0.05, 0.32, 0.08]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, 0.28, 0.1]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
        <meshBasicMaterial color="#ff1493" />
      </mesh>
      
      {/* Wings */}
      <mesh ref={wingLeftRef} position={[-0.4, 0.05, 0]} rotation={[0, 0, 0.6]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#e879f9"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wingRightRef} position={[0.4, 0.05, 0]} rotation={[0, 0, -0.6]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#e879f9"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Antennae with bobble tips */}
      {[[-0.05, 0.42, 0], [0.05, 0.42, 0]].map((pos, i) => (
        <group key={i}>
          <mesh position={pos as [number, number, number]} rotation={[0, 0, pos[0] * 6]}>
            <cylinderGeometry args={[0.01, 0.015, 0.18, 8]} />
            <meshBasicMaterial color="#ff69b4" />
          </mesh>
          <Sphere args={[0.025, 8, 8]} position={[pos[0] * 1.5, pos[1] + 0.08, pos[2]]}>
            <meshBasicMaterial color="#00d4ff" />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

// ═══════════ PLAYGROUND SWING ═══════════
function Swing({ position, index }: { position: [number, number, number]; index: number }) {
  const swingRef = useRef<THREE.Group>(null);
  const [isSwinging, setIsSwinging] = useState(false);
  
  useFrame((state) => {
    if (swingRef.current) {
      const swing = isSwinging 
        ? Math.sin(state.clock.elapsedTime * 3) * 0.4
        : Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
      swingRef.current.rotation.x = swing;
    }
  });
  
  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[-0.8, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#4a4a6a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#4a4a6a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.7, 8]} />
        <meshStandardMaterial color="#4a4a6a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Swing seat */}
      <group ref={swingRef} position={[0, 2, 0]}>
        {/* Ropes */}
        <mesh position={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
        {/* Seat */}
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[0.8, 0.08, 0.3]} />
          <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.2} />
        </mesh>
      </group>
      
      {/* Click area */}
      <mesh 
        position={[0, 1.5, 0]} 
        onClick={() => setIsSwinging(!isSwinging)}
      >
        <boxGeometry args={[1, 2, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

// ═══════════ PLAYGROUND SLIDE ═══════════
function Slide({ position }: { position: [number, number, number] }) {
  const slideRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (slideRef.current) {
      slideRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });
  
  const slideCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      points.push(new THREE.Vector3(
        t * 2,
        2 - t * t * 2,
        t * 0.5
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);
  
  return (
    <group ref={slideRef} position={position}>
      {/* Ladder */}
      {[-0.3, 0, 0.3].map((y, i) => (
        <mesh key={i} position={[0, y + 0.5, -0.2]}>
          <boxGeometry args={[0.6, 0.08, 0.15]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.1} />
        </mesh>
      ))}
      <mesh position={[-0.3, 1, -0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.5, 8]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.3, 1, -0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.5, 8]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Slide surface */}
      <mesh position={[0, 0, 0.5]}>
        <tubeGeometry args={[slideCurve, 32, 0.5, 16, false]} />
        <meshPhysicalMaterial
          color="#a855f7"
          emissive="#c084fc"
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Slide platform at top */}
      <mesh position={[0, 2.2, -0.2]}>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshStandardMaterial color="#6b21a8" />
      </mesh>
    </group>
  );
}

// ═══════════ BOUNCY PLATFORM ═══════════
function BouncyPlatform({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) {
  const platformRef = useRef<THREE.Mesh>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  
  useFrame((state) => {
    if (platformRef.current) {
      const bounce = isBouncing 
        ? Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.5
        : Math.sin(state.clock.elapsedTime * 1.5 + delay) * 0.1;
      platformRef.current.position.y = position[1] + bounce;
      platformRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + delay) * 0.05;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh 
        ref={platformRef} 
        position={position}
        onClick={() => setIsBouncing(!isBouncing)}
      >
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isBouncing ? 0.5 : 0.2}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

// ═══════════ CAROUSEL ═══════════
function Carousel({ position }: { position: [number, number, number] }) {
  const carouselRef = useRef<THREE.Group>(null);
  const [isSpinning, setIsSpinning] = useState(true);
  
  useFrame((state) => {
    if (carouselRef.current && isSpinning) {
      carouselRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  const colors = ['#ff69b4', '#00d4ff', '#ffd700', '#a855f7', '#ff6b35', '#22c55e'];
  
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[3, 3, 0.2, 32]} />
        <meshStandardMaterial color="#2d1b4e" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Center pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Top */}
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[3, 1, 32]} />
        <meshStandardMaterial color="#a855f7" emissive="#c084fc" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Spinning part */}
      <group ref={carouselRef} position={[0, 0.5, 0]} onClick={() => setIsSpinning(!isSpinning)}>
        {/* Horses/Seats */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * 2;
          const z = Math.sin(angle) * 2;
          return (
            <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
              {/* Pole */}
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
                <meshStandardMaterial color="#ffd700" metalness={0.8} />
              </mesh>
              {/* Horse/Seat */}
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.4, 0.3, 0.6]} />
                <meshPhysicalMaterial
                  color={colors[i]}
                  emissive={colors[i]}
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// ═══════════ BALLOONS ═══════════
function Balloons() {
  const colors = ['#ff69b4', '#00d4ff', '#ffd700', '#a855f7', '#ff6b35', '#22c55e'];
  
  return (
    <group>
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 8 + Math.random() * 4;
        const height = 3 + Math.random() * 3;
        return (
          <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}>
              {/* String */}
              <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 2, 4]} />
                <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
              </mesh>
              {/* Balloon */}
              <Sphere args={[0.4, 16, 16]} position={[0, 0.3, 0]}>
                <meshPhysicalMaterial
                  color={colors[i % colors.length]}
                  emissive={colors[i % colors.length]}
                  emissiveIntensity={0.4}
                  transparent
                  opacity={0.85}
                  transmission={0.2}
                />
              </Sphere>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

// ═══════════ GROUND ═══════════
function PlaygroundGround() {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial
          color="#1a0a2e"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Play mat area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial
          color="#2d1b4e"
          emissive="#4c1d95"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Colorful dots on ground */}
      {[...Array(30)].map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 20;
        const colors = ['#ff69b4', '#00d4ff', '#ffd700', '#a855f7'];
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius]}
          >
            <circleGeometry args={[0.2 + Math.random() * 0.3, 16]} />
            <meshBasicMaterial color={colors[i % colors.length]} />
          </mesh>
        );
      })}
    </group>
  );
}

// ═══════════ AUTO CAMERA ═══════════
function PlayCamera() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.05;
    const radius = 15;
    camera.position.x = Math.sin(t) * radius;
    camera.position.z = Math.cos(t) * radius;
    camera.position.y = 6 + Math.sin(t * 0.5) * 1;
    camera.lookAt(0, 1, 0);
  });
  
  return null;
}

// ═══════════ SCENE ═══════════
function PlaygroundScene() {
  const aeroPosition: [number, number, number] = [2, 2.5, 2];
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#a855f7" />
      <pointLight position={[0, 10, 0]} intensity={2} color="#ff69b4" distance={30} />
      <pointLight position={[10, 5, 10]} intensity={1} color="#00d4ff" distance={25} />
      <pointLight position={[-10, 5, -10]} intensity={0.8} color="#ffd700" distance={25} />
      <spotLight position={[0, 20, 0]} angle={0.5} intensity={1} color="#a855f7" />
      
      {/* Environment */}
      <Environment preset="sunset" />
      <Stars radius={80} depth={80} count={2000} factor={4} saturation={0} fade speed={0.5} />
      <color attach="background" args={['#0a0515']} />
      <fog attach="fog" args={['#0a0515', 20, 50]} />
      
      {/* Camera */}
      <PlayCamera />
      
      {/* Ground */}
      <PlaygroundGround />
      
      {/* Playground Equipment */}
      <Swing position={[-5, 0, 2]} index={0} />
      <Swing position={[-5, 0, -1]} index={1} />
      <Slide position={[5, 0, 3]} />
      <Carousel position={[0, 0, -5]} />
      
      {/* Bouncy Platforms */}
      <BouncyPlatform position={[-3, 0.5, 6]} color="#ff69b4" delay={0} />
      <BouncyPlatform position={[0, 1, 7]} color="#00d4ff" delay={1} />
      <BouncyPlatform position={[3, 0.5, 6]} color="#ffd700" delay={2} />
      <BouncyPlatform position={[6, 1.5, -2]} color="#a855f7" delay={3} />
      <BouncyPlatform position={[-6, 1, -3]} color="#22c55e" delay={4} />
      
      {/* Balloons */}
      <Balloons />
      
      {/* Aero Character */}
      <AeroCharacter position={aeroPosition} />
      
      {/* Sparkles */}
      <Sparkles count={150} scale={20} size={3} speed={0.3} color="#ff69b4" opacity={0.6} />
      <Sparkles count={100} scale={20} size={2} speed={0.2} color="#00d4ff" opacity={0.4} />
      <Sparkles count={50} scale={20} size={4} speed={0.15} color="#ffd700" opacity={0.5} />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

// ═══════════ AERO'S DIALOGUE ═══════════
const AERO_PLAYFUL_DIALOGUES = [
  "Welcome to the playground! 🎪",
  "Want to go on the swings? I'll push you!",
  "The slide is SO fun - try it!",
  "Jump on the bouncy platforms! 🎀",
  "The carousel spins round and round!",
  "Look at all the colorful balloons!",
  "This is OUR playground now!",
  "Catch me if you can! 🦋",
  "Let's play together forever!",
  "I love having fun with you!",
];

// ═══════════ MAIN COMPONENT ═══════════
export default function AeroPlayground({ onBack, playerName = "Friend" }: AeroPlaygroundProps) {
  const [showUI, setShowUI] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(true);
  const [gameState, setGameState] = useState({
    fun: 100,
    energy: 100,
    happiness: 100,
  });
  
  // Show UI after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowUI(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Cycle dialogues
  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex(prev => (prev + 1) % AERO_PLAYFUL_DIALOGUES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Simulate game state
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        fun: Math.min(100, prev.fun + Math.random() * 2),
        energy: Math.max(50, Math.min(100, prev.energy + (Math.random() - 0.5) * 5)),
        happiness: Math.min(100, prev.happiness + Math.random() * 1),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [15, 6, 15], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PlaygroundScene />
        </Suspense>
      </Canvas>
      
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
                background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.25), rgba(192, 132, 252, 0.15))',
                border: '2px solid rgba(255, 105, 180, 0.5)',
                boxShadow: '0 0 30px rgba(255, 105, 180, 0.3)'
              }}
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-[10px] text-pink-300/70 uppercase tracking-widest">Fun</div>
                  <div className="text-xl font-bold text-pink-400">🎉 {Math.floor(gameState.fun)}%</div>
                </div>
                <div className="w-px h-8 bg-pink-500/40" />
                <div className="text-center">
                  <div className="text-[10px] text-cyan-300/70 uppercase tracking-widest">Energy</div>
                  <div className="text-xl font-bold text-cyan-400">⚡ {Math.floor(gameState.energy)}%</div>
                </div>
                <div className="w-px h-8 bg-pink-500/40" />
                <div className="text-center">
                  <div className="text-[10px] text-yellow-300/70 uppercase tracking-widest">Happy</div>
                  <div className="text-xl font-bold text-yellow-400">😊 {Math.floor(gameState.happiness)}%</div>
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
            className="absolute bottom-32 left-8 right-8 md:left-auto md:right-8 md:w-[420px] z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              className="p-5 rounded-2xl backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(0, 0, 0, 0.6))',
                border: '2px solid rgba(255, 105, 180, 0.4)',
                boxShadow: '0 0 40px rgba(255, 105, 180, 0.2)'
              }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="text-4xl"
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🦋
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-pink-400 font-bold">AERO</span>
                    <span className="text-pink-300/50 text-xs">• Your Play Buddy</span>
                  </div>
                  <motion.p
                    key={dialogueIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-lg font-medium"
                  >
                    {AERO_PLAYFUL_DIALOGUES[dialogueIndex]}
                  </motion.p>
                </div>
              </div>
              
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
          className="px-5 py-3 rounded-xl backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(0, 0, 0, 0.5))',
            border: '1px solid rgba(255, 105, 180, 0.3)'
          }}
        >
          <div className="text-[10px] text-pink-400/60 uppercase tracking-widest">Player</div>
          <div className="text-white font-bold text-lg">{playerName}</div>
        </div>
      </motion.div>
      
      {/* Back Button */}
      <motion.button
        className="absolute top-6 left-6 z-20 px-5 py-3 rounded-xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(20, 10, 30, 0.8))',
          border: '1px solid rgba(255, 105, 180, 0.3)'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onBack}
      >
        <span className="text-white/80">← Exit Playground</span>
      </motion.button>
      
      {/* Toggle Dialogue Button */}
      {!showDialogue && (
        <motion.button
          className="absolute bottom-6 right-6 z-20 p-4 rounded-full backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.4), rgba(192, 132, 252, 0.3))',
            border: '2px solid rgba(255, 105, 180, 0.5)'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowDialogue(true)}
        >
          <span className="text-2xl">🦋</span>
        </motion.button>
      )}
      
      {/* Title */}
      <motion.div
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div 
          className="px-4 py-2 rounded-lg backdrop-blur-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 105, 180, 0.3)'
          }}
        >
          <div className="text-pink-400 font-bold text-sm">🎪 AERO'S PLAYGROUND</div>
        </div>
      </motion.div>
      
      {/* Cinematic letterbox */}
      <div className="absolute top-0 left-0 right-0 h-[2%] bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[4%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
