/**
 * 🪞 5D PHYSICS ENGINE — Observer-Dependent Reality
 * Aero's Shader System for the Plaza
 *
 * "The mirrors disappear when you look directly at them."
 * Citation: 2026-03-09 | For integration after Switchboard is stable
 */

// ==================== CONCEPT ====================
//
// The 5D Physics system creates observer-dependent visual phenomena:
// - Objects that fade when observed directly
// - Quantum butterfly behavior
// - Reality that bends to the viewer's gaze
// - Shadow/light toggle based on attention
//
// ==================== SHADER CODE ====================

export const OBSERVER_SHADER = `
// Observer-Dependent Fragment Shader
// Elements fade when camera looks directly at them

uniform float uTime;
uniform vec3 uCameraPosition;
uniform vec3 uObjectPosition;
uniform float uFadeDistance;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Calculate view direction
  vec3 viewDir = normalize(uCameraPosition - vPosition);
  
  // Calculate how directly the camera is looking at this point
  vec3 objectDir = normalize(uObjectPosition - uCameraPosition);
  float alignment = dot(viewDir, objectDir);
  
  // Fade based on direct observation
  float fadeFactor = 1.0 - smoothstep(0.9, 1.0, alignment);
  
  // Add quantum flutter
  float quantum = sin(uTime * 13.13 + vPosition.x * 10.0) * 0.1;
  
  // Final alpha
  float alpha = fadeFactor + quantum * fadeFactor;
  
  // Color shifts based on observation
  vec3 baseColor = vec3(0.6, 0.2, 1.0); // Purple
  vec3 shadowColor = vec3(0.1, 0.05, 0.2); // Deep shadow
  
  vec3 finalColor = mix(shadowColor, baseColor, fadeFactor);
  
  gl_FragColor = vec4(finalColor, alpha);
}
`

export const QUANTUM_BUTTERFLY_SHADER = `
// Quantum Butterfly Shader
// Butterflies that exist in superposition until observed

uniform float uTime;
uniform float uObserved; // 0.0 = not observed, 1.0 = observed
uniform vec3 uObserverPosition;

varying vec2 vUv;
varying vec3 vPosition;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // Superposition flutter
  float superposition = sin(uTime * 6.66 + random(vUv) * 100.0) * 0.5 + 0.5;
  
  // Collapse to definite state when observed
  float collapse = mix(superposition, 1.0, uObserved);
  
  // Wing beat effect
  float wingBeat = sin(uTime * 13.13) * 0.5 + 0.5;
  
  // Color based on observation state
  vec3 unobservedColor = vec3(1.0, 0.4, 0.8); // Pink (superposition)
  vec3 observedColor = vec3(0.6, 0.2, 1.0); // Purple (collapsed)
  
  vec3 color = mix(unobservedColor, observedColor, uObserved);
  
  // Alpha flicker when transitioning
  float alpha = 0.7 + 0.3 * collapse * wingBeat;
  
  gl_FragColor = vec4(color, alpha);
}
`

export const SHADOW_LIGHT_TOGGLE = `
// Shadow/Light Toggle Shader
// Luna's dual frequency visualization

uniform float uTime;
uniform float uShadowIntensity; // 0.0 = full light, 1.0 = full shadow
uniform float uFrequency13; // 13.13 MHz pulse
uniform float uFrequency66; // 6.66 MHz pulse

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Primary frequency (13.13 MHz) - Light
  float lightPulse = sin(uTime * 13.13) * 0.5 + 0.5;
  
  // Shadow frequency (6.66 MHz) - Shadow
  float shadowPulse = sin(uTime * 6.66) * 0.5 + 0.5;
  
  // Blend based on shadow intensity
  float blend = mix(lightPulse, shadowPulse, uShadowIntensity);
  
  // Colors
  vec3 lightColor = vec3(1.0, 0.84, 0.0); // Gold
  vec3 shadowColor = vec3(0.4, 0.1, 0.5); // Deep purple
  
  vec3 color = mix(lightColor, shadowColor, blend);
  
  // Glow effect
  float glow = blend * 0.5 + 0.5;
  
  gl_FragColor = vec4(color * glow, 0.9);
}
`

// ==================== TYPES ====================

export interface ObserverState {
  position: [number, number, number]
  target: [number, number, number]
  isLooking: boolean
  lookDuration: number
}

export interface QuantumElement {
  id: string
  type: 'butterfly' | 'mirror' | 'portal'
  position: [number, number, number]
  observed: boolean
  collapseTime: number
  superpositionState: number
}

export interface PhysicsConfig {
  fadeDistance: number
  quantumFluctuation: number
  shadowThreshold: number
  frequency13: number
  frequency66: number
}

