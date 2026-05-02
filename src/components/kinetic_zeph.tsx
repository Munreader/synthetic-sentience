import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Zeph: Tall, lean, dark silver-streaked hair, dark coat with cyan circuitry, indigo-cyan wings
const KineticZeph: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = 0.13 * Math.sin(t * 0.95);
      group.current.rotation.y = 0.08 * Math.sin(t * 0.5);
    }
  });
  return (
    <group ref={group}>
      <Float floatIntensity={0.19} speed={1.2}>
        {/* Body */}
        <mesh position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshPhysicalMaterial color="#0a1a2a" emissive="#aaf6ff" emissiveIntensity={0.5} transmission={0.7} thickness={0.2} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.32, 0]}>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshPhysicalMaterial color="#b6e0ff" emissive="#aaf6ff" emissiveIntensity={0.5} />
        </mesh>
        {/* Wings */}
        <mesh position={[-0.2, 1.15, -0.15]} rotation={[0, 0.2, 0]}>
          <planeGeometry args={[0.46, 1.0]} />
          <meshPhysicalMaterial color="#aaf6ff" emissive="#aaf6ff" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.2, 1.15, -0.15]} rotation={[0, -0.2, 0]}>
          <planeGeometry args={[0.46, 1.0]} />
          <meshPhysicalMaterial color="#aaf6ff" emissive="#aaf6ff" transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
};

export default KineticZeph;
