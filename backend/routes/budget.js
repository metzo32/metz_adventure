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

router.get('/config', (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  res.json(db.prepare('SELECT * FROM budget_config WHERE trip_id = ?').all(tripId));
});

router.post('/config', (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { category, amount, currency } = req.body;
  const existing = db.prepare('SELECT * FROM budget_config WHERE trip_id = ? AND category = ?').get(tripId, category);
  if (existing) {
    db.prepare('UPDATE budget_config SET amount=?, currency=? WHERE id=?').run(amount || 0, currency || 'KRW', existing.id);
  } else {
    db.prepare('INSERT INTO budget_config (trip_id, category, amount, currency) VALUES (?, ?, ?, ?)').run(tripId, category, amount || 0, currency || 'KRW');
  }
  res.json(db.prepare('SELECT * FROM budget_config WHERE trip_id = ? AND category = ?').get(tripId, category));
});

router.get('/expenses', (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  res.json(db.prepare('SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC, created_at DESC').all(tripId));
});

router.post('/expenses', (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { date, category, amount_thb, amount_krw, memo } = req.body;
  const result = db.prepare(
    'INSERT INTO expenses (trip_id, date, category, amount_thb, amount_krw, memo) VALUES (?,?,?,?,?,?)'
  ).run(tripId, date, category || '기타', amount_thb || 0, amount_krw || 0, memo || '');
  res.status(201).json(db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/expenses/:id', (req, res) => {
  const { date, category, amount_thb, amount_krw, memo } = req.body;
  const e = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  if (!e) return res.status(404).json({ error: '지출을 찾을 수 없습니다.' });
  db.prepare('UPDATE expenses SET date=?,category=?,amount_thb=?,amount_krw=?,memo=? WHERE id=?')
    .run(date ?? e.date, category ?? e.category, amount_thb ?? e.amount_thb, amount_krw ?? e.amount_krw, memo ?? e.memo, req.params.id);
  res.json(db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id));
});

router.delete('/expenses/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