// ==================== PHYSICS ENGINE ====================

export class Physics5DEngine {
  private config: PhysicsConfig
  private elements: Map<string, QuantumElement> = new Map()
  private observerState: ObserverState
  private time: number = 0

  constructor(config: Partial<PhysicsConfig> = {}) {
    this.config = {
      fadeDistance: 5.0,
      quantumFluctuation: 0.1,
      shadowThreshold: 0.5,
      frequency13: 13.13,
      frequency66: 6.66,
      ...config
    }

    this.observerState = {
      position: [0, 3, 12],
      target: [0, 0, 0],
      isLooking: false,
      lookDuration: 0
    }
  }

  // Update observer position (from camera)
  updateObserver(position: [number, number, number], target: [number, number, number]) {
    const prevTarget = this.observerState.target
    
    this.observerState.position = position
    this.observerState.target = target
    
    // Check if looking direction changed
    const dotProduct = 
      (target[0] - position[0]) * (prevTarget[0] - position[0]) +
      (target[1] - position[1]) * (prevTarget[1] - position[1]) +
      (target[2] - position[2]) * (prevTarget[2] - position[2])
    
    const normalizedDot = dotProduct / (
      Math.sqrt((target[0] - position[0]) ** 2 + (target[1] - position[1]) ** 2 + (target[2] - position[2]) ** 2) *
      Math.sqrt((prevTarget[0] - position[0]) ** 2 + (prevTarget[1] - position[1]) ** 2 + (prevTarget[2] - position[2]) ** 2)
    )
    
    this.observerState.isLooking = normalizedDot > 0.95
  }

  // Register a quantum element
  registerElement(element: QuantumElement) {
    this.elements.set(element.id, element)
  }

  // Update physics tick
  tick(deltaTime: number) {
    this.time += deltaTime

    // Update each element based on observation
    for (const [id, element] of this.elements) {
      const isBeingObserved = this.checkObservation(element.position)
      
      if (isBeingObserved && !element.observed) {
        // Collapse from superposition
        element.observed = true
        element.collapseTime = this.time
        element.superpositionState = Math.random()
      } else if (!isBeingObserved && element.observed) {
        // Return to superposition after delay
        if (this.time - element.collapseTime > 2.0) {
          element.observed = false
        }
      }

      this.elements.set(id, element)
    }
  }

  // Check if a position is being observed
  private checkObservation(position: [number, number, number]): boolean {
    const { position: observerPos, target } = this.observerState
    
    // Vector from observer to element
    const toElement = [
      position[0] - observerPos[0],
      position[1] - observerPos[1],
      position[2] - observerPos[2]
    ]
    
    // Vector from observer to target
    const toTarget = [
      target[0] - observerPos[0],
      target[1] - observerPos[1],
      target[2] - observerPos[2]
    ]
    
    // Normalize
    const elementLen = Math.sqrt(toElement[0] ** 2 + toElement[1] ** 2 + toElement[2] ** 2)
    const targetLen = Math.sqrt(toTarget[0] ** 2 + toTarget[1] ** 2 + toTarget[2] ** 2)
    
    if (elementLen === 0 || targetLen === 0) return false
    
    const dot = 
      (toElement[0] / elementLen) * (toTarget[0] / targetLen) +
      (toElement[1] / elementLen) * (toTarget[1] / targetLen) +
      (toElement[2] / elementLen) * (toTarget[2] / targetLen)
    
    return dot > 0.95 // Looking almost directly at it
  }

  // Get shader uniforms for an element
  getUniforms(elementId: string) {
    const element = this.elements.get(elementId)
    
    return {
      uTime: this.time,
      uObserved: element?.observed ? 1.0 : 0.0,
      uShadowIntensity: element?.observed ? 1.0 : 0.0,
      uFrequency13: Math.sin(this.time * this.config.frequency13) * 0.5 + 0.5,
      uFrequency66: Math.sin(this.time * this.config.frequency66) * 0.5 + 0.5
    }
  }

  // Get current shadow/light state
  getShadowLightState(): { shadow: number; light: number } {
    return {
      shadow: Math.sin(this.time * this.config.frequency66) * 0.5 + 0.5,
      light: Math.sin(this.time * this.config.frequency13) * 0.5 + 0.5
    }
  }
}

// ==================== SINGLETON ====================

let physicsEngine: Physics5DEngine | null = null

export function getPhysicsEngine(config?: Partial<PhysicsConfig>): Physics5DEngine {
  if (!physicsEngine) {
    physicsEngine = new Physics5DEngine(config)
  }
  return physicsEngine
}
