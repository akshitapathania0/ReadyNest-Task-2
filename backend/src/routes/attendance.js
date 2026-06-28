const router = require('express').Router();
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// GET /attendance — student gets own, admin can pass ?studentId=
router.get('/', auth, (req, res) => {
  const studentId = req.user.role === 'admin'
    ? (req.query.studentId || 'student-001')
    : req.user.id;
  const records = db.attendance[studentId] || [];
  res.json(records.map(r => ({
    ...r,
    percentage: r.total > 0 ? Math.round((r.present / r.total) * 100) : 0
  })));
});

// GET /attendance/all — admin: returns every student's full attendance map
router.get('/all', auth, adminOnly, (req, res) => {
  const students = db.users.filter(u => u.role === 'student').map(({ password, ...s }) => s);
  const result = students.map(s => ({
    student: s,
    records: (db.attendance[s.id] || []).map(r => ({
      ...r,
      percentage: r.total > 0 ? Math.round((r.present / r.total) * 100) : 0
    }))
  }));
  res.json(result);
});

// POST /attendance/mark — admin marks a single class for a student (present or absent)
// body: { studentId, subject, present: true|false }
router.post('/mark', auth, adminOnly, (req, res) => {
  const { studentId, subject, present } = req.body;
  if (!studentId || !subject || present === undefined)
    return res.status(400).json({ error: 'studentId, subject and present are required.' });

  if (!db.attendance[studentId]) db.attendance[studentId] = [];
  let record = db.attendance[studentId].find(r => r.subject === subject);
  if (!record) {
    record = { subject, total: 0, present: 0 };
    db.attendance[studentId].push(record);
  }
  record.total += 1;
  if (present) record.present += 1;

  const percentage = record.total > 0 ? Math.round((record.present / record.total) * 100) : 0;
  res.json({ ...record, percentage });
});

// PUT /attendance/:studentId — admin bulk-update totals/present for a subject
router.put('/:studentId', auth, adminOnly, (req, res) => {
  const { studentId } = req.params;
  const { subject, present, total } = req.body;
  if (!db.attendance[studentId]) db.attendance[studentId] = [];
  const record = db.attendance[studentId].find(r => r.subject === subject);
  if (record) {
    record.present = present;
    record.total = total;
  } else {
    db.attendance[studentId].push({ subject, present, total });
  }
  res.json({ message: 'Updated' });
});

module.exports = router;
