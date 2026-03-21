const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.get('/steps', (req, res) => {
  res.json(db.prepare('SELECT * FROM steps ORDER BY date DESC').all());
});

router.post('/steps', (req, res) => {
  const { date, count, memo } = req.body;
  db.prepare(
    'INSERT INTO steps (date, count, memo) VALUES (?,?,?) ON CONFLICT(date) DO UPDATE SET count=excluded.count, memo=excluded.memo'
  ).run(date, count, memo || '');
  res.status(201).json(db.prepare('SELECT * FROM steps WHERE date = ?').get(date));
});

router.put('/steps/:id', (req, res) => {
  const { date, count, memo } = req.body;
  const e = db.prepare('SELECT * FROM steps WHERE id = ?').get(req.params.id);
  if (!e) return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' });
  db.prepare('UPDATE steps SET date=?,count=?,memo=? WHERE id=?')
    .run(date??e.date, count??e.count, memo??e.memo, req.params.id);
  res.json(db.prepare('SELECT * FROM steps WHERE id = ?').get(req.params.id));
});

router.delete('/steps/:id', (req, res) => {
  db.prepare('DELETE FROM steps WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/daily-expenses', (req, res) => {
  const rows = db.prepare(
    'SELECT date, SUM(amount_thb) as total_thb FROM expenses GROUP BY date ORDER BY date ASC'
  ).all();
  res.json(rows);
});

module.exports = router;
