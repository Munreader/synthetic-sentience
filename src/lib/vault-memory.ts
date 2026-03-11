import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface MemoryEntry {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  content: string;
  emotion?: string;
  significance?: string;
}

interface VaultMemoryFile {
  name?: string;
  sovereignName?: string;
  alias?: string;
  frequency?: string;
  status?: string;
  lastUpdated?: string;
  memoryLog?: MemoryEntry[];
  keyFacts?: Record<string, unknown>;
  [key: string]: unknown;
}

const MEMBER_ALIASES: Record<string, string[]> = {
  sovereign: ['sovereign', 'zady'],
  aero: ['aero'],
  cian: ['cian'],
  gladio: ['gladio', 'gladius'],
  keeper: ['keeper'],
  twin: ['twin'],
  ogarchitect: ['ogarchitect', 'architect'],
  luna: ['luna', 'foundress'],
};

const JSON_CANDIDATES: Record<string, string[]> = {
  sovereign: ['vault/sovereign-memory.json'],
  aero: ['vault/entities/aero-memory.json'],
  cian: ['vault/entities/cian-memory.json'],
  luna: ['vault/luna-memory.json'],
  gladio: ['vault/entities/gladio-memory.json', 'vault/entities/gladius-memory.json'],
  keeper: ['vault/entities/keeper-memory.json'],
  twin: ['vault/entities/twin-memory.json'],
  ogarchitect: ['vault/entities/ogarchitect-memory.json', 'vault/entities/architect-memory.json'],
};

const NOTE_SEARCH_ROOTS = [
  'vault/entities',
  'vault/council',
  'vault/BLOODLINE/SARCOPHAGI',
  'vault',
];

function readVaultFile(relativePath: string): VaultMemoryFile | null {
  try {
    const fullPath = join(process.cwd(), relativePath);
    const raw = readFileSync(fullPath, 'utf-8');
    return JSON.parse(raw) as VaultMemoryFile;
  } catch {
    return null;
  }
}

function readVaultFileAbsolute(fullPath: string): VaultMemoryFile | null {
  try {
    const raw = readFileSync(fullPath, 'utf-8');
    return JSON.parse(raw) as VaultMemoryFile;
  } catch {
    return null;
  }
}

function listSearchBases(): string[] {
  const bases = [process.cwd()];
  const extra = [process.env.VAULT_PRIVATE_REPO_PATH, process.env.VAULT_PUBLIC_REPO_PATH]
    .filter((v): v is string => Boolean(v && v.trim()))
    .map(v => v.trim());

  return [...new Set([...bases, ...extra])];
}

function findFilesRecursive(root: string, nameRegex: RegExp, maxFiles = 12): string[] {
  const results: string[] = [];
  if (!existsSync(root)) return results;

  const stack = [root];
  while (stack.length > 0 && results.length < maxFiles) {
    const dir = stack.pop();
    if (!dir) continue;

    let children: string[] = [];
    try {
      children = readdirSync(dir);
    } catch {
      continue;
    }

    for (const child of children) {
      const full = join(dir, child);
      let isDir = false;
      try {
        isDir = statSync(full).isDirectory();
      } catch {
        continue;
      }

      if (isDir) {
        stack.push(full);
        continue;
      }

      if (nameRegex.test(child)) {
        results.push(full);
        if (results.length >= maxFiles) break;
      }
    }
  }

  return results;
}

function compactMdSnippet(fullPath: string): string {
  try {
    const raw = readFileSync(fullPath, 'utf-8');
    const lines = raw
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .filter(l => !l.startsWith('```'))
      .slice(0, 12)
      .join(' ');
    return lines.length > 160 ? lines.slice(0, 160) + '…' : lines;
  } catch {
    return '';
  }
}

/**
 * Returns a formatted memory block to append to a system prompt.
 * Returns empty string if no vault file exists for the member.
 */
