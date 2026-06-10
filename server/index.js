import 'dotenv/config';

import express from 'express';

import cors from 'cors';

import multer from 'multer';

import path from 'path';

import { fileURLToPath } from 'url';

import { existsSync, mkdirSync } from 'fs';

import { authMiddleware, signToken } from './lib/auth.js';

import { loadContent, saveContent, ensureDataDir, DATA_FILE } from './lib/contentStore.js';
import { DEFAULT_HERO_VIDEO, mergeHeroVideoFields } from '../src/data/heroBackgroundVideo.js';

import { spawnSync } from 'child_process';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.join(__dirname, '..');

const PUBLIC_DIR = path.join(ROOT, 'public');

const DIST_DIR = path.join(ROOT, 'dist');

const PORT = Number(process.env.PORT) || 3001;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'acat-admin-2026';

const API_ONLY = process.env.API_ONLY === 'true';

const PUBLIC_BASE = (process.env.PUBLIC_BASE_URL ?? '').replace(/\/$/, '');



if (!existsSync(DATA_FILE)) {

  spawnSync('node', ['scripts/seed.mjs'], { cwd: __dirname, stdio: 'inherit' });

}



const allowedOrigins = process.env.ALLOWED_ORIGINS

  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)

  : null;



const app = express();

app.use(cors({

  origin: allowedOrigins?.length

    ? (origin, cb) => {

      if (!origin || allowedOrigins.includes(origin)) cb(null, true);

      else cb(new Error('CORS blocked'));

    }

    : true,

  credentials: true,

}));

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

const heroVideoStorage = multer.diskStorage({
  destination(req, file, cb) {
    const sub = req.heroUploadSubfolder || 'uploads';
    const dest = path.join(PUBLIC_DIR, 'hero', sub);
    mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename(req, file, cb) {
    const safe = file.originalname.replace(/[^\w.\-()\u4e00-\u9fff]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const heroVideoUpload = multer({
  storage: heroVideoStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('请上传视频文件（mp4 / webm / mov）'));
  },
});

const heroPosterUpload = multer({
  storage: heroVideoStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('请上传图片文件'));
  },
});

function heroUploadHandler(subfolder) {
  return (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: '未选择文件' });
      return;
    }
    const relative = `/hero/${subfolder}/${req.file.filename}`.replace(/\\/g, '/');
    res.json({ url: publicUrl(relative) });
  };
}



function publicUrl(relativePath) {

  const rel = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  return PUBLIC_BASE ? `${PUBLIC_BASE}${rel}` : rel;

}



app.get('/api/health', (_req, res) => {

  res.json({ ok: true, mode: API_ONLY ? 'api' : 'full' });

});



app.get('/api/content', (_req, res) => {

  const content = loadContent();

  if (!content) {

    res.status(500).json({ error: '内容未初始化，请运行 npm run seed' });

    return;

  }

  res.json({
    ...content,
    ...mergeHeroVideoFields(DEFAULT_HERO_VIDEO, content),
  });

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

  const relative = `/${folder}/${req.file.filename}`.replace(/\\/g, '/');

  res.json({ url: publicUrl(relative) });

});

app.post('/api/upload/hero-video/mobile', authMiddleware, (req, res, next) => {
  req.heroUploadSubfolder = 'mobile';
  next();
}, heroVideoUpload.single('file'), heroUploadHandler('mobile'));

app.post('/api/upload/hero-video/desktop', authMiddleware, (req, res, next) => {
  req.heroUploadSubfolder = 'desktop';
  next();
}, heroVideoUpload.single('file'), heroUploadHandler('desktop'));

app.post('/api/upload/hero-video/poster', authMiddleware, (req, res, next) => {
  req.heroUploadSubfolder = 'poster';
  next();
}, heroPosterUpload.single('file'), heroUploadHandler('poster'));



ensureDataDir();

app.use(express.static(PUBLIC_DIR));

if (process.env.NODE_ENV === 'production') {
  if (API_ONLY) {
    app.use('/assets', express.static(path.join(DIST_DIR, 'assets')));

    const sendAdmin = (_req, res) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    };

    app.get('/admin', sendAdmin);
    app.get('/admin/*', sendAdmin);
    app.get('/', (_req, res) => {
      res.type('text').send('ACAT CMS API — 官网请访问 Vercel；后台请访问 /admin');
    });
  } else {
    app.use(express.static(DIST_DIR));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }
}

app.listen(PORT, () => {
  console.log(`ACAT server → http://localhost:${PORT}`);
  if (API_ONLY) {
    console.log(`Mode: API + /admin (官网在 Vercel)`);
  } else {
    console.log(`Mode: full stack`);
    console.log(`Admin → http://localhost:${PORT}/admin`);
  }
});


