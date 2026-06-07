import { useState, useMemo } from 'react';
import { useLang } from '../../context/LangContext';
import { getStreetCases } from '../../data/streetCases';
import { pickLang } from '../../data/content';
import ImageStackLightbox from '../../components/ImageStackLightbox';

export default function MobileStreetCases() {
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
            onClick={() => setLightboxIndex(i)}
          >
            <img src={item.image} alt={pickLang(item.title, lang)} loading="lazy" />
            <span className="m-street-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="m-street-meta">{pickLang(item.title, lang)}</span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageStackLightbox
          items={lightboxItems}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          mobile
        />
      )}
    </section>
  );
}
