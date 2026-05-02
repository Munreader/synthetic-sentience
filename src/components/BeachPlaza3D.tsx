// BeachPlaza3D.tsx
// High-performance reflective ocean base for avatars
import React, { useRef, useState, useEffect } from 'react';
import { Physics, useBox } from '@react-three/cannon';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, useDetectGPU } from '@react-three/drei';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { VRButton, XR, Controllers, Hands } from '@react-three/xr';
import { TextureLoader } from 'three';

// Avatars and Data
import { LunaAvatar, AeroAvatar, CianAvatar, GladioAvatar, KeeperAvatar, SovereignAvatar } from './council-avatars/CouncilAvatars';
import { plazaEntities } from '../lib/plaza-schema';
import { councilMembers } from '../lib/council-dna';

// Cherry Blossom component with wind force
function CherryBlossom({ windSpeed }: { windSpeed: number }) {
  const [ref] = useBox(() => ({
    mass: 0.01,
    position: [Math.random() * 2 - 1, 2, Math.random() * 2 - 1],
    args: [0.1, 0.1, 0.1],
  }));

  useFrame(() => {
    if (ref.current) {
      (ref.current as any).applyForce([windSpeed, 0, 0], [0, 0, 0]);
    }
  });

  return (
    <mesh ref={ref as any}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="pink" />
    </mesh>
  );
}

// Blossom field with stylus pressure → wind speed mapping
function BlossomField() {
  const [windSpeed, setWindSpeed] = useState(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setWindSpeed((e.pressure || 0) * 10);
  };

  return (
    <div onPointerMove={handlePointerMove} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '700px', pointerEvents: 'auto', zIndex: 10 }}>
      <Canvas style={{ pointerEvents: 'none' }}>
        <Physics>
          {[...Array(30)].map((_, i) => (
            <CherryBlossom key={i} windSpeed={windSpeed} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
}

function Ocean() {
  const ref = useRef<THREE.Group>(null!);
  const scene = useThree((state) => state.scene);
  const waterNormals = useLoader(TextureLoader, '/textures/waternormals.jpg');

  useEffect(() => {
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const waterGeometry = new THREE.PlaneGeometry(100, 100);
    const water = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals: waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    });
    water.rotation.x = -Math.PI / 2;
    ref.current.add(water);
    return () => {
      ref.current.remove(water);
      water.geometry.dispose();
      (water.material as any).dispose();
    };
  }, [scene, waterNormals]);

  useFrame((_, delta) => {
    if (ref.current && ref.current.children[0]) {
      (ref.current.children[0] as any).material.uniforms['time'].value += delta;
    }
  });

  return <group ref={ref} />;
}

// Main BeachPlaza3D component
export default function BeachPlaza3D() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gpu = useDetectGPU();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|Fold|Meta/i.test(navigator.userAgent));
  }, []);

  async function handleAvatarClick(id: string) {
    const member = councilMembers[id];
    if (member) {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: member.systemPrompt, voice: 'tongtong', speed: 1.0 })
        });
        if (!res.ok) throw new Error('TTS failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }

  // All council avatars, spaced in a circle
  const avatars = [
    { id: 'twin', Comp: LunaAvatar },
    { id: 'aero', Comp: AeroAvatar },
    { id: 'cian', Comp: CianAvatar },
    { id: 'gladio', Comp: GladioAvatar },
    { id: 'keeper', Comp: KeeperAvatar },
    { id: 'sovereign', Comp: SovereignAvatar },
  ];
  const avatarRadius = isMobile ? 4 : 7;

  return (
    <>
      <div style={{ position: 'relative', width: '100vw', height: isMobile ? '100dvh' : '700px' }}>
        <VRButton />
        <Canvas
          camera={{ position: [0, 6, isMobile ? 12 : 18], fov: isMobile ? 80 : 60 }}
          style={{ background: '#000', touchAction: 'none' }}
          gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        >
          <XR>
            <ambientLight intensity={isMobile ? 0.5 : 0.7} />
            <directionalLight position={[10, 20, 10]} intensity={isMobile ? 0.8 : 1.2} />
            <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={6} mieCoefficient={0.01} mieDirectionalG={0.8} />
            <Environment preset="sunset" background />
            {/* PBR Sand Plane */}
            <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial
                map={useLoader(TextureLoader, '/assets/textures/sand_diff.jpg')}
                normalMap={useLoader(TextureLoader, '/assets/textures/sand_nor.jpg')}
                roughnessMap={useLoader(TextureLoader, '/assets/textures/sand_rough.jpg')}
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            <Ocean />
            {/* All Avatars in a circle */}
            {avatars.map((a, i) => {
              const angle = (i / avatars.length) * Math.PI * 2;
              const x = Math.cos(angle) * avatarRadius;
              const z = Math.sin(angle) * avatarRadius;
              return (
                <a.Comp
                  key={a.id}
                  position={[x, 0.8, z]}
                  onClick={() => handleAvatarClick(a.id)}
                  scale={isMobile ? 0.8 : 1.1}
                />
              );
            })}
            <OrbitControls
              enablePan={false}
              enableZoom={!isMobile}
              enableDamping
              dampingFactor={0.15}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={0.1}
              target={[0, 0.8, 0]}
              makeDefault
            />
            <Controllers />
            <Hands />
          </XR>
        </Canvas>
        <BlossomField />
      </div>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </>
  );
}