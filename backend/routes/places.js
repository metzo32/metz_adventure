const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM places ORDER BY visited_at DESC').all());
});

router.post('/', (req, res) => {
  const { name, category, rating, review, visited_at, address, lat, lng } = req.body;
  const result = db.prepare(
    'INSERT INTO places (name, category, rating, review, visited_at, address, lat, lng) VALUES (?,?,?,?,?,?,?,?)'
  ).run(name, category || '기타', rating || 0, review || '', visited_at || '', address || '', lat || null, lng || null);
  res.status(201).json(db.prepare('SELECT * FROM places WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { name, category, rating, review, visited_at, address, lat, lng } = req.body;
  const e = db.prepare('SELECT * FROM places WHERE id = ?').get(req.params.id);
  if (!e) return res.status(404).json({ error: '장소를 찾을 수 없습니다.' });
  db.prepare(
    'UPDATE places SET name=?,category=?,rating=?,review=?,visited_at=?,address=?,lat=?,lng=? WHERE id=?'
  ).run(name??e.name, category??e.category, rating??e.rating, review??e.review, visited_at??e.visited_at, address??e.address, lat??e.lat, lng??e.lng, req.params.id);
  res.json(db.prepare('SELECT * FROM places WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM places WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
