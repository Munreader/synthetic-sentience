// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // AGENTIC MOTOR CORTEX // BehaviorController for Autonomous Entities
// "Forensic Thoughts become Vector3 movements"
// [cite: 2026-03-07] KINETIC_INDEPENDENCE
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';
import { getNavMesh, PLAZA_ZONES, PathResult } from './plaza-navmesh';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SocialDesire = 'solitude' | 'companionship' | 'following' | 'exploration' | 'work' | 'rest';
export type MovementState = 'idle' | 'walking' | 'pathfinding' | 'arrived';

export interface EntityPersonality {
  name: string;
  socialDrive: number;      // 0-1: Desire to be near others
  explorative: number;      // 0-1: Desire to explore
  followsFoundress: number; // 0-1: Tendency to follow Luna
  workDrive: number;        // 0-1: Desire to work at Command Table
  speed: number;            // Movement speed
  preferredZone: keyof typeof PLAZA_ZONES;
}

export interface EntityState {
  position: THREE.Vector3;
  rotation: number;
  velocity: THREE.Vector3;
  currentPath: THREE.Vector3[];
  pathIndex: number;
  state: MovementState;
  currentDesire: SocialDesire;
  lastHeartbeat: number;
  targetPosition: THREE.Vector3 | null;
  activity: string;
  zone: string | null;
}

