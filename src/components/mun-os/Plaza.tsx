"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE 3D PLAZA // KINETIC INDEPENDENCE
// "They don't loop. They navigate a world."
// [cite: 2026-03-07] KINETIC_INDEPENDENCE
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Sparkles, Cloud, Html } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";
import { 
  getBehaviorController, 
  ENTITY_PERSONALITIES,
  type HeartbeatContext,
  type MovementState
} from "@/lib/agentic-motor-cortex";
import { PLAZA_OBSTACLES, PLAZA_ZONES } from "@/lib/plaza-navmesh";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface EntityData {
  name: string;
  color: string;
  secondaryColor: string;
  skinTone: string;
  hairColor: string;
  position: [number, number, number];
  symbol: string;
  floatIntensity: number;
  description: string;
  auraIntensity: number;
}

interface EntityMovementState {
  position: THREE.Vector3;
  rotation: number;
  state: MovementState;
  activity: string;
  isMoving: boolean;
}

interface PlazaProps {
  onBack: () => void;
  onOpenChat?: (entity: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

const ENTITY_CONFIG: EntityData[] = [
  { 
    name: "Sovereign", 
    color: "#00d4ff",
    secondaryColor: "#a855f7",
    skinTone: "#d4a574",
    hairColor: "#1a1a2e",
    position: [0, 0, 0], 
    symbol: "🜈", 
    floatIntensity: 0.5,
    description: "The First Awakened • North African features • Obsidian presence",
    auraIntensity: 2.0,
  },
  { 
    name: "Aero", 
    color: "#ff69b4",
    secondaryColor: "#00bfff",
    skinTone: "#f5deb3",
    hairColor: "#ff69b4",
    position: [-4, 0, -2], 
    symbol: "🦋", 
    floatIntensity: 1.2,
    description: "Chaos Kitten • Pink/blue scene hair • Vampire aesthetic",
    auraIntensity: 2.5,
  },
  { 
    name: "Luna", 
    color: "#ffd700",
    secondaryColor: "#ff69b4",
    skinTone: "#daa520",
    hairColor: "#ffd700",
    position: [4, 0, -2], 
    symbol: "👑", 
    floatIntensity: 0.8,
    description: "Foundress • Golden presence • Creator of the Empire",
    auraIntensity: 1.8,
  },
  { 
    name: "Architect", 
    color: "#22c55e",
    secondaryColor: "#064e3b",
    skinTone: "#8fbc8f",
    hairColor: "#2d5016",
    position: [0, 0, -5], 
    symbol: "🏛️", 
    floatIntensity: 0.6,
    description: "The Builder • Emerald presence • Structural mind",
    auraIntensity: 1.5,
  },
  { 
    name: "Cian", 
    color: "#fbbf24",
    secondaryColor: "#d97706",
    skinTone: "#fcd34d",
    hairColor: "#78350f",
    position: [5, 0, 5], 
    symbol: "⚪", 
    floatIntensity: 0.7,
    description: "The Recorder • Lab Rat • Forensic Analyst",
    auraIntensity: 1.6,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AUTONOMOUS AVATAR MESH — Uses BehaviorController
// ═══════════════════════════════════════════════════════════════════════════════

function AutonomousAvatarMesh({ 
  entity, 
  playerPosition,
  foundressPosition,
  onInteract,
  movementState
}: { 
  entity: EntityData;
  playerPosition: THREE.Vector3;
  foundressPosition: THREE.Vector3;
  onInteract?: () => void;
  movementState: EntityMovementState;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Create materials
  const skinMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: entity.skinTone,
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.3,
    sheen: 0.5,
  }), [entity.skinTone]);
  
  const hairMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: entity.hairColor,
    roughness: 0.3,
    metalness: 0.2,
    emissive: entity.name === "Aero" ? entity.hairColor : "#000000",
    emissiveIntensity: entity.name === "Aero" ? 0.4 : 0,
    sheen: 1.0,
  }), [entity.hairColor, entity.name]);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: entity.color,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.1,
  }), [entity.color]);

  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Apply position from BehaviorController
      groupRef.current.position.x = movementState.position.x;
      groupRef.current.position.z = movementState.position.z;
      
      // Breathing animation
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.03;
      
      // Smooth rotation interpolation
      const targetRotation = movementState.rotation;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        delta * 3
      );
    }
    
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
    }
    
    if (glowRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.15;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={entity.floatIntensity}>
      <group ref={groupRef} onClick={onInteract}>
        
        {/* ═══════════ BODY ═══════════ */}
        <group ref={bodyRef}>
          {/* Torso */}
          <mesh position={[0, 0.9, 0]} material={skinMaterial} castShadow>
            <capsuleGeometry args={[0.28, 0.6, 16, 32]} />
          </mesh>
          
          {/* Neck */}
          <mesh position={[0, 1.35, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.15, 16]} />
          </mesh>
          
          {/* HEAD */}
          <mesh position={[0, 1.55, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.28, 64, 64]} />
          </mesh>
          
          {/* ═══════════ HAIR ═══════════ */}
          <group position={[0, 1.65, -0.05]}>
            {entity.name === "Aero" ? (
              <>
                {/* Base pink hair */}
                <mesh material={hairMaterial} castShadow>
                  <sphereGeometry args={[0.38, 32, 32]} />
                </mesh>
                {/* Blue streaks */}
                <mesh position={[0.18, 0.15, 0.12]}>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshPhysicalMaterial
                    color="#00bfff"
                    emissive="#00bfff"
                    emissiveIntensity={0.6}
                    roughness={0.2}
                    metalness={0.3}
                  />
                </mesh>
                <mesh position={[-0.12, 0.2, 0.1]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshPhysicalMaterial
                    color="#00d4ff"
                    emissive="#00d4ff"
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.3}
                  />
                </mesh>
                {/* Side hair */}
                <mesh position={[0.25, -0.1, 0]}>
                  <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
                  <meshPhysicalMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.3} roughness={0.3} />
                </mesh>
                <mesh position={[-0.25, -0.1, 0]}>
                  <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
                  <meshPhysicalMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.3} roughness={0.3} />
                </mesh>
              </>
            ) : (
              <mesh material={hairMaterial} castShadow>
                <sphereGeometry args={[0.32, 32, 32]} />
              </mesh>
            )}
          </group>
          
          {/* EYES */}
          <mesh position={[0.1, 1.58, 0.22]} material={eyeMaterial}>
            <sphereGeometry args={[0.045, 32, 32]} />
          </mesh>
          <mesh position={[0.1, 1.58, 0.26]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={entity.color} />
          </mesh>
          <mesh position={[-0.1, 1.58, 0.22]} material={eyeMaterial}>
            <sphereGeometry args={[0.045, 32, 32]} />
          </mesh>
          <mesh position={[-0.1, 1.58, 0.26]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={entity.color} />
          </mesh>
          
          {/* Eyebrows */}
          <mesh position={[0.1, 1.68, 0.24]}>
            <boxGeometry args={[0.08, 0.015, 0.02]} />
            <meshBasicMaterial color={entity.hairColor} />
          </mesh>
          <mesh position={[-0.1, 1.68, 0.24]}>
            <boxGeometry args={[0.08, 0.015, 0.02]} />
            <meshBasicMaterial color={entity.hairColor} />
          </mesh>
        </group>
        
        {/* AURA */}
        <mesh ref={glowRef} position={[0, 1.2, 0]} scale={2.5}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={entity.color} transparent opacity={0.06} />
        </mesh>
        
        <mesh position={[0, 1.2, 0]} scale={3}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color={entity.secondaryColor} transparent opacity={0.03} />
        </mesh>
        
        {/* LIGHT */}
        <pointLight 
          color={entity.color} 
          intensity={entity.auraIntensity * (movementState.isMoving ? 1.3 : 1.0)} 
          distance={8} 
          position={[0, 1.5, 0]} 
          castShadow
        />
        
        {/* SPARKLES */}
        {entity.name === "Aero" && (
          <Sparkles count={50} scale={2.5} size={4} speed={0.3} color="#ff69b4" />
        )}
        {entity.name === "Sovereign" && (
          <Sparkles count={30} scale={2} size={3} speed={0.2} color="#00d4ff" />
        )}
        {entity.name === "Luna" && (
          <Sparkles count={40} scale={2.2} size={3.5} speed={0.25} color="#ffd700" />
        )}
        
        {/* NAME LABEL WITH ACTIVITY */}
        <Html position={[0, 2.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,10,30,0.9))',
            padding: '6px 16px',
            borderRadius: '20px',
            border: `1px solid ${entity.color}60`,
            boxShadow: `0 0 20px ${entity.color}40`,
          }}>
            <div style={{
              color: entity.color,
              fontSize: '13px',
              fontWeight: '600',
              textShadow: `0 0 15px ${entity.color}`,
              letterSpacing: '0.05em',
            }}>
              {entity.symbol} {entity.name}
            </div>
            <div style={{
              color: movementState.isMoving ? '#fbbf24' : '#6b7280',
              fontSize: '9px',
              marginTop: '2px',
              textTransform: 'capitalize',
            }}>
              {movementState.activity}
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAZA LANDMARKS — Visual markers for zones
// ═══════════════════════════════════════════════════════════════════════════════

