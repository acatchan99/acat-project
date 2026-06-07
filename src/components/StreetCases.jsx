import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { STREET_CASES } from '../data/streetCases';
import { pickLang } from '../data/content';

export default function StreetCases() {
  const { lang, t } = useLang();
  const sc = t('streetCases');
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="street-cases" className="street-cases">
      <div className="container">
        <header className="street-head reveal">
          <div>
            <p className="street-eyebrow">{sc.eyebrow}</p>
            <h2 className="street-title">{sc.title}</h2>
            <p className="street-desc">{sc.desc}</p>
          </div>
          <span className="street-count">{STREET_CASES.length} {sc.countLabel}</span>
        </header>

        <div className="street-bento">
          {STREET_CASES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`street-card street-card--${item.layout} reveal reveal-d${(i % 4) + 1}`}
              style={{ '--breath-delay': `${i * 0.5}s` }}
              onClick={() => setLightbox(item)}
            >
              <img src={item.image} alt={pickLang(item.title, lang)} loading="lazy" />
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

      {lightbox && (
        <div className="street-lightbox" onClick={() => setLightbox(null)} role="presentation">
          <div className="street-lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="street-lightbox-close" onClick={() => setLightbox(null)} aria-label={sc.close}>×</button>
            <img src={lightbox.image} alt={pickLang(lightbox.title, lang)} />
            <div className="street-lightbox-caption">
              <h3>{pickLang(lightbox.title, lang)}</h3>
              <p>{pickLang(lightbox.location, lang)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
