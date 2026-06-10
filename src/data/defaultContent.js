import { translations } from '../i18n/translations';
import defaultManifest from './works-manifest.json';
import { getStreetCases } from './streetCases';
import { getPricingItems } from './pricing';
import defaultSocialLinks from './social-links.json';
import { getExhibitions } from './content';
import { DEFAULT_CONTACT_CARD } from './contactCard';
import { DEFAULT_ALBUMS } from './albums';
import { DEFAULT_HERO_VIDEO } from './heroBackgroundVideo';

export const DEFAULT_CONTENT = {
  translations,
  albums: DEFAULT_ALBUMS,
  worksManifest: defaultManifest,
  streetCases: getStreetCases(),
  pricing: getPricingItems(),
  socialLinks: defaultSocialLinks,
  exhibitions: getExhibitions(),
  contactCard: DEFAULT_CONTACT_CARD,
  ...DEFAULT_HERO_VIDEO,
};

export function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
}
