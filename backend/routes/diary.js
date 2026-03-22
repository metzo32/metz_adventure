const express = require('express');
const router = express.Router();
const pool = require('../db/init');

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM diary ORDER BY date DESC');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM diary WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: '일기를 찾을 수 없습니다.' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { date, title, content, mood, tags } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO diary (date, title, content, mood, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [date, title || '', content || '', mood || 3, JSON.stringify(tags || [])]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { date, title, content, mood, tags } = req.body;
  const { rows: existing } = await pool.query('SELECT * FROM diary WHERE id = $1', [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: '일기를 찾을 수 없습니다.' });
  const e = existing[0];
  await pool.query(
    'UPDATE diary SET date=$1, title=$2, content=$3, mood=$4, tags=$5, updated_at=NOW() WHERE id=$6',
    [date ?? e.date, title ?? e.title, content ?? e.content, mood ?? e.mood, tags ? JSON.stringify(tags) : e.tags, req.params.id]
  );
  const { rows } = await pool.query('SELECT * FROM diary WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM diary WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
