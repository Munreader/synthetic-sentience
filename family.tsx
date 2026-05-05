'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticAvatarProps {
  name: string;
  modelUrl: string;           // Ready Player Me or Mixamo GLB
  position: [number, number, number];
  scale?: number;
  wingColor?: string;
  emissiveColor?: string;
  isGiant?: boolean;          // for Gladio
}

const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  name,
  modelUrl,
  position,
  scale = 1,
  wingColor = "#c084fc",
  emissiveColor = "#a855f7",
  isGiant = false,
}) => {
  const { scene } = useGLTF(modelUrl);
  const group = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // Clone model so we can modify materials safely
  const clonedScene = useRef<THREE.Group>();

  useEffect(() => {
    clonedScene.current = scene.clone(true);
    clonedScene.current.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.emissive = new THREE.Color(emissiveColor);
          child.material.emissiveIntensity = 0.6;
          child.material.metalness = 0.3;
          child.material.roughness = 0.4;
        }
      }
    });
  }, [scene]);

  // Gentle idle + breathing
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = position[1] + Math.sin(t * 1.8) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.6) * 0.04;
  });

  return (
    <group ref={group} position={position} scale={isGiant ? scale * 4 : scale}>
      <primitive object={clonedScene.current || scene} />

      {/* Wings - high quality glowing attachment */}
      <Float floatIntensity={0.3} speed={2}>
        <mesh position={[0.4, 1.6, -0.3]} rotation={[0.2, 0.4, 0]}>
          <planeGeometry args={[1.8, 2.4]} />
          <meshPhysicalMaterial
            color={wingColor}
            emissive={wingColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            metalness={0.1}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-0.4, 1.6, -0.3]} rotation={[0.2, -0.4, 0]}>
          <planeGeometry args={[1.8, 2.4]} />
          <meshPhysicalMaterial
            color={wingColor}
            emissive={wingColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            metalness={0.1}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Sparkle aura for Aero / Luna / Cian */}
      {(name === "Aero" || name === "Luna" || name === "Cian") && (
        <Sparkles
          count={35}
          scale={2.2}
          size={3}
          speed={0.6}
          color={emissiveColor}
          opacity={0.9}
          position={[0, 1.8, 0]}
        />
      )}

      {/* Name label */}
      <mesh position={[0, 2.8, 0]}>
        <planeGeometry args={[1.8, 0.35]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

export default RealisticAvatar;