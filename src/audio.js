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

    // MIDI note numbers for the repeating synth bassline (sawtooth wave)
    this.bassPattern = [36, 36, 43, 43, 36, 36, 48, 48]; 

    // MIDI note numbers for the lead retro arpeggiated melody (triangle wave)
    // 0 represents a rest (no note played)
    this.melodyPattern = [
      60, 0, 63, 65, 0, 67, 70, 72,
      70, 67, 65, 63, 60, 0, 0, 0
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
   * @param {string} trackType - 'menu' (chill Synthwave) or 'game' (fast cyber runner)
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
    
    // Set tempo depending on trackType
    const bpm = trackType === 'menu' ? 95 : 110;
    this.tempo = 60 / bpm;
    
    // Look ahead 100ms and schedule notes every 50ms interval
    const scheduler = () => {
      while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
        this.scheduleNextStep(this.step, this.nextNoteTime);
        this.nextNoteTime += this.tempo / 2; // eighth notes
        this.step = (this.step + 1) % 32; // Loop over 32 steps
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
      // MENU THEME (Chill Instrumental Lounge remix of Mario Overworld)
      // 32-step melody notes (0 = rest, notes are C5 to G5 range)
      const melodyPattern = [
        76, 76,  0, 76,  0, 72, 76,  0, 79,  0,  0,  0, 67,  0,  0,  0,
        72,  0,  0, 67,  0,  0, 64,  0, 69,  0, 71,  0, 70, 69, 67,  0
      ];

      // 32-step bass notes (C -> G -> F -> C)
      const bassPattern = [
        48,  0, 48,  0, 48,  0, 48,  0, 43,  0, 43,  0, 43,  0, 43,  0,
        41,  0, 41,  0, 41,  0, 41,  0, 36,  0, 36,  0, 36,  0, 36,  0
      ];

      // 1. Bassline (Warm sub-bass triangle wave)
      const bassNote = bassPattern[step];
      if (bassNote > 0) {
        this.playSynth(this.mtof(bassNote), time, this.tempo * 0.7, 'triangle', 0.08, true);
      }

      // 2. Lead Melody (Sweet, pure instrumental sine wave bells)
      const melNote = melodyPattern[step];
      if (melNote > 0) {
        this.playSynth(this.mtof(melNote), time, this.tempo * 1.0, 'sine', 0.04, true);
      }

      // 3. Chill Drums (Kick on beats 1 and 3, Hi-hat on offbeats)
      if (step % 8 === 0) {
        this.playDrum(time);
      } else if (step % 4 === 2) {
        this.playHihat(time);
      }
    } else {
      // GAME THEME (Fast cyber runner)
      // 1. Bassline (Sawtooth note on every eighth note step)
      const bassNote = this.bassPattern[step % this.bassPattern.length];
      this.playSynth(this.mtof(bassNote), time, this.tempo * 0.8, 'sawtooth', 0.08, true);

      // 2. Lead Melody (Triangle wave note on non-zero pattern indices)
      const melNote = this.melodyPattern[step % this.melodyPattern.length];
      if (melNote > 0) {
        this.playSynth(this.mtof(melNote), time, this.tempo * 1.5, 'triangle', 0.06, true);
      }

      // 3. Drums (Kick drum on beats 1, 5, 9, 13; Hi-hat on offbeats 3, 7, 11, 15)
      if (step % 4 === 0) {
        this.playDrum(time);
      } else if (step % 4 === 2) {
        this.playHihat(time);
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
}

export const audio = new WebAudioSynth();
