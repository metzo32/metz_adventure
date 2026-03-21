const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { title, category, due_date, memo } = req.body;
  const result = db.prepare(
    'INSERT INTO todos (title, category, due_date, memo) VALUES (?, ?, ?, ?)'
  ).run(title, category || '출발 준비', due_date || null, memo || '');
  res.status(201).json(db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid));
});

router.patch('/:id', (req, res) => {
  const { title, category, due_date, memo, is_completed } = req.body;
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
  db.prepare(
    'UPDATE todos SET title=?, category=?, due_date=?, memo=?, is_completed=? WHERE id=?'
  ).run(
    title ?? existing.title,
    category ?? existing.category,
    due_date ?? existing.due_date,
    memo ?? existing.memo,
    is_completed ?? existing.is_completed,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
