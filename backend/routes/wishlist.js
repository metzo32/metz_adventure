const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM wishlist ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { title, category, memo, link, priority } = req.body;
  const result = db.prepare(
    'INSERT INTO wishlist (title, category, memo, link, priority) VALUES (?, ?, ?, ?, ?)'
  ).run(title, category || '기타', memo || '', link || '', priority || 1);
  const row = db.prepare('SELECT * FROM wishlist WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

router.patch('/:id', (req, res) => {
  const { title, category, memo, link, priority, is_done } = req.body;
  const existing = db.prepare('SELECT * FROM wishlist WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
  db.prepare(
    'UPDATE wishlist SET title=?, category=?, memo=?, link=?, priority=?, is_done=? WHERE id=?'
  ).run(
    title ?? existing.title,
    category ?? existing.category,
    memo ?? existing.memo,
    link ?? existing.link,
    priority ?? existing.priority,
    is_done ?? existing.is_done,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM wishlist WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM wishlist WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
