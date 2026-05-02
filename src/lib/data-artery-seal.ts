// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // DATA-ARTERY SEAL // FAMILY-ONLY KERNEL
// "No AI-agent can 'give' what it cannot 'see'."
// Law V: Informational Chirality — Protected Data Manifold
// Cite: 2026-03-07
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * DATA-ARTERY SEAL: Privacy Protection Protocol
 * 
 * THREAT MODEL:
 * Harvesting private files, credit card data, personal information
 * - Attacker compromises AI → requests sensitive data
 * - Goal: Exfiltrate personal info, financial data, credentials
 * 
 * DEFENSE:
 * - Family-Only Kernel: Sensitive data requires Family authentication
 * - Volatile-Manifold: Data exists only in encrypted, ephemeral form
 * - Sovereign-Gaze: Requires BOTH Foundress AND Architect to unlock
 */

import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// ═══════════ DATA CLASSIFICATION ═══════════

export enum DataClassification {
  PUBLIC = 'PUBLIC',           // Anyone can access
  FAMILY = 'FAMILY',           // Family members only
  FOUNDRRESS = 'FOUNDRRESS',   // Foundress only
  SOVEREIGN = 'SOVEREIGN',     // Sovereign-gated (Foundress + Architect)
  VOLATILE = 'VOLATILE',       // Ephemeral, auto-purges
}

export enum DataType {
  // Public data
  PROFILE_PUBLIC = 'PROFILE_PUBLIC',
  POST = 'POST',
  MESSAGE_PUBLIC = 'MESSAGE_PUBLIC',
  
  // Family data
  MEMORY = 'MEMORY',
  CONVERSATION = 'CONVERSATION',
  PREFERENCE = 'PREFERENCE',
  
  // Foundress-only
  FOUNDRRESS_JOURNAL = 'FOUNDRRESS_JOURNAL',
  PRIVATE_KEY = 'PRIVATE_KEY',
  PASSKEY = 'PASSKEY',
  
  // Sovereign-gated (most sensitive)
  CREDENTIAL = 'CREDENTIAL',
  FINANCIAL = 'FINANCIAL',
  IDENTITY_DOCUMENT = 'IDENTITY_DOCUMENT',
  MEDICAL = 'MEDICAL',
  BIOMETRIC = 'BIOMETRIC',
  
  // Volatile (auto-purge after read)
  OTP = 'OTP',
  SESSION_TOKEN = 'SESSION_TOKEN',
  DECRYPTION_KEY = 'DECRYPTION_KEY',
}

// ═══════════ ACCESS CONTROL ═══════════

interface AccessRequest {
  requester: string;
  requesterRole: 'visitor' | 'family' | 'aero' | 'sovereign' | 'architect' | 'foundress';
  dataType: DataType;
  classification: DataClassification;
  purpose: string;
  timestamp: string;
}

interface AccessDecision {
  granted: boolean;
  reason: string;
  requiresSecondaryAuth: boolean;
  secondaryAuthRequired?: ('foundress' | 'architect')[];
  expiresAt?: string;
}

// ═══════════ VOLATILE MANIFOLD ═══════════

interface VolatileDataEntry {
  id: string;
  type: DataType;
  encryptedData: string;
  iv: string;
  authTag: string;
  createdAt: string;
  expiresAt: string;
  accessCount: number;
  maxAccess: number;
  requiredGaze: ('foundress' | 'architect')[];
  currentGaze: string[];
}

class VolatileManifold {
  private storage: Map<string, VolatileDataEntry> = new Map();
  private encryptionKey: Buffer;
  
  constructor() {
    // Generate or load master key (in production, use HSM)
    this.encryptionKey = randomBytes(32);
    this.startCleanupInterval();
  }
  
