const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'travel.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS wishlist (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    category   TEXT,
    memo       TEXT,
    link       TEXT,
    priority   INTEGER DEFAULT 1,
    is_done    INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS todos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    category     TEXT,
    due_date     TEXT,
    memo         TEXT,
    is_completed INTEGER DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS diary (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       TEXT    NOT NULL,
    title      TEXT,
    content    TEXT,
    mood       INTEGER,
    tags       TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS places (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    category   TEXT,
    rating     REAL,
    review     TEXT,
    visited_at TEXT,
    address    TEXT,
    lat        REAL,
    lng        REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS budget_config (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT    NOT NULL UNIQUE,
    amount   INTEGER DEFAULT 0,
    currency TEXT    DEFAULT 'KRW'
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       TEXT,
    category   TEXT,
    amount_thb REAL,
    memo       TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS steps (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       TEXT    NOT NULL UNIQUE,
    count      INTEGER NOT NULL,
    memo       TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ DB 초기화 완료 (travel.db)');

module.exports = db;
