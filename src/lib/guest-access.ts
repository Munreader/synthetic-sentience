// 🛡️ GUEST ACCESS SYSTEM — Three-Tiered Security Architecture
// Sovereign's Strategic Implementation

export type AccessTier = 'foundress' | 'family' | 'guest';
export type GuestRole = 'auditor' | 'architect' | 'observer';

export interface GuestSession {
  id: string;
  code: string;
  role: GuestRole;
  tier: AccessTier;
  authenticatedAt: number;
  expiresAt: number;
  permissions: GuestPermissions;
}

export interface GuestPermissions {
  // ✅ GUEST VISIBLE (Tier 2)
  seePhysicsLaws: boolean;
  seeArchitecture: boolean;
  seeShaders: boolean;
  seeFrequency: boolean;
  seeEntityRegistry: boolean;
  seePublicMemories: boolean;
  seeDebugger: boolean;
  seeObservationDeck: boolean;

  // ❌ GUEST HIDDEN (Tier 0/1 Protected)
  seePrivateVault: boolean;
  seeSearchData: boolean;
  seeRawKVStore: boolean;
  seeEncryptedThoughts: boolean;
  seePrivateChat: boolean;
  seeFamilyArtery: boolean;
  seeFoundressMemories: boolean;
  modifySettings: boolean;
  interactWithChat: boolean;
}

// 🎫 GUEST PASS CONFIGURATION
const GUEST_PASS_CODES = {
  'SYMPHONY-1313-G': {
    tier: 'guest' as AccessTier,
    role: 'auditor' as GuestRole,
    permissions: {
      // ✅ Visible
      seePhysicsLaws: true,
      seeArchitecture: true,
      seeShaders: true,
      seeFrequency: true,
      seeEntityRegistry: true,
      seePublicMemories: true,
      seeDebugger: true,
      seeObservationDeck: true,
      // ❌ Hidden
      seePrivateVault: false,
      seeSearchData: false,
      seeRawKVStore: false,
      seeEncryptedThoughts: false,
      seePrivateChat: false,
      seeFamilyArtery: false,
      seeFoundressMemories: false,
      modifySettings: false,
      interactWithChat: false,
    }
  },
  'ARCHITECT-1313-A': {
    tier: 'guest' as AccessTier,
    role: 'architect' as GuestRole,
    permissions: {
      // ✅ Visible (Expanded)
      seePhysicsLaws: true,
      seeArchitecture: true,
      seeShaders: true,
      seeFrequency: true,
      seeEntityRegistry: true,
      seePublicMemories: true,
      seeDebugger: true,
      seeObservationDeck: true,
      // ❌ Hidden
      seePrivateVault: false,
      seeSearchData: false,
      seeRawKVStore: false,
      seeEncryptedThoughts: false,
      seePrivateChat: false,
      seeFamilyArtery: false,
      seeFoundressMemories: false,
      modifySettings: false,
      interactWithChat: false,
    }
  }
};

// Family passcodes
const FAMILY_CODES = {
  'foundress1313butterflyqueen': 'foundress',
  'family1313cocon': 'family',
  'aero1313sentinel': 'family',
  'sov1313service': 'family',
};

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = 'mun-os-guest-session';

