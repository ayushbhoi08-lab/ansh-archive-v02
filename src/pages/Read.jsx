import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { shlokas, chapters, allTags } from '../data/shlokas';
import { recordings, getRecordingByShlokaId } from '../data/recordings';
import { useSpeech } from '../hooks/useSpeech';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useBookmarks } from '../hooks/useBookmarks';
import { useRatings } from '../hooks/useRatings';
import ShlokCard from '../components/ShlokCard';
import SearchBar from '../components/SearchBar';
import AcousticPanel from '../components/AcousticPanel';
import EmotionRating from '../components/EmotionRating';
import './Read.css';

export default function Read() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [chapterFilter, setChapterFilter] = useState(null);
  const [tagFilter, setTagFilter] = useState(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [view, setView] = useState('grid');
  const [expandedId, setExpandedId] = useState(null);

  const { speak, speakingId } = useSpeech();
  const { play, playingId, isPlaying } = useAudioPlayer();
  const { toggle: toggleBookmark, isBookmarked, bookmarks } = useBookmarks();
  const { hasRated, getRating, submitRating } = useRatings();

  useEffect(() => {
    const q = params.get('q');
    if (q) setQuery(q);
  }, []);

  const filtered = shlokas.filter(s => {
    const q = query.toLowerCase();
    const matchQuery = !q ||
      s.title.toLowerCase().includes(q) ||
      s.sanskrit.includes(q) ||
      s.transliteration.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      s.context.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q)) ||
      `bg ${s.chapter}.${s.verse}`.includes(q);
    const matchChapter = !chapterFilter || s.chapter === chapterFilter;
    const matchTag = !tagFilter || s.tags.includes(tagFilter);
    const matchBookmark = !showBookmarksOnly || isBookmarked(s.id);
    return matchQuery && matchChapter && matchTag && matchBookmark;
  });

  const clearFilters = () => {
    setQuery('');
    setChapterFilter(null);
    setTagFilter(null);
    setShowBookmarksOnly(false);
  };

  const hasFilters = query || chapterFilter || tagFilter || showBookmarksOnly;

  const handleToggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="read-page">
      <div className="page-header">
        <div className="container">
          <span className="section-label">The Texts</span>
          <h1 className="page-title">Read</h1>
          <p className="page-desc">
            Browse, search, and study all {shlokas.length} shlokas. Each one speaks — tap the sound icon to hear it. Expand for acoustic analysis and emotion ratings.
          </p>
        </div>
      </div>

      <div className="read-body">
        <div className="container">
          <SearchBar value={query} onChange={setQuery} resultCount={filtered.length} />

          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <span className="filter-label">Chapter</span>
              <div className="filter-pills">
                <button
                  className={`pill${!chapterFilter ? ' pill--active' : ''}`}
                  onClick={() => setChapterFilter(null)}
                >All</button>
                {chapters.map(c => (
                  <button
                    key={c}
                    className={`pill${chapterFilter === c ? ' pill--active' : ''}`}
                    onClick={() => setChapterFilter(chapterFilter === c ? null : c)}
                  >
                    Ch. {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Tags</span>
              <div className="filter-pills">
                <button
                  className={`pill${!tagFilter ? ' pill--active' : ''}`}
                  onClick={() => setTagFilter(null)}
                >All</button>
                {allTags.slice(0, 12).map(t => (
                  <button
                    key={t}
                    className={`pill${tagFilter === t ? ' pill--active' : ''}`}
                    onClick={() => setTagFilter(tagFilter === t ? null : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-row">
              <button
                className={`pill${showBookmarksOnly ? ' pill--active' : ''}`}
                onClick={() => setShowBookmarksOnly(b => !b)}
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill={showBookmarksOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1h8v10l-4-2.8L1 11V1z"/>
                </svg>
                Bookmarks {bookmarks.length > 0 && `(${bookmarks.length})`}
              </button>
              <div className="view-toggle">
                <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="0" y="0" width="6" height="6"/><rect x="8" y="0" width="6" height="6"/>
                    <rect x="0" y="8" width="6" height="6"/><rect x="8" y="8" width="6" height="6"/>
                  </svg>
                </button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="0" y="0" width="14" height="2"/><rect x="0" y="6" width="14" height="2"/>
                    <rect x="0" y="12" width="14" height="2"/>
                  </svg>
                </button>
              </div>
            </div>
            {hasFilters && (
              <button className="clear-btn" onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>No shlokas match your search.</p>
              <button onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className={view === 'grid' ? 'shlok-grid' : 'shlok-list'}>
              {filtered.map((s, i) => {
                const rec = getRecordingByShlokaId(s.id);
                const isExpanded = expandedId === s.id;
                return (
                  <div key={s.id} style={{ animationDelay: `${i * 40}ms` }}>
                    <div onClick={() => !isExpanded && handleToggleExpand(s.id)}>
                      <ShlokCard
                        shlok={{ ...s, reciterType: rec?.reciterType }}
                        variant={view === 'list' ? 'row' : 'card'}
                        isPlaying={isPlaying && playingId === rec?.id}
                        isSpeaking={speakingId === s.id}
                        isBookmarked={isBookmarked(s.id)}
                        onToggleDrone={() => rec && play({ id: rec.id, audioUrl: `/recordings/${rec.filePath}` })}
                        onSpeak={speak}
                        onBookmark={toggleBookmark}
                      />
                    </div>
                    {isExpanded && rec && (
                      <>
                        <AcousticPanel features={rec.features} emotionProfile={rec.emotionProfile} />
                        <EmotionRating
                          recordingId={rec.id}
                          onSubmit={submitRating}
                          hasRated={hasRated(rec.id)}
                          existingRating={getRating(rec.id)}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
