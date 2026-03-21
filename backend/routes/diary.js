const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM diary ORDER BY date DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM diary WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: '일기를 찾을 수 없습니다.' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { date, title, content, mood, tags } = req.body;
  const result = db.prepare(
    'INSERT INTO diary (date, title, content, mood, tags) VALUES (?, ?, ?, ?, ?)'
  ).run(date, title || '', content || '', mood || 3, JSON.stringify(tags || []));
  res.status(201).json(db.prepare('SELECT * FROM diary WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { date, title, content, mood, tags } = req.body;
  const existing = db.prepare('SELECT * FROM diary WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '일기를 찾을 수 없습니다.' });
  db.prepare(
    'UPDATE diary SET date=?, title=?, content=?, mood=?, tags=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(
    date ?? existing.date,
    title ?? existing.title,
    content ?? existing.content,
    mood ?? existing.mood,
    tags ? JSON.stringify(tags) : existing.tags,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM diary WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM diary WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
