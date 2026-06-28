const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { auth, JWT_SECRET } = require('../middleware/auth');

// ── Login ──────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  const { password: _, ...userSafe } = user;
  res.json({ token, user: userSafe });
});

// ── Sign Up ────────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password, role, department, course, semester, rollNo } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ error: 'Name, email, password and role are required.' });
  if (!['admin', 'student'].includes(role))
    return res.status(400).json({ error: 'Role must be "admin" or "student".' });
  if (db.users.find(u => u.email === email))
    return res.status(409).json({ error: 'An account with this email already exists.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const id = `${role}-${Date.now()}`;

  const newUser = {
    id, name, email,
    password: bcrypt.hashSync(password, 10),
    role, avatar: initials,
    ...(role === 'admin'
      ? { department: department || 'General' }
      : { course: course || 'B.Tech', semester: semester ? Number(semester) : 1, rollNo: rollNo || `ROLL${Date.now()}` }),
  };

  db.users.push(newUser);
  const token = jwt.sign({ id: newUser.id, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '24h' });
  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ token, user: userSafe });
});

// ── Me ─────────────────────────────────────────────────────────────────────────
router.get('/me', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...userSafe } = user;
  res.json(userSafe);
});

// ── Update Profile ─────────────────────────────────────────────────────────────
router.put('/profile', auth, (req, res) => {
  const { name, email, currentPassword, newPassword, department, course, semester, rollNo } = req.body;

  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Email uniqueness check (ignore own email)
  if (email && email !== user.email && db.users.find(u => u.email === email))
    return res.status(409).json({ error: 'That email is already taken.' });

  // Password change — requires currentPassword
  if (newPassword) {
    if (!currentPassword)
      return res.status(400).json({ error: 'Current password is required to set a new one.' });
    if (!bcrypt.compareSync(currentPassword, user.password))
      return res.status(401).json({ error: 'Current password is incorrect.' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    user.password = bcrypt.hashSync(newPassword, 10);
  }

  // Update fields
  if (name)  { user.name = name; user.avatar = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
  if (email) user.email = email;

  if (user.role === 'admin') {
    if (department !== undefined) user.department = department;
  } else {
    if (course   !== undefined) user.course   = course;
    if (semester !== undefined) user.semester = Number(semester);
    if (rollNo   !== undefined) user.rollNo   = rollNo;
  }

  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe });
});

module.exports = router;
