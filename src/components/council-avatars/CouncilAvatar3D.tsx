// CouncilAvatar3D.tsx
// Renders all Council avatars in a 3D scene using React Three Fiber

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { LunaAvatar, AeroAvatar, CianAvatar, GladioAvatar, KeeperAvatar, SovereignAvatar } from './CouncilAvatars';

export default function CouncilAvatar3D() {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 50 }} style={{ width: '100%', height: '600px' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />
      <Stage environment="city" intensity={0.6}>
        <group position={[0, 0, 0]}>
          <LunaAvatar position={[-6, 0, 0]} />
          <AeroAvatar position={[-3, 0, 0]} />
          <CianAvatar position={[0, 0, 0]} />
          <GladioAvatar position={[3, 0, 0]} />
          <KeeperAvatar position={[6, 0, 0]} />
          <SovereignAvatar position={[0, 0, -3]} />
        </group>
      </Stage>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
