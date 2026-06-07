import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useMediaQuery, MOBILE_QUERY } from '../hooks/useMediaQuery';
import { useDetailCardStack } from '../hooks/useDetailCardStack';
import { useOverlayHistory } from '../hooks/useOverlayHistory';

export default function DetailStackShell({
  index,
  count,
  canNavigate,
  onIndexChange,
  onClose,
  closeLabel,
  ariaLabel,
  badge,
  renderSlide,
  getSlideKey,
}) {
  const { t } = useLang();
  const d = t('detail');
  const isMobile = useMediaQuery(MOBILE_QUERY);
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

  const dualSlide = mode != null && partnerIndex != null;
  const slides = dualSlide
    ? (mode === 'next' ? [activeIndex, partnerIndex] : [partnerIndex, activeIndex])
    : [activeIndex];

  const showStackLayers = canNavigate && !dualSlide && !animating && !isDragging;

  return (
    <div className="detail-overlay" onClick={closeOverlay} role="presentation">
      <div className="detail-backdrop" aria-hidden="true" />

      <div
        className="detail-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <button type="button" className="detail-close" onClick={closeOverlay} aria-label={closeLabel}>
          ×
        </button>

        {canNavigate && !isMobile && (
          <div className="detail-nav-buttons">
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
          className={`detail-stack-area${canNavigate ? ' detail-stack-area--nav' : ''}${isDragging ? ' detail-stack-area--dragging' : ''}${animating ? ' detail-stack-area--animating' : ''}`}
          ref={stackRef}
        >
          {showStackLayers && (
            <>
              <div className="detail-stack-layer detail-stack-layer--2" aria-hidden="true" />
              <div className="detail-stack-layer detail-stack-layer--1" aria-hidden="true" />
            </>
          )}

          <div
            ref={trackRef}
            className={`detail-stack-track${dualSlide ? ' detail-stack-track--dual' : ''}`}
          >
            {slides.map((slideIndex) => {
              const slideKey = getSlideKey?.(slideIndex) ?? slideIndex;
              return (
                <div
                  key={slideKey}
                  className="detail-stack-card"
                >
                  {renderSlide(slideIndex)}
                </div>
              );
            })}
          </div>

          {canNavigate && badge && (
            <span className="detail-nav-badge">
              {badge === true ? `${activeIndex + 1} / ${count}` : badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
