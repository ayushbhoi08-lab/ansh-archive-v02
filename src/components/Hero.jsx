import './Hero.css';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg-line" />
      <div className="container hero-content">
        <p className="hero-eyebrow">Sanskrit Archive</p>
        <h1 className="hero-title">ANSH</h1>
        <p className="hero-sub">Sanskrit shloks for study &amp; preservation.</p>
        <p className="hero-tagline">Ancient vocal. Modern listening. One archive.</p>
        <div className="hero-buttons">
          <a href="#listen" className="btn btn-primary">Enter the Archive</a>
          <a href="#founder" className="btn btn-ghost">The Founder</a>
        </div>
        <div className="hero-meta">
          <span>Free to listen</span>
          <span className="dot">·</span>
          <span>Rights-clean masters</span>
          <span className="dot">·</span>
          <span>Scripture-faithful</span>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
