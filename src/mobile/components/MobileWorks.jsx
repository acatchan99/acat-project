import { useLang } from '../../context/LangContext';
import { ALBUMS, getWorksByAlbum, pickLang } from '../../data/content';

export default function MobileWorks({ album, onAlbumChange, onSelect }) {
  const { lang, t } = useLang();
  const w = t('works');
  const col = t('collections');

  const albumLabels = {
    fag: col.fag,
    digital: col.digital,
    odod: col.odod,
  };

  const works = getWorksByAlbum(album);

  return (
    <section id="works" className="m-section m-works">
      <div className="m-works-head">
        <h2 className="m-section-title">{w.title}</h2>
        <span className="m-badge">{works.length} {col.pieces}</span>
      </div>

      <div className="m-album-scroll" role="tablist" aria-label={w.title}>
        {ALBUMS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={album === item.id}
            className={`m-album-tab${album === item.id ? ' m-album-tab--active' : ''}`}
            onClick={() => onAlbumChange(item.id)}
          >
            {albumLabels[item.id].title}
            <span className="m-album-count">{getWorksByAlbum(item.id).length}</span>
          </button>
        ))}
      </div>

      <p className="m-works-sub">{albumLabels[album]?.subtitle ?? w.sub}</p>

      <div className="m-works-grid" key={album}>
        {works.map((work) => (
          <button
            key={work.id}
            type="button"
            className="m-work-card"
            onClick={() => onSelect(work)}
          >
            <img src={work.image} alt={pickLang(work.title, lang)} loading="lazy" />
            <span className="m-work-title">{pickLang(work.title, lang)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
