import { useState, useCallback } from 'react';
import './EmotionRating.css';

const DIMENSIONS = [
  { key: 'calm', label: 'Calm' },
  { key: 'awe', label: 'Awe' },
  { key: 'absorption', label: 'Absorption' },
  { key: 'tension', label: 'Tension' },
  { key: 'sacredness', label: 'Sacredness' },
];

export default function EmotionRating({ recordingId, onSubmit, hasRated, existingRating }) {
  const [values, setValues] = useState(() => {
    if (existingRating) {
      return {
        calm: existingRating.calm || 4,
        awe: existingRating.awe || 4,
        absorption: existingRating.absorption || 4,
        tension: existingRating.tension || 4,
        sacredness: existingRating.sacredness || 4,
      };
    }
    return { calm: 4, awe: 4, absorption: 4, tension: 4, sacredness: 4 };
  });
  const [submitted, setSubmitted] = useState(hasRated);

  const handleChange = useCallback((key, val) => {
    setValues(prev => ({ ...prev, [key]: Number(val) }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit?.(recordingId, values);
    setSubmitted(true);
  }, [onSubmit, recordingId, values]);

  // Build radar chart path
  const radarPoints = DIMENSIONS.map((d, i) => {
    const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
    const val = (values[d.key] / 7) * 60;
    const x = 80 + Math.cos(angle) * val;
    const y = 80 + Math.sin(angle) * val;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="emotion-rating">
      <div className="er-header">
        <span className="er-title">Emotion Rating</span>
      </div>
      <p className="er-subtitle">
        Your listening experience contributes to the thesis. Rate this recording on a scale of 1–7.
      </p>

      {!submitted ? (
        <>
          <div className="er-sliders">
            {DIMENSIONS.map(d => (
              <div key={d.key} className="er-slider-group">
                <label className="er-slider-label">
                  <span>{d.label}</span>
                  <span>{values[d.key]}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={values[d.key]}
                  onChange={e => handleChange(d.key, e.target.value)}
                  className="er-slider"
                />
              </div>
            ))}
          </div>
          <div className="er-actions">
            <button className="er-submit" onClick={handleSubmit}>
              Contribute to Thesis
            </button>
          </div>
        </>
      ) : (
        <div className="er-thanks">
          Thank you. Your data point has been recorded.
        </div>
      )}

      <div className="er-stats">
        <div className="er-stats-title">Your Response</div>
        <div className="er-radar">
          <svg className="er-radar-svg" viewBox="0 0 160 160">
            {/* Background web */}
            {[1, 2, 3].map(ring => (
              <polygon
                key={ring}
                points={DIMENSIONS.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
                  const r = (ring / 3) * 60;
                  return `${80 + Math.cos(angle) * r},${80 + Math.sin(angle) * r}`;
                }).join(' ')}
                fill="none"
                stroke="rgba(245,245,240,0.06)"
                strokeWidth="0.5"
              />
            ))}
            {/* Axes */}
            {DIMENSIONS.map((_, i) => {
              const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
              const x = 80 + Math.cos(angle) * 60;
              const y = 80 + Math.sin(angle) * 60;
              return <line key={i} x1="80" y1="80" x2={x} y2={y} stroke="rgba(245,245,240,0.06)" strokeWidth="0.5" />;
            })}
            {/* Data polygon */}
            <polygon
              points={radarPoints}
              fill="rgba(201,168,76,0.15)"
              stroke="var(--gold)"
              strokeWidth="1"
            />
            {/* Data points */}
            {DIMENSIONS.map((d, i) => {
              const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
              const val = (values[d.key] / 7) * 60;
              const x = 80 + Math.cos(angle) * val;
              const y = 80 + Math.sin(angle) * val;
              return <circle key={i} cx={x} cy={y} r="3" fill="var(--gold-light)" />;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
