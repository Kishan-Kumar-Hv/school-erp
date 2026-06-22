import { dbConnect } from '@/lib/db';
import * as Models from '@/models/Schemas';
import { Calendar, Info, Clock, MapPin } from 'lucide-react';

export default async function EventsPage() {
  let events = [];

  try {
    await dbConnect();
    events = await Models.Event.find().sort({ date: -1 });
  } catch (err) {
    console.warn("Database offline. Running Events page in fallback mode.");
  }

  const sEvents = JSON.parse(JSON.stringify(events));

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      {/* Premium Hero Banner */}
      <div className="page-banner relative overflow-hidden bg-gradient-to-r from-[#0B3C5D] to-[#082b43] text-white py-24 px-[5%] text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h1 className="page-title font-serif text-3xl md:text-5xl font-bold mb-4 tracking-wide relative z-10">
          Campus Events & Timeline
        </h1>
        <div className="page-breadcrumbs text-sm text-slate-300 font-medium relative z-10">
          <span>Home</span>
          <span className="mx-2.5 text-[#D9B310]">&gt;</span>
          <span className="text-white">Events</span>
        </div>
      </div>

      <div className="page-container max-w-[1440px] mx-auto py-20 px-[5%]">
        <div className="text-center mb-16 max-w-[700px] mx-auto">
          <h2 className="font-serif text-[#0B3C5D] text-3xl font-bold mb-4 tracking-tight">
            School Events & Celebrations
          </h2>
          <div className="w-16 h-1 bg-[#D9B310] mx-auto mb-6 rounded-full"></div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Stay updated with our cultural festivals, annual academic matches, sports meets, national days, and educational workshops that keep our campus alive with learning.
          </p>
        </div>

        {sEvents.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 text-sm">
            <Calendar size={40} className="mx-auto mb-4 opacity-30 text-[#0B3C5D]" />
            No events scheduled or added yet.
          </div>
        ) : (
          /* Timeline Container */
          <div className="relative pl-6 sm:pl-10 md:pl-16">
            
            {/* Timeline Vertical line */}
            <div className="absolute left-[38px] sm:left-[42px] md:left-[48px] top-6 bottom-6 w-[3px] bg-gradient-to-b from-[#0B3C5D] via-[#328CC1] to-slate-200 rounded-full"></div>

            {/* Loop through events */}
            <div className="flex flex-col gap-12">
              {sEvents.map((evt, idx) => {
                const eventDateObj = new Date(evt.date);
                const dateDay = eventDateObj.getDate() || '15';
                const dateMonth = eventDateObj.toLocaleDateString('en-US', { month: 'short' }) || 'Jun';
                const dateYear = eventDateObj.getFullYear() || '2026';

                return (
                  <div key={evt._id || idx} className="relative group flex items-start gap-8 md:gap-12">
                    
                    {/* Timeline Node Node/Marker */}
                    <div className="absolute left-[-2px] sm:left-[2px] md:left-[8px] top-4 w-6 h-6 rounded-full bg-white border-[5px] border-[#0B3C5D] group-hover:border-[#D9B310] transition-colors duration-300 shadow-md z-10"></div>

                    {/* Left floating Date Panel (Visible only on medium screens and up) */}
                    <div className="hidden sm:flex flex-col items-center justify-center flex-shrink-0 w-24 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm group-hover:border-[#D9B310]/30 transition-all duration-300 relative z-10">
                      <span className="text-3xl font-extrabold text-[#0B3C5D] tracking-tight leading-none">
                        {dateDay}
                      </span>
                      <span className="text-xs uppercase font-bold tracking-wider text-[#D9B310] mt-1.5">
                        {dateMonth}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {dateYear}
                      </span>
                    </div>

                    {/* Timeline Card */}
                    <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative z-10 flex flex-col gap-4">
                      
                      {/* Mobile Date Header (Visible only under sm screens) */}
                      <div className="flex sm:hidden items-center gap-2 text-xs font-bold text-[#D9B310] uppercase tracking-wider">
                        <Calendar size={14} />
                        <span>{dateMonth} {dateDay}, {dateYear}</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h3 className="font-serif text-[#0B3C5D] text-xl font-bold group-hover:text-[#D9B310] transition-colors duration-200">
                          {evt.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      {/* Meta Information Footer of Card */}
                      <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-slate-100/80 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[#0B3C5D]/60" />
                          <span>Event Date: {evt.date}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#0B3C5D]/60" />
                          <span>Campus Assembly</span>
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

