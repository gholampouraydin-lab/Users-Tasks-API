const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);
const validStatuses = ['pending', 'in_progress', 'completed'];
const toTask = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status,
  userId: row.user_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  return res.json({ data: rows.map(toTask) });
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Task not found.' });
  return res.json({ data: toTask(row) });
});

router.post('/', (req, res) => {
  const { title, description = '', status = 'pending' } = req.body || {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required.' });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'status must be pending, in_progress or completed.' });
  }
  const result = db.prepare(
    'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)'
  ).run(title.trim(), String(description), status, req.user.id);
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ data: toTask(row) });
});

router.put('/:id', (req, res) => {
  const { title, description = '', status = 'pending' } = req.body || {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required.' });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'status must be pending, in_progress or completed.' });
  }
  const result = db.prepare(
    'UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
  ).run(title.trim(), String(description), status, req.params.id, req.user.id);
  if (!result.changes) return res.status(404).json({ error: 'Task not found.' });
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  return res.json({ data: toTask(row) });
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!result.changes) return res.status(404).json({ error: 'Task not found.' });
  return res.status(204).send();
});

router.get('/user/:userId', (req, res) => {
  if (Number(req.params.userId) !== req.user.id) {
    return res.status(403).json({ error: 'You can only view your own tasks.' });
  }
  const rows = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  return res.json({ data: rows.map(toTask) });
});

module.exports = router;
