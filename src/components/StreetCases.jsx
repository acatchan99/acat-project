import { useState, useMemo } from 'react';
import { useLang } from '../context/LangContext';
import { getStreetCases } from '../data/streetCases';
import { pickLang } from '../data/content';
import ImageStackLightbox from './ImageStackLightbox';
import OptimizedImage from './OptimizedImage';

export default function StreetCases() {
  const { lang, t } = useLang();
  const sc = t('streetCases');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const cases = getStreetCases();

  const lightboxItems = useMemo(
    () => cases.map((item) => ({
      id: item.id,
      image: item.image,
      title: pickLang(item.title, lang),
      subtitle: pickLang(item.location, lang),
    })),
    [cases, lang],
  );

  return (
    <section id="street-cases" className="street-cases">
      <div className="container">
        <header className="street-head reveal">
          <div>
            <p className="street-eyebrow">{sc.eyebrow}</p>
            <h2 className="street-title">{sc.title}</h2>
            <p className="street-desc">{sc.desc}</p>
          </div>
          <span className="street-count">{cases.length} {sc.countLabel}</span>
        </header>

        <div className="street-bento">
          {cases.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`street-card street-card--${item.layout} reveal reveal-d${(i % 4) + 1}`}
              style={{ '--breath-delay': `${i * 0.5}s` }}
              onClick={() => setLightboxIndex(i)}
            >
              <OptimizedImage src={item.image} alt={pickLang(item.title, lang)} variant="thumb" loading="lazy" />
              <div className="street-card-overlay">
                <span className="street-card-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="street-card-meta">
                  <h3>{pickLang(item.title, lang)}</h3>
                  <p>{pickLang(item.location, lang)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageStackLightbox
          items={lightboxItems}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
