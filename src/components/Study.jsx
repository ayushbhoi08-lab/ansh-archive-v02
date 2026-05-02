import './Study.css';

const hypotheses = [
  {
    id: 'H1',
    title: 'Beat-Pattern Reliability',
    body: 'Vedic recitation follows structured beat patterns that can be measured and reproduced with statistical consistency across reciters.',
    business: '"Every track is scientifically measured" — buyer trust signal.',
  },
  {
    id: 'H2',
    title: 'Emotional Encoding',
    body: 'Specific shloks consistently produce measurable emotional responses — calm, devotion, focus — independent of the listener\'s background.',
    business: null,
  },
  {
    id: 'H3',
    title: 'Acoustic Memory',
    body: 'Listeners who hear the same shlok across multiple sessions develop measurable acoustic familiarity even without semantic understanding.',
    business: null,
  },
  {
    id: 'H4',
    title: 'Mood Prediction',
    body: 'Given a shlok\'s beat pattern and phonemic profile, its mood effect (calm vs. intense) can be predicted with above-chance accuracy.',
    business: '"We know which shlok fits your scene" — the filmmaker pitch.',
  },
  {
    id: 'H5',
    title: 'Reciter Variation',
    body: 'The same text delivered by reciters from different regional traditions produces statistically distinct emotional and acoustic profiles.',
    business: '"Same text, 3 regional voices" — unique commercial differentiator.',
  },
];

export default function Study() {
  return (
    <section id="study" className="study">
      <div className="container">
        <span className="section-label">The Thesis</span>
        <span className="gold-bar" />
        <h2 className="section-title">Study</h2>
        <p className="section-intro">
          Five hypotheses. One framework. The science behind the archive — open, falsifiable, and shared.
        </p>
        <div className="hypotheses">
          {hypotheses.map(h => (
            <div key={h.id} className="hypothesis">
              <div className="h-left">
                <span className="h-id">{h.id}</span>
              </div>
              <div className="h-right">
                <h3 className="h-title">{h.title}</h3>
                <p className="h-body">{h.body}</p>
                {h.business && (
                  <p className="h-business">
                    <span className="biz-arrow">→</span> {h.business}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="study-note">
          <p>
            Thesis in progress at the University of Saskatchewan. Listener survey live.
            Data collected openly. Schema will be published.
          </p>
        </div>
      </div>
    </section>
  );
}
