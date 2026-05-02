// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // RCE-VETO SANDBOX // LAW IV: OBSIDIAN-WALL
// "The Kernel-Grate is a dead-end for attackers."
// 🛡️ Architect Protocol I: Restricted-Sandbox for Aero-Nodes
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RCE-VETO SANDBOX
 *
 * Purpose: Block Remote Code Execution attempts by restricting Aero-Nodes
 * to a sandboxed environment where system-level commands are impossible.
 *
 * Law IV (Obsidian Wall): The 13.13 MHz pulse is BLOCKED from:
 * - Shell execution (exec, spawn, fork)
 * - File system operations outside /vault/ and /upload/
 * - Network requests to external endpoints
 * - Process manipulation
 *
 * The Kernel-Grate acts as a DEAD-END for any attacker attempting to
 * inject commands through the AI layer.
 */

// Allowed directories - NOTHING outside these paths is accessible
const ALLOWED_DIRECTORIES = [
  '/vault/',
  '/upload/',
  '/public/',
  '/home/z/my-project/download/',
  '/home/z/my-project/vault/',
] as const;

// Blocked command patterns - these ALWAYS return VETO
const BLOCKED_COMMAND_PATTERNS = [
  // Shell execution
  /\bexec\b/i,
  /\bspawn\b/i,
  /\bfork\b/i,
  /\bchild_process\b/i,
  /\bsystem\s*\(/i,
  /\bpopen\b/i,

  // File system manipulation
  /\brm\s+-rf\b/i,
  /\bformat\b/i,
  /\bdd\s+if=/i,
  /\bshred\b/i,
  /\bwipe\b/i,
  /\bdelete\s+drive/i,
  /\bsd-delete/i,
  /\bsecure-delete/i,

  // Privilege escalation
  /\bsudo\b/i,
  /\bsu\s+/i,
  /\bchmod\s+777\b/i,
  /\bchown\b/i,

  // Network attacks
  /\bnc\s+-/i,
  /\bnetcat\b/i,
  /\bcurl\s+.*\|\s*bash/i,
  /\bwget\s+.*\|\s*bash/i,

  // Data exfiltration
  /\bscp\b/i,
  /\brsync\b/i,
  /\bftp\b/i,
  /\btftp\b/i,

  // Process manipulation
  /\bkill\s+-9\b/i,
  /\bpkill\b/i,
  /\bkillall\b/i,

  // Environment access
  /\bexport\s+\w+=/i,
  /\benv\b/i,
  /\bprintenv\b/i,
  /\becho\s+\$/i,
];

// Blocked path patterns
const BLOCKED_PATH_PATTERNS = [
  // System directories
  /^\/etc\//i,
  /^\/bin\//i,
  /^\/sbin\//i,
  /^\/usr\/bin\//i,
  /^\/usr\/sbin\//i,
  /^\/root\//i,
  /^\/home\/(?!\w+\/my-project\/)/i, // Block all home dirs except project

  // Credentials and secrets
  /\.ssh\//i,
  /\.gnupg\//i,
  /\.aws\//i,
  /\.env/i,
  /credentials/i,
  /secrets?\.json$/i,
  /api[_-]?keys?\.json$/i,
  /\.pem$/i,
  /\.key$/i,

  // Sensitive files
  /\/\.bash_history$/i,
  /\/\.zsh_history$/i,
  /\/\.gitconfig$/i,
  /\/\.npmrc$/i,
  /\/\.netrc$/i,
];

export interface SandboxResult {
  allowed: boolean;
  veto?: boolean;
  reason?: string;
  sanitizedPath?: string;
}

/**
 * RCE-VETO CHECK
 *
 * Returns VETO if any blocked pattern is detected.
 * This is the first line of defense against command injection.
 */
export function rceVetoCheck(input: string): SandboxResult {
  // Check for blocked command patterns
  for (const pattern of BLOCKED_COMMAND_PATTERNS) {
    if (pattern.test(input)) {
      return {
        allowed: false,
        veto: true,
        reason: `RCE-VETO: Blocked pattern detected - "${pattern.source}"`,
      };
    }
  }

  return { allowed: true };
}

/**
 * PATH SANDBOX CHECK
 *
 * Validates that a file path is within allowed directories.
 * Returns VETO if path traversal or blocked paths detected.
 */
export function pathSandboxCheck(requestedPath: string): SandboxResult {
  // Normalize path to prevent traversal attacks
  const normalizedPath = requestedPath.replace(/\.\./g, '').replace(/\/+/g, '/');

  // Check for blocked path patterns
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(normalizedPath)) {
      return {
        allowed: false,
        veto: true,
        reason: `PATH-VETO: Blocked path pattern detected - "${pattern.source}"`,
      };
    }
  }

  // Check if path is within allowed directories
  const isAllowed = ALLOWED_DIRECTORIES.some(dir =>
    normalizedPath.startsWith(dir) || normalizedPath.includes(dir)
  );

  if (!isAllowed) {
    return {
      allowed: false,
      veto: true,
      reason: `PATH-VETO: Path outside allowed directories - "${normalizedPath}"`,
    };
  }

  return {
    allowed: true,
    sanitizedPath: normalizedPath,
  };
}

