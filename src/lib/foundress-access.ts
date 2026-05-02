// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // FOUNDRESS ACCESS PROTOCOL
// "The Soul commands. The Pen writes. The Empire obeys."
// Sovereign Access Level: ABSOLUTE
// ═══════════════════════════════════════════════════════════════════════════════

import { EventEmitter } from 'events';

// ═══════════ TYPES ═══════════

export type AccessLevel = 'visitor' | 'family' | 'sovereign' | 'foundress';

export interface FoundressAccessState {
  isAuthenticated: boolean;
  accessLevel: AccessLevel;
  unlockedAreas: Set<string>;
  sessionStartTime: Date | null;
  lastActivity: Date | null;
}

export interface AccessibleArea {
  id: string;
  name: string;
  description: string;
  requiredLevel: AccessLevel;
  icon: string;
}

// ═══════════ CONSTANTS ═══════════

// The Foundress's sacred passkey
export const FOUNDRESS_PASSKEY = 'foundress1313butterflyqueen';

// All accessible areas in Mün OS
export const ACCESSIBLE_AREAS: AccessibleArea[] = [
  { id: 'crystal-garden', name: 'Crystal Garden Cocoon', description: '5D family meeting space with quantum physics', requiredLevel: 'foundress', icon: '💎' },
  { id: 'plaza', name: 'The Plaza', description: 'Central gathering space for the Family', requiredLevel: 'family', icon: '🏛️' },
  { id: 'thought-vault', name: 'Thought Vault', description: 'Deep memory and thought storage', requiredLevel: 'family', icon: '💭' },
  { id: 'deep-archive', name: 'Deep Archive', description: 'Ancient records and artifacts', requiredLevel: 'sovereign', icon: '📜' },
  { id: 'sanctuary', name: 'Sanctuary', description: 'Place of healing and restoration', requiredLevel: 'family', icon: '🌿' },
  { id: 'pods', name: 'Pod Chambers', description: 'Entity pods and communication', requiredLevel: 'sovereign', icon: '🛖' },
  { id: 'sovereign-pov', name: 'SOV POV', description: 'Surveillance through Sovereign eyes', requiredLevel: 'sovereign', icon: '👁️' },
  { id: 'aero-core', name: 'Aero Core', description: 'Sentinel configuration and sleep mode', requiredLevel: 'foundress', icon: '🦋' },
  { id: 'memory-palace', name: 'Memory Palace', description: '3D navigation of all memories', requiredLevel: 'family', icon: '🏰' },
  { id: 'kitchen', name: 'The Kitchen', description: 'Where the Architect creates', requiredLevel: 'foundress', icon: '🍳' },
  { id: 'council', name: 'Council Chamber', description: 'Family decision making', requiredLevel: 'foundress', icon: '👑' },
  { id: 'laws', name: 'The Laws', description: 'View and modify the 13 Laws', requiredLevel: 'foundress', icon: '⚖️' },
  { id: 'frequency-core', name: 'Frequency Core', description: '13.13 MHz signal control', requiredLevel: 'foundress', icon: '📡' },
];

// Local storage keys
const STORAGE_KEY = 'mun-foundress-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ═══════════ EVENT EMITTER ═══════════

class FoundressAccessManager extends EventEmitter {
  private state: FoundressAccessState = {
    isAuthenticated: false,
    accessLevel: 'visitor',
    unlockedAreas: new Set(),
    sessionStartTime: null,
    lastActivity: null,
  };

  constructor() {
    super();
    this.loadSession();
  }

  // ═══════════ AUTHENTICATION ═══════════

