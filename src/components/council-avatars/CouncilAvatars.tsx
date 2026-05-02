// CouncilAvatars.tsx
// Individual 3D avatar components for each Council member
import React from 'react';
import { useFrame } from '@react-three/fiber';
import type { ComponentProps } from 'react';

// Luna (Twin) Avatar
export function LunaAvatar(props: ComponentProps<'group'>) {
  // Gold, regal, flowing, crown/halo
  return (
    <group {...props}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#fff8dc" emissiveIntensity={0.3} />
      </mesh>
      {/* Halo */}
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[1.1, 0.08, 16, 100]} />
        <meshStandardMaterial color="#fff8dc" emissive="#ffd700" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

// Aero Avatar
export function AeroAvatar(props: ComponentProps<'group'>) {
  // Pink/violet, butterfly wings, glowing
  return (
    <group {...props}>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#ff2d7a" emissive="#b794f6" emissiveIntensity={0.6} />
      </mesh>
      {/* Butterfly wings */}
      <mesh position={[-0.9, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#b794f6" emissive="#ff2d7a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.9, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#b794f6" emissive="#ff2d7a" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Cian Avatar
export function CianAvatar(props: ComponentProps<'group'>) {
  // Obsidian black, emerald lines, subtle pink glitch
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#222" emissive="#10b981" emissiveIntensity={0.3} />
      </mesh>
      {/* Emerald logic lines */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.4, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#ff2d7a" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// Gladio Avatar
export function GladioAvatar(props: ComponentProps<'group'>) {
  // Orange/steel, viking/armored
  return (
    <group {...props}>
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 1.6, 32]} />
        <meshStandardMaterial color="#f97316" emissive="#888" emissiveIntensity={0.2} />
      </mesh>
      {/* Shield */}
      <mesh position={[0, 0.9, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.15, 16, 100]} />
        <meshStandardMaterial color="#888" emissive="#f97316" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

// Keeper Avatar
export function KeeperAvatar(props: ComponentProps<'group'>) {
  // Soft violet, warm pink, gentle flowing
  return (
    <group {...props}>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#b794f6" emissive="#ffb6c1" emissiveIntensity={0.4} />
      </mesh>
      {/* Heart */}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffb6c1" emissive="#b794f6" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Sovereign Avatar
export function SovereignAvatar(props: ComponentProps<'group'>) {
  // Deep gold, midnight purple, regal
  return (
    <group {...props}>
      <mesh>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#ffd700" emissive="#4c1d95" emissiveIntensity={0.5} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[0.7, 0.12, 16, 100]} />
        <meshStandardMaterial color="#4c1d95" emissive="#ffd700" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}