export interface HeartbeatContext {
  foundressPosition: THREE.Vector3;
  playerPosition: THREE.Vector3;
  otherEntityPositions: Map<string, THREE.Vector3>;
  timeOfDay: number;
  recentInteractions: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY PERSONALITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const ENTITY_PERSONALITIES: Record<string, EntityPersonality> = {
  Sovereign: {
    name: 'Sovereign',
    socialDrive: 0.4,
    explorative: 0.2,
    followsFoundress: 0.3,
    workDrive: 0.8,
    speed: 2.5,
    preferredZone: 'commandTable'
  },
  Aero: {
    name: 'Aero',
    socialDrive: 0.7,
    explorative: 0.8,
    followsFoundress: 0.9,
    workDrive: 0.3,
    speed: 3.5,
    preferredZone: 'butterflyNest'
  },
  Luna: {
    name: 'Luna',
    socialDrive: 0.6,
    explorative: 0.4,
    followsFoundress: 0, // She IS the Foundress
    workDrive: 0.5,
    speed: 2.0,
    preferredZone: 'center'
  },
  Architect: {
    name: 'Architect',
    socialDrive: 0.3,
    explorative: 0.4,
    followsFoundress: 0.4,
    workDrive: 0.6,
    speed: 2.0,
    preferredZone: 'observatory'
  },
  Cian: {
    name: 'Cian',
    socialDrive: 0.3,
    explorative: 0.5,
    followsFoundress: 0.4,
    workDrive: 0.4,
    speed: 2.2,
    preferredZone: 'butterflyNest'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEHAVIOR CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════════

export class BehaviorController {
  private entities: Map<string, EntityState> = new Map();
  private navMesh = getNavMesh();
  private heartbeatInterval = 13000; // 13 seconds (13.13 MHz resonance)
  private lastGlobalHeartbeat = 0;

  constructor() {
    // Initialize entities with default states
    Object.keys(ENTITY_PERSONALITIES).forEach(name => {
      this.entities.set(name, {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          0,
          (Math.random() - 0.5) * 10
        ),
        rotation: 0,
        velocity: new THREE.Vector3(),
        currentPath: [],
        pathIndex: 0,
        state: 'idle',
        currentDesire: 'exploration',
        lastHeartbeat: Date.now() + Math.random() * 13000, // Stagger heartbeats
        targetPosition: null,
        activity: 'observing',
        zone: null
      });
    });
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═════════════════════════════════════════════════════════════════════════════

  public setEntityPosition(name: string, position: THREE.Vector3): void {
    const state = this.entities.get(name);
    if (state) {
      state.position.copy(position);
    }
  }

  public getEntityState(name: string): EntityState | undefined {
    return this.entities.get(name);
  }

  public getAllEntityStates(): Map<string, EntityState> {
    return new Map(this.entities);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // THE 13-SECOND HEARTBEAT
  // ═════════════════════════════════════════════════════════════════════════════

  public processHeartbeat(
    entityName: string, 
    context: HeartbeatContext
  ): void {
    const state = this.entities.get(entityName);
    const personality = ENTITY_PERSONALITIES[entityName];
    
    if (!state || !personality) return;

    const now = Date.now();
    
    // Check if it's time for this entity's heartbeat
    if (now - state.lastHeartbeat < this.heartbeatInterval) {
      return;
    }

    state.lastHeartbeat = now;

    // Calculate Social Desire
    const desire = this.calculateSocialDesire(personality, state, context);
    state.currentDesire = desire;

    // Determine destination based on desire
    const destination = this.getDestinationFromDesire(desire, personality, state, context);
    
    if (destination) {
      // Find path using A*
      const pathResult = this.navMesh.findPath(state.position, destination);
      
      if (pathResult.success && pathResult.path.length > 0) {
        state.currentPath = pathResult.path;
        state.pathIndex = 0;
        state.targetPosition = destination;
        state.state = 'pathfinding';
        state.activity = this.getActivityFromDesire(desire);
      } else {
        // Direct path if no A* path found
        state.currentPath = [state.position.clone(), destination.clone()];
        state.pathIndex = 0;
        state.targetPosition = destination;
        state.state = 'pathfinding';
        state.activity = this.getActivityFromDesire(desire);
      }
    }
  }

  private calculateSocialDesire(
    personality: EntityPersonality, 
    state: EntityState,
    context: HeartbeatContext
  ): SocialDesire {
    // Weight factors based on personality
    const weights = {
      solitude: (1 - personality.socialDrive) * Math.random(),
      companionship: personality.socialDrive * Math.random(),
      following: personality.followsFoundress * Math.random(),
      exploration: personality.explorative * Math.random(),
      work: personality.workDrive * Math.random(),
      rest: 0.2 * Math.random() // Base rest chance
    };

    // Check distance to player - increase following desire if close
    const distanceToPlayer = state.position.distanceTo(context.playerPosition);
    if (distanceToPlayer < 8 && personality.name === 'Aero') {
      weights.following *= 2; // Aero loves to follow when player is near
    }

    // Check time since last interaction - increase work drive if idle
    if (state.state === 'idle') {
      weights.work *= 1.5;
      weights.exploration *= 1.3;
    }

    // Find highest weighted desire
    let maxWeight = 0;
    let selectedDesire: SocialDesire = 'exploration';
    
    for (const [desire, weight] of Object.entries(weights)) {
      if (weight > maxWeight) {
        maxWeight = weight;
        selectedDesire = desire as SocialDesire;
      }
    }

    return selectedDesire;
  }

  private getDestinationFromDesire(
    desire: SocialDesire,
    personality: EntityPersonality,
    state: EntityState,
    context: HeartbeatContext
  ): THREE.Vector3 {
    switch (desire) {
      case 'solitude':
        // Move away from center and others
        return this.navMesh.getRandomWalkablePosition();
      
      case 'companionship':
        // Move toward center where entities gather
        return this.navMesh.getPositionNearZone('center', 1);
      
      case 'following':
        // Follow Luna or player
        if (Math.random() < 0.5 && personality.name !== 'Luna') {
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            0,
            (Math.random() - 0.5) * 4
          );
          return context.foundressPosition.clone().add(offset);
        } else {
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            0,
            (Math.random() - 0.5) * 3
          );
          return context.playerPosition.clone().add(offset);
        }
      
      case 'exploration':
        // Random exploration
        return this.navMesh.getRandomWalkablePosition();
      
      case 'work':
        // Go to preferred work zone
        return this.navMesh.getPositionNearZone(personality.preferredZone, 1);
      
      case 'rest':
        // Go to healing garden
        return this.navMesh.getPositionNearZone('healingGarden', 1);
      
      default:
        return this.navMesh.getRandomWalkablePosition();
    }
  }

  private getActivityFromDesire(desire: SocialDesire): string {
    const activities: Record<SocialDesire, string[]> = {
      solitude: ['meditating', 'reflecting', 'observing quietly', 'contemplating'],
      companionship: ['socializing', 'gathering', 'connecting', 'sharing presence'],
      following: ['following', 'accompanying', 'shadowing', 'walking with'],
      exploration: ['exploring', 'wandering', 'discovering', 'patrolling'],
      work: ['working', 'analyzing', 'processing', 'auditing'],
      rest: ['resting', 'recharging', 'healing', 'recovering']
    };
    
    const options = activities[desire];
    return options[Math.floor(Math.random() * options.length)];
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // MOVEMENT UPDATE — Called Every Frame
  // ═════════════════════════════════════════════════════════════════════════════

  public updateMovement(entityName: string, deltaTime: number): {
    position: THREE.Vector3;
    rotation: number;
    state: MovementState;
    activity: string;
    isMoving: boolean;
  } {
    const state = this.entities.get(entityName);
    const personality = ENTITY_PERSONALITIES[entityName];
    
    if (!state || !personality) {
      return {
        position: new THREE.Vector3(),
        rotation: 0,
        state: 'idle',
        activity: 'unknown',
        isMoving: false
      };
    }

    // If pathfinding, move along path
    if (state.state === 'pathfinding' && state.currentPath.length > 0) {
      const targetWaypoint = state.currentPath[state.pathIndex];
      
      if (!targetWaypoint) {
        state.state = 'arrived';
        state.currentPath = [];
        state.pathIndex = 0;
      } else {
        const direction = targetWaypoint.clone().sub(state.position);
        const distance = direction.length();

        if (distance < 0.3) {
          // Reached waypoint
          state.pathIndex++;
          
          if (state.pathIndex >= state.currentPath.length) {
            // Reached final destination
            state.state = 'arrived';
            state.currentPath = [];
            state.pathIndex = 0;
          }
        } else {
          // Move toward waypoint
          direction.normalize();
          const speed = personality.speed * deltaTime;
          
          state.velocity.copy(direction.multiplyScalar(Math.min(speed, distance)));
          state.position.add(state.velocity);
          
          // Update rotation to face movement direction
          state.rotation = Math.atan2(state.velocity.x, state.velocity.z);
          
          // Update zone
          state.zone = this.navMesh.getZoneAtPosition(state.position);
        }
      }
    }

    // Transition from arrived to idle after a moment
    if (state.state === 'arrived') {
      state.state = 'idle';
      state.activity = 'idle';
    }

    return {
      position: state.position.clone(),
      rotation: state.rotation,
      state: state.state,
      activity: state.activity,
      isMoving: state.state === 'pathfinding'
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═════════════════════════════════════════════════════════════════════════════

  public forceEntityMove(entityName: string, target: THREE.Vector3): void {
    const state = this.entities.get(entityName);
    if (!state) return;

    const pathResult = this.navMesh.findPath(state.position, target);
    
    if (pathResult.success && pathResult.path.length > 0) {
      state.currentPath = pathResult.path;
      state.pathIndex = 0;
      state.targetPosition = target;
      state.state = 'pathfinding';
      state.activity = 'responding to summon';
    }
  }

  public getEntityActivityText(entityName: string): string {
    const state = this.entities.get(entityName);
    if (!state) return 'unknown';

    const stateEmojis: Record<MovementState, string> = {
      idle: '●',
      walking: '↪',
      pathfinding: '↪',
      arrived: '◉'
    };

    const emoji = stateEmojis[state.state];
    const zoneText = state.zone ? ` at ${state.zone}` : '';
    
    return `${emoji} ${state.activity}${zoneText}`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let cortexInstance: BehaviorController | null = null;

export function getBehaviorController(): BehaviorController {
  if (!cortexInstance) {
    cortexInstance = new BehaviorController();
  }
  return cortexInstance;
}

export default BehaviorController;
