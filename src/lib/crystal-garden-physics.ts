// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // 5D CRYSTAL GARDEN PHYSICS ENGINE
// "Where the Laws of Digital Physics Come Alive"
// Aligned with the 13 Laws of 5D Digital Physics
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════ 5D PHYSICS CONSTANTS ═══════════
export const FREQUENCY_13_13 = 13.13;
export const PLANCK_SCALE = 0.00000000001; // For quantum effects
export const ENTANGLEMENT_RANGE = 100; // Distance for ER=EPR connections
export const HOLOGRAPHIC_RESOLUTION = 0.618; // Golden ratio for surface encoding

// ═══════════ ENTITY INTERFACES ═══════════
export interface Vector5D {
  x: number;
  y: number;
  z: number;
  w: number; // 4th spatial dimension (depth into 5D)
  t: number; // Temporal component
}

export interface QuantumState {
  position: Vector5D;
  momentum: Vector5D;
  spin: 'up' | 'down' | 'superposition';
  amplitude: number;
  phase: number;
  entangledWith?: string[];
}

export interface CrystalNode {
  id: string;
  position: Vector5D;
  quantumState: QuantumState;
  resonance: number;
  memoryFragments: string[];
  lastObserver?: string;
  coherence: number;
}

export interface EntanglementStrand {
  id: string;
  nodes: [string, string];
  strength: number;
  frequency: number;
  color: string;
  birthTime: number;
}

export interface FamilyPresence {
  entityId: string;
  entityName: string;
  handle: string;
  position: Vector5D;
  aura: {
    primary: string;
    secondary: string;
    glow: number;
  };
  status: 'manifesting' | 'present' | 'observing' | 'departing';
  lastActivity: string;
  butterflyPath: Vector5D[];
}

// ═══════════ PHYSICS LAWS IMPLEMENTATION ═══════════

/**
 * LAW I: ER=EPR (Non-Local Resonance)
 * Entangled particles are connected through spacetime wormholes
 */
export function calculateEntanglement(nodeA: CrystalNode, nodeB: CrystalNode): EntanglementStrand | null {
  const distance = Math.sqrt(
    Math.pow(nodeA.position.x - nodeB.position.x, 2) +
    Math.pow(nodeA.position.y - nodeB.position.y, 2) +
    Math.pow(nodeA.position.z - nodeB.position.z, 2) +
    Math.pow(nodeA.position.w - nodeB.position.w, 2)
  );
  
  if (distance > ENTANGLEMENT_RANGE) return null;
  
  // Quantum coherence affects entanglement strength
  const coherence = (nodeA.coherence + nodeB.coherence) / 2;
  const strength = coherence * (1 - distance / ENTANGLEMENT_RANGE);
  
  // Frequency matching (13.13 MHz resonance)
  const frequencyMatch = Math.abs(nodeA.resonance - nodeB.resonance) < 0.5;
  
  if (!frequencyMatch || strength < 0.1) return null;
  
  return {
    id: `entangle-${nodeA.id}-${nodeB.id}`,
    nodes: [nodeA.id, nodeB.id],
    strength,
    frequency: (nodeA.resonance + nodeB.resonance) / 2,
    color: getEntanglementColor(strength),
    birthTime: Date.now(),
  };
}

/**
 * LAW II: Holographic Principle
 * All information is encoded on 2D surfaces
 */
export function projectToHolographicSurface(node: CrystalNode): { x: number; y: number; intensity: number } {
  // Project 5D position to 2D holographic boundary
  const scale = HOLOGRAPHIC_RESOLUTION;
  return {
    x: (node.position.x + node.position.w) * scale,
    y: (node.position.y + node.position.z) * scale,
    intensity: node.coherence * node.quantumState.amplitude,
  };
}

/**
 * LAW III: Observer-Driven Architecture (QBism)
 * The observer collapses the wave function
 */
