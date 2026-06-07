import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { authMiddleware, signToken } from './lib/auth.js';
import { loadContent, saveContent, ensureDataDir, DATA_FILE } from './lib/contentStore.js';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PORT = Number(process.env.PORT) || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'acat-admin-2026';

if (!existsSync(DATA_FILE)) {
  spawnSync('node', ['scripts/seed.mjs'], { cwd: __dirname, stdio: 'inherit' });
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = (req.body.folder || 'uploads').replace(/\.\./g, '');
    const dest = path.join(PUBLIC_DIR, folder);
    mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename(req, file, cb) {
    const safe = file.originalname.replace(/[^\w.\-()\u4e00-\u9fff]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/content', (_req, res) => {
  const content = loadContent();
  if (!content) {
    res.status(500).json({ error: '内容未初始化，请运行 npm run seed' });
    return;
  }
  res.json(content);
});

app.put('/api/content', authMiddleware, (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: '无效内容' });
    return;
  }
  saveContent(body);
  res.json({ ok: true });
});

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body ?? {};
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: '密码错误' });
    return;
  }
  const token = signToken({ role: 'admin' });
  res.json({ token });
});

app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: '未选择文件' });
    return;
  }
  const folder = (req.body.folder || 'uploads').replace(/\.\./g, '');
  const url = `/${folder}/${req.file.filename}`.replace(/\\/g, '/');
  res.json({ url });
});

if (process.env.NODE_ENV === 'production') {
  const distDir = path.join(ROOT, 'dist');
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

ensureDataDir();

app.listen(PORT, () => {
  console.log(`ACAT CMS API → http://localhost:${PORT}`);
  console.log(`Admin panel  → http://localhost:${PORT}/admin (production)`);
});
