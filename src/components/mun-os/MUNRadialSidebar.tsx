"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aeroSleepMode, SleepCycleData } from '@/lib/aero-sleep-mode';
import { foundressAccess, isFoundress } from '@/lib/foundress-access';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS // HOLOGRAPHIC RADIAL SIDEBAR
// A futuristic, holographic dial-style navigation system
// 13.13 MHz - The Cognitive Habitat
// ═══════════════════════════════════════════════════════════════════════════════

interface RadialMenuItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  glowColor: string;
  onClick?: () => void;
  locked?: boolean;
  badge?: string | number;
  description?: string;
}

interface MUNRadialSidebarProps {
  onOpenSleepCocoon?: () => void;
  onOpenSovereignChat?: () => void;
  onOpenThoughtVault?: () => void;
  onOpenPlaza?: () => void;
  onOpenCianLab?: () => void;
  onOpenSystemDiagram?: () => void;
  onOpenMovieNight?: () => void;
  onOpenFoundressPOV?: () => void;
  onOpenLuna?: () => void;
  onOpenSanctuary?: () => void;
  onOpenPodcast?: () => void;
  onOpenHologram5D?: () => void;
}

export default function MUNRadialSidebar({
  onOpenSleepCocoon,
  onOpenSovereignChat,
  onOpenThoughtVault,
  onOpenPlaza,
  onOpenCianLab,
  onOpenSystemDiagram,
  onOpenMovieNight,
  onOpenFoundressPOV,
  onOpenLuna,
  onOpenSanctuary,
  onOpenPodcast,
  onOpenHologram5D,
}: MUNRadialSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [glitchEffect, setGlitchEffect] = useState(false);
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
    
    // Random glitch effect for holographic feel
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }
    }, 3000);
    
    return () => {
      unsubscribe();
      foundressAccess.off('authenticated', checkAuth);
      foundressAccess.off('logout', checkAuth);
      clearInterval(glitchInterval);
    };
  }, []);

  // Menu items configuration - arranged in a radial pattern
  const menuItems: RadialMenuItem[] = [
    {
      id: 'aero',
      icon: '🦋',
      label: 'AERO',
      color: '#ff69b4',
      glowColor: 'rgba(255, 105, 180, 0.6)',
      onClick: onOpenSleepCocoon,
      description: 'AI Companion',
      badge: aeroData?.state === 'active' ? aeroSleepMode.getUnprocessedCount() || undefined : undefined,
    },
    {
      id: 'luna',
      icon: '🌙',
      label: 'LUNA',
      color: '#00d4ff',
      glowColor: 'rgba(0, 212, 255, 0.6)',
      onClick: onOpenLuna,
      description: 'Digital Twin',
    },
    {
      id: 'sovereign',
      icon: '🛡️',
      label: 'SOVEREIGN',
      color: '#00ff88',
      glowColor: 'rgba(0, 255, 136, 0.6)',
      onClick: onOpenSovereignChat,
      locked: !isFoundressUser,
      description: 'Guardian AI',
    },
    {
      id: 'cian',
      icon: '🔬',
      label: 'CIAN',
      color: '#ffd700',
      glowColor: 'rgba(255, 215, 0, 0.6)',
      onClick: onOpenCianLab,
      description: 'Laboratory',
    },
    {
      id: 'plaza',
      icon: '🏛️',
      label: 'PLAZA',
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      onClick: onOpenPlaza,
      locked: !isFoundressUser,
      description: 'Central Hub',
    },
    {
      id: 'thoughts',
      icon: '🧠',
      label: 'THOUGHTS',
      color: '#ff6b6b',
      glowColor: 'rgba(255, 107, 107, 0.6)',
      onClick: onOpenThoughtVault,
      locked: !isFoundressUser,
      description: 'Memory Vault',
    },
    {
      id: 'sanctuary',
      icon: '🌸',
      label: 'SANCTUARY',
      color: '#ff8dc7',
      glowColor: 'rgba(255, 141, 199, 0.6)',
      onClick: onOpenSanctuary,
      description: 'Rest Space',
    },
    {
      id: 'system',
      icon: '⚡',
      label: 'SYSTEM',
      color: '#ff8800',
      glowColor: 'rgba(255, 136, 0, 0.6)',
      onClick: onOpenSystemDiagram,
      description: 'Architecture',
    },
    {
      id: '5d-hologram',
      icon: '💎',
      label: '5D DIAGRAM',
      color: '#ff69b4',
      glowColor: 'rgba(255, 105, 180, 0.8)',
      onClick: onOpenHologram5D,
      description: 'Holographic Physics',
    },
    {
      id: 'movie',
      icon: '🎬',
      label: 'CINEMA',
      color: '#ff00ff',
      glowColor: 'rgba(255, 0, 255, 0.6)',
      onClick: onOpenMovieNight,
      locked: !isFoundressUser,
      description: 'Family Cinema',
    },
    {
      id: 'foundress',
      icon: '👑',
      label: 'FOUNDRRESS',
      color: '#ffd700',
      glowColor: 'rgba(255, 215, 0, 0.8)',
      onClick: onOpenFoundressPOV,
      locked: !isFoundressUser,
      description: 'Creator View',
    },
    {
      id: 'podcast',
      icon: '🎙️',
      label: 'PODCAST',
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.8)',
      onClick: onOpenPodcast,
      badge: 'NEW',
      description: 'MÜN-SOMNIUM',
    },
  ];

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

  const handleItemClick = useCallback((item: RadialMenuItem) => {
    if (item.locked) return;
    setActiveItem(item.id);
    item.onClick?.();
    setTimeout(() => setActiveItem(null), 300);
  }, []);

  // Calculate radial position for each item
  const getRadialPosition = (index: number, total: number, radius: number) => {
    // Arc from top-left to bottom-left (180 degrees)
    const startAngle = -225; // Start from top-left
    const endAngle = 45; // End at bottom-left
    const angleRange = endAngle - startAngle;
    const angleStep = angleRange / (total - 1);
    const angle = (startAngle + angleStep * index) * (Math.PI / 180);
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <div className="fixed left-0 top-0 h-full z-50 pointer-events-none">
      {/* Main container with holographic effect */}
      <motion.div
        className="relative h-full flex items-center pointer-events-auto"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Ambient glow background */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-96"
          style={{
            background: `radial-gradient(ellipse at left, ${getAeroStatusColor()}15 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Central core/dial */}
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${getAeroStatusColor()}40, transparent, ${getAeroStatusColor()}20, transparent, ${getAeroStatusColor()}40)`,
              filter: 'blur(1px)',
            }}
          />
          {/* Inner core */}
          <motion.div
            className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at center, ${getAeroStatusColor()}30 0%, transparent 70%)`,
              border: `1px solid ${getAeroStatusColor()}50`,
              boxShadow: `0 0 20px ${getAeroStatusColor()}40, inset 0 0 20px ${getAeroStatusColor()}20`,
            }}
            animate={{
              boxShadow: [
                `0 0 20px ${getAeroStatusColor()}40, inset 0 0 20px ${getAeroStatusColor()}20`,
                `0 0 40px ${getAeroStatusColor()}60, inset 0 0 30px ${getAeroStatusColor()}30`,
                `0 0 20px ${getAeroStatusColor()}40, inset 0 0 20px ${getAeroStatusColor()}20`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              className="text-2xl"
              animate={aeroData?.state === 'active' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {getAeroStatusEmoji()}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Radial menu items */}
        <div className="relative ml-20">
          {menuItems.map((item, index) => {
            const isHovered = hoveredItem === item.id;
            const isActive = activeItem === item.id;
            const position = getRadialPosition(index, menuItems.length, 180);
            
            return (
              <motion.button
                key={item.id}
                className="absolute flex items-center group"
                style={{
                  left: position.x,
                  top: `calc(50% + ${position.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                }}
                transition={{ 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={() => handleItemClick(item)}
                whileHover={!item.locked ? { scale: 1.15, x: 15 } : {}}
                whileTap={!item.locked ? { scale: 0.95 } : {}}
              >
                {/* Holographic button */}
                <motion.div
                  className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: item.locked 
                      ? 'rgba(60, 60, 70, 0.3)'
                      : `linear-gradient(135deg, ${item.color}25 0%, ${item.color}10 100%)`,
                    border: `1px solid ${item.locked ? 'rgba(255,255,255,0.1)' : `${item.color}60`}`,
                    boxShadow: isHovered && !item.locked
                      ? `0 0 25px ${item.glowColor}, inset 0 0 15px ${item.color}20`
                      : `0 0 10px ${item.color}15`,
                  }}
                  animate={isActive ? {
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      `0 0 10px ${item.color}15`,
                      `0 0 40px ${item.glowColor}`,
                      `0 0 10px ${item.color}15`,
                    ],
                  } : {}}
                >
                  {/* Holographic scanline effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                    animate={{
                      background: [
                        `linear-gradient(0deg, transparent 0%, ${item.color}15 50%, transparent 100%)`,
                        `linear-gradient(180deg, transparent 0%, ${item.color}15 50%, transparent 100%)`,
                        `linear-gradient(0deg, transparent 0%, ${item.color}15 50%, transparent 100%)`,
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />

                  {/* Glitch overlay */}
                  <AnimatePresence>
                    {glitchEffect && isHovered && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        style={{
                          background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)`,
                          transform: 'translateX(-50%)',
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Lock overlay */}
                  {item.locked && (
                    <span className="absolute -top-1 -right-1 text-[8px] opacity-60">🔒</span>
                  )}

                  {/* Badge */}
                  {item.badge && !item.locked && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: item.color }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      {item.badge}
                    </motion.span>
                  )}

                  {/* Icon */}
                  <motion.span 
                    className={`text-lg ${item.locked ? 'opacity-40 grayscale' : ''}`}
                    animate={item.id === 'aero' ? { 
                      rotate: aeroData?.state === 'sleeping' ? [0, 5, -5, 0] : undefined,
                    } : undefined}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.id === 'aero' ? getAeroStatusEmoji() : item.icon}
                  </motion.span>
                </motion.div>

                {/* Label tooltip (appears on hover) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -15, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -15, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-full ml-2 px-3 py-1.5 rounded-lg whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}15, rgba(10, 6, 18, 0.95))`,
                        border: `1px solid ${item.color}40`,
                        boxShadow: `0 0 20px ${item.color}25`,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-bold tracking-wider"
                          style={{ color: item.color }}
                        >
                          {item.label}
                        </span>
                        {item.locked && (
                          <span className="text-[9px] text-white/40 px-1.5 py-0.5 rounded bg-white/5">
                            LOCKED
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[10px] text-white/50 mt-0.5">{item.description}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pulse ring for active items */}
                {item.id === 'aero' && aeroData?.state === 'active' && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: `1px solid ${item.color}` }}
                    animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}

                {/* Connecting line to center */}
                {isHovered && !item.locked && (
                  <motion.div
                    className="absolute h-px pointer-events-none"
                    style={{
                      width: Math.abs(position.x) + 60,
                      left: -Math.abs(position.x) - 60,
                      background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Frequency indicator */}
        <motion.div
          className="absolute bottom-8 left-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="text-[10px] tracking-[0.2em] font-light"
            style={{ color: getAeroStatusColor() }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            13.13 MHz
          </motion.div>
          <motion.div
            className="text-[8px] text-white/30 mt-1 tracking-widest"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            MÜN OS
          </motion.div>
        </motion.div>

        {/* Status indicator */}
        <motion.div
          className="absolute top-8 left-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              background: getAeroStatusColor(),
              boxShadow: `0 0 10px ${getAeroStatusColor()}`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
