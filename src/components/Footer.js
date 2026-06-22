'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ school }) {
  const schoolName = school?.name || 'Holy Cross Sisters School';
  const logo = school?.logo || '/assets/logo.png';
  const phone = school?.phone || '+91 81722 68512';
  const email = school?.email || 'admin@holycrosshassan.edu.in';
  const address = school?.address || 'Hemavathi Nagar / Vidyuth Nagar, Salagame Road, Hassan, Karnataka - 573202';

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Faculty Roster', path: '/faculty' },
    { label: 'Notice Board', path: '/notice-board' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="footer-wrap bg-[#1D2731] text-white pt-12 pb-6 px-[5%] border-t-[3px] border-[#D9B310] print-hide">
      <div className="footer-grid max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* School About Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="School Crest Logo" className="h-[55px] w-auto object-contain" />
            <h5 className="font-serif font-bold text-sm tracking-wider text-[#D9B310]">{schoolName.toUpperCase()}</h5>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Dedicated to value-driven academic excellence and complete character formation. Estd. 1978 at Hassan, Karnataka.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col">
          <h6 className="footer-col-title font-serif text-[#D9B310] text-sm font-semibold border-b border-slate-700 pb-2.5 mb-5 tracking-wider uppercase">
            Quick Links
          </h6>
          <ul className="footer-links-list list-none flex flex-col gap-2.5 text-xs text-slate-400">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="hover:text-[#D9B310] hover:pl-1 transition-all">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Admissions Info Column */}
        <div className="flex flex-col">
          <h6 className="footer-col-title font-serif text-[#D9B310] text-sm font-semibold border-b border-slate-700 pb-2.5 mb-5 tracking-wider uppercase">
            Admissions
          </h6>
          <p className="text-xs leading-relaxed text-slate-400 mb-4">
            Admissions open for Preschool to Grade IX. Visit our admissions section or download our brochure online.
          </p>
          <Link href="/admissions" className="btn-gold text-xs px-4 py-2 font-semibold bg-[#D9B310] text-[#1D2731] hover:bg-[#bda00d] rounded transition-all text-center">
            Admissions 2027-28
          </Link>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col">
          <h6 className="footer-col-title font-serif text-[#D9B310] text-sm font-semibold border-b border-slate-700 pb-2.5 mb-5 tracking-wider uppercase">
            Contact Details
          </h6>
          <ul className="footer-address-list list-none flex flex-col gap-3.5 text-xs text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[#D9B310] mt-0.5 flex-shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="text-[#D9B310] mt-0.5 flex-shrink-0" />
              <span>{phone}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="text-[#D9B310] mt-0.5 flex-shrink-0" />
              <span>{email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom max-w-[1300px] mx-auto border-t border-slate-800 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 {schoolName}. All Rights Reserved.</p>
        <p>
          Designed with ❤️ for Demonstration | Powered by{' '}
          <a href="https://involynk.com" target="_blank" rel="noopener noreferrer" className="text-[#D9B310] font-semibold hover:underline">
            Involynk EduCMS
          </a>
        </p>
      </div>
    </footer>
  );
}
