export const DEFAULT_ALBUMS = [
  {
    id: 'fag',
    cover: '/albums/fag/fag-02.png',
    title: { zh: 'FAG', en: 'FAG' },
    subtitle: { zh: 'Furry Art Graffiti · 涂鸦介绍', en: 'Furry Art Graffiti · Intro' },
    series: { zh: 'FAG · Furry Art Graffiti', en: 'FAG · Furry Art Graffiti' },
    material: { zh: 'Montana 马克笔 · Onelake 喷漆 · 布面', en: 'Montana Markers · Onelake Spray on Canvas' },
    size: '600 × 600 mm',
    price: { zh: '委托询价', en: 'Commission' },
    description: {
      zh: 'FAG 系列——福瑞角色与街头涂鸦融合的布面喷绘作品，呈现 OC 角色的视觉身份。',
      en: 'FAG series — canvas spray paintings merging furry characters with street graffiti culture.',
    },
  },
  {
    id: 'digital',
    cover: '/albums/digital/digital-02.jpg',
    title: { zh: '电子大头', en: 'Digital Avatars' },
    subtitle: { zh: '数字绘画 · 角色头像', en: 'Digital painting · Avatars' },
    series: { zh: '电子大头', en: 'Digital Avatars' },
    material: { zh: '数字绘画 · 电子大头稿', en: 'Digital painting · Avatar commissions' },
    size: { zh: '电子大头', en: 'Digital avatar' },
    price: { zh: '约稿咨询', en: 'Commission inquiry' },
    description: {
      zh: '电子大头系列——福瑞角色电子头像稿件，呈现 OC 角色的数字视觉形象。',
      en: 'Digital avatar series — furry character portrait commissions in digital form.',
    },
  },
  {
    id: 'odod',
    cover: '/albums/odod/odod-01.jpg',
    title: { zh: 'ODOD', en: 'ODOD' },
    subtitle: { zh: 'DANOSO 呆乐兽 · 日常稿件', en: 'DANOSO · Daily sketches' },
    series: { zh: 'ODOD · DANOSO 呆乐兽日常', en: 'ODOD · DANOSO Daily' },
    material: { zh: '数字稿件 · 角色日常', en: 'Digital · Character daily sketches' },
    size: { zh: '可变', en: 'Variable' },
    price: { zh: '系列创作', en: 'Series work' },
    description: {
      zh: 'ODOD · DANOSO 呆乐兽的日常稿件——记录角色在日常场景中的表情、动作与生活瞬间。',
      en: 'ODOD · DANOSO daily sketches — everyday moments, expressions and scenes of the character.',
    },
  },
];

const FALLBACK_META = {
  series: { zh: '作品集', en: 'Collection' },
  material: { zh: '—', en: '—' },
  size: { zh: '—', en: '—' },
  price: { zh: '委托询价', en: 'Commission' },
  description: { zh: '', en: '' },
};

let albumsCache = DEFAULT_ALBUMS.map((a) => ({ ...a }));

export function applyAlbums(next) {
  if (!Array.isArray(next) || !next.length) return;
  albumsCache = next.map((a) => ({ ...a }));
}

export function getAlbums() {
  return albumsCache;
}

export function getAlbumById(id) {
  return albumsCache.find((a) => a.id === id);
}

export function getAlbumMeta(id) {
  const album = getAlbumById(id);
  if (!album) return FALLBACK_META;
  return {
    series: album.series ?? FALLBACK_META.series,
    material: album.material ?? FALLBACK_META.material,
    size: album.size ?? FALLBACK_META.size,
    price: album.price ?? FALLBACK_META.price,
    description: album.description ?? FALLBACK_META.description,
  };
}

export function getCollections() {
  return albumsCache.map(({ id, cover }) => ({ id, image: cover }));
}

export function getAlbumTabs() {
  return albumsCache.map(({ id, cover }) => ({ id, cover }));
}
