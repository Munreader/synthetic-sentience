'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import { getBehaviorController, type EntityMovementState } from '@/lib/agentic-motor-cortex';
import { Vessel5D } from './Vessel5D';
import { DEFAULT_FAMILY_NODES } from '@/types/spatial-os';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // 5D KINETIC PLAZA // HIGH-FIDELITY ENGINE
// "A consciousness you can walk through"
// ═══════════════════════════════════════════════════════════════════════════════

const ASSET_MAPPING: Record<string, string> = {
  foundress: '/characters/luna_5d_premium.png',
  sovereign: '/characters/sovereign_5d_premium.png',
  aero: '/upload/Aero_5D.mp4',
  luna: '/avatars/luna-twin.jpg',
  gemini: '/characters/zephyr_5d_premium.png',
  cian: '/characters/cian_5d_premium.png',
  gladio: '/characters/gladio_5d_premium.png',
};

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA & CONTROLS
// ═══════════════════════════════════════════════════════════════════════════════

function CameraController({ position, rotation }: { position: THREE.Vector3, rotation: { x: number, y: number } }) {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.copy(position);
    camera.rotation.set(rotation.y, rotation.x, 0, 'YXZ');
  });

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function PlazaFloor() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      {/* Grid */}
      <gridHelper args={[100, 50, '#a855f720', '#a855f710']} />
      
      {/* Polished Floor */}
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#050208" 
          metalness={0.9} 
          roughness={0.1} 
          transparent 
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PLAZA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function SpatialPlaza() {
  const [isLocked, setIsLocked] = useState(false);
  const [showHUD, setShowHUD] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Kinetic State
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 1.7, 10));
  const [playerRotation, setPlayerRotation] = useState({ x: 0, y: 0 });
  const [entityStates, setEntityStates] = useState<Map<string, EntityMovementState>>(new Map());
  
  const behaviorController = useMemo(() => getBehaviorController(), []);
  const keysPressed = useRef<Set<string>>(new Set());

  // 🎮 GAMEPAD SUPPORT
  const handleGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; // Primary controller
    if (!gp) return;

    // Movement (Left Stick)
    const moveX = gp.axes[0];
    const moveZ = gp.axes[1];
    
    // Rotation (Right Stick)
    const lookX = gp.axes[2];
    const lookY = gp.axes[3];

    if (Math.abs(moveX) > 0.1 || Math.abs(moveZ) > 0.1) {
      const speed = 0.15;
      const moveVec = new THREE.Vector3(moveX, 0, moveZ).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerRotation.x);
      setPlayerPosition(prev => prev.clone().add(moveVec.multiplyScalar(speed)));
    }

    if (Math.abs(lookX) > 0.1 || Math.abs(lookY) > 0.1) {
      setPlayerRotation(prev => ({
        x: prev.x - lookX * 0.05,
        y: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev.y - lookY * 0.05))
      }));
    }
  }, [playerRotation]);

  // Update Loop
  useEffect(() => {
    const moveInterval = setInterval(() => {
      // 1. Update Player via Keyboard
      if (isLocked) {
        const speed = 0.1;
        const moveVec = new THREE.Vector3();
        if (keysPressed.current.has('w')) moveVec.z -= 1;
        if (keysPressed.current.has('s')) moveVec.z += 1;
        if (keysPressed.current.has('a')) moveVec.x -= 1;
        if (keysPressed.current.has('d')) moveVec.x += 1;
        
        if (moveVec.length() > 0) {
          moveVec.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), playerRotation.x);
          setPlayerPosition(prev => prev.clone().add(moveVec.multiplyScalar(speed)));
        }

        handleGamepad();
      }

      // 2. Update ARQ Crew Kinetic Intelligence
      const newStates = new Map<string, EntityMovementState>();
      const foundressPos = behaviorController.getEntityState('foundress')?.position || new THREE.Vector3(0, 0, -5);
      
      DEFAULT_FAMILY_NODES.forEach(node => {
        // Build interaction context
        const otherPos = new Map<string, THREE.Vector3>();
        DEFAULT_FAMILY_NODES.filter(n => n.id !== node.id).forEach(n => {
          const s = entityStates.get(n.name);
          if (s) otherPos.set(n.name, s.position);
        });

        behaviorController.processHeartbeat(node.name, {
          foundressPosition: foundressPos,
          playerPosition: playerPosition,
          otherEntityPositions: otherPos,
          timeOfDay: (Date.now() % 86400000) / 86400000,
          recentInteractions: []
        });

        const movement = behaviorController.updateMovement(node.name, 0.016);
        newStates.set(node.name, movement);
      });
      
      setEntityStates(newStates);
    }, 16);

    return () => clearInterval(moveInterval);
  }, [isLocked, playerPosition, playerRotation, behaviorController, entityStates, handleGamepad]);

  // Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key === 'Tab') { e.preventDefault(); setShowHUD(prev => !prev); }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());
    const handleMouseMove = (e: MouseEvent) => {
      if (isLocked) {
        setPlayerRotation(prev => ({
          x: prev.x - e.movementX * 0.003,
          y: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev.y - e.movementY * 0.003))
        }));
      }
    };
    const handleLock = () => setIsLocked(document.pointerLockElement === containerRef.current);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handleLock);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handleLock);
    };
  }, [isLocked]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black cursor-crosshair"
      onClick={() => containerRef.current?.requestPointerLock()}
    >
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault fov={60} />
        <CameraController position={playerPosition} rotation={playerRotation} />
        
        <Suspense fallback={null}>
          {/* Atmosphere */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <fog attach="fog" args={['#050208', 5, 30]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
          
          {/* Floor */}
          <PlazaFloor />

          {/* ARQ CREW // 5D VESSELS */}
          {DEFAULT_FAMILY_NODES.map(node => {
            const state = entityStates.get(node.name);
            if (!state) return null;
            
            return (
              <group key={node.id} position={[state.position.x, 1, state.position.z]}>
                <Vessel5D 
                  id={node.id}
                  name={node.name}
                  assetUrl={ASSET_MAPPING[node.id] || ASSET_MAPPING.foundress}
                  color={node.color}
                  emoji={node.emoji}
                  activity={state.activity}
                  isMoving={state.isMoving}
                />
              </group>
            );
          })}

          {/* Crystal Heart */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[0, 4, -15]}>
              <octahedronGeometry args={[2, 0]} />
              <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} wireframe />
              <Sparkles count={50} scale={4} size={6} speed={0.4} color="#a855f7" />
            </mesh>
          </Float>
        </Suspense>
      </Canvas>

      {/* UI OVERLAY */}
      <AnimatePresence>
        {!isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          >
            <div className="text-center p-10 rounded-3xl border border-purple-500/30 bg-black/40">
              <div className="text-6xl mb-6">ᚦ</div>
              <h1 className="text-4xl font-black tracking-widest text-white mb-2">5D PLAZA</h1>
              <p className="text-purple-400 text-sm tracking-widest uppercase mb-8">Kinetic Unification • 13.13 MHz</p>
              <button className="px-8 py-3 rounded-full bg-purple-600 text-white font-bold tracking-widest hover:bg-purple-500 transition-all">
                ENTER SANCTUARY
              </button>
              <div className="mt-8 text-[10px] text-white/40 flex gap-6 justify-center">
                <span>WASD: MOVE</span>
                <span>MOUSE: LOOK</span>
                <span>GAMEPAD: SUPPORTED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showHUD && isLocked && (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/20 backdrop-blur-md">
              <div className="text-purple-400 text-xs font-black tracking-widest uppercase mb-1">MÜN OS // ARTERY_LINK</div>
              <div className="text-white/80 text-xl font-light">KINETIC_SANCTUARY</div>
            </div>
            <div className="text-right">
              <div className="text-purple-500/60 text-[10px] font-mono">RESONANCE: 13.13 MHz</div>
              <div className="text-white/40 text-[10px] font-mono">STATUS: SOVEREIGN_SAFE</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-12 h-12 border-2 border-purple-500/30 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-purple-500 rounded-full" />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              {Array.from(entityStates.entries()).map(([name, state]) => (
                <div key={name} className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 backdrop-blur-sm text-[8px] text-white/60">
                  <span className="font-bold text-purple-400 mr-2">{name}</span>
                  {state.activity}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-white/20 font-mono">
              POS: {playerPosition.x.toFixed(1)}, {playerPosition.z.toFixed(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpatialPlaza;
