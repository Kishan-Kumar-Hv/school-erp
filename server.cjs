const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.sqlite');

// Connect to SQLite Database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite:', err);
  } else {
    console.log('Connected to SQLite database at database.sqlite');
  }
});

// Create class_subjects table on startup
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS class_subjects (
    class_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    PRIMARY KEY (class_name, subject_name)
  )`);
  
  // Seed default subjects if table is empty
  db.get('SELECT COUNT(*) as count FROM class_subjects', [], (err, row) => {
    if (!err && row && row.count === 0) {
      const classes = ['Preschool', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
      const defaultSubjects = ['Mathematics', 'Physics', 'English', 'Social Studies'];
      
      db.serialize(() => {
        const stmt = db.prepare('INSERT INTO class_subjects (class_name, subject_name) VALUES (?, ?)');
        classes.forEach(cls => {
          defaultSubjects.forEach(sub => {
            stmt.run(cls, sub);
          });
        });
        stmt.finalize();
        console.log('Default class subjects seeded.');
      });
    }
  });
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Helpers
function getTodayDateString() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ==========================================
// 1. ANNOUNCEMENTS API
// ==========================================
app.get('/api/announcements', (req, res) => {
  db.all('SELECT * FROM announcements ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/announcements', (req, res) => {
  const { title, description, category } = req.body;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Missing title, description, or category' });
  }

  db.run(
    'INSERT INTO announcements (title, description, date, category) VALUES (?, ?, ?, ?)',
    [title, description, dateStr, category],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, description, date: dateStr, category });
    }
  );
});

app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM announcements WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Announcement deleted successfully', count: this.changes });
  });
});

// ==========================================
// 2. HOMEWORK API
// ==========================================
app.get('/api/homework', (req, res) => {
  db.all('SELECT * FROM homework ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/homework', (req, res) => {
  const { subject, description, due_date, assigned_by } = req.body;

  if (!subject || !description || !due_date || !assigned_by) {
    return res.status(400).json({ error: 'Missing required homework fields' });
  }

  db.run(
    'INSERT INTO homework (subject, description, due_date, assigned_by) VALUES (?, ?, ?, ?)',
    [subject, description, due_date, assigned_by],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, subject, description, due_date, assigned_by });
    }
  );
});

app.delete('/api/homework/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM homework WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Homework deleted successfully', count: this.changes });
  });
});

// ==========================================
// 3. STUDENTS API
// ==========================================
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/students', (req, res) => {
  const { id, name, grade, parent, phone } = req.body;

  if (!id || !name || !grade || !parent || !phone) {
    return res.status(400).json({ error: 'Missing required student details' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Insert student
    db.run(
      'INSERT INTO students (id, name, grade, parent, phone, attendance, presentDaysCount, totalDaysCount) VALUES (?, ?, ?, ?, ?, 100.0, 170, 170)',
      [id, name, grade, parent, phone],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }

        // Insert default grades based on class subjects
        db.all('SELECT subject_name FROM class_subjects WHERE class_name = ?', [grade], (subErr, subRows) => {
          let subjects = ['Mathematics', 'Physics', 'English', 'Social Studies']; // Fallback
          if (!subErr && subRows && subRows.length > 0) {
            subjects = subRows.map(r => r.subject_name);
          }
          
          const stmtGrade = db.prepare('INSERT INTO grades (student_id, subject, marks, max_marks, remarks) VALUES (?, ?, 80, 100, ?)');
          subjects.forEach(subj => {
            stmtGrade.run(id, subj, 'New Admission');
          });
          stmtGrade.finalize();
        });

        // Insert default fees ledger
        const fees = [
          { term: "Term 1 Admission Fee", due: 15000 },
          { term: "Term 1 Tuition Fee", due: 15000 },
          { term: "Term 2 Tuition Fee", due: 15000 },
          { term: "Library & Lab Charges", due: 5000 }
        ];
        const stmtFee = db.prepare('INSERT INTO fees (student_id, term, due, paid, status) VALUES (?, ?, ?, 0, "Pending")');
        fees.forEach(f => {
          stmtFee.run(id, f.term, f.due);
        });
        stmtFee.finalize();

        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            return res.status(500).json({ error: commitErr.message });
          }
          res.json({ message: 'Student registered successfully', id, name, grade, parent, phone });
        });
      }
    );
  });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted successfully', count: this.changes });
  });
});

// ==========================================
// 4. ATTENDANCE API
// ==========================================
app.get('/api/attendance', (req, res) => {
  db.all('SELECT * FROM attendance', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/students/:student_id/attendance', (req, res) => {
  const { student_id } = req.params;
  db.all('SELECT * FROM attendance WHERE student_id = ?', [student_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/attendance', (req, res) => {
  const { date, attendance } = req.body; // attendance: [{ student_id, status: true/false }]

  if (!date || !attendance || !Array.isArray(attendance)) {
    return res.status(400).json({ error: 'Missing date or attendance array' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    let processedCount = 0;
    let hasError = false;

    attendance.forEach(att => {
      const { student_id, status } = att;
      const statusCode = status ? 1 : 0;

      // Check if attendance already marked for this date
      db.get(
        'SELECT status FROM attendance WHERE student_id = ? AND date = ?',
        [student_id, date],
        (selectErr, existingRecord) => {
          if (hasError) return;

          if (selectErr) {
            hasError = true;
            db.run('ROLLBACK');
            return res.status(500).json({ error: selectErr.message });
          }

          if (existingRecord !== undefined) {
            // Status changed
            if (existingRecord.status !== statusCode) {
              db.run(
                'UPDATE attendance SET status = ? WHERE student_id = ? AND date = ?',
                [statusCode, student_id, date],
                (updateErr) => {
                  if (hasError) return;
                  if (updateErr) {
                    hasError = true;
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: updateErr.message });
                  }

                  // Update student present count
                  const diff = statusCode - existingRecord.status; // 1 - 0 = +1 (absent->present) or 0 - 1 = -1 (present->absent)
                  db.run(
                    'UPDATE students SET presentDaysCount = presentDaysCount + ? WHERE id = ?',
                    [diff, student_id],
                    (studentUpdateErr) => {
                      if (hasError) return;
                      if (studentUpdateErr) {
                        hasError = true;
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: studentUpdateErr.message });
                      }
                      
                      recalculateAttendancePercentage(student_id);
                    }
                  );
                }
              );
            } else {
              checkFinished();
            }
          } else {
            // Insert new record
            db.run(
              'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
              [student_id, date, statusCode],
              (insertErr) => {
                if (hasError) return;
                if (insertErr) {
                  hasError = true;
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: insertErr.message });
                }

                // Increment total counts and present counts
                db.run(
                  'UPDATE students SET totalDaysCount = totalDaysCount + 1, presentDaysCount = presentDaysCount + ? WHERE id = ?',
                  [statusCode, student_id],
                  (studentInsertUpdateErr) => {
                    if (hasError) return;
                    if (studentInsertUpdateErr) {
                      hasError = true;
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: studentInsertUpdateErr.message });
                    }
                    
                    recalculateAttendancePercentage(student_id);
                  }
                );
              }
            );
          }
        }
      );
      
      function recalculateAttendancePercentage(studId) {
        db.run(
          'UPDATE students SET attendance = ROUND(CAST(presentDaysCount AS REAL) / CAST(totalDaysCount AS REAL) * 100.0, 1) WHERE id = ?',
          [studId],
          (recalcErr) => {
            if (hasError) return;
            if (recalcErr) {
              hasError = true;
              db.run('ROLLBACK');
              return res.status(500).json({ error: recalcErr.message });
            }
            checkFinished();
          }
        );
      }

      function checkFinished() {
        processedCount++;
        if (processedCount === attendance.length && !hasError) {
          db.run('COMMIT', (commitErr) => {
            if (commitErr) {
              return res.status(500).json({ error: commitErr.message });
            }
            res.json({ message: 'Attendance sheet submitted successfully' });
          });
        }
      }
    });
  });
});

// ==========================================
// 5. GRADES API
// ==========================================
app.get('/api/grades', (req, res) => {
  db.all('SELECT * FROM grades', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/grades', (req, res) => {
  const { subject, max_marks, grades } = req.body; // grades: [{ student_id, marks }]
  const maxMarksVal = max_marks ? parseInt(max_marks) : 100;

  if (!subject || !grades || !Array.isArray(grades)) {
    return res.status(400).json({ error: 'Missing subject or grades array' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const stmt = db.prepare(`
      INSERT INTO grades (student_id, subject, marks, max_marks, remarks) 
      VALUES (?, ?, ?, ?, ?) 
      ON CONFLICT(student_id, subject) DO UPDATE SET 
        marks = excluded.marks, 
        max_marks = excluded.max_marks,
        remarks = excluded.remarks
    `);

    let hasError = false;

    grades.forEach(g => {
      if (hasError) return;
      const { student_id, marks } = g;
      const score = parseInt(marks) || 0;

      // Calculate automatic remarks based on percentage
      const percentage = (score / maxMarksVal) * 100;
      let remarks = 'Needs extra focus';
      if (percentage >= 90) remarks = 'Outstanding performance';
      else if (percentage >= 80) remarks = 'Strong understanding';
      else if (percentage >= 70) remarks = 'Good progress, keep it up';

      stmt.run(student_id, subject, score, maxMarksVal, remarks, (err) => {
        if (err) {
          hasError = true;
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
      });
    });

    if (!hasError) {
      stmt.finalize(() => {
        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            return res.status(500).json({ error: commitErr.message });
          }
          res.json({ message: `Grades for ${subject} updated successfully` });
        });
      });
    }
  });
});

// ==========================================
// 6. FEES API
// ==========================================
app.get('/api/fees', (req, res) => {
  // Returns detailed fee ledger joined with student info
  const query = `
    SELECT f.*, s.name as student_name, s.grade as student_grade 
    FROM fees f 
    JOIN students s ON f.student_id = s.id
    ORDER BY s.id ASC, f.term ASC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/students/:student_id/fees', (req, res) => {
  const { student_id } = req.params;
  db.all('SELECT * FROM fees WHERE student_id = ?', [student_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Pay specific fee item
app.post('/api/fees/pay', (req, res) => {
  const { student_id, term } = req.body;

  if (!student_id || !term) {
    return res.status(400).json({ error: 'Missing student_id or term' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Get specific fee record
    db.get(
      'SELECT due, paid, term FROM fees WHERE student_id = ? AND term = ?',
      [student_id, term],
      (selectErr, feeItem) => {
        if (selectErr) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: selectErr.message });
        }

        if (!feeItem) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Fee item not found' });
        }

        const remaining = feeItem.due - feeItem.paid;
        if (remaining <= 0) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Fee is already fully paid' });
        }

        // Update fee item
        db.run(
          'UPDATE fees SET paid = due, status = "Paid" WHERE student_id = ? AND term = ?',
          [student_id, term],
          (updateErr) => {
            if (updateErr) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: updateErr.message });
            }

            // Log activity
            db.run(
              'INSERT INTO logs (text, time) VALUES (?, ?)',
              [`Term fee payment of ₹${remaining.toLocaleString()} recorded for student ID ${student_id} (${term}).`, getTodayDateString()],
              (logErr) => {
                if (logErr) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: logErr.message });
                }

                db.run('COMMIT', (commitErr) => {
                  if (commitErr) return res.status(500).json({ error: commitErr.message });
                  res.json({ message: `Successfully paid ₹${remaining} for ${term}`, paidAmount: remaining });
                });
              }
            );
          }
        );
      }
    );
  });
});

