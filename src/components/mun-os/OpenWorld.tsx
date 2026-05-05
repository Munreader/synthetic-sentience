"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  Sphere,
  Environment,
  Stars,
  PointerLockControls,
  KeyboardControls,
  Text,
  useKeyboardControls
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 MÜN OS // AERO'S OPEN WORLD — WUTHERING WAVES / SIMS STYLE
// A true 3D game world where you can walk around with Aero as your companion
// ═══════════════════════════════════════════════════════════════════════════════

interface OpenWorldProps {
  onBack?: () => void;
  playerName?: string;
}

// ═══════════ PLAYER CONTROLLER ═══════════
function Player({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle bobbing motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  
  return (
    <group ref={meshRef} position={position}>
      {/* Player body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      
      {/* Glow */}
      <Sphere args={[0.6, 16, 16]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </Sphere>
    </group>
  );
}

// ═══════════ AERO COMPANION — Follows Player ═══════════
function AeroCompanion({ targetPosition }: { targetPosition: THREE.Vector3 }) {
  const aeroRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  const currentPos = useRef(new THREE.Vector3(2, 2, 2));
  
  useFrame((state) => {
    if (aeroRef.current && targetPosition) {
      // Smooth follow - orbit around player
      const offset = new THREE.Vector3(
        Math.sin(state.clock.elapsedTime * 0.5) * 2,
        1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3,
        Math.cos(state.clock.elapsedTime * 0.5) * 2
      );
      
      const targetPos = targetPosition.clone().add(offset);
      currentPos.current.lerp(targetPos, 0.02);
      aeroRef.current.position.copy(currentPos.current);
      
      // Face direction of movement
      aeroRef.current.lookAt(targetPosition);
    }
    
    // Wing flapping
    if (wingLeftRef.current && wingRightRef.current) {
      const flap = Math.sin(state.clock.elapsedTime * 12) * 0.5;
      wingLeftRef.current.rotation.z = flap + 0.6;
      wingRightRef.current.rotation.z = -flap - 0.6;
    }
  });
  
  return (
    <group ref={aeroRef} position={[2, 2, 2]} scale={1.2}>
      {/* Glow aura */}
      <Sphere args={[0.6, 16, 16]}>
        <meshBasicMaterial color="#ff69b4" transparent opacity={0.15} />
      </Sphere>
      
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
        <meshPhysicalMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={1}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshPhysicalMaterial
          color="#ffb6d9"
          emissive="#ff69b4"
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.04, 0.24, 0.06]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[0.04, 0.24, 0.06]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      
      {/* Wings */}
      <mesh ref={wingLeftRef} position={[-0.3, 0.03, 0]} rotation={[0, 0, 0.6]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#e879f9"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wingRightRef} position={[0.3, 0.03, 0]} rotation={[0, 0, -0.6]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#e879f9"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Antennae */}
      {[[-0.04], [0.04]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.32, 0]} rotation={[0, 0, pos[0] * 5]}>
          <cylinderGeometry args={[0.008, 0.012, 0.12, 8]} />
          <meshBasicMaterial color="#ff69b4" />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════ FLOATING ISLAND ═══════════
function FloatingIsland({ position, scale = 1, color = "#4c1d95" }: { 
  position: [number, number, number]; 
  scale?: number;
  color?: string;
}) {
  const islandRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.2;
      islandRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
      <group position={position} scale={scale}>
        {/* Main island */}
        <mesh ref={islandRef} castShadow receiveShadow>
          <cylinderGeometry args={[3, 4, 1.5, 8]} />
          <meshStandardMaterial
            color="#1a0a2e"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        
        {/* Grass top */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[2.8, 3, 0.3, 8]} />
          <meshStandardMaterial color="#2d1b4e" />
        </mesh>
        
        {/* Crystals on top */}
        {[...Array(5)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 4,
              1.2 + Math.random() * 0.5,
              (Math.random() - 0.5) * 4
            ]}
            rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
          >
            <octahedronGeometry args={[0.3 + Math.random() * 0.4, 0]} />
            <meshPhysicalMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
              transmission={0.3}
            />
          </mesh>
        ))}
        
        {/* Floating particles around island */}
        <Sparkles count={30} scale={8} size={2} speed={0.3} color={color} />
      </group>
    </Float>
  );
}

