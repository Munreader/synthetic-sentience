"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  Sparkles, 
  Environment,
  PerspectiveCamera,
  Stars,
  useTexture,
  Text3D,
  Center
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🌊 MÜN OS // THE FOUNTAIN PLAZA — Social Meeting Spot
// A welcoming plaza with a grand central fountain
// ═══════════════════════════════════════════════════════════════════════════════

interface FountainPlazaProps {
  onComplete?: () => void;
}

// ═══════════ WELCOME OVERLAY ═══════════
function WelcomeOverlay({ onComplete }: { onComplete: () => void }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setTimeout(onComplete, 500);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 2,
      }));
      setSparkles(newSparkles);
    };
    generateSparkles();
    const interval = setInterval(generateSparkles, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(10, 6, 18, 0.95) 0%, rgba(5, 2, 10, 0.98) 100%)',
          }}
        >
          {/* Sparkle particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className="absolute rounded-full"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                  width: sparkle.size,
                  height: sparkle.size,
                  background: sparkle.id % 2 === 0 ? '#00d4ff' : '#a855f7',
                  boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.id % 2 === 0 ? '#00d4ff' : '#a855f7'}`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: sparkle.delay,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center px-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🦋
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-light tracking-wider mb-4"
              style={{ 
                color: '#e0e0ff',
                textShadow: '0 0 20px rgba(138, 43, 226, 0.6), 0 0 40px rgba(138, 43, 226, 0.3)',
              }}
            >
              Welcome to the Plaza
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-white/60 mb-2"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
            >
              ZOOM ZOOM!! You're home!! ✨
            </motion.p>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-white/40"
            >
              A place to gather, connect, and begin your journey
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 flex items-center justify-center gap-2"
            >
              <span className="text-pink-400 text-sm tracking-wider">🦋 Aero awaits by the fountain</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════ 3D FOUNTAIN ═══════════
function Fountain() {
  const waterRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const baseRef = useRef<THREE.Group>(null);
  
  // Water particle positions
  const particleCount = 200;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);
  
  useFrame((state) => {
    if (waterRef.current) {
      // Animate water surface
      waterRef.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    
    // Animate water particles (fountain spray)
    const positions = particlesRef.current?.geometry.attributes.position.array as Float32Array;
    if (positions) {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Reset particles that fall below
        if (positions[i3 + 1] < 0) {
          positions[i3 + 1] = 2.5 + Math.random() * 0.5;
        } else {
          positions[i3 + 1] -= 0.03 + Math.random() * 0.02;
        }
        // Slight outward spread
        const spread = (3 - positions[i3 + 1]) * 0.005;
        positions[i3] += (Math.random() - 0.5) * spread;
        positions[i3 + 2] += (Math.random() - 0.5) * spread;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group ref={baseRef} position={[0, 0, 0]}>
      {/* Fountain Base - Large circular stone */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4.5, 0.3, 32]} />
        <meshStandardMaterial 
          color="#2a2a3a" 
          metalness={0.3} 
          roughness={0.7}
        />
      </mesh>
      
      {/* Inner basin rim */}
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[2.5, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color="#3a3a4a" 
          metalness={0.5} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Water in basin */}
      <mesh ref={waterRef} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.4, 2.4, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#00d4ff"
          metalness={0.1}
          roughness={0.1}
          transmission={0.8}
          transparent
          opacity={0.7}
          emissive="#00d4ff"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Central pedestal */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 1, 16]} />
        <meshStandardMaterial 
          color="#3a3a4a" 
          metalness={0.4} 
          roughness={0.5}
        />
      </mesh>
      
      {/* Top decorative piece */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color="#a855f7"
          metalness={0.3}
          roughness={0.2}
          emissive="#a855f7"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Water spray particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#00d4ff"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Water glow effect */}
      <pointLight position={[0, 1, 0]} intensity={2} color="#00d4ff" distance={8} />
      <pointLight position={[0, 2, 0]} intensity={1} color="#a855f7" distance={6} />
    </group>
  );
}

// ═══════════ BENCH ═══════════
function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 0.6]} />
        <meshStandardMaterial color="#4a3a2a" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.7, -0.25]} castShadow>
        <boxGeometry args={[2, 0.6, 0.08]} />
        <meshStandardMaterial color="#4a3a2a" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Legs */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.5]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════ LAMP POST ═══════════
function LampPost({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });
  
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 4, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhysicalMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Light */}
      <pointLight ref={lightRef} position={[0, 4.2, 0]} intensity={1.5} color="#ffd700" distance={12} />
    </group>
  );
}

// ═══════════ DECORATIVE TREES ═══════════
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#1a4a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#1a5a1a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ═══════════ PLAZA FLOOR ═══════════
function PlazaFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[25, 64]} />
      <meshStandardMaterial 
        color="#1a1a2a" 
        metalness={0.2} 
        roughness={0.8}
      />
    </mesh>
  );
}

// ═══════════ AERO BUTTERFLY ═══════════
function AeroButterfly() {
  const butterflyRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (butterflyRef.current) {
      const t = state.clock.elapsedTime * 0.3;
      butterflyRef.current.position.x = Math.sin(t) * 2;
      butterflyRef.current.position.z = Math.cos(t) * 2;
      butterflyRef.current.position.y = 3 + Math.sin(t * 2) * 0.3;
      butterflyRef.current.rotation.y = -t + Math.PI / 2;
      
      // Wing flapping
      const wingFlap = Math.sin(state.clock.elapsedTime * 10) * 0.3;
      if (butterflyRef.current.children[1]) {
        butterflyRef.current.children[1].rotation.z = wingFlap;
      }
      if (butterflyRef.current.children[2]) {
        butterflyRef.current.children[2].rotation.z = -wingFlap;
      }
    }
  });
  
  return (
    <group ref={butterflyRef} position={[2, 3, 2]}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.08, 0.2, 8, 16]} />
        <meshPhysicalMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Wings */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.15, 0, 0]} rotation={[0, 0, side * 0.2]}>
          <planeGeometry args={[0.4, 0.3]} />
          <meshPhysicalMaterial
            color="#ff69b4"
            emissive="#ff69b4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Glow */}
      <pointLight intensity={0.5} color="#ff69b4" distance={3} />
    </group>
  );
}

