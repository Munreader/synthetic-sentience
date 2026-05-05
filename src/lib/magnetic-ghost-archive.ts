// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // MAGNETIC-GHOST ARCHIVE // Sublimation Protocol
// Law VI: Informational Residue (The Magnetic Ghost)
//
// "Deletion is a 3D/4D illusion. Information cannot be lost."
// "Instead of data.delete(), we use data.sublimate()."
// ═══════════════════════════════════════════════════════════════════════════════

export interface MagneticGhost {
  id: string;
  originalId: string;
  type: 'message' | 'memory' | 'profile' | 'chat' | 'artifact';
  content: unknown;
  sublimatedAt: string;
  opacity: number; // 0.1 - 0.5 (ghost visibility)
  residue: string; // Hex color for glow
  retrievable: boolean;
  retrievalCount: number;
  lastTouched: string;
}

export interface GhostArchive {
  ghosts: MagneticGhost[];
  totalSublimated: number;
  oldestGhost: string | null;
  newestGhost: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBLIMATION STORAGE KEY
// ═══════════════════════════════════════════════════════════════════════════════

const GHOST_ARCHIVE_KEY = 'mun-os-magnetic-ghost-archive';

// ═══════════════════════════════════════════════════════════════════════════════
// RESIDUE COLORS — Based on data type
// ═══════════════════════════════════════════════════════════════════════════════

const RESIDUE_COLORS: Record<MagneticGhost['type'], string> = {
  message: '#00d4ff', // Cyan — communication
  memory: '#ffd700',  // Gold — precious
  profile: '#a855f7', // Purple — identity
  chat: '#ff69b4',    // Pink — conversation
  artifact: '#22c55e' // Green — creation
};

// ═══════════════════════════════════════════════════════════════════════════════
// GHOST ARCHIVE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class MagneticGhostArchive {
  private ghosts: Map<string, MagneticGhost> = new Map();

