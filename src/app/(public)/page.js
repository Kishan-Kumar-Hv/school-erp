import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import GalleryLightbox from '@/components/GalleryLightbox';
import ContactForm from '@/components/ContactForm';

// Dynamic icon resolver for facilities
function FacilityIcon({ name, size = 18, className = "" }) {
  const IconComponent = Icons[name] || Icons.Award;
  return <IconComponent size={size} className={className} />;
}

export default async function HomePage() {
  await dbConnect();

  // Fetch all sections in parallel
  const [
    hero,
    about,
    principal,
    facilities,
    academics,
    faculty,
    gallery,
    events,
    notices,
    contact
  ] = await Promise.all([
    Models.Hero.findOne(),
    Models.About.findOne(),
    Models.Principal.findOne(),
    Models.Facility.find().limit(6),
    Models.Academics.findOne(),
    Models.Faculty.find().sort({ order: 1 }).limit(4),
    Models.Gallery.find().limit(4),
    Models.Event.find().sort({ date: -1 }).limit(3),
    Models.Notice.find().sort({ date: -1 }).limit(5),
    Models.Contact.findOne()
  ]);

  // Serialize DB documents
  const sHero = hero ? JSON.parse(JSON.stringify(hero)) : {};
  const sAbout = about ? JSON.parse(JSON.stringify(about)) : {};
  const sPrincipal = principal ? JSON.parse(JSON.stringify(principal)) : {};
  const sFacilities = facilities ? JSON.parse(JSON.stringify(facilities)) : [];
  const sAcademics = academics ? JSON.parse(JSON.stringify(academics)) : {};
  const sFaculty = faculty ? JSON.parse(JSON.stringify(faculty)) : [];
  const sGallery = gallery ? JSON.parse(JSON.stringify(gallery)) : [];
  const sEvents = events ? JSON.parse(JSON.stringify(events)) : [];
  const sNotices = notices ? JSON.parse(JSON.stringify(notices)) : [];
  const sContact = contact ? JSON.parse(JSON.stringify(contact)) : {};

  // Default Fallbacks
  const heroTitle = sHero.title || "Holy Cross Sisters School";
  const heroSubtitle = sHero.subtitle || "Building Future Leaders through Value-Based Academic Excellence";
  const heroImage = sHero.image || "/assets/holy_cross_hero.png";
  const admissionText = sHero.admissionText || "Admissions Open for Academic Year 2027-28";

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="carousel-wrapper h-[480px] w-full relative bg-[#1D2731] flex items-end">
        {heroImage && (
          <img 
            src={heroImage} 
            alt="School Banner" 
            className="carousel-image absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="carousel-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-16 z-10 text-white">
          <div className="max-w-[800px] flex flex-col gap-3">
            <h2 className="carousel-title font-serif text-3xl md:text-5xl font-bold text-[#D9B310] tracking-wide leading-tight">
              {heroTitle.toUpperCase()}
            </h2>
            <p className="carousel-desc text-sm md:text-lg text-slate-200 font-medium">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* 2. ADMISSION BANNER */}
      <section className="max-w-[1300px] mx-auto px-[5%] mt-8">
        <div className="admission-banner bg-[#0B3C5D] text-white p-8 rounded-lg text-center relative overflow-hidden shadow-md flex flex-col items-center gap-4">
          <h3 className="admission-banner-title font-serif text-xl md:text-2xl text-[#D9B310] font-semibold">
            {admissionText}
          </h3>
          <p className="admission-banner-desc text-xs md:text-sm text-slate-300 max-w-[600px] leading-relaxed">
            Enroll your child in Hassan's premier institution for robust academic success, STEM programs, and moral character.
          </p>
          <Link href="/admissions" className="btn-gold px-6 py-2.5 bg-[#D9B310] text-[#1D2731] font-bold rounded hover:bg-[#bda00d] transition-all flex items-center gap-2">
            Enquire Now <Icons.ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Grid container for left content and right notice board */}
      <div className="home-section-grid max-w-[1300px] mx-auto px-[5%] py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Col Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 3. ABOUT SCHOOL */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
              <Icons.GraduationCap size={20} className="text-[#0B3C5D]" /> Empowering Future Generations
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {sAbout.aboutText || "Holy Cross Sisters School stands as a beacon of academic progress, carrying forward a legacy of education designed to empower and nurture the young minds of Hassan."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 border-l-4 border-l-[#0B3C5D] bg-slate-50 rounded">
                <strong className="text-[#0B3C5D] text-sm block mb-1">Our Vision</strong>
                <p className="text-xs italic text-slate-500 leading-relaxed">
                  "{sAbout.vision || "To establish a value-driven center of educational excellence."}"
                </p>
              </div>
              <div className="p-4 border border-slate-200 border-l-4 border-l-[#D9B310] bg-slate-50 rounded">
                <strong className="text-[#0B3C5D] text-sm block mb-1">Our Mission</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sAbout.mission || "To provide accessible, top-quality teaching modules."}
                </p>
              </div>
            </div>
          </div>

          {/* 4. PRINCIPAL MESSAGE */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
              <Icons.Award size={20} className="text-[#0B3C5D]" /> Principal's Message
            </h2>
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {sPrincipal.photo ? (
                <img 
                  src={sPrincipal.photo} 
                  alt={sPrincipal.name || "Principal"} 
                  className="w-32 h-40 object-cover rounded shadow-sm border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-32 h-40 bg-slate-200 rounded flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-200">
                  <Icons.User size={40} />
                </div>
              )}
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <strong className="text-[#0B3C5D] text-base">{sPrincipal.name || "Sr. Maria Philomina"}</strong>
                <span className="text-[11px] text-[#D9B310] uppercase font-bold tracking-wider">Head of School</span>
                <p className="text-xs text-slate-600 italic leading-relaxed mt-2">
                  "{sPrincipal.message || "We are dedicated to nurturing each child's development."}"
                </p>
              </div>
            </div>
          </div>

          {/* 5. FACILITIES */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
              <Icons.BookOpen size={20} className="text-[#0B3C5D]" /> Campus Facilities & Infrastructure
            </h2>
            <div className="premium-card-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sFacilities.map((fac, idx) => (
                <div key={fac._id || idx} className="premium-feature-card border border-slate-200 border-l-[4px] border-l-[#0B3C5D] rounded p-4 flex gap-4 items-start bg-slate-50">
                  <div className="premium-icon-box bg-[#0B3C5D]/10 text-[#0B3C5D] p-2.5 rounded-full flex-shrink-0">
                    <FacilityIcon name={fac.iconName} />
                  </div>
                  <div className="premium-card-text">
                    <strong className="premium-card-title text-sm font-semibold text-[#0B3C5D]">{fac.name}</strong>
                    <span className="premium-card-desc text-xs text-slate-500 leading-relaxed block mt-1">{fac.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right mt-4">
              <Link href="/facilities" className="text-xs text-[#0B3C5D] font-semibold hover:underline flex items-center justify-end gap-1">
                View All Facilities <Icons.ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* 6. ACADEMICS */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
              <Icons.Calendar size={20} className="text-[#0B3C5D]" /> Curriculum & Academics
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              We structure our learning path specifically around the developmental stages of children:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded bg-white">
                <h4 className="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icons.Heart size={14} className="text-[#D9B310]" /> Pre-Primary
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{sAcademics.prePrimaryContent || "Learning through play for LKG & UKG children."}</p>
              </div>
              <div className="p-4 border border-slate-200 rounded bg-white">
                <h4 className="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icons.BookOpen size={14} className="text-[#D9B310]" /> Primary
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{sAcademics.primaryContent || "Building strong arithmetic and reading skills."}</p>
              </div>
              <div className="p-4 border border-slate-200 rounded bg-white">
                <h4 className="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icons.Award size={14} className="text-[#D9B310]" /> High School
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{sAcademics.highSchoolContent || "SSLC Board examination preparations."}</p>
              </div>
              <div className="p-4 border border-slate-200 rounded bg-white">
                <h4 className="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icons.GraduationCap size={14} className="text-[#D9B310]" /> PU College
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{sAcademics.puCollegeContent || "CET/NEET entrance and PU Board coaching."}</p>
              </div>
            </div>
          </div>

          {/* 7. FACULTY PREVIEW */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
              <Icons.Users size={20} className="text-[#0B3C5D]" /> Faculty Members
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {sFaculty.map((member, idx) => (
                <div key={member._id || idx} className="text-center flex flex-col items-center">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-20 h-20 rounded-full object-cover border border-slate-200 mb-2 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 mb-2 shadow-sm">
                      <Icons.User size={24} />
                    </div>
                  )}
                  <strong className="text-xs text-[#0B3C5D] block truncate w-full">{member.name}</strong>
                  <span className="text-[10px] text-slate-500 truncate w-full">{member.designation}</span>
                </div>
              ))}
            </div>
            <div className="text-right mt-4">
              <Link href="/faculty" className="text-xs text-[#0B3C5D] font-semibold hover:underline flex items-center justify-end gap-1">
                View Faculty Directory <Icons.ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* 8. GALLERY PREVIEW */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
              <Icons.Palette size={20} className="text-[#0B3C5D]" /> Campus Gallery Preview
            </h2>
            <GalleryLightbox images={sGallery} limit={4} />
            <div className="text-right mt-4">
              <Link href="/gallery" className="text-xs text-[#0B3C5D] font-semibold hover:underline flex items-center justify-end gap-1">
                Explore Gallery <Icons.ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* 9. EVENTS PREVIEW */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
              <Icons.Calendar size={20} className="text-[#0B3C5D]" /> Upcoming Events
            </h2>
            <div className="flex flex-col gap-4">
              {sEvents.map((evt, idx) => (
                <div key={evt._id || idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 flex gap-4 items-center">
                  <div className="bg-[#D9B310]/10 text-[#D9B310] px-3 py-2 rounded text-center flex-shrink-0 min-w-16">
                    <span className="text-xs font-bold block">{new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric' })}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">{new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0B3C5D]">{evt.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right mt-4">
              <Link href="/events" className="text-xs text-[#0B3C5D] font-semibold hover:underline flex items-center justify-end gap-1">
                All School Events <Icons.ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>

        {/* Right Notices Column (Col Span 1) */}
        <div className="flex flex-col gap-6">
          
          {/* 10. NOTICE BOARD */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#D9B310]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
              <Icons.Calendar size={20} className="text-[#0B3C5D]" /> Notice Circulars
            </h2>
            <ul className="notice-board-list flex flex-col gap-4">
              {sNotices.map((not, idx) => (
                <li key={not._id || idx} className="notice-board-item border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                  <span className="notice-date bg-[#328CC1]/10 text-[#328CC1] px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5 inline-block">
                    {new Date(not.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h4 className="notice-title-text text-xs font-semibold text-slate-800">{not.title}</h4>
                  <p className="notice-desc-text text-slate-500 text-[11px] leading-relaxed mt-1">{not.description}</p>
                  {not.fileUrl && (
                    <a 
                      href={not.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] text-[#0B3C5D] font-bold mt-1.5 flex items-center gap-0.5 hover:underline"
                    >
                      <Icons.FileText size={10} /> View Attachment Circular
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="text-center border-t border-slate-200 pt-3 mt-4">
              <Link href="/notice-board" className="text-xs text-[#0B3C5D] font-semibold hover:underline">
                View All Announcements
              </Link>
            </div>
          </div>

          {/* 11. CONTACT INFORMATION & MAP */}
          <div className="content-card bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#0B3C5D]">
            <h2 className="card-title font-serif text-lg text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
              <Icons.MapPin size={20} className="text-[#0B3C5D]" /> Contact Details
            </h2>
            <ul className="flex flex-col gap-4 text-xs text-slate-600 mb-5">
              <li className="flex gap-2.5 items-start">
                <Icons.MapPin size={16} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                <span>{sContact.address || sSchoolInfo?.address || "Salagame Road, Hassan"}</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Icons.Phone size={16} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                <span>{sContact.phone || sSchoolInfo?.phone || "+91 81722 68512"}</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Icons.Mail size={16} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                <span>{sContact.email || sSchoolInfo?.email || "admin@holycrosshassan.edu.in"}</span>
              </li>
            </ul>

            <ContactForm />

            {/* Embedded Google Map */}
            {sContact.mapLink && (
              <div className="w-full h-48 rounded border border-slate-200 overflow-hidden shadow-sm mt-5">
                <iframe 
                  title="Homepage Google Map"
                  src={sContact.mapLink}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
