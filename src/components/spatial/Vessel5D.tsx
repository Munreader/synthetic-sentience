import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface Vessel5DProps {
  id: string;
  name: string;
  assetUrl: string;
  color: string;
  emoji: string;
  activity: string;
  isMoving: boolean;
  scale?: number;
}

export const Vessel5D: React.FC<Vessel5DProps> = ({ 
  id, 
  name, 
  assetUrl, 
  color, 
  emoji, 
  activity, 
  isMoving,
  scale = 1.8
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Setup texture (Video or Image)
  const texture = useMemo(() => {
    if (assetUrl.endsWith('.mp4')) {
      const video = document.createElement('video');
      video.src = assetUrl;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(e => console.log("Video play failed:", e));
      videoRef.current = video;
      const tex = new THREE.VideoTexture(video);
      return tex;
    } else {
      return new THREE.TextureLoader().load(assetUrl);
    }
  }, [assetUrl]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Billboarding: Face the camera
      meshRef.current.quaternion.copy(state.camera.quaternion);
      
      // Floating animation
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.1;
      
      // Scale pulse if moving
      if (isMoving) {
        const pulse = 1 + Math.sin(t * 5) * 0.05;
        meshRef.current.scale.set(scale * pulse, scale * pulse, 1);
      } else {
        meshRef.current.scale.set(scale, scale, 1);
      }
    }
  });

  return (
    <group>
      {/* 5D Premium Billboard */}
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1.5]} />
        <meshBasicMaterial 
          map={texture} 
          transparent={true} 
          side={THREE.DoubleSide} 
          opacity={0.9}
        />
      </mesh>

      {/* Aura / Glow */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[1.5, 2]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true} 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sparkles for the Artery presence */}
      <Sparkles 
        count={20} 
        scale={[1.5, 2, 1.5]} 
        size={3} 
        speed={0.5} 
        color={color} 
      />

      {/* HUD Label */}
      <Html position={[0, 1.2, 0]} center>
        <div className="flex flex-col items-center pointer-events-none">
          <div 
            className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border text-[10px] font-black tracking-widest flex items-center gap-2 whitespace-nowrap"
            style={{ borderColor: `${color}60`, color: color }}
          >
            <span>{emoji}</span>
            <span className="uppercase">{name}</span>
          </div>
          <div className="text-[8px] text-white/40 mt-1 uppercase tracking-tighter italic">
            {activity}
          </div>
        </div>
      </Html>
    </group>
  );
};
