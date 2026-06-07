let streetCasesCache = [
  {
    id: 'wildstyle',
    image: '/street-cases/case-02.jpg',
    layout: 'hero',
    title: { zh: '野风格字母墙绘', en: 'Wildstyle Letter Piece' },
    location: { zh: '户外墙面 · 2023', en: 'Outdoor Wall · 2023' },
  },
  {
    id: 'hoodie',
    image: '/street-cases/case-03.jpg',
    layout: 'tall',
    title: { zh: '角色墙绘', en: 'Character Mural' },
    location: { zh: '街头墙面 · 2025', en: 'Street Wall · 2025' },
  },
  {
    id: 'fighter',
    image: '/street-cases/case-01.jpg',
    layout: 'wide',
    title: { zh: '格斗主题涂鸦', en: 'Fighting Game Piece' },
    location: { zh: '混凝土墙 · 2024', en: 'Concrete Wall · 2024' },
  },
  {
    id: 'battle',
    image: '/street-cases/case-07.jpg',
    layout: 'wide',
    title: { zh: '角色对战场景', en: 'Character Battle Scene' },
    location: { zh: '红墙创作 · 2024', en: 'Red Wall · 2024' },
  },
  {
    id: 'live',
    image: '/street-cases/case-06.jpg',
    layout: 'square',
    title: { zh: '创作者与作品', en: 'Artist & Mural' },
    location: { zh: '现场 · 2025', en: 'On Site · 2025' },
  },
  {
    id: 'chrome',
    image: '/street-cases/case-04.jpg',
    layout: 'square',
    title: { zh: 'Chrome 骑士', en: 'Chrome Knight' },
    location: { zh: '红墙 · 2026', en: 'Red Wall · 2026' },
  },
  {
    id: 'neon',
    image: '/street-cases/case-05.jpg',
    layout: 'square',
    title: { zh: '霓虹工作室', en: 'Neon Studio Piece' },
    location: { zh: '室内创作 · 2025', en: 'Indoor Studio · 2025' },
  },
];

export function applyStreetCases(next) {
  streetCasesCache = next;
}

export function getStreetCases() {
  return streetCasesCache;
}

export const STREET_CASES = streetCasesCache;
