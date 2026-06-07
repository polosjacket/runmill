/**
 * WebAudioSynth - Procedurally Synthesizer for Retro Sound Effects and Looping Music.
 * 
 * Uses the Web Audio API to create real-time oscillators, filters, noise nodes,
 * and gain envelopes without loading any external .mp3 or .wav assets.
 */
class WebAudioSynth {
  constructor() {
    this.ctx = null;              // AudioContext instance, created lazily on user interaction
    this.musicInterval = null;     // Interval timer for the background music sequencer
    this.isPlayingMusic = false;   // Flag tracking music playback state
    this.bpm = 110;               // Beats Per Minute for the background theme
    this.tempo = 60 / this.bpm;    // Duration of one beat in seconds
    this.step = 0;                // Current active step in the 16-step sequencer (0-15)
    this.nextNoteTime = 0.0;      // Time to schedule the next sequencer step
    
    // Default volumes and mute state
    this.musicVolume = 0.8;
    this.sfxVolume = 0.8;
    this.masterVolume = 0.8;
    this.musicMuted = false;
    this.sfxMuted = false;
    
    // Retrieve values from localStorage if present
    this.musicVolume = parseFloat(localStorage.getItem('runmill_music_volume') ?? '0.8');
    this.sfxVolume = parseFloat(localStorage.getItem('runmill_sfx_volume') ?? '0.8');
    this.masterVolume = parseFloat(localStorage.getItem('runmill_master_volume') ?? '0.8');
    this.musicMuted = localStorage.getItem('runmill_music_muted') === 'true';
    this.sfxMuted = localStorage.getItem('runmill_sfx_muted') === 'true';

    // 128-step Mario Overworld Theme Melody (0 = rest)
    this.marioMelody = [
      // Steps 0-15: Intro
      76, 76,  0, 76,  0, 72, 76,  0, 79,  0,  0,  0, 67,  0,  0,  0,
      // Steps 16-31: Part A1
      72,  0,  0, 67,  0,  0, 64,  0, 69,  0, 71,  0, 70, 69, 67,  0,
      // Steps 32-47: Part A2
      76, 79, 81,  0, 77, 79,  0, 76,  0, 72, 74, 71,  0,  0,  0,  0,
      // Steps 48-63: Part B1
      0, 79, 78, 77, 75,  0, 76,  0, 68, 69, 72,  0, 69, 72, 74,  0,
      // Steps 64-79: Part B2
      0, 79, 78, 77, 75,  0, 76,  0, 84,  0, 84, 84,  0,  0,  0,  0,
      // Steps 80-95: Part B3
      0, 79, 78, 77, 75,  0, 76,  0, 68, 69, 72,  0, 69, 72, 74,  0,
      // Steps 96-111: Part B4
      0, 75,  0,  0, 74,  0,  0,  0, 72,  0,  0,  0,  0,  0,  0,  0,
      // Steps 112-127: Part C1 (climbing bridge)
      72, 72,  0, 72,  0, 72, 74,  0, 76, 72,  0, 69, 67,  0,  0,  0
    ];

    // Chords (null = no chord on this step)
    this.marioChords = new Array(128).fill(null);
    // Intro
    this.marioChords[0] = [60, 64, 67];  // C
    this.marioChords[4] = [60, 64, 67];  // C
    this.marioChords[8] = [60, 64, 67];  // C
    this.marioChords[12] = [55, 59, 62]; // G
    
    // Part A1
    this.marioChords[16] = [60, 64, 67]; // C
    this.marioChords[20] = [60, 64, 67]; // C
    this.marioChords[24] = [57, 60, 64]; // Am
    this.marioChords[28] = [56, 60, 65]; // Fm
    
    // Part A2
    this.marioChords[32] = [60, 64, 67]; // C
    this.marioChords[36] = [60, 64, 67]; // C
    this.marioChords[40] = [60, 64, 67]; // C
    this.marioChords[44] = [55, 59, 62]; // G
    
    // Part B1
    this.marioChords[48] = [60, 64, 67]; // C
    this.marioChords[52] = [57, 60, 64]; // Am
    this.marioChords[56] = [60, 64, 67]; // C
    this.marioChords[60] = [55, 59, 62]; // G
    
    // Part B2
    this.marioChords[64] = [60, 64, 67]; // C
    this.marioChords[68] = [57, 60, 64]; // Am
    this.marioChords[72] = [60, 64, 67]; // C
    this.marioChords[76] = [60, 64, 67]; // C
    
    // Part B3
    this.marioChords[80] = [60, 64, 67]; // C
    this.marioChords[84] = [57, 60, 64]; // Am
    this.marioChords[88] = [60, 64, 67]; // C
    this.marioChords[92] = [55, 59, 62]; // G
    
    // Part B4
    this.marioChords[96] = [56, 60, 63];  // Ab
    this.marioChords[100] = [58, 62, 65]; // Bb
    this.marioChords[104] = [60, 64, 67]; // C
    
    // Part C1
    this.marioChords[112] = [60, 64, 67]; // C
    this.marioChords[116] = [60, 64, 67]; // C
    this.marioChords[120] = [57, 60, 64]; // Am
    this.marioChords[124] = [55, 59, 62]; // G

    // Syncopated double-bounce bassline for the Mario Rap Menu Theme
    this.marioBassMenu = [
      // Steps 0-15: Intro (funky bounce)
      48, 48,  0,  0, 48,  0, 48,  0, 43, 43,  0,  0, 43,  0, 43,  0,
      // Steps 16-31: Part A1
      48, 48,  0,  0, 48,  0, 48,  0, 41, 41,  0,  0, 41,  0, 41,  0,
      // Steps 32-47: Part A2
      48, 48,  0,  0, 41,  0, 41,  0, 48, 48,  0,  0, 43,  0, 43,  0,
      // Steps 48-63: Part B1
      48, 48,  0,  0, 41,  0, 41,  0, 48, 48,  0,  0, 43,  0, 43,  0,
      // Steps 64-79: Part B2
      48, 48,  0,  0, 41,  0, 41,  0, 48, 48,  0,  0, 48,  0, 48,  0,
      // Steps 80-95: Part B3
      48, 48,  0,  0, 41,  0, 41,  0, 48, 48,  0,  0, 43,  0, 43,  0,
      // Steps 96-111: Part B4
      44, 44,  0,  0, 46,  0, 46,  0, 48, 48,  0,  0, 48,  0, 48,  0,
      // Steps 112-127: Part C1
      48, 48,  0,  0, 48,  0, 48,  0, 41, 41,  0,  0, 43,  0, 43,  0
    ];

    // Upbeat driving bassline for the Game Theme
    this.marioBassGame = [
      // Steps 0-15: Intro
      48, 0, 48, 48, 0, 48, 0, 48, 43, 0, 43, 43, 0, 43, 0, 43,
      // Steps 16-31: Part A1
      48, 0, 48, 48, 0, 48, 0, 48, 41, 0, 41, 41, 0, 41, 0, 41,
      // Steps 32-47: Part A2
      48, 0, 48, 48, 0, 41, 0, 41, 48, 0, 48, 48, 0, 43, 0, 43,
      // Steps 48-63: Part B1
      48, 0, 48, 48, 0, 41, 0, 41, 48, 0, 48, 48, 0, 43, 0, 43,
      // Steps 64-79: Part B2
      48, 0, 48, 48, 0, 41, 0, 41, 48, 0, 48, 48, 0, 48, 0, 48,
      // Steps 80-95: Part B3
      48, 0, 48, 48, 0, 41, 0, 41, 48, 0, 48, 48, 0, 43, 0, 43,
      // Steps 96-111: Part B4
      44, 0, 44, 44, 0, 46, 0, 46, 48, 0, 48, 48, 0, 48, 0, 48,
      // Steps 112-127: Part C1
      48, 0, 48, 48, 0, 48, 0, 48, 41, 0, 41, 41, 0, 43, 0, 43
    ];
  }

