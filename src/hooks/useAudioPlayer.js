import { useRef, useCallback, useState, useEffect } from 'react';

let sharedCtx = null;
function getAudioContext() {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sharedCtx;
}

export function useAudioPlayer() {
  const [playingId, setPlayingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState(new Array(64).fill(0));
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);

  const stopAnalysis = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startAnalysis = useCallback(() => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      // Downsample to 64 bars
      const bars = 64;
      const step = Math.floor(bufferLength / bars);
      const values = [];
      for (let i = 0; i < bars; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j];
        }
        values.push(sum / step);
      }
      setWaveformData(values);
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const cleanup = useCallback(() => {
    stopAnalysis();
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch (_) {}
      sourceRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    analyserRef.current = null;
  }, [stopAnalysis]);

  const play = useCallback(async (recording) => {
    setError(null);
    if (playingId === recording.id && isPlaying) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      stopAnalysis();
      return;
    }

    cleanup();

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = recording.audioUrl || `/recordings/${recording.filePath || 'test_chant.wav'}`;
    audioRef.current = audio;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    try {
      await audio.play();
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      sourceRef.current = source;
      startAnalysis();
      setPlayingId(recording.id);
      setIsPlaying(true);
      setDuration(audio.duration || 0);
      startTimeRef.current = performance.now();
    } catch (err) {
      setError(err.message);
      setIsPlaying(false);
    }

    audio.onended = () => {
      setIsPlaying(false);
      stopAnalysis();
    };

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.onerror = () => {
      setError('Failed to load audio');
      setIsPlaying(false);
    };
  }, [playingId, isPlaying, cleanup, startAnalysis, stopAnalysis]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setPlayingId(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return {
    play,
    stop,
    seek,
    playingId,
    isPlaying,
    currentTime,
    duration,
    waveformData,
    error,
    formatTime,
  };
}
