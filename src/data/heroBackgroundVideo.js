import { resolveHeroVideoSrc as resolveHeroVideoSrcFromSources } from './heroVideoSources';

/** @typedef {import('../types/heroBackgroundVideo.d.ts').HeroBackgroundVideoConfig} HeroBackgroundVideoConfig */

export { resolveHeroVideoSrcFromSources as resolveHeroVideoSrc };
export { resolveHeroVideoSources, isMp4VideoUrl, isWebmVideoUrl } from './heroVideoSources';

/** @type {HeroBackgroundVideoConfig} */
export const DEFAULT_HERO_VIDEO = {
  heroBackgroundVideoMobile: '/hero/mobile/1781090580662-hero-mobile.mp4',
  heroBackgroundVideoDesktop: '/hero/desktop/1781090589638-hero-desktop.mp4',
  heroBackgroundVideoMobileMp4: '/hero/mobile/1781090580662-hero-mobile.mp4',
  heroBackgroundVideoMobileWebm: '',
  heroBackgroundVideoDesktopMp4: '/hero/desktop/1781090589638-hero-desktop.mp4',
  heroBackgroundVideoDesktopWebm: '',
  heroBackgroundVideoPoster: '/hero/mobile/hero-mobile-poster.jpg',
  heroBackgroundVideoEnabled: true,
  heroBackgroundVideoOverlayOpacity: 0.35,
  heroBottomGradientEnabled: true,
  heroBottomGradientHeight: '20%',
};

/** @type {HeroBackgroundVideoConfig} */
let heroVideoCache = { ...DEFAULT_HERO_VIDEO };

/** @returns {HeroBackgroundVideoConfig} */
export function getHeroBackgroundVideo() {
  return heroVideoCache;
}

/**
 * @param {Partial<HeroBackgroundVideoConfig> | null | undefined} data
 */
export function applyHeroBackgroundVideo(data) {
  if (!data || typeof data !== 'object') return;
  heroVideoCache = normalizeHeroVideoConfig({ ...heroVideoCache, ...data });
}

/**
 * @param {Record<string, unknown> | null | undefined} source
 * @returns {HeroBackgroundVideoConfig}
 */
export function normalizeHeroVideoConfig(source) {
  const base = { ...DEFAULT_HERO_VIDEO, ...(source ?? {}) };
  const opacity = Number(base.heroBackgroundVideoOverlayOpacity);
  return {
    heroBackgroundVideoMobile: String(base.heroBackgroundVideoMobile ?? ''),
    heroBackgroundVideoDesktop: String(base.heroBackgroundVideoDesktop ?? ''),
    heroBackgroundVideoMobileMp4: String(base.heroBackgroundVideoMobileMp4 ?? ''),
    heroBackgroundVideoMobileWebm: String(base.heroBackgroundVideoMobileWebm ?? ''),
    heroBackgroundVideoDesktopMp4: String(base.heroBackgroundVideoDesktopMp4 ?? ''),
    heroBackgroundVideoDesktopWebm: String(base.heroBackgroundVideoDesktopWebm ?? ''),
    heroBackgroundVideoPoster: String(base.heroBackgroundVideoPoster ?? ''),
    heroBackgroundVideoEnabled: Boolean(base.heroBackgroundVideoEnabled),
    heroBackgroundVideoOverlayOpacity: Number.isFinite(opacity)
      ? Math.min(1, Math.max(0, opacity))
      : DEFAULT_HERO_VIDEO.heroBackgroundVideoOverlayOpacity,
    heroBottomGradientEnabled: base.heroBottomGradientEnabled !== false,
    heroBottomGradientHeight: String(base.heroBottomGradientHeight || DEFAULT_HERO_VIDEO.heroBottomGradientHeight),
  };
}

/**
 * @param {Record<string, unknown>} defaults
 * @param {Record<string, unknown>} remote
 */
export function mergeHeroVideoFields(defaults, remote) {
  return normalizeHeroVideoConfig({
    heroBackgroundVideoMobile: remote.heroBackgroundVideoMobile ?? defaults.heroBackgroundVideoMobile,
    heroBackgroundVideoDesktop: remote.heroBackgroundVideoDesktop ?? defaults.heroBackgroundVideoDesktop,
    heroBackgroundVideoMobileMp4: remote.heroBackgroundVideoMobileMp4 ?? defaults.heroBackgroundVideoMobileMp4,
    heroBackgroundVideoMobileWebm: remote.heroBackgroundVideoMobileWebm ?? defaults.heroBackgroundVideoMobileWebm,
    heroBackgroundVideoDesktopMp4: remote.heroBackgroundVideoDesktopMp4 ?? defaults.heroBackgroundVideoDesktopMp4,
    heroBackgroundVideoDesktopWebm: remote.heroBackgroundVideoDesktopWebm ?? defaults.heroBackgroundVideoDesktopWebm,
    heroBackgroundVideoPoster: remote.heroBackgroundVideoPoster ?? defaults.heroBackgroundVideoPoster,
    heroBackgroundVideoEnabled: remote.heroBackgroundVideoEnabled ?? defaults.heroBackgroundVideoEnabled,
    heroBackgroundVideoOverlayOpacity:
      remote.heroBackgroundVideoOverlayOpacity ?? defaults.heroBackgroundVideoOverlayOpacity,
    heroBottomGradientEnabled: remote.heroBottomGradientEnabled ?? defaults.heroBottomGradientEnabled,
    heroBottomGradientHeight: remote.heroBottomGradientHeight ?? defaults.heroBottomGradientHeight,
  });
}

/** @param {HeroBackgroundVideoConfig} config */
export function hasHeroVideoMedia(config) {
  return Boolean(
    config.heroBackgroundVideoEnabled
    && (
      config.heroBackgroundVideoMobile?.trim()
      || config.heroBackgroundVideoDesktop?.trim()
      || config.heroBackgroundVideoMobileMp4?.trim()
      || config.heroBackgroundVideoDesktopMp4?.trim()
      || config.heroBackgroundVideoPoster?.trim()
    ),
  );
}