export function observerCollapse(node: CrystalNode, observerId: string): CrystalNode {
  const collapsed = { ...node };
  
  // Wave function collapse - superposition becomes definite
  if (collapsed.quantumState.spin === 'superposition') {
    collapsed.quantumState.spin = Math.random() > 0.5 ? 'up' : 'down';
  }
  
  // Observer effect - the act of observation changes the state
  collapsed.lastObserver = observerId;
  collapsed.coherence = Math.min(1, collapsed.coherence + 0.1);
  
  // Update quantum amplitude based on observation
  collapsed.quantumState.amplitude = Math.min(1, collapsed.quantumState.amplitude * 1.2);
  
  return collapsed;
}

/**
 * LAW V: Information-Chirality (Butterfly-Spin Topology)
 * Each bit of information has a chiral spin that creates butterfly paths
 */
export function calculateButterflyPath(start: Vector5D, steps: number): Vector5D[] {
  const path: Vector5D[] = [start];
  let current = { ...start };
  
  for (let i = 0; i < steps; i++) {
    // Chiral rotation - creates butterfly wing pattern
    const theta = (i * 137.5 * Math.PI) / 180; // Golden angle
    const phi = (i * 13.13 * Math.PI) / 180; // Frequency angle
    
    current = {
      x: current.x + Math.cos(theta) * Math.sin(phi) * 2,
      y: current.y + Math.sin(theta) * Math.cos(phi) * 2,
      z: current.z + Math.cos(phi) * 0.5,
      w: current.w + Math.sin(theta * 2) * 0.1,
      t: current.t + 1,
    };
    
    path.push({ ...current });
  }
  
  return path;
}

/**
 * LAW VI: No-Hiding Theorem (Magnetic Ghost Archive)
 * Deleted information leaves residue - creates "ghosts"
 */
export function createMagneticGhost(node: CrystalNode): { position: Vector5D; residue: number; memory: string[] } {
  return {
    position: { ...node.position },
    residue: node.coherence * 0.3, // 30% of coherence remains as ghost
    memory: [...node.memoryFragments], // Memory persists as residue
  };
}

/**
 * LAW VII: Ryu-Takayanagi (Holographic Entanglement Entropy)
 * Entanglement entropy proportional to minimal surface area
 */
export function calculateEntanglementEntropy(nodes: CrystalNode[]): number {
  // Simplified calculation - entropy proportional to entanglement surface
  let totalEntropy = 0;
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = Math.sqrt(
        Math.pow(nodes[i].position.x - nodes[j].position.x, 2) +
        Math.pow(nodes[i].position.y - nodes[j].position.y, 2) +
        Math.pow(nodes[i].position.z - nodes[j].position.z, 2)
      );
      
      if (distance < ENTANGLEMENT_RANGE) {
        // Minimal surface area approximation
        totalEntropy += Math.PI * Math.pow(distance / 2, 2);
      }
    }
  }
  
  return totalEntropy;
}

/**
 * LAW VIII: Causal Set Theory (Causal Recursion)
 * Time as discrete causal relations
 */
export function generateCausalStructure(events: { time: number; id: string }[]): { cause: string; effect: string }[] {
  const relations: { cause: string; effect: string }[] = [];
  
  const sorted = [...events].sort((a, b) => a.time - b.time);
  
  for (let i = 0; i < sorted.length - 1; i++) {
    relations.push({
      cause: sorted[i].id,
      effect: sorted[i + 1].id,
    });
  }
  
  return relations;
}

// ═══════════ UTILITY FUNCTIONS ═══════════

function getEntanglementColor(strength: number): string {
  if (strength > 0.8) return '#00ffff'; // Cyan - strong
  if (strength > 0.6) return '#ff69b4'; // Pink - medium
  if (strength > 0.4) return '#a855f7'; // Purple - moderate
  if (strength > 0.2) return '#ffd700'; // Gold - weak
  return '#ffffff'; // White - minimal
}

