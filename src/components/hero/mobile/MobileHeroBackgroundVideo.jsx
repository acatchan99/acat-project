import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useHeroVideoConfig } from '../useHeroVideoConfig';
import HeroPosterFallback from './HeroPosterFallback';

const WECHAT_FALLBACK_MS = 2200;

function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

function useIsWechatBrowser() {
  const [isWechat, setIsWechat] = useState(false);

  useEffect(() => {
    setIsWechat(/MicroMessenger/i.test(window.navigator.userAgent));
  }, []);

  return isWechat;
}

function applyInlineVideoCompat(el) {
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

export default function MobileHeroBackgroundVideo() {
  const {
    enabled,
    videoMp4,
    videoWebm,
    poster,
  } = useHeroVideoConfig('mobile');

  const prefersReducedMotion = usePrefersReducedMotion();
  const isWechat = useIsWechatBrowser();
  const videoRef = useRef(null);
  const readyRef = useRef(false);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [forcePoster, setForcePoster] = useState(false);

  const canUseWebm = Boolean(videoWebm) && !isWechat;
  const hasMp4 = Boolean(videoMp4);
  const shouldRenderVideo = enabled
    && !prefersReducedMotion
    && !hasVideoError
    && (hasMp4 || canUseWebm);

  const showVideoLayer = shouldRenderVideo && !forcePoster;
  const videoVisible = showVideoLayer && isVideoReady;

  const markReady = useCallback(() => {
    readyRef.current = true;
    setIsVideoReady(true);
    setForcePoster(false);
  }, []);

  const markPosterFallback = useCallback(() => {
    setForcePoster(true);
  }, []);

  const markError = useCallback(() => {
    setHasVideoError(true);
    setForcePoster(true);
  }, []);

  useEffect(() => {
    readyRef.current = false;
    setIsVideoReady(false);
    setHasVideoError(false);
    setForcePoster(false);
  }, [videoMp4, videoWebm, enabled, poster]);

  useEffect(() => {
    if (!shouldRenderVideo) {
      if (enabled && !hasMp4 && videoWebm && isWechat) {
        setForcePoster(true);
      }
      return undefined;
    }

    const video = videoRef.current;
    if (!video) return undefined;

    applyInlineVideoCompat(video);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        markPosterFallback();
      });
    }

    const timer = window.setTimeout(() => {
      if (!readyRef.current) {
        markPosterFallback();
      }
    }, WECHAT_FALLBACK_MS);

    return () => window.clearTimeout(timer);
  }, [
    shouldRenderVideo,
    videoMp4,
    videoWebm,
    enabled,
    isWechat,
    markPosterFallback,
  ]);

  return (
    <div
      className="m-hero-bg-video hero-bg-video hero-bg-video--mobile hero-bg-video--video-only hero-bg-video--dimmed"
      aria-hidden="true"
      data-ready={videoVisible ? 'true' : 'false'}
      data-fallback={forcePoster || hasVideoError || !shouldRenderVideo ? 'true' : 'false'}
    >
      <div className="m-hero-bg-video__base" aria-hidden="true" />
      <HeroPosterFallback posterUrl={poster} className="m-hero-poster-fallback--layer" />

      {shouldRenderVideo && (
        <video
          ref={videoRef}
          className={`m-hero-bg-video__media hero-bg-video__media${videoVisible ? ' is-visible' : ''}`}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disableRemotePlayback
          onCanPlay={markReady}
          onPlaying={markReady}
          onLoadedData={markReady}
          onError={markError}
        >
          {hasMp4 && <source src={videoMp4} type="video/mp4" />}
          {canUseWebm && <source src={videoWebm} type="video/webm" />}
        </video>
      )}
    </div>
  );
}
