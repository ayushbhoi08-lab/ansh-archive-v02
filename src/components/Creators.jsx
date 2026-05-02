import './Creators.css';

const tiers = [
  {
    name: 'Standard',
    price: '$49',
    use: 'YouTube · Indie · Social',
    items: ['Isolated vocal stem', 'Drone stem', 'License PDF (24h)', 'Non-exclusive'],
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
  },
];

export default function Creators() {
  return (
    <section id="creators" className="creators">
      <div className="container">
        <span className="section-label">For Creators</span>
        <span className="gold-bar" />
        <h2 className="section-title">The Studio</h2>
        <p className="section-intro">
          Stems, fast clearance, and custom briefs. Linked from the footer, not the hero — accessible, not pushy.
        </p>
        <div className="tiers">
          {tiers.map(t => (
            <div key={t.name} className={`tier${t.featured ? ' tier--featured' : ''}`}>
              {t.featured && <span className="tier-badge">Most Requested</span>}
              <span className="tier-name">{t.name}</span>
              <p className="tier-price">{t.price}</p>
              <p className="tier-use">{t.use}</p>
              <ul className="tier-items">
                {t.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href="mailto:ansharchive@gmail.com" className={`tier-cta${t.featured ? ' tier-cta--gold' : ''}`}>
                Reserve a Slot
              </a>
            </div>
          ))}
        </div>
        <div className="slots-notice">
          <h3 className="slots-title">Limited Monthly Slots</h3>
          <p className="slots-body">
            We open a limited number of clearance slots each month. Reserve a slot with a deposit
            (credited toward your license) and we'll start sourcing options immediately.
          </p>
        </div>
      </div>
    </section>
  );
}