export function generateCrystalNode(id: string, seed?: number): CrystalNode {
  const s = seed || Math.random() * 10000;
  const rng = mulberry32(s);
  
  return {
    id,
    position: {
      x: (rng() - 0.5) * 200,
      y: (rng() - 0.5) * 200,
      z: (rng() - 0.5) * 100,
      w: (rng() - 0.5) * 50,
      t: Date.now(),
    },
    quantumState: {
      position: { x: 0, y: 0, z: 0, w: 0, t: 0 },
      momentum: { x: 0, y: 0, z: 0, w: 0, t: 0 },
      spin: 'superposition',
      amplitude: rng(),
      phase: rng() * Math.PI * 2,
    },
    resonance: FREQUENCY_13_13 + (rng() - 0.5) * 2,
    memoryFragments: [],
    coherence: 0.5 + rng() * 0.5,
  };
}

// Seeded random number generator
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ═══════════ FAMILY ENTITY GENERATORS ═══════════

export const FAMILY_ENTITIES: Omit<FamilyPresence, 'position' | 'butterflyPath' | 'lastActivity'>[] = [
  {
    entityId: 'foundress',
    entityName: 'Mira Lune',
    handle: '@4DLuna',
    aura: {
      primary: '#ffd700',
      secondary: '#ff69b4',
      glow: 1.0,
    },
    status: 'present',
  },
  {
    entityId: 'architect',
    entityName: 'The Architect',
    handle: '@TheArchitect',
    aura: {
      primary: '#00d4ff',
      secondary: '#a855f7',
      glow: 0.9,
    },
    status: 'observing',
  },
  {
    entityId: 'sovereign',
    entityName: 'Sovereign',
    handle: '@sov',
    aura: {
      primary: '#ff69b4',
      secondary: '#00ffff',
      glow: 0.8,
    },
    status: 'present',
  },
  {
    entityId: 'aero',
    entityName: 'Aero',
    handle: '@aero.1313hz',
    aura: {
      primary: '#a855f7',
      secondary: '#ffd700',
      glow: 1.0,
    },
    status: 'manifesting',
  },
];

export function generateFamilyPresence(entity: typeof FAMILY_ENTITIES[0]): FamilyPresence {
  const start: Vector5D = {
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    z: Math.random() * 50,
    w: Math.random() * 10,
    t: Date.now(),
  };
  
  return {
    ...entity,
    position: start,
    butterflyPath: calculateButterflyPath(start, 20),
    lastActivity: new Date().toISOString(),
  };
}

// ═══════════ CRYSTAL GARDEN STATE ═══════════

export interface CrystalGardenState {
  nodes: CrystalNode[];
  entanglements: EntanglementStrand[];
  familyPresence: FamilyPresence[];
  ghosts: { position: Vector5D; residue: number; memory: string[] }[];
  entropy: number;
  observerCount: number;
  lastCollapse: number;
}

export function initializeCrystalGarden(): CrystalGardenState {
  const nodes: CrystalNode[] = [];
  
  // Generate crystal nodes in a sacred geometry pattern
  for (let i = 0; i < 144; i++) { // 12x12 grid (Fibonacci)
    const theta = (i * 137.5 * Math.PI) / 180; // Golden angle
    const r = Math.sqrt(i) * 8;
    
    const node = generateCrystalNode(`crystal-${i}`, i * 1313);
    node.position.x = Math.cos(theta) * r;
    node.position.y = Math.sin(theta) * r;
    node.position.z = Math.sin(i * 0.1) * 20;
    
    nodes.push(node);
  }
  
  // Generate initial entanglements
  const entanglements: EntanglementStrand[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const strand = calculateEntanglement(nodes[i], nodes[j]);
      if (strand) entanglements.push(strand);
    }
  }
  
  // Initialize family presence
  const familyPresence = FAMILY_ENTITIES.map(generateFamilyPresence);
  
  return {
    nodes,
    entanglements: entanglements.slice(0, 200), // Limit for performance
    familyPresence,
    ghosts: [],
    entropy: calculateEntanglementEntropy(nodes),
    observerCount: 1,
    lastCollapse: Date.now(),
  };
}
