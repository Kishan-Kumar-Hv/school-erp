import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import ContactForm from '@/components/ContactForm';
import { Shield, Clock, BookOpen, AlertCircle } from 'lucide-react';

export default async function AdmissionsPage() {
  let hero = null;

  try {
    await dbConnect();
    hero = await Models.Hero.findOne();
  } catch (err) {
    console.warn("Database offline. Running Admissions page in fallback mode.");
  }

  const sHero = hero ? JSON.parse(JSON.stringify(hero)) : {};

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-20 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2 tracking-wide">School Admissions 2027-28</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Admissions</div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-16 px-[5%] grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Admissions Criteria */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="content-card">
            <h3 className="font-serif text-[#0B3C5D] text-xl font-bold mb-3">Admission Guidelines & Criteria</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              We welcome applications from students of all backgrounds who demonstrate a desire to learn, grow, and contribute positively to our school community.
            </p>
            
            <ul className="flex flex-col gap-4 list-none text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex gap-3 items-start">
                <Clock size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Age Requirements:</strong>
                  <p className="text-slate-500 mt-0.5">Nursery/Preschool: 3+ Years; LKG: 4+ Years; Class 1: 6+ Years as of June 1st.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <Shield size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Documents Required:</strong>
                  <p className="text-slate-500 mt-0.5">Original Birth Certificate, Transfer Certificate (TC) from previous school, Aadhaar Card copy, and Passport Photos.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <BookOpen size={16} className="text-[#D9B310] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Assessment:</strong>
                  <p className="text-slate-500 mt-0.5">A friendly interaction and basic evaluation session will be conducted for Class 1 and upwards.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 text-amber-900 border border-amber-200 p-5 rounded-lg flex gap-3 items-start text-xs">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <strong className="block font-bold">Important Notice:</strong>
              <p className="mt-1 leading-relaxed">
                Seats are limited per class. Admissions are granted on a first-come, first-served basis matching assessment criteria. Please submit your inquiry form as early as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
