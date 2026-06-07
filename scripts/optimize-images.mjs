/**
 * 生成 WebP 缩略图（网格）与中图（详情），大幅减小 Vercel 传输体积。
 * 用法：npm run optimize-images
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../public');

const THUMB_W = 480;
const DISPLAY_W = 1280;
const QUALITY = 82;
const EXT = new Set(['.jpg', '.jpeg', '.png']);

const SCAN_DIRS = ['albums', 'street-cases', 'pricing', 'works'];

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'thumbs' || e.name === 'display') continue;
      await walk(full, files);
    } else if (EXT.has(extname(e.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function optimizeOne(filePath) {
  const dir = dirname(filePath);
  const base = basename(filePath, extname(filePath));
  const thumbsDir = join(dir, 'thumbs');
  const displayDir = join(dir, 'display');
  await mkdir(thumbsDir, { recursive: true });
  await mkdir(displayDir, { recursive: true });

  const thumbOut = join(thumbsDir, `${base}.webp`);
  const displayOut = join(displayDir, `${base}.webp`);

  const input = sharp(filePath);
  const meta = await input.metadata();

  if (!existsSync(thumbOut)) {
    await sharp(filePath)
      .rotate()
      .resize(THUMB_W, THUMB_W, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(thumbOut);
  }

  if (!existsSync(displayOut)) {
    const w = meta.width ?? DISPLAY_W;
    if (w > DISPLAY_W) {
      await sharp(filePath)
        .rotate()
        .resize(DISPLAY_W, DISPLAY_W, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(displayOut);
    } else {
      await sharp(filePath)
        .rotate()
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(displayOut);
    }
  }

  const orig = (await stat(filePath)).size;
  const thumb = (await stat(thumbOut)).size;
  const display = (await stat(displayOut)).size;
  return { base, orig, thumb, display };
}

async function main() {
  const files = [];
  for (const sub of SCAN_DIRS) {
    await walk(join(PUBLIC, sub), files);
  }
  // 首页关键图
  for (const name of ['about-artist.jpg', 'artist-intro.jpg', 'artist-intro.png']) {
    const p = join(PUBLIC, name);
    if (existsSync(p)) files.push(p);
  }

  console.log(`Optimizing ${files.length} images…`);
  let saved = 0;
  for (const f of files) {
    const r = await optimizeOne(f);
    saved += r.orig - r.thumb;
    console.log(`  ✓ ${basename(f)} → thumb ${(r.thumb / 1024).toFixed(0)}KB, display ${(r.display / 1024).toFixed(0)}KB`);
  }
  console.log(`Done. Approx thumb savings vs originals: ${(saved / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
