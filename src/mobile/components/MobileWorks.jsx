import { useLang } from '../../context/LangContext';
import { getAlbumTabs, getWorksByAlbum, getAlbumById, pickLang } from '../../data/content';
import { useAlbumImagePreload, usePrefetchAllAlbums } from '../../hooks/useAlbumImagePreload';

export default function MobileWorks({ album, onAlbumChange, onSelect }) {
  const { lang, t } = useLang();
  const w = t('works');
  const col = t('collections');
  const tabs = getAlbumTabs();
  const works = getWorksByAlbum(album);
  const activeAlbum = getAlbumById(album);
  const tabIds = tabs.map((tab) => tab.id);

  useAlbumImagePreload(album);
  usePrefetchAllAlbums(tabIds);

  const prefetchAlbum = (albumId) => {
    getWorksByAlbum(albumId).forEach((item) => {
      if (!item?.image) return;
      const img = new Image();
      img.src = item.image;
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
        {works.map((work) => (
          <button
            key={work.id}
            type="button"
            className="m-work-card"
            onClick={() => onSelect(work)}
          >
            <img
              src={work.image}
              alt={pickLang(work.title, lang)}
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <span className="m-work-title">{pickLang(work.title, lang)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
