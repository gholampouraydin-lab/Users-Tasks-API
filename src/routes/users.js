const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at
});

router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, name, email, created_at FROM users ORDER BY id').all();
  return res.json({ data: users.map(publicUser) });
});

router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  if (user.id !== req.user.id) return res.status(403).json({ error: 'You can only view your own profile.' });
  return res.json({ data: publicUser(user) });
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (id !== req.user.id) return res.status(403).json({ error: 'You can only update your own profile.' });
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name and email are required.' });
  try {
    const result = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
      .run(String(name).trim(), String(email).trim().toLowerCase(), id);
    if (!result.changes) return res.status(404).json({ error: 'User not found.' });
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(id);
    return res.json({ data: publicUser(user) });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Email already exists.' });
    return res.status(500).json({ error: 'Could not update user.' });
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (id !== req.user.id) return res.status(403).json({ error: 'You can only delete your own account.' });
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return res.status(204).send();
});

module.exports = router;
