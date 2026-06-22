import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { Calendar, Info } from 'lucide-react';

export default async function EventsPage() {
  await dbConnect();

  const events = await Models.Event.find().sort({ date: -1 });
  const sEvents = JSON.parse(JSON.stringify(events));

  return (
    <div>
      <div className="page-banner bg-[#0B3C5D] text-white py-12 px-[5%] text-center">
        <h1 className="page-title font-serif text-3xl md:text-4xl font-bold mb-2">CAMPUS EVENTS & CELEBRATIONS</h1>
        <div className="page-breadcrumbs text-xs text-slate-300">Home &gt; Events</div>
      </div>

      <div className="page-container max-w-[1200px] mx-auto py-12 px-[5%]">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-2xl font-bold mb-2">School Events Timeline</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Stay updated with our cultural festivals, annual academic matches, sports meets, national days, and workshops.
          </p>
        </div>

        {sEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No events scheduled or added yet.
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-[800px] mx-auto">
            {sEvents.map((evt, idx) => {
              const eventDateObj = new Date(evt.date);
              return (
                <div key={evt._id || idx} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-start">
                  {/* Date Badge */}
                  <div className="bg-[#D9B310] text-[#1D2731] py-3 px-4 rounded text-center flex-shrink-0 w-24 shadow-sm">
                    <span className="text-2xl font-bold block leading-none">{eventDateObj.getDate()}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider block mt-1">{eventDateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-[10px] font-medium block opacity-70 mt-0.5">{eventDateObj.getFullYear()}</span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="font-serif text-[#0B3C5D] text-lg font-bold">{evt.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{evt.description}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                      <Calendar size={12} /> Published Date: {evt.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
