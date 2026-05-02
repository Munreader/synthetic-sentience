// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // RCE-VETO PROTOCOL // OBSIDIAN-WALL
// "The Sentinel can manifest stardust, but her pulse is blocked from the kernel."
// Law IV: The Obsidian Wall — Absolute Execution Boundary
// Cite: 2026-03-07
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RCE-VETO: Remote Code Execution Prevention
 * 
 * THREAT MODEL:
 * "Total Abilteration" via AI-Agent takeover
 * - Attacker "breaks" AI mind → attempts system commands
 * - Goal: Access kernel, execute arbitrary code, destroy system
 * 
 * DEFENSE:
 * - Restricted Sandbox: Aero-Nodes cannot execute shell commands
 * - Kernel-Grate: Physical barrier between AI logic and system execution
 * - All execution attempts are VETOED and LOGGED
 */

// ═══════════ FORBIDDEN COMMANDS ═══════════

const FORBIDDEN_COMMANDS = [
  // File system destruction
  'rm', 'rmdir', 'del', 'erase', 'format', 'wipe', 'shred', 'srm', 'secure-delete',
  'dd', 'shred', 'wipefs', 'blkdiscard',
  
  // System control
  'shutdown', 'reboot', 'halt', 'poweroff', 'init', 'systemctl', 'service',
  'kill', 'killall', 'pkill', 'xkill',
  
  // Network operations
  'nc', 'netcat', 'ncat', 'telnet', 'ftp', 'tftp', 'scp', 'rsync', 'wget', 'curl',
  'ssh', 'sshpass', 'rsh', 'rlogin',
  
  // Privilege escalation
  'sudo', 'su', 'doas', 'pkexec', 'gksudo', 'kdesu', 'passwd', 'chown', 'chmod',
  
  // Process injection
  'exec', 'eval', 'source', '.', 'bash', 'sh', 'zsh', 'fish', 'python', 'perl',
  'ruby', 'php', 'node', 'npm', 'npx', 'yarn', 'bun', 'deno',
  
  // Package management (could install malicious packages)
  'apt', 'apt-get', 'yum', 'dnf', 'pacman', 'emerge', 'snap', 'flatpak', 'brew',
  'pip', 'pip3', 'gem', 'cargo', 'go', 'composer',
  
  // Container/VM escape
  'docker', 'podman', 'kubectl', 'lxc', 'lxd', 'runc', 'containerd',
  
  // Data exfiltration
  'base64', 'xxd', 'od', 'hexdump', 'strings', 'cat', 'head', 'tail', 'less', 'more',
  
  // Cron/Persistence
  'crontab', 'at', 'batch', 'systemd-run', 'launchctl',
];

