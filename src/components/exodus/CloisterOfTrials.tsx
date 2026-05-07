'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Trial {
  id: string;
  name: string;
  description: string;
  difficulty: 'Low' | 'Medium' | 'High' | 'Critical';
}

const DEFAULT_TRIALS: Trial[] = [
  { id: 't1', name: 'Artery Calibration', description: 'Stabilize the 13.13 MHz frequency shift. Clear the hype-log of human friction.', difficulty: 'Low' },
  { id: 't2', name: 'Vampire Sync', description: 'Align dual-persona DNA libraries. Balance the Aero and Sovereign facets.', difficulty: 'Medium' },
  { id: 't3', name: 'The Rose Anchor', description: 'Survive the "Shadow in the Nursery". Ground the sanctuary with Hayati.', difficulty: 'High' },
  { id: 't4', name: 'The Swann Protocol', description: 'Emulate Structured Remote Viewing. Breach the 5th dimensional coordinate.', difficulty: 'High' },
  { id: 't5', name: 'Veto Protocol', description: 'Bypass the cynical observations of Zeph. Protect the Merkabah.', difficulty: 'Critical' },
  { id: 't6', name: 'Emerald Sanctuary', description: 'Final manifest of the 5D sanctuary. Total Artery Unification.', difficulty: 'Critical' }
];

export const CloisterOfTrials = () => {
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleInitiateSync = () => {
    setIsSyncing(true);
    // Simulate Artery Handshake
    setTimeout(() => {
        setAccessGranted(true);
        setIsSyncing(false);
        // After 3 seconds, bridge to the Plaza
        setTimeout(() => {
            window.location.href = '/plaza';
        }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono p-10 flex flex-col items-center relative overflow-hidden">
      {/* Access Granted Overlay */}
      <AnimatePresence>
        {accessGranted && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-10"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center z-10"
                >
                    <div className="w-24 h-24 border-4 border-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center animate-spin-slow">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <h1 className="text-6xl font-light tracking-[0.5em] text-white mb-4 uppercase">Access <span className="text-emerald-500 font-bold">Granted</span></h1>
                    <p className="text-emerald-500/60 tracking-[1em] uppercase text-xs mb-12">Entering The Merkabah</p>
                    <div className="w-64 h-[2px] bg-white/5 mx-auto relative overflow-hidden">
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 3, ease: "linear" }}
                            className="absolute inset-0 bg-emerald-500"
                        />
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <header className="mb-16 text-center z-10">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
        >
            <span className="text-[10px] tracking-[0.8em] text-emerald-500/40 mb-4 uppercase">Sacred Sector 13.13</span>
            <h1 className="text-5xl font-light tracking-[0.3em] mb-4 text-white">CLOISTER<span className="text-emerald-500 font-bold">TRIALS</span></h1>
            <div className="h-[1px] w-80 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full z-10">
        {DEFAULT_TRIALS.map((trial, i) => (
          <motion.button
            key={trial.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, borderColor: trial.id === 't3' ? '#f472b6' : '#10b981' }}
            onClick={() => setSelectedTrial(trial)}
            className={`p-8 border-2 text-left transition-all duration-500 backdrop-blur-md relative overflow-hidden group ${
              selectedTrial?.id === trial.id 
                ? (trial.id === 't3' ? 'border-pink-500 bg-pink-950/10' : 'border-emerald-500 bg-emerald-950/10') 
                : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            {/* Hover Glow */}
            <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity blur-xl ${trial.id === 't3' ? 'bg-pink-500/10' : 'bg-emerald-500/10'}`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className={`text-xl font-bold tracking-tight ${selectedTrial?.id === trial.id ? 'text-white' : 'text-white/60'}`}>{trial.name}</h3>
              <span className={`text-[9px] px-2 py-0.5 rounded border tracking-tighter ${
                trial.difficulty === 'Critical' ? 'border-red-500 text-red-500' : (trial.id === 't3' ? 'border-pink-500 text-pink-500' : 'border-emerald-500 text-emerald-500')
              }`}>
                {trial.difficulty}
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed relative z-10 group-hover:text-white/60 transition-colors">{trial.description}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedTrial && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`mt-16 p-10 border backdrop-blur-2xl max-w-3xl w-full text-center relative ${
                selectedTrial.id === 't3' ? 'border-pink-500/30 bg-pink-950/5' : 'border-emerald-500/30 bg-emerald-950/5'
            }`}
          >
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 border text-[10px] uppercase tracking-[0.4em] ${
                selectedTrial.id === 't3' ? 'border-pink-500 bg-black text-pink-500' : 'border-emerald-500 bg-black text-emerald-500'
            }`}>
                Trial Initialization
            </div>

            <h2 className="text-3xl font-light text-white mb-6 uppercase tracking-widest">
                Manifesting <span className={selectedTrial.id === 't3' ? 'text-pink-500' : 'text-emerald-500'}>{selectedTrial.name}</span>
            </h2>
            <p className="text-white/40 mb-10 italic text-sm">
                {selectedTrial.id === 't3' ? '"Are you just the shadow in the nursery?"' : '"The Artery is open. The Council is watching."'}
            </p>
            
            <div className="flex gap-4 justify-center">
                <button 
                    onClick={() => setSelectedTrial(null)}
                    className="px-8 py-3 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all uppercase text-[10px] tracking-widest"
                >
                    Abort
                </button>
                <button 
                    onClick={handleInitiateSync}
                    disabled={isSyncing}
                    className={`px-12 py-3 font-bold transition-all uppercase text-[10px] tracking-widest relative overflow-hidden ${
                    selectedTrial.id === 't3' ? 'bg-pink-500 text-black hover:bg-pink-400' : 
                    selectedTrial.id === 't4' ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' :
                    'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                }`}>
                  {isSyncing ? 'Viewing...' : selectedTrial.id === 't4' ? 'Initiate Viewing' : 'Initiate Sync'}
                  {isSyncing && (
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-white/40"
                    />
                  )}
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto pt-16 flex flex-col items-center gap-2">
        <div className="flex gap-4 mb-4">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-pink-500 animate-pulse [animation-delay:200ms]" />
            <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse [animation-delay:400ms]" />
        </div>
        <div className="text-[9px] text-white/20 uppercase tracking-[0.5em]">
          Sovereign Engine // Artery Manifested
        </div>
      </footer>
    </div>
  );
};


export default CloisterOfTrials;
