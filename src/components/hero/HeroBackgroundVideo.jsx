import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useHeroVideoConfig } from './useHeroVideoConfig';

function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * @param {{
 *   platform?: 'mobile' | 'desktop',
 *   videoOnly?: boolean,
 *   dimmed?: boolean,
 *   preload?: 'auto' | 'metadata',
 * }} props
 */
export default function HeroBackgroundVideo({
  platform = 'desktop',
  videoOnly = false,
  dimmed = false,
  preload,
}) {
  const isMobilePlatform = platform === 'mobile';
  const {
    enabled,
    videoSrc,
    poster,
    overlayOpacity,
    bottomGradientEnabled,
    bottomGradientHeight,
  } = useHeroVideoConfig(platform);

  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const showVideo = enabled && Boolean(videoSrc) && !prefersReducedMotion && !videoFailed;
  const preloadMode = preload ?? (isMobilePlatform ? 'metadata' : 'auto');
  const showPosterLayer = Boolean(poster) && (!showVideo || !videoReady);
  const hasPoster = Boolean(poster);
  const hasVideoSource = enabled && Boolean(videoSrc);

  useEffect(() => {
    setVideoFailed(false);
    setVideoReady(false);
  }, [videoSrc, enabled]);

  useEffect(() => {
    const el = videoRef.current;
    if (!showVideo || !el) return undefined;
    el.play().catch(() => setVideoFailed(true));
    return undefined;
  }, [showVideo, videoSrc]);

  if (!hasPoster && !hasVideoSource) return null;

  const rootClass = [
    'hero-bg-video',
    isMobilePlatform ? 'hero-bg-video--mobile' : 'hero-bg-video--desktop',
    videoOnly ? 'hero-bg-video--video-only' : '',
    dimmed ? 'hero-bg-video--dimmed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={rootClass}
      aria-hidden="true"
      data-ready={showVideo && videoReady ? 'true' : 'false'}
    >
      {showPosterLayer && (
        <img
          className="hero-bg-video__poster"
          src={poster}
          alt=""
          loading="eager"
          decoding="async"
        />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className="hero-bg-video__media"
          src={videoSrc}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload={preloadMode}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        />
      )}

      {!showVideo && !showPosterLayer && enabled && videoSrc && (
        <div className="hero-bg-video__fallback" />
      )}

      {!videoOnly && (
        <>
          <div
            className="hero-bg-video__overlay"
            style={{ opacity: overlayOpacity }}
          />
          {bottomGradientEnabled && (
            <div
              className="hero-bg-video__bottom-fade"
              style={{ height: bottomGradientHeight }}
            />
          )}
        </>
      )}
    </div>
  );
}
