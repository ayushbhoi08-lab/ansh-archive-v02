import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import { errorHandler } from './middleware/errorHandler.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));

app.use(express.json());

// API Routes

// ===== SHLOKAS =====
app.get('/api/shlokas', (req, res) => {
  const { chapter, tag } = req.query;
  let sql = 'SELECT * FROM shlokas WHERE 1=1';
  const params = [];
  if (chapter) { sql += ' AND chapter = ?'; params.push(chapter); }
  if (tag) { sql += ' AND tags LIKE ?'; params.push(`%"${tag}"%`); }
  sql += ' ORDER BY chapter, verse';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(r => ({ ...r, tags: JSON.parse(r.tags) })));
});

app.get('/api/shlokas/:id', (req, res) => {
  const shloka = db.prepare('SELECT * FROM shlokas WHERE id = ?').get(req.params.id);
  if (!shloka) return res.status(404).json({ error: 'Not found' });
  const recordings = db.prepare('SELECT * FROM recordings WHERE shloka_id = ?').all(req.params.id);
  res.json({ ...shloka, tags: JSON.parse(shloka.tags), recordings });
});

// ===== RECORDINGS =====
app.get('/api/recordings/:id', (req, res) => {
  const rec = db.prepare('SELECT * FROM recordings WHERE id = ?').get(req.params.id);
  if (!rec) return res.status(404).json({ error: 'Not found' });
  res.json({
    ...rec,
    features: JSON.parse(rec.features_json || '{}'),
    emotionProfile: JSON.parse(rec.emotion_profile_json || '{}')
  });
});

app.get('/api/recordings/:id/audio', (req, res) => {
  const rec = db.prepare('SELECT file_path FROM recordings WHERE id = ?').get(req.params.id);
  if (!rec) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.resolve(rec.file_path));
});

// ===== GATE =====
app.post('/api/gate/progress', (req, res) => {
  const { sessionId, shlokaId, seconds } = req.body;
  if (!sessionId || !shlokaId) return res.status(400).json({ error: 'Missing fields' });

  const existing = db.prepare('SELECT * FROM gate_progress WHERE session_id = ? AND shloka_id = ?').get(sessionId, shlokaId);
  const completed = (seconds >= 30) || (existing?.completed);

  if (existing) {
    db.prepare('UPDATE gate_progress SET listened_seconds = ?, completed = ?, completed_at = COALESCE(completed_at, ?) WHERE session_id = ? AND shloka_id = ?')
      .run(Math.max(existing.listened_seconds, seconds), completed, completed ? new Date().toISOString() : null, sessionId, shlokaId);
  } else {
    db.prepare('INSERT INTO gate_progress (session_id, shloka_id, listened_seconds, completed, completed_at) VALUES (?, ?, ?, ?, ?)')
      .run(sessionId, shlokaId, seconds, completed, completed ? new Date().toISOString() : null);
  }

  res.json({ success: true, completed });
});

app.get('/api/gate/status', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  const rows = db.prepare('SELECT shloka_id, completed FROM gate_progress WHERE session_id = ?').all(sessionId);
  const completed = rows.filter(r => r.completed).length;
  const total = 9;
  res.json({ completed, total, unlocked: completed >= total, shlokas: rows });
});

// ===== RATINGS =====
app.post('/api/ratings', (req, res) => {
  const { sessionId, recordingId, calm, awe, absorption, tension, sacredness, notes } = req.body;
  if (!sessionId || !recordingId) return res.status(400).json({ error: 'Missing fields' });

  const result = db.prepare(`
    INSERT INTO ratings (session_id, recording_id, calm, awe, absorption, tension, sacredness, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(sessionId, recordingId, calm, awe, absorption, tension, sacredness, notes || null);

  res.json({ id: result.lastInsertRowid, success: true });
});

app.get('/api/ratings/:recordingId/stats', (req, res) => {
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as count,
      AVG(calm) as calm,
      AVG(awe) as awe,
      AVG(absorption) as absorption,
      AVG(tension) as tension,
      AVG(sacredness) as sacredness
    FROM ratings WHERE recording_id = ?
  `).get(req.params.recordingId);
  res.json(stats);
});

// ===== FEATURES =====
app.get('/api/features/:recordingId', (req, res) => {
  const rec = db.prepare('SELECT features_json FROM recordings WHERE recording_id = ?').get(req.params.recordingId);
  if (rec) return res.json(JSON.parse(rec.features_json || '{}'));
  res.status(404).json({ error: 'Not found' });
});

// ===== ADMIN =====
app.use('/api/admin', adminRoutes);

// ===== STATIC FILES =====
// In production, serve the React build from dist/
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, db: 'connected', timestamp: new Date().toISOString() });
});

// Catch-all: serve React app for client-side routing
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ANSH Archive API running on http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Database: ${process.env.DB_PATH || './ansh.db'}`);
});
