import { useState, useCallback } from 'react';
import { getThumbSrc, getDisplaySrc } from '../lib/imageUrl';

/** 优先 WebP，失败自动回退原图，不影响 CMS / 文案逻辑 */
export default function OptimizedImage({
  src,
  alt = '',
  variant = 'thumb',
  loading = 'lazy',
  fetchPriority,
  className = '',
  draggable = false,
}) {
  const primary = variant === 'display' ? getDisplaySrc(src) : getThumbSrc(src);
  const [currentSrc, setCurrentSrc] = useState(primary);

  const handleError = useCallback(() => {
    if (src && currentSrc !== src) setCurrentSrc(src);
  }, [currentSrc, src]);

  if (!src) return null;

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={draggable}
      fetchPriority={fetchPriority}
      className={className}
      onError={handleError}
    />
  );
}
