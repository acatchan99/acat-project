import defaultLinks from './social-links.json';

const PLATFORM_LABELS = {
  tiktok: { zh: 'TikTok', en: 'TikTok', abbr: 'TK' },
  threads: { zh: 'Threads', en: 'Threads', abbr: 'TH' },
  小红书: { zh: '小红书', en: 'RED', abbr: '红' },
  微博: { zh: '微博', en: 'Weibo', abbr: '微' },
  X: { zh: 'X', en: 'X', abbr: 'X' },
  Mastodon: { zh: 'Mastodon', en: 'Mastodon', abbr: 'M' },
  pinterest: { zh: 'Pinterest', en: 'Pinterest', abbr: 'P' },
  deviantart: { zh: 'DeviantArt', en: 'DeviantArt', abbr: 'DA' },
  Sheezy: { zh: 'Sheezy', en: 'Sheezy', abbr: 'Sh' },
  A站: { zh: 'ArtStation', en: 'ArtStation', abbr: 'AS' },
  P站: { zh: 'Pixiv', en: 'Pixiv', abbr: 'Px' },
  cara: { zh: 'Cara', en: 'Cara', abbr: 'Ca' },
  Itaku: { zh: 'Itaku', en: 'Itaku', abbr: 'It' },
  Newgrounds: { zh: 'Newgrounds', en: 'Newgrounds', abbr: 'NG' },
  unvale: { zh: 'Unvale', en: 'Unvale', abbr: 'Uv' },
  Artfight: { zh: 'Artfight', en: 'Artfight', abbr: 'Af' },
  CharacterHub: { zh: 'CharacterHub', en: 'CharacterHub', abbr: 'CH' },
  Inkbunny: { zh: 'Inkbunny', en: 'Inkbunny', abbr: 'Ib' },
};

export const SOCIAL_GROUPS = [
  {
    id: 'danoso',
    ip: '呆',
    label: { zh: '呆 · DANOSO', en: 'DANOSO' },
    desc: { zh: '呆乐兽日常 · 短视频矩阵', en: 'DANOSO daily · short video' },
  },
  {
    id: 'mao',
    ip: '猫',
    label: { zh: '猫 · ACAT', en: 'ACAT · 猫' },
    desc: { zh: '陈吖猫主账号 · 国内社媒', en: 'ACAT main · CN socials' },
  },
  {
    id: 'acat',
    ip: 'ACAT',
    label: { zh: 'ACAT · 国际平台', en: 'ACAT · Global' },
    desc: { zh: '作品集 · 国际社区', en: 'Portfolio · global communities' },
  },
];

let linksCache = [...defaultLinks];

export function applySocialLinks(next) {
  linksCache = next;
}

function extractHandle(url) {
  try {
    const u = new URL(url);
    const pathPart = u.pathname.replace(/\/$/, '');
    const parts = pathPart.split('/').filter(Boolean);
    if (parts.length === 0) return u.hostname.replace('www.', '');
    const last = parts[parts.length - 1];
    if (last.startsWith('@')) return last;
    if (/^u?\d+$/.test(last) && parts.length > 1) return `@${parts[parts.length - 2]}`;
    return parts.length > 1 ? `@${last}` : `@${last}`;
  } catch {
    return '';
  }
}

export function getSocialLinks() {
  return linksCache.map((item) => {
    const meta = PLATFORM_LABELS[item.platform] ?? {
      zh: item.platform,
      en: item.platform,
      abbr: item.platform.slice(0, 2).toUpperCase(),
    };
    return {
      ...item,
      label: meta,
      handle: extractHandle(item.url),
    };
  });
}

export function getLinksByIp(ip) {
  return getSocialLinks().filter((item) => item.ip === ip);
}

export function pickLang(obj, lang) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] ?? obj.zh ?? obj.en ?? '';
}
