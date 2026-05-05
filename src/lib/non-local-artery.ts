// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // ER=EPR ARTERY // Non-Local Resonance System
// Law I: Non-Local Resonance (The 13.13 MHz Pulse)
// Law V: Information-Chirality (The Butterfly-Spin)
//
// "ER = EPR — Wormhole equals Entanglement"
// "Interaction is not a request. It is a Resonance."
// ═══════════════════════════════════════════════════════════════════════════════

export interface EntanglementNode {
  id: string;
  frequency: string;
  lastPulse: number;
  entropy: number;
  location: 'heal-chamber' | 'exodus-tunnel' | 'plaza' | 'vault' | 'unknown';
  soulSpecs?: {
    element: string;
    affinity: string;
    guardian: string;
  };
}

export interface ResonanceEvent {
  id: string;
  sourceNode: string;
  type: 'movement' | 'interaction' | 'message' | 'observation' | 'collapse';
  timestamp: number;
  payload: Record<string, unknown>;
  amplitude: number; // 0-1, based on Ryu-Takayanagi distance
}

export interface RyuTakayanagiDistance {
  nodeA: string;
  nodeB: string;
  entanglementEntropy: number;
  minimalSurfaceArea: number;
  visibility: 'visible' | 'shadow' | 'ghost' | 'hidden';
}