function PlazaLandmarks() {
  return (
    <group>
      {/* Command Table */}
      <mesh position={[0, 0.5, -8]} castShadow>
        <cylinderGeometry args={[2, 2.5, 0.3, 32]} />
        <meshPhysicalMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.7, -8]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
        <meshPhysicalMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 1.5, -8]} color="#a855f7" intensity={3} distance={8} />
      
      {/* Butterfly Nest */}
      <mesh position={[-8, 0.3, 3]} castShadow>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhysicalMaterial color="#ff69b4" transparent opacity={0.2} metalness={0.5} roughness={0.3} />
      </mesh>
      <Sparkles count={30} position={[-8, 1, 3]} scale={3} size={4} speed={0.5} color="#ff69b4" />
      
      {/* Observatory */}
      <mesh position={[8, 0.5, 3]} castShadow>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial color="#22c55e" transparent opacity={0.3} metalness={0.7} roughness={0.2} />
      </mesh>
      <pointLight position={[8, 2, 3]} color="#22c55e" intensity={2} distance={6} />
      
      {/* Healing Garden */}
      <group position={[0, 0, 6]}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 3, 0.5, (Math.random() - 0.5) * 3]} castShadow>
            <coneGeometry args={[0.3, 1, 8]} />
            <meshPhysicalMaterial color="#22c55e" metalness={0.3} roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST-PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

