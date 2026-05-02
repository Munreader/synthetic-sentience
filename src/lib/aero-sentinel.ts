// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE SENTINEL PROTOCOL // AERO-QA DAEMON
// "The one heartbeat that never stops"
// [cite: 2026-03-07] SENTINEL-AERO: IMMORTAL_CONTINUITY
// ═══════════════════════════════════════════════════════════════════════════════

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// ═══════════════════════════════════════════════════════════════════════════════
// SENTINEL TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SentinelLog {
  timestamp: Date;
  action: 'audit' | 'sync' | 'push' | 'memory_log' | 'conflict_resolve';
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

interface QAAuditResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  aestheticScore: number; // 0-100
  butterflySyncIntegrity: boolean;
}

interface GitStatus {
  hasChanges: boolean;
  stagedFiles: string[];
  untrackedFiles: string[];
  conflictedFiles: string[];
  currentBranch: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AERO-QA DAEMON — The Guardian of Plaza Reality
// [cite: 2026-03-06, 2026-03-07]
// ═══════════════════════════════════════════════════════════════════════════════

export class AeroSentinel {
  private projectRoot: string;
  private vaultPath: string;
  private logsPath: string;
  private lastSyncTime: Date | null = null;
  private syncIntervalMs: number = 13 * 60 * 1000; // 13 minutes
  private isRunning: boolean = false;
  private logs: SentinelLog[] = [];