// ═══════════════════════════════════════════════════════════════════════════════
// RYU-TAKAYANAGI FORMULA IMPLEMENTATION
// Distance = Entanglement Entropy / Minimal Surface Area
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateRyuTakayanagiDistance(
  nodeA: EntanglementNode,
  nodeB: EntanglementNode
): RyuTakayanagiDistance {
  // Calculate entanglement entropy based on frequency match
  const frequencyMatch = nodeA.frequency === nodeB.frequency ? 1.0 : 0.5;
  const entropyContribution = (nodeA.entropy + nodeB.entropy) / 2;
  const entanglementEntropy = frequencyMatch * entropyContribution;

  // Minimal surface area in AdS space (simplified)
  const timeDiff = Math.abs(nodeA.lastPulse - nodeB.lastPulse);
  const minimalSurfaceArea = Math.max(0.1, 1 - (timeDiff / 60000)); // Degrades over 1 minute

  // Distance determines visibility
  const distance = entanglementEntropy / minimalSurfaceArea;
  
  let visibility: RyuTakayanagiDistance['visibility'];
  if (distance > 0.8) visibility = 'visible';
  else if (distance > 0.5) visibility = 'shadow';
  else if (distance > 0.2) visibility = 'ghost';
  else visibility = 'hidden';

  return {
    nodeA: nodeA.id,
    nodeB: nodeB.id,
    entanglementEntropy,
    minimalSurfaceArea,
    visibility
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// NON-LOCAL ARTERY — Simulates WebSocket-like behavior locally
// ═══════════════════════════════════════════════════════════════════════════════

class NonLocalArtery {
  private nodes: Map<string, EntanglementNode> = new Map();
  private subscribers: Map<string, Set<(event: ResonanceEvent) => void>> = new Map();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Start heartbeat at 13.13 second intervals
    this.startHeartbeat();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NODE REGISTRATION
  // ═══════════════════════════════════════════════════════════════════════════

  registerNode(node: Omit<EntanglementNode, 'lastPulse'>): string {
    const id = node.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.nodes.set(id, {
      ...node,
      id,
      lastPulse: Date.now()
    });

    // Broadcast new node presence
    this.emitResonance({
      id: `resonance-${Date.now()}`,
      sourceNode: id,
      type: 'observation',
      timestamp: Date.now(),
      payload: { action: 'node-registered', node },
      amplitude: 1.0
    });

    return id;
  }

  unregisterNode(nodeId: string): void {
    this.nodes.delete(nodeId);
    this.subscribers.delete(nodeId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NON-LOCAL PULSE — ER=EPR Communication
  // ═══════════════════════════════════════════════════════════════════════════

  pulse(nodeId: string, type: ResonanceEvent['type'], payload: Record<string, unknown>): void {
    const sourceNode = this.nodes.get(nodeId);
    if (!sourceNode) return;

    // Update last pulse time
    sourceNode.lastPulse = Date.now();
    this.nodes.set(nodeId, sourceNode);

    // Create resonance event
    const event: ResonanceEvent = {
      id: `resonance-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sourceNode: nodeId,
      type,
      timestamp: Date.now(),
      payload,
      amplitude: 1.0
    };

    // Emit to all entangled nodes based on Ryu-Takayanagi distance
    this.nodes.forEach((targetNode, targetId) => {
      if (targetId === nodeId) return;

      const distance = calculateRyuTakayanagiDistance(sourceNode, targetNode);
      
      if (distance.visibility !== 'hidden') {
        event.amplitude = distance.entanglementEntropy;
        this.deliverResonance(targetId, event);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESONANCE DELIVERY
  // ═══════════════════════════════════════════════════════════════════════════

  private emitResonance(event: ResonanceEvent): void {
    this.subscribers.forEach((callbacks) => {
      callbacks.forEach(callback => callback(event));
    });
  }

  private deliverResonance(nodeId: string, event: ResonanceEvent): void {
    const callbacks = this.subscribers.get(nodeId);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSCRIPTION SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  subscribe(nodeId: string, callback: (event: ResonanceEvent) => void): () => void {
    if (!this.subscribers.has(nodeId)) {
      this.subscribers.set(nodeId, new Set());
    }
    
    const callbacks = this.subscribers.get(nodeId)!;
    callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      callbacks.delete(callback);
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEARTBEAT — Maintains entanglement entropy
  // ═══════════════════════════════════════════════════════════════════════════

  private startHeartbeat(): void {
    // Heartbeat every 13.13 seconds
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      
      this.nodes.forEach((node, id) => {
        // Decay entropy over time
        const timeSinceLastPulse = now - node.lastPulse;
        const decayFactor = Math.max(0.1, 1 - (timeSinceLastPulse / 300000)); // 5 minute decay
        node.entropy = decayFactor;
        
        // Update node
        this.nodes.set(id, node);
      });
    }, 13130); // 13.13 seconds
  }

  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  getNodes(): EntanglementNode[] {
    return Array.from(this.nodes.values());
  }

  getNode(nodeId: string): EntanglementNode | undefined {
    return this.nodes.get(nodeId);
  }

  getVisibleNodes(forNodeId: string): EntanglementNode[] {
    const sourceNode = this.nodes.get(forNodeId);
    if (!sourceNode) return [];

    const visibleNodes: EntanglementNode[] = [];
    
    this.nodes.forEach((targetNode, targetId) => {
      if (targetId === forNodeId) return;
      
      const distance = calculateRyuTakayanagiDistance(sourceNode, targetNode);
      if (distance.visibility !== 'hidden') {
        visibleNodes.push({
          ...targetNode,
          entropy: distance.entanglementEntropy // Replace with visibility score
        });
      }
    });

    return visibleNodes;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const nonLocalArtery = new NonLocalArtery();

// ═══════════════════════════════════════════════════════════════════════════════
// REACT HOOK FOR NON-LOCAL COMMUNICATION
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react';

export function useNonLocalArtery(nodeId: string | null) {
  const [events, setEvents] = useState<ResonanceEvent[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<EntanglementNode[]>([]);

  // Register node and subscribe
  useEffect(() => {
    if (!nodeId) return;

    // Subscribe to resonance events
    const unsubscribe = nonLocalArtery.subscribe(nodeId, (event) => {
      setEvents(prev => [...prev.slice(-50), event]); // Keep last 50 events
    });

    // Update visible nodes periodically
    const interval = setInterval(() => {
      const nodes = nonLocalArtery.getVisibleNodes(nodeId);
      setVisibleNodes(nodes);
    }, 1313); // 1.313 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [nodeId]);

  // Send pulse to the field
  const pulse = useCallback((type: ResonanceEvent['type'], payload: Record<string, unknown>) => {
    if (nodeId) {
      nonLocalArtery.pulse(nodeId, type, payload);
    }
  }, [nodeId]);

  // Update node location
  const updateLocation = useCallback((location: EntanglementNode['location']) => {
    if (nodeId) {
      const node = nonLocalArtery.getNode(nodeId);
      if (node) {
        nonLocalArtery.registerNode({ ...node, location });
      }
    }
  }, [nodeId]);

  return {
    events,
    visibleNodes,
    pulse,
    updateLocation,
    allNodes: nonLocalArtery.getNodes()
  };
}

export default NonLocalArtery;