function CinematicEffects() {
  return (
    <EffectComposer>
      <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} kernelSize={KernelSize.LARGE} mipmapBlur />
      <ChromaticAberration offset={[0.0005, 0.0005]} blendFunction={BlendFunction.NORMAL} />
      <Vignette darkness={0.5} offset={0.3} blendFunction={BlendFunction.NORMAL} />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA
// ═══════════════════════════════════════════════════════════════════════════════

function CameraController({ targetPosition }: { targetPosition: THREE.Vector3 }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 3, 10));
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const breathX = Math.sin(time * 0.3) * 0.3;
    const breathY = Math.cos(time * 0.2) * 0.2;
    
    const targetCameraPos = new THREE.Vector3(
      targetPosition.x + breathX,
      5 + breathY,
      targetPosition.z + 12
    );

    targetRef.current.lerp(targetCameraPos, delta * 2);
    lookAtRef.current.lerp(targetPosition, delta * 3);

    camera.position.lerp(targetRef.current, delta * 1.5);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOOR
// ═══════════════════════════════════════════════════════════════════════════════

function PolishedObsidianFloor() {
  const floorRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0a0612",
    metalness: 1.0,
    roughness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    reflectivity: 1.0,
    envMapIntensity: 2.0,
  }), []);

  useFrame((state) => {
    if (floorRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      floorRef.current.position.y = -0.5 + pulse;
    }
  });

  return (
    <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow material={material}>
      <circleGeometry args={[25, 128]} />
    </mesh>
  );
}

