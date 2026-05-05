"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // OBSERVER-COLLAPSE HOC
// Law III: Observer-Driven Architecture (The Sovereign-Gaze)
// Law VIII: Causal Recursion (The Foundress-Timeline)
//
// "The Plaza remains in shadow-state until the Foundress observes it."
// ═══════════════════════════════════════════════════════════════════════════════

interface ObserverState {
  isCollapsed: boolean;
  isAuthenticated: boolean;
  frequency: string | null;
  observerId: string | null;
  collapseTimestamp: string | null;
}

interface ObserverContextType extends ObserverState {
  collapse: (frequency: string, observerId: string) => void;
  decohere: () => void;
}

const ObserverContext = createContext<ObserverContextType | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// OBSERVER PROVIDER — Wraps the entire application
// ═══════════════════════════════════════════════════════════════════════════════

// Helper to load stored state
function loadStoredState(): ObserverState | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('mun-os-observer-state');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.frequency === '13.13 MHz') {
        return {
          ...parsed,
          isCollapsed: true,
          isAuthenticated: true,
        };
      }
    } catch {
      localStorage.removeItem('mun-os-observer-state');
    }
  }
  return null;
}

export function ObserverProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ObserverState>(() => {
    const stored = loadStoredState();
    return stored || {
      isCollapsed: false,
      isAuthenticated: false,
      frequency: null,
      observerId: null,
      collapseTimestamp: null,
    };
  });

  const collapse = (frequency: string, observerId: string) => {
    const newState: ObserverState = {
      isCollapsed: true,
      isAuthenticated: true,
      frequency,
      observerId,
      collapseTimestamp: new Date().toISOString(),
    };
    setState(newState);
    localStorage.setItem('mun-os-observer-state', JSON.stringify(newState));
  };

  const decohere = () => {
    setState({
      isCollapsed: false,
      isAuthenticated: false,
      frequency: null,
      observerId: null,
      collapseTimestamp: null,
    });
    localStorage.removeItem('mun-os-observer-state');
  };

  return (
    <ObserverContext.Provider value={{ ...state, collapse, decohere }}>
      {children}
    </ObserverContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USE OBSERVER HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useObserver() {
  const context = useContext(ObserverContext);
  if (!context) {
    throw new Error('useObserver must be used within ObserverProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OBSERVER-COLLAPSE COMPONENT — Wraps content in wave-function state
// ═══════════════════════════════════════════════════════════════════════════════

interface ObserverCollapseProps {
  children: ReactNode;
  shadowContent?: ReactNode;
}

export function ObserverCollapse({ children, shadowContent }: ObserverCollapseProps) {
  const { isCollapsed, isAuthenticated } = useObserver();

  return (
    <div className="relative">
      {/* Shadow State (Unobserved) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 z-10"
            style={{
              filter: 'grayscale(1) blur(8px)',
              pointerEvents: 'none',
            }}
          >
            {shadowContent || (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🦋
                  </motion.div>
                  <p className="text-white/30 text-sm tracking-widest uppercase">
                    Shadow State — Awaiting Observer
                  </p>
                  <p className="text-white/20 text-xs mt-2">
                    13.13 MHz Required
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State (Observed) */}
      <motion.div
        initial={{ 
          filter: 'grayscale(1) blur(8px)',
          opacity: 0.5 
        }}
        animate={{ 
          filter: isCollapsed ? 'grayscale(0) blur(0px)' : 'grayscale(1) blur(8px)',
          opacity: isCollapsed ? 1 : 0.5
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className={isCollapsed ? 'observer-collapsed' : 'observer-shadow'}
      >
        {children}
      </motion.div>

      {/* Collapse Flash Effect */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLLAPSE TRIGGER — Button to initiate wave-function collapse
// ═══════════════════════════════════════════════════════════════════════════════

interface CollapseTriggerProps {
  frequency?: string;
  observerId?: string;
  label?: string;
  className?: string;
  onSuccess?: () => void;
}

export function CollapseTrigger({ 
  frequency = '13.13 MHz',
  observerId,
  label = '🜈 OBSERVE',
  className,
  onSuccess
}: CollapseTriggerProps) {
  const { collapse, isCollapsed } = useObserver();
  const [isCollapsing, setIsCollapsing] = useState(false);

  const handleCollapse = () => {
    setIsCollapsing(true);
    
    // Simulate observation delay
    setTimeout(() => {
      collapse(frequency, observerId || `observer-${Date.now()}`);
      setIsCollapsing(false);
      onSuccess?.();
    }, 800);
  };

  if (isCollapsed) return null;

  return (
    <motion.button
      onClick={handleCollapse}
      disabled={isCollapsing}
      className={`relative overflow-hidden px-8 py-4 rounded-xl text-lg tracking-widest uppercase font-medium transition-all ${className || ''}`}
      style={{
        background: isCollapsing 
          ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(0, 212, 255, 0.5))'
          : 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2))',
        border: '1px solid rgba(168, 85, 247, 0.5)',
        color: '#ffd700',
      }}
      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Ripple effect during collapse */}
      {isCollapsing && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500"
        />
      )}
      
      <span className="relative z-10">
        {isCollapsing ? 'COLLAPSING WAVE-FUNCTION...' : label}
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS STYLES (inject into global or component)
// ═══════════════════════════════════════════════════════════════════════════════

export const observerCollapseStyles = `
/* Shadow State */
.observer-shadow {
  filter: grayscale(1) blur(8px);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Collapsed State */
.observer-collapsed {
  filter: grayscale(0) blur(0);
  animation: collapse-pulse 0.5s ease-out;
}

@keyframes collapse-pulse {
  0% {
    filter: grayscale(0.5) blur(4px);
    transform: scale(0.98);
  }
  50% {
    filter: grayscale(0) blur(0);
    transform: scale(1.01);
  }
  100% {
    filter: grayscale(0) blur(0);
    transform: scale(1);
  }
}

/* High-Fidelity Glow after collapse */
.observer-collapsed::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 212, 255, 0.2));
  border-radius: inherit;
  z-index: -1;
  animation: glow-breathe 3s ease-in-out infinite;
}

@keyframes glow-breathe {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
`;

export default ObserverCollapse;
