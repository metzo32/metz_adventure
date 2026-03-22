const express = require('express');
const router = express.Router();
const pool = require('../db/init');

// GET /api/mypage/past-trips
router.get('/past-trips', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });

  const { rows } = await pool.query(`
    SELECT t.id, t.name, t.country, t.city, t.start_date, t.end_date, t.memo,
      COALESCE(SUM(e.amount_krw), 0) AS total_expense_krw
    FROM trips t
    JOIN trip_members tm ON t.id = tm.trip_id
    LEFT JOIN expenses e ON e.trip_id = t.id
    WHERE tm.user_id = $1
      AND t.end_date < CURRENT_DATE::TEXT
      AND t.end_date != ''
    GROUP BY t.id
    ORDER BY t.end_date DESC
  `, [userId]);
  res.json(rows);
});

// GET /api/mypage/steps
router.get('/steps', async (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.json([]);
  const { rows } = await pool.query('SELECT * FROM steps WHERE trip_id = $1 ORDER BY date DESC', [tripId]);
  res.json(rows);
});

// POST /api/mypage/steps
router.post('/steps', async (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.status(400).json({ error: 'x-trip-id 헤더가 필요합니다.' });

  const { date, count, memo } = req.body;
  if (!date || count == null) return res.status(400).json({ error: 'date, count는 필수입니다.' });

  const { rows: existing } = await pool.query('SELECT * FROM steps WHERE date = $1 AND trip_id = $2', [date, tripId]);
  if (existing.length > 0) {
    await pool.query('UPDATE steps SET count = $1, memo = $2 WHERE id = $3', [count, memo ?? existing[0].memo, existing[0].id]);
    const { rows } = await pool.query('SELECT * FROM steps WHERE id = $1', [existing[0].id]);
    return res.json(rows[0]);
  }

  const { rows } = await pool.query(
    'INSERT INTO steps (date, count, memo, trip_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [date, count, memo || '', tripId]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/mypage/steps/:id
router.put('/steps/:id', async (req, res) => {
  const { date, count, memo } = req.body;
  const { rows: existing } = await pool.query('SELECT * FROM steps WHERE id = $1', [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' });
  const e = existing[0];
  await pool.query('UPDATE steps SET date=$1,count=$2,memo=$3 WHERE id=$4', [date ?? e.date, count ?? e.count, memo ?? e.memo, req.params.id]);
  const { rows } = await pool.query('SELECT * FROM steps WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

// DELETE /api/mypage/steps/:id
router.delete('/steps/:id', async (req, res) => {
  await pool.query('DELETE FROM steps WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// GET /api/mypage/flights
router.get('/flights', async (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.json([]);
  const { rows } = await pool.query('SELECT * FROM flights WHERE trip_id = $1 ORDER BY type ASC, created_at ASC', [tripId]);
  res.json(rows);
});

// POST /api/mypage/flights
router.post('/flights', async (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.status(400).json({ error: 'x-trip-id 헤더가 필요합니다.' });

  const { type, departure_place, departure_time, arrival_place, arrival_time } = req.body;
  if (!['outbound', 'return'].includes(type)) return res.status(400).json({ error: 'type은 outbound 또는 return이어야 합니다.' });
  if (!departure_place || !departure_time || !arrival_place || !arrival_time) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  const { rows } = await pool.query(
    'INSERT INTO flights (trip_id, type, departure_place, departure_time, arrival_place, arrival_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [tripId, type, departure_place, departure_time, arrival_place, arrival_time]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/mypage/flights/:id
router.put('/flights/:id', async (req, res) => {
  const { type, departure_place, departure_time, arrival_place, arrival_time } = req.body;
  const { rows: existing } = await pool.query('SELECT * FROM flights WHERE id = $1', [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: '항공편을 찾을 수 없습니다.' });
  const f = existing[0];

  if (type && !['outbound', 'return'].includes(type)) {
    return res.status(400).json({ error: 'type은 outbound 또는 return이어야 합니다.' });
  }

  await pool.query(
    'UPDATE flights SET type=$1,departure_place=$2,departure_time=$3,arrival_place=$4,arrival_time=$5 WHERE id=$6',
    [type ?? f.type, departure_place ?? f.departure_place, departure_time ?? f.departure_time, arrival_place ?? f.arrival_place, arrival_time ?? f.arrival_time, req.params.id]
  );
  const { rows } = await pool.query('SELECT * FROM flights WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

// DELETE /api/mypage/flights/:id
router.delete('/flights/:id', async (req, res) => {
  await pool.query('DELETE FROM flights WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// GET /api/mypage/daily-expenses
router.get('/daily-expenses', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT date, SUM(amount_thb) as total_thb FROM expenses GROUP BY date ORDER BY date ASC'
  );
  res.json(rows);
});

module.exports = router;
