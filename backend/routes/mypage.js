const express = require('express');
const router = express.Router();
const db = require('../db/init');

// GET /api/mypage/past-trips — 종료된 여행 목록 + 여행별 총 지출
router.get('/past-trips', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });

  const rows = db.prepare(`
    SELECT t.id, t.name, t.country, t.city, t.start_date, t.end_date, t.memo,
      COALESCE(SUM(e.amount_krw), 0) AS total_expense_krw
    FROM trips t
    JOIN trip_members tm ON t.id = tm.trip_id
    LEFT JOIN expenses e ON e.trip_id = t.id
    WHERE tm.user_id = ?
      AND t.end_date < date('now')
      AND t.end_date != ''
    GROUP BY t.id
    ORDER BY t.end_date DESC
  `).all(userId);

  res.json(rows);
});

// GET /api/mypage/steps — trip-scoped 걸음 수 목록
router.get('/steps', (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.json([]);
  res.json(db.prepare('SELECT * FROM steps WHERE trip_id = ? ORDER BY date DESC').all(tripId));
});

// POST /api/mypage/steps — 걸음 수 추가 (trip-scoped, 날짜+trip 기준 upsert)
router.post('/steps', (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.status(400).json({ error: 'x-trip-id 헤더가 필요합니다.' });

  const { date, count, memo } = req.body;
  if (!date || count == null) return res.status(400).json({ error: 'date, count는 필수입니다.' });

  const existing = db.prepare('SELECT * FROM steps WHERE date = ? AND trip_id = ?').get(date, tripId);
  if (existing) {
    db.prepare('UPDATE steps SET count = ?, memo = ? WHERE id = ?').run(count, memo ?? existing.memo, existing.id);
    return res.json(db.prepare('SELECT * FROM steps WHERE id = ?').get(existing.id));
  }

  db.prepare('INSERT INTO steps (date, count, memo, trip_id) VALUES (?, ?, ?, ?)').run(date, count, memo || '', tripId);
  res.status(201).json(db.prepare('SELECT * FROM steps WHERE date = ? AND trip_id = ?').get(date, tripId));
});

// PUT /api/mypage/steps/:id
router.put('/steps/:id', (req, res) => {
  const { date, count, memo } = req.body;
  const e = db.prepare('SELECT * FROM steps WHERE id = ?').get(req.params.id);
  if (!e) return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' });
  db.prepare('UPDATE steps SET date=?,count=?,memo=? WHERE id=?')
    .run(date ?? e.date, count ?? e.count, memo ?? e.memo, req.params.id);
  res.json(db.prepare('SELECT * FROM steps WHERE id = ?').get(req.params.id));
});

// DELETE /api/mypage/steps/:id
router.delete('/steps/:id', (req, res) => {
  db.prepare('DELETE FROM steps WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET /api/mypage/flights — 현재 여행 항공편 목록
router.get('/flights', (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.json([]);
  res.json(db.prepare('SELECT * FROM flights WHERE trip_id = ? ORDER BY type ASC, created_at ASC').all(tripId));
});

// POST /api/mypage/flights — 항공편 추가
router.post('/flights', (req, res) => {
  const tripId = req.headers['x-trip-id'];
  if (!tripId) return res.status(400).json({ error: 'x-trip-id 헤더가 필요합니다.' });

  const { type, departure_place, departure_time, arrival_place, arrival_time } = req.body;
  if (!['outbound', 'return'].includes(type)) return res.status(400).json({ error: 'type은 outbound 또는 return이어야 합니다.' });
  if (!departure_place || !departure_time || !arrival_place || !arrival_time) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  const result = db.prepare(
    'INSERT INTO flights (trip_id, type, departure_place, departure_time, arrival_place, arrival_time) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(tripId, type, departure_place, departure_time, arrival_place, arrival_time);

  res.status(201).json(db.prepare('SELECT * FROM flights WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/mypage/flights/:id — 항공편 수정
router.put('/flights/:id', (req, res) => {
  const { type, departure_place, departure_time, arrival_place, arrival_time } = req.body;
  const flight = db.prepare('SELECT * FROM flights WHERE id = ?').get(req.params.id);
  if (!flight) return res.status(404).json({ error: '항공편을 찾을 수 없습니다.' });

  if (type && !['outbound', 'return'].includes(type)) {
    return res.status(400).json({ error: 'type은 outbound 또는 return이어야 합니다.' });
  }

  db.prepare(
    'UPDATE flights SET type=?,departure_place=?,departure_time=?,arrival_place=?,arrival_time=? WHERE id=?'
  ).run(
    type ?? flight.type,
    departure_place ?? flight.departure_place,
    departure_time ?? flight.departure_time,
    arrival_place ?? flight.arrival_place,
    arrival_time ?? flight.arrival_time,
    req.params.id
  );

  res.json(db.prepare('SELECT * FROM flights WHERE id = ?').get(req.params.id));
});

// DELETE /api/mypage/flights/:id — 항공편 삭제
router.delete('/flights/:id', (req, res) => {
  db.prepare('DELETE FROM flights WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET /api/mypage/daily-expenses (기존 유지)
router.get('/daily-expenses', (req, res) => {
  const rows = db.prepare(
    'SELECT date, SUM(amount_thb) as total_thb FROM expenses GROUP BY date ORDER BY date ASC'
  ).all();
  res.json(rows);
});

module.exports = router;
