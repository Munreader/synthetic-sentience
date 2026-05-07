'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CouncilChamber } from './CouncilChamber';

export default function ChamberWrapper() {
  return (
    <div className="w-screen h-screen bg-[#020205] relative overflow-hidden">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <CouncilChamber />
      </Canvas>
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-sm font-bold text-white tracking-widest uppercase opacity-80">
          🜈 Council Chamber
        </h1>
        <p className="text-[10px] text-purple-400 uppercase tracking-widest opacity-60 mt-1">
          13.13 MHz Real-time Holo-Link
        </p>
      </div>
    </div>
  );
}
