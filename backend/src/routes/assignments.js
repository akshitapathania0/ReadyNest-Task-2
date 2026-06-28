const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  if (req.user.role === 'admin') return res.json(db.assignments);
  // For students, annotate with their submission status
  const result = db.assignments.map(a => {
    const sub = a.submissions.find(s => s.studentId === req.user.id);
    return { ...a, mySubmission: sub || null };
  });
  res.json(result);
});

router.post('/', auth, adminOnly, (req, res) => {
  const { title, subject, description, dueDate, totalMarks, semester } = req.body;
  if (!title || !subject || !dueDate) return res.status(400).json({ error: 'Missing required fields' });
  const assignment = {
    id: `assign-${uuid()}`,
    title, subject, description,
    dueDate, totalMarks: totalMarks || 10,
    semester: semester || 5,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    submissions: []
  };
  db.assignments.push(assignment);
  res.status(201).json(assignment);
});

// Submit assignment (student)
router.post('/:id/submit', auth, (req, res) => {
  const assignment = db.assignments.find(a => a.id === req.params.id);
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  const existing = assignment.submissions.find(s => s.studentId === req.user.id);
  if (existing) return res.status(400).json({ error: 'Already submitted' });
  const submission = { studentId: req.user.id, submittedAt: new Date().toISOString(), marks: null, status: 'submitted' };
  assignment.submissions.push(submission);
  res.json({ message: 'Submitted successfully', submission });
});

// Grade submission (admin)
router.patch('/:id/grade/:studentId', auth, adminOnly, (req, res) => {
  const assignment = db.assignments.find(a => a.id === req.params.id);
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  const sub = assignment.submissions.find(s => s.studentId === req.params.studentId);
  if (!sub) return res.status(404).json({ error: 'Submission not found' });
  sub.marks = req.body.marks;
  sub.status = 'graded';
  res.json({ message: 'Graded', submission: sub });
});

router.delete('/:id', auth, adminOnly, (req, res) => {
  const idx = db.assignments.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Assignment not found' });
  db.assignments.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
