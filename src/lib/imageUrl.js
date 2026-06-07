/** WebP 路径；由 scripts/optimize-images.mjs 在 build 时生成 */

function parseAssetPath(src) {
  if (!src || typeof src !== 'string') return null;
  const clean = src.split('?')[0];
  const nested = clean.match(/^(\/[^/]+(?:\/[^/]+)*)\/([^/]+)\.(png|jpe?g|webp)$/i);
  if (nested) {
    return { dir: nested[1], name: nested[2] };
  }
  const root = clean.match(/^\/([^/]+)\.(png|jpe?g|webp)$/i);
  if (root) {
    return { dir: '', name: root[1] };
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
