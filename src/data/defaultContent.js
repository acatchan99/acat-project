import { translations } from '../i18n/translations';
import defaultManifest from './works-manifest.json';
import { getStreetCases } from './streetCases';
import { getPricingItems } from './pricing';
import defaultSocialLinks from './social-links.json';
import { getExhibitions } from './content';

export const DEFAULT_CONTENT = {
  translations,
  worksManifest: defaultManifest,
  streetCases: getStreetCases(),
  pricing: getPricingItems(),
  socialLinks: defaultSocialLinks,
  exhibitions: getExhibitions(),
};

export function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
}
