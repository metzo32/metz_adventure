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

router.get('/', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { rows } = await pool.query('SELECT * FROM wishlist WHERE trip_id = $1 ORDER BY created_at DESC', [tripId]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { title, category, memo, link, priority } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO wishlist (trip_id, title, category, memo, link, priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [tripId, title, category || '기타', memo || '', link || '', priority || 1]
  );
  res.status(201).json(rows[0]);
});

router.patch('/:id', async (req, res) => {
  const { title, category, memo, link, priority, is_done } = req.body;
  const { rows: existing } = await pool.query('SELECT * FROM wishlist WHERE id = $1', [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
  const e = existing[0];
  await pool.query(
    'UPDATE wishlist SET title=$1, category=$2, memo=$3, link=$4, priority=$5, is_done=$6 WHERE id=$7',
    [title ?? e.title, category ?? e.category, memo ?? e.memo, link ?? e.link, priority ?? e.priority, is_done ?? e.is_done, req.params.id]
  );
  const { rows } = await pool.query('SELECT * FROM wishlist WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM wishlist WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
