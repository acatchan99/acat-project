const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function newAlbum() {
  const slug = `series-${uid()}`;
  return {
    id: slug,
    cover: '/uploads/placeholder.jpg',
    title: { zh: '新系列', en: 'New Series' },
    subtitle: { zh: '系列副标题 · 点击添加作品', en: 'Series subtitle · add works below' },
    series: { zh: '新系列', en: 'New Series' },
    material: { zh: '材质 / 媒介说明', en: 'Material / medium' },
    size: { zh: '尺寸说明', en: 'Size' },
    price: { zh: '委托询价', en: 'Commission inquiry' },
    description: {
      zh: '在此填写该系列的整体介绍，会显示在作品详情中。',
      en: 'Series description shown in work detail views.',
    },
  };
}

export function newWork(album = 'fag') {
  return {
    album,
    id: `work-${uid()}`,
    title: '新作品',
    image: '/uploads/placeholder.jpg',
  };
}

export function newStreetCase() {
  return {
    id: `case-${uid()}`,
    image: '/uploads/placeholder.jpg',
    layout: 'square',
    title: { zh: '新街头案例', en: 'New street case' },
    location: { zh: '地点 · 2026', en: 'Location · 2026' },
  };
}

export function newPricingItem() {
  return {
    id: `price-${uid()}`,
    size: { zh: '新规格尺寸', en: 'New size' },
    product: { zh: '产品描述', en: 'Product description' },
    price: '¥0',
    images: ['/uploads/placeholder.jpg'],
    image: '/uploads/placeholder.jpg',
  };
}

export function newSocialLink() {
  return {
    platform: '新平台',
    ip: '猫',
    url: 'https://',
    followers: null,
  };
}

export function newExhibition() {
  return {
    year: '2026',
    title: { zh: '新展览 / 活动', en: 'New event' },
  };
}

export function newMissionPillar() {
  return {
    zh: { title: '新板块', desc: '中文描述' },
    en: { title: 'NEW', desc: 'English description' },
  };
}

export function newProcessStep() {
  return {
    zh: '新的创作流程步骤说明。',
    en: 'New process step description.',
  };
}
