import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { Calendar, FileText, Info } from 'lucide-react';

export default async function NoticeBoardPage() {
  await dbConnect();

  const notices = await Models.Notice.find().sort({ date: -1 });
  const sNotices = JSON.parse(JSON.stringify(notices));

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-12 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2">OFFICIAL NOTICE BOARD</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Notice Board</div>
      </div>

      <div className="page-container max-w-[1200px] mx-auto py-12 px-[5%]">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-2xl font-bold mb-2">Latest Notices & Announcements</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Access up-to-date calendar circulars, holiday notices, examination schedules, fees deadlines, and academic announcements.
          </p>
        </div>

        {sNotices.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No notices published yet.
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-[800px] mx-auto">
            {sNotices.map((not, idx) => {
              const noticeDateObj = new Date(not.date);
              return (
                <div key={not._id || idx} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <span className="notice-date bg-[#328CC1]/10 text-[#328CC1] px-3 py-1 rounded-full text-xs font-bold">
                      {noticeDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-serif text-[#0B3C5D] text-base font-bold">{not.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{not.description}</p>
                  
                  {not.fileUrl && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-start">
                      <a 
                        href={not.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-white bg-[#0B3C5D] px-4 py-2 rounded font-semibold hover:bg-[#072b43] transition-all flex items-center gap-1.5"
                      >
                        <FileText size={14} /> Download PDF/Circular attachment
                      </a>
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
