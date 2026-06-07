import manifest from './works-manifest.json';
import {
  getAlbumMeta,
  getAlbums,
  getCollections,
  getAlbumTabs,
} from './albums';
import { applyExhibitions as applyExhibitionsData, getExhibitionsData } from './exhibitions';

export { getAlbums, getCollections, getAlbumTabs, getAlbumById } from './albums';

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

function albumOrder() {
  return getAlbums().map((a) => a.id);
}

function buildWorksFromManifest(source) {
  const order = albumOrder();
  const albumCounters = Object.fromEntries(order.map((id) => [id, 0]));

  return [...source]
    .sort(
      (a, b) =>
        (order.indexOf(a.album) === -1 ? 999 : order.indexOf(a.album))
        - (order.indexOf(b.album) === -1 ? 999 : order.indexOf(b.album))
        || a.id.localeCompare(b.id, undefined, { numeric: true }),
    )
    .map((entry) => {
      albumCounters[entry.album] = (albumCounters[entry.album] ?? 0) + 1;
      const idx = albumCounters[entry.album];
      const meta = getAlbumMeta(entry.album);

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

let exhibitionsCache = getExhibitionsData();

export function applyWorksManifest(next) {
  worksCache = buildWorksFromManifest(next);
}

export function applyExhibitions(next) {
  exhibitionsCache = next;
  applyExhibitionsData(next);
}

export function getExhibitions() {
  return exhibitionsCache;
}

export const EXHIBITIONS = exhibitionsCache;

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
