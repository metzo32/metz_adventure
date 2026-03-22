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
  const { rows } = await pool.query(
    'SELECT * FROM todos WHERE trip_id = $1 ORDER BY due_date ASC, visit_time ASC',
    [tripId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const tripId = requireTrip(req, res);
  if (!tripId) return;
  const { title, category, due_date, visit_time, address, map_url, memo } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO todos (trip_id, title, category, due_date, visit_time, address, map_url, memo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [tripId, title || '', category || 'other', due_date || null, visit_time || '', address || '', map_url || '', memo || '']
  );
  res.status(201).json(rows[0]);
});

router.patch('/:id', async (req, res) => {
  const { title, category, due_date, visit_time, address, map_url, memo, is_completed } = req.body;
  const { rows: existing } = await pool.query('SELECT * FROM todos WHERE id = $1', [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
  const e = existing[0];
  await pool.query(
    'UPDATE todos SET title=$1, category=$2, due_date=$3, visit_time=$4, address=$5, map_url=$6, memo=$7, is_completed=$8 WHERE id=$9',
    [title ?? e.title, category ?? e.category, due_date ?? e.due_date, visit_time ?? e.visit_time, address ?? e.address, map_url ?? e.map_url, memo ?? e.memo, is_completed ?? e.is_completed, req.params.id]
  );
  const { rows } = await pool.query('SELECT * FROM todos WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
