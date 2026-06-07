import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translations } from '../../src/i18n/translations.js';
import { getStreetCases } from '../../src/data/streetCases.js';
import { getPricingItems } from '../../src/data/pricing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, '../../src/data/works-manifest.json');
const socialPath = path.join(__dirname, '../../src/data/social-links.json');
const outPath = path.join(__dirname, '../data/site-content.json');

const exhibitions = [
  { year: '2018', title: { zh: '成都 FIT 成都度饭堂现场涂鸦表演', en: 'Chengdu FIT live graffiti performance' } },
  { year: '2019', title: { zh: '成都涂鸦成长 · 大学生野营涂鸦活动涂鸦表演', en: 'Chengdu Graffiti Growth camp live performance' } },
  { year: '2021', title: { zh: 'THEONE 成都科华路酒吧高校联动涂鸦现场涂鸦表演', en: 'THEONE Chengdu live graffiti performance' } },
  { year: '2022', title: { zh: '广州光之树 · 潮流街头涂鸦社区活动', en: 'Guangzhou Light Tree street graffiti event' } },
  { year: '2023', title: { zh: '成都涂知岛 · 潮流涂鸦社区活动', en: 'Chengdu Tu Zhi Dao graffiti community event' } },
  { year: '2024', title: { zh: 'HAMJAM · 潮流涂鸦社区活动（广州城市之光）', en: 'HAMJAM graffiti event (Guangzhou)' } },
  { year: '2024', title: { zh: '山鬼 · 潮流涂鸦社区活动（广州白云国际）', en: 'Shangui graffiti event (Guangzhou)' } },
  { year: '2024', title: { zh: '涂鸦艺术家交流作品展（上海 ShakeWell）', en: 'Graffiti artist exchange (Shanghai ShakeWell)' } },
  { year: '2024', title: { zh: 'BDMG 街头艺术展（北京 THEBOX）', en: 'BDMG Street Art Exhibition (Beijing THEBOX)' } },
  { year: '2024', title: { zh: '草莓音乐节 · 潮流文化街头摊位涂鸦及装置', en: 'Strawberry Music Festival graffiti installation' } },
  { year: '2024', title: { zh: 'PLAY IN THE 商圈「耍」涂鸦艺术展（北京三里屯）', en: 'PLAY IN THE graffiti exhibition (Beijing Sanlitun)' } },
];

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
};

if (!existsSync(path.dirname(outPath))) {
  mkdirSync(path.dirname(outPath), { recursive: true });
}
writeFileSync(outPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
console.log('Seeded site-content.json');
