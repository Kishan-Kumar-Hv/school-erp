import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { BookOpen, Check, Heart, Award, GraduationCap, Compass } from 'lucide-react';

export default async function AcademicsPage() {
  let academics = null;

  try {
    await dbConnect();
    academics = await Models.Academics.findOne();
  } catch (err) {
    console.warn("Database offline. Running Academics page in fallback mode.");
  }

  const sAcademics = academics ? JSON.parse(JSON.stringify(academics)) : {};

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      {/* Premium Hero Banner */}
      <div className="page-banner relative overflow-hidden bg-gradient-to-r from-[#0B3C5D] to-[#082b43] text-white py-24 px-[5%] text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h1 className="page-title font-serif text-3xl md:text-5xl font-bold mb-4 tracking-wide relative z-10">
          Academics & Curriculum
        </h1>
        <div className="page-breadcrumbs text-sm text-slate-300 font-medium relative z-10">
          <span>Home</span>
          <span className="mx-2.5 text-[#D9B310]">&gt;</span>
          <span className="text-white">Academics</span>
        </div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-20 px-[5%] flex flex-col gap-20">
        
        {/* Board Details and Subject Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          
          {/* Syllabus & Standards */}
          <div className="bg-white border border-slate-100 p-10 pl-14 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#0B3C5D]"></div>
            <div className="pl-6">
              <h3 className="font-serif text-[#0B3C5D] text-2xl md:text-3xl font-bold mb-6">
                Board Syllabus & Standards
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Our institution follows the State Board curriculum, recognized for its comprehensive focus on science, mathematical logic, and language development.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                We maintain low teacher-to-student ratios, ensuring personalized academic guidance. Our teachers use modern audio-visual teaching aids to explain complex topics.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 pl-6">
              <div>
                <strong className="block text-2xl md:text-3xl text-[#0B3C5D] font-bold">100%</strong>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">SSLC Pass Rate</span>
              </div>
              <div>
                <strong className="block text-2xl md:text-3xl text-[#0B3C5D] font-bold">25+</strong>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Expert Faculty</span>
              </div>
              <div>
                <strong className="block text-2xl md:text-3xl text-[#0B3C5D] font-bold">15:1</strong>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Student-Teacher</span>
              </div>
            </div>
          </div>

          {/* Subject Matrix Card */}
          <div className="bg-white p-10 pl-14 rounded-2xl border border-slate-100 border-t-[6px] border-t-[#D9B310] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-center">
            <h4 className="text-xl font-serif text-[#0B3C5D] font-bold border-b border-slate-100 pb-4 mb-6 flex items-center gap-2 pl-6">
              <Compass className="text-[#D9B310]" size={20} /> Subject Matrix
            </h4>
            <ul className="flex flex-col gap-5 list-none text-sm text-slate-600 pl-6">
              <li className="flex items-start gap-3">
                <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-1 rounded mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  <strong>Languages:</strong> English (First Language), Kannada, Hindi
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-1 rounded mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  <strong>Core Subjects:</strong> Mathematics, General Science, Social Studies
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-1 rounded mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  <strong>Practical Labs:</strong> Computer Programming, Chemistry, Physics
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#0B3C5D]/10 text-[#0B3C5D] p-1 rounded mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  <strong>Co-curricular:</strong> Moral Science, Drawing, Physical Education
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Sections Breakdown (Free Layout) */}
        <div>
          <div className="text-center mb-16 max-w-[700px] mx-auto">
            <h3 className="font-serif text-[#0B3C5D] text-3xl font-bold mb-4 tracking-tight flex items-center justify-center gap-2">
              Academic Stages & Offerings
            </h3>
            <div className="w-16 h-1 bg-[#D9B310] mx-auto mb-6 rounded-full"></div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We provide a structured learning pathway from early childhood through pre-university stages, designed to foster intellectual growth at each developmental milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stage 1 */}
            <div className="p-8 pl-12 md:p-10 md:pl-14 border border-slate-100 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border-l-[6px] border-l-[#0B3C5D] hover:border-l-[#D9B310] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-6 bottom-4 text-7xl font-bold text-slate-100 select-none pointer-events-none group-hover:text-slate-200/50 group-hover:scale-110 transition-all duration-300">
                01
              </div>
              <div className="relative z-10 pl-6">
                <h4 className="text-md font-bold text-[#0B3C5D] uppercase tracking-wider mb-4 flex items-center gap-2.5">
                  <span className="p-2 bg-[#0B3C5D]/5 text-[#D9B310] rounded-xl">
                    <Heart size={18} className="fill-current" />
                  </span>
                  Pre-Primary / Kindergarten
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed pr-10">
                  {sAcademics.prePrimaryContent || "Learning through play, sensory exploration, and motor skills refinement for LKG & UKG children."}
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-8 pl-12 md:p-10 md:pl-14 border border-slate-100 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border-l-[6px] border-l-[#0B3C5D] hover:border-l-[#D9B310] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-6 bottom-4 text-7xl font-bold text-slate-100 select-none pointer-events-none group-hover:text-slate-200/50 group-hover:scale-110 transition-all duration-300">
                02
              </div>
              <div className="relative z-10 pl-6">
                <h4 className="text-md font-bold text-[#0B3C5D] uppercase tracking-wider mb-4 flex items-center gap-2.5">
                  <span className="p-2 bg-[#0B3C5D]/5 text-[#D9B310] rounded-xl">
                    <BookOpen size={18} />
                  </span>
                  Lower & Higher Primary
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed pr-10">
                  {sAcademics.primaryContent || "Building strong reading habits, basic arithmetic math skills, and social etiquette guidelines."}
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-8 pl-12 md:p-10 md:pl-14 border border-slate-100 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border-l-[6px] border-l-[#0B3C5D] hover:border-l-[#D9B310] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-6 bottom-4 text-7xl font-bold text-slate-100 select-none pointer-events-none group-hover:text-slate-200/50 group-hover:scale-110 transition-all duration-300">
                03
              </div>
              <div className="relative z-10 pl-6">
                <h4 className="text-md font-bold text-[#0B3C5D] uppercase tracking-wider mb-4 flex items-center gap-2.5">
                  <span className="p-2 bg-[#0B3C5D]/5 text-[#D9B310] rounded-xl">
                    <Award size={18} />
                  </span>
                  High School (Class 9-10)
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed pr-10">
                  {sAcademics.highSchoolContent || "Rigorous preparations for Board Examinations, technical computer codes, and SSLC preparations."}
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-8 pl-12 md:p-10 md:pl-14 border border-slate-100 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border-l-[6px] border-l-[#0B3C5D] hover:border-l-[#D9B310] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-6 bottom-4 text-7xl font-bold text-slate-100 select-none pointer-events-none group-hover:text-slate-200/50 group-hover:scale-110 transition-all duration-300">
                04
              </div>
              <div className="relative z-10 pl-6">
                <h4 className="text-md font-bold text-[#0B3C5D] uppercase tracking-wider mb-4 flex items-center gap-2.5">
                  <span className="p-2 bg-[#0B3C5D]/5 text-[#D9B310] rounded-xl">
                    <GraduationCap size={18} />
                  </span>
                  PU College (Class 11-12)
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed pr-10">
                  {sAcademics.puCollegeContent || "Comprehensive preparation for Pre-University board exams and competitive entrance examinations (CET/NEET)."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

