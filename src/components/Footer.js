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
    <footer className="bg-[#0A1017] text-white py-28 pb-20 px-[8%] border-t border-slate-800/80 print-hide">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        {/* School About Column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="School Crest Logo" className="h-20 w-auto object-contain bg-white p-1 rounded-2xl shadow-md" />
            <div>
              <h5 className="font-serif font-black text-base tracking-widest text-[#D9B310] leading-snug uppercase">
                {schoolName}
              </h5>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300 pr-4 mt-2">
            Dedicated to value-driven academic excellence and complete character formation. Estd. 1978 at Hassan, Karnataka.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col">
          <h6 className="font-serif text-[#D9B310] text-sm font-bold border-b border-slate-800/60 pb-3 mb-6 tracking-widest uppercase">
            Quick Links
          </h6>
          <ul className="list-none flex flex-col gap-4 text-sm text-slate-300">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className="hover:text-[#D9B310] hover:translate-x-2 transition-all duration-300 inline-block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Admissions Info Column */}
        <div className="flex flex-col">
          <h6 className="font-serif text-[#D9B310] text-sm font-bold border-b border-slate-800/60 pb-3 mb-6 tracking-widest uppercase">
            Admissions
          </h6>
          <p className="text-sm leading-relaxed text-slate-300 mb-6 pr-2">
            Admissions are currently open for classes starting from Preschool up to Grade IX. Download the brochure online or visit the admin office.
          </p>
          <Link 
            href="/admissions" 
            className="inline-block bg-[#D9B310] hover:bg-[#bda00d] text-[#0A1017] text-xs font-extrabold px-7 py-3.5 rounded-full transition-all duration-300 text-center tracking-wider uppercase w-fit shadow-lg hover:-translate-y-1 transform"
          >
            Admissions 2027-28
          </Link>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col">
          <h6 className="font-serif text-[#D9B310] text-sm font-bold border-b border-slate-800/60 pb-3 mb-6 tracking-widest uppercase">
            Contact Details
          </h6>
          <ul className="list-none flex flex-col gap-5 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#D9B310] mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-[#D9B310] mt-0.5 flex-shrink-0" />
              <span className="font-semibold">{phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-[#D9B310] mt-0.5 flex-shrink-0" />
              <span className="break-all">{email}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-[1300px] mx-auto border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-sm text-slate-400">
        <p>© 2026 {schoolName}. All Rights Reserved.</p>
        <p className="flex items-center gap-1.5">
          <span>Designed with ❤️ for Demonstration</span>
          <span className="text-slate-700">|</span>
          <span>Powered by</span>
          <a 
            href="https://involynk.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#D9B310] font-semibold hover:underline"
          >
            Involynk EduCMS
          </a>
        </p>
      </div>
    </footer>
  );
}


