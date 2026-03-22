const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'travel.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    email        TEXT    NOT NULL UNIQUE,
    password_hash TEXT,
    name         TEXT    NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

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

try { db.exec('ALTER TABLE places ADD COLUMN image_url TEXT'); } catch {}
try { db.exec('ALTER TABLE wishlist ADD COLUMN trip_id INTEGER'); } catch {}
try { db.exec('ALTER TABLE todos ADD COLUMN trip_id INTEGER'); } catch {}
try { db.exec('ALTER TABLE todos ADD COLUMN visit_time TEXT DEFAULT ""'); } catch {}
try { db.exec('ALTER TABLE todos ADD COLUMN address TEXT DEFAULT ""'); } catch {}
try { db.exec('ALTER TABLE todos ADD COLUMN map_url TEXT DEFAULT ""'); } catch {}
try { db.exec('ALTER TABLE expenses ADD COLUMN trip_id INTEGER'); } catch {}
try { db.exec('ALTER TABLE expenses ADD COLUMN amount_krw INTEGER DEFAULT 0'); } catch {}
try { db.exec('ALTER TABLE places ADD COLUMN user_id INTEGER'); } catch {}
try { db.exec('ALTER TABLE trips ADD COLUMN country TEXT DEFAULT ""'); } catch {}
try { db.exec('ALTER TABLE trips ADD COLUMN city TEXT DEFAULT ""'); } catch {}
try { db.exec('ALTER TABLE trips ADD COLUMN start_date TEXT DEFAULT ""'); } catch {}
try { db.exec('ALTER TABLE trips ADD COLUMN end_date TEXT DEFAULT ""'); } catch {}
try { db.exec('ALTER TABLE trips ADD COLUMN total_budget_krw INTEGER DEFAULT NULL'); } catch {}
try { db.exec("ALTER TABLE trips ADD COLUMN memo TEXT DEFAULT ''"); } catch {}
try { db.exec('ALTER TABLE steps ADD COLUMN trip_id INTEGER'); } catch {}
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS flights (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id          INTEGER NOT NULL,
      type             TEXT    NOT NULL CHECK(type IN ('outbound','return')),
      departure_place  TEXT    NOT NULL,
      departure_time   TEXT    NOT NULL,
      arrival_place    TEXT    NOT NULL,
      arrival_time     TEXT    NOT NULL,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id)
    )
  `);
} catch {}

db.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    owner_id    INTEGER NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS trip_members (
    trip_id   INTEGER NOT NULL,
    user_id   INTEGER NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (trip_id, user_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS invite_codes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id    INTEGER NOT NULL,
    code       TEXT    NOT NULL UNIQUE,
    created_by INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at    DATETIME,
    used_by    INTEGER,
    FOREIGN KEY (trip_id)    REFERENCES trips(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );
`);

console.log('✅ DB 초기화 완료 (travel.db)');

module.exports = db;
