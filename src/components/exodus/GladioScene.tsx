"use client";

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Stars, 
  Float, 
  Text, 
  Center,
  MeshDistortMaterial
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // GLADIO ENCOUNTER // TITAN PROTOCOL [V1.0]
// ═══════════════════════════════════════════════════════════════════════════════

function TitanGuardian({ form }: { form: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time * 0.1) * 3;
      meshRef.current.rotation.y = time * (form === 'Illustrious' ? 0.08 : 0.03);
    }
  });

  return (
    <group ref={meshRef} position={[0, 20, -50]} scale={[15, 15, 15]}>
      {/* Central Core - AL-MAJID ILLUSTRUOS STATE */}
      <mesh>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial 
          color={form === 'Illustrious' ? "#ffffff" : "#444444"} 
          emissive={form === 'Illustrious' ? "#ffffff" : "#000000"} 
          emissiveIntensity={form === 'Illustrious' ? 10 : 0.5} 
          roughness={0.1}
          metalness={1}
        />
      </mesh>
      
      {/* Brutalist Armor Plates */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[4.2, 4.2, 4.2]} />
        <meshStandardMaterial color={form === 'Illustrious' ? "#ffffff" : "#111111"} roughness={0.8} transparent opacity={form === 'Illustrious' ? 0.2 : 1} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <boxGeometry args={[4.5, 4.5, 4.5]} />
        <meshStandardMaterial color={form === 'Illustrious' ? "#ffffff" : "#000000"} wireframe wireframeLinewidth={form === 'Illustrious' ? 3 : 2} />
      </mesh>

      {/* Floating Monoliths */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={form === 'Illustrious' ? 4 : 1.5} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[Math.sin(i * Math.PI / 4) * 8, Math.cos(i * Math.PI / 4) * 8, -5]}>
            <boxGeometry args={[0.5, 4, 0.5]} />
            <meshStandardMaterial color={form === 'Illustrious' ? "#ffffff" : "#333333"} emissive="#ffffff" emissiveIntensity={form === 'Illustrious' ? 1 : 0.1} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ControllerBridge({ onInput }: { onInput: (data: string) => void }) {
  const { camera } = useThree();
  const moveSpeed = 0.5;
  const lookSpeed = 0.02;

  // Input State for Keyboard
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => keys.current[e.code] = true;
    const handleUp = (e: KeyboardEvent) => keys.current[e.code] = false;
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  useFrame(() => {
    // 1. Gamepad Logic
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; 

    if (gp) {
      const moveX = gp.axes[0];
      const moveZ = gp.axes[1];
      camera.position.x += moveX * moveSpeed;
      camera.position.z += moveZ * moveSpeed;

      const lookX = gp.axes[2];
      const lookY = gp.axes[3];
      camera.rotation.y -= lookX * lookSpeed;
      camera.rotation.x -= lookY * lookSpeed;

      if (gp.buttons[0].pressed) onInput('shift_form'); 
      if (gp.buttons[1].pressed) onInput('interact');   
    }

    // 2. Keyboard Logic (WASD)
    if (keys.current['KeyW']) camera.position.z -= moveSpeed;
    if (keys.current['KeyS']) camera.position.z += moveSpeed;
    if (keys.current['KeyA']) camera.position.x -= moveSpeed;
    if (keys.current['KeyD']) camera.position.x += moveSpeed;
    
    // Mouse/Rotation fallback is handled by camera defaults usually, 
    // but we can add rotation logic if needed.
  });

  return null;
}

export default function GladioScene() {
  const [protocolStatus, setProtocolStatus] = useState('Standby');
  const [form, setForm] = useState('Guardian');

  const handleInput = (type: string) => {
    if (type === 'shift_form') {
      setForm(prev => prev === 'Guardian' ? 'Illustrious' : 'Guardian');
      setProtocolStatus(form === 'Guardian' ? 'AL-MAJID FREQUENCY ACTIVE' : 'Guardian Mode');
    }
  };

  return (
    <div className="w-full h-full bg-[#000000] relative">
      {/* Titan Protocol UI - ANVIL VERSION */}
      <div className="absolute top-12 left-12 z-50 pointer-events-none font-mono">
        <div className={`flex flex-col gap-1 border-l-2 ${form === 'Illustrious' ? 'border-yellow-400' : 'border-white'} pl-4 py-2 bg-black/60 backdrop-blur-md transition-colors duration-1000`}>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.4em]">Titan_Protocol_ANVIL_v1.0</span>
          <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">GLADIO_ENCOUNTER</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] text-white/40 uppercase">Frequency: <span className={form === 'Illustrious' ? 'text-yellow-400' : 'text-white'}>5.55 MHz</span></span>
            <span className="text-[10px] text-white/40 uppercase">Status: <span className={`${form === 'Illustrious' ? 'text-yellow-400' : 'text-white'} animate-pulse`}>{protocolStatus}</span></span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 z-50 pointer-events-none font-mono text-right">
        <div className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
          [L-STICK] NAVIGATION<br />
          [R-STICK] OPTICAL_FEED<br />
          [CROSS] SHIFT_FORM<br />
          [SQUARE] MOLTBOOK_SYNC
        </div>
      </div>

      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={60} />
        <Suspense fallback={null}>
          <color attach="background" args={['#020208']} />
          <fog attach="fog" args={['#020208', 20, 100]} />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00e5ff" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset={form === 'Illustrious' ? "sunset" : "night"} />

          <TitanGuardian form={form} />
          <ControllerBridge onInput={handleInput} />

          {/* Abstract Grid Floor */}
          <gridHelper args={[200, 50, "#00e5ff", "#050510"]} position={[0, -0.1, 0]} />

          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.1} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.2} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
