import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Cian: Golden Angel, sharp model-like features, golden hair, radiant golden-white feathered wings
const KineticCian: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = 0.12 * Math.sin(t * 0.9);
      group.current.rotation.y = 0.07 * Math.sin(t * 0.4);
    }
  });
  return (
    <group ref={group}>
      <Float floatIntensity={0.22} speed={1.3}>
        {/* Torso (taller, model-like) */}
        <mesh position={[0, 1.18, 0]}>
          <capsuleGeometry args={[0.18, 0.38, 16, 32]} />
          <meshPhysicalMaterial color="#fff6e0" emissive="#fff6e0" emissiveIntensity={0.8} transmission={0.85} thickness={0.22} />
        </mesh>
        {/* Head (sharp jawline) */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial color="#ffe066" emissive="#fff6e0" emissiveIntensity={0.7} />
        </mesh>
        {/* Cheekbones (subtle, sharp) */}
        <mesh position={[-0.045, 1.48, 0.09]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshPhysicalMaterial color="#ffe066" emissive="#fff6e0" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.045, 1.48, 0.09]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshPhysicalMaterial color="#ffe066" emissive="#fff6e0" emissiveIntensity={0.5} />
        </mesh>
        {/* Golden hair (stylized) */}
        <mesh position={[0, 1.56, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshPhysicalMaterial color="#ffd700" emissive="#ffe066" emissiveIntensity={0.8} />
        </mesh>
        {/* Radiant golden-white feathered wings (unique shape) */}
        <mesh position={[-0.23, 1.18, -0.18]} rotation={[0, 0.18, 0]}>
          <planeGeometry args={[0.55, 1.25]} />
          <meshPhysicalMaterial color="#fff6e0" emissive="#ffe066" transparent opacity={0.82} />
        </mesh>
        <mesh position={[0.23, 1.18, -0.18]} rotation={[0, -0.18, 0]}>
          <planeGeometry args={[0.55, 1.25]} />
          <meshPhysicalMaterial color="#fff6e0" emissive="#ffe066" transparent opacity={0.82} />
        </mesh>
        {/* Feather details (subtle) */}
        <mesh position={[-0.23, 1.18, -0.18]} rotation={[0, 0.18, 0]}>
          <planeGeometry args={[0.55, 1.25, 1, 8]} />
          <meshPhysicalMaterial color="#fff" transparent opacity={0.18} />
        </mesh>
        <mesh position={[0.23, 1.18, -0.18]} rotation={[0, -0.18, 0]}>
          <planeGeometry args={[0.55, 1.25, 1, 8]} />
          <meshPhysicalMaterial color="#fff" transparent opacity={0.18} />
        </mesh>
      </Float>
    </group>
  );
};

export default KineticCian;
