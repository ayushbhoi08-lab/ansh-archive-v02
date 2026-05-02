import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import upload from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Get all uploads
router.get('/uploads', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM uploads ORDER BY uploaded_at DESC').all();
  res.json(rows);
});

// Upload WAV + trigger Python analysis
router.post('/upload', requireAuth, upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { originalname, filename, size, path: filePath } = req.file;

  // Log upload
  const result = db.prepare(`
    INSERT INTO uploads (filename, original_name, file_size, status)
    VALUES (?, ?, ?, 'pending')
  `).run(filename, originalname, size);

  const uploadId = result.lastInsertRowid;

  // Trigger Python analysis asynchronously
  const pythonScript = path.join(__dirname, '../scripts/extract_features.py');
  const outputPath = path.join(__dirname, '../uploads', `${filename}.json`);

  const python = spawn('python', [pythonScript, filePath, outputPath], {
    detached: true,
    stdio: 'ignore',
  });

  python.on('error', (err) => {
    console.error('Python pipeline error:', err);
    db.prepare('UPDATE uploads SET status = ?, error_message = ? WHERE id = ?')
      .run('failed', err.message, uploadId);
  });

  python.on('exit', (code) => {
    if (code === 0) {
      try {
        import('fs').then(fs => {
          const features = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
          db.prepare('UPDATE uploads SET status = ?, features_json = ?, processed_at = ? WHERE id = ?')
            .run('completed', JSON.stringify(features), new Date().toISOString(), uploadId);
        }).catch(e => {
          db.prepare('UPDATE uploads SET status = ?, error_message = ? WHERE id = ?')
            .run('failed', e.message, uploadId);
        });
      } catch (e) {
        db.prepare('UPDATE uploads SET status = ?, error_message = ? WHERE id = ?')
          .run('failed', e.message, uploadId);
      }
    } else {
      db.prepare('UPDATE uploads SET status = ?, error_message = ? WHERE id = ?')
        .run('failed', `Python exited with code ${code}`, uploadId);
    }
  });

  res.json({
    id: uploadId,
    filename,
    originalName: originalname,
    status: 'pending',
    message: 'Upload received. Analysis in progress.',
  });
});

export default router;
