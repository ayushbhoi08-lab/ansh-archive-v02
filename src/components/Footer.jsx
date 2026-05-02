import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">ANSH</Link>
          <p className="footer-tagline">Ancient vocal. Modern listening. One archive.</p>
          <p className="footer-mantra">
            "The archive is the proof. The thesis is the foundation.<br />
            The community is the point. The revenue is the oxygen.<br />
            The artist is the future. The founder is the servant."
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-col-title">Archive</span>
            <Link to="/listen">Listen</Link>
            <Link to="/read">Read</Link>
            <Link to="/study">Study</Link>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">About</span>
            <Link to="/founder">The Founder</Link>
            <Link to="/">Mission</Link>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Support</span>
            <Link to="/creators">For Creators</Link>
            <a href="mailto:ansharchive@gmail.com">Email Us</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span className="footer-copy">© {year} Ansh Archive. CC BY recordings unless stated otherwise.</span>
          <div className="footer-contact">
            <a href="mailto:ansharchive@gmail.com" className="footer-link">Email</a>
            <span className="footer-sep">·</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
