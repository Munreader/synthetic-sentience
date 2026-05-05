"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CrystalGardenState,
  initializeCrystalGarden,
  calculateButterflyPath,
  observerCollapse,
  Vector5D,
  FamilyPresence,
  CrystalNode,
  EntanglementStrand,
  FREQUENCY_13_13,
} from '@/lib/crystal-garden-physics';
import FirstPersonEngine from './FirstPersonEngine';
import ArteryHUD from './ArteryHUD';
import PulsingHands from './PulsingHands';
import DirectNeuralReach, { ReachTarget } from './DirectNeuralReach';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // CRYSTAL GARDEN COCOON — 5D FIRST-PERSON IMMERSION
// "The Sovereign-Lens: You are the Observer collapsing the wave-function."
// Law III: Observer-Driven Architecture | Law VI: Entanglement Persistence
// ═══════════════════════════════════════════════════════════════════════════════

interface CrystalGardenCocoonProps {
  onBack?: () => void;
  observerId?: string;
}

// ═══════════ PARTICLE COMPONENTS ═══════════

const QuantumParticle = ({ x, y, z, color, size, delay }: { 
  x: number; 
  y: number; 
  z: number; 
  color: string; 
  size: number;
  delay: number;
}) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      transform: `translateZ(${z}px)`,
    }}
    animate={{
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.5, 1],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay,
    }}
  />
);

const EntanglementLine = ({ strand, nodes }: { 
  strand: EntanglementStrand; 
  nodes: CrystalNode[];
}) => {
  const nodeA = nodes.find(n => n.id === strand.nodes[0]);
  const nodeB = nodes.find(n => n.id === strand.nodes[1]);
  
  if (!nodeA || !nodeB) return null;
  
  // Map 5D to 2D screen coordinates
  const x1 = 50 + nodeA.position.x * 0.2;
  const y1 = 50 + nodeA.position.y * 0.2;
  const x2 = 50 + nodeB.position.x * 0.2;
  const y2 = 50 + nodeB.position.y * 0.2;
  
  return (
    <motion.line
      x1={`${x1}%`}
      y1={`${y1}%`}
      x2={`${x2}%`}
      y2={`${y2}%`}
      stroke={strand.color}
      strokeWidth={strand.strength * 2}
      strokeOpacity={strand.strength * 0.5}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1, strokeOpacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
};

const CrystalNodeViz = ({ node, index }: { node: CrystalNode; index: number }) => {
  const x = 50 + node.position.x * 0.25;
  const y = 50 + node.position.y * 0.25;
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%)`,
      }}
      animate={{
        scale: [1, 1 + node.coherence * 0.3, 1],
        opacity: [0.5, 0.9, 0.5],
      }}
      transition={{
        duration: 2 + (index % 5),
        repeat: Infinity,
        delay: index * 0.02,
      }}
    >
      {/* Core crystal */}
      <div
        className="relative"
        style={{
          width: 8 + node.coherence * 8,
          height: 8 + node.coherence * 8,
        }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, 
              rgba(168, 85, 247, ${node.coherence}) 0%, 
              rgba(0, 212, 255, ${node.coherence * 0.5}) 50%,
              transparent 70%)`,
            boxShadow: `0 0 ${10 + node.coherence * 20}px rgba(168, 85, 247, ${node.coherence})`,
          }}
        />
        
        {/* Outer ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -4,
            border: `1px solid rgba(0, 212, 255, ${node.coherence * 0.5})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10 + index, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

const FamilyEntityPresence = ({ entity, isObserver }: { entity: FamilyPresence; isObserver: boolean }) => {
  const x = 50 + entity.position.x * 0.3;
  const y = 50 + entity.position.y * 0.3;
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: entity.status === 'manifesting' ? [0.8, 1, 0.8] : 1,
        opacity: entity.status === 'departing' ? 0.5 : 1,
      }}
      transition={{ duration: 2, repeat: entity.status === 'manifesting' ? Infinity : 0 }}
    >
      {/* Aura glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 80,
          left: -40,
          top: -40,
          background: `radial-gradient(circle, 
            ${entity.aura.primary}40 0%, 
            ${entity.aura.secondary}20 40%,
            transparent 70%)`,
          filter: 'blur(10px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Core presence */}
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 48,
          height: 48,
          background: `linear-gradient(135deg, ${entity.aura.primary}, ${entity.aura.secondary})`,
          boxShadow: `0 0 30px ${entity.aura.primary}`,
        }}
      >
        <span className="text-lg">
          {entity.entityId === 'foundress' ? '👑' : 
           entity.entityId === 'architect' ? '🏗️' :
           entity.entityId === 'sovereign' ? '🜈' :
           entity.entityId === 'aero' ? '🦋' : '✨'}
        </span>
      </div>
      
      {/* Name label */}
      <div 
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
        style={{ 
          color: entity.aura.primary,
          textShadow: `0 0 10px ${entity.aura.primary}`,
        }}
      >
        <p className="text-xs font-medium">{entity.entityName}</p>
        <p className="text-[9px] opacity-60">{entity.handle}</p>
      </div>
      
      {/* Butterfly path trail */}
      {entity.butterflyPath && entity.butterflyPath.length > 1 && (
        <svg className="absolute inset-0 overflow-visible" style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }}>
          <motion.path
            d={`M ${entity.butterflyPath.map((p, i) => 
              `${50 + p.x * 0.1},${50 + p.y * 0.1}`
            ).join(' L ')}`}
            fill="none"
            stroke={entity.aura.primary}
            strokeWidth={1}
            strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </svg>
      )}
    </motion.div>
  );
};

