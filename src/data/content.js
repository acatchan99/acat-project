import manifest from './works-manifest.json';

const ALBUM_ORDER = ['fag', 'digital', 'odod'];

const ALBUM_META = {
  fag: {
    series: { zh: 'FAG · Furry Art Graffiti', en: 'FAG · Furry Art Graffiti' },
    material: { zh: 'Montana 马克笔 · Onelake 喷漆 · 布面', en: 'Montana Markers · Onelake Spray on Canvas' },
    size: '600 × 600 mm',
    price: { zh: '委托询价', en: 'Commission' },
    description: {
      zh: 'FAG 系列——福瑞角色与街头涂鸦融合的布面喷绘作品，呈现 OC 角色的视觉身份。',
      en: 'FAG series — canvas spray paintings merging furry characters with street graffiti culture.',
    },
  },
  digital: {
    series: { zh: '电子大头', en: 'Digital Avatars' },
    material: { zh: '数字绘画 · 电子大头稿', en: 'Digital painting · Avatar commissions' },
    size: { zh: '电子大头', en: 'Digital avatar' },
    price: { zh: '约稿咨询', en: 'Commission inquiry' },
    description: {
      zh: '电子大头系列——福瑞角色电子头像稿件，呈现 OC 角色的数字视觉形象。',
      en: 'Digital avatar series — furry character portrait commissions in digital form.',
    },
  },
  odod: {
    series: { zh: 'ODOD · DANOSO 呆乐兽日常', en: 'ODOD · DANOSO Daily' },
    material: { zh: '数字稿件 · 角色日常', en: 'Digital · Character daily sketches' },
    size: { zh: '可变', en: 'Variable' },
    price: { zh: '系列创作', en: 'Series work' },
    description: {
      zh: 'ODOD · DANOSO 呆乐兽的日常稿件——记录角色在日常场景中的表情、动作与生活瞬间。',
      en: 'ODOD · DANOSO daily sketches — everyday moments, expressions and scenes of the character.',
    },
  },
};

const ODOD_AUTO_TITLE = /^(Snipaste_|Image_|IMG_|mmexport|QQ_)/;

function buildTitle(entry, indexInAlbum) {
  const raw = entry.title;
  if (entry.album === 'odod' && ODOD_AUTO_TITLE.test(raw)) {
    const n = String(indexInAlbum).padStart(2, '0');
    return { zh: `呆乐兽日常 ${n}`, en: `DANOSO Daily ${n}` };
  }
  if (raw === '1' && entry.album === 'fag') {
    return { zh: 'FAG 01', en: 'FAG 01' };
  }
  return raw;
}

function buildWorksFromManifest(source) {
  const albumCounters = { fag: 0, digital: 0, odod: 0 };
  return [...source]
    .sort(
      (a, b) =>
        ALBUM_ORDER.indexOf(a.album) - ALBUM_ORDER.indexOf(b.album)
        || a.id.localeCompare(b.id, undefined, { numeric: true }),
    )
    .map((entry) => {
      albumCounters[entry.album] += 1;
      const idx = albumCounters[entry.album];
      const meta = ALBUM_META[entry.album];

      return {
        id: entry.id,
        albumId: entry.album,
        title: buildTitle(entry, idx),
        series: meta.series,
        artist: 'ACAT CHAN',
        material: meta.material,
        size: meta.size,
        price: meta.price,
        image: entry.image,
        images: [entry.image],
        description: meta.description,
      };
    });
}

let worksCache = buildWorksFromManifest(manifest);

let exhibitionsCache = [
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

export function applyWorksManifest(next) {
  worksCache = buildWorksFromManifest(next);
}

export function applyExhibitions(next) {
  exhibitionsCache = next;
}

export function getExhibitions() {
  return exhibitionsCache;
}

export const EXHIBITIONS = exhibitionsCache;

export const COLLECTIONS = [
  { id: 'fag', image: '/albums/fag/fag-02.png' },
  { id: 'digital', image: '/albums/digital/digital-02.jpg' },
  { id: 'odod', image: '/albums/odod/odod-01.jpg' },
];

export const ALBUMS = COLLECTIONS.map(({ id, image }) => ({ id, cover: image }));

export function getWorksByAlbum(albumId) {
  return worksCache.filter((w) => w.albumId === albumId);
}

export const GALLERY_CHARS = [
  'BAIDU', 'AMIU', '日々', 'BRANDY',
  'CHIMURE', 'PARADOX', '高川', '右曦',
  'CHEN', 'CYCY', '玄星', '魔无畏',
  '赤玄', 'MOYU', 'CYPR', '极光',
];

export function pickLang(obj, lang) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] ?? obj.zh ?? obj.en ?? '';
}
