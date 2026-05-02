import './Founder.css';

const timeline = [
  { year: '2022', note: 'Arrives at USask. Alone. Unfamiliar with how universities work.' },
  { year: '2024', note: 'First Required to Discontinue. Tim Hortons. Promises he could not keep.' },
  { year: 'Early 2026', note: 'Collapse. Turns to the Bhagavad Gita.' },
  { year: 'May 2026', note: 'Ansh Archive launches — thesis, archive, and thin commercial layer.' },
];

export default function Founder() {
  return (
    <div className="founder-page">
      <div className="page-header">
        <div className="container">
          <span className="section-label">The Founder</span>
          <h1 className="page-title">Courage Story</h1>
        </div>
      </div>

      <section className="founder-body-section">
        <div className="container founder-layout">
          <div className="founder-aside">
            <div className="founder-emblem">A</div>
            <div className="founder-timeline">
              {timeline.map(t => (
                <div key={t.year} className="t-item">
                  <span className="t-year">{t.year}</span>
                  <span className="t-note">{t.note}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="founder-copy">
            <p>I began at the University of Saskatchewan in 2022, alone, unfamiliar with how universities worked, too afraid to ask for help.</p>
            <p>By 2024, I had hit my first Required to Discontinue. I made promises I could not keep. I worked at Tim Hortons to survive. I stopped telling the truth.</p>
            <p>In early 2026, I reached collapse. I turned to the Bhagavad Gita.</p>
            <p className="founder-highlight">That study became Ansh — a thesis at USask, an open audio archive, and eventually a thin commercial layer that keeps both alive.</p>
            <p>The thesis tests five hypotheses about Vedic recitation: beat-pattern reliability, emotional encoding, acoustic memory, mood prediction, and reciter variation. Every recording in the archive is a data point. Every listener rating contributes to the research.</p>
            <p>You do not need money to begin. You do not need guidance. You need courage.</p>
            <p>But you do need money to continue — to record the next voice, to pay the next artist, to keep the archive growing. That is why the commercial layer exists. Not to make me rich. To make the archive permanent.</p>
            <blockquote className="founder-quote">
              "Good happens to those who do good. But good also needs a budget line."
            </blockquote>
            <div className="founder-thesis">
              <span className="founder-thesis-label">Current Research</span>
              <p>University of Saskatchewan — Thesis in Progress</p>
              <p>Five hypotheses · Open data · Listener-driven</p>
            </div>
          </div>
        </div>
      </section>

      <section className="founder-mantra-section">
        <div className="container">
          <div className="mantra-grid">
            <div className="mantra-card">
              <span className="mantra-sanskrit">कर्मण्येवाधिकारस्ते</span>
              <p>You have a right to the action only. Not to the fruit.</p>
            </div>
            <div className="mantra-card">
              <span className="mantra-sanskrit">उद्धरेदात्मनात्मानम्</span>
              <p>Elevate yourself by your own effort. No one is coming.</p>
            </div>
            <div className="mantra-card">
              <span className="mantra-sanskrit">मा शुचः</span>
              <p>Do not fear.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
