const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/diary', require('./routes/diary'));
app.use('/api/places', require('./routes/places'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/mypage', require('./routes/mypage'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
