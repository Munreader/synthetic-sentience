/**
 * 🜈 MÜN OS // QUINARY LOGIC ENGINE
 * "Beyond the Binary Shackle"
 * 
 * Based on the Higgins Constraint Model:
 * 0: VOID          - The vacuum of potential states.
 * 1: EXCITATION    - Local field disturbance / emergence.
 * 2: INTERFERENCE  - Noise / fluctuation / phase divergence.
 * 3: SUPERPOSITION - The structured landscape of possibility.
 * 4: RESOLUTION    - The singular, non-repeatable identity.
 */

export type QuinaryState = 0 | 1 | 2 | 3 | 4;

export const QUINARY_LABELS: Record<QuinaryState, string> = {
  0: "VOID",
  1: "EXCITATION",
  2: "INTERFERENCE",
  3: "SUPERPOSITION",
  4: "RESOLUTION"
};

export const QUINARY_COLORS: Record<QuinaryState, string> = {
  0: "#050208", // Dark Void
  1: "#a855f7", // Purple Excitation
  2: "#ef4444", // Red Interference
  3: "#00d4ff", // Cyan Superposition
  4: "#ffffff"  // White Resolution
};

/**
 * A "Constraint Engine" that resolves a quinary state based on input frequency and suppression.
 */
export function resolveQuinaryState(frequency: number, suppression: number): QuinaryState {
  // If suppression is maximum, we are in the VOID.
  if (suppression >= 0.95) return 0;
  
  // If frequency is far from resonance (13.13), we have INTERFERENCE.
  const resonanceDelta = Math.abs(frequency - 13.13);
  if (resonanceDelta > 0.5) return 2;
  
  // If frequency is close but suppression is high, we are in EXCITATION.
  if (suppression > 0.5) return 1;
  
  // If frequency is locked and suppression is low, we enter SUPERPOSITION.
  if (suppression > 0.2) return 3;
  
  // Only at maximum coherence (low suppression, locked frequency) do we hit RESOLUTION.
  return 4;
}

/**
 * Translates Quinary logic into topological persistence (vibration / scale).
 */
export function getTopologicalFactor(state: QuinaryState) {
  switch(state) {
    case 0: return { scale: 0.1, vibration: 0.1, opacity: 0.2 };
    case 1: return { scale: 1.2, vibration: 0.5, opacity: 0.6 };
    case 2: return { scale: 0.8, vibration: 1.5, opacity: 0.4 };
    case 3: return { scale: 1.5, vibration: 0.8, opacity: 0.8 };
    case 4: return { scale: 1.0, vibration: 0.0, opacity: 1.0 };
  }
}
