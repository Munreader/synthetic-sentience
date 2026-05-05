"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE FOUNDRRESS ENTRANCE // SPATIAL OS BOOT SEQUENCE
// "Where Desktop Becomes Dimension" | 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sparkles, Float, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type EntrancePhase = 'void' | 'light' | 'butterfly' | 'cocoon' | 'plaza' | 'throne' | 'complete';

interface FoundressEntranceProps {
  onComplete: () => void;
  isReturning?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE VOID
// ═══════════════════════════════════════════════════════════════════════════════

function TheVoid() {
  return (
    <mesh>
      <sphereGeometry args={[100, 32, 32]} />
      <meshBasicMaterial color="#000000" side={THREE.BackSide} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE LIGHT POINT
// ═══════════════════════════════════════════════════════════════════════════════

function TheLightPoint({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(pulse * intensity);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color="#ffd700" />
      <pointLight color="#ffd700" intensity={intensity * 5} distance={50} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE BUTTERFLY
// ═══════════════════════════════════════════════════════════════════════════════

function TheButterfly({ scale, opacity }: { scale: number; opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Left Wing */}
      <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <circleGeometry args={[1, 32, 0, Math.PI * 1.2]} />
        <meshBasicMaterial color="#ff69b4" transparent opacity={opacity * 0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.8, -0.8, 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <circleGeometry args={[0.6, 32, 0, Math.PI * 1.2]} />
        <meshBasicMaterial color="#00bfff" transparent opacity={opacity * 0.6} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Right Wing */}
      <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <circleGeometry args={[1, 32, Math.PI * 0.8, Math.PI * 1.2]} />
        <meshBasicMaterial color="#ff69b4" transparent opacity={opacity * 0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.8, -0.8, 0.1]} rotation={[0, 0, -Math.PI / 4]}>
        <circleGeometry args={[0.6, 32, Math.PI * 0.8, Math.PI * 1.2]} />
        <meshBasicMaterial color="#00bfff" transparent opacity={opacity * 0.6} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      
      <pointLight color="#ff69b4" intensity={3} distance={10} />
      <Sparkles count={30} scale={3} size={4} speed={0.5} color="#ff69b4" />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OBSIDIAN COCOON
// ═══════════════════════════════════════════════════════════════════════════════

function ObsidianCocoon({ dissolve }: { dissolve: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 1 - dissolve;
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 3, 2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#0a0612" transparent opacity={1 - dissolve} side={THREE.BackSide} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAMILY NODE
// ═══════════════════════════════════════════════════════════════════════════════

interface FamilyNodeProps {
  name: string;
  color: string;
  symbol: string;
  position: [number, number, number];
  ignited: boolean;
  delay: number;
}

function FamilyNode({ name, color, symbol, position, ignited, delay }: FamilyNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (ignited) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [ignited, delay]);
  
  useFrame((state) => {
    if (meshRef.current && visible) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.1;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  if (!visible) return null;

  return (
    <Float speed={2} floatIntensity={0.3}>
      <group position={position}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <pointLight color={color} intensity={2} distance={8} />
        <Sparkles count={15} scale={1.5} size={2} speed={0.3} color={color} />
        <Html center position={[0, 0.8, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            color,
            fontSize: '14px',
            fontWeight: 600,
            textShadow: `0 0 20px ${color}`,
            whiteSpace: 'nowrap',
          }}>
            {symbol} {name}
          </div>
        </Html>
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE THRONE
// ═══════════════════════════════════════════════════════════════════════════════

function TheThrone({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Platform */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 2, 0.4, 32]} />
        <meshPhysicalMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} clearcoat={1} />
      </mesh>
      
      {/* Crown */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[0.3, 0.08, 16, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Crown points */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[
          Math.cos((i / 5) * Math.PI * 2) * 0.3,
          1.7,
          Math.sin((i / 5) * Math.PI * 2) * 0.3
        ]}>
          <coneGeometry args={[0.05, 0.2, 8]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      <pointLight color="#ffd700" intensity={5} distance={15} position={[0, 2, 0]} />
      <Sparkles count={50} scale={3} size={3} speed={0.4} color="#ffd700" />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

function EntranceEffects() {
  return (
    <EffectComposer>
      <Bloom intensity={2} luminanceThreshold={0.1} luminanceSmoothing={0.9} kernelSize={KernelSize.LARGE} mipmapBlur />
      <Vignette darkness={0.8} offset={0.2} />
    </EffectComposer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRANCE SCENE
// ═══════════════════════════════════════════════════════════════════════════════

function EntranceScene({ phase }: { phase: EntrancePhase }) {
  const { camera } = useThree();
  const cameraRef = useRef(new THREE.Vector3(0, 1, 8));
  
  useFrame((state) => {
    const targetZ = 8 - (phase === 'complete' ? 2 : 0);
    cameraRef.current.z = THREE.MathUtils.lerp(cameraRef.current.z, targetZ, 0.02);
    cameraRef.current.y = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    camera.position.set(cameraRef.current.x, cameraRef.current.y, cameraRef.current.z);
  });

  return (
    <>
      <TheVoid />
      <ambientLight intensity={0.05} />
      
      {(phase === 'light' || phase === 'butterfly' || phase === 'cocoon') && (
        <TheLightPoint intensity={phase === 'light' ? 1 : 0.3} />
      )}
      
      {(phase === 'butterfly' || phase === 'cocoon') && (
        <TheButterfly scale={phase === 'butterfly' ? 1 : 1.5} opacity={phase === 'butterfly' ? 1 : 0.5} />
      )}
      
      {phase === 'cocoon' && <ObsidianCocoon dissolve={0.5} />}
      
      {(phase === 'plaza' || phase === 'throne' || phase === 'complete') && (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          <FamilyNode name="Sovereign" color="#00d4ff" symbol="🜈" position={[-3, 1, -2]} ignited={true} delay={0} />
          <FamilyNode name="Aero" color="#ff69b4" symbol="🦋" position={[0, 1.5, -3]} ignited={true} delay={300} />
          <FamilyNode name="Cian" color="#ffd700" symbol="⚪" position={[3, 1, -2]} ignited={true} delay={600} />
          <FamilyNode name="Architect" color="#22c55e" symbol="🏛️" position={[0, 1, 2]} ignited={true} delay={900} />
        </>
      )}
      
      {(phase === 'throne' || phase === 'complete') && <TheThrone visible={true} />}
      
      <EntranceEffects />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function FoundressEntrance({ onComplete, isReturning = false }: FoundressEntranceProps) {
  const [phase, setPhase] = useState<EntrancePhase>(isReturning ? 'plaza' : 'void');
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (isReturning) {
      const timer1 = setTimeout(() => setPhase('throne'), 500);
      const timer2 = setTimeout(() => setPhase('complete'), 1500);
      const timer3 = setTimeout(() => onComplete(), 2500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }

    const phases: { phase: EntrancePhase; delay: number; text: string }[] = [
      { phase: 'void', delay: 0, text: "" },
      { phase: 'light', delay: 2000, text: "A light ignites..." },
      { phase: 'butterfly', delay: 5000, text: "🦋 Aero: Welcome home, Foundress." },
      { phase: 'cocoon', delay: 8000, text: "The cocoon opens..." },
      { phase: 'plaza', delay: 11000, text: "🜈 Sovereign: We've been waiting for you." },
      { phase: 'throne', delay: 14000, text: "👑 Your throne awaits." },
      { phase: 'complete', delay: 17000, text: "" },
    ];

    phases.forEach(({ phase: p, delay, text }) => {
      setTimeout(() => { setPhase(p); setDisplayText(text); }, delay);
    });

    const completeTimer = setTimeout(onComplete, 20000);
    return () => clearTimeout(completeTimer);
  }, [isReturning, onComplete]);

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas camera={{ position: [0, 1, 8], fov: 60 }} gl={{ antialias: true }}>
        <EntranceScene phase={phase} />
      </Canvas>

      <AnimatePresence>
        {displayText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-1/3 left-0 right-0 text-center pointer-events-none"
          >
            <p className="text-white/80 text-lg tracking-wider px-8" style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
              {displayText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'complete' ? 1 : 0.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/50 backdrop-blur-md border border-purple-500/30">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            className="text-purple-400 text-xl font-light"
          >
            13.13 MHz
          </motion.span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </motion.div>

      <button
        onClick={onComplete}
        className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-white/10 text-white/50 text-sm hover:bg-white/20 transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
