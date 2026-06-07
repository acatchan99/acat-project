import { useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { ALBUMS, getWorksByAlbum, pickLang } from '../data/content';
import { refreshScrollReveal } from '../hooks/useScrollReveal';

export default function Works({ album, onAlbumChange, onSelect }) {
  const { lang, t } = useLang();
  const w = t('works');
  const col = t('collections');

  const albumLabels = {
    fag: col.fag,
    digital: col.digital,
    odod: col.odod,
  };

  const works = getWorksByAlbum(album);
  const activeLabel = albumLabels[album];

  useEffect(() => {
    const section = document.getElementById('works');
    if (!section) return;
    requestAnimationFrame(() => refreshScrollReveal(section));
  }, [album, works.length]);

  return (
    <section id="works" className="works-section">
      <div className="container">
        <div className="works-head reveal">
          <div className="works-head-text">
            <h2 className="works-title">{w.title}</h2>
            <p className="works-sub">{activeLabel ? activeLabel.subtitle : w.sub}</p>
          </div>
          <span className="works-badge">{works.length} {col.pieces}</span>
        </div>

        <nav className="album-nav reveal" aria-label={w.title}>
          <div className="album-tabs" role="tablist">
            {ALBUMS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={album === item.id}
                className={`album-tab${album === item.id ? ' album-tab--active' : ''}`}
                onClick={() => onAlbumChange(item.id)}
              >
                <span className="album-tab-label">{albumLabels[item.id].title}</span>
                <span className="album-tab-count">{getWorksByAlbum(item.id).length}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="product-grid" key={album}>
          {works.map((work) => (
            <article key={work.id} className="product-card">
              <button type="button" className="product-img-btn" onClick={() => onSelect(work)}>
                <img src={work.image} alt={pickLang(work.title, lang)} loading="lazy" />
              </button>
              <div className="product-info">
                <button type="button" className="product-name" onClick={() => onSelect(work)}>
                  {pickLang(work.title, lang)}
                </button>
                <div className="product-meta">
                  <span>{pickLang(work.price, lang)}</span>
                  <span>{pickLang(work.size, lang)}</span>
                </div>
                <button type="button" className="product-more" onClick={() => onSelect(work)}>
                  {w.moreInfo}
                </button>
                <button type="button" className="btn btn-blue product-buy" onClick={() => onSelect(work)}>
                  {w.view}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
