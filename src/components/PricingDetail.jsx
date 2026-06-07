import { useEffect, useCallback, useMemo } from 'react';

import { useLang } from '../context/LangContext';

import { getPricingImages } from '../data/pricing';

import { pickLang } from '../data/content';

import { useNavigate } from '../hooks/useNavigate';

import { wrapIndex } from '../hooks/useDetailCardStack';

import DetailStackShell from './DetailStackShell';

import SwipeHint from './SwipeHint';
import OptimizedImage from './OptimizedImage';
import { getDisplaySrc } from '../lib/imageUrl';



export default function PricingDetail({

  items,

  index,

  imageIndex = 0,

  onIndexChange,

  onImageIndexChange,

  onClose,

}) {

  const { lang, t } = useLang();

  const { goTo } = useNavigate();

  const p = t('pricing');

  const d = t('detail');



  const list = items ?? [];

  const currentIndex = wrapIndex(index ?? 0, list.length);

  const canNavigate = list.length > 1;



  const currentItem = list[currentIndex];

  const images = currentItem ? getPricingImages(currentItem) : [];

  const safeImageIndex = wrapIndex(imageIndex, Math.max(images.length, 1));

  useEffect(() => {
    if (!canNavigate) return undefined;

    const next = list[wrapIndex(currentIndex + 1, list.length)];

    const prev = list[wrapIndex(currentIndex - 1, list.length)];

    [...getPricingImages(next), ...getPricingImages(prev)].forEach((imgSrc) => {

      if (!imgSrc) return;

      const img = new Image();

      img.src = getDisplaySrc(imgSrc);

    });

  }, [canNavigate, list, currentIndex]);



  const handleTierChange = useCallback((nextIndex) => {

    onImageIndexChange?.(0);

    onIndexChange?.(nextIndex);

  }, [onIndexChange, onImageIndexChange]);



  const renderSlide = useCallback((slideIndex) => {

    const item = list[slideIndex];

    if (!item) return null;



    const itemImages = getPricingImages(item);

    const isActive = slideIndex === currentIndex;

    const activeImgIdx = isActive ? safeImageIndex : 0;

    const src = itemImages[activeImgIdx] ?? itemImages[0];

    const title = pickLang(item.product, lang);

    const showImageNav = isActive && itemImages.length > 1;



    return (

      <div className="detail-grid">

        <div className="detail-gallery">

          <div className="detail-main">

            <OptimizedImage src={src} alt={title} variant="display" loading="eager" draggable={false} />

          </div>



          {showImageNav && (

            <div className="detail-image-thumbs" role="tablist" aria-label={title}>

              {itemImages.map((thumbSrc, i) => (

                <button

                  key={`${item.id}-img-${i}`}

                  type="button"

                  role="tab"

                  aria-selected={i === safeImageIndex}

                  className={`detail-image-thumb${i === safeImageIndex ? ' detail-image-thumb--active' : ''}`}

                  onClick={() => onImageIndexChange?.(i)}

                >

                  <OptimizedImage src={thumbSrc} alt="" variant="thumb" loading="lazy" draggable={false} />

                </button>

              ))}

            </div>

          )}



          <SwipeHint show={canNavigate || (isActive && itemImages.length > 1)} />

        </div>



        <div className="detail-info">

          <p className="detail-series">{p.eyebrow}</p>

          <h2 className="detail-title">{title}</h2>

          <p className="detail-price">{item.price}</p>



          <dl className="detail-specs">

            <div>

              <dt>{p.colSpec}</dt>

              <dd>{pickLang(item.size, lang)}</dd>

            </div>

            <div>

              <dt>{p.colPrice}</dt>

              <dd>{item.price}</dd>

            </div>

          </dl>



          <button

            type="button"

            className="btn btn-blue detail-cta"

            onClick={() => {

              onClose();

              setTimeout(() => goTo('contact'), 80);

            }}

          >

            {p.cta}

          </button>



          <p className="detail-desc">{p.note}</p>

        </div>

      </div>

    );

  }, [

    list, lang, p, currentIndex, safeImageIndex,

    onImageIndexChange, onClose, goTo, canNavigate,

  ]);



  const ariaLabel = useMemo(

    () => (currentItem

      ? `${pickLang(currentItem.size, lang)} · ${pickLang(currentItem.product, lang)}`

      : ''),

    [currentItem, lang],

  );



  const src = images[safeImageIndex] ?? images[0];

  if (!currentItem || !src) return null;



  const imageBadge = images.length > 1 ? ` · ${safeImageIndex + 1}/${images.length}` : '';

  const badge = canNavigate

    ? `${currentIndex + 1} / ${list.length}${imageBadge}`

    : (images.length > 1 ? `${safeImageIndex + 1} / ${images.length}` : null);



  return (

    <DetailStackShell

      index={currentIndex}

      count={list.length}

      canNavigate={canNavigate}

      onIndexChange={handleTierChange}

      onClose={onClose}

      closeLabel={d.close}

      ariaLabel={ariaLabel}

      badge={badge}

      getSlideKey={(i) => list[i]?.id ?? i}
      renderSlide={renderSlide}

    />

  );

}

