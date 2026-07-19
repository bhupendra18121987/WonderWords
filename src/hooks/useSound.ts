import { useCallback, useEffect, useRef } from 'react';

interface UseSoundOptions {
  enabled?: boolean;
  musicEnabled?: boolean;
}

interface Note {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  vol?: number;
}

interface MusicNode {
  stop: () => void;
}

interface UseSoundResult {
  playTone: (frequency: number, duration?: number, type?: OscillatorType, volume?: number) => void;
  playSuccess: () => void;
  playCelebration: () => void;
  playError: () => void;
  playBlip: () => void;
}

// Suppress TS error for webkit-prefixed AudioContext on old Safari
type WindowWithAudio = Window & { webkitAudioContext?: typeof AudioContext };

/**
 * Very small WebAudio-based sound engine. Uses generated tones so no audio
 * files are shipped. Mobile will implement the same API with `expo-av`.
 */
export default function useSound({
  enabled = true,
  musicEnabled = false
}: UseSoundOptions = {}): UseSoundResult {
  const ctxRef = useRef<AudioContext | null>(null);
  const musicNodeRef = useRef<MusicNode | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const w = window as WindowWithAudio;
      const AC = window.AudioContext || w.webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (
      frequency: number,
      duration = 0.18,
      type: OscillatorType = 'sine',
      volume = 0.15
    ) => {
      if (!enabled) return;
      const ctx = getCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.02);
    },
    [enabled, getCtx]
  );

  const playSequence = useCallback(
    (notes: Note[]) => {
      if (!enabled) return;
      const ctx = getCtx();
      if (!ctx) return;
      let t = 0;
      for (const n of notes) {
        const dur = n.dur ?? 0.18;
        const type = n.type ?? 'sine';
        const vol = n.vol ?? 0.15;
        setTimeout(() => playTone(n.freq, dur, type, vol), t * 1000);
        t += dur * 0.9;
      }
    },
    [enabled, getCtx, playTone]
  );

  const playSuccess = useCallback(() => {
    playSequence([
      { freq: 523.25, dur: 0.14, type: 'triangle', vol: 0.11 }, // C5
      { freq: 659.25, dur: 0.14, type: 'triangle', vol: 0.11 }, // E5
      { freq: 783.99, dur: 0.22, type: 'triangle', vol: 0.11 }  // G5
    ]);
  }, [playSequence]);

  /**
   * A single firework: a rising whistle, a low bass "pop", and a high
   * crackling noise tail — all synthesised, no audio files.
   */
  const playFirework = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const now = ctx.currentTime;
    const popAt = 0.28;

    // 1. Rising whistle (0 → popAt)
    const whistle = ctx.createOscillator();
    const wg = ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(300, now);
    whistle.frequency.exponentialRampToValueAtTime(2200, now + popAt);
    wg.gain.setValueAtTime(0, now);
    wg.gain.linearRampToValueAtTime(0.05, now + 0.02);
    wg.gain.exponentialRampToValueAtTime(0.001, now + popAt);
    whistle.connect(wg).connect(ctx.destination);
    whistle.start(now);
    whistle.stop(now + popAt + 0.02);

    // 2. Bass thump on the pop
    const bass = ctx.createOscillator();
    const bg = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(90, now + popAt);
    bass.frequency.exponentialRampToValueAtTime(40, now + popAt + 0.18);
    bg.gain.setValueAtTime(0, now + popAt);
    bg.gain.linearRampToValueAtTime(0.16, now + popAt + 0.01);
    bg.gain.exponentialRampToValueAtTime(0.001, now + popAt + 0.2);
    bass.connect(bg).connect(ctx.destination);
    bass.start(now + popAt);
    bass.stop(now + popAt + 0.25);

    // 3. High crackle noise tail (the sparkles falling)
    const noiseDur = 0.5;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * noiseDur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3500;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0, now + popAt);
    ng.gain.linearRampToValueAtTime(0.08, now + popAt + 0.03);
    ng.gain.exponentialRampToValueAtTime(0.001, now + popAt + noiseDur);
    noise.connect(filter).connect(ng).connect(ctx.destination);
    noise.start(now + popAt);
    noise.stop(now + popAt + noiseDur + 0.05);
  }, [enabled, getCtx]);

  /**
   * Layered "shhh-shhh-shhh" crowd applause: filtered white noise with
   * a fast LFO on its amplitude to mimic many hands clapping. Fades in
   * and out so it sits under other sounds without dominating.
   */
  const playApplause = useCallback((duration = 2.5) => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const now = ctx.currentTime;

    // Continuous white-noise source
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    // Bandpass around 2 kHz — that's where "clap-clap" energy lives
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1.2;

    // Base gain with fade-in / fade-out
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.25);
    gain.gain.linearRampToValueAtTime(0.04, now + duration - 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

    // Fast LFO modulates the gain to create the "clap clap clap" rhythm
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 14; // ~14 claps per second
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start(now);
    lfo.stop(now + duration);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration + 0.05);
  }, [enabled, getCtx]);

  const playCelebration = useCallback(() => {
    // A full party moment: fanfare arpeggio + underlying applause layer
    // + a few firework "pops" over ~3 seconds. This is the reward the
    // child gets for winning a puzzle — make it worth the effort!
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    // Layer 1 — bright ascending fanfare (~1.1s)
    playSequence([
      { freq: 523.25, dur: 0.14, type: 'triangle', vol: 0.12 }, // C5
      { freq: 659.25, dur: 0.14, type: 'triangle', vol: 0.12 }, // E5
      { freq: 783.99, dur: 0.14, type: 'triangle', vol: 0.12 }, // G5
      { freq: 1046.5, dur: 0.14, type: 'triangle', vol: 0.11 }, // C6
      { freq: 1318.5, dur: 0.14, type: 'triangle', vol: 0.11 }, // E6
      { freq: 1568.0, dur: 0.36, type: 'triangle', vol: 0.11 }  // G6
    ]);

    // Layer 2 — four firework "pops" spaced across the celebration
    [400, 1100, 1800, 2400].forEach((delay) => {
      setTimeout(() => playFirework(), delay);
    });

    // Layer 3 — crowd applause underneath (fades in and out)
    playApplause(3.2);
  }, [enabled, getCtx, playSequence, playFirework, playApplause]);

  const playError = useCallback(() => {
    playSequence([
      { freq: 220, dur: 0.10, type: 'triangle', vol: 0.08 },
      { freq: 180, dur: 0.14, type: 'triangle', vol: 0.08 }
    ]);
  }, [playSequence]);

  const playBlip = useCallback(() => {
    playTone(880, 0.06, 'triangle', 0.06);
  }, [playTone]);

  const stopMusic = useCallback(() => {
    if (musicNodeRef.current) {
      try { musicNodeRef.current.stop(); } catch { /* noop */ }
      musicNodeRef.current = null;
    }
  }, []);

  const startMusic = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopMusic();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    // A short original melody in C-major pentatonic. Pentatonic notes
    // (C-D-E-G-A) always sound consonant together, so the melody is
    // "safe" for children with no jarring intervals. Each note is
    // rendered as a toy-xylophone: triangle wave for the body + a soft
    // sine harmonic at 2× for a music-box "ping" on top.
    //
    // Total loop ≈ 6.5s, then a small pause before it starts again.
    const NOTE_C5 = 523.25;
    const NOTE_D5 = 587.33;
    const NOTE_E5 = 659.25;
    const NOTE_G5 = 783.99;
    const NOTE_A5 = 880.0;
    const NOTE_C6 = 1046.5;
    const melody: { freq: number; dur: number }[] = [
      { freq: NOTE_C5, dur: 0.28 },
      { freq: NOTE_E5, dur: 0.28 },
      { freq: NOTE_G5, dur: 0.28 },
      { freq: NOTE_A5, dur: 0.28 },
      { freq: NOTE_G5, dur: 0.56 },
      { freq: NOTE_E5, dur: 0.28 },
      { freq: NOTE_D5, dur: 0.28 },
      { freq: NOTE_C5, dur: 0.28 },
      { freq: NOTE_E5, dur: 0.28 },
      { freq: NOTE_G5, dur: 0.28 },
      { freq: NOTE_C6, dur: 0.28 },
      { freq: NOTE_A5, dur: 0.56 },
      { freq: NOTE_G5, dur: 0.28 },
      { freq: NOTE_E5, dur: 0.28 },
      { freq: NOTE_D5, dur: 0.28 },
      { freq: NOTE_C5, dur: 0.56 }
    ];
    const PAUSE_BETWEEN_LOOPS = 0.9;
    const NOTE_VOLUME = 0.12;
    const HARMONIC_VOLUME = 0.035;

    // Master gain gives us a single knob to silence everything instantly.
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.55;
    // Compressor smooths overlapping note tails so the mix never clips.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 20;
    comp.ratio.value = 3;
    comp.attack.value = 0.005;
    comp.release.value = 0.15;
    masterGain.connect(comp).connect(ctx.destination);

    let timerId: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;
    let nextLoopTime = ctx.currentTime + 0.15;

    const scheduleNote = (freq: number, startAt: number, dur: number) => {
      // Body: triangle wave with a sharp percussive envelope.
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, startAt);
      g.gain.linearRampToValueAtTime(NOTE_VOLUME, startAt + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0005, startAt + dur * 0.95);
      osc.connect(g).connect(masterGain);
      osc.start(startAt);
      osc.stop(startAt + dur + 0.05);

      // Harmonic ping: sine at 2× frequency, quieter, faster decay.
      const harm = ctx.createOscillator();
      const hg = ctx.createGain();
      harm.type = 'sine';
      harm.frequency.value = freq * 2;
      hg.gain.setValueAtTime(0, startAt);
      hg.gain.linearRampToValueAtTime(HARMONIC_VOLUME, startAt + 0.003);
      hg.gain.exponentialRampToValueAtTime(0.0005, startAt + dur * 0.55);
      harm.connect(hg).connect(masterGain);
      harm.start(startAt);
      harm.stop(startAt + dur + 0.05);
    };

    const scheduleLoop = () => {
      if (stopped) return;
      const startAt = Math.max(nextLoopTime, ctx.currentTime + 0.05);
      let t = startAt;
      for (const n of melody) {
        scheduleNote(n.freq, t, n.dur);
        t += n.dur;
      }
      nextLoopTime = t + PAUSE_BETWEEN_LOOPS;
      // Schedule the *next* loop ~1s before this one ends so timing is
      // seamless. Cap the wait at 100ms as a safety net.
      const planNextIn = Math.max((t - ctx.currentTime - 1) * 1000, 100);
      timerId = setTimeout(scheduleLoop, planNextIn);
    };

    scheduleLoop();

    musicNodeRef.current = {
      stop: () => {
        stopped = true;
        if (timerId) { clearTimeout(timerId); timerId = null; }
        // Fade the master gain to zero so notes already in-flight taper
        // out instead of clicking off. Disconnect after the fade.
        try {
          const now = ctx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(masterGain.gain.value, now);
          masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.12);
        } catch { /* noop */ }
        setTimeout(() => {
          try { masterGain.disconnect(); comp.disconnect(); } catch { /* noop */ }
        }, 200);
      }
    };
  }, [getCtx, stopMusic]);

  useEffect(() => {
    if (musicEnabled && enabled) startMusic();
    else stopMusic();
    return () => stopMusic();
  }, [musicEnabled, enabled, startMusic, stopMusic]);

  return { playTone, playSuccess, playCelebration, playError, playBlip };
}
