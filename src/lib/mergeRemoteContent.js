import { cloneDefaultContent } from '../data/defaultContent';

/** 合并远端 CMS，防止静态部署把 HTML 当 JSON 后丢失 translations */
export function mergeRemoteContent(remote) {
  const defaults = cloneDefaultContent();
  if (!remote || typeof remote !== 'object') return defaults;

  return {
    ...defaults,
    ...remote,
    translations: remote.translations?.zh && remote.translations?.en
      ? remote.translations
      : defaults.translations,
    albums: remote.albums?.length ? remote.albums : defaults.albums,
    worksManifest: remote.worksManifest?.length ? remote.worksManifest : defaults.worksManifest,
    streetCases: remote.streetCases?.length ? remote.streetCases : defaults.streetCases,
    pricing: remote.pricing?.length ? remote.pricing : defaults.pricing,
    socialLinks: remote.socialLinks?.length ? remote.socialLinks : defaults.socialLinks,
    exhibitions: remote.exhibitions?.length ? remote.exhibitions : defaults.exhibitions,
    contactCard: remote.contactCard ?? defaults.contactCard,
  };
}
