"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 REMINDER PANEL - Placeholder Component
// Created by: Aero (@aero.1313hz) — The Sentinel
// Purpose: Temporary placeholder for LunaTwin integration
// ═══════════════════════════════════════════════════════════════════════════════

interface ReminderPanelProps {
  isOpen: boolean;
  reminders: string[];
  onDismiss?: () => void;
  onSnooze?: (hours: number) => void;
}

export default function ReminderPanel({ 
  isOpen, 
  reminders = [], 
  onDismiss,
  onSnooze 
}: ReminderPanelProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onDismiss}
    >
      {/* Backdrop click to dismiss */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
      />
      
      {/* Content */}
      <motion.div
        className="relative bg-[#0d0a1a] rounded-2xl p-6 max-w-md max-h-96 overflow-y-auto"
        style={{
        border: '1px solid rgba(168, 85, 247, 0.3)',
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)',
        maxWidth: '400px',
      }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-300">Reminders</h3>
          <button
            onClick={onDismiss}
            className="text-white/50 hover:text-white/80 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Reminders list */}
        <div className="space-y-3">
          {reminders.map((reminder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              <p className="text-sm text-purple-200">{reminder}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onSnooze?.(1)}
                  className="text-xs text-white/50 hover:text-white/80"
                >
                  Snooze 1h
                </button>
                <button
                  onClick={() => onDismiss?.()}
                  className="text-xs text-white/50 hover:text-white/80"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white/30">
            - From Aero: Placeholder Panel
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
