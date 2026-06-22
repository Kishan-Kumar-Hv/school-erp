'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, MapPin, HelpCircle, Send, X, MessageCircle, Menu } from 'lucide-react';

export default function FloatingWidgets({ school }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  
  const schoolName = school?.name || 'Holy Cross Sisters School';
  const schoolShortName = schoolName.split(',')[0];
  const phone = school?.phone || '+91 81722 68512';
  const email = school?.email || 'admin@holycrosshassan.edu.in';
  const address = school?.address || 'Hemavathi Nagar, Hassan, Karnataka - 573202';

  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: `Hello! I am your ${schoolShortName} Virtual Assistant. How can I help you today?` }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (school?.name) {
      setChatMessages([
        { sender: 'bot', text: `Hello! I am your ${schoolShortName} Virtual Assistant. How can I help you today?` }
      ]);
    }
  }, [school, schoolShortName]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleChatQuery = (text) => {
    const newMsgs = [...chatMessages, { sender: 'user', text }];
    setChatMessages(newMsgs);

    setTimeout(() => {
      let reply = `I'm not sure about that. Please contact our school office desk at ${phone} for assistance, or visit the school office.`;
      const t = text.toLowerCase();

      if (t.includes('admission') || t.includes('apply') || t.includes('enquiry') || t.includes('join') || t.includes('fee')) {
        reply = "Admissions for the academic year 2027-28 are open. You can enquire by clicking 'Enquire Now' on the homepage, filling the Contact form, or visiting the campus.";
      } else if (t.includes('hour') || t.includes('time') || t.includes('timing') || t.includes('saturday') || t.includes('office')) {
        reply = "School hours are Monday to Friday: 8:30 AM to 4:00 PM, and Saturday: 8:30 AM to 1:00 PM. The office is closed on Sundays.";
      } else if (t.includes('phone') || t.includes('contact') || t.includes('call') || t.includes('email') || t.includes('number')) {
        reply = `You can call us at ${phone} or email ${email}. Office hours apply.`;
      } else if (t.includes('map') || t.includes('address') || t.includes('location') || t.includes('where')) {
        reply = `We are located at: ${address}. Click the map pin floating widget for direct GPS directions!`;
      } else if (t.includes('sport') || t.includes('activity') || t.includes('coding') || t.includes('extracurricular') || t.includes('pottery') || t.includes('drama') || t.includes('stem')) {
        reply = "We offer physical sports (turf fields), coding/STEM activities, clay pottery modules, and drama theater programs.";
      } else if (t.includes('hello') || t.includes('hi') || t.includes('hey') || t.includes('greet')) {
        reply = `Hello! How can I assist you with details about ${schoolShortName} today?`;
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 450);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput('');
    handleChatQuery(txt);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isChatOpen) setIsChatOpen(false);
  };

  const openChat = () => {
    setIsChatOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Call & Action buttons container */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden flex flex-col items-end gap-4">
        
        {/* Expanded Quick-Action Items */}
        {isMenuOpen && (
          <div className="flex flex-col gap-4 items-end mb-2 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in">
            
            {/* Ask Assistant (Chatbot) */}
            <div className="flex items-center group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg mr-3 shadow-md backdrop-blur-sm border border-slate-800">
                AI Assistant
              </span>
              <button 
                onClick={openChat}
                className="w-12 h-12 rounded-full bg-[#D9B310] text-[#1D2731] hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg transition-all cursor-pointer border border-[#D9B310]/20"
                title="Ask School Assistant"
              >
                <HelpCircle size={20} />
              </button>
            </div>

            {/* Directions / Maps Pin Button */}
            <div className="flex items-center group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg mr-3 shadow-md backdrop-blur-sm border border-slate-800">
                GPS Location
              </span>
              <a 
                href="https://maps.google.com/?q=Holy+Cross+Sisters+School,Hassan,Karnataka" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-full bg-[#328CC1] text-white hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg transition-all border border-[#328CC1]/20"
                title="Get GPS Directions"
              >
                <MapPin size={20} />
              </a>
            </div>

            {/* WhatsApp Chat Button */}
            <div className="flex items-center group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg mr-3 shadow-md backdrop-blur-sm border border-slate-800">
                WhatsApp Support
              </span>
              <a 
                href="https://wa.me/918172268512" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-full bg-[#25D366] text-white hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg transition-all border border-emerald-500/20"
                title="WhatsApp Chat"
              >
                <MessageSquare size={20} />
              </a>
            </div>

            {/* Call Office Desk Button */}
            <div className="flex items-center group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg mr-3 shadow-md backdrop-blur-sm border border-slate-800">
                Call Office
              </span>
              <a 
                href="tel:+918172268512" 
                className="w-12 h-12 rounded-full bg-[#0B3C5D] text-white hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg transition-all border border-[#0B3C5D]/20"
                title="Call Office Desk"
              >
                <Phone size={20} />
              </a>
            </div>

          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button 
          onClick={toggleMenu}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0B3C5D] to-[#328CC1] text-white flex items-center justify-center shadow-2xl hover:shadow-[#0B3C5D]/40 transform hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 z-50 cursor-pointer border border-[#328CC1]/20 group"
          title="Quick Connect"
        >
          {/* Subtle Golden Glowing Ring */}
          {!isMenuOpen && !isChatOpen && (
            <span className="absolute inset-0 rounded-full bg-[#328CC1] opacity-25 animate-ping"></span>
          )}

          {isMenuOpen || isChatOpen ? (
            <X size={24} className="transition-transform duration-300 rotate-0" />
          ) : (
            <MessageCircle size={24} className="transition-transform duration-300 group-hover:rotate-12" />
          )}
        </button>

      </div>

      {/* Floating Chatbot Widget Window */}
      {isChatOpen && (
        <div 
          className="fixed bottom-24 right-4 md:right-6 w-[350px] max-w-[calc(100vw-32px)] h-[450px] max-h-[80vh] print:hidden shadow-2xl border border-slate-200/80 bg-white flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 fade-in duration-300" 
          style={{
            borderRadius: '16px',
          }}
        >
          {/* Chat Header */}
          <div 
            className="flex justify-between items-center text-white" 
            style={{
              backgroundColor: 'var(--primary)',
              padding: '16px 20px',
              fontWeight: '600',
              fontSize: '14px',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="font-serif tracking-wide">{schoolShortName} Assistant</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)} 
              className="bg-transparent text-white border-none text-xl font-bold cursor-pointer hover:opacity-85 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-sm border ${
                  msg.sender === 'user' 
                    ? 'self-end bg-[#0B3C5D] text-white border-transparent rounded-tr-none' 
                    : 'self-start bg-white text-slate-700 border-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Helper Query Chips */}
          <div className="flex gap-2 p-3 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none">
            {['Admissions?', 'School Hours?', 'Contact Info?', 'Campus Map?'].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleChatQuery(q)}
                className="text-[11px] px-3.5 py-2 bg-slate-100 hover:bg-[#0B3C5D] hover:text-white text-[#0B3C5D] font-bold rounded-full border-none cursor-pointer transition-all flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Form Input */}
          <form 
            onSubmit={handleChatSubmit} 
            className="flex border-t border-slate-200 bg-white"
          >
            <input
              type="text"
              placeholder="Type your question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 border-none px-4 py-4 outline-none text-xs text-slate-700 placeholder-slate-400"
            />
            <button
              type="submit"
              className="px-5 bg-[#D9B310] hover:bg-[#bda00d] text-slate-800 font-bold border-none cursor-pointer flex items-center justify-center transition-colors"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
