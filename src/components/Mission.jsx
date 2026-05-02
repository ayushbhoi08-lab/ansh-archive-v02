import './Mission.css';

const pillars = [
  {
    word: 'Preserve',
    sanskrit: 'रक्षण',
    body: 'Every shlok recorded here is scripture-faithful. No interpolation. No reinterpretation. The meaning arrives intact.',
  },
  {
    word: 'Prove',
    sanskrit: 'प्रमाण',
    body: 'A living thesis. Beat patterns, mood prediction, reciter variation — measured, documented, and openly shared.',
  },
  {
    word: 'Empower',
    sanskrit: 'सशक्तिकरण',
    body: 'The archive is free. Always. The commercial layer funds the artists, the recordings, and the mission itself.',
  },
];

export default function Mission() {
  return (
    <section id="mission" className="mission">
      <div className="container">
        <span className="section-label">The Mission</span>
        <span className="gold-bar" />
        <p className="mission-mantra">
          "Ansh is a thesis-driven preservation archive. The commercial layer exists only to fund that
          preservation and to pay the artists whose voices make it real. The archive is free to listen.
          The stems cost money. The community costs nothing. The courage costs everything."
        </p>
        <div className="mission-pillars">
          {pillars.map(p => (
            <div key={p.word} className="pillar">
              <p className="pillar-sanskrit">{p.sanskrit}</p>
              <h3 className="pillar-word">{p.word}</h3>
              <p className="pillar-body">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mission-doors">
          <div className="door">
            <span className="door-label">Front Door</span>
            <h4>The Archive</h4>
            <p>Free. Open. For listeners, students, seekers. The archive never goes behind a paywall.</p>
          </div>
          <div className="door-divider" />
          <div className="door">
            <span className="door-label">Side Door</span>
            <h4>The Studio</h4>
            <p>Paid. Curated. For filmmakers, editors, creators who need speed and clearance — not access.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
