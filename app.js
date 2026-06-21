/**
 * Holy Cross Sisters School - ERP & Website Portal Logic
 * Integrated SPA Router, Local Storage Mock DB, and Role-Based Dashboards
 */

// ==========================================
// 1. MOCK DATABASE SEED & PERSISTENCE
// ==========================================
const DB_KEY = 'holy_cross_erp_db';

const DEFAULT_DATABASE = {
  announcements: [
    {
      id: 1,
      title: "Mid-term Examination Results Published",
      desc: "Academic reports for Mid-term assessments are now visible. Parents can view, print, and save the reports via the Parent ERP Portal.",
      date: "June 20, 2026",
      category: "Academics"
    },
    {
      id: 2,
      title: "Admissions Open for Academic Year 2026-2027",
      desc: "Enrollment for classes Nursery to Grade IX is now open. Apply online or download the admissions brochure from our website.",
      date: "June 18, 2026",
      category: "Admissions"
    },
    {
      id: 3,
      title: "Annual Science & Art Exhibition 2026",
      desc: "The school will host its annual Science & Art Exhibition on July 10th. Parents and guardians are cordially invited to encourage our students.",
      date: "June 15, 2026",
      category: "Events"
    }
  ],
  
  homework: [
    {
      id: 1,
      subject: "Mathematics",
      desc: "Solve exercise 4.2 (Quadratic equations) questions 1 to 10. Show all steps in your classwork notebook.",
      due: "2026-06-25",
      assignedBy: "Sr. Clara"
    },
    {
      id: 2,
      subject: "Physics",
      desc: "Draw neat labeled diagrams of refraction of light through a prism and glass slab. Write explanations of refraction.",
      due: "2026-06-24",
      assignedBy: "Sr. Clara"
    },
    {
      id: 3,
      subject: "English",
      desc: "Write an essay of 250 words about 'The Role of Youth in Combating Climate Change'. Focus on grammatical structure.",
      due: "2026-06-27",
      assignedBy: "Sr. Clara"
    }
  ],

  students: [
    {
      id: "HC-2026-0812",
      name: "Rohit Kumar",
      grade: "VIII - A",
      parent: "Kishan Kumar",
      phone: "+91 98765 43210",
      attendance: 94.2,
      presentDaysCount: 161,
      totalDaysCount: 171,
      attendanceHistory: {
        "June 21, 2026": true,
        "June 20, 2026": true,
        "June 19, 2026": false,
        "June 18, 2026": true
      },
      grades: {
        "Mathematics": { marks: 95, max: 100, remarks: "Outstanding problem solver" },
        "Physics": { marks: 89, max: 100, remarks: "Great conceptual understanding" },
        "English": { marks: 92, max: 100, remarks: "Excellent essay writing skills" },
        "Social Studies": { marks: 94, max: 100, remarks: "Very active in discussions" }
      },
      fees: {
        totalDue: 50000,
        paid: 42500,
        ledger: [
          { term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 2 Tuition Fee", due: 15000, paid: 12500, status: "Partial" },
          { term: "Library & Lab Charges", due: 5000, paid: 0, status: "Pending" }
        ]
      }
    },
    {
      id: "HC-2026-0813",
      name: "Anjali Gowda",
      grade: "VIII - A",
      parent: "Mahesh Gowda",
      phone: "+91 99001 12233",
      attendance: 91.2,
      presentDaysCount: 156,
      totalDaysCount: 171,
      attendanceHistory: {
        "June 21, 2026": true,
        "June 20, 2026": true,
        "June 19, 2026": true,
        "June 18, 2026": true
      },
      grades: {
        "Mathematics": { marks: 82, max: 100, remarks: "Needs more practice on algebra" },
        "Physics": { marks: 91, max: 100, remarks: "Excellent experimental skills" },
        "English": { marks: 95, max: 100, remarks: "Brilliant creative writer" },
        "Social Studies": { marks: 88, max: 100, remarks: "Good performance overall" }
      },
      fees: {
        totalDue: 50000,
        paid: 50000,
        ledger: [
          { term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 2 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Library & Lab Charges", due: 5000, paid: 5000, status: "Paid" }
        ]
      }
    },
    {
      id: "HC-2026-0814",
      name: "Chetan Raju",
      grade: "VIII - A",
      parent: "Raju N",
      phone: "+91 98867 55443",
      attendance: 87.7,
      presentDaysCount: 150,
      totalDaysCount: 171,
      attendanceHistory: {
        "June 21, 2026": false,
        "June 20, 2026": true,
        "June 19, 2026": true,
        "June 18, 2026": true
      },
      grades: {
        "Mathematics": { marks: 74, max: 100, remarks: "Struggles with geometry" },
        "Physics": { marks: 78, max: 100, remarks: "Needs to concentrate more" },
        "English": { marks: 80, max: 100, remarks: "Active participation in class" },
        "Social Studies": { marks: 85, max: 100, remarks: "Shows good interest in history" }
      },
      fees: {
        totalDue: 50000,
        paid: 30000,
        ledger: [
          { term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 2 Tuition Fee", due: 15000, paid: 0, status: "Pending" },
          { term: "Library & Lab Charges", due: 5000, paid: 0, status: "Pending" }
        ]
      }
    },
    {
      id: "HC-2026-0815",
      name: "Sneha Swamy",
      grade: "VIII - A",
      parent: "Swamy Gowda",
      phone: "+91 94481 23456",
      attendance: 96.5,
      presentDaysCount: 165,
      totalDaysCount: 171,
      attendanceHistory: {
        "June 21, 2026": true,
        "June 20, 2026": true,
        "June 19, 2026": true,
        "June 18, 2026": true
      },
      grades: {
        "Mathematics": { marks: 98, max: 100, remarks: "Exceptional analytical skills" },
        "Physics": { marks: 96, max: 100, remarks: "Highest score in class" },
        "English": { marks: 91, max: 100, remarks: "Enthusiastic and articulate" },
        "Social Studies": { marks: 93, max: 100, remarks: "Thorough work" }
      },
      fees: {
        totalDue: 50000,
        paid: 45000,
        ledger: [
          { term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Term 2 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
          { term: "Library & Lab Charges", due: 5000, paid: 0, status: "Pending" }
        ]
      }
    }
  ],

  admissions: [
    {
      id: 1,
      studentName: "Aditya Kumar",
      parentName: "Sanjay Kumar",
      grade: "Grade 6",
      phone: "9876540001",
      email: "sanjay@gmail.com",
      desc: "Transferring from Bangalore International School.",
      status: "Enquiry Received"
    }
  ],

  logs: [
    { text: "Class VIII-A attendance submitted by Sr. Clara (Teacher).", time: "Jun 21, 2026" },
    { text: "Term II Fee paid for student Rohit Kumar by Kishan (Parent).", time: "Jun 20, 2026" },
    { text: "Exam timetable notice published by admin.", time: "Jun 19, 2026" }
  ]
};

// Global DB instance
let db = null;

function loadDb() {
  const data = localStorage.getItem(DB_KEY);
  if (data) {
    db = JSON.parse(data);
  } else {
    db = DEFAULT_DATABASE;
    saveDb();
  }
}

function saveDb() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}


// ==========================================
// 2. MAIN PUBLIC SPA NAVIGATION
// ==========================================
function navigateTo(sectionId) {
  const sectionMap = {
    'home': 'home-section',
    'about': 'about-section',
    'academics': 'academics-section',
    'contact': 'contact-section',
    'login': 'login-section',
    'erp': 'erp-section'
  };

  // Hide all sections, show active
  Object.keys(sectionMap).forEach(key => {
    const el = document.getElementById(sectionMap[key]);
    if (el) {
      if (key === sectionId) {
        el.classList.remove('inactive-section');
        el.classList.add('active-section');
      } else {
        el.classList.remove('active-section');
        el.classList.add('inactive-section');
      }
    }
  });

  // Highlight active link in primary header
  const navKeys = ['home', 'about', 'academics', 'contact', 'login'];
  navKeys.forEach(key => {
    const link = document.getElementById(`nav-${key}`);
    if (link) {
      if (key === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  // Adjust display of public navigation header/footer inside ERP view
  const mainHeader = document.querySelector('.main-header');
  const topBar = document.querySelector('.top-bar');
  const mainFooter = document.querySelector('.main-footer');

  if (sectionId === 'erp') {
    if (mainHeader) mainHeader.style.display = 'none';
    if (topBar) topBar.style.display = 'none';
    if (mainFooter) mainFooter.style.display = 'none';
  } else {
    if (mainHeader) mainHeader.style.display = '';
    if (topBar) topBar.style.display = '';
    if (mainFooter) mainFooter.style.display = '';
  }

  // Auto-scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile navigation overlay toggle
function toggleMobileMenu() {
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.classList.toggle('active');
  }
}


// ==========================================
// 3. LIGHTBOX GALLERY
// ==========================================
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
  }
}


// ==========================================
// 4. TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    
    // Style by type
    if (type === 'error') {
      toast.style.borderLeft = '4px solid var(--danger)';
    } else {
      toast.style.borderLeft = '4px solid var(--gold)';
    }
    
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 3000);
  }
}


// ==========================================
// 5. PUBLIC CONTACT & ADMISSION FORM SUBMIT
// ==========================================
function handleAdmissionSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('student-name').value;
  const parentName = document.getElementById('parent-name').value;
  const grade = document.getElementById('student-grade').value;
  const email = document.getElementById('parent-email').value;
  const phone = document.getElementById('parent-phone').value;
  const desc = document.getElementById('student-desc').value;

  const newEnquiry = {
    id: db.admissions.length + 1,
    studentName: name,
    parentName: parentName,
    grade: grade,
    phone: phone,
    email: email,
    desc: desc,
    status: "Enquiry Received"
  };

  db.admissions.push(newEnquiry);
  saveDb();

  showToast(`Admission Enquiry for ${name} submitted successfully!`);
  
  // Connect to Admin logs instantly
  logAdminActivity(`Admission enquiry received for ${name} (Class ${grade}) from parent ${parentName}.`);

  // Clear form
  document.getElementById('admission-form').reset();
}


// ==========================================
// 6. ERP PORTAL LOGIN MODULE
// ==========================================
let currentLoginRole = 'parent';

function switchLoginRole(role) {
  currentLoginRole = role;
  
  // Activate selected button tab
  const roles = ['parent', 'teacher', 'admin'];
  roles.forEach(r => {
    const btn = document.getElementById(`role-tab-${r}`);
    if (btn) btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`role-tab-${role}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Fill credentials fields automatically (for demonstration evaluation)
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  if (usernameInput && passwordInput) {
    if (role === 'parent') {
      usernameInput.value = 'parent_hc_01';
    } else if (role === 'teacher') {
      usernameInput.value = 'teacher_hc_01';
    } else if (role === 'admin') {
      usernameInput.value = 'admin_hc_01';
    }
    passwordInput.value = '••••••••';
  }
}

function handleLogin(event) {
  event.preventDefault();
  showToast(`Welcome to Holy Cross Portal! Successfully authenticated.`, 'success');
  
  // Transition to Dashboard
  navigateTo('erp');
  changeActiveERPRole(currentLoginRole);
}

function logout() {
  showToast('Logged out of ERP session.', 'success');
  navigateTo('home');
}


// ==========================================
// 7. ERP DASHBOARD PANEL ROUTER
// ==========================================
let currentERPRole = 'parent';

function changeActiveERPRole(role) {
  currentERPRole = role;
  
  // Sync selector dropdown
  const selector = document.getElementById('erp-role-selector');
  if (selector) selector.value = role;

  // Sync sidebar navigation list groups
  const groups = ['parent', 'teacher', 'admin'];
  groups.forEach(g => {
    const el = document.getElementById(`sidebar-nav-${g}`);
    if (el) {
      if (g === role) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Set Profile Name & Avatar Label
  const label = document.getElementById('erp-active-role-label');
  const greeting = document.getElementById('erp-user-greeting');
  const profileName = document.getElementById('erp-user-profile-name');
  const avatarIcon = document.getElementById('erp-avatar-icon');

  if (role === 'parent') {
    if (label) label.innerText = 'Parent Portal';
    if (greeting) greeting.innerText = 'Welcome, Kishan Kumar!';
    if (profileName) profileName.innerText = 'Kishan Kumar (Parent)';
    if (avatarIcon) avatarIcon.innerText = 'K';
    switchERPView('parent-dashboard');
  } else if (role === 'teacher') {
    if (label) label.innerText = 'Teacher Portal';
    if (greeting) greeting.innerText = 'Welcome, Sr. Clara!';
    if (profileName) profileName.innerText = 'Sr. Clara (Class VIII-A Teacher)';
    if (avatarIcon) avatarIcon.innerText = 'C';
    switchERPView('teacher-dashboard');
  } else if (role === 'admin') {
    if (label) label.innerText = 'Administrator Portal';
    if (greeting) greeting.innerText = 'Welcome, Mother Superior!';
    if (profileName) profileName.innerText = 'Sr. Celine (Principal)';
    if (avatarIcon) avatarIcon.innerText = 'S';
    switchERPView('admin-dashboard');
  }

  // Update Current Date
  const dateLbl = document.getElementById('erp-date-label');
  if (dateLbl) {
    dateLbl.innerText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}

function switchERPView(panelId) {
  // Hide all panels, show targets
  const panels = document.querySelectorAll('.erp-panel');
  panels.forEach(p => {
    if (p.id === `erp-view-${panelId}`) {
      p.classList.remove('hidden');
      p.classList.add('active-panel');
    } else {
      p.classList.remove('active-panel');
      p.classList.add('hidden');
    }
  });

  // Toggle active class on sidebar lists
  const links = document.querySelectorAll('.sidebar-nav a');
  links.forEach(l => {
    if (l.getAttribute('onclick') && l.getAttribute('onclick').includes(`'${panelId}'`)) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });

  // Load appropriate panel modules
  loadPanelData(panelId);
}

function loadPanelData(panelId) {
  // Ensure we have latest data
  loadDb();

  switch (panelId) {
    case 'parent-dashboard':
      renderParentDashboardKPIs();
      renderParentDashboardGradesSummary();
      renderAnnouncements();
      break;
    case 'parent-marks':
      renderParentMarksView();
      break;
    case 'parent-fees':
      renderParentFeesView();
      break;
      
    case 'teacher-dashboard':
      renderTeacherDashboardKPIs();
      renderTeacherHomeworkList();
      break;
    case 'teacher-attendance':
      renderTeacherAttendanceTable();
      break;
    case 'teacher-grades':
      loadStudentGradesForEditing();
      break;
    case 'teacher-homework':
      const hwDue = document.getElementById('homework-due');
      if (hwDue) {
        hwDue.min = new Date().toISOString().split('T')[0];
      }
      break;
      
    case 'admin-dashboard':
      renderAdminDashboard();
      break;
    case 'admin-students':
      renderAdminStudentsTable();
      break;
    case 'admin-fees':
      populateAdminFeeStudentSelect();
      renderAdminFeeLedgerTable();
      break;
    case 'admin-announcements':
      renderAnnouncements();
      break;
  }
}


// ==========================================
// 8. PARENT DASHBOARD CONTROLLERS
// ==========================================
function renderParentDashboardKPIs() {
  const student = db.students.find(s => s.id === "HC-2026-0812"); // Default kid Rohit
  if (!student) return;

  const attendancePct = calculateAttendancePct(student);
  const attendanceEl = document.getElementById('parent-stat-attendance');
  if (attendanceEl) attendanceEl.innerText = `${attendancePct}%`;

  const totalPaid = student.fees.paid;
  const balanceDue = student.fees.totalDue - totalPaid;
  
  const feesEl = document.getElementById('parent-stat-fees');
  if (feesEl) feesEl.innerText = `₹${totalPaid.toLocaleString()} Paid`;

  const dueLbl = document.getElementById('parent-fees-due-lbl');
  if (dueLbl) {
    if (balanceDue > 0) {
      dueLbl.innerText = `₹${balanceDue.toLocaleString()} Balance Due`;
      dueLbl.className = 'text-warning';
    } else {
      dueLbl.innerText = `Fully Paid`;
      dueLbl.className = 'text-success';
    }
  }
}

function calculateAttendancePct(student) {
  if (!student.totalDaysCount || student.totalDaysCount === 0) return 100;
  return Math.round((student.presentDaysCount / student.totalDaysCount) * 1000) / 10;
}

function renderParentDashboardGradesSummary() {
  const student = db.students.find(s => s.id === "HC-2026-0812");
  const container = document.getElementById('parent-dashboard-grades-summary');
  
  if (!student || !container) return;

  container.innerHTML = Object.keys(student.grades).map(subj => {
    const info = student.grades[subj];
    const gradeLetter = calculateGradeLetter(info.marks, info.max);
    return `
      <div class="grade-summary-item">
        <div class="grade-subject">
          <h5>${subj}</h5>
          <p>${info.remarks || 'Regular progress'}</p>
        </div>
        <div class="grade-score">${info.marks}/${info.max} (${gradeLetter})</div>
      </div>
    `;
  }).join('');
}

function calculateGradeLetter(marks, max) {
  const pct = (marks / max) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  return 'D';
}

function renderParentMarksView() {
  const student = db.students.find(s => s.id === "HC-2026-0812");
  const tbody = document.getElementById('parent-report-card-table-body');
  
  if (!student || !tbody) return;

  let totalObtained = 0;
  let totalMax = 0;

  tbody.innerHTML = Object.keys(student.grades).map(subj => {
    const info = student.grades[subj];
    const gradeLetter = calculateGradeLetter(info.marks, info.max);
    totalObtained += info.marks;
    totalMax += info.max;
    
    return `
      <tr>
        <td><strong>${subj}</strong></td>
        <td>${info.max}</td>
        <td>${info.marks}</td>
        <td><span class="badge ${gradeLetter.startsWith('A') ? 'badge-success' : gradeLetter.startsWith('B') ? 'badge-warning' : 'badge-danger'}">${gradeLetter}</span></td>
        <td>${info.remarks || '-'}</td>
      </tr>
    `;
  }).join('');

  const pct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const roundedPct = Math.round(pct * 10) / 10;
  const overallGrade = calculateGradeLetter(totalObtained, totalMax);

  const pctEl = document.getElementById('report-overall-pct');
  const gradeEl = document.getElementById('report-overall-grade');
  
  if (pctEl) pctEl.innerText = `${roundedPct}%`;
  if (gradeEl) gradeEl.innerText = overallGrade;
}

function printReportCard() {
  window.print();
}

function renderParentFeesView() {
  const student = db.students.find(s => s.id === "HC-2026-0812");
  const tbody = document.getElementById('parent-fee-ledger-body');
  const dueAmtEl = document.getElementById('parent-fees-due-amount');

  if (!student || !tbody) return;

  const balance = student.fees.totalDue - student.fees.paid;
  if (dueAmtEl) dueAmtEl.innerText = `₹${balance.toLocaleString()}`;

  tbody.innerHTML = student.fees.ledger.map(item => {
    const statusClass = item.status === 'Paid' ? 'badge-success' : item.status === 'Partial' ? 'badge-warning' : 'badge-danger';
    const isPaid = item.status === 'Paid';
    return `
      <tr>
        <td><strong>${item.term}</strong></td>
        <td>₹${item.due.toLocaleString()}</td>
        <td>₹${item.paid.toLocaleString()}</td>
        <td><span class="badge ${statusClass}">${item.status}</span></td>
        <td>
          ${isPaid ? '<span class="text-success" style="font-weight:bold;">Paid ✓</span>' : 
          `<button class="btn btn-primary btn-sm" onclick="payFeeItem('${item.term}')">Pay Now</button>`}
        </td>
      </tr>
    `;
  }).join('');
}

function payFeeItem(term) {
  const student = db.students.find(s => s.id === "HC-2026-0812");
  if (!student) return;

  const item = student.fees.ledger.find(i => i.term === term);
  if (item) {
    const remaining = item.due - item.paid;
    if (remaining > 0) {
      item.paid = item.due;
      item.status = "Paid";
      student.fees.paid += remaining;
      
      saveDb();
      showToast(`Payment of ₹${remaining.toLocaleString()} for ${term} processed successfully!`);
      
      // Update UI panels
      renderParentFeesView();
      renderParentDashboardKPIs();
      logAdminActivity(`Term fee payment of ₹${remaining.toLocaleString()} recorded for student Rohit Kumar.`);
    }
  }
}


// ==========================================
// 9. TEACHER DASHBOARD CONTROLLERS
// ==========================================
function renderTeacherDashboardKPIs() {
  const presentCount = db.students.filter(s => s.attendanceHistory["June 21, 2026"] !== false).length;
  const statEl = document.getElementById('teacher-stat-attendance');
  if (statEl) {
    statEl.innerText = `${presentCount} / ${db.students.length} Present`;
  }
}

function renderTeacherHomeworkList() {
  const container = document.getElementById('teacher-dashboard-homework-list');
  if (!container) return;

  container.innerHTML = db.homework.map(hw => `
    <div class="homework-item">
      <div class="homework-header">
        <span class="subject">${hw.subject}</span>
        <span class="due">Due: ${hw.due}</span>
      </div>
      <p>${hw.desc}</p>
      <button class="btn btn-secondary btn-sm margin-top-small" onclick="teacherDeleteHomework(${hw.id})" style="color: var(--danger); border-color: var(--danger); padding: 2px 8px; font-size: 0.7rem;">Delete Task</button>
    </div>
  `).join('');
}

function teacherDeleteHomework(id) {
  db.homework = db.homework.filter(hw => hw.id !== id);
  saveDb();
  renderTeacherHomeworkList();
  showToast("Homework task deleted.");
}

function postNewHomework(event) {
  event.preventDefault();
  const subject = document.getElementById('homework-subject').value;
  const due = document.getElementById('homework-due').value;
  const desc = document.getElementById('homework-desc').value;

  const newHw = {
    id: db.homework.length + 1,
    subject: subject,
    desc: desc,
    due: due,
    assignedBy: "Sr. Clara"
  };

  db.homework.unshift(newHw);
  saveDb();

  showToast(`Homework assignment published for ${subject}.`);
  document.getElementById('homework-form').reset();
  renderTeacherHomeworkList();

  logAdminActivity(`New homework posted for subject ${subject} by Sr. Clara (Teacher).`);
}

function renderTeacherAttendanceTable() {
  const tbody = document.getElementById('teacher-attendance-table-body');
  if (!tbody) return;

  tbody.innerHTML = db.students.map(student => {
    const isPresent = student.attendanceHistory["June 21, 2026"] !== false;
    return `
      <tr>
        <td><strong>${student.id}</strong></td>
        <td>${student.name}</td>
        <td>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" class="attendance-check" data-student-id="${student.id}" style="width: 18px; height: 18px; cursor: pointer;" ${isPresent ? 'checked' : ''} onchange="toggleAttendanceText(this)">
            <span class="attendance-status-text ${isPresent ? 'text-success' : 'text-danger'}" style="font-weight: bold;">
              ${isPresent ? 'Present ✓' : 'Absent ✗'}
            </span>
          </label>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleAttendanceText(checkbox) {
  const textSpan = checkbox.nextElementSibling;
  if (checkbox.checked) {
    textSpan.innerText = 'Present ✓';
    textSpan.className = 'attendance-status-text text-success';
  } else {
    textSpan.innerText = 'Absent ✗';
    textSpan.className = 'attendance-status-text text-danger';
  }
}

function saveClassAttendance() {
  const checks = document.querySelectorAll('.attendance-check');
  
  checks.forEach(cb => {
    const studentId = cb.getAttribute('data-student-id');
    const isPresent = cb.checked;
    const student = db.students.find(s => s.id === studentId);
    
    if (student) {
      const wasPresentBefore = student.attendanceHistory["June 21, 2026"] !== false;
      const alreadyChecked = "June 21, 2026" in student.attendanceHistory;
      
      if (!alreadyChecked) {
        student.totalDaysCount += 1;
        if (isPresent) student.presentDaysCount += 1;
      } else if (isPresent !== wasPresentBefore) {
        if (isPresent) {
          student.presentDaysCount += 1;
        } else {
          student.presentDaysCount -= 1;
        }
      }
      
      student.attendanceHistory["June 21, 2026"] = isPresent;
      student.attendance = calculateAttendancePct(student);
    }
  });

  saveDb();
  showToast("Daily attendance recorded successfully!");
  renderTeacherDashboardKPIs();
  logAdminActivity("Class VIII-A daily attendance updated by Sr. Clara (Teacher).");
}

function loadStudentGradesForEditing() {
  const subject = document.getElementById('teacher-grade-subject-select').value;
  const tbody = document.getElementById('teacher-grades-table-body');
  if (!tbody) return;

  tbody.innerHTML = db.students.map(student => {
    const gradeInfo = student.grades[subject] || { marks: 0, max: 100 };
    return `
      <tr>
        <td><strong>${student.id}</strong></td>
        <td>${student.name}</td>
        <td>${gradeInfo.max}</td>
        <td>
          <input type="number" class="grade-input" data-student-id="${student.id}" min="0" max="${gradeInfo.max}" value="${gradeInfo.marks}" style="width: 80px; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px;">
        </td>
      </tr>
    `;
  }).join('');
}

function saveStudentGrades() {
  const subject = document.getElementById('teacher-grade-subject-select').value;
  const inputs = document.querySelectorAll('.grade-input');
  
  inputs.forEach(input => {
    const studentId = input.getAttribute('data-student-id');
    const marks = parseInt(input.value) || 0;
    const student = db.students.find(s => s.id === studentId);
    
    if (student) {
      if (!student.grades[subject]) {
        student.grades[subject] = { max: 100 };
      }
      student.grades[subject].marks = marks;
      
      // Auto remarks
      if (marks >= 90) student.grades[subject].remarks = "Outstanding performance";
      else if (marks >= 80) student.grades[subject].remarks = "Strong understanding";
      else if (marks >= 70) student.grades[subject].remarks = "Good progress, keep it up";
      else student.grades[subject].remarks = "Needs extra focus";
    }
  });

  saveDb();
  showToast(`Grades for ${subject} submitted successfully!`);
  logAdminActivity(`Grades for ${subject} updated by Sr. Clara (Teacher).`);
}


// ==========================================
// 10. ADMIN DASHBOARD CONTROLLERS
// ==========================================
function renderAdminDashboard() {
  const studentCountEl = document.getElementById('admin-stat-students-count');
  if (studentCountEl) studentCountEl.innerText = db.students.length;

  const totalPaid = db.students.reduce((sum, s) => sum + s.fees.paid, 0);
  const feesEl = document.getElementById('admin-stat-fees-collected');
  if (feesEl) feesEl.innerText = `₹${totalPaid.toLocaleString()}`;

  const noticeCountEl = document.getElementById('admin-stat-notices-count');
  if (noticeCountEl) noticeCountEl.innerText = `${db.announcements.length} Announcements`;

  renderAdminActivityLog();
}

function renderAdminActivityLog() {
  const container = document.getElementById('admin-activity-log');
  if (!container) return;

  container.innerHTML = db.logs.map(log => `
    <div class="log-item" style="margin-bottom: 8px;">
      📅 ${log.text} 
      <span style="font-size: 0.75rem; color: var(--text-muted); float: right; font-weight: bold;">
        ${log.time}
      </span>
    </div>
  `).join('');
}

function logAdminActivity(text) {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  db.logs.unshift({ text: text, time: dateStr });
  saveDb();
  
  // Refresh logs view if on admin screen
  renderAdminActivityLog();
}

function renderAdminStudentsTable() {
  const tbody = document.getElementById('admin-students-table-body');
  if (!tbody) return;

  tbody.innerHTML = db.students.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td>${s.name}</td>
      <td><span class="badge" style="background-color: var(--primary-light); color: white;">${s.grade}</span></td>
      <td>${s.parent}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="adminDeleteStudent('${s.id}')" style="color: var(--danger); border-color: var(--danger); padding: 4px 8px; font-size: 0.75rem;">Delete</button>
      </td>
    </tr>
  `).join('');
}

function filterStudentList() {
  const query = document.getElementById('student-search-input').value.toLowerCase();
  const rows = document.querySelectorAll('#admin-students-table-body tr');
  rows.forEach(r => {
    if (r.innerText.toLowerCase().includes(query)) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
}

function adminDeleteStudent(id) {
  const student = db.students.find(s => s.id === id);
  if (!student) return;

  if (confirm(`Are you sure you want to remove student "${student.name}" (${student.id})?`)) {
    db.students = db.students.filter(s => s.id !== id);
    saveDb();
    
    showToast(`Removed student ${student.name} from records.`);
    renderAdminStudentsTable();
    renderAdminDashboard();
    logAdminActivity(`Student ${student.name} (${id}) deleted by Administrator.`);
  }
}

function adminAddStudent(event) {
  event.preventDefault();
  const name = document.getElementById('new-student-name').value;
  const grade = document.getElementById('new-student-grade').value;
  const parent = document.getElementById('new-student-parent').value;
  const phone = document.getElementById('new-student-phone').value;

  const maxRoll = db.students.reduce((max, s) => {
    const parts = s.id.split('-');
    const num = parseInt(parts[parts.length - 1]);
    return num > max ? num : max;
  }, 812);

  const newId = `HC-2026-0${maxRoll + 1}`;

  const newStudent = {
    id: newId,
    name: name,
    grade: grade,
    parent: parent,
    phone: phone,
    attendance: 100,
    presentDaysCount: 170,
    totalDaysCount: 170,
    attendanceHistory: {},
    grades: {
      "Mathematics": { marks: 85, max: 100, remarks: "New Admission" },
      "Physics": { marks: 80, max: 100, remarks: "New Admission" },
      "English": { marks: 88, max: 100, remarks: "New Admission" },
      "Social Studies": { marks: 82, max: 100, remarks: "New Admission" }
    },
    fees: {
      totalDue: 50000,
      paid: 0,
      ledger: [
        { term: "Term 1 Admission Fee", due: 15000, paid: 0, status: "Pending" },
        { term: "Term 1 Tuition Fee", due: 15000, paid: 0, status: "Pending" },
        { term: "Term 2 Tuition Fee", due: 15000, paid: 0, status: "Pending" },
        { term: "Library & Lab Charges", due: 5000, paid: 0, status: "Pending" }
      ]
    }
  };

  db.students.push(newStudent);
  saveDb();

  showToast(`Registered student ${name} successfully! ID: ${newId}`);
  document.getElementById('add-student-form').reset();
  
  renderAdminStudentsTable();
  renderAdminDashboard();
  logAdminActivity(`Registered new student ${name} (ID: ${newId}) in Class ${grade}.`);
}

function populateAdminFeeStudentSelect() {
  const select = document.getElementById('fee-select-student');
  if (!select) return;

  select.innerHTML = db.students.map(s => `
    <option value="${s.id}">${s.name} (${s.id})</option>
  `).join('');
}

function renderAdminFeeLedgerTable() {
  const tbody = document.getElementById('admin-fee-ledger-table-body');
  if (!tbody) return;

  tbody.innerHTML = db.students.map(s => {
    const balance = s.fees.totalDue - s.fees.paid;
    const statusClass = balance === 0 ? 'badge-success' : s.fees.paid > 0 ? 'badge-warning' : 'badge-danger';
    const statusText = balance === 0 ? 'Fully Paid' : s.fees.paid > 0 ? 'Partial' : 'Unpaid';
    return `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.grade}</td>
        <td>₹${s.fees.paid.toLocaleString()}</td>
        <td>₹${balance.toLocaleString()}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');
}

function adminLogFeePayment(event) {
  event.preventDefault();
  const studentId = document.getElementById('fee-select-student').value;
  const amount = parseInt(document.getElementById('fee-amount').value) || 0;

  if (amount <= 0) {
    showToast("Please enter a valid payment amount.", "error");
    return;
  }

  const student = db.students.find(s => s.id === studentId);
  if (student) {
    let remaining = amount;

    // Apply FIFO to student fee ledger
    for (let i = 0; i < student.fees.ledger.length; i++) {
      const item = student.fees.ledger[i];
      const dueAmt = item.due - item.paid;
      
      if (dueAmt > 0) {
        if (remaining >= dueAmt) {
          item.paid = item.due;
          item.status = "Paid";
          remaining -= dueAmt;
        } else {
          item.paid += remaining;
          item.status = "Partial";
          remaining = 0;
          break;
        }
      }
    }

    student.fees.paid = student.fees.ledger.reduce((sum, item) => sum + item.paid, 0);
    saveDb();

    showToast(`Recorded fee collection of ₹${amount.toLocaleString()} for ${student.name}.`);
    document.getElementById('admin-log-fee-form').reset();
    
    renderAdminDashboard();
    renderAdminFeeLedgerTable();
    logAdminActivity(`Recorded payment of ₹${amount.toLocaleString()} for student ${student.name}.`);
  }
}

function adminPublishAnnouncement(event) {
  event.preventDefault();
  const title = document.getElementById('announce-title').value;
  const desc = document.getElementById('announce-desc').value;

  const newAnn = {
    id: db.announcements.length + 1,
    title: title,
    desc: desc,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: "Announcements"
  };

  db.announcements.unshift(newAnn);
  saveDb();

  showToast(`Broadcast notice: "${title}" published.`);
  document.getElementById('announcement-form').reset();
  
  renderAnnouncements();
  logAdminActivity(`Published new school notice: "${title}".`);
}

function adminDeleteAnnouncement(id) {
  db.announcements = db.announcements.filter(ann => ann.id !== id);
  saveDb();
  renderAnnouncements();
  showToast("Notice deleted.");
}


// ==========================================
// 11. UNIFIED NOTICE AND TIMELINE RENDERING
// ==========================================
function renderAnnouncements() {
  // Public homepage notice board
  const homeContainer = document.getElementById('home-notices-container');
  if (homeContainer) {
    homeContainer.innerHTML = db.announcements.slice(0, 3).map(ann => `
      <div class="notice-item">
        <span class="notice-date">${ann.date}</span>
        <h5>${ann.title}</h5>
        <p>${ann.desc}</p>
      </div>
    `).join('');
  }

  // Parent dashboard notices timeline
  const parentTimeline = document.getElementById('parent-dashboard-notices-timeline');
  if (parentTimeline) {
    parentTimeline.innerHTML = db.announcements.map(ann => `
      <div class="announce-item">
        <div class="announce-meta">
          <span>${ann.category}</span>
          <span>${ann.date}</span>
        </div>
        <h5>${ann.title}</h5>
        <p>${ann.desc}</p>
      </div>
    `).join('');
  }

  // Admin broadcast history timeline
  const adminTimeline = document.getElementById('admin-notices-timeline');
  if (adminTimeline) {
    adminTimeline.innerHTML = db.announcements.map(ann => `
      <div class="announce-item" style="position: relative; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid var(--border-color);">
        <div class="announce-meta">
          <span>${ann.category}</span>
          <span>${ann.date}</span>
        </div>
        <h5>${ann.title}</h5>
        <p style="margin-bottom: 8px;">${ann.desc}</p>
        <button class="btn btn-secondary btn-sm" onclick="adminDeleteAnnouncement(${ann.id})" style="color: var(--danger); border-color: var(--danger); padding: 2px 6px; font-size: 0.7rem;">Delete Notice</button>
      </div>
    `).join('');
  }
}


// ==========================================
// 12. INITIALIZATION ON WINDOW LOAD
// ==========================================
window.onload = function() {
  // Initialize DB instance
  loadDb();

  // Draw home notices
  renderAnnouncements();

  // Set default view on login roles
  switchLoginRole('parent');

  // Trigger routing to public home
  navigateTo('home');
};
