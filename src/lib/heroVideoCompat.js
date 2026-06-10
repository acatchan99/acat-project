/** 内置默认封面（从 hero 视频首帧导出） */
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
 * @returns {'video' | 'wechat'}
 */
export function getHeroBackgroundMode() {
  if (typeof navigator === 'undefined') return 'video';
  if (/MicroMessenger/i.test(navigator.userAgent)) return 'wechat';
  return 'video';
}

export function isWechatBrowser() {
  return typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);
}

/**
 * @param {boolean | null | undefined} prefersReducedMotion
 */
export function shouldForceStaticHeroBackground(prefersReducedMotion) {
  return Boolean(prefersReducedMotion);
}

/**
 * @param {HTMLVideoElement} el
 */
export function applyInlineVideoCompat(el) {
  el.muted = true;
  el.defaultMuted = true;
  el.playsInline = true;
  el.controls = false;
  el.disablePictureInPicture = true;
  el.setAttribute('muted', '');
  el.setAttribute('playsinline', 'true');
  el.setAttribute('webkit-playsinline', 'true');
  el.setAttribute('x5-playsinline', 'true');
  el.setAttribute('x5-video-player-type', 'h5-page');
  el.setAttribute('x5-video-player-fullscreen', 'false');
  el.setAttribute('x5-video-orientation', 'portraint');
  el.setAttribute('controls', 'false');
  el.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
  el.setAttribute('disableRemotePlayback', '');
}

/**
 * @param {HTMLVideoElement} video
 */
function tryPlay(video) {
  applyInlineVideoCompat(video);
  const result = video.play();
  if (result && typeof result.catch === 'function') {
    return result.catch(() => undefined);
  }
  return Promise.resolve();
}

/**
 * 微信 H5 经典解锁：WeixinJSBridgeReady + getNetworkType 后再 play。
 * @param {HTMLVideoElement} video
 */
function scheduleWechatBridgePlay(video) {
  const bridgePlay = () => {
    tryPlay(video);
    window.WeixinJSBridge?.invoke('getNetworkType', {}, () => {
      tryPlay(video);
    });
  };

  if (window.WeixinJSBridge) {
    bridgePlay();
    return;
  }

  document.addEventListener('WeixinJSBridgeReady', bridgePlay, { once: true });
}

/**
 * 尽量在移动端/微信播起来；失败由调用方 fallback 到 poster。
 * @param {HTMLVideoElement | null} video
 * @param {{ mode?: 'video' | 'wechat', timeoutMs?: number }} options
 * @returns {() => void} cleanup
 */
export function attemptHeroVideoPlayback(video, options = {}) {
  const { mode = getHeroBackgroundMode(), timeoutMs = 3500 } = options;

  if (!video) return () => {};

  let cancelled = false;
  applyInlineVideoCompat(video);

  const isPlaying = () => !video.paused && video.readyState >= 2;

  const runAttempts = () => {
    if (cancelled) return;
    tryPlay(video);
    if (mode === 'wechat') {
      scheduleWechatBridgePlay(video);
    }
  };

  runAttempts();

  const onTouch = () => {
    if (cancelled || isPlaying()) return;
    tryPlay(video);
  };

  document.addEventListener('touchstart', onTouch, { passive: true });
  document.addEventListener('click', onTouch, { passive: true });

  const timer = window.setTimeout(() => {
    if (!cancelled && !isPlaying()) {
      tryPlay(video);
    }
  }, timeoutMs);

  return () => {
    cancelled = true;
    window.clearTimeout(timer);
    document.removeEventListener('touchstart', onTouch);
    document.removeEventListener('click', onTouch);
  };
}

/**
 * @param {'video' | 'wechat'} mode
 */
export function getHeroVideoPreload(mode) {
  return mode === 'wechat' ? 'auto' : 'metadata';
}
