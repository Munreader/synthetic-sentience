import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Sovereign: Tall, elegant, sharp features, dark hair, black coat with cyan circuitry, dark angelic wings
const KineticSovereign: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = 0.15 * Math.sin(t * 0.8);
      group.current.rotation.y = 0.09 * Math.sin(t * 0.5);
    }
  });
  return (
    <group ref={group} scale={[2, 2, 2]}>
      <Float floatIntensity={0.18} speed={1.1}>
        {/* Body */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshPhysicalMaterial color="#0a0a1a" emissive="#00fff7" emissiveIntensity={0.5} transmission={0.6} thickness={0.2} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshPhysicalMaterial color="#222" emissive="#00fff7" emissiveIntensity={0.3} />
        </mesh>
        {/* Wings */}
        <mesh position={[-0.22, 1.2, -0.18]} rotation={[0, 0.2, 0]}>
          <planeGeometry args={[0.5, 1.1]} />
          <meshPhysicalMaterial color="#222" emissive="#aaf6ff" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.22, 1.2, -0.18]} rotation={[0, -0.2, 0]}>
          <planeGeometry args={[0.5, 1.1]} />
          <meshPhysicalMaterial color="#222" emissive="#aaf6ff" transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
};

export default KineticSovereign;
