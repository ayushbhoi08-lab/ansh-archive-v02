import { useRef, useCallback, useState } from 'react';

let sharedCtx = null;
function getCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sharedCtx;
}

export function useAudioDrone() {
  const [playingId, setPlayingId] = useState(null);
  const nodesRef = useRef(null);

  const stopDrone = useCallback(() => {
    if (!nodesRef.current) return;
    const ctx = getCtx();
    const { masterGain } = nodesRef.current;
    masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.7);
    setTimeout(() => {
      if (!nodesRef.current) return;
      Object.values(nodesRef.current).forEach(n => {
        if (!n) return;
        try { if (typeof n.stop === 'function') n.stop(); } catch (_) {}
        try { if (typeof n.disconnect === 'function') n.disconnect(); } catch (_) {}
      });
      nodesRef.current = null;
    }, 1000);
  }, []);

  const startDrone = useCallback((freq) => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.setTargetAtTime(0.16, ctx.currentTime, 1.8);
    masterGain.connect(ctx.destination);

    // Root
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(masterGain);
    osc.start();

    // Fifth
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.5;
    const g2 = ctx.createGain();
    g2.gain.value = 0.3;
    osc2.connect(g2); g2.connect(masterGain);
    osc2.start();

    // Octave
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 2;
    const g3 = ctx.createGain();
    g3.gain.value = 0.15;
    osc3.connect(g3); g3.connect(masterGain);
    osc3.start();

    // Slow tremolo LFO
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0.05;
    lfo.connect(lfoG); lfoG.connect(g3.gain);
    lfo.start();

    nodesRef.current = { osc, osc2, osc3, g2, g3, masterGain, lfo, lfoG };
  }, []);

  const toggleDrone = useCallback((shlok) => {
    if (playingId === shlok.id) {
      stopDrone();
      setPlayingId(null);
    } else {
      stopDrone();
      startDrone(shlok.freq);
      setPlayingId(shlok.id);
    }
  }, [playingId, stopDrone, startDrone]);

  return { toggleDrone, stopDrone, playingId, isPlaying: playingId !== null };
}
