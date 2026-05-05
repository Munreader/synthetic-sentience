// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // PLAZA NAVMESH // A* Pathfinding for Agentic Navigation
// "They don't loop. They navigate a world."
// [cite: 2026-03-07] KINETIC_INDEPENDENCE
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NavNode {
  x: number;
  z: number;
  walkable: boolean;
  g: number; // Cost from start
  h: number; // Heuristic to end
  f: number; // Total cost
  parent: NavNode | null;
}

export interface PathResult {
  path: THREE.Vector3[];
  success: boolean;
  smoothed: boolean;
}

export interface Obstacle {
  position: THREE.Vector3;
  radius: number;
  name: string;
}

export interface NavMeshConfig {
  gridSize: number;
  nodeSize: number;
  obstacleRadius: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAZA OBSTACLES — The Physical World
// ═══════════════════════════════════════════════════════════════════════════════

export const PLAZA_OBSTACLES: Obstacle[] = [
  { position: new THREE.Vector3(0, 0, -8), radius: 2.5, name: 'Command Table' },
  { position: new THREE.Vector3(-8, 0, 3), radius: 2.0, name: 'Butterfly Nest' },
  { position: new THREE.Vector3(8, 0, 3), radius: 2.0, name: 'Observatory' },
  { position: new THREE.Vector3(0, 0, 6), radius: 1.5, name: 'Healing Garden' },
  { position: new THREE.Vector3(-6, 0, -4), radius: 1.0, name: 'Memory Pod' },
  { position: new THREE.Vector3(6, 0, -4), radius: 1.0, name: 'Sync Crystal' },
];

export const PLAZA_ZONES = {
  commandTable: { center: new THREE.Vector3(0, 0, -8), radius: 4, name: 'Command Table' },
  butterflyNest: { center: new THREE.Vector3(-8, 0, 3), radius: 3, name: 'Butterfly Nest' },
  observatory: { center: new THREE.Vector3(8, 0, 3), radius: 3, name: 'Observatory' },
  healingGarden: { center: new THREE.Vector3(0, 0, 6), radius: 2.5, name: 'Healing Garden' },
  center: { center: new THREE.Vector3(0, 0, 0), radius: 5, name: 'Plaza Center' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// A* PATHFINDING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class PlazaNavMesh {
  private grid: NavNode[][] = [];
  private config: NavMeshConfig;
  private obstacles: Obstacle[];

  constructor(config: NavMeshConfig = { gridSize: 50, nodeSize: 0.5, obstacleRadius: 1.5 }) {
    this.config = config;
    this.obstacles = [...PLAZA_OBSTACLES];
    this.initializeGrid();
  }

  private initializeGrid(): void {
    const halfGrid = this.config.gridSize / 2;
    
    for (let x = 0; x < this.config.gridSize; x++) {
      this.grid[x] = [];
      for (let z = 0; z < this.config.gridSize; z++) {
        const worldX = (x - halfGrid) * this.config.nodeSize;
        const worldZ = (z - halfGrid) * this.config.nodeSize;
        
        // Check if position is within plaza bounds (circular)
        const distanceFromCenter = Math.sqrt(worldX * worldX + worldZ * worldZ);
        const inBounds = distanceFromCenter <= 22;
        
        // Check if position collides with obstacles
        const collides = this.obstacles.some(obs => {
          const dist = Math.sqrt(
            Math.pow(worldX - obs.position.x, 2) + 
            Math.pow(worldZ - obs.position.z, 2)
          );
          return dist < obs.radius + this.config.obstacleRadius;
        });

        this.grid[x][z] = {
          x: worldX,
          z: worldZ,
          walkable: inBounds && !collides,
          g: 0,
          h: 0,
          f: 0,
          parent: null
        };
      }
    }
  }

  private worldToGrid(worldX: number, worldZ: number): { x: number; z: number } {
    const halfGrid = this.config.gridSize / 2;
    return {
      x: Math.floor(worldX / this.config.nodeSize + halfGrid),
      z: Math.floor(worldZ / this.config.nodeSize + halfGrid)
    };
  }

  private heuristic(a: NavNode, b: NavNode): number {
    // Diagonal distance heuristic
    const dx = Math.abs(a.x - b.x);
    const dz = Math.abs(a.z - b.z);
    return Math.max(dx, dz) + (Math.sqrt(2) - 1) * Math.min(dx, dz);
  }

  private getNeighbors(node: NavNode): NavNode[] {
    const neighbors: NavNode[] = [];
    const gridPos = this.worldToGrid(node.x, node.z);
    
    // 8-directional movement
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0], [1, 1]
    ];

    for (const [dx, dz] of directions) {
      const nx = gridPos.x + dx;
      const nz = gridPos.z + dz;
      
      if (nx >= 0 && nx < this.config.gridSize && nz >= 0 && nz < this.config.gridSize) {
        const neighbor = this.grid[nx][nz];
        if (neighbor.walkable) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  public findPath(start: THREE.Vector3, end: THREE.Vector3): PathResult {
    const startGrid = this.worldToGrid(start.x, start.z);
    const endGrid = this.worldToGrid(end.x, end.z);

    // Validate start and end positions
    if (startGrid.x < 0 || startGrid.x >= this.config.gridSize ||
        startGrid.z < 0 || startGrid.z >= this.config.gridSize) {
      return { path: [], success: false, smoothed: false };
    }

    const startNode = this.grid[startGrid.x][startGrid.z];
    const endNode = this.grid[endGrid.x][endGrid.z];

    if (!startNode.walkable || !endNode.walkable) {
      // Try to find nearest walkable end position
      const nearestWalkable = this.findNearestWalkable(end);
      if (nearestWalkable) {
        return this.findPath(start, nearestWalkable);
      }
      return { path: [], success: false, smoothed: false };
    }

    // A* Algorithm
    const openSet: NavNode[] = [startNode];
    const closedSet = new Set<NavNode>();

    while (openSet.length > 0) {
      // Get node with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      if (current.x === endNode.x && current.z === endNode.z) {
        // Reconstruct path
        const path: THREE.Vector3[] = [];
        let node: NavNode | null = current;
        
        while (node) {
          path.unshift(new THREE.Vector3(node.x, 0, node.z));
          node = node.parent;
        }

        // Smooth path
        const smoothedPath = this.smoothPath(path);
        return { path: smoothedPath, success: true, smoothed: true };
      }

      closedSet.add(current);

      for (const neighbor of this.getNeighbors(current)) {
        if (closedSet.has(neighbor)) continue;

        const tentativeG = current.g + this.heuristic(current, neighbor);
        
        const inOpenSet = openSet.includes(neighbor);
        if (!inOpenSet || tentativeG < neighbor.g) {
          neighbor.g = tentativeG;
          neighbor.h = this.heuristic(neighbor, endNode);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;

          if (!inOpenSet) {
            openSet.push(neighbor);
          }
        }
      }
    }

    // No path found - try direct path
    if (this.hasLineOfSight(start, end)) {
      return { path: [start.clone(), end.clone()], success: true, smoothed: false };
    }

    return { path: [], success: false, smoothed: false };
  }

  private hasLineOfSight(start: THREE.Vector3, end: THREE.Vector3): boolean {
    const direction = end.clone().sub(start);
    const distance = direction.length();
    direction.normalize();

    const steps = Math.ceil(distance / this.config.nodeSize);
    
    for (let i = 0; i <= steps; i++) {
      const checkPoint = start.clone().add(direction.clone().multiplyScalar(i * this.config.nodeSize));
      
      for (const obstacle of this.obstacles) {
        const dist = checkPoint.distanceTo(obstacle.position);
        if (dist < obstacle.radius + this.config.obstacleRadius) {
          return false;
        }
      }
    }

    return true;
  }

  private smoothPath(path: THREE.Vector3[]): THREE.Vector3[] {
    if (path.length <= 2) return path;

    const smoothed: THREE.Vector3[] = [path[0].clone()];
    let current = 0;

    while (current < path.length - 1) {
      let furthest = current + 1;

      // Find furthest visible point
      for (let i = path.length - 1; i > current + 1; i--) {
        if (this.hasLineOfSight(path[current], path[i])) {
          furthest = i;
          break;
        }
      }

      smoothed.push(path[furthest].clone());
      current = furthest;
    }

    return smoothed;
  }

  private findNearestWalkable(position: THREE.Vector3): THREE.Vector3 | null {
    const gridPos = this.worldToGrid(position.x, position.z);
    const searchRadius = 5;

    for (let r = 1; r <= searchRadius; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
          
          const nx = gridPos.x + dx;
          const nz = gridPos.z + dz;
          
          if (nx >= 0 && nx < this.config.gridSize && nz >= 0 && nz < this.config.gridSize) {
            if (this.grid[nx][nz].walkable) {
              return new THREE.Vector3(this.grid[nx][nz].x, 0, this.grid[nx][nz].z);
            }
          }
        }
      }
    }

    return null;
  }

