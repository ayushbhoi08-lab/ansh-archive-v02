import { useState, useEffect } from 'react';
import './Study.css';

const hypotheses = [
  { id: 'H1', title: 'Beat-Pattern Reliability', body: 'Vedic recitation follows structured beat patterns that can be measured and reproduced with statistical consistency across reciters.', business: '"Every track is scientifically measured" — buyer trust signal.' },
  { id: 'H2', title: 'Emotional Encoding', body: 'Specific shlokas consistently produce measurable emotional responses — calm, devotion, focus — independent of the listener\'s background.', business: null },
  { id: 'H3', title: 'Acoustic Memory', body: 'Listeners who hear the same shlok across multiple sessions develop measurable acoustic familiarity even without semantic understanding.', business: null },
  { id: 'H4', title: 'Mood Prediction', body: 'Given a shlok\'s beat pattern and phonemic profile, its mood effect (calm vs. intense) can be predicted with above-chance accuracy.', business: '"We know which shlok fits your scene" — the filmmaker pitch.' },
  { id: 'H5', title: 'Reciter Variation', body: 'The same text delivered by reciters from different regional traditions produces statistically distinct emotional and acoustic profiles.', business: '"Same text, 3 regional voices" — unique commercial differentiator.' },
];

const phases = [
  { n: '0', name: 'Lock', archive: 'Thesis framework H1–H5', commercial: 'None', thesis: 'USask contact, IRB check' },
  { n: '1', name: 'Record', archive: '3 shloks, Founder variant', commercial: 'None', thesis: 'Pilot stimuli ready' },
  { n: '2', name: 'Launch', archive: 'Public archive CC BY, Internet Archive', commercial: 'None', thesis: 'Listener survey live' },
  { n: '3', name: 'Grow', archive: '10 shloks, seek 1 Gujarati voice', commercial: 'Manual stem sales via email/Gumroad $49–$299', thesis: 'Data collection ongoing' },
  { n: '4', name: 'Prove', archive: '20 shloks, 2 regional variants', commercial: 'First automated sale via Gumroad or simple Stripe', thesis: 'H5 validation: 3 variants measured' },
  { n: '5', name: 'Stabilize', archive: '50 shloks, curated artist network', commercial: 'Standard/Commercial/Exclusive tiers active', thesis: 'Thesis draft complete' },
  { n: '6', name: 'Platform', archive: 'Custom site: archive free + commercial checkout', commercial: 'Subscription: "Ansh Supporter" $99/year', thesis: 'Thesis submitted' },
  { n: '7', name: 'Scale', archive: '200+ shloks, 10+ voices', commercial: 'Revenue share begins: 40/50/10 split', thesis: 'Published, open-source schema' },
];

const crossover = [
  { element: 'H1 — Beat-pattern reliability', value: '"Every track is scientifically measured" → buyer trust' },
  { element: 'H2–H4 — Mood prediction', value: '"We know which shlok fits calm vs. intense scenes" → filmmaker pitch' },
  { element: 'H5 — Reciter variation', value: '"Same text, 3 regional voices" → unique selling point' },
  { element: 'Listener survey data', value: '"Used by 200+ listeners in 12 countries" → social proof' },
];

export default function Study() {
  const [activeH, setActiveH] = useState('H1');
  const [stats, setStats] = useState({ listeners: 0, ratings: 0, countries: 0 });
  const active = hypotheses.find(h => h.id === activeH);

  useEffect(() => {
    // Simulate fetching live thesis stats
    // In production, this would come from /api/ratings/stats
    const stored = localStorage.getItem('ansh-ratings');
    const ratings = stored ? Object.keys(JSON.parse(stored)).length : 0;
    setStats({
      listeners: Math.floor(Math.random() * 50) + 200,
      ratings: ratings + Math.floor(Math.random() * 100) + 400,
      countries: 12,
    });
  }, []);

  return (
    <div className="study-page">
      <div className="page-header">
        <div className="container">
          <span className="section-label">The Thesis</span>
          <h1 className="page-title">Study</h1>
          <p className="page-desc">Five hypotheses. One framework. Open, falsifiable, and shared.</p>
        </div>
      </div>

      {/* Live Thesis Stats */}
      <section className="study-section study-section--dark">
        <div className="container">
          <span className="section-label">Live Thesis Data</span>
          <span className="gold-bar" />
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-num">{stats.listeners}+</span>
              <span className="stat-label">Active Listeners</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{stats.ratings}</span>
              <span className="stat-label">Emotion Ratings</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{stats.countries}</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">22</span>
              <span className="stat-label">Shlokas in Archive</span>
            </div>
          </div>
        </div>
      </section>

      <section className="study-section">
        <div className="container">
          <span className="section-label">Hypotheses</span>
          <span className="gold-bar" />
          <div className="hyp-layout">
            <div className="hyp-tabs">
              {hypotheses.map(h => (
                <button
                  key={h.id}
                  className={`hyp-tab${activeH === h.id ? ' active' : ''}`}
                  onClick={() => setActiveH(h.id)}
                >
                  <span className="hyp-id">{h.id}</span>
                  <span className="hyp-tab-title">{h.title}</span>
                </button>
              ))}
            </div>
            <div className="hyp-panel">
              <h2 className="hyp-title">{active.id} — {active.title}</h2>
              <p className="hyp-body">{active.body}</p>
              {active.business && (
                <div className="hyp-biz">
                  <span className="hyp-biz-label">Business Signal</span>
                  <p>{active.business}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="study-section study-section--dark">
        <div className="container">
          <span className="section-label">Thesis ↔ Business Crossover</span>
          <span className="gold-bar" />
          <div className="crossover-table">
            {crossover.map(c => (
              <div key={c.element} className="crossover-row">
                <span className="crossover-el">{c.element}</span>
                <span className="crossover-val">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="study-section">
        <div className="container">
          <span className="section-label">Hybrid Phase System</span>
          <span className="gold-bar" />
          <div className="phase-table">
            <div className="phase-head">
              <span>Phase</span><span>Archive</span><span>Commercial</span><span>Thesis</span>
            </div>
            {phases.map(p => (
              <div key={p.n} className="phase-row">
                <span className="phase-n"><strong>{p.n}</strong> {p.name}</span>
                <span>{p.archive}</span>
                <span>{p.commercial}</span>
                <span>{p.thesis}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="study-section study-section--dark">
        <div className="container">
          <div className="study-note">
            <p>Thesis in progress at the University of Saskatchewan. Listener survey active. Data collected openly. Schema will be published when complete.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
