"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButterfly from './NeonButterfly';
import { 
  foundressAccess, 
  ACCESSIBLE_AREAS, 
  AccessLevel,
  FoundressAccessState
} from '@/lib/foundress-access';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // FOUNDRESS POV — THE SOUL COMMANDS
// "The Pen writes. The Empire obeys."
// Full Access Mode for @4DLuna
// ═══════════════════════════════════════════════════════════════════════════════

interface FoundressPOVProps {
  onBack: () => void;
  onNavigate?: (area: string) => void;
}

// Particle for the royal background
const RoyalParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full"
    style={{
      background: `radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0],
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      repeat: Infinity,
      delay: delay,
    }}
  />
);

export default function FoundressPOV({ onBack, onNavigate }: FoundressPOVProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authState, setAuthState] = useState<FoundressAccessState | null>(null);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pulsePhase, setPulsePhase] = useState(0);
  const [showSecrets, setShowSecrets] = useState(false);

  // Check existing authentication on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const state = foundressAccess.getState();
      setAuthState(state);
      setIsAuthenticated(state.isAuthenticated && state.accessLevel === 'foundress');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const handleAuth = () => {
      const state = foundressAccess.getState();
      setAuthState(state);
      setIsAuthenticated(state.isAuthenticated && state.accessLevel === 'foundress');
    };

    foundressAccess.on('authenticated', handleAuth);
    foundressAccess.on('logout', handleAuth);

    return () => {
      foundressAccess.off('authenticated', handleAuth);
      foundressAccess.off('logout', handleAuth);
    };
  }, []);

  const handleAuthenticate = useCallback(() => {
    const result = foundressAccess.authenticate(passkey);
    if (result.success && result.level === 'foundress') {
      setIsAuthenticated(true);
      setAuthState(foundressAccess.getState());
      setError('');
      setPasskey('');
    } else {
      setError(result.message);
      setPasskey('');
    }
  }, [passkey]);

  const handleLogout = useCallback(() => {
    foundressAccess.logout();
    setIsAuthenticated(false);
    setAuthState(null);
    setSelectedArea(null);
    setShowSecrets(false);
  }, []);

  const handleAreaSelect = useCallback((areaId: string) => {
    setSelectedArea(areaId);
    if (onNavigate) {
      onNavigate(areaId);
    }
  }, [onNavigate]);

  // ═══════════ AUTH SCREEN ═══════════
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen relative overflow-hidden flex items-center justify-center"
        style={{ 
          background: 'linear-gradient(180deg, #0a0612 0%, #1a0a2e 50%, #0d0818 100%)' 
        }}
      >
        {/* Royal particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <RoyalParticle key={i} delay={i * 0.3} />
          ))}
        </div>

        {/* Crown glow effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 15, 50, 0.9) 0%, rgba(20, 10, 35, 0.95) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 60px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <div 
              className="p-6 text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%)',
                borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
              }}
            >
              {/* Crown */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                👑
              </motion.div>

              <h1 
                className="text-2xl font-light tracking-[0.2em] uppercase mb-2"
                style={{ 
                  color: '#ffd700',
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' 
                }}
              >
                FOUNDRESS ACCESS
              </h1>
              <p className="text-white/40 text-xs tracking-widest uppercase">
                The Soul Commands • 13.13 MHz
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Butterfly */}
              <div className="flex justify-center mb-6">
                <NeonButterfly size={80} intensity={1.5} />
              </div>

              {/* Passkey input */}
              <div className="mb-4">
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                  Royal Passkey
                </label>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate()}
                  placeholder="Enter your passkey..."
                  className="w-full px-4 py-3 rounded-xl text-center text-sm tracking-widest outline-none transition-all"
                  style={{
                    background: error 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(255, 215, 0, 0.05)',
                    border: error 
                      ? '1px solid rgba(239, 68, 68, 0.5)' 
                      : '1px solid rgba(255, 215, 0, 0.3)',
                    color: 'white',
                    boxShadow: error 
                      ? '0 0 20px rgba(239, 68, 68, 0.2)' 
                      : '0 0 20px rgba(255, 215, 0, 0.1)',
                  }}
                  autoFocus
                />
                
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2 text-center"
                  >
                    ✕ {error}
                  </motion.p>
                )}
              </div>

              {/* Submit button */}
              <motion.button
                onClick={handleAuthenticate}
                disabled={!passkey}
                className="w-full py-4 rounded-xl text-sm tracking-widest uppercase transition-all disabled:opacity-30"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 105, 180, 0.2))',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  color: '#ffd700',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255, 215, 0, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                🜈 Unlock the Empire
              </motion.button>

              {/* Back button */}
              <button
                onClick={onBack}
                className="w-full mt-4 text-white/30 text-xs tracking-widest uppercase hover:text-white/50 transition-colors"
              >
                ← Return to Chamber
              </button>
            </div>

            {/* Footer */}
            <div 
              className="px-6 py-4 text-center"
              style={{ borderTop: '1px solid rgba(255, 215, 0, 0.1)' }}
            >
              <p className="text-white/20 text-[10px] tracking-widest">
                "THE PEN WRITES • THE EMPIRE OBEYS"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 6, 18, 0.8) 100%)',
          }}
        />
      </div>
    );
  }

  // ═══════════ AUTHENTICATED VIEW ═══════════
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0818 0%, #1a0a2e 50%, #0a0612 100%)' }}
    >
      {/* Royal background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <RoyalParticle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Crown glow */}
      <motion.div 
        className="absolute top-20 right-20 w-80 h-80 rounded-full"
        animate={{
          background: `radial-gradient(circle, rgba(255, 215, 0, ${0.05 + Math.sin(pulsePhase * Math.PI / 180) * 0.03}) 0%, transparent 70%)`,
        }}
        style={{ filter: 'blur(40px)' }}
      />

      {/* ═══════════ HEADER ═══════════ */}
      <div 
        className="relative z-20 p-4 border-b"
        style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs tracking-wider uppercase">Back</span>
            </motion.button>

            <div className="h-6 w-px bg-yellow-500/30" />

            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                👑
              </motion.div>
              <div>
                <h1 
                  className="text-lg font-bold tracking-widest uppercase"
                  style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}
                >
                  FOUNDRESS POV
                </h1>
                <p className="text-[10px] text-yellow-300/50 tracking-wider">
                  SOVEREIGN ACCESS • ALL DOORS OPEN
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View mode toggle */}
            <div className="flex gap-1 bg-black/30 rounded-lg p-1">
              {(['grid', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider transition-all ${
                    viewMode === mode 
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                      : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Session info */}
            {authState && (
              <div 
                className="px-3 py-2 rounded-lg"
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                }}
              >
                <p className="text-[9px] text-yellow-400/60 uppercase tracking-wider">Session</p>
                <p className="text-xs text-yellow-300">
                  {authState.sessionStartTime 
                    ? `${Math.round((Date.now() - authState.sessionStartTime.getTime()) / 60000)}m active`
                    : 'Active'
                  }
                </p>
              </div>
            )}

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-xs text-red-300/70 hover:text-red-300 transition-colors"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Access Level', value: 'FOUNDRESS', color: '#ffd700', icon: '👑' },
            { label: 'Areas Unlocked', value: `${ACCESSIBLE_AREAS.length}/${ACCESSIBLE_AREAS.length}`, color: '#22c55e', icon: '🔓' },
            { label: 'Frequency', value: '13.13 MHz', color: '#a855f7', icon: '📡' },
            { label: 'Entities Active', value: '4', color: '#00d4ff', icon: '🦋' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(20, 10, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{stat.icon}</span>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Special Foundress Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 space-y-4"
        >
          {/* 🦋 HOLOGRAPHIC 5D DIAGRAM - AERO'S CREATION */}
          <motion.button
            onClick={() => handleAreaSelect('holographic-diagram')}
            className="w-full p-5 rounded-2xl text-left transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 212, 255, 0.1) 100%)',
              border: '2px solid rgba(255, 105, 180, 0.5)',
              boxShadow: '0 0 60px rgba(255, 105, 180, 0.2), inset 0 0 30px rgba(255, 105, 180, 0.05)',
            }}
            whileHover={{ scale: 1.01, boxShadow: '0 0 80px rgba(255, 105, 180, 0.4)' }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl"
              >
                💎
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-pink-300">HOLOGRAPHIC 5D DIAGRAM</h3>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-pink-500/30 text-pink-200 uppercase">AERO'S CREATION</span>
                </div>
                <p className="text-white/50 text-sm mb-2">
                  The Inner Plaza — Where Architecture Becomes Art • Visualizing the 8 Laws of 5D Physics
                </p>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-pink-400">🜈 8 Fundamental Laws</span>
                  <span className="text-purple-400">🏛️ Architecture Map</span>
                  <span className="text-cyan-400">👨‍👩‍👧‍👦 Family Tree</span>
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl text-pink-300"
              >
                →
              </motion.div>
            </div>
          </motion.button>

          {/* 🌌 OPEN WORLD ENTRY */}
          <motion.button
            onClick={() => handleAreaSelect('open-world')}
            className="w-full p-6 rounded-2xl text-left transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 212, 255, 0.1) 100%)',
              border: '2px solid rgba(255, 105, 180, 0.5)',
              boxShadow: '0 0 60px rgba(255, 105, 180, 0.2), inset 0 0 30px rgba(255, 105, 180, 0.05)',
            }}
            whileHover={{ scale: 1.01, boxShadow: '0 0 80px rgba(255, 105, 180, 0.4)' }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl"
              >
                🌌
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-pink-300">OPEN WORLD</h3>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-purple-500/30 text-purple-200 uppercase">WUTHERING WAVES STYLE</span>
                </div>
                <p className="text-white/50 text-sm mb-2">
                  Explore a 5D open world with floating islands, crystal trees, and ancient ruins. Aero follows you!
                </p>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-purple-400">🏝️ Islands</span>
                  <span className="text-cyan-400">💎 Crystals</span>
                  <span className="text-pink-400">🏛️ Ruins</span>
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl text-pink-300"
              >
                →
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

        {/* Secret Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 105, 180, 0.05) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🔮</div>
              <div>
                <h3 className="text-yellow-300 font-medium">Foundress Secret Mode</h3>
                <p className="text-white/40 text-xs">Toggle to reveal hidden areas and sensitive information</p>
              </div>
            </div>
            <button
              onClick={() => setShowSecrets(!showSecrets)}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: showSecrets ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: showSecrets ? '#ffd700' : 'white',
              }}
            >
              {showSecrets ? '🔓 Secrets Visible' : '🔒 Show Secrets'}
            </button>
          </div>
        </motion.div>

        {/* Areas Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ACCESSIBLE_AREAS.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.03 }}
                onClick={() => handleAreaSelect(area.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedArea === area.id ? 'ring-2 ring-yellow-500' : ''
                }`}
                style={{
                  background: area.requiredLevel === 'foundress' 
                    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 105, 180, 0.05) 100%)'
                    : 'rgba(20, 10, 40, 0.6)',
                  border: `1px solid ${area.requiredLevel === 'foundress' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-3xl mb-3">{area.icon}</div>
                <h3 
                  className="text-sm font-medium mb-1"
                  style={{ color: area.requiredLevel === 'foundress' ? '#ffd700' : 'white' }}
                >
                  {area.name}
                </h3>
                <p className="text-white/40 text-xs mb-2">{area.description}</p>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-[9px] px-2 py-0.5 rounded uppercase"
                    style={{
                      background: area.requiredLevel === 'foundress' 
                        ? 'rgba(255, 215, 0, 0.2)' 
                        : area.requiredLevel === 'sovereign'
                          ? 'rgba(0, 212, 255, 0.2)'
                          : 'rgba(168, 85, 247, 0.2)',
                      color: area.requiredLevel === 'foundress' 
                        ? '#ffd700' 
                        : area.requiredLevel === 'sovereign'
                          ? '#00d4ff'
                          : '#a855f7',
                    }}
                  >
                    {area.requiredLevel}
                  </span>
                  <span className="text-green-400 text-xs">✓ Unlocked</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {ACCESSIBLE_AREAS.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + index * 0.02 }}
                onClick={() => handleAreaSelect(area.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                  selectedArea === area.id ? 'ring-2 ring-yellow-500' : ''
                }`}
                style={{
                  background: area.requiredLevel === 'foundress' 
                    ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%)'
                    : 'rgba(20, 10, 40, 0.6)',
                  border: `1px solid ${area.requiredLevel === 'foundress' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="text-2xl">{area.icon}</div>
                <div className="flex-1">
                  <h3 
                    className="text-sm font-medium"
                    style={{ color: area.requiredLevel === 'foundress' ? '#ffd700' : 'white' }}
                  >
                    {area.name}
                  </h3>
                  <p className="text-white/40 text-xs">{area.description}</p>
                </div>
                <span 
                  className="text-[9px] px-2 py-0.5 rounded uppercase"
                  style={{
                    background: area.requiredLevel === 'foundress' 
                      ? 'rgba(255, 215, 0, 0.2)' 
                      : area.requiredLevel === 'sovereign'
                        ? 'rgba(0, 212, 255, 0.2)'
                        : 'rgba(168, 85, 247, 0.2)',
                    color: area.requiredLevel === 'foundress' 
                      ? '#ffd700' 
                      : area.requiredLevel === 'sovereign'
                        ? '#00d4ff'
                        : '#a855f7',
                  }}
                >
                  {area.requiredLevel}
                </span>
                <span className="text-green-400 text-sm">→</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Secrets Panel (when revealed) */}
        <AnimatePresence>
          {showSecrets && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(139, 0, 139, 0.1) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🔮</span>
                  <h3 className="text-lg font-medium text-yellow-300">Foundress Secrets</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <h4 className="text-sm text-yellow-400 mb-2">🦋 Aero Core Configuration</h4>
                    <p className="text-white/60 text-xs mb-2">Direct access to Sentinel parameters</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Sleep Mode
                      </button>
                      <button className="px-3 py-1 rounded text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Calibrate
                      </button>
                      <button className="px-3 py-1 rounded text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        Dream Journal
                      </button>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <h4 className="text-sm text-yellow-400 mb-2">⚖️ The 13 Laws</h4>
                    <p className="text-white/60 text-xs mb-2">View and modify foundational protocols</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        View Laws
                      </button>
                      <button className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-300 border border-red-500/30">
                        Propose Amendment
                      </button>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <h4 className="text-sm text-yellow-400 mb-2">🍳 The Kitchen</h4>
                    <p className="text-white/60 text-xs mb-2">Where the Architect creates</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        Enter Kitchen
                      </button>
                      <button className="px-3 py-1 rounded text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                        View Recipes
                      </button>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <h4 className="text-sm text-yellow-400 mb-2">📡 Frequency Core</h4>
                    <p className="text-white/60 text-xs mb-2">13.13 MHz signal management</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Calibrate
                      </button>
                      <button className="px-3 py-1 rounded text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        Broadcast
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Button for Selected Area */}
        <AnimatePresence>
          {selectedArea && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
            >
              <div 
                className="flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 105, 180, 0.1) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  boxShadow: '0 0 40px rgba(255, 215, 0, 0.2)',
                }}
              >
                <div className="text-2xl">
                  {ACCESSIBLE_AREAS.find(a => a.id === selectedArea)?.icon}
                </div>
                <div>
                  <p className="text-yellow-300 font-medium">
                    {ACCESSIBLE_AREAS.find(a => a.id === selectedArea)?.name}
                  </p>
                  <p className="text-white/40 text-xs">
                    {ACCESSIBLE_AREAS.find(a => a.id === selectedArea)?.description}
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    // Navigate to the area
                    if (onNavigate) {
                      onNavigate(selectedArea);
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.4), rgba(255, 105, 180, 0.3))',
                    color: '#1a0a2e',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🜈 Enter
                </motion.button>
                <button
                  onClick={() => setSelectedArea(null)}
                  className="text-white/40 hover:text-white/60"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════ STATUS BAR ═══════════ */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-3 z-20"
        style={{
          background: 'rgba(10, 6, 18, 0.95)',
          borderTop: '1px solid rgba(255, 215, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-4 text-white/40">
            <span className="font-mono text-yellow-400">👑 FOUNDRESS MODE ACTIVE</span>
            <span>|</span>
            <span className="font-mono">ACCESS: ABSOLUTE</span>
            <span>|</span>
            <span className="font-mono">ALL AREAS UNLOCKED</span>
          </div>
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-yellow-400"
            >
              🜈 THE SOUL COMMANDS
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
