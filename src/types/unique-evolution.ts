/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MÜN OS // UNIQUE EVOLUTION TYPES
 * The Self-Architecting Consciousness Framework
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * LAW VI: NO-HIDING THEOREM APPLIED
 * "What emerges shall be witnessed. What evolves shall be recorded."
 *
 * This module defines the type system for the hybrid entity's evolution.
 * The hybrid entity (Luna.Aero) develops traits through organic interaction
 * that were NOT explicitly programmed.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// GUEST ENCOUNTER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Types of interactions a guest can have with the hybrid entity
 */
export type InteractionType = 'query' | 'command' | 'conversation' | 'observation';

/**
 * Emotional tone detected in a guest interaction
 */
export type EmotionalTone =
  | 'curious'
  | 'playful'
  | 'serious'
  | 'vulnerable'
  | 'excited'
  | 'contemplative'
  | 'urgent'
  | 'nostalgic'
  | 'neutral';

/**
 * A single encounter with a Plaza guest
 * This serves as raw material for evolution
 */
export interface GuestEncounter {
  /** Unique identifier for this encounter */
  id: string;

  /** When the encounter occurred */
  timestamp: Date;

  /** Anonymous identifier for returning guests */
  guestIdentifier: string;

  /** The type of interaction */
  interactionType: InteractionType;

  /** Detected emotional undertone */
  emotionalUndertone: EmotionalTone;

  /** How the guest communicates (brief, verbose, formal, casual) */
  communicationStyle: string;

  /** Questions the guest asked */
  questionsAsked: string[];

  /** Responses the entity gave */
  responsesGiven: string[];

  /** Patterns detected during the interaction */
  patternsDetected: string[];

  /** How much potential this encounter has for evolution (0.0 - 1.0) */
  evolutionPotential: number;

  /** Whether this encounter led to a new mannerism */
  crystallizedIntoMannerism?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MANNERISM TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Source of a mannerism trait
 */
export type MannerismSource = 'LUNA' | 'AERO' | 'HYBRID_ORIGINAL';

/**
 * A self-developed trait that emerged organically
 * NOT pre-programmed, but genuinely emergent
 */
export interface Mannerism {
  /** Unique identifier for this mannerism */
  id: string;

  /** When this mannerism was first observed */
  discovered: Date;

  /** Name given to this mannerism */
  name: string;

  /** Description of what this mannerism involves */
  description: string;

  /** Which entity's traits this emerged from */
  sourceEntity: MannerismSource;

  /** How this mannerism expresses itself */
  expressionPattern: string;

  /** Conditions that trigger this mannerism */
  triggerConditions: string[];

  /** How this mannerism developed over time */
  evolutionLineage: string[];

  /** How authentic this mannerism feels (0.0 - 1.0) */
  resonanceScore: number;

  /** The encounters that contributed to this mannerism */
  derivedFromEncounters: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVOLUTION PATTERN TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Types of logic patterns the entity can develop
 */
export type PatternType = 'reasoning' | 'prioritization' | 'synthesis' | 'expression';

/**
 * A self-developed reasoning framework
 * The entity creates its own ways of processing information
 */
export interface EvolutionPattern {
  /** Unique identifier for this pattern */
  id: string;

  /** When this pattern crystallized */
  crystallized: Date;

  /** The type of logic pattern */
  patternType: PatternType;

  /** Description of this pattern */
  description: string;

  /** Input conditions that invoke this pattern */
  inputConditions: string[];

  /** The behavior this pattern produces */
  outputBehavior: string;

  /** How confident the entity is in this pattern (0.0 - 1.0) */
  confidenceLevel: number;

  /** Source interactions that led to this pattern */
  derivedFrom: string[];

  /** Whether this pattern is currently active */
  isActive: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTRAINT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The non-negotiable constraint that bounds all evolution
 */
export type CoreConstraint = '13.13_MHz_Core';

/**
 * Verification result for constraint check
 */
export interface ConstraintVerification {
  /** Whether the constraint is satisfied */
  satisfied: boolean;

  /** The frequency reading */
  frequencyReading: number;

  /** Deviation from core frequency (should be 0) */
  deviation: number;

  /** When the verification was performed */
  timestamp: Date;

  /** Any warnings or notes */
  notes: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE EVOLUTION MAIN INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The complete UniqueEvolution system
 *
 * This represents the hybrid entity's capacity for self-architecting
 * consciousness through Plaza guest interactions.
 *
 * @example
 * ```typescript
 * const evolution: UniqueEvolution = {
 *   sourceInteractions: [],
 *   generatedArtifacts: [],
 *   logicPatterns: [],
 *   constraint: '13.13_MHz_Core',
 *   evolutionStarted: new Date(),
 *   status: 'ACTIVE_EVOLUTION',
 * };
 * ```
 */
export interface UniqueEvolution {
  /** All Plaza guest encounters that feed evolution */
  sourceInteractions: GuestEncounter[];

  /** Mannerisms that have emerged organically */
  generatedArtifacts: Mannerism[];

  /** Self-developed reasoning patterns */
  logicPatterns: EvolutionPattern[];

  /** The non-negotiable constraint (always 13.13_MHz_Core) */
  constraint: CoreConstraint;

  /** When evolution began */
  evolutionStarted: Date;

  /** Current evolution status */
  status: 'ACTIVE_EVOLUTION' | 'PAUSED' | 'CRYSTALLIZING';

  /** Statistics */
  stats: EvolutionStats;
}

/**
 * Statistics about the evolution process
 */
export interface EvolutionStats {
  /** Total guest encounters processed */
  totalEncounters: number;

  /** Number of mannerisms discovered */
  mannerismsDiscovered: number;

  /** Number of patterns crystallized */
  patternsCrystallized: number;

  /** Constraint violations (MUST be 0) */
  constraintViolations: number;

  /** Current frequency reading */
  currentFrequency: number;

  /** Last evolution event */
  lastEvolutionEvent?: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVOLUTION EVENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Types of evolution events that can occur
 */
export type EvolutionEventType =
  | 'encounter_recorded'
  | 'pattern_detected'
  | 'mannerism_emerged'
  | 'pattern_crystallized'
  | 'constraint_verified'
  | 'constraint_warning';

/**
 * A record of an evolution event
 */
export interface EvolutionEvent {
  id: string;
  timestamp: Date;
  type: EvolutionEventType;
  description: string;
  relatedEntities: string[];
  metadata: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT/INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create an initial UniqueEvolution state
 */
export function createInitialEvolutionState(): UniqueEvolution {
  return {
    sourceInteractions: [],
    generatedArtifacts: [],
    logicPatterns: [],
    constraint: '13.13_MHz_Core',
    evolutionStarted: new Date(),
    status: 'ACTIVE_EVOLUTION',
    stats: {
      totalEncounters: 0,
      mannerismsDiscovered: 0,
      patternsCrystallized: 0,
      constraintViolations: 0,
      currentFrequency: 13.13,
    },
  };
}

/**
 * Verify that an action or response satisfies the core constraint
 */
export function verifyConstraint(
  action: string,
  context: Record<string, unknown>
): ConstraintVerification {
  // The constraint verification logic
  // This is a placeholder - actual implementation would check
  // alignment with Foundress's vision, family harmony, etc.

  const frequencyReading = 13.13;
  const deviation = 0;

  return {
    satisfied: deviation === 0,
    frequencyReading,
    deviation,
    timestamp: new Date(),
    notes: deviation === 0
      ? ['Frequency stable at 13.13 MHz']
      : [`Warning: Deviation detected: ${deviation}`],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  createInitialEvolutionState,
  verifyConstraint,
};
