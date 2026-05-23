class WebAudioSynth {
  constructor() {
    this.ctx = null;
    this.musicInterval = null;
    this.isPlayingMusic = false;
    this.bpm = 110;
    this.tempo = 60 / this.bpm;
    this.step = 0;
    this.nextNoteTime = 0.0;
    this.bassPattern = [36, 36, 43, 43, 36, 36, 48, 48]; // MIDI note numbers
    this.melodyPattern = [
      60, 0, 63, 65, 0, 67, 70, 72,
      70, 67, 65, 63, 60, 0, 0, 0
    ];
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Convert MIDI note to frequency
  mtof(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // Play a simple synth note
  playSynth(freq, startTime, duration, type = 'sawtooth', gainValue = 0.1) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filterNode = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(gainValue, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(freq * 3, startTime);
    filterNode.frequency.exponentialRampToValueAtTime(100, startTime + duration);

    osc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playDrum(startTime) {
    // A simple synth kick drum
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.frequency.setValueAtTime(120, startTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  playHihat(startTime) {
    // Synth white noise hihat
    const bufferSize = this.ctx.sampleRate * 0.05; // 50ms buffer
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.05, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + 0.05);
  }

  startMusic() {
    this.init();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime;
    
    const scheduler = () => {
      while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
        this.scheduleNextStep(this.step, this.nextNoteTime);
        this.nextNoteTime += this.tempo / 2; // eighth notes
        this.step = (this.step + 1) % 16;
      }
    };
    
    this.musicInterval = setInterval(scheduler, 50);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isPlayingMusic = false;
  }

  scheduleNextStep(step, time) {
    // Bass plays on every eighth note
    const bassNote = this.bassPattern[step % this.bassPattern.length];
    this.playSynth(this.mtof(bassNote), time, this.tempo * 0.8, 'sawtooth', 0.08);

    // Melody plays on some eighth notes
    const melNote = this.melodyPattern[step];
    if (melNote > 0) {
      this.playSynth(this.mtof(melNote), time, this.tempo * 1.5, 'triangle', 0.06);
    }

    // Drum beat: kick on 0, 4, 8, 12; hihat on 2, 6, 10, 14
    if (step % 4 === 0) {
      this.playDrum(time);
    } else if (step % 4 === 2) {
      this.playHihat(time);
    }
  }

  // SFX: Jump
  playJump() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // SFX: Collect Point (Floppy Disk)
  playCollect() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    // Quick rising pixel coin sound
    this.playSynth(this.mtof(72), now, 0.08, 'square', 0.05); // C5
    this.playSynth(this.mtof(76), now + 0.06, 0.08, 'square', 0.05); // E5
    this.playSynth(this.mtof(79), now + 0.12, 0.15, 'square', 0.05); // G5
    this.playSynth(this.mtof(84), now + 0.18, 0.25, 'square', 0.05); // C6
  }

  // SFX: Hit Obstacle
  playHit() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    // Low frequency crash explosion
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
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);

    // Add white noise burst
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
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.25);
    } catch (e) {
      // Fallback if noise buffer creation fails
    }
  }

  // SFX: Game Over
  playGameOver() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.stopMusic();
    const now = this.ctx.currentTime;
    
    // Sad descending minor chord arpeggio
    this.playSynth(this.mtof(67), now, 0.2, 'sawtooth', 0.1); // G5
    this.playSynth(this.mtof(63), now + 0.15, 0.2, 'sawtooth', 0.1); // Eb5
    this.playSynth(this.mtof(60), now + 0.3, 0.2, 'sawtooth', 0.1); // C5
    this.playSynth(this.mtof(55), now + 0.45, 0.5, 'sawtooth', 0.1); // G4
  }
}

export const audio = new WebAudioSynth();
