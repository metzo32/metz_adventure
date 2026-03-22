const express = require('express');
const router = express.Router();
const db = require('../db/init');

const requireTrip = (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) {
    res.status(400).json({ error: '여행을 먼저 선택해주세요.' });
    return null;
  }
  return tripId;
};

router.get('/', (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const rows = db.prepare('SELECT * FROM todos WHERE trip_id = ? ORDER BY due_date ASC, visit_time ASC').all(tripId);
  res.json(rows);
});

router.post('/', (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { title, category, due_date, visit_time, address, map_url, memo } = req.body;
  const result = db.prepare(
    'INSERT INTO todos (trip_id, title, category, due_date, visit_time, address, map_url, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    tripId,
    title || '',
    category || 'other',
    due_date || null,
    visit_time || '',
    address || '',
    map_url || '',
    memo || ''
  );
  res.status(201).json(db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid));
});

router.patch('/:id', (req, res) => {
  const { title, category, due_date, visit_time, address, map_url, memo, is_completed } = req.body;
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
  db.prepare(
    'UPDATE todos SET title=?, category=?, due_date=?, visit_time=?, address=?, map_url=?, memo=?, is_completed=? WHERE id=?'
  ).run(
    title ?? existing.title,
    category ?? existing.category,
    due_date ?? existing.due_date,
    visit_time ?? existing.visit_time,
    address ?? existing.address,
    map_url ?? existing.map_url,
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
