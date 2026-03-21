const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.get('/config', (req, res) => {
  res.json(db.prepare('SELECT * FROM budget_config').all());
});

router.post('/config', (req, res) => {
  const { category, amount, currency } = req.body;
  db.prepare(
    'INSERT INTO budget_config (category, amount, currency) VALUES (?,?,?) ON CONFLICT(category) DO UPDATE SET amount=excluded.amount, currency=excluded.currency'
  ).run(category, amount || 0, currency || 'KRW');
  res.json(db.prepare('SELECT * FROM budget_config WHERE category = ?').get(category));
});

router.get('/expenses', (req, res) => {
  res.json(db.prepare('SELECT * FROM expenses ORDER BY date DESC, created_at DESC').all());
});

router.post('/expenses', (req, res) => {
  const { date, category, amount_thb, memo } = req.body;
  const result = db.prepare(
    'INSERT INTO expenses (date, category, amount_thb, memo) VALUES (?,?,?,?)'
  ).run(date, category || '기타', amount_thb || 0, memo || '');
  res.status(201).json(db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/expenses/:id', (req, res) => {
  const { date, category, amount_thb, memo } = req.body;
  const e = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  if (!e) return res.status(404).json({ error: '지출을 찾을 수 없습니다.' });
  db.prepare('UPDATE expenses SET date=?,category=?,amount_thb=?,memo=? WHERE id=?')
    .run(date??e.date, category??e.category, amount_thb??e.amount_thb, memo??e.memo, req.params.id);
  res.json(db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id));
});

router.delete('/expenses/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
