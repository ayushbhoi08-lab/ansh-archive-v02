import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search shlokas…', resultCount }) {
  return (
    <div className="searchbar">
      <div className="searchbar-inner">
        <svg className="searchbar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6.5" cy="6.5" r="5"/>
          <path d="M10.5 10.5l4 4"/>
        </svg>
        <input
          type="text"
          className="searchbar-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
        {value && (
          <button className="searchbar-clear" onClick={() => onChange('')} aria-label="Clear">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l10 10M11 1L1 11"/>
            </svg>
          </button>
        )}
      </div>
      {value && (
        <span className="searchbar-count">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