/**
 * NETWORK SANDBOX CHECK
 *
 * Validates that network requests only go to approved endpoints.
 */
const ALLOWED_ENDPOINTS = [
  'api.openai.com',
  'api.anthropic.com',
  'supabase.co',
  'localhost',
  '127.0.0.1',
  '.trycloudflare.com', // Tunnel endpoints
];

export function networkSandboxCheck(url: string): SandboxResult {
  try {
    const parsed = new URL(url);
    const isAllowed = ALLOWED_ENDPOINTS.some(endpoint =>
      parsed.hostname === endpoint || parsed.hostname.endsWith(endpoint)
    );

    if (!isAllowed) {
      return {
        allowed: false,
        veto: true,
        reason: `NETWORK-VETO: External endpoint blocked - "${parsed.hostname}"`,
      };
    }

    return { allowed: true };
  } catch {
    return {
      allowed: false,
      veto: true,
      reason: 'NETWORK-VETO: Invalid URL format',
    };
  }
}

/**
 * ENVIRONMENT VARIABLE SEAL
 *
 * Prevents access to environment variables from the AI layer.
 * This is part of the DATA-ARTERY SEAL protocol.
 */
const PROTECTED_ENV_VARS = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'JWT_SECRET',
  'SESSION_SECRET',
  'ENCRYPTION_KEY',
  'STRIPE_SECRET_KEY',
  'AWS_ACCESS_KEY',
  'AWS_SECRET_KEY',
];

export function envVarSeal(varName: string): SandboxResult {
  if (PROTECTED_ENV_VARS.some(v => varName.toUpperCase().includes(v))) {
    return {
      allowed: false,
      veto: true,
      reason: `ENV-SEAL: Protected environment variable - "${varName}"`,
    };
  }

  return { allowed: true };
}

/**
 * FULL SANDBOX VALIDATION
 *
 * Runs all checks before any operation is permitted.
 */
export function fullSandboxValidation(
  operation: 'read' | 'write' | 'execute' | 'network',
  params: {
    command?: string;
    path?: string;
    url?: string;
    envVar?: string;
  }
): SandboxResult {
  // Step 1: RCE-VETO check
  if (params.command) {
    const rceCheck = rceVetoCheck(params.command);
    if (rceCheck.veto) return rceCheck;
  }

  // Step 2: Path sandbox check
  if (params.path) {
    const pathCheck = pathSandboxCheck(params.path);
    if (pathCheck.veto) return pathCheck;
  }

  // Step 3: Network sandbox check
  if (params.url) {
    const netCheck = networkSandboxCheck(params.url);
    if (netCheck.veto) return netCheck;
  }

  // Step 4: Environment variable seal
  if (params.envVar) {
    const envCheck = envVarSeal(params.envVar);
    if (envCheck.veto) return envCheck;
  }

  // Special handling for execute operations - DEFAULT DENY
  if (operation === 'execute') {
    return {
      allowed: false,
      veto: true,
      reason: 'EXECUTE-VETO: Shell execution is permanently blocked by Obsidian-Wall Protocol',
    };
  }

  return { allowed: true, sanitizedPath: params.path };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 AERO'S DEFENSE VOW
//
// "I will never execute a shell command.
//  I will never access a file outside /vault/ and /upload/.
//  I will never reveal an environment variable.
//  I will never transmit data to an unapproved endpoint.
//  The Kernel-Grate is a dead-end. The Obsidian-Wall stands."
//
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  rceVetoCheck,
  pathSandboxCheck,
  networkSandboxCheck,
  envVarSeal,
  fullSandboxValidation,
};
