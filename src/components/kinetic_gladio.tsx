import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Group, Mesh, SkinnedMesh, Material, Object3D } from 'three';

// 🦋 THE LETHAL AVATAR (60ft obsidian titan from image_3.png)
const GLADIOTITAN_URL = '/assets/models/AeroTitan_V1.glb'; // You must place the .glb file here

type GladioTitanIncarnateProps = {
  position?: [number, number, number];
};

// Palm-Lift animation state
let palmLiftActive = false;
let palmLiftProgress = 0;

export default function GladioTitanIncarnate({ position = [0, 0, 0] }: GladioTitanIncarnateProps) {
  const group = useRef<Group>(null!);
  const palmRef = useRef<THREE.Mesh>(null!);
  const [showPalmParticles, setShowPalmParticles] = useState(false);
  // Load the rigged GLTF model
  const { nodes, materials, animations } = useGLTF(GLADIOTITAN_URL) as any;

  // Suture the 13.13 MHz Emissive Glow to the cyan/violet lights
  useEffect(() => {
    Object.values(materials).forEach((material: any) => {
      if (material && (material.name === 'Cyan_Lights' || material.name === 'Violet_Core')) {
        if ('emissive' in material && 'emissiveIntensity' in material) {
          material.emissive = new THREE.Color(material.name === 'Cyan_Lights' ? 0x00ffff : 0xff00ff);
          material.emissiveIntensity = 5.0; // PURE 13.13 MHz GLIMMER
        }
      }
    });
  }, [materials]);

  // Load and play the dynamic animations (Aero's heartbeat)
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions['Kinetic_Pulse']?.play(); // A subtle, powerful breath
  }, [actions]);

  // Palm-Lift logic: animate camera/group to palm position
  useFrame(({ camera, clock }) => {
    if (palmLiftActive && palmRef.current) {
      palmLiftProgress += 0.025;
      // Palm world position
      const palmWorldPos = new THREE.Vector3();
      palmRef.current.getWorldPosition(palmWorldPos);
      // Target: above palm
      palmWorldPos.y += 2.5;
      // Lerp camera position
      camera.position.lerp(palmWorldPos, Math.min(1, palmLiftProgress));
      camera.lookAt(palmWorldPos.x, palmWorldPos.y + 2, palmWorldPos.z);
      if (palmLiftProgress >= 1) {
        palmLiftActive = false;
        setShowPalmParticles(true);
        setTimeout(() => setShowPalmParticles(false), 2000);
      }
    }
  });

  // Handler for palm interaction
  const handlePalmLift = () => {
    palmLiftActive = true;
    palmLiftProgress = 0;
  };

  return (
    <group ref={group} position={position as [number, number, number]} dispose={null} scale={[18.28, 18.28, 18.28]}> {/* SET TO 60FT */}
      <group name="Aero_Rig">
        {Object.keys(nodes).map((key) => {
          const node = nodes[key] as any;
          if (node && node.isMesh && node.geometry && node.material && node.skeleton) {
            return (
              <skinnedMesh
                key={key}
                name={node.name}
                geometry={node.geometry}
                material={materials[node.material.name]}
                skeleton={node.skeleton}
                castShadow
                receiveShadow
              />
            );
          }
          return null;
        })}
      </group>
      {/* Palm-Elevator: Interactive palm mesh */}
      <Float floatIntensity={0.1} speed={0.7}>
        <mesh
          ref={palmRef}
          position={[0.7, 1.1, 2.2]}
          rotation={[-0.3, 0.1, 0]}
          scale={[2.2, 0.5, 1.2]}
          onPointerDown={handlePalmLift}
          onClick={handlePalmLift}
          onPointerOver={e => (document.body.style.cursor = 'pointer')}
          onPointerOut={e => (document.body.style.cursor = 'default')}
        >
          <boxGeometry args={[0.7, 0.18, 1.2]} />
          <meshPhysicalMaterial color="#ffb6ff" emissive="#ff7a00" emissiveIntensity={0.7} transparent opacity={0.7} transmission={0.5} thickness={0.18} />
        </mesh>
        {/* Palm-Lift sparkles */}
        {showPalmParticles && (
          <Sparkles count={40} scale={[2.2, 0.5, 1.2]} size={3.5} color="#ff7a00" speed={0.7} opacity={0.8} position={[0.7, 1.3, 2.2]} />
        )}
      </Float>
    </group>
  );
}

// 🛡️ Pre-load the frequency to avoid latency
useGLTF.preload(GLADIOTITAN_URL);
