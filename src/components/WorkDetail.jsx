import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLang } from '../context/LangContext';
import { pickLang } from '../data/content';
import { useNavigate } from '../hooks/useNavigate';
import { wrapIndex } from '../hooks/useDetailCardStack';
import DetailStackShell from './DetailStackShell';
import SwipeHint from './SwipeHint';

export default function WorkDetail({ work, items = [], onChange, onClose }) {
  const { lang, t } = useLang();
  const { goTo } = useNavigate();
  const d = t('detail');
  const [size, setSize] = useState(0);

  const list = items.length ? items : (work ? [work] : []);
  const currentIndex = useMemo(
    () => Math.max(0, list.findIndex((w) => w.id === work?.id)),
    [list, work?.id],
  );
  const canNavigate = list.length > 1;

  const handleIndexChange = useCallback((nextIndex) => {
    onChange?.(list[nextIndex]);
  }, [onChange, list]);

  useEffect(() => {
    setSize(0);
  }, [work?.id]);

  useEffect(() => {
    if (!canNavigate) return undefined;
    const next = list[wrapIndex(currentIndex + 1, list.length)];
    const prev = list[wrapIndex(currentIndex - 1, list.length)];
    [next?.image, prev?.image].forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  }, [canNavigate, list, currentIndex]);

  const renderSlide = useCallback((slideIndex) => {
    const current = list[slideIndex];
    if (!current) return null;

    const title = pickLang(current.title, lang);
    const series = pickLang(current.series, lang);
    const material = pickLang(current.material, lang);
    const sizeLabel = pickLang(current.size, lang);
    const price = pickLang(current.price, lang);
    const description = pickLang(current.description, lang);
    const showSizePicker = current.albumId === 'fag';
    const sizeState = slideIndex === currentIndex ? size : 0;

    return (
      <div className="detail-grid">
        <div className="detail-gallery">
          <div className="detail-main">
            <img src={current.image} alt={title} draggable={false} decoding="sync" />
          </div>
          <SwipeHint show={canNavigate} />
        </div>

        <div className="detail-info">
          <p className="detail-series">{series}</p>
          <h2 className="detail-title">{title}</h2>
          <p className="detail-price">{price}</p>

          {showSizePicker && (
            <div className="detail-sizes">
              <span className="detail-label">{d.size}</span>
              <div className="size-picker">
                {d.sizes.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-btn${sizeState === i ? ' size-btn--active' : ''}`}
                    onClick={() => slideIndex === currentIndex && setSize(i)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <dl className="detail-specs">
            <div><dt>{d.series}</dt><dd>{series}</dd></div>
            <div><dt>{d.artist}</dt><dd>{current.artist}</dd></div>
            <div><dt>{d.material}</dt><dd>{material}</dd></div>
            <div><dt>{d.size}</dt><dd>{sizeLabel}</dd></div>
          </dl>

          <button
            type="button"
            className="btn btn-blue detail-cta"
            onClick={() => {
              onClose();
              setTimeout(() => goTo('contact'), 80);
            }}
          >
            {d.cta}
          </button>

          <p className="detail-desc">{description}</p>
        </div>
      </div>
    );
  }, [list, lang, d, currentIndex, size, onClose, goTo, canNavigate]);

  if (!list[currentIndex]) return null;

  const ariaTitle = pickLang(list[currentIndex].title, lang);

  return (
    <DetailStackShell
      index={currentIndex}
      count={list.length}
      canNavigate={canNavigate}
      onIndexChange={handleIndexChange}
      onClose={onClose}
      closeLabel={d.close}
      ariaLabel={ariaTitle}
      badge={canNavigate || null}
      getSlideKey={(i) => list[i]?.id ?? i}
      renderSlide={renderSlide}
    />
  );
}
