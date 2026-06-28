const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const sorted = [...db.notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

router.post('/', auth, adminOnly, (req, res) => {
  const { title, content, category, priority, targetAudience } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  const notice = {
    id: `notice-${uuid()}`,
    title, content,
    category: category || 'general',
    priority: priority || 'medium',
    targetAudience: targetAudience || 'all',
    createdBy: req.user.id,
    createdByName: req.user.name,
    createdAt: new Date().toISOString()
  };
  db.notices.push(notice);
  res.status(201).json(notice);
});

router.delete('/:id', auth, adminOnly, (req, res) => {
  const idx = db.notices.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Notice not found' });
  db.notices.splice(idx, 1);
  res.json({ message: 'Notice deleted' });
});

module.exports = router;
