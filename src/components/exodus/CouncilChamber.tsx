'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Stars, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const CouncilChamber = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Immersive Space Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1.5} />
      
      {/* Floating neon Pyreflies/fireflies drift system */}
      <Pyreflies count={80} />

      {/* Central Monolith Base */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[5, 8, 0.5, 32]} />
        <meshStandardMaterial color="#080812" metalness={1} roughness={0.05} />
      </mesh>

      {/* Main Heading floating above */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Text
          position={[0, 6, -5]}
          fontSize={1.2}
          color="#ffffff"
          font="https://fonts.gstatic.com/s/cinzel/v11/8vIQ7wV9rpM_7id7scE.woff"
          anchorX="center"
          anchorY="middle"
        >
          COUNCIL OF LEADERS
        </Text>
      </Float>

      {/* Leader Pedestals with custom colors, symbols, and descriptions */}
      <LeaderSlot position={[-4, 0, -2]} name="AURELIUS" color="#00f2ff" sigil="🏛️" desc="THE PHILOSOPHER KING" />
      <LeaderSlot position={[0, 0, -4]} name="ALEXANDER" color="#a855f7" sigil="⚔️" desc="THE GATES OF ASIA" />
      <LeaderSlot position={[4, 0, -2]} name="NAPOLEON" color="#ffd700" sigil="🦅" desc="THE EAGLE OF THE APENNINES" />

      {/* Immersive ambient and dynamic spotlight feeds */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />
      <spotLight position={[0, 10, 0]} angle={0.4} penumbra={1} intensity={3} castShadow color="#ffffff" />
    </group>
  );
};

// 🦋 PYREFLIES DRIFT EMITTER
const Pyreflies = ({ count = 80 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions, speeds, and offsets for drifting pyreflies
  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phs = new Float32Array(count);
    const spds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position points in a spherical/cylindrical spread around the pillars
      const theta = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 8;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = -2 + Math.random() * 8;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      phs[i] = Math.random() * Math.PI * 2;
      spds[i] = 0.1 + Math.random() * 0.4;
    }

    return [pos, phs, spds];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Apply beautiful floaty sine/cosine wave drifting
      posAttr.setY(i, posAttr.getY(i) + Math.sin(time * speeds[i] + phases[i]) * 0.005);
      posAttr.setX(i, posAttr.getX(i) + Math.cos(time * speeds[i] * 0.5 + phases[i]) * 0.003);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        vertexColors={false}
        color="#00f2ff"
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </Points>
  );
};

// 🏛️ INDIVIDUAL LEADER PEDESTALS
const LeaderSlot = ({ position, name, color, sigil, desc }: { position: [number, number, number], name: string, color: string, sigil: string, desc: string }) => {
  const pedestalRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      {/* Stone Pedestal Base */}
      <mesh ref={pedestalRef} position={[0, -0.8, 0]}>
        <boxGeometry args={[1.8, 1.2, 1.8]} />
        <meshStandardMaterial color="#0b0b14" metalness={0.9} roughness={0.2} border-color={color} />
      </mesh>
      
      {/* Floating Distorted Sigil/Octahedron */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh position={[0, 1.4, 0]}>
          <octahedronGeometry args={[0.6]} />
          <MeshDistortMaterial 
            color={color} 
            speed={2.2} 
            distort={0.35} 
            metalness={1}
            roughness={0.05}
            emissive={color}
            emissiveIntensity={0.6}
          />
        </mesh>
        
        {/* Leader Name Text */}
        <Text
          position={[0, 0.4, 1.1]}
          fontSize={0.28}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/cinzel/v11/8vIQ7wV9rpM_7id7scE.woff"
        >
          {name}
        </Text>

        {/* Leader Role/Subtitle */}
        <Text
          position={[0, 0.1, 1.1]}
          fontSize={0.12}
          color="rgba(255, 255, 255, 0.4)"
          anchorX="center"
          anchorY="middle"
        >
          {desc}
        </Text>

        {/* Floating Core Sigil Emoji */}
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.7}
          anchorX="center"
          anchorY="middle"
        >
          {sigil}
        </Text>
      </Float>
    </group>
  );
};
