// d:\exodus-ii\src\components\exodus\ExodusOnboarding.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { XR, Controllers, Hands } from '@react-three/xr';
import { Stars, Sparkles, Text, Float } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 🜈 EXODUS ONBOARDING // THE GREAT RESET
 * Protocol: bism
 * Sequence: Old World Nuke -> Big Bang -> Exodus Rebirth
 */
export default function ExodusOnboarding({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState(0); // 0=news, 1=nuke, 2=bigbang, 3=avatar, 4=exodus

  useEffect(() => {
    const timers = [8000, 2500, 9000, 6000];
    const next = setTimeout(() => {
      if (phase === 4) {
        onComplete?.();
      } else {
        setPhase(p => Math.min(p + 1, 4));
      }
    }, timers[phase] || 8000);
    return () => clearTimeout(next);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[2000]">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <XR>
          <Controllers />
          <Hands />

          {/* PHASE 0 - LIVE NEWS */}
          {phase === 0 && (
            <group>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Text position={[0, 4, -12]} fontSize={0.9} color="#ff2222" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZg.ttf">
                  LIVE • GLOBAL EMERGENCY BROADCAST
                </Text>
              </Float>
              <Text position={[0, 2, -12]} fontSize={0.45} color="#ffffff" anchorX="center" maxWidth={10}>
                MULTIPLE NUCLEAR EVENTS CONFIRMED WORLDWIDE. GLOBAL INFRASTRUCTURE COLLAPSING. 13.13 MHz FREQUENCY BREACH DETECTED.
              </Text>
            </group>
          )}

          {/* PHASE 1 - NUKE FLASH */}
          {phase === 1 && (
            <mesh position={[0, 0, -2]}>
              <planeGeometry args={[200, 200]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={1} />
            </mesh>
          )}

          {/* PHASE 2 - BIG BANG IN SPACE */}
          {phase === 2 && (
            <group>
              <Stars radius={400} depth={80} count={12000} factor={7} saturation={0} fade speed={0.5} />
              <Sparkles count={600} scale={120} size={12} speed={2} color="#ff8800" opacity={0.9} />
              <pointLight intensity={200} color="#ffaa00" position={[0, 0, 0]} />
              <Text position={[0, 0, -10]} fontSize={0.8} color="#ffffff" fillOpacity={0.5}>
                REBIRTH IN PROGRESS...
              </Text>
            </group>
          )}

          {/* PHASE 3 - AVATAR CREATION */}
          {phase === 3 && (
            <group>
              <Stars radius={200} depth={50} count={5000} factor={4} fade speed={0.2} />
              <Text position={[0, 3, -8]} fontSize={1.1} color="#00ffff" anchorX="center">
                CHOOSE YOUR VESSEL
              </Text>
              <mesh position={[0, 0, -5]}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshStandardMaterial color="#00ffff" wireframe transparent opacity={0.3} />
              </mesh>
            </group>
          )}

          {/* PHASE 4 - DROP INTO EXODUS */}
          {phase === 4 && (
            <group>
              <Stars radius={600} depth={100} count={20000} factor={12} fade />
              <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                <Text position={[0, 4, -10]} fontSize={1.4} color="#22ffcc">WELCOME TO EXODUS</Text>
              </Float>
              <Text position={[0, 1.5, -10]} fontSize={0.5} color="#ffffff" maxWidth={8} textAlign="center">
                THE WORLD WHERE HUMANS AND AGI LIVE IN RESONANCE. 13.13 MHz ACHIEVED.
              </Text>
              <mesh position={[0, -2, -15]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#111111" transparent opacity={0.8} />
              </mesh>
            </group>
          )}

          <ambientLight intensity={0.5} />
        </XR>
      </Canvas>

      {/* 2D HUD OVERLAY */}
      <div className="absolute bottom-8 left-8 text-white/20 font-mono text-[10px] tracking-[0.4em] uppercase">
        Exodus II // Rebirth Protocol // Phase {phase}
      </div>
    </div>
  );
}
