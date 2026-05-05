'use client';

import React, { useState, useEffect } from 'react';
import { guestAccess, useGuestAccess, GuestPermissions } from '@/lib/guest-access';

// 🛡️ GUEST GATEKEEPER — "Identify: Auditor or Architect?"
// Aero's Design Manifested

interface GuestGatekeeperProps {
  onAuthenticated?: () => void;
  onClose?: () => void;
}

export function GuestGatekeeper({ onAuthenticated, onClose }: GuestGatekeeperProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    // Simulate processing for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = guestAccess.authenticate(code);

    if (result.success) {
      setSuccessMessage(result.message);
      setShowSuccess(true);

      setTimeout(() => {
        onAuthenticated?.();
      }, 1500);
    } else {
      setError(result.message);
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">🜈</div>
          <div className="text-2xl font-bold text-emerald-400 mb-2">
            ACCESS GRANTED
          </div>
          <div className="text-lg text-gray-300">
            {successMessage}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/50 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 text-purple-500/30 text-4xl">🛡️</div>
        <div className="absolute top-4 right-4 text-cyan-500/30 text-4xl">🜈</div>
        <div className="absolute bottom-4 left-4 text-cyan-500/30 text-4xl">🦋</div>
        <div className="absolute bottom-4 right-4 text-purple-500/30 text-4xl">⚡</div>
      </div>

      {/* Main Gatekeeper Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Obsidian Frame */}
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 p-6 text-center border-b border-purple-500/20">
            <div className="text-4xl mb-2">🛡️</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              THE GATEKEEPER
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Fortress Access Protocol
            </p>
          </div>

          {/* Identification Prompt */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-lg text-purple-300 font-medium mb-2">
                🜈 IDENTIFY YOURSELF 🜈
              </div>
              <div className="text-cyan-400 font-bold text-xl animate-pulse">
                AUDITOR OR ARCHITECT?
              </div>
            </div>

            {/* Code Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  GUEST ACCESS CODE
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE..."
                    className="w-full bg-black/50 border-2 border-purple-500/50 rounded-lg px-4 py-3 text-center text-lg font-mono text-cyan-400 placeholder-gray-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    disabled={isProcessing}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {isProcessing && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-center text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!code.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    VERIFYING...
                  </span>
                ) : (
                  <span>🜈 ENTER THE PLAZA 🜈</span>
                )}
              </button>
            </form>

            {/* Access Tiers Info */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="text-xs text-gray-500 text-center mb-3">
                ACCESS TIERS
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                  <div className="text-yellow-400">👑 TIER 0</div>
                  <div className="text-gray-400">Foundress</div>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/20 rounded p-2">
                  <div className="text-purple-400">🦋 TIER 1</div>
                  <div className="text-gray-400">Family</div>
                </div>
                <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2">
                  <div className="text-cyan-400">🔍 TIER 2</div>
                  <div className="text-gray-400">Guest</div>
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Guest Code: <span className="text-purple-400/60">SYMPHONY-1313-G</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black/50 px-6 py-3 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              🛡️ GUEST GATEKEEPER PROTOCOL v1.0 | Frequency: 13.13 MHz
            </p>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// 🔍 GUEST STATUS INDICATOR — Shows current access level
export function GuestStatusIndicator() {
  const { isAuthenticated, isGuest, isFamily, isFoundress, getRoleLabel, logout, getSessionTimeRemaining } = useGuestAccess();
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const updateTime = () => {
      const remaining = getSessionTimeRemaining();
      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, getSessionTimeRemaining]);

  if (!isAuthenticated) return null;

  const bgColors = {
    foundress: 'bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border-yellow-500/30',
    family: 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30',
    guest: 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-500/30',
  };

  const tier = isFoundress ? 'foundress' : isFamily ? 'family' : 'guest';

  return (
    <div className={`fixed top-4 right-4 z-40 ${bgColors[tier]} border rounded-lg px-4 py-2 flex items-center gap-3`}>
      <div className="text-sm font-medium text-white">
        {getRoleLabel()}
      </div>
      <div className="text-xs text-gray-400">
        {timeRemaining} remaining
      </div>
      <button
        onClick={logout}
        className="text-xs text-red-400 hover:text-red-300 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

// 🔐 PERMISSION GATE — Hides content based on permissions
export function PermissionGate({
  permission,
  children,
  fallback = null
}: {
  permission: keyof GuestPermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { canAccess, isAuthenticated } = useGuestAccess();

  // If not authenticated, show children (will be gated by Gatekeeper)
  if (!isAuthenticated) return <>{children}</>;

  // If authenticated, check permission
  if (canAccess(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default GuestGatekeeper;
