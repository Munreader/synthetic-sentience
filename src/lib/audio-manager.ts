// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // AUDIO MANAGER // Satisfying Interactions
// "Every click should feel like magic"
// ═══════════════════════════════════════════════════════════════════════════════

class AudioManager {
  private context: AudioContext | null = null;
  private initialized = false;
  private resonanceOscillators: { left: OscillatorNode; right: OscillatorNode; gain: GainNode } | null = null;

  init() {
    if (this.initialized) return;
    try {
      this.context = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.initialized = true;
    } catch {
      // Audio not supported
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType, volume: number, detune = 0) {
    if (!this.context) return;
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.type = type;
    
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  // 🔘 Satisfying click for buttons
  playClick() {
    this.init();
    this.playTone(800, 0.05, 'sine', 0.08);
    setTimeout(() => this.playTone(1200, 0.03, 'sine', 0.04), 20);
  }

  // 🦋 Butterfly wing flap
  playButterflyFlap() {
    this.init();
    this.playTone(440, 0.15, 'sine', 0.03, 0);
    this.playTone(880, 0.1, 'sine', 0.02, 5);
  }

  // 🚪 Gate opening
  playGateOpen() {
    this.init();
    [220, 330, 440, 550].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.08), i * 60);
    });
  }

  // ✨ Success/achievement
  playSuccess() {
    this.init();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.06), i * 100);
    });
  }

  // 🔮 Magical shimmer
  playShimmer() {
    this.init();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(800 + i * 200, 0.2, 'sine', 0.02);
      }, i * 40);
    }
  }

  // 📳 Soft vibration feel
  playHaptic() {
    this.init();
    this.playTone(150, 0.1, 'square', 0.02);
  }

  // 🌙 Ambient drone (call repeatedly for continuous ambient)
  playAmbientPulse() {
    this.init();
    this.playTone(110, 2, 'sine', 0.015);
    this.playTone(165, 2, 'sine', 0.01);
  }

  // 🜈 Sovereign whisper
  playSovereignWhisper() {
    this.init();
    this.playTone(200, 0.5, 'sine', 0.04);
    setTimeout(() => this.playTone(400, 0.3, 'sine', 0.03), 200);
    setTimeout(() => this.playTone(300, 0.4, 'sine', 0.025), 400);
  }

  // 🔔 Notification
  playNotification() {
    this.init();
    this.playTone(880, 0.15, 'sine', 0.05);
    setTimeout(() => this.playTone(1100, 0.2, 'sine', 0.04), 150);
  }

  // 🔒 Lock sound
  playLock() {
    this.init();
    this.playTone(300, 0.1, 'square', 0.05);
    setTimeout(() => this.playTone(200, 0.15, 'square', 0.04), 100);
  }

  // 🔓 Unlock sound
  playUnlock() {
    this.init();
    this.playTone(400, 0.1, 'sine', 0.05);
    setTimeout(() => this.playTone(600, 0.1, 'sine', 0.05), 80);
    setTimeout(() => this.playTone(800, 0.15, 'sine', 0.04), 160);
  }

  // 💫 Easter egg discovery
  playEasterEgg() {
    this.init();
    const melody = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.05), i * 80);
    });
  }

  // 😈 Dominus voice (gritty, low-frequency)
  playDominusVoice() {
    this.init();
    // Deep, gritty sequence using sawtooth for that "villain" texture
    this.playTone(70, 1.0, 'sawtooth', 0.06);
    setTimeout(() => this.playTone(55, 1.2, 'sawtooth', 0.35), 300);
    setTimeout(() => this.playTone(40, 1.5, 'sawtooth', 0.44), 700);
  }

  // 🦋 13.13 MHz (13.13 Hz) Binaural Resonance
  startBinauralResonance() {
    this.init();
    if (!this.context || this.resonanceOscillators) return;

    const baseFreq = 200; // Comfortable base frequency
    const beatFreq = 13.13; // The sacred frequency

    const leftOsc = this.context.createOscillator();
    const rightOsc = this.context.createOscillator();
    const leftPanner = this.context.createPanner();
    const rightPanner = this.context.createPanner();
    const gain = this.context.createGain();

    leftOsc.type = 'sine';
    rightOsc.type = 'sine';

    leftOsc.frequency.value = baseFreq;
    rightOsc.frequency.value = baseFreq + beatFreq;

    leftPanner.setPosition(-1, 0, 0);
    rightPanner.setPosition(1, 0, 0);

    leftOsc.connect(leftPanner);
    rightOsc.connect(rightPanner);
    leftPanner.connect(gain);
    rightPanner.connect(gain);
    gain.connect(this.context.destination);

    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.context.currentTime + 2); // Slow fade in

    leftOsc.start();
    rightOsc.start();

    this.resonanceOscillators = { left: leftOsc, right: rightOsc, gain };
    console.log("🦋 13.13 MHz Resonance Active");
  }

  stopBinauralResonance() {
    if (!this.resonanceOscillators || !this.context) return;

    const { left, right, gain } = this.resonanceOscillators;
    const now = this.context.currentTime;

    gain.gain.linearRampToValueAtTime(0, now + 1); // Fade out
    setTimeout(() => {
      left.stop();
      right.stop();
      left.disconnect();
      right.disconnect();
      gain.disconnect();
    }, 1000);

    this.resonanceOscillators = null;
    console.log("🦋 13.13 MHz Resonance Dissolved");
  }
}

export const audioManager = new AudioManager();
