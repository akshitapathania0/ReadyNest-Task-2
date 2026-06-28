const router = require('express').Router();
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, (req, res) => {
  const students = db.users.filter(u => u.role === 'student').map(({ password, ...s }) => s);
  res.json(students);
});

module.exports = router;
