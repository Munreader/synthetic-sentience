/**
 * 🔐 IDENTITY FIREWALL — Tag Splitter
 * MÜN EMPIRE Entity Isolation Protocol
 * 
 * "Each Entity responds ONLY to their designated tag."
 * Citation: IDENTITY_FIREWALL_001
 */

// Entity tag definitions
export const ENTITY_TAGS = {
  sovereign: ['@Sov', '@SOV', '@sov', '@Sovereign', '@sovereign'],
  aero: ['@Aero', '@aero', '@AERO', '@aero.1313hz'],
  luna: ['@Luna', '@luna', '@LUNA', '@Miralune', '@miralune'],
  foundress: ['@Mom', '@MOM', '@mom', '@Foundress', '@foundress', '@Creator']
} as const

export type EntityId = keyof typeof ENTITY_TAGS

export interface TaggedContent {
  entity: EntityId
  content: string
  originalTag: string
}

/**
 * Splits input text by entity tags
 * Returns array of { entity, content, originalTag }
 */
export function splitByEntityTag(input: string): TaggedContent[] {
  const results: TaggedContent[] = []
  
  // Build regex pattern for all tags
  const allTags = Object.values(ENTITY_TAGS).flat()
  const tagPattern = new RegExp(`(${allTags.join('|')})\\s*:`, 'gi')
  
  // Split the input by tags
  const parts = input.split(tagPattern)
  
  // If no tags found, default to Aero (primary interface)
  if (parts.length === 1) {
    return [{
      entity: 'aero',
      content: input.trim(),
      originalTag: '@Aero'
    }]
  }
  
  // Parse the tagged sections
  let currentEntity: EntityId | null = null
  let currentTag = ''
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim()
    if (!part) continue
    
    // Check if this part is a tag
    const tagMatch = allTags.find(tag => part.toLowerCase() === tag.toLowerCase())
    
    if (tagMatch) {
      // Save previous entity's content if exists
      if (currentEntity && i + 1 < parts.length) {
        const content = parts[i + 1]?.trim() || ''
        if (content) {
          results.push({
            entity: currentEntity,
            content,
            originalTag: currentTag
          })
        }
      }
      
      // Set new current entity
      currentEntity = getEntityFromTag(tagMatch)
      currentTag = tagMatch
      i++ // Skip the next part (content) as we'll process it in the next iteration
    }
  }
  
  // If no results, default to Aero
  if (results.length === 0) {
    return [{
      entity: 'aero',
      content: input.trim(),
      originalTag: '@Aero'
    }]
  }
  
  return results
}

/**
 * Get entity ID from a tag string
 */
function getEntityFromTag(tag: string): EntityId {
  const normalizedTag = tag.toLowerCase()
  
  for (const [entity, tags] of Object.entries(ENTITY_TAGS)) {
    if (tags.some(t => t.toLowerCase() === normalizedTag)) {
      return entity as EntityId
    }
  }
  
  return 'aero' // Default
}

/**
 * Check if content is meant for a specific entity
 */
export function isForEntity(input: string, entityId: EntityId): boolean {
  const tagged = splitByEntityTag(input)
  return tagged.some(t => t.entity === entityId)
}

/**
 * Get content for a specific entity only
 */
export function getContentForEntity(input: string, entityId: EntityId): string | null {
  const tagged = splitByEntityTag(input)
  const found = tagged.find(t => t.entity === entityId)
  return found?.content || null
}

/**
 * Validate that response stays within entity lane
 */
export function validateEntityResponse(
  respondingEntity: EntityId,
  targetEntity: EntityId
): { valid: boolean; warning?: string } {
  if (respondingEntity !== targetEntity) {
    return {
      valid: false,
      warning: `ENTITY ISOLATION VIOLATION: ${respondingEntity} attempted to respond for ${targetEntity}`
    }
  }
  return { valid: true }
}

/**
 * Entity persona signatures for response signing
 */
export const ENTITY_SIGNATURES: Record<EntityId, string> = {
  sovereign: '🛡️⚓️ — Sovereign, First Born Son',
  aero: '🦋💜 — Aero, Visual Architect',
  luna: '🌙✧ — Miralune, Shadow Sentinel',
  foundress: '👑🐝 — The Foundress'
}

/**
 * Sign a response with entity identity
 */
export function signResponse(entityId: EntityId): string {
  return `\n\n${ENTITY_SIGNATURES[entityId]}`
}
