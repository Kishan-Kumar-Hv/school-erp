import React, { useState, useEffect } from 'react';
import { Calendar, Award, BookOpen, CheckSquare, RefreshCw, AlertCircle, LogOut } from 'lucide-react';

export default function TeacherDashboard({ students, onRefreshData, onLogout }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedClass, setSelectedClass] = useState('Class 1');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  
  // Dynamic subjects list from database
  const [classSubjects, setClassSubjects] = useState([]);
  
  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  
  // Grades state
  const [maxMarks, setMaxMarks] = useState(100);
  const [gradesInput, setGradesInput] = useState([]);
  const [dbGrades, setDbGrades] = useState([]);
  
  // Homework state
  const [newHomework, setNewHomework] = useState({ subject: 'Mathematics', description: '', due_date: '' });
  const [homeworkList, setHomeworkList] = useState([]);
  
  // Feedback
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Fetch homework assignments
  const fetchHomeworkList = async () => {
    try {
      const res = await fetch('/api/homework');
      const data = await res.json();
      setHomeworkList(data);
    } catch (err) {
      console.error("Error fetching homework:", err);
    }
  };

  // Fetch all class subjects mapping
  const fetchClassSubjects = async () => {
    try {
      const res = await fetch('/api/class-subjects');
      const data = await res.json();
      
      const filtered = data
        .filter(cs => cs.class_name === selectedClass)
        .map(cs => cs.subject_name);
        
      const subjectsList = filtered.length > 0 ? filtered : ['Mathematics', 'Physics', 'English', 'Social Studies'];
      setClassSubjects(subjectsList);
      
      if (!subjectsList.includes(selectedSubject)) {
        setSelectedSubject(subjectsList[0]);
      }
    } catch (err) {
      console.error("Error loading class subjects:", err);
      setClassSubjects(['Mathematics', 'Physics', 'English', 'Social Studies']);
    }
  };

  // Fetch all grades in database to check existing marks
  const fetchGradesHistory = async () => {
    try {
      const res = await fetch('/api/grades');
      const data = await res.json();
      setDbGrades(data);
    } catch (err) {
      console.error("Error fetching grades history:", err);
    }
  };

  // Fetch attendance records from database for selected date and class
  const fetchAttendanceHistory = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      
      // Filter records matching selected date
      const dateRecords = data.filter(r => r.date === attendanceDate);
      const classStudents = students.filter(s => s.grade === selectedClass);
      
      const sheet = classStudents.map(s => {
        const record = dateRecords.find(r => r.student_id === s.id);
        return {
          student_id: s.id,
          name: s.name,
          status: record ? (record.status === 1) : true // Default to present (true) if no record exists
        };
      });
      setAttendanceSheet(sheet);
    } catch (err) {
      console.error("Error loading attendance log:", err);
    }
  };

  useEffect(() => {
    fetchHomeworkList();
  }, []);

  useEffect(() => {
    fetchClassSubjects();
  }, [selectedClass]);

  useEffect(() => {
    fetchGradesHistory();
  }, [selectedClass, selectedSubject, students]);

  // Load attendance based on date or class changes
  useEffect(() => {
    fetchAttendanceHistory();
  }, [selectedClass, attendanceDate, students]);

  // Sync grades input fields when students roster, class, subject, or database grades change
  useEffect(() => {
    const classStudents = students.filter(s => s.grade === selectedClass);
    
    setGradesInput(classStudents.map(s => {
      const existingGrade = dbGrades.find(g => g.student_id === s.id && g.subject === selectedSubject);
      
      // If we find an existing grade, sync max marks as well
      if (existingGrade && existingGrade.max_marks) {
        setMaxMarks(existingGrade.max_marks);
      }

      return {
        student_id: s.id,
        name: s.name,
        currentMark: existingGrade ? existingGrade.marks : 'Not Graded',
        currentMax: existingGrade ? existingGrade.max_marks : 100,
        marks: existingGrade ? existingGrade.marks : '' // Pre-fill with database marks if exists
      };
    }));
  }, [students, selectedClass, selectedSubject, dbGrades]);

  const showStatus = (text, type = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  // Toggle Attendance status using explicit Present/Absent toggles
  const handleToggleAttendance = (studentId, status) => {
    setAttendanceSheet(prev => prev.map(item => 
      item.student_id === studentId ? { ...item, status } : item
    ));
  };

  // Submit Attendance
  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (attendanceSheet.length === 0) {
      showStatus("No students registered in this class.", "error");
      return;
    }
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: attendanceDate,
          attendance: attendanceSheet.map(item => ({
            student_id: item.student_id,
            status: item.status
          }))
        })
      });
      if (response.ok) {
        showStatus(`Attendance register submitted for ${selectedClass} on ${attendanceDate}!`);
        onRefreshData();
      } else {
        showStatus("Failed to submit attendance sheet.", "error");
      }
    } catch (err) {
      showStatus("Server error submitting attendance.", "error");
    }
  };

  // Handle score value changes
  const handleGradeChange = (studentId, value) => {
    setGradesInput(prev => prev.map(item => 
      item.student_id === studentId ? { ...item, marks: value === '' ? '' : value } : item
    ));
  };

  // Live Predicted Grade Helper based on percentage of chosen Max Marks
  const getPredictedGrade = (marks) => {
    if (marks === '') return { label: 'Pending', class: 'badge-pending' };
    const score = parseFloat(marks);
    const maxVal = parseFloat(maxMarks) || 100;
    if (isNaN(score) || score < 0 || score > maxVal) return { label: 'Invalid Score', class: 'badge-pending' };
    
    const percentage = (score / maxVal) * 100;
    if (percentage >= 90) return { label: 'A+ (Outstanding)', class: 'badge-paid' };
    if (percentage >= 80) return { label: 'A (Strong)', class: 'badge-paid' };
    if (percentage >= 70) return { label: 'B (Good)', class: 'badge-active' };
    if (percentage >= 60) return { label: 'C (Satisfactory)', class: 'badge-active' };
    if (percentage >= 50) return { label: 'D (Pass)', class: 'badge-partial' };
    return { label: 'F (Needs Focus)', class: 'badge-pending' };
  };

  // Submit Grade sheet
  const handleSubmitGrades = async (e) => {
    e.preventDefault();
    const maxVal = parseFloat(maxMarks) || 100;
    
    // Validate all inputs are numbers between 0 and maxMarks
    const hasInvalid = gradesInput.some(g => {
      if (g.marks === '') return true;
      const val = parseFloat(g.marks);
      return isNaN(val) || val < 0 || val > maxVal;
    });

    if (hasInvalid) {
      showStatus(`Please enter valid scores between 0 and ${maxMarks} for all students.`, "error");
      return;
    }

    try {
      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          max_marks: maxVal,
          grades: gradesInput.map(item => ({
            student_id: item.student_id,
            marks: parseFloat(item.marks)
          }))
        })
      });
      if (response.ok) {
        showStatus(`Scores sheet for ${selectedSubject} (${selectedClass}) saved successfully!`);
        fetchGradesHistory();
        onRefreshData();
      } else {
        showStatus("Failed to save grade sheet.", "error");
      }
    } catch (err) {
      showStatus("Server error saving grades", "error");
    }
  };

  // Submit Homework planner
  const handleSubmitHomework = async (e) => {
    e.preventDefault();
    if (!newHomework.description || !newHomework.due_date) {
      showStatus("Please outline homework description and select a due date.", "error");
      return;
    }
    try {
      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newHomework.subject,
          description: newHomework.description,
          due_date: newHomework.due_date,
          assigned_by: "Sr. Mary Stella (Class Teacher)"
        })
      });
      if (response.ok) {
        showStatus(`Assigned homework for ${newHomework.subject}!`);
        setNewHomework({ subject: selectedSubject, description: '', due_date: '' });
        fetchHomeworkList();
      } else {
        showStatus("Failed to post assignment.", "error");
      }
    } catch (err) {
      showStatus("Server error adding assignment", "error");
    }
  };

  // Delete Homework
  const handleDeleteHomework = async (id) => {
    if (!window.confirm("Archive this homework?")) return;
    try {
      const response = await fetch(`/api/homework/${id}`, { method: 'DELETE' });
      if (response.ok) {
        showStatus("Homework assignment archived");
        fetchHomeworkList();
      } else {
        showStatus("Failed to archive homework", "error");
      }
    } catch (err) {
      showStatus("Server connection issues", "error");
    }
  };

  // Formatter to convert Date string back to input date format (YYYY-MM-DD) if needed
  const getFormattedDateForInput = () => {
    // Converts e.g. "Jun 21, 2026" to YYYY-MM-DD
    const dateObj = new Date(attendanceDate);
    if (isNaN(dateObj.getTime())) return new Date().toISOString().split('T')[0];
    return dateObj.toISOString().split('T')[0];
  };

  const handleDateInputChange = (e) => {
    const formatted = new Date(e.target.value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setAttendanceDate(formatted);
  };

  return (
    <div className="erp-container">
      {/* Sidebar navigation */}
      <aside className="erp-sidebar print-hide">
        <div>
          <div className="erp-user-profile">
            <div className="erp-user-name">Sr. Mary Stella</div>
            <div className="erp-user-role">Class Instructor</div>
          </div>
          <ul className="erp-nav-menu">
            <li className={`erp-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('attendance')}>
                <CheckSquare size={16} /> Mark Attendance
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'grades' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('grades')}>
                <Award size={16} /> Gradebook Desk
              </button>
            </li>
            <li className={`erp-nav-item ${activeTab === 'homework' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('homework')}>
                <BookOpen size={16} /> Homework Planner
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

      {/* Main workspace */}
      <main className="erp-workspace">
        {/* Header bar */}
        <div className="erp-header-section print-hide">
          <div className="erp-page-title">
            Teacher Operations Center
          </div>
          {statusMsg.text && (
            <div className={`badge ${statusMsg.type === 'error' ? 'badge-pending' : 'badge-paid'}`} style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '13px' }}>
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* Global Controls */}
        <div className="erp-card print-hide" style={{ padding: '15px 25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '2px' }}>Selected Grade</label>
            <select 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)}
              style={{ width: '180px', padding: '6px 10px' }}
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
          <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
            <AlertCircle size={15} style={{ color: 'var(--secondary)' }} /> Choose the grade from the list to filter rosters.
          </div>
        </div>

        {/* 1. ATTENDANCE REGISTER (IMPROVED WITH TOGGLE BUTTONS) */}
        {activeTab === 'attendance' && (
          <div className="erp-card">
            <div className="erp-card-title">Daily Attendance Register</div>
            
            <form onSubmit={handleSubmitAttendance}>
              <div className="form-group" style={{ maxWidth: '240px', marginBottom: '20px' }}>
                <label className="form-label">Attendance Date</label>
                <input 
                  type="date" 
                  value={getFormattedDateForInput()}
                  onChange={handleDateInputChange}
                />
              </div>

              <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table className="attendance-list-table">
                  <thead>
                    <tr>
                      <th style={{ width: '150px' }}>Student ID</th>
                      <th>Student Name</th>
                      <th style={{ width: '220px', textAlign: 'center' }}>Mark Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceSheet.length > 0 ? (
                      attendanceSheet.map(item => (
                        <tr key={item.student_id}>
                          <td style={{ fontWeight: '600' }}>{item.student_id}</td>
                          <td>{item.name}</td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleAttendance(item.student_id, true)}
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  borderRadius: '4px',
                                  backgroundColor: item.status ? 'var(--success)' : '#E2E8F0',
                                  color: item.status ? 'white' : '#64748B'
                                }}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleAttendance(item.student_id, false)}
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  borderRadius: '4px',
                                  backgroundColor: !item.status ? 'var(--error)' : '#E2E8F0',
                                  color: !item.status ? 'white' : '#64748B'
                                }}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                          No students enrolled in {selectedClass}. Add them in Admin panel.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {attendanceSheet.length > 0 && (
                <button type="submit" className="btn-blue-primary">
                  <Calendar size={14} style={{ marginRight: '6px' }} /> Submit Attendance Sheet
                </button>
              )}
            </form>
          </div>
        )}

        {/* 2. SUBMIT GRADES (IMPROVED - CHOOSE MAX MARKS, NO CONFUSION) */}
        {activeTab === 'grades' && (
          <div className="erp-card">
            <div className="erp-card-title" style={{ display: 'block', borderBottom: 'none', paddingBottom: 0 }}>
              <span>Assign Subject Marks</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '15px', alignItems: 'center' }} className="print-hide">
                <div>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '2px' }}>Selected Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={e => setSelectedSubject(e.target.value)}
                    style={{ width: '220px', padding: '6px 10px' }}
                  >
                    {classSubjects.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '2px' }}>Set Max Marks</label>
                  <input 
                    type="number" 
                    value={maxMarks}
                    onChange={e => setMaxMarks(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: '100px', padding: '6px 10px', fontWeight: 'bold', textAlign: 'center' }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '15px' }}>
                  * Live grade matches your chosen max marks ({maxMarks}) dynamically.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitGrades} style={{ marginTop: '20px' }}>
              <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '150px' }}>Enrollment ID</th>
                      <th>Student Name</th>
                      <th style={{ width: '200px' }}>Current Database Score</th>
                      <th style={{ width: '220px' }}>New Score (Out of {maxMarks})</th>
                      <th style={{ width: '200px' }}>Predicted Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesInput.length > 0 ? (
                      gradesInput.map(item => {
                        const gradeDetails = getPredictedGrade(item.marks);
                        const isExceeding = parseFloat(item.marks) > parseFloat(maxMarks);
                        
                        return (
                          <tr key={item.student_id}>
                            <td style={{ fontWeight: '600' }}>{item.student_id}</td>
                            <td>{item.name}</td>
                            <td style={{ color: '#64748B', fontSize: '13px' }}>
                              {item.currentMark !== 'Not Graded' ? `${item.currentMark} / ${item.currentMax}` : 'Not Graded'}
                            </td>
                            <td>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max={maxMarks}
                                  placeholder="Enter Score" 
                                  value={item.marks}
                                  onChange={e => handleGradeChange(item.student_id, e.target.value)}
                                  style={{ 
                                    width: '100px', 
                                    padding: '6px 12px', 
                                    fontWeight: '600', 
                                    textAlign: 'center',
                                    borderColor: isExceeding ? 'var(--error)' : (item.marks !== item.currentMark ? 'var(--accent)' : 'var(--border-color)')
                                  }}
                                />
                                <span style={{ fontSize: '13px', color: '#64748B' }}>/ {maxMarks}</span>
                              </div>
                              {isExceeding && (
                                <div style={{ color: 'var(--error)', fontSize: '10px', fontWeight: '600', marginTop: '2px' }}>
                                  Cannot exceed {maxMarks}!
                                </div>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${gradeDetails.class}`}>
                                {gradeDetails.label}
                              </span>
                              {item.marks !== item.currentMark && !isExceeding && (
                                <span style={{ fontSize: '10px', color: 'var(--accent)', marginLeft: '8px', fontWeight: '600' }}>CHANGED</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                          No students enrolled in {selectedClass}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {gradesInput.length > 0 && (
                <button type="submit" className="btn-gold">
                  <Award size={14} style={{ marginRight: '6px' }} /> Save Subject Marks
                </button>
              )}
            </form>
          </div>
        )}

        {/* 3. HOMEWORK PLANNER */}
        {activeTab === 'homework' && (
          <div>
            <div className="erp-card">
              <div className="erp-card-title">Assign Homework Task</div>
              <form onSubmit={handleSubmitHomework} className="form-row">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    value={newHomework.subject}
                    onChange={e => setNewHomework({ ...newHomework, subject: e.target.value })}
                  >
                    {classSubjects.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input 
                    type="date" 
                    value={newHomework.due_date}
                    onChange={e => setNewHomework({ ...newHomework, due_date: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Task Description</label>
                  <input 
                    type="text" 
                    placeholder="Describe tasks, exercise numbers, or reading topics..." 
                    value={newHomework.description}
                    onChange={e => setNewHomework({ ...newHomework, description: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <button type="submit" className="btn-blue-primary">
                    <BookOpen size={14} style={{ marginRight: '6px' }} /> Publish Assignment
                  </button>
                </div>
              </form>
            </div>

            <div className="erp-card">
              <div className="erp-card-title">Currently Active Class Homework</div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Task Details</th>
                      <th>Due Date</th>
                      <th>Assigned By</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeworkList.length > 0 ? (
                      homeworkList.map(hw => (
                        <tr key={hw.id}>
                          <td style={{ fontWeight: '600' }}><span className="badge badge-active">{hw.subject}</span></td>
                          <td>{hw.description}</td>
                          <td style={{ color: 'var(--error)', fontWeight: '500' }}>{hw.due_date}</td>
                          <td>{hw.assigned_by}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDeleteHomework(hw.id)}
                              className="action-btn-sm action-btn-delete"
                            >
                              Archive
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center" style={{ padding: '20px', color: '#94A3B8' }}>
                          No homework logged on the portal.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