  /**
   * Initializes the AudioContext if it has not been created yet.
   * Required because modern browsers restrict audio playback until a user click occurs.
   */
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain nodes for mixing
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      
      // Connect sub-mixes to master
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      
      // Connect master to output
      this.masterGain.connect(this.ctx.destination);
      
      // Apply loaded settings
      this.applyVolumes();
    }
  }

  /**
   * Helper function to clamp volume values between 0.0 and 1.0.
   */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Applies the current volume settings to the Web Audio GainNodes.
   */
  applyVolumes() {
    if (!this.ctx) return;
    
    // Set gains
    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(this.musicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
    this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
  }

  /**
   * Setters and toggles for audio config
   */
  setMasterVolume(val) {
    this.masterVolume = this.clamp(val, 0, 1);
    localStorage.setItem('runmill_master_volume', this.masterVolume);
    this.applyVolumes();
  }

  setMusicVolume(val) {
    this.musicVolume = this.clamp(val, 0, 1);
    localStorage.setItem('runmill_music_volume', this.musicVolume);
    this.applyVolumes();
  }

  setSfxVolume(val) {
    this.sfxVolume = this.clamp(val, 0, 1);
    localStorage.setItem('runmill_sfx_volume', this.sfxVolume);
    this.applyVolumes();
  }

  toggleMusic(muted) {
    this.musicMuted = muted !== undefined ? muted : !this.musicMuted;
    localStorage.setItem('runmill_music_muted', this.musicMuted);
    this.applyVolumes();
  }

  toggleSfx(muted) {
    this.sfxMuted = muted !== undefined ? muted : !this.sfxMuted;
    localStorage.setItem('runmill_sfx_muted', this.sfxMuted);
    this.applyVolumes();
  }

  /**
   * Convert MIDI Note number to Frequency (Hz)
   * Formula: f = 440 * 2^((n - 69) / 12)
   */
  mtof(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  /**
   * playSynth - Procedurally synthesizes a single musical note.
   * 
   * @param {number} freq - Frequency in Hz
   * @param {number} startTime - Absolute time in seconds to start the note
   * @param {number} duration - Envelope duration in seconds
   * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
   * @param {number} gainValue - Maximum volume level (0.0 to 1.0)
   * @param {boolean} isMusic - Whether this is part of the background music sequencer
   */
  playSynth(freq, startTime, duration, type = 'sawtooth', gainValue = 0.1, isMusic = false) {
    this.init();
    
    // Create audio nodes
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filterNode = this.ctx.createBiquadFilter();

    // Configure oscillator
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Apply exponential decay volume envelope (standard ADSR style decay)
    gainNode.gain.setValueAtTime(gainValue, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Apply a sweeping low-pass filter to give notes a warm synth pluck sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(freq * 3, startTime);
    filterNode.frequency.exponentialRampToValueAtTime(100, startTime + duration);

    // Connect nodes: Osc -> Filter -> Gain -> Output (mix gain)
    osc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(isMusic ? this.musicGain : this.sfxGain);

    // Schedule playback start and stop times
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * playElectricPiano - Additive synthesis to mimic a Rhodes electric piano / bell sound.
   */
  playElectricPiano(freq, startTime, duration, gainValue = 0.08) {
    this.init();
    const now = startTime;
    
    // Fundamental (sine)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    gain1.gain.setValueAtTime(gainValue * 0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc1.connect(gain1);
    gain1.connect(this.musicGain);
    osc1.start(now);
    osc1.stop(now + duration);

    // Tine strike 1 (2nd Harmonic)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    gain2.gain.setValueAtTime(gainValue * 0.3, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc2.connect(gain2);
    gain2.connect(this.musicGain);
    osc2.start(now);
    osc2.stop(now + 0.12);

    // Tine strike 2 (3rd Harmonic)
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);
    gain3.gain.setValueAtTime(gainValue * 0.2, now);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc3.connect(gain3);
    gain3.connect(this.musicGain);
    osc3.start(now);
    osc3.stop(now + 0.2);

    // Metallic bite (4.15x Harmonic)
    const osc4 = this.ctx.createOscillator();
    const gain4 = this.ctx.createGain();
    osc4.type = 'sine';
    osc4.frequency.setValueAtTime(freq * 4.15, now);
    gain4.gain.setValueAtTime(gainValue * 0.15, now);
    gain4.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc4.connect(gain4);
    gain4.connect(this.musicGain);
    osc4.start(now);
    osc4.stop(now + 0.04);
  }

  /**
   * playWarmPad - Smooth detuned triangle waves to create a warm background chord bed.
   */
  playWarmPad(freq, startTime, duration, gainValue = 0.05) {
    this.init();
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc1.detune.setValueAtTime(-8, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, startTime);
    osc2.detune.setValueAtTime(8, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);

    osc1.start(startTime);
    osc1.stop(startTime + duration);
    osc2.start(startTime);
    osc2.stop(startTime + duration);
  }

  /**
   * playAcousticBass - Warm double-bass sweep.
   */
  playAcousticBass(freq, startTime, duration, gainValue = 0.1) {
    this.init();
    const oscTri = this.ctx.createOscillator();
    const oscSaw = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    oscTri.type = 'triangle';
    oscTri.frequency.setValueAtTime(freq, startTime);

    oscSaw.type = 'sawtooth';
    oscSaw.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(gainValue, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(70, startTime + duration);

    oscTri.connect(filter);
    oscSaw.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);

    oscTri.start(startTime);
    oscTri.stop(startTime + duration);
    oscSaw.start(startTime);
    oscSaw.stop(startTime + duration);
  }

  /**
   * playChillKick - Gentle deep sub kick drum.
   */
  playChillKick(startTime) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.frequency.setValueAtTime(90, startTime);
    osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.15);

    gainNode.gain.setValueAtTime(0.25, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  /**
   * playChillHihat - Soft highpass filtered noise.
   */
  playChillHihat(startTime) {
    this.init();
    try {
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 10000;

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.015, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.025);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);

      noise.start(startTime);
      noise.stop(startTime + 0.03);
    } catch (e) {
      // Fallback
    }
  }

  /**
   * playChillRimshot - Soft stick/rimshot sound.
   */
  playChillRimshot(startTime) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550, startTime);
    osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.04);

    gainNode.gain.setValueAtTime(0.12, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    osc.connect(gainNode);
    gainNode.connect(this.musicGain);
    osc.start(startTime);
    osc.stop(startTime + 0.04);

    try {
      const bufferSize = this.ctx.sampleRate * 0.015;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 6.0;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.015);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.musicGain);

      noise.start(startTime);
      noise.stop(startTime + 0.015);
    } catch (e) {
      // Fallback
    }
  }

  /**
   * playScratch - Synthesizes a bi-directional record scratch sound for hip-hop tracks.
   */
  playScratch(startTime) {
    this.init();
    const now = startTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1600, now + 0.05);
    osc.frequency.linearRampToValueAtTime(300, now + 0.1);

    gainNode.gain.setValueAtTime(0.06, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 3.0;

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.1);

    // Add a tiny noise crunch on top of the scratch for realistic grit
    try {
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1400;
      noiseFilter.Q.value = 2.0;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.02, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.musicGain);

      noise.start(now);
      noise.stop(now + 0.08);
    } catch (e) {}
  }

  /**
   * playDrum - Synthesizes a kick drum punch sound.
   * Sweeps frequency rapidly downward from 120Hz to 0.01Hz to simulate a bass drum click/thump.
   */
  playDrum(startTime) {
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.frequency.setValueAtTime(120, startTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  /**
   * playHihat - Synthesizes a hi-hat splash sound using a buffer of random white noise.
   */
  playHihat(startTime) {
    // Generate a 50ms buffer of white noise (random float values between -1.0 and 1.0)
    const bufferSize = this.ctx.sampleRate * 0.05; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Apply high-pass filter at 7kHz to filter out low-end rumble, leaving only high frequency sizzle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    // Apply fast exponential decay gain envelope
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.05, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);

    noise.start(startTime);
    noise.stop(startTime + 0.05);
  }

  /**
   * startMusic - Begins the background music sequencer.
   * Uses a lookahead scheduler to ensure precise timing independent of JS main thread lag.
   * @param {string} trackType - 'menu' (Mario Rap) or 'game' (upbeat Mario driving)
   */
  startMusic(trackType = 'game') {
    this.init();
    if (this.isPlayingMusic) {
      if (this.currentTrack === trackType) return;
      this.stopMusic();
    }
    
    this.currentTrack = trackType;
    this.isPlayingMusic = true;
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime;
    
    // Set tempo: Mario Rap (115 BPM) vs high-energy gameplay driving (128 BPM)
    const bpm = trackType === 'menu' ? 115 : 128;
    this.tempo = 60 / bpm;
    
    // Look ahead 100ms and schedule notes every 50ms interval
    const scheduler = () => {
      while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
        this.scheduleNextStep(this.step, this.nextNoteTime);
        this.nextNoteTime += this.tempo / 2; // eighth notes
        this.step = (this.step + 1) % 128; // Loop over 128 steps
      }
    };
    
    this.musicInterval = setInterval(scheduler, 50);
  }

  /**
   * stopMusic - Stops music sequencer playback and clears the scheduler interval.
   */
  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isPlayingMusic = false;
  }

  /**
   * scheduleNextStep - Triggers sound outputs corresponding to the current grid step.
   */
  scheduleNextStep(step, time) {
    if (this.currentTrack === 'menu') {
      // MENU THEME (Mario Brothers Rap / Funk Hip-Hop Remix of Mario Overworld)
      // 1. Bassline (Syncopated hip-hop double-bounce double-bass)
      const bassNote = this.marioBassMenu[step];
      if (bassNote > 0) {
        this.playAcousticBass(this.mtof(bassNote), time, this.tempo * 0.9, 0.1);
      }

      // 2. Chords Pad (Warm background chord pads)
      const chordNotes = this.marioChords[step];
      if (chordNotes) {
        chordNotes.forEach(note => {
          this.playWarmPad(this.mtof(note), time, this.tempo * 3.2, 0.02);
        });
      }

      // 3. Lead Melody (Sweet instrumental Electric Piano)
      const melNote = this.marioMelody[step];
      if (melNote > 0) {
        this.playElectricPiano(this.mtof(melNote), time, this.tempo * 0.9, 0.04);
      }

      // 4. Iconic Mario Calypso/Samba Drums with Turntable Rap Scratches
      // Kick plays on 0, 3, 5 of every 8-step measure
      if (step % 8 === 0 || step % 8 === 3 || step % 8 === 5) {
        this.playChillKick(time);
      }

      // Snare/Rimshot plays on 2, 6 of every 8-step measure
      if (step % 8 === 2 || step % 8 === 6) {
        this.playChillRimshot(time);
      }

      // Hi-hat plays on offbeats
      if (step % 2 === 1) {
        this.playChillHihat(time);
      }

      // Procedural turntable record scratches at measure endings (turnaround fill)
      if (step % 16 === 14 || step % 16 === 15) {
        this.playScratch(time);
      }
    } else {
      // GAME THEME (Upbeat high-energy instrumental Mario Overworld Theme)
      // 1. Bassline (Syncopated driving acoustic bassline)
      const bassNote = this.marioBassGame[step];
      if (bassNote > 0) {
        this.playAcousticBass(this.mtof(bassNote), time, this.tempo * 0.7, 0.08);
      }

      // 2. Chords Pluck (Rhythmic Electric Piano plucks)
      const chordNotes = this.marioChords[step];
      if (chordNotes) {
        chordNotes.forEach(note => {
          this.playElectricPiano(this.mtof(note), time, this.tempo * 0.5, 0.025);
        });
      }

      // 3. Lead Melody (Bright, driving instrumental Electric Piano)
      const melNote = this.marioMelody[step];
      if (melNote > 0) {
        this.playElectricPiano(this.mtof(melNote), time, this.tempo * 0.7, 0.06);
      }

      // 4. Iconic Mario Calypso/Samba Drums
      // Kick plays on 0, 3, 5 of every 8-step measure
      if (step % 8 === 0 || step % 8 === 3 || step % 8 === 5) {
        this.playChillKick(time);
      }

      // Snare/Rimshot plays on 2, 6 of every 8-step measure
      if (step % 8 === 2 || step % 8 === 6) {
        this.playChillRimshot(time);
      }

      // Hi-hat plays on offbeats
      if (step % 2 === 1) {
        this.playChillHihat(time);
      }
    }
  }

  /**
   * SFX: playJump - Short frequency slide upwards to simulate jumping.
   */
  playJump() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    // Exponential sweep from 150Hz to 600Hz in 150ms
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * SFX: playCollect - Triggers a high-pitched classic 8-bit coin collect arpeggio.
   */
  playCollect() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    // Quick ascending square wave notes simulating pixel floppy retrieval
    this.playSynth(this.mtof(72), now, 0.08, 'square', 0.05, false);        // C5
    this.playSynth(this.mtof(76), now + 0.06, 0.08, 'square', 0.05, false);  // E5
    this.playSynth(this.mtof(79), now + 0.12, 0.15, 'square', 0.05, false);  // G5
    this.playSynth(this.mtof(84), now + 0.18, 0.25, 'square', 0.05, false);  // C6
  }

  /**
   * SFX: playHit - Synthesizes a crashing noise explosion when running into an obstacle.
   */
  playHit() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    // Low frequency pitch slide down
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(30, now + 0.3);

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(50, now + 0.3);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);

    // Overlay a burst of white noise for realistic crunch
    try {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 400;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.25);
    } catch (e) {
      // Noise buffer fallback
    }
  }

  /**
   * SFX: playBash - A low-pitched rising-and-falling growling sawtooth sweep to simulate a powerful truck engine revving/bashing forward.
   */
  playBash() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    // Start at a low rumble (65Hz), rev up to 260Hz, then slide down to 45Hz
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.4);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * SFX: playSpin - A high-pitched squealing oscillator sweep to simulate a car spinning tires/screeching.
   */
  playSpin() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    // Screeching sweep from 400Hz up to 1200Hz and back to 300Hz in 0.35s
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.35);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gainNode);
    gainNode.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * SFX: playHeartCollect - Triggers a high-pitched healing chime sweep (E5 -> A5 -> E6).
   */
  playHeartCollect() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    // Healing chime sweep (E5 -> A5 -> E6) using a triangle wave (for a warm bell-like chime)
    this.playSynth(this.mtof(76), now, 0.15, 'triangle', 0.08, false);       // E5
    this.playSynth(this.mtof(81), now + 0.1, 0.15, 'triangle', 0.08, false);  // A5
    this.playSynth(this.mtof(88), now + 0.2, 0.3, 'triangle', 0.08, false);   // E6
  }

  /**
   * SFX: playWorldTransition - Plays a rising futuristic sci-fi laser sound effect.
   */
  playWorldTransition() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * SFX: playVictory - Loops off music and plays a bright, celebratory major arpeggio upward sweep (C5 -> E5 -> G5 -> C6 -> E6 -> G6 -> C7) ending with a powerful chord plink.
   */
  playVictory() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.stopMusic();
    const now = this.ctx.currentTime;
    
    // Celebratory ascending major arpeggio
    this.playSynth(this.mtof(60), now, 0.12, 'triangle', 0.1, false);        // C5
    this.playSynth(this.mtof(64), now + 0.1, 0.12, 'triangle', 0.1, false);  // E5
    this.playSynth(this.mtof(67), now + 0.2, 0.12, 'triangle', 0.1, false);  // G5
    this.playSynth(this.mtof(72), now + 0.3, 0.12, 'triangle', 0.1, false);  // C6
    this.playSynth(this.mtof(76), now + 0.4, 0.12, 'triangle', 0.1, false);  // E6
    this.playSynth(this.mtof(79), now + 0.5, 0.12, 'triangle', 0.1, false);  // G6
    this.playSynth(this.mtof(84), now + 0.6, 0.4, 'triangle', 0.1, false);   // C7
    
    // Play a dual-oscillator backing chord at the end
    this.playSynth(this.mtof(60), now + 0.6, 0.4, 'sawtooth', 0.06, false);
    this.playSynth(this.mtof(64), now + 0.6, 0.4, 'sawtooth', 0.06, false);
    this.playSynth(this.mtof(67), now + 0.6, 0.4, 'sawtooth', 0.06, false);
  }

  /**
   * SFX: playGameOver - Loops off music and schedules a sad minor chord arpeggio descent.
   */
  playGameOver() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.stopMusic();
    const now = this.ctx.currentTime;
    
    // Descending minor progression (G5 -> Eb5 -> C5 -> G4)
    this.playSynth(this.mtof(67), now, 0.2, 'sawtooth', 0.1, false);        // G5
    this.playSynth(this.mtof(63), now + 0.15, 0.2, 'sawtooth', 0.1, false); // Eb5
    this.playSynth(this.mtof(60), now + 0.3, 0.2, 'sawtooth', 0.1, false);  // C5
    this.playSynth(this.mtof(55), now + 0.45, 0.5, 'sawtooth', 0.1, false); // G4
  }

  /**
   * SFX: playShoot - A retro 8-bit laser/cannon blast using a square wave sweep with noise.
   */
  playShoot() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'square';
    // Rapid downward sweep to simulate retro laser fire (800Hz down to 100Hz)
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gainNode);
    gainNode.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);

    // Dynamic noise burst for cannon blast crunchiness
    try {
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 500;
      noiseFilter.Q.value = 3.0;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.1, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.15);
    } catch (e) {
      // Noise fallback
    }
  }

  /**
   * SFX: playThrow - A swoosh sound effect to simulate tossing a garbage bag.
   */
  playThrow() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.25);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.25);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * SFX: playTrashExplosion - A messy, clattering, wet crash sound representing rubbish exploding.
   */
  playTrashExplosion() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    // Wet low punch
    const baseOsc = this.ctx.createOscillator();
    const baseGain = this.ctx.createGain();
    baseOsc.type = 'sine';
    baseOsc.frequency.setValueAtTime(90, now);
    baseOsc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
    baseGain.gain.setValueAtTime(0.3, now);
    baseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    baseOsc.connect(baseGain);
    baseGain.connect(this.sfxGain);
    baseOsc.start(now);
    baseOsc.stop(now + 0.45);

    // Clattering metal/cans (4 short high-passed square waves at random intervals)
    for (let i = 0; i < 4; i++) {
      const delay = Math.random() * 0.25;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(Math.random() * 600 + 400, now + delay);
      osc.frequency.linearRampToValueAtTime(Math.random() * 200 + 100, now + delay + 0.15);

      gainNode.gain.setValueAtTime(0.08, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now + delay);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.sfxGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    }

    // Noise burst for the splash/mess
    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(600, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noiseNode.start(now);
      noiseNode.stop(now + 0.4);
    } catch (e) {
      console.warn("Noise buffer generation failed", e);
    }
  }
}

export const audio = new WebAudioSynth();

