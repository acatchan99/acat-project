/** 内置默认封面（从 hero 视频首帧导出，微信/原生浏览器静态背景用） */
export const DEFAULT_MOBILE_HERO_POSTER = '/hero/mobile/hero-mobile-poster.jpg';
export const DEFAULT_DESKTOP_HERO_POSTER = '/hero/desktop/hero-desktop-poster.jpg';

/**
 * @param {import('../types/heroBackgroundVideo.d.ts').HeroBackgroundVideoConfig} config
 * @param {boolean} isMobile
 */
export function resolveHeroPosterUrl(config, isMobile) {
  const cmsPoster = config.heroBackgroundVideoPoster?.trim() ?? '';
  if (cmsPoster) return cmsPoster;
  return isMobile ? DEFAULT_MOBILE_HERO_POSTER : DEFAULT_DESKTOP_HERO_POSTER;
}

/**
 * 微信 / 部分国产内置浏览器：inline autoplay 极不稳定，直接用静态封面更可靠。
 * @returns {'static' | 'video'}
 */
export function getHeroBackgroundMode() {
  if (typeof navigator === 'undefined') return 'video';

  const ua = navigator.userAgent;

  if (/MicroMessenger/i.test(ua)) return 'static';
  if (/QQ\//i.test(ua) && /MQQBrowser/i.test(ua)) return 'static';
  if (/HuaweiBrowser|HiSilicon/i.test(ua)) return 'static';
  if (/UCBrowser/i.test(ua)) return 'static';
  if (/MiuiBrowser|XiaoMi/i.test(ua)) return 'static';
  if (/Quark/i.test(ua)) return 'static';
  if (/Weibo/i.test(ua)) return 'static';

  // 非 Chrome/Safari/Firefox 的 Android 系统浏览器，video 易弹出原生播放器
  if (/Android/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgA/i.test(ua)) {
    return 'static';
  }

  return 'video';
}

/**
 * @param {boolean | null | undefined} prefersReducedMotion
 */
export function shouldForceStaticHeroBackground(prefersReducedMotion) {
  return prefersReducedMotion || getHeroBackgroundMode() === 'static';
}
