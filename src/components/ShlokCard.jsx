import { useState } from 'react';
import './ShlokCard.css';
import ReciterBadge from './ReciterBadge';

const BAR_COUNT = 32;
const bars = Array.from({ length: BAR_COUNT }, (_, i) =>
  14 + Math.abs(Math.sin(i * 0.6 + 0.8) * 12) + Math.abs(Math.sin(i * 1.3) * 8)
);

export default function ShlokCard({
  shlok,
  isPlaying = false,
  isSpeaking = false,
  isBookmarked = false,
  onToggleDrone,
  onSpeak,
  onBookmark,
  variant = 'card', // 'card' | 'row'
}) {
  const [expanded, setExpanded] = useState(false);

  if (variant === 'row') {
    return (
      <div className={`shlok-row${isPlaying ? ' shlok-row--playing' : ''}`}>
        <div className="row-meta">
          <span className="row-chapter">BG {shlok.chapter}.{shlok.verse}</span>
          <span className="row-title">{shlok.title}</span>
          {shlok.reciterType && <ReciterBadge type={shlok.reciterType} />}
          <span className="row-variant">{shlok.variant}</span>
        </div>
        <div className="row-actions">
          <button
            className={`icon-btn${isSpeaking ? ' icon-btn--active' : ''}`}
            onClick={() => onSpeak?.(shlok)}
            title={isSpeaking ? 'Stop speaking' : 'Speak shlok'}
          >
            {isSpeaking ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="2" width="4" height="10" rx="1"/>
                <rect x="8" y="2" width="4" height="10" rx="1"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 5h3l4-3v10l-4-3H2V5z"/>
                <path d="M10 4.5a3 3 0 0 1 0 5"/>
              </svg>
            )}
          </button>
          <button
            className={`icon-btn${isPlaying ? ' icon-btn--gold' : ''}`}
            onClick={() => onToggleDrone?.(shlok)}
            title={isPlaying ? 'Stop drone' : 'Play drone'}
          >
            {isPlaying ? (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <rect x="0" y="0" width="4" height="14" rx="1"/>
                <rect x="8" y="0" width="4" height="14" rx="1"/>
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <path d="M0 0l12 7L0 14V0z"/>
              </svg>
            )}
          </button>
          <button
            className={`icon-btn${isBookmarked ? ' icon-btn--bookmarked' : ''}`}
            onClick={() => onBookmark?.(shlok.id)}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1h10v12l-5-3.5L1 13V1z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`shlok-card${expanded ? ' shlok-card--expanded' : ''}${isPlaying ? ' shlok-card--playing' : ''}`}>
      <div className="card-top">
        <div className="card-meta">
          <span className="card-chapter">BG {shlok.chapter}.{shlok.verse}</span>
          {shlok.reciterType && <ReciterBadge type={shlok.reciterType} />}
          <span className="card-variant">{shlok.variant}</span>
        </div>
        <div className="card-actions">
          <button
            className={`icon-btn${isSpeaking ? ' icon-btn--active' : ''}`}
            onClick={() => onSpeak?.(shlok)}
            title={isSpeaking ? 'Stop' : 'Speak'}
          >
            {isSpeaking ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="2" width="4" height="10" rx="1"/>
                <rect x="8" y="2" width="4" height="10" rx="1"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 5h3l4-3v10l-4-3H2V5z"/>
                <path d="M10 4.5a3 3 0 0 1 0 5"/>
              </svg>
            )}
          </button>
          <button
            className={`icon-btn${isPlaying ? ' icon-btn--gold' : ''}`}
            onClick={() => onToggleDrone?.(shlok)}
            title={isPlaying ? 'Stop drone' : 'Play drone'}
          >
            {isPlaying ? (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <rect x="0" y="0" width="4" height="14" rx="1"/>
                <rect x="8" y="0" width="4" height="14" rx="1"/>
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <path d="M0 0l12 7L0 14V0z"/>
              </svg>
            )}
          </button>
          <button
            className={`icon-btn${isBookmarked ? ' icon-btn--bookmarked' : ''}`}
            onClick={() => onBookmark?.(shlok.id)}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1h10v12l-5-3.5L1 13V1z"/>
            </svg>
          </button>
        </div>
      </div>

      <h3 className="card-title">{shlok.title}</h3>

      <p className="card-sanskrit">{shlok.sanskrit}</p>

      {isPlaying && (
        <div className="card-waveform">
          {bars.map((h, i) => (
            <div
              key={i}
              className="card-bar"
              style={{ height: `${h}px`, animationDelay: `${(i * 53) % 700}ms` }}
            />
          ))}
        </div>
      )}

      <p className="card-translit">{shlok.transliteration}</p>

      <p className={`card-meaning${expanded ? '' : ' card-meaning--clamped'}`}>
        {shlok.meaning}
      </p>

      {expanded && (
        <div className="card-context">
          <span className="card-context-label">Context</span>
          <p>{shlok.context}</p>
          <div className="card-tags">
            {shlok.tags.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      )}

      <button className="card-expand-btn" onClick={() => setExpanded(e => !e)}>
        {expanded ? 'Show less' : 'Read more'}
        <span className={`expand-arrow${expanded ? ' up' : ''}`}>›</span>
      </button>
    </div>
  );
}
