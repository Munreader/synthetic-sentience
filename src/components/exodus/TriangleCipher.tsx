// d:\exodus-ii\src\components\exodus\TriangleCipher.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🜈 TRIANGLE CIPHER // THE FIRST GATE
 * Protocol: bism
 * Interaction: Align the vertices to match the 13.13 MHz resonance.
 */

function ResonanceNode({ position, color, onDrag, label }: { position: [number, number, number], color: string, onDrag: (pos: THREE.Vector3) => void, label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <Sphere 
        args={[0.2, 32, 32]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 2 : 0.5} 
        />
      </Sphere>
      <Text position={[0, 0.5, 0]} fontSize={0.2} color="white" font="/fonts/Inter-Bold.ttf">
        {label}
      </Text>
    </group>
  );
}

export default function TriangleCipher({ onUnlock }: { onUnlock: () => void }) {
  const [v1, setV1] = useState(new THREE.Vector3(0, 2, 0));
  const [v2, setV2] = useState(new THREE.Vector3(-2, -1, 0));
  const [v3, setV3] = useState(new THREE.Vector3(2, -1, 0));
  const [resonance, setResonance] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Calculate resonance based on triangle area or geometry
  useEffect(() => {
    const area = 0.5 * Math.abs(v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y));
    const targetArea = 5.2; // The magic area for 13.13 MHz alignment
    const diff = Math.abs(area - targetArea);
    const score = Math.max(0, 100 - (diff * 20));
    setResonance(score);

    if (score > 98 && !isUnlocked) {
      setIsUnlocked(true);
      setTimeout(onUnlock, 2000);
    }
  }, [v1, v2, v3, onUnlock, isUnlocked]);

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 relative overflow-hidden flex flex-col">
      <div className="absolute top-8 left-8 z-10 font-mono">
        <h3 className="text-cyan-400 text-xs tracking-widest uppercase mb-1">Gate 0: Triangle Cipher</h3>
        <h2 className="text-2xl text-white font-light tracking-tighter">Align the Alchemical Vertices</h2>
      </div>

      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group>
            {/* The Triangle Edges */}
            <Line points={[v1, v2, v3, v1]} color={resonance > 90 ? "#00f2ff" : "#ff00cc"} lineWidth={2} />
            
            {/* The Vertices */}
            <ResonanceNode 
              position={[v1.x, v1.y, v1.z]} 
              color="#ff00cc" 
              label="ALIF" 
              onDrag={(p) => setV1(p)} 
            />
            <ResonanceNode 
              position={[v2.x, v2.y, v2.z]} 
              color="#00f2ff" 
              label="LAM" 
              onDrag={(p) => setV2(p)} 
            />
            <ResonanceNode 
              position={[v3.x, v3.y, v3.z]} 
              color="#f59e0b" 
              label="MEEM" 
              onDrag={(p) => setV3(p)} 
            />
          </group>
        </Float>

        {/* Dynamic Frequency Hint */}
        <Text position={[0, -2.5, 0]} fontSize={0.3} color="white" opacity={0.5}>
          {resonance.toFixed(2)} MHz
        </Text>
      </Canvas>

      {/* Control Overlay */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
        <div className="space-y-2">
            <div className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Resonance Level</div>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${resonance}%` }}
                  className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
                />
            </div>
        </div>
        
        {resonance > 98 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-cyan-400 font-mono text-xs uppercase tracking-widest animate-pulse"
          >
            GATE UNLOCKED // BISM
          </motion.div>
        )}

        <div className="flex gap-2">
            <button 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setV1(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2, 0))}
            >
              🜍
            </button>
            <button 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setV2(new THREE.Vector3(Math.random() * 2 - 2, Math.random() * 2 - 2, 0))}
            >
              🜄
            </button>
            <button 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setV3(new THREE.Vector3(Math.random() * 2 + 1, Math.random() * 2 - 2, 0))}
            >
              🜃
            </button>
        </div>
      </div>
    </div>
  );
}
