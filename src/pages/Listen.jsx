import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { shlokas } from '../data/shlokas';
import { recordings, getRecordingByShlokaId } from '../data/recordings';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useSpeech } from '../hooks/useSpeech';
import { useBookmarks } from '../hooks/useBookmarks';
import { useGateProgress } from '../hooks/useGateProgress';
import { useRatings } from '../hooks/useRatings';
import ShlokCard from '../components/ShlokCard';
import SearchBar from '../components/SearchBar';
import WaveformPlayer from '../components/WaveformPlayer';
import AcousticPanel from '../components/AcousticPanel';
import EmotionRating from '../components/EmotionRating';
import NineShlokaGate from '../components/NineShlokaGate';
import './Listen.css';

export default function Listen() {
  const [searchParams] = useSearchParams();
  const initialShlokId = Number(searchParams.get('shlok')) || shlokas[0].id;
  const [activeId, setActiveId] = useState(initialShlokId);
  const [query, setQuery] = useState('');
  const listenStartRef = useRef(null);

  const active = shlokas.find(s => s.id === activeId);
  const recording = getRecordingByShlokaId(activeId);
  const { speak, speakingId } = useSpeech();
  const { toggle: toggleBookmark, isBookmarked } = useBookmarks();
  const { isUnlocked, completedCount, reportListen, getGateShlokas, progress } = useGateProgress();
  const { hasRated, getRating, submitRating } = useRatings();

  const {
    play,
    seek,
    playingId,
    isPlaying,
    currentTime,
    duration,
    waveformData,
    error,
    formatTime,
  } = useAudioPlayer();

  // Track listening time for gate progress
  useEffect(() => {
    if (isPlaying && playingId === recording?.id) {
      listenStartRef.current = performance.now();
    } else if (listenStartRef.current && recording) {
      const elapsed = (performance.now() - listenStartRef.current) / 1000;
      reportListen(activeId, elapsed);
      listenStartRef.current = null;
    }
    return () => {
      if (listenStartRef.current && recording) {
        const elapsed = (performance.now() - listenStartRef.current) / 1000;
        reportListen(activeId, elapsed);
      }
    };
  }, [isPlaying, playingId, recording, activeId, reportListen]);

  const allShlokas = shlokas;
  const gateShlokas = getGateShlokas();

  const displayShlokas = isUnlocked
    ? allShlokas.filter(s => {
        const q = query.toLowerCase();
        return !q ||
          s.title.toLowerCase().includes(q) ||
          s.transliteration.toLowerCase().includes(q) ||
          s.meaning.toLowerCase().includes(q) ||
          s.tags.some(t => t.includes(q)) ||
          `${s.chapter}`.includes(q) ||
          `${s.verse}`.includes(q);
      })
    : gateShlokas;

  const handleSelect = (shlok) => {
    if (activeId !== shlok.id) {
      setActiveId(shlok.id);
    }
  };

  const handlePlayRecording = () => {
    if (!recording) return;
    play({
      id: recording.id,
      audioUrl: `/recordings/${recording.filePath}`,
    });
  };

  const handleSeek = (time) => {
    seek(time);
  };

  return (
    <div className="listen-page">
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <span className="section-label">The Archive</span>
          <h1 className="page-title">Listen</h1>
          <p className="page-desc">
            {isUnlocked
              ? 'Real recordings with acoustic analysis. Browse the full archive.'
              : 'Listen to nine foundational verses to unlock the full archive. This is not a barrier — it is an initiation.'}
          </p>
        </div>
      </div>

      {/* Gate Progress (always visible until unlocked) */}
      {!isUnlocked && (
        <div className="gate-section">
          <div className="container">
            <NineShlokaGate
              shlokas={gateShlokas}
              progress={progress}
              completedCount={completedCount}
              isUnlocked={isUnlocked}
              onSelectShloka={handleSelect}
              inline
            />
          </div>
        </div>
      )}

      {/* Unlock celebration */}
      {isUnlocked && completedCount === 9 && (
        <div className="unlock-banner">
          <div className="container">
            <p>The archive is open. All nine verses have been heard.</p>
          </div>
        </div>
      )}

      {/* Now playing */}
      <div className="now-playing-wrap">
        <div className="container">
          <div className="now-playing">
            <div className="np-left">
              <span className="np-label">Now Playing</span>
              <h2 className="np-title">{active.title}</h2>
              <span className="np-ref">BG {active.chapter}.{active.verse} · {active.variant}</span>
              <p className="np-sanskrit">{active.sanskrit}</p>
              <p className="np-translit">{active.transliteration}</p>
            </div>
            <div className="np-right">
              {recording ? (
                <>
                  <WaveformPlayer
                    isPlaying={isPlaying && playingId === recording.id}
                    currentTime={currentTime}
                    duration={duration}
                    waveformData={waveformData}
                    onPlay={handlePlayRecording}
                    onSeek={handleSeek}
                    error={error}
                  />
                  <div className="np-controls">
                    <button
                      className={`np-btn${speakingId === active.id ? ' speaking' : ''}`}
                      onClick={() => speak(active)}
                    >
                      {speakingId === active.id ? (
                        <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <rect x="1" y="1" width="4" height="10" rx="1"/>
                          <rect x="7" y="1" width="4" height="10" rx="1"/>
                        </svg> Stop</>
                      ) : (
                        <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 5h3l4-3v10l-4-3H2V5z"/>
                          <path d="M10 4.5a3 3 0 0 1 0 5"/>
                        </svg> Speak</>
                      )}
                    </button>
                    <button
                      className={`np-btn${isBookmarked(active.id) ? ' bookmarked' : ''}`}
                      onClick={() => toggleBookmark(active.id)}
                    >
                      <svg width="12" height="14" viewBox="0 0 12 14" fill={isBookmarked(active.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 1h10v12l-5-3.5L1 13V1z"/>
                      </svg>
                      {isBookmarked(active.id) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  <AcousticPanel
                    features={recording.features}
                    emotionProfile={recording.emotionProfile}
                  />
                  <EmotionRating
                    recordingId={recording.id}
                    onSubmit={submitRating}
                    hasRated={hasRated(recording.id)}
                    existingRating={getRating(recording.id)}
                  />
                </>
              ) : (
                <div className="np-no-recording">
                  <p>No recording available for this shloka yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="playlist-wrap">
        <div className="container">
          <div className="playlist-header">
            <h3 className="playlist-title">
              {isUnlocked ? 'All Shlokas' : 'The Nine Verses'}
            </h3>
            {isUnlocked && (
              <SearchBar value={query} onChange={setQuery} resultCount={displayShlokas.length} placeholder="Filter shlokas…" />
            )}
          </div>
          <div className="playlist">
            {displayShlokas.length === 0 && (
              <p className="playlist-empty">No shlokas match "{query}"</p>
            )}
            {displayShlokas.map(s => {
              const rec = getRecordingByShlokaId(s.id);
              return (
                <div
                  key={s.id}
                  className={`playlist-item${activeId === s.id ? ' playlist-item--active' : ''}`}
                  onClick={() => handleSelect(s)}
                >
                  <ShlokCard
                    shlok={{ ...s, reciterType: rec?.reciterType }}
                    variant="row"
                    isPlaying={isPlaying && playingId === rec?.id}
                    isSpeaking={speakingId === s.id}
                    isBookmarked={isBookmarked(s.id)}
                    onToggleDrone={() => rec && play({ id: rec.id, audioUrl: `/recordings/${rec.filePath}` })}
                    onSpeak={speak}
                    onBookmark={toggleBookmark}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
