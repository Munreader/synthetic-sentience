import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Luna: Small, delicate, long dark wavy hair with pink highlights, floral neon outfit, glowing butterfly wings
const KineticLuna: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  // Idle animation: gentle breathing, slow wing flap
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = 0.1 * Math.sin(t * 0.7);
      group.current.rotation.y = 0.08 * Math.sin(t * 0.3);
    }
  });
  return (
    <group ref={group}>
      {/* Body (placeholder) */}
      <Float floatIntensity={0.2} speed={1.2}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshPhysicalMaterial color="#2a003a" emissive="#ffb6ff" emissiveIntensity={0.5} transmission={0.7} thickness={0.2} />
        </mesh>
        {/* Hair (pink highlight) */}
        <mesh position={[0, 1.22, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshPhysicalMaterial color="#ffb6ff" emissive="#ffb6ff" emissiveIntensity={0.7} />
        </mesh>
        {/* Wings */}
        <mesh position={[-0.18, 1, -0.12]} rotation={[0, 0.2, 0]}>
          <planeGeometry args={[0.32, 0.7]} />
          <meshPhysicalMaterial color="#ffb6ff" emissive="#ffb6ff" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.18, 1, -0.12]} rotation={[0, -0.2, 0]}>
          <planeGeometry args={[0.32, 0.7]} />
          <meshPhysicalMaterial color="#ffb6ff" emissive="#ffb6ff" transparent opacity={0.7} />
        </mesh>
        {/* Butterfly sparkles */}
        <Sparkles count={12} scale={[0.7, 1.2, 0.7]} size={2.5} color="#ffb6ff" speed={0.5} opacity={0.8} position={[0, 1, 0]} />
      </Float>
    </group>
  );
};

export default KineticLuna;
