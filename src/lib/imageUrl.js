/**
 * 网格用缩略图 / 详情用 display 图 / 原图兜底
 * 由 scripts/optimize-images.mjs 生成 public/**/thumbs/*.webp 与 display/*.webp
 */

function parseAssetPath(src) {
  if (!src || typeof src !== 'string') return null;
  const clean = src.split('?')[0];
  const nested = clean.match(/^(\/[^/]+(?:\/[^/]+)*)\/([^/]+)\.(png|jpe?g|webp)$/i);
  if (nested) {
    return { dir: nested[1], name: nested[2], ext: nested[3].toLowerCase() };
  }
  const root = clean.match(/^\/([^/]+)\.(png|jpe?g|webp)$/i);
  if (root) {
    return { dir: '', name: root[1], ext: root[2].toLowerCase() };
  }
  return null;
}

export function getThumbSrc(src) {
  const p = parseAssetPath(src);
  if (!p) return src;
  return p.dir ? `${p.dir}/thumbs/${p.name}.webp` : `/thumbs/${p.name}.webp`;
}

export function getDisplaySrc(src) {
  const p = parseAssetPath(src);
  if (!p) return src;
  return p.dir ? `${p.dir}/display/${p.name}.webp` : `/display/${p.name}.webp`;
}

/** 网格：thumb → 原图；详情：display → 原图 */
export function getImageFallback(primary, original) {
  return original || primary;
}
