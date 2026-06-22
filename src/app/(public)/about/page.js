import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { User, Award, Shield, Check } from 'lucide-react';

export default async function AboutPage() {
  let about = null;
  let principal = null;

  try {
    await dbConnect();
    about = await Models.About.findOne();
    principal = await Models.Principal.findOne();
  } catch (err) {
    console.warn("Database offline. Running About page in fallback mode.");
  }

  const sAbout = about ? JSON.parse(JSON.stringify(about)) : {};
  const sPrincipal = principal ? JSON.parse(JSON.stringify(principal)) : {};

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-20 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2 tracking-wide">About Our Institution</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; About Us</div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-12 px-[5%] flex flex-col gap-12">
        {/* Info Grid - Legacy and Foundations */}
        <div className="info-grid grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="info-text-block">
            <h3 className="font-serif text-2xl font-bold text-[#0B3C5D] mb-4">Our Foundations & Mercy Legacy</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {sAbout.aboutText || "Holy Cross Sisters School, Hassan, stands as a beacon of academic progress. We operate under the aegis of the Sisters of Mercy, carrying forward a legacy of education designed to empower and nurture the young minds of Hassan."}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We believe in holistic development. Along with scholastic achievement, our students are taught moral values, self-reliance, and compassion for the community.
            </p>
          </div>
          <img src="/assets/school_frontage.png" alt="School Frontage" className="info-image w-full h-[320px] object-cover rounded-lg shadow-md" />
        </div>

        {/* Vision, Mission, and Core Beliefs */}
        <div className="info-grid grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <h4 className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wider mb-2">Our Vision</h4>
              <p className="text-sm italic text-slate-600 bg-slate-50 p-4 border-l-4 border-[#0B3C5D] rounded">
                "{sAbout.vision || "To establish a value-driven center of educational excellence."}"
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wider mb-2">Our Mission</h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 border-l-4 border-[#D9B310] rounded">
                {sAbout.mission || "To provide accessible, top-quality teaching modules and guide students to become compassionate citizens."}
              </p>
            </div>
          </div>

          {/* Core Beliefs Card */}
          <div className="bg-[#0B3C5D] text-white p-8 rounded-lg shadow-md flex flex-col justify-center">
            <h4 className="text-lg font-serif text-[#D9B310] font-bold border-b border-white/10 pb-3 mb-5">Core Beliefs</h4>
            <ul className="premium-list flex flex-col gap-3.5 list-none text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <span>Academic Rigor & Critical Reasoning</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <span>Technological Skill Acquisition (STEM)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <span>Physical Health & Sportsmanship</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <span>Environmental Stewardship</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <span>Service to Humanity</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Principal Message Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm border-t-4 border-t-[#0B3C5D]">
          <h3 className="font-serif text-[#0B3C5D] text-xl font-semibold border-b border-slate-100 pb-3 mb-6 flex items-center gap-2 capitalize">
            <User size={20} /> Message From The Principal's Desk
          </h3>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {sPrincipal.photo ? (
              <img 
                src={sPrincipal.photo} 
                alt={sPrincipal.name} 
                className="w-40 h-52 object-cover rounded shadow-md border border-slate-200"
              />
            ) : (
              <div className="w-40 h-52 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400 shadow-md">
                <User size={48} />
              </div>
            )}
            <div className="flex flex-col gap-4">
              <strong className="text-[#0B3C5D] text-lg font-bold block">{sPrincipal.name || "Sr. Maria Philomina"}</strong>
              <span className="text-xs text-[#D9B310] uppercase font-bold tracking-wider block -mt-3">Headmistress</span>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{sPrincipal.message || "We are dedicated to nurturing each child\'s development. By integrating core human values with modern curriculum standards, we ensure our graduates are thoroughly equipped to take on future global challenges."}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
