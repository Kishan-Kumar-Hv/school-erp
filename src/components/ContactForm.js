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
    <div className="content-card">
      <h4 className="card-title">
        Admissions Inquiry Form
      </h4>
      
      {success ? (
        <div className="bg-emerald-50 text-emerald-800 p-5 rounded-lg border border-emerald-200 text-sm flex items-start gap-3.5 shadow-sm">
          <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
          <span className="leading-relaxed">{success}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student's Name *</label>
              <input 
                type="text" 
                required 
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Full name of student" 
              />
            </div>
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent / Guardian Name *</label>
              <input 
                type="text" 
                required 
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Guardian full name" 
              />
            </div>
          </div>

          <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grade / Class Required *</label>
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
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
              <input 
                type="tel" 
                required 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Contact Mobile Number" 
              />
            </div>
          </div>

          <div className="form-group flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address for replies" 
            />
          </div>

          <div className="form-group flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brief Message / Academic Background</label>
            <textarea 
              rows="4" 
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Tell us about the student's previous school, scores or requests..."
            ></textarea>
          </div>

          <button type="submit" className="btn-gold w-full justify-center mt-3 py-3.5 text-sm uppercase tracking-wider font-bold shadow-md hover:scale-[1.01] active:scale-95 transition-all">
            Submit Inquiry Request &nbsp;<ArrowRight size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
