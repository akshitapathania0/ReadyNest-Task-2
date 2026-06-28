const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const { subject } = req.query;
  let result = [...db.notes];
  if (subject) result = result.filter(n => n.subject === subject);
  result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  res.json(result);
});

router.post('/', auth, adminOnly, (req, res) => {
  const { title, subject, description, fileType, semester } = req.body;
  if (!title || !subject) return res.status(400).json({ error: 'Title and subject required' });
  const note = {
    id: `note-${uuid()}`,
    title, subject, description,
    fileType: fileType || 'pdf',
    semester: semester || 5,
    uploadedBy: req.user.id,
    uploadedByName: req.user.name,
    uploadedAt: new Date().toISOString(),
    downloadUrl: '#'
  };
  db.notes.push(note);
  res.status(201).json(note);
});

router.delete('/:id', auth, adminOnly, (req, res) => {
  const idx = db.notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  db.notes.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
