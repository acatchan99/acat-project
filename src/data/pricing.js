function normalizeItem(item) {
  const images = Array.isArray(item.images) && item.images.length
    ? item.images
    : (item.image ? [item.image] : []);
  return { ...item, images, image: images[0] ?? '' };
}

let pricingCache = [
  {
    id: 'fag-600',
    size: { zh: '600毫米 × 600毫米', en: '600mm × 600mm' },
    product: { zh: '布面手工喷绘', en: 'Hand-painted canvas' },
    price: '¥4,800',
    images: [
      '/pricing/600-hand.jpg',
      '/pricing/600-hand-alt.png',
      '/albums/fag/fag-05.jpg',
    ],
  },
  {
    id: 'fag-800',
    size: { zh: '800毫米 × 800毫米', en: '800mm × 800mm' },
    product: { zh: '布面手工喷绘', en: 'Hand-painted canvas' },
    price: '¥6,800',
    images: [
      '/pricing/800-hand.png',
      '/pricing/600-hand.jpg',
      '/albums/fag/fag-11.jpg',
    ],
  },
  {
    id: 'frame-405',
    size: { zh: '405毫米 × 505毫米', en: '405mm × 505mm' },
    product: { zh: '绷布油画框', en: 'Stretched canvas frame' },
    price: '¥5,800',
    images: [
      '/pricing/405-hand.png',
      '/pricing/600-hand-alt.png',
      '/albums/fag/fag-02.png',
    ],
  },
  {
    id: 'digital-avatar',
    size: { zh: '电子大头', en: 'Digital avatar' },
    product: { zh: '角色头像稿件', en: 'Character portrait' },
    price: '¥800',
    images: [
      '/albums/digital/digital-02.jpg',
      '/albums/digital/digital-01.jpg',
      '/albums/digital/digital-05.jpg',
    ],
  },
].map(normalizeItem);

export function applyPricing(next) {
  pricingCache = next.map(normalizeItem);
}

export function getPricingItems() {
  return pricingCache;
}

export function getPricingImages(item) {
  if (Array.isArray(item.images) && item.images.length) return item.images;
  return item.image ? [item.image] : [];
}

export const PRICING_ITEMS = pricingCache;
