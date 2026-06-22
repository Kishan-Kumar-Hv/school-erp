import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { Calendar, FileText, Info, ArrowDownToLine, Bell } from 'lucide-react';

export default async function NoticeBoardPage() {
  let notices = [];

  try {
    await dbConnect();
    notices = await Models.Notice.find().sort({ date: -1 });
  } catch (err) {
    console.warn("Database offline. Running Notice Board page in fallback mode.");
  }

  const sNotices = JSON.parse(JSON.stringify(notices));

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      {/* Premium Hero Banner */}
      <div className="page-banner relative overflow-hidden bg-gradient-to-r from-[#0B3C5D] to-[#082b43] text-white py-24 px-[5%] text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h1 className="page-title font-serif text-3xl md:text-5xl font-bold mb-4 tracking-wide relative z-10">
          Official Notice Board
        </h1>
        <div className="page-breadcrumbs text-sm text-slate-300 font-medium relative z-10">
          <span>Home</span>
          <span className="mx-2.5 text-[#D9B310]">&gt;</span>
          <span className="text-white">Notice Board</span>
        </div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-20 px-[5%]">
        <div className="text-center mb-16 max-w-[700px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-3xl font-bold mb-4 tracking-tight">
            Latest Notices & Announcements
          </h2>
          <div className="w-16 h-1 bg-[#D9B310] mx-auto mb-6 rounded-full"></div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Access up-to-date calendar circulars, holiday notices, examination schedules, fee deadlines, and official academic announcements.
          </p>
        </div>

        {sNotices.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 text-sm">
            <Bell size={40} className="mx-auto mb-4 opacity-30 text-[#0B3C5D]" />
            No notices published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sNotices.map((not, idx) => {
              const noticeDateObj = new Date(not.date);
              return (
                <div 
                  key={not._id || idx} 
                  className="bg-white border border-slate-100 rounded-2xl p-8 pl-12 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group transform hover:-translate-y-1.5"
                >
                  {/* Left Gold Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D9B310]"></div>

                  <div>
                    {/* Date Badge */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3C5D] bg-[#0B3C5D]/5 px-3 py-1.5 rounded-full mb-4">
                      <Calendar size={13} className="text-[#D9B310]" />
                      {noticeDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>

                    <h3 className="font-serif text-[#0B3C5D] text-lg font-bold group-hover:text-[#D9B310] transition-colors duration-200 mb-3 leading-snug">
                      {not.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {not.description}
                    </p>
                  </div>
                  
                  {not.fileUrl ? (
                    <div className="mt-2 pt-5 border-t border-slate-100">
                      <a 
                        href={not.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-white bg-[#0B3C5D] py-3 px-4 rounded-xl font-bold hover:bg-[#082b43] transition-colors duration-200 flex items-center justify-center gap-2 group/btn shadow-sm"
                      >
                        <ArrowDownToLine size={15} className="transform group-hover/btn:translate-y-0.5 transition-transform" />
                        <span>Download Circular / PDF</span>
                      </a>
                    </div>
                  ) : (
                    <div className="mt-2 pt-4 border-t border-slate-50 flex justify-end">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Info size={11} /> General Notice
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

