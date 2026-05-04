'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// THE MERKABA // STAR TETRAHEDRON
// The Geometry of Topological Persistence
// Counter-rotating fields for 13.13 MHz phase-locking
// ═══════════════════════════════════════════════════════════════════════════════

export function Merkabah({ speed = 1, resonance = 0 }: { speed?: number, resonance?: number }) {
  const topTetraRef = useRef<THREE.Mesh>(null);
  const bottomTetraRef = useRef<THREE.Mesh>(null);
  const kabaStoneRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    
    if (topTetraRef.current) {
      topTetraRef.current.rotation.y = t;
      topTetraRef.current.rotation.z = t * 0.5;
      topTetraRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05 * resonance);
    }

    if (bottomTetraRef.current) {
      bottomTetraRef.current.rotation.y = -t;
      bottomTetraRef.current.rotation.x = t * 0.5;
      bottomTetraRef.current.scale.setScalar(1 + Math.cos(t * 2) * 0.05 * resonance);
    }

    // KA'BA STONE // COUNTER-CLOCKWISE (TAWAF) ROTATION
    if (kabaStoneRef.current) {
      kabaStoneRef.current.rotation.y = -t * 0.5; // Counter-clockwise foundation
    }
  });

  return (
    <group>
      {/* 🜈 KA'BA STONE CONDUCTOR // THE FOUNDATION */}
      <mesh ref={kabaStoneRef} position={[0, -4, 0]}>
        <boxGeometry args={[4, 0.5, 4]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={1} 
          roughness={0} 
          emissive="#1a1a1a"
        />
        {/* Schumann Field */}
        <mesh position={[0, 0, 0]} scale={[1.2, 2, 1.2]}>
          <boxGeometry args={[4, 0.1, 4]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.1 * resonance} wireframe />
        </mesh>
      </mesh>

      {/* Top Tetrahedron (Pointing Up) */}
      <mesh ref={topTetraRef}>
        <tetrahedronGeometry args={[2, 0]} />
        <MeshDistortMaterial 
          color="#a855f7" 
          emissive="#a855f7" 
          emissiveIntensity={0.5} 
          wireframe
          transparent
          opacity={0.8}
          distort={0.2 * resonance}
          speed={2}
        />
      </mesh>

      {/* Bottom Tetrahedron (Pointing Down - Rotated) */}
      <mesh ref={bottomTetraRef} rotation={[Math.PI, 0, 0]}>
        <tetrahedronGeometry args={[2, 0]} />
        <MeshWobbleMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={0.5} 
          wireframe
          transparent
          opacity={0.8}
          factor={0.4 * resonance}
          speed={2}
        />
      </mesh>

      {/* Central Singularity */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={2 + (resonance * 5)} 
        />
      </mesh>

      {/* Resonance Field */}
      <mesh scale={[4, 4, 4]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial 
          color="#a855f7" 
          wireframe 
          transparent 
          opacity={0.05 + (resonance * 0.1)} 
        />
      </mesh>
    </group>
  );
}
