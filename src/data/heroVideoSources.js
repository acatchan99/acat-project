/**
 * @param {string} url
 */
export function isMp4VideoUrl(url) {
  const path = url.split('?')[0]?.split('#')[0] ?? '';
  return /\.mp4$/i.test(path) || /\.m4v$/i.test(path);
}

/**
 * @param {string} url
 */
export function isWebmVideoUrl(url) {
  const path = url.split('?')[0]?.split('#')[0] ?? '';
  return /\.webm$/i.test(path);
}

/**
 * @param {import('../types/heroBackgroundVideo.d.ts').HeroBackgroundVideoConfig} config
 * @param {boolean} isMobile
 */
export function resolveHeroVideoSrc(config, isMobile) {
  const sources = resolveHeroVideoSources(config, isMobile);
  return sources.primary;
}

/**
 * @param {import('../types/heroBackgroundVideo.d.ts').HeroBackgroundVideoConfig} config
 * @param {boolean} isMobile
 */
export function resolveHeroVideoSources(config, isMobile) {
  const mobileMp4 = pick(config.heroBackgroundVideoMobileMp4);
  const mobileWebm = pick(config.heroBackgroundVideoMobileWebm);
  const desktopMp4 = pick(config.heroBackgroundVideoDesktopMp4);
  const desktopWebm = pick(config.heroBackgroundVideoDesktopWebm);
  const mobileLegacy = pick(config.heroBackgroundVideoMobile);
  const desktopLegacy = pick(config.heroBackgroundVideoDesktop);

  let mp4 = mobileMp4;
  let webm = mobileWebm;

  if (isMobile) {
    if (!mp4 && isMp4VideoUrl(mobileLegacy)) mp4 = mobileLegacy;
    if (!webm && isWebmVideoUrl(mobileLegacy)) webm = mobileLegacy;
    if (!mp4 && isMp4VideoUrl(desktopLegacy)) mp4 = desktopLegacy;
    if (!webm && isWebmVideoUrl(desktopLegacy)) webm = desktopLegacy;
    if (!mp4 && desktopMp4) mp4 = desktopMp4;
    if (!webm && desktopWebm) webm = desktopWebm;
    if (!mp4 && mobileLegacy && !isWebmVideoUrl(mobileLegacy)) mp4 = mobileLegacy;
    if (!mp4 && !mobileLegacy && desktopLegacy && !isWebmVideoUrl(desktopLegacy)) mp4 = desktopLegacy;
  } else {
    mp4 = desktopMp4 || (isMp4VideoUrl(desktopLegacy) ? desktopLegacy : '');
    webm = desktopWebm || (isWebmVideoUrl(desktopLegacy) ? desktopLegacy : '');
    if (!mp4 && isMp4VideoUrl(mobileLegacy)) mp4 = mobileLegacy;
    if (!webm && isWebmVideoUrl(mobileLegacy)) webm = mobileLegacy;
    if (!mp4 && desktopLegacy && !isWebmVideoUrl(desktopLegacy)) mp4 = desktopLegacy;
    if (!webm && !desktopLegacy && isWebmVideoUrl(mobileLegacy)) webm = mobileLegacy;
  }

  const primary = isMobile
    ? (mp4 || (!webm ? '' : webm))
    : (mp4 || webm || desktopLegacy || mobileLegacy);

  return { mp4, webm, primary };
}

/** @param {string | undefined | null} value */
function pick(value) {
  const trimmed = value?.trim() ?? '';
  return trimmed;
}
