/** 展览与活动 — 与 acat web.docx 原文一致 */
export const DEFAULT_EXHIBITIONS = [
  {
    year: '2018',
    title: {
      zh: '广汽本田 FIT 飞度发布会现场涂鸦嘉宾',
      en: 'GAC Honda FIT launch live graffiti guest',
    },
  },
  {
    year: '2019',
    title: {
      zh: '《看我涂鸦飞驰》大学城野营户外活动涂鸦嘉宾',
      en: '"Watch Me Graffiti Fly" university camp outdoor graffiti guest',
    },
  },
  {
    year: '2021',
    title: {
      zh: 'THEONE 广州沿江路酒吧广校联盟周年庆现场涂鸦嘉宾',
      en: 'THEONE Guangzhou riverside bar alliance anniversary live graffiti guest',
    },
  },
  {
    year: '2022',
    title: {
      zh: '瘦狗之巅 · 广州线下涂鸦交流活动',
      en: 'Shougou Summit · Guangzhou offline graffiti exchange',
    },
  },
  {
    year: '2023',
    title: {
      zh: '迷涂知返 · 广州涂鸦交流活动',
      en: 'Lost & Found Graffiti · Guangzhou graffiti exchange',
    },
  },
  {
    year: '2024',
    title: {
      zh: 'HAMJAM · 广州涂鸦交流活动（广州城市之丘）',
      en: 'HAMJAM · Guangzhou graffiti exchange (City Hill)',
    },
  },
  {
    year: '2024',
    title: {
      zh: '山夏 · 广州涂鸦交流活动（广州白云金钟）',
      en: 'Shanxia · Guangzhou graffiti exchange (Baiyun Jinzhong)',
    },
  },
  {
    year: '2024',
    title: {
      zh: '涂鸦公仔接龙连锁作品展（上海 ShakeWell）',
      en: 'Graffiti figure relay group show (Shanghai ShakeWell)',
    },
  },
  {
    year: '2024',
    title: {
      zh: 'BDMG 街头艺术展（北京 THEBOX 朝外年轻力中心 A 馆）',
      en: 'BDMG Street Art Exhibition (Beijing THEBOX Chaowai)',
    },
  },
  {
    year: '2024',
    title: {
      zh: '草莓音乐节 · 歪脑商行户外摊位涂鸦艺术装置',
      en: 'Strawberry Music Festival · Wainao outdoor graffiti installation',
    },
  },
  {
    year: '2024',
    title: {
      zh: 'PLAY IN THE 羊圈「耍」涂鸦艺术展（宁夏银川市宝丰银座 C1-16）',
      en: 'PLAY IN THE Yangquan "Shua" graffiti exhibition (Yinchuan Baofeng)',
    },
  },
];

let exhibitionsCache = DEFAULT_EXHIBITIONS.map((item) => ({ ...item, title: { ...item.title } }));

export function applyExhibitions(next) {
  exhibitionsCache = next;
}

export function getExhibitionsData() {
  return exhibitionsCache;
}
