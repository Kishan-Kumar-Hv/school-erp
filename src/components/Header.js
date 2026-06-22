'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Menu, X, Lock } from 'lucide-react';

export default function Header({ school, notices }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fallback default details if database isn't fully loaded yet
  const schoolName = school?.name || 'Holy Cross Sisters School';
  const logo = school?.logo || '/assets/logo.png';
  const phone = school?.phone || '+91 81722 68512';
  const email = school?.email || 'admin@holycrosshassan.edu.in';
  const address = school?.address || 'Hemavathi Nagar, Hassan, Karnataka - 573202';

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Events', path: '/events' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Notice Board', path: '/notice-board' },
    { label: 'Contact', path: '/contact' },
  ];

  // Map database notices for the ticker
  const tickerItems = notices && notices.length > 0
    ? notices.slice(0, 5)
    : [
        { title: 'Admissions open for Academic Year 2027-28. Apply now!', date: '2026-06-18' },
        { title: 'Holiday Notice: School remains closed for Summer Vacations.', date: '2026-06-15' }
      ];

  return (
    <header className="print-hide w-full flex flex-col z-50">
      {/* Top Contact Info Bar */}
      <div className="top-bar flex flex-col md:flex-row justify-between items-center py-2 px-[5%] text-white text-xs gap-2 md:gap-0 bg-[#1D2731]">
        <div className="top-bar-contact flex flex-wrap gap-4 justify-center md:justify-start">
          <span className="flex items-center gap-1"><Phone size={13} className="text-[#D9B310]" /> {phone}</span>
          <span className="flex items-center gap-1"><Mail size={13} className="text-[#D9B310]" /> {email}</span>
          <span className="flex items-center gap-1"><MapPin size={13} className="text-[#D9B310]" /> {address.split(',')[0]}</span>
        </div>
        <div className="top-bar-buttons flex gap-3">
          <a href={`tel:${phone}`} className="top-bar-btn border border-white/30 px-3 py-1 rounded text-[11px] hover:bg-[#D9B310] hover:text-[#1D2731] hover:border-[#D9B310] transition-all">Call Now</a>
          <a href="/admin/login" className="top-bar-btn border border-[#D9B310]/30 text-[#D9B310] px-3 py-1 rounded text-[11px] hover:bg-[#D9B310] hover:text-[#1D2731] transition-all flex items-center gap-1">
            <Lock size={10} /> Admin Portal
          </a>
        </div>
      </div>

      {/* Branding Header Section */}
      <div className="brand-header bg-white px-[5%] py-4 flex flex-col md:flex-row items-center justify-between border-b-[3px] border-[#0B3C5D] gap-4 md:gap-0">
        <div className="brand-left flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
          <img src={logo} alt="School Logo" className="brand-logo h-[70px] w-auto object-contain" />
          <div className="brand-title-wrap flex flex-col">
            <h1 className="brand-title font-serif text-xl md:text-2xl font-bold text-[#0B3C5D]">{schoolName.toUpperCase()}</h1>
            <span className="brand-subtitle text-[11px] tracking-wider text-slate-500 uppercase mt-0.5">{address}</span>
          </div>
        </div>
        <div className="brand-tagline text-xs font-semibold italic text-[#328CC1] text-center md:text-right">
          "Education for Empowerment, Love and Service"
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="main-nav bg-[#0B3C5D] text-white sticky top-0 z-50 shadow-md">
        <div className="nav-container max-w-[1400px] mx-auto flex justify-between items-center px-[5%] h-14 md:h-auto">
          <ul className="nav-links hidden xl:flex list-none">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path} className={`nav-item ${isActive ? 'active bg-[#072b43] border-b-2 border-[#D9B310]' : ''}`}>
                  <Link href={item.path} className="block px-4 py-4 text-sm font-medium tracking-wide border-b-2 border-transparent hover:bg-[#072b43] hover:border-b-2 hover:border-[#D9B310] transition-all">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex xl:hidden w-full justify-between items-center">
            <span className="font-serif font-bold text-sm tracking-wider">NAVIGATION</span>
            <button className="mobile-menu-toggle p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#072b43] px-[5%] py-3">
            <ul className="list-none flex flex-col gap-2">
              {menuItems.map((item) => (
                <li key={item.path} className="border-b border-white/10 last:border-0">
                  <Link href={item.path} className="block py-2 text-sm text-white hover:text-[#D9B310] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Announcement Ticker */}
      <div className="ticker-container bg-[#E2ECF5] border-b border-slate-200 flex items-center h-10 overflow-hidden text-xs">
        <div className="ticker-title bg-[#D9B310] text-[#1D2731] font-bold px-5 h-full flex items-center z-10 whitespace-nowrap shadow-[2px_0_5px_rgba(0,0,0,0.1)] text-[11px] uppercase tracking-wider">
          Latest Notices
        </div>
        <div className="ticker-marquee flex-1 whitespace-nowrap overflow-hidden flex items-center">
          <div className="ticker-content inline-block pl-full animate-marquee text-[#0B3C5D] font-medium">
            {tickerItems.map((item, idx) => (
              <span key={idx} className="ticker-item inline-block mr-12">
                <strong className="text-[#D9B310] mr-1.5">[{item.date || 'Notice'}]:</strong>
                {item.title} - {item.description}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