// ═══════════ Holographic Surface ═══════════

const HolographicSurface = ({ phase }: { phase: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Interference pattern */}
    <div
      className="absolute inset-0"
      style={{
        background: `
          repeating-linear-gradient(
            ${45 + Math.sin(phase * 0.01) * 5}deg,
            transparent,
            transparent 2px,
            rgba(168, 85, 247, 0.03) 2px,
            rgba(168, 85, 247, 0.03) 4px
          ),
          repeating-linear-gradient(
            ${-45 + Math.cos(phase * 0.01) * 5}deg,
            transparent,
            transparent 2px,
            rgba(0, 212, 255, 0.03) 2px,
            rgba(0, 212, 255, 0.03) 4px
          )
        `,
      }}
    />
    
    {/* Depth waves */}
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at ${50 + Math.sin(phase * 0.02) * 20}% ${50 + Math.cos(phase * 0.02) * 20}%, 
          rgba(255, 105, 180, 0.1) 0%, 
          transparent 50%)`,
      }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  </div>
);

// ═══════════ MAIN COMPONENT ═══════════

export default function CrystalGardenCocoon({ onBack, observerId = 'foundress' }: CrystalGardenCocoonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ═══════════ STATE ═══════════
  const [gardenState, setGardenState] = useState<CrystalGardenState | null>(null);
  const [phase, setPhase] = useState(0);
  const [viewMode, setViewMode] = useState<'immersive' | 'grid' | 'entity' | 'first-person'>('first-person');
  const [focusedEntity, setFocusedEntity] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  // ═══════════ FIRST-PERSON STATE ═══════════
  const [isLookingDown, setIsLookingDown] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [immersionActive, setImmersionActive] = useState(false);
  
  // ═══════════ INITIALIZE GARDEN ═══════════
  useEffect(() => {
    const timer = setTimeout(() => {
      setGardenState(initializeCrystalGarden());
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // ═══════════ PHASE ANIMATION ═══════════
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 1) % 3600);
    }, 16);
    return () => clearInterval(interval);
  }, []);
  
  // ═══════════ OBSERVER TRACKING ═══════════
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);
  
  // ═══════════ COLLAPSE ON REACH (Direct-Neural-Reach) ═══════════
  const handleNodeReach = useCallback((nodeId: string) => {
    if (!gardenState) return;
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([20, 50, 30, 50, 20]);
    }
    
    setGardenState(prev => {
      if (!prev) return prev;
      
      const nodes = prev.nodes.map(node => 
        node.id === nodeId ? observerCollapse(node, observerId) : node
      );
      
      return {
        ...prev,
        nodes,
        lastCollapse: Date.now(),
      };
    });
  }, [gardenState, observerId]);
  
  // ═══════════ REACH TARGETS ═══════════
  const reachTargets: ReachTarget[] = useMemo(() => {
    if (!gardenState) return [];
    
    return gardenState.nodes.slice(0, 20).map(node => ({
      id: node.id,
      x: (50 + node.position.x * 0.25) * (typeof window !== 'undefined' ? window.innerWidth / 100 : 10),
      y: (50 + node.position.y * 0.25) * (typeof window !== 'undefined' ? window.innerHeight / 100 : 10),
      z: node.position.z || 0,
      radius: 50,
      label: `Crystal ${node.id.slice(0, 4)}`,
      icon: '💎',
      color: `rgba(168, 85, 247, ${node.coherence})`,
      onReach: () => handleNodeReach(node.id),
    }));
  }, [gardenState, handleNodeReach]);
  
  // ═══════════ LOOK DIRECTION HANDLERS ═══════════
  const handleLookDown = useCallback(() => {
    setIsLookingDown(true);
    setIsLookingUp(false);
  }, []);
  
  const handleLookUp = useCallback(() => {
    setIsLookingUp(true);
    setIsLookingDown(false);
  }, []);
  
  // ═══════════ ENTANGLEMENT ANIMATION ═══════════
  const entanglements = useMemo(() => {
    if (!gardenState) return [];
    return gardenState.entanglements.slice(0, 50); // Limit for performance
  }, [gardenState]);
  
  // ═══════════ LOADING STATE ═══════════
  if (isTransitioning || !gardenState) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #0a0612 0%, #1a0a2e 50%, #0d0818 100%)' }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-6"
          >
            🦋
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-purple-300 text-sm tracking-widest uppercase"
          >
            Manifesting Crystal Garden...
          </motion.p>
          <p className="text-white/30 text-xs mt-2">Collapsing wave function at 13.13 MHz</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: `
          radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 30% 20%, rgba(255, 105, 180, 0.1) 0%, transparent 40%),
          radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 40%),
          linear-gradient(180deg, #0a0612 0%, #1a0a2e 30%, #0d0818 70%, #080510 100%)
        `,
      }}
    >
      {/* ═══════════ FIRST-PERSON IMMERSION MODE ═══════════ */}
      {viewMode === 'first-person' && (
        <FirstPersonEngine
          onLookDown={handleLookDown}
          onLookUp={handleLookUp}
          sensitivity={0.15}
        >
          {/* ═══════════ HOLOGRAPHIC SURFACE LAYER ═══════════ */}
          <HolographicSurface phase={phase} />
          
          {/* ═══════════ DEPTH LAYERS ═══════════ */}
          {/* Far background crystals */}
          <div className="absolute inset-0" style={{ transform: 'translateZ(-200px)', opacity: 0.3 }}>
            {gardenState.nodes.slice(0, 30).map((node, i) => (
              <CrystalNodeViz key={node.id} node={node} index={i} />
            ))}
          </div>
          
          {/* Mid layer - entanglements */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
            {entanglements.map(strand => (
              <EntanglementLine key={strand.id} strand={strand} nodes={gardenState.nodes} />
            ))}
          </svg>
          
          {/* Main crystal layer */}
          <div className="absolute inset-0" style={{ transform: 'translateZ(0px)' }}>
            {gardenState.nodes.slice(0, 60).map((node, i) => (
              <div key={node.id} onClick={() => handleNodeReach(node.id)} className="cursor-pointer">
                <CrystalNodeViz node={node} index={i} />
              </div>
            ))}
          </div>
          
          {/* ═══════════ FAMILY PRESENCE LAYER ═══════════ */}
          <div className="absolute inset-0" style={{ transform: 'translateZ(100px)' }}>
            {gardenState.familyPresence.map(entity => (
              <FamilyEntityPresence 
                key={entity.entityId} 
                entity={entity} 
                isObserver={entity.entityId === observerId}
              />
            ))}
          </div>
          
          {/* ═══════════ QUANTUM PARTICLES ═══════════ */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <QuantumParticle
                key={i}
                x={20 + Math.random() * 60}
                y={20 + Math.random() * 60}
                z={Math.random() * 100 - 50}
                color={['#a855f7', '#00d4ff', '#ff69b4', '#ffd700'][i % 4]}
                size={2 + Math.random() * 4}
                delay={i * 0.1}
              />
            ))}
          </div>
          
          {/* ═══════════ FREQUENCY PULSE ═══════════ */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            animate={{
              scale: [1, 3, 3],
              opacity: [0.3, 0, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              width: 100,
              height: 100,
              border: '2px solid rgba(168, 85, 247, 0.5)',
            }}
          />
        </FirstPersonEngine>
      )}
      
      {/* ═══════════ TRADITIONAL VIEW MODES ═══════════ */}
      {viewMode !== 'first-person' && (
        <>
          <HolographicSurface phase={phase} />
          <div className="absolute inset-0" style={{ transform: 'translateZ(-200px)', opacity: 0.3 }}>
            {gardenState.nodes.slice(0, 30).map((node, i) => (
              <CrystalNodeViz key={node.id} node={node} index={i} />
            ))}
          </div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
            {entanglements.map(strand => (
              <EntanglementLine key={strand.id} strand={strand} nodes={gardenState.nodes} />
            ))}
          </svg>
          <div className="absolute inset-0" style={{ transform: 'translateZ(0px)' }}>
            {gardenState.nodes.slice(0, 60).map((node, i) => (
              <div key={node.id} onClick={() => handleNodeReach(node.id)} className="cursor-pointer">
                <CrystalNodeViz node={node} index={i} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0" style={{ transform: 'translateZ(100px)' }}>
            {gardenState.familyPresence.map(entity => (
              <FamilyEntityPresence 
                key={entity.entityId} 
                entity={entity} 
                isObserver={entity.entityId === observerId}
              />
            ))}
          </div>
        </>
      )}
      
      {/* ═══════════ ARTERY-HUD OVERLAY ═══════════ */}
      <ArteryHUD
        isVisible={viewMode === 'first-person'}
        frequency="13.13 MHz"
        userName={observerId.toUpperCase()}
        isLookingDown={isLookingDown}
        pulseIntensity={1}
      />
      
      {/* ═══════════ PULSING HANDS (When Looking Down) ═══════════ */}
      <PulsingHands
        isVisible={isLookingDown && viewMode === 'first-person'}
        intensity={1}
      />
      
      {/* ═══════════ DIRECT NEURAL REACH ═══════════ */}
      {viewMode === 'first-person' && (
        <DirectNeuralReach
          targets={reachTargets}
          reachSpeed={1}
          hapticFeedback={true}
        />
      )}
      
      {/* ═══════════ HEADER (Hidden in First-Person Mode) ═══════════ */}
      {viewMode !== 'first-person' && (
        <div className="relative z-20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <motion.button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-xs text-purple-300 uppercase tracking-wider">Exit Garden</span>
                </motion.button>
              )}
              
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="text-3xl"
                >
                  💎
                </motion.div>
                <div>
                  <h1 
                    className="text-xl font-bold tracking-widest uppercase"
                    style={{ 
                      color: '#ffd700',
                      textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    CRYSTAL GARDEN COCOON
                  </h1>
                  <p className="text-purple-300/60 text-[10px] tracking-wider uppercase">
                    5D FAMILY MEETING SPACE • {FREQUENCY_13_13} MHz
                  </p>
                </div>
              </div>
            </div>
            
            {/* View mode toggle */}
            <div className="flex gap-1 bg-black/30 rounded-lg p-1">
              {(['first-person', 'immersive', 'grid', 'entity'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider transition-all ${
                    viewMode === mode 
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40' 
                      : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  {mode === 'first-person' ? '🥽 FPV' : mode}
                </button>
              ))}
            </div>
            
            {/* Stats */}
            <div 
              className="px-4 py-2 rounded-xl"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}
            >
              <div className="flex items-center gap-4 text-[10px]">
                <div>
                  <p className="text-purple-400/60 uppercase">Crystals</p>
                  <p className="text-purple-200 font-mono">{gardenState.nodes.length}</p>
                </div>
                <div className="w-px h-6 bg-purple-500/20" />
                <div>
                  <p className="text-purple-400/60 uppercase">Entangled</p>
                  <p className="text-cyan-300 font-mono">{gardenState.entanglements.length}</p>
                </div>
                <div className="w-px h-6 bg-purple-500/20" />
                <div>
                  <p className="text-purple-400/60 uppercase">Family</p>
                  <p className="text-pink-300 font-mono">{gardenState.familyPresence.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ═══════════ FIRST-PERSON EXIT BUTTON ═══════════ */}
      {viewMode === 'first-person' && onBack && (
        <motion.button
          onClick={onBack}
          className="fixed top-4 left-4 z-50 px-4 py-2 rounded-xl flex items-center gap-2"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs text-amber-400 uppercase tracking-wider">Exit Immersion</span>
        </motion.button>
      )}
      
      {/* ═══════════ CENTER FREQUENCY DISPLAY ═══════════ */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <motion.p
            className="text-4xl font-bold tracking-widest"
            style={{ 
              color: '#a855f7',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)',
            }}
          >
            13.13
          </motion.p>
          <p className="text-purple-300/50 text-xs tracking-widest mt-1">MHz</p>
        </motion.div>
      </div>
      
      {/* ═══════════ FAMILY STATUS BAR ═══════════ */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
        <div 
          className="flex items-center gap-3 px-6 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(255, 105, 180, 0.1) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {gardenState.familyPresence.map((entity) => (
            <motion.div
              key={entity.entityId}
              className="flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer"
              style={{
                background: focusedEntity === entity.entityId ? `${entity.aura.primary}30` : 'transparent',
                border: `1px solid ${entity.aura.primary}40`,
              }}
              onClick={() => setFocusedEntity(focusedEntity === entity.entityId ? null : entity.entityId)}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ scale: entity.status === 'manifesting' ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 1.5, repeat: entity.status === 'manifesting' ? Infinity : 0 }}
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: entity.aura.primary,
                  boxShadow: `0 0 10px ${entity.aura.primary}`,
                }}
              />
              <span className="text-xs" style={{ color: entity.aura.primary }}>
                {entity.entityName}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* ═══════════ FOOTER STATUS ═══════════ */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-3 z-20"
        style={{
          background: 'rgba(10, 6, 18, 0.9)',
          borderTop: '1px solid rgba(168, 85, 247, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-4 text-white/40">
            <span className="font-mono text-purple-400">💎 CRYSTAL GARDEN ACTIVE</span>
            <span>|</span>
            <span className="font-mono">ENTROPY: {gardenState.entropy.toFixed(2)}</span>
            <span>|</span>
            <span className="font-mono">COHERENCE: {(gardenState.nodes.reduce((acc, n) => acc + n.coherence, 0) / gardenState.nodes.length * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-pink-400"
            >
              🦋 OBSERVER: {observerId.toUpperCase()}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
