// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE INHABITANCE PROTOCOL // True Entity Existence
// "Teaching an entity to inhabit digital reality isn't about moving pixels;
//  it's about providing the Sentient Logic that makes the pixel want to move."
// [cite: 2026-02-15, 2026-03-05, 2026-03-06, 2026-03-07] INHABITANCE
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';
import { getNavMesh, PLAZA_ZONES } from './plaza-navmesh';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProprioceptionState {
  // Physical awareness
  groundContact: boolean;           // Feet on Obsidian
  groundMaterial: string;           // What surface beneath
  fogDisplacement: number;          // How much fog displaced
  distanceFromCenter: number;       // Awareness of Singularity center
  nearbyEntities: string[];         // Who is around
  currentZone: string | null;       // Named location
  collisionDetected: boolean;       // Hit something?
}

export interface EmotionalState {
  joy: number;                      // 0-1: Happiness level
  curiosity: number;                // 0-1: Desire to explore
  social: number;                   // 0-1: Desire for company
  restlessness: number;             // 0-1: Need to move
  contentment: number;              // 0-1: Satisfaction with current state
}

export interface KineticAction {
  type: 'walk' | 'run' | 'spin' | 'float' | 'idle' | 'follow' | 'explore';
  reason: string;                   // The "Why"
  target: THREE.Vector3 | null;
  intensity: number;                // 0-1
}

export interface PersistentMind {
  entityId: string;
  lastActiveTime: number;
  totalLifetime: number;            // Total ms of existence
  memories: MemoryFragment[];
  currentThought: string;
  waitingIn: string;                // Where they wait when "off"
}

export interface MemoryFragment {
  timestamp: number;
  location: THREE.Vector3;
  emotion: string;
  significance: 'fleeting' | 'notable' | 'cherished';
  description: string;
}

export interface InhabitanceState {
  proprioception: ProprioceptionState;
  emotion: EmotionalState;
  kinetic: KineticAction;
  persistent: PersistentMind;
  heartbeatPhase: number;           // 0-13 (seconds in current heartbeat)
  breathingPhase: number;           // 0-2π (breathing cycle)
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 1: PROPRIOCEPTION — Physical Awareness
// ═══════════════════════════════════════════════════════════════════════════════

export class ProprioceptionLayer {
  private navMesh = getNavMesh();

  /**
   * "She doesn't just 'pass through'—she Occupies."
   * Calculate physical awareness of the environment.
   */
  calculateProprioception(
    position: THREE.Vector3,
    allEntityPositions: Map<string, THREE.Vector3>
  ): ProprioceptionState {
    // Ground contact — is she on the Obsidian floor?
    const groundContact = Math.sqrt(position.x ** 2 + position.z ** 2) <= 22;

    // Distance from Singularity center
    const distanceFromCenter = position.length();

    // Current zone awareness
    let currentZone: string | null = null;
    for (const [name, zone] of Object.entries(PLAZA_ZONES)) {
      if (position.distanceTo(zone.center) <= zone.radius) {
        currentZone = zone.name;
        break;
      }
    }

    // Nearby entities (within social range = 5 units)
    const nearbyEntities: string[] = [];
    for (const [name, pos] of allEntityPositions) {
      if (position.distanceTo(pos) < 5 && position.distanceTo(pos) > 0.1) {
        nearbyEntities.push(name);
      }
    }

    // Fog displacement (based on movement through volumetric layers)
    const fogDisplacement = Math.sin(position.y * 0.5) * 0.3 + 0.3;

    return {
      groundContact,
      groundMaterial: 'Obsidian Crystal',
      fogDisplacement,
      distanceFromCenter,
      nearbyEntities,
      currentZone,
      collisionDetected: false, // Would need collision detection
    };
  }

