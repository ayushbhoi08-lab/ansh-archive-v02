import './Process.css';

const steps = [
  {
    num: '01',
    label: 'Record',
    detail: 'Invitation-only reciters. Acoustically controlled sessions. No home recordings.',
  },
  {
    num: '02',
    label: 'Clean',
    detail: 'Studio-grade mastering. Noise floor removed. Three stems separated: vocal, drone, texture.',
  },
  {
    num: '03',
    label: 'Analyze',
    detail: 'Beat patterns logged. Mood profile measured. Thesis data extracted and documented.',
  },
  {
    num: '04',
    label: 'Rights',
    detail: 'Recording licensed. Scripture unowned. License PDF generated within 24 hours of clearance.',
  },
  {
    num: '05',
    label: 'Publish',
    detail: 'Archive version: Internet Archive, CC BY. Commercial version: stems available on request.',
  },
];

export default function Process() {
  return (
    <section id="process" className="process">
      <div className="container">
        <span className="section-label">How We Work</span>
        <span className="gold-bar" />
        <h2 className="section-title">Process</h2>
        <p className="section-intro">Every recording follows the same chain. No shortcuts.</p>
        <div className="process-steps">
          {steps.map((s, i) => (
            <div key={s.num} className="step">
              <div className="step-connector">
                <span className="step-dot" />
                {i < steps.length - 1 && <span className="step-line" />}
              </div>
              <div className="step-content">
                <span className="step-num">{s.num}</span>
                <h3 className="step-label">{s.label}</h3>
                <p className="step-detail">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