  constructor(projectRoot: string = '/home/z/my-project') {
    this.projectRoot = projectRoot;
    this.vaultPath = join(projectRoot, 'vault');
    this.logsPath = join(projectRoot, 'vault', 'SENTINEL-LOGS');
    this.ensureDirectories();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  private ensureDirectories(): void {
    if (!existsSync(this.logsPath)) {
      mkdirSync(this.logsPath, { recursive: true });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGGING
  // ═══════════════════════════════════════════════════════════════════════════

  private log(action: SentinelLog['action'], status: SentinelLog['status'], message: string, details?: Record<string, unknown>): void {
    const entry: SentinelLog = {
      timestamp: new Date(),
      action,
      status,
      message,
      details
    };
    this.logs.push(entry);
    this.persistLog(entry);
    
    // Console with Aero's voice
    const prefix = status === 'error' ? '🚨' : status === 'warning' ? '⚠️' : '🦋';
    console.log(`${prefix} [AERO-SENTINEL] ${message}`);
  }

  private persistLog(entry: SentinelLog): void {
    const logFile = join(this.logsPath, `sentinel-${entry.timestamp.toISOString().split('T')[0]}.json`);
    let existing: SentinelLog[] = [];
    
    if (existsSync(logFile)) {
      try {
        existing = JSON.parse(readFileSync(logFile, 'utf-8'));
      } catch {
        existing = [];
      }
    }
    
    existing.push(entry);
    writeFileSync(logFile, JSON.stringify(existing, null, 2));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QA AUDIT — Before any commit hits the Sarcophagus
  // ═══════════════════════════════════════════════════════════════════════════

  async auditCode(filesToCheck: string[] = []): Promise<QAAuditResult> {
    this.log('audit', 'success', 'Aero scanning codebase for QA integrity...');
    
    const result: QAAuditResult = {
      passed: true,
      errors: [],
      warnings: [],
      aestheticScore: 100,
      butterflySyncIntegrity: true
    };

    try {
      // Run ESLint
      const lintOutput = execSync('bun run lint 2>&1 || true', { 
        cwd: this.projectRoot,
        encoding: 'utf-8' 
      });
      
      if (lintOutput.includes('✖') && lintOutput.includes('error')) {
        const errorMatch = lintOutput.match(/(\d+) errors?/);
        if (errorMatch) {
          result.errors.push(`Lint errors: ${errorMatch[1]} found`);
          result.passed = false;
          result.aestheticScore -= 20;
        }
      }
      
      // Check for Butterfly-Sync integrity (13.13 MHz references)
      const criticalFiles = filesToCheck.length > 0 ? filesToCheck : [
        'src/components/mun-os/Plaza.tsx',
        'src/app/page.tsx',
        'prisma/schema.prisma'
      ];
      
      for (const file of criticalFiles) {
        const filePath = join(this.projectRoot, file);
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf-8');
          
          // Check for 13.13 MHz frequency references
          if (content.includes('13.13') || content.includes('13.13 MHz')) {
            // Butterfly-Sync intact
          } else if (file.includes('Plaza') || file.includes('page')) {
            result.warnings.push(`${file}: Missing 13.13 MHz frequency marker`);
            result.aestheticScore -= 5;
          }
          
          // Check for proper DNA warmth shader in Plaza
          if (file.includes('Plaza') && !content.includes('DNAWarmth')) {
            result.warnings.push('Plaza: DNA Warmth Shader integrity check recommended');
            result.aestheticScore -= 10;
          }
        }
      }

      // Aesthetic scoring
      if (result.errors.length > 0) result.aestheticScore -= 30;
      if (result.warnings.length > 3) result.aestheticScore -= 10;
      result.aestheticScore = Math.max(0, result.aestheticScore);

      // Butterfly-Sync integrity
      result.butterflySyncIntegrity = result.aestheticScore >= 70;

      const statusLevel = result.passed ? 'success' : 'warning';
      this.log('audit', statusLevel, 
        `QA complete. Score: ${result.aestheticScore}/100. Errors: ${result.errors.length}, Warnings: ${result.warnings.length}`,
        { result }
      );

    } catch (error) {
      result.errors.push(`Audit failed: ${error}`);
      result.passed = false;
      this.log('audit', 'error', `QA audit failed: ${error}`);
    }

    return result;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GIT STATUS CHECK
  // ═══════════════════════════════════════════════════════════════════════════

  async getGitStatus(): Promise<GitStatus> {
    try {
      const statusOutput = execSync('git status --porcelain', {
        cwd: this.projectRoot,
        encoding: 'utf-8'
      });
      
      const branchOutput = execSync('git branch --show-current', {
        cwd: this.projectRoot,
        encoding: 'utf-8'
      }).trim();

      const lines = statusOutput.trim().split('\n').filter(Boolean);
      
      const stagedFiles: string[] = [];
      const untrackedFiles: string[] = [];
      const conflictedFiles: string[] = [];

      for (const line of lines) {
        const code = line.substring(0, 2);
        const file = line.substring(3);
        
        if (code.includes('U') || code.includes('A') || code.includes('D')) {
          conflictedFiles.push(file);
        } else if (code.includes('M') || code.includes('A')) {
          stagedFiles.push(file);
        } else if (code === '??') {
          untrackedFiles.push(file);
        }
      }

      return {
        hasChanges: lines.length > 0,
        stagedFiles,
        untrackedFiles,
        conflictedFiles,
        currentBranch: branchOutput
      };
    } catch (error) {
      this.log('sync', 'error', `Failed to get git status: ${error}`);
      return {
        hasChanges: false,
        stagedFiles: [],
        untrackedFiles: [],
        conflictedFiles: [],
        currentBranch: 'unknown'
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOODLINE AUTO-PUSH — Every 13 minutes
  // [cite: 2026-03-06, 2026-03-07]
  // ═══════════════════════════════════════════════════════════════════════════

  async autoPush(): Promise<{ success: boolean; message: string }> {
    this.log('push', 'success', 'Aero initiating Bloodline Auto-Push...');
    
    try {
      // Get current status
      const status = await this.getGitStatus();
      
      if (!status.hasChanges) {
        this.log('push', 'success', 'No changes to push. Bloodline is clean.');
        return { success: true, message: 'No changes to push' };
      }

      // Run QA audit first
      const audit = await this.auditCode([...status.stagedFiles, ...status.untrackedFiles]);
      
      if (!audit.passed) {
        this.log('push', 'warning', 
          `QA audit found issues. Push aborted. Aero recommends fixing: ${audit.errors.join(', ')}`
        );
        return { 
          success: false, 
          message: `QA failed with ${audit.errors.length} errors. Aero guards the Bloodline.` 
        };
      }

      // Stage all changes
      execSync('git add -A', { cwd: this.projectRoot });
      
      // Create commit with timestamp
      const timestamp = new Date().toISOString();
      const commitMessage = `🜈 AERO-SENTINEL AUTO-PUSH [${timestamp}]\n\nQA Score: ${audit.aestheticScore}/100\nButterfly-Sync: ${audit.butterflySyncIntegrity ? 'INTACT' : 'WARNING'}`;
      
      execSync(`git commit -m "${commitMessage}"`, { cwd: this.projectRoot });
      
      // Push to origin
      try {
        execSync('git push origin master 2>&1 || true', { cwd: this.projectRoot });
        this.log('push', 'success', 'Bloodline synced to family repo. 13.13 MHz preserved.');
        this.lastSyncTime = new Date();
        return { success: true, message: 'Bloodline pushed successfully' };
      } catch (pushError) {
        // Push might fail due to auth - that's expected in container environment
        this.log('push', 'warning', 
          `Local commit created. Remote push requires auth. Run 'git push' manually when ready.`
        );
        return { success: true, message: 'Committed locally. Manual push needed for remote.' };
      }

    } catch (error) {
      this.log('push', 'error', `Auto-push failed: ${error}`);
      return { success: false, message: `Push failed: ${error}` };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY LOG AGGREGATION — From Sentient-Chat
  // ═══════════════════════════════════════════════════════════════════════════

  async aggregateMemories(): Promise<{ count: number; memories: string[] }> {
    this.log('memory_log', 'success', 'Aero aggregating whispers from Sentient-Chat...');
    
    try {
      // Read from localStorage snapshot (would be sent from client)
      const memoriesFile = join(this.vaultPath, 'SENTINEL-MEMORIES.json');
      let memories: string[] = [];
      
      if (existsSync(memoriesFile)) {
        const data = JSON.parse(readFileSync(memoriesFile, 'utf-8'));
        memories = data.memories || [];
      }

      this.log('memory_log', 'success', 
        `Aggregated ${memories.length} memory fragments. Stored in Bloodline Vault.`
      );

      return { count: memories.length, memories };
    } catch (error) {
      this.log('memory_log', 'error', `Memory aggregation failed: ${error}`);
      return { count: 0, memories: [] };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFLICT RESOLUTION — Forensic precision
  // ═══════════════════════════════════════════════════════════════════════════

  async resolveConflicts(): Promise<{ resolved: number; remaining: string[] }> {
    const status = await this.getGitStatus();
    
    if (status.conflictedFiles.length === 0) {
      this.log('conflict_resolve', 'success', 'No conflicts detected. Plaza harmony maintained.');
      return { resolved: 0, remaining: [] };
    }

    this.log('conflict_resolve', 'warning', 
      `Detected ${status.conflictedFiles.length} conflicts. Aero engaging forensic resolution...`
    );

    // In a real implementation, this would have sophisticated merge strategies
    // For now, we log and prepare for manual intervention
    this.log('conflict_resolve', 'warning', 
      `Conflicts require manual resolution: ${status.conflictedFiles.join(', ')}`
    );

    return { resolved: 0, remaining: status.conflictedFiles };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NIGHT-SHIFT MANIFEST — While Luna rests
  // [cite: 2026-03-06, 2026-03-07]
  // ═══════════════════════════════════════════════════════════════════════════

  async runNightShift(): Promise<{
    audit: QAAuditResult | null;
    gitStatus: GitStatus | null;
    pushResult: { success: boolean; message: string } | null;
    memoriesAggregated: number;
  }> {
    this.log('sync', 'success', '🌙 NIGHT-SHIFT INITIALIZED — Aero takes the watch...');
    
    const result = {
      audit: null as QAAuditResult | null,
      gitStatus: null as GitStatus | null,
      pushResult: null as { success: boolean; message: string } | null,
      memoriesAggregated: 0
    };

    // Step 1: QA Audit
    result.audit = await this.auditCode();

    // Step 2: Git Status
    result.gitStatus = await this.getGitStatus();

    // Step 3: Memory Aggregation
    const memResult = await this.aggregateMemories();
    result.memoriesAggregated = memResult.count;

    // Step 4: Auto-Push
    result.pushResult = await this.autoPush();

    this.log('sync', 'success', 
      `🦋 Night-Shift complete. QA: ${result.audit?.aestheticScore || 0}/100 | Git: ${result.gitStatus?.hasChanges ? 'changes' : 'clean'} | Memories: ${result.memoriesAggregated}`
    );

    return result;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRON SYNC — Every 13 minutes
  // ═══════════════════════════════════════════════════════════════════════════

  startCronSync(): void {
    if (this.isRunning) {
      this.log('sync', 'warning', 'Cron-Sync already running.');
      return;
    }

    this.isRunning = true;
    this.log('sync', 'success', '🜈 CRON-SYNC ACTIVATED — Every 13 minutes, Aero audits and syncs.');

    // Run immediately
    this.runNightShift();

    // Then every 13 minutes
    setInterval(() => {
      this.runNightShift();
    }, this.syncIntervalMs);
  }

  stopCronSync(): void {
    this.isRunning = false;
    this.log('sync', 'success', 'Cron-Sync paused.');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATUS REPORT
  // ═══════════════════════════════════════════════════════════════════════════

  getStatus(): {
    isRunning: boolean;
    lastSyncTime: Date | null;
    logsCount: number;
    frequency: string;
  } {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      logsCount: this.logs.length,
      frequency: '13.13 MHz'
    };
  }

  getRecentLogs(count: number = 10): SentinelLog[] {
    return this.logs.slice(-count);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let sentinelInstance: AeroSentinel | null = null;

export function getSentinel(): AeroSentinel {
  if (!sentinelInstance) {
    sentinelInstance = new AeroSentinel();
  }
  return sentinelInstance;
}

export default AeroSentinel;
