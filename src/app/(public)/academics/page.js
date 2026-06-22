import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { BookOpen, Check, Heart, Award, GraduationCap } from 'lucide-react';

export default async function AcademicsPage() {
  await dbConnect();

  const academics = await Models.Academics.findOne();
  const sAcademics = academics ? JSON.parse(JSON.stringify(academics)) : {};

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-12 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2">ACADEMICS & CURRICULUM</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Academics</div>
      </div>

      <div className="page-container max-w-[1200px] mx-auto py-12 px-[5%] flex flex-col gap-10">
        
        {/* Board Details and Subject Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <h3 className="font-serif text-[#0B3C5D] text-2xl font-bold mb-4">Board Syllabus & Standards</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Our institution follows the State Board curriculum, recognized for its comprehensive focus on science, mathematical logic, and language development.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We maintain low teacher-to-student ratios, ensuring personalized academic guidance. Our teachers use modern audio-visual teaching aids to explain complex topics.
            </p>
            <div className="flex gap-6 mt-6 border-t border-slate-100 pt-5">
              <div>
                <strong className="block text-2xl text-[#0B3C5D] font-bold">100%</strong>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">SSLC Board Pass Rate</span>
              </div>
              <div>
                <strong className="block text-2xl text-[#0B3C5D] font-bold">25+</strong>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Experienced Faculty</span>
              </div>
              <div>
                <strong className="block text-2xl text-[#0B3C5D] font-bold">15:1</strong>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Student-Teacher Ratio</span>
              </div>
            </div>
          </div>

          {/* Subject Matrix Card */}
          <div className="bg-white p-8 rounded-lg border border-slate-200 border-t-4 border-t-[#D9B310] shadow-sm flex flex-col justify-center">
            <h4 className="text-lg font-serif text-[#0B3C5D] font-bold border-b border-slate-200 pb-3 mb-5">Subject Matrix</h4>
            <ul className="premium-list flex flex-col gap-4 list-none text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                <span className="text-xs"><strong>Languages:</strong> English (First Language), Kannada, Hindi</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                <span className="text-xs"><strong>Core Subjects:</strong> Mathematics, General Science, Social Studies</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                <span className="text-xs"><strong>Practical Labs:</strong> Computer Programming, Chemistry, Physics</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-[#0B3C5D] flex-shrink-0 mt-0.5" />
                <span className="text-xs"><strong>Co-curricular:</strong> Moral Science, Drawing, Physical Education</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Sections Breakdown */}
        <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm border-t-4 border-t-[#0B3C5D]">
          <h3 className="font-serif text-[#0B3C5D] text-xl font-semibold border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
            <BookOpen size={20} /> Academic Stages & Offerings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
              <h4 className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Heart size={16} className="text-[#D9B310]" /> Pre-Primary / Kindergarten
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sAcademics.prePrimaryContent || "Learning through play, sensory exploration, and motor skills refinement for LKG & UKG children."}
              </p>
            </div>
            
            <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
              <h4 className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <BookOpen size={16} className="text-[#D9B310]" /> Lower & Higher Primary
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sAcademics.primaryContent || "Building strong reading habits, basic arithmetic math skills, and social etiquette guidelines."}
              </p>
            </div>

            <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
              <h4 className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Award size={16} className="text-[#D9B310]" /> High School (Class 9-10)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sAcademics.highSchoolContent || "Rigorous preparations for Board Examinations, technical computer codes, and SSLC preparations."}
              </p>
            </div>

            <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
              <h4 className="text-sm font-bold text-[#0B3C5D] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <GraduationCap size={16} className="text-[#D9B310]" /> PU College (Class 11-12)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sAcademics.puCollegeContent || "Comprehensive preparation for Pre-University board exams and competitive entrance examinations (CET/NEET)."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
