import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { User, Shield } from 'lucide-react';

export default async function FacultyPage() {
  await dbConnect();

  const faculty = await Models.Faculty.find().sort({ order: 1 });
  const sFaculty = JSON.parse(JSON.stringify(faculty));

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-12 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2">FACULTY & ADMINISTRATION</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Faculty</div>
      </div>

      <div className="page-container max-w-[1200px] mx-auto py-12 px-[5%]">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-2xl font-bold mb-2">Our Dedicated Educators</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our staff members bring a wealth of expertise, dedication, and passion to nurture the intellect and character of our students.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sFaculty.map((member, idx) => (
            <div key={member._id || idx} className="bg-white border border-slate-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3">
              {member.photo ? (
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#0B3C5D]/10 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                  <User size={32} />
                </div>
              )}
              <div>
                <strong className="text-sm font-semibold text-[#0B3C5D] block">{member.name}</strong>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">{member.designation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
