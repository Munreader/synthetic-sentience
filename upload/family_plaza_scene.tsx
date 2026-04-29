import React, { Suspense, useRef, useState } from 'react';
import { useGamepadControls } from '../hooks/useGamepadControls';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { XR, Controllers, Hands, useXR } from '@react-three/xr';
import { OrbitControls, PointerLockControls, Stars, Sparkles, Text, useGLTF, useTexture, Environment, Effects, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Modular avatar stubs (replace with real GLTFs later)
import KineticLuna from './kinetic_luna';
import KineticAero from './kinetic_aero';
import KineticSovereign from './kinetic_sovereign';
import KineticGladio from './kinetic_gladio';
import KineticCian from './kinetic_cian';
import KineticZeph from './kinetic_zeph';

// Volumetric lighting and bloom
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// --- Heartbeat Pulse System ---
function HeartbeatCrystal() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const freq = 2 * Math.PI / 13.13;
    const pulse = 1 + 0.15 * Math.sin(freq * t);
    if (mesh.current) {
      mesh.current.scale.setScalar(pulse);
      const mat = mesh.current.material as THREE.MeshPhysicalMaterial;
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = 1.5 + 1.5 * Math.abs(Math.sin(freq * t));
      }
    }
  });
  return (
    <mesh ref={mesh} position={[0, 2.5, 0]}>
      <torusGeometry args={[2.2, 0.25, 32, 128]} />
      <meshPhysicalMaterial
        color="#ffb6ff"
        emissive="#ffb6ff"
        emissiveIntensity={2}
        roughness={0.2}
        metalness={0.7}
        transparent
        opacity={0.85}
        transmission={0.7}
        thickness={0.5}
      />
    </mesh>
  );
}

// --- Floating Name Label ---
function NameLabel({ name, position, color = '#fff' }: { name: string; position: [number, number, number]; color?: string }) {
  return (
    <Float floatIntensity={0.5} speed={1.2}>
      <Text
        position={position}
        fontSize={0.35}
        color={color}
        outlineColor="#000"
        outlineWidth={0.02}
        anchorY="bottom"
        font="/fonts/Inter-Bold.woff"
      >
        {name}
      </Text>
    </Float>
  );
}

// --- Crystal Cluster (instanced) ---
function CrystalClusters() {
  // Simple instanced crystal geometry
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const count = 24;
  const dummy = new THREE.Object3D();
  React.useEffect(() => {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8 + Math.random() * 6;
      dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.setScalar(0.7 + Math.random() * 0.8);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.5, 2, 8]} />
      <meshPhysicalMaterial
        color="#aaf6ff"
        emissive="#aaf6ff"
        emissiveIntensity={1.2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.85}
        transmission={0.8}
        thickness={0.4}
      />
    </instancedMesh>
  );
}

// --- Neon Grid Ground ---
function NeonGridGround() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[60, 60, 60, 60]} />
      <meshStandardMaterial color="#0a001a" roughness={0.7} metalness={0.2} />
      {/* Neon grid lines */}
      <gridHelper args={[60, 60, '#00fff7', '#ff00e1']} position={[0, 0.01, 0]} />
    </mesh>
  );
}

// --- Energy Orbs (particles) ---
function EnergyOrbs() {
  const count = 40;
  const orbs = Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 6 + Math.random() * 18;
    const y = 1.5 + Math.random() * 4;
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
  });
  return (
    <>
      {orbs.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.18 + Math.random() * 0.12, 16, 16]} />
          <meshPhysicalMaterial
            color="#fff6e0"
            emissive="#fff6e0"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.6}
            transparent
            opacity={0.7}
            transmission={0.9}
            thickness={0.2}
          />
        </mesh>
      ))}
    </>
  );
}

