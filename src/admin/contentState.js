import { cloneDefaultContent } from '../data/defaultContent';

/** 载入 CMS 时与默认文案深合并，避免缺字段导致表单异常 */
export function normalizeAdminContent(raw) {
  const defaults = cloneDefaultContent();
  if (!raw || typeof raw !== 'object') return defaults;

  const mergeLang = (base, patch) => {
    const out = { ...base };
    if (!patch || typeof patch !== 'object') return out;
    for (const [key, val] of Object.entries(patch)) {
      if (val && typeof val === 'object' && !Array.isArray(val) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
        out[key] = mergeLang(base[key], val);
      } else if (val !== undefined) {
        out[key] = val;
      }
    }
    return out;
  };

  return {
    ...defaults,
    ...raw,
    translations: {
      zh: mergeLang(defaults.translations.zh, raw.translations?.zh),
      en: mergeLang(defaults.translations.en, raw.translations?.en),
    },
    albums: raw.albums?.length ? raw.albums : defaults.albums,
    worksManifest: raw.worksManifest?.length ? raw.worksManifest : defaults.worksManifest,
    streetCases: raw.streetCases?.length ? raw.streetCases : defaults.streetCases,
    pricing: raw.pricing?.length ? raw.pricing : defaults.pricing,
    socialLinks: raw.socialLinks?.length ? raw.socialLinks : defaults.socialLinks,
    exhibitions: raw.exhibitions?.length ? raw.exhibitions : defaults.exhibitions,
    contactCard: raw.contactCard ?? defaults.contactCard,
  };
}

/** 文案面板：更新 translations[lang][section] */
export function patchTranslation(setContent, lang, section, patchObj) {
  setContent((prev) => ({
    ...prev,
    translations: {
      ...prev.translations,
      [lang]: {
        ...prev.translations[lang],
        [section]: { ...prev.translations[lang][section], ...patchObj },
      },
    },
  }));
}

/** 文案面板：同一 section 下中英文字段一次更新 */
export function patchTranslationBilingual(setContent, section, key, value) {
  setContent((prev) => ({
    ...prev,
    translations: {
      ...prev.translations,
      zh: {
        ...prev.translations.zh,
        [section]: { ...prev.translations.zh[section], [key]: value.zh },
      },
      en: {
        ...prev.translations.en,
        [section]: { ...prev.translations.en[section], [key]: value.en },
      },
    },
  }));
}

/** 文案面板：同时更新 zh / en 的 section 对象 */
export function patchTranslationBoth(setContent, section, zhPatch, enPatch) {
  setContent((prev) => ({
    ...prev,
    translations: {
      ...prev.translations,
      zh: {
        ...prev.translations.zh,
        [section]: { ...prev.translations.zh[section], ...zhPatch },
      },
      en: {
        ...prev.translations.en,
        [section]: { ...prev.translations.en[section], ...enPatch },
      },
    },
  }));
}

/** 列表类面板：functional 更新顶层字段 */
export function patchContent(setContent, patchObj) {
  setContent((prev) => ({ ...prev, ...patchObj }));
}

/** 列表项更新 */
export function patchListItem(setContent, listKey, index, patchObj) {
  setContent((prev) => {
    const list = prev[listKey] ?? [];
    return {
      ...prev,
      [listKey]: list.map((item, i) => (i === index ? { ...item, ...patchObj } : item)),
    };
  });
}
