import './Community.css';

const revenueRows = [
  { pct: '50%', use: 'Operations', note: 'Recording, editing, hosting, thesis costs' },
  { pct: '40%', use: 'Artist Pool', note: 'Session fees, future revenue share' },
  { pct: '10%', use: 'Seeker Fund', note: 'Artist support — medical, travel, education, instrument repair' },
];

export default function Community() {
  return (
    <section id="community" className="community">
      <div className="container">
        <span className="section-label">The Collective</span>
        <span className="gold-bar" />
        <div className="community-grid">
          <div className="community-block">
            <h2 className="block-title">Ansh Collective</h2>
            <p className="block-body">
              Invitation-only. Founder-curated. Never open upload.
            </p>
            <p className="block-body">
              Today: a fair session fee for every recording. No waiting. No promises you can't keep.
            </p>
            <p className="block-body">
              Tomorrow: if your track earns, you share in that. Lump sums, not pennies.
            </p>
            <p className="block-body">
              Forever: your name on the asset. Your voice preserved.
            </p>
          </div>
          <div className="community-block seeker">
            <h2 className="block-title">The Seeker Fund</h2>
            <p className="block-body">
              When net revenue exceeds $500/month, 10% flows to artist support —
              medical, travel, education, instrument repair.
            </p>
            <p className="block-body block-body--em">
              This is not charity. It is structured kindness. A spreadsheet row, not a prayer.
            </p>
          </div>
        </div>
        <div className="revenue-table">
          <span className="section-label" style={{ marginBottom: '24px' }}>Revenue Ethics</span>
          <p className="revenue-intro">Every dollar has a job.</p>
          <div className="rev-rows">
            {revenueRows.map(r => (
              <div key={r.pct} className="rev-row">
                <span className="rev-pct">{r.pct}</span>
                <span className="rev-use">{r.use}</span>
                <span className="rev-note">{r.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
