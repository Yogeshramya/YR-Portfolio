import React, { useState, useEffect } from 'react';
import './Header.css';

export default function Header({ currentView, setCurrentView }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [businessName, setBusinessName] = useState(() => localStorage.getItem('yr_business_name') || 'YR Digital Enterprises');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleStorage = () => {
      setBusinessName(localStorage.getItem('yr_business_name') || 'YR Digital Enterprises');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Why Us', href: '#whyus' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews-board' },
    { label: 'Contact', href: '#contact' },
  ];

  const [activeSection, setActiveSection] = useState('#top');

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveSection(href);

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (href.startsWith('#')) {
        window.location.href = '/' + href;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`ast-header ${isScrolled ? 'ast-sticky' : 'ast-transparent'}`}>
      <div className="container header-container">
        {/* Brand Logo & Name */}
        <a href="#" className="brand-logo" onClick={(e) => handleNavClick(e, '#top')}>
          <img src="/logo.png" alt="YR Digital Enterprises Logo" className="logo-img" />
          <span className="brand-name">{businessName}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`nav-link ${
                    activeSection === item.href ? 'active-link' : ''
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Action CTA */}
        <div className="header-action">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="btn-primary btn-header"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="mobile-nav-link"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="mobile-nav-cta">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-primary btn-solid"
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
