import { loadAudioMuted, saveAudioMuted } from './storage.js';

const PENTATONIC_HZ = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

export function createSoundEngine() {
  let ctx = null;
  let muted = loadAudioMuted();

  function ensureContext() {
    if (muted) return null;
    try {
      if (!ctx) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return null;
        ctx = new Ctor();
      }
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch {
      return null;
    }
  }

  function playTone(freq, duration, type, peakGain, slideTo) {
    const audio = ensureContext();
    if (!audio) return;
    try {
      const now = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      return;
    }
  }

  return {
    unlock() {
      ensureContext();
    },
    isMuted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      saveAudioMuted(muted);
      if (!muted) ensureContext();
      return muted;
    },
    playFindChime(combo) {
      const index = Math.min(PENTATONIC_HZ.length - 1, Math.max(0, (combo || 1) - 1));
      const base = PENTATONIC_HZ[index];
      playTone(base, 0.22, 'triangle', 0.14, base * 1.02);
      setTimeout(() => playTone(base * 1.5, 0.26, 'sine', 0.09, base * 1.52), 55);
    },
    playMissThud() {
      playTone(135, 0.2, 'sawtooth', 0.11, 68);
    },
    playHintPulse() {
      playTone(740, 0.24, 'sine', 0.1, 980);
    },
    playUrgentTick() {
      playTone(920, 0.055, 'square', 0.04, 860);
    },
    playVictoryFanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((hz, idx) => {
        setTimeout(() => playTone(hz, 0.34, 'triangle', 0.12, hz), idx * 90);
      });
    },
  };
}