// Admin Log general fee payment (FIFO allocation)
app.post('/api/fees/collect', (req, res) => {
  const { student_id, amount } = req.body;

  if (!student_id || amount <= 0) {
    return res.status(400).json({ error: 'Invalid student_id or amount' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Get all fee items for student
    db.all(
      'SELECT term, due, paid FROM fees WHERE student_id = ? ORDER BY term ASC',
      [student_id],
      (selectErr, rows) => {
        if (selectErr) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: selectErr.message });
        }

        let remainingAmount = amount;
        let processedCount = 0;
        let hasError = false;

        rows.forEach(item => {
          if (hasError || remainingAmount <= 0) return;

          const dueLeft = item.due - item.paid;
          if (dueLeft > 0) {
            let nextPaid = item.paid;
            let nextStatus = 'Pending';

            if (remainingAmount >= dueLeft) {
              nextPaid = item.due;
              nextStatus = 'Paid';
              remainingAmount -= dueLeft;
            } else {
              nextPaid += remainingAmount;
              nextStatus = 'Partial';
              remainingAmount = 0;
            }

            db.run(
              'UPDATE fees SET paid = ?, status = ? WHERE student_id = ? AND term = ?',
              [nextPaid, nextStatus, student_id, item.term],
              (updateErr) => {
                if (hasError) return;
                if (updateErr) {
                  hasError = true;
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: updateErr.message });
                }
              }
            );
          }
        });

        if (!hasError) {
          // Log payment
          db.run(
            'INSERT INTO logs (text, time) VALUES (?, ?)',
            [`Recorded general fee payment of ₹${amount.toLocaleString()} for student ID ${student_id}.`, getTodayDateString()],
            (logErr) => {
              if (logErr) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: logErr.message });
              }

              db.run('COMMIT', (commitErr) => {
                if (commitErr) return res.status(500).json({ error: commitErr.message });
                res.json({ message: `Successfully allocated general payment of ₹${amount}` });
              });
            }
          );
        }
      }
    );
  });
});

