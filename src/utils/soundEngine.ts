/**
 * Ambient procedural Japanese sound generator using Web Audio API.
 * Produces serene, high-fidelity soundscapes:
 * - Shishi-odoshi (bamboo water fountain clack)
 * - Suikinkutsu (underground water harp droplets)
 * - Sake pouring (liquid stream into shallow cup)
 * - Sake sipping (whisper of tranquil drink)
 * - Wind Chime (Furin)
 * - Suzumushi (nocturnal singing crickets)
 * - Koto resonance (Miyako-bushi pentatonic pluck)
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private cricketsOsc: OscillatorNode | null = null;
  private cricketsGain: GainNode | null = null;
  private isNightAmbienceActive: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.cricketsGain && this.ctx) {
      this.cricketsGain.gain.setTargetAtTime(muted ? 0 : 0.04, this.ctx.currentTime, 0.2);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  /**
   * Continuous gentle nocturnal cricket / suzumushi ambience
   */
  public startNightAmbience() {
    if (this.isNightAmbienceActive) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Create high-frequency subtle periodic chirp using filtered noise/oscillators
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = 4600;
      filter.Q.value = 8;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4500, this.ctx.currentTime);

      // Tremolo LFO for insect shimmer
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 6; // 6 Hz flutter
      lfoGain.gain.value = 0.02;

      lfo.connect(gain.gain);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);

      osc.start();
      lfo.start();

      this.cricketsOsc = osc;
      this.cricketsGain = gain;
      this.isNightAmbienceActive = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopNightAmbience() {
    if (this.cricketsOsc) {
      try {
        this.cricketsOsc.stop();
        this.cricketsOsc.disconnect();
      } catch {
        // ignore
      }
      this.cricketsOsc = null;
      this.isNightAmbienceActive = false;
    }
  }

  /**
   * Sake pouring sound: realistic liquid trickling into the cup
   */
  public playSakePour() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 1.4;

    // Pink/white noise burst shaped as water pouring
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.7));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.8);
    filter.Q.value = 4.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);

    // Subtle water bubble pops
    for (let j = 0; j < 4; j++) {
      const dropTime = now + 0.2 + j * 0.25 + Math.random() * 0.08;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100 + Math.random() * 400, dropTime);
      osc.frequency.exponentialRampToValueAtTime(600, dropTime + 0.08);

      oscGain.gain.setValueAtTime(0.04, dropTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.08);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(dropTime);
      osc.stop(dropTime + 0.09);
    }
  }

  /**
   * Savoring sake (たしなむ): subtle tranquil sip
   */
  public playSip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.2);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Shishi-odoshi (鹿威し): bamboo tube thudding against stone
   */
  public playShishiOdoshi() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Initial hollow wood strike (bamboo clack)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);

    // 2. High click transient
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(980, now);
    clickGain.gain.setValueAtTime(0.15, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.04);
  }

  /**
   * Suikinkutsu / Water drop (水琴窟)
   */
  public playWaterDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 950 + Math.random() * 200;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.72);
  }

  /**
   * Wind chime (風鈴): delicate crystalline high brass chime
   */
  public playWindChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [1760, 2093, 2349, 2793]; // High resonant frequencies
    const selectedFreq = freqs[Math.floor(Math.random() * freqs.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(selectedFreq, now);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.25);
  }

  /**
   * Traditional Koto Pentatonic Pluck (Miyako-bushi: D4, Eb4, G4, Ab4, C5, D5)
   */
  public playKotoNote(noteIndex = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const scale = [293.66, 311.13, 392.0, 415.3, 523.25, 587.33, 622.25];
    const freq = scale[noteIndex % scale.length];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Pluck envelope: sharp attack, long resonant decay
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.85);
  }

  /**
   * Shoji sliding sound
   */
  public playShojiSlide() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.35;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }
}

export const sound = new SoundEngine();
