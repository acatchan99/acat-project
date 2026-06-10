import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translations } from '../../src/i18n/translations.js';
import { getStreetCases } from '../../src/data/streetCases.js';
import { getPricingItems } from '../../src/data/pricing.js';
import { DEFAULT_CONTACT_CARD } from '../../src/data/contactCard.js';
import { DEFAULT_ALBUMS } from '../../src/data/albums.js';
import { DEFAULT_EXHIBITIONS } from '../../src/data/exhibitions.js';
import { DEFAULT_HERO_VIDEO } from '../../src/data/heroBackgroundVideo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, '../../src/data/works-manifest.json');
const socialPath = path.join(__dirname, '../../src/data/social-links.json');
const outPath = path.join(__dirname, '../data/site-content.json');

const exhibitions = DEFAULT_EXHIBITIONS;

function readJson(filePath) {
  const raw = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

const content = {
  translations,
  worksManifest: readJson(manifestPath),
  streetCases: getStreetCases(),
  pricing: getPricingItems(),
  socialLinks: readJson(socialPath),
  exhibitions,
  albums: DEFAULT_ALBUMS,
  contactCard: DEFAULT_CONTACT_CARD,
  ...DEFAULT_HERO_VIDEO,
};

if (!existsSync(path.dirname(outPath))) {
  mkdirSync(path.dirname(outPath), { recursive: true });
}
if (existsSync(outPath)) {
  console.log('site-content.json already exists, skip seed');
  process.exit(0);
}
writeFileSync(outPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
console.log('Seeded site-content.json');
