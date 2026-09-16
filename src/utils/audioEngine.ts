/**
 * Audio Engine for Horn Ok Please
 * Features:
 * 1. Authentic Web Audio synthesized Multi-Tone Indian Truck Horns (Nagin, Tata Double, Dhoom, Tiranga, Big Pressure)
 * 2. Highway Ambient Soundscape Generators (Engine rumble, Rain on cabin, Crickets, Vintage Tape Hiss, Dhaba chatter)
 * 3. Retro & Modern Synthesizer Melodic Music Player for Bollywood, Punjabi & Highway Anthems
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.85;

  // Music Synth state
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;
  private currentNoteIndex: number = 0;
  private currentTrackPattern: any = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onTrackEndedCallback: (() => void) | null = null;
  private currentTime: number = 0;
  private totalDuration: number = 240;

  constructor() {
    // Lazy initialized
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // ==========================================
  // AUTHENTIC INDIAN TRUCK HORNS
  // ==========================================

  public playHorn(type: string = 'nagin') {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // Ensure audio context is running immediately on user gesture
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const hornGain = ctx.createGain();
    hornGain.gain.setValueAtTime(0.95, now);
    hornGain.connect(this.masterGain);

    // Initial pneumatic air valve hiss
    this.createPneumaticChuff(ctx, hornGain, now, 0.08);

    if (type === 'nagin') {
      // Iconic Indian Nagin truck melody (E5, G5, A5, B5, C6, B5, A5, G5, E5) with authentic truck pressure timbre
      const notes = [
        { f: 659.25, d: 0.13 }, // E5
        { f: 783.99, d: 0.13 }, // G5
        { f: 880.00, d: 0.15 }, // A5
        { f: 987.77, d: 0.15 }, // B5
        { f: 1046.50, d: 0.24 }, // C6
        { f: 987.77, d: 0.15 }, // B5
        { f: 880.00, d: 0.15 }, // A5
        { f: 783.99, d: 0.17 }, // G5
        { f: 659.25, d: 0.38 }, // E5
      ];

      let noteTime = now;
      notes.forEach((n, idx) => {
        this.createHornTone(ctx, hornGain, n.f, noteTime, n.d, 'brass', idx === notes.length - 1);
        noteTime += n.d * 0.94;
      });
    } else if (type === 'classic_double') {
      // Classic Tata / Leyland pressure beep-beep ("Paamp... Paaaaamp!")
      this.createAirHornBurst(ctx, hornGain, [392, 493.88, 587.33, 784], now, 0.22);
      this.createAirHornBurst(ctx, hornGain, [392, 493.88, 587.33, 784], now + 0.28, 0.52);
    } else if (type === 'dhoom') {
      // Fast high energy 4-pulse musical horn (C5, E5, G5, C6)
      const melody = [
        { f: 523.25, d: 0.10 }, // C5
        { f: 659.25, d: 0.10 }, // E5
        { f: 783.99, d: 0.10 }, // G5
        { f: 1046.50, d: 0.35 }, // C6
      ];
      let noteTime = now;
      melody.forEach((n, idx) => {
        this.createHornTone(ctx, hornGain, n.f, noteTime, n.d, 'sharp', idx === melody.length - 1);
        noteTime += n.d * 0.96;
      });
    } else if (type === 'heavy_pressure') {
      // Deep resonant GT Road multi-chamber air blast
      this.createHeavyAirBlast(ctx, hornGain, now, 0.75);
    } else if (type === 'tiranga') {
      // Desi patriotic trumpet fanfare (Saare Jahaan Se Achha melody notes)
      const melody = [
        { f: 587.33, d: 0.14 }, // D5
        { f: 659.25, d: 0.14 }, // E5
        { f: 739.99, d: 0.14 }, // F#5
        { f: 880.00, d: 0.28 }, // A5
        { f: 739.99, d: 0.14 }, // F#5
        { f: 880.00, d: 0.45 }, // A5
      ];
      let noteTime = now;
      melody.forEach((n, idx) => {
        this.createHornTone(ctx, hornGain, n.f, noteTime, n.d, 'brass', idx === melody.length - 1);
        noteTime += n.d * 0.94;
      });
    }
  }

  private createPneumaticChuff(ctx: AudioContext, dest: GainNode, startTime: number, duration: number) {
    // White noise blast for pneumatic solenoid release
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1800, startTime);
    noiseFilter.Q.setValueAtTime(2.0, startTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  private createHornTone(
    ctx: AudioContext,
    dest: GainNode,
    freq: number,
    startTime: number,
    duration: number,
    style: 'brass' | 'sharp',
    hasVibrato: boolean = false
  ) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc3.type = 'sawtooth';
    subOsc.type = 'triangle';

    // Rich dual-trumpet harmonic detune (+/- 4 to 6 cents)
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 1.008, startTime);
    osc3.frequency.setValueAtTime(freq * 0.994, startTime);
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime);

    if (hasVibrato) {
      // Natural pneumatic pressure vibrato wobble on the sustaining note
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6.0, startTime);
      lfoGain.gain.setValueAtTime(freq * 0.015, startTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);
      lfo.start(startTime + 0.1);
      lfo.stop(startTime + duration);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(style === 'brass' ? 2800 : 4200, startTime);
    filter.Q.setValueAtTime(4.0, startTime);

    // Punchy air pressure attack envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.85, startTime + 0.018);
    gain.gain.setValueAtTime(0.75, startTime + duration - 0.035);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    subOsc.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    osc3.stop(startTime + duration);
    subOsc.stop(startTime + duration);
  }

  private createAirHornBurst(ctx: AudioContext, dest: GainNode, freqs: number[], startTime: number, duration: number) {
    const burstGain = ctx.createGain();
    burstGain.gain.setValueAtTime(0.001, startTime);
    burstGain.gain.exponentialRampToValueAtTime(0.95, startTime + 0.02);
    burstGain.gain.setValueAtTime(0.85, startTime + duration - 0.04);
    burstGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    burstGain.connect(dest);

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(f, startTime);
      osc.frequency.linearRampToValueAtTime(f * 0.985, startTime + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3600, startTime);
      filter.Q.setValueAtTime(2.5, startTime);

      osc.connect(filter);
      filter.connect(burstGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  private createHeavyAirBlast(ctx: AudioContext, dest: GainNode, startTime: number, duration: number) {
    const freqs = [146.83, 185, 220, 277.18, 370];
    const burstGain = ctx.createGain();
    burstGain.gain.setValueAtTime(0.001, startTime);
    burstGain.gain.exponentialRampToValueAtTime(0.98, startTime + 0.025);
    burstGain.gain.setValueAtTime(0.88, startTime + duration - 0.05);
    burstGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    burstGain.connect(dest);

    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, startTime);
      osc.frequency.linearRampToValueAtTime(f * 0.99, startTime + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, startTime);
      filter.Q.setValueAtTime(3.0, startTime);

      osc.connect(filter);
      filter.connect(burstGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Ambience audio disabled as per user request
  public startAmbience(_levels?: any) {}
  public updateAmbienceLevels(_levels?: any) {}

  // ==========================================
  // RETRO & MODERN HIGHWAY MUSIC SYNTHESIZER
  // ==========================================

  public playTrack(pattern: any, onTimeUpdate?: (time: number, duration: number) => void, onEnded?: () => void) {
    this.init();
    this.stopTrack();

    this.currentTrackPattern = pattern;
    this.onTimeUpdateCallback = onTimeUpdate || null;
    this.onTrackEndedCallback = onEnded || null;
    this.isMusicPlaying = true;
    this.currentNoteIndex = 0;
    this.currentTime = 0;
    this.totalDuration = pattern.duration || 220;

    const tempo = pattern.bpm || 110;
    const stepTime = (60 / tempo) / 2; // 8th notes interval
    const intervalMs = stepTime * 1000;

    const scheduleStep = () => {
      if (!this.isMusicPlaying || !this.ctx) return;

      const melodyNotes = pattern.melody || [];
      const bassNotes = pattern.bass || [];
      const chords = pattern.chords || [];
      const instrument = pattern.instrument || 'harmonium';

      // 1. Play Melody Lead Note
      if (melodyNotes.length > 0) {
        const note = melodyNotes[this.currentNoteIndex % melodyNotes.length];
        if (note && note > 0) {
          this.playMelodyLead(note, stepTime * 0.88, instrument);
        }
      }

      // 2. Play Polyphonic Chord Pad (every 4 or 8 steps)
      if (chords.length > 0 && this.currentNoteIndex % 4 === 0) {
        const chordIndex = Math.floor(this.currentNoteIndex / 4) % chords.length;
        const chord = chords[chordIndex];
        if (chord && chord.length > 0) {
          this.playChordPad(chord, stepTime * 3.8);
        }
      }

      // 3. Play Bassline Note
      if (bassNotes.length > 0) {
        const bNote = bassNotes[this.currentNoteIndex % bassNotes.length];
        if (bNote && bNote > 0) {
          this.playBassNote(bNote, stepTime * 0.82);
        }
      }

      // 4. Play Rhythm / Dholak / Tabla & Hi-hat
      if (this.currentNoteIndex % 2 === 0) {
        if (this.currentNoteIndex % 4 === 0) {
          this.playDrum('kick');
        } else {
          this.playDrum('snare_tabla');
        }
      }
      if (this.currentNoteIndex % 2 === 1) {
        this.playDrum('hihat');
      }

      // Update timer
      this.currentTime += stepTime;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime, this.totalDuration);
      }

      if (this.currentTime >= this.totalDuration) {
        this.stopTrack();
        if (this.onTrackEndedCallback) {
          const cb = this.onTrackEndedCallback;
          this.onTrackEndedCallback = null;
          cb();
        }
        return;
      }

      this.currentNoteIndex++;
    };

    scheduleStep();
    this.musicInterval = setInterval(scheduleStep, intervalMs);
  }

  public pauseTrack() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public resumeTrack() {
    if (this.currentTrackPattern && !this.isMusicPlaying) {
      this.init();
      this.isMusicPlaying = true;
      const tempo = this.currentTrackPattern.bpm || 110;
      const stepTime = (60 / tempo) / 2;
      const intervalMs = stepTime * 1000;

      const scheduleStep = () => {
        if (!this.isMusicPlaying || !this.ctx) return;
        const melodyNotes = this.currentTrackPattern.melody || [];
        const bassNotes = this.currentTrackPattern.bass || [];
        const chords = this.currentTrackPattern.chords || [];
        const instrument = this.currentTrackPattern.instrument || 'harmonium';

        if (melodyNotes.length > 0) {
          const note = melodyNotes[this.currentNoteIndex % melodyNotes.length];
          if (note && note > 0) {
            this.playMelodyLead(note, stepTime * 0.88, instrument);
          }
        }

        if (chords.length > 0 && this.currentNoteIndex % 4 === 0) {
          const chordIndex = Math.floor(this.currentNoteIndex / 4) % chords.length;
          const chord = chords[chordIndex];
          if (chord && chord.length > 0) {
            this.playChordPad(chord, stepTime * 3.8);
          }
        }

        if (bassNotes.length > 0) {
          const bNote = bassNotes[this.currentNoteIndex % bassNotes.length];
          if (bNote && bNote > 0) {
            this.playBassNote(bNote, stepTime * 0.82);
          }
        }

        if (this.currentNoteIndex % 2 === 0) {
          if (this.currentNoteIndex % 4 === 0) {
            this.playDrum('kick');
          } else {
            this.playDrum('snare_tabla');
          }
        } else {
          this.playDrum('hihat');
        }

        this.currentTime += stepTime;
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.currentTime, this.totalDuration);
        }
        if (this.currentTime >= this.totalDuration) {
          this.stopTrack();
          if (this.onTrackEndedCallback) {
            const cb = this.onTrackEndedCallback;
            this.onTrackEndedCallback = null;
            cb();
          }
          return;
        }
        this.currentNoteIndex++;
      };

      this.musicInterval = setInterval(scheduleStep, intervalMs);
    }
  }

  public stopTrack() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentNoteIndex = 0;
    this.currentTime = 0;
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(this.totalDuration, seconds));
    if (this.currentTrackPattern) {
      const tempo = this.currentTrackPattern.bpm || 110;
      const stepTime = (60 / tempo) / 2;
      this.currentNoteIndex = Math.floor(this.currentTime / stepTime);
    }
  }

  // ==========================================
  // INSTRUMENT SYNTHESIS METHODS
  // ==========================================

  private playMelodyLead(freq: number, dur: number, instrument: string) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    if (instrument === 'flute') {
      // Pure warm breathy Bansuri tone
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2.002, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.26, now + 0.05);
      gain.gain.setValueAtTime(0.22, now + dur - 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    } else if (instrument === 'sitar_tumbi') {
      // Crisp plucked string with bright harmonics
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.008, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.Q.setValueAtTime(2.5, now);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.9);
    } else if (instrument === 'guitar') {
      // Acoustic road trip guitar strum/pluck
      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 0.998, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.85);
    } else if (instrument === 'rhodes_lofi') {
      // Velvet smooth Rhodes Lo-Fi Piano
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.95);
    } else {
      // Warm Bollywood Harmonium / 90s Lead (default)
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.004, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.26, now + 0.035);
      gain.gain.setValueAtTime(0.20, now + dur - 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    }

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + dur);
    osc2.stop(now + dur);
  }

  private playChordPad(notes: number[], dur: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const padGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    padGain.gain.setValueAtTime(0.001, now);
    padGain.gain.exponentialRampToValueAtTime(0.12, now + 0.15);
    padGain.gain.setValueAtTime(0.10, now + dur - 0.2);
    padGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    filter.connect(padGain);
    padGain.connect(this.masterGain);

    notes.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + dur);
    });
  }

  private playBassNote(freq: number, dur: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    subOsc.type = 'sine';

    osc.frequency.setValueAtTime(freq * 0.5, now);
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.38, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.9);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + dur);
    subOsc.stop(now + dur);
  }

  private playDrum(type: 'kick' | 'snare_tabla' | 'hihat') {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (type === 'kick') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'snare_tabla') {
      // Desi Dholak / Tabla resonant slap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.1);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'hihat') {
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    }
  }
}

export const audioEngine = new SoundEngine();
