import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { User, Shield, GraduationCap, Briefcase } from 'lucide-react';

export default async function FacultyPage() {
  let faculty = [];

  try {
    await dbConnect();
    faculty = await Models.Faculty.find().sort({ order: 1 });
  } catch (err) {
    console.warn("Database offline. Running Faculty page in fallback mode.");
  }

  const sFaculty = JSON.parse(JSON.stringify(faculty));

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      {/* Premium Hero Banner */}
      <div className="page-banner relative overflow-hidden bg-gradient-to-r from-[#0B3C5D] to-[#082b43] text-white py-24 px-[5%] text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h1 className="page-title font-serif text-3xl md:text-5xl font-bold mb-4 tracking-wide relative z-10">
          Faculty & Administration
        </h1>
        <div className="page-breadcrumbs text-sm text-slate-300 font-medium relative z-10">
          <span>Home</span>
          <span className="mx-2.5 text-[#D9B310]">&gt;</span>
          <span className="text-white">Faculty</span>
        </div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-20 px-[5%]">
        <div className="text-center mb-16 max-w-[700px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-3xl font-bold mb-4 tracking-tight">
            Our Dedicated Educators
          </h2>
          <div className="w-16 h-1 bg-[#D9B310] mx-auto mb-6 rounded-full"></div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our staff members bring a wealth of expertise, dedication, and passion to nurture the intellect and character of our students, helping them grow into future leaders.
          </p>
        </div>

        {/* Educators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sFaculty.map((member, idx) => (
            <div 
              key={member._id || idx} 
              className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-4 relative overflow-hidden group transform hover:-translate-y-1.5"
            >
              {/* Gold Top Highlight Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0B3C5D] to-[#D9B310] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

              {/* Avatar Frame with soft background gradient */}
              <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#0B3C5D]/10 to-[#D9B310]/15 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center relative">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#0B3C5D]/5 to-[#D9B310]/10 flex items-center justify-center text-[#0B3C5D]/60">
                      <User size={40} className="stroke-[1.5]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Information */}
              <div className="flex flex-col items-center gap-2 mt-2">
                <strong className="font-serif text-lg font-bold text-[#0B3C5D] group-hover:text-[#D9B310] transition-colors duration-200 block">
                  {member.name}
                </strong>
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100/60 block">
                  {member.designation}
                </span>
              </div>

              {/* Extra visual fluff to make it look premium */}
              <div className="w-full border-t border-slate-100/80 pt-4 mt-2 flex items-center justify-center gap-2 text-slate-400 text-xs">
                {member.designation.toLowerCase().includes('principal') ? (
                  <Shield size={14} className="text-[#D9B310]" />
                ) : (
                  <GraduationCap size={14} className="text-[#0B3C5D]/60" />
                )}
                <span>Faculty Roster</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

