const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db/init');

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

router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  res.json(db.prepare('SELECT * FROM places WHERE user_id = ? ORDER BY created_at DESC').all(userId));
});

router.post('/', async (req, res) => {
  await runUpload(req, res);
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  const { name, category, rating, review, visited_at, address, lat, lng } = req.body || {};
  const image_url = req.file ? `/uploads/places/${req.file.filename}` : null;
  const result = db.prepare(
    'INSERT INTO places (user_id, name, category, rating, review, visited_at, address, lat, lng, image_url) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).run(userId, name, category || '기타', Number(rating) || 0, review || '', visited_at || '', address || '', lat || null, lng || null, image_url);
  res.status(201).json(db.prepare('SELECT * FROM places WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', async (req, res) => {
  await runUpload(req, res);
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  const { name, category, rating, review, visited_at, address, lat, lng } = req.body || {};
  const e = db.prepare('SELECT * FROM places WHERE id = ? AND user_id = ?').get(req.params.id, userId);
  if (!e) return res.status(404).json({ error: '장소를 찾을 수 없습니다.' });
  const image_url = req.file ? `/uploads/places/${req.file.filename}` : e.image_url;
  db.prepare(
    'UPDATE places SET name=?,category=?,rating=?,review=?,visited_at=?,address=?,lat=?,lng=?,image_url=? WHERE id=?'
  ).run(
    name ?? e.name, category ?? e.category, Number(rating) ?? e.rating,
    review ?? e.review, visited_at ?? e.visited_at, address ?? e.address,
    lat ?? e.lat, lng ?? e.lng, image_url, req.params.id
  );
  res.json(db.prepare('SELECT * FROM places WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '인증이 필요합니다.' });
  db.prepare('DELETE FROM places WHERE id = ? AND user_id = ?').run(req.params.id, userId);
  res.json({ success: true });
});

module.exports = router;
