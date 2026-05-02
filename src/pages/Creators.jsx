import { useState } from 'react';
import './Creators.css';

const tiers = [
  {
    name: 'Standard',
    price: '$49',
    use: 'YouTube · Indie · Social',
    items: ['Isolated vocal stem', 'Drone stem', 'License PDF (24h)', 'Non-exclusive'],
    featured: false,
  },
  {
    name: 'Commercial',
    price: '$299',
    use: 'Ads · Games · Brand Campaigns',
    items: ['All stems', 'License PDF (24h)', 'Non-exclusive commercial rights', 'Usage in paid media'],
    featured: true,
  },
  {
    name: 'Exclusive',
    price: '$1,500',
    use: 'One Buyer Only',
    items: ['All stems', 'Removed from catalog', 'Full exclusive rights', 'Custom brief available'],
    featured: false,
  },
];

const revenue = [
  { pct: '50%', label: 'Operations', note: 'Recording, editing, hosting, thesis costs' },
  { pct: '40%', label: 'Artist Pool', note: 'Session fees, future revenue share' },
  { pct: '10%', label: 'Seeker Fund', note: 'Medical, travel, education, instrument repair' },
];

export default function Creators() {
  const [form, setForm] = useState({ name: '', project: '', tier: 'Commercial' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="creators-page">
      <div className="page-header">
        <div className="container">
          <span className="section-label">For Creators</span>
          <h1 className="page-title">The Studio</h1>
          <p className="page-desc">
            Stems, fast clearance, and custom briefs. Accessible, not pushy.
          </p>
        </div>
      </div>

      {/* Rights section */}
      <section className="creators-section">
        <div className="container">
          <span className="section-label">Rights + Integrity</span>
          <span className="gold-bar" />
          <div className="rights-block">
            <p className="rights-body">
              We produce scripture-faithful vocal masters and keep the meaning intact. The scripture itself
              isn't owned — only the recording is licensed. Clients license the master for defined use
              (project, media, term, territory). Non-exclusive by default; exclusivity available on request.
            </p>
            <div className="rights-pills">
              <span className="rights-pill">Scripture: Unowned</span>
              <span className="rights-pill">Recording: Licensed</span>
              <span className="rights-pill">Default: Non-exclusive</span>
              <span className="rights-pill">Clearance: 24h</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="creators-section creators-section--dark">
        <div className="container">
          <span className="section-label">Pricing</span>
          <span className="gold-bar" />
          <div className="tiers">
            {tiers.map(t => (
              <div key={t.name} className={`tier${t.featured ? ' tier--featured' : ''}`}>
                {t.featured && <span className="tier-badge">Most Requested</span>}
                <span className="tier-name">{t.name}</span>
                <p className="tier-price">{t.price}</p>
                <p className="tier-use">{t.use}</p>
                <ul className="tier-items">
                  {t.items.map(i => <li key={i}>{i}</li>)}
                </ul>
                <button
                  className={`tier-cta${t.featured ? ' tier-cta--gold' : ''}`}
                  onClick={() => setForm(f => ({ ...f, tier: t.name }))}
                >
                  Reserve a Slot
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slot reservation form */}
      <section className="creators-section">
        <div className="container">
          <span className="section-label">Reserve a Slot</span>
          <span className="gold-bar" />
          <div className="slot-layout">
            <div className="slot-info">
              <h3 className="slot-title">Limited Monthly Slots</h3>
              <p className="slot-body">
                We open a limited number of clearance slots each month. Reserve a slot with a deposit
                (credited toward your license) and we'll start sourcing options immediately.
              </p>
              <div className="slot-steps">
                <div className="slot-step"><span>01</span><p>Fill in your project details below</p></div>
                <div className="slot-step"><span>02</span><p>We respond within 48 hours with availability</p></div>
                <div className="slot-step"><span>03</span><p>Deposit secures your slot; credited to license</p></div>
                <div className="slot-step"><span>04</span><p>Stems + license PDF delivered within 24h of clearance</p></div>
              </div>
            </div>
            <div className="slot-form-wrap">
              {sent ? (
                <div className="slot-sent">
                  <p className="slot-sent-title">Received.</p>
                  <p>We'll follow up within 48 hours. Check your email.</p>
                </div>
              ) : (
                <form className="slot-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Name" />
                  </div>
                  <div className="form-group">
                    <label>Project Description</label>
                    <textarea value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} required placeholder="Film, ad, game — brief description of use" rows={4} />
                  </div>
                  <div className="form-group">
                    <label>Tier</label>
                    <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}>
                      {tiers.map(t => <option key={t.name}>{t.name} — {t.price}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="slot-submit">Reserve My Slot</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Revenue ethics */}
      <section className="creators-section creators-section--dark">
        <div className="container">
          <span className="section-label">Revenue Ethics</span>
          <span className="gold-bar" />
          <p className="rev-intro">Every dollar has a job.</p>
          <div className="rev-rows">
            {revenue.map(r => (
              <div key={r.pct} className="rev-row">
                <span className="rev-pct">{r.pct}</span>
                <span className="rev-label">{r.label}</span>
                <span className="rev-note">{r.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