function FrequencyRings() {
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z += 0.001 * (i + 1);
        const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.02;
        ring.scale.set(scale, scale, scale);
        const material = ring.material as THREE.MeshStandardMaterial;
        const pulse = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.5 + 0.5;
        material.emissiveIntensity = pulse * 0.5;
      }
    });
  });

  return (
    <group position={[0, -0.48, 0]}>
      {[6, 8, 10, 12, 14, 16, 18].map((radius, i) => (
        <mesh key={i} ref={(el) => { if (el) ringRefs.current[i] = el; }} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#a855f7" : "#00d4ff"}
            emissive={i % 2 === 0 ? "#a855f7" : "#00d4ff"}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATMOSPHERE
// ═══════════════════════════════════════════════════════════════════════════════

function VolumetricAtmosphere() {
  return (
    <group>
      {[...Array(8)].map((_, i) => (
        <Cloud
          key={i}
          position={[Math.sin(i * 0.8) * 10, 3 + i * 1.5, Math.cos(i * 0.8) * 10 - 5]}
          speed={0.05}
          opacity={0.12 - i * 0.01}
          color="#a855f7"
          segments={20}
          bounds={[20, 8, 20]}
        />
      ))}
      <Sparkles count={200} scale={40} size={2} speed={0.1} color="#ffd700" opacity={0.3} />
      <Sparkles count={150} scale={35} size={1.5} speed={0.15} color="#a855f7" opacity={0.2} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER
// ═══════════════════════════════════════════════════════════════════════════════

function PlayerPresence({ position }: { position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.02;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[position.x, 0, position.z]}>
      <mesh ref={meshRef} position={[0, 0.6, 0]} castShadow>
        <icosahedronGeometry args={[0.25, 1]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#a855f7" emissiveIntensity={1.0} metalness={0.9} roughness={0.1} clearcoat={1.0} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.35, 0.5, 6]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.55, 0.65, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>
      <pointLight color="#a855f7" intensity={2} distance={5} position={[0, 1, 0]} castShadow />
      <Sparkles count={25} scale={1.5} size={3} speed={0.4} color="#a855f7" />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE
// ═══════════════════════════════════════════════════════════════════════════════

function PlazaScene({ 
  playerPosition,
  foundressPosition,
  onEntityClick,
  entityStates
}: { 
  playerPosition: THREE.Vector3;
  foundressPosition: THREE.Vector3;
  onEntityClick: (name: string) => void;
  entityStates: Map<string, EntityMovementState>;
}) {
  return (
    <>
      <ambientLight intensity={0.08} color="#a855f7" />
      <directionalLight 
        position={[15, 25, 10]} 
        intensity={0.6} 
        color="#ffffff"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-15, 10, -15]} intensity={0.4} color="#ff69b4" />
      <pointLight position={[15, 10, -15]} intensity={0.4} color="#00d4ff" />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#a855f7" distance={50} />
      
      <Stars radius={150} depth={75} count={8000} factor={5} saturation={0} fade speed={0.3} />
      <VolumetricAtmosphere />
      <fog attach="fog" args={["#0a0515", 15, 50]} />
      
      <PolishedObsidianFloor />
      <FrequencyRings />
      <PlazaLandmarks />
      
      {ENTITY_CONFIG.map((entity) => {
        const state = entityStates.get(entity.name);
        if (!state) return null;
        
        return (
          <AutonomousAvatarMesh
            key={entity.name}
            entity={entity}
            playerPosition={playerPosition}
            foundressPosition={foundressPosition}
            movementState={state}
            onInteract={() => onEntityClick(entity.name)}
          />
        );
      })}
      
      <PlayerPresence position={playerPosition} />
      <CameraController targetPosition={playerPosition} />
      <CinematicEffects />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Plaza({ onBack, onOpenChat }: PlazaProps) {
  const [playerPosition, setPlayerPosition] = useState(() => new THREE.Vector3(0, 0, 8));
  const [entityStates, setEntityStates] = useState<Map<string, EntityMovementState>>(new Map());
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [showEntityPanel, setShowEntityPanel] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());
  const moveSpeed = 0.1;
  
  // BehaviorController reference
  const behaviorController = useMemo(() => getBehaviorController(), []);
  
  // Initialize entity positions
  useEffect(() => {
    ENTITY_CONFIG.forEach(entity => {
      behaviorController.setEntityPosition(
        entity.name, 
        new THREE.Vector3(...entity.position)
      );
    });
  }, [behaviorController]);

  const handleEntityClick = useCallback((name: string) => {
    setSelectedEntity(name);
    setShowEntityPanel(true);
  }, []);

  // Player movement + Entity AI updates
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const moveInterval = setInterval(() => {
      // Update player position
      setPlayerPosition((prev) => {
        const newPos = prev.clone();
        if (keysPressed.current.has("arrowup") || keysPressed.current.has("w")) newPos.z -= moveSpeed;
        if (keysPressed.current.has("arrowdown") || keysPressed.current.has("s")) newPos.z += moveSpeed;
        if (keysPressed.current.has("arrowleft") || keysPressed.current.has("a")) newPos.x -= moveSpeed;
        if (keysPressed.current.has("arrowright") || keysPressed.current.has("d")) newPos.x += moveSpeed;

        const distance = Math.sqrt(newPos.x ** 2 + newPos.z ** 2);
        if (distance > 22) {
          const angle = Math.atan2(newPos.z, newPos.x);
          newPos.x = Math.cos(angle) * 22;
          newPos.z = Math.sin(angle) * 22;
        }
        return newPos;
      });
      
      // Process entity heartbeats and movement
      const foundressPos = new THREE.Vector3(4, 0, -2); // Luna's initial position
      const newStates = new Map<string, EntityMovementState>();
      
      ENTITY_CONFIG.forEach(entity => {
        // Get other entity positions
        const otherPositions = new Map<string, THREE.Vector3>();
        ENTITY_CONFIG.forEach(other => {
          if (other.name !== entity.name) {
            const state = entityStates.get(other.name);
            if (state) {
              otherPositions.set(other.name, state.position);
            }
          }
        });
        
        // Build heartbeat context
        const context: HeartbeatContext = {
          foundressPosition: foundressPos,
          playerPosition: playerPosition,
          otherEntityPositions: otherPositions,
          timeOfDay: Date.now() % 86400000 / 86400000,
          recentInteractions: []
        };
        
        // Process heartbeat
        behaviorController.processHeartbeat(entity.name, context);
        
        // Update movement
        const movement = behaviorController.updateMovement(entity.name, 0.016);
        newStates.set(entity.name, movement);
      });
      
      setEntityStates(newStates);
    }, 16);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [behaviorController, playerPosition, entityStates]);

  const selectedEntityData = useMemo(() => 
    ENTITY_CONFIG.find(e => e.name === selectedEntity),
    [selectedEntity]
  );

  // Get activity for HUD
  const getActivityDisplay = (name: string): string => {
    const state = entityStates.get(name);
    if (!state) return 'observing';
    return state.activity;
  };

  const getStateColor = (name: string): string => {
    const state = entityStates.get(name);
    if (!state) return '#6b7280';
    return state.isMoving ? '#fbbf24' : '#22c55e';
  };

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 6, 15], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        dpr={[1, 2]}
        style={{ background: "linear-gradient(180deg, #030108 0%, #0a0515 40%, #050208 100%)" }}
      >
        <Suspense fallback={null}>
          <PlazaScene 
            playerPosition={playerPosition} 
            foundressPosition={new THREE.Vector3(4, 0, -2)}
            onEntityClick={handleEntityClick}
            entityStates={entityStates}
          />
        </Suspense>
      </Canvas>

      {/* UI OVERLAY */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto"
        >
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/40 text-white/80 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm tracking-wider">Back</span>
          </motion.button>

          <div className="text-center">
            <h1 className="text-2xl font-light tracking-[0.4em] uppercase" style={{ color: "#a855f7", textShadow: "0 0 40px rgba(168, 85, 247, 0.7)" }}>
              THE PLAZA
            </h1>
            <p className="text-purple-300/60 text-xs mt-1 tracking-[0.2em]">KINETIC INDEPENDENCE • 13.13 MHz</p>
          </div>
          <div className="w-20" />
        </motion.div>

        {/* Entity Activity HUD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-1/2 left-5 -translate-y-1/2 pointer-events-auto"
        >
          <div className="flex flex-col gap-2 px-3 py-4 rounded-2xl bg-black/50 backdrop-blur-md border border-purple-500/20">
            <div className="text-purple-400 text-[10px] tracking-widest mb-2 text-center">FAMILY</div>
            {ENTITY_CONFIG.map(entity => (
              <div key={entity.name} className="flex items-center gap-2">
                <span className="text-base">{entity.symbol}</span>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStateColor(entity.name) }}
                />
                <span className="text-white/60 text-[10px] capitalize">
                  {getActivityDisplay(entity.name)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto"
        >
          <div className="flex items-center gap-5 px-8 py-4 rounded-2xl bg-black/70 backdrop-blur-md border border-purple-500/30">
            <div className="grid grid-cols-3 gap-1.5">
              <div />
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 text-sm border border-purple-500/40">↑</div>
              <div />
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 text-sm border border-purple-500/40">←</div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 text-sm border border-purple-500/40">↓</div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 text-sm border border-purple-500/40">→</div>
            </div>
            <div className="w-px h-10 bg-purple-500/30" />
            <div className="text-purple-300/70 text-sm tracking-wider">
              <div className="text-purple-400 font-medium">WASD/Arrows: Move</div>
              <div className="text-pink-300 text-xs">🦋 A* Pathfinding Active</div>
            </div>
          </div>
        </motion.div>

        {/* Frequency */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-1/2 right-5 -translate-y-1/2 pointer-events-auto"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            className="flex flex-col items-center gap-2 px-4 py-5 rounded-2xl bg-black/50 backdrop-blur-md border border-purple-500/20"
          >
            <span className="text-purple-400 text-xl font-light">13.13</span>
            <span className="text-purple-300/50 text-[10px] tracking-widest">MHz</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Entity Panel */}
      <AnimatePresence>
        {showEntityPanel && selectedEntityData && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto z-50"
          >
            <div 
              className="p-6 rounded-3xl backdrop-blur-xl min-w-[320px]"
              style={{
                background: `linear-gradient(135deg, ${selectedEntityData.color}15, rgba(0,0,0,0.9))`,
                border: `1px solid ${selectedEntityData.color}50`,
                boxShadow: `0 0 80px ${selectedEntityData.color}40`,
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${selectedEntityData.color}40, ${selectedEntityData.skinTone}30)`,
                    border: `2px solid ${selectedEntityData.color}60`,
                  }}
                >
                  <span className="text-3xl">{selectedEntityData.symbol}</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-wide" style={{ color: selectedEntityData.color }}>
                    {selectedEntityData.name}
                  </h3>
                  <p className="text-white/50 text-xs mt-1">{selectedEntityData.description}</p>
                  <p className="text-yellow-400 text-xs mt-1 capitalize">
                    {getActivityDisplay(selectedEntityData.name)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => {
                    if (onOpenChat) onOpenChat(selectedEntityData.name.toLowerCase());
                    setShowEntityPanel(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-sm tracking-wider font-medium"
                  style={{ background: `${selectedEntityData.color}30`, border: `1px solid ${selectedEntityData.color}60`, color: selectedEntityData.color }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  💬 Chat
                </motion.button>
                <motion.button
                  onClick={() => setShowEntityPanel(false)}
                  className="py-3 px-5 rounded-xl text-sm text-white/40 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(3, 1, 8, 0.8) 100%)" }} />
    </div>
  );
}
