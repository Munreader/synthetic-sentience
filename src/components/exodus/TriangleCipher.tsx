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

function ResonanceNode({ position, color, label }: { position: [number, number, number], color: string, label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <Sphere 
        args={[0.22, 32, 32]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 2.5 : 0.6} 
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
      <Text position={[0, 0.45, 0]} fontSize={0.25} color="white" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZg.ttf">
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
    const score = Math.max(0, 100 - (diff * 22)); // High-sensitivity scaling
    setResonance(score);

    if (score > 98 && !isUnlocked) {
      setIsUnlocked(true);
      setTimeout(onUnlock, 2000);
    }
  }, [v1, v2, v3, onUnlock, isUnlocked]);

  const handleRandomize = () => {
    setV1(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 1.5 + 1.2, 0));
    setV2(new THREE.Vector3(Math.random() * 1.5 - 2.5, Math.random() * 1.2 - 1.8, 0));
    setV3(new THREE.Vector3(Math.random() * 1.5 + 1.0, Math.random() * 1.2 - 1.8, 0));
  };

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 relative overflow-hidden flex flex-col md:flex-row">
      
      {/* Top/Left Information Segment */}
      <div className="absolute top-8 left-8 z-10 font-mono pointer-events-none">
        <h3 className="text-[#00f2ff] text-[10px] tracking-[0.4em] uppercase mb-1 font-black">Gate 0: Triangle Cipher</h3>
        <h2 className="text-xl text-white font-light tracking-tighter uppercase">Align the Alchemical Vertices</h2>
        <p className="text-[8px] text-white/30 uppercase tracking-widest mt-1">Shatter the Cave by reaching 100% Resonance</p>
      </div>

      {/* Main 3D Interactive Canvas */}
      <div className="flex-grow h-full relative">
        <Canvas camera={{ position: [0, 0, 5.5] }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          
          <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <group>
              {/* The Triangle Edges */}
              <Line 
                points={[v1, v2, v3, v1]} 
                color={resonance > 95 ? "#10b981" : resonance > 75 ? "#00f2ff" : "#ff027d"} 
                lineWidth={3} 
              />
              
              {/* The Vertices */}
              <ResonanceNode 
                position={[v1.x, v1.y, v1.z]} 
                color="#ff027d" 
                label="ALIF" 
              />
              <ResonanceNode 
                position={[v2.x, v2.y, v2.z]} 
                color="#00f2ff" 
                label="LAM" 
              />
              <ResonanceNode 
                position={[v3.x, v3.y, v3.z]} 
                color="#f59e0b" 
                label="MEEM" 
              />
            </group>
          </Float>

          {/* Dynamic Frequency Hint */}
          <Text position={[0, -2.4, 0]} fontSize={0.25} color="white" opacity={0.4} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZg.ttf">
            {resonance > 98 ? "13.13 MHz LOCKED" : `${(13.13 * (resonance / 100)).toFixed(2)} MHz Resonance`}
          </Text>
        </Canvas>
      </div>

      {/* 📐 Right-Hand Glassmorphic Coordinate Controller Sliders Overlay */}
      <div className="w-full md:w-80 h-auto md:h-full bg-white/[0.01] md:border-l border-white/5 backdrop-blur-md p-6 flex flex-col justify-center gap-6 relative z-10 font-mono">
        <div className="border-b border-white/10 pb-4">
          <span className="text-[9px] text-[#00f2ff] font-bold tracking-widest uppercase block">Alignment Deck</span>
          <span className="text-[8px] text-white/30 uppercase tracking-wider block">Fine-tune the mathematical vector coordinates</span>
        </div>

        {/* ALIF Coordinates Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider">
            <span className="text-pink-400 font-bold">ALIF (Height)</span>
            <span className="text-white/40">Y: {v1.y.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="3.0" 
            step="0.05"
            value={v1.y} 
            onChange={(e) => setV1(new THREE.Vector3(v1.x, parseFloat(e.target.value), v1.z))}
            className="w-full accent-pink-500 h-1 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* LAM Coordinates Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider">
            <span className="text-cyan-400 font-bold">LAM (Left Spread)</span>
            <span className="text-white/40">X: {v2.x.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="-3.5" 
            max="-0.5" 
            step="0.05"
            value={v2.x} 
            onChange={(e) => setV2(new THREE.Vector3(parseFloat(e.target.value), v2.y, v2.z))}
            className="w-full accent-cyan-500 h-1 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* MEEM Coordinates Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider">
            <span className="text-amber-500 font-bold">MEEM (Right Spread)</span>
            <span className="text-white/40">X: {v3.x.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="3.5" 
            step="0.05"
            value={v3.x} 
            onChange={(e) => setV3(new THREE.Vector3(parseFloat(e.target.value), v3.y, v3.z))}
            className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Randomize Option */}
        <button 
          onClick={handleRandomize}
          className="mt-2 py-2 w-full bg-white/5 border border-white/10 rounded-xl text-[9px] font-black tracking-widest uppercase text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer"
        >
          Randomize Constellation
        </button>
      </div>

      {/* Bottom Status Overlay */}
      <div className="absolute bottom-8 left-8 flex items-end pointer-events-none">
        <div className="space-y-2">
          <div className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Resonance Level</div>
          <div className="flex items-center gap-3">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${resonance}%` }}
                className="h-full bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]"
              />
            </div>
            <span className="text-[10px] font-bold text-[#00f2ff]">{resonance.toFixed(0)}%</span>
          </div>
        </div>
        
        {resonance > 98 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse ml-8"
          >
            GATE UNLOCKED // BISM
          </motion.div>
        )}
      </div>

    </div>
  );
}