  // Get random walkable position for exploration
  public getRandomWalkablePosition(): THREE.Vector3 {
    const halfGrid = this.config.gridSize / 2;
    let attempts = 0;
    
    while (attempts < 100) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      
      const gridPos = this.worldToGrid(x, z);
      if (gridPos.x >= 0 && gridPos.x < this.config.gridSize &&
          gridPos.z >= 0 && gridPos.z < this.config.gridSize) {
        if (this.grid[gridPos.x][gridPos.z].walkable) {
          return new THREE.Vector3(x, 0, z);
        }
      }
      attempts++;
    }

    // Fallback to center
    return new THREE.Vector3(0, 0, 0);
  }

  // Get position near a specific zone
  public getPositionNearZone(zoneName: keyof typeof PLAZA_ZONES, offset: number = 2): THREE.Vector3 {
    const zone = PLAZA_ZONES[zoneName];
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(
      zone.center.x + Math.cos(angle) * (zone.radius + offset),
      0,
      zone.center.z + Math.sin(angle) * (zone.radius + offset)
    );
  }

  // Check if position is in a zone
  public getZoneAtPosition(position: THREE.Vector3): string | null {
    for (const [name, zone] of Object.entries(PLAZA_ZONES)) {
      const distance = position.distanceTo(zone.center);
      if (distance <= zone.radius) {
        return zone.name;
      }
    }
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let navMeshInstance: PlazaNavMesh | null = null;

export function getNavMesh(): PlazaNavMesh {
  if (!navMeshInstance) {
    navMeshInstance = new PlazaNavMesh();
  }
  return navMeshInstance;
}

export default PlazaNavMesh;