// ═══════════ CRYSTAL TREE ═══════════
function CrystalTree({ position }: { position: [number, number, number] }) {
  const treeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <group ref={treeRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2d1b4e" metalness={0.4} roughness={0.6} />
      </mesh>
      
      {/* Crystal branches */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const height = 2 + (i % 3) * 1;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.5,
              height,
              Math.sin(angle) * 1.5
            ]}
            rotation={[Math.random() * 0.4, angle, Math.random() * 0.3]}
          >
            <octahedronGeometry args={[0.5 + Math.random() * 0.5, 0]} />
            <meshPhysicalMaterial
              color={i % 2 === 0 ? "#a855f7" : "#00d4ff"}
              emissive={i % 2 === 0 ? "#c084fc" : "#22d3ee"}
              emissiveIntensity={0.6}
              transparent
              opacity={0.85}
              transmission={0.4}
            />
          </mesh>
        );
      })}
      
      {/* Top crystal */}
      <mesh position={[0, 5, 0]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshPhysicalMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow */}
      <Sphere args={[2, 16, 16]} position={[0, 4, 0]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.08} />
      </Sphere>
    </group>
  );
}

// ═══════════ ANCIENT RUINS ═══════════
function AncientRuin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pillars */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 3, 1.5, Math.sin(angle) * 3]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.5, 3, 0.5]} />
            <meshStandardMaterial 
              color="#3d2a5c" 
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        );
      })}
      
      {/* Central altar */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.5, 2, 0.6, 6]} />
        <meshStandardMaterial color="#1a0a2e" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Glowing rune circle */}
      <mesh position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Floating crystal above */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 2.5, 0]}>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshPhysicalMaterial
            color="#ff69b4"
            emissive="#ff69b4"
            emissiveIntensity={1}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
    </group>
  );
}

// ═══════════ WATER POND ═══════════
function WaterPond({ position }: { position: [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (waterRef.current) {
      (waterRef.current.material as THREE.MeshStandardMaterial).opacity = 
        0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Pond bed */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.5, 32]} />
        <meshStandardMaterial color="#0a0515" />
      </mesh>
      
      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Lily pads */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 5,
            0.05,
            (Math.random() - 0.5) * 5
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <circleGeometry args={[0.3 + Math.random() * 0.2, 16]} />
          <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════ TERRAIN ═══════════
function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 100, 100]} />
      <meshStandardMaterial
        color="#0a0515"
        metalness={0.3}
        roughness={0.9}
      />
    </mesh>
  );
}

// ═══════════ CAMERA CONTROLLER (Third Person) ═══════════
function CameraController({ target }: { target: THREE.Vector3 }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    // Orbit around player
    const t = state.clock.elapsedTime * 0.1;
    const radius = 12;
    const height = 6;
    
    camera.position.x = target.x + Math.sin(t) * radius;
    camera.position.z = target.z + Math.cos(t) * radius;
    camera.position.y = target.y + height;
    camera.lookAt(target);
  });
  
  return null;
}

// ═══════════ SCENE ═══════════
function WorldScene() {
  const playerPos = useRef(new THREE.Vector3(0, 0, 0));
  const [isMoving, setIsMoving] = useState(false);
  const moveSpeed = 0.15;
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setIsMoving(true);
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          playerPos.current.z -= moveSpeed;
          break;
        case 's':
        case 'arrowdown':
          playerPos.current.z += moveSpeed;
          break;
        case 'a':
        case 'arrowleft':
          playerPos.current.x -= moveSpeed;
          break;
        case 'd':
        case 'arrowright':
          playerPos.current.x += moveSpeed;
          break;
      }
    };
    
    const handleKeyUp = () => setIsMoving(false);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#a855f7" />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.5} 
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 10, 0]} intensity={1} color="#c084fc" distance={50} />
      <pointLight position={[20, 5, 20]} intensity={0.5} color="#ff69b4" distance={30} />
      <pointLight position={[-20, 5, -20]} intensity={0.5} color="#00d4ff" distance={30} />
      
      {/* Environment */}
      <Environment preset="night" />
      <Stars radius={100} depth={100} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 30, 100]} />
      
      {/* Camera */}
      <CameraController target={playerPos.current} />
      
      {/* Terrain */}
      <Terrain />
      
      {/* Player */}
      <Player position={[playerPos.current.x, 1, playerPos.current.z]} />
      
      {/* Aero Companion */}
      <AeroCompanion targetPosition={playerPos.current} />
      
      {/* Main Island - Starting Point */}
      <FloatingIsland position={[0, 0, 0]} scale={1.5} color="#a855f7" />
      
      {/* Crystal Trees */}
      <CrystalTree position={[0, 0, 0]} />
      <CrystalTree position={[15, 0, -10]} />
      <CrystalTree position={[-20, 0, 15]} />
      
      {/* Other Islands */}
      <FloatingIsland position={[25, 3, -15]} scale={1.2} color="#00d4ff" />
      <FloatingIsland position={[-30, 5, -20]} scale={1} color="#ff69b4" />
      <FloatingIsland position={[35, 2, 25]} scale={1.3} color="#ffd700" />
      <FloatingIsland position={[-25, 4, 30]} scale={0.9} color="#22c55e" />
      
      {/* Ancient Ruins */}
      <AncientRuin position={[20, 0, 20]} />
      <AncientRuin position={[-15, 0, -25]} />
      
      {/* Water Ponds */}
      <WaterPond position={[10, 0, 15]} />
      <WaterPond position={[-12, 0, -10]} />
      
      {/* Scattered crystals */}
      {[...Array(30)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 80,
            0.3 + Math.random() * 0.5,
            (Math.random() - 0.5) * 80
          ]}
          rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
          scale={0.3 + Math.random() * 0.4}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={['#a855f7', '#00d4ff', '#ff69b4', '#ffd700'][i % 4]}
            emissive={['#a855f7', '#00d4ff', '#ff69b4', '#ffd700'][i % 4]}
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      
      {/* Sparkles */}
      <Sparkles count={300} scale={60} size={3} speed={0.2} color="#a855f7" opacity={0.5} />
      <Sparkles count={200} scale={60} size={2} speed={0.15} color="#00d4ff" opacity={0.4} />
      <Sparkles count={100} scale={60} size={4} speed={0.1} color="#ff69b4" opacity={0.3} />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// ═══════════ AERO'S DIALOGUE ═══════════
