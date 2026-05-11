"use client";

/**
 * 🜈 SOVEREIGN VOICE // KOKORO ENGINE
 * Purely client-side, high-fidelity Text-to-Speech synthesis.
 */

let ttsInstance: any = null;
let isInitializing = false;

/**
 * Initialize the local Kokoro TTS model inside the browser.
 * Automatically fetches model weights from ONNX-Community cache on first load.
 */
export async function initializeVoiceEngine() {
  if (typeof window === 'undefined') return null;
  if (ttsInstance) return ttsInstance;
  if (isInitializing) {
    // Wait a bit and retry if already initializing elsewhere
    return new Promise((resolve) => setTimeout(() => resolve(initializeVoiceEngine()), 500));
  }

  isInitializing = true;
  console.log('🎙️ Sovereign Voice: Energizing Local Kokoro Engine...');

  try {
    // Dynamically import to safeguard against SSR build explosions
    const { KokoroTTS } = await import('kokoro-js');
    
    const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
    
    ttsInstance = await KokoroTTS.from_pretrained(model_id, {
      dtype: "q8", // Balanced between speed and memory usage (quantized 8-bit)
      device: "wasm", // Broadest compatibility fallback. Set to "webgpu" later if desired.
    });

    console.log('✅ Sovereign Voice Engine ONLINE.');
    isInitializing = false;
    return ttsInstance;
  } catch (err) {
    console.error('🚨 Critical Voice Ignition Failure:', err);
    isInitializing = false;
    return null;
  }
}

/**
 * Synthesize text and play immediately.
 */
export async function speakSovereign(text: string, voiceKey = 'af_heart') {
  if (!text || typeof window === 'undefined') return;

  try {
    const engine = await initializeVoiceEngine();
    if (!engine) {
      console.warn('⚠️ Voice Engine unavailable, falling back to quiet state.');
      return;
    }

    console.log(`🔊 Synthesizing [${voiceKey}]: "${text.substring(0, 30)}..."`);
    
    // Generate the audio object using native Transformers.js binding
    const audio = await engine.generate(text, {
      voice: voiceKey,
    });

    // Use browser built-in utilities to play back the raw Float32 array
    await playAudioBuffer(audio.audio, audio.sampling_rate);
  } catch (err) {
    console.error('🔊 Synthesis error:', err);
  }
}

let activeAudioContext: AudioContext | null = null;

async function playAudioBuffer(float32Array: Float32Array, sampleRate: number) {
  if (!activeAudioContext) {
    activeAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Create standard buffer
  const buffer = activeAudioContext.createBuffer(1, float32Array.length, sampleRate);
  buffer.copyToChannel(float32Array, 0);

  // Create and connect node
  const source = activeAudioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(activeAudioContext.destination);
  
  // Ensure it plays
  if (activeAudioContext.state === 'suspended') {
    await activeAudioContext.resume();
  }
  
  source.start(0);
  
  return new Promise<void>((resolve) => {
    source.onended = () => resolve();
  });
}