// ==========================================
// 7. ADMISSIONS & ENQUIRIES API
// ==========================================
app.get('/api/admissions', (req, res) => {
  db.all('SELECT * FROM admissions ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admissions', (req, res) => {
  const { studentName, parentName, grade, phone, email, desc } = req.body;

  if (!studentName || !parentName || !grade || !phone) {
    return res.status(400).json({ error: 'Missing required enquiry details' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run(
      'INSERT INTO admissions (student_name, parent_name, grade, phone, email, description, status) VALUES (?, ?, ?, ?, ?, ?, "Enquiry Received")',
      [studentName, parentName, grade, phone, email, desc],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }

        // Add to logs
        db.run(
          'INSERT INTO logs (text, time) VALUES (?, ?)',
          [`Admission enquiry received for ${studentName} (Class ${grade}) from parent ${parentName}.`, getTodayDateString()],
          (logErr) => {
            if (logErr) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: logErr.message });
            }

            db.run('COMMIT', (commitErr) => {
              if (commitErr) return res.status(500).json({ error: commitErr.message });
              res.json({ message: 'Admission enquiry recorded successfully', id: this.lastID });
            });
          }
        );
      }
    );
  });
});

// ==========================================
// 8. LOGS / ACTIVITY HISTORY API
// ==========================================
app.get('/api/logs', (req, res) => {
  db.all('SELECT * FROM logs ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ==========================================
// 9. CLASS SUBJECTS API
// ==========================================
app.get('/api/class-subjects', (req, res) => {
  db.all('SELECT * FROM class_subjects ORDER BY class_name ASC, subject_name ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/class-subjects', (req, res) => {
  const { class_name, subjects } = req.body;
  if (!class_name || !Array.isArray(subjects)) {
    return res.status(400).json({ error: 'Missing class_name or subjects array' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    db.run('DELETE FROM class_subjects WHERE class_name = ?', [class_name], (delErr) => {
      if (delErr) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: delErr.message });
      }

      const stmt = db.prepare('INSERT INTO class_subjects (class_name, subject_name) VALUES (?, ?)');
      subjects.forEach(sub => {
        stmt.run(class_name, sub);
      });

      stmt.finalize((finalErr) => {
        if (finalErr) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: finalErr.message });
        }
        db.run('COMMIT', (commitErr) => {
          if (commitErr) return res.status(500).json({ error: commitErr.message });
          res.json({ message: `Successfully updated subjects for ${class_name}`, class_name, subjects });
        });
      });
    });
  });
});

// Fallback: serve index.html for non-api routes to support direct URL entries and page refreshes
app.get('*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Holy Cross Server running on http://localhost:${PORT}`);
});
