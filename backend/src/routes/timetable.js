const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

router.get('/', auth, (req, res) => {
  const semester = parseInt(req.query.semester) || 5;
  const entries = db.timetable.filter(t => t.semester === semester);
  // Group by day
  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = entries.filter(e => e.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});
  res.json(grouped);
});

router.post('/', auth, adminOnly, (req, res) => {
  const { day, startTime, endTime, subject, teacher, room, semester } = req.body;
  if (!day || !startTime || !endTime || !subject) return res.status(400).json({ error: 'Missing required fields' });
  const entry = { id: `tt-${uuid()}`, day, startTime, endTime, subject, teacher, room, semester: semester || 5 };
  db.timetable.push(entry);
  res.status(201).json(entry);
});

router.delete('/:id', auth, adminOnly, (req, res) => {
  const idx = db.timetable.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Entry not found' });
  db.timetable.splice(idx, 1);
  res.json({ message: 'Entry deleted' });
});

module.exports = router;
