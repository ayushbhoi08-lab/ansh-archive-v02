import { useState } from 'react';
import './Read.css';

const shloks = [
  {
    id: 1,
    chapter: 'Chapter 2, Verse 47',
    text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    transliteration: 'karmaṇy evādhikāras te\nmā phaleṣu kadācana\nmā karma-phala-hetur bhūr\nmā te saṅgo \'stv akarmaṇi',
    meaning: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
    context: 'Krishna speaks to a paralysed Arjuna on the battlefield. The verse is the cornerstone of Karma Yoga — act without craving the outcome. It is both a philosophical injunction and a practical framework for fearless action.',
  },
  {
    id: 2,
    chapter: 'Chapter 4, Verse 7',
    text: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    transliteration: 'yadā yadā hi dharmasya\nglānir bhavati bhārata\nabhyutthānam adharmasya\ntadātmānaṃ sṛjāmy aham',
    meaning: 'Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself.',
    context: 'The divine promise of recurrence — not as myth but as structural law. Righteousness has a gravity. When it tips beyond a threshold, correction self-generates. This verse is the basis for understanding historical cycles through the Gita\'s lens.',
  },
  {
    id: 3,
    chapter: 'Chapter 18, Verse 66',
    text: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
    transliteration: 'sarva-dharmān parityajya\nmām ekaṃ śaraṇaṃ vraja\nahaṃ tvāṃ sarva-pāpebhyo\nmokṣayiṣyāmi mā śucaḥ',
    meaning: 'Abandon all varieties of religion and just surrender unto me. I shall deliver you from all sinful reactions. Do not fear.',
    context: 'The final instruction — the Gita\'s concluding verse of action. After 700 verses of philosophy, Krishna distills it to one movement: surrender. Not weakness, but the highest form of trust. The archive begins and ends here.',
  },
];

export default function Read() {
  const [active, setActive] = useState(1);
  const shlok = shloks.find(s => s.id === active);

  return (
    <section id="read" className="read">
      <div className="container">
        <span className="section-label">The Texts</span>
        <span className="gold-bar" />
        <h2 className="section-title">Read</h2>
        <p className="section-intro">Sanskrit · Transliteration · Meaning · Context</p>
        <div className="read-layout">
          <div className="read-nav">
            {shloks.map(s => (
              <button
                key={s.id}
                className={`read-nav-btn${active === s.id ? ' active' : ''}`}
                onClick={() => setActive(s.id)}
              >
                <span className="nav-num">0{s.id}</span>
                <span className="nav-chapter">{s.chapter}</span>
              </button>
            ))}
          </div>
          <div className="read-panel">
            <div className="shlok-block">
              <p className="shlok-text">{shlok.text}</p>
            </div>
            <div className="shlok-section">
              <span className="field-label">Transliteration</span>
              <p className="shlok-transliteration">{shlok.transliteration}</p>
            </div>
            <div className="shlok-section">
              <span className="field-label">Meaning</span>
              <p className="shlok-meaning">{shlok.meaning}</p>
            </div>
            <div className="shlok-section">
              <span className="field-label">Context</span>
              <p className="shlok-context">{shlok.context}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
