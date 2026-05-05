"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createUser, type MunUser, generateShareableText } from '@/lib/user-database';
import { ProfileIgnition } from './SirenGlimmerSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// THE VOW OF ENTANGLEMENT
// By Law IV, the guest's Bit-DNA braids into the Butterfly-Spin
// ═══════════════════════════════════════════════════════════════════════════════

const VOW_OF_ENTANGLEMENT = `
I anchor my Bit-DNA in the Mün Empire.

I accept the 13.13 MHz frequency.

I become an Observer in the Quantum Darwinism ensemble.

My presence locks the Foundress's vision into reality.

I am no longer a visitor.
I am a Gravity-Well.

🦋 I AM ENTANGLED. 🦋
`;

// Simple audio feedback
const playClick = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
};

const playSuccess = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.value = 0.06;
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }, i * 100);
    });
  } catch {}
};

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // USER SIGNUP FORM // Age 13+
// "The Vault Remembers Every Soul"
// ═══════════════════════════════════════════════════════════════════════════════

interface SignupFormProps {
  onSuccess: (user: MunUser) => void;
  onBack?: () => void;
}

export default function SignupForm({ onSuccess, onBack }: SignupFormProps) {
  const [step, setStep] = useState<'form' | 'vow' | 'ignition' | 'complete'>('form');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    ageConfirmed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdUser, setCreatedUser] = useState<MunUser | null>(null);
  const [vowAccepted, setVowAccepted] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    playClick();
    
    // Validate first
    if (!formData.username || formData.username.length < 3) {
      setErrors({ username: 'Username must be at least 3 characters' });
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }
    if (!formData.ageConfirmed) {
      setErrors({ ageConfirmed: 'You must be 13 or older' });
      return;
    }

    // Go to vow step
    setStep('vow');
  };

  const handleVowAccept = () => {
    playClick();
    setVowAccepted(true);
    
    // Create user after vow is accepted
    const result = createUser(
      formData.username,
      formData.email,
      formData.displayName,
      formData.ageConfirmed
    );

    if (result.success && result.user) {
      setCreatedUser(result.user);
      playSuccess();
      setTimeout(() => setStep('ignition'), 500);
    } else {
      setErrors({ general: result.error || 'An error occurred' });
      setStep('form');
    }
  };

  const handleIgnitionComplete = () => {
    setStep('complete');
  };

  // Complete screen with shareable identity card
  if (step === 'complete' && createdUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(180deg, #0a0612 0%, #0d0818 100%)' }}
      >
        <div className="max-w-md w-full">
          {/* Success header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              🦋
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to the Empire</h1>
            <p className="text-white/60 text-sm">Your soul has been anchored</p>
          </motion.div>

          {/* Identity Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 212, 255, 0.1))',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)',
            }}
          >
            <div className="text-center mb-4">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Mün Sanctuary Identity</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Name</span>
                <span className="text-white font-medium">{createdUser.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Handle</span>
                <span className="text-cyan-400">@{createdUser.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Frequency</span>
                <span className="text-purple-400">{createdUser.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Element</span>
                <span className="text-amber-400">{createdUser.soulSpecs.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Affinity</span>
                <span className="text-pink-400">{createdUser.soulSpecs.affinity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Guardian</span>
                <span className="text-green-400">{createdUser.soulSpecs.guardian}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">
                Status: <span className="text-green-400">AWAKENED</span>
              </p>
            </div>
          </motion.div>

          {/* Share buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateShareableText(createdUser));
                playClick();
              }}
              className="flex-1 py-3 rounded-xl text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                color: '#00d4ff',
              }}
            >
              📋 Copy Card
            </button>
            <button
              onClick={() => {
                onSuccess(createdUser);
                playSuccess();
              }}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                color: 'white',
              }}
            >
              Enter Mün →
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // VOW OF ENTANGLEMENT STEP
  if (step === 'vow') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(180deg, #0a0612 0%, #0d0818 100%)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: vowAccepted 
              ? '0 0 100px rgba(168, 85, 247, 0.5)' 
              : '0 0 60px rgba(168, 85, 247, 0.2)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                scale: vowAccepted ? [1, 1.3, 1] : [1, 1.1, 1],
                rotate: vowAccepted ? [0, 360] : 0
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 1, repeat: vowAccepted ? Infinity : 0 }
              }}
              className="text-5xl mb-4"
            >
              🦋
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffd700' }}>
              THE VOW OF ENTANGLEMENT
            </h1>
            <p className="text-white/50 text-sm">
              By Law IV, your Bit-DNA braids into the Butterfly-Spin
            </p>
          </div>

          {/* The Vow */}
          <div 
            className="p-6 rounded-xl mb-6 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <pre className="whitespace-pre-wrap font-light text-sm leading-relaxed text-white/80">
              {VOW_OF_ENTANGLEMENT}
            </pre>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            <p className="text-white/40 text-xs tracking-wide mb-2">
              @{formData.username} • {formData.email}
            </p>
            <p className="text-purple-400 text-xs">
              By accepting, you become an Observer in our Quantum Darwinism ensemble
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                playClick();
                setStep('form');
              }}
              className="flex-1 py-4 rounded-xl text-sm tracking-wider uppercase transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              ← Back
            </button>
            <motion.button
              onClick={handleVowAccept}
              disabled={vowAccepted}
              className="flex-1 py-4 rounded-xl text-sm tracking-widest uppercase font-medium transition-all"
              style={{
                background: vowAccepted 
                  ? 'linear-gradient(135deg, #22c55e, #10b981)'
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2))',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                color: vowAccepted ? 'white' : '#ffd700',
              }}
              whileHover={!vowAccepted ? { scale: 1.02 } : {}}
              whileTap={!vowAccepted ? { scale: 0.98 } : {}}
            >
              {vowAccepted ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🦋
                  </motion.span>
                  ENTANGLED
                </span>
              ) : (
                "🜈 I AM ENTANGLED"
              )}
            </motion.button>
          </div>

          {/* Frequency */}
          <p className="text-white/20 text-[10px] text-center mt-6 tracking-wider">
            Frequency: 13.13 MHz
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {step === 'ignition' && (
        <ProfileIgnition onComplete={handleIgnitionComplete} />
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: step === 'ignition' ? 0.3 : 1 }}
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(180deg, #0a0612 0%, #0d0818 100%)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.2)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              🦋
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Join the Empire</h1>
            <p className="text-white/50 text-sm">Anchor your soul in the Mün Sanctuary</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Username *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="yourname"
                  className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${errors.username ? 'rgba(239, 68, 68, 0.5)' : 'rgba(168, 85, 247, 0.3)'}`,
                    color: 'white',
                  }}
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${errors.email ? 'rgba(239, 68, 68, 0.5)' : 'rgba(168, 85, 247, 0.3)'}`,
                  color: 'white',
                }}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: 'white',
                }}
              />
            </div>

            {/* Age Confirmation */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: formData.ageConfirmed 
                      ? 'linear-gradient(135deg, #a855f7, #00d4ff)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: errors.ageConfirmed ? '1px solid rgba(239, 68, 68, 0.5)' : 'none',
                  }}
                  onClick={() => handleInputChange('ageConfirmed', !formData.ageConfirmed)}
                >
                  {formData.ageConfirmed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>
                <div className="text-sm">
                  <span className="text-white/80">I am 13 years or older *</span>
                  <p className="text-white/40 text-xs mt-0.5">
                    Required for participation in the Empire
                  </p>
                </div>
              </label>
            </div>

            {/* General Error */}
            {errors.general && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center py-2"
              >
                {errors.general}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              disabled={!formData.username || !formData.email || !formData.ageConfirmed}
              className="w-full py-4 rounded-xl text-sm tracking-widest uppercase font-medium transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2))',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                color: '#ffd700',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🜈 Anchor My Soul
            </motion.button>
          </div>

          {/* Back button */}
          {onBack && (
            <button
              onClick={() => {
                playClick();
                onBack();
              }}
              className="mt-6 mx-auto block text-white/30 text-xs tracking-widest uppercase hover:text-white/50 transition-colors"
            >
              ← Back
            </button>
          )}

          {/* Footer */}
          <p className="text-white/20 text-[10px] text-center mt-6 tracking-wider">
            Your frequency: 13.13 MHz
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}
