const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const pool = require('../db/init');

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: '이메일, 비밀번호, 이름을 모두 입력해주세요.' });
  }

  const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
  }

  const password_hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
    [email, password_hash, name]
  );
  res.status(201).json(rows[0]);
});

router.get('/me', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });

  const { rows } = await pool.query('SELECT id, email, name, last_trip_id FROM users WHERE id = $1', [userId]);
  if (rows.length === 0) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  res.json(rows[0]);
});

router.patch('/last-trip', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });

  const { tripId } = req.body;
  if (!tripId) return res.status(400).json({ error: 'tripId가 필요합니다.' });

  await pool.query('UPDATE users SET last_trip_id = $1 WHERE id = $2', [tripId, userId]);
  res.json({ success: true });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[AUTH] /login 요청:', { email, hasPassword: !!password });

  if (!email || !password) {
    console.log('[AUTH] /login 실패: 입력값 누락');
    return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
  }

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user || !user.password_hash) {
    console.log('[AUTH] /login 실패: 유저 없음', { email });
    return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    console.log('[AUTH] /login 실패: 비밀번호 불일치', { email });
    return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  const responseBody = { id: String(user.id), email: user.email, name: user.name };
  console.log('[AUTH] /login 성공:', responseBody);
  res.json(responseBody);
});

module.exports = router;
