const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');

// Remove existing database to ensure fresh start
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database at database.sqlite');
});

db.serialize(() => {
  // 1. Create tables
  db.run(`CREATE TABLE students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    parent TEXT NOT NULL,
    phone TEXT NOT NULL,
    attendance REAL NOT NULL,
    presentDaysCount INTEGER NOT NULL,
    totalDaysCount INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE attendance (
    student_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status INTEGER NOT NULL, -- 1 for present, 0 for absent
    PRIMARY KEY (student_id, date),
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE grades (
    student_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    marks INTEGER NOT NULL,
    max_marks INTEGER NOT NULL,
    remarks TEXT,
    PRIMARY KEY (student_id, subject),
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE fees (
    student_id TEXT NOT NULL,
    term TEXT NOT NULL,
    due INTEGER NOT NULL,
    paid INTEGER NOT NULL,
    status TEXT NOT NULL,
    PRIMARY KEY (student_id, term),
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE homework (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    assigned_by TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE admissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    description TEXT,
    status TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    time TEXT NOT NULL
  )`);

  console.log('Tables created successfully.');

  // 2. Seed Announcements
  const announcements = [
    {
      title: "Mid-term Examination Results Published",
      desc: "Academic reports for Mid-term assessments are now visible. Parents can view, print, and save the reports via the Parent ERP Portal.",
      date: "June 20, 2026",
      category: "Academics"
    },
    {
      title: "Admissions Open for Academic Year 2026-2027",
      desc: "Enrollment for classes Nursery to Grade IX is now open. Apply online or download the admissions brochure from our website.",
      date: "June 18, 2026",
      category: "Admissions"
    },
    {
      title: "Annual Science & Art Exhibition 2026",
      desc: "The school will host its annual Science & Art Exhibition on July 10th. Parents and guardians are cordially invited to encourage our students.",
      date: "June 15, 2026",
      category: "Events"
    }
  ];

  const stmtAnn = db.prepare(`INSERT INTO announcements (title, description, date, category) VALUES (?, ?, ?, ?)`);
  announcements.forEach(ann => {
    stmtAnn.run(ann.title, ann.desc, ann.date, ann.category);
  });
  stmtAnn.finalize();

  // 3. Seed Homework
  const homeworks = [
    {
      subject: "Mathematics",
      desc: "Solve exercise 4.2 (Quadratic equations) questions 1 to 10. Show all steps in your classwork notebook.",
      due: "2026-06-25",
      by: "Sr. Clara"
    },
    {
      subject: "Physics",
      desc: "Draw neat labeled diagrams of refraction of light through a prism and glass slab. Write explanations of refraction.",
      due: "2026-06-24",
      by: "Sr. Clara"
    },
    {
      subject: "English",
      desc: "Write an essay of 250 words about 'The Role of Youth in Combating Climate Change'. Focus on grammatical structure.",
      due: "2026-06-27",
      by: "Sr. Clara"
    }
  ];

  const stmtHw = db.prepare(`INSERT INTO homework (subject, description, due_date, assigned_by) VALUES (?, ?, ?, ?)`);
  homeworks.forEach(hw => {
    stmtHw.run(hw.subject, hw.desc, hw.due, hw.by);
  });
  stmtHw.finalize();

  // 4. Seed Students
  const students = [
    {
      id: "HC-2026-0812",
      name: "Rohit Kumar",
      grade: "VIII - A",
      parent: "Kishan Kumar",
      phone: "+91 98765 43210",
      attendance: 94.2,
      presentDaysCount: 161,
      totalDaysCount: 171
    },
    {
      id: "HC-2026-0813",
      name: "Anjali Gowda",
      grade: "VIII - A",
      parent: "Mahesh Gowda",
      phone: "+91 99001 12233",
      attendance: 91.2,
      presentDaysCount: 156,
      totalDaysCount: 171
    },
    {
      id: "HC-2026-0814",
      name: "Chetan Raju",
      grade: "VIII - A",
      parent: "Raju N",
      phone: "+91 98867 55443",
      attendance: 87.7,
      presentDaysCount: 150,
      totalDaysCount: 171
    },
    {
      id: "HC-2026-0815",
      name: "Sneha Swamy",
      grade: "VIII - A",
      parent: "Swamy Gowda",
      phone: "+91 94481 23456",
      attendance: 96.5,
      presentDaysCount: 165,
      totalDaysCount: 171
    }
  ];

  const stmtStud = db.prepare(`INSERT INTO students (id, name, grade, parent, phone, attendance, presentDaysCount, totalDaysCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  students.forEach(s => {
    stmtStud.run(s.id, s.name, s.grade, s.parent, s.phone, s.attendance, s.presentDaysCount, s.totalDaysCount);
  });
  stmtStud.finalize();

  // 5. Seed Attendance History for June 18, 19, 20, 21
  const attendanceHistory = [
    { student_id: "HC-2026-0812", date: "June 18, 2026", status: 1 },
    { student_id: "HC-2026-0812", date: "June 19, 2026", status: 0 },
    { student_id: "HC-2026-0812", date: "June 20, 2026", status: 1 },
    { student_id: "HC-2026-0812", date: "June 21, 2026", status: 1 },

    { student_id: "HC-2026-0813", date: "June 18, 2026", status: 1 },
    { student_id: "HC-2026-0813", date: "June 19, 2026", status: 1 },
    { student_id: "HC-2026-0813", date: "June 20, 2026", status: 1 },
    { student_id: "HC-2026-0813", date: "June 21, 2026", status: 1 },

    { student_id: "HC-2026-0814", date: "June 18, 2026", status: 1 },
    { student_id: "HC-2026-0814", date: "June 19, 2026", status: 1 },
    { student_id: "HC-2026-0814", date: "June 20, 2026", status: 1 },
    { student_id: "HC-2026-0814", date: "June 21, 2026", status: 0 },

    { student_id: "HC-2026-0815", date: "June 18, 2026", status: 1 },
    { student_id: "HC-2026-0815", date: "June 19, 2026", status: 1 },
    { student_id: "HC-2026-0815", date: "June 20, 2026", status: 1 },
    { student_id: "HC-2026-0815", date: "June 21, 2026", status: 1 }
  ];

  const stmtAtt = db.prepare(`INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)`);
  attendanceHistory.forEach(att => {
    stmtAtt.run(att.student_id, att.date, att.status);
  });
  stmtAtt.finalize();

  // 6. Seed Grades
  const grades = [
    { id: "HC-2026-0812", subj: "Mathematics", marks: 95, max: 100, remarks: "Outstanding problem solver" },
    { id: "HC-2026-0812", subj: "Physics", marks: 89, max: 100, remarks: "Great conceptual understanding" },
    { id: "HC-2026-0812", subj: "English", marks: 92, max: 100, remarks: "Excellent essay writing skills" },
    { id: "HC-2026-0812", subj: "Social Studies", marks: 94, max: 100, remarks: "Very active in discussions" },

    { id: "HC-2026-0813", subj: "Mathematics", marks: 82, max: 100, remarks: "Needs more practice on algebra" },
    { id: "HC-2026-0813", subj: "Physics", marks: 91, max: 100, remarks: "Excellent experimental skills" },
    { id: "HC-2026-0813", subj: "English", marks: 95, max: 100, remarks: "Brilliant creative writer" },
    { id: "HC-2026-0813", subj: "Social Studies", marks: 88, max: 100, remarks: "Good performance overall" },

    { id: "HC-2026-0814", subj: "Mathematics", marks: 74, max: 100, remarks: "Struggles with geometry" },
    { id: "HC-2026-0814", subj: "Physics", marks: 78, max: 100, remarks: "Needs to concentrate more" },
    { id: "HC-2026-0814", subj: "English", marks: 80, max: 100, remarks: "Active participation in class" },
    { id: "HC-2026-0814", subj: "Social Studies", marks: 85, max: 100, remarks: "Shows good interest in history" },

    { id: "HC-2026-0815", subj: "Mathematics", marks: 98, max: 100, remarks: "Exceptional analytical skills" },
    { id: "HC-2026-0815", subj: "Physics", marks: 96, max: 100, remarks: "Highest score in class" },
    { id: "HC-2026-0815", subj: "English", marks: 91, max: 100, remarks: "Enthusiastic and articulate" },
    { id: "HC-2026-0815", subj: "Social Studies", marks: 93, max: 100, remarks: "Thorough work" }
  ];

  const stmtGrd = db.prepare(`INSERT INTO grades (student_id, subject, marks, max_marks, remarks) VALUES (?, ?, ?, ?, ?)`);
  grades.forEach(g => {
    stmtGrd.run(g.id, g.subj, g.marks, g.max, g.remarks);
  });
  stmtGrd.finalize();

  // 7. Seed Fees
  const fees = [
    { id: "HC-2026-0812", term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0812", term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0812", term: "Term 2 Tuition Fee", due: 15000, paid: 12500, status: "Partial" },
    { id: "HC-2026-0812", term: "Library & Lab Charges", due: 5000, paid: 0, status: "Pending" },

    { id: "HC-2026-0813", term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0813", term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0813", term: "Term 2 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0813", term: "Library & Lab Charges", due: 5000, paid: 5000, status: "Paid" },

    { id: "HC-2026-0814", term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0814", term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0814", term: "Term 2 Tuition Fee", due: 15000, paid: 0, status: "Pending" },
    { id: "HC-2026-0814", term: "Library & Lab Charges", due: 5000, paid: 0, status: "Pending" },

    { id: "HC-2026-0815", term: "Term 1 Admission Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0815", term: "Term 1 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0815", term: "Term 2 Tuition Fee", due: 15000, paid: 15000, status: "Paid" },
    { id: "HC-2026-0815", term: "Library & Lab Charges", due: 5000, paid: 0, status: "Pending" }
  ];

  const stmtFee = db.prepare(`INSERT INTO fees (student_id, term, due, paid, status) VALUES (?, ?, ?, ?, ?)`);
  fees.forEach(f => {
    stmtFee.run(f.id, f.term, f.due, f.paid, f.status);
  });
  stmtFee.finalize();

  // 8. Seed Admissions
  db.run(`INSERT INTO admissions (student_name, parent_name, grade, phone, email, description, status) VALUES (
    'Aditya Kumar', 'Sanjay Kumar', 'Grade 6', '9876540001', 'sanjay@gmail.com', 'Transferring from Bangalore International School.', 'Enquiry Received'
  )`);

  // 9. Seed Logs
  const logs = [
    { text: "Class VIII-A attendance submitted by Sr. Clara (Teacher).", time: "Jun 21, 2026" },
    { text: "Term II Fee paid for student Rohit Kumar by Kishan (Parent).", time: "Jun 20, 2026" },
    { text: "Exam timetable notice published by admin.", time: "Jun 19, 2026" }
  ];

  const stmtLog = db.prepare(`INSERT INTO logs (text, time) VALUES (?, ?)`);
  logs.forEach(l => {
    stmtLog.run(l.text, l.time);
  });
  stmtLog.finalize();

  console.log('Database seeded successfully.');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database closed.');
  }
});