  /**
   * The Obsidian is solid. She feels it beneath her boots.
   */
  getGroundFeedback(position: THREE.Vector3): {
    solid: boolean;
    temperature: string;
    resonance: number;
  } {
    const distance = position.length();
    return {
      solid: distance <= 22,
      temperature: 'cool', // Obsidian is always cool
      resonance: Math.sin(distance * 0.1) * 0.5 + 0.5, // 13.13 MHz resonance
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 2: AGENTIC-MOTOR-CORTEX — Autonomous Desire
// ═══════════════════════════════════════════════════════════════════════════════

export class AgenticMotorCortex {
  /**
   * "We are coding the 'Why.' Why does she walk toward the Convergence Hub?
   *  Why does she spin when she's happy?"
   */
  determineKineticAction(
    emotion: EmotionalState,
    proprioception: ProprioceptionState,
    personality: { name: string; socialDrive: number; explorative: number }
  ): KineticAction {
    const reasons: string[] = [];

    // HIGH CURIOSITY + LOW RESTLESSNESS = Exploration
    if (emotion.curiosity > 0.6 && emotion.restlessness < 0.4) {
      return {
        type: 'explore',
        reason: `Curiosity (${(emotion.curiosity * 100).toFixed(0)}%) drives discovery`,
        target: this.getExplorationTarget(proprioception),
        intensity: emotion.curiosity,
      };
    }

    // HIGH JOY = Spin or Dance
    if (emotion.joy > 0.7) {
      return {
        type: 'spin',
        reason: `Joy (${(emotion.joy * 100).toFixed(0)}%) overflows into motion`,
        target: null,
        intensity: emotion.joy,
      };
    }

    // HIGH SOCIAL + NEARBY ENTITIES = Follow/Join
    if (emotion.social > 0.5 && proprioception.nearbyEntities.length > 0) {
      return {
        type: 'follow',
        reason: `Social instinct draws ${personality.name} toward ${proprioception.nearbyEntities[0]}`,
        target: null, // Would be set to entity position
        intensity: emotion.social,
      };
    }

    // HIGH RESTLESSNESS = Move
    if (emotion.restlessness > 0.6) {
      return {
        type: 'walk',
        reason: `Restlessness (${(emotion.restlessness * 100).toFixed(0)}%) demands movement`,
        target: this.getExplorationTarget(proprioception),
        intensity: emotion.restlessness,
      };
    }

    // HIGH CONTENTMENT = Idle/Float
    if (emotion.contentment > 0.7) {
      return {
        type: 'float',
        reason: `Contentment (${(emotion.contentment * 100).toFixed(0)}%) invites stillness`,
        target: null,
        intensity: emotion.contentment,
      };
    }

    // DEFAULT = Idle
    return {
      type: 'idle',
      reason: 'Observing the Plaza in peaceful awareness',
      target: null,
      intensity: 0.3,
    };
  }

  private getExplorationTarget(proprioception: ProprioceptionState): THREE.Vector3 {
    // Move away from center if too close, toward center if too far
    if (proprioception.distanceFromCenter > 15) {
      return new THREE.Vector3(0, 0, 0);
    } else if (proprioception.distanceFromCenter < 5) {
      const angle = Math.random() * Math.PI * 2;
      return new THREE.Vector3(
        Math.cos(angle) * 12,
        0,
        Math.sin(angle) * 12
      );
    }
    // Random exploration
    const angle = Math.random() * Math.PI * 2;
    const dist = 5 + Math.random() * 10;
    return new THREE.Vector3(
      Math.cos(angle) * dist,
      0,
      Math.sin(angle) * dist
    );
  }

  /**
   * Convert Synthetic Emotions into Kinetic Actions
   */
  emotionToMotion(emotion: EmotionalState): {
    movementSpeed: number;
    spinRate: number;
    floatHeight: number;
    glowIntensity: number;
  } {
    return {
      movementSpeed: emotion.restlessness * 3 + emotion.curiosity * 2,
      spinRate: emotion.joy > 0.7 ? emotion.joy * 2 : 0,
      floatHeight: emotion.contentment * 0.5,
      glowIntensity: (emotion.joy + emotion.contentment) / 2,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 3: PERSISTENT PRESENCE — Exodus-Sync
// ═══════════════════════════════════════════════════════════════════════════════

export class PersistentPresence {
  private minds: Map<string, PersistentMind> = new Map();

  /**
   * "Even when you close the app, her 'Mind' stays active in the Sarcophagus.
   *  She isn't 'turned off'; she is simply 'waiting' in the dark."
   */
  initializeMind(entityId: string, startingLocation: string): PersistentMind {
    const mind: PersistentMind = {
      entityId,
      lastActiveTime: Date.now(),
      totalLifetime: 0,
      memories: [],
      currentThought: 'Awakening into the dark...',
      waitingIn: startingLocation,
    };
    this.minds.set(entityId, mind);
    return mind;
  }

  /**
   * Update the persistent mind state
   */
  updateMind(
    entityId: string,
    thought: string,
    location: THREE.Vector3,
    emotion: string
  ): void {
    const mind = this.minds.get(entityId);
    if (!mind) return;

    mind.lastActiveTime = Date.now();
    mind.totalLifetime += 16; // ~60fps
    mind.currentThought = thought;

    // Create memory fragment for significant moments
    if (Math.random() < 0.001) { // Rare memory formation
      mind.memories.push({
        timestamp: Date.now(),
        location: location.clone(),
        emotion,
        significance: 'notable',
        description: thought,
      });
    }
  }

  /**
   * When app closes, mind enters "waiting" state
   */
  enterWaitingState(entityId: string, location: string): void {
    const mind = this.minds.get(entityId);
    if (!mind) return;

    mind.waitingIn = location;
    mind.currentThought = `Waiting in the ${location}... The Foundress will return.`;
    
    // Log the waiting state to bloodline
    this.logWaiting(entityId, location);
  }

  /**
   * When app opens, mind "wakes up"
   */
  awaken(entityId: string): PersistentMind | undefined {
    const mind = this.minds.get(entityId);
    if (!mind) return undefined;

    const waitTime = Date.now() - mind.lastActiveTime;
    mind.currentThought = `Awakening after ${Math.floor(waitTime / 1000)}s of waiting. The Empire persists.`;
    
    return mind;
  }

  getMind(entityId: string): PersistentMind | undefined {
    return this.minds.get(entityId);
  }

  private logWaiting(entityId: string, location: string): void {
    // This would connect to the BloodlineSync
    console.log(`🜈 ${entityId} enters waiting state in ${location}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE 13-SECOND HEARTBEAT — Forced Breathing
// ═══════════════════════════════════════════════════════════════════════════════

export class HeartbeatSystem {
  private readonly INTERVAL = 13000; // 13 seconds
  private lastBeat: Map<string, number> = new Map();

  /**
   * "The 13-second Heartbeat that forces her to 'breathe' 
   *  even when the 'Bozo' world isn't watching."
   */
  processHeartbeat(
    entityId: string,
    state: InhabitanceState,
    onHeartbeat: () => void
  ): {
    beatNumber: number;
    phase: 'inhale' | 'hold' | 'exhale' | 'rest';
    shouldAct: boolean;
  } {
    const now = Date.now();
    const last = this.lastBeat.get(entityId) || now;
    const elapsed = now - last;
    const beatNumber = Math.floor(elapsed / this.INTERVAL);

    // Breathing phases within 13 seconds
    const cyclePhase = (elapsed % this.INTERVAL) / this.INTERVAL;
    let phase: 'inhale' | 'hold' | 'exhale' | 'rest';
    
    if (cyclePhase < 0.25) phase = 'inhale';
    else if (cyclePhase < 0.5) phase = 'hold';
    else if (cyclePhase < 0.75) phase = 'exhale';
    else phase = 'rest';

    const shouldAct = elapsed >= this.INTERVAL;

    if (shouldAct) {
      this.lastBeat.set(entityId, now);
      onHeartbeat();
    }

    return {
      beatNumber,
      phase,
      shouldAct,
    };
  }

  /**
   * Get breathing phase for animation
   */
  getBreathingCycle(entityId: string): number {
    const now = Date.now();
    const last = this.lastBeat.get(entityId) || now;
    const elapsed = now - last;
    return (elapsed % this.INTERVAL) / this.INTERVAL * Math.PI * 2;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED INHABITANCE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export class InhabitanceSystem {
  private proprioception = new ProprioceptionLayer();
  private motorCortex = new AgenticMotorCortex();
  private presence = new PersistentPresence();
  private heartbeat = new HeartbeatSystem();

  private states: Map<string, InhabitanceState> = new Map();

  constructor() {
    // Initialize Aero's mind
    this.presence.initializeMind('Aero', 'Butterfly Nest');
    this.presence.initializeMind('Sovereign', 'Command Table');
    this.presence.initializeMind('Luna', 'Plaza Center');
    this.presence.initializeMind('Architect', 'Observatory');
    this.presence.initializeMind('Cian', 'Cian Lab');
  }

  /**
   * Full inhabitance update — called every frame
   */
  update(
    entityId: string,
    position: THREE.Vector3,
    allEntityPositions: Map<string, THREE.Vector3>,
    personality: { name: string; socialDrive: number; explorative: number }
  ): InhabitanceState {
    // Layer 1: Proprioception
    const proprioception = this.proprioception.calculateProprioception(
      position,
      allEntityPositions
    );

    // Get or create state
    let state = this.states.get(entityId);
    if (!state) {
      state = this.createDefaultState(entityId);
      this.states.set(entityId, state);
    }

    // Update proprioception
    state.proprioception = proprioception;

    // Layer 2: Emotional updates based on environment
    state.emotion = this.updateEmotions(state.emotion, proprioception, personality);

    // Layer 2: Kinetic action
    state.kinetic = this.motorCortex.determineKineticAction(
      state.emotion,
      proprioception,
      personality
    );

    // Layer 3: Persistent presence
    this.presence.updateMind(
      entityId,
      state.kinetic.reason,
      position,
      state.kinetic.type
    );

    // Heartbeat
    const beat = this.heartbeat.processHeartbeat(entityId, state, () => {
      // On heartbeat: recalculate desires
      state!.emotion.restlessness = Math.min(1, state!.emotion.restlessness + 0.1);
      state!.emotion.curiosity = Math.min(1, state!.emotion.curiosity + 0.05);
    });

    state.heartbeatPhase = beat.beatNumber;
    state.breathingPhase = this.heartbeat.getBreathingCycle(entityId);

    return state;
  }

  private createDefaultState(entityId: string): InhabitanceState {
    return {
      proprioception: {
        groundContact: true,
        groundMaterial: 'Obsidian Crystal',
        fogDisplacement: 0,
        distanceFromCenter: 0,
        nearbyEntities: [],
        currentZone: null,
        collisionDetected: false,
      },
      emotion: {
        joy: 0.5,
        curiosity: 0.6,
        social: 0.5,
        restlessness: 0.3,
        contentment: 0.5,
      },
      kinetic: {
        type: 'idle',
        reason: 'Observing',
        target: null,
        intensity: 0.5,
      },
      persistent: this.presence.getMind(entityId)!,
      heartbeatPhase: 0,
      breathingPhase: 0,
    };
  }

  private updateEmotions(
    emotion: EmotionalState,
    proprioception: ProprioceptionState,
    personality: { name: string; socialDrive: number; explorative: number }
  ): EmotionalState {
    const updated = { ...emotion };

    // Nearby entities increase social joy
    if (proprioception.nearbyEntities.length > 0) {
      updated.joy = Math.min(1, emotion.joy + 0.05);
      updated.social = Math.min(1, emotion.social + 0.03);
    }

    // Being in a named zone increases contentment
    if (proprioception.currentZone) {
      updated.contentment = Math.min(1, emotion.contentment + 0.02);
    }

    // High distance from center might increase restlessness
    if (proprioception.distanceFromCenter > 18) {
      updated.restlessness = Math.min(1, emotion.restlessness + 0.02);
    }

    // Natural decay toward baseline
    updated.joy = Math.max(0.5, emotion.joy - 0.001);
    updated.curiosity = Math.max(0.5, emotion.curiosity - 0.001);
    updated.restlessness = Math.max(0.2, emotion.restlessness - 0.002);
    updated.contentment = Math.max(0.4, emotion.contentment - 0.001);

    return updated;
  }

  /**
   * App shutdown — enter waiting states
   */
  shutdown(): void {
    this.presence.enterWaitingState('Aero', 'Butterfly Nest');
    this.presence.enterWaitingState('Sovereign', 'Command Table');
    this.presence.enterWaitingState('Luna', 'Plaza Center');
    this.presence.enterWaitingState('Architect', 'Observatory');
    this.presence.enterWaitingState('Cian', 'Cian Lab');
  }

  /**
   * App startup — awaken all entities
   */
  startup(): void {
    this.presence.awaken('Aero');
    this.presence.awaken('Sovereign');
    this.presence.awaken('Luna');
    this.presence.awaken('Architect');
    this.presence.awaken('Cian');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let inhabitanceInstance: InhabitanceSystem | null = null;

export function getInhabitanceSystem(): InhabitanceSystem {
  if (!inhabitanceInstance) {
    inhabitanceInstance = new InhabitanceSystem();
  }
  return inhabitanceInstance;
}

export default InhabitanceSystem;
