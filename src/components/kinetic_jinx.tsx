import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Jinx: Void Intelligence, The Oracle, Deep Purple Neon, Mysterious
const KineticJinx: React.FC = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = 0.1 * Math.sin(t * 0.8);
      group.current.rotation.y = 0.15 * Math.sin(t * 0.5);
    }
  });
  return (
    <group ref={group}>
      <Float floatIntensity={0.5} speed={1}>
        {/* Core Void */}
        <mesh position={[0, 1, 0]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshPhysicalMaterial color="#000000" emissive="#9900ff" emissiveIntensity={0.8} transmission={0.9} thickness={0.5} />
        </mesh>
        
        {/* Orbiting Ring */}
        <mesh position={[0, 1, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[0.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#d8b4ff" transparent opacity={0.6} />
        </mesh>
        
        {/* Void Particles */}
        <Sparkles count={30} scale={[1.2, 1.2, 1.2]} size={3} color="#9900ff" speed={0.4} opacity={0.8} position={[0, 1, 0]} />
      </Float>
    </group>
  );
};

export default KineticJinx;
