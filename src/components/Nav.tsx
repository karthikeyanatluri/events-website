import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.scss";

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="carnival-nav-header">
      <Link className="brand" to="/events" aria-label="Events Home">
        <span className="bulb" aria-hidden="true"></span>
        <span className="brand-text">EVENTS</span>
      </Link>

      {/* Desktop / Tablet Navigation Links */}
      <nav className="nav-links desktop-only" aria-label="Primary Navigation">
        <Link className="btn primary small" to="/register">
          Register
        </Link>
        <Link className="nav-link" to="/about">
          About Us
        </Link>
        <Link className="nav-link" to="/contact">
          Contact Us
        </Link>
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
          <Link
            className="btn primary small mobile-reg-btn"
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
          >
            Register
          </Link>
          <Link
            className="mobile-nav-link"
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            className="mobile-nav-link"
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