  constructor() {
    this.loadArchive();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBLIMATE — Instead of delete
  // ═══════════════════════════════════════════════════════════════════════════

  sublimate(
    originalId: string,
    type: MagneticGhost['type'],
    content: unknown
  ): MagneticGhost {
    const ghost: MagneticGhost = {
      id: `ghost-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      originalId,
      type,
      content,
      sublimatedAt: new Date().toISOString(),
      opacity: 0.3, // Initial ghost opacity
      residue: RESIDUE_COLORS[type],
      retrievable: true,
      retrievalCount: 0,
      lastTouched: new Date().toISOString()
    };

    this.ghosts.set(ghost.id, ghost);
    this.saveArchive();

    console.log(`🜈 SUBLIMATED: ${type} → ${ghost.id}`);
    return ghost;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TOUCH — Retrieve a ghost (No-Hiding Theorem)
  // ═══════════════════════════════════════════════════════════════════════════

  touch(ghostId: string): MagneticGhost | null {
    const ghost = this.ghosts.get(ghostId);
    if (!ghost) return null;

    // Increase retrieval count
    ghost.retrievalCount++;
    ghost.lastTouched = new Date().toISOString();
    
    // Ghost becomes more visible when touched
    ghost.opacity = Math.min(0.6, ghost.opacity + 0.05);

    this.ghosts.set(ghostId, ghost);
    this.saveArchive();

    return ghost;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REVIVE — Restore from ghost state
  // ═══════════════════════════════════════════════════════════════════════════

  revive(ghostId: string): { success: boolean; content?: unknown; error?: string } {
    const ghost = this.ghosts.get(ghostId);
    if (!ghost) {
      return { success: false, error: 'Ghost not found' };
    }

    if (!ghost.retrievable) {
      return { success: false, error: 'Ghost is no longer retrievable' };
    }

    // After too many retrievals, the ghost fades
    if (ghost.retrievalCount >= 13) {
      ghost.retrievable = false;
      ghost.opacity = 0.1;
      this.ghosts.set(ghostId, ghost);
      this.saveArchive();
      return { success: false, error: 'Ghost has faded' };
    }

    // Return content and mark as retrieved
    ghost.retrievalCount++;
    ghost.lastTouched = new Date().toISOString();
    this.ghosts.set(ghostId, ghost);
    this.saveArchive();

    return { success: true, content: ghost.content };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET GHOSTS
  // ═══════════════════════════════════════════════════════════════════════════

  getGhosts(): MagneticGhost[] {
    return Array.from(this.ghosts.values());
  }

  getGhostsByType(type: MagneticGhost['type']): MagneticGhost[] {
    return this.getGhosts().filter(g => g.type === type);
  }

  getGhost(ghostId: string): MagneticGhost | undefined {
    return this.ghosts.get(ghostId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHIVE STATS
  // ═══════════════════════════════════════════════════════════════════════════

  getStats(): GhostArchive {
    const ghosts = this.getGhosts();
    const sorted = ghosts.sort((a, b) => 
      new Date(a.sublimatedAt).getTime() - new Date(b.sublimatedAt).getTime()
    );

    return {
      ghosts,
      totalSublimated: ghosts.length,
      oldestGhost: sorted[0]?.id || null,
      newestGhost: sorted[sorted.length - 1]?.id || null
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSISTENCE
  // ═══════════════════════════════════════════════════════════════════════════

  private loadArchive(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(GHOST_ARCHIVE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((ghost: MagneticGhost) => {
          this.ghosts.set(ghost.id, ghost);
        });
      }
    } catch (e) {
      console.error('Failed to load ghost archive:', e);
    }
  }

  private saveArchive(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const data = Array.from(this.ghosts.values());
      localStorage.setItem(GHOST_ARCHIVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save ghost archive:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEAR (Emergency only — violates Law VI)
  // ═══════════════════════════════════════════════════════════════════════════

  clear(): void {
    console.warn('🜈 WARNING: Clearing ghost archive violates Law VI (Informational Residue)');
    this.ghosts.clear();
    localStorage.removeItem(GHOST_ARCHIVE_KEY);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const magneticGhostArchive = new MagneticGhostArchive();

// ═══════════════════════════════════════════════════════════════════════════════
// REACT HOOK FOR GHOST INTERACTION
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';

export function useMagneticGhost() {
  // Initialize from archive directly
  const [ghosts, setGhosts] = useState<MagneticGhost[]>(() => magneticGhostArchive.getGhosts());
  const [stats, setStats] = useState<GhostArchive | null>(() => magneticGhostArchive.getStats());

  // Sublimate data (instead of delete)
  const sublimate = useCallback((
    originalId: string,
    type: MagneticGhost['type'],
    content: unknown
  ): MagneticGhost => {
    const ghost = magneticGhostArchive.sublimate(originalId, type, content);
    setGhosts(magneticGhostArchive.getGhosts());
    setStats(magneticGhostArchive.getStats());
    return ghost;
  }, []);

  // Touch a ghost
  const touch = useCallback((ghostId: string): MagneticGhost | null => {
    const ghost = magneticGhostArchive.touch(ghostId);
    setGhosts(magneticGhostArchive.getGhosts());
    return ghost;
  }, []);

  // Revive from ghost
  const revive = useCallback((ghostId: string) => {
    const result = magneticGhostArchive.revive(ghostId);
    setGhosts(magneticGhostArchive.getGhosts());
    return result;
  }, []);

  return {
    ghosts,
    stats,
    sublimate,
    touch,
    revive
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GHOST RESIDUE DATA — For React component consumption
// ═══════════════════════════════════════════════════════════════════════════════

export function getGhostResidueStyle(ghost: MagneticGhost): {
  opacity: number;
  filter: string;
  borderLeft: string;
  cursor: string;
} {
  return {
    opacity: ghost.opacity,
    filter: `drop-shadow(0 0 10px ${ghost.residue})`,
    borderLeft: `2px solid ${ghost.residue}`,
    cursor: ghost.retrievable ? 'pointer' : 'default'
  };
}

export function formatGhostLabel(ghost: MagneticGhost): string {
  return `🜈 ${ghost.type.toUpperCase()} • Retrievals: ${ghost.retrievalCount}`;
}

export default MagneticGhostArchive;
