const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db/init');

const requireUser = (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    res.status(401).json({ error: '인증이 필요합니다.' });
    return null;
  }
  return userId;
};

// POST /api/trips/invite/accept — 초대 코드로 여행 참여 (반드시 /:id 라우트보다 먼저 선언)
router.post('/invite/accept', (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: '초대 코드를 입력해주세요.' });

  const invite = db.prepare(`
    SELECT * FROM invite_codes
    WHERE code = ? AND used_at IS NULL AND expires_at > datetime('now')
  `).get(code.toUpperCase());

  if (!invite) return res.status(404).json({ error: '유효하지 않거나 만료된 초대 코드입니다.' });

  const alreadyMember = db.prepare(
    'SELECT 1 FROM trip_members WHERE trip_id = ? AND user_id = ?'
  ).get(invite.trip_id, userId);

  if (alreadyMember) return res.status(409).json({ error: '이미 참여 중인 여행입니다.' });

  db.prepare('INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)').run(invite.trip_id, userId);
  db.prepare(`
    UPDATE invite_codes SET used_at = datetime('now'), used_by = ? WHERE id = ?
  `).run(userId, invite.id);

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(invite.trip_id);
  res.json(trip);
});

// GET /api/trips — 내 여행 목록
router.get('/', (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const trips = db.prepare(`
    SELECT t.*, u.name AS owner_name,
      (SELECT COUNT(*) FROM trip_members WHERE trip_id = t.id) AS member_count
    FROM trips t
    JOIN trip_members tm ON t.id = tm.trip_id
    JOIN users u ON t.owner_id = u.id
    WHERE tm.user_id = ?
    ORDER BY t.created_at DESC
  `).all(userId);

  res.json(trips);
});

// POST /api/trips — 여행 생성
router.post('/', (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { name, description, country, city, start_date, end_date } = req.body;
  if (!name) return res.status(400).json({ error: '여행 이름을 입력해주세요.' });
  if (!country) return res.status(400).json({ error: '국가를 선택해주세요.' });

  const result = db.prepare(
    'INSERT INTO trips (name, description, country, city, start_date, end_date, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, description || '', country, city || '', start_date || '', end_date || '', userId);

  db.prepare('INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)').run(result.lastInsertRowid, userId);

  const trip = db.prepare(`
    SELECT t.*, u.name AS owner_name, 1 AS member_count
    FROM trips t JOIN users u ON t.owner_id = u.id
    WHERE t.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(trip);
});

// GET /api/trips/:id — 여행 상세 + 멤버 목록
router.get('/:id', (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  if (!trip) return res.status(404).json({ error: '여행을 찾을 수 없습니다.' });

  const isMember = db.prepare(
    'SELECT 1 FROM trip_members WHERE trip_id = ? AND user_id = ?'
  ).get(req.params.id, userId);
  if (!isMember) return res.status(403).json({ error: '접근 권한이 없습니다.' });

  const members = db.prepare(`
    SELECT u.id, u.name, u.email, tm.joined_at
    FROM trip_members tm
    JOIN users u ON tm.user_id = u.id
    WHERE tm.trip_id = ?
  `).all(req.params.id);

  res.json({ ...trip, members });
});

// DELETE /api/trips/:id — 여행 삭제 (owner 전용)
router.delete('/:id', (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  if (!trip) return res.status(404).json({ error: '여행을 찾을 수 없습니다.' });
  if (String(trip.owner_id) !== String(userId)) return res.status(403).json({ error: '여행 소유자만 삭제할 수 있습니다.' });

  db.prepare('DELETE FROM invite_codes WHERE trip_id = ?').run(req.params.id);
  db.prepare('DELETE FROM trip_members WHERE trip_id = ?').run(req.params.id);
  db.prepare('DELETE FROM trips WHERE id = ?').run(req.params.id);

  res.json({ success: true });
});

// POST /api/trips/:id/invite — 초대 코드 발급
router.post('/:id/invite', (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const isMember = db.prepare(
    'SELECT 1 FROM trip_members WHERE trip_id = ? AND user_id = ?'
  ).get(req.params.id, userId);
  if (!isMember) return res.status(403).json({ error: '접근 권한이 없습니다.' });

  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  db.prepare(
    'INSERT INTO invite_codes (trip_id, code, created_by, expires_at) VALUES (?, ?, ?, ?)'
  ).run(req.params.id, code, userId, expiresAt);

  res.json({ code, expires_at: expiresAt });
});

// PUT /api/trips/:id/memo — 여행 메모 저장
router.put('/:id/memo', (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const isMember = db.prepare(
    'SELECT 1 FROM trip_members WHERE trip_id = ? AND user_id = ?'
  ).get(req.params.id, userId);
  if (!isMember) return res.status(403).json({ error: '접근 권한이 없습니다.' });

  db.prepare('UPDATE trips SET memo = ? WHERE id = ?').run(req.body.memo ?? '', req.params.id);
  res.json(db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id));
});

module.exports = router;