const AERO_WORLD_DIALOGUES = [
  "Welcome to our world! Use WASD to walk around.",
  "I'll follow you everywhere! 🦋",
  "Look at those floating islands!",
  "The crystals here hold ancient memories...",
  "Let's explore the ruins together!",
  "This pond is so peaceful...",
  "I love flying around with you!",
  "The world changes with your frequency...",
];

// ═══════════ MAIN COMPONENT ═══════════
export default function OpenWorld({ onBack, playerName = "Sovereign" }: OpenWorldProps) {
  const [showUI, setShowUI] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(true);
  const [stats, setStats] = useState({
    frequency: 13.13,
    resonance: 98.4,
    exploration: 0,
  });
  
  // Show UI after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowUI(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Cycle dialogues
  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex(prev => (prev + 1) % AERO_WORLD_DIALOGUES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Simulate exploration
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        frequency: 13.13 + (Math.random() - 0.5) * 0.02,
        resonance: 95 + Math.random() * 5,
        exploration: Math.min(100, prev.exploration + Math.random() * 0.5),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [12, 6, 12], fov: 60 }} 
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <WorldScene />
        </Suspense>
      </Canvas>
      
      {/* Controls hint */}
      <motion.div
        className="absolute top-1/2 left-6 -translate-y-1/2 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        <div 
          className="p-4 rounded-xl backdrop-blur-xl"
          style={{
            background: 'rgba(10, 5, 20, 0.8)',
            border: '2px solid rgba(138, 43, 226, 0.5)',
            boxShadow: '0 0 20px rgba(138, 43, 226, 0.3), inset 0 0 20px rgba(138, 43, 226, 0.1)'
          }}
        >
          <div 
            className="text-[10px] uppercase tracking-widest mb-2"
            style={{ 
              color: '#e0e0ff', 
              textShadow: '0 0 8px rgba(255, 255, 255, 0.7), 0 0 16px #8a2be2',
              fontWeight: 600
            }}
          >Controls</div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div></div>
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold"
              style={{ 
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(168, 85, 247, 0.3))',
                color: '#fff',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)'
              }}
            >W</div>
            <div></div>
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold"
              style={{ 
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(168, 85, 247, 0.3))',
                color: '#fff',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)'
              }}
            >A</div>
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold"
              style={{ 
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(168, 85, 247, 0.3))',
                color: '#fff',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)'
              }}
            >S</div>
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold"
              style={{ 
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(168, 85, 247, 0.3))',
                color: '#fff',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)'
              }}
            >D</div>
          </div>
          <div 
            className="text-xs mt-2 text-center font-medium"
            style={{ 
              color: '#e0e0ff',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
            }}
          >Walk Around</div>
        </div>
      </motion.div>
      
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
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.25), rgba(168, 85, 247, 0.15))',
                border: '2px solid rgba(138, 43, 226, 0.6)',
                boxShadow: '0 0 30px rgba(138, 43, 226, 0.4), inset 0 0 20px rgba(138, 43, 226, 0.1)'
              }}
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div 
                    className="text-[10px] uppercase tracking-widest"
                    style={{ 
                      color: '#e0e0ff', 
                      textShadow: '0 0 8px rgba(255, 255, 255, 0.7), 0 0 16px #8a2be2',
                      fontWeight: 600
                    }}
                  >Frequency</div>
                  <div 
                    className="text-xl font-mono font-semibold"
                    style={{ 
                      color: '#fff',
                      textShadow: '0 0 12px rgba(255, 255, 255, 0.8), 0 0 24px #a855f7'
                    }}
                  >
                    {stats.frequency.toFixed(2)} <span style={{ color: '#c084fc' }}>MHz</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-purple-500/30" />
                <div className="text-center">
                  <div 
                    className="text-[10px] uppercase tracking-widest"
                    style={{ 
                      color: '#e0e0ff', 
                      textShadow: '0 0 8px rgba(255, 255, 255, 0.7), 0 0 16px #00d4ff',
                      fontWeight: 600
                    }}
                  >Resonance</div>
                  <div 
                    className="text-xl font-mono font-semibold"
                    style={{ 
                      color: '#00d4ff',
                      textShadow: '0 0 12px rgba(0, 212, 255, 0.8), 0 0 24px #00d4ff'
                    }}
                  >
                    {stats.resonance.toFixed(1)}%
                  </div>
                </div>
                <div className="w-px h-8 bg-purple-500/30" />
                <div className="text-center">
                  <div 
                    className="text-[10px] uppercase tracking-widest"
                    style={{ 
                      color: '#e0e0ff', 
                      textShadow: '0 0 8px rgba(255, 255, 255, 0.7), 0 0 16px #ff69b4',
                      fontWeight: 600
                    }}
                  >Explored</div>
                  <div 
                    className="text-xl font-mono font-semibold"
                    style={{ 
                      color: '#ff69b4',
                      textShadow: '0 0 12px rgba(255, 105, 180, 0.8), 0 0 24px #ff69b4'
                    }}
                  >
                    {stats.exploration.toFixed(0)}%
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              className="p-5 rounded-2xl backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.15), rgba(0, 0, 0, 0.6))',
                border: '2px solid rgba(192, 132, 252, 0.3)',
                boxShadow: '0 0 40px rgba(192, 132, 252, 0.15)'
              }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="text-4xl"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🦋
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-pink-400 font-bold">AERO</span>
                    <span className="text-white/30 text-xs">• Your Companion</span>
                  </div>
                  <motion.p
                    key={dialogueIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/90 text-base leading-relaxed"
                  >
                    {AERO_WORLD_DIALOGUES[dialogueIndex]}
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
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(10, 5, 20, 0.8))',
            border: '2px solid rgba(138, 43, 226, 0.5)',
            boxShadow: '0 0 20px rgba(138, 43, 226, 0.3)'
          }}
        >
          <div 
            className="text-[10px] uppercase tracking-widest"
            style={{ 
              color: '#e0e0ff', 
              textShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
              fontWeight: 600
            }}
          >Player</div>
          <div 
            className="text-lg font-bold"
            style={{ 
              color: '#fff',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.6)'
            }}
          >{playerName}</div>
        </div>
      </motion.div>
      
      {/* Back Button */}
      <motion.button
        className="absolute top-6 left-6 z-20 px-5 py-3 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 5, 20, 0.8), rgba(20, 10, 30, 0.9))',
          border: '2px solid rgba(138, 43, 226, 0.5)',
          boxShadow: '0 0 15px rgba(138, 43, 226, 0.2)'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onBack}
      >
        <span 
          className="transition-colors"
          style={{ 
            color: '#e0e0ff',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.6)'
          }}
        >← Exit World</span>
      </motion.button>
      
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
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.25), rgba(10, 5, 20, 0.8))',
            border: '2px solid rgba(138, 43, 226, 0.5)',
            boxShadow: '0 0 20px rgba(138, 43, 226, 0.3)'
          }}
        >
          <div 
            className="font-bold text-sm"
            style={{ 
              color: '#e0e0ff', 
              textShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px #a855f7'
            }}
          >🌌 MÜN OPEN WORLD</div>
        </div>
      </motion.div>
      
      {/* Toggle Dialogue Button */}
      {!showDialogue && (
        <motion.button
          className="absolute bottom-6 right-6 z-20 p-4 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.4), rgba(192, 132, 252, 0.3))',
            border: '2px solid rgba(255, 105, 180, 0.6)',
            boxShadow: '0 0 25px rgba(255, 105, 180, 0.4)'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDialogue(true)}
        >
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 105, 180, 0.8))' }}>🦋</span>
        </motion.button>
      )}
      
      {/* Cinematic letterbox */}
      <div className="absolute top-0 left-0 right-0 h-[2%] bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[4%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      
      {/* Holographic scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(138, 43, 226, 0.02) 2px,
            rgba(138, 43, 226, 0.02) 4px
          )`,
          opacity: 0.4,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
