import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './NineShlokaGate.css';

const NODE_COUNT = 9;
const RADIUS = 120; // px from center

export default function NineShlokaGate({
  shlokas,
  progress,
  completedCount,
  isUnlocked,
  onSelectShloka,
  onEnterArchive,
  inline = false,
}) {
  const navigate = useNavigate();

  // Calculate node positions in a circle
  const nodes = useMemo(() => {
    return shlokas.map((s, i) => {
      const angle = (Math.PI * 2 * i) / NODE_COUNT - Math.PI / 2;
      const x = 50 + (Math.cos(angle) * RADIUS / 160 * 50); // percentage
      const y = 50 + (Math.sin(angle) * RADIUS / 160 * 50);
      const isCompleted = !!progress[s.id]?.completed;
      return { ...s, x, y, isCompleted, index: i + 1 };
    });
  }, [shlokas, progress]);

  const ringProgress = completedCount / NODE_COUNT;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - ringProgress);

  if (isUnlocked && !inline) {
    return (
      <div className="gate-overlay unlocked">
        <div className="gate-content">
          <div className="gate-unlock-msg">
            <p>The archive is now open. All nine verses have been heard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isUnlocked) return null;

  return (
    <div className={inline ? 'gate-inline' : 'gate-overlay'}>
      <div className="gate-content">
        <span className="gate-eyebrow">Ritual of Entry</span>
        <h1 className="gate-title">The Nine Verses</h1>
        <p className="gate-desc">
          Before entering the full archive, listen to nine foundational verses.
          This is not a barrier — it is an initiation.
        </p>
        <p className="gate-progress-text">
          {completedCount} of {NODE_COUNT} completed
        </p>

        {/* Mandala visualization */}
        <div className="gate-mandala">
          <svg className="gate-ring-svg" viewBox="0 0 320 320">
            <circle
              className="gate-ring-track"
              cx="160"
              cy="160"
              r="140"
            />
            <circle
              className="gate-ring-progress"
              cx="160"
              cy="160"
              r="140"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 160 160)"
            />
          </svg>

          <div className="gate-center-ring">
            {completedCount}
          </div>

          {nodes.map(node => (
            <div
              key={node.id}
              className={`gate-node${node.isCompleted ? ' gate-node--completed' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => onSelectShloka?.(node)}
              title={node.title}
            >
              {node.isCompleted ? (
                <svg className="gate-node-check" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 7l4 4 6-8" />
                </svg>
              ) : (
                <span className="gate-node-num">{node.index}</span>
              )}
            </div>
          ))}
        </div>

        {/* List view */}
        <div className="gate-shlokas-list">
          {nodes.map(node => (
            <div
              key={node.id}
              className={`gate-shloka-item${node.isCompleted ? ' gate-shloka-item--completed' : ''}`}
              onClick={() => onSelectShloka?.(node)}
            >
              <div className="gate-shloka-num">
                {node.isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 7l4 4 6-8" />
                  </svg>
                ) : (
                  node.index
                )}
              </div>
              <div className="gate-shloka-info">
                <div className="gate-shloka-title">{node.title}</div>
                <div className="gate-shloka-ref">BG {node.chapter}.{node.verse}</div>
              </div>
              <div className="gate-shloka-status">
                {node.isCompleted ? 'Heard' : 'Listen'}
              </div>
            </div>
          ))}
        </div>

        {isUnlocked && (
          <div className="gate-unlock-msg">
            <p>The archive opens. You may now browse all {NODE_COUNT} verses and beyond.</p>
          </div>
        )}
      </div>
    </div>
  );
}