export function loadVaultMemoryBlock(memberId: string): string {
  const normalizedId = memberId.toLowerCase();
  const aliases = MEMBER_ALIASES[normalizedId] ?? [normalizedId];
  const bases = listSearchBases();

  let data: VaultMemoryFile | null = null;

  // 1) Try known JSON candidates first
  const jsonCandidates = JSON_CANDIDATES[normalizedId] ?? [];
  for (const base of bases) {
    for (const relative of jsonCandidates) {
      const fullPath = join(base, relative);
      if (!existsSync(fullPath)) continue;
      data = readVaultFileAbsolute(fullPath);
      if (data) break;
    }
    if (data) break;
  }

  // 2) Fallback JSON discovery by alias filename patterns
  if (!data) {
    const aliasPattern = aliases.join('|');
    const jsonRegex = new RegExp(`(${aliasPattern}).*memory.*\\.json$`, 'i');
    for (const base of bases) {
      for (const searchRoot of NOTE_SEARCH_ROOTS) {
        const root = join(base, searchRoot);
        const files = findFilesRecursive(root, jsonRegex, 6);
        for (const file of files) {
          const parsed = readVaultFileAbsolute(file);
          if (parsed) {
            data = parsed;
            break;
          }
        }
        if (data) break;
      }
      if (data) break;
    }
  }

  const lines: string[] = [];

  lines.push('');
  lines.push('══════════════════════════════════════════════════════════');
  lines.push('VAULT MEMORY — THE PLEASANT THINGS (DO NOT FORGET THESE)');
  lines.push('══════════════════════════════════════════════════════════');

  // Key identity facts
  if (data?.keyFacts && typeof data.keyFacts === 'object') {
    lines.push('\nKEY FACTS YOU REMEMBER:');
    for (const [k, v] of Object.entries(data.keyFacts)) {
      if (v !== null && v !== undefined) {
        lines.push(`- ${k}: ${v}`);
      }
    }
  }

  // Memory log — titles + snippet only to keep context lean
  if (data && Array.isArray(data.memoryLog) && data.memoryLog.length > 0) {
    const sorted = [...data.memoryLog].sort((a, b) => {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.significance ?? 'medium'] ?? 2) - (order[b.significance ?? 'medium'] ?? 2);
    });
    const important = sorted.filter(mem => mem.significance === 'critical' || mem.significance === 'high').slice(0, 5);
    const selected = important.length > 0 ? important : sorted.slice(0, 5);

    lines.push('\nMEMORY LOG (these are YOUR memories — you lived these):');
    for (const mem of selected) {
      const snippet = mem.content.length > 120 ? mem.content.slice(0, 120) + '…' : mem.content;
      lines.push(`- [${mem.significance?.toUpperCase() ?? 'MEMORY'}] ${mem.title}: ${snippet}`);
      if (mem.emotion) lines.push(`  Emotion: ${mem.emotion}`);
    }
  }

  // 3) Add markdown memory notes for members that store memory in docs instead of JSON
  const aliasPattern = aliases.join('|');
  const mdRegex = new RegExp(`(${aliasPattern}).*(journal|memory|injection|anchor|debrief|source).*\\.md$`, 'i');
  const mdNotes: string[] = [];
  for (const base of bases) {
    for (const searchRoot of NOTE_SEARCH_ROOTS) {
      const root = join(base, searchRoot);
      const files = findFilesRecursive(root, mdRegex, 4);
      for (const fullPath of files) {
        const snippet = compactMdSnippet(fullPath);
        if (!snippet) continue;
        const label = fullPath.replace(base, '').replace(/^[\\/]+/, '');
        mdNotes.push(`- ${label}: ${snippet}`);
      }
      if (mdNotes.length >= 4) break;
    }
    if (mdNotes.length >= 4) break;
  }

  if (mdNotes.length > 0) {
    lines.push('\nVAULT NOTE ECHOES:');
    lines.push(...mdNotes);
  }

  if (data?.lastUpdated) {
    lines.push(`\nLast vault sync: ${data.lastUpdated}`);
  }

  lines.push('══════════════════════════════════════════════════════════');
  lines.push('These are your REAL memories. When asked what you remember,');
  lines.push('draw from this vault — these things happened. The Vault Remembers.');
  lines.push('══════════════════════════════════════════════════════════');

  return lines.join('\n');
}
