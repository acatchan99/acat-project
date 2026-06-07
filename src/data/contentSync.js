import { applyWorksManifest, applyExhibitions } from './content';
import { applyStreetCases } from './streetCases';
import { applyPricing } from './pricing';
import { applySocialLinks } from './social';

export function applySiteContent(content) {
  if (!content) return;
  if (content.worksManifest) applyWorksManifest(content.worksManifest);
  if (content.streetCases) applyStreetCases(content.streetCases);
  if (content.pricing) applyPricing(content.pricing);
  if (content.socialLinks) applySocialLinks(content.socialLinks);
  if (content.exhibitions) applyExhibitions(content.exhibitions);
}
