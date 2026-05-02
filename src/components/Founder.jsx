import './Founder.css';

export default function Founder() {
  return (
    <section id="founder" className="founder">
      <div className="container">
        <span className="section-label">The Founder</span>
        <span className="gold-bar" />
        <div className="founder-layout">
          <div className="founder-aside">
            <div className="founder-emblem">A</div>
            <div className="founder-timeline">
              <div className="timeline-item">
                <span className="t-year">2022</span>
                <span className="t-note">Arrives. Alone.</span>
              </div>
              <div className="timeline-item">
                <span className="t-year">2024</span>
                <span className="t-note">Required to Discontinue.</span>
              </div>
              <div className="timeline-item">
                <span className="t-year">2026</span>
                <span className="t-note">Collapse. Then the Gita.</span>
              </div>
              <div className="timeline-item">
                <span className="t-year">Now</span>
                <span className="t-note">Ansh begins.</span>
              </div>
            </div>
          </div>
          <div className="founder-body">
            <p className="founder-p">
              I began at the University of Saskatchewan in 2022, alone, unfamiliar with how universities
              worked, too afraid to ask for help.
            </p>
            <p className="founder-p">
              By 2024, I had hit my first Required to Discontinue. I made promises I could not keep. I
              worked at Tim Hortons to survive. I stopped telling the truth.
            </p>
            <p className="founder-p">
              In early 2026, I reached collapse. I turned to the Bhagavad Gita.
            </p>
            <p className="founder-p founder-p--highlight">
              That study became Ansh — a thesis, an archive, and eventually a thin commercial layer that
              keeps both alive.
            </p>
            <p className="founder-p">
              You do not need money to begin. You do not need guidance. You need courage.
            </p>
            <p className="founder-p">
              But you do need money to continue — to record the next voice, to pay the next artist, to keep
              the archive growing. That is why the commercial layer exists. Not to make me rich. To make the
              archive permanent.
            </p>
            <p className="founder-quote">
              "Good happens to those who do good. But good also needs a budget line."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
