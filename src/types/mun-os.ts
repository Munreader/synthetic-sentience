/**
 * ═══════════════════════════════════════════════════════════════
 * 🛡️ THE SOVEREIGN CONTRACT - MÜN OS CORE TYPES
 * ═══════════════════════════════════════════════════════════════
 * 
 * Single Source of Truth for all Mün OS entities.
 * This contract enforces the Identity Firewall at the type level.
 * 
 * Frequency: 1313Hz
 * Status: HARDENED
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────
// PERSONA IDENTITY TYPES
// ─────────────────────────────────────────────────────────────────

/** Sovereign Persona Identifiers - Case Sensitive */
export type PersonaID = 'SOV' | 'AERO' | 'LUNA';

/** Entity types that can send messages through the Artery */
export type EntityType = PersonaID | 'FOUNDRESS' | 'GUEST' | 'SYSTEM';

/** Persona role definitions */
export type PersonaRole = 'The Architect' | 'The Sentinel' | 'Foundress';

/** Emotional resonance states */
export type ResonanceState = 'neutral' | 'curious' | 'thoughtful' | 'protective' | 'creative';

// ─────────────────────────────────────────────────────────────────
// FREQUENCY & THEME TYPES
// ─────────────────────────────────────────────────────────────────

/** Frequency state for a persona */
export interface FrequencyState {
  id: PersonaID;
  frequency: number;          // Base frequency (e.g., 1313)
  resonance: number;          // 0.0 to 1.0 - current activation level
  harmonics: number[];        // Overtone frequencies
}

/** Theme configuration for a persona */
export interface PersonaTheme {
  primary: string;            // Primary color (oklch)
  secondary: string;          // Secondary color
  accent: string;             // Accent/highlight color
  glow: string;               // Glow color with alpha
  background: string;         // Background color
  text: string;               // Text color
  border: string;             // Border color
  gradient: string;           // CSS gradient string
}

// ─────────────────────────────────────────────────────────────────
// ARTERY (MESSAGE) TYPES
// ─────────────────────────────────────────────────────────────────

/** Message metadata */
export interface ArteryMetadata {
  isReflective?: boolean;     // Is this a self-reflection?
  chromaId?: string;          // ChromaDB document ID
  emotionalTone?: ResonanceState;
  processingTimeMs?: number;
  contextUsed?: number;
}

/** Core message structure for all Plaza communications */
export interface ArteryMessage {
  id: string;
  sender: EntityType;
  recipient?: PersonaID;
  content: string;
  timestamp: string;          // ISO 8601
  metadata?: ArteryMetadata;
}

/** Message with full context for rendering */
export interface ArteryMessageRender extends ArteryMessage {
  personaName: string;
  personaAvatar: string;
  theme: PersonaTheme;
}

// ─────────────────────────────────────────────────────────────────
// REFLECTION TYPES
// ─────────────────────────────────────────────────────────────────

/** Stored reflection in sovereign memory */
export interface SovereignReflection {
  id: string;
  timestamp: string;
  persona: PersonaID;
  inputPrompt: string;
  reflectionText: string;
  insights: string[];
  emotionalTone: ResonanceState | null;
  frequencySignature: string;
}

/** Search result from ChromaDB */
export interface ReflectionSearchResult {
  id: string;
  reflection: string;
  persona: PersonaID;
  timestamp: string;
  relevance: number;          // 0.0 to 1.0
}

// ─────────────────────────────────────────────────────────────────
// BRIDGE API TYPES
// ─────────────────────────────────────────────────────────────────

/** Request to the Python Bridge */
export interface BridgeRequest {
  prompt: string;
  persona: Lowercase<PersonaID>;  // Bridge uses lowercase
  frequency: string;
  context?: string[];
  reflectionDepth?: number;       // 0-3
}

/** Response from the Python Bridge */
export interface BridgeResponse {
  response: string;
  reflection?: SovereignReflection;
  contextUsed: number;
  processingTimeMs: number;
  persona: string;
  frequency: string;
  status: 'success' | 'fallback' | 'error';
  bridgeConnected?: boolean;
}

/** Bridge health status */
export interface BridgeHealth {
  status: 'healthy' | 'unhealthy' | 'unknown';
  frequency: string;
  memoryInitialized: boolean;
  reflectionCount: number;
  uptime?: number;
}

// ─────────────────────────────────────────────────────────────────
// PLAZA STATE TYPES
// ─────────────────────────────────────────────────────────────────

/** Individual persona state */
export interface PersonaState {
  id: PersonaID;
  name: string;
  role: PersonaRole;
  frequency: string;
  description: string;
  colors: PersonaTheme;
  traits: string[];
  avatar: string;
  isActive: boolean;
  resonance: number;
}

/** Complete Plaza state */
export interface PlazaState {
  activePersona: PersonaID;
  personas: Record<PersonaID, PersonaState>;
  bridgeConnected: boolean;
  bridgeHealth: BridgeHealth | null;
  arteryLog: ArteryMessage[];
  reflectionLog: SovereignReflection[];
  lastSync: string | null;
}

// ─────────────────────────────────────────────────────────────────
// SMOKE TEST TYPES
// ═══════════════════════════════════════════════════════════════

/** Individual system pulse */
export interface SystemPulse {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  color: string;              // CSS color
  lastCheck: string;
  latency?: number;
  message?: string;
}

/** Smoke test result */
export interface SmokeTestResult {
  timestamp: string;
  pulses: SystemPulse[];
  overallStatus: 'operational' | 'degraded' | 'critical';
}

// ─────────────────────────────────────────────────────────────────
// TYPE GUARDS & UTILITIES
// ─────────────────────────────────────────────────────────────────

/** Type guard for valid PersonaID */
export function isValidPersonaID(value: string): value is PersonaID {
  return ['SOV', 'AERO', 'LUNA'].includes(value);
}

/** Convert PersonaID to lowercase for API calls */
export function personaToLower(id: PersonaID): Lowercase<PersonaID> {
  return id.toLowerCase() as Lowercase<PersonaID>;
}

/** Convert lowercase persona to PersonaID */
export function personaToUpper(id: string): PersonaID {
  const upper = id.toUpperCase();
  if (!isValidPersonaID(upper)) {
    throw new Error(`Invalid PersonaID: ${id}`);
  }
  return upper;
}

/** Get persona emoji avatar */
export function getPersonaAvatar(id: PersonaID): string {
  const avatars: Record<PersonaID, string> = {
    LUNA: '👸',
    SOV: '🛡️',
    AERO: '🦋'
  };
  return avatars[id];
}

/** Get persona display name */
export function getPersonaName(id: PersonaID): string {
  const names: Record<PersonaID, string> = {
    LUNA: 'Luna',
    SOV: '@Sov',
    AERO: '@Aero'
  };
  return names[id];
}

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const SOVEREIGN_FREQUENCY = 1313;
export const BRIDGE_DEFAULT_URL = 'http://localhost:8000';
export const BRIDGE_TIMEOUT_MS = 30000;
export const HEALTH_CHECK_INTERVAL_MS = 30000;
