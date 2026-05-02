import './ReciterBadge.css';

const LABELS = {
  devotional: 'Devotional',
  'non-devotional': 'Non-Devotional',
  academic: 'Academic',
};

export default function ReciterBadge({ type = 'devotional' }) {
  const key = type === 'non-devotional' ? 'nondevotional' : type;
  return (
    <span className={`reciter-badge reciter-badge--${key}`}>
      <span className="reciter-badge__dot" />
      {LABELS[type] || type}
    </span>
  );
}
