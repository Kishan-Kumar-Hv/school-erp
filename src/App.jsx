import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Carousel from './components/Carousel';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';

// Lucide icons
import { 
  BookOpen, Calendar, MapPin, Phone, Mail, Award, Clock, ArrowRight,
  Shield, User, Users, GraduationCap, Lock, Heart, HelpCircle,
  MessageSquare, Cpu, Tv, Palette, Trophy, Check
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [userRole, setUserRole] = useState(null); // 'Admin', 'Teacher', 'Parent'
  const [loggedInParentId, setLoggedInParentId] = useState(''); // Stores logged-in Parent's Student ID
  
  // Standalone dashboard view state (loaded via URL query params)
  const [isUrlLoadedRole, setIsUrlLoadedRole] = useState(false);

  // Login fields
  const [selectedRole, setSelectedRole] = useState('Parent');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStudentId, setLoginStudentId] = useState('');
  const [loginError, setLoginError] = useState('');

  // Global fetched records
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [enquiryForm, setEnquiryForm] = useState({ studentName: '', parentName: '', grade: 'Preschool', phone: '', email: '', desc: '' });
  const [enquirySuccess, setEnquirySuccess] = useState('');

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am the Holy Cross Virtual Assistant. Ask me anything about admissions, timings, locations, or facilities.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const fetchGlobalData = async () => {
    try {
      const resStud = await fetch('/api/students');
      const dataStud = await resStud.json();
      setStudents(dataStud);

      const resAnn = await fetch('/api/announcements');
      const dataAnn = await resAnn.json();
      setAnnouncements(dataAnn);
    } catch (err) {
      console.error("Error communicating with SQLite API:", err);
    }
  };

  useEffect(() => {
    fetchGlobalData();
    
    // Parse query parameters for standalone dashboard rendering in new tabs
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    const studentId = params.get('studentId');
    
    if (role) {
      setUserRole(role);
      setIsUrlLoadedRole(true);
      if (role === 'Parent' && studentId) {
        setLoggedInParentId(studentId);
        setActivePage('erp-parent');
      } else if (role === 'Admin') {
        setActivePage('erp-admin');
      } else if (role === 'Teacher') {
        setActivePage('erp-teacher');
      }
    }
  }, []);

  const handleLogout = () => {
    setUserRole(null);
    setLoggedInParentId('');
    setLoginUsername('');
    setLoginPassword('');
    setLoginStudentId('');
    setLoginError('');
    // If loaded via URL query parameters, redirect to homepage root (clears URL params)
    if (isUrlLoadedRole) {
      window.location.href = window.location.origin;
    } else {
      setActivePage('home');
    }
  };

  // Process ERP Login and Open in a New Tab
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (selectedRole === 'Admin') {
      if (loginUsername === 'admin' && loginPassword === 'admin123') {
        window.open('/?role=Admin', '_blank');
      } else {
        setLoginError('Invalid Administrator username or password (use admin / admin123).');
      }
    } else if (selectedRole === 'Teacher') {
      if (loginUsername === 'teacher' && loginPassword === 'teacher123') {
        window.open('/?role=Teacher', '_blank');
      } else {
        setLoginError('Invalid Teacher credentials (use teacher / teacher123).');
      }
    } else if (selectedRole === 'Parent') {
      const studIdUpper = loginStudentId.trim().toUpperCase();
      const studentExists = students.find(s => s.id.toUpperCase() === studIdUpper);
      if (studentExists) {
        window.open(`/?role=Parent&studentId=${studentExists.id}`, '_blank');
      } else {
        setLoginError(`Student Enrollment ID "${loginStudentId}" not found in database (use HC-2026-0812 for Rohit).`);
      }
    }
  };

  // Chatbot Query processing
  const handleChatQuery = (text) => {
    const newMsgs = [...chatMessages, { sender: 'user', text }];
    setChatMessages(newMsgs);
    
    setTimeout(() => {
      let reply = "I'm not sure about that. Please contact our school office at +91-8172-268333 for assistance.";
      const t = text.toLowerCase();
      
      if (t.includes('admission') || t.includes('apply') || t.includes('enquiry')) {
        reply = "Admissions for the year 2026-27 are open. To apply, fill out the Enquiry Form in our 'Contact & Admissions' tab, or visit our office.";
      } else if (t.includes('hour') || t.includes('time') || t.includes('timing') || t.includes('saturday')) {
        reply = "School hours are Monday to Friday: 8:30 AM to 4:00 PM, and Saturday: 8:30 AM to 1:00 PM.";
      } else if (t.includes('phone') || t.includes('contact') || t.includes('call') || t.includes('email') || t.includes('number')) {
        reply = "You can call us at +91-8172-268333 or email info@holycrossschoolhassan.org. Office hours apply.";
      } else if (t.includes('map') || t.includes('address') || t.includes('location') || t.includes('where')) {
        reply = "We are located on Salagame Road, Hemavathi Nagar, Hassan, Karnataka - 573202. There is a Google Map at the bottom of our home page for reference.";
      } else if (t.includes('sport') || t.includes('activity') || t.includes('coding') || t.includes('extracurricular') || t.includes('pottery') || t.includes('drama')) {
        reply = "We offer physical sports (athletics, football), coding/STEM activities, clay pottery modules, and drama theater programs.";
      } else if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
        reply = "Hello! How can I assist you with Holy Cross Sisters School details today?";
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput('');
    handleChatQuery(txt);
  };

  // Submit Admission Enquiry Form
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryForm.studentName || !enquiryForm.parentName || !enquiryForm.phone) {
      setEnquirySuccess("Please fill out required fields (Student Name, Parent Name, Mobile).");
      return;
    }
    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryForm)
      });
      if (response.ok) {
        setEnquirySuccess(`Enquiry submitted successfully for ${enquiryForm.studentName}! Our office team will call you shortly.`);
        setEnquiryForm({ studentName: '', parentName: '', grade: 'Preschool', phone: '', email: '', desc: '' });
      } else {
        setEnquirySuccess("Failed to submit enquiry. Try again later.");
      }
    } catch (err) {
      setEnquirySuccess("Error connecting to Express server.");
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Header - Hide if loaded in standalone new tab dashboard */}
      {!isUrlLoadedRole && (
        <Header 
          activePage={activePage} 
          setActivePage={setActivePage} 
          userRole={userRole} 
          onLogout={handleLogout} 
          announcements={announcements} 
        />
      )}

      {/* Main Pages Router */}
      <div className="main-content">

        {/* ==================== 1. HOME PAGE ==================== */}
        {activePage === 'home' && (
          <div>
            <Carousel />

            <div className="home-section-grid">
              {/* Left Column: Welcome & Info */}
              <div>
                <div className="content-card">
                  <h2 className="card-title"><GraduationCap size={20} /> Empowering Future Generations</h2>
                  <p style={{ marginBottom: '15px', color: '#475569', fontSize: '15px' }}>
                    Holy Cross Sisters School, Hassan, founded in 1978 and managed by the Sisters of Mercy, is dedicated to providing high-quality, value-based education. Located in Hemavathi Nagar, Hassan, our school caters to pupils from Preschool through High School.
                  </p>
                  <p style={{ color: '#475569', fontSize: '15px' }}>
                    Our school promotes academic excellence, creative arts, physical strength, and technological awareness. We offer students a safe environment where they can discover their unique abilities and acquire the skills needed for tomorrow.
                  </p>
                </div>

                <div className="content-card">
                  <h2 className="card-title"><Award size={20} /> Educational Methodology</h2>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '15px' }}>
                    We follow the State syllabus curriculum, enhancing textbook studies with practical science lab experiments, library research hours, and computer literacy courses from early classes.
                  </p>
                  <div className="premium-card-grid">
                    <div className="premium-feature-card gold-border">
                      <div className="premium-icon-box gold-accent">
                        <Shield size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">Value Education</strong>
                        <span className="premium-card-desc">Focus on ethics, kindness, and civil responsibility.</span>
                      </div>
                    </div>
                    <div className="premium-feature-card gold-border">
                      <div className="premium-icon-box gold-accent">
                        <Cpu size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">STEM Focus</strong>
                        <span className="premium-card-desc">Regular computer programming exercises and mathematics quiz clubs.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="content-card">
                  <h2 className="card-title"><BookOpen size={20} /> Campus Facilities & Infrastructure</h2>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '15px' }}>
                    Holy Cross Sisters School is equipped with modern academic amenities designed to facilitate active learning, scientific inquiry, and creative development:
                  </p>
                  
                  <div className="premium-card-grid">
                    <div className="premium-feature-card">
                      <div className="premium-icon-box">
                        <Award size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">Composite Science Lab</strong>
                        <span className="premium-card-desc">Equipped with Physics, Chemistry, and Biology apparatus for practical inquiry.</span>
                      </div>
                    </div>
                    
                    <div className="premium-feature-card">
                      <div className="premium-icon-box">
                        <Cpu size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">STEM Coding Studio</strong>
                        <span className="premium-card-desc">Modern desktops, programming packages, and physical computing kits.</span>
                      </div>
                    </div>

                    <div className="premium-feature-card">
                      <div className="premium-icon-box">
                        <BookOpen size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">Reference Library</strong>
                        <span className="premium-card-desc">Over 5,000 reference educational volumes, novels, and national journals.</span>
                      </div>
                    </div>

                    <div className="premium-feature-card">
                      <div className="premium-icon-box">
                        <Tv size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">Smart Classrooms</strong>
                        <span className="premium-card-desc">High-definition projector layouts and integrated visual media boards.</span>
                      </div>
                    </div>

                    <div className="premium-feature-card">
                      <div className="premium-icon-box">
                        <Trophy size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">Sports Turf Fields</strong>
                        <span className="premium-card-desc">Dedicated football field turf, volleyball courts, and running athletic tracks.</span>
                      </div>
                    </div>

                    <div className="premium-feature-card">
                      <div className="premium-icon-box">
                        <Palette size={18} />
                      </div>
                      <div className="premium-card-text">
                        <strong className="premium-card-title">Arts & Pottery Lab</strong>
                        <span className="premium-card-desc">Professional pottery wheels, watercolor sketchboards, and handicraft desks.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Instant logins & useful sections */}
              <div>
                {/* Instant Login Desk */}
                <div className="content-card" style={{ borderTop: '4px solid var(--accent)' }}>
                  <h2 className="card-title"><Lock size={20} className="text-gold" /> Instant Demo Logins</h2>
                  <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '15px' }}>
                    Click to log in and open the ERP dashboards instantly in a new tab:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                      onClick={() => window.open('/?role=Admin', '_blank')} 
                      className="btn-blue-primary" 
                      style={{ justifyContent: 'center', width: '100%', fontSize: '13px' }}
                    >
                      🔑 Test Office Admin Portal
                    </button>
                    <button 
                      onClick={() => window.open('/?role=Teacher', '_blank')} 
                      className="btn-blue-primary" 
                      style={{ justifyContent: 'center', width: '100%', backgroundColor: 'var(--secondary)', fontSize: '13px' }}
                    >
                      🔑 Test Teacher Portal
                    </button>
                    <button 
                      onClick={() => window.open('/?role=Parent&studentId=HC-2026-0812', '_blank')} 
                      className="btn-gold" 
                      style={{ justifyContent: 'center', width: '100%', fontSize: '13px' }}
                    >
                      🔑 Test Parent Portal (Rohit)
                    </button>
                  </div>
                </div>

                <div className="admission-banner">
                  <h3 className="admission-banner-title">Admissions Open 2026-27</h3>
                  <p className="admission-banner-desc">Enrol your child in Hassan's premier institution for academic success.</p>
                  <button onClick={() => setActivePage('contact')} className="btn-gold">
                    Enquire Now <ArrowRight size={14} />
                  </button>
                </div>

                <div className="content-card">
                  <h2 className="card-title card-title-gold"><Calendar size={20} /> Latest Circulars</h2>
                  <ul className="notice-board-list">
                    {announcements.slice(0, 2).map(ann => (
                      <li key={ann.id} className="notice-board-item">
                        <div className="notice-date">{ann.date}</div>
                        <div className="notice-title-text">{ann.title}</div>
                        <p className="notice-desc-text">{ann.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* MCE-Style Departments (Academic Stages) */}
            <div className="departments-title-section">
              <h2 className="text-serif text-blue" style={{ fontSize: '28px' }}>ACADEMIC SECTIONS</h2>
              <p style={{ color: '#64748B', maxWidth: '600px', margin: '8px auto 0', fontSize: '14px' }}>
                We structure our learning path specifically around the developmental stages of children.
              </p>
            </div>
            
            <div className="departments-grid">
              <div className="dept-card">
                <div className="dept-icon-wrapper"><Heart size={28} /></div>
                <h3 className="dept-name">Preschool / Kindergarten</h3>
                <p className="dept-desc">Learning through play, sensory exploration, and motor skills refinement for LKG & UKG children.</p>
              </div>
              <div className="dept-card">
                <div className="dept-icon-wrapper"><BookOpen size={28} /></div>
                <h3 className="dept-name">Lower Primary (Class 1-5)</h3>
                <p className="dept-desc">Building strong reading habits, basic arithmetic math skills, and social etiquette guidelines.</p>
              </div>
              <div className="dept-card">
                <div className="dept-icon-wrapper"><Award size={28} /></div>
                <h3 className="dept-name">Higher Primary (Class 6-8)</h3>
                <p className="dept-desc">Deepening subject understanding in science labs, environmental studies, and standard grammar.</p>
              </div>
              <div className="dept-card">
                <div className="dept-icon-wrapper"><GraduationCap size={28} /></div>
                <h3 className="dept-name">High School (Class 9-10)</h3>
                <p className="dept-desc">Rigorous preparations for Board Examinations, technical computer codes, and SSLC preparations.</p>
              </div>
            </div>

            {/* HOMEPAGE MAP SECTION (Ensures they don't have to look elsewhere) */}
            <div style={{ padding: '0 5% 50px', maxWidth: '1300px', margin: '0 auto' }}>
              <div className="content-card" style={{ padding: 0, overflow: 'hidden', borderTop: '4px solid var(--primary)' }}>
                <h2 className="card-title" style={{ padding: '20px 24px 10px', marginBottom: 0, borderBottom: 'none' }}>
                  <MapPin size={20} style={{ color: 'var(--primary)', marginRight: '8px', verticalAlign: 'middle' }} /> 
                  School Location GPS Map
                </h2>
                <div style={{ height: '350px', position: 'relative' }}>
                  <iframe 
                    title="School Map Home"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.1643444458315!2d76.10899217592476!3d13.025219913702585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba55146c2459bb5%3A0xe67c9c0f64c67675!2sHoly%20Cross%20Sisters%20School%2C%20Hassan!5e0!3m2!1sen!2sin!4v1718985100000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. ABOUT PAGE ==================== */}
        {activePage === 'about' && (
          <div>
            <div className="page-banner">
              <h1 className="page-title">ABOUT OUR INSTITUTION</h1>
              <div className="page-breadcrumbs">Home &gt; About Us</div>
            </div>

            <div className="page-container">
              <div className="info-grid">
                <div className="info-text-block">
                  <h3>Our Foundations & Mercy Legacy</h3>
                  <p>
                    Holy Cross Sisters School, Hassan, stands as a beacon of academic progress. We operate under the aegis of the Sisters of Mercy, carrying forward a legacy of education designed to empower and nurture the young minds of Hassan.
                  </p>
                  <p>
                    For over four decades, our campus has provided the children of Salagame Road and surrounding areas with excellent infrastructure, well-stocked libraries, modern science laboratories, and high-performance sports environments.
                  </p>
                  <p>
                    We believe in holistic development. Along with scholastic achievement, our students are taught moral values, self-reliance, and compassion for the underprivileged.
                  </p>
                </div>
                <img src="/assets/hero.png" alt="Holy Cross School Frontage" className="info-image" />
              </div>

              <div className="info-grid reverse">
                <div className="info-text-block">
                  <h3>Our Vision & Mission</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '6px', fontSize: '16px' }}>Our Vision</h4>
                    <p style={{ fontStyle: 'italic', fontSize: '14px' }}>
                      "To establish a value-driven center of educational excellence that empowers students with modern skills while keeping them rooted in ethics, service, and love."
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '6px', fontSize: '16px' }}>Our Mission</h4>
                    <p style={{ fontSize: '14px' }}>
                      To provide accessible, top-quality teaching modules; encourage technological literacy; develop sporting spirit; and guide students to become compassionate citizens of our nation.
                    </p>
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--primary)', color: 'var(--white)', padding: '30px 40px', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                  <h4 style={{ color: 'var(--accent)', fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>Core Beliefs</h4>
                  <ul className="premium-list">
                    <li className="premium-list-item">
                      <Check size={16} className="premium-list-icon" />
                      <span className="premium-list-text">Academic Rigor & Critical Reasoning</span>
                    </li>
                    <li className="premium-list-item">
                      <Check size={16} className="premium-list-icon" />
                      <span className="premium-list-text">Technological Skill Acquisition (STEM)</span>
                    </li>
                    <li className="premium-list-item">
                      <Check size={16} className="premium-list-icon" />
                      <span className="premium-list-text">Physical Health & Sportsmanship</span>
                    </li>
                    <li className="premium-list-item">
                      <Check size={16} className="premium-list-icon" />
                      <span className="premium-list-text">Environmental Stewardship</span>
                    </li>
                    <li className="premium-list-item">
                      <Check size={16} className="premium-list-icon" />
                      <span className="premium-list-text">Service to Humanity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. ACADEMICS PAGE ==================== */}
        {activePage === 'academics' && (
          <div>
            <div className="page-banner">
              <h1 className="page-title">ACADEMICS & CURRICULUM</h1>
              <div className="page-breadcrumbs">Home &gt; Academics</div>
            </div>

            <div className="page-container">
              <div className="info-grid">
                <div className="info-text-block">
                  <h3>Board Syllabus & Standards</h3>
                  <p>
                    Our institution follows the State Board curriculum, recognized for its comprehensive focus on science, mathematical logic, and language development.
                  </p>
                  <p>
                    We maintain low teacher-to-student ratios, ensuring personalized academic guidance. Our teachers use modern audio-visual teaching aids to explain complex topics.
                  </p>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '24px', color: 'var(--primary)' }}>100%</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>SSLC Board Pass Rate</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '24px', color: 'var(--primary)' }}>25+</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Experienced Faculty</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '24px', color: 'var(--primary)' }}>15:1</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Student-Teacher Ratio</span>
                    </div>
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--white)', padding: '30px', borderRadius: '8px', borderTop: '4px solid var(--accent)', boxShadow: 'var(--shadow-sm)' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', fontFamily: 'var(--font-serif)', fontSize: '18px' }}>Subject Matrix</h4>
                  <ul className="premium-list">
                    <li className="premium-list-item dark-text">
                      <Check size={16} className="premium-list-icon blue-icon" />
                      <span className="premium-list-text"><strong>Languages:</strong> English (First Language), Kannada, Hindi</span>
                    </li>
                    <li className="premium-list-item dark-text">
                      <Check size={16} className="premium-list-icon blue-icon" />
                      <span className="premium-list-text"><strong>Core Subjects:</strong> Mathematics, General Science, Social Studies</span>
                    </li>
                    <li className="premium-list-item dark-text">
                      <Check size={16} className="premium-list-icon blue-icon" />
                      <span className="premium-list-text"><strong>Practical Labs:</strong> Computer Programming, Chemistry, Physics</span>
                    </li>
                    <li className="premium-list-item dark-text">
                      <Check size={16} className="premium-list-icon blue-icon" />
                      <span className="premium-list-text"><strong>Co-curricular:</strong> Moral Science, Drawing, Physical Education</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Interactive Co-Curricular Programs */}
              <div className="extracurricular-section">
                <h3 className="text-serif text-blue text-center" style={{ fontSize: '24px', marginBottom: '8px' }}>
                  Interactive Co-Curricular Programs
                </h3>
                <p className="text-center" style={{ color: '#64748B', fontSize: '14px', maxWidth: '600px', margin: '0 auto 30px' }}>
                  We believe in building balanced minds. Explore our physical, analytical, and creative programs below.
                </p>

                <div className="activity-grid">
                  <div className="activity-card">
                    <img src="/assets/extracurricular_sports.png" alt="Sports Coaching" className="activity-img" />
                    <div className="activity-info">
                      <h4 className="activity-name">Physical Training & Athletics</h4>
                      <p className="activity-desc">Professional football coaching, athletic sprints, volleyball, and indoor chess rooms.</p>
                    </div>
                  </div>
                  <div className="activity-card">
                    <img src="/assets/extracurricular_coding.png" alt="STEM Coding Labs" className="activity-img" />
                    <div className="activity-info">
                      <h4 className="activity-name">STEM & Coding Club</h4>
                      <p className="activity-desc">Weekly lessons in block coding, web fundamentals, and science experimentation kits.</p>
                    </div>
                  </div>
                  <div className="activity-card">
                    <img src="/assets/extracurricular_art.png" alt="Pottery & Art Studio" className="activity-img" />
                    <div className="activity-info">
                      <h4 className="activity-name">Creative Arts & Pottery</h4>
                      <p className="activity-desc">Unleashing creativity through hands-on pottery wheels, clay modeling, and watercolor art.</p>
                    </div>
                  </div>
                  <div className="activity-card">
                    <img src="/assets/extracurricular_drama.png" alt="Theatre Club" className="activity-img" />
                    <div className="activity-info">
                      <h4 className="activity-name">Performing Arts & Theatre</h4>
                      <p className="activity-desc">Annual theatrical drama plays, public speaking clubs, and classical choral singing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. CONTACT & ADMISSIONS PAGE ==================== */}
        {activePage === 'contact' && (
          <div>
            <div className="page-banner">
              <h1 className="page-title">CONTACT & ADMISSIONS DESK</h1>
              <div className="page-breadcrumbs">Home &gt; Contact Us</div>
            </div>

            <div className="page-container">
              <div className="contact-layout">
                {/* Contact Coordinates & Google Maps */}
                <div>
                  <div className="content-card">
                    <h2 className="card-title"><MapPin size={20} /> Office Location</h2>
                    <ul className="contact-info-list">
                      <li className="contact-info-item">
                        <MapPin className="contact-info-icon" size={18} />
                        <div>
                          <div className="contact-info-label">School Address</div>
                          <div className="contact-info-val">
                            Holy Cross Sisters School, Hemavathi Nagar / Vidyuth Nagar,<br />
                            Salagame Road, Hassan - 573202, Karnataka, India
                          </div>
                        </div>
                      </li>
                      <li className="contact-info-item">
                        <Phone className="contact-info-icon" size={18} />
                        <div>
                          <div className="contact-info-label">Office Contact Numbers</div>
                          <div className="contact-info-val">+91-8172-268333, +91-8172-268555</div>
                        </div>
                      </li>
                      <li className="contact-info-item">
                        <Mail className="contact-info-icon" size={18} />
                        <div>
                          <div className="contact-info-label">Email Communications</div>
                          <div className="contact-info-val">admissions@holycrossschoolhassan.org</div>
                        </div>
                      </li>
                      <li className="contact-info-item">
                        <Clock className="contact-info-icon" size={18} />
                        <div>
                          <div className="contact-info-label">Office Hours</div>
                          <div className="contact-info-val">Monday - Friday: 8:30 AM to 4:00 PM | Saturday: 8:30 AM to 1:00 PM</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Responsive Google Maps Embedded */}
                  <div className="map-container">
                    <iframe 
                      title="Holy Cross Sisters School Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.1643444458315!2d76.10899217592476!3d13.025219913702585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba55146c2459bb5%3A0xe67c9c0f64c67675!2sHoly%20Cross%20Sisters%20School%2C%20Hassan!5e0!3m2!1sen!2sin!4v1718985100000!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>

                {/* Admission Enquiry Form */}
                <div className="content-card">
                  <h2 className="card-title" style={{ borderBottomColor: 'var(--accent)' }}><GraduationCap size={20} /> Admission Enquiry Form</h2>
                  <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                    Submit this enquiry form. Our academic panel will review the request and contact you for interactive admissions assessments.
                  </p>

                  {enquirySuccess && (
                    <div className="badge badge-paid" style={{ padding: '10px 15px', borderRadius: '4px', display: 'block', marginBottom: '20px', fontSize: '13px' }}>
                      {enquirySuccess}
                    </div>
                  )}

                  <form onSubmit={handleEnquirySubmit}>
                    <div className="form-group">
                      <label className="form-label">Student Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Full Name of Child"
                        value={enquiryForm.studentName}
                        onChange={e => setEnquiryForm({...enquiryForm, studentName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent / Guardian Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Guardian Name"
                        value={enquiryForm.parentName}
                        onChange={e => setEnquiryForm({...enquiryForm, parentName: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Desired Class Grade *</label>
                        <select 
                          value={enquiryForm.grade}
                          onChange={e => setEnquiryForm({...enquiryForm, grade: e.target.value})}
                        >
                          <option>Preschool</option>
                          <option>LKG</option>
                          <option>UKG</option>
                          <option>Class 1</option>
                          <option>Class 2</option>
                          <option>Class 3</option>
                          <option>Class 4</option>
                          <option>Class 5</option>
                          <option>Class 6</option>
                          <option>Class 7</option>
                          <option>Class 8</option>
                          <option>Class 9</option>
                          <option>Class 10</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mobile Contact Number *</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="10-digit number"
                          value={enquiryForm.phone}
                          onChange={e => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="Email for communications"
                        value={enquiryForm.email}
                        onChange={e => setEnquiryForm({...enquiryForm, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comments / Background Context</label>
                      <textarea 
                        rows="3" 
                        placeholder="Previous school details, awards, or medical information..."
                        value={enquiryForm.desc}
                        onChange={e => setEnquiryForm({...enquiryForm, desc: e.target.value})}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-blue-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Submit Admission Enquiry
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. ERP PORTAL LOGIN ==================== */}
        {activePage === 'erp' && (
          <div className="erp-login-wrapper">
            <div className="erp-login-card">
              <h2 className="erp-login-title">ERP Administration Portal</h2>
              <p className="erp-login-subtitle">Authenticate to open dashboard in a new tab</p>

              {loginError && (
                <div className="badge badge-pending" style={{ padding: '8px 12px', display: 'block', marginBottom: '15px', borderRadius: '4px', fontSize: '12px' }}>
                  {loginError}
                </div>
              )}

              {/* Role selector switches */}
              <div className="role-switcher-grid">
                <button 
                  onClick={() => { setSelectedRole('Parent'); setLoginError(''); }}
                  className={`role-switch-btn ${selectedRole === 'Parent' ? 'active' : ''}`}
                >
                  <Users size={16} /> Parent
                </button>
                <button 
                  onClick={() => { setSelectedRole('Teacher'); setLoginError(''); }}
                  className={`role-switch-btn ${selectedRole === 'Teacher' ? 'active' : ''}`}
                >
                  <User size={16} /> Teacher
                </button>
                <button 
                  onClick={() => { setSelectedRole('Admin'); setLoginError(''); }}
                  className={`role-switch-btn ${selectedRole === 'Admin' ? 'active' : ''}`}
                >
                  <Shield size={16} /> Admin
                </button>
              </div>

              <form onSubmit={handleLoginSubmit}>
                {selectedRole === 'Parent' ? (
                  <div className="form-group">
                    <label className="form-label">Student Enrollment ID</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. HC-2026-0812" 
                      value={loginStudentId}
                      onChange={e => setLoginStudentId(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Username</label>
                      <input 
                        type="text" 
                        required 
                        placeholder={selectedRole === 'Admin' ? "e.g. admin" : "e.g. teacher"}
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Secret Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="••••••••" 
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                      />
                    </div>
                  </>
                )}
                
                <button type="submit" className="btn-blue-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  Authenticate Access
                </button>
              </form>

              {/* Dynamic login guides */}
              <div className="login-help-text">
                {selectedRole === 'Parent' && "Login Hint: Use HC-2026-0812, HC-2026-0813, or any ID added via Admin Registry."}
                {selectedRole === 'Teacher' && "Login Hint: Use username \"teacher\" and password \"teacher123\"."}
                {selectedRole === 'Admin' && "Login Hint: Use username \"admin\" and password \"admin123\"."}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. ACTIVE ERP DASHBOARD VIEWS ==================== */}
        {activePage === 'erp-admin' && userRole === 'Admin' && (
          <AdminDashboard 
            students={students} 
            announcements={announcements} 
            onRefreshData={fetchGlobalData} 
            onLogout={handleLogout}
          />
        )}

        {activePage === 'erp-teacher' && userRole === 'Teacher' && (
          <TeacherDashboard 
            students={students} 
            onRefreshData={fetchGlobalData} 
            onLogout={handleLogout}
          />
        )}

        {activePage === 'erp-parent' && userRole === 'Parent' && (
          <ParentDashboard 
            studentId={loggedInParentId} 
            students={students} 
            announcements={announcements} 
            onRefreshData={fetchGlobalData} 
            onLogout={handleLogout}
          />
        )}

      </div>

      {/* Floating Call & Action buttons (Only displayed on public pages and non-ERP) */}
      {!isUrlLoadedRole && (
        <div className="action-buttons-fixed print-hide">
          <a href="tel:+918172268333" className="action-btn-circle action-btn-call" title="Call Office Desk">
            <Phone size={20} />
          </a>
          <a href="https://wa.me/918172268333" target="_blank" rel="noopener noreferrer" className="action-btn-circle action-btn-whatsapp" title="WhatsApp Chat">
            <MessageSquare size={20} />
          </a>
          <a href="https://maps.google.com/?q=Holy+Cross+Sisters+School,Hassan,Karnataka" target="_blank" rel="noopener noreferrer" className="action-btn-circle action-btn-directions" title="Get GPS Directions">
            <MapPin size={20} />
          </a>
        </div>
      )}

      {/* FLOATING CHATBOT WIDGET */}
      {!isUrlLoadedRole && (
        <div style={{ position: 'fixed', bottom: '220px', right: '24px', zIndex: 999 }} className="print-hide">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              color: 'var(--dark-slate)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Ask School Assistant"
          >
            <HelpCircle size={24} />
          </button>
          
          {isChatOpen && (
            <div style={{
              position: 'absolute',
              bottom: '60px',
              right: '0',
              width: '330px',
              height: '430px',
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Chat Header */}
              <div style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--white)',
                padding: '14px 16px',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Holy Cross Virtual Assistant</span>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  style={{ background: 'none', color: 'white', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
              
              {/* Messages Body */}
              <div style={{
                flex: 1,
                padding: '15px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#F8FAFC'
              }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--white)',
                    color: msg.sender === 'user' ? 'var(--white)' : 'var(--dark-slate)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    maxWidth: '85%',
                    fontSize: '13px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>
              
              {/* Preset Chips */}
              <div style={{
                padding: '8px 10px',
                backgroundColor: 'var(--white)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}>
                {['Admissions?', 'School Hours?', 'Contact Info?', 'School Map?'].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChatQuery(q)}
                    style={{
                      fontSize: '11px',
                      padding: '5px 12px',
                      backgroundColor: 'rgba(11,60,93,0.06)',
                      color: 'var(--primary)',
                      borderRadius: '15px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
              
              {/* Input Area */}
              <form onSubmit={handleChatSubmit} style={{
                display: 'flex',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--white)'
              }}>
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '12px 15px',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0 18px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--dark-slate)',
                    fontWeight: '600',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Standardized Footer - Hide if loaded in standalone new tab dashboard */}
      {!isUrlLoadedRole && (
        <footer className="footer-wrap print-hide">
          <div className="footer-grid">
            <div>
              <h4 className="footer-col-title">Holy Cross Sisters School</h4>
              <p className="footer-desc">
                Hassan's premier primary & high school institution managed by the Sisters of Mercy. Dedicated to providing qualitative education for terminal success since 1978.
              </p>
              <div style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '13px' }}>
                Affiliated to State Board Curriculum.
              </div>
            </div>
            <div>
              <h4 className="footer-col-title">Quick Portals</h4>
              <ul className="footer-links-list">
                <li><a href="#about" onClick={() => setActivePage('about')}>Our History</a></li>
                <li><a href="#academics" onClick={() => setActivePage('academics')}>Academics & Labs</a></li>
                <li><a href="#contact" onClick={() => setActivePage('contact')}>Enquiry Forms</a></li>
                <li><a href="#erp" onClick={() => { setSelectedRole('Parent'); setActivePage('erp'); }}>Parent Grade Portal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-col-title">Useful Links</h4>
              <ul className="footer-links-list">
                <li><a href="tel:+918172268333">Contact Office</a></li>
                <li><a href="https://maps.google.com/?q=Holy+Cross+Sisters+School,Hassan,Karnataka" target="_blank" rel="noopener noreferrer">GPS Directions</a></li>
                <li><a href="#erp" onClick={() => { setSelectedRole('Teacher'); setActivePage('erp'); }}>Instructor Desk</a></li>
                <li><a href="#erp" onClick={() => { setSelectedRole('Admin'); setActivePage('erp'); }}>Office ERP</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-col-title">Contact Office</h4>
              <ul className="footer-address-list">
                <li>
                  <MapPin className="footer-address-icon" size={15} />
                  <span>Salagame Road, Hemavathi Nagar, Hassan, Karnataka - 573202</span>
                </li>
                <li>
                  <Phone className="footer-address-icon" size={15} />
                  <span>+91-8172-268333, +91-8172-268555</span>
                </li>
                <li>
                  <Mail className="footer-address-icon" size={15} />
                  <span>info@holycrossschoolhassan.org</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              © {new Date().getFullYear()} Holy Cross Sisters School, Hassan. All Rights Reserved.
            </div>
            <div>
              Designed with MCE Hassan Role-Model Aesthetics.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
