'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Info, Image as ImageIcon, FileText, Calendar, 
  Users, Award, BookOpen, GraduationCap, Phone, MapPin, 
  LogOut, Plus, Trash2, Edit, Save, Upload, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authenticatedUser, setAuthenticatedUser] = useState('');
  
  // Status feedback alerts
  const [alertError, setAlertError] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  // CMS Database States
  const [schoolInfo, setSchoolInfo] = useState({});
  const [hero, setHero] = useState({});
  const [about, setAbout] = useState({});
  const [principal, setPrincipal] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [academics, setAcademics] = useState({});
  const [faculty, setFaculty] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [contact, setContact] = useState({});

  // Sub-items Form Modal / Editing States
  const [editingItem, setEditingItem] = useState(null); // for list edits (facility, faculty, event, notice)
  const [isCreating, setIsCreating] = useState(false);  // toggles creation form
  
  // File upload state trackers
  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [principalFile, setPrincipalFile] = useState(null);
  const [tempFile, setTempFile] = useState(null); // shared file input state for list CRUD

  // Lists form inputs states
  const [facilityForm, setFacilityForm] = useState({ name: '', description: '', iconName: 'Award' });
  const [facultyForm, setFacultyForm] = useState({ name: '', designation: '', order: 0 });
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', description: '', date: '' });

  // 1. Session Auth check
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/login');
      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        router.push('/admin/login');
      } else {
        setAuthenticatedUser(data.username);
        fetchAllData();
      }
    } catch (err) {
      router.push('/admin/login');
    }
  };

  // 2. Fetch all collections data
  const fetchAllData = async () => {
    try {
      const fetchModule = async (mod) => {
        const res = await fetch(`/api/cms/${mod}`);
        return res.json();
      };
      
      const [
        schoolData, heroData, aboutData, principalData, 
        facilitiesData, academicsData, facultyData, 
        galleryData, eventsData, noticesData, contactData
      ] = await Promise.all([
        fetchModule('school'), fetchModule('hero'), fetchModule('about'), fetchModule('principal'),
        fetchModule('facilities'), fetchModule('academics'), fetchModule('faculty'),
        fetchModule('gallery'), fetchModule('events'), fetchModule('notices'), fetchModule('contact')
      ]);

      setSchoolInfo(schoolData || {});
      setHero(heroData || {});
      setAbout(aboutData || {});
      setPrincipal(principalData || {});
      setFacilities(facilitiesData || []);
      setAcademics(academicsData || {});
      setFaculty(facultyData || []);
      setGallery(galleryData || []);
      setEvents(eventsData || []);
      setNotices(noticesData || []);
      setContact(contactData || {});
    } catch (err) {
      showError('Error loading database collections: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Alert triggers
  const showError = (msg) => {
    setAlertError(msg);
    setAlertSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showSuccess = (msg) => {
    setAlertSuccess(msg);
    setAlertError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setAlertSuccess(''), 5000);
  };

  // 3. Logout action
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
      router.push('/');
    } catch (err) {
      router.push('/');
    }
  };

  // ==========================================
  // CMS CRUD & Save Handlers
  // ==========================================

  // Save Single-Document Modules (school, hero, about, principal, academics, contact)
  const saveSingleDocModule = async (module, payload, filePayload = {}) => {
    setLoading(true);
    setAlertError('');
    setAlertSuccess('');

    try {
      let res;
      // Handle file uploads by packaging payload into FormData
      if (Object.keys(filePayload).length > 0) {
        const formData = new FormData();
        
        // Append text fields
        Object.keys(payload).forEach(key => {
          if (payload[key] !== undefined && payload[key] !== null) {
            formData.append(key, payload[key]);
          }
        });
        
        // Append file fields
        Object.keys(filePayload).forEach(key => {
          if (filePayload[key]) {
            formData.append(key, filePayload[key]);
          }
        });

        res = await fetch(`/api/cms/${module}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch(`/api/cms/${module}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update content');

      showSuccess(`${module.charAt(0).toUpperCase() + module.slice(1)} settings updated successfully!`);
      fetchAllData();
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save/Create List-Document Modules (facilities, faculty, events, notices)
  const handleListItemSubmit = async (e, module, method) => {
    e.preventDefault();
    setLoading(true);
    setAlertError('');
    setAlertSuccess('');

    try {
      let payload;
      let formFields = {};
      if (module === 'facilities') formFields = facilityForm;
      if (module === 'faculty') formFields = facultyForm;
      if (module === 'events') formFields = eventForm;
      if (module === 'notices') formFields = noticeForm;

      // Pack payload
      const formData = new FormData();
      Object.keys(formFields).forEach(key => {
        formData.append(key, formFields[key]);
      });
      if (tempFile) {
        formData.append(module === 'notices' ? 'fileUrl' : 'photo', tempFile);
      }
      if (method === 'PUT' && editingItem) {
        formData.append('id', editingItem._id);
      }

      const res = await fetch(`/api/cms/${module}`, {
        method: method,
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Operation failed');

      showSuccess(`${module.slice(0, -1)} entry saved successfully!`);
      // Reset forms
      setIsCreating(false);
      setEditingItem(null);
      setTempFile(null);
      setFacilityForm({ name: '', description: '', iconName: 'Award' });
      setFacultyForm({ name: '', designation: '', order: 0 });
      setEventForm({ title: '', description: '', date: '' });
      setNoticeForm({ title: '', description: '', date: '' });
      fetchAllData();
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete List Item (facilities, faculty, events, notices, gallery)
  const handleDeleteListItem = async (module, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/${module}?id=${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete item');

      showSuccess('Item deleted successfully!');
      fetchAllData();
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Direct Gallery Image Upload Handler
  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/cms/gallery', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to upload gallery image');

      showSuccess('Gallery photo uploaded successfully!');
      fetchAllData();
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sidebar Menu Items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'school', label: 'School Info', icon: Info },
    { id: 'hero', label: 'Hero Banner', icon: ImageIcon },
    { id: 'about', label: 'About School', icon: BookOpen },
    { id: 'principal', label: 'Principal Message', icon: Users },
    { id: 'facilities', label: 'Facilities', icon: Award },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'notice-board', label: 'Notice Board', icon: FileText },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  if (loading && !authenticatedUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-[#0B3C5D] font-bold text-sm">Validating administration session...</p>
      </div>
    );
  }

  return (
    <div className="erp-container grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
      {/* SIDEBAR MENU */}
      <aside className="erp-sidebar bg-[#0B3C5D] text-white flex flex-col justify-between py-6">
        <div className="flex flex-col">
          <div className="erp-user-profile px-6 pb-5 border-b border-white/10 mb-5 flex flex-col">
            <span className="erp-user-name text-sm font-semibold">{authenticatedUser.toUpperCase()}</span>
            <span className="erp-user-role text-[10px] text-[#D9B310] uppercase font-bold mt-0.5 tracking-wider">CMS Admin</span>
          </div>

          <ul className="erp-nav-menu list-none flex flex-col gap-0.5 max-h-[70vh] overflow-y-auto">
            {sidebarItems.map((item) => {
              const IconComp = item.icon;
              return (
                <li key={item.id} className={`erp-nav-item ${activeTab === item.id ? 'active bg-[#072b43] border-l-4 border-l-[#D9B310]' : ''}`}>
                  <button onClick={() => { setActiveTab(item.id); setAlertError(''); setAlertSuccess(''); setIsCreating(false); setEditingItem(null); }} className="flex items-center gap-3 px-6 py-3.5 text-slate-300 hover:text-white transition-all text-xs font-semibold">
                    <IconComp size={16} /> {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="erp-logout-wrapper px-6 pt-5 border-t border-white/10">
          <button onClick={handleLogout} className="btn-sidebar-logout w-full flex items-center justify-center gap-2 bg-white/10 py-2.5 rounded text-xs hover:bg-[#C62828] text-white transition-all font-semibold">
            <LogOut size={14} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <main className="erp-workspace bg-[#F8FAFC] p-8 overflow-y-auto h-screen">
        {/* Alerts banner */}
        {alertError && (
          <div className="bg-red-50 text-red-800 p-4 rounded border border-red-200 text-xs flex items-start gap-2.5 mb-6">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
            <span>{alertError}</span>
          </div>
        )}
        {alertSuccess && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded border border-emerald-200 text-xs flex items-start gap-2.5 mb-6">
            <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={16} />
            <span>{alertSuccess}</span>
          </div>
        )}

        {/* ==================== PANEL 1: DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="erp-header-section border-b border-slate-200 pb-4 mb-6 flex justify-between items-center">
              <h2 className="erp-page-title font-serif text-[#0B3C5D] text-2xl font-bold flex items-center gap-2">
                <LayoutDashboard size={24} /> CMS Overview Dashboard
              </h2>
            </div>
            
            <div className="kpi-grid grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="kpi-card bg-white p-5 rounded-lg border-l-4 border-l-[#328CC1] flex items-center gap-4 shadow-sm">
                <div className="bg-[#328CC1] text-white p-3 rounded"><Award size={20} /></div>
                <div className="flex flex-col">
                  <span className="kpi-value text-2xl font-bold">{facilities.length}</span>
                  <span className="kpi-label text-[10px] text-slate-500 uppercase font-semibold">Facilities</span>
                </div>
              </div>
              <div className="kpi-card bg-white p-5 rounded-lg border-l-4 border-l-[#D9B310] flex items-center gap-4 shadow-sm">
                <div className="bg-[#D9B310] text-[#1D2731] p-3 rounded"><Users size={20} /></div>
                <div className="flex flex-col">
                  <span className="kpi-value text-2xl font-bold">{faculty.length}</span>
                  <span className="kpi-label text-[10px] text-slate-500 uppercase font-semibold">Teachers</span>
                </div>
              </div>
              <div className="kpi-card bg-white p-5 rounded-lg border-l-4 border-l-[#2E7D32] flex items-center gap-4 shadow-sm">
                <div className="bg-[#2E7D32] text-white p-3 rounded"><ImageIcon size={20} /></div>
                <div className="flex flex-col">
                  <span className="kpi-value text-2xl font-bold">{gallery.length}</span>
                  <span className="kpi-label text-[10px] text-slate-500 uppercase font-semibold">Gallery Photos</span>
                </div>
              </div>
              <div className="kpi-card bg-white p-5 rounded-lg border-l-4 border-l-[#C62828] flex items-center gap-4 shadow-sm">
                <div className="bg-[#C62828] text-white p-3 rounded"><FileText size={20} /></div>
                <div className="flex flex-col">
                  <span className="kpi-value text-2xl font-bold">{notices.length}</span>
                  <span className="kpi-label text-[10px] text-slate-500 uppercase font-semibold">Circular notices</span>
                </div>
              </div>
            </div>

            <div className="erp-card bg-white p-6 rounded border border-slate-200 shadow-sm">
              <h3 className="text-[#0B3C5D] font-bold text-base mb-3 border-b border-slate-100 pb-2">CMS Instructions Guide</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Welcome to <strong>Involynk EduCMS</strong>. This content management panel allows you to customize all public website contents, titles, principal messages, images, and contact detail parameters dynamically.
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-500 flex flex-col gap-1.5 leading-relaxed">
                <li>To modify main headings, logo, or principal text, navigate to the specific module sidebar section and click <strong>Save Settings</strong>.</li>
                <li>To manage events, notice timelines, or teachers, use the respective list sections to <strong>Add New</strong>, <strong>Edit</strong>, or <strong>Delete</strong> records.</li>
                <li>All changes save instantly to MongoDB and are visible immediately on the public website pages after reloading.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== PANEL 2: SCHOOL INFO ==================== */}
        {activeTab === 'school' && (
          <div className="erp-card">
            <h3 className="erp-card-title"><Info size={18} /> Edit School Information</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveSingleDocModule('school', schoolInfo, { logo: logoFile });
            }} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">School Name</label>
                <input 
                  type="text" 
                  value={schoolInfo.name || ''} 
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                  placeholder="Enter School Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-slate-500">Logo Image Upload</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                  />
                  {schoolInfo.logo && (
                    <span className="text-[10px] text-slate-400 mt-1">Current file: {schoolInfo.logo}</span>
                  )}
                </div>
                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-slate-500">Phone Number</label>
                  <input 
                    type="text" 
                    value={schoolInfo.phone || ''} 
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Email Address</label>
                <input 
                  type="email" 
                  value={schoolInfo.email || ''} 
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                />
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">School Address</label>
                <textarea 
                  rows="3" 
                  value={schoolInfo.address || ''} 
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-blue-primary self-start px-6 py-2.5">
                <Save size={14} /> Save School Info Settings
              </button>
            </form>
          </div>
        )}

        {/* ==================== PANEL 3: HERO ==================== */}
        {activeTab === 'hero' && (
          <div className="erp-card">
            <h3 className="erp-card-title"><ImageIcon size={18} /> Edit Homepage Hero Section</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveSingleDocModule('hero', hero, { image: heroFile });
            }} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Hero Main Title</label>
                <input 
                  type="text" 
                  value={hero.title || ''} 
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                />
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Hero Subtitle / Tagline</label>
                <textarea 
                  rows="2" 
                  value={hero.subtitle || ''} 
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Admission Open Banner Text</label>
                <input 
                  type="text" 
                  value={hero.admissionText || ''} 
                  onChange={(e) => setHero({ ...hero, admissionText: e.target.value })}
                />
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Hero Cover Photo Upload</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setHeroFile(e.target.files[0])}
                />
                {hero.image && (
                  <span className="text-[10px] text-slate-400 mt-1">Current file: {hero.image}</span>
                )}
              </div>

              <button type="submit" className="btn-blue-primary self-start px-6 py-2.5">
                <Save size={14} /> Save Hero Section
              </button>
            </form>
          </div>
        )}

        {/* ==================== PANEL 4: ABOUT ==================== */}
        {activeTab === 'about' && (
          <div className="erp-card">
            <h3 className="erp-card-title"><BookOpen size={18} /> Edit About School Content</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveSingleDocModule('about', about);
            }} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">About Paragraph Info</label>
                <textarea 
                  rows="6" 
                  value={about.aboutText || ''} 
                  onChange={(e) => setAbout({ ...about, aboutText: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Vision Statement</label>
                <textarea 
                  rows="3" 
                  value={about.vision || ''} 
                  onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Mission Statement</label>
                <textarea 
                  rows="3" 
                  value={about.mission || ''} 
                  onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-blue-primary self-start px-6 py-2.5">
                <Save size={14} /> Save About School Details
              </button>
            </form>
          </div>
        )}

        {/* ==================== PANEL 5: PRINCIPAL ==================== */}
        {activeTab === 'principal' && (
          <div className="erp-card">
            <h3 className="erp-card-title"><Users size={18} /> Edit Principal Profile Desk</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveSingleDocModule('principal', principal, { photo: principalFile });
            }} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Principal Full Name</label>
                <input 
                  type="text" 
                  value={principal.name || ''} 
                  onChange={(e) => setPrincipal({ ...principal, name: e.target.value })}
                />
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Principal Photo Upload</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setPrincipalFile(e.target.files[0])}
                />
                {principal.photo && (
                  <span className="text-[10px] text-slate-400 mt-1">Current file: {principal.photo}</span>
                )}
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Principal Message Text</label>
                <textarea 
                  rows="6" 
                  value={principal.message || ''} 
                  onChange={(e) => setPrincipal({ ...principal, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-blue-primary self-start px-6 py-2.5">
                <Save size={14} /> Save Principal message
              </button>
            </form>
          </div>
        )}

        {/* ==================== PANEL 6: FACILITIES ==================== */}
        {activeTab === 'facilities' && (
          <div>
            <div className="erp-header-section flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="erp-page-title font-serif text-[#0B3C5D] text-lg font-bold flex items-center gap-2">
                <Award size={20} /> Campus Facilities Manager
              </h2>
              {!isCreating && !editingItem && (
                <button onClick={() => setIsCreating(true)} className="btn-gold text-xs flex items-center gap-1.5 px-4 py-2">
                  <Plus size={14} /> Add Facility Card
                </button>
              )}
            </div>

            {/* Form to Create or Edit */}
            {(isCreating || editingItem) && (
              <div className="erp-card">
                <h4 className="text-xs uppercase font-bold text-[#0B3C5D] tracking-wider mb-4">
                  {isCreating ? 'Create New Facility card' : 'Edit Facility card'}
                </h4>
                <form onSubmit={(e) => handleListItemSubmit(e, 'facilities', isCreating ? 'POST' : 'PUT')} className="flex flex-col gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Facility Name *</label>
                    <input 
                      type="text" 
                      required
                      value={facilityForm.name}
                      onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">Bullet Icon Accent *</label>
                      <select 
                        value={facilityForm.iconName}
                        onChange={(e) => setFacilityForm({ ...facilityForm, iconName: e.target.value })}
                      >
                        <option value="Award">Award Badge</option>
                        <option value="Cpu">CPU Microchip</option>
                        <option value="BookOpen">Open Book</option>
                        <option value="Tv">TV Smartscreen</option>
                        <option value="Trophy">Winner Trophy</option>
                        <option value="Palette">Art Palette</option>
                        <option value="Heart">Health Heart</option>
                        <option value="GraduationCap">Graduation Cap</option>
                      </select>
                    </div>

                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">Optional Card Photo Upload</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setTempFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Brief Description *</label>
                    <textarea 
                      rows="3" 
                      required
                      value={facilityForm.description}
                      onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-blue-primary px-5 py-2">
                      <Save size={14} /> Save Item
                    </button>
                    <button type="button" onClick={() => { setIsCreating(false); setEditingItem(null); setTempFile(null); }} className="btn-gold bg-slate-200 text-slate-800 hover:bg-slate-300 px-5 py-2">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of existing facilities */}
            {!isCreating && !editingItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facilities.map((fac) => (
                  <div key={fac._id} className="bg-white border border-slate-200 p-5 rounded flex justify-between items-start shadow-sm">
                    <div className="flex flex-col gap-1">
                      <strong className="text-[#0B3C5D] text-sm flex items-center gap-1.5">
                        <Award size={14} /> {fac.name}
                      </strong>
                      <span className="text-[10px] text-[#D9B310] font-bold uppercase tracking-wider">Icon: {fac.iconName}</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{fac.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(fac); setFacilityForm({ name: fac.name, description: fac.description, iconName: fac.iconName }); }} className="action-btn-sm bg-slate-100 text-slate-700 hover:bg-slate-200" title="Edit">
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDeleteListItem('facilities', fac._id)} className="action-btn-sm action-btn-delete" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== PANEL 7: ACADEMICS ==================== */}
        {activeTab === 'academics' && (
          <div className="erp-card">
            <h3 className="erp-card-title"><GraduationCap size={18} /> Edit Academics Page Content</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveSingleDocModule('academics', academics);
            }} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Pre-Primary Content (Preschool / Nursery)</label>
                <textarea 
                  rows="3" 
                  value={academics.prePrimaryContent || ''} 
                  onChange={(e) => setAcademics({ ...academics, prePrimaryContent: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Primary Section Content (Class 1 to 8)</label>
                <textarea 
                  rows="3" 
                  value={academics.primaryContent || ''} 
                  onChange={(e) => setAcademics({ ...academics, primaryContent: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">High School Content (Class 9 & 10)</label>
                <textarea 
                  rows="3" 
                  value={academics.highSchoolContent || ''} 
                  onChange={(e) => setAcademics({ ...academics, highSchoolContent: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">PU College Content (Class 11 & 12)</label>
                <textarea 
                  rows="3" 
                  value={academics.puCollegeContent || ''} 
                  onChange={(e) => setAcademics({ ...academics, puCollegeContent: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-blue-primary self-start px-6 py-2.5">
                <Save size={14} /> Save Academics Content
              </button>
            </form>
          </div>
        )}

        {/* ==================== PANEL 8: FACULTY ==================== */}
        {activeTab === 'faculty' && (
          <div>
            <div className="erp-header-section flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="erp-page-title font-serif text-[#0B3C5D] text-lg font-bold flex items-center gap-2">
                <Users size={20} /> Faculty Directory Manager
              </h2>
              {!isCreating && !editingItem && (
                <button onClick={() => setIsCreating(true)} className="btn-gold text-xs flex items-center gap-1.5 px-4 py-2">
                  <Plus size={14} /> Add Faculty Member
                </button>
              )}
            </div>

            {/* Add or Edit form */}
            {(isCreating || editingItem) && (
              <div className="erp-card">
                <h4 className="text-xs uppercase font-bold text-[#0B3C5D] tracking-wider mb-4">
                  {isCreating ? 'Create Faculty Member Profile' : 'Edit Faculty Member'}
                </h4>
                <form onSubmit={(e) => handleListItemSubmit(e, 'faculty', isCreating ? 'POST' : 'PUT')} className="flex flex-col gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Faculty Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">Designation (e.g. Principal, Chemistry Teacher) *</label>
                      <input 
                        type="text" 
                        required
                        value={facultyForm.designation}
                        onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                      />
                    </div>

                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">Sort Order Weight *</label>
                      <input 
                        type="number" 
                        required
                        value={facultyForm.order}
                        onChange={(e) => setFacultyForm({ ...facultyForm, order: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Faculty Photo Upload</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setTempFile(e.target.files[0])}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-blue-primary px-5 py-2">
                      <Save size={14} /> Save Profile
                    </button>
                    <button type="button" onClick={() => { setIsCreating(false); setEditingItem(null); setTempFile(null); }} className="btn-gold bg-slate-200 text-slate-800 hover:bg-slate-300 px-5 py-2">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Directory Roster */}
            {!isCreating && !editingItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {faculty.map((member) => (
                  <div key={member._id} className="bg-white border border-slate-200 p-4 rounded flex items-center justify-between shadow-sm gap-4">
                    <div className="flex items-center gap-3 truncate">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover border flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 border rounded-full flex items-center justify-center text-slate-400 flex-shrink-0">
                          <Users size={16} />
                        </div>
                      )}
                      <div className="flex flex-col truncate">
                        <strong className="text-[#0B3C5D] text-xs truncate">{member.name}</strong>
                        <span className="text-[10px] text-slate-500 truncate">{member.designation}</span>
                        <span className="text-[9px] text-[#D9B310] font-bold mt-0.5">Order weight: {member.order}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditingItem(member); setFacultyForm({ name: member.name, designation: member.designation, order: member.order }); }} className="action-btn-sm bg-slate-100 text-slate-700 hover:bg-slate-200" title="Edit">
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDeleteListItem('faculty', member._id)} className="action-btn-sm action-btn-delete" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== PANEL 9: GALLERY ==================== */}
        {activeTab === 'gallery' && (
          <div>
            <div className="erp-header-section flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="erp-page-title font-serif text-[#0B3C5D] text-lg font-bold flex items-center gap-2">
                <ImageIcon size={20} /> Media Gallery Manager
              </h2>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  id="gallery-file-input"
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
                <label 
                  htmlFor="gallery-file-input"
                  className="btn-gold text-xs flex items-center gap-1.5 px-4 py-2.5 cursor-pointer hover:bg-[#bda00d] select-none"
                >
                  <Upload size={14} /> Upload Image
                </label>
              </div>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((photo) => (
                <div key={photo._id} className="relative group rounded-lg overflow-hidden border border-slate-200 h-36 bg-slate-100">
                  <img src={photo.image} alt="Gallery item" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      onClick={() => handleDeleteListItem('gallery', photo._id)}
                      className="bg-[#C62828] text-white p-2 rounded-full hover:bg-red-800 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PANEL 10: EVENTS ==================== */}
        {activeTab === 'events' && (
          <div>
            <div className="erp-header-section flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="erp-page-title font-serif text-[#0B3C5D] text-lg font-bold flex items-center gap-2">
                <Calendar size={20} /> School Events Planner
              </h2>
              {!isCreating && !editingItem && (
                <button onClick={() => setIsCreating(true)} className="btn-gold text-xs flex items-center gap-1.5 px-4 py-2">
                  <Plus size={14} /> Add Calendar Event
                </button>
              )}
            </div>

            {/* Add or Edit form */}
            {(isCreating || editingItem) && (
              <div className="erp-card">
                <h4 className="text-xs uppercase font-bold text-[#0B3C5D] tracking-wider mb-4">
                  {isCreating ? 'Create New Event' : 'Edit Event Details'}
                </h4>
                <form onSubmit={(e) => handleListItemSubmit(e, 'events', isCreating ? 'POST' : 'PUT')} className="flex flex-col gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Event Title *</label>
                    <input 
                      type="text" 
                      required
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">Event Date *</label>
                      <input 
                        type="date" 
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      />
                    </div>

                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">Optional Cover Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setTempFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Event Description *</label>
                    <textarea 
                      rows="4" 
                      required
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-blue-primary px-5 py-2">
                      <Save size={14} /> Save Event
                    </button>
                    <button type="button" onClick={() => { setIsCreating(false); setEditingItem(null); setTempFile(null); }} className="btn-gold bg-slate-200 text-slate-800 hover:bg-slate-300 px-5 py-2">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List existing */}
            {!isCreating && !editingItem && (
              <div className="flex flex-col gap-4">
                {events.map((evt) => (
                  <div key={evt._id} className="bg-white border border-slate-200 p-5 rounded flex justify-between items-center shadow-sm gap-4">
                    <div className="flex flex-col gap-1">
                      <strong className="text-[#0B3C5D] text-sm">{evt.title}</strong>
                      <span className="text-[10px] text-[#D9B310] font-bold">Scheduled: {evt.date}</span>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{evt.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingItem(evt); setEventForm({ title: evt.title, description: evt.description, date: evt.date }); }} className="action-btn-sm bg-slate-100 text-slate-700 hover:bg-slate-200" title="Edit">
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDeleteListItem('events', evt._id)} className="action-btn-sm action-btn-delete" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== PANEL 11: NOTICE BOARD ==================== */}
        {activeTab === 'notice-board' && (
          <div>
            <div className="erp-header-section flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="erp-page-title font-serif text-[#0B3C5D] text-lg font-bold flex items-center gap-2">
                <FileText size={20} /> Notice Board Manager
              </h2>
              {!isCreating && !editingItem && (
                <button onClick={() => setIsCreating(true)} className="btn-gold text-xs flex items-center gap-1.5 px-4 py-2">
                  <Plus size={14} /> Broadcast Notice
                </button>
              )}
            </div>

            {/* Add or Edit form */}
            {(isCreating || editingItem) && (
              <div className="erp-card">
                <h4 className="text-xs uppercase font-bold text-[#0B3C5D] tracking-wider mb-4">
                  {isCreating ? 'Broadcast Announcement Notice' : 'Edit Published Notice'}
                </h4>
                <form onSubmit={(e) => handleListItemSubmit(e, 'notices', isCreating ? 'POST' : 'PUT')} className="flex flex-col gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Notice Title *</label>
                    <input 
                      type="text" 
                      required
                      value={noticeForm.title}
                      onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">Publish Date *</label>
                      <input 
                        type="date" 
                        required
                        value={noticeForm.date}
                        onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                      />
                    </div>

                    <div className="form-group flex flex-col gap-1">
                      <label className="form-label text-xs font-semibold text-slate-500">PDF Attachment Circular</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => setTempFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-slate-500">Notice Description *</label>
                    <textarea 
                      rows="4" 
                      required
                      value={noticeForm.description}
                      onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-blue-primary px-5 py-2">
                      <Save size={14} /> Broadcast Notice
                    </button>
                    <button type="button" onClick={() => { setIsCreating(false); setEditingItem(null); setTempFile(null); }} className="btn-gold bg-slate-200 text-slate-800 hover:bg-slate-300 px-5 py-2">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List existing */}
            {!isCreating && !editingItem && (
              <div className="flex flex-col gap-4">
                {notices.map((not) => (
                  <div key={not._id} className="bg-white border border-slate-200 p-5 rounded flex justify-between items-center shadow-sm gap-4">
                    <div className="flex flex-col gap-1">
                      <strong className="text-[#0B3C5D] text-sm">{not.title}</strong>
                      <span className="text-[10px] text-[#328CC1] font-bold">Published: {not.date}</span>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{not.description}</p>
                      {not.fileUrl && (
                        <span className="text-[10px] text-slate-400 mt-1">Attachment: {not.fileUrl}</span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingItem(not); setNoticeForm({ title: not.title, description: not.description, date: not.date }); }} className="action-btn-sm bg-slate-100 text-slate-700 hover:bg-slate-200" title="Edit">
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDeleteListItem('notices', not._id)} className="action-btn-sm action-btn-delete" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== PANEL 12: CONTACT ==================== */}
        {activeTab === 'contact' && (
          <div className="erp-card">
            <h3 className="erp-card-title"><Phone size={18} /> Edit Contact Coordinate Information</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveSingleDocModule('contact', contact);
            }} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Contact Office Address</label>
                <textarea 
                  rows="3" 
                  value={contact.address || ''} 
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-slate-500">Phone Number Text</label>
                  <input 
                    type="text" 
                    value={contact.phone || ''} 
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  />
                </div>

                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    value={contact.email || ''} 
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-xs font-semibold text-slate-500">Google Maps Embed Link (Src attribute only)</label>
                <textarea 
                  rows="3" 
                  value={contact.mapLink || ''} 
                  onChange={(e) => setContact({ ...contact, mapLink: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                ></textarea>
              </div>

              <button type="submit" className="btn-blue-primary self-start px-6 py-2.5">
                <Save size={14} /> Save Contact Coordinates
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
