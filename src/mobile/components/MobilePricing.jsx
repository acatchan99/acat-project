import { useState } from 'react';
import { useLang } from '../../context/LangContext';
import { useScrollTo } from '../../hooks/useScrollTo';
import { getPricingItems, getPricingImages } from '../../data/pricing';
import { pickLang } from '../../data/content';
import PricingDetail from '../../components/PricingDetail';

export default function MobilePricing() {
  const { lang, t } = useLang();
  const p = t('pricing');
  const scrollTo = useScrollTo();
  const [detailIndex, setDetailIndex] = useState(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const pricingItems = getPricingItems();

  return (
    <section id="pricing" className="m-section m-pricing">
      <p className="m-eyebrow">{p.eyebrow}</p>
      <h2 className="m-section-title">{p.title}</h2>

      <ul className="m-pricing-list">
        {pricingItems.map((item, itemIdx) => (
          <li key={item.id} className="m-pricing-item">
            <div className="m-pricing-spec">
              <p className="m-pricing-size">{pickLang(item.size, lang)}</p>
              <p className="m-pricing-product">{pickLang(item.product, lang)}</p>
              <div className="m-pricing-gallery">
                {getPricingImages(item).map((src, i) => (
                  <button
                    key={`${item.id}-${i}`}
                    type="button"
                    className="m-pricing-thumb"
                    onClick={() => {
                      setDetailIndex(itemIdx);
                      setDetailImageIndex(i);
                    }}
                    aria-label={`${pickLang(item.product, lang)} ${i + 1}`}
                  >
                    <img src={src} alt={`${pickLang(item.size, lang)} ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
            <span className="m-pricing-price">{item.price}</span>
          </li>
        ))}
      </ul>

      <p className="m-pricing-note">{p.note}</p>
      <button type="button" className="m-btn m-btn--blue" onClick={() => scrollTo('contact')}>
        {p.cta}
      </button>

      {detailIndex !== null && (
        <PricingDetail
          items={pricingItems}
          index={detailIndex}
          imageIndex={detailImageIndex}
          onIndexChange={setDetailIndex}
          onImageIndexChange={setDetailImageIndex}
          onClose={() => setDetailIndex(null)}
        />
      )}
    </section>
  );
}
