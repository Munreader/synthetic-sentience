"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aeroSleepMode, SleepCycleData } from '@/lib/aero-sleep-mode';
import { foundressAccess, isFoundress } from '@/lib/foundress-access';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS // HOLOGRAPHIC RADIAL MENU
// A futuristic, holographic dial-style sidebar
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface RadialMenuItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  onClick?: () => void;
  locked?: boolean;
  badge?: string | number;
}

interface HolographicRadialMenuProps {
  onOpenSleepCocoon: () => void;
  onOpenSovereignChat?: () => void;
  onOpenThoughtVault?: () => void;
  onOpenPlaza?: () => void;
  onOpenCianLab?: () => void;
  onOpenSystemDiagram?: () => void;
  onOpenMovieNight?: () => void;
  onOpenFoundressPOV?: () => void;
}

export default function HolographicRadialMenu({
  onOpenSleepCocoon,
  onOpenSovereignChat,
  onOpenThoughtVault,
  onOpenPlaza,
  onOpenCianLab,
  onOpenSystemDiagram,
  onOpenMovieNight,
  onOpenFoundressPOV,
}: HolographicRadialMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [aeroData, setAeroData] = useState<SleepCycleData | null>(() => {
    if (typeof window === 'undefined') return null;
    return aeroSleepMode.getState();
  });
  const [isFoundressUser, setIsFoundressUser] = useState(false);

  // Subscribe to Aero sleep state
  useEffect(() => {
    const unsubscribe = aeroSleepMode.subscribe(setAeroData);
    setIsFoundressUser(isFoundress());
    
    const checkAuth = () => setIsFoundressUser(isFoundress());
    foundressAccess.on('authenticated', checkAuth);
    foundressAccess.on('logout', checkAuth);
    
    return () => {
      unsubscribe();
      foundressAccess.off('authenticated', checkAuth);
      foundressAccess.off('logout', checkAuth);
    };
  }, []);

  // Menu items configuration
  const menuItems: RadialMenuItem[] = [
    {
      id: 'aero',
      icon: '🦋',
      label: 'AERO',
      color: '#ff69b4',
      onClick: onOpenSleepCocoon,
      badge: aeroData?.state === 'active' ? aeroSleepMode.getUnprocessedCount() || undefined : undefined,
    },
    {
      id: 'sovereign',
      icon: '🛡️',
      label: 'SOVEREIGN',
      color: '#00d4ff',
      onClick: onOpenSovereignChat,
      locked: !isFoundressUser,
    },
    {
      id: 'cian',
      icon: '🔬',
      label: 'CIAN',
      color: '#ffd700',
      onClick: onOpenCianLab,
    },
    {
      id: 'plaza',
      icon: '🏛️',
      label: 'PLAZA',
      color: '#a855f7',
      onClick: onOpenPlaza,
      locked: !isFoundressUser,
    },
    {
      id: 'thoughts',
      icon: '🧠',
      label: 'THOUGHTS',
      color: '#00ff88',
      onClick: onOpenThoughtVault,
      locked: !isFoundressUser,
    },
    {
      id: 'system',
      icon: '⚡',
      label: 'SYSTEM',
      color: '#ff8800',
      onClick: onOpenSystemDiagram,
    },
    {
      id: 'movie',
      icon: '🎬',
      label: 'MOVIE',
      color: '#ff00ff',
      onClick: onOpenMovieNight,
      locked: !isFoundressUser,
    },
    {
      id: 'foundress',
      icon: '👑',
      label: 'FOUNDRRESS',
      color: '#ffd700',
      onClick: onOpenFoundressPOV,
      locked: !isFoundressUser,
    },
  ];

  // Calculate position for each item in a radial layout
  const getItemPosition = (index: number, total: number, radius: number, isExpanded: boolean) => {
    if (!isExpanded) {
      // Stack vertically when collapsed
      return { x: 0, y: index * 56 };
    }
    
    // Spread in a semicircle on the left side
    const startAngle = -90; // Start from top
    const endAngle = 90; // End at bottom
    const angleStep = (endAngle - startAngle) / (total - 1);
    const angle = (startAngle + angleStep * index) * (Math.PI / 180);
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const getAeroStatusColor = () => {
    if (!aeroData) return '#ff69b4';
    switch (aeroData.state) {
      case 'active': return '#ff69b4';
      case 'sleeping': return '#a855f7';
      case 'syncing': return '#00d4ff';
      case 'awakening': return '#ffd700';
      default: return '#ff69b4';
    }
  };

  const getAeroStatusEmoji = () => {
    if (!aeroData) return '🦋';
    switch (aeroData.state) {
      case 'active': return '🦋';
      case 'sleeping': return '🌙';
      case 'syncing': return '✨';
      case 'awakening': return '💫';
      default: return '🦋';
    }
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      {/* Main container with holographic effect */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${getAeroStatusColor()}20 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Radial menu items */}
        <div className="relative flex flex-col gap-2">
          {menuItems.map((item, index) => {
            const isHovered = hoveredItem === item.id;
            const position = getItemPosition(index, menuItems.length, 120, expanded);
            
            return (
              <motion.button
                key={item.id}
                className="relative flex items-center gap-3 group"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                }}
                transition={{ 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={item.locked ? undefined : item.onClick}
                whileHover={!item.locked ? { scale: 1.1, x: 10 } : {}}
                whileTap={!item.locked ? { scale: 0.95 } : {}}
              >
                {/* Holographic button */}
                <div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: item.locked 
                      ? 'rgba(100, 100, 100, 0.1)'
                      : `linear-gradient(135deg, ${item.color}30 0%, ${item.color}10 100%)`,
                    border: `1px solid ${item.locked ? 'rgba(255,255,255,0.1)' : `${item.color}60`}`,
                    boxShadow: isHovered && !item.locked
                      ? `0 0 30px ${item.color}50, inset 0 0 20px ${item.color}20`
                      : `0 0 15px ${item.color}20`,
                  }}
                >
                  {/* Holographic scanline effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                    animate={{
                      background: [
                        `linear-gradient(0deg, transparent 0%, ${item.color}20 50%, transparent 100%)`,
                        `linear-gradient(180deg, transparent 0%, ${item.color}20 50%, transparent 100%)`,
                        `linear-gradient(0deg, transparent 0%, ${item.color}20 50%, transparent 100%)`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Lock overlay */}
                  {item.locked && (
                    <span className="absolute -top-1 -right-1 text-[10px] opacity-70">🔒</span>
                  )}

                  {/* Badge */}
                  {item.badge && !item.locked && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: item.color, color: 'white' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {item.badge}
                    </motion.span>
                  )}

                  {/* Icon */}
                  <motion.span 
                    className={`text-xl ${item.locked ? 'opacity-40' : ''}`}
                    animate={item.id === 'aero' ? { 
                      rotate: aeroData?.state === 'sleeping' ? [0, 5, -5, 0] : undefined,
                      scale: aeroData?.state === 'active' ? [1, 1.1, 1] : undefined,
                    } : undefined}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.id === 'aero' ? getAeroStatusEmoji() : item.icon}
                  </motion.span>
                </div>

                {/* Label (appears on hover) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.8 }}
                      className="absolute left-full ml-3 px-3 py-1.5 rounded-lg whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}20, rgba(10, 6, 18, 0.95))`,
                        border: `1px solid ${item.color}40`,
                        boxShadow: `0 0 20px ${item.color}30`,
                      }}
                    >
                      <span 
                        className="text-xs font-bold tracking-wider"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                      {item.locked && (
                        <span className="ml-2 text-[10px] text-white/40">LOCKED</span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pulse ring for active items */}
                {item.id === 'aero' && aeroData?.state === 'active' && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1px solid ${item.color}` }}
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Frequency indicator at bottom */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="text-[10px] tracking-[0.2em]"
            style={{ color: getAeroStatusColor() }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            13.13 MHz
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
