import { useState, useCallback } from 'react';
import { getThumbSrc, getDisplaySrc } from '../lib/imageUrl';

/**
 * @param {'thumb'|'display'|'original'} variant
 */
export default function OptimizedImage({
  src,
  alt = '',
  variant = 'thumb',
  loading = 'lazy',
  fetchPriority,
  className = '',
  draggable = false,
  onLoad,
}) {
  const primary = variant === 'thumb'
    ? getThumbSrc(src)
    : variant === 'display'
      ? getDisplaySrc(src)
      : src;

  const [currentSrc, setCurrentSrc] = useState(primary);
  const [loaded, setLoaded] = useState(false);

  const handleError = useCallback(() => {
    if (currentSrc !== src && src) setCurrentSrc(src);
  }, [currentSrc, src]);

  const handleLoad = useCallback((e) => {
    setLoaded(true);
    onLoad?.(e);
  }, [onLoad]);

  if (!src) return null;

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={draggable}
      fetchPriority={fetchPriority}
      className={`${className}${loaded ? ' img-loaded' : ''}`.trim()}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
