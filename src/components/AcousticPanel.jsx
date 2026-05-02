import { useState } from 'react';
import './AcousticPanel.css';

export default function AcousticPanel({ features = {}, emotionProfile = {} }) {
  const [expanded, setExpanded] = useState(false);

  const {
    tempoBPM,
    pauseArchitecture = [],
    accentDensity,
    meterType,
    rhythmicRegularity,
    f0Contour = [],
    formants = [],
  } = features;

  const hasData = tempoBPM || meterType || f0Contour.length > 0;

  if (!hasData) return null;

  const maxPause = Math.max(...pauseArchitecture, 1);
  const maxF0 = Math.max(...f0Contour, 200);
  const minF0 = Math.min(...f0Contour, 80);

  // Build SVG path for F0 contour
  const f0Path = f0Contour.length > 1
    ? f0Contour.map((v, i) => {
        const x = (i / (f0Contour.length - 1)) * 100;
        const y = 100 - ((v - minF0) / (maxF0 - minF0)) * 80 - 10;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ')
    : '';

  const f0Area = f0Contour.length > 1
    ? `${f0Path} L 100 100 L 0 100 Z`
    : '';

  return (
    <div className="acoustic-panel">
      <div className="ap-header" onClick={() => setExpanded(e => !e)}>
        <span className="ap-title">Acoustic Analysis</span>
        <span className={`ap-arrow${expanded ? ' expanded' : ''}`}>›</span>
      </div>

      {expanded && (
        <div className="ap-body">
          <div className="ap-badges">
            {tempoBPM && <div className="ap-badge">Tempo: <span>{tempoBPM} BPM</span></div>}
            {meterType && <div className="ap-badge">Meter: <span>{meterType}</span></div>}
            {accentDensity && <div className="ap-badge">Accents: <span>{accentDensity}/min</span></div>}
          </div>

          {pauseArchitecture.length > 0 && (
            <div className="ap-chart">
              <span className="ap-chart-label">Pause Architecture (s)</span>
              <div className="ap-pause-bars">
                {pauseArchitecture.map((p, i) => (
                  <div
                    key={i}
                    className="ap-pause-bar"
                    style={{ height: `${(p / maxPause) * 100}%` }}
                    title={`${p.toFixed(2)}s`}
                  />
                ))}
              </div>
            </div>
          )}

          {f0Contour.length > 0 && (
            <div className="ap-chart">
              <span className="ap-chart-label">F0 Contour (Hz)</span>
              <svg className="ap-f0-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid lines */}
                {[25, 50, 75].map(y => (
                  <line key={y} className="ap-f0-grid" x1="0" y1={y} x2="100" y2={y} />
                ))}
                <path className="ap-f0-area" d={f0Area} />
                <path className="ap-f0-path" d={f0Path} vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          )}

          {formants.length > 0 && (
            <div className="ap-chart">
              <span className="ap-chart-label">Formants (Hz)</span>
              <div className="ap-formants">
                {formants.map((f, i) => (
                  <div key={i} className="ap-formant">
                    <div className="ap-formant-dot" />
                    <span className="ap-formant-label">F{i + 1}: {Math.round(f)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {typeof rhythmicRegularity === 'number' && (
            <div className="ap-chart">
              <span className="ap-chart-label">Rhythmic Regularity</span>
              <div className="ap-reg-gauge">
                <div className="ap-reg-track">
                  <div className="ap-reg-fill" style={{ width: `${rhythmicRegularity * 100}%` }} />
                </div>
                <span className="ap-reg-value">{(rhythmicRegularity * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
