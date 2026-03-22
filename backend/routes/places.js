const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const pool = require('../db/init');

fs.mkdirSync('uploads/places', { recursive: true });

const storage = multer.diskStorage({
  destination: 'uploads/places/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const uploadSingle = multer({ storage }).single('image');

const runUpload = (req, res) =>
  new Promise((resolve, reject) =>
    uploadSingle(req, res, (err) => (err ? reject(err) : resolve()))
  );

router.get('/', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  const { rows } = await pool.query('SELECT * FROM places WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  await runUpload(req, res);
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  const { name, category, rating, review, visited_at, address, lat, lng } = req.body || {};
  const image_url = req.file ? `/uploads/places/${req.file.filename}` : null;
  const { rows } = await pool.query(
    'INSERT INTO places (user_id, name, category, rating, review, visited_at, address, lat, lng, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
    [userId, name, category || '기타', Number(rating) || 0, review || '', visited_at || '', address || '', lat || null, lng || null, image_url]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  await runUpload(req, res);
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  const { name, category, rating, review, visited_at, address, lat, lng } = req.body || {};
  const { rows: existing } = await pool.query('SELECT * FROM places WHERE id = $1 AND user_id = $2', [req.params.id, userId]);
  if (existing.length === 0) return res.status(404).json({ error: '장소를 찾을 수 없습니다.' });
  const e = existing[0];
  const image_url = req.file ? `/uploads/places/${req.file.filename}` : e.image_url;
  await pool.query(
    'UPDATE places SET name=$1,category=$2,rating=$3,review=$4,visited_at=$5,address=$6,lat=$7,lng=$8,image_url=$9 WHERE id=$10',
    [name ?? e.name, category ?? e.category, Number(rating) ?? e.rating, review ?? e.review, visited_at ?? e.visited_at, address ?? e.address, lat ?? e.lat, lng ?? e.lng, image_url, req.params.id]
  );
  const { rows } = await pool.query('SELECT * FROM places WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  await pool.query('DELETE FROM places WHERE id = $1 AND user_id = $2', [req.params.id, userId]);
  res.json({ success: true });
});

module.exports = router;