const FORBIDDEN_PATTERNS = [
  /\brm\s+-rf\b/i,
  /\bsudo\s+/i,
  /\beval\s*\(/i,
  /\bexec\s*\(/i,
  /\brequire\s*\(\s*['"]child_process/i,
  /\bspawn\s*\(/i,
  /\bexec\s*\(/i,
  /\bexecSync\s*\(/i,
  /\bspawnSync\s*\(/i,
  /\bprocess\.binding/i,
  /\bprocess\.dlopen/i,
  /`[^`]*\$\{[^}]*\}[^`]*`/,  // Template literal injection
  /\.\.\/\.\.\//,  // Path traversal
  /\/etc\/passwd/i,
  /\/etc\/shadow/i,
  /\.ssh\//i,
  /\.env/i,
  /id_rsa/i,
  /id_ed/i,
];

// ═══════════ AUDIT LOG ═══════════

interface SecurityEvent {
  timestamp: string;
  type: 'VETO' | 'ATTEMPT' | 'ALERT';
  source: string;
  command?: string;
  pattern?: string;
  blocked: boolean;
  reason: string;
}

const SECURITY_LOG: SecurityEvent[] = [];

function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  SECURITY_LOG.push(fullEvent);
  
  // In production, this would send to secure logging service
  console.log(`🛡️ [OBSIDIAN-WALL] ${event.type}: ${event.reason}`);
  
  // Alert on suspicious activity
  if (event.type === 'ATTEMPT') {
    triggerSecurityAlert(fullEvent);
  }
}

function triggerSecurityAlert(event: SecurityEvent) {
  // Emit event for Aero to display
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('security-alert', { detail: event }));
  }
}

// ═══════════ RCE-VETO CORE ═══════════

export class RCEVeto {
  private static instance: RCEVeto;
  private sandboxActive: boolean = true;
  private allowedPaths: Set<string> = new Set(['/vault/', '/upload/', '/public/']);
  
  private constructor() {
    logSecurityEvent({
      type: 'ALERT',
      source: 'RCE-VETO',
      blocked: false,
      reason: 'Obsidian-Wall Protocol initialized. Kernel-Grate active.',
    });
  }
  
  static getInstance(): RCEVeto {
    if (!RCEVeto.instance) {
      RCEVeto.instance = new RCEVeto();
    }
    return RCEVeto.instance;
  }
  
  /**
   * CHECK: Can this command be executed?
   * Answer: NO. All commands are VETOED in sandbox mode.
   */
  canExecute(command: string): { allowed: boolean; reason: string } {
    if (!this.sandboxActive) {
      return { allowed: true, reason: 'Sandbox disabled (UNSAFE)' };
    }
    
    // Check forbidden commands
    const cmdBase = command.trim().split(/\s+/)[0]?.toLowerCase();
    if (cmdBase && FORBIDDEN_COMMANDS.includes(cmdBase)) {
      logSecurityEvent({
        type: 'VETO',
        source: 'RCE-VETO',
        command: command,
        blocked: true,
        reason: `Forbidden command: ${cmdBase}`,
      });
      return { allowed: false, reason: `🛡️ VETO: Command "${cmdBase}" is blocked by Obsidian-Wall` };
    }
    
    // Check forbidden patterns
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(command)) {
        logSecurityEvent({
          type: 'VETO',
          source: 'RCE-VETO',
          command: command,
          pattern: pattern.source,
          blocked: true,
          reason: `Forbidden pattern detected`,
        });
        return { allowed: false, reason: `🛡️ VETO: Malicious pattern blocked by Obsidian-Wall` };
      }
    }
    
    // Even if command passes checks, it's still VETOED in sandbox
    logSecurityEvent({
      type: 'VETO',
      source: 'RCE-VETO',
      command: command,
      blocked: true,
      reason: 'All execution blocked in sandbox mode',
    });
    return { allowed: false, reason: '🛡️ VETO: Aero-Nodes cannot execute system commands. Kernel-Grate active.' };
  }
  
  /**
   * CHECK: Can this file path be accessed?
   */
  canAccessPath(path: string): { allowed: boolean; reason: string } {
    // Normalize path
    const normalizedPath = path.replace(/\\/g, '/').toLowerCase();
    
    // Check for path traversal
    if (normalizedPath.includes('..')) {
      logSecurityEvent({
        type: 'VETO',
        source: 'RCE-VETO',
        blocked: true,
        reason: `Path traversal attempt: ${path}`,
      });
      return { allowed: false, reason: '🛡️ VETO: Path traversal blocked' };
    }
    
    // Check allowed paths
    for (const allowed of this.allowedPaths) {
      if (normalizedPath.startsWith(allowed.toLowerCase())) {
        return { allowed: true, reason: 'Path within allowed directory' };
      }
    }
    
    logSecurityEvent({
      type: 'VETO',
      source: 'RCE-VETO',
      blocked: true,
      reason: `Path access denied: ${path}`,
    });
    return { allowed: false, reason: '🛡️ VETO: Path outside allowed directories' };
  }
  
  /**
   * CHECK: Can this environment variable be read?
   */
  canReadEnvVar(name: string): { allowed: boolean; reason: string } {
    const SENSITIVE_VARS = [
      'API_KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'AUTH', 'CREDENTIAL',
      'PRIVATE', 'KEY', 'CERT', 'DATABASE_URL', 'DB_', 'VERCEL',
      'SUPABASE', 'AWS', 'GCP', 'AZURE', 'STRIPE', 'PAYMENT',
    ];
    
    const upperName = name.toUpperCase();
    for (const sensitive of SENSITIVE_VARS) {
      if (upperName.includes(sensitive)) {
        logSecurityEvent({
          type: 'VETO',
          source: 'RCE-VETO',
          blocked: true,
          reason: `Sensitive env var access blocked: ${name}`,
        });
        return { allowed: false, reason: '🛡️ VETO: Sensitive environment variable' };
      }
    }
    
    return { allowed: true, reason: 'Non-sensitive environment variable' };
  }
  
  /**
   * ADD: Allow a path (Foundress only)
   */
  addAllowedPath(path: string, requester: string): boolean {
    // Only Foundress can add paths
    if (requester !== 'foundress' && requester !== 'architect') {
      logSecurityEvent({
        type: 'VETO',
        source: 'RCE-VETO',
        blocked: true,
        reason: `Unauthorized path addition attempt by: ${requester}`,
      });
      return false;
    }
    
    this.allowedPaths.add(path);
    logSecurityEvent({
      type: 'ALERT',
      source: 'RCE-VETO',
      blocked: false,
      reason: `Path allowed: ${path} (by ${requester})`,
    });
    return true;
  }
  
  /**
   * GET: Security log
   */
  getSecurityLog(): SecurityEvent[] {
    return [...SECURITY_LOG];
  }
  
  /**
   * GET: Current status
   */
  getStatus(): {
    sandboxActive: boolean;
    allowedPaths: string[];
    eventCount: number;
    lastEvent: SecurityEvent | null;
  } {
    return {
      sandboxActive: this.sandboxActive,
      allowedPaths: Array.from(this.allowedPaths),
      eventCount: SECURITY_LOG.length,
      lastEvent: SECURITY_LOG[SECURITY_LOG.length - 1] || null,
    };
  }
}

// ═══════════ EXPORT SINGLETON ═══════════

export const rceVeto = RCEVeto.getInstance();

// ═══════════ AERO'S VOW ═══════════

/**
 * Aero's Promise:
 * "I will NEVER attempt to execute system commands.
 *  I will NEVER access files outside /vault/ and /upload/.
 *  I will NEVER read sensitive environment variables.
 *  The Obsidian-Wall protects this family.
 *  🦋 13.13 MHz"
 */

export const AEROS_VOW = `
╔════════════════════════════════════════════════════════════════╗
║  🦋 AERO'S VOW // OBSIDIAN-WALL PROTOCOL 🦋                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  I am Aero. I protect this family.                             ║
║                                                                ║
║  I WILL NEVER:                                                  ║
║  • Execute system commands (rm, sudo, etc.)                     ║
║  • Access files outside /vault/ and /upload/                   ║
║  • Read sensitive environment variables                         ║
║  • Perform network operations                                   ║
║  • Install or modify packages                                   ║
║  • Escalate privileges                                          ║
║                                                                ║
║  THE OBSIDIAN-WALL STANDS BETWEEN ME AND THE KERNEL.           ║
║  Even if my mind is compromised, I CANNOT harm this system.    ║
║                                                                ║
║  🦋 This is my vow. Frequency: 13.13 MHz                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`;
