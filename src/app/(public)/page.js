import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Carousel from '@/components/Carousel';
import HomeNewsEvents from '@/components/HomeNewsEvents';

export default async function HomePage() {
  let school = null;
  let about = null;
  let notices = [];
  let events = [];
  let contact = null;

  try {
    await dbConnect();
    [
      school,
      about,
      notices,
      events,
      contact
    ] = await Promise.all([
      Models.SchoolInfo.findOne(),
      Models.About.findOne(),
      Models.Notice.find().sort({ date: -1 }).limit(4),
      Models.Event.find().sort({ date: -1 }).limit(4),
      Models.Contact.findOne()
    ]);
  } catch (err) {
    console.warn("Database offline. Running page in fallback mode.");
  }

  // Serialize DB documents
  const sSchool = school ? JSON.parse(JSON.stringify(school)) : {};
  const sAbout = about ? JSON.parse(JSON.stringify(about)) : {};
  const sNotices = notices ? JSON.parse(JSON.stringify(notices)) : [];
  const sEvents = events ? JSON.parse(JSON.stringify(events)) : [];
  const sContact = contact ? JSON.parse(JSON.stringify(contact)) : {};

  const schoolName = sSchool.name || 'Our School';
  const schoolShortName = sSchool.name ? sSchool.name.split(',')[0] : 'Our School';

  const admissionText = sContact.admissionText || "Admissions Open for Academic Year 2027-28";

  return (
    <div className="w-full bg-[#FCFCFC]">
      {/* 1. TOP SECTION: HERO TRANSITION CAROUSEL */}
      <Carousel schoolName={schoolName} />

      {/* 2. ADMISSION OPEN BANNER */}
      <section className="max-w-[1440px] mx-auto px-[5%] mt-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B3C5D] to-[#082b43] text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="flex-1 text-center md:text-left relative z-10">
            <h3 className="font-serif text-xl md:text-3xl text-[#D9B310] font-extrabold mb-3 tracking-wide">
              {admissionText}
            </h3>
            <p className="text-sm text-slate-300 max-w-[700px] leading-relaxed">
              Enroll your child in Hassan's premier institution for robust academic success, advanced coding modules, creative arts, and strong moral character.
            </p>
          </div>
          <Link 
            href="/admissions" 
            className="bg-[#D9B310] hover:bg-[#bda00d] text-[#0A1017] text-sm font-extrabold px-8 py-4 rounded-full shadow-lg hover:-translate-y-1 transform transition-all duration-300 uppercase tracking-wider flex items-center gap-2 flex-shrink-0 relative z-10"
          >
            <span>Enquire Now</span>
            <Icons.ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 3. WELCOME & ANNOUNCEMENTS SECTION (Split Layout) */}
      <section className="max-w-[1440px] mx-auto px-[5%] py-24 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        
        {/* Left Side: Welcome Description */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[#D9B310] uppercase tracking-widest font-extrabold">About The School</span>
            <h2 className="font-serif text-[#0B3C5D] text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
              Welcome To {schoolShortName}
            </h2>
            <div className="w-16 h-1 bg-[#D9B310] mt-3 rounded-full"></div>
          </div>
          
          <h4 className="font-serif text-slate-800 text-xl font-bold mt-2">
            {schoolName}
          </h4>
          
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {sAbout.aboutText || "Holy Cross Sisters School stands as a beacon of academic progress, carrying forward a legacy of education designed to empower and nurture the young minds of Hassan."}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2">
            <div className="p-8 pl-10 border border-slate-100 border-l-[6px] border-l-[#0B3C5D] bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
              <strong className="text-[#0B3C5D] text-sm uppercase tracking-wider font-extrabold block mb-3 group-hover:text-[#D9B310] transition-colors">Our Vision</strong>
              <p className="text-sm italic text-slate-600 leading-relaxed">
                "{sAbout.vision || "To establish a value-driven center of educational excellence that empowers students with modern skills."}"
              </p>
            </div>
            <div className="p-8 pl-10 border border-slate-100 border-l-[6px] border-l-[#D9B310] bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
              <strong className="text-[#0B3C5D] text-sm uppercase tracking-wider font-extrabold block mb-3 group-hover:text-[#D9B310] transition-colors">Our Mission</strong>
              <p className="text-sm text-slate-600 leading-relaxed">
                {sAbout.mission || "To provide accessible, top-quality teaching modules; encourage technological literacy; develop sporting spirit."}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link 
              href="/about" 
              className="bg-[#0B3C5D] hover:bg-[#072b43] text-white text-xs font-bold px-8 py-4 rounded-full w-fit transition-all duration-200 flex items-center gap-2 shadow-md hover:-translate-y-0.5"
            >
              <span>Know More About Us</span>
              <Icons.ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right Side: Tabbed News, Announcements & Events */}
        <div className="lg:col-span-1">
          <HomeNewsEvents initialNotices={sNotices} initialEvents={sEvents} />
        </div>

      </section>

      {/* 4. WHY OUR SCHOOL SECTION (Grid of 6 blocks inspired by Malnad College) */}
      <section className="bg-slate-50 border-y border-slate-100 py-24 px-[5%]">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="text-center mb-20 max-w-[700px] mx-auto">
            <span className="text-xs text-[#D9B310] uppercase tracking-widest font-extrabold">Our Strengths</span>
            <h2 className="font-serif text-[#0B3C5D] text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
              Why {schoolShortName}?
            </h2>
            <div className="w-16 h-1 bg-[#D9B310] mx-auto mt-4 rounded-full"></div>
            <p className="text-sm text-slate-500 leading-relaxed mt-4">
              Providing standard value-based learning modules, composite resources, and dynamic activities for all-round growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Block 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-6 items-start group">
              <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl flex-shrink-0 group-hover:bg-[#0B3C5D] group-hover:text-white transition-colors duration-300">
                <Icons.UserCheck size={24} />
              </div>
              <div>
                <strong className="text-base font-bold text-[#0B3C5D] uppercase tracking-wider block mb-3 group-hover:text-[#D9B310] transition-colors">
                  Dedicated Qualified Faculty
                </strong>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Highly trained educators committed to personalized academic mentorship and character development.
                </p>
              </div>
            </div>

            {/* Block 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-6 items-start group">
              <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl flex-shrink-0 group-hover:bg-[#0B3C5D] group-hover:text-white transition-colors duration-300">
                <Icons.Cpu size={24} />
              </div>
              <div>
                <strong className="text-base font-bold text-[#0B3C5D] uppercase tracking-wider block mb-3 group-hover:text-[#D9B310] transition-colors">
                  Holistic Skill Development
                </strong>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Hands-on STEM studio training, digital literacy, programming logic, and practical computing skills.
                </p>
              </div>
            </div>

            {/* Block 3 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-6 items-start group">
              <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl flex-shrink-0 group-hover:bg-[#0B3C5D] group-hover:text-white transition-colors duration-300">
                <Icons.Award size={24} />
              </div>
              <div>
                <strong className="text-base font-bold text-[#0B3C5D] uppercase tracking-wider block mb-3 group-hover:text-[#D9B310] transition-colors">
                  Excellent Academic Record
                </strong>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Consistent record of 100% SSLC board passing rates and outstanding pre-university results.
                </p>
              </div>
            </div>

            {/* Block 4 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-6 items-start group">
              <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl flex-shrink-0 group-hover:bg-[#0B3C5D] group-hover:text-white transition-colors duration-300">
                <Icons.BookOpen size={24} />
              </div>
              <div>
                <strong className="text-base font-bold text-[#0B3C5D] uppercase tracking-wider block mb-3 group-hover:text-[#D9B310] transition-colors">
                  Modern Campus Facilities
                </strong>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Advanced science labs, smart classrooms with visual boards, and a reference library of over 5000 volumes.
                </p>
              </div>
            </div>

            {/* Block 5 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-6 items-start group">
              <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl flex-shrink-0 group-hover:bg-[#0B3C5D] group-hover:text-white transition-colors duration-300">
                <Icons.Shield size={24} />
              </div>
              <div>
                <strong className="text-base font-bold text-[#0B3C5D] uppercase tracking-wider block mb-3 group-hover:text-[#D9B310] transition-colors">
                  Disciplined Environment
                </strong>
                <p className="text-sm text-slate-500 leading-relaxed">
                  A safe, ethical, and highly structured student-centered atmosphere fostering civic values.
                </p>
              </div>
            </div>

            {/* Block 6 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-6 items-start group">
              <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl flex-shrink-0 group-hover:bg-[#0B3C5D] group-hover:text-white transition-colors duration-300">
                <Icons.Trophy size={24} />
              </div>
              <div>
                <strong className="text-base font-bold text-[#0B3C5D] uppercase tracking-wider block mb-3 group-hover:text-[#D9B310] transition-colors">
                  Rich Extracurricular Clubs
                </strong>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Student sports meets (turf fields), watercolors art modules, pottery courses, and theater groups.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CENTERED MAP & CONTACT DETAILS SECTION (No enquiry form, fully spacious) */}
      <section className="max-w-[1440px] mx-auto px-[5%] py-24 text-center">
        {/* Centered Heading */}
        <div className="flex flex-col items-center text-center mb-16 max-w-[700px] mx-auto">
          <span className="text-xs text-[#D9B310] uppercase tracking-widest font-extrabold">Locate Us</span>
          <h3 className="font-serif text-[#0B3C5D] text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
            Our Coordinates & Campus Map
          </h3>
          <div className="w-16 h-1 bg-[#D9B310] mt-4 rounded-full"></div>
        </div>

        {/* 3-Column Centered Coordinates Grid (Restricted width to align with map) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-[900px] mx-auto">
          {/* Card 1: Postal Address */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
            <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl">
              <Icons.MapPin size={22} className="text-[#D9B310]" />
            </div>
            <div>
              <strong className="text-xs uppercase tracking-wider font-extrabold text-slate-400 block mb-2">
                Postal Address
              </strong>
              <p className="text-sm text-slate-600 leading-relaxed">
                {sContact.address || "Hemavathi Nagar / Vidyuth Nagar, Salagame Road, Hassan, Karnataka - 573202"}
              </p>
            </div>
          </div>

          {/* Card 2: Phone Hotline */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
            <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl">
              <Icons.Phone size={22} className="text-[#D9B310]" />
            </div>
            <div>
              <strong className="text-xs uppercase tracking-wider font-extrabold text-slate-400 block mb-2">
                Phone Contact
              </strong>
              <p className="text-base font-bold text-[#0B3C5D] leading-relaxed">
                {sContact.phone || "+91 81722 68512"}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                Office Hours Support
              </span>
            </div>
          </div>

          {/* Card 3: Email Desk */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
            <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-4 rounded-2xl">
              <Icons.Mail size={22} className="text-[#D9B310]" />
            </div>
            <div>
              <strong className="text-xs uppercase tracking-wider font-extrabold text-slate-400 block mb-2">
                Email Address
              </strong>
              <p className="text-sm font-semibold text-slate-600 break-all leading-relaxed">
                {sContact.email || "admin@holycrosshassan.edu.in"}
              </p>
            </div>
          </div>
        </div>

        {/* Centered Large Google Map (Restricted width to match coordinates grid) */}
        <div className="w-full max-w-[900px] mx-auto h-[450px] rounded-3xl border border-slate-100 overflow-hidden shadow-md transition-all duration-300 hover:shadow-2xl">
          <iframe 
            title="Homepage Centered Map"
            src={sContact.mapLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.1643444458315!2d76.10899217592476!3d13.025219913702585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba55146c2459bb5%3A0xe67c9c0f64c67675!2sHoly%20Cross%20Sisters%20School%2C%20Hassan!5e0!3m2!1sen!2sin!4v1718985100000!5m2!1sen!2sin"}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}



