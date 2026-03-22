require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      name          TEXT NOT NULL,
      created_at    TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS trips (
      id               SERIAL PRIMARY KEY,
      name             TEXT NOT NULL,
      description      TEXT DEFAULT '',
      owner_id         INTEGER NOT NULL REFERENCES users(id),
      country          TEXT DEFAULT '',
      city             TEXT DEFAULT '',
      start_date       TEXT DEFAULT '',
      end_date         TEXT DEFAULT '',
      total_budget_krw INTEGER,
      memo             TEXT DEFAULT '',
      created_at       TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS trip_members (
      trip_id   INTEGER NOT NULL REFERENCES trips(id),
      user_id   INTEGER NOT NULL REFERENCES users(id),
      joined_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (trip_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS invite_codes (
      id         SERIAL PRIMARY KEY,
      trip_id    INTEGER NOT NULL REFERENCES trips(id),
      code       TEXT NOT NULL UNIQUE,
      created_by INTEGER NOT NULL REFERENCES users(id),
      expires_at TIMESTAMP NOT NULL,
      used_at    TIMESTAMP,
      used_by    INTEGER
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id         SERIAL PRIMARY KEY,
      trip_id    INTEGER REFERENCES trips(id),
      title      TEXT NOT NULL,
      category   TEXT,
      memo       TEXT,
      link       TEXT,
      priority   INTEGER DEFAULT 1,
      is_done    INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS todos (
      id           SERIAL PRIMARY KEY,
      trip_id      INTEGER REFERENCES trips(id),
      title        TEXT NOT NULL,
      category     TEXT,
      due_date     TEXT,
      visit_time   TEXT DEFAULT '',
      address      TEXT DEFAULT '',
      map_url      TEXT DEFAULT '',
      memo         TEXT,
      is_completed INTEGER DEFAULT 0,
      created_at   TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS diary (
      id         SERIAL PRIMARY KEY,
      date       TEXT NOT NULL,
      title      TEXT,
      content    TEXT,
      mood       INTEGER,
      tags       TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS places (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id),
      name       TEXT NOT NULL,
      category   TEXT,
      rating     REAL,
      review     TEXT,
      visited_at TEXT,
      address    TEXT,
      lat        REAL,
      lng        REAL,
      image_url  TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS budget_config (
      id       SERIAL PRIMARY KEY,
      trip_id  INTEGER REFERENCES trips(id),
      category TEXT NOT NULL,
      amount   INTEGER DEFAULT 0,
      currency TEXT DEFAULT 'KRW',
      UNIQUE (trip_id, category)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id         SERIAL PRIMARY KEY,
      trip_id    INTEGER REFERENCES trips(id),
      date       TEXT,
      category   TEXT,
      amount_thb REAL,
      amount_krw INTEGER DEFAULT 0,
      memo       TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS steps (
      id         SERIAL PRIMARY KEY,
      trip_id    INTEGER REFERENCES trips(id),
      date       TEXT NOT NULL,
      count      INTEGER NOT NULL,
      memo       TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (trip_id, date)
    );

    CREATE TABLE IF NOT EXISTS flights (
      id              SERIAL PRIMARY KEY,
      trip_id         INTEGER NOT NULL REFERENCES trips(id),
      type            TEXT NOT NULL CHECK(type IN ('outbound','return')),
      departure_place TEXT NOT NULL,
      departure_time  TEXT NOT NULL,
      arrival_place   TEXT NOT NULL,
      arrival_time    TEXT NOT NULL,
      created_at      TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ DB 초기화 완료 (PostgreSQL)');
};

createTables().catch(console.error);

module.exports = pool;
