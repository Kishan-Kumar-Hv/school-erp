'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    grade: 'Preschool',
    phone: '',
    email: '',
    desc: ''
  });
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Thank you! Your enquiry has been received. Our admissions office will contact you shortly.');
    setFormData({
      studentName: '',
      parentName: '',
      grade: 'Preschool',
      phone: '',
      email: '',
      desc: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h4 className="font-serif text-[#0B3C5D] text-lg font-semibold border-b border-slate-200 pb-3 mb-5">
        Admissions Inquiry Form
      </h4>
      
      {success ? (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded border border-emerald-200 text-sm flex items-start gap-3">
          <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={18} />
          <span>{success}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-slate-500">Student's Name *</label>
              <input 
                type="text" 
                required 
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Full name of student" 
              />
            </div>
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-slate-500">Parent / Guardian Name *</label>
              <input 
                type="text" 
                required 
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Guardian full name" 
              />
            </div>
          </div>

          <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-slate-500">Grade / Class Required *</label>
              <select 
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              >
                <option value="Preschool">Preschool / Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Class 1-5">Class 1 to 5</option>
                <option value="Class 6-8">Class 6 to 8</option>
                <option value="Class 9-10">Class 9 & 10 (High School)</option>
                <option value="PU College">PU College (Class 11/12)</option>
              </select>
            </div>
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-slate-500">Phone Number *</label>
              <input 
                type="tel" 
                required 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Contact Mobile Number" 
              />
            </div>
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-slate-500">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address for replies" 
            />
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-slate-500">Brief Message / Academic Background</label>
            <textarea 
              rows="4" 
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Tell us about the student's previous school, scores or requests..."
            ></textarea>
          </div>

          <button type="submit" className="btn-gold w-full justify-center mt-2 py-3">
            Submit Inquiry Request <ArrowRight size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
