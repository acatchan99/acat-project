import { useLang } from '../../context/LangContext';
import { getAlbumTabs, getWorksByAlbum, getAlbumById, pickLang } from '../../data/content';
import { getThumbSrc } from '../../lib/imageUrl';
import { useAlbumImagePreload } from '../../hooks/useAlbumImagePreload';
import OptimizedImage from '../../components/OptimizedImage';

export default function MobileWorks({ album, onAlbumChange, onSelect }) {
  const { lang, t } = useLang();
  const w = t('works');
  const col = t('collections');
  const tabs = getAlbumTabs();
  const works = getWorksByAlbum(album);
  const activeAlbum = getAlbumById(album);

  useAlbumImagePreload(album);

  const prefetchAlbum = (albumId) => {
    getWorksByAlbum(albumId).slice(0, 4).forEach((item) => {
      if (!item?.image) return;
      const img = new Image();
      img.src = getThumbSrc(item.image);
    });
  };

  return (
    <section id="works" className="m-section m-works">
      <div className="m-works-head">
        <h2 className="m-section-title">{w.title}</h2>
        <span className="m-badge">{works.length} {col.pieces}</span>
      </div>

      <div className="m-album-scroll" role="tablist" aria-label={w.title}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={album === item.id}
            className={`m-album-tab${album === item.id ? ' m-album-tab--active' : ''}`}
            onClick={() => onAlbumChange(item.id)}
            onTouchStart={() => prefetchAlbum(item.id)}
          >
            {pickLang(getAlbumById(item.id)?.title, lang)}
            <span className="m-album-count">{getWorksByAlbum(item.id).length}</span>
          </button>
        ))}
      </div>

      <p className="m-works-sub">
        {activeAlbum ? pickLang(activeAlbum.subtitle, lang) : w.sub}
      </p>

      <div className="m-works-grid" key={album}>
        {works.map((work, i) => (
          <button
            key={work.id}
            type="button"
            className="m-work-card"
            onClick={() => onSelect(work)}
          >
            <OptimizedImage
              src={work.image}
              alt={pickLang(work.title, lang)}
              variant="thumb"
              loading={i < 4 ? 'eager' : 'lazy'}
              className="m-work-card-img"
              draggable={false}
            />
            <span className="m-work-title">{pickLang(work.title, lang)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
