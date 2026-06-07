import { useState, useEffect } from 'react';

/**
 * 作品集网格缩略图 — 切换专辑时 eager 加载 + 预取，避免 lazy 在 tab 切换后不触发。
 */
export default function WorkThumbnail({ src, alt, className = '' }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return undefined;
    }
    setStatus('loading');
    const img = new Image();
    img.onload = () => setStatus('loaded');
    img.onerror = () => setStatus('error');
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className={`work-thumb${className ? ` ${className}` : ''}`}>
      {status === 'loading' && <span className="work-thumb-shimmer" aria-hidden="true" />}
      {status === 'error' && (
        <span className="work-thumb-fallback" aria-hidden="true" />
      )}
      {src && status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          draggable={false}
          className={`work-thumb-img${status === 'loaded' ? ' work-thumb-img--loaded' : ''}`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  );
}
