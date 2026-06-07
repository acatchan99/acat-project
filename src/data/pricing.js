let pricingCache = [
  {
    id: 'fag-600',
    size: { zh: '600毫米 × 600毫米', en: '600mm × 600mm' },
    product: { zh: '布面手工喷绘', en: 'Hand-painted canvas' },
    price: '¥4,800',
    image: '/pricing/600-hand.jpg',
  },
  {
    id: 'fag-800',
    size: { zh: '800毫米 × 800毫米', en: '800mm × 800mm' },
    product: { zh: '布面手工喷绘', en: 'Hand-painted canvas' },
    price: '¥6,800',
    image: '/pricing/800-hand.png',
  },
  {
    id: 'frame-405',
    size: { zh: '405毫米 × 505毫米', en: '405mm × 505mm' },
    product: { zh: '绷布油画框', en: 'Stretched canvas frame' },
    price: '¥5,800',
    image: '/pricing/405-hand.png',
  },
  {
    id: 'digital-avatar',
    size: { zh: '电子大头', en: 'Digital avatar' },
    product: { zh: '角色头像稿件', en: 'Character portrait' },
    price: '¥800',
    image: '/albums/digital/digital-02.jpg',
  },
];

export function applyPricing(next) {
  pricingCache = next;
}

export function getPricingItems() {
  return pricingCache;
}

export const PRICING_ITEMS = pricingCache;
