import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useHeroVideoConfig } from '../useHeroVideoConfig';
import {
  attemptHeroVideoPlayback,
  getHeroBackgroundMode,
  getHeroVideoPreload,
  shouldForceStaticHeroBackground,
} from '../../../lib/heroVideoCompat';
import HeroPosterFallback from './HeroPosterFallback';

const VIDEO_PLAY_TIMEOUT_MS = 3500;

function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export default function MobileHeroBackgroundVideo() {
  const {
    enabled,
    videoMp4,
    videoWebm,
    poster,
  } = useHeroVideoConfig('mobile');

  const prefersReducedMotion = usePrefersReducedMotion();
  const useStaticBackground = shouldForceStaticHeroBackground(prefersReducedMotion);
  const playbackMode = useMemo(() => getHeroBackgroundMode(), []);

  const videoRef = useRef(null);
  const readyRef = useRef(false);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [forcePoster, setForcePoster] = useState(false);

  const canUseWebm = Boolean(videoWebm) && playbackMode !== 'wechat';
  const hasMp4 = Boolean(videoMp4);
  const shouldAttemptVideo = enabled
    && !useStaticBackground
    && !hasVideoError
    && !forcePoster
    && (hasMp4 || canUseWebm);

  const videoVisible = shouldAttemptVideo && isVideoReady && !forcePoster;
  const showStaticPoster = useStaticBackground || forcePoster || hasVideoError || !shouldAttemptVideo;

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
  }, [videoMp4, videoWebm, enabled, poster, useStaticBackground]);

  useEffect(() => {
    if (!shouldAttemptVideo) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    const cleanupPlayback = attemptHeroVideoPlayback(video, {
      mode: playbackMode,
      timeoutMs: VIDEO_PLAY_TIMEOUT_MS,
    });

    const failTimer = window.setTimeout(() => {
      if (!readyRef.current) {
        markPosterFallback();
      }
    }, VIDEO_PLAY_TIMEOUT_MS);

    return () => {
      cleanupPlayback();
      window.clearTimeout(failTimer);
    };
  }, [shouldAttemptVideo, videoMp4, videoWebm, playbackMode, markPosterFallback]);

  const rootClass = [
    'm-hero-bg-video',
    'hero-bg-video',
    'hero-bg-video--mobile',
    'hero-bg-video--video-only',
    'hero-bg-video--dimmed',
    playbackMode === 'wechat' ? 'm-hero-bg-video--wechat' : '',
    showStaticPoster && !videoVisible ? 'm-hero-bg-video--static' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={rootClass}
      aria-hidden="true"
      data-ready={videoVisible ? 'true' : 'false'}
      data-mode={useStaticBackground ? 'static' : playbackMode}
      data-fallback={showStaticPoster ? 'true' : 'false'}
    >
      <div className="m-hero-bg-video__base" aria-hidden="true" />
      <HeroPosterFallback
        posterUrl={poster}
        className={`m-hero-poster-fallback--layer${showStaticPoster ? ' m-hero-poster-fallback--active' : ''}`}
        dimmed={showStaticPoster && !videoVisible}
      />

      {shouldAttemptVideo && (
        <video
          ref={videoRef}
          className={`m-hero-bg-video__media hero-bg-video__media${videoVisible ? ' is-visible' : ''}`}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload={getHeroVideoPreload(playbackMode)}
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
