import { useContent } from '../../context/ContentContext';
import {
  DEFAULT_HERO_VIDEO,
  normalizeHeroVideoConfig,
  resolveHeroVideoSources,
} from '../../data/heroBackgroundVideo';
import { resolveHeroPosterUrl } from '../../lib/heroVideoCompat';

function resolveMediaUrl(url) {
  const trimmed = url?.trim() ?? '';
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** @param {'mobile' | 'desktop'} platform */
export function useHeroVideoConfig(platform) {
  const { content } = useContent();
  const config = normalizeHeroVideoConfig(content ?? DEFAULT_HERO_VIDEO);
  const isMobile = platform === 'mobile';
  const enabled = config.heroBackgroundVideoEnabled;
  const sources = resolveHeroVideoSources(config, isMobile);
  const videoSrc = enabled ? resolveMediaUrl(sources.primary) : '';
  const videoMp4 = enabled ? resolveMediaUrl(sources.mp4) : '';
  const videoWebm = enabled ? resolveMediaUrl(sources.webm) : '';
  const poster = resolveMediaUrl(resolveHeroPosterUrl(config, isMobile));

  return {
    config,
    enabled,
    videoSrc,
    videoMp4,
    videoWebm,
    poster,
    overlayOpacity: config.heroBackgroundVideoOverlayOpacity,
    bottomGradientEnabled: config.heroBottomGradientEnabled,
    bottomGradientHeight: config.heroBottomGradientHeight || '22%',
  };
}
