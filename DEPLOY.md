# ANSH Archive — Deployment Guide

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Seed the database
cd server && node scripts/seed.js && cd ..

# 3. Build frontend
npm run build

# 4. Start production server
npm start
```

Server runs on `http://localhost:3001`

---

## Deploy to Render (Recommended — Free)

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Create Web Service on Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Name:** `ansh-archive`
   - **Runtime:** Node
   - **Build Command:** `npm install && cd server && npm install && cd .. && npm run build && cd server && node scripts/seed.js`
   - **Start Command:** `node server/server.js`
   - **Plan:** Free
4. Add Environment Variables:
   ```
   NODE_ENV=production
   ADMIN_PASSWORD=your-secure-password-here
   CORS_ORIGIN=https://yourdomain.com
   ```
5. Click **Create Web Service**

Render gives you a free URL like `https://ansh-archive.onrender.com`

---

## Deploy to Railway (Alternative)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Add a start command: `node server/server.js`
4. Set environment variables same as above
5. Deploy

---

## Deploy to VPS / Dedicated Server

### Prerequisites
- Node.js 20+
- Python 3.10+ (for audio analysis pipeline)
- Nginx (recommended)
- PM2 (recommended for process management)

### Server Setup
```bash
# Clone repo
git clone https://github.com/yourusername/ansh-archive.git
cd ansh-archive

# Install Node dependencies
npm install
cd server && npm install && cd ..

# Install Python dependencies (optional but recommended)
pip install librosa numpy

# Build frontend
npm run build

# Seed database
cd server && node scripts/seed.js && cd ..

# Set production env
cp server/.env.example server/.env
nano server/.env  # Edit ADMIN_PASSWORD and CORS_ORIGIN

# Start with PM2
npm install -g pm2
pm2 start server/server.js --name "ansh-archive"
pm2 save
pm2 startup
```

### Nginx Config
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then get SSL with Certbot:
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port |
| `NODE_ENV` | Yes | `development` | `production` or `development` |
| `ADMIN_PASSWORD` | Yes | - | Password for `/admin` access |
| `CORS_ORIGIN` | No | `*` | Allowed frontend domain |
| `DB_PATH` | No | `./ansh.db` | SQLite database file |
| `UPLOAD_DIR` | No | `./uploads` | WAV upload directory |
| `MAX_FILE_SIZE` | No | `52428800` | Max upload size in bytes (50MB) |

---

## Admin Access

Navigate to `/admin` on your deployed site.

**Login:** Use Basic Auth
- Username: `admin`
- Password: whatever you set in `ADMIN_PASSWORD`

In development, the password is plain text from `.env`.
In production, bcrypt hashing is used.

---

## Adding Real Recordings

### Method 1: Static JSON (Fastest)
1. Record your WAV
2. Run Python analysis locally:
   ```bash
   python server/scripts/extract_features.py your_recording.wav output.json
   ```
3. Copy `output.json` to `public/data/BG_X.Y.json`
4. Add recording entry to `src/data/recordings.js`
5. Rebuild: `npm run build`
6. Restart server

### Method 2: Upload Panel (Requires Python on server)
1. Go to `/admin`
2. Drag and drop WAV files
3. Server auto-runs `extract_features.py`
4. Features saved to database

---

## Database Backup

SQLite is a single file. Back it up easily:
```bash
cp server/ansh.db backups/ansh-$(date +%Y%m%d).db
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module 'better-sqlite3'` | Run `cd server && npm install` |
| Build fails | Check Node version ≥ 20 |
| Audio won't play | Ensure WAV files are in `public/recordings/` or uploaded via admin |
| Gate won't unlock | Listen to each of 9 shlokas for ≥30 seconds |
| Admin shows 401 | Check `ADMIN_PASSWORD` in `.env` |

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React 19  │────→│   Express    │────→│   SQLite    │
│   (dist/)   │     │   (API)      │     │   (ansh.db) │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  Python     │
                    │  (librosa)  │
                    └─────────────┘
```

Single-server deployment. No complex infrastructure needed.
