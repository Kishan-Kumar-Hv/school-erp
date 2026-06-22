'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, FileText, ArrowRight, Bell } from 'lucide-react';

export default function HomeNewsEvents({ initialNotices, initialEvents }) {
  const [activeTab, setActiveTab] = useState('notices');

  const notices = initialNotices || [];
  const events = initialEvents || [];

  // Helper to check if a date is "new" (published within last 15 days)
  const isRecent = (dateStr) => {
    try {
      const pubDate = new Date(dateStr);
      const today = new Date();
      const diffTime = Math.abs(today - pubDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 15;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-wide uppercase transition-all border-b-2 rounded-t-xl ${
            activeTab === 'notices'
              ? 'bg-white border-[#0B3C5D] text-[#0B3C5D] shadow-sm'
              : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Bell size={16} className={activeTab === 'notices' ? 'text-[#D9B310]' : 'text-slate-400'} />
          <span>Latest Announcements</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-wide uppercase transition-all border-b-2 rounded-t-xl ${
            activeTab === 'events'
              ? 'bg-white border-[#0B3C5D] text-[#0B3C5D] shadow-sm'
              : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calendar size={16} className={activeTab === 'events' ? 'text-[#D9B310]' : 'text-slate-400'} />
          <span>Upcoming Events</span>
        </button>
      </div>

      {/* Tab Contents Container */}
      <div className="bg-white border border-slate-100 border-t-0 p-6 md:p-8 rounded-b-2xl shadow-md min-h-[380px] flex flex-col justify-between">
        
        {/* List of items */}
        <div className="flex flex-col gap-6">
          {activeTab === 'notices' ? (
            notices.length > 0 ? (
              notices.map((not, idx) => {
                const noticeDate = new Date(not.date);
                const recent = isRecent(not.date);

                return (
                  <div key={not._id || idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 group">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <Calendar size={12} />
                        {noticeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {recent && (
                        <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase animate-pulse">
                          New
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#0B3C5D] group-hover:text-[#D9B310] transition-colors duration-200">
                      {not.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                      {not.description}
                    </p>
                    {not.fileUrl && (
                      <a 
                        href={not.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[11px] text-[#0B3C5D] font-bold mt-2.5 flex items-center gap-1 hover:text-[#D9B310]"
                      >
                        <FileText size={12} /> View Attachment Circular
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No recent announcements available.
              </div>
            )
          ) : (
            events.length > 0 ? (
              events.map((evt, idx) => {
                const eventDate = new Date(evt.date);
                const recent = isRecent(evt.date);

                return (
                  <div key={evt._id || idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 group">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <Calendar size={12} />
                        {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {recent && (
                        <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase animate-pulse">
                          New
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#0B3C5D] group-hover:text-[#D9B310] transition-colors duration-200">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                      {evt.description}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No upcoming events scheduled.
              </div>
            )
          )}
        </div>

        {/* View All Button */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-center">
          {activeTab === 'notices' ? (
            <Link 
              href="/notice-board" 
              className="text-xs font-bold text-[#0B3C5D] hover:text-[#D9B310] transition-colors flex items-center gap-1.5 group"
            >
              <span>View All Announcements</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link 
              href="/events" 
              className="text-xs font-bold text-[#0B3C5D] hover:text-[#D9B310] transition-colors flex items-center gap-1.5 group"
            >
              <span>View School Timeline</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
