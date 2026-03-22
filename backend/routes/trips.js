const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const pool = require('../db/init');

const requireUser = (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    res.status(401).json({ error: '인증이 필요합니다.' });
    return null;
  }
  return userId;
};

// POST /api/trips/invite/accept
router.post('/invite/accept', async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: '초대 코드를 입력해주세요.' });

  const { rows: invites } = await pool.query(
    `SELECT * FROM invite_codes WHERE code = $1 AND used_at IS NULL AND expires_at > NOW()`,
    [code.toUpperCase()]
  );
  const invite = invites[0];
  if (!invite) return res.status(404).json({ error: '유효하지 않거나 만료된 초대 코드입니다.' });

  const { rows: members } = await pool.query(
    'SELECT 1 FROM trip_members WHERE trip_id = $1 AND user_id = $2',
    [invite.trip_id, userId]
  );
  if (members.length > 0) return res.status(409).json({ error: '이미 참여 중인 여행입니다.' });

  await pool.query('INSERT INTO trip_members (trip_id, user_id) VALUES ($1, $2)', [invite.trip_id, userId]);
  await pool.query('UPDATE invite_codes SET used_at = NOW(), used_by = $1 WHERE id = $2', [userId, invite.id]);

  const { rows: trips } = await pool.query('SELECT * FROM trips WHERE id = $1', [invite.trip_id]);
  res.json(trips[0]);
});

// GET /api/trips
router.get('/', async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { rows } = await pool.query(`
    SELECT t.*, u.name AS owner_name,
      (SELECT COUNT(*) FROM trip_members WHERE trip_id = t.id) AS member_count
    FROM trips t
    JOIN trip_members tm ON t.id = tm.trip_id
    JOIN users u ON t.owner_id = u.id
    WHERE tm.user_id = $1
    ORDER BY t.created_at DESC
  `, [userId]);
  res.json(rows);
});

// POST /api/trips
router.post('/', async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { name, description, country, city, start_date, end_date } = req.body;
  if (!name) return res.status(400).json({ error: '여행 이름을 입력해주세요.' });
  if (!country) return res.status(400).json({ error: '국가를 선택해주세요.' });

  const { rows: inserted } = await pool.query(
    'INSERT INTO trips (name, description, country, city, start_date, end_date, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [name, description || '', country, city || '', start_date || '', end_date || '', userId]
  );
  const tripId = inserted[0].id;

  await pool.query('INSERT INTO trip_members (trip_id, user_id) VALUES ($1, $2)', [tripId, userId]);

  const { rows } = await pool.query(`
    SELECT t.*, u.name AS owner_name, 1 AS member_count
    FROM trips t JOIN users u ON t.owner_id = u.id
    WHERE t.id = $1
  `, [tripId]);
  res.status(201).json(rows[0]);
});

// GET /api/trips/:id
router.get('/:id', async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { rows: trips } = await pool.query('SELECT * FROM trips WHERE id = $1', [req.params.id]);
  if (trips.length === 0) return res.status(404).json({ error: '여행을 찾을 수 없습니다.' });

  const { rows: membership } = await pool.query(
    'SELECT 1 FROM trip_members WHERE trip_id = $1 AND user_id = $2',
    [req.params.id, userId]
  );
  if (membership.length === 0) return res.status(403).json({ error: '접근 권한이 없습니다.' });

  const { rows: members } = await pool.query(`
    SELECT u.id, u.name, u.email, tm.joined_at
    FROM trip_members tm
    JOIN users u ON tm.user_id = u.id
    WHERE tm.trip_id = $1
  `, [req.params.id]);

  res.json({ ...trips[0], members });
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { rows: trips } = await pool.query('SELECT * FROM trips WHERE id = $1', [req.params.id]);
  if (trips.length === 0) return res.status(404).json({ error: '여행을 찾을 수 없습니다.' });
  if (String(trips[0].owner_id) !== String(userId)) return res.status(403).json({ error: '여행 소유자만 삭제할 수 있습니다.' });

  await pool.query('DELETE FROM invite_codes WHERE trip_id = $1', [req.params.id]);
  await pool.query('DELETE FROM trip_members WHERE trip_id = $1', [req.params.id]);
  await pool.query('DELETE FROM trips WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// POST /api/trips/:id/invite
router.post('/:id/invite', async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { rows: membership } = await pool.query(
    'SELECT 1 FROM trip_members WHERE trip_id = $1 AND user_id = $2',
    [req.params.id, userId]
  );
  if (membership.length === 0) return res.status(403).json({ error: '접근 권한이 없습니다.' });

  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await pool.query(
    'INSERT INTO invite_codes (trip_id, code, created_by, expires_at) VALUES ($1, $2, $3, $4)',
    [req.params.id, code, userId, expiresAt]
  );
  res.json({ code, expires_at: expiresAt });
});

// PUT /api/trips/:id/memo
router.put('/:id/memo', async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { rows: membership } = await pool.query(
    'SELECT 1 FROM trip_members WHERE trip_id = $1 AND user_id = $2',
    [req.params.id, userId]
  );
  if (membership.length === 0) return res.status(403).json({ error: '접근 권한이 없습니다.' });

  await pool.query('UPDATE trips SET memo = $1 WHERE id = $2', [req.body.memo ?? '', req.params.id]);
  const { rows } = await pool.query('SELECT * FROM trips WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

module.exports = router;