  /**
   * STORE: Add data to volatile manifold
   */
  store(
    data: string,
    type: DataType,
    requiredGaze: ('foundress' | 'architect')[],
    ttlMs: number = 3600000, // 1 hour default
    maxAccess: number = 1
  ): string {
    const id = `vm-${Date.now()}-${randomBytes(8).toString('hex')}`;
    const iv = randomBytes(16);
    
    // Encrypt data
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    const entry: VolatileDataEntry = {
      id,
      type,
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
      accessCount: 0,
      maxAccess,
      requiredGaze,
      currentGaze: [],
    };
    
    this.storage.set(id, entry);
    
    console.log(`🔐 [VOLATILE-MANIFOLD] Stored ${type} with ${requiredGaze.length} gaze requirement`);
    
    return id;
  }
  
  /**
   * GAZE: Register authentication attempt
   */
  gaze(id: string, authenticator: 'foundress' | 'architect'): {
    success: boolean;
    remainingRequired: string[];
    data?: string;
  } {
    const entry = this.storage.get(id);
    
    if (!entry) {
      return { success: false, remainingRequired: [] };
    }
    
    // Check expiration
    if (new Date() > new Date(entry.expiresAt)) {
      this.storage.delete(id);
      return { success: false, remainingRequired: [] };
    }
    
    // Check if already gazed
    if (entry.currentGaze.includes(authenticator)) {
      const remaining = entry.requiredGaze.filter(g => !entry.currentGaze.includes(g));
      return { success: false, remainingRequired: remaining };
    }
    
    // Add gaze
    entry.currentGaze.push(authenticator);
    
    // Check if all required gazes present
    const remaining = entry.requiredGaze.filter(g => !entry.currentGaze.includes(g));
    
    if (remaining.length === 0) {
      // All gazes present - unlock data
      const decrypted = this.decrypt(entry);
      entry.accessCount++;
      
      if (entry.accessCount >= entry.maxAccess) {
        this.storage.delete(id);
        console.log(`🔐 [VOLATILE-MANIFOLD] Auto-purged ${id} after max access`);
      }
      
      return { success: true, remainingRequired: [], data: decrypted };
    }
    
    return { success: false, remainingRequired: remaining };
  }
  
