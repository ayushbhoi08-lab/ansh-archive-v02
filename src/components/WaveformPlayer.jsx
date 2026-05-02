import { useRef, useEffect, useCallback } from 'react';
import './WaveformPlayer.css';

export default function WaveformPlayer({
  isPlaying,
  currentTime,
  duration,
  waveformData,
  onPlay,
  onSeek,
  error,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const barCount = waveformData.length;
    const barWidth = Math.max(1, (w / barCount) * 0.7);
    const gap = (w / barCount) * 0.3;

    ctx.clearRect(0, 0, w, h);

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const value = waveformData[i] || 0;
      const barHeight = (value / 255) * h * 0.9;
      const x = i * (barWidth + gap) + gap / 2;
      const y = (h - barHeight) / 2;

      // Gold gradient based on amplitude
      const intensity = value / 255;
      const r = Math.floor(201 * (0.5 + intensity * 0.5));
      const g = Math.floor(168 * (0.5 + intensity * 0.5));
      const b = Math.floor(76 * (0.5 + intensity * 0.5));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Draw playhead
    if (duration > 0) {
      const progress = currentTime / duration;
      const px = progress * w;
      ctx.strokeStyle = 'var(--gold-light)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
  }, [waveformData, currentTime, duration]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    onSeek?.(progress * duration);
  }, [duration, onSeek]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="waveform-player">
      <button
        className={`wp-play-btn${isPlaying ? ' playing' : ''}`}
        onClick={onPlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="4" height="12" rx="1" />
            <rect x="8" y="1" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M3 1l10 6L3 13V1z" />
          </svg>
        )}
      </button>
      <div className="wp-visual">
        <div
          className="wp-canvas-wrap"
          ref={containerRef}
          onClick={handleCanvasClick}
        >
          <div className="wp-progress-bar" style={{ width: `${progressPercent}%` }} />
          <canvas ref={canvasRef} className="wp-canvas" />
        </div>
        <div className="wp-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        {error && <div className="wp-error">{error}</div>}
      </div>
    </div>
  );
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}