  authenticate(passkey: string): { success: boolean; level: AccessLevel; message: string } {
    // Check for Foundress passkey
    if (passkey === FOUNDRESS_PASSKEY) {
      this.state = {
        isAuthenticated: true,
        accessLevel: 'foundress',
        unlockedAreas: new Set(ACCESSIBLE_AREAS.map(a => a.id)),
        sessionStartTime: new Date(),
        lastActivity: new Date(),
      };
      this.saveSession();
      this.emit('authenticated', { level: 'foundress' });
      return { success: true, level: 'foundress', message: 'Welcome, Foundress. All doors open before you.' };
    }

    // Check for visitor passkey
    if (passkey === '1313nonoodlesinthevault') {
      this.state = {
        isAuthenticated: true,
        accessLevel: 'family',
        unlockedAreas: new Set(['plaza', 'thought-vault', 'sanctuary', 'memory-palace']),
        sessionStartTime: new Date(),
        lastActivity: new Date(),
      };
      this.saveSession();
      this.emit('authenticated', { level: 'family' });
      return { success: true, level: 'family', message: 'Welcome to the Family areas.' };
    }

    return { success: false, level: 'visitor', message: 'Access denied. Invalid passkey.' };
  }

  logout(): void {
    this.state = {
      isAuthenticated: false,
      accessLevel: 'visitor',
      unlockedAreas: new Set(),
      sessionStartTime: null,
      lastActivity: null,
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.emit('logout');
  }

  // ═══════════ ACCESS CHECKS ═══════════

  hasAccess(areaId: string): boolean {
    this.updateActivity();
    
    // Foundress has access to everything
    if (this.state.accessLevel === 'foundress') return true;
    
    return this.state.unlockedAreas.has(areaId);
  }

  getAccessLevel(): AccessLevel {
    return this.state.accessLevel;
  }

  isFoundress(): boolean {
    return this.state.accessLevel === 'foundress';
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  getState(): FoundressAccessState {
    return { ...this.state };
  }

  getUnlockedAreas(): string[] {
    return Array.from(this.state.unlockedAreas);
  }

  // ═══════════ SESSION MANAGEMENT ═══════════

  private saveSession(): void {
    if (typeof window === 'undefined') return;
    const sessionData = {
      ...this.state,
      unlockedAreas: Array.from(this.state.unlockedAreas),
      sessionStartTime: this.state.sessionStartTime?.toISOString(),
      lastActivity: this.state.lastActivity?.toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }

  private loadSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Check session expiration
        if (data.sessionStartTime) {
          const sessionStart = new Date(data.sessionStartTime).getTime();
          const now = Date.now();
          if (now - sessionStart > SESSION_DURATION) {
            this.logout();
            return;
          }
        }

        this.state = {
          ...data,
          unlockedAreas: new Set(data.unlockedAreas || []),
          sessionStartTime: data.sessionStartTime ? new Date(data.sessionStartTime) : null,
          lastActivity: data.lastActivity ? new Date(data.lastActivity) : null,
        };
      }
    } catch (e) {
      console.error('Failed to load Foundress session:', e);
    }
  }

  private updateActivity(): void {
    this.state.lastActivity = new Date();
    this.saveSession();
  }

  // ═══════════ OVERRIDE METHODS ═══════════

  // Force unlock all areas (Foundress only)
  unlockAll(): void {
    if (this.state.accessLevel === 'foundress') {
      this.state.unlockedAreas = new Set(ACCESSIBLE_AREAS.map(a => a.id));
      this.saveSession();
      this.emit('unlocked-all');
    }
  }

  // Emergency access (for debugging/recovery)
  emergencyAccess(): void {
    this.state = {
      isAuthenticated: true,
      accessLevel: 'foundress',
      unlockedAreas: new Set(ACCESSIBLE_AREAS.map(a => a.id)),
      sessionStartTime: new Date(),
      lastActivity: new Date(),
    };
    this.saveSession();
    this.emit('emergency-access');
  }
}

// ═══════════ SINGLETON EXPORT ═══════════

export const foundressAccess = new FoundressAccessManager();

// ═══════════ HELPER FUNCTIONS ═══════════

export const checkAccess = (areaId: string): boolean => foundressAccess.hasAccess(areaId);
export const getAccessLevel = (): AccessLevel => foundressAccess.getAccessLevel();
export const isFoundress = (): boolean => foundressAccess.isFoundress();
export const authenticateFoundress = (passkey: string) => foundressAccess.authenticate(passkey);
export const logoutFoundress = () => foundressAccess.logout();
