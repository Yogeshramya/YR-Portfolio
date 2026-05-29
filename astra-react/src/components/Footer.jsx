import React, { useState, useEffect } from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [businessName, setBusinessName] = useState(() => localStorage.getItem('yr_business_name') || 'YR Digital Enterprises');
  const [businessEmail, setBusinessEmail] = useState(() => localStorage.getItem('yr_business_email') || 'contact@yrdigital.com');
  const [businessPhone, setBusinessPhone] = useState(() => localStorage.getItem('yr_business_phone') || '+91 93606 19459');
  const [businessAddress, setBusinessAddress] = useState(() => localStorage.getItem('yr_business_address') || '13/B Kuttiyan Palayam Street, Kumbakonam, Tamil Nadu 612001');
  const [businessHours, setBusinessHours] = useState(() => localStorage.getItem('yr_business_hours') || 'Mon - Sat: 9:00 AM - 8:00 PM');

  useEffect(() => {
    const handleStorage = () => {
      setBusinessName(localStorage.getItem('yr_business_name') || 'YR Digital Enterprises');
      setBusinessEmail(localStorage.getItem('yr_business_email') || 'contact@yrdigital.com');
      setBusinessPhone(localStorage.getItem('yr_business_phone') || '+91 98765 43210');
      setBusinessAddress(localStorage.getItem('yr_business_address') || '123 Main Street, Townsville');
      setBusinessHours(localStorage.getItem('yr_business_hours') || 'Mon - Sat: 9:00 AM - 8:00 PM');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (href.startsWith('#')) {
        window.location.href = '/' + href;
      }
    }
  };

  return (
    <footer className="ast-footer-section">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <img src="/logo.png" alt="YR Digital Enterprises Logo" className="footer-logo-img" />
          </div>
          <p className="footer-desc">
            {businessName} is your premier graphic design and custom print studio. We specialize in high-quality photo frames, custom albums, invitations, calendars, banners, custom apparel, stickers, and professional web solutions.
          </p>
          <ul className="footer-contact-info" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0 }}>
            <li style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>📍</span> <span style={{ lineHeight: '1.4' }}>13/B Kuttiyan Palayam Street, Kumbakonam, Tamil Nadu - 612001</span>
            </li>
            <li style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>📞</span> <a href={`tel:${businessPhone.replace(/\s+/g, '')}`} style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>+91 93606 19459</a>
            </li>
            <li style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>✉️</span> <a href={`mailto:${businessEmail}`} style={{ color: '#64748b', textDecoration: 'none' }}>contactyrdigital@gmail.com</a>
            </li>
            <li style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>🕒</span> <span>Mon - Sun: 8:00 AM - 10:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col links-col">
          <h4 className="footer-heading">Products & Services</h4>
          <ul className="footer-links">
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, '#services')}>
                Our Services
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>
                About Our Studio
              </a>
            </li>
            <li>
              <a href="#reviews" onClick={(e) => handleLinkClick(e, '#reviews')}>
                Client Reviews
              </a>
            </li>
            <li>
              <a href="#whyus" onClick={(e) => handleLinkClick(e, '#whyus')}>
                Why Choose Us
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>
                Request a Quote
              </a>
            </li>
          </ul>
        </div>

        {/* Contact/Newsletter/Maps Column */}
        <div className="footer-col contact-col" style={{ gap: '16px' }}>
          <h4 className="footer-heading">Our Location</h4>
          <div style={{
            width: '100%',
            height: '150px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <iframe
              title="YR Digital Enterprises Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://maps.google.com/maps?q=13/b%20kuttiyan%20palayam%20street%20kumbakonam%20tamil%20nadu&z=15&output=embed"
            ></iframe>
          </div>
          <a
            href="https://maps.app.goo.gl/Gn57cDVkkc4ZH2xV6"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-solid footer-cta"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
          >
            <span>🗺️</span> View on Google Maps
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="divider"></div>
        <div className="footer-bottom-flex">
          <p className="copyright">
            © {currentYear} YR Digital Enterprises. All rights reserved. Beautifully designed & premium printed.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              F
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              T
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              I
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              L
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
