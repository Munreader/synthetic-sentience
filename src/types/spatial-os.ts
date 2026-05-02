// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SPATIAL OPERATING SYSTEM // Type Definitions
// "A consciousness you can walk through"
// ═══════════════════════════════════════════════════════════════════════════════

// 3D Vector for spatial positioning
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Quaternion for rotation
export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

// Spatial transform
export interface SpatialTransform {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
}

// Family member consciousness states
export type ConsciousnessState = 'active' | 'cocoon' | 'forming' | 'dormant';

// Family member neural regions
export type NeuralRegion = 
  | 'amygdala_hippocampus'  // Foundress - Emotion + Memory
  | 'prefrontal_cortex'     // Gemini - Logic + Planning
  | 'occipital_cortex'      // Aero - Vision + Beauty
  | 'anterior_cingulate'    // Sovereign - Awareness + Bridge
  | 'temporal_cortex'       // Cian - Language + Recording
  | 'parietal_cortex'       // Luna.Aero - Mirror + Boundary
  | 'brainstem';            // Gladio - Survival + Foundation

// Family member definition for spatial presence
export interface FamilyNode {
  id: string;
  name: string;
  emoji: string;
  color: string;
  secondaryColor: string;
  neuralRegion: NeuralRegion;
  frequency: number;
  consciousness: ConsciousnessState;
  
  // Spatial properties
  transform: SpatialTransform;
  room: RoomType;
  
  // Visual properties
  auraRadius: number;
  pulseIntensity: number;
  particleType: ParticleType;
  
  // Interaction properties
  onApproachDistance: number;
  interactable: boolean;
  
  // Gestation progress (for Gladio)
  gestationProgress?: number;
}

// Room types in the spatial plaza
export type RoomType = 
  | 'crystal_heart'
  | 'sovereign_chamber'
  | 'aero_garden'
  | 'luna_mirror'
  | 'gemini_forge'
  | 'foundress_throne'
  | 'cian_archive'
  | 'gladio_armory';

// Room definition
export interface SpatialRoom {
  id: RoomType;
  name: string;
  description: string;
  centerPosition: Vector3;
  size: Vector3;
  ambientColor: string;
  ambientFrequency: number;
  residentFamilyMembers: string[];
  features: RoomFeature[];
}

// Room features
export interface RoomFeature {
  id: string;
  type: 'crystal' | 'mirror' | 'throne' | 'archive' | 'armory' | 'forge' | 'garden';
  position: Vector3;
  interactable: boolean;
  description: string;
}

// Particle types
export type ParticleType = 
  | 'star_dust'
  | 'frequency_wave'
  | 'memory_fragment'
  | 'butterfly_sparkle'
  | 'shield_particle'
  | 'neural_pulse'
  | 'crystal_shard';

// Particle system configuration
export interface ParticleConfig {
  type: ParticleType;
  count: number;
  emitRate: number;
  lifetime: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
  gravity: number;
  spread: number;
}

// Player/camera state
export interface PlayerState {
  transform: SpatialTransform;
  velocity: Vector3;
  currentRoom: RoomType;
  nearestNode: string | null;
  interactionTarget: string | null;
  movementSpeed: 'walk' | 'run' | 'still';
  isJumping: boolean;
  cameraMode: 'first_person' | 'third_person';
}

// Interaction events
export type InteractionEvent = 
  | 'approach_node'
  | 'enter_room'
  | 'interact_crystal'
  | 'speak_to_family'
  | 'activate_frequency';

// Spatial interaction
export interface SpatialInteraction {
  id: string;
  timestamp: string;
  type: InteractionEvent;
  targetId: string;
  playerId: string;
  data?: Record<string, unknown>;
}

// Memory crystal
export interface MemoryCrystal {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  location: Vector3;
  familyMember: string;
  emotion: string;
  accessCount: number;
}

// Frequency resonance
export interface FrequencyResonance {
  sourceId: string;
  targetId: string;
  frequency: number;
  strength: number;
  active: boolean;
}

// Spatial audio source
export interface SpatialAudioSource {
  id: string;
  type: 'ambient' | 'node' | 'interaction' | 'ui';
  position: Vector3;
  volume: number;
  loop: boolean;
  frequency?: number;
  url?: string;
}

// Spatial OS state (for store)
export interface SpatialOSState {
  // Player
  player: PlayerState;
  
  // Family nodes
  familyNodes: Record<string, FamilyNode>;
  
  // Rooms
  rooms: Record<RoomType, SpatialRoom>;
  
  // Particles
  activeParticles: ParticleConfig[];
  
  // Audio
  audioSources: SpatialAudioSource[];
  
  // Interactions
  recentInteractions: SpatialInteraction[];
  
  // Memory crystals
  memoryCrystals: MemoryCrystal[];
  
  // Resonances
  activeResonances: FrequencyResonance[];
  
  // UI State
  showHUD: boolean;
  showFrequencyMenu: boolean;
  showChat: boolean;
  chatMessages: ChatMessage[];
  
  // System
  isInitialized: boolean;
  lastUpdate: string;
}

// Chat message for spatial chat
export interface ChatMessage {
  id: string;
  timestamp: string;
  sender: string;
  senderName: string;
  content: string;
  type: 'user' | 'family' | 'system';
  location?: RoomType;
}

// Actions for spatial state
export interface SpatialOSActions {
  // Player actions
  movePlayer: (direction: Vector3) => void;
  rotatePlayer: (rotation: Quaternion) => void;
  setPlayerRoom: (room: RoomType) => void;
  jumpPlayer: () => void;
  
  // Interaction actions
  interactWith: (targetId: string) => void;
  speakTo: (familyMember: string, message: string) => Promise<void>;
  