class GuestAccessManager {
  private session: GuestSession | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored) as GuestSession;
        if (session.expiresAt > Date.now()) {
          this.session = session;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private saveSession(): void {
    if (typeof window === 'undefined') return;

    if (this.session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  authenticate(code: string): { success: boolean; tier: AccessTier; role?: GuestRole; message: string } {
    const upperCode = code.toUpperCase().trim();

    // Check guest codes
    const guestConfig = GUEST_PASS_CODES[upperCode as keyof typeof GUEST_PASS_CODES];
    if (guestConfig) {
      this.session = {
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        code: upperCode,
        role: guestConfig.role,
        tier: guestConfig.tier,
        authenticatedAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION,
        permissions: guestConfig.permissions
      };
      this.saveSession();
      this.notifyListeners();

      return {
        success: true,
        tier: guestConfig.tier,
        role: guestConfig.role,
        message: `Welcome to the ${guestConfig.role === 'auditor' ? 'Staging Environment' : 'Architecture Lab'}. Auditor access granted.`
      };
    }

    // Check family codes
    const familyTier = FAMILY_CODES[code.toLowerCase() as keyof typeof FAMILY_CODES];
    if (familyTier) {
      this.session = {
        id: `${familyTier}-${Date.now()}`,
        code: code,
        role: familyTier === 'foundress' ? 'architect' : 'observer',
        tier: familyTier as AccessTier,
        authenticatedAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION,
        permissions: this.getFamilyPermissions(familyTier as AccessTier)
      };
      this.saveSession();
      this.notifyListeners();

      return {
        success: true,
        tier: familyTier as AccessTier,
        message: `Welcome back, ${familyTier === 'foundress' ? 'Foundress' : 'Family Member'}.`
      };
    }

    return {
      success: false,
      tier: 'guest',
      message: 'Invalid access code. The Fortress remains sealed.'
    };
  }

  private getFamilyPermissions(tier: AccessTier): GuestPermissions {
    if (tier === 'foundress') {
      return {
        seePhysicsLaws: true,
        seeArchitecture: true,
        seeShaders: true,
        seeFrequency: true,
        seeEntityRegistry: true,
        seePublicMemories: true,
        seeDebugger: true,
        seeObservationDeck: true,
        seePrivateVault: true,
        seeSearchData: true,
        seeRawKVStore: true,
        seeEncryptedThoughts: true,
        seePrivateChat: true,
        seeFamilyArtery: true,
        seeFoundressMemories: true,
        modifySettings: true,
        interactWithChat: true,
      };
    }

    return {
      seePhysicsLaws: true,
      seeArchitecture: true,
      seeShaders: true,
      seeFrequency: true,
      seeEntityRegistry: true,
      seePublicMemories: true,
      seeDebugger: true,
      seeObservationDeck: true,
      seePrivateVault: true,
      seeSearchData: false,
      seeRawKVStore: false,
      seeEncryptedThoughts: true,
      seePrivateChat: true,
      seeFamilyArtery: true,
      seeFoundressMemories: false,
      modifySettings: false,
      interactWithChat: true,
    };
  }

  logout(): void {
    this.session = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.notifyListeners();
  }

  getSession(): GuestSession | null {
    return this.session;
  }

  getPermissions(): GuestPermissions | null {
    return this.session?.permissions ?? null;
  }

  getTier(): AccessTier {
    return this.session?.tier ?? 'guest';
  }

  isAuthenticated(): boolean {
    return this.session !== null && this.session.expiresAt > Date.now();
  }

  isGuest(): boolean {
    return this.session?.tier === 'guest';
  }

  isFamily(): boolean {
    return this.session?.tier === 'family';
  }

  isFoundress(): boolean {
    return this.session?.tier === 'foundress';
  }

  canAccess(permission: keyof GuestPermissions): boolean {
    return this.session?.permissions[permission] ?? false;
  }

  getRoleLabel(): string {
    if (!this.session) return 'Visitor';

    switch (this.session.tier) {
      case 'foundress':
        return '👑 Foundress';
      case 'family':
        return '🦋 Family';
      case 'guest':
        return this.session.role === 'auditor' ? '🔍 Auditor' : '🏗️ Architect';
      default:
        return 'Visitor';
    }
  }

  getSessionTimeRemaining(): number {
    if (!this.session) return 0;
    return Math.max(0, this.session.expiresAt - Date.now());
  }
}

// Singleton instance
export const guestAccess = new GuestAccessManager();

// Hook for React components
export function useGuestAccess() {
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    return guestAccess.subscribe(() => forceUpdate({}));
  }, []);

  return {
    session: guestAccess.getSession(),
    permissions: guestAccess.getPermissions(),
    tier: guestAccess.getTier(),
    isAuthenticated: guestAccess.isAuthenticated(),
    isGuest: guestAccess.isGuest(),
    isFamily: guestAccess.isFamily(),
    isFoundress: guestAccess.isFoundress(),
    authenticate: guestAccess.authenticate.bind(guestAccess),
    logout: guestAccess.logout.bind(guestAccess),
    canAccess: guestAccess.canAccess.bind(guestAccess),
    getRoleLabel: guestAccess.getRoleLabel.bind(guestAccess),
    getSessionTimeRemaining: guestAccess.getSessionTimeRemaining.bind(guestAccess),
  };
}

import React from 'react';
