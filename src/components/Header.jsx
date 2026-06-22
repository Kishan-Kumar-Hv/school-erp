import React, { useState } from 'react';
import { Phone, Mail, MapPin, Menu, X, LogIn, LogOut, ExternalLink } from 'lucide-react';

export default function Header({ activePage, setActivePage, userRole, onLogout, announcements }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Group announcements by category or just list all
  const tickerItems = announcements && announcements.length > 0 
    ? announcements.slice(0, 5) 
    : [
        { title: "Admissions open for Academic Year 2026-27. Apply now!", category: "Admissions" },
        { title: "Term 1 exam results have been published in the parent portal.", category: "Exams" },
        { title: "Annual Science Exhibition is scheduled on June 28th.", category: "Events" }
      ];

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="print-hide">
      {/* Top Contact & Action Info Bar */}
      <div className="top-bar">
        <div className="top-bar-contact">
          <span><Phone size={13} className="text-gold" /> +91-8172-268333</span>
          <span><Mail size={13} className="text-gold" /> info@holycrossschoolhassan.org</span>
          <span><MapPin size={13} className="text-gold" /> Salagame Road, Hassan, KA</span>
        </div>
        <div className="top-bar-buttons">
          <a href="tel:+918172268333" className="top-bar-btn" title="Call office">Call Now</a>
          <a href="https://wa.me/918172268333" target="_blank" rel="noopener noreferrer" className="top-bar-btn" title="WhatsApp Chat">WhatsApp</a>
          <a href="https://maps.google.com/?q=Holy+Cross+Sisters+School,Hassan,Karnataka" target="_blank" rel="noopener noreferrer" className="top-bar-btn">Get Directions</a>
        </div>
      </div>

      {/* College Crest & Title Section */}
      <div className="brand-header">
        <div className="brand-left">
          <img src="/assets/logo.png" alt="Holy Cross School Logo" className="brand-logo" />
          <div className="brand-title-wrap">
            <span className="brand-title">HOLY CROSS SISTERS SCHOOL</span>
            <span className="brand-subtitle">Hemavathi Nagar, Hassan, Karnataka - 573202</span>
          </div>
        </div>
        <div className="brand-tagline">
          "Education for Empowerment, Love and Service"
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="main-nav">
        <div className="nav-container">
          <ul className="nav-links">
            <li className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('home')} style={{ background: 'none', color: 'inherit', font: 'inherit' }}>
                <a href="#home">Home</a>
              </button>
            </li>
            <li className={`nav-item ${activePage === 'about' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('about')} style={{ background: 'none', color: 'inherit', font: 'inherit' }}>
                <a href="#about">About Us</a>
              </button>
            </li>
            <li className={`nav-item ${activePage === 'academics' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('academics')} style={{ background: 'none', color: 'inherit', font: 'inherit' }}>
                <a href="#academics">Academics</a>
              </button>
            </li>
            <li className={`nav-item ${activePage === 'contact' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('contact')} style={{ background: 'none', color: 'inherit', font: 'inherit' }}>
                <a href="#contact">Contact & Admissions</a>
              </button>
            </li>
            <li className={`nav-item ${activePage.startsWith('erp') ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('erp')} style={{ background: 'none', color: 'inherit', font: 'inherit' }}>
                <a href="#erp">{userRole ? 'ERP Dashboard' : 'ERP Portal'}</a>
              </button>
            </li>
          </ul>

          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Nav Links */}
        {mobileMenuOpen && (
          <div style={{ backgroundColor: 'var(--primary-hover)', padding: '10px 5%' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><button onClick={() => handleNavClick('home')} style={{ background: 'none', color: 'white', border: 'none', padding: '8px 0', width: '100%', textAlign: 'left' }}>Home</button></li>
              <li><button onClick={() => handleNavClick('about')} style={{ background: 'none', color: 'white', border: 'none', padding: '8px 0', width: '100%', textAlign: 'left' }}>About Us</button></li>
              <li><button onClick={() => handleNavClick('academics')} style={{ background: 'none', color: 'white', border: 'none', padding: '8px 0', width: '100%', textAlign: 'left' }}>Academics</button></li>
              <li><button onClick={() => handleNavClick('contact')} style={{ background: 'none', color: 'white', border: 'none', padding: '8px 0', width: '100%', textAlign: 'left' }}>Contact & Admissions</button></li>
              <li><button onClick={() => handleNavClick('erp')} style={{ background: 'none', color: 'white', border: 'none', padding: '8px 0', width: '100%', textAlign: 'left' }}>{userRole ? 'ERP Dashboard' : 'ERP Portal'}</button></li>
            </ul>
          </div>
        )}
      </nav>

      {/* News Announcement Ticker */}
      <div className="ticker-container">
        <div className="ticker-title">Announcements</div>
        <div className="ticker-marquee">
          <div className="ticker-content">
            {tickerItems.map((item, idx) => (
              <span key={idx} className="ticker-item">
                <strong style={{ textTransform: 'uppercase', marginRight: '6px' }}>[{item.category || 'Notice'}]:</strong>
                {item.title || item.description}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
