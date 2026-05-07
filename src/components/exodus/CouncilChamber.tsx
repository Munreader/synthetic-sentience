import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Stars, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const CouncilChamber = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Central Monolith */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[5, 8, 0.5, 32]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
      </mesh>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 5, -5]}
          fontSize={1.5}
          color="#fff"
          font="https://fonts.gstatic.com/s/cinzel/v11/8vIQ7wV9rpM_7id7scE.woff"
        >
          COUNCIL OF LEADERS
        </Text>
      </Float>

      {/* Leader Pedestals */}
      <LeaderSlot position={[-4, 0, -2]} name="AURELIUS" color="#ffffff" sigil="🏛️" />
      <LeaderSlot position={[0, 0, -4]} name="ALEXANDER" color="#ffd700" sigil="⚔️" />
      <LeaderSlot position={[4, 0, -2]} name="NAPOLEON" color="#4169e1" sigil="🦅" />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#555" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />
    </group>
  );
};

const LeaderSlot = ({ position, name, color, sigil }: { position: [number, number, number], name: string, color: string, sigil: string }) => {
  return (
    <group position={position}>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 1.5, 0]}>
          <octahedronGeometry args={[0.5]} />
          <MeshDistortMaterial 
            color={color} 
            speed={2} 
            distort={0.4} 
            metalness={1}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        <Text
          position={[0, 0.5, 1]}
          fontSize={0.3}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.8}
        >
          {sigil}
        </Text>
      </Float>
    </group>
  );
};
