import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, '../data');
export const DATA_FILE = path.join(DATA_DIR, 'site-content.json');

export function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function loadContent() {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) return null;
  const raw = readFileSync(DATA_FILE, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

export function saveContent(content) {
  ensureDataDir();
  writeFileSync(DATA_FILE, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
}
