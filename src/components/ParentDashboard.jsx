import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, Calendar, BookOpen, Printer, AlertTriangle, CreditCard, Clock, LogOut } from 'lucide-react';

export default function ParentDashboard({ studentId, students, announcements, onRefreshData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentDetails, setStudentDetails] = useState(null);
  const [studentFees, setStudentFees] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);
  const [homework, setHomework] = useState([]);
  
  // Detailed attendance date logs
  const [attendanceLog, setAttendanceLog] = useState([]);
  
  // Payment feedback
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Fetch individual student details, fees, grades, homework, and attendance logs
  const fetchStudentData = async () => {
    if (!studentId) return;
    try {
      const currStud = students.find(s => s.id === studentId);
      if (currStud) setStudentDetails(currStud);

      // Fetch fees
      const resFees = await fetch(`/api/students/${studentId}/fees`);
      const dataFees = await resFees.json();
      setStudentFees(dataFees);

      // Fetch grades
      const resGrades = await fetch('/api/grades');
      const dataGrades = await resGrades.json();
      const filteredGrades = dataGrades.filter(g => g.student_id === studentId);
      setStudentGrades(filteredGrades);

      // Fetch homework
      const resHW = await fetch('/api/homework');
      const dataHW = await resHW.json();
      setHomework(dataHW);

      // Fetch detailed attendance log list
      const resAtt = await fetch(`/api/students/${studentId}/attendance`);
      const dataAtt = await resAtt.json();
      // Reverse to show latest dates first
      setAttendanceLog(dataAtt.reverse());
    } catch (err) {
      console.error("Error loading student portal details:", err);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId, students]);

  const showStatus = (text, type = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  // Pay Fee Item Handler
  const handlePayFeeItem = async (term, amount) => {
    if (!window.confirm(`Initiate payment of ₹${amount.toLocaleString()} for ${term}?`)) return;
    try {
      const response = await fetch('/api/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, term })
      });
      const data = await response.json();
      if (response.ok) {
        showStatus(`Payment of ₹${amount.toLocaleString()} for ${term} was successful! Invoice created.`);
        fetchStudentData();
        onRefreshData();
      } else {
        showStatus(data.error || "Payment failed", "error");
      }
    } catch (err) {
      showStatus("Connection failed, could not post payment", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!studentDetails) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
        <p style={{ color: 'var(--error)' }}>Error: Student ID not found in database.</p>
      </div>
    );
  }

  // Statistics
  const totalOutstanding = studentFees.reduce((sum, f) => sum + (f.due - f.paid), 0);
  const attendanceRate = studentDetails.attendance;
  const isAttendanceLow = parseFloat(attendanceRate) < 75.0;

  return (
    <div className="erp-container">
      {/* Sidebar navigation */}
      <aside className="erp-sidebar print-hide">
        <div>
          <div className="erp-user-profile">
            <div className="erp-user-name">{studentDetails.name}</div>
            <div className="erp-user-role">ID: {studentDetails.id}</div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '4px', fontWeight: '500' }}>
              {studentDetails.grade}
            </div>
          </div>
          <ul className="erp-nav-menu">
            <li className={`erp-nav-item ${activeTab === 'overview' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('overview')}>
                <BookOpen size={16} /> Overview & Logs
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'report' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('report')}>
                <FileText size={16} /> Report Card
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'fees' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('fees')}>
                <DollarSign size={16} /> Fees Desk
              </button>
            </li>
          </ul>
        </div>
        <div style={{ padding: '20px' }}>
          <button onClick={onLogout} className="btn-sidebar-logout" style={{ width: '100%', backgroundColor: 'var(--error)' }}>
            <LogOut size={13} /> Exit Portal (Logout)
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="erp-workspace">
        {/* Print Header Section (For report cards) */}
        <div className="report-card-print-header">
          <h1>HOLY CROSS SISTERS SCHOOL, HASSAN</h1>
          <p>Salagame Road, Hemavathi Nagar, Hassan, Karnataka - 573202</p>
          <p style={{ fontWeight: '600', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Official Progress Report Transcript
          </p>
          
          <div className="report-card-student-meta">
            <div><strong>Student Name:</strong> {studentDetails.name}</div>
            <div><strong>Enrollment ID:</strong> {studentDetails.id}</div>
            <div><strong>Grade/Class:</strong> {studentDetails.grade}</div>
            <div><strong>Academic Term:</strong> Annual Exam 2026-27</div>
            <div><strong>Guardian Name:</strong> {studentDetails.parent}</div>
            <div><strong>Attendance Record:</strong> {studentDetails.attendance}%</div>
          </div>
        </div>

        {/* Header bar */}
        <div className="erp-header-section print-hide">
          <div className="erp-page-title">
            Parent & Student Portal
          </div>
          {statusMsg.text && (
            <div className={`badge ${statusMsg.type === 'error' ? 'badge-pending' : 'badge-paid'}`} style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '13px' }}>
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* 1. OVERVIEW & DATES TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="kpi-grid print-hide">
              <div className={`kpi-card ${isAttendanceLow ? 'error' : 'success'}`}>
                <div className="kpi-icon-box">
                  <Calendar size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <div className="kpi-value">{attendanceRate}%</div>
                  <div className="kpi-label">Attendance Rate</div>
                </div>
              </div>
              <div className={`kpi-card ${totalOutstanding > 0 ? 'error' : 'success'}`}>
                <div className="kpi-icon-box">
                  <DollarSign size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <div className="kpi-value">₹{totalOutstanding.toLocaleString()}</div>
                  <div className="kpi-label">Outstanding Fees</div>
                </div>
              </div>
              <div className="kpi-card secondary">
                <div className="kpi-icon-box">
                  <BookOpen size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <div className="kpi-value">{homework.length}</div>
                  <div className="kpi-label">Active Homework</div>
                </div>
              </div>
            </div>

            {isAttendanceLow && (
              <div className="erp-card print-hide" style={{ borderLeft: '5px solid var(--error)', backgroundColor: '#FFEBEE', padding: '15px 20px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '25px' }}>
                <AlertTriangle size={24} style={{ color: 'var(--error)' }} />
                <div style={{ fontSize: '13px' }}>
                  <strong>Critical Alert:</strong> Attendance rate ({attendanceRate}%) has dropped below the minimum requirement of 75%. Please contact class teacher Sr. Mary Stella to discuss regularisation.
                </div>
              </div>
            )}

            <div className="home-section-grid" style={{ padding: 0, gap: '25px', gridTemplateColumns: '1.2fr 0.8fr' }}>
              {/* Homework board */}
              <div>
                <div className="erp-card" style={{ marginBottom: '25px' }}>
                  <div className="erp-card-title">Pending Homework Assignments</div>
                  <div style={{ overflowX: 'auto' }}>
                    {homework.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Assignment Details</th>
                            <th>Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {homework.map(hw => (
                            <tr key={hw.id}>
                              <td style={{ fontWeight: '600' }}><span className="badge badge-active">{hw.subject}</span></td>
                              <td>{hw.description}</td>
                              <td style={{ color: 'var(--error)', fontWeight: '500' }}>{hw.due_date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ color: '#64748B', padding: '10px 0', fontSize: '13px' }}>
                        No outstanding homework logged. Nice job!
                      </p>
                    )}
                  </div>
                </div>

                {/* DETAILED ATTENDANCE DATE LOG */}
                <div className="erp-card">
                  <div className="erp-card-title">
                    <Clock size={16} style={{ marginRight: '6px', verticalAlign: 'middle', color: 'var(--primary)' }} /> 
                    Attendance History Calendar Log
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '15px' }}>
                    Dates on which the student was marked Present or Absent by instructors:
                  </p>
                  <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    {attendanceLog.length > 0 ? (
                      <table style={{ margin: 0 }}>
                        <thead>
                          <tr>
                            <th>Academic Date</th>
                            <th>Registry Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceLog.map((log, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: '600' }}>{log.date}</td>
                              <td>
                                <span className={`badge ${log.status === 1 ? 'badge-paid' : 'badge-pending'}`}>
                                  {log.status === 1 ? 'Present' : 'Absent'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ padding: '20px', color: '#94A3B8', fontSize: '13px', textAlign: 'center' }}>
                        No attendance entries logged in database.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notice board */}
              <div className="erp-card" style={{ marginBottom: 0 }}>
                <div className="erp-card-title">Recent Circulars</div>
                <ul className="notice-board-list">
                  {announcements.slice(0, 4).map(ann => (
                    <li key={ann.id} className="notice-board-item">
                      <div className="notice-date">{ann.date}</div>
                      <div className="notice-title-text">{ann.title}</div>
                      <div className="notice-desc-text">{ann.description}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. REPORT CARD */}
        {activeTab === 'report' && (
          <div className="erp-card">
            <div className="erp-card-title print-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Academic Marksheet</span>
              <button onClick={handlePrint} className="btn-blue-primary action-btn-sm">
                <Printer size={13} /> Print Report Card
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '10px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Subject Description</th>
                    <th>Marks Scored</th>
                    <th>Max Marks</th>
                    <th>Percentage (%)</th>
                    <th>Academic Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.length > 0 ? (
                    studentGrades.map(grade => (
                      <tr key={grade.id}>
                        <td style={{ fontWeight: '600' }}>{grade.subject}</td>
                        <td style={{ fontWeight: '500', color: (grade.marks / grade.max_marks * 100) < 40 ? 'var(--error)' : 'inherit' }}>
                          {grade.marks}
                        </td>
                        <td>{grade.max_marks}</td>
                        <td>{((grade.marks / grade.max_marks) * 100).toFixed(0)}%</td>
                        <td style={{ fontStyle: 'italic', color: '#475569', fontSize: '13px' }}>{grade.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                        No terminal test scores posted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'none' }} className="report-card-print-header">
              {/* Teacher Signatures for printed version */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '100px', fontSize: '13px' }}>
                <div style={{ textAlign: 'center', width: '200px', borderTop: '1px solid #000', paddingTop: '10px' }}>
                  Class Teacher Signature
                </div>
                <div style={{ textAlign: 'center', width: '200px', borderTop: '1px solid #000', paddingTop: '10px' }}>
                  Principal Seal & Signature
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FEES DESK */}
        {activeTab === 'fees' && (
          <div className="erp-card">
            <div className="erp-card-title">Tuition & Term Dues</div>
            
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Fee Term</th>
                    <th>Required Due</th>
                    <th>Amount Paid</th>
                    <th>Remaining Dues</th>
                    <th>Payment Status</th>
                    <th style={{ textAlign: 'center' }} className="print-hide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentFees.length > 0 ? (
                    studentFees.map((fee, idx) => {
                      const outstanding = fee.due - fee.paid;
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: '500' }}>{fee.term}</td>
                          <td>₹{fee.due.toLocaleString()}</td>
                          <td>₹{fee.paid.toLocaleString()}</td>
                          <td style={{ color: outstanding > 0 ? 'var(--error)' : 'inherit', fontWeight: outstanding > 0 ? '600' : 'normal' }}>
                            ₹{outstanding.toLocaleString()}
                          </td>
                          <td>
                            <span className={`badge ${
                              fee.status === 'Paid' ? 'badge-paid' : 
                              fee.status === 'Partial' ? 'badge-partial' : 'badge-pending'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }} className="print-hide">
                            {outstanding > 0 ? (
                              <button 
                                onClick={() => handlePayFeeItem(fee.term, outstanding)}
                                className="action-btn-sm action-btn-pay"
                                title="Process payment"
                              >
                                <CreditCard size={12} /> Pay Now
                              </button>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>FULLY PAID</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                        No fee ledger assigned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
