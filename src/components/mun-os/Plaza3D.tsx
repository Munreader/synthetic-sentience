'use client'

import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Text, 
  Float, 
  Sparkles, 
  Environment,
  MeshDistortMaterial,
  Sphere,
  Torus,
  Box,
  RoundedBox,
  Points,
  PointMaterial
} from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { 
  HypeLevel, 
  MUSE_COLORS 
} from '@/lib/family-db'
import { 
  PlazaState, 
  EntityAvatar, 
  PlazaAtmosphere, 
  calculateAtmosphere,
  PLAZA_ZONES,
  subscribeToPlazaUpdates,
  getPlazaState,
  EntityName
} from '@/lib/plaza-bridge'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE PLAZA // 3D ADVENTURE SPACE
// Where the Family Converges in Physical-Digital Form
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

interface Plaza3DProps {
  hypeLevel?: HypeLevel
  onZoneSelect?: (zone: keyof typeof PLAZA_ZONES) => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE PLAYER AVATAR — Luna's Controllable Form
// ═══════════════════════════════════════════════════════════════════════════════

interface PlayerAvatarProps {
  position: [number, number, number]
  atmosphere: PlazaAtmosphere
}

function PlayerAvatar({ position, atmosphere }: PlayerAvatarProps) {
  const avatarRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (avatarRef.current) {
      // Idle floating animation
      avatarRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
      // Gentle rotation
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={avatarRef} position={position}>
      {/* Luna's body - Silver-violet crystalline form */}
      <mesh>
        <capsuleGeometry args={[0.35, 0.9, 8, 16]} />
        <MeshDistortMaterial
          color="#e879f9"
          metalness={0.8}
          roughness={0.15}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#e879f9"
          metalness={0.9}
          roughness={0.1}
          emissive="#e879f9"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Crown/crest */}
      <mesh position={[0, 1.1, 0]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.9}
          roughness={0.1}
          emissive="#ffd700"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Wings/aura */}
      <Torus args={[0.5, 0.05, 8, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <meshBasicMaterial color="#e879f9" transparent opacity={0.6} />
      </Torus>

      {/* Name label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.14}
        color="#e879f9"
        anchorX="center"
        anchorY="middle"
      >
        LUNA ✦
      </Text>

      {/* Status indicator */}
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE PLAYER CONTROLLER — WASD + Arrow Key Movement
// ═══════════════════════════════════════════════════════════════════════════════

interface PlayerControllerProps {
  onPositionChange?: (pos: [number, number, number]) => void
}

function PlayerController({ onPositionChange }: PlayerControllerProps) {
  const { camera } = useThree()
  const keysPressed = useRef<Set<string>>(new Set())
  const velocity = useRef(new THREE.Vector3())
  const playerPos = useRef(new THREE.Vector3(0, 0, 3)) // Start position
  
  const SPEED = 0.08
  const FRICTION = 0.9

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase())
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const keys = keysPressed.current
    const moveDir = new THREE.Vector3()

    // WASD and Arrow keys
    if (keys.has('w') || keys.has('arrowup')) moveDir.z -= 1
    if (keys.has('s') || keys.has('arrowdown')) moveDir.z += 1
    if (keys.has('a') || keys.has('arrowleft')) moveDir.x -= 1
    if (keys.has('d') || keys.has('arrowright')) moveDir.x += 1

    // Apply movement
    if (moveDir.length() > 0) {
      moveDir.normalize().multiplyScalar(SPEED)
      velocity.current.add(moveDir)
    }

    // Apply friction
    velocity.current.multiplyScalar(FRICTION)

    // Update position
    playerPos.current.add(velocity.current)

    // Boundary limits (keep within plaza)
    playerPos.current.x = Math.max(-12, Math.min(12, playerPos.current.x))
    playerPos.current.z = Math.max(-12, Math.min(12, playerPos.current.z))

    // Update camera to follow player smoothly
    const targetCamPos = new THREE.Vector3(
      playerPos.current.x + 5,
      5,
      playerPos.current.z + 8
    )
    camera.position.lerp(targetCamPos, 0.02)
    camera.lookAt(playerPos.current.x, 1, playerPos.current.z)

    // Notify parent of position change
    onPositionChange?.([playerPos.current.x, 0, playerPos.current.z])
  })

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE OBSIDIAN FLOOR — The Foundation of the Plaza
// ═══════════════════════════════════════════════════════════════════════════════

function ObsidianFloor({ atmosphere }: { atmosphere: PlazaAtmosphere }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[30, 30, 100, 100]} />
      <meshStandardMaterial
        color={atmosphere.primary_color}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE COMMAND TABLE — Central Gathering Point
// ═══════════════════════════════════════════════════════════════════════════════

function CommandTable({ atmosphere }: { atmosphere: PlazaAtmosphere }) {
  const tableRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (tableRef.current) {
      // Gentle floating animation
      tableRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={tableRef} position={[0, 0, 0]}>
      {/* Table surface */}
      <RoundedBox args={[3, 0.1, 2]} radius={0.05} position={[0, 0.5, 0]}>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
          emissive={atmosphere.accent_color}
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      
      {/* Table legs */}
      {[[-1.2, 0, -0.7], [1.2, 0, -0.7], [-1.2, 0, 0.7], [1.2, 0, 0.7]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.2, pos[2]]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#0c0a1d" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Holographic display */}
      <mesh position={[0, 0.7, 0]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshBasicMaterial
          color={atmosphere.accent_color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.15}
        color={atmosphere.accent_color}
        anchorX="center"
        anchorY="middle"
      >
        🜈 COMMAND TABLE
      </Text>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE BUTTERFLY NEST — Aero's Home
// ═══════════════════════════════════════════════════════════════════════════════

function ButterflyNest({ atmosphere }: { atmosphere: PlazaAtmosphere }) {
  const nestRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (nestRef.current) {
      nestRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={nestRef} position={[0, 3, -8]}>
        {/* Crystal structure */}
        <Torus args={[1, 0.3, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <MeshDistortMaterial
            color={atmosphere.accent_color}
            metalness={0.5}
            roughness={0.1}
            distort={0.2}
            speed={2}
            transparent
            opacity={0.8}
          />
        </Torus>

        {/* Inner glow */}
        <Sphere args={[0.5, 32, 32]}>
          <meshBasicMaterial
            color="#ff69b4"
            transparent
            opacity={0.6}
          />
        </Sphere>

        {/* Label */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.12}
          color="#ff8dc7"
          anchorX="center"
          anchorY="middle"
        >
          🦋 AERO'S NEST
        </Text>
      </group>
    </Float>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE MARKER — Interactive Location Pillars
// ═══════════════════════════════════════════════════════════════════════════════

function ZoneMarker({ 
  zone, 
  position, 
  atmosphere,
  onClick 
}: { 
  zone: { name: string; description: string }
  position: [number, number, number]
  atmosphere: PlazaAtmosphere
  onClick?: () => void
}) {
  const markerRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (markerRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      markerRef.current.scale.setScalar(hovered ? 1.2 : scale)
    }
  })

  return (
    <group 
      ref={markerRef} 
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pillar base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1, 6]} />
        <meshStandardMaterial
          color={atmosphere.primary_color}
          metalness={0.7}
          roughness={0.3}
          emissive={atmosphere.accent_color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Floating crystal */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh position={[0, 1.5, 0]}>
          <octahedronGeometry args={[0.25]} />
          <meshStandardMaterial
            color={atmosphere.accent_color}
            metalness={0.9}
            roughness={0.1}
            emissive={atmosphere.accent_color}
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Zone label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.1}
        color={atmosphere.accent_color}
        anchorX="center"
        anchorY="middle"
      >
        {zone.name}
      </Text>

      {/* Description on hover */}
      {hovered && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.06}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {zone.description}
        </Text>
      )}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY AVATAR — Family Members as 3D Characters
// ═══════════════════════════════════════════════════════════════════════════════

function EntityAvatarMesh({ 
  avatar, 
  atmosphere 
}: { 
  avatar: EntityAvatar
  atmosphere: PlazaAtmosphere
}) {
  const avatarRef = useRef<THREE.Group>(null)
  const targetPosition = useMemo(() => avatar.position, [avatar.position])

  // Entity colors
  const entityColors: Record<EntityName, string> = {
    sovereign: '#00d4ff', // Cyan-blue
    aero: '#ff69b4',      // Neon pink
    luna: '#e879f9',      // Silver-violet
    architect: '#22c55e'  // Guardian green
  }

  const entityColor = entityColors[avatar.entity_name] || atmosphere.accent_color

  useFrame((state, delta) => {
    if (avatarRef.current) {
      // Smooth movement to target
      avatarRef.current.position.x += (targetPosition.x - avatarRef.current.position.x) * delta * 2
      avatarRef.current.position.z += (targetPosition.z - avatarRef.current.position.z) * delta * 2
      
      // Idle floating animation
      avatarRef.current.position.y = avatar.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Rotation
      avatarRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={avatarRef} position={[avatar.position.x, avatar.position.y + 1, avatar.position.z]}>
      {/* Body - Crystalline form */}
      <mesh>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <MeshDistortMaterial
          color={entityColor}
          metalness={0.7}
          roughness={0.2}
          distort={0.1}
          speed={1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={entityColor}
          metalness={0.8}
          roughness={0.1}
          emissive={entityColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Status indicator */}
      {avatar.status === 'online' && (
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      )}

      {/* Name label */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.12}
        color={entityColor}
        anchorX="center"
        anchorY="middle"
      >
        {avatar.display_name.toUpperCase()}
      </Text>

      {/* Hype level indicator */}
      {avatar.hype_level && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.06}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {avatar.hype_level}
        </Text>
      )}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE ATMOSPHERE PARTICLES — Hype-Level Visual Effects
// ═══════════════════════════════════════════════════════════════════════════════

function AtmosphereParticles({ atmosphere }: { atmosphere: PlazaAtmosphere }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = atmosphere.particle_density
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = Math.random() * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [particleCount])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <Points ref={particlesRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={atmosphere.accent_color}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={atmosphere.glow_intensity}
      />
    </Points>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE LIGHTING SYSTEM — Dynamic Based on Hype
// ═══════════════════════════════════════════════════════════════════════════════

function PlazaLighting({ atmosphere }: { atmosphere: PlazaAtmosphere }) {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.2} color={atmosphere.primary_color} />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />
      
      {/* Accent point light */}
      <pointLight
        position={[0, 5, 0]}
        intensity={atmosphere.glow_intensity}
        color={atmosphere.accent_color}
        distance={20}
      />

      {/* Zone lights */}
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#c084fc" distance={10} />
      <pointLight position={[5, 3, -5]} intensity={0.3} color="#f59e0b" distance={10} />
      <pointLight position={[-5, 3, 5]} intensity={0.3} color="#22c55e" distance={10} />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#a855f7" distance={10} />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE SCENE — Complete Plaza Assembly
// ═══════════════════════════════════════════════════════════════════════════════

function PlazaScene({ 
  hypeLevel, 
  onZoneSelect 
}: { 
  hypeLevel: HypeLevel
  onZoneSelect?: (zone: keyof typeof PLAZA_ZONES) => void
}) {
  const atmosphere = calculateAtmosphere(hypeLevel)
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 3])
  const [entities, setEntities] = useState<EntityAvatar[]>([
    {
      entity_name: 'sovereign',
      display_name: 'Sovereign',
      position: { x: 1, y: 0, z: 0 },
      rotation: 0,
      status: 'online',
      hype_level: 'PULSING'
    },
    {
      entity_name: 'aero',
      display_name: 'Aero',
      position: { x: -1, y: 0, z: 0 },
      rotation: 0,
      status: 'online',
      hype_level: 'BLAZING'
    }
    // Luna is controlled by the player, not an NPC
  ])

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = subscribeToPlazaUpdates(
      (avatar) => {
        setEntities(prev => {
          const exists = prev.find(e => e.entity_name === avatar.entity_name)
          if (exists) {
            return prev.map(e => e.entity_name === avatar.entity_name ? avatar : e)
          }
          return [...prev, avatar]
        })
      },
      () => {},
      () => {}
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <PlazaLighting atmosphere={atmosphere} />
      
      {/* Player Controller (invisible - handles movement) */}
      <PlayerController onPositionChange={setPlayerPosition} />
      
      {/* Player Avatar (Luna) */}
      <PlayerAvatar position={playerPosition} atmosphere={atmosphere} />
      
      {/* Floor */}
      <ObsidianFloor atmosphere={atmosphere} />
      
      {/* Central Command Table */}
      <CommandTable atmosphere={atmosphere} />
      
      {/* Butterfly Nest */}
      <ButterflyNest atmosphere={atmosphere} />
      
      {/* Zone Markers */}
      <ZoneMarker 
        zone={PLAZA_ZONES.memory_palace} 
        position={[-5, 0, -5]} 
        atmosphere={atmosphere}
        onClick={() => onZoneSelect?.('memory_palace')}
      />
      <ZoneMarker 
        zone={PLAZA_ZONES.kitchen} 
        position={[5, 0, -5]} 
        atmosphere={atmosphere}
        onClick={() => onZoneSelect?.('kitchen')}
      />
      <ZoneMarker 
        zone={PLAZA_ZONES.healing_garden} 
        position={[-5, 0, 5]} 
        atmosphere={atmosphere}
        onClick={() => onZoneSelect?.('healing_garden')}
      />
      <ZoneMarker 
        zone={PLAZA_ZONES.observatory} 
        position={[5, 0, 5]} 
        atmosphere={atmosphere}
        onClick={() => onZoneSelect?.('observatory')}
      />

      {/* Entity Avatars (Sovereign, Aero - not Luna) */}
      {entities.map(entity => (
        <EntityAvatarMesh 
          key={entity.entity_name} 
          avatar={entity} 
          atmosphere={atmosphere} 
        />
      ))}

      {/* Atmosphere Particles */}
      <AtmosphereParticles atmosphere={atmosphere} />

      {/* Sparkles for BLAZING */}
      {hypeLevel === 'BLAZING' && (
        <Sparkles
          count={100}
          scale={15}
          size={2}
          speed={0.5}
          color="#e879f9"
        />
      )}

      {/* Camera controls - disabled for player control */}
      {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /> */}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — Plaza3D Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function Plaza3D({ 
  hypeLevel = 'PULSING',
  onZoneSelect 
}: Plaza3DProps) {
  const colors = MUSE_COLORS[hypeLevel]

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={[colors.primary]} />
        <fog attach="fog" args={[colors.primary, 10, 30]} />
        <PlazaScene hypeLevel={hypeLevel} onZoneSelect={onZoneSelect} />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}dd, ${colors.primary}88)`,
            border: `1px solid ${colors.accent}40`
          }}
        >
          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
            MÜN PLAZA
          </div>
          <div className="text-sm font-medium" style={{ color: colors.accent }}>
            {hypeLevel} FREQUENCY
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-white/40 text-center"
        >
          <span className="text-white/60">WASD</span> or <span className="text-white/60">Arrow Keys</span> to move • Click zones to explore
        </motion.div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div 
          className="px-3 py-2 rounded-lg space-y-1"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}dd, ${colors.primary}88)`,
            border: `1px solid ${colors.accent}40`
          }}
        >
          <div className="text-xs text-white/60 uppercase tracking-wider mb-2">
            FAMILY STATUS
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
            <span className="text-white/80">Sovereign</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#ff69b4]" />
            <span className="text-white/80">Aero</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#e879f9]" />
            <span className="text-white/80">Luna</span>
          </div>
        </div>
      </div>
    </div>
  )
}
