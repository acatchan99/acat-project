import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { pickLang } from '../data/content';
import { useNavigate } from '../hooks/useNavigate';

export default function WorkDetail({ work, onClose }) {
  const { lang, t } = useLang();
  const { goTo } = useNavigate();
  const d = t('detail');
  const [size, setSize] = useState(0);

  const title = pickLang(work.title, lang);
  const series = pickLang(work.series, lang);
  const material = pickLang(work.material, lang);
  const sizeLabel = pickLang(work.size, lang);
  const price = pickLang(work.price, lang);
  const description = pickLang(work.description, lang);
  const showSizePicker = work.albumId === 'fag';

  useEffect(() => {
    setSize(0);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [work]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="detail-overlay" onClick={onClose} role="presentation">
      <div className="detail-backdrop" aria-hidden="true" />

      <div
        className="detail-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button type="button" className="detail-close" onClick={onClose} aria-label={d.close}>
          ×
        </button>

        <div className="detail-grid">
          <div className="detail-gallery">
            <div className="detail-main">
              <img src={work.image} alt={title} />
            </div>
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
                      className={`size-btn${size === i ? ' size-btn--active' : ''}`}
                      onClick={() => setSize(i)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <dl className="detail-specs">
              <div><dt>{d.series}</dt><dd>{series}</dd></div>
              <div><dt>{d.artist}</dt><dd>{work.artist}</dd></div>
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
      </div>
    </div>
  );
}
