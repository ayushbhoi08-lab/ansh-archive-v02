import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const links = [
  { label: 'Listen', to: '/listen' },
  { label: 'Read', to: '/read' },
  { label: 'Study', to: '/study' },
  { label: 'Founder', to: '/founder' },
  { label: 'For Creators', to: '/creators' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">ANSH</Link>
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={open ? 'open' : ''} /><span className={open ? 'open' : ''} /><span className={open ? 'open' : ''} />
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          {links.map(l => (
            <NavLink key={l.label} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
