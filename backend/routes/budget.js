const express = require('express');
const router = express.Router();
const pool = require('../db/init');

const requireTrip = (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) {
    res.status(400).json({ error: '여행을 먼저 선택해주세요.' });
    return null;
  }
  return tripId;
};

router.get('/total-budget', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { rows } = await pool.query('SELECT total_budget_krw FROM trips WHERE id = $1', [tripId]);
  res.json({ total_budget_krw: rows[0]?.total_budget_krw ?? null });
});

router.put('/total-budget', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { amount_krw } = req.body;
  const value = amount_krw != null && amount_krw > 0 ? amount_krw : null;
  await pool.query('UPDATE trips SET total_budget_krw = $1 WHERE id = $2', [value, tripId]);
  res.json({ total_budget_krw: value });
});

router.get('/config', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { rows } = await pool.query('SELECT * FROM budget_config WHERE trip_id = $1', [tripId]);
  res.json(rows);
});

router.post('/config', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { category, amount, currency } = req.body;
  const { rows: existing } = await pool.query(
    'SELECT * FROM budget_config WHERE trip_id = $1 AND category = $2',
    [tripId, category]
  );
  if (existing.length > 0) {
    await pool.query('UPDATE budget_config SET amount=$1, currency=$2 WHERE id=$3', [amount || 0, currency || 'KRW', existing[0].id]);
  } else {
    await pool.query(
      'INSERT INTO budget_config (trip_id, category, amount, currency) VALUES ($1, $2, $3, $4)',
      [tripId, category, amount || 0, currency || 'KRW']
    );
  }
  const { rows } = await pool.query('SELECT * FROM budget_config WHERE trip_id = $1 AND category = $2', [tripId, category]);
  res.json(rows[0]);
});

router.get('/expenses', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { rows } = await pool.query(
    'SELECT * FROM expenses WHERE trip_id = $1 ORDER BY date DESC, created_at DESC',
    [tripId]
  );
  res.json(rows);
});

router.post('/expenses', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { date, category, amount_thb, amount_krw, memo } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO expenses (trip_id, date, category, amount_thb, amount_krw, memo) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [tripId, date, category || '기타', amount_thb || 0, amount_krw || 0, memo || '']
  );
  res.status(201).json(rows[0]);
});

router.put('/expenses/:id', async (req, res) => {
  const { date, category, amount_thb, amount_krw, memo } = req.body;
  const { rows: existing } = await pool.query('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: '지출을 찾을 수 없습니다.' });
  const e = existing[0];
  await pool.query(
    'UPDATE expenses SET date=$1,category=$2,amount_thb=$3,amount_krw=$4,memo=$5 WHERE id=$6',
    [date ?? e.date, category ?? e.category, amount_thb ?? e.amount_thb, amount_krw ?? e.amount_krw, memo ?? e.memo, req.params.id]
  );
  const { rows } = await pool.query('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/expenses/:id', async (req, res) => {
  await pool.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
