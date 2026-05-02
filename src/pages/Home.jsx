import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shlokas, getDailySholk } from '../data/shlokas';
import { useSpeech } from '../hooks/useSpeech';
import './Home.css';

const cards = [
  { to: '/listen', label: 'Listen', desc: 'Ambient drone + spoken shloks. Meditative listening.' },
  { to: '/read', label: 'Read', desc: 'Search, filter, and study all 22 shlokas in the archive.' },
  { to: '/study', label: 'Study', desc: 'The thesis framework — H1 through H5 — openly shared.' },
  { to: '/founder', label: 'Founder', desc: 'The courage story behind Ansh Archive.' },
];

export default function Home() {
  const daily = getDailySholk();
  const { speak, speakingId } = useSpeech();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/read?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="container home-hero-content">
          <p className="home-eyebrow">Sanskrit Archive</p>
          <h1 className="home-title">ANSH</h1>
          <p className="home-sub">Sanskrit shloks for study &amp; preservation.</p>
          <p className="home-tagline">Ancient vocal. Modern listening. One archive.</p>
          <div className="home-buttons">
            <Link to="/listen" className="btn btn-primary">Enter the Archive</Link>
            <Link to="/founder" className="btn btn-ghost">The Founder</Link>
          </div>
          <form className="home-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search shlokas, chapters, or keywords…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className="home-meta">
            <span>{shlokas.length} shlokas</span>
            <span className="dot">·</span>
            <span>CC BY recordings</span>
            <span className="dot">·</span>
            <span>Free to listen</span>
          </div>
        </div>
        <div className="home-scroll">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Shlok of the day */}
      <section className="sotd">
        <div className="container">
          <span className="section-label">Shlok of the Day</span>
          <span className="gold-bar" />
          <div className="sotd-card">
            <div className="sotd-header">
              <span className="sotd-ref">BG {daily.chapter}.{daily.verse}</span>
              <button
                className={`sotd-speak${speakingId === daily.id ? ' speaking' : ''}`}
                onClick={() => speak(daily)}
              >
                {speakingId === daily.id ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <rect x="1" y="1" width="4" height="10" rx="1"/>
                      <rect x="7" y="1" width="4" height="10" rx="1"/>
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 4h3l4-3v10l-4-3H1V4z"/>
                      <path d="M9 3.5a3 3 0 0 1 0 7"/>
                    </svg>
                    Speak
                  </>
                )}
              </button>
            </div>
            <p className="sotd-sanskrit">{daily.sanskrit}</p>
            <p className="sotd-translit">{daily.transliteration}</p>
            <p className="sotd-meaning">{daily.meaning}</p>
            <Link to="/read" className="sotd-more">View all shlokas →</Link>
          </div>
        </div>
      </section>

      {/* Nav cards */}
      <section className="home-nav-cards">
        <div className="container">
          <span className="section-label">Explore</span>
          <span className="gold-bar" />
          <div className="nav-card-grid">
            {cards.map(c => (
              <Link key={c.to} to={c.to} className="nav-card">
                <span className="nav-card-label">{c.label}</span>
                <p className="nav-card-desc">{c.desc}</p>
                <span className="nav-card-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mantra */}
      <section className="home-mantra">
        <div className="container">
          <blockquote className="mantra-text">
            "The archive is the proof. The thesis is the foundation.<br/>
            The community is the point. The revenue is the oxygen.<br/>
            The artist is the future. The founder is the servant."
          </blockquote>
        </div>
      </section>
    </div>
  );
}
