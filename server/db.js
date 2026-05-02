import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'ansh.db'));

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS shlokas (
    id INTEGER PRIMARY KEY,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    title TEXT NOT NULL,
    sanskrit TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    meaning TEXT NOT NULL,
    context TEXT NOT NULL,
    tags TEXT NOT NULL,
    freq INTEGER,
    variant TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recordings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shloka_id INTEGER NOT NULL,
    recording_id TEXT UNIQUE NOT NULL,
    file_path TEXT NOT NULL,
    reciter_name TEXT,
    reciter_type TEXT CHECK(reciter_type IN ('devotional', 'non-devotional', 'academic')),
    variant TEXT,
    duration_seconds REAL,
    tempo_bpm REAL,
    meter_type TEXT,
    rhythmic_regularity REAL,
    features_json TEXT NOT NULL DEFAULT '{}',
    emotion_profile_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shloka_id) REFERENCES shlokas(id)
  );

  CREATE TABLE IF NOT EXISTS gate_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    shloka_id INTEGER NOT NULL,
    listened_seconds REAL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    UNIQUE(session_id, shloka_id)
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    recording_id INTEGER NOT NULL,
    calm INTEGER CHECK(calm BETWEEN 1 AND 7),
    awe INTEGER CHECK(awe BETWEEN 1 AND 7),
    absorption INTEGER CHECK(absorption BETWEEN 1 AND 7),
    tension INTEGER CHECK(tension BETWEEN 1 AND 7),
    sacredness INTEGER CHECK(sacredness BETWEEN 1 AND 7),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recording_id) REFERENCES recordings(id)
  );

  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_size INTEGER,
    status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    features_json TEXT,
    error_message TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME
  );

  CREATE INDEX IF NOT EXISTS idx_recordings_shloka ON recordings(shloka_id);
  CREATE INDEX IF NOT EXISTS idx_gate_session ON gate_progress(session_id);
  CREATE INDEX IF NOT EXISTS idx_ratings_recording ON ratings(recording_id);
`);

export default db;
