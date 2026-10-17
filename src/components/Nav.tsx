import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.scss";

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3600);
  };

  const handleDummyRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const passNum = Math.floor(1000 + Math.random() * 9000);
    showToast(`🎟️ Demo Pass #SP27-${passNum} Confirmed! Welcome to SUPRAGNA 2K27.`);
  };

  const handleDummyAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    showToast("🎪 SUPRAGNA 2K27 • The Annual Grand Tech & Carnival Fest (6–8 Nov).");
  };

  const handleDummyContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    showToast("📬 Contact Desk: support@supragna2k27.edu • Info Counter Open Daily.");
  };

  return (
    <header className="carnival-nav-header">
      <Link className="brand" to="/events" aria-label="Events Home">
        <span className="bulb" aria-hidden="true"></span>
        <span className="brand-text">EVENTS</span>
      </Link>

      {/* Desktop / Tablet Navigation Links */}
      <nav className="nav-links desktop-only" aria-label="Primary Navigation">
        <button
          className="btn primary small"
          type="button"
          onClick={handleDummyRegister}
          title="Demo Registration Pass"
        >
          Register
        </button>
        <button className="nav-link" type="button" onClick={handleDummyAbout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          About Us
        </button>
        <button className="nav-link" type="button" onClick={handleDummyContact} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          Contact Us
        </button>
      </nav>

      {/* Mobile Hamburger Toggle Button */}
      <button
        className={`hamburger-btn ${mobileMenuOpen ? "active" : ""}`}
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Mobile Menu Dropdown */}
      <div
        className={`mobile-menu-drawer ${mobileMenuOpen ? "open" : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-menu-inner">
          <button
            className="btn primary small mobile-reg-btn"
            type="button"
            onClick={handleDummyRegister}
          >
            Register
          </button>
          <button
            className="mobile-nav-link"
            type="button"
            onClick={handleDummyAbout}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            About Us
          </button>
          <button
            className="mobile-nav-link"
            type="button"
            onClick={handleDummyContact}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      <div className={`nav-toast ${toastVisible ? "show" : ""}`} role="status">
        {toastMsg}
      </div>
    </header>
  );
}
