import './Rights.css';

export default function Rights() {
  return (
    <section id="rights" className="rights">
      <div className="container">
        <span className="section-label">Use &amp; Integrity</span>
        <span className="gold-bar" />
        <div className="rights-layout">
          <div className="rights-main">
            <h2 className="rights-title">Rights + Integrity</h2>
            <p className="rights-body">
              We produce scripture-faithful vocal masters and keep the meaning intact. The scripture itself
              isn't owned — only the recording is licensed. Clients license the master for defined use
              (project, media, term, territory). Non-exclusive by default; exclusivity available on request.
            </p>
            <div className="rights-rules">
              <div className="rule">
                <span className="rule-icon">—</span>
                <span>Archive is free. Always. No paywall.</span>
              </div>
              <div className="rule">
                <span className="rule-icon">—</span>
                <span>Commercial layer is a convenience tax, not a content gate.</span>
              </div>
              <div className="rule">
                <span className="rule-icon">—</span>
                <span>The meaning is never altered. The integrity holds.</span>
              </div>
              <div className="rule">
                <span className="rule-icon">—</span>
                <span>Curation is non-negotiable. Open upload never happens here.</span>
              </div>
            </div>
          </div>
          <div className="rights-side">
            <div className="rights-card">
              <span className="card-label">Scripture</span>
              <p className="card-value">Unowned</p>
              <p className="card-note">The texts belong to no one and everyone.</p>
            </div>
            <div className="rights-card">
              <span className="card-label">Recording</span>
              <p className="card-value">Licensed</p>
              <p className="card-note">The master is ours. The license is yours to use.</p>
            </div>
            <div className="rights-card">
              <span className="card-label">Default</span>
              <p className="card-value">Non-exclusive</p>
              <p className="card-note">Exclusivity available on request — one buyer, removed from catalog.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
