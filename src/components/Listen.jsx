import { useState, useRef, useEffect, useCallback } from 'react';
import './Listen.css';

// Each track has a unique root frequency for its ambient drone
const tracks = [
  {
    number: '01',
    title: 'Bhagavad Gita — Chapter 2, Verse 47',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
    transliteration: 'Karmanye vadhikaraste ma phaleshu kadachana',
    meaning: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
    duration: '3:24',
    variant: 'Founder Variant',
    freq: 110,   // A2 — grounding, resolve
  },
  {
    number: '02',
    title: 'Bhagavad Gita — Chapter 4, Verse 7',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत',
    transliteration: 'Yada yada hi dharmasya glanir bhavati bharata',
    meaning: 'Whenever there is a decline in righteousness and an increase in unrighteousness, at that time I manifest myself.',
    duration: '4:11',
    variant: 'North Variant',
    freq: 136.1, // Om / Earth frequency — devotional
  },
  {
    number: '03',
    title: 'Bhagavad Gita — Chapter 18, Verse 66',
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज',
    transliteration: 'Sarva-dharman parityajya mam ekam saranam vraja',
    meaning: 'Abandon all varieties of religion and just surrender unto me. I shall deliver you from all sinful reactions. Do not fear.',
    duration: '5:02',
    variant: 'Dakshin Variant',
    freq: 174,   // Solfeggio — release, surrender
  },
];

// Stable per-render bar heights (seeded so they don't re-randomize)
const BAR_COUNT = 52;
const barHeights = Array.from({ length: BAR_COUNT }, (_, i) =>
  18 + Math.abs(Math.sin(i * 0.55 + 1.2) * 14) + Math.abs(Math.sin(i * 1.1) * 10)
);

function Track({ track, isPlaying, onToggle }) {
  const progressRef = useRef(0);
  const animRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);

  // Drive elapsed timer while playing
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now() - elapsed * 1000;
      const tick = () => {
        setElapsed((performance.now() - startTimeRef.current) / 1000);
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  // Reset when stopped from outside (another track started)
  useEffect(() => {
    if (!isPlaying) {
      setElapsed(0);
      startTimeRef.current = null;
    }
  }, [isPlaying]);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`track${isPlaying ? ' track--playing' : ''}`}>
      <div className="track-header">
        <span className="track-num">{track.number}</span>
        <div className="track-info">
          <h3 className="track-title">{track.title}</h3>
          <span className="track-variant">{track.variant}</span>
        </div>
        <span className="track-dur">{isPlaying ? fmt(elapsed) : track.duration}</span>
      </div>
      <div className="track-player">
        <div className="player-bar">
          <button
            className={`play-btn${isPlaying ? ' play-btn--pause' : ''}`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={onToggle}
          >
            {isPlaying ? (
              <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
                <rect x="0" y="0" width="4" height="16" />
                <rect x="8" y="0" width="4" height="16" />
              </svg>
            ) : (
              <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
                <path d="M0 0l14 8L0 16V0z" />
              </svg>
            )}
          </button>
          <div className="waveform">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className={`bar${isPlaying ? ' bar--active' : ''}`}
                style={{
                  height: `${h}px`,
                  animationDelay: isPlaying ? `${(i * 47) % 600}ms` : '0ms',
                }}
              />
            ))}
          </div>
        </div>
        <p className="track-sanskrit">{track.sanskrit}</p>
      </div>
    </div>
  );
}

// Singleton AudioContext shared across tracks
let sharedCtx = null;
function getCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sharedCtx;
}

export default function Listen() {
  const [playing, setPlaying] = useState(null); // track number string or null
  const nodesRef = useRef(null); // { osc, osc2, osc3, gain, lfo }

  const stopAudio = useCallback(() => {
    if (!nodesRef.current) return;
    const { gain } = nodesRef.current;
    const ctx = getCtx();
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    setTimeout(() => {
      try {
        Object.values(nodesRef.current).forEach(n => {
          if (n && typeof n.disconnect === 'function') n.disconnect();
          if (n && typeof n.stop === 'function') n.stop();
        });
      } catch (_) {}
      nodesRef.current = null;
    }, 1200);
  }, []);

  const startAudio = useCallback((freq) => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.setTargetAtTime(0.18, ctx.currentTime, 1.5);
    gain.connect(ctx.destination);

    // Root drone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();

    // Fifth harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.5;
    const g2 = ctx.createGain();
    g2.gain.value = 0.35;
    osc2.connect(g2);
    g2.connect(gain);
    osc2.start();

    // Octave with slow tremolo
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 2;
    const g3 = ctx.createGain();
    g3.gain.value = 0.18;
    osc3.connect(g3);
    g3.connect(gain);
    osc3.start();

    // Slow LFO tremolo on octave
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain);
    lfoGain.connect(g3.gain);
    lfo.start();

    nodesRef.current = { osc, osc2, osc3, g2, g3, gain, lfo, lfoGain };
  }, []);

  const toggle = useCallback((track) => {
    if (playing === track.number) {
      stopAudio();
      setPlaying(null);
    } else {
      stopAudio();
      startAudio(track.freq);
      setPlaying(track.number);
    }
  }, [playing, stopAudio, startAudio]);

  // Clean up on unmount
  useEffect(() => () => stopAudio(), [stopAudio]);

  return (
    <section id="listen" className="listen">
      <div className="container">
        <span className="section-label">The Archive</span>
        <span className="gold-bar" />
        <h2 className="section-title">Listen</h2>
        <p className="section-intro">
          All recordings are free. All rights are clear. CC BY — share, study, cite.
        </p>
        <div className="tracks">
          {tracks.map(t => (
            <Track
              key={t.number}
              track={t}
              isPlaying={playing === t.number}
              onToggle={() => toggle(t)}
            />
          ))}
        </div>
        <p className="listen-note">
          All recordings hosted on Internet Archive under Creative Commons Attribution (CC BY).
        </p>
      </div>
    </section>
  );
}
