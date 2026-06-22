import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2, Megaphone, Receipt, ClipboardList, Database, Check, RefreshCw, BookOpen, LogOut } from 'lucide-react';

export default function AdminDashboard({ students, onRefreshData, announcements, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [fees, setFees] = useState([]);
  const [allClassSubjects, setAllClassSubjects] = useState([]);
  
  // Subject manager class selector
  const [selectedManageClass, setSelectedManageClass] = useState('Class 1');
  const [selectedClassSubjects, setSelectedClassSubjects] = useState([]);
  
  // Forms states
  const [newStudent, setNewStudent] = useState({ id: '', name: '', grade: 'Class 1', parent: '', phone: '' });
  const [feeCollect, setFeeCollect] = useState({ studentId: '', amount: '' });
  const [newNotice, setNewNotice] = useState({ title: '', description: '', category: 'General' });
  
  // Status messages
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // List of all standard subjects for checklist
  const allAvailableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 
    'English', 'Social Studies', 'Kannada', 'Hindi', 
    'Computer Science', 'Physical Education', 'Arts & Craft', 'Moral Science'
  ];

  // Load Admin specific logs, fees, and class subjects
  const fetchAdminDetails = async () => {
    try {
      const resLogs = await fetch('/api/logs');
      const dataLogs = await resLogs.json();
      setLogs(dataLogs);

      const resFees = await fetch('/api/fees');
      const dataFees = await resFees.json();
      setFees(dataFees);

      const resSubjects = await fetch('/api/class-subjects');
      const dataSubjects = await resSubjects.json();
      setAllClassSubjects(dataSubjects);
    } catch (err) {
      console.error("Error fetching admin details:", err);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [students]);

  // Sync checklist when selectedManageClass or allClassSubjects change
  useEffect(() => {
    const active = allClassSubjects
      .filter(cs => cs.class_name === selectedManageClass)
      .map(cs => cs.subject_name);
    setSelectedClassSubjects(active);
  }, [selectedManageClass, allClassSubjects]);

  const showStatus = (text, type = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  // Toggle subject in checklist
  const handleSubjectCheckboxToggle = (subj) => {
    setSelectedClassSubjects(prev => 
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  // Save Subjects for Selected Class
  const handleSaveClassSubjects = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/class-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_name: selectedManageClass, subjects: selectedClassSubjects })
      });
      if (response.ok) {
        showStatus(`Subjects updated successfully for ${selectedManageClass}!`);
        fetchAdminDetails(); // refresh active mapping
      } else {
        showStatus("Failed to save subjects", "error");
      }
    } catch (err) {
      showStatus("Server error updating subjects", "error");
    }
  };

  // Add Student Handler
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.id || !newStudent.name || !newStudent.parent || !newStudent.phone) {
      showStatus("Please fill in all student details", "error");
      return;
    }
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      const data = await response.json();
      if (response.ok) {
        showStatus(`Registered ${newStudent.name} successfully! Created default grades and fees.`);
        setNewStudent({ id: '', name: '', grade: 'Class 1', parent: '', phone: '' });
        onRefreshData(); // refresh parent states
      } else {
        showStatus(data.error || "Failed to add student", "error");
      }
    } catch (err) {
      showStatus("Server error adding student", "error");
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student ${name} (ID: ${id})?`)) return;
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (response.ok) {
        showStatus(`Deleted student ${name}`);
        onRefreshData();
      } else {
        showStatus("Failed to delete student", "error");
      }
    } catch (err) {
      showStatus("Server error deleting student", "error");
    }
  };

  // FIFO General Fee Collection
  const handleCollectFees = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(feeCollect.amount);
    if (!feeCollect.studentId || !feeCollect.amount || isNaN(amountNum) || amountNum <= 0) {
      showStatus("Please specify valid student ID and collection amount", "error");
      return;
    }
    try {
      const response = await fetch('/api/fees/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: feeCollect.studentId, amount: amountNum })
      });
      const data = await response.json();
      if (response.ok) {
        showStatus(`Collected ₹${amountNum.toLocaleString()} for ID ${feeCollect.studentId}. Allocated automatically (FIFO).`);
        setFeeCollect({ studentId: '', amount: '' });
        fetchAdminDetails();
        onRefreshData();
      } else {
        showStatus(data.error || "Failed to collect fee", "error");
      }
    } catch (err) {
      showStatus("Server error collecting fee", "error");
    }
  };

  // Publish Notice
  const handlePublishNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) {
      showStatus("Please enter notice title and description", "error");
      return;
    }
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice)
      });
      if (response.ok) {
        showStatus("Announcement broadcasted successfully to ticker and parent portals!");
        setNewNotice({ title: '', description: '', category: 'General' });
        onRefreshData();
      } else {
        showStatus("Failed to post notice", "error");
      }
    } catch (err) {
      showStatus("Server error posting notice", "error");
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      const response = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (response.ok) {
        showStatus("Announcement deleted");
        onRefreshData();
      } else {
        showStatus("Failed to delete announcement", "error");
      }
    } catch (err) {
      showStatus("Error communicating with server", "error");
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute summary stats
  const totalFeesCollected = fees.reduce((sum, f) => sum + f.paid, 0);
  const totalFeesPending = fees.reduce((sum, f) => sum + (f.due - f.paid), 0);

  return (
    <div className="erp-container">
      {/* Admin Sidebar Navigation */}
      <aside className="erp-sidebar print-hide">
        <div>
          <div className="erp-user-profile">
            <div className="erp-user-name">Office Administrator</div>
            <div className="erp-user-role">Management Panel</div>
          </div>
          <ul className="erp-nav-menu">
            <li className={`erp-nav-item ${activeTab === 'overview' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('overview')}>
                <Database size={16} /> Overview Stats
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'students' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('students')}>
                <UserPlus size={16} /> Student Registry
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'subjects' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('subjects')}>
                <BookOpen size={16} /> Class Subjects
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'fees' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('fees')}>
                <Receipt size={16} /> Fee Operations
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'notices' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('notices')}>
                <Megaphone size={16} /> Board Broadcaster
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'logs' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('logs')}>
                <ClipboardList size={16} /> Activity History
              </button>
            </li>
          </ul>
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <button onClick={() => { fetchAdminDetails(); onRefreshData(); showStatus("Dashboard synchronized with SQL server."); }} className="btn-sidebar-logout" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--white)', marginBottom: '10px', width: '100%' }}>
            <RefreshCw size={13} /> Sync Server Data
          </button>
          <button onClick={onLogout} className="btn-sidebar-logout" style={{ width: '100%', backgroundColor: 'var(--error)' }}>
            <LogOut size={13} /> Exit Portal (Logout)
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="erp-workspace">
        {/* Workspace Title bar */}
        <div className="erp-header-section print-hide">
          <div className="erp-page-title">
            Office Administration System
          </div>
          {statusMsg.text && (
            <div className={`badge ${statusMsg.type === 'error' ? 'badge-pending' : 'badge-paid'}`} style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '13px' }}>
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="kpi-grid">
              <div className="kpi-card success">
                <div className="kpi-icon-box" style={{ backgroundColor: 'var(--success)' }}>
                  <UserPlus size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <div className="kpi-value">{students.length}</div>
                  <div className="kpi-label">Registered Students</div>
                </div>
              </div>
              <div className="kpi-card secondary">
                <div className="kpi-icon-box" style={{ backgroundColor: 'var(--secondary)' }}>
                  <Receipt size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <div className="kpi-value">₹{totalFeesCollected.toLocaleString()}</div>
                  <div className="kpi-label">Fees Collected</div>
                </div>
              </div>
              <div className="kpi-card error">
                <div className="kpi-icon-box" style={{ backgroundColor: 'var(--error)' }}>
                  <Receipt size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <div className="kpi-value">₹{totalFeesPending.toLocaleString()}</div>
                  <div className="kpi-label">Outstanding Fees</div>
                </div>
              </div>
              <div className="kpi-card accent">
                <div className="kpi-icon-box" style={{ backgroundColor: 'var(--accent)' }}>
                  <Megaphone size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <div className="kpi-value">{announcements.length}</div>
                  <div className="kpi-label">Active Notices</div>
                </div>
              </div>
            </div>

            <div className="erp-card">
              <div className="erp-card-title">Welcome Administrator</div>
              <p style={{ fontSize: '14px', color: '#475569' }}>
                Use this portal to register new school admissions, manage class rosters, map curriculum subjects to grades, issue notice broadcasts to parent tickers, and log general fee payments.
              </p>
              <div style={{ marginTop: '20px', borderLeft: '4px solid var(--accent)', padding: '10px 15px', backgroundColor: 'var(--light-gray)', fontSize: '13px' }}>
                <strong>Administrative Note:</strong> Custom subjects can now be assigned to specific classes in the "Class Subjects" tab. Registration of new students automatically inherits these customized templates.
              </div>
            </div>
          </div>
        )}

        {/* 2. STUDENT REGISTRY */}
        {activeTab === 'students' && (
          <div>
            <div className="erp-card">
              <div className="erp-card-title">Admission Desk: Register Student</div>
              <form onSubmit={handleAddStudent} className="form-row">
                <div className="form-group">
                  <label className="form-label">Student Enrollment ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HC-2026-009" 
                    value={newStudent.id}
                    onChange={e => setNewStudent({...newStudent, id: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Student Name" 
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Class</label>
                  <select 
                    value={newStudent.grade} 
                    onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
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
                  <label className="form-label">Parent / Guardian Name</label>
                  <input 
                    type="text" 
                    placeholder="Guardian Name" 
                    value={newStudent.parent}
                    onChange={e => setNewStudent({...newStudent, parent: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Contact Number</label>
                  <input 
                    type="tel" 
                    placeholder="10-digit Mobile" 
                    value={newStudent.phone}
                    onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="btn-blue-primary" style={{ width: '100%', justifyContent: 'center', height: '40px' }}>
                    Register & Initialize
                  </button>
                </div>
              </form>
            </div>

            <div className="erp-card">
              <div className="erp-card-title">Student Directory ({filteredStudents.length})</div>
              
              <div className="search-bar-wrapper">
                <Search size={16} className="search-icon-fixed" />
                <input 
                  type="text" 
                  className="search-bar-input" 
                  placeholder="Search students by enrollment ID, name, or class..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Parent</th>
                      <th>Phone</th>
                      <th>Attendance</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <tr key={student.id}>
                          <td style={{ fontWeight: '600' }}>{student.id}</td>
                          <td>{student.name}</td>
                          <td><span className="badge badge-active">{student.grade}</span></td>
                          <td>{student.parent}</td>
                          <td>{student.phone}</td>
                          <td>{student.attendance}%</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDeleteStudent(student.id, student.name)}
                              className="action-btn-sm action-btn-delete"
                              title="Delete Student record"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                          No students matching search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CLASS SUBJECTS MANAGER */}
        {activeTab === 'subjects' && (
          <div className="erp-card">
            <div className="erp-card-title">Class Curriculum Subjects Manager</div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Select a class grade and checklist the active subjects taught in that grade.
            </p>

            <form onSubmit={handleSaveClassSubjects}>
              <div className="form-group" style={{ maxWidth: '280px', marginBottom: '25px' }}>
                <label className="form-label">Manage Subjects for Class</label>
                <select 
                  value={selectedManageClass} 
                  onChange={e => setSelectedManageClass(e.target.value)}
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

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '15px', 
                marginBottom: '30px',
                padding: '20px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#F8FAFC'
              }}>
                {allAvailableSubjects.map(subj => (
                  <label key={subj} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      checked={selectedClassSubjects.includes(subj)}
                      onChange={() => handleSubjectCheckboxToggle(subj)}
                    />
                    <span>{subj}</span>
                  </label>
                ))}
              </div>

              <button type="submit" className="btn-blue-primary">
                <Check size={14} style={{ marginRight: '6px' }} /> Save Subjects for {selectedManageClass}
              </button>
            </form>
          </div>
        )}

        {/* 4. FEE OPERATIONS */}
        {activeTab === 'fees' && (
          <div>
            <div className="erp-card">
              <div className="erp-card-title">Collect Fee Payment (FIFO System)</div>
              <form onSubmit={handleCollectFees} className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Student ID</label>
                  <input 
                    type="text" 
                    placeholder="HC-YYYY-XXX" 
                    value={feeCollect.studentId}
                    onChange={e => setFeeCollect({...feeCollect, studentId: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Collection Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="Payment Amount" 
                    value={feeCollect.amount}
                    onChange={e => setFeeCollect({...feeCollect, amount: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="btn-gold" style={{ width: '150px', justifyContent: 'center', height: '40px' }}>
                    Post Payment
                  </button>
                </div>
              </form>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '10px' }}>
                * The general payment ledger is allocated to outstanding dues in historical order (FIFO) (e.g. Admission &rarr; Term 1 &rarr; Term 2 &rarr; Library).
              </div>
            </div>

            <div className="erp-card">
              <div className="erp-card-title">Accounts Ledger Registry</div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Fee Term Description</th>
                      <th>Total Due</th>
                      <th>Amount Paid</th>
                      <th>Outstanding</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.length > 0 ? (
                      fees.map((fee, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '500' }}>
                            <div>{fee.student_name}</div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{fee.student_id}</div>
                          </td>
                          <td>{fee.student_grade}</td>
                          <td>{fee.term}</td>
                          <td>₹{fee.due.toLocaleString()}</td>
                          <td>₹{fee.paid.toLocaleString()}</td>
                          <td style={{ color: fee.due - fee.paid > 0 ? 'var(--error)' : 'inherit', fontWeight: fee.due - fee.paid > 0 ? '600' : 'normal' }}>
                            ₹{(fee.due - fee.paid).toLocaleString()}
                          </td>
                          <td>
                            <span className={`badge ${
                              fee.status === 'Paid' ? 'badge-paid' : 
                              fee.status === 'Partial' ? 'badge-partial' : 'badge-pending'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                          No fee logs initialized.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. NOTICE BROADCASTER */}
        {activeTab === 'notices' && (
          <div>
            <div className="erp-card">
              <div className="erp-card-title">Broadcast Announcement to Notice Board</div>
              <form onSubmit={handlePublishNotice}>
                <div className="form-group">
                  <label className="form-label">Notice Headline / Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter short, punchy alert title" 
                    value={newNotice.title}
                    onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Alert Category</label>
                    <select 
                      value={newNotice.category} 
                      onChange={e => setNewNotice({...newNotice, category: e.target.value})}
                    >
                      <option>General</option>
                      <option>Admissions</option>
                      <option>Exams</option>
                      <option>Events</option>
                      <option>Holidays</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Viewers</label>
                    <input type="text" value="All (Public Ticker & Portal)" disabled style={{ backgroundColor: 'var(--light-gray)' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Detailed Notice Content</label>
                  <textarea 
                    rows="3" 
                    placeholder="Describe announcement details here..."
                    value={newNotice.description}
                    onChange={e => setNewNotice({...newNotice, description: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="btn-blue-primary">
                  <Megaphone size={14} style={{ marginRight: '6px' }} /> Broadcast Notice
                </button>
              </form>
            </div>

            <div className="erp-card">
              <div className="erp-card-title">Current Board Announcements</div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Notice details</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map(ann => (
                      <tr key={ann.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{ann.date}</td>
                        <td><span className="badge badge-active">{ann.category}</span></td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{ann.title}</div>
                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{ann.description}</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="action-btn-sm action-btn-delete"
                            title="Remove notice"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. SYSTEM LOGS */}
        {activeTab === 'logs' && (
          <div className="erp-card">
            <div className="erp-card-title">Audit Log History</div>
            <div style={{ 
              maxHeight: '450px', 
              overflowY: 'auto', 
              border: '1px solid var(--border-color)', 
              borderRadius: '4px',
              padding: '10px'
            }}>
              {logs.length > 0 ? (
                logs.map(log => (
                  <div key={log.id} style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '13px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--accent)', 
                        display: 'inline-block' 
                      }}></span>
                      <span>{log.text}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>{log.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                  No system logs recorded.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