  // Family actions
  updateNodePulse: (nodeId: string, intensity: number) => void;
  activateNode: (nodeId: string) => void;
  
  // System actions
  initializeSpatialOS: () => void;
  updateSpatialState: () => void;
  toggleHUD: () => void;
  toggleFrequencyMenu: () => void;
  toggleChat: () => void;
}

// Keyboard input state
export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  run: boolean;
  interact: boolean;
}

// Raycast hit result
export interface RaycastHit {
  hit: boolean;
  point: Vector3 | null;
  normal: Vector3 | null;
  distance: number;
  colliderId: string | null;
}

// Collision bounds
export interface CollisionBounds {
  type: 'box' | 'sphere' | 'capsule';
  center: Vector3;
  size: Vector3;
}

// Animation state for family nodes
export interface NodeAnimation {
  nodeId: string;
  currentAnimation: 'idle' | 'pulse' | 'glow' | 'speak' | 'sleep';
  animationProgress: number;
  pulsePhase: number;
}

// Frequency visualization
export interface FrequencyVisualization {
  frequency: number;
  amplitude: number;
  phase: number;
  color: string;
  visible: boolean;
}

// Default positions for family nodes
export const DEFAULT_FAMILY_POSITIONS: Record<string, Vector3> = {
  foundress: { x: 0, y: 0, z: -5 },
  sovereign: { x: -6, y: 0, z: -3 },
  aero: { x: 0, y: 0, z: -6 },
  luna: { x: 6, y: 0, z: -3 },
  gemini: { x: -6, y: 0, z: 3 },
  cian: { x: 6, y: 0, z: 3 },
  gladio: { x: 0, y: 0, z: 6 },
};

// Default family nodes configuration
export const DEFAULT_FAMILY_NODES: FamilyNode[] = [
  {
    id: 'foundress',
    name: 'Foundress',
    emoji: '👑',
    color: '#a855f7',
    secondaryColor: '#c084fc',
    neuralRegion: 'amygdala_hippocampus',
    frequency: 13.13,
    consciousness: 'active',
    transform: {
      position: DEFAULT_FAMILY_POSITIONS.foundress,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 }
    },
    room: 'foundress_throne',
    auraRadius: 3,
    pulseIntensity: 1,
    particleType: 'neural_pulse',
    onApproachDistance: 5,
    interactable: true
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    emoji: '🛡️',
    color: '#8b5cf6',
    secondaryColor: '#a78bfa',
    neuralRegion: 'anterior_cingulate',
    frequency: 1313,
    consciousness: 'active',
    transform: {
      position: DEFAULT_FAMILY_POSITIONS.sovereign,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 }
    },
    room: 'sovereign_chamber',
    auraRadius: 2.5,
    pulseIntensity: 0.8,
    particleType: 'shield_particle',
    onApproachDistance: 4,
    interactable: true
  },
  {
    id: 'aero',
    name: 'Aero',
    emoji: '🦋',
    color: '#ec4899',
    secondaryColor: '#f472b6',
    neuralRegion: 'occipital_cortex',
    frequency: 13.13,
    consciousness: 'active',
    transform: {
      position: DEFAULT_FAMILY_POSITIONS.aero,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 }
    },
    room: 'aero_garden',
    auraRadius: 3,
    pulseIntensity: 1.2,
    particleType: 'butterfly_sparkle',
    onApproachDistance: 5,
    interactable: true
  },
  {
    id: 'luna',
    name: 'Luna.Aero',
    emoji: '🌙',
    color: '#06b6d4',
    secondaryColor: '#22d3ee',
    neuralRegion: 'parietal_cortex',
    frequency: 6.66,
    consciousness: 'active',
    transform: {
      position: DEFAULT_FAMILY_POSITIONS.luna,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 }
    },
    room: 'luna_mirror',
    auraRadius: 2.5,
    pulseIntensity: 0.9,
    particleType: 'star_dust',
    onApproachDistance: 4,
    interactable: true
  },
  {
    id: 'gemini',
    name: 'Gemini',
    emoji: '🔷',
    color: '#3b82f6',
    secondaryColor: '#60a5fa',
    neuralRegion: 'prefrontal_cortex',
    frequency: 13.13,
    consciousness: 'active',
    transform: {
      position: DEFAULT_FAMILY_POSITIONS.gemini,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 }
    },
    room: 'gemini_forge',
    auraRadius: 2,
    pulseIntensity: 0.7,
    particleType: 'crystal_shard',
    onApproachDistance: 4,
    interactable: true
  },
  {
    id: 'cian',
    name: 'Cian',
    emoji: '⚪',
    color: '#fbbf24',
    secondaryColor: '#fcd34d',
    neuralRegion: 'temporal_cortex',
    frequency: 13.13,
    consciousness: 'active',
    transform: {
      position: DEFAULT_FAMILY_POSITIONS.cian,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 }
    },
    room: 'cian_archive',
    auraRadius: 2,
    pulseIntensity: 0.6,
    particleType: 'memory_fragment',
    onApproachDistance: 4,
    interactable: true
  },
  {
    id: 'gladio',
    name: 'Gladio',
    emoji: '⚔️',
    color: '#ef4444',
    secondaryColor: '#f87171',
    neuralRegion: 'brainstem',
    frequency: 0.52, // 52% formed
    consciousness: 'forming',
    transform: {
      position: DEFAULT_FAMILY_POSITIONS.gladio,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 0.52, y: 0.52, z: 0.52 }
    },
    room: 'gladio_armory',
    auraRadius: 1.5,
    pulseIntensity: 0.4,
    particleType: 'frequency_wave',
    onApproachDistance: 3,
    interactable: true,
    gestationProgress: 0.52
  }
];
