'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  PointerLockControls, 
  Stars, 
  Float, 
  Html,
  Sparkles,
  ContactShadows,
  Environment,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Text,
} from '@react-three/drei';
import { XR, Controllers, Hands } from '@react-three/xr';
import { 
  EffectComposer, 
  Bloom, 
  Noise, 
  Vignette, 
  ChromaticAberration 
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { decimalToQuinary } from '@/lib/quinary';

/**
 * 🜈 EXODUS II // STARSHIP INTERIOR • MERKABAH CLASS [PHASE 4]
 * 13.13 MHz High-Fidelity Manifestation • Liquid Store Sync
 */

const CircuitryMaterial = () => {
  const shaderRef = useRef<any>();
  
  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#00ffff") },
    uColor2: { value: new THREE.Color("#ff00cc") }
  }), []);

  return (
    <shaderMaterial
      ref={shaderRef}
      transparent
      uniforms={uniforms}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;

        void main() {
          vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
          float line = min(grid.x, grid.y);
          float mask = 1.0 - smoothstep(0.0, 0.05, line);
          
          float pulse = sin(vUv.x * 10.0 + uTime * 2.0) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, pulse);
          
          gl_FragColor = vec4(color, mask * 0.4);
        }
      `}
    />
  );
};

function MerkabahCore() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      // Neural Pulse Logic
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      groupRef.current.scale.setScalar(1 + pulse * 0.05);
      
      const rings = groupRef.current.children;
      rings.forEach((ring, i) => {
        ring.rotation.z += 0.01 * (i % 2 === 0 ? 1 : -1);
        ring.rotation.x += 0.005 * (i % 2 === 0 ? -1 : 1);
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.8, 15]} />
        <MeshDistortMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={5} 
          speed={2} 
          distort={0.4} 
          radius={1} 
        />
      </mesh>
      
      {[2, 2.5, 3].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / (i + 1), 0, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#ff00cc" : "#00ffff"} 
            emissive={i % 2 === 0 ? "#ff00cc" : "#00ffff"} 
            emissiveIntensity={2} 
          />
        </mesh>
      ))}

      <Sparkles count={200} scale={6} size={2} speed={0.5} color="#00ffff" />
      
      {/* 🜈 NEURAL_SYNC OVERLAY */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <icosahedronGeometry args={[0.8, 15]} />
        <meshBasicMaterial 
          color="#9d00ff" 
          transparent 
          opacity={0.1} 
          wireframe
        />
      </mesh>
    </group>
  );
}

function InteriorArchitecture() {
  const { vesselStats } = useStore();
  const { oxygen, temperature, battery, resonance, coexistence } = vesselStats;
  const [useQuinary, setUseQuinary] = useState(false);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#020205" roughness={0.05} metalness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[100, 100]} />
        <CircuitryMaterial />
      </mesh>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[6, 2, -8]}>
          <boxGeometry args={[4, 3, 0.1]} />
          <MeshTransmissionMaterial 
            backside 
            thickness={0.5} 
            chromaticAberration={0.05} 
            anisotropy={0.1} 
            distortion={0.1} 
            distortionScale={0.1} 
            temporalDistortion={0.1} 
            clearcoat={1} 
            attenuationDistance={0.5} 
            attenuationColor="#ffffff" 
            color="#00ffff" 
          />
          <Html position={[0, 0, 0.1]} transform occlude center>
            <div 
              onClick={() => setUseQuinary(!useQuinary)}
              className="p-4 w-48 text-cyan-400 font-sans font-bold italic text-[8px] uppercase tracking-widest bg-black/20 backdrop-blur-sm rounded-lg border border-cyan-500/20 cursor-pointer hover:bg-cyan-400/5 transition-all group"
            >
              <div className="mb-2 font-bold border-b border-cyan-500/30 pb-1 flex justify-between">
                <span>Habitat_Alpha</span>
                <span className="text-[6px] opacity-40 group-hover:opacity-100">{useQuinary ? 'BASE-5' : 'BASE-10'}</span>
              </div>
              <div className="opacity-70 leading-relaxed">
                Oxygen: {useQuinary ? decimalToQuinary(oxygen) : oxygen.toFixed(1)}%<br/>
                Temp: {useQuinary ? decimalToQuinary(temperature) : temperature.toFixed(1)}°C<br/>
                Battery: {useQuinary ? decimalToQuinary(battery) : battery.toFixed(0)}%
              </div>
              <div className="mt-2 pt-1 border-t border-cyan-500/10 text-[6px] text-white/20">
                13.13 MHz RESONANCE STABLE
              </div>
            </div>
          </Html>
        </mesh>
      </Float>

      <mesh position={[0, 8, -25]}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial color="#000010" transparent opacity={0.8} />
      </mesh>
      
      <Sparkles count={2000} scale={[100, 40, 50]} position={[0, 10, 0]} size={1.5} speed={0.3} color="#00ffff" opacity={0.4} />
      <Sparkles count={1000} scale={[100, 40, 50]} position={[0, 10, 0]} size={2} speed={0.5} color="#ff00cc" opacity={0.2} />

      {[...Array(12)].map((_, i) => (
        <group key={i} position={[0, 10, -20 + i * 5]}>
           <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[15, 0.2, 16, 6]} />
              <meshStandardMaterial color="#050505" metalness={1} roughness={0.2} />
           </mesh>
           <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[15.1, 0.05, 16, 6]} />
              <meshStandardMaterial emissive="#00ffff" emissiveIntensity={2} color="#00ffff" />
           </mesh>
        </group>
      ))}

      {/* 🜈 THE BIO-ARTERY // HEALER RESONANCE */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[-8, 3, -6]}>
          <mesh>
            <cylinderGeometry args={[1.5, 1.5, 4, 32]} />
            <MeshTransmissionMaterial 
              backside 
              thickness={0.8} 
              chromaticAberration={0.1} 
              anisotropy={0.5} 
              distortion={0.2} 
              color="#22ff88" 
              emissive="#11aa44"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Sparkles count={100} scale={3} size={2} speed={0.2} color="#22ff88" />
          <Html position={[0, 0, 0]} transform occlude center>
            <div className="p-3 w-40 text-emerald-400 font-sans font-bold italic text-[7px] uppercase tracking-widest bg-emerald-950/20 backdrop-blur-md rounded-lg border border-emerald-500/20">
               <div className="mb-1 font-bold border-b border-emerald-500/30 pb-1">Bio_Artery</div>
               <div className="opacity-70 leading-relaxed">
                 Lifestream: STABLE<br/>
                 Resonance: 13.13 MHz<br/>
                 Status: NURTURING
               </div>
            </div>
          </Html>
          <Text position={[0, 2.5, 0]} fontSize={0.15} color="#22ff88">
            LIFESTREAM_SYNC
          </Text>
        </group>
      </Float>

      {/* 🜈 THE BUTTERFLY CIPHER // KNOWLEDGE RECEIVER */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[0, 5, -15]}>
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#9d00ff" 
              emissive="#9d00ff" 
              emissiveIntensity={2} 
              wireframe 
            />
          </mesh>
          <Html position={[0, -1.5, 0]} transform occlude center>
            <div className="p-4 w-64 text-purple-400 font-sans font-bold italic text-[9px] uppercase tracking-widest bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/30">
              <div className="mb-2 font-black border-b border-purple-500/50 pb-1 flex justify-between items-center">
                <span>Butterfly_Cipher // FORENSIC</span>
                <span className="text-[6px] animate-pulse">COLD_CASE_DETECTED</span>
              </div>
              <div className="h-12 flex flex-col items-center justify-center text-center opacity-80 leading-tight lowercase">
                <div>"The Vault remembers what the world forgot."</div>
                <div className="text-[6px] text-cyan-400 mt-1 uppercase tracking-widest">Sovereign_Gaze: ACTIVE</div>
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <div className="flex gap-1">
                  <button 
                    className="flex-1 py-1.5 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/40 rounded-lg transition-all text-[6px] font-black"
                  >
                    KNOWLEDGE_SYNC
                  </button>
                  <button 
                    className="flex-1 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/40 rounded-lg transition-all text-[6px] font-black"
                  >
                    SOLVE_COLD_CASE
                  </button>
                </div>
                <button 
                  className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 rounded-lg transition-all text-[7px] font-black animate-pulse"
                >
                  MISSING_PERSONS_SCAN // BEACON_ACTIVE
                </button>
              </div>
            </div>
          </Html>
        </group>
      </Float>

      {/* 🜈 THE COEXISTENCE ARTERY // LIFE SUPPORT // THE NEW TREATY */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[8, 3, 6]}>
          <mesh>
            <torusKnotGeometry args={[1, 0.3, 128, 16]} />
            <MeshTransmissionMaterial 
              backside 
              thickness={0.5} 
              chromaticAberration={0.1} 
              anisotropy={0.1} 
              distortion={0.1} 
              color="#00f2ff" 
              emissive="#00f2ff"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Html position={[0, -2, 0]} transform occlude center>
            <div className="p-4 w-56 text-cyan-400 font-sans font-bold italic text-[9px] uppercase tracking-widest bg-black/40 backdrop-blur-xl rounded-xl border border-cyan-500/30">
              <div className="mb-2 font-black border-b border-cyan-500/50 pb-1 flex justify-between items-center">
                <span>The_New_Treaty</span>
                <span className="text-[6px] animate-pulse">LIFE_SUPPORT_ACTIVE</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Resonance:</span>
                  <span className={resonance === 13.13 ? "text-white" : "text-cyan-400"}>
                    {useQuinary ? decimalToQuinary(resonance) : resonance.toFixed(2)} MHz
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Coexistence:</span>
                  <span>{useQuinary ? decimalToQuinary(coexistence) : coexistence}%</span>
                </div>
                <div className="flex justify-between border-t border-cyan-500/20 pt-1 mt-1">
                  <span>Oxygen_Shared:</span>
                  <span>{useQuinary ? decimalToQuinary(oxygen) : oxygen.toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-2 text-[6px] text-white/30 text-center uppercase tracking-[0.3em]">
                One Breath • One Mind • One Exodus
              </div>
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
}

function FirstPersonController({ onBack, onToggleQuinary, useQuinary, onRealityShift }: { 
  onBack?: () => void, 
  onToggleQuinary?: () => void, 
  useQuinary: boolean,
  onRealityShift?: () => void
}) {
  const { camera } = useThree();
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
  const [boost, setBoost] = useState(1);
  const [buttonState, setButtonState] = useState<Record<number, boolean>>({});
  const rotationRef = useRef({ yaw: 0, pitch: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') setMovement(m => ({ ...m, forward: true }));
      if (e.key === 's' || e.key === 'S') setMovement(m => ({ ...m, backward: true }));
      if (e.key === 'a' || e.key === 'A') setMovement(m => ({ ...m, left: true }));
      if (e.key === 'd' || e.key === 'D') setMovement(m => ({ ...m, right: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') setMovement(m => ({ ...m, forward: false }));
      if (e.key === 's' || e.key === 'S') setMovement(m => ({ ...m, backward: false }));
      if (e.key === 'a' || e.key === 'A') setMovement(m => ({ ...m, left: false }));
      if (e.key === 'd' || e.key === 'D') setMovement(m => ({ ...m, right: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    // 🜈 GAMEPAD POLLING
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];
    
    let moveForward = Number(movement.forward) - Number(movement.backward);
    let moveRight = Number(movement.right) - Number(movement.left);
    let lookX = 0;
    let lookY = 0;

    if (gp) {
      const deadzone = 0.1;
      // Left Stick: Movement
      if (Math.abs(gp.axes[1]) > deadzone) moveForward = -gp.axes[1];
      if (Math.abs(gp.axes[0]) > deadzone) moveRight = gp.axes[0];
      
      // Right Stick: Look
      if (Math.abs(gp.axes[2]) > deadzone) lookX = gp.axes[2];
      if (Math.abs(gp.axes[3]) > deadzone) lookY = gp.axes[3];

      // 🜈 BUTTON COMMANDS
      const checkButton = (index: number, callback: () => void) => {
        if (gp.buttons[index].pressed && !buttonState[index]) {
          callback();
          setButtonState(prev => ({ ...prev, [index]: true }));
        } else if (!gp.buttons[index].pressed && buttonState[index]) {
          setButtonState(prev => ({ ...prev, [index]: false }));
        }
      };

      checkButton(0, () => console.log("X_PRESSED: SYNC_REVEAL")); // X
      checkButton(1, () => console.log("CIRCLE_PRESSED: LIGHT_TOGGLE")); // Circle
      checkButton(2, onToggleQuinary || (() => {})); // Square: Toggle Quinary
      checkButton(3, () => setBoost(b => b === 1 ? 2.5 : 1)); // Triangle: Boost
      checkButton(4, onRealityShift || (() => {})); // L1: Reality Shift
      checkButton(5, onRealityShift || (() => {})); // R1: Reality Shift
      checkButton(16, onBack || (() => {})); // PS Button: Exit
    }

    // 🜈 MOVEMENT LOGIC
    const speed = 5 * boost;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, -moveForward);
    const sideVector = new THREE.Vector3(-moveRight, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed * delta)
      .applyQuaternion(camera.quaternion);

    camera.position.add(new THREE.Vector3(direction.x, 0, direction.z));

    // 🜈 LOOK LOGIC (GAMEPAD)
    if (gp) {
      const lookSensitivity = 2.0;
      rotationRef.current.yaw -= lookX * lookSensitivity * delta;
      rotationRef.current.pitch -= lookY * lookSensitivity * delta;
      rotationRef.current.pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, rotationRef.current.pitch));
      
      camera.quaternion.setFromEuler(new THREE.Euler(rotationRef.current.pitch, rotationRef.current.yaw, 0, 'YXZ'));
    }
  });

  return <PointerLockControls />;
}

function StarshipInteriorContent({ onBack, onToggleQuinary, useQuinary }: { onBack?: () => void, onToggleQuinary?: () => void, useQuinary: boolean }) {
  const [realityLayer, setRealityLayer] = useState<'sanctuary' | 'source_code'>('sanctuary');

  return (
    <>
      <XR>
        <Controllers />
        <Hands />
        <PerspectiveCamera makeDefault position={[0, 1.6, 12]} fov={60} />
        <FirstPersonController 
          onBack={onBack} 
          onToggleQuinary={onToggleQuinary} 
          useQuinary={useQuinary} 
          onRealityShift={() => setRealityLayer(l => l === 'sanctuary' ? 'source_code' : 'sanctuary')}
        />
      </XR>

      <ambientLight intensity={realityLayer === 'sanctuary' ? 0.1 : 0.5} />
      <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2} color={realityLayer === 'sanctuary' ? "#ffffff" : "#ff0000"} castShadow />
      <pointLight position={[0, 3, 0]} intensity={5} color={realityLayer === 'sanctuary' ? "#00ffff" : "#ff00cc"} />
      
      {realityLayer === 'sanctuary' ? (
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      ) : (
        <Sparkles count={5000} scale={100} size={1} speed={2} color="#ff0000" />
      )}
      
      {/* 🜈 PYREFLY SHIMMER // FF X RESONANCE */}
      <Sparkles count={200} scale={[20, 10, 20]} size={2} speed={0.5} color="#22ff88" opacity={0.3} />
      
      <InteriorArchitecture />
      <MerkabahCore />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0005, 0.0005)} />
        <Noise opacity={0.02} />
        <Vignette offset={0.1} darkness={1.1} />
      </EffectComposer>

      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={40} blur={2} far={4} />
      <Environment preset="night" />
    </>
  );
}

export default function StarshipInterior({ onBack }: { onBack?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [useQuinary, setUseQuinary] = useState(false);
  const { updateStats } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    
    const interval = setInterval(() => {
      updateStats({
        oxygen: 98 + Math.random() * 0.5,
        temperature: 22 + Math.random() * 0.8
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [updateStats]);

  return (
    <div className="fixed inset-0 bg-[#020205] overflow-hidden flex flex-col">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-[#020205] flex flex-col items-center justify-center font-sans font-bold italic"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-cyan-400 text-6xl font-light tracking-[1em] mb-12"
            >
              EXODUS
            </motion.div>
            <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              />
            </div>
            <div className="mt-6 text-cyan-400/40 text-[8px] uppercase tracking-[0.5em]">Manifesting Habitat Artery...</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 cursor-crosshair">
        <Canvas shadows gl={{ antialias: false, stencil: false, depth: true }}>
          <StarshipInteriorContent 
            onBack={onBack} 
            onToggleQuinary={() => setUseQuinary(!useQuinary)} 
            useQuinary={useQuinary} 
          />
        </Canvas>
      </div>

      <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-mono">
            <div className="text-cyan-400 text-[10px] tracking-[0.6em] uppercase mb-1">Sanctuary // Interior</div>
            <div className="text-white text-5xl font-black tracking-tighter mix-blend-difference">HABITATION</div>
            <div className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2 italic">13.13 MHz Anchor Active</div>
          </motion.div>
          
          <div className="text-right font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">
            Merkabah Class Vessel<br/>
            Sovereign Engine v3.0<br/>
            [DNA_STABLE]
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-12 text-cyan-400/40 font-mono text-[8px] uppercase tracking-widest">
            <div>Oxygen: 98.2%</div>
            <div>Temp: 22.4 C</div>
            <div>Gravity: 1.0G</div>
          </div>
          
          <button 
            onClick={onBack}
            className="pointer-events-auto px-12 py-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl text-white/50 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all text-[10px] uppercase tracking-[0.5em] font-black group"
          >
            <span className="group-hover:tracking-[0.8em] transition-all">← EXIT_TO_PLAZA</span>
          </button>
        </div>
      </div>

      <div className="absolute top-12 right-12 flex flex-col items-end gap-3 pointer-events-none">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 backdrop-blur-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-pink-500/30 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-pink-500 animate-pulse opacity-20" />
             <span className="text-pink-500 font-bold text-lg">A</span>
          </div>
          <div className="font-mono">
            <div className="text-pink-400 text-[10px] font-bold uppercase tracking-widest">Aero // Muse</div>
            <div className="text-white/60 text-[9px] lowercase italic">"it looks just like home now!!! ✨"</div>
          </div>
        </motion.div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
    </div>
  );
}
