import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';
import { getPricingItems, getPricingImages } from '../data/pricing';
import { pickLang } from '../data/content';
import PricingDetail from './PricingDetail';

export default function Pricing() {
  const { lang, t } = useLang();
  const { goTo } = useNavigate();
  const p = t('pricing');
  const [detailIndex, setDetailIndex] = useState(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const pricingItems = getPricingItems();

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <header className="pricing-head reveal">
          <p className="pricing-eyebrow">{p.eyebrow}</p>
          <h2 className="pricing-title">{p.title}</h2>
        </header>

        <div className="pricing-table reveal">
          <div className="pricing-row pricing-row--head" aria-hidden="true">
            <span className="pricing-spec">{p.colSpec}</span>
            <span className="pricing-price">{p.colPrice}</span>
          </div>

          <ul className="pricing-list">
            {pricingItems.map((item, itemIdx) => (
              <li key={item.id} className="pricing-row">
                <div className="pricing-spec">
                  <p className="pricing-spec-text">
                    {pickLang(item.size, lang)}{pickLang(item.product, lang)}
                  </p>
                  <div className="pricing-gallery">
                    {getPricingImages(item).map((src, imgIdx) => (
                      <button
                        key={`${item.id}-${imgIdx}`}
                        type="button"
                        className="pricing-sample"
                        onClick={() => {
                          setDetailIndex(itemIdx);
                          setDetailImageIndex(imgIdx);
                        }}
                        aria-label={`${pickLang(item.product, lang)} ${imgIdx + 1}`}
                      >
                        <img
                          src={src}
                          alt={`${pickLang(item.size, lang)} ${imgIdx + 1}`}
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <span className="pricing-price">{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="pricing-note reveal">{p.note}</p>

        <button type="button" className="pricing-cta reveal" onClick={() => goTo('contact')}>
          {p.cta}
        </button>
      </div>

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
