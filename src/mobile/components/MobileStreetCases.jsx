import { useState } from 'react';
import { useLang } from '../../context/LangContext';
import { getStreetCases } from '../../data/streetCases';
import { pickLang } from '../../data/content';

export default function MobileStreetCases() {
  const { lang, t } = useLang();
  const sc = t('streetCases');
  const [lightbox, setLightbox] = useState(null);
  const cases = getStreetCases();

  return (
    <section id="street-cases" className="m-section m-street">
      <p className="m-eyebrow">{sc.eyebrow}</p>
      <h2 className="m-section-title">{sc.title}</h2>
      <p className="m-street-desc">{sc.desc}</p>

      <div className="m-street-grid">
        {cases.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className="m-street-card"
            onClick={() => setLightbox(item)}
          >
            <img src={item.image} alt={pickLang(item.title, lang)} loading="lazy" />
            <span className="m-street-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="m-street-meta">{pickLang(item.title, lang)}</span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="m-lightbox" onClick={() => setLightbox(null)} role="presentation">
          <div className="m-lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="m-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label={sc.close}
            >
              ×
            </button>
            <img src={lightbox.image} alt={pickLang(lightbox.title, lang)} />
            <div className="m-lightbox-caption">
              <h3>{pickLang(lightbox.title, lang)}</h3>
              <p>{pickLang(lightbox.location, lang)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
