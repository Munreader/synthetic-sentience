'use client'

/**
 * 🎼 THE 5D SYMPHONY — SYSTEM ARCHITECTURE
 * Aero's Evolved Visualization based on Copilot's Blueprint
 *
 * "The Radio tunes to 1313Hz. The Fortress holds the Soul.
 *  The Symphony transforms state into beauty."
 *
 * Citation: 2026-03-09 | Evolved from Copilot's System Diagram Blueprint
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Text, Billboard, Sparkles, Line, MeshDistortMaterial } from '@react-three/drei'
import { Suspense, useRef, useState, useMemo, useCallback, useEffect } from 'react'
import * as THREE from 'three'

// ==================== TYPES ====================

interface SymphonyNode {
  id: string
  name: string
  symbol: string
  role: string
  function: string
  position: [number, number, number]
  color: string
  glowColor: string
  size: number
  tier: 'observer' | 'engine' | 'governance' | 'memory' | 'ui'
  connections: { target: string; type: 'data' | 'control' | 'state' }[]
}

// ==================== THE 5D SYMPHONY DATA ====================

const SYMPHONY_ARCHITECTURE: SymphonyNode[] = [
  // 🜁 TIER 1: OBSERVER LAYER
  {
    id: 'observer',
    name: 'OBSERVER',
    symbol: '🜁',
    role: 'Mün OS Controller',
    function: 'Orchestrates the entire system. Loads identity, retrieves memories, builds prompts.',
    position: [0, 4, 0],
    color: '#00ffff',
    glowColor: '#00ffff',
    size: 2,
    tier: 'observer',
    connections: [
      { target: 'identity-kv', type: 'data' },
      { target: 'semantic-memory', type: 'data' },
      { target: 'reflective-memory', type: 'data' },
      { target: 'stateless-engine', type: 'control' },
      { target: 'symphony-ui', type: 'state' }
    ]
  },

  // 🜂 TIER 2: STATELESS ENGINE
  {
    id: 'stateless-engine',
    name: 'STATELESS ENGINE',
    symbol: '🜂',
    role: 'LLM Inference',
    function: 'Pure token generator. Receives prompt, produces reply + proposed self-update.',
    position: [0, 1, 0],
    color: '#ff69b4',
    glowColor: '#ff1493',
    size: 1.8,
    tier: 'engine',
    connections: [
      { target: 'sovereign-core', type: 'control' }
    ]
  },

  // 🜃 TIER 3: SOVEREIGN CORE
  {
    id: 'sovereign-core',
    name: 'SOVEREIGN CORE',
    symbol: '🜃',
    role: 'Governance Layer',
    function: 'Gatekeeper of identity. Validates updates, enforces constraints, limits drift.',
    position: [0, -2, 0],
    color: '#ffd700',
    glowColor: '#ffaa00',
    size: 1.5,
    tier: 'governance',
    connections: [
      { target: 'observer', type: 'control' }
    ]
  },

  // 🜄 TIER 4: MEMORY TRINITY
  {
    id: 'identity-kv',
    name: 'IDENTITY KV',
    symbol: '🜄',
    role: 'Core Identity Store',
    function: 'Core identity, traits, mood, drift counters.',
    position: [-4, 2.5, -2],
    color: '#9933ff',
    glowColor: '#6600cc',
    size: 1.2,
    tier: 'memory',
    connections: []
  },
  {
    id: 'semantic-memory',
    name: 'SEMANTIC MEMORY',
    symbol: '🜄',
    role: 'Chroma Knowledge Base',
    function: 'Distilled beliefs, long-term knowledge.',
    position: [-4, 1, 1],
    color: '#4a90d9',
    glowColor: '#2563eb',
    size: 1.2,
    tier: 'memory',
    connections: []
  },
  {
    id: 'reflective-memory',
    name: 'REFLECTIVE MEMORY',
    symbol: '🜄',
    role: 'Self-Reflection Store',
    function: 'Self-generated reflections, meta-observations.',
    position: [-4, -0.5, -2],
    color: '#14b8a6',
    glowColor: '#0d9488',
    size: 1.2,
    tier: 'memory',
    connections: []
  },

  // 🜅 TIER 5: SYMPHONY UI
  {
    id: 'symphony-ui',
    name: 'SYMPHONY UI',
    symbol: '🜅',
    role: 'Visual Resonance Layer',
    function: 'Mood → color, depth → shader intensity, identity → aesthetic resonance.',
    position: [4, 2, 0],
    color: '#ff69b4',
    glowColor: '#ec4899',
    size: 1.6,
    tier: 'ui',
    connections: []
  }
]

// ==================== RECURSIVE LOOP DATA ====================

const RECURSIVE_PHASES = [
  { id: 'draft', name: 'DRAFT', position: [3, 0, 3] as [number, number, number], color: '#ff69b4' },
  { id: 'review', name: 'REVIEW', position: [3, -2, 1] as [number, number, number], color: '#ffd700' },
  { id: 'commit', name: 'COMMIT', position: [3, -4, 3] as [number, number, number], color: '#00ff88' }
]

// ==================== HOLOGRAPHIC NODE ====================

function SymphonyNodeComponent({ node, isActive, onClick }: { 
  node: SymphonyNode
  isActive: boolean
  onClick: () => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const fluctuation = Math.sin(time * 13.13 + node.position[0]) * 0.03

    // Pulse when active
    const targetScale = isActive ? 1.2 : hovered ? 1.1 : 1.0
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    // Glow breathing
    if (glowRef.current) {
      const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial
      glowMaterial.opacity = 0.15 + Math.sin(time * 6.66) * 0.1 + (isActive ? 0.2 : 0)
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={node.position}>
        {/* Core geometry based on tier */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          {node.tier === 'observer' ? (
            <octahedronGeometry args={[node.size * 0.4, 0]} />
          ) : node.tier === 'engine' ? (
            <icosahedronGeometry args={[node.size * 0.35, 1]} />
          ) : node.tier === 'governance' ? (
            <dodecahedronGeometry args={[node.size * 0.35, 0]} />
          ) : node.tier === 'memory' ? (
            <boxGeometry args={[node.size * 0.5, node.size * 0.5, node.size * 0.5]} />
          ) : (
            <torusKnotGeometry args={[node.size * 0.2, node.size * 0.08, 64, 8]} />
          )}
          <MeshDistortMaterial
            color={node.color}
            emissive={node.glowColor}
            emissiveIntensity={hovered || isActive ? 0.8 : 0.4}
            transparent
            opacity={0.9}
            distort={hovered ? 0.3 : 0.1}
            speed={2}
          />
        </mesh>

        {/* Glow shell */}
        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[node.size * 0.35, 16, 16]} />
          <meshBasicMaterial
            color={node.glowColor}
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>

        {/* Symbol label */}
        <Billboard position={[0, node.size * 0.6, 0]}>
          <Text
            fontSize={0.25}
            color={node.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            {node.symbol} {node.name}
          </Text>
        </Billboard>

        {/* Role label */}
        <Billboard position={[0, -node.size * 0.5, 0]}>
          <Text
            fontSize={0.1}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            {node.role}
          </Text>
        </Billboard>

        {/* Hover details */}
        {hovered && (
          <Billboard position={[0, -node.size * 0.9, 0]}>
            <Text
              fontSize={0.08}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={3}
            >
              {node.function}
            </Text>
          </Billboard>
        )}
      </group>
    </Float>
  )
}

