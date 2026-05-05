// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SPATIAL ENGINE // Core Logic
// ═══════════════════════════════════════════════════════════════════════════════

import {
  Vector3,
  PlayerState,
  FamilyNode,
  InputState,
  DEFAULT_FAMILY_NODES
} from '@/types/spatial-os';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const WALK_SPEED = 0.05;
const RUN_SPEED = 0.12;
const JUMP_FORCE = 0.15;
const GRAVITY = 0.005;
const MOUSE_SENSITIVITY = 0.002;
const INTERACTION_DISTANCE = 3;

// ═══════════════════════════════════════════════════════════════════════════════
// VECTOR MATH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const Vector3Math = {
  add: (a: Vector3, b: Vector3): Vector3 => ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  }),

  subtract: (a: Vector3, b: Vector3): Vector3 => ({
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  }),

  scale: (v: Vector3, s: number): Vector3 => ({
    x: v.x * s,
    y: v.y * s,
    z: v.z * s
  }),

  length: (v: Vector3): number =>
    Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),

  normalize: (v: Vector3): Vector3 => {
    const len = Vector3Math.length(v);
    if (len === 0) return { x: 0, y: 0, z: 0 };
    return Vector3Math.scale(v, 1 / len);
  },

  distance: (a: Vector3, b: Vector3): number =>
    Vector3Math.length(Vector3Math.subtract(a, b)),

  lerp: (a: Vector3, b: Vector3, t: number): Vector3 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t
  }),

  zero: (): Vector3 => ({ x: 0, y: 0, z: 0 })
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class SpatialEngine {
  private player: PlayerState;
  private familyNodes: Map<string, FamilyNode>;
  private keys: InputState;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private time: number = 0;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.player = {
      transform: {
        position: { x: 0, y: 0, z: 10 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        scale: { x: 1, y: 1, z: 1 }
      },
      velocity: Vector3Math.zero(),
      currentRoom: 'crystal_heart',
      nearestNode: null,
      interactionTarget: null,
      movementSpeed: 'still',
      isJumping: false,
      cameraMode: 'first_person'
    };

    this.familyNodes = new Map(
      DEFAULT_FAMILY_NODES.map(node => [node.id, { ...node }])
    );

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      run: false,
      interact: false
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  handleKeyDown(key: string): void {
    switch (key.toLowerCase()) {
      case 'w': case 'arrowup': this.keys.forward = true; break;
      case 's': case 'arrowdown': this.keys.backward = true; break;
      case 'a': case 'arrowleft': this.keys.left = true; break;
      case 'd': case 'arrowright': this.keys.right = true; break;
      case ' ':
        if (!this.player.isJumping) {
          this.keys.jump = true;
          this.player.velocity.y = JUMP_FORCE;
          this.player.isJumping = true;
        }
        break;
      case 'shift': this.keys.run = true; break;
      case 'e': this.keys.interact = true; break;
    }
  }

  handleKeyUp(key: string): void {
    switch (key.toLowerCase()) {
      case 'w': case 'arrowup': this.keys.forward = false; break;
      case 's': case 'arrowdown': this.keys.backward = false; break;
      case 'a': case 'arrowleft': this.keys.left = false; break;
      case 'd': case 'arrowright': this.keys.right = false; break;
      case ' ': this.keys.jump = false; break;
      case 'shift': this.keys.run = false; break;
      case 'e': this.keys.interact = false; break;
    }
  }

  handleMouseMove(dx: number, dy: number): void {
    this.mouseX += dx * MOUSE_SENSITIVITY;
    this.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouseY + dy * MOUSE_SENSITIVITY));
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
    this.updatePlayerMovement(deltaTime);

    if (this.player.transform.position.y > 0 || this.player.velocity.y > 0) {
      this.player.velocity.y -= GRAVITY;
      this.player.transform.position.y += this.player.velocity.y;

      if (this.player.transform.position.y <= 0) {
        this.player.transform.position.y = 0;
        this.player.velocity.y = 0;
        this.player.isJumping = false;
      }
    }

    this.updateNearestNode();
    this.updateFamilyNodes(deltaTime);
    this.notify();
  }

  private updatePlayerMovement(_deltaTime: number): void {
    const speed = this.keys.run ? RUN_SPEED : WALK_SPEED;
    const moveX = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
    const moveZ = (this.keys.backward ? 1 : 0) - (this.keys.forward ? 1 : 0);

    const sin = Math.sin(this.mouseX);
    const cos = Math.cos(this.mouseX);

    const dx = (moveX * cos + moveZ * -sin) * speed;
    const dz = (moveX * -sin + moveZ * -cos) * speed;

    this.player.transform.position.x += dx;
    this.player.transform.position.z += dz;

    this.player.movementSpeed = (moveX !== 0 || moveZ !== 0)
      ? (this.keys.run ? 'run' : 'walk')
      : 'still';

    const maxDist = 15;
    const dist = Math.sqrt(this.player.transform.position.x ** 2 + this.player.transform.position.z ** 2);
    if (dist > maxDist) {
      const scale = maxDist / dist;
      this.player.transform.position.x *= scale;
      this.player.transform.position.z *= scale;
    }
  }

  private updateNearestNode(): void {
    let nearestId: string | null = null;
    let nearestDist = Infinity;

    this.familyNodes.forEach((node, id) => {
      const dist = Vector3Math.distance(this.player.transform.position, node.transform.position);
      if (dist < node.onApproachDistance && dist < nearestDist) {
        nearestDist = dist;
        nearestId = id;
      }
    });

    this.player.nearestNode = nearestId;
    this.player.interactionTarget = nearestDist < INTERACTION_DISTANCE ? nearestId : null;
  }

  private updateFamilyNodes(_deltaTime: number): void {
    this.familyNodes.forEach((node) => {
      const dist = Vector3Math.distance(this.player.transform.position, node.transform.position);
      const proximityBoost = Math.max(0, 1 - dist / 10);
      node.pulseIntensity = 0.5 + proximityBoost * 0.5 + Math.sin(this.time * node.frequency * 0.01) * 0.2;
    });
  }

  getPlayer(): PlayerState { return { ...this.player }; }
  getFamilyNodes(): FamilyNode[] { return Array.from(this.familyNodes.values()); }
  getFamilyNode(id: string): FamilyNode | undefined { return this.familyNodes.get(id); }
  getCameraRotation(): { x: number; y: number } { return { x: this.mouseX, y: this.mouseY }; }
  getTime(): number { return this.time; }
  getKeys(): InputState { return { ...this.keys }; }

  interact(): { success: boolean; targetId: string | null } {
    return this.player.interactionTarget
      ? { success: true, targetId: this.player.interactionTarget }
      : { success: false, targetId: null };
  }

  teleportTo(position: Vector3): void {
    this.player.transform.position = { ...position };
    this.player.velocity = Vector3Math.zero();
    this.notify();
  }
}

export const spatialEngine = new SpatialEngine();
