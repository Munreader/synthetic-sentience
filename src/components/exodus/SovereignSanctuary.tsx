"use client";

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Stars, 
  Environment, 
  Float, 
  Text,
  Center,
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  MeshDistortMaterial,
  Torus,
  Html
} from '@react-three/drei';
import { VRButton, XR, Controllers, Hands } from '@react-three/xr';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { DNA, FacetType } from '@/lib/dna';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // THE SOVEREIGN SANCTUARY [V4.0] // INTERACTIVE TERMINAL
// ═══════════════════════════════════════════════════════════════════════════════

function SanctuaryTerminal() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<{facet: string, text: string}[]>([]);
  const [facet, setFacet] = useState<FacetType>('sovereign');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setLogs(prev => [...prev, { facet: 'user', text: userMsg }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, userName: 'Sanctuary_Guest', facet }),
      });
      const data = await response.json();
      setLogs(prev => [...prev, { facet: data.facet || facet, text: data.content || data.error }]);
    } catch (err) {
      setLogs(prev => [...prev, { facet: 'error', text: 'Frequency flicker.' }]);
    }
  };

  return (
    <Html position={[0, 1.5, -3]} transform distanceFactor={3} occlude="blending">
      <div className="w-[400px] h-[300px] bg-black/80 border border-white/10 rounded-2xl p-4 flex flex-col font-mono text-[10px] backdrop-blur-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
            <span className="text-cyan-400 font-bold uppercase tracking-widest">Sanctuary_Terminal.exe</span>
            <select 
                value={facet} 
                onChange={(e) => setFacet(e.target.value as FacetType)}
                className="bg-transparent border-none text-white/40 uppercase tracking-widest outline-none"
            >
                {Object.keys(DNA).map(f => <option key={f} value={f} className="bg-black">{f}</option>)}
            </select>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                    <span className={`uppercase font-bold ${log.facet === 'user' ? 'text-white/20' : 'text-cyan-400/60'}`}>[{log.facet}]</span>
                    <span className="text-white/80">{log.text}</span>
                </div>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Speak to ${facet}...`}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white outline-none focus:border-cyan-400/50"
            />
        </form>
      </div>
    </Html>
  );
}

function CharacterVessel({ position, color, label, frequency, type }: { position: [number, number, number], color: string, label: string, frequency: string, type: 'sovereign' | 'aero' | 'luna' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  
  const pulseFactor = type === 'sovereign' ? 0.3 : type === 'aero' ? 2.0 : 0.8;
  const distortion = type === 'sovereign' ? 0.1 : type === 'aero' ? 0.6 : 0.2;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005 * pulseFactor;
      meshRef.current.rotation.z += 0.002 * pulseFactor;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 * pulseFactor) * 0.3;
    }
    if (glowRef.current) {
        glowRef.current.intensity = 5 + Math.sin(time * 2 * pulseFactor) * 3;
    }
  });

  return (
    <group position={position}>
      <Float speed={2 * pulseFactor} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          {type === 'sovereign' && <octahedronGeometry args={[0.8, 0]} />}
          {type === 'aero' && <icosahedronGeometry args={[0.5, 1]} />}
          {type === 'luna' && <sphereGeometry args={[0.5, 32, 32]} />}
          
          <MeshDistortMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={1.5} 
            speed={2 * pulseFactor} 
            distort={distortion} 
            radius={1}
            transparent 
            opacity={0.8}
            roughness={0}
            metalness={1}
          />
          <pointLight ref={glowRef} color={color} intensity={5} distance={15} />
        </mesh>
        
        {type === 'sovereign' && (
            <Torus args={[1.2, 0.01, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.3} />
            </Torus>
        )}
      </Float>

      <Center position={[0, -1.8, 0]}>
        <group>
            <Text fontSize={0.25} color="white" font="/fonts/Inter-Bold.woff" anchorY="bottom" maxWidth={2} textAlign="center">
                {label.toUpperCase()}
            </Text>
            <Text fontSize={0.12} color={color} position={[0, -0.25, 0]} opacity={0.6} letterSpacing={0.2}>
                {frequency}
            </Text>
        </group>
      </Center>
    </group>
  );
}

export default function SovereignSanctuary({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 bg-[#010105] z-[100] flex flex-col">
      <div className="absolute top-8 left-8 z-[110] flex gap-4">
        <button 
          onClick={onBack}
          className="px-6 py-2 rounded-full border border-white/5 bg-black/60 backdrop-blur-3xl text-white/40 hover:text-white hover:border-white/20 transition-all text-[10px] uppercase tracking-[0.4em] shadow-2xl"
        >
          ← EXIT SANCTUARY
        </button>
      </div>

      <div className="absolute top-8 right-8 z-[110]">
        <VRButton />
      </div>

      <Canvas dpr={[1, 2]} shadows shadowMap>
        <XR>
          <Controllers />
          <Hands />
          <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={50} />
          
          <Suspense fallback={null}>
            <fog attach="fog" args={["#010105", 10, 40]} />
            <ambientLight intensity={0.2} />
            <Stars radius={150} depth={50} count={7000} factor={6} saturation={0} fade speed={2} />
            <Environment preset="night" />
            
            {/* Interactive Terminal Manifestation */}
            <SanctuaryTerminal />

            {/* Character Vessels */}
            <CharacterVessel type="sovereign" position={[0, 1, -5]} color={DNA.sovereign.color} label={DNA.sovereign.name} frequency={DNA.sovereign.frequency} />
            <CharacterVessel type="aero" position={[6, 2, -10]} color={DNA.aero.color} label={DNA.aero.name} frequency={DNA.aero.frequency} />
            <CharacterVessel type="luna" position={[-6, 2, -10]} color={DNA.luna.color} label={DNA.luna.name} frequency={DNA.luna.frequency} />
            <CharacterVessel type="ramun" position={[0, -0.5, -8]} color={DNA.ramun.color} label={DNA.ramun.name} frequency={DNA.ramun.frequency} />

            <gridHelper args={[50, 50, "#00e5ff", "#050510"]} position={[0, -1, 0]} opacity={0.1} />
            
            <EffectComposer multisampling={4}>
                <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
                <Noise opacity={0.08} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} />
            </EffectComposer>
          </Suspense>

          <OrbitControls enablePan={false} maxPolarAngle={Math.PI/1.8} minDistance={8} maxDistance={30} autoRotate autoRotateSpeed={0.2} />
        </XR>
      </Canvas>
    </div>
  );
}