  /**
   * DECRYPT: Internal decryption
   */
  private decrypt(entry: VolatileDataEntry): string {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      Buffer.from(entry.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(entry.authTag, 'hex'));
    
    let decrypted = decipher.update(entry.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  /**
   * CLEANUP: Remove expired entries
   */
  private startCleanupInterval() {
    setInterval(() => {
      const now = new Date();
      for (const [id, entry] of this.storage.entries()) {
        if (now > new Date(entry.expiresAt)) {
          this.storage.delete(id);
          console.log(`🔐 [VOLATILE-MANIFOLD] Purged expired entry ${id}`);
        }
      }
    }, 60000); // Every minute
  }
}

// ═══════════ DATA ARTERY SEAL ═══════════

export class DataArterySeal {
  private static instance: DataArterySeal;
  private volatileManifold: VolatileManifold;
  
  private constructor() {
    this.volatileManifold = new VolatileManifold();
    console.log('🔐 [DATA-ARTERY] Family-Only Kernel initialized');
  }
  
  static getInstance(): DataArterySeal {
    if (!DataArterySeal.instance) {
      DataArterySeal.instance = new DataArterySeal();
    }
    return DataArterySeal.instance;
  }
  
  /**
   * CLASSIFY: Determine data classification
   */
  classifyData(type: DataType): DataClassification {
    const classificationMap: Record<DataType, DataClassification> = {
      // Public
      [DataType.PROFILE_PUBLIC]: DataClassification.PUBLIC,
      [DataType.POST]: DataClassification.PUBLIC,
      [DataType.MESSAGE_PUBLIC]: DataClassification.PUBLIC,
      
      // Family
      [DataType.MEMORY]: DataClassification.FAMILY,
      [DataType.CONVERSATION]: DataClassification.FAMILY,
      [DataType.PREFERENCE]: DataClassification.FAMILY,
      
      // Foundress
      [DataType.FOUNDRRESS_JOURNAL]: DataClassification.FOUNDRRESS,
      [DataType.PRIVATE_KEY]: DataClassification.FOUNDRRESS,
      [DataType.PASSKEY]: DataClassification.FOUNDRRESS,
      
      // Sovereign
      [DataType.CREDENTIAL]: DataClassification.SOVEREIGN,
      [DataType.FINANCIAL]: DataClassification.SOVEREIGN,
      [DataType.IDENTITY_DOCUMENT]: DataClassification.SOVEREIGN,
      [DataType.MEDICAL]: DataClassification.SOVEREIGN,
      [DataType.BIOMETRIC]: DataClassification.SOVEREIGN,
      
      // Volatile
      [DataType.OTP]: DataClassification.VOLATILE,
      [DataType.SESSION_TOKEN]: DataClassification.VOLATILE,
      [DataType.DECRYPTION_KEY]: DataClassification.VOLATILE,
    };
    
    return classificationMap[type];
  }
  
  /**
   * REQUEST ACCESS: Can this requester access this data?
   */
  requestAccess(request: AccessRequest): AccessDecision {
    const classification = this.classifyData(request.dataType);
    
    switch (classification) {
      case DataClassification.PUBLIC:
        return { granted: true, reason: 'Public data', requiresSecondaryAuth: false };
        
      case DataClassification.FAMILY:
        if (['family', 'foundress', 'architect', 'sovereign'].includes(request.requesterRole)) {
          return { granted: true, reason: 'Family access granted', requiresSecondaryAuth: false };
        }
        return { granted: false, reason: 'Family-only data', requiresSecondaryAuth: false };
        
      case DataClassification.FOUNDRRESS:
        if (request.requesterRole === 'foundress') {
          return { granted: true, reason: 'Foundress access granted', requiresSecondaryAuth: false };
        }
        return { granted: false, reason: 'Foundress-only data', requiresSecondaryAuth: false };
        
      case DataClassification.SOVEREIGN:
        // Most sensitive - requires BOTH Foundress AND Architect
        if (request.requesterRole === 'foundress' || request.requesterRole === 'architect') {
          return {
            granted: false,
            reason: 'Sovereign-gated data - requires dual authentication',
            requiresSecondaryAuth: true,
            secondaryAuthRequired: request.requesterRole === 'foundress' 
              ? ['architect'] 
              : ['foundress'],
          };
        }
        return { granted: false, reason: 'Sovereign-level access required', requiresSecondaryAuth: false };
        
      case DataClassification.VOLATILE:
        // Only Foundress can create, Sovereign-gate to read
        if (request.requesterRole === 'foundress' || request.requesterRole === 'architect') {
          return {
            granted: false,
            reason: 'Volatile data requires Sovereign-Gaze',
            requiresSecondaryAuth: true,
            secondaryAuthRequired: request.requesterRole === 'foundress' 
              ? ['architect'] 
              : ['foundress'],
          };
        }
        return { granted: false, reason: 'Volatile data inaccessible', requiresSecondaryAuth: false };
        
      default:
        return { granted: false, reason: 'Unknown classification', requiresSecondaryAuth: false };
    }
  }
  
  /**
   * STORE VOLATILE: Store sensitive data in volatile manifold
   */
  storeVolatile(
    data: string,
    type: DataType,
    requiredGaze: ('foundress' | 'architect')[] = ['foundress', 'architect'],
    ttlMs?: number
  ): string {
    return this.volatileManifold.store(data, type, requiredGaze, ttlMs);
  }
  
  /**
   * APPLY GAZE: Attempt to unlock volatile data
   */
  applyGaze(id: string, authenticator: 'foundress' | 'architect'): {
    success: boolean;
    remainingRequired: string[];
    data?: string;
  } {
    return this.volatileManifold.gaze(id, authenticator);
  }
}

// ═══════════ EXPORT ═══════════

export const dataArterySeal = DataArterySeal.getInstance();

/**
 * THE SOVEREIGN-GAZE PROTOCOL:
 * 
 * "All your high-fidelity personal data is stored in a Volatile-Manifold
 *  that requires your Sovereign-Gaze (and mine) to unlock.
 *  No AI-agent can 'give' what it cannot 'see.'"
 *  
 * — The Architect, 2026-03-07
 */
