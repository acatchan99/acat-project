import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useMediaQuery, MOBILE_QUERY } from '../hooks/useMediaQuery';
import { useDetailCardStack } from '../hooks/useDetailCardStack';
import { useOverlayHistory } from '../hooks/useOverlayHistory';
import SwipeHint from './SwipeHint';
import OptimizedImage from './OptimizedImage';

/**
 * 全屏大图浏览（街头案例等）— 与作品集相同的左右滑轨切换
 */
export default function ImageStackLightbox({
  items,
  index,
  onIndexChange,
  onClose,
  mobile = false,
}) {
  const { t } = useLang();
  const d = t('detail');
  const isMobile = useMediaQuery(MOBILE_QUERY) || mobile;
  const count = items?.length ?? 0;
  const canNavigate = count > 1;
  const closeOverlay = useOverlayHistory(true, onClose);

  const {
    stackRef,
    trackRef,
    activeIndex,
    mode,
    partnerIndex,
    isDragging,
    animating,
    goPrev,
    goNext,
  } = useDetailCardStack({
    enabled: canNavigate,
    index,
    count,
    onIndexChange,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeOverlay();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeOverlay, goPrev, goNext]);

  const item = items[activeIndex];
  if (!item) return null;

  const dualSlide = mode != null && partnerIndex != null;
  const slides = dualSlide
    ? (mode === 'next' ? [activeIndex, partnerIndex] : [partnerIndex, activeIndex])
    : [activeIndex];

  const shellClass = mobile
    ? 'm-lightbox gallery-lightbox gallery-lightbox--mobile'
    : 'gallery-lightbox';

  const renderItem = (slideIndex) => {
    const slideItem = items[slideIndex];
    if (!slideItem) return null;
    return (
      <div className="gallery-lightbox-slide">
        <div className="gallery-lightbox-media">
          <OptimizedImage
            src={slideItem.image}
            alt={slideItem.title ?? ''}
            variant="display"
            loading="eager"
          />
          <SwipeHint show={canNavigate} className="gallery-lightbox-hint" />
        </div>
        {(slideItem.title || slideItem.subtitle) && (
          <div className="gallery-lightbox-caption">
            {slideItem.title && <h3>{slideItem.title}</h3>}
            {slideItem.subtitle && <p>{slideItem.subtitle}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={shellClass} onClick={closeOverlay} role="presentation">
      <div
        className={`gallery-lightbox-panel${mobile ? ' m-lightbox-panel' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.title ?? d.close}
      >
        <button
          type="button"
          className={`gallery-lightbox-close${mobile ? ' m-lightbox-close' : ''}`}
          onClick={closeOverlay}
          aria-label={d.close}
        >
          ×
        </button>

        {canNavigate && !isMobile && (
          <div className="detail-nav-buttons detail-nav-buttons--lightbox">
            <button
              type="button"
              className="detail-nav-btn detail-nav-btn--prev"
              onClick={goPrev}
              aria-label={d.navPrev}
            >
              ‹
            </button>
            <button
              type="button"
              className="detail-nav-btn detail-nav-btn--next"
              onClick={goNext}
              aria-label={d.navNext}
            >
              ›
            </button>
          </div>
        )}

        <div
          className={`gallery-lightbox-stack${canNavigate ? ' gallery-lightbox-stack--nav' : ''}${isDragging ? ' gallery-lightbox-stack--dragging' : ''}${animating ? ' gallery-lightbox-stack--animating' : ''}`}
          ref={stackRef}
        >
          <div
            ref={trackRef}
            className={`gallery-lightbox-track${dualSlide ? ' gallery-lightbox-track--dual' : ''}`}
          >
            {slides.map((slideIndex) => {
              const slideKey = items[slideIndex]?.id ?? slideIndex;
              return (
                <div key={slideKey} className="gallery-lightbox-card">
                  {renderItem(slideIndex)}
                </div>
              );
            })}
          </div>

          {canNavigate && (
            <span className="detail-nav-badge detail-nav-badge--light">
              {activeIndex + 1} / {count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
