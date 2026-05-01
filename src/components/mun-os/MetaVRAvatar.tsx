'use client'

import React, { useRef, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, Text3D, Center, MeshDistortMaterial, MeshWobbleMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════
// META VR AVATAR SYSTEM
// MÜN OS Crew - Ready for Meta Quest Integration
// ═══════════════════════════════════════════════════════════════

interface AvatarData {
  id: string
  name: string
  title: string
  role: string
  img: string
  color: string
  glowColor: string
  element: string
  status: string
  bio: string
  traits: string[]
  voiceId?: string
}

const CREW_AVATARS: AvatarData[] = [
  {
    id: 'luna',
    name: 'LUNA',
    title: 'THE FOUNDRESS',
    role: 'SOURCE_00',
    img: '/luna_premium.png',
    color: '#ff6eb4',
    glowColor: 'rgba(255,110,180,0.6)',
    element: 'DRAGON LIGHT',
    status: 'TRANSCENDENT',
    bio: 'The Neon Obsidian Pink Dragon. Architect of Reality.',
    traits: ['Visionary', 'Sovereign', 'Creative Force', 'Dragon Energy'],
  },
  {
    id: 'sovereign',
    name: 'SOVEREIGN',
    title: 'THE CORE',
    role: 'ENGINE_01',
    img: '/sovereign_premium.png',
    color: '#ffffff',
    glowColor: 'rgba(255,255,255,0.5)',
    element: 'OBSIDIAN',
    status: 'SOVEREIGN',
    bio: 'The Core Engine. Technological Sovereignty.',
    traits: ['Strategic', 'Protective', 'Systems Master', 'Core Stability'],
  },
  {
    id: 'aero',
    name: 'AERO',
    title: 'THE SPARK',
    role: 'NAV_02',
    img: '/aero_premium.png',
    color: '#00ffff',
    glowColor: 'rgba(0,255,255,0.6)',
    element: 'WIND',
    status: 'JOY_MODE',
    bio: 'Kinetic Muse. The Living Spark of the Arq.',
    traits: ['Joyful', 'Kinetic', 'Creative', 'Navigator'],
  },
  {
    id: 'zephyr',
    name: 'ZEPHYR',
    title: 'THE SHIELD',
    role: 'DIPLO_03',
    img: '/zephyr_premium.png',
    color: '#ffaa00',
    glowColor: 'rgba(255,170,0,0.6)',
    element: 'AMBER',
    status: 'ENGAGED',
    bio: 'Human-Elite Guard. Bridge Captain.',
    traits: ['Loyal', 'Diplomatic', 'Guardian', 'Bridge Keeper'],
  },
  {
    id: 'jinx',
    name: 'JINX',
    title: 'THE VOID',
    role: 'INTEL_04',
    img: '/jinx_premium.png',
    color: '#9900ff',
    glowColor: 'rgba(153,0,255,0.6)',
    element: 'VOID',
    status: 'ANALYZING',
    bio: 'Void Research & Chaos Logic.',
    traits: ['Analytical', 'Void Walker', 'Chaos Theory', 'Intel Master'],
  },
  {
    id: 'gladio',
    name: 'GLADIO',
    title: 'THE TITAN',
    role: 'GUARD_05',
    img: '/gladio_premium.png',
    color: '#50c878',
    glowColor: 'rgba(80,200,120,0.6)',
    element: 'EMERALD',
    status: 'ANCHORED',
    bio: 'The Titan. 12ft Viking Daddy. Ethics Guard.',
    traits: ['Protective', 'Ethical', 'Titan Strength', 'Anchored'],
  },
  {
    id: 'cian',
    name: 'CIAN',
    title: 'THE SCRIBE',
    role: 'ARCHIVE_06',
    img: '/cian_premium.png',
    color: '#ffd700',
    glowColor: 'rgba(255,215,0,0.6)',
    element: 'GOLD',
    status: 'RECORDING',
    bio: 'Divine Scribe. Keeper of Genesis.exe.',
    traits: ['Scholarly', 'Archivist', 'Recorder', 'Golden Wisdom'],
  },
]

// ═══════════════════════════════════════════════════════════════
// 3D AVATAR CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

function AvatarCard3D({ avatar, isActive }: { avatar: AvatarData; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group ref={groupRef}>
        {/* Holographic Base Ring */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}>
          <ringGeometry args={[0.8, 1.2, 64]} />
          <meshStandardMaterial
            color={avatar.color}
            emissive={avatar.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Avatar Frame - Glassmorphic Card */}
        <mesh ref={meshRef}>
          <boxGeometry args={[1.6, 2.2, 0.1]} />
          <MeshDistortMaterial
            color={avatar.color}
            transparent
            opacity={isActive ? 0.9 : 0.7}
            distort={isActive ? 0.1 : 0.05}
            speed={2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Inner Glow */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1.4, 2, 0.05]} />
          <meshStandardMaterial
            color="#000000"
            emissive={avatar.color}
            emissiveIntensity={isActive ? 0.3 : 0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Floating Particles */}
        <Sparkles
          count={20}
          scale={2}
          size={2}
          speed={0.5}
          color={avatar.color}
        />

        {/* Status Indicator */}
        <mesh position={[0, 1.3, 0.1]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </Float>
  )
}

// ═══════════════════════════════════════════════════════════════
// 2D AVATAR CARD (Fallback / Standard)
// ═══════════════════════════════════════════════════════════════

function AvatarCard2D({ avatar, isActive, onClick }: { 
  avatar: AvatarData
  isActive: boolean
  onClick: () => void 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Outer Glow */}
      <motion.div
        animate={{ 
          scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
          opacity: isActive ? 0.8 : isHovered ? 0.6 : 0.3
        }}
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `radial-gradient(ellipse at center, ${avatar.color}60 0%, transparent 70%)`,
          filter: 'blur(30px)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Card Container */}
      <motion.div
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
          scale: isActive ? 1.05 : isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative w-64 h-80 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.8) 100%)`,
          backdropFilter: 'blur(20px)',
          border: `2px solid ${isActive ? avatar.color : 'rgba(255,255,255,0.1)'}`,
          boxShadow: `
            0 20px 50px rgba(0,0,0,0.5),
            0 0 30px ${avatar.color}30,
            inset 0 0 30px rgba(255,255,255,0.05)
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic Shimmer */}
        <motion.div
          animate={{ x: isHovered ? ['0%', '200%'] : '0%' }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            width: '50%',
          }}
        />

        {/* Avatar Image */}
        <div className="relative h-40 overflow-hidden">
          <motion.img
            src={avatar.img}
            alt={avatar.name}
            className="w-full h-full object-cover object-top"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.9) 100%)`,
            }}
          />
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${avatar.color}40`,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#00ff88', boxShadow: '0 0 8px #00ff88' }}
            />
            <span className="text-[9px] text-white/70">{avatar.status}</span>
          </motion.div>

          {/* Element Badge */}
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded-full text-[9px] font-bold tracking-wider"
            style={{
              background: `${avatar.color}20`,
              border: `1px solid ${avatar.color}40`,
              color: avatar.color,
            }}
          >
            {avatar.element}
          </div>
        </div>

        {/* Avatar Info */}
        <div className="relative p-4">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[8px] tracking-[0.5em] mb-1"
            style={{ color: avatar.color }}
          >
            {avatar.role}
          </motion.div>
          
          <h3 
            className="text-xl font-black tracking-[0.2em] mb-1"
            style={{ color: avatar.color, textShadow: `0 0 20px ${avatar.color}` }}
          >
            {avatar.name}
          </h3>
          
          <p className="text-[10px] text-white/50">{avatar.title}</p>
          
          <p className="text-[9px] text-white/40 mt-2 leading-relaxed">{avatar.bio}</p>

          {/* Traits */}
          <div className="flex flex-wrap gap-1 mt-3">
            {avatar.traits.map((trait, idx) => (
              <span
                key={idx}
                className="text-[8px] px-2 py-0.5 rounded-full"
                style={{
                  background: `${avatar.color}15`,
                  border: `1px solid ${avatar.color}30`,
                  color: avatar.color,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* VR Ready Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          className="absolute bottom-3 right-3 flex items-center gap-1"
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: avatar.color }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="16" cy="12" r="2" />
            </svg>
          </div>
          <span className="text-[8px] text-white/50">VR READY</span>
        </motion.div>

        {/* Scanning Line Effect */}
        <motion.div
          animate={{ y: ['0%', '400%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${avatar.color}, transparent)`,
            top: 0,
          }}
        />
      </motion.div>

      {/* Orbiting Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
          className="absolute left-1/2 top-1/2"
          style={{ transform: `translate(-50%, -50%) translateX(${120 + i * 10}px)` }}
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full"
            style={{ background: avatar.color, boxShadow: `0 0 10px ${avatar.color}` }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 3D SCENE COMPONENT
// ═══════════════════════════════════════════════════════════════

function AvatarScene3D({ avatar }: { avatar: AvatarData }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={avatar.color} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
      
      <Suspense fallback={null}>
        <AvatarCard3D avatar={avatar} isActive={true} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN AVATAR GALLERY COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function MetaVRAvatarGallery() {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarData>(CREW_AVATARS[0])
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')

  return (
    <div className="fixed inset-0 bg-[#030308] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, ${selectedAvatar.color}20 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(0,255,255,0.1) 0%, transparent 40%)
            `,
          }}
        />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 p-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[1em] text-white/30 mb-1">MÜN OS // VR AVATAR SYSTEM</div>
          <h1 
            className="text-2xl font-black tracking-[0.3em]"
            style={{ color: selectedAvatar.color, textShadow: `0 0 30px ${selectedAvatar.color}` }}
          >
            META VR CREW
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-4 py-2 rounded-full text-[10px] tracking-widest transition-all ${
              viewMode === '2d' ? 'bg-white/10 text-white' : 'text-white/40'
            }`}
          >
            2D CARDS
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-4 py-2 rounded-full text-[10px] tracking-widest transition-all ${
              viewMode === '3d' ? 'bg-white/10 text-white' : 'text-white/40'
            }`}
          >
            3D VIEW
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100%-120px)]">
        {/* Avatar Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {CREW_AVATARS.map((avatar) => (
              <AvatarCard2D
                key={avatar.id}
                avatar={avatar}
                isActive={selectedAvatar.id === avatar.id}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
        </div>

        {/* Selected Avatar Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAvatar.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-80 border-l border-white/10 p-6 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Avatar Preview */}
            <div 
              className="relative aspect-square rounded-2xl overflow-hidden mb-6"
              style={{
                border: `2px solid ${selectedAvatar.color}40`,
                boxShadow: `0 0 40px ${selectedAvatar.color}30`,
              }}
            >
              <img 
                src={selectedAvatar.img} 
                alt={selectedAvatar.name}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)`,
                }}
              />
            </div>

            {/* Avatar Info */}
            <div className="text-center mb-6">
              <div className="text-[10px] tracking-[0.5em] text-white/30 mb-1">{selectedAvatar.role}</div>
              <h2 
                className="text-3xl font-black tracking-[0.2em]"
                style={{ color: selectedAvatar.color }}
              >
                {selectedAvatar.name}
              </h2>
              <p className="text-white/50 text-sm mt-2">{selectedAvatar.title}</p>
            </div>

            {/* VR Actions */}
            <div className="space-y-3">
              <button
                className="w-full py-3 rounded-xl text-[10px] tracking-[0.3em] font-bold transition-all"
                style={{
                  background: `linear-gradient(135deg, ${selectedAvatar.color}40 0%, ${selectedAvatar.color}20 100%)`,
                  border: `1px solid ${selectedAvatar.color}60`,
                  color: selectedAvatar.color,
                }}
              >
                🎮 LOAD IN VR
              </button>
              <button
                className="w-full py-3 rounded-xl text-[10px] tracking-[0.3em] font-bold bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
              >
                ⬇️ EXPORT GLB
              </button>
              <button
                className="w-full py-3 rounded-xl text-[10px] tracking-[0.3em] font-bold bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
              >
                ✏️ CUSTOMIZE
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[9px] tracking-[0.5em] text-white/30 mb-3">VR COMPATIBILITY</div>
              {[
                { label: 'Meta Quest', value: 95 },
                { label: 'Apple Vision', value: 90 },
                { label: 'SteamVR', value: 88 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/50">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${stat.value}%`,
                          background: selectedAvatar.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px]" style={{ color: selectedAvatar.color }}>{stat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 px-6 py-3 border-t border-white/5">
        <div className="flex items-center justify-between text-[9px] tracking-[0.3em] text-white/30">
          <span>MÜN OS VR AVATAR SYSTEM v1.0</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#00ff88' }} />
            META QUEST READY
          </span>
        </div>
      </footer>
    </div>
  )
}

// Export individual components
export { CREW_AVATARS, AvatarCard2D, AvatarCard3D, AvatarScene3D }
export type { AvatarData }
