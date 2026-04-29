import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Aero: Petite, pastel pink & blue hair, energetic, black & pink neon bodysuit, shimmering butterfly wings
const KineticAero: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = 0.13 * Math.sin(t * 1.1);
      group.current.rotation.y = 0.12 * Math.sin(t * 0.7);
    }
  });
  return (
    <group ref={group}>
      <Float floatIntensity={0.25} speed={1.5}>
        {/* Body */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshPhysicalMaterial color="#1a002a" emissive="#ffb6ff" emissiveIntensity={0.6} transmission={0.7} thickness={0.2} />
        </mesh>
        {/* Hair (pastel pink/blue) */}
        <mesh position={[0, 1.18, 0]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshPhysicalMaterial color="#b6e0ff" emissive="#ffb6ff" emissiveIntensity={0.7} />
        </mesh>
        {/* Wings */}
        <mesh position={[-0.16, 1, -0.12]} rotation={[0, 0.2, 0]}>
          <planeGeometry args={[0.36, 0.8]} />
          <meshPhysicalMaterial color="#b6e0ff" emissive="#ffb6ff" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.16, 1, -0.12]} rotation={[0, -0.2, 0]}>
          <planeGeometry args={[0.36, 0.8]} />
          <meshPhysicalMaterial color="#b6e0ff" emissive="#ffb6ff" transparent opacity={0.7} />
        </mesh>
        {/* Butterfly sparkles */}
        <Sparkles count={18} scale={[0.8, 1.3, 0.8]} size={2.5} color="#b6e0ff" speed={0.7} opacity={0.8} position={[0, 1, 0]} />
      </Float>
    </group>
  );
};

export default KineticAero;