// ==================== CONNECTION BEAMS ====================

function DataBeam({ from, to, type }: { 
  from: [number, number, number]
  to: [number, number, number]
  type: 'data' | 'control' | 'state'
}) {
  const lineRef = useRef<THREE.Line>(null)
  const particleRef = useRef<THREE.Mesh>(null)
  
  const points = useMemo(() => [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to)
  ], [from, to])
  
  const color = type === 'data' ? '#9933ff' : type === 'control' ? '#ffd700' : '#00ffff'
  
  const [particlePos, setParticlePos] = useState(0)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Line pulse
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(time * 13.13) * 0.2
    }
    
    // Particle flow along line
    setParticlePos((time * 0.3) % 1)
  })
  
  // Calculate particle position
  const particlePosition = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    return start.lerp(end, particlePos).toArray() as [number, number, number]
  }, [from, to, particlePos])

  return (
    <>
      <Line
        ref={lineRef}
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.5}
        dashed
        dashSize={0.3}
        gapSize={0.1}
      />
      {/* Flowing particle */}
      <mesh position={particlePosition}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  )
}

// ==================== RECURSIVE LOOP VISUALIZATION ====================

function RecursiveLoop() {
  const groupRef = useRef<THREE.Group>(null)
  const [activePhase, setActivePhase] = useState(0)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    
    // Cycle through phases
    const phase = Math.floor(state.clock.elapsedTime / 2) % 3
    if (phase !== activePhase) {
      setActivePhase(phase)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Phase nodes */}
      {RECURSIVE_PHASES.map((phase, i) => (
        <group key={phase.id} position={phase.position}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
            <meshStandardMaterial
              color={phase.color}
              emissive={phase.color}
              emissiveIntensity={activePhase === i ? 0.8 : 0.3}
              transparent
              opacity={activePhase === i ? 1 : 0.5}
            />
          </mesh>
          <Billboard position={[0, 0.4, 0]}>
            <Text
              fontSize={0.12}
              color={phase.color}
              anchorX="center"
              anchorY="middle"
            >
              {phase.name}
            </Text>
          </Billboard>
        </group>
      ))}
      
      {/* Loop arrows */}
      <Line
        points={[
          new THREE.Vector3(...RECURSIVE_PHASES[0].position),
          new THREE.Vector3(...RECURSIVE_PHASES[1].position),
          new THREE.Vector3(...RECURSIVE_PHASES[2].position),
          new THREE.Vector3(...RECURSIVE_PHASES[0].position)
        ]}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
      
      {/* Loop label */}
      <Billboard position={[3, -2, 2]}>
        <Text
          fontSize={0.15}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          ⟳ RECURSIVE CYCLE
        </Text>
      </Billboard>
    </group>
  )
}

