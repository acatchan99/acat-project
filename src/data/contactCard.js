export const DEFAULT_CONTACT_CARD = {
  image: '/contact/expand-card.png',
  hint: {
    zh: '扫码扩列 · QQ 1739285224',
    en: 'Scan to connect · QQ 1739285224',
  },
};

let contactCardCache = { ...DEFAULT_CONTACT_CARD };

export function getContactCard() {
  return contactCardCache;
}

export function applyContactCard(data) {
  if (!data) return;
  contactCardCache = {
    ...contactCardCache,
    ...data,
    hint: { ...contactCardCache.hint, ...data.hint },
  };
}
