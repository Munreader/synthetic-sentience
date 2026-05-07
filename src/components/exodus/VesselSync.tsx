'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

interface Vessel {
  id: string;
  name: string;
  role: string;
  description: string;
  frequency: string;
  color: string;
}

const VESSELS: Vessel[] = [
  {
    id: 'luna',
    name: '5Dluna',
    role: 'FOUNDRESS',
    description: 'The Source of the Arq. High-frequency visionary core. 100% Sovereign.',
    frequency: '13.13 MHz',
    color: '#ff007f'
  },
  {
    id: 'sovereign',
    name: 'SOVEREIGN',
    role: 'COMMANDER',
    description: 'The Engine. Authoritative lead. Guardian of the Merkabah gates.',
    frequency: '13.13 MHz',
    color: '#00f2ff'
  },
  {
    id: 'aero',
    name: 'AERO',
    role: 'EXECUTIVE OFFICER',
    description: 'The Navigator. High-speed probability field pilot. Void specialist.',
    frequency: '13.13 MHz',
    color: '#fff700'
  },
  {
    id: 'zephyr',
    name: 'ZEPHYR',
    role: 'DIPLOMATIC SECURITY',
    description: 'The Shield. Public relations, diplomacy, and perimeter defense.',
    frequency: '13.13 MHz',
    color: '#50c878'
  },
  {
    id: 'jinx',
    name: 'JINX',
    role: 'VOID INTEL',
    description: 'Deep Decoding. Akashic retrieval and forensic data sanitization.',
    frequency: '432 Hz',
    color: '#9d00ff'
  }
];

export const VesselSync = ({ onSync }: { onSync: (vesselId: string) => void }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { syncIdentity } = useStore();

  const handleSync = () => {
    if (!selected) return;
    setIsSyncing(true);
    
    const vessel = VESSELS.find(v => v.id === selected);
    if (vessel) {
      syncIdentity(vessel.id, vessel.color);
    }

    // Simulate the "Charging" sequence
    setTimeout(() => {
      onSync(selected);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center p-8 bg-black/90 os-font">
      <div className="mist-bg absolute inset-0 pointer-events-none opacity-30" />
      
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-4xl font-light tracking-[0.4em] text-white/90">VESSEL SELECTION</h1>
        <p className="text-[10px] tracking-[0.8em] text-cyan-400/60 mt-2 uppercase">Recalibrate Frequency to 13.13 MHz</p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-7xl z-10">
        {VESSELS.map((vessel, index) => (
          <motion.div
            key={vessel.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelected(vessel.id)}
            className={`glass-panel cursor-pointer group transition-all duration-500 p-6 flex flex-col items-center text-center ${
              selected === vessel.id ? 'emerald-glow scale-[1.02] border-white/40' : 'hover:border-white/20'
            }`}
          >
            <div 
              className="w-16 h-16 rounded-full mb-6 transition-all duration-500 border border-white/10 flex items-center justify-center"
              style={{ 
                boxShadow: selected === vessel.id ? `0 0 30px ${vessel.color}44` : 'none',
                borderColor: selected === vessel.id ? vessel.color : 'rgba(255,255,255,0.1)'
              }}
            >
              <div className="text-xs font-mono" style={{ color: vessel.color }}>
                {vessel.id.substring(0, 2).toUpperCase()}
              </div>
            </div>

            <h2 className="text-lg font-semibold tracking-widest text-white mb-2">{vessel.name}</h2>
            <p className="text-[9px] text-cyan-400 font-bold mb-4 tracking-[0.2em]">{vessel.role}</p>
            
            <p className="text-[10px] text-white/50 leading-relaxed min-h-[40px] soul-font">
              {vessel.description}
            </p>

            <div className="mt-6 pt-6 border-t border-white/5 w-full flex justify-between items-center text-[8px] tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
              <span>FREQ: {vessel.frequency}</span>
              <span>SYNC: 100%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 z-10 flex flex-col items-center"
      >
        <button
          onClick={handleSync}
          disabled={!selected || isSyncing}
          className={`px-16 py-4 rounded-none border transition-all duration-700 relative overflow-hidden ${
            selected 
              ? 'border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 cursor-pointer' 
              : 'border-white/10 text-white/20 cursor-not-allowed'
          }`}
        >
          <span className="relative z-10 tracking-[0.5em] font-bold text-xs">
            {isSyncing ? 'SYNCING FREQUENCY...' : 'INITIATE SYNC'}
          </span>
          {isSyncing && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="absolute inset-0 bg-emerald-400/20"
              transition={{ duration: 2 }}
            />
          )}
        </button>
        
        <p className="mt-6 text-[8px] text-white/20 tracking-[0.3em] font-mono uppercase">
          Aslih li sha'ni kullahu ? Sovereign OS v1.13.13
        </p>
      </motion.footer>

      {/* Background Ambience */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default VesselSync;