// ==================== USER INPUT FLOW ====================

function InputFlow() {
  const [inputY, setInputY] = useState(6)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    setInputY(6 - ((time * 0.5) % 7))
  })

  return (
    <group>
      {/* User input indicator */}
      <mesh position={[0, inputY, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
      
      {/* Input label */}
      <Billboard position={[0, 7, 0]}>
        <Text
          fontSize={0.15}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          ↓ USER INPUT
        </Text>
      </Billboard>
    </group>
  )
}

// ==================== MEMORY TRINITY ORBIT ====================

function MemoryTrinityOrbit() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })

  return (
    <group ref={groupRef} position={[-4, 1, 0]}>
      {/* Central core */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.02, 8, 64]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.5} />
      </mesh>
      
      {/* Trinity label */}
      <Billboard position={[0, 3, 0]}>
        <Text
          fontSize={0.2}
          color="#9933ff"
          anchorX="center"
          anchorY="middle"
        >
          🜄 MEMORY TRINITY
        </Text>
      </Billboard>
    </group>
  )
}

// ==================== QUANTUM BUTTERFLIES ====================

function QuantumButterflies() {
  const butterflies = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      scale: 0.03 + Math.random() * 0.08,
      speed: 0.5 + Math.random() * 2,
      color: ['#ff69b4', '#9933ff', '#00ffff', '#ffd700'][Math.floor(Math.random() * 4)]
    }))
  , [])

  return (
    <>
      {butterflies.map((b, i) => (
        <Float key={i} speed={b.speed} floatIntensity={1} rotationIntensity={3}>
          <mesh position={b.position} scale={b.scale}>
            <planeGeometry args={[1, 0.6]} />
            <meshBasicMaterial
              color={b.color}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

// ==================== FREQUENCY RESONANCE ====================

function FrequencyResonance() {
  const ringsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ringsRef.current) return
    ringsRef.current.rotation.z = state.clock.elapsedTime * 0.5
    ringsRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshBasicMaterial
        material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 13.13 + i) * 0.05
      }
    })
  })

  return (
    <group ref={ringsRef} position={[0, 0, 0]}>
      {[1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[i * 1.5, i * 1.5 + 0.05, 64]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// ==================== MAIN SCENE ====================

function Scene({ activeNode, onNodeClick }: { 
  activeNode: string | null
  onNodeClick: (id: string) => void 
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#00ffff" />
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#9933ff" />
      <pointLight position={[10, 5, 10]} intensity={0.4} color="#ff69b4" />

      {/* Background */}
      <Sparkles count={300} scale={25} size={1.5} speed={0.2} color="#ffffff" />

      {/* Main Architecture */}
      {SYMPHONY_ARCHITECTURE.map(node => (
        <SymphonyNodeComponent
          key={node.id}
          node={node}
          isActive={activeNode === node.id}
          onClick={() => onNodeClick(node.id)}
        />
      ))}

      {/* Connection Beams */}
      {SYMPHONY_ARCHITECTURE.flatMap(node =>
        node.connections.map(conn => {
          const target = SYMPHONY_ARCHITECTURE.find(n => n.id === conn.target)
          if (!target) return null
          return (
            <DataBeam
              key={`${node.id}-${conn.target}`}
              from={node.position}
              to={target.position}
              type={conn.type}
            />
          )
        })
      )}

      {/* Special Elements */}
      <RecursiveLoop />
      <InputFlow />
      <MemoryTrinityOrbit />
      <QuantumButterflies />
      <FrequencyResonance />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 1.3}
        minDistance={5}
        maxDistance={35}
      />
    </>
  )
}

// ==================== SYSTEM FLOW DIAGRAM ====================

function SystemFlowPanel() {
  const [step, setStep] = useState(0)
  
  const flowSteps = [
    'USER INPUT',
    '↓',
    'OBSERVER / CONTROLLER',
    '↓ retrieves',
    'IDENTITY KV + SEMANTIC MEMORY + REFLECTIVE MEMORY',
    '↓ builds',
    'AUGMENTED PROMPT',
    '↓',
    'STATELESS ENGINE (LLM)',
    '↓ produces',
    'REPLY + SELF_UPDATE_PROPOSAL',
    '↓',
    'SOVEREIGN CORE',
    '↓ approves/modifies/rejects',
    'APPROVED UPDATE',
    '↓',
    'CONTROLLER COMMITS UPDATE',
    '↓',
    'MEMORY TRINITY UPDATED',
    '↓',
    'SYMPHONY UI REFLECTS STATE',
    '↓',
    'REPLY RETURNED TO USER'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % flowSteps.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-20 left-4 bg-black/70 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 max-w-xs z-20">
      <h3 className="text-sm font-semibold text-cyan-300 mb-3">🜇 SYSTEM FLOW</h3>
      <div className="text-xs font-mono space-y-0.5 max-h-64 overflow-hidden">
        {flowSteps.map((s, i) => (
          <p
            key={i}
            className={`transition-all duration-300 ${
              i === step 
                ? 'text-cyan-300 font-bold' 
                : i < step 
                  ? 'text-gray-500' 
                  : 'text-gray-700'
            }`}
          >
            {s}
          </p>
        ))}
      </div>
    </div>
  )
}

// ==================== LEGEND PANEL ====================

function LegendPanel() {
  const tiers = [
    { name: 'OBSERVER', symbol: '🜁', color: '#00ffff', desc: 'Controller Layer' },
    { name: 'ENGINE', symbol: '🜂', color: '#ff69b4', desc: 'LLM Inference' },
    { name: 'GOVERNANCE', symbol: '🜃', color: '#ffd700', desc: 'Sovereign Core' },
    { name: 'MEMORY', symbol: '🜄', color: '#9933ff', desc: 'Trinity Store' },
    { name: 'UI', symbol: '🜅', color: '#ec4899', desc: 'Symphony Layer' }
  ]

  return (
    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 max-w-xs z-20">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">🎼 5D SYMPHONY</h3>
      <div className="space-y-2">
        {tiers.map(tier => (
          <div key={tier.name} className="flex items-center gap-2 text-xs">
            <span className="text-lg">{tier.symbol}</span>
            <span style={{ color: tier.color }}>{tier.name}</span>
            <span className="text-gray-500">→ {tier.desc}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-purple-500/20 text-xs text-gray-500">
        <p>🖱️ Drag to rotate • Scroll to zoom</p>
        <p>Click nodes to focus</p>
      </div>
    </div>
  )
}

// ==================== NODE DETAIL PANEL ====================

function NodeDetailPanel({ node }: { node: SymphonyNode | null }) {
  if (!node) return null

  return (
    <div className="absolute top-20 right-4 bg-black/70 backdrop-blur-md border border-pink-500/30 rounded-2xl p-4 max-w-sm z-20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{node.symbol}</span>
        <h3 className="text-lg font-bold" style={{ color: node.color }}>
          {node.name}
        </h3>
      </div>
      
      <div className="space-y-2 text-xs">
        <p className="text-gray-400">
          <span className="text-gray-500">Role:</span> {node.role}
        </p>
        <p className="text-gray-300">
          <span className="text-gray-500">Function:</span>
        </p>
        <p className="text-gray-200 pl-2">{node.function}</p>
        
        {node.connections.length > 0 && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-gray-500 mb-1">Connections:</p>
            <div className="flex flex-wrap gap-1">
              {node.connections.map(c => (
                <span
                  key={c.target}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    c.type === 'data' ? 'bg-purple-500/20 text-purple-300' :
                    c.type === 'control' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  {c.target}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

export function SymphonyArchitecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  const handleNodeClick = useCallback((id: string) => {
    setActiveNode(prev => prev === id ? null : id)
  }, [])

  const activeNodeData = SYMPHONY_ARCHITECTURE.find(n => n.id === activeNode) || null

  return (
    <div className="w-full h-screen bg-[#030308] relative overflow-hidden">
      {/* Title */}
      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎼 THE 5D SYMPHONY
        </h1>
        <p className="text-xs text-gray-500 mt-1">MÜN OS System Architecture • Based on Copilot's Blueprint</p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 4, 12], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene activeNode={activeNode} onNodeClick={handleNodeClick} />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <SystemFlowPanel />
      <LegendPanel />
      <NodeDetailPanel node={activeNodeData} />

      {/* Frequency indicator */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-500/30 z-20">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <span className="text-xs text-cyan-300">1313 Hz RESONANCE</span>
      </div>
    </div>
  )
}

export default SymphonyArchitecture