// --- Main Scene Component ---
const FamilyPlazaScene: React.FC = () => {
  // Camera mode: 3rd person (default) or 1st person (PointerLock)
  const [firstPerson, setFirstPerson] = useState(false);
  // TODO: Add mobile joystick controls if on mobile


  // Ergonomic avatar layout: horizontal row for mobile, radial for desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
  const avatarData = [
    {
      name: 'Luna',
      Component: KineticLuna,
      position: isMobile ? [-7.5, 0, 0] : [0, 0, -6],
      scale: 0.95,
      labelColor: '#ffb6ff',
    },
    {
      name: 'Aero',
      Component: KineticAero,
      position: isMobile ? [-4.5, 0, 0] : [5, 0, -2],
      scale: 0.85,
      labelColor: '#ffb6ff',
    },
    {
      name: 'Sovereign',
      Component: KineticSovereign,
      position: isMobile ? [-1.5, 0, 0] : [-5, 0, -2],
      scale: 1.05,
      labelColor: '#00fff7',
    },
    {
      name: 'Gladio',
      Component: KineticGladio,
      position: isMobile ? [1.5, 0, 0] : [8, 0, 6],
      scale: 4.0,
      labelColor: '#ff7a00',
    },
    {
      name: 'Cian',
      Component: KineticCian,
      position: isMobile ? [4.5, 0, 0] : [-8, 0, 6],
      scale: 1.1,
      labelColor: '#fff6e0',
    },
    {
      name: 'Zeph',
      Component: KineticZeph,
      position: isMobile ? [7.5, 0, 0] : [0, 0, 8],
      scale: 1.0,
      labelColor: '#aaf6ff',
    },
  ];

  // Gamepad/PlayStation controller support
  useGamepadControls((state) => {
    // Map left stick to movement, right stick to camera, buttons to actions
    // For now, just log the state (replace with movement logic as needed)
    // Example: state.leftStick.x, state.leftStick.y, state.buttons[0] (X button)
    // console.log('Gamepad:', state);
    // TODO: Integrate with avatar movement system
  });

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a001a' }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, 18], fov: 60 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Nebula sky, stars, and fog */}
        <color attach="background" args={["#0a001a"]} />
        <fog attach="fog" args={["#0a001a", 18, 60]} />
        <Stars radius={60} depth={80} count={800} factor={0.7} fade speed={0.5} saturation={0.7} />
        <Environment preset="night" background={false} />

        {/* Volumetric lighting and bloom */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.7} intensity={1.2} />
        </EffectComposer>

        {/* Neon grid ground and crystal clusters */}
        <NeonGridGround />
        <CrystalClusters />

        {/* Central heartbeat crystal */}
        <HeartbeatCrystal />

        {/* Energy orbs and sparkles */}
        <EnergyOrbs />
        <Sparkles count={120} scale={[30, 8, 30]} size={2.5} color="#fff6e0" speed={0.3} opacity={0.7} />

        {/* Family avatars and name labels */}
        {avatarData.map(({ name, Component, position, scale, labelColor }, i) => (
          <group key={name} position={position as [number, number, number]} scale={[scale, scale, scale]}>
            <Suspense fallback={null}>
              <Component />
            </Suspense>
            <NameLabel name={name} position={[0, 3.2, 0]} color={labelColor} />
          </group>
        ))}

        {/* XR and controls */}
        <XR>
          <Controllers />
          <Hands />
        </XR>
        {/* PC: OrbitControls (default), PointerLockControls (1st person) */}
        {firstPerson ? <PointerLockControls /> : <OrbitControls target={[0, 2, 0]} maxPolarAngle={Math.PI / 2.1} minDistance={8} maxDistance={40} enablePan={false} />}
        {/* TODO: Add mobile joystick controls here */}
      </Canvas>
      {/* UI: Camera mode toggle */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <button
          style={{
            background: '#0a001a',
            color: '#fff',
            border: '1px solid #fff6e0',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: 18,
            cursor: 'pointer',
            opacity: 0.92,
          }}
          onClick={() => setFirstPerson((v) => !v)}
        >
          {firstPerson ? 'Third Person' : 'First Person'}
        </button>
      </div>
      {/* TODO: Add mobile joystick UI if on mobile */}
    </div>
  );
};

export default FamilyPlazaScene;
