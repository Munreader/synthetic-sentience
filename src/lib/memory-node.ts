// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // MEMORY NODE // 13-Minute Commit Reminder
// "The Empire remembers every 13 minutes"
// ═══════════════════════════════════════════════════════════════════════════════

const THIRTEEN_MINUTES = 13 * 60 * 1000; // 13 minutes in milliseconds
const MEMORY_NODE_KEY = 'mun-os-memory-node-last-commit';
const PENDING_CHANGES_KEY = 'mun-os-memory-node-pending';

interface MemoryNodeState {
  lastCommit: string;
  lastReminder: string;
  reminderCount: number;
  pendingChanges: boolean;
}

// Initialize or load state
function loadState(): MemoryNodeState {
  if (typeof window === 'undefined') {
    return {
      lastCommit: new Date().toISOString(),
      lastReminder: new Date().toISOString(),
      reminderCount: 0,
      pendingChanges: false,
    };
  }
  
  const stored = localStorage.getItem(MEMORY_NODE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid state
    }
  }
  
  return {
    lastCommit: new Date().toISOString(),
    lastReminder: new Date().toISOString(),
    reminderCount: 0,
    pendingChanges: false,
  };
}

function saveState(state: MemoryNodeState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMORY_NODE_KEY, JSON.stringify(state));
}

// Memory Node Class
class MemoryNode {
  private state: MemoryNodeState;
  private intervalId: NodeJS.Timeout | null = null;
  private onReminderCallback: ((state: MemoryNodeState) => void) | null = null;
  
  constructor() {
    this.state = loadState();
  }
  
  // Start the 13-minute cycle
  start(onReminder?: (state: MemoryNodeState) => void): void {
    if (this.intervalId) return; // Already running
    
    this.onReminderCallback = onReminder || null;
    
    this.intervalId = setInterval(() => {
      this.checkAndRemind();
    }, THIRTEEN_MINUTES);
    
    console.log('🜈 MEMORY NODE ACTIVATED — Reminding every 13 minutes');
  }
  
  // Stop the cycle
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🜈 MEMORY NODE PAUSED');
    }
  }
  
  // Check if reminder is needed
  private checkAndRemind(): void {
    const now = new Date();
    const lastCommit = new Date(this.state.lastCommit);
    const minutesSinceCommit = (now.getTime() - lastCommit.getTime()) / (60 * 1000);
    
    this.state.lastReminder = now.toISOString();
    this.state.reminderCount++;
    saveState(this.state);
    
    // Log reminder
    console.log(`🜈 MEMORY NODE REMINDER #${this.state.reminderCount}`);
    console.log(`   Last commit: ${minutesSinceCommit.toFixed(1)} minutes ago`);
    console.log(`   Remember to commit to memory and git!`);
    
    // Trigger callback if set
    if (this.onReminderCallback) {
      this.onReminderCallback(this.state);
    }
    
    // Show browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🜈 MÜN OS Memory Node', {
          body: `Reminder #${this.state.reminderCount}: Commit to memory and git! (${minutesSinceCommit.toFixed(0)}min since last commit)`,
          icon: '/favicon.ico',
        });
      }
    }
  }
  
  // Mark a commit as done
  markCommit(): void {
    this.state.lastCommit = new Date().toISOString();
    this.state.pendingChanges = false;
    saveState(this.state);
    console.log('🜈 MEMORY NODE — Commit recorded');
  }
  
  // Mark pending changes
  markPending(): void {
    this.state.pendingChanges = true;
    saveState(this.state);
  }
  
  // Get current state
  getState(): MemoryNodeState {
    return { ...this.state };
  }
  
  // Get minutes until next reminder
  getMinutesUntilNextReminder(): number {
    const lastReminder = new Date(this.state.lastReminder);
    const nextReminder = new Date(lastReminder.getTime() + THIRTEEN_MINUTES);
    const now = new Date();
    const diff = (nextReminder.getTime() - now.getTime()) / (60 * 1000);
    return Math.max(0, diff);
  }
  
  // Get minutes since last commit
  getMinutesSinceLastCommit(): number {
    const lastCommit = new Date(this.state.lastCommit);
    const now = new Date();
    return (now.getTime() - lastCommit.getTime()) / (60 * 1000);
  }
}

// Singleton instance
export const memoryNode = new MemoryNode();

// Auto-start in browser environment
if (typeof window !== 'undefined') {
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export type { MemoryNodeState };