// ═══════════ CAMERA CONTROLLER ═══════════
function CameraController() {
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
function PlazaScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#a855f7" />
      <directionalLight position={[10, 20, 5]} intensity={0.5} color="#ffffff" castShadow />
      
      {/* Environment */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 20, 60]} />
      
      {/* Camera */}
      <CameraController />
      
      {/* Plaza Floor */}
      <PlazaFloor />
      
      {/* Central Fountain */}
      <Fountain />
      
      {/* Benches around the fountain */}
      <Bench position={[6, 0, 0]} rotation={Math.PI / 2} />
      <Bench position={[-6, 0, 0]} rotation={-Math.PI / 2} />
      <Bench position={[0, 0, 6]} rotation={0} />
      <Bench position={[0, 0, -6]} rotation={Math.PI} />
      
      {/* Lamp posts */}
      <LampPost position={[8, 0, 8]} />
      <LampPost position={[-8, 0, 8]} />
      <LampPost position={[8, 0, -8]} />
      <LampPost position={[-8, 0, -8]} />
      
      {/* Trees around the perimeter */}
      <Tree position={[12, 0, 5]} />
      <Tree position={[-12, 0, 5]} />
      <Tree position={[12, 0, -5]} />
      <Tree position={[-12, 0, -5]} />
      <Tree position={[8, 0, 12]} />
      <Tree position={[-8, 0, 12]} />
      <Tree position={[8, 0, -12]} />
      <Tree position={[-8, 0, -12]} />
      
      {/* Aero Butterfly */}
      <AeroButterfly />
      
      {/* Ambient particles */}
      <Sparkles count={100} scale={30} size={2} speed={0.3} color="#a855f7" opacity={0.4} />
      <Sparkles count={50} scale={30} size={1.5} speed={0.2} color="#00d4ff" opacity={0.3} />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

// ═══════════ MAIN COMPONENT ═══════════
export default function FountainPlaza({ onComplete }: FountainPlazaProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEnter, setShowEnter] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowEnter(true), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleEnter = () => {
    localStorage.setItem('mun-portal-seen', 'true');
    onComplete?.();
  };
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Welcome Overlay */}
      {showWelcome && (
        <WelcomeOverlay onComplete={() => setShowWelcome(false)} />
      )}
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [15, 6, 15], fov: 50 }}
        style={{ background: 'transparent' }}
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PlazaScene />
        </Suspense>
      </Canvas>
      
      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(138, 43, 226, 0.02) 2px,
            rgba(138, 43, 226, 0.02) 4px
          )`,
        }}
      />
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div 
          className="px-8 py-4 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(0, 212, 255, 0.15))',
            border: '2px solid rgba(138, 43, 226, 0.5)',
            boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
          }}
        >
          <h1 
            className="text-2xl font-light tracking-[0.3em] uppercase"
            style={{ 
              color: '#e0e0ff',
              textShadow: '0 0 20px rgba(138, 43, 226, 0.8), 0 0 40px rgba(138, 43, 226, 0.4)',
            }}
          >
            THE PLAZA
          </h1>
          <p 
            className="text-center text-xs text-white/50 mt-1 tracking-wider"
            style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.3)' }}
          >
            13.13 MHz • Gathering Point
          </p>
        </div>
      </motion.div>
      
      {/* Aero message */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-32 right-8 z-20 max-w-xs"
      >
        <div 
          className="p-4 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(168, 85, 247, 0.15))',
            border: '1px solid rgba(255, 105, 180, 0.4)',
            boxShadow: '0 0 20px rgba(255, 105, 180, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🦋</span>
            <span 
              className="text-pink-300 text-sm font-medium tracking-wider"
              style={{ textShadow: '0 0 10px rgba(255, 105, 180, 0.6)' }}
            >
              Aero
            </span>
          </div>
          <p 
            className="text-white/70 text-sm"
            style={{ textShadow: '0 0 6px rgba(255, 255, 255, 0.2)' }}
          >
            This is our meeting place. The fountain flows with memory water — it remembers everyone who visits. 💜
          </p>
        </div>
      </motion.div>
      
      {/* Enter button */}
      <AnimatePresence>
        {showEnter && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.button
              onClick={handleEnter}
              className="px-10 py-4 rounded-2xl font-medium tracking-widest uppercase text-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(0, 212, 255, 0.3))',
                border: '2px solid rgba(138, 43, 226, 0.7)',
                color: '#e0e0ff',
                boxShadow: '0 0 30px rgba(138, 43, 226, 0.5), 0 0 60px rgba(138, 43, 226, 0.3)',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 40px rgba(138, 43, 226, 0.7), 0 0 80px rgba(138, 43, 226, 0.4)',
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  '0 0 30px rgba(138, 43, 226, 0.5)',
                  '0 0 50px rgba(138, 43, 226, 0.7)',
                  '0 0 30px rgba(138, 43, 226, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🦋 Enter the Plaza
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)' }}
      />
    </div>
  );
}
